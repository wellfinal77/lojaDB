import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, token, getAuthHeaders, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/profile' } } });
      return;
    }
    fetchProfile();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (data.success) {
        setProfileData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          email: data.user.email || '',
          phone: data.user.phone || ''
        });
        setAddresses(data.user.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setSaving(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (data.success) {
        updateUser(data.user);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors({ general: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile/change-password', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors({ general: data.message || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (addressData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile/address', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(addressData)
      });

      const data = await response.json();

      if (data.success) {
        setAddresses(data.addresses);
        setSuccessMessage('Address added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        return true;
      } else {
        setErrors({ address: data.message || 'Failed to add address' });
        return false;
      }
    } catch (error) {
      console.error('Error adding address:', error);
      setErrors({ address: 'Network error. Please try again.' });
      return false;
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/profile/address/${addressId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        setAddresses(data.addresses);
        setSuccessMessage('Address deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors({ address: data.message || 'Failed to delete address' });
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setErrors({ address: 'Network error. Please try again.' });
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-text">
              {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
            </span>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="tab-icon">👤</span>
            Profile
          </button>
          <button
            className={`tab-button ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <span className="tab-icon">📍</span>
            Addresses
          </button>
          <button
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <span className="tab-icon">🔒</span>
            Password
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{errors.general}</span>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="tab-content">
            <div className="content-card">
              <h2 className="card-title">Personal Information</h2>
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="form-input"
                    placeholder="Optional"
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="tab-content">
            <div className="content-card">
              <div className="card-header">
                <h2 className="card-title">Shipping Addresses</h2>
                <AddressForm onSave={handleAddAddress} />
              </div>
              <div className="addresses-list">
                {addresses.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">📍</span>
                    <p>No addresses saved yet</p>
                    <p className="empty-subtitle">Add your first address above</p>
                  </div>
                ) : (
                  addresses.map((address, index) => (
                    <AddressCard
                      key={address._id || index}
                      address={address}
                      onDelete={handleDeleteAddress}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="tab-content">
            <div className="content-card">
              <h2 className="card-title">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
                    required
                  />
                  {errors.newPassword && (
                    <span className="error-message">{errors.newPassword}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                    required
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>
                <button type="submit" className="submit-btn" disabled={saving}>
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Address Form Component
const AddressForm = ({ onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const success = await onSave(formData);
    if (success) {
      setFormData({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false
      });
      setIsOpen(false);
    }
    setSaving(false);
  };

  if (!isOpen) {
    return (
      <button type="button" className="add-address-btn" onClick={() => setIsOpen(true)}>
        <span className="btn-icon">➕</span>
        Add Address
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Street</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Zip Code</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
      </div>
      <div className="form-group checkbox-group">
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
          />
          <span className="checkbox-custom"></span>
          <span className="checkbox-label">Set as default address</span>
        </label>
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={() => setIsOpen(false)}>
          Cancel
        </button>
        <button type="submit" className="save-btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
};

// Address Card Component
const AddressCard = ({ address, onDelete }) => {
  return (
    <div className={`address-card ${address.isDefault ? 'default' : ''}`}>
      {address.isDefault && (
        <div className="default-badge">Default</div>
      )}
      <div className="address-content">
        <p className="address-line">{address.street}</p>
        <p className="address-line">
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p className="address-line">{address.country}</p>
      </div>
      <button
        className="delete-address-btn"
        onClick={() => onDelete(address._id)}
        title="Delete address"
      >
        🗑️
      </button>
    </div>
  );
};

export default Profile;

