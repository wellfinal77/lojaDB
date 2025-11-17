import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [addingToCart, setAddingToCart] = useState(new Set());
  const [searchParams] = useSearchParams();
  
  const { addItem, isInCart, getItemQuantity } = useCart();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const handleAddToCart = async (product) => {
    if (!product.inStock) return;
    
    setAddingToCart(prev => new Set([...prev, product._id]));
    
    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      addItem(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  const StarRating = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return <div className="rating">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Hero Section */}
      <div className="products-hero">
        <div className="hero-content">
          <h1 className="hero-title">Discover Our Products</h1>
          <p className="hero-subtitle">Curated selection of premium products for every need</p>
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="products-filters">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-content">
        <div className="products-header">
          <h2>
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            <span className="product-count">({filteredProducts.length})</span>
          </h2>
        </div>
        
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div className="product-card" key={product._id}>
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="product-image"
                  loading="lazy"
                />
                <div className="product-overlay">
                  <Link to={`/products/${product._id}`} className="view-btn">
                    <span className="view-icon">👁️</span>
                    View Details
                  </Link>
                </div>
                {!product.inStock && <div className="out-of-stock-badge">Out of Stock</div>}
                <div className="product-category-badge">{product.category}</div>
              </div>
              
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-rating">
                  <StarRating rating={product.rating} />
                  <span className="rating-text">({product.rating})</span>
                </div>
                
                <div className="product-footer">
                  <div className="product-price">
                    <span className="price-symbol">$</span>
                    <span className="price-value">{product.price}</span>
                  </div>
                  <button 
                    className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''} ${addingToCart.has(product._id) ? 'adding' : ''}`}
                    disabled={!product.inStock || addingToCart.has(product._id)}
                    onClick={() => handleAddToCart(product)}
                  >
                    {addingToCart.has(product._id) ? (
                      <>
                        <span className="loading-spinner-small"></span>
                        Adding...
                      </>
                    ) : isInCart(product._id) ? (
                      <>
                        <span className="cart-icon">✅</span>
                        In Cart ({getItemQuantity(product._id)})
                      </>
                    ) : product.inStock ? (
                      <>
                        <span className="cart-icon">🛒</span>
                        Add to Cart
                      </>
                    ) : (
                      'Out of Stock'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="no-products">
            <div className="no-products-icon">😔</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
