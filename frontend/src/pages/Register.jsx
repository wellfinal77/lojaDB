import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Calculate password strength
    calculatePasswordStrength(formData.password);
  }, [formData.password]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
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
      const result = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || null
      });
      
      if (result.success) {
        // Show success message
        setErrors({ success: 'Registration successful! Redirecting to login...' });
        
        // Redirect to login after short delay
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Registration successful! Please log in.' }
          });
        }, 2000);
        
      } else {
        setErrors({ 
          general: result.message || 'Registration failed. Please try again.',
          ...result.errors?.reduce((acc, error) => {
            acc[error.path] = error.msg;
            return acc;
          }, {})
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        general: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { text: 'Very Weak', color: '#ef4444' };
      case 2:
        return { text: 'Weak', color: '#f97316' };
      case 3:
        return { text: 'Fair', color: '#eab308' };
      case 4:
        return { text: 'Good', color: '#22c55e' };
      case 5:
      case 6:
        return { text: 'Strong', color: '#16a34a' };
      default:
        return { text: '', color: '#6b7280' };
    }
  };

  const passwordStrengthInfo = getPasswordStrengthText();

  return (
    <div className="register-page">
      {/* Background Animation */}
      <div className="register-bg-animation"></div>
      
      {/* Register Container */}
      <div className="register-container">
        {/* Left Side - Branding */}
        <div className="register-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <div className="logo-circle">
                <span className="logo-text">FS</span>
              </div>
            </div>
            <h1 className="brand-title">Join Fashion Store</h1>
            <p className="brand-subtitle">
              Create your account and start your fashion journey with us
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">🎁</span>
                <span>Welcome bonus</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <span>Free shipping</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💎</span>
                <span>Exclusive deals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="register-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Fill in your details to get started</p>
            </div>

            {errors.general && (
              <div className={`alert ${errors.success ? 'alert-success' : 'alert-error'}`}>
                <span className="alert-icon">{errors.success ? '✅' : '⚠️'}</span>
                <span className="alert-text">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              {/* Name Fields */}
              <div className="name-fields">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                    placeholder="Enter your first name"
                    disabled={isLoading}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.lastName ? 'input-error' : ''}`}
                    placeholder="Enter your last name"
                    disabled={isLoading}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
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
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Phone Field */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                />
              </div>

              {/* Password Fields */}
              <div className="password-fields">
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
                      placeholder="Create a password"
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
                  {formData.password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div 
                          className="strength-fill" 
                          style={{ 
                            width: `${(passwordStrength / 6) * 100}%`,
                            backgroundColor: passwordStrengthInfo.color
                          }}
                        ></div>
                      </div>
                      <span 
                        className="strength-text"
                        style={{ color: passwordStrengthInfo.color }}
                      >
                        {passwordStrengthInfo.text}
                      </span>
                    </div>
                  )}
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <div className="input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="form-group">
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-label">
                    I agree to the{' '}
                    <Link to="/terms" className="terms-link">
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="terms-link">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && <span className="error-message">{errors.terms}</span>}
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✨</span>
                    Create Account
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

            {/* Login Link */}
            <div className="login-link">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="link-text">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  </div>
);
};

export default Register;
