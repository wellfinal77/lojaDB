import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
    
    // Check for registration success message
    const registrationMessage = location.state?.message;
    if (registrationMessage) {
      setErrors({ success: registrationMessage });
    }
  }, [isAuthenticated, navigate, from, location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        // Show success message
        setErrors({ success: 'Login successful! Redirecting...' });
        
        // Redirect after short delay
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
        
      } else {
        setErrors({ 
          general: result.message || 'Login failed. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Animation */}
      <div className="login-bg-animation"></div>
      
      {/* Login Container */}
      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <div className="logo-circle">
                <span className="logo-text">FS</span>
              </div>
            </div>
            <h1 className="brand-title">Welcome Back</h1>
            <p className="brand-subtitle">
              Sign in to your Fashion Store account and discover amazing products
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">🛍️</span>
                <span>Access your cart</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📦</span>
                <span>Track your orders</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💝</span>
                <span>Exclusive offers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">Sign In</h2>
              <p className="form-subtitle">Enter your credentials to access your account</p>
            </div>

            {errors.general && (
              <div className={`alert ${errors.success ? 'alert-success' : 'alert-error'}`}>
                <span className="alert-icon">{errors.success ? '✅' : '⚠️'}</span>
                <span className="alert-text">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    placeholder="Enter your email address"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-label">Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🚀</span>
                    Sign In
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="divider">
                <span className="divider-text">or</span>
              </div>

              {/* Social Login Buttons */}
              <div className="social-login">
                <button type="button" className="social-btn google-btn" disabled={isLoading}>
                  <span className="social-icon">🔍</span>
                  Continue with Google
                </button>
                <button type="button" className="social-btn facebook-btn" disabled={isLoading}>
                  <span className="social-icon">📘</span>
                  Continue with Facebook
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="signup-link">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="link-text">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  </div>
);
};

export default Login;
