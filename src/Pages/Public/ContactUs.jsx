import React, { useState } from 'react';
import { IoCallOutline, IoMailOutline, IoLocationOutline, IoLogoWhatsapp } from 'react-icons/io5';
import Button from '../../Components/Button';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.phone) {
      setSubmitted(true);
      setForm({ name: '', phone: '', message: '' });
    }
  };

  return (
    <div className="jsr-contact-page">
      <div className="jsr-container jsr-contact-container">
        <div className="jsr-breadcrumb">Home &gt; Contact Us</div>

        <h1 className="jsr-contact-page-title">Get in Touch</h1>
        <p className="jsr-contact-page-subtitle">
          Have queries about wholesale orders, daily subscription baskets, or delivery areas? We are always happy to help.
        </p>

        <div className="jsr-contact-grid">
          {/* Contact Details Card */}
          <div className="jsr-contact-info-card">
            <h3 className="jsr-contact-card-heading">JSR Farm Headquarters</h3>

            <div className="jsr-contact-info-list">
              <div className="jsr-contact-info-item">
                <IoLocationOutline size={22} className="jsr-contact-info-icon" />
                <div>
                  <strong className="jsr-contact-item-title">Farm &amp; Packaging Facility</strong>
                  <p className="jsr-contact-item-text">Main Farm Hub, Bemetara, Chhattisgarh 491335, India</p>
                </div>
              </div>

              <div className="jsr-contact-info-item">
                <IoCallOutline size={22} className="jsr-contact-info-icon" />
                <div>
                  <strong className="jsr-contact-item-title">Phone &amp; Orders</strong>
                  <p className="jsr-contact-item-text">+91 12345 67890 (Mon - Sun, 6 AM - 8 PM)</p>
                </div>
              </div>

              <div className="jsr-contact-info-item">
                <IoMailOutline size={22} className="jsr-contact-info-icon" />
                <div>
                  <strong className="jsr-contact-item-title">Email Inquiries</strong>
                  <p className="jsr-contact-item-text">jsrveges@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="jsr-contact-whatsapp-box">
              <a
                href="https://wa.me/911234567890"
                target="_blank"
                rel="noreferrer"
                className="jsr-contact-whatsapp-btn"
              >
                <IoLogoWhatsapp size={20} />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="jsr-contact-form-card">
            <h3 className="jsr-contact-card-heading">Send Us a Message</h3>
            {submitted ? (
              <div className="jsr-contact-success-box">
                ✓ Thank you! We received your inquiry and our farm representative will contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="jsr-contact-form">
                <div className="jsr-contact-field">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="jsr-input"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="jsr-contact-field">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="jsr-input"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>

                <div className="jsr-contact-field">
                  <label>Message / Order Requirement</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="jsr-input"
                    placeholder="Tell us what fresh vegetables or fruits you need..."
                  />
                </div>

                <Button type="submit" variant="primary" fullWidth size="lg">
                  Submit Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
