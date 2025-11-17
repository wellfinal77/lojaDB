import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { items, summary, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Customer Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Information
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Additional Security
    billingSameAsShipping: true,
    agreeToTerms: false,
    marketingConsent: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [securityChecks, setSecurityChecks] = useState({
    emailVerified: false,
    phoneVerified: false,
    fraudCheckPassed: false,
    botCheckPassed: false
  });

  // Generate simple CAPTCHA
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaAnswer(num1 + num2);
    setCaptchaValue(`${num1} + ${num2} = ?`);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Customer Information Validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    // Shipping Validation
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    // Payment Validation
    if (!formData.cardNumber.replace(/\s/g, '')) newErrors.cardNumber = 'Card number is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv) newErrors.cvv = 'CVV is required';
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    
    // Security Checks
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';
    
    // CAPTCHA validation
    const userAnswer = parseInt(document.getElementById('captcha-input')?.value || '0');
    if (userAnswer !== captchaAnswer) {
      newErrors.captcha = 'CAPTCHA answer is incorrect';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Format card number
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Handle card number input
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  // Simulate security checks
  const performSecurityChecks = async () => {
    // Simulate email verification
    await new Promise(resolve => setTimeout(resolve, 500));
    setSecurityChecks(prev => ({ ...prev, emailVerified: true }));
    
    // Simulate phone verification
    await new Promise(resolve => setTimeout(resolve, 300));
    setSecurityChecks(prev => ({ ...prev, phoneVerified: true }));
    
    // Simulate fraud detection
    await new Promise(resolve => setTimeout(resolve, 800));
    setSecurityChecks(prev => ({ ...prev, fraudCheckPassed: true }));
    
    // Simulate bot detection
    await new Promise(resolve => setTimeout(resolve, 200));
    setSecurityChecks(prev => ({ ...prev, botCheckPassed: true }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Perform security checks
      await performSecurityChecks();
      
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect (in real app, this would be handled by backend)
      clearCart();
      alert('Order placed successfully! Order confirmation will be sent to your email.');
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to cart if empty
  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-hero">
          <div className="hero-content">
            <h1 className="hero-title">Your Cart is Empty</h1>
            <p className="hero-subtitle">Please add items to your cart before checkout</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Hero Section */}
      <div className="checkout-hero">
        <div className="hero-content">
          <h1 className="hero-title">Secure Checkout</h1>
          <p className="hero-subtitle">Complete your purchase safely and securely</p>
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </div>

      <div className="checkout-container">
        {/* Progress Steps */}
        <div className="checkout-progress">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Information</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Payment</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Review</span>
          </div>
        </div>

        <div className="checkout-main">
          {/* Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div className="form-step">
                  <h2 className="step-title">Customer Information</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? 'error' : ''}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? 'error' : ''}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'error' : ''}
                        placeholder="Enter your email address"
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? 'error' : ''}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Shipping Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? 'error' : ''}
                      placeholder="Enter your street address"
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? 'error' : ''}
                        placeholder="Enter your city"
                      />
                      {errors.city && <span className="error-message">{errors.city}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="state">State *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={errors.state ? 'error' : ''}
                        placeholder="Enter your state"
                      />
                      {errors.state && <span className="error-message">{errors.state}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="zipCode">ZIP Code *</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={errors.zipCode ? 'error' : ''}
                        placeholder="Enter ZIP code"
                      />
                      {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="step-button"
                    onClick={() => setCurrentStep(2)}
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <div className="form-step">
                  <h2 className="step-title">Payment Information</h2>
                  
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number *</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      className={errors.cardNumber ? 'error' : ''}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                    {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date *</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className={errors.expiryDate ? 'error' : ''}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                      {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cvv">CVV *</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className={errors.cvv ? 'error' : ''}
                        placeholder="123"
                        maxLength="4"
                      />
                      {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="cardName">Cardholder Name *</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className={errors.cardName ? 'error' : ''}
                      placeholder="Name as it appears on card"
                    />
                    {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                  </div>

                  {/* Security Verification */}
                  <div className="security-verification">
                    <h3>Security Verification</h3>
                    <div className="captcha-container">
                      <label htmlFor="captcha-input">Please solve: {captchaValue}</label>
                      <input
                        type="number"
                        id="captcha-input"
                        placeholder="Enter answer"
                        className={errors.captcha ? 'error' : ''}
                      />
                      <button type="button" onClick={generateCaptcha} className="refresh-captcha">
                        🔄
                      </button>
                      {errors.captcha && <span className="error-message">{errors.captcha}</span>}
                    </div>
                  </div>

                  <div className="step-buttons">
                    <button 
                      type="button" 
                      className="step-button secondary"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </button>
                    <button 
                      type="button" 
                      className="step-button"
                      onClick={() => setCurrentStep(3)}
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review and Submit */}
              {currentStep === 3 && (
                <div className="form-step">
                  <h2 className="step-title">Review Your Order</h2>
                  
                  {/* Security Checks Status */}
                  <div className="security-checks">
                    <h3>Security Verification Status</h3>
                    <div className="security-status">
                      <div className={`security-item ${securityChecks.emailVerified ? 'passed' : 'pending'}`}>
                        <span className="security-icon">📧</span>
                        <span>Email Verification {securityChecks.emailVerified ? '✓' : '⏳'}</span>
                      </div>
                      <div className={`security-item ${securityChecks.phoneVerified ? 'passed' : 'pending'}`}>
                        <span className="security-icon">📱</span>
                        <span>Phone Verification {securityChecks.phoneVerified ? '✓' : '⏳'}</span>
                      </div>
                      <div className={`security-item ${securityChecks.fraudCheckPassed ? 'passed' : 'pending'}`}>
                        <span className="security-icon">🛡️</span>
                        <span>Fraud Detection {securityChecks.fraudCheckPassed ? '✓' : '⏳'}</span>
                      </div>
                      <div className={`security-item ${securityChecks.botCheckPassed ? 'passed' : 'pending'}`}>
                        <span className="security-icon">🤖</span>
                        <span>Bot Protection {securityChecks.botCheckPassed ? '✓' : '⏳'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="terms-section">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      I agree to the <a href="#" target="_blank">Terms and Conditions</a> and <a href="#" target="_blank">Privacy Policy</a> *
                    </label>
                    {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
                  </div>

                  <div className="step-buttons">
                    <button 
                      type="button" 
                      className="step-button secondary"
                      onClick={() => setCurrentStep(2)}
                    >
                      Back to Payment
                    </button>
                    <button 
                      type="submit" 
                      className="submit-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="loading-spinner"></div>
                          Processing Order...
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">🔒</span>
                          Complete Secure Purchase
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary-card">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="order-items">
                {items.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.title} className="item-image" />
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              
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
              
              <div className="summary-line">
                <span>Tax</span>
                <span className="summary-value">${summary.tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-separator"></div>
              
              <div className="summary-line total">
                <span>Total</span>
                <span className="summary-value total-value">${summary.total.toFixed(2)}</span>
              </div>

              {/* Security Badges */}
              <div className="security-badges">
                <div className="security-badge">
                  <span className="badge-icon">🔒</span>
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="security-badge">
                  <span className="badge-icon">🛡️</span>
                  <span>Fraud Protection</span>
                </div>
                <div className="security-badge">
                  <span className="badge-icon">✅</span>
                  <span>Verified Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
);
};

export default Checkout;
