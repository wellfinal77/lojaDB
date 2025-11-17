const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Sample products data for seeding
const sampleProducts = [
  {
    title: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.8,
    inStock: true,
    stockQuantity: 50,
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Premium leather headband',
      'Quick charge (10 min = 3 hours)',
      'Bluetooth 5.0 connectivity'
    ],
    specifications: {
      'Battery Life': '30 hours',
      'Charging Time': '2 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
      'Frequency Response': '20Hz - 20kHz',
      'Driver Size': '40mm'
    },
    reviews: [
      {
        user: 'Alex Johnson',
        rating: 5,
        comment: 'Amazing sound quality and the noise cancellation is incredible!'
      },
      {
        user: 'Sarah Chen',
        rating: 4,
        comment: 'Great headphones, very comfortable for long listening sessions.'
      }
    ]
  },
  {
    title: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitoring, GPS, and water resistance.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.6,
    inStock: true,
    stockQuantity: 30
  },
  {
    title: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans from sustainable farms. Rich, full-bodied flavor.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    category: 'Food & Beverage',
    rating: 4.9,
    inStock: true,
    stockQuantity: 100
  },
  {
    title: 'Minimalist Backpack',
    description: 'Sleek, lightweight backpack perfect for daily use and travel adventures.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'Accessories',
    rating: 4.7,
    inStock: true,
    stockQuantity: 40
  },
  {
    title: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with 360-degree sound and 12-hour battery life.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.5,
    inStock: true,
    stockQuantity: 60
  },
  {
    title: 'Artisan Ceramic Mug',
    description: 'Handcrafted ceramic mug with unique glazing. Perfect for coffee or tea.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
    category: 'Home & Kitchen',
    rating: 4.8,
    inStock: true,
    stockQuantity: 80
  },
  {
    title: 'Wireless Phone Charger',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.4,
    inStock: true,
    stockQuantity: 70
  },
  {
    title: 'Natural Skincare Set',
    description: 'Complete skincare routine with natural ingredients for healthy, glowing skin.',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    category: 'Beauty',
    rating: 4.9,
    inStock: true,
    stockQuantity: 35
  },
  {
    title: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic chair with lumbar support and adjustable height.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    category: 'Furniture',
    rating: 4.6,
    inStock: true,
    stockQuantity: 20
  },
  {
    title: 'Beach Umbrella',
    description: 'Large beach umbrella with UV protection and wind-resistant design.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
    category: 'Summer Collection',
    rating: 4.7,
    inStock: true,
    stockQuantity: 25
  },
  {
    title: 'Sunglasses',
    description: 'Stylish polarized sunglasses with 100% UV protection and lightweight frame.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
    category: 'Summer Collection',
    rating: 4.8,
    inStock: true,
    stockQuantity: 45
  },
  {
    title: 'Swim Shorts',
    description: 'Quick-dry swim shorts with comfortable fit and multiple pockets.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1506629905607-6e8c3b5f4c3a?w=400&h=400&fit=crop',
    category: 'Summer Collection',
    rating: 4.5,
    inStock: true,
    stockQuantity: 55
  },
  {
    title: 'Classic Denim Jacket',
    description: 'Timeless denim jacket with vintage wash and modern fit.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop',
    category: "Men's Fashion",
    rating: 4.6,
    inStock: true,
    stockQuantity: 40
  },
  {
    title: 'Leather Dress Shoes',
    description: 'Premium leather dress shoes with comfortable sole and elegant design.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    category: "Men's Fashion",
    rating: 4.9,
    inStock: true,
    stockQuantity: 30
  },
  {
    title: 'Cotton Polo Shirt',
    description: 'Premium cotton polo shirt with classic fit and breathable fabric.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: "Men's Fashion",
    rating: 4.4,
    inStock: true,
    stockQuantity: 65
  },
  {
    title: 'Elegant Evening Dress',
    description: 'Sophisticated evening dress with flowing silhouette and premium fabric.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
    category: "Women's Fashion",
    rating: 4.8,
    inStock: true,
    stockQuantity: 15
  },
  {
    title: 'Designer Handbag',
    description: 'Luxury designer handbag with premium leather and spacious compartments.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: "Women's Fashion",
    rating: 4.9,
    inStock: true,
    stockQuantity: 25
  },
  {
    title: 'High Heel Sandals',
    description: 'Elegant high heel sandals with comfortable padding and stylish design.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
    category: "Women's Fashion",
    rating: 4.5,
    inStock: true,
    stockQuantity: 50
  }
];

// GET all products
router.get('/', async (req, res) => {
  try {
    let products = await Product.find({});
    
    // If no products in database, seed with sample data
    if (products.length === 0) {
      await Product.insertMany(sampleProducts);
      products = await Product.find({});
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error while fetching products' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Server error while fetching product' });
  }
});

// POST new product (admin)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Server error while creating product' });
  }
});

// PUT update product (admin)
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Server error while updating product' });
  }
});

// DELETE product (admin)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Server error while deleting product' });
  }
});

module.exports = router;
