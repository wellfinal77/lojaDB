import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';


const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { summary } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/products', label: 'Products', icon: '🛍️' },
    { path: '/cart', label: 'Cart', icon: '🛒' },
    { path: '/checkout', label: 'Checkout', icon: '💳' },
    ...(isAuthenticated && user?.role === 'admin' 
      ? [{ path: '/admin', label: 'Admin', icon: '⚙️' }] 
      : []
    )
  ];

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🛒</span>
            <span className="brand-text">ShopHub</span>
          </Link>
        </div>
        
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.path === '/cart' && summary.itemCount > 0 && (
                  <span className="cart-badge">{summary.itemCount}</span>
                )}
              </Link>
            </li>
          ))}
          
          {/* Authentication Links */}
          {isAuthenticated ? (
            <li className="nav-item user-menu">
              <div className="user-dropdown">
                <button 
                  className="user-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="user-avatar">
                    {user?.firstName?.[0] || '👤'}
                  </span>
                  <span className="user-name">
                    {user?.firstName || 'User'}
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown-menu">
                    <div className="user-info">
                      <div className="user-full-name">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="user-email">{user?.email}</div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" className="dropdown-item">
                      <span className="dropdown-icon">👤</span>
                      Profile
                    </Link>
                    <Link to="/orders" className="dropdown-item">
                      <span className="dropdown-icon">📦</span>
                      My Orders
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <span className="dropdown-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link 
                  to="/login" 
                  className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">🔐</span>
                  <span className="nav-label">Login</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/register" 
                  className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">📝</span>
                  <span className="nav-label">Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
        
        <div 
          className={`navbar-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
