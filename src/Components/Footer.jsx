import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  IoCashOutline,
  IoShieldCheckmarkOutline,
  IoSyncOutline,
  IoHeadsetOutline,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoLogoWhatsapp,
  IoLogoFacebook,
  IoLogoInstagram
} from 'react-icons/io5';
import { RiLeafLine } from 'react-icons/ri';
import Button from './Button';
import validationService from '../Services/Helper/ValidationService';

const Footer = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [subscribedMsg, setSubscribedMsg] = useState('');
  const companySettings = useSelector((state) => state.admin?.companySettings);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (validationService.isValidIndianMobile(mobileNumber)) {
      setSubscribedMsg('✓ Thank you for subscribing to daily farm updates!');
      setMobileNumber('');
    } else {
      setSubscribedMsg('Please enter a valid 10-digit mobile number.');
    }
  };

  const whatsappClean = (companySettings?.whatsapp || '919827012345').replace(/[^0-9]/g, '');

  return (
    <footer className="jsr-footer-wrapper">
      {/* 1. TOP BENEFIT FEATURES STRIP */}
      <div className="jsr-features-bar">
        <div className="jsr-container jsr-features-grid">
          <div className="jsr-feature-col">
            <div className="jsr-feature-icon-box">
              <IoCashOutline size={22} />
            </div>
            <div className="jsr-feature-text">
              <h4>COD Available</h4>
              <p>Cash on Delivery</p>
            </div>
          </div>

          <div className="jsr-feature-col">
            <div className="jsr-feature-icon-box">
              <IoShieldCheckmarkOutline size={22} />
            </div>
            <div className="jsr-feature-text">
              <h4>Secure Payment</h4>
              <p>100% Safe & Secure</p>
            </div>
          </div>

          <div className="jsr-feature-col">
            <div className="jsr-feature-icon-box">
              <IoSyncOutline size={22} />
            </div>
            <div className="jsr-feature-text">
              <h4>Easy Returns</h4>
              <p>Customer Friendly</p>
            </div>
          </div>

          <div className="jsr-feature-col">
            <div className="jsr-feature-icon-box">
              <IoHeadsetOutline size={22} />
            </div>
            <div className="jsr-feature-text">
              <h4>24/7 Support</h4>
              <p>We are here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NEWSLETTER & WHATSAPP BAND */}
      <div className="jsr-newsletter-band">
        <div className="jsr-container jsr-newsletter-inner">
          {/* Newsletter subscription */}
          <div className="jsr-newsletter-box">
            <h4 className="jsr-newsletter-title">Get Daily Offers & Updates</h4>
            <form onSubmit={handleSubscribe} className="jsr-newsletter-form">
              <input
                type="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
                className="jsr-newsletter-input"
              />
              <Button type="submit" variant="primary">
                SUBSCRIBE
              </Button>
            </form>
            {subscribedMsg && <span className="jsr-newsletter-msg">{subscribedMsg}</span>}
          </div>

          {/* WhatsApp Direct Order Callout */}
          <a
            href={`https://wa.me/${whatsappClean}?text=Hi%20${encodeURIComponent(companySettings?.company_name || 'JSR Fresh')}%2C%20I%20want%20to%20order%20fresh%20vegetables`}
            target="_blank"
            rel="noopener noreferrer"
            className="jsr-whatsapp-callout"
          >
            <div className="jsr-wa-icon-box">
              <IoLogoWhatsapp size={28} />
            </div>
            <div className="jsr-wa-text">
              <span className="jsr-wa-sub">Order on WhatsApp</span>
              <span className="jsr-wa-num">{companySettings?.phone || '+91 98270 12345'}</span>
            </div>
          </a>
        </div>
      </div>

      {/* 3. MAIN FOOTER LINKS */}
      <div className="jsr-main-footer">
        <div className="jsr-container jsr-footer-columns">
          {/* Company Bio */}
          <div className="jsr-footer-col jsr-col-brand">
            <div className="jsr-logo-link mb-3">
              {companySettings?.logo ? (
                <img
                  src={companySettings.logo}
                  alt={companySettings.company_name || 'Store Logo'}
                  className="jsr-footer-logo-img"
                />
              ) : (
                <div className="jsr-logo-symbol">
                  <RiLeafLine size={24} className="jsr-logo-leaf" />
                </div>
              )}
              <div className="jsr-logo-text-block">
                <span className="jsr-logo-title text-white">
                  {companySettings?.company_name ? companySettings.company_name.split(' ')[0] : 'JSR'}
                </span>
                <span className="jsr-logo-subtitle text-emerald-200">
                  {companySettings?.company_name
                    ? companySettings.company_name.split(' ').slice(1).join(' ').toUpperCase() || 'MARKET'
                    : 'FRUIT & VEGETABLE COMPANY'}
                </span>
              </div>
            </div>
            <p className="jsr-footer-desc">
              {companySettings?.tagline || 'We provide farm fresh fruits, vegetables and mushrooms with best quality and hygiene directly from farm to home.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="jsr-footer-col">
            <h4 className="jsr-footer-heading">Quick Links</h4>
            <ul className="jsr-footer-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/vegetables">Shop</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/account">My Orders</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="jsr-footer-col">
            <h4 className="jsr-footer-heading">Customer Service</h4>
            <ul className="jsr-footer-list">
              <li><Link to="/about">Shipping Policy</Link></li>
              <li><Link to="/about">Return Policy</Link></li>
              <li><Link to="/about">Privacy Policy</Link></li>
              <li><Link to="/about">Terms & Conditions</Link></li>
              <li><Link to="/about">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="jsr-footer-col">
            <h4 className="jsr-footer-heading">Contact Us</h4>
            <div className="jsr-footer-contact">
              <p><IoCallOutline size={16} /> {companySettings?.phone || '+91 98270 12345'}</p>
              {companySettings?.alternate_phone && (
                <p><IoCallOutline size={16} /> {companySettings.alternate_phone}</p>
              )}
              <p><IoMailOutline size={16} /> {companySettings?.email || 'care@jsrvegetables.com'}</p>
              <p><IoLocationOutline size={16} /> {companySettings?.address || 'Main Market Road, Bemetara, Chhattisgarh'}</p>
            </div>
            <div className="jsr-footer-socials">
              <a href={`https://wa.me/${whatsappClean}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><IoLogoWhatsapp size={18} /></a>
              <a href={companySettings?.facebook || 'https://facebook.com'} target="_blank" rel="noreferrer" aria-label="Facebook"><IoLogoFacebook size={18} /></a>
              <a href={companySettings?.instagram || 'https://instagram.com'} target="_blank" rel="noreferrer" aria-label="Instagram"><IoLogoInstagram size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. COPYRIGHT STRIP */}
      <div className="jsr-copyright-strip">
        <div className="jsr-container jsr-copyright-inner">
          <p>© {new Date().getFullYear()} {companySettings?.company_name || 'JSR Fruit & Vegetable Company'}. All Rights Reserved.</p>
          <p className="jsr-powered-by">Powered with ♥ by JSR</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
