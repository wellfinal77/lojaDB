import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, isInCart, getItemQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('features');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    
    setAddingToCart(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      addItem(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
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

  const ReviewCard = ({ review }) => (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.user.charAt(0)}
          </div>
          <div className="reviewer-details">
            <h4 className="reviewer-name">{review.user}</h4>
            <StarRating rating={review.rating} />
          </div>
        </div>
      </div>
      <p className="review-comment">{review.comment}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="not-found">
          <h2>Product not found</h2>
          <Link to="/products" className="back-to-products-btn">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <Link to="/products" className="breadcrumb-link">Products</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{product.title}</span>
      </div>

      {/* Product Main Section */}
      <div className="product-main">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image-container">
            <img 
              src={product.image} 
              alt={product.title} 
              className="main-image"
            />
            <div className="image-zoom-overlay">
              <span className="zoom-icon">🔍</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-header">
            <div className="product-category-badge">{product.category}</div>
            <h1 className="product-title">{product.title}</h1>
            <div className="product-rating">
              <StarRating rating={product.rating} />
              <span className="rating-text">({product.rating}) • Based on {product.reviews?.length || 0} reviews</span>
            </div>
          </div>

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          <div className="product-price-section">
            <div className="price-container">
              <span className="price-symbol">$</span>
              <span className="price-value">{product.price}</span>
            </div>
            <div className="stock-status">
              {product.inStock ? (
                <span className="in-stock">✅ In Stock</span>
              ) : (
                <span className="out-of-stock">❌ Out of Stock</span>
              )}
            </div>
          </div>

          <div className="product-actions">
            <button 
              className={`add-to-cart-btn-main ${!product.inStock ? 'disabled' : ''} ${addingToCart ? 'adding' : ''}`}
              disabled={!product.inStock || addingToCart}
              onClick={handleAddToCart}
            >
              {addingToCart ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Adding to Cart...
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
            
            <button className="buy-now-btn">
              <span className="btn-icon">💳</span>
              Buy Now
            </button>
          </div>

          <div className="product-features-quick">
            <h3>Key Features</h3>
            <ul className="features-list">
              {product.features?.slice(0, 3).map((feature, index) => (
                <li key={index} className="feature-item">
                  <span className="feature-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="product-details-section">
        <div className="details-tabs">
          <button 
            className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            Features
          </button>
          <button 
            className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'features' && (
            <div className="features-content">
              <h3>Product Features</h3>
              <ul className="features-grid">
                {product.features?.map((feature, index) => (
                  <li key={index} className="feature-card">
                    <span className="feature-icon">✨</span>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="specifications-content">
              <h3>Technical Specifications</h3>
              <div className="specs-grid">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-content">
              <h3>Customer Reviews</h3>
              <div className="reviews-summary">
                <div className="rating-summary">
                  <div className="rating-number">{product.rating}</div>
                  <StarRating rating={product.rating} />
                  <span>Based on {product.reviews?.length || 0} reviews</span>
                </div>
              </div>
              <div className="reviews-list">
                {product.reviews?.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
