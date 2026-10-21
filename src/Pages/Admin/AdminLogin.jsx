import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoLockClosedOutline,
  IoMailOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoPersonOutline,
  IoCallOutline,
  IoShieldCheckmarkOutline,
  IoStorefrontOutline,
  IoArrowForwardOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';
import { RiLeafLine } from 'react-icons/ri';
import { adminLogin, adminRegister } from '../../Services/Actions/postApis';
import { getCompanySettings } from '../../Services/Actions/getApis';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAdminAuthenticated, adminUser, companySettings } = useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Login form state
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: ''
  });

  // Register form state
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  // Load company settings
  useEffect(() => {
    dispatch(getCompanySettings());
  }, [dispatch]);

  // If already authenticated, redirect to /admin
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginForm.identifier || !loginForm.password) {
      setErrorMsg('Please enter email/mobile and password.');
      return;
    }

    setLoading(true);
    try {
      await dispatch(adminLogin(loginForm));
      navigate('/admin', { replace: true });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regForm.name || !regForm.email || !regForm.password) {
      setErrorMsg('Please fill all required fields.');
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (regForm.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await dispatch(adminRegister(regForm));
      navigate('/admin', { replace: true });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to register admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jsr-admin-auth-page">
      <div className="jsr-admin-auth-container">
        {/* Brand Header */}
        <div className="jsr-admin-auth-brand">
          <div className="jsr-admin-auth-logo">
            {companySettings?.logo ? (
              <img
                src={companySettings.logo}
                alt={companySettings.company_name || 'Logo'}
                className="jsr-admin-auth-logo-img"
              />
            ) : (
              <RiLeafLine size={32} />
            )}
          </div>
          <h1>{companySettings?.company_name || 'JSR Fruit & Vegetable'}</h1>
          <p>{companySettings?.tagline || 'Super Admin Portal • Enterprise Management'}</p>
        </div>

        {/* Auth Card */}
        <div className="jsr-admin-auth-card">
          {/* Tabs */}
          <div className="jsr-admin-auth-tabs">
            <button
              type="button"
              className={`jsr-admin-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
              }}
            >
              <IoShieldCheckmarkOutline size={18} />
              <span>Admin Sign In</span>
            </button>
            <button
              type="button"
              className={`jsr-admin-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
              }}
            >
              <IoPersonOutline size={18} />
              <span>Register Admin</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="jsr-auth-alert error">
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="jsr-admin-auth-form">


              <div className="jsr-form-group">
                <label>Admin Email or Mobile</label>
                <div className="jsr-input-with-icon">
                  <IoMailOutline className="jsr-input-icon" size={18} />
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="example@gmail.com or 1234567890"
                    value={loginForm.identifier}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, identifier: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="jsr-form-group">
                <label>Admin Password</label>
                <div className="jsr-input-with-icon">
                  <IoLockClosedOutline className="jsr-input-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter admin password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="jsr-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="jsr-admin-submit-btn"
              >
                {loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
                <IoArrowForwardOutline size={18} />
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="jsr-admin-auth-form">
              <div className="jsr-form-group">
                <label>Admin Full Name</label>
                <div className="jsr-input-with-icon">
                  <IoPersonOutline className="jsr-input-icon" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bikram Sahu"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="jsr-form-group">
                <label>Official Email</label>
                <div className="jsr-input-with-icon">
                  <IoMailOutline className="jsr-input-icon" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="admin@jsrveges.com"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="jsr-form-group">
                <label>Mobile Number</label>
                <div className="jsr-input-with-icon">
                  <IoCallOutline className="jsr-input-icon" size={18} />
                  <input
                    type="tel"
                    placeholder="9827012345"
                    value={regForm.mobile}
                    onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="jsr-form-row">
                <div className="jsr-form-group">
                  <label>Password</label>
                  <div className="jsr-input-with-icon">
                    <IoLockClosedOutline className="jsr-input-icon" size={18} />
                    <input
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="jsr-form-group">
                  <label>Confirm</label>
                  <div className="jsr-input-with-icon">
                    <IoLockClosedOutline className="jsr-input-icon" size={18} />
                    <input
                      type="password"
                      required
                      placeholder="Re-enter"
                      value={regForm.confirmPassword}
                      onChange={(e) =>
                        setRegForm({ ...regForm, confirmPassword: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="jsr-admin-submit-btn"
              >
                {loading ? 'Creating Account...' : 'Register as Super Admin'}
                <IoArrowForwardOutline size={18} />
              </button>
            </form>
          )}

          {/* Footer Back Link */}
          <div className="jsr-admin-auth-footer">
            <Link to="/" className="jsr-back-to-store">
              <IoStorefrontOutline size={16} />
              <span>Back to Public Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
