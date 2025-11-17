import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token, getAuthHeaders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/orders' } } });
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setError('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      shipped: '🚚',
      delivered: '📦',
      cancelled: '❌'
    };
    return icons[status] || '📋';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Header */}
        <div className="orders-header">
          <div className="header-content">
            <h1 className="orders-title">
              <span className="title-icon">📦</span>
              My Orders
            </h1>
            <p className="orders-subtitle">Track and manage all your orders</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📭</div>
            <h2 className="empty-title">No orders yet</h2>
            <p className="empty-text">Start shopping to see your orders here</p>
            <Link to="/products" className="shop-btn">
              <span className="btn-icon">🛍️</span>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-number">
                      <span className="order-label">Order #</span>
                      <span className="order-value">{order.orderNumber}</span>
                    </div>
                    <div className="order-date">
                      <span className="date-icon">📅</span>
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                    <span className="status-icon">{getStatusIcon(order.status)}</span>
                    <span className="status-text">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </div>
                </div>

                <div className="order-items">
                  <h3 className="items-title">Items ({order.items?.length || 0})</h3>
                  <div className="items-list">
                    {order.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <span className="item-quantity">{item.quantity}x</span>
                          <span className="item-name">{item.productTitle}</span>
                        </div>
                        <span className="item-price">{formatCurrency(item.productPrice)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <button
                    className="view-details-btn"
                    onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                  >
                    {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                    <span className="btn-arrow">{selectedOrder === order._id ? '▲' : '▼'}</span>
                  </button>
                </div>

                {/* Order Details */}
                {selectedOrder === order._id && (
                  <div className="order-details">
                    <div className="details-section">
                      <h4 className="details-title">Shipping Address</h4>
                      {order.shippingAddress ? (
                        <div className="address-info">
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      ) : (
                        <p className="no-address">No shipping address provided</p>
                      )}
                    </div>

                    <div className="details-section">
                      <h4 className="details-title">Payment Information</h4>
                      <div className="payment-info">
                        <p>
                          <span className="info-label">Method:</span>
                          <span className="info-value">{order.paymentMethod || 'Not specified'}</span>
                        </p>
                        <p>
                          <span className="info-label">Status:</span>
                          <span className={`info-value payment-status ${order.paymentStatus}`}>
                            {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'Pending'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="details-section">
                      <h4 className="details-title">Order Summary</h4>
                      <div className="summary-list">
                        {order.items?.map((item, index) => (
                          <div key={index} className="summary-item">
                            <div className="summary-item-info">
                              <span className="summary-quantity">{item.quantity}x</span>
                              <span className="summary-name">{item.productTitle}</span>
                            </div>
                            <div className="summary-item-price">
                              <span className="summary-unit-price">{formatCurrency(item.productPrice)} each</span>
                              <span className="summary-subtotal">{formatCurrency(item.subtotal)}</span>
                            </div>
                          </div>
                        ))}
                        <div className="summary-total">
                          <span className="summary-total-label">Total Amount:</span>
                          <span className="summary-total-value">{formatCurrency(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

