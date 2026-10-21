import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Layout & Reusable Components
import Header from './Components/Header';
import Footer from './Components/Footer';
import MobileNavbar from './Components/MobileNavbar';
import Alert from './Components/Alert';

// Public Pages
import Home from './Pages/Public/Home';
import Products from './Pages/Public/Products';
import ProductDetails from './Pages/Public/ProductDetails';
import Cart from './Pages/Public/Cart';
import OrderTracking from './Pages/Public/OrderTracking';
import AboutUs from './Pages/Public/AboutUs';
import ContactUs from './Pages/Public/ContactUs';
import UserAccount from './Pages/Public/UserAccount';

// Admin Pages
import AdminLayout from './Pages/Admin/AdminLayout';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminProducts from './Pages/Admin/AdminProducts';
import AdminCategories from './Pages/Admin/AdminCategories';
import AdminOrders from './Pages/Admin/AdminOrders';
import AdminCustomers from './Pages/Admin/AdminCustomers';
import AdminCoupons from './Pages/Admin/AdminCoupons';
import AdminDeliveryAreas from './Pages/Admin/AdminDeliveryAreas';
import AdminReports from './Pages/Admin/AdminReports';
import AdminThemeSettings from './Pages/Admin/AdminThemeSettings';
import AdminLogin from './Pages/Admin/AdminLogin';

// Helpers
import themeService from './Services/Helper/ThemeService';
import { dismissAlert } from './Services/Actions/postApis';
import {
  getProducts,
  getCategories,
  getCompanySettings,
  getAdvertisements,
  getCoupons,
  getDeliveryAreas,
  getOrders,
  getCustomers,
  getDashboardStats
} from './Services/Actions/getApis';

// Public Layout Wrapper
const PublicLayout = ({ children }) => {
  return (
    <div className="jsr-public-layout min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <MobileNavbar />
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const alertState = useSelector((state) => state.alert?.alert);

  useEffect(() => {
    // Inject brand theme variables into :root
    themeService.injectCssVariables();

    // Fetch dynamic database data on initial boot
    dispatch(getProducts());
    dispatch(getCategories());
    dispatch(getCompanySettings());
    dispatch(getAdvertisements());
    dispatch(getCoupons());
    dispatch(getDeliveryAreas());
    dispatch(getOrders());
    dispatch(getCustomers());
    dispatch(getDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {/* Global Toast Notification */}
      {alertState && (
        <div className="jsr-toast-container">
          <Alert
            type={alertState.type || 'info'}
            title={alertState.title}
            message={alertState.message}
            autoClose
            autoCloseDuration={3500}
            onClose={() => dispatch(dismissAlert())}
          />
        </div>
      )}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/vegetables"
          element={
            <PublicLayout>
              <Products />
            </PublicLayout>
          }
        />
        <Route
          path="/products"
          element={
            <PublicLayout>
              <Products />
            </PublicLayout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PublicLayout>
              <ProductDetails />
            </PublicLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <PublicLayout>
              <Cart />
            </PublicLayout>
          }
        />
        <Route
          path="/order-tracking"
          element={
            <PublicLayout>
              <OrderTracking />
            </PublicLayout>
          }
        />
        <Route
          path="/order-tracking/:id"
          element={
            <PublicLayout>
              <OrderTracking />
            </PublicLayout>
          }
        />
        <Route
          path="/account"
          element={
            <PublicLayout>
              <UserAccount />
            </PublicLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <PublicLayout>
              <UserAccount />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutUs />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <ContactUs />
            </PublicLayout>
          }
        />

        {/* ADMIN AUTH ROUTE */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="delivery-areas" element={<AdminDeliveryAreas />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminThemeSettings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;