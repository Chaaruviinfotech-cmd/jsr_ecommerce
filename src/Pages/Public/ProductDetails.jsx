import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoStar,
  IoLogoWhatsapp,
  IoLogoFacebook,
  IoLogoTwitter,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';
import { RiLeafLine, RiShieldCheckLine } from 'react-icons/ri';
import Button from '../../Components/Button';
import Loader from '../../Components/Loader';
import { getProductDetails } from '../../Services/Actions/getApis';
import { addToCart } from '../../Services/Actions/postApis';
import calculationService from '../../Services/Helper/CalculationService';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedProduct, isLoading } = useSelector((state) => state.product);

  const [activeImage, setActiveImage] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('200 gm');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const prodId = id || 10;
    dispatch(getProductDetails(prodId));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(selectedProduct.image);
      const defaultOption = Array.isArray(selectedProduct.weight_options) && selectedProduct.weight_options.length > 0
        ? selectedProduct.weight_options[0]
        : selectedProduct.unit;
      setSelectedWeight(defaultOption);
    }
  }, [selectedProduct]);

  if (isLoading || !selectedProduct) {
    return <Loader fullScreen text="Loading product details..." />;
  }

  // Gallery array
  const galleryImages = Array.isArray(selectedProduct.gallery) && selectedProduct.gallery.length > 0
    ? selectedProduct.gallery
    : [
        selectedProduct.image,
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80'
      ];

  const weightOptions = Array.isArray(selectedProduct.weight_options) && selectedProduct.weight_options.length > 0
    ? selectedProduct.weight_options
    : ['200 gm', '500 gm', '1 kg'];

  // Helper to parse weight strings (e.g. '250g', '500 gm', '1 kg', '1 Dozen', '2 piece')
  const parseWeightToGramsOrPieces = (str) => {
    if (!str) return null;
    const s = String(str).toLowerCase().trim();
    const kgMatch = s.match(/([0-9.]+)\s*kg/);
    if (kgMatch) return { type: 'weight', val: parseFloat(kgMatch[1]) * 1000 };

    const gmMatch = s.match(/([0-9.]+)\s*(?:gm|g|grams)/);
    if (gmMatch) return { type: 'weight', val: parseFloat(gmMatch[1]) };

    const dozenMatch = s.match(/([0-9.]+)\s*dozen/);
    if (dozenMatch) return { type: 'piece', val: parseFloat(dozenMatch[1]) * 12 };

    const pcsMatch = s.match(/([0-9.]+)\s*(?:pcs|pieces|piece)/);
    if (pcsMatch) return { type: 'piece', val: parseFloat(pcsMatch[1]) };

    return null;
  };

  const getWeightMultiplier = (targetWeight, baseUnit) => {
    if (!targetWeight || !baseUnit || targetWeight === baseUnit) return 1;
    const target = parseWeightToGramsOrPieces(targetWeight);
    const base = parseWeightToGramsOrPieces(baseUnit);
    if (target && base && target.type === base.type && base.val > 0) {
      return target.val / base.val;
    }
    return 1;
  };

  const weightMultiplier = getWeightMultiplier(selectedWeight, selectedProduct?.unit);
  const basePrice = parseFloat(selectedProduct?.price || 0);
  const baseOriginalPrice = parseFloat(selectedProduct?.original_price || selectedProduct?.price || 0);

  // Price for one unit of selected weight
  const unitPrice = Math.max(1, Math.round(basePrice * weightMultiplier));
  const unitOriginalPrice = Math.max(unitPrice, Math.round(baseOriginalPrice * weightMultiplier));

  // Dynamic Total Price according to quantity
  const totalPrice = unitPrice * quantity;
  const totalOriginalPrice = unitOriginalPrice * quantity;

  const discountPercent = calculationService.calculateDiscountPercentage(
    unitPrice,
    unitOriginalPrice
  );

  const handleDecreaseQty = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncreaseQty = () => {
    setQuantity((q) => q + 1);
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart(
        {
          ...selectedProduct,
          price: unitPrice,
          original_price: unitOriginalPrice
        },
        quantity,
        selectedWeight
      )
    );
  };

  const handleBuyNow = () => {
    dispatch(
      addToCart(
        {
          ...selectedProduct,
          price: unitPrice,
          original_price: unitOriginalPrice
        },
        quantity,
        selectedWeight
      )
    );
    navigate('/cart');
  };

  return (
    <div className="jsr-product-details-page py-6">
      <div className="jsr-container">
        {/* Breadcrumb */}
        <nav className="jsr-breadcrumb mb-6" aria-label="Breadcrumb">
          <Link to="/">Home</Link> &gt;{' '}
          <Link to="/vegetables">{selectedProduct.category_name || 'Produce'}</Link> &gt;{' '}
          <span className="text-gray-900 font-medium">{selectedProduct.name}</span>
        </nav>

        {/* 2-Column Product Detail Layout */}
        <div className="jsr-details-layout">
          {/* Left Column: Image Gallery */}
          <div className="jsr-gallery-column">
            <div className="jsr-main-img-box">
              <img
                src={activeImage || selectedProduct.image}
                alt={selectedProduct.name}
                className="jsr-main-product-img"
              />
            </div>

            {/* Thumbnail Row */}
            <div className="jsr-thumbnail-row">
              {galleryImages.map((imgUrl, index) => (
                <div
                  key={index}
                  className={`jsr-thumb-box ${activeImage === imgUrl ? 'jsr-thumb-active' : ''}`}
                  onClick={() => setActiveImage(imgUrl)}
                >
                  <img src={imgUrl} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Meta & Purchase Controls */}
          <div className="jsr-info-column">
            <h1 className="jsr-details-title">{selectedProduct.name}</h1>

            {/* Star Rating & Reviews */}
            <div className="jsr-rating-row">
              <div className="jsr-stars">
                {[...Array(5)].map((_, i) => (
                  <IoStar key={i} size={16} className="text-amber-400" />
                ))}
              </div>
              <span className="jsr-reviews-count">({selectedProduct.reviews_count || 128} Reviews)</span>
            </div>

            {/* Dynamic Pricing Row with Live Qty & Weight Calculation */}
            <div className="jsr-details-pricing-block">
              <div className="jsr-details-pricing">
                <span className="jsr-details-price">₹{totalPrice}</span>
                {totalOriginalPrice > totalPrice && (
                  <>
                    <span className="jsr-details-original-price">₹{totalOriginalPrice}</span>
                    <span className="jsr-details-discount-badge">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Unit Rate & Quantity Formula Breakdown */}
              <div className="jsr-details-price-breakdown">
                <span className="jsr-rate-tag">
                  ₹{unitPrice} / {selectedWeight || selectedProduct.unit}
                </span>
                {quantity > 1 && (
                  <span className="jsr-qty-multiplier-badge">
                    (₹{unitPrice} × {quantity} qty = ₹{totalPrice})
                  </span>
                )}
              </div>
            </div>

            {/* Weight Options Selection */}
            <div className="jsr-weight-selection">
              <label className="jsr-weight-label">Select Pack / Weight</label>
              <div className="jsr-weight-pills">
                {weightOptions.map((weight) => (
                  <button
                    key={weight}
                    type="button"
                    className={`jsr-weight-pill ${selectedWeight === weight ? 'jsr-weight-active' : ''}`}
                    onClick={() => setSelectedWeight(weight)}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="jsr-purchase-actions">
              <div className="jsr-qty-counter">
                <button
                  type="button"
                  className="jsr-qty-btn"
                  onClick={handleDecreaseQty}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  title="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setQuantity(isNaN(val) || val < 1 ? 1 : val);
                  }}
                  className="jsr-qty-input"
                  aria-label="Product quantity"
                />
                <button
                  type="button"
                  className="jsr-qty-btn"
                  onClick={handleIncreaseQty}
                  aria-label="Increase quantity"
                  title="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="jsr-action-btns-group">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  className="jsr-details-btn-cart"
                >
                  ADD TO CART • ₹{totalPrice}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBuyNow}
                  className="jsr-details-btn-buy"
                >
                  BUY NOW
                </Button>
              </div>
            </div>

            {/* 3 Quality Badges */}
            <div className="jsr-details-quality-badges">
              <div className="jsr-quality-badge-item">
                <RiLeafLine size={18} className="text-emerald-700" />
                <span>Farm Fresh</span>
              </div>
              <div className="jsr-quality-badge-item">
                <span className="text-lg">🚫</span>
                <span>No Chemicals</span>
              </div>
              <div className="jsr-quality-badge-item">
                <RiShieldCheckLine size={18} className="text-emerald-700" />
                <span>100% Quality</span>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="jsr-share-row">
              <span className="jsr-share-label">Share:</span>
              <div className="jsr-share-icons">
                <a
                  href={`https://api.whatsapp.com/send?text=Check%20out%20${selectedProduct.name}%20at%20JSR%20Fresh`}
                  target="_blank"
                  rel="noreferrer"
                  className="jsr-share-link text-emerald-600"
                >
                  <IoLogoWhatsapp size={18} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="jsr-share-link text-blue-600"
                >
                  <IoLogoFacebook size={18} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="jsr-share-link text-sky-500"
                >
                  <IoLogoTwitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
