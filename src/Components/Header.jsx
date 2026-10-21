import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  IoSearchOutline,
  IoPersonOutline,
  IoBagOutline,
  IoLocationOutline,
  IoMenuOutline,
  IoCloseOutline
} from 'react-icons/io5';
import { RiLeafLine } from 'react-icons/ri';
import Modal from './Modal';
import Button from './Button';
import locationService from '../Services/Helper/LocationService';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart?.items || []);
  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);

  const currentSavedLoc = locationService.getSavedLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/vegetables?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    const res = locationService.checkPincodeDelivery(pincodeInput);
    setPincodeResult(res);
    if (res.serviceable) {
      locationService.saveLocation({
        city: res.city,
        pincode: res.pincode,
        area: `${res.city} (${res.pincode})`,
        isServiceable: true
      });
    }
  };

  const currentUser = useSelector((state) => state.auth?.user);
  const companySettings = useSelector((state) => state.admin?.companySettings);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="jsr-announcement-bar">
        <div className="jsr-container jsr-announcement-inner">
          <div className="jsr-announcement-left">
            {companySettings?.announcement_text ? (
              <span>{companySettings.announcement_text}</span>
            ) : (
              <>
                <span>Farm Fresh</span>
                <span className="jsr-dot">•</span>
                <span>100% Quality</span>
                <span className="jsr-dot">•</span>
                <span>Hygiene Packed</span>
                <span className="jsr-dot">•</span>
                <span>On Time Delivery</span>
              </>
            )}
          </div>

          <button
            type="button"
            className="jsr-announcement-location-btn"
            onClick={() => setIsPincodeModalOpen(true)}
          >
            <IoLocationOutline size={15} />
            <span>Delivering in {currentSavedLoc.city || companySettings?.city || 'Bemetara'}, Raipur & Nearby Areas</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="jsr-main-header">
        <div className="jsr-container jsr-header-inner">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="jsr-mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <IoCloseOutline size={26} /> : <IoMenuOutline size={26} />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="jsr-logo-link">
            {companySettings?.logo ? (
              <img
                src={companySettings.logo}
                alt={companySettings.company_name || 'Store Logo'}
                className="jsr-header-logo-img"
              />
            ) : (
              <div className="jsr-logo-symbol">
                <RiLeafLine size={24} className="jsr-logo-leaf" />
              </div>
            )}
            <div className="jsr-logo-text-block">
              <span className="jsr-logo-title">
                {companySettings?.company_name ? companySettings.company_name.split(' ')[0] : 'JSR'}
              </span>
              <span className="jsr-logo-subtitle">
                {companySettings?.company_name
                  ? companySettings.company_name.split(' ').slice(1).join(' ').toUpperCase() || 'MARKET'
                  : 'FRUIT & VEGETABLE COMPANY'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="jsr-desktop-nav">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`jsr-nav-item ${isActive ? 'jsr-nav-item-active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Icons */}
          <div className="jsr-header-actions">
            {/* Search Trigger */}
            <button
              type="button"
              className="jsr-action-icon-btn"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Products"
              title="Search"
            >
              <IoSearchOutline size={22} />
            </button>

            {/* Admin Switch Shortcut */}
            <Link
              to="/admin"
              className="jsr-admin-shortcut-btn"
              title="Go to Admin Dashboard"
            >
              Admin Portal
            </Link>

            {/* Account / Login */}
            <Link
              to="/account"
              className="jsr-action-icon-btn jsr-account-action-btn"
              title={currentUser ? `Account: ${currentUser.name}` : 'Login / My Account'}
              aria-label="Account"
            >
              <IoPersonOutline size={22} />
              {currentUser && <span className="jsr-auth-indicator" title="Logged in" />}
            </Link>

            {/* Cart Bag Icon with Count Badge */}
            <Link
              to="/cart"
              className="jsr-action-icon-btn jsr-cart-action-btn"
              title="Cart"
            >
              <IoBagOutline size={22} />
              <span className="jsr-cart-badge">{totalCartCount}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        {isMobileMenuOpen && (
          <div className="jsr-mobile-nav-drawer">
            <div className="jsr-mobile-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="jsr-mobile-nav-item"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="jsr-mobile-nav-divider" />
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="jsr-mobile-nav-item text-green-700 font-bold"
              >
                ⚙️ Admin Dashboard
              </Link>
              <Link
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="jsr-mobile-nav-item"
              >
                👤 {currentUser ? `My Account (${currentUser.name})` : 'Login / Register'}
              </Link>
              <Link
                to="/order-tracking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="jsr-mobile-nav-item"
              >
                📦 Track My Order
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* SEARCH MODAL */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Search Fresh Vegetables, Fruits & Mushrooms"
        size="md"
      >
        <form onSubmit={handleSearchSubmit} className="jsr-search-form">
          <div className="jsr-search-input-group">
            <IoSearchOutline size={20} className="jsr-search-input-icon" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search e.g. Tomato, Mushroom, Potato, Chilli..."
              className="jsr-search-input"
            />
          </div>
          <div className="jsr-search-actions">
            <Button type="submit" variant="primary">
              Search
            </Button>
          </div>
        </form>
      </Modal>

      {/* PINCODE MODAL */}
      <Modal
        isOpen={isPincodeModalOpen}
        onClose={() => {
          setIsPincodeModalOpen(false);
          setPincodeResult(null);
        }}
        title="Check Delivery Availability"
        size="md"
      >
        <form onSubmit={handlePincodeCheck} className="jsr-pincode-form">
          <p className="jsr-pincode-desc">
            We deliver direct farm fresh produce across <strong>Bemetara, Raipur & Nearby Areas</strong>.
          </p>
          <div className="jsr-pincode-input-row">
            <input
              type="text"
              maxLength={6}
              value={pincodeInput}
              onChange={(e) => setPincodeInput(e.target.value)}
              placeholder="Enter 6-digit Pincode e.g. 491335"
              className="jsr-pincode-input"
            />
            <Button type="submit" variant="primary">
              Verify
            </Button>
          </div>

          {pincodeResult && (
            <div
              className={`jsr-pincode-result-box ${
                pincodeResult.serviceable ? 'jsr-pincode-ok' : 'jsr-pincode-fail'
              }`}
            >
              {pincodeResult.message}
            </div>
          )}
        </form>
      </Modal>
    </>
  );
};

export default Header;
