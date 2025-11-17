import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart = () => {
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const { items, summary, updateQuantity, removeItem } = useCart();

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set([...prev, itemId]));
    
    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItems(prev => new Set([...prev, itemId]));
    
    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      removeItem(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const QuantityControl = ({ item, isUpdating }) => (
    <div className="quantity-control">
      <button
        className="quantity-btn decrease"
        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
        disabled={item.quantity <= 1 || isUpdating}
      >
        −
      </button>
      <span className="quantity-display">{item.quantity}</span>
      <button
        className="quantity-btn increase"
        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
        disabled={item.quantity >= item.maxQuantity || isUpdating}
      >
        +
      </button>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-hero">
          <div className="hero-content">
            <h1 className="hero-title">Your Cart</h1>
            <p className="hero-subtitle">Your shopping cart is empty</p>
          </div>
        </div>
        
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products" className="continue-shopping-btn">
            <span className="btn-icon">🛍️</span>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="cart-page">
      {/* Hero Section */}
      <div className="cart-hero">
        <div className="hero-content">
          <h1 className="hero-title">Your Cart</h1>
          <p className="hero-subtitle">{summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </div>

      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items-section">
          <div className="cart-items-header">
            <h2>Cart Items</h2>
            <Link to="/products" className="continue-shopping-link">
              <span className="link-icon">←</span>
              Continue Shopping
            </Link>
          </div>

          <div className="cart-items">
            {items.map((item, index) => {
              const isUpdating = updatingItems.has(item.id);
              const itemTotal = item.price * item.quantity;
              
              return (
                <div key={item.id} className={`cart-item ${isUpdating ? 'updating' : ''}`}>
                  <div className="item-image-container">
                    <img src={item.image} alt={item.title} className="item-image" />
                    <div className="item-category-badge">{item.category}</div>
                  </div>

                  <div className="item-details">
                    <h3 className="item-title">{item.title}</h3>
                    <p className="item-price-single">${item.price.toFixed(2)} each</p>
                    <div className="item-controls">
                      <QuantityControl item={item} isUpdating={isUpdating} />
                      <button
                        className="remove-item-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isUpdating}
                        title="Remove item"
                      >
                        <span className="remove-icon">🗑️</span>
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    <div className="total-price">
                      <span className="price-symbol">$</span>
                      <span className="price-value">{itemTotal.toFixed(2)}</span>
                    </div>
                    <div className="item-quantity-info">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </div>
                  </div>

                  {index < items.length - 1 && <div className="item-separator"></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary-section">
          <div className="order-summary-card">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-line">
              <span>Subtotal ({summary.itemCount} items)</span>
              <span className="summary-value">${summary.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-line">
              <span>Shipping</span>
              <span className={`summary-value ${summary.shipping === 0 ? 'free' : ''}`}>
                {summary.shipping === 0 ? 'FREE' : `$${summary.shipping.toFixed(2)}`}
              </span>
            </div>
            
            {summary.shipping > 0 && (
              <div className="free-shipping-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${Math.min(100, (summary.subtotal / summary.freeShippingThreshold) * 100)}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  Add ${summary.freeShippingRemaining.toFixed(2)} more for free shipping!
                </p>
              </div>
            )}
            
            <div className="summary-line">
              <span>Tax</span>
              <span className="summary-value">${summary.tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-separator"></div>
            
            <div className="summary-line total">
              <span>Total</span>
              <span className="summary-value total-value">${summary.total.toFixed(2)}</span>
            </div>

            <div className="checkout-actions">
              <Link to="/checkout" className="checkout-btn">
                <span className="btn-icon">💳</span>
                Proceed to Checkout
              </Link>
              <Link to="/products" className="continue-btn">
                Continue Shopping
              </Link>
            </div>

            <div className="security-badges">
              <div className="security-item">
                <span className="security-icon">🔒</span>
                <span>Secure Checkout</span>
              </div>
              <div className="security-item">
                <span className="security-icon">🚚</span>
                <span>Free Returns</span>
              </div>
              <div className="security-item">
                <span className="security-icon">⭐</span>
                <span>Customer Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
