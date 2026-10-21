import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoColorPaletteOutline,
  IoBusinessOutline,
  IoMegaphoneOutline,
  IoAddOutline,
  IoTrashOutline,
  IoPencilOutline,
  IoCheckmarkCircle,
  IoSaveOutline,
  IoRefreshOutline,
  IoLinkOutline,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoDocumentTextOutline,
  IoCloudUploadOutline,
  IoImageOutline,
  IoSparklesOutline,
  IoCloseCircleOutline,
  IoImagesOutline
} from 'react-icons/io5';
import { RiLeafLine } from 'react-icons/ri';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import ImageGalleryModal from '../../Components/ImageGalleryModal';
import themeService from '../../Services/Helper/ThemeService';
import { getCompanySettings, getAdvertisements } from '../../Services/Actions/getApis';
import {
  updateCompanySettings,
  uploadCompanyLogo,
  createAdvertisement,
  updateAdvertisement,
  toggleAdvertisement,
  deleteAdvertisement
} from '../../Services/Actions/postApis';

const AdminThemeSettings = () => {
  const dispatch = useDispatch();
  const { companySettings, advertisements } = useSelector((state) => state.admin);

  // Active top-level tab: 'company' | 'advertisements' | 'theme'
  const [activeTab, setActiveTab] = useState('company');

  // -------------------------------------------------------------
  // TAB 1: COMPANY SETTINGS STATE
  // -------------------------------------------------------------
  const [companyForm, setCompanyForm] = useState({
    company_name: '',
    logo: '',
    tagline: '',
    phone: '',
    alternate_phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gst_number: '',
    free_delivery_above: 300,
    announcement_text: '',
    whatsapp: '',
    facebook: '',
    instagram: ''
  });
  const [companySaving, setCompanySaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const logoFileInputRef = useRef(null);

  // Populate companyForm when companySettings loads from Redux/DB
  useEffect(() => {
    if (companySettings) {
      setCompanyForm({
        company_name: companySettings.company_name || 'JSR Fruit & Vegetable Company',
        logo: companySettings.logo || '',
        tagline: companySettings.tagline || '',
        phone: companySettings.phone || '',
        alternate_phone: companySettings.alternate_phone || '',
        email: companySettings.email || '',
        address: companySettings.address || '',
        city: companySettings.city || 'Bemetara',
        state: companySettings.state || 'Chhattisgarh',
        pincode: companySettings.pincode || '491335',
        gst_number: companySettings.gst_number || '',
        free_delivery_above: companySettings.free_delivery_above || 300,
        announcement_text: companySettings.announcement_text || '',
        whatsapp: companySettings.whatsapp || '',
        facebook: companySettings.facebook || '',
        instagram: companySettings.instagram || ''
      });
    }
  }, [companySettings]);

  // Load from database on mount
  useEffect(() => {
    dispatch(getCompanySettings());
    dispatch(getAdvertisements());
    themeService.injectCssVariables();
  }, [dispatch]);

  // Handle local file selection for logo
  const handleLogoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediately create FileReader Data URL preview
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result;
      if (dataUrl) {
        setCompanyForm((prev) => ({ ...prev, logo: dataUrl }));
      }
    };
    reader.readAsDataURL(file);

    // Also attempt backend upload to save in server folder
    try {
      setLogoUploading(true);
      const serverUrl = await dispatch(uploadCompanyLogo(file));
      if (serverUrl) {
        setCompanyForm((prev) => ({ ...prev, logo: serverUrl }));
      }
    } catch (err) {
      console.warn('Backend file upload fallback note:', err);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setCompanySaving(true);
    try {
      await dispatch(updateCompanySettings(companyForm));
    } finally {
      setCompanySaving(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 2: ADVERTISEMENTS STATE & MODALS
  // -------------------------------------------------------------
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isAdGalleryOpen, setIsAdGalleryOpen] = useState(false);
  const [editingAdId, setEditingAdId] = useState(null);
  const adFileInputRef = useRef(null);
  const [adForm, setAdForm] = useState({
    title: '',
    subtitle: '',
    badge: 'Special Offer',
    image: '',
    target_link: '/products',
    position: 'hero',
    status: 1,
    display_order: 1
  });

  const handleAdFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result;
      if (dataUrl) {
        setAdForm((prev) => ({ ...prev, image: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenNewAd = () => {
    setEditingAdId(null);
    setAdForm({
      title: '',
      subtitle: '',
      badge: 'Special Offer',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
      target_link: '/products?category=vegetables',
      position: 'hero',
      status: 1,
      display_order: advertisements.length + 1
    });
    setIsAdModalOpen(true);
  };

  const handleOpenEditAd = (ad) => {
    setEditingAdId(ad.id);
    setAdForm({
      title: ad.title || '',
      subtitle: ad.subtitle || '',
      badge: ad.badge || '',
      image: ad.image || '',
      target_link: ad.target_link || '/products',
      position: ad.position || 'hero',
      status: ad.status !== undefined ? ad.status : 1,
      display_order: ad.display_order || 1
    });
    setIsAdModalOpen(true);
  };

  const handleSaveAd = async (e) => {
    e.preventDefault();
    if (!adForm.title.trim() || !adForm.image.trim()) return;

    if (editingAdId) {
      await dispatch(updateAdvertisement({ id: editingAdId, ...adForm }));
    } else {
      await dispatch(createAdvertisement(adForm));
    }
    setIsAdModalOpen(false);
    dispatch(getAdvertisements());
  };

  const handleToggleAd = async (id) => {
    await dispatch(toggleAdvertisement(id));
    dispatch(getAdvertisements());
  };

  const handleDeleteAd = async (id) => {
    if (window.confirm('Are you sure you want to delete this advertisement banner?')) {
      await dispatch(deleteAdvertisement(id));
      dispatch(getAdvertisements());
    }
  };

  // -------------------------------------------------------------
  // TAB 3: THEME COLOR SETTINGS STATE
  // -------------------------------------------------------------
  const [currentTheme, setCurrentTheme] = useState(themeService.getTheme());
  const [successMsg, setSuccessMsg] = useState('');
  const presets = themeService.getPresets();

  const handleApplyPreset = (key) => {
    const updated = themeService.applyPreset(key);
    if (updated) {
      setCurrentTheme(updated);
      setSuccessMsg(`✓ Theme "${updated.name}" applied successfully across the website!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleColorChange = (key, value) => {
    const updated = themeService.updateColors({ [key]: value });
    setCurrentTheme(updated);
  };

  const handleResetTheme = () => {
    const updated = themeService.resetDefault();
    setCurrentTheme(updated);
    setSuccessMsg('✓ Theme reset to Default Farm Green!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="jsr-admin-theme-page">
      {/* Top Title & Subbar */}
      <div className="jsr-admin-subbar ">
        <div>
          <h3 className="jsr-page-title">Store Settings &amp; Brand Control Panel</h3>
          <p className="jsr-subbar-desc">
            Manage your company profile, dynamic promotional banners, and website theme colors.
          </p>
        </div>

        {activeTab === 'advertisements' && (
          <Button
            variant="primary"
            icon={<IoAddOutline size={20} />}
            onClick={handleOpenNewAd}
          >
            Add New Banner
          </Button>
        )}

        {activeTab === 'theme' && (
          <Button
            variant="outline"
            icon={<IoRefreshOutline size={18} />}
            onClick={handleResetTheme}
          >
            Reset Colors
          </Button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="jsr-admin-auth-tabs jsr-mt-4" style={{ maxWidth: '100%' }}>
        <div className="col-4">
          <button
            type="button"
            className={`jsr-admin-tab-btn ${activeTab === 'company' ? 'active' : ''}`}
            onClick={() => setActiveTab('company')}
          >
            <IoBusinessOutline size={18} />
            <span>Company Settings</span>
          </button>
        </div>
        <div className="col-4">
          <button
            type="button"
            className={`jsr-admin-tab-btn ${activeTab === 'advertisements' ? 'active' : ''}`}
            onClick={() => setActiveTab('advertisements')}
          >
            <IoMegaphoneOutline size={18} />
            <span>Advertisements ({advertisements?.length || 0})</span>
          </button>
        </div>
        <div className="col-4">
          <button
            type="button"
            className={`jsr-admin-tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            <IoColorPaletteOutline size={18} />
            <span>Theme &amp; Colors</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="jsr-theme-alert-success jsr-mt-4">
          {successMsg}
        </div>
      )}

      {/* =========================================================
          TAB 1: DYNAMIC COMPANY SETTINGS FORM
      ========================================================== */}
      {activeTab === 'company' && (
        <div className="jsr-theme-card jsr-mt-6">
          <div className="jsr-card-header-row">
            <div>
              <h4 className="jsr-theme-card-title">
                <IoBusinessOutline size={22} className="jsr-theme-title-icon" />
                Store &amp; Company Profile Settings
              </h4>
              <p className="jsr-theme-card-sub">
                These settings are stored dynamically in your MySQL database and shown across the Header, Footer, and Invoices.
              </p>
            </div>
          </div>

          <form onSubmit={handleCompanySubmit} className="jsr-admin-company-form jsr-mt-4">
            {/* BRAND IDENTITY & LOGO CUSTOMIZATION SECTION */}
            <div className="jsr-brand-identity-box jsr-mb-6">
              <div className="jsr-brand-identity-header">
                <div>
                  <h5 className="jsr-brand-section-title">
                    <IoImageOutline size={18} className="jsr-brand-title-icon" /> Brand Identity &amp; Company Logo
                  </h5>
                  <p className="jsr-brand-section-sub">
                    Add or update your official company name and brand logo. Changes reflect dynamically across the website Header, Footer, Admin Portal, Invoices, and receipts.
                  </p>
                </div>
              </div>

              <div className="jsr-brand-identity-grid jsr-mt-4">
                {/* 1. Live Brand Preview Card */}
                <div className="jsr-brand-preview-card">
                  <div className="jsr-preview-tag-row">
                    <span className="jsr-preview-badge">Live Storefront Header Preview</span>
                  </div>

                  <div className="jsr-brand-preview-display">
                    {companyForm.logo ? (
                      <div className="jsr-brand-logo-frame">
                        <img
                          src={companyForm.logo}
                          alt={companyForm.company_name || 'Brand Logo'}
                          className="jsr-brand-preview-img"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="jsr-brand-logo-fallback">
                        <RiLeafLine size={26} />
                      </div>
                    )}

                    <div className="jsr-brand-preview-text">
                      <strong className="jsr-brand-preview-title">
                        {companyForm.company_name || 'Company Name'}
                      </strong>
                      <span className="jsr-brand-preview-sub">
                        {companyForm.tagline || '100% Farm Fresh Produce Direct to Doorstep'}
                      </span>
                    </div>
                  </div>

                  {companyForm.logo ? (
                    <div className="jsr-brand-preview-actions">
                      <button
                        type="button"
                        className="jsr-btn-remove-logo"
                        onClick={() => {
                          setCompanyForm({ ...companyForm, logo: '' });
                          if (logoFileInputRef.current) logoFileInputRef.current.value = '';
                        }}
                      >
                        <IoTrashOutline size={14} /> Remove Custom Logo (Revert to Leaf Icon)
                      </button>
                    </div>
                  ) : (
                    <p className="jsr-brand-hint-muted">
                      No custom logo uploaded yet. The default fresh leaf icon will be displayed.
                    </p>
                  )}
                </div>

                {/* 2. Controls: Name, File Upload & URL */}
                <div className="jsr-brand-controls-col">
                  <div className="jsr-form-group">
                    <label>Company / Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={companyForm.company_name}
                      onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                      className="jsr-input"
                      placeholder="e.g. JSR Fruit & Vegetable Company"
                    />
                    <small className="jsr-field-hint">Your primary brand title shown to customers and on invoices.</small>
                  </div>

                  <div className="jsr-form-group jsr-mt-3">
                    <label>Store Tagline / Slogan</label>
                    <input
                      type="text"
                      value={companyForm.tagline}
                      onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                      className="jsr-input"
                      placeholder="e.g. 100% Farm Fresh Fruits & Veggies"
                    />
                  </div>

                  <div className="jsr-logo-inputs-container jsr-mt-3">
                    <label className="jsr-logo-section-label">Brand Logo Image (Upload or Web Link)</label>

                    {/* Option A: File Upload */}
                    <div className="jsr-logo-upload-action">
                      <input
                        ref={logoFileInputRef}
                        type="file"
                        id="jsr-logo-file-input"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                        className="jsr-hidden-file-input"
                        onChange={handleLogoFileUpload}
                      />
                      <label htmlFor="jsr-logo-file-input" className="jsr-logo-upload-btn">
                        <IoCloudUploadOutline size={18} />
                        <span>{logoUploading ? 'Uploading Logo...' : 'Upload Logo from Computer (PNG / JPG / SVG)'}</span>
                      </label>
                    </div>

                    {/* Option B: Direct URL Input */}
                    <div className="jsr-form-group jsr-mt-2">
                      <div className="jsr-input-with-icon">
                        <IoLinkOutline className="jsr-field-icon" size={17} />
                        <input
                          type="text"
                          value={companyForm.logo}
                          onChange={(e) => setCompanyForm({ ...companyForm, logo: e.target.value })}
                          className="jsr-input jsr-input-padded"
                          placeholder="Or paste image URL (e.g. https://... or /assets/logo.png)"
                        />
                      </div>
                    </div>

                    {/* Preset sample logos */}
                    <div className="jsr-sample-logos-row jsr-mt-2">
                      <span className="jsr-sample-label">
                        <IoSparklesOutline size={13} /> Quick Presets:
                      </span>
                      <button
                        type="button"
                        className="jsr-sample-preset-btn"
                        onClick={() =>
                          setCompanyForm({
                            ...companyForm,
                            logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'
                          })
                        }
                      >
                        Organic Farm
                      </button>
                      <button
                        type="button"
                        className="jsr-sample-preset-btn"
                        onClick={() =>
                          setCompanyForm({
                            ...companyForm,
                            logo: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=200&q=80'
                          })
                        }
                      >
                        Fresh Harvest
                      </button>
                      <button
                        type="button"
                        className="jsr-sample-preset-btn"
                        onClick={() =>
                          setCompanyForm({
                            ...companyForm,
                            logo: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=200&q=80'
                          })
                        }
                      >
                        Green Sprout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="jsr-form-grid-3 jsr-mt-3">
              <div className="jsr-form-group">
                <label>Primary Phone Number *</label>
                <div className="jsr-input-with-icon">
                  <IoCallOutline className="jsr-field-icon" size={18} />
                  <input
                    type="text"
                    required
                    value={companyForm.phone}
                    onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                    className="jsr-input jsr-input-padded"
                    placeholder="e.g. +91 98270 12345"
                  />
                </div>
              </div>

              <div className="jsr-form-group">
                <label>Alternate Phone</label>
                <div className="jsr-input-with-icon">
                  <IoCallOutline className="jsr-field-icon" size={18} />
                  <input
                    type="text"
                    value={companyForm.alternate_phone}
                    onChange={(e) => setCompanyForm({ ...companyForm, alternate_phone: e.target.value })}
                    className="jsr-input jsr-input-padded"
                    placeholder="e.g. +91 78980 54321"
                  />
                </div>
              </div>

              <div className="jsr-form-group">
                <label>WhatsApp Support Number</label>
                <div className="jsr-input-with-icon">
                  <IoCallOutline className="jsr-field-icon" size={18} />
                  <input
                    type="text"
                    value={companyForm.whatsapp}
                    onChange={(e) => setCompanyForm({ ...companyForm, whatsapp: e.target.value })}
                    className="jsr-input jsr-input-padded"
                    placeholder="e.g. 919827012345"
                  />
                </div>
              </div>
            </div>

            <div className="jsr-form-grid-2 jsr-mt-3">
              <div className="jsr-form-group">
                <label>Official Support Email *</label>
                <div className="jsr-input-with-icon">
                  <IoMailOutline className="jsr-field-icon" size={18} />
                  <input
                    type="email"
                    required
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                    className="jsr-input jsr-input-padded"
                    placeholder="e.g. care@jsrvegetables.com"
                  />
                </div>
              </div>

              <div className="jsr-form-group">
                <label>GST / Business Registration Number</label>
                <div className="jsr-input-with-icon">
                  <IoDocumentTextOutline className="jsr-field-icon" size={18} />
                  <input
                    type="text"
                    value={companyForm.gst_number}
                    onChange={(e) => setCompanyForm({ ...companyForm, gst_number: e.target.value })}
                    className="jsr-input jsr-input-padded"
                    placeholder="e.g. 22AAAAA0000A1Z5"
                  />
                </div>
              </div>
            </div>

            <div className="jsr-form-group jsr-mt-3">
              <label>Store Office / Mandi Address *</label>
              <div className="jsr-input-with-icon">
                <IoLocationOutline className="jsr-field-icon" size={18} />
                <textarea
                  rows={2}
                  required
                  value={companyForm.address}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                  className="jsr-input jsr-input-padded"
                  placeholder="e.g. Main Market Road, Near Krishi Mandi"
                />
              </div>
            </div>

            <div className="jsr-form-grid-3 jsr-mt-3">
              <div className="jsr-form-group">
                <label>City</label>
                <input
                  type="text"
                  value={companyForm.city}
                  onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })}
                  className="jsr-input"
                  placeholder="Bemetara"
                />
              </div>

              <div className="jsr-form-group">
                <label>State</label>
                <input
                  type="text"
                  value={companyForm.state}
                  onChange={(e) => setCompanyForm({ ...companyForm, state: e.target.value })}
                  className="jsr-input"
                  placeholder="Chhattisgarh"
                />
              </div>

              <div className="jsr-form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={companyForm.pincode}
                  onChange={(e) => setCompanyForm({ ...companyForm, pincode: e.target.value })}
                  className="jsr-input"
                  placeholder="491335"
                />
              </div>
            </div>

            <div className="jsr-form-grid-2 jsr-mt-3">
              <div className="jsr-form-group">
                <label>Free Delivery Threshold Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={companyForm.free_delivery_above}
                  onChange={(e) => setCompanyForm({ ...companyForm, free_delivery_above: Number(e.target.value) })}
                  className="jsr-input"
                  placeholder="300"
                />
                <small className="jsr-field-hint">Orders above this amount qualify for ₹0 delivery charge.</small>
              </div>

              <div className="jsr-form-group">
                <label>Announcement Ticker Bar (Top of Website)</label>
                <input
                  type="text"
                  value={companyForm.announcement_text}
                  onChange={(e) => setCompanyForm({ ...companyForm, announcement_text: e.target.value })}
                  className="jsr-input"
                  placeholder="e.g. ⚡ Super Fast Delivery across Bemetara, Raipur & Durg"
                />
                <small className="jsr-field-hint">Shows at the very top of all public pages.</small>
              </div>
            </div>

            <div className="jsr-form-actions jsr-mt-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={<IoSaveOutline size={18} />}
                disabled={companySaving}
              >
                {companySaving ? 'Saving to Database...' : 'Save Company Settings'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================
          TAB 2: DYNAMIC ADVERTISEMENTS & BANNERS CONTROL PANEL
      ========================================================== */}
      {activeTab === 'advertisements' && (
        <div className="jsr-theme-card jsr-mt-6">
          <div className="jsr-card-header-row">
            <div>
              <h4 className="jsr-theme-card-title">
                <IoMegaphoneOutline size={22} className="jsr-theme-title-icon" />
                Active Advertisement &amp; Promo Banners
              </h4>
              <p className="jsr-theme-card-sub">
                Control the hero slideshow, strip banners, and marketing promotions displayed dynamically on the Storefront.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={<IoAddOutline size={18} />}
              onClick={handleOpenNewAd}
            >
              Add New Banner
            </Button>
          </div>

          <div className="jsr-admin-card-table jsr-mt-4">
            <table className="jsr-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Thumbnail</th>
                  <th>Title &amp; Badge</th>
                  <th>Position</th>
                  <th>Target Link</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {advertisements && advertisements.length > 0 ? (
                  advertisements.map((ad) => (
                    <tr key={ad.id}>
                      <td>
                        <img
                          src={ad.image}
                          alt={ad.title}
                          style={{
                            width: '70px',
                            height: '42px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0'
                          }}
                        />
                      </td>
                      <td>
                        <strong>{ad.title}</strong>
                        {ad.badge && (
                          <span className="jsr-badge jsr-badge-primary" style={{ marginLeft: '8px' }}>
                            {ad.badge}
                          </span>
                        )}
                        {ad.subtitle && (
                          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                            {ad.subtitle}
                          </p>
                        )}
                      </td>
                      <td>
                        <span className="jsr-badge jsr-badge-outline" style={{ textTransform: 'uppercase' }}>
                          {ad.position || 'hero'}
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.8rem' }}>{ad.target_link}</code>
                      </td>
                      <td>
                        <strong>{ad.display_order}</strong>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleAd(ad.id)}
                          className={`jsr-toggle-btn ${ad.status === 1 ? 'jsr-toggle-on' : 'jsr-toggle-off'}`}
                          title="Click to toggle status"
                        >
                          {ad.status === 1 ? '● Active' : '○ Inactive'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditAd(ad)}
                            className="jsr-action-btn edit"
                            title="Edit Banner"
                          >
                            <IoPencilOutline size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAd(ad.id)}
                            className="jsr-action-btn delete"
                            title="Delete Banner"
                          >
                            <IoTrashOutline size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No advertisement banners found in database. Click "+ Add New Banner" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: PRESET THEMES & COLOR PICKERS
      ========================================================== */}
      {activeTab === 'theme' && (
        <>
          {/* 1. PRESET THEMES */}
          <div className="jsr-theme-card jsr-mt-6">
            <h4 className="jsr-theme-card-title">
              <IoColorPaletteOutline size={20} className="jsr-theme-title-icon" />
              Choose a Preset Color Theme
            </h4>
            <p className="jsr-theme-card-sub">
              Select one of the pre-curated color schemes designed specifically for fresh produce and grocery stores.
            </p>

            <div className="jsr-presets-grid">
              {Object.entries(presets).map(([key, preset]) => {
                const isSelected = currentTheme.primary?.toLowerCase() === preset.primary?.toLowerCase();
                return (
                  <div
                    key={key}
                    onClick={() => handleApplyPreset(key)}
                    className={`jsr-preset-box ${isSelected ? 'jsr-preset-active' : ''}`}
                  >
                    <div className="jsr-preset-header">
                      <strong className="jsr-preset-name">{preset.name}</strong>
                      {isSelected && (
                        <span className="jsr-preset-badge">
                          <IoCheckmarkCircle size={16} /> Active
                        </span>
                      )}
                    </div>

                    {/* Color Swatches */}
                    <div className="jsr-swatches-row">
                      <span
                        className="jsr-swatch-circle"
                        style={{ backgroundColor: preset.primary }}
                        title={`Primary: ${preset.primary}`}
                      />
                      <span
                        className="jsr-swatch-circle"
                        style={{ backgroundColor: preset.primaryHover }}
                        title={`Primary Hover: ${preset.primaryHover}`}
                      />
                      <span
                        className="jsr-swatch-circle"
                        style={{ backgroundColor: preset.accentDark }}
                        title={`Sidebar Dark: ${preset.accentDark}`}
                      />
                      <span
                        className="jsr-swatch-circle jsr-swatch-border"
                        style={{ backgroundColor: preset.primaryLight }}
                        title={`Light Tint: ${preset.primaryLight}`}
                      />
                    </div>

                    <button
                      type="button"
                      className={`jsr-preset-btn ${isSelected ? 'jsr-preset-btn-active' : ''}`}
                    >
                      {isSelected ? 'Currently Active' : 'Apply Theme'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. FINE-TUNE CUSTOM COLORS & LIVE PREVIEW */}
          <div className="jsr-theme-grid-2 jsr-mt-6">
            {/* Custom Color Inputs */}
            <div className="jsr-theme-card">
              <h4 className="jsr-theme-card-title">Fine-tune Brand Colors</h4>
              <p className="jsr-theme-card-sub">
                Pick custom hex colors using the native color pickers below. Changes take effect instantly.
              </p>

              <div className="jsr-color-picker-list">
                <div className="jsr-color-row">
                  <div className="jsr-color-meta">
                    <strong className="jsr-color-title">Primary Brand Green</strong>
                    <span className="jsr-color-desc">Buttons, Active Tabs, Highlights</span>
                    <code className="jsr-color-code">{currentTheme.primary}</code>
                  </div>
                  <input
                    type="color"
                    value={currentTheme.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="jsr-color-input"
                    title="Choose Primary Color"
                  />
                </div>

                <div className="jsr-color-row">
                  <div className="jsr-color-meta">
                    <strong className="jsr-color-title">Primary Hover / Dark Green</strong>
                    <span className="jsr-color-desc">Announcement Bar, Button Hover</span>
                    <code className="jsr-color-code">{currentTheme.primaryHover}</code>
                  </div>
                  <input
                    type="color"
                    value={currentTheme.primaryHover}
                    onChange={(e) => handleColorChange('primaryHover', e.target.value)}
                    className="jsr-color-input"
                    title="Choose Primary Hover Color"
                  />
                </div>

                <div className="jsr-color-row">
                  <div className="jsr-color-meta">
                    <strong className="jsr-color-title">Admin Sidebar &amp; Footer Dark</strong>
                    <span className="jsr-color-desc">Sidebar background, Footer surface</span>
                    <code className="jsr-color-code">{currentTheme.accentDark}</code>
                  </div>
                  <input
                    type="color"
                    value={currentTheme.accentDark}
                    onChange={(e) => handleColorChange('accentDark', e.target.value)}
                    className="jsr-color-input"
                    title="Choose Sidebar Dark Color"
                  />
                </div>

                <div className="jsr-color-row">
                  <div className="jsr-color-meta">
                    <strong className="jsr-color-title">Discount Badge Color</strong>
                    <span className="jsr-color-desc">Sales badges, percentage discount pills</span>
                    <code className="jsr-color-code">{currentTheme.accentOrange}</code>
                  </div>
                  <input
                    type="color"
                    value={currentTheme.accentOrange}
                    onChange={(e) => handleColorChange('accentOrange', e.target.value)}
                    className="jsr-color-input"
                    title="Choose Discount Badge Color"
                  />
                </div>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="jsr-theme-card jsr-preview-card-wrap">
              <div>
                <h4 className="jsr-theme-card-title">Live Storefront Preview</h4>
                <p className="jsr-theme-card-sub">
                  See how your selected theme colors look in real-time on a product card.
                </p>

                <div className="jsr-live-preview-box">
                  <div className="jsr-product-card jsr-preview-product">
                    <span className="jsr-discount-pill">10% OFF</span>
                    <div className="jsr-product-img-box">
                      <img
                        src="https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=400&q=80"
                        alt="Fresh Oyster Mushroom"
                      />
                    </div>
                    <div className="jsr-product-info">
                      <h4 className="jsr-product-name">Fresh Oyster Mushroom</h4>
                      <div className="jsr-product-pricing">
                        <span className="jsr-product-price">₹60</span>
                        <span className="jsr-product-unit">/ 200 gm</span>
                      </div>
                      <button type="button" className="jsr-add-to-cart-btn">
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="jsr-preview-footer-note">
                <span>✨ Settings are automatically saved in local storage and active across all user views.</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================
          MODAL: ADD / EDIT ADVERTISEMENT BANNER
      ========================================================== */}
      <Modal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        title={editingAdId ? 'Edit Advertisement Banner' : 'Add New Advertisement Banner'}
        size="md"
      >
        <form onSubmit={handleSaveAd} className="jsr-modal-form">
          {/* Live Banner Preview Card */}
          <div className="jsr-ad-live-preview-card">
            {adForm.image ? (
              <img
                src={adForm.image}
                alt={adForm.title || 'Ad Preview'}
                className="jsr-ad-preview-bg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="jsr-ad-preview-fallback">
                <IoImageOutline size={32} />
              </div>
            )}
            <div className="jsr-ad-preview-overlay">
              {adForm.badge && (
                <span className="jsr-ad-preview-badge">{adForm.badge}</span>
              )}
              <strong className="jsr-ad-preview-title">{adForm.title || 'Banner Headline'}</strong>
              <small className="jsr-ad-preview-subtitle">{adForm.subtitle || 'Promotional subtitle text'}</small>
            </div>
          </div>

          <div className="jsr-form-group jsr-mt-2">
            <label>Banner Headline / Title *</label>
            <input
              type="text"
              required
              value={adForm.title}
              onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
              className="jsr-input"
              placeholder="e.g. Fresh Harvest Direct from Farm"
            />
          </div>

          <div className="jsr-form-group jsr-mt-2">
            <label>Subtitle / Caption</label>
            <input
              type="text"
              value={adForm.subtitle}
              onChange={(e) => setAdForm({ ...adForm, subtitle: e.target.value })}
              className="jsr-input"
              placeholder="e.g. Handpicked organic vegetables delivered under 2 hours"
            />
          </div>

          <div className="jsr-form-grid-2 jsr-mt-2">
            <div className="jsr-form-group">
              <label>Highlight Badge Text</label>
              <input
                type="text"
                value={adForm.badge}
                onChange={(e) => setAdForm({ ...adForm, badge: e.target.value })}
                className="jsr-input"
                placeholder="e.g. 100% Organic, Special Offer"
              />
            </div>

            <div className="jsr-form-group">
              <label>Placement Position</label>
              <select
                value={adForm.position}
                onChange={(e) => setAdForm({ ...adForm, position: e.target.value })}
                className="jsr-input"
              >
                <option value="hero">Hero Slideshow (Main Home)</option>
                <option value="strip">Middle Promotional Strip</option>
                <option value="sidebar">Sidebar / Card Widget</option>
                <option value="popup">Promotional Pop-up</option>
              </select>
            </div>
          </div>

          <div className="jsr-form-group jsr-mt-2">
            <label>Banner Image (Gallery / Upload / Link) *</label>
            <div className="jsr-img-action-buttons">
              <button
                type="button"
                className="jsr-btn-gallery-select"
                onClick={() => setIsAdGalleryOpen(true)}
              >
                <IoImagesOutline size={18} />
                <span>Select from Gallery</span>
              </button>

              <input
                ref={adFileInputRef}
                type="file"
                id="jsr-ad-file-input"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="jsr-hidden-file-input"
                onChange={handleAdFileUpload}
              />
              <label htmlFor="jsr-ad-file-input" className="jsr-btn-device-upload">
                <IoCloudUploadOutline size={18} />
                <span>Upload from Device</span>
              </label>
            </div>

            <div className="jsr-input-with-icon jsr-mt-2">
              <IoLinkOutline className="jsr-field-icon" size={18} />
              <input
                type="url"
                required
                value={adForm.image}
                onChange={(e) => setAdForm({ ...adForm, image: e.target.value })}
                className="jsr-input jsr-input-padded"
                placeholder="Or paste image URL https://..."
              />
            </div>
          </div>

          <div className="jsr-form-grid-2 jsr-mt-2">
            <div className="jsr-form-group">
              <label>Target URL / Route</label>
              <input
                type="text"
                value={adForm.target_link}
                onChange={(e) => setAdForm({ ...adForm, target_link: e.target.value })}
                className="jsr-input"
                placeholder="/products?category=vegetables"
              />
            </div>

            <div className="jsr-form-group">
              <label>Display Sort Order</label>
              <input
                type="number"
                min="1"
                value={adForm.display_order}
                onChange={(e) => setAdForm({ ...adForm, display_order: Number(e.target.value) })}
                className="jsr-input"
                placeholder="1"
              />
            </div>
          </div>

          <div className="jsr-modal-btn-row jsr-mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAdModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {editingAdId ? 'Update Banner' : 'Create Banner'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ADVERTISEMENT IMAGE GALLERY SELECTOR */}
      <ImageGalleryModal
        isOpen={isAdGalleryOpen}
        onClose={() => setIsAdGalleryOpen(false)}
        onSelectImage={(url) => setAdForm((prev) => ({ ...prev, image: url }))}
        currentImage={adForm.image}
      />
    </div>
  );
};

export default AdminThemeSettings;
