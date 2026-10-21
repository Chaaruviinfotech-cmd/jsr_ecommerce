import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoLocationOutline,
  IoAddOutline,
  IoSearchOutline,
  IoTrashOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoBicycleOutline,
  IoMapOutline,
  IoBusinessOutline
} from 'react-icons/io5';
import Modal from '../../Components/Modal';
import Button from '../../Components/Button';
import { getDeliveryAreas } from '../../Services/Actions/getApis';
import {
  createDeliveryArea,
  toggleDeliveryAreaStatus,
  deleteDeliveryArea
} from '../../Services/Actions/postApis';

const AdminDeliveryAreas = () => {
  const dispatch = useDispatch();
  const { deliveryAreas = [] } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all'); // 'all' | 'Bemetara' | 'Raipur' | 'Durg'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    pincode: '',
    area_name: '',
    city: 'Bemetara',
    delivery_charge: '0',
    estimated_delivery: 'Under 2 Hours',
    status: 1
  });

  useEffect(() => {
    dispatch(getDeliveryAreas());
  }, [dispatch]);

  const handleToggle = (id) => {
    dispatch(toggleDeliveryAreaStatus(id));
  };

  const handleDelete = (id, pincode, area) => {
    if (window.confirm(`Are you sure you want to remove ${pincode} (${area}) from delivery areas?`)) {
      dispatch(deleteDeliveryArea(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.pincode || !formData.area_name) return;

    dispatch(
      createDeliveryArea({
        pincode: formData.pincode.trim(),
        area_name: formData.area_name.trim(),
        city: formData.city.trim(),
        delivery_charge: parseFloat(formData.delivery_charge || 0),
        estimated_delivery: formData.estimated_delivery.trim(),
        status: parseInt(formData.status)
      })
    );

    setIsModalOpen(false);
    setFormData({
      pincode: '',
      area_name: '',
      city: 'Bemetara',
      delivery_charge: '0',
      estimated_delivery: 'Under 2 Hours',
      status: 1
    });
  };

  // Filtered areas
  const filteredAreas = deliveryAreas.filter((area) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      area.pincode.toLowerCase().includes(query) ||
      area.area_name.toLowerCase().includes(query) ||
      area.city.toLowerCase().includes(query);
    const matchesCity =
      cityFilter === 'all'
        ? true
        : area.city.toLowerCase() === cityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  // KPI Calculations
  const totalPincodes = deliveryAreas.length;
  const activeZones = deliveryAreas.filter((a) => a.status === 1).length;
  const freeZones = deliveryAreas.filter((a) => Number(a.delivery_charge) === 0).length;
  const citiesList = Array.from(new Set(deliveryAreas.map((a) => a.city)));

  return (
    <div className="jsr-admin-page-content">
      {/* Header */}
      <div className="jsr-admin-page-header">
        <div>
          <h1 className="jsr-admin-page-title">Delivery Areas &amp; Pincodes</h1>
          <p className="jsr-admin-page-sub">
            Manage dispatch locations, delivery charges, and express transit times.
          </p>
        </div>
        <button
          type="button"
          className="jsr-admin-primary-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <IoAddOutline size={18} />
          <span>Add Delivery Area</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="jsr-admin-kpi-grid">
        <div className="jsr-admin-kpi-card">
          <div className="jsr-admin-kpi-icon icon-green">
            <IoLocationOutline size={22} />
          </div>
          <div className="jsr-admin-kpi-info">
            <span className="jsr-admin-kpi-label">Serviceable Pincodes</span>
            <span className="jsr-admin-kpi-value">{totalPincodes}</span>
          </div>
        </div>

        <div className="jsr-admin-kpi-card">
          <div className="jsr-admin-kpi-icon icon-emerald">
            <IoCheckmarkCircleOutline size={22} />
          </div>
          <div className="jsr-admin-kpi-info">
            <span className="jsr-admin-kpi-label">Active Zones</span>
            <span className="jsr-admin-kpi-value">{activeZones}</span>
          </div>
        </div>

        <div className="jsr-admin-kpi-card">
          <div className="jsr-admin-kpi-icon icon-amber">
            <IoBicycleOutline size={22} />
          </div>
          <div className="jsr-admin-kpi-info">
            <span className="jsr-admin-kpi-label">Free Delivery Zones</span>
            <span className="jsr-admin-kpi-value">{freeZones}</span>
          </div>
        </div>

        <div className="jsr-admin-kpi-card">
          <div className="jsr-admin-kpi-icon icon-blue">
            <IoBusinessOutline size={22} />
          </div>
          <div className="jsr-admin-kpi-info">
            <span className="jsr-admin-kpi-label">Cities Covered</span>
            <span className="jsr-admin-kpi-value">{citiesList.length || 3}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="jsr-admin-table-toolbar">
        <div className="jsr-admin-search-box">
          <IoSearchOutline size={18} />
          <input
            type="text"
            placeholder="Search pincode, landmark, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="jsr-admin-filter-pills">
          <button
            type="button"
            className={`jsr-filter-pill ${cityFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCityFilter('all')}
          >
            All Cities
          </button>
          <button
            type="button"
            className={`jsr-filter-pill ${cityFilter === 'Bemetara' ? 'active' : ''}`}
            onClick={() => setCityFilter('Bemetara')}
          >
            Bemetara
          </button>
          <button
            type="button"
            className={`jsr-filter-pill ${cityFilter === 'Raipur' ? 'active' : ''}`}
            onClick={() => setCityFilter('Raipur')}
          >
            Raipur
          </button>
          <button
            type="button"
            className={`jsr-filter-pill ${cityFilter === 'Durg' ? 'active' : ''}`}
            onClick={() => setCityFilter('Durg')}
          >
            Durg / Bhilai
          </button>
        </div>
      </div>

      {/* Delivery Areas Table */}
      <div className="jsr-admin-card-table">
        <div className="jsr-table-responsive">
          <table className="jsr-admin-table">
            <thead>
              <tr>
                <th>Pincode</th>
                <th>Area / Landmark</th>
                <th>City</th>
                <th>Delivery Fee</th>
                <th>Est. Delivery Time</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="jsr-table-empty">
                    <IoMapOutline size={40} className="empty-icon" />
                    <p>No delivery areas found</p>
                  </td>
                </tr>
              ) : (
                filteredAreas.map((area) => (
                  <tr key={area.id}>
                    <td>
                      <span className="jsr-pincode-pill">
                        <IoLocationOutline size={14} />
                        {area.pincode}
                      </span>
                    </td>
                    <td>
                      <strong className="jsr-area-name">{area.area_name}</strong>
                    </td>
                    <td>
                      <span className="jsr-badge badge-blue">{area.city}</span>
                    </td>
                    <td>
                      {Number(area.delivery_charge) === 0 ? (
                        <span className="jsr-free-badge">FREE DELIVERY</span>
                      ) : (
                        <strong className="jsr-fee-text">₹{area.delivery_charge}</strong>
                      )}
                    </td>
                    <td>
                      <div className="jsr-est-time">
                        <IoTimeOutline size={15} />
                        <span>{area.estimated_delivery}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggle(area.id)}
                        className={`jsr-toggle-btn ${area.status === 1 ? 'toggle-active' : 'toggle-inactive'}`}
                      >
                        <span className="jsr-toggle-thumb" />
                        <span className="jsr-toggle-label">
                          {area.status === 1 ? 'Deliverable' : 'Suspended'}
                        </span>
                      </button>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="jsr-action-icon-btn delete-btn"
                        title="Remove Pincode"
                        onClick={() => handleDelete(area.id, area.pincode, area.area_name)}
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

      {/* Add Delivery Area Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Serviceable Delivery Pincode"
        size="md"
      >
        <form onSubmit={handleSubmit} className="jsr-modal-form">
          {/* Live Preview Card */}
          <div className="jsr-delivery-area-preview">
            <div className="jsr-delivery-preview-pin">
              <IoLocationOutline size={20} />
              <span>{formData.pincode || '491335'}</span>
            </div>
            <div className="jsr-delivery-preview-meta">
              <strong>{formData.area_name || 'Area / Sector Name'}</strong>
              <small>{formData.city} &bull; {Number(formData.delivery_charge) === 0 ? 'FREE DELIVERY' : `₹${formData.delivery_charge} fee`} &bull; {formData.estimated_delivery}</small>
            </div>
          </div>

          <div className="jsr-form-grid-2 jsr-mt-2">
            <div className="jsr-form-group">
              <label>6-Digit Postal Pincode *</label>
              <div className="jsr-input-with-icon">
                <IoLocationOutline className="jsr-field-icon" size={18} />
                <input
                  type="text"
                  required
                  maxLength="6"
                  placeholder="e.g. 491335"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })
                  }
                  className="jsr-input jsr-input-padded"
                />
              </div>
            </div>

            <div className="jsr-form-group">
              <label>City / Hub *</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="jsr-input"
              >
                <option value="Bemetara">Bemetara Hub</option>
                <option value="Raipur">Raipur City</option>
                <option value="Durg">Durg District</option>
                <option value="Bhilai">Bhilai Hub</option>
                <option value="Other">Other Region</option>
              </select>
            </div>
          </div>

          <div className="jsr-form-group jsr-mt-2">
            <label>Area / Sector / Mandi Name *</label>
            <div className="jsr-input-with-icon">
              <IoBusinessOutline className="jsr-field-icon" size={18} />
              <input
                type="text"
                required
                placeholder="e.g. Mandi Gate, Shankar Nagar, Main Market"
                value={formData.area_name}
                onChange={(e) =>
                  setFormData({ ...formData, area_name: e.target.value })
                }
                className="jsr-input jsr-input-padded"
              />
            </div>
          </div>

          <div className="jsr-form-grid-2 jsr-mt-2">
            <div className="jsr-form-group">
              <label>Delivery Fee (₹) [0 = Free]</label>
              <div className="jsr-input-with-icon">
                <span className="jsr-currency-prefix">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={formData.delivery_charge}
                  onChange={(e) =>
                    setFormData({ ...formData, delivery_charge: e.target.value })
                  }
                  className="jsr-input jsr-input-padded"
                />
              </div>
            </div>

            <div className="jsr-form-group">
              <label>Estimated Delivery Time</label>
              <div className="jsr-input-with-icon">
                <IoTimeOutline className="jsr-field-icon" size={18} />
                <input
                  type="text"
                  placeholder="e.g. Under 2 Hours"
                  value={formData.estimated_delivery}
                  onChange={(e) =>
                    setFormData({ ...formData, estimated_delivery: e.target.value })
                  }
                  className="jsr-input jsr-input-padded"
                />
              </div>
            </div>
          </div>

          <div className="jsr-form-group jsr-mt-2">
            <label>Initial Service Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: parseInt(e.target.value) })
              }
              className="jsr-input"
            >
              <option value={1}>🟢 Active &amp; Deliverable</option>
              <option value={0}>⚪ Temporarily Paused</option>
            </select>
          </div>

          <div className="jsr-modal-btn-row jsr-mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Delivery Area
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDeliveryAreas;
