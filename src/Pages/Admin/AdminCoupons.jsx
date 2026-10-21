import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoTicketOutline,
  IoAddOutline,
  IoSearchOutline,
  IoTrashOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCopyOutline,
  IoPricetagOutline,
  IoCashOutline,
  IoFlashOutline
} from 'react-icons/io5';
import Modal from '../../Components/Modal';
import Button from '../../Components/Button';
import { getCoupons } from '../../Services/Actions/getApis';
import {
  createCoupon,
  toggleCouponStatus,
  deleteCoupon
} from '../../Services/Actions/postApis';

const AdminCoupons = () => {
  const dispatch = useDispatch();
  const { coupons = [] } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'flat',
    discount_value: '',
    min_order_value: '100',
    status: 1
  });

  useEffect(() => {
    dispatch(getCoupons());
  }, [dispatch]);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggle = (id) => {
    dispatch(toggleCouponStatus(id));
  };

  const handleDelete = (id, code) => {
    if (window.confirm(`Are you sure you want to delete coupon "${code}"?`)) {
      dispatch(deleteCoupon(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discount_value) return;

    dispatch(
      createCoupon({
        code: formData.code.toUpperCase().trim(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_order_value: parseFloat(formData.min_order_value || 0),
        status: parseInt(formData.status)
      })
    );

    setIsModalOpen(false);
    setFormData({
      code: '',
      discount_type: 'flat',
      discount_value: '',
      min_order_value: '100',
      status: 1
    });
  };

  // Filtered coupons
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? coupon.status === 1
        : coupon.status === 0;
    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalCount = coupons.length;
  const activeCount = coupons.filter((c) => c.status === 1).length;
  const flatDiscounts = coupons.filter((c) => c.discount_type === 'flat');
  const maxFlat = flatDiscounts.length > 0 ? Math.max(...flatDiscounts.map((c) => c.discount_value)) : 50;

  return (
    <div className="jsr-admin-page-content">
      {/* Header */}
      <div className="jsr-admin-page-header">
        <div>
          <h1 className="jsr-admin-page-title">Discount Coupons &amp; Vouchers</h1>
          <p className="jsr-admin-page-sub">
            Create promotional codes and set minimum purchase thresholds for checkout.
          </p>
        </div>
        <button
          type="button"
          className="jsr-admin-primary-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <IoAddOutline size={18} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="jsr-admin-kpi-grid">
        <div className="jsr-admin-kpi-card">
          <div className="jsr-admin-kpi-icon icon-green">
            <IoTicketOutline size={22} />
          </div>
          <div className="jsr-admin-kpi-info">
            <span className="jsr-admin-kpi-label">Total Coupons</span>
            <span className="jsr-admin-kpi-value">{totalCount}</span>
          </div>
        </div>

        <div className="jsr-admin-kpi-card">
          <div className="jsr-admin-kpi-icon icon-emerald">
            <IoCheckmarkCircleOutline size={22} />
          </div>
          <div className="jsr-admin-kpi-info">
            <span className="jsr-admin-kpi-label">Active &amp; Live</span>
            <span className="jsr-admin-kpi-value">{activeCount}</span>
          </div>
        </div>

        <div className="jsr-admin-kpi-card">
          <div className="jsr-admin-kpi-icon icon-amber">
            <IoFlashOutline size={22} />
          </div>
          <div className="jsr-admin-kpi-info">
            <span className="jsr-admin-kpi-label">Highest Savings</span>
            <span className="jsr-admin-kpi-value">₹{maxFlat} OFF</span>
          </div>
        </div>

        <div className="jsr-admin-kpi-card">
          <div className="jsr-admin-kpi-icon icon-blue">
            <IoCashOutline size={22} />
          </div>
          <div className="jsr-admin-kpi-info">
            <span className="jsr-admin-kpi-label">Avg Min Order</span>
            <span className="jsr-admin-kpi-value">₹150</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="jsr-admin-table-toolbar">
        <div className="jsr-admin-search-box">
          <IoSearchOutline size={18} />
          <input
            type="text"
            placeholder="Search coupon code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="jsr-admin-filter-pills">
          <button
            type="button"
            className={`jsr-filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({coupons.length})
          </button>
          <button
            type="button"
            className={`jsr-filter-pill ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            className={`jsr-filter-pill ${statusFilter === 'inactive' ? 'active' : ''}`}
            onClick={() => setStatusFilter('inactive')}
          >
            Inactive ({coupons.length - activeCount})
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="jsr-admin-card-table">
        <div className="jsr-table-responsive">
          <table className="jsr-admin-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Type</th>
                <th>Discount Benefit</th>
                <th>Min Spend</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="jsr-table-empty">
                    <IoTicketOutline size={40} className="empty-icon" />
                    <p>No coupons found matching your criteria</p>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td>
                      <div className="jsr-coupon-badge-wrap">
                        <span className="jsr-coupon-code">{coupon.code}</span>
                        <button
                          type="button"
                          className="jsr-copy-icon-btn"
                          title="Copy Code"
                          onClick={() => handleCopy(coupon.code)}
                        >
                          <IoCopyOutline size={14} />
                        </button>
                        {copiedCode === coupon.code && (
                          <span className="jsr-copied-toast">Copied!</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`jsr-badge ${coupon.discount_type === 'percentage' ? 'badge-purple' : 'badge-blue'}`}>
                        {coupon.discount_type === 'percentage' ? 'Percentage %' : 'Flat ₹'}
                      </span>
                    </td>
                    <td>
                      <strong className="jsr-discount-value">
                        {coupon.discount_type === 'percentage'
                          ? `${coupon.discount_value}% OFF`
                          : `₹${coupon.discount_value} OFF`}
                      </strong>
                    </td>
                    <td>
                      <span className="jsr-text-muted">₹{coupon.min_order_value}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggle(coupon.id)}
                        className={`jsr-toggle-btn ${coupon.status === 1 ? 'toggle-active' : 'toggle-inactive'}`}
                      >
                        <span className="jsr-toggle-thumb" />
                        <span className="jsr-toggle-label">
                          {coupon.status === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </button>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="jsr-action-icon-btn delete-btn"
                        title="Delete Coupon"
                        onClick={() => handleDelete(coupon.id, coupon.code)}
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Promo Coupon"
        size="md"
      >
        <form onSubmit={handleSubmit} className="jsr-modal-form">
          {/* Live Coupon Voucher Preview Card */}
          <div className="jsr-coupon-voucher-preview">
            <div className="jsr-voucher-left">
              <span className="jsr-voucher-tag">PROMO VOUCHER</span>
              <strong className="jsr-voucher-code">{formData.code || 'CODE10'}</strong>
              <small className="jsr-voucher-cond">
                Min. Order ₹{formData.min_order_value || 100}
              </small>
            </div>
            <div className="jsr-voucher-divider">
              <span className="jsr-voucher-notch-top" />
              <span className="jsr-voucher-notch-bottom" />
            </div>
            <div className="jsr-voucher-right">
              <span className="jsr-voucher-save-label">SAVE</span>
              <strong className="jsr-voucher-save-val">
                {formData.discount_type === 'flat' ? `₹${formData.discount_value || 0}` : `${formData.discount_value || 0}%`}
              </strong>
              <span className="jsr-voucher-off">OFF</span>
            </div>
          </div>

          <div className="jsr-form-group jsr-mt-2">
            <label>Coupon Promo Code *</label>
            <div className="jsr-input-with-icon">
              <IoPricetagOutline className="jsr-field-icon" size={18} />
              <input
                type="text"
                required
                placeholder="e.g. MONSOON30"
                style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                className="jsr-input jsr-input-padded"
              />
            </div>
          </div>

          <div className="jsr-form-group jsr-mt-2">
            <label>Discount Type</label>
            <div className="jsr-type-selector-pills">
              <button
                type="button"
                className={`jsr-type-pill ${formData.discount_type === 'flat' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, discount_type: 'flat' })}
              >
                ₹ Flat Discount (Amount)
              </button>
              <button
                type="button"
                className={`jsr-type-pill ${formData.discount_type === 'percentage' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, discount_type: 'percentage' })}
              >
                % Percentage Discount
              </button>
            </div>
          </div>

          <div className="jsr-form-grid-2 jsr-mt-2">
            <div className="jsr-form-group">
              <label>
                Discount Value * {formData.discount_type === 'flat' ? '(₹)' : '(%)'}
              </label>
              <div className="jsr-input-with-icon">
                <span className="jsr-currency-prefix">
                  {formData.discount_type === 'flat' ? '₹' : '%'}
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  min="1"
                  placeholder={formData.discount_type === 'flat' ? '25' : '15'}
                  value={formData.discount_value}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_value: e.target.value })
                  }
                  className="jsr-input jsr-input-padded"
                />
              </div>
            </div>

            <div className="jsr-form-group">
              <label>Minimum Order Value (₹)</label>
              <div className="jsr-input-with-icon">
                <span className="jsr-currency-prefix">₹</span>
                <input
                  type="number"
                  min="0"
                  placeholder="100"
                  value={formData.min_order_value}
                  onChange={(e) =>
                    setFormData({ ...formData, min_order_value: e.target.value })
                  }
                  className="jsr-input jsr-input-padded"
                />
              </div>
            </div>
          </div>

          <div className="jsr-form-group jsr-mt-2">
            <label>Initial Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: parseInt(e.target.value) })
              }
              className="jsr-input"
            >
              <option value={1}>🟢 Active &amp; Redeemable by Customers</option>
              <option value={0}>⚪ Draft / Inactive</option>
            </select>
          </div>

          <div className="jsr-modal-btn-row jsr-mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCoupons;
