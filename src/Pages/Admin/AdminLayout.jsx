import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoGridOutline,
  IoFastFoodOutline,
  IoLayersOutline,
  IoReceiptOutline,
  IoPeopleOutline,
  IoTicketOutline,
  IoLocationOutline,
  IoBarChartOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoCalendarOutline,
  IoStorefrontOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoShieldCheckmarkOutline
} from 'react-icons/io5';
import { RiLeafLine } from 'react-icons/ri';
import { adminLogout } from '../../Services/Actions/postApis';
import { getCompanySettings } from '../../Services/Actions/getApis';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const mainViewportRef = useRef(null);

  const { isAdminAuthenticated, adminUser, companySettings } = useSelector((state) => state.admin);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(getCompanySettings());
  }, [dispatch]);

  // Scroll to top on route change inside admin viewport
  useEffect(() => {
    if (mainViewportRef.current) {
      mainViewportRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  // Authentication guard: if not authenticated, redirect to /admin/login
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('jsr_admin_user') : null;
    if (!isAdminAuthenticated && !stored) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/admin/login', { replace: true });
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: <IoGridOutline size={18} />, exact: true },
    { label: 'Products', path: '/admin/products', icon: <IoFastFoodOutline size={18} /> },
    { label: 'Categories', path: '/admin/categories', icon: <IoLayersOutline size={18} /> },
    { label: 'Orders', path: '/admin/orders', icon: <IoReceiptOutline size={18} />, badge: 12 },
    { label: 'Customers', path: '/admin/customers', icon: <IoPeopleOutline size={18} /> },
    { label: 'Coupons', path: '/admin/coupons', icon: <IoTicketOutline size={18} /> },
    { label: 'Delivery Areas', path: '/admin/delivery-areas', icon: <IoLocationOutline size={18} /> },
    { label: 'Reports', path: '/admin/reports', icon: <IoBarChartOutline size={18} /> },
    { label: 'Theme & Settings', path: '/admin/settings', icon: <IoSettingsOutline size={18} /> }
  ];

  // Derive current page title from pathname
  const getCurrentTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('/products')) return 'Product Management';
    if (path.includes('/categories')) return 'Produce Categories';
    if (path.includes('/orders')) return 'Customer Orders';
    if (path.includes('/customers')) return 'Customers Directory';
    if (path.includes('/coupons')) return 'Coupons & Vouchers';
    if (path.includes('/delivery-areas')) return 'Delivery Areas & Pincodes';
    if (path.includes('/reports')) return 'Sales & Business Reports';
    if (path.includes('/settings')) return 'Store Settings & Themes';
    return 'Admin Portal';
  };

  const currentAdminName = adminUser?.name || 'JSR Admin';
  const currentAdminRole = adminUser?.role || 'Super Admin';

  return (
    <div className="jsr-admin-wrapper">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="jsr-admin-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. DARK GREEN SIDEBAR MATCHING MOCKUP */}
      <aside className={`jsr-admin-sidebar ${isSidebarOpen ? 'jsr-admin-sidebar-open' : ''}`}>
        <div className="jsr-admin-sidebar-header">
          <Link to="/" className="jsr-admin-brand">
            {companySettings?.logo ? (
              <img
                src={companySettings.logo}
                alt={companySettings.company_name || 'Logo'}
                className="jsr-admin-brand-logo-img"
              />
            ) : (
              <RiLeafLine size={24} className="jsr-admin-brand-icon" />
            )}
            <div className="jsr-admin-brand-text">
              <span className="jsr-admin-brand-title">
                {companySettings?.company_name ? companySettings.company_name.split(' ')[0] : 'JSR'}
              </span>
              <span className="jsr-admin-brand-sub">
                {companySettings?.company_name
                  ? companySettings.company_name.split(' ').slice(1).join(' ') || 'Admin Portal'
                  : 'Fruit & Vegetable Company'}
              </span>
            </div>
          </Link>
          <button
            type="button"
            className="jsr-admin-close-mobile-btn"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* Admin Profile Chip in Sidebar */}
        <div className="jsr-admin-sidebar-profile">
          <div className="jsr-admin-avatar">
            <span>{currentAdminName.charAt(0)}</span>
          </div>
          <div className="jsr-admin-profile-info">
            <strong className="jsr-admin-profile-name">{currentAdminName}</strong>
            <span className="jsr-admin-profile-role">
              <IoShieldCheckmarkOutline size={13} /> {currentAdminRole}
            </span>
          </div>
        </div>

        <nav className="jsr-admin-nav-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.exact}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `jsr-admin-nav-item ${isActive ? 'jsr-admin-nav-active' : ''}`
              }
            >
              <span className="jsr-admin-nav-icon">{item.icon}</span>
              <span className="jsr-admin-nav-label">{item.label}</span>
              {item.badge && <span className="jsr-admin-nav-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="jsr-admin-sidebar-footer">
          <Link
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className="jsr-admin-nav-item jsr-nav-storefront"
          >
            <IoStorefrontOutline size={18} />
            <span>Public Store</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="jsr-admin-nav-item jsr-admin-logout-btn"
          >
            <IoLogOutOutline size={18} />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* 2. ADMIN MAIN VIEWPORT */}
      <div className="jsr-admin-main-viewport" ref={mainViewportRef}>
        {/* Top Navbar */}
        <header className="jsr-admin-topbar">
          <div className="jsr-admin-topbar-left">
            <button
              type="button"
              className="jsr-admin-menu-trigger"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Toggle menu"
            >
              <IoMenuOutline size={26} />
            </button>
            <h2 className="jsr-admin-topbar-title">{getCurrentTitle()}</h2>
          </div>

          <div className="jsr-admin-topbar-right">
            {/* Dynamic Today Date */}
            <div className="jsr-admin-date-badge">
              <IoCalendarOutline size={16} />
              <span>
                {new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>

            <Link
              to="/"
              className="jsr-admin-view-store-btn"
              target="_blank"
              rel="noopener noreferrer"
              title="Open customer storefront in new tab"
            >
              <IoStorefrontOutline size={16} />
              <span>View Storefront</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="jsr-admin-topbar-logout"
              title="Logout from Admin"
            >
              <IoLogOutOutline size={18} />
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="jsr-admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
