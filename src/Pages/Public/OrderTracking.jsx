import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoArrowBack,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoLogoWhatsapp,
  IoSearchOutline
} from 'react-icons/io5';
import Button from '../../Components/Button';
import Loader from '../../Components/Loader';
import { getOrderDetails } from '../../Services/Actions/getApis';
import formatterService from '../../Services/Helper/FormatterService';

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const requestedOrderId = searchParams.get('orderId') || '';
  const [searchOrderInput, setSearchOrderInput] = useState('');

  const { trackingOrder, isLoading } = useSelector((state) => state.order);
  const companySettings = useSelector((state) => state.admin?.companySettings);
  const whatsappClean = (companySettings?.whatsapp || '919827012345').replace(/[^0-9]/g, '');

  useEffect(() => {
    if (requestedOrderId) {
      dispatch(getOrderDetails(requestedOrderId));
    }
  }, [requestedOrderId, dispatch]);

  const handleLookup = (e) => {
    e.preventDefault();
    if (searchOrderInput.trim()) {
      dispatch(getOrderDetails(searchOrderInput.trim()));
    }
  };

  const order = trackingOrder;
  const statusBadge = order ? formatterService.getOrderStatusBadge(order.status || 'Processing') : null;


  return (
    <div className="jsr-tracking-page py-6">
      <div className="jsr-container jsr-tracking-container">
        {/* Top Header */}
        <div className="jsr-tracking-nav-header">
          <button
            type="button"
            className="jsr-back-arrow-btn"
            onClick={() => navigate('/')}
            aria-label="Back"
          >
            <IoArrowBack size={20} />
          </button>
          <h1 className="jsr-tracking-title">My Order</h1>
          <div className="w-8"></div>
        </div>

        {/* Quick Search for other Order IDs */}
        <form onSubmit={handleLookup} className="jsr-order-search-form mb-6">
          <input
            type="text"
            value={searchOrderInput}
            onChange={(e) => setSearchOrderInput(e.target.value)}
            placeholder="Search by Order ID (e.g. #ORD1256)"
            className="jsr-input text-sm"
          />
          <Button type="submit" variant="primary" size="sm">
            Track
          </Button>
        </form>

        {isLoading ? (
          <Loader text="Tracking your fresh delivery..." />
        ) : order ? (
          <div className="jsr-tracking-card">
            {/* Order Meta Header */}
            <div className="jsr-tracking-meta-header">
              <div>
                <span className="jsr-tracking-id-label">
                  Order ID : <strong>{order.order_id || order.order_number}</strong>
                </span>
                <p className="jsr-tracking-date">
                  Placed on {order.order_date || 'Recent Order'}
                </p>
              </div>

              {statusBadge && (
                <span
                  className="jsr-status-tag"
                  style={{
                    backgroundColor: statusBadge.bg,
                    color: statusBadge.text,
                    border: `1px solid ${statusBadge.border}`
                  }}
                >
                  {order.status || 'Processing'}
                </span>
              )}
            </div>

            {/* Stepper Timeline Section */}
            <div className="jsr-tracking-timeline-section">
              <h3 className="jsr-timeline-heading">Order Tracking</h3>

              <div className="jsr-timeline-stepper">
                {(order.tracking_timeline || []).map((step, idx, arr) => {
                  const isLast = idx === arr.length - 1;
                  return (
                    <div key={step.title} className="jsr-timeline-step-row">
                      {/* Left icon & vertical line */}
                      <div className="jsr-stepper-indicator-col">
                        <div
                          className={`jsr-step-circle ${
                            step.completed ? 'jsr-step-circle-done' : 'jsr-step-circle-pending'
                          }`}
                        >
                          {step.completed ? (
                            <IoCheckmarkCircle size={22} className="jsr-step-check-icon" />
                          ) : (
                            <div className="jsr-step-empty-dot" />
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={`jsr-step-line ${
                              step.completed ? 'jsr-step-line-done' : ''
                            }`}
                          />
                        )}
                      </div>

                      {/* Right text info */}
                      <div className="jsr-step-content-col">
                        <span
                          className={`jsr-step-title ${
                            step.completed ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="jsr-step-time">{step.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items Summary */}
            {order.items && order.items.length > 0 && (
              <div className="jsr-tracking-items-section">
                <h4 className="jsr-ordered-items-heading">Items in this Delivery</h4>
                <div className="jsr-ordered-items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="jsr-ordered-item-row">
                      <div className="jsr-ordered-item-meta">
                        <strong>{item.product_name}</strong>
                        <small>{item.weight_unit || '1 kg'} × {item.quantity}</small>
                      </div>
                      <span className="jsr-ordered-item-price">₹{item.item_total}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Help Button Matching Image 1 */}
            <div className="jsr-tracking-help-box">
              <a
                href={`https://wa.me/${whatsappClean}?text=Hi%20JSR%20Support%2C%20I%20need%20help%20with%20my%20Order%20${order.order_id || order.order_number || ''}`}
                target="_blank"
                rel="noreferrer"
                className="jsr-btn-whatsapp-help"
              >
                <IoLogoWhatsapp size={20} />
                <span>Need Help? Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="jsr-tracking-card text-center py-12" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Track Your Produce Delivery
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              Please enter your Order ID (e.g. <strong>#ORD1001</strong>) in the search box above to view real-time harvest and delivery tracking.
            </p>
            <Link to="/products" className="jsr-btn-primary" style={{ display: 'inline-block', padding: '0.65rem 1.5rem', borderRadius: '8px', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
              Shop Fresh Produce
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
