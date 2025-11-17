const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// GET all orders (admin) or user's orders
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};
    // If not admin, only show user's orders
    if (req.user.role !== 'admin') {
      query.userId = req.userId;
    }
    
    const orders = await Order.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error while fetching orders' });
  }
});

// GET single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'firstName lastName email')
      .populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // If not admin, ensure user can only see their own orders
    if (req.user.role !== 'admin' && order.userId._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Server error while fetching order' });
  }
});

// POST create order
router.post('/', authenticate, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.userId;

    // Get user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Build order items and calculate total
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.productId);
      if (!product) continue;

      const subtotal = product.price * cartItem.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product._id,
        productTitle: product.title,
        productPrice: product.price,
        quantity: cartItem.quantity,
        subtotal: subtotal
      });
    }

    // Add shipping and tax
    const shipping = totalAmount > 100 ? 0 : 9.99;
    const tax = totalAmount * 0.08;
    totalAmount = totalAmount + shipping + tax;

    // Create order
    const order = new Order({
      userId,
      totalAmount,
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || 'credit_card',
      items: orderItems
    });

    await order.save();

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    res.status(201).json({ 
      success: true, 
      order: await Order.findById(order._id).populate('userId', 'firstName lastName email')
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error while creating order' });
  }
});

// PUT update order status (admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    // Only admins can update order status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { status, paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Server error while updating order' });
  }
});

module.exports = router;
