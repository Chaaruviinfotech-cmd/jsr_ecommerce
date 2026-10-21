import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoLogoWhatsapp,
  IoCheckmarkCircleOutline,
  IoShieldCheckmarkOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoCartOutline,
  IoArrowForward,
  IoStar,
  IoAdd
} from 'react-icons/io5';
import { RiLeafLine, RiTruckLine, RiHeartPulseLine } from 'react-icons/ri';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import { addToCart } from '../../Services/Actions/postApis';
import { getProducts, getCategories, getCompanySettings, getAdvertisements } from '../../Services/Actions/getApis';
import locationService from '../../Services/Helper/LocationService';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, categories, isLoading } = useSelector((state) => state.product);
  const { companySettings, advertisements } = useSelector((state) => state.admin);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
    dispatch(getCompanySettings());
    dispatch(getAdvertisements());
  }, [dispatch]);

  const heroAds = advertisements?.filter((a) => a.status === 1 && a.position === 'hero') || [];
  const activeHero = heroAds[0];
  const stripAds = advertisements?.filter((a) => a.status === 1 && a.position === 'strip') || [];
  const whatsappClean = (companySettings?.whatsapp || '919827012345').replace(/[^0-9]/g, '');

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart(product, 1, product.unit));
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    const result = locationService.checkPincodeDelivery(pincodeInput);
    setPincodeStatus(result);
  };

  // Filter & sort products for display
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return (
      p.category_slug === selectedCategory ||
      String(p.category_id) === String(selectedCategory) ||
      (selectedCategory === 'vegetables' && (p.category_id === 1 || p.category_slug === 'vegetables')) ||
      (selectedCategory === 'fruits' && (p.category_id === 2 || p.category_slug === 'fruits')) ||
      (selectedCategory === 'mushroom' && (p.category_id === 3 || p.category_slug === 'mushroom')) ||
      (selectedCategory === 'farm-fresh' && (p.category_id === 4 || p.category_slug === 'farm-fresh'))
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="jsr-home-page">
      {/* -------------------------------------------------------------
          1. DESKTOP HERO BANNER (Dynamic from Database)
      -------------------------------------------------------------- */}
      <section className="jsr-hero-section">
        <div className="jsr-container jsr-hero-inner">
          <div className="jsr-hero-content">
            <div className="jsr-hero-badge">
              <span className="jsr-hero-badge-dot"></span>
              {activeHero?.badge || 'Fresh From Our Farm'}
            </div>

            <h1 className="jsr-hero-title">
              {activeHero?.title || companySettings?.company_name || 'JSR Fruit & Vegetable Company'}
            </h1>

            <p className="jsr-hero-subtitle">
              {activeHero?.subtitle || companySettings?.tagline || 'Fresh Vegetables, Fruits & Mushroom Direct from our farm to your home.'}
            </p>

            {/* 3 Trust Badges */}
            <div className="jsr-hero-badges-row">
              <div className="jsr-hero-trust-badge">
                <div className="jsr-trust-icon">🌱</div>
                <div className="jsr-trust-text">
                  <strong>100% Fresh</strong>
                  <span>Farm Fresh Products</span>
                </div>
              </div>

              <div className="jsr-hero-trust-badge">
                <div className="jsr-trust-icon">✨</div>
                <div className="jsr-trust-text">
                  <strong>Best Quality</strong>
                  <span>Carefully Selected</span>
                </div>
              </div>

              <div className="jsr-hero-trust-badge">
                <div className="jsr-trust-icon">🚚</div>
                <div className="jsr-trust-text">
                  <strong>On Time Delivery</strong>
                  <span>Fast &amp; Safe Delivery</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="jsr-hero-cta-group">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  const el = document.getElementById('shop-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                SHOP NOW
              </Button>

              <a
                href={`https://wa.me/${whatsappClean}?text=Hello%20${encodeURIComponent(companySettings?.company_name || 'JSR Fresh')}%2C%20I%20want%20to%20order%20fresh%20produce`}
                target="_blank"
                rel="noreferrer"
                className="jsr-btn-whatsapp-hero"
              >
                <IoLogoWhatsapp size={20} />
                <span>ORDER ON WHATSAPP</span>
              </a>
            </div>
          </div>

          {/* Hero Visual Image */}
          <div className="jsr-hero-image-wrapper">
            <div className="jsr-hero-image-backdrop"></div>
            <img
              src={activeHero?.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"}
              alt={activeHero?.title || "Fresh produce"}
              className="jsr-hero-main-img"
            />
            <div className="jsr-floating-harvest-tag">
              <span className="jsr-tag-icon">🍃</span>
              <div>
                <strong>Harvested Daily</strong>
                <small>{companySettings?.city || 'Bemetara'} Farms</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          2. SHOP BY CATEGORY
      -------------------------------------------------------------- */}
      <section className="jsr-category-section">
        <div className="jsr-container">
          <div className="jsr-section-title-wrap">
            <span className="jsr-title-dash"></span>
            <h2 className="jsr-section-title">SHOP BY CATEGORY</h2>
            <span className="jsr-title-dash"></span>
          </div>

          {/* Circular Round Categories Matching Grocery Apps */}
          <div className="jsr-round-categories-row">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <div
                  key={cat.id}
                  className={`jsr-round-cat-item ${isSelected ? 'jsr-round-cat-active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    const el = document.getElementById('shop-products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className="jsr-round-cat-avatar-wrap">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="jsr-round-cat-avatar"
                    />
                    {isSelected && (
                      <span className="jsr-round-cat-indicator">✓</span>
                    )}
                  </div>
                  <span className="jsr-round-cat-label">{cat.name}</span>
                  <small className="jsr-round-cat-count">{cat.product_count || 6}+ Varieties</small>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Advertisement Strip Banners */}
      {stripAds.length > 0 && (
        <section className="jsr-advertisement-strip-section">
          <div className="jsr-container">
            {stripAds.map((ad) => (
              <div key={ad.id} className="jsr-ad-strip-card">
                <img src={ad.image} alt={ad.title} className="jsr-ad-strip-bg" />
                <div className="jsr-ad-strip-content">
                  {ad.badge && <span className="jsr-ad-strip-badge">{ad.badge}</span>}
                  <h3 className="jsr-ad-strip-title">{ad.title}</h3>
                  {ad.subtitle && <p className="jsr-ad-strip-sub">{ad.subtitle}</p>}
                  <Link to={ad.target_link || '/products'} className="jsr-ad-strip-btn">
                    Explore Offer &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------
          3. FRESH VEGETABLES / PRODUCTS GRID (From Mockup)
      -------------------------------------------------------------- */}
      <section id="shop-products" className="jsr-products-section">
        <div className="jsr-container">
          <div className="jsr-products-header">
            <div>
              <div className="jsr-breadcrumb">Home &gt; Vegetables</div>
              <h2 className="jsr-products-title">Fresh Vegetables</h2>
            </div>

            {/* Filter Pills / Dropdowns */}
            <div className="jsr-products-filters">
              <button
                type="button"
                className={`jsr-filter-pill ${selectedCategory === 'all' ? 'jsr-pill-active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </button>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="jsr-filter-select"
              >
                <option value="all">Category ▾ (All)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="jsr-filter-select"
              >
                <option value="default">Sort By ▾</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="jsr-products-grid">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="jsr-product-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Discount Tag */}
                {product.original_price > product.price && (
                  <span className="jsr-discount-pill">
                    {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                  </span>
                )}

                <div className="jsr-product-img-box">
                  <img src={product.image} alt={product.name} loading="lazy" />
                </div>

                <div className="jsr-product-info">
                  <h4 className="jsr-product-name">{product.name}</h4>
                  <div className="jsr-product-pricing">
                    <span className="jsr-product-price">
                      ₹{product.price}
                    </span>
                    <span className="jsr-product-unit">/ {product.unit}</span>
                  </div>

                  <button
                    type="button"
                    className="jsr-add-to-cart-btn"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="jsr-view-more-wrap">
            <button
              type="button"
              className="jsr-view-more-btn"
              onClick={() => navigate('/vegetables')}
            >
              VIEW MORE PRODUCTS
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          4. WHY CHOOSE US & HOW IT WORKS & DELIVERY AREA
      -------------------------------------------------------------- */}
      <section className="jsr-info-sections">
        <div className="jsr-container jsr-info-grid">
          {/* Why Choose Us */}
          <div className="jsr-info-block">
            <h3 className="jsr-info-heading">WHY CHOOSE US</h3>
            <div className="jsr-reasons-grid">
              <div className="jsr-reason-item">
                <span className="jsr-reason-icon">🌱</span>
                <div>
                  <strong>Farm Fresh</strong>
                  <p>Direct from our farm</p>
                </div>
              </div>

              <div className="jsr-reason-item">
                <span className="jsr-reason-icon">🧼</span>
                <div>
                  <strong>Safe &amp; Hygienic</strong>
                  <p>Carefully packed</p>
                </div>
              </div>

              <div className="jsr-reason-item">
                <span className="jsr-reason-icon">🏷️</span>
                <div>
                  <strong>Best Prices</strong>
                  <p>Quality at best price</p>
                </div>
              </div>

              <div className="jsr-reason-item">
                <span className="jsr-reason-icon">😊</span>
                <div>
                  <strong>Happy Customers</strong>
                  <p>Trusted by thousands</p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="jsr-info-block">
            <h3 className="jsr-info-heading">HOW IT WORKS</h3>
            <div className="jsr-steps-flow">
              <div className="jsr-step-node">
                <div className="jsr-step-num">1</div>
                <strong>Place Your Order</strong>
                <p>Choose products &amp; place order</p>
              </div>
              <div className="jsr-step-arrow">&rarr;</div>

              <div className="jsr-step-node">
                <div className="jsr-step-num">2</div>
                <strong>We Pack Carefully</strong>
                <p>Hygienic packing</p>
              </div>
              <div className="jsr-step-arrow">&rarr;</div>

              <div className="jsr-step-node">
                <div className="jsr-step-num">3</div>
                <strong>Fast Delivery</strong>
                <p>On time at your door</p>
              </div>
              <div className="jsr-step-arrow">&rarr;</div>

              <div className="jsr-step-node">
                <div className="jsr-step-num">4</div>
                <strong>You Enjoy Fresh Food</strong>
                <p>Happy &amp; healthy life</p>
              </div>
            </div>
          </div>

          {/* We Deliver In */}
          <div className="jsr-info-block jsr-delivery-zone-block">
            <span className="jsr-delivery-sub">We Deliver In</span>
            <div className="jsr-zone-title-wrap">
              <IoLocationOutline size={24} className="text-emerald-700" />
              <div>
                <h4 className="jsr-zone-title">Bemetara, Raipur</h4>
                <p className="jsr-zone-subtitle">&amp; Nearby Areas</p>
              </div>
            </div>
            <button
              type="button"
              className="jsr-btn-pincode-check"
              onClick={() => setIsPincodeModalOpen(true)}
            >
              CHECK PINCODE
            </button>
          </div>
        </div>
      </section>

      {/* Pincode Modal */}
      <Modal
        isOpen={isPincodeModalOpen}
        onClose={() => {
          setIsPincodeModalOpen(false);
          setPincodeStatus(null);
        }}
        title="Check Delivery Availability"
        size="md"
      >
        <form onSubmit={handlePincodeCheck} className="jsr-pincode-form">
          <p className="jsr-pincode-desc">
            Check if we deliver to your address in <strong>Bemetara, Raipur &amp; Nearby Areas</strong>.
          </p>
          <div className="jsr-pincode-input-row">
            <input
              type="text"
              maxLength={6}
              value={pincodeInput}
              onChange={(e) => setPincodeInput(e.target.value)}
              placeholder="Enter 6-digit Pincode (e.g. 491335)"
              className="jsr-pincode-input"
            />
            <Button type="submit" variant="primary">
              Verify
            </Button>
          </div>

          {pincodeStatus && (
            <div
              className={`jsr-pincode-result-box ${
                pincodeStatus.serviceable ? 'jsr-pincode-ok' : 'jsr-pincode-fail'
              }`}
            >
              {pincodeStatus.message}
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default Home;
