import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers } from '../../Services/Actions/getApis';

const AdminCustomers = () => {
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  return (
    <div className="jsr-admin-customers-page">
      <div className="jsr-admin-subbar">
        <h3 className="jsr-page-title">Customer Directory</h3>
      </div>

      <div className="jsr-table-card">
        <div className="jsr-table-responsive">
          <table className="jsr-admin-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Mobile Number</th>
                <th>Total Orders</th>
                <th>Total Spend</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust.id}>
                  <td>
                    <div>
                      <strong className="jsr-table-primary-text">{cust.name}</strong>
                      <small className="jsr-table-sub-text">{cust.email || 'customer@jsr.in'}</small>
                    </div>
                  </td>
                  <td className="jsr-font-medium">{cust.mobile}</td>
                  <td>
                    <span className="jsr-badge-orders">
                      {cust.total_orders} Orders
                    </span>
                  </td>
                  <td className="jsr-price-highlight">₹{cust.total_spend}</td>
                  <td className="jsr-table-sub-text">{cust.address || 'Bemetara / Raipur'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
