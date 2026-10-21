import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  IoTrendingUpOutline,
  IoCalendarOutline,
  IoArrowForwardOutline
} from 'react-icons/io5';
import { getDashboardStats } from '../../Services/Actions/getApis';
import formatterService from '../../Services/Helper/FormatterService';
import Loader from '../../Components/Loader';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state.admin);
  const isLoading = useSelector((state) => state.product?.isLoading);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  const stats = dashboard?.stats || {
    total_orders: { value: 0, growth: null, label: 'Total Orders' },
    total_sales: { value: '₹0', growth: null, label: 'Total Sales' },
    total_customers: { value: 0, growth: null, label: 'Active Customers' },
    pending_orders: { value: 0, growth: null, label: 'Pending Orders' }
  };

  const recentOrders = dashboard?.recent_orders || [];
  const topSelling = dashboard?.top_selling || [];

  return (
    <div className="jsr-admin-dashboard-page">
      {/* 1. TOP 4 METRICS CARDS MATCHING MOCKUP */}
      <div className="jsr-admin-stats-grid">
        {/* Total Orders */}
        <div className="jsr-admin-stat-card">
          <span className="jsr-stat-label">Total Orders</span>
          <div className="jsr-stat-value-row">
            <span className="jsr-stat-num">{stats.total_orders?.value}</span>
            {stats.total_orders?.growth && (
              <span className="jsr-stat-growth">
                <IoTrendingUpOutline size={14} /> {stats.total_orders.growth}
              </span>
            )}
          </div>
          <span className="jsr-stat-sub">{stats.total_orders?.label || 'This Month'}</span>
        </div>

        {/* Total Sales */}
        <div className="jsr-admin-stat-card">
          <span className="jsr-stat-label">Total Sales</span>
          <div className="jsr-stat-value-row">
            <span className="jsr-stat-num">{stats.total_sales?.value}</span>
            {stats.total_sales?.growth && (
              <span className="jsr-stat-growth">
                <IoTrendingUpOutline size={14} /> {stats.total_sales.growth}
              </span>
            )}
          </div>
          <span className="jsr-stat-sub">{stats.total_sales?.label || 'This Month'}</span>
        </div>

        {/* Total Customers */}
        <div className="jsr-admin-stat-card">
          <span className="jsr-stat-label">Total Customers</span>
          <div className="jsr-stat-value-row">
            <span className="jsr-stat-num">{stats.total_customers?.value}</span>
            {stats.total_customers?.growth && (
              <span className="jsr-stat-growth">
                <IoTrendingUpOutline size={14} /> {stats.total_customers.growth}
              </span>
            )}
          </div>
          <span className="jsr-stat-sub">{stats.total_customers?.label || 'This Month'}</span>
        </div>

        {/* Pending Orders */}
        <div className="jsr-admin-stat-card">
          <span className="jsr-stat-label">Pending Orders</span>
          <div className="jsr-stat-value-row">
            <span className="jsr-stat-num">{stats.pending_orders?.value}</span>
          </div>
          <Link to="/admin/orders" className="jsr-stat-action-link">
            {stats.pending_orders?.label || 'View Orders'} &rarr;
          </Link>
        </div>
      </div>

      {/* 2. MIDDLE ROW: SALES OVERVIEW CHART & TOP SELLING PRODUCTS */}
      <div className="jsr-admin-middle-grid">
        {/* Sales Overview SVG Line Chart matching image */}
        <div className="jsr-admin-chart-box">
          <div className="jsr-chart-header">
            <h3 className="jsr-chart-title">Sales Overview</h3>
            <select className="jsr-chart-time-select">
              <option>This Week ▾</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="jsr-chart-container">
            {/* SVG Visual matching mockup curve */}
            <svg
              className="jsr-sales-svg"
              viewBox="0 0 650 260"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="50" y1="30" x2="620" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="80" x2="620" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="130" x2="620" y2="130" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="180" x2="620" y2="180" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="230" x2="620" y2="230" stroke="#e2e8f0" strokeWidth="1" />

              {/* Y Axis text */}
              <text x="15" y="35" fill="#94a3b8" fontSize="11">₹20K</text>
              <text x="15" y="85" fill="#94a3b8" fontSize="11">₹15K</text>
              <text x="15" y="135" fill="#94a3b8" fontSize="11">₹10K</text>
              <text x="22" y="185" fill="#94a3b8" fontSize="11">₹5K</text>
              <text x="32" y="235" fill="#94a3b8" fontSize="11">₹0</text>

              {/* Area fill path under curve */}
              <path
                d="M 60 190 
                   Q 150 160, 240 180 
                   T 340 110 
                   T 430 140 
                   T 530 80 
                   T 600 120 
                   L 600 230 
                   L 60 230 Z"
                fill="url(#salesGradient)"
              />

              {/* Main Line curve */}
              <path
                d="M 60 190 
                   Q 150 160, 240 180 
                   T 340 110 
                   T 430 140 
                   T 530 80 
                   T 600 120"
                fill="none"
                stroke="#15803d"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="60" cy="190" r="4.5" fill="#15803d" stroke="#fff" strokeWidth="2" />
              <circle cx="150" cy="165" r="4.5" fill="#15803d" stroke="#fff" strokeWidth="2" />
              <circle cx="240" cy="180" r="4.5" fill="#15803d" stroke="#fff" strokeWidth="2" />
              <circle cx="340" cy="110" r="4.5" fill="#15803d" stroke="#fff" strokeWidth="2" />
              <circle cx="430" cy="140" r="4.5" fill="#15803d" stroke="#fff" strokeWidth="2" />
              <circle cx="530" cy="80" r="5" fill="#15803d" stroke="#fff" strokeWidth="2" />
              <circle cx="600" cy="120" r="4.5" fill="#15803d" stroke="#fff" strokeWidth="2" />
            </svg>

            {/* X Axis Day Labels */}
            <div className="jsr-chart-x-labels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="jsr-admin-top-selling-box">
          <div className="jsr-top-selling-header">
            <h3 className="jsr-chart-title">Top Selling Products</h3>
          </div>

          <div className="jsr-top-selling-list">
            {topSelling.map((prod) => (
              <div key={prod.name} className="jsr-top-selling-row">
                <div className="jsr-top-prod-left">
                  <img src={prod.image} alt={prod.name} className="jsr-top-prod-thumb" />
                  <div className="jsr-top-prod-info">
                    <strong>{prod.name}</strong>
                    <small>{prod.price}</small>
                  </div>
                </div>
                <span className="jsr-top-prod-kg">{prod.sales_kg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: RECENT ORDERS TABLE */}
      <div className="jsr-admin-recent-orders-box">
        <div className="jsr-recent-orders-header">
          <h3 className="jsr-chart-title">Recent Orders</h3>
          <Link to="/admin/orders" className="jsr-view-all-link">
            View All &rarr;
          </Link>
        </div>

        <div className="jsr-table-responsive">
          <table className="jsr-admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((ord) => {
                const badge = formatterService.getOrderStatusBadge(ord.status);
                return (
                  <tr key={ord.order_id}>
                    <td className="font-semibold text-gray-900">{ord.order_id}</td>
                    <td>{ord.customer}</td>
                    <td className="font-medium">{ord.amount}</td>
                    <td>
                      <span
                        className="jsr-status-tag"
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`
                        }}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
