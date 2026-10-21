import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoEyeOutline } from 'react-icons/io5';
import Modal from '../../Components/Modal';
import { getOrders } from '../../Services/Actions/getApis';
import { updateOrderStatus } from '../../Services/Actions/postApis';
import formatterService from '../../Services/Helper/FormatterService';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);

  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    await dispatch(updateOrderStatus(orderId, newStatus));
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="jsr-admin-orders-page">
      <div className="jsr-admin-subbar">
        <h3 className="jsr-page-title">Manage Orders</h3>

        <div className="jsr-filter-row">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="jsr-filter-select"
          >
            <option value="all">All Orders</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="jsr-table-card">
        <div className="jsr-table-responsive">
          <table className="jsr-admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Change Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord, idx) => {
                const orderId = ord.order_number || ord.order_id || `#ORD125${6 - idx}`;
                const badge = formatterService.getOrderStatusBadge(ord.status);
                return (
                  <tr key={orderId}>
                    <td className="jsr-font-bold">{orderId}</td>
                    <td>
                      <div>
                        <strong className="jsr-table-primary-text">{ord.customer_name || ord.customer}</strong>
                        <small className="jsr-table-sub-text">{ord.customer_mobile || 'Bemetara Local'}</small>
                      </div>
                    </td>
                    <td className="jsr-price-highlight">
                      {typeof ord.amount === 'string' ? ord.amount : `₹${ord.total_amount || 650}`}
                    </td>
                    <td className="jsr-table-sub-text">
                      {ord.order_date || '06 Jun 2024'}
                    </td>
                    <td>
                      <span
                        className="jsr-status-tag"
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`
                        }}
                      >
                        {ord.status || 'Processing'}
                      </span>
                    </td>
                    <td>
                      <select
                        value={ord.status || 'Processing'}
                        onChange={(e) => handleStatusChange(orderId, e.target.value)}
                        className="jsr-status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleViewOrder(ord)}
                        className="jsr-action-btn-view"
                        title="View Details"
                        aria-label="View Order"
                      >
                        <IoEyeOutline size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Order Details: ${selectedOrder?.order_number || selectedOrder?.order_id || ''}`}
        size="md"
      >
        {selectedOrder && (
          <div className="jsr-order-modal-body">
            <div className="jsr-order-modal-card">
              <p><strong>Customer:</strong> {selectedOrder.customer_name || selectedOrder.customer}</p>
              <p><strong>Phone:</strong> {selectedOrder.customer_mobile || '+91 9827112345'}</p>
              <p><strong>Delivery Address:</strong> {selectedOrder.delivery_address || 'Bemetara / Raipur Local Delivery'}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Total Amount:</strong> {typeof selectedOrder.amount === 'string' ? selectedOrder.amount : `₹${selectedOrder.total_amount}`}</p>
            </div>
            <div className="jsr-modal-btn-row">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="jsr-btn jsr-btn-outline jsr-btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;
