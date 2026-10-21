import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoPersonOutline,
  IoLocationOutline,
  IoReceiptOutline,
  IoCompassOutline,
  IoLogOutOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoLogoWhatsapp,
  IoAddOutline,
  IoTrashOutline,
  IoNavigateOutline,
  IoMapOutline,
  IoEyeOutline,
  IoCallOutline,
  IoMailOutline,
  IoShieldCheckmarkOutline,
  IoPencilOutline
} from 'react-icons/io5';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import {
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress,
  requestOtp
} from '../../Services/Actions/postApis';
import { getUserAddresses } from '../../Services/Actions/getApis';
import locationService from '../../Services/Helper/LocationService';
import formatterService from '../../Services/Helper/FormatterService';

const UserAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, addresses, userOrders } = useSelector((state) => state.auth);
  const companySettings = useSelector((state) => state.admin?.companySettings);

  // Load customer addresses dynamically
  useEffect(() => {
    if (user?.id) {
      dispatch(getUserAddresses(user.id));
    }
  }, [user?.id, dispatch]);

  // Active tab inside logged-in account
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses' | 'orders' | 'track'

  // Auth toggle (when logged out)
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Login form state
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: ''
  });

  // Registration form state
  const [regStep, setRegStep] = useState(1); // 1 = info, 2 = otp & password
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    otp: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [regError, setRegError] = useState('');

  // Profile Edit state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  // Sync profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  // Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    title: 'Home',
    recipient_name: user?.name || '',
    phone: user?.phone || '',
    address_line: '',
    landmark: '',
    city: 'Bemetara',
    pincode: '491335'
  });

  // Order Tracking Tab search
  const [trackSearchId, setTrackSearchId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);

  // -------------------------------------------------------------
  // HANDLERS: AUTH
  // -------------------------------------------------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.identifier.trim()) return;
    try {
      await dispatch(loginUser(loginForm));
    } catch (err) {
      // Alert handled by postApis
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone) {
      setRegError('Please provide both your name and 10-digit mobile number.');
      return;
    }
    setRegError('');
    try {
      const res = await dispatch(requestOtp(regForm.phone));
      if (res?.otp) {
        setGeneratedOtp(res.otp);
        setRegStep(2);
      }
    } catch (err) {
      setRegError(err.response?.data?.message || err.message || 'Failed to generate OTP');
    }
  };

  const handleAutoFillOtp = () => {
    setRegForm((prev) => ({ ...prev, otp: generatedOtp }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (generatedOtp && regForm.otp !== generatedOtp) {
      setRegError('Invalid OTP code. Please enter the verification code shown above.');
      return;
    }
    if (!regForm.password || regForm.password.length < 4) {
      setRegError('Password must be at least 4 characters long.');
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      setRegError('Passwords do not match. Please re-enter identical passwords.');
      return;
    }
    setRegError('');
    try {
      await dispatch(registerUser(regForm));
    } catch (err) {
      setRegError(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      dispatch(logoutUser());
      setAuthMode('login');
      setRegStep(1);
    }
  };


  // -------------------------------------------------------------
  // HANDLERS: PROFILE & ADDRESSES
  // -------------------------------------------------------------
  const handleProfileSave = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ id: user?.id, ...profileForm }));
  };

  const handleUseCurrentLocation = async () => {
    const loc = await locationService.requestLocationPermission();
    if (loc.isServiceable || loc.city) {
      setAddressForm((prev) => ({
        ...prev,
        city: loc.city || 'Bemetara',
        pincode: loc.pincode || '491335',
        address_line: `Near ${loc.area || loc.city}, Chhattisgarh`
      }));
    } else {
      setAddressForm((prev) => ({
        ...prev,
        city: 'Bemetara',
        pincode: '491335',
        address_line: 'Main Farm Hub Area, Bemetara'
      }));
    }
  };

  const handleSelectMapLocation = (areaName, pincode) => {
    setAddressForm((prev) => ({
      ...prev,
      city: areaName.includes('Raipur') ? 'Raipur' : 'Bemetara',
      pincode: pincode,
      address_line: `${areaName}, Main Road`
    }));
    setIsMapModalOpen(false);
  };

  const handleOpenNewAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      title: 'Home',
      recipient_name: user?.name || '',
      phone: user?.phone || '',
      address_line: '',
      landmark: '',
      city: 'Bemetara',
      pincode: '491335'
    });
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      title: addr.title || addr.type || 'Home',
      recipient_name: addr.recipient_name || user?.name || '',
      phone: addr.phone || user?.phone || '',
      address_line: addr.address_line || '',
      landmark: addr.landmark || '',
      city: addr.city || 'Bemetara',
      pincode: addr.pincode || '491335'
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.address_line.trim()) return;

    if (editingAddressId) {
      await dispatch(updateUserAddress({
        id: editingAddressId,
        customer_id: user?.id,
        ...addressForm
      }));
    } else {
      await dispatch(addUserAddress({
        ...addressForm,
        customer_id: user?.id
      }));
    }

    setIsAddressModalOpen(false);
    setEditingAddressId(null);
    setAddressForm({
      title: 'Home',
      recipient_name: user?.name || '',
      phone: user?.phone || '',
      address_line: '',
      landmark: '',
      city: 'Bemetara',
      pincode: '491335'
    });
  };

  // -------------------------------------------------------------
  // HANDLERS: ORDER TRACKING
  // -------------------------------------------------------------
  const handleTrackLookup = (e) => {
    e.preventDefault();
    const query = trackSearchId.trim().toUpperCase();
    if (!query) return;

    // Search inside userOrders or generate tracking
    const match = userOrders.find(
      (o) => o.order_id?.toUpperCase() === query || o.order_number?.toUpperCase() === query
    );
    if (match) {
      setTrackedOrder(match);
    } else {
      setTrackedOrder({
        order_id: query.startsWith('#') ? query : `#${query}`,
        order_date: 'Today, 11:30 AM',
        status: 'Out for Delivery',
        total_amount: 580,
        delivery_address: user?.address || 'Ward 4, Main Road, Bemetara, Chhattisgarh',
        items: [
          {
            name: 'Fresh Oyster Mushroom',
            unit: '200 gm',
            quantity: 2,
            price: 60,
            image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=400&q=80'
          }
        ]
      });
    }
  };

  const handleQuickTrackOrder = (order) => {
    setTrackSearchId(order.order_id || order.order_number);
    setTrackedOrder(order);
    setActiveTab('track');
  };

  // =============================================================
  // 1. UNAUTHENTICATED VIEW: LOGIN & REGISTRATION
  // =============================================================
  if (!isAuthenticated || !user) {
    return (
      <div className="jsr-account-page">
        <div className="jsr-container jsr-auth-container">
          <div className="jsr-auth-card">
            {/* Auth Mode Tabs */}
            <div className="jsr-auth-nav-tabs">
              <button
                type="button"
                className={`jsr-auth-tab ${authMode === 'login' ? 'jsr-auth-tab-active' : ''}`}
                onClick={() => {
                  setAuthMode('login');
                  setRegError('');
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`jsr-auth-tab ${authMode === 'register' ? 'jsr-auth-tab-active' : ''}`}
                onClick={() => {
                  setAuthMode('register');
                  setRegStep(1);
                  setRegError('');
                }}
              >
                Register
              </button>
            </div>

            {/* TAB A: LOGIN */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="jsr-auth-form">
                <div className="jsr-auth-header-text">
                  <h2 className="jsr-auth-title">Welcome to {companySettings?.company_name || 'Fresh Market'}</h2>
                  <p className="jsr-auth-sub">
                    Sign in with your registered email or 10-digit mobile number to manage orders &amp; addresses.
                  </p>
                </div>

                <div className="jsr-form-group">
                  <label>Email or Mobile Number *</label>
                  <div className="jsr-input-with-icon">
                    <IoPersonOutline className="jsr-field-icon" size={18} />
                    <input
                      type="text"
                      required
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      placeholder="e.g. 9827112345 or user@example.com"
                      className="jsr-input jsr-input-padded"
                    />
                  </div>
                </div>

                <div className="jsr-form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter your account password"
                    className="jsr-input"
                  />
                </div>

                <Button type="submit" variant="primary" fullWidth size="lg" style={{ marginTop: '1rem' }}>
                  Sign In to Account
                </Button>

                <p className="jsr-auth-switch-note" style={{ marginTop: '1.25rem' }}>
                  New to {companySettings?.company_name ? companySettings.company_name.split(' ')[0] : 'our store'}?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setRegStep(1);
                    }}
                    className="jsr-link-btn"
                  >
                    Create an account
                  </button>
                </p>
              </form>
            )}

            {/* TAB B: REGISTRATION */}
            {authMode === 'register' && (
              <div className="jsr-auth-form">
                <div className="jsr-auth-header-text">
                  <h2 className="jsr-auth-title">
                    Create {companySettings?.company_name ? companySettings.company_name.split(' ')[0] : ''} Member Account
                  </h2>
                  <p className="jsr-auth-sub">
                    Enjoy farm-fresh vegetable deliveries, custom addresses &amp; instant tracking.
                  </p>
                </div>

                {regError && (
                  <div className="jsr-auth-error-box">
                    ⚠️ {regError}
                  </div>
                )}

                {regStep === 1 && (
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <div className="jsr-form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        required
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        placeholder="e.g. Ravi Verma"
                        className="jsr-input"
                      />
                    </div>

                    <div className="jsr-form-group">
                      <label>10-Digit Mobile Number *</label>
                      <div className="jsr-input-with-icon">
                        <IoCallOutline className="jsr-field-icon" size={18} />
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={regForm.phone}
                          onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                          placeholder="e.g. 9827112345"
                          className="jsr-input jsr-input-padded"
                        />
                      </div>
                    </div>

                    <div className="jsr-form-group">
                      <label>Email Address</label>
                      <div className="jsr-input-with-icon">
                        <IoMailOutline className="jsr-field-icon" size={18} />
                        <input
                          type="email"
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                          placeholder="e.g. ravi@example.com"
                          className="jsr-input jsr-input-padded"
                        />
                      </div>
                    </div>

                    <Button type="submit" variant="primary" fullWidth size="lg" style={{ marginTop: '1rem' }}>
                      Generate Verification OTP &rarr;
                    </Button>
                  </form>
                )}

                {regStep === 2 && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    {/* Simulated On-Screen OTP Box as Requested */}
                    <div className="jsr-otp-preview-banner">
                      <div className="jsr-otp-banner-left">
                        <span className="jsr-otp-badge-tag">TEST SIMULATED OTP</span>
                        <strong className="jsr-otp-code-text">{generatedOtp}</strong>
                        <span className="jsr-otp-hint">Code generated for {regForm.phone}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoFillOtp}
                        className="jsr-otp-autofill-btn"
                      >
                        Auto-Fill OTP
                      </button>
                    </div>

                    <div className="jsr-form-group">
                      <label>Enter 4-Digit Verification Code *</label>
                      <input
                        type="text"
                        maxLength={4}
                        required
                        value={regForm.otp}
                        onChange={(e) => setRegForm({ ...regForm, otp: e.target.value })}
                        placeholder="Enter 4-digit code"
                        className="jsr-input jsr-otp-input"
                      />
                    </div>

                    <div className="jsr-form-group">
                      <label>Set Account Password *</label>
                      <input
                        type="password"
                        required
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="Choose a password"
                        className="jsr-input"
                      />
                    </div>

                    <div className="jsr-form-group">
                      <label>Re-enter Password *</label>
                      <input
                        type="password"
                        required
                        value={regForm.confirmPassword}
                        onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                        placeholder="Confirm password"
                        className="jsr-input"
                      />
                    </div>

                    <div className="jsr-form-group">
                      <label>Delivery Address (Optional)</label>
                      <textarea
                        rows={2}
                        value={regForm.address}
                        onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                        placeholder="House no, Street, Ward, Bemetara / Raipur"
                        className="jsr-input"
                      />
                    </div>

                    <Button type="submit" variant="primary" fullWidth size="lg">
                      Complete Registration &amp; Sign In
                    </Button>

                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="jsr-back-link-btn"
                    >
                      &larr; Change mobile number
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =============================================================
  // 2. AUTHENTICATED VIEW: FULL USER DASHBOARD
  // =============================================================
  return (
    <div className="jsr-account-page">
      <div className="jsr-container">
        {/* Top User Header Banner */}
        <div className="jsr-user-hero-card">
          <div className="jsr-user-hero-left">
            <div className="jsr-user-avatar">
              <img src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} alt={user.name} />
            </div>
            <div className="jsr-user-meta">
              <h1 className="jsr-user-name">{user.name}</h1>
              <div className="jsr-user-contacts">
                <span><IoCallOutline /> {user.phone}</span>
                <span>•</span>
                <span><IoMailOutline /> {user.email}</span>
              </div>
              <span className="jsr-member-tag">
                <IoShieldCheckmarkOutline /> Verified Farm Member
              </span>
            </div>
          </div>

          <div className="jsr-user-hero-right">
            <button
              type="button"
              onClick={handleLogout}
              className="jsr-btn-logout-pill"
            >
              <IoLogOutOutline size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="jsr-user-nav-bar">
          <button
            type="button"
            className={`jsr-user-nav-tab ${activeTab === 'profile' ? 'jsr-user-nav-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <IoPersonOutline size={18} />
            <span>Profile Details</span>
          </button>

          <button
            type="button"
            className={`jsr-user-nav-tab ${activeTab === 'addresses' ? 'jsr-user-nav-active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <IoLocationOutline size={18} />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            type="button"
            className={`jsr-user-nav-tab ${activeTab === 'orders' ? 'jsr-user-nav-active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <IoReceiptOutline size={18} />
            <span>My Orders ({userOrders.length})</span>
          </button>

          <button
            type="button"
            className={`jsr-user-nav-tab ${activeTab === 'track' ? 'jsr-user-nav-active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <IoCompassOutline size={18} />
            <span>Track Order</span>
          </button>
        </div>

        {/* =========================================================
            TAB 1: PROFILE DETAILS
        ========================================================== */}
        {activeTab === 'profile' && (
          <div className="jsr-dashboard-card">
            <div className="jsr-card-header-bar">
              <h3 className="jsr-card-title">Personal Profile</h3>
              <span className="jsr-card-subtitle">Manage your contact information and default shipping location</span>
            </div>

            <form onSubmit={handleProfileSave} className="jsr-profile-form">
              <div className="jsr-form-grid-2">
                <div className="jsr-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="jsr-input"
                  />
                </div>

                <div className="jsr-form-group">
                  <label>Mobile Number (Primary)</label>
                  <input
                    type="tel"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="jsr-input"
                  />
                </div>

                <div className="jsr-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="jsr-input"
                  />
                </div>

                <div className="jsr-form-group">
                  <label>City / Hub</label>
                  <input
                    type="text"
                    disabled
                    value="Bemetara, Chhattisgarh (491335)"
                    className="jsr-input jsr-input-disabled"
                  />
                </div>
              </div>

              <div className="jsr-form-group">
                <label>Default Home Delivery Address</label>
                <textarea
                  rows={3}
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="jsr-input"
                />
              </div>

              <div className="jsr-profile-actions">
                <Button type="submit" variant="primary">
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================
            TAB 2: SAVED ADDRESSES
        ========================================================== */}
        {activeTab === 'addresses' && (
          <div className="jsr-dashboard-card">
            <div className="jsr-card-header-bar">
              <div>
                <h3 className="jsr-card-title">Address Book</h3>
                <span className="jsr-card-subtitle">Add and manage locations for doorstep vegetable deliveries</span>
              </div>

              <Button
                variant="primary"
                icon={<IoAddOutline size={20} />}
                onClick={handleOpenNewAddressModal}
              >
                Add New Address
              </Button>
            </div>

            <div className="jsr-address-cards-grid">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`jsr-address-card ${addr.is_default ? 'jsr-address-card-default' : ''}`}
                >
                  <div className="jsr-address-card-top">
                    <div className="jsr-address-badge-row">
                      <span className="jsr-address-tag">{addr.title || addr.type || 'Home'}</span>
                      {addr.is_default && (
                        <span className="jsr-default-pill">
                          <IoCheckmarkCircle size={14} /> Default Delivery
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleEditAddress(addr)}
                        className="jsr-address-edit-btn"
                        title="Edit Address"
                        style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#065f46',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.82rem',
                          fontWeight: 600
                        }}
                      >
                        <IoPencilOutline size={15} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch(deleteUserAddress(addr.id, user?.id))}
                        className="jsr-address-del-btn"
                        title="Delete Address"
                      >
                        <IoTrashOutline size={18} />
                      </button>
                    </div>
                  </div>

                  <strong className="jsr-address-recipient">{addr.recipient_name || user.name}</strong>
                  <p className="jsr-address-text">{addr.address_line}</p>
                  {addr.landmark && (
                    <small className="jsr-address-landmark">Landmark: {addr.landmark}</small>
                  )}
                  <span className="jsr-address-city">
                    {addr.city}, Chhattisgarh - {addr.pincode}
                  </span>
                  <div className="jsr-address-phone">📞 {addr.phone || user.phone}</div>

                  {!addr.is_default && (
                    <button
                      type="button"
                      onClick={() => dispatch(setDefaultAddress(addr.id, user?.id))}
                      className="jsr-set-default-btn"
                    >
                      Set as Default Address
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: MY ORDERS
        ========================================================== */}
        {activeTab === 'orders' && (
          <div className="jsr-dashboard-card">
            <div className="jsr-card-header-bar">
              <h3 className="jsr-card-title">Order History</h3>
              <span className="jsr-card-subtitle">Track current dispatches and review previous farm harvests</span>
            </div>

            <div className="jsr-user-orders-list">
              {userOrders.map((ord) => {
                const badge = formatterService.getOrderStatusBadge(ord.status);
                return (
                  <div key={ord.order_id} className="jsr-user-order-card">
                    <div className="jsr-user-order-top">
                      <div>
                        <span className="jsr-order-id-highlight">{ord.order_id}</span>
                        <span className="jsr-order-date">{ord.order_date}</span>
                      </div>

                      <div className="jsr-order-right-meta">
                        <span
                          className="jsr-status-tag"
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.text,
                            border: `1px solid ${badge.border}`
                          }}
                        >
                          {ord.status}
                        </span>
                        <strong className="jsr-order-total-price">₹{ord.total_amount}</strong>
                      </div>
                    </div>

                    {/* Items row */}
                    <div className="jsr-order-items-preview">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="jsr-order-item-chip">
                          <img src={item.image} alt={item.name} />
                          <div>
                            <strong>{item.name}</strong>
                            <small>{item.quantity} × ₹{item.price}</small>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer actions */}
                    <div className="jsr-order-card-footer">
                      <span className="jsr-order-deliv-loc">📍 {ord.delivery_address}</span>
                      <button
                        type="button"
                        onClick={() => handleQuickTrackOrder(ord)}
                        className="jsr-track-action-btn"
                      >
                        <IoCompassOutline size={18} />
                        <span>Track Live Status &rarr;</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: ORDER TRACKING
        ========================================================== */}
        {activeTab === 'track' && (
          <div className="jsr-dashboard-card">
            <div className="jsr-card-header-bar">
              <h3 className="jsr-card-title">Live Delivery Tracker</h3>
              <span className="jsr-card-subtitle">
                Enter your 7-character Order Number found in your confirmation receipt or under "My Orders" tab.
              </span>
            </div>

            {/* Order lookup bar */}
            <form onSubmit={handleTrackLookup} className="jsr-track-search-bar">
              <input
                type="text"
                value={trackSearchId}
                onChange={(e) => setTrackSearchId(e.target.value)}
                placeholder="Enter Order Number (e.g. #ORD1256)"
                className="jsr-input jsr-track-input"
              />
              <Button type="submit" variant="primary">
                Track Order
              </Button>
            </form>

            {!trackedOrder ? (
              <div className="jsr-track-guidance-card">
                <div className="jsr-track-guidance-icon">🚚</div>
                <h4>Looking for your fresh veggies?</h4>
                <p>
                  Please enter your Order ID (such as <strong>#ORD1256</strong>) above or click "Track Live Status" from any order in your order history to view dispatch timeline, delivery partner details, and expected arrival time.
                </p>
              </div>
            ) : (
              <div className="jsr-live-tracking-panel">
                <div className="jsr-track-status-summary">
                  <div>
                    <span className="jsr-track-heading">
                      Tracking Order: <strong>{trackedOrder.order_id}</strong>
                    </span>
                    <p className="jsr-track-sub">Placed on {trackedOrder.order_date}</p>
                  </div>
                  <span className="jsr-status-tag jsr-status-processing">
                    {trackedOrder.status || 'Out for Delivery'}
                  </span>
                </div>

                {/* 5-Step Stepper Timeline */}
                <div className="jsr-stepper-wrap">
                  <div className="jsr-stepper-step jsr-step-completed">
                    <div className="jsr-step-icon"><IoCheckmarkCircle size={22} /></div>
                    <div className="jsr-step-content">
                      <strong>Order Placed</strong>
                      <small>Received by JSR farm</small>
                    </div>
                  </div>

                  <div className="jsr-stepper-step jsr-step-completed">
                    <div className="jsr-step-icon"><IoCheckmarkCircle size={22} /></div>
                    <div className="jsr-step-content">
                      <strong>Confirmed</strong>
                      <small>Fresh produce reserved</small>
                    </div>
                  </div>

                  <div className="jsr-stepper-step jsr-step-completed">
                    <div className="jsr-step-icon"><IoCheckmarkCircle size={22} /></div>
                    <div className="jsr-step-content">
                      <strong>Packed in UV Cleanroom</strong>
                      <small>Hygienic eco-packaging</small>
                    </div>
                  </div>

                  <div className={`jsr-stepper-step ${trackedOrder.status !== 'Delivered' ? 'jsr-step-active' : 'jsr-step-completed'}`}>
                    <div className="jsr-step-icon"><IoTimeOutline size={22} /></div>
                    <div className="jsr-step-content">
                      <strong>Out for Delivery</strong>
                      <small>Van dispatched in Bemetara hub</small>
                    </div>
                  </div>

                  <div className={`jsr-stepper-step ${trackedOrder.status === 'Delivered' ? 'jsr-step-completed' : 'jsr-step-pending'}`}>
                    <div className="jsr-step-icon">🏁</div>
                    <div className="jsr-step-content">
                      <strong>Delivered</strong>
                      <small>Doorstep handoff</small>
                    </div>
                  </div>
                </div>

                <div className="jsr-tracking-help-strip">
                  <span>Questions about your order?</span>
                  <a
                    href="https://wa.me/911234567890"
                    target="_blank"
                    rel="noreferrer"
                    className="jsr-track-whatsapp-cta"
                  >
                    <IoLogoWhatsapp size={18} />
                    <span>Chat with Delivery Team</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================
          ADD ADDRESS MODAL WITH CURRENT LOCATION & MAP PICKER
      ========================================================== */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddressId(null);
        }}
        title={editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
        size="lg"
      >
        <form onSubmit={handleSaveAddress} className="jsr-address-modal-form">
          <div className="jsr-location-shortcuts-row">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="jsr-shortcut-loc-btn"
            >
              <IoNavigateOutline size={18} />
              <span>Use Current Location</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMapModalOpen(true)}
              className="jsr-shortcut-map-btn"
            >
              <IoMapOutline size={18} />
              <span>Select on Map</span>
            </button>
          </div>

          <div className="jsr-form-grid-2">
            <div className="jsr-form-group">
              <label>Address Label</label>
              <select
                value={addressForm.title}
                onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                className="jsr-input"
              >
                <option value="Home">Home</option>
                <option value="Office">Office / Work</option>
                <option value="Farm">Farm Hub</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="jsr-form-group">
              <label>Recipient Name *</label>
              <input
                type="text"
                required
                value={addressForm.recipient_name}
                onChange={(e) => setAddressForm({ ...addressForm, recipient_name: e.target.value })}
                className="jsr-input"
              />
            </div>

            <div className="jsr-form-group">
              <label>Mobile Number *</label>
              <input
                type="tel"
                maxLength={10}
                required
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                className="jsr-input"
              />
            </div>

            <div className="jsr-form-group">
              <label>City &amp; Area</label>
              <input
                type="text"
                required
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                className="jsr-input"
              />
            </div>
          </div>

          <div className="jsr-form-group">
            <label>Street / Flat / House Number (Manual Textarea) *</label>
            <textarea
              rows={3}
              required
              value={addressForm.address_line}
              onChange={(e) => setAddressForm({ ...addressForm, address_line: e.target.value })}
              placeholder="e.g. Flat 302, Green Villa, Ward 4, Main Road"
              className="jsr-input"
            />
          </div>

          <div className="jsr-form-grid-2">
            <div className="jsr-form-group">
              <label>Nearby Landmark</label>
              <input
                type="text"
                value={addressForm.landmark}
                onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                placeholder="e.g. Opposite State Bank of India"
                className="jsr-input"
              />
            </div>

            <div className="jsr-form-group">
              <label>Pincode *</label>
              <input
                type="text"
                maxLength={6}
                required
                value={addressForm.pincode}
                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                placeholder="491335"
                className="jsr-input"
              />
            </div>
          </div>

          <div className="jsr-modal-btn-row">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddressModalOpen(false);
                setEditingAddressId(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingAddressId ? 'Update Address' : 'Save Address'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* =========================================================
          INTERACTIVE MAP SELECTOR MODAL
      ========================================================== */}
      <Modal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        title="Select Delivery Area on Map"
        size="md"
      >
        <div className="jsr-map-picker-container">
          <div className="jsr-map-mock-canvas">
            {/* Map visual representation */}
            <div className="jsr-map-grid-pattern"></div>
            <div className="jsr-map-pin-indicator">
              <div className="jsr-map-pin-pulse"></div>
              <div className="jsr-map-pin-head">📍</div>
            </div>
            <div className="jsr-map-location-tag">
              <span>Bemetara Central Hub (21.70° N, 81.54° E)</span>
            </div>
          </div>

          <div className="jsr-map-regions-list">
            <strong className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Quick Select Chhattisgarh Zone:
            </strong>
            <div className="jsr-map-region-buttons">
              <button
                type="button"
                onClick={() => handleSelectMapLocation('Bemetara Central, Ward 4', '491335')}
                className="jsr-region-chip"
              >
                📍 Bemetara City Center (491335)
              </button>
              <button
                type="button"
                onClick={() => handleSelectMapLocation('Raipur Civil Lines', '492001')}
                className="jsr-region-chip"
              >
                📍 Raipur Civil Lines (492001)
              </button>
              <button
                type="button"
                onClick={() => handleSelectMapLocation('Shankar Nagar, Raipur', '492007')}
                className="jsr-region-chip"
              >
                📍 Raipur Shankar Nagar (492007)
              </button>
              <button
                type="button"
                onClick={() => handleSelectMapLocation('Durg / Bhilai Region', '490006')}
                className="jsr-region-chip"
              >
                📍 Durg / Bhilai Hub (490006)
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserAccount;
