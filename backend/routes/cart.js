const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Helper function to get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
    await cart.save();
  }
  return cart;
};

// GET user cart
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await getOrCreateCart(userId);
    
    // Populate product details
    const cartItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) return null;
        
        return {
          id: item._id,
          productId: product._id,
          title: product.title,
          price: product.price,
          quantity: item.quantity,
          image: product.image,
          category: product.category,
          inStock: product.inStock,
          maxQuantity: product.stockQuantity || 10
        };
      })
    );

    // Filter out null items (products that no longer exist)
    const validItems = cartItems.filter(item => item !== null);
    
    // Calculate totals
    const subtotal = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    res.json({
      items: validItems,
      summary: {
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0),
        freeShippingThreshold: 100,
        freeShippingRemaining: Math.max(0, 100 - subtotal)
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Server error while fetching cart' });
  }
});

// POST add to cart
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.userId;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const cart = await getOrCreateCart(userId);
    
    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Server error while adding to cart' });
  }
});

// PUT update cart item
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = req.params.id;
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity <= 0) {
      item.remove();
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Server error while updating cart item' });
  }
});

// DELETE remove cart item
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.id(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    item.remove();
    await cart.save();
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ error: 'Server error while removing cart item' });
  }
});

module.exports = router;
