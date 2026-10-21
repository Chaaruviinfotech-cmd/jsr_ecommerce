import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoTrashOutline,
  IoLogoWhatsapp,
  IoShieldCheckmarkOutline,
  IoCarOutline,
  IoCashOutline,
  IoHeadsetOutline,
  IoPersonOutline,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoCheckmarkCircle,
  IoQrCodeOutline
} from 'react-icons/io5';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import {
  updateCartQuantity,
  removeFromCart,
  applyCoupon,
  createOrder
} from '../../Services/Actions/postApis';
import validationService from '../../Services/Helper/ValidationService';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, subtotal, deliveryFee, discount, appliedCoupon, total } = useSelector(
    (state) => state.cart
  );
  const authUser = useSelector((state) => state.auth?.user);

  const [couponInput, setCouponInput] = useState('');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    customer_name: authUser?.name || '',
    customer_mobile: authUser?.phone || '',
    customer_email: authUser?.email || '',
    delivery_address: authUser?.address || '',
    city: 'Bemetara',
    pincode: '491335',
    payment_method: 'COD'
  });

  useEffect(() => {
    if (authUser) {
      setCheckoutForm((prev) => ({
        ...prev,
        customer_name: authUser.name || prev.customer_name,
        customer_mobile: authUser.phone || prev.customer_mobile,
        customer_email: authUser.email || prev.customer_email,
        delivery_address: authUser.address || prev.delivery_address
      }));
    }
  }, [authUser]);

  const [formErrors, setFormErrors] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);


  const handleQtyChange = (cartItemId, newQty) => {
    if (newQty < 1) {
      dispatch(removeFromCart(cartItemId));
    } else {
      dispatch(updateCartQuantity(cartItemId, newQty));
    }
  };

  const handleRemove = (cartItemId) => {
    dispatch(removeFromCart(cartItemId));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      dispatch(applyCoupon(couponInput.trim().toUpperCase(), subtotal));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const validation = validationService.validateCheckout(checkoutForm);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderData = {
        ...checkoutForm,
        subtotal,
        delivery_fee: deliveryFee,
        discount,
        total_amount: total,
        items
      };
      const res = await dispatch(createOrder(orderData));
      setIsCheckoutModalOpen(false);
      navigate(`/order-tracking?orderId=${res?.order_number || '#ORD1256'}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const whatsAppMessage = encodeURIComponent(
    `Hello JSR Fruit & Vegetable Company! I would like to place an order:\n` +
      items.map((i) => `• ${i.name} (${i.selected_weight || i.unit}) x ${i.quantity} = ₹${i.price * i.quantity}`).join('\n') +
      `\nTotal: ₹${total}`
  );

  return (
    <div className="jsr-cart-page py-8">
      <div className="jsr-container">
        {items.length === 0 ? (
          <div className="jsr-empty-cart-view">
            <span className="jsr-empty-cart-icon">🛒</span>
            <h2>Your basket is currently empty!</h2>
            <p>Explore our fresh harvest of farm fresh vegetables, fruits and mushrooms.</p>
            <Button variant="primary" onClick={() => navigate('/vegetables')}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="jsr-cart-layout">
            {/* Left Column: Cart Items List */}
            <div className="jsr-cart-items-column">
              <div className="jsr-cart-header-row">
                <h1 className="jsr-cart-title">Your Cart ({items.length} Items)</h1>
                <Link to="/vegetables" className="jsr-cart-edit-link">
                  Edit Cart
                </Link>
              </div>

              {/* Items Table/Cards */}
              <div className="jsr-cart-list">
                {items.map((item) => (
                  <div key={item.cartId} className="jsr-cart-item-card">
                    <div className="jsr-cart-item-left">
                      <div className="jsr-cart-thumb">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="jsr-cart-item-meta">
                        <h4 className="jsr-cart-item-name">{item.name}</h4>
                        <span className="jsr-cart-item-unit">
                          {item.selected_weight || item.unit}
                        </span>
                      </div>
                    </div>

                    <div className="jsr-cart-item-price">
                      ₹{item.price}
                    </div>

                    {/* Quantity controls */}
                    <div className="jsr-cart-item-controls">
                      <div className="jsr-qty-counter jsr-qty-counter-sm">
                        <button
                          type="button"
                          className="jsr-qty-btn"
                          onClick={() => handleQtyChange(item.cartId, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="jsr-qty-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="jsr-qty-btn"
                          onClick={() => handleQtyChange(item.cartId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="jsr-cart-item-total">
                        ₹{item.price * item.quantity}
                      </div>

                      <button
                        type="button"
                        className="jsr-cart-trash-btn"
                        onClick={() => handleRemove(item.cartId)}
                        aria-label="Remove item"
                      >
                        <IoTrashOutline size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 4 Trust Badges Under Cart */}
              <div className="jsr-cart-trust-grid">
                <div className="jsr-cart-trust-item">
                  <IoCarOutline size={20} className="text-emerald-700" />
                  <div>
                    <strong>Free Delivery</strong>
                    <small>On orders above ₹499</small>
                  </div>
                </div>

                <div className="jsr-cart-trust-item">
                  <IoShieldCheckmarkOutline size={20} className="text-emerald-700" />
                  <div>
                    <strong>Safe Packing</strong>
                    <small>Hygienic &amp; Safe</small>
                  </div>
                </div>

                <div className="jsr-cart-trust-item">
                  <IoCashOutline size={20} className="text-emerald-700" />
                  <div>
                    <strong>Pay on Delivery</strong>
                    <small>Cash on delivery available</small>
                  </div>
                </div>

                <div className="jsr-cart-trust-item">
                  <IoHeadsetOutline size={20} className="text-emerald-700" />
                  <div>
                    <strong>Support</strong>
                    <small>24/7 Customer Support</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="jsr-cart-summary-column">
              <div className="jsr-summary-card">
                <h3 className="jsr-summary-title">Order Summary</h3>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="jsr-coupon-form mb-4">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. JSR10)"
                    className="jsr-coupon-input"
                  />
                  <button type="submit" className="jsr-coupon-btn">
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="jsr-applied-coupon-tag">
                    <span>✓ Coupon {appliedCoupon.code} applied (-₹{discount})</span>
                  </div>
                )}

                <div className="jsr-summary-rows">
                  <div className="jsr-summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="jsr-summary-row">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-700 font-semibold">
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="jsr-summary-row text-emerald-700">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <hr className="jsr-summary-divider" />

                  <div className="jsr-summary-row jsr-summary-total">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div className="jsr-summary-actions">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setIsCheckoutModalOpen(true)}
                  >
                    CHECKOUT
                  </Button>

                  <div className="jsr-or-divider">or</div>

                  <a
                    href={`https://wa.me/911234567890?text=${whatsAppMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="jsr-btn-whatsapp-outline"
                  >
                    <IoLogoWhatsapp size={18} />
                    <span>Order on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CHECKOUT MODAL */}
      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        title="Doorstep Delivery &amp; Checkout"
        size="lg"
      >
        <form onSubmit={handlePlaceOrder} className="jsr-modal-form jsr-checkout-modal-form">
          {/* Group 1: Recipient Information */}
          <div className="jsr-form-section-card">
            <div className="jsr-section-header-compact">
              <IoPersonOutline size={18} className="text-emerald-700" />
              <span>Recipient Information</span>
            </div>

            <div className="jsr-form-grid-2 jsr-mt-2">
              <div className="jsr-form-group">
                <label>Full Name *</label>
                <div className="jsr-input-with-icon">
                  <IoPersonOutline className="jsr-field-icon" size={17} />
                  <input
                    type="text"
                    name="customer_name"
                    value={checkoutForm.customer_name}
                    onChange={handleFormChange}
                    placeholder="Enter your full name"
                    className="jsr-input jsr-input-padded"
                  />
                </div>
                {formErrors.customer_name && <small className="jsr-field-error">{formErrors.customer_name}</small>}
              </div>

              <div className="jsr-form-group">
                <label>Mobile Number *</label>
                <div className="jsr-input-with-icon">
                  <IoCallOutline className="jsr-field-icon" size={17} />
                  <input
                    type="tel"
                    maxLength={10}
                    name="customer_mobile"
                    value={checkoutForm.customer_mobile}
                    onChange={handleFormChange}
                    placeholder="10-digit mobile number"
                    className="jsr-input jsr-input-padded"
                  />
                </div>
                {formErrors.customer_mobile && <small className="jsr-field-error">{formErrors.customer_mobile}</small>}
              </div>
            </div>

            <div className="jsr-form-group jsr-mt-2">
              <label>Email Address (For receipt)</label>
              <div className="jsr-input-with-icon">
                <IoMailOutline className="jsr-field-icon" size={17} />
                <input
                  type="email"
                  name="customer_email"
                  value={checkoutForm.customer_email}
                  onChange={handleFormChange}
                  placeholder="name@example.com"
                  className="jsr-input jsr-input-padded"
                />
              </div>
            </div>
          </div>

          {/* Group 2: Delivery Location */}
          <div className="jsr-form-section-card jsr-mt-3">
            <div className="jsr-section-header-compact">
              <IoLocationOutline size={18} className="text-emerald-700" />
              <span>Doorstep Delivery Address</span>
            </div>

            <div className="jsr-form-group jsr-mt-2">
              <label>House / Street / Mandi / Landmark Address *</label>
              <textarea
                rows={2}
                name="delivery_address"
                value={checkoutForm.delivery_address}
                onChange={handleFormChange}
                placeholder="House No, Ward No, Street Name, Near Landmark"
                className="jsr-input"
              />
              {formErrors.delivery_address && <small className="jsr-field-error">{formErrors.delivery_address}</small>}
            </div>

            <div className="jsr-form-grid-2 jsr-mt-2">
              <div className="jsr-form-group">
                <label>Delivery Pincode *</label>
                <div className="jsr-input-with-icon">
                  <IoLocationOutline className="jsr-field-icon" size={17} />
                  <input
                    type="text"
                    maxLength={6}
                    name="pincode"
                    value={checkoutForm.pincode}
                    onChange={handleFormChange}
                    placeholder="491335"
                    className="jsr-input jsr-input-padded"
                  />
                </div>
                {formErrors.pincode && <small className="jsr-field-error">{formErrors.pincode}</small>}
              </div>

              <div className="jsr-form-group">
                <label>City / Hub</label>
                <input
                  type="text"
                  name="city"
                  value={checkoutForm.city}
                  onChange={handleFormChange}
                  className="jsr-input"
                  placeholder="Bemetara"
                />
              </div>
            </div>
          </div>

          {/* Group 3: Payment Method */}
          <div className="jsr-form-section-card jsr-mt-3">
            <div className="jsr-section-header-compact">
              <IoCashOutline size={18} className="text-emerald-700" />
              <span>Select Payment Preference</span>
            </div>

            <div className="jsr-payment-selector-grid jsr-mt-2">
              <button
                type="button"
                className={`jsr-payment-choice-card ${checkoutForm.payment_method === 'COD' ? 'is-selected' : ''}`}
                onClick={() => setCheckoutForm({ ...checkoutForm, payment_method: 'COD' })}
              >
                <div className="jsr-payment-icon-wrap">
                  <IoCashOutline size={24} />
                </div>
                <div className="jsr-payment-info">
                  <strong>Cash on Delivery (COD)</strong>
                  <small>Pay with cash directly to delivery agent</small>
                </div>
                {checkoutForm.payment_method === 'COD' && (
                  <IoCheckmarkCircle size={20} className="jsr-payment-check-icon" />
                )}
              </button>

              <button
                type="button"
                className={`jsr-payment-choice-card ${checkoutForm.payment_method === 'UPI' ? 'is-selected' : ''}`}
                onClick={() => setCheckoutForm({ ...checkoutForm, payment_method: 'UPI' })}
              >
                <div className="jsr-payment-icon-wrap">
                  <IoQrCodeOutline size={24} />
                </div>
                <div className="jsr-payment-info">
                  <strong>UPI / QR on Delivery</strong>
                  <small>Scan QR code with GPay, PhonePe, Paytm</small>
                </div>
                {checkoutForm.payment_method === 'UPI' && (
                  <IoCheckmarkCircle size={20} className="jsr-payment-check-icon" />
                )}
              </button>
            </div>
          </div>

          {/* Order Summary Highlight Banner */}
          <div className="jsr-checkout-order-strip jsr-mt-3">
            <div>
              <span className="jsr-checkout-items-label">{items.length} items in cart</span>
              <strong className="jsr-checkout-amount">Total Payable: ₹{total}</strong>
            </div>
            <span className="jsr-badge-delivery-free">⚡ FREE FARM DELIVERY</span>
          </div>

          <div className="jsr-modal-btn-row jsr-mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCheckoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isPlacingOrder}
            >
              Confirm &amp; Place Order (₹{total})
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Cart;
