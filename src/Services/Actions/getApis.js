import axiosInstance from '../Helper/axiosInstance';
import { initialProducts, initialCategories, initialDashboard, initialCoupons, initialDeliveryAreas } from '../initialData';

// Action types
export const GET_PRODUCTS = 'GET_PRODUCTS';
export const GET_PRODUCT_DETAILS = 'GET_PRODUCT_DETAILS';
export const GET_CATEGORIES = 'GET_CATEGORIES';
export const GET_DASHBOARD_STATS = 'GET_DASHBOARD_STATS';
export const GET_ORDERS = 'GET_ORDERS';
export const GET_ORDER_DETAILS = 'GET_ORDER_DETAILS';
export const GET_CUSTOMERS = 'GET_CUSTOMERS';
export const GET_COUPONS = 'GET_COUPONS';
export const GET_DELIVERY_AREAS = 'GET_DELIVERY_AREAS';
export const CHECK_PINCODE = 'CHECK_PINCODE';
export const GET_SETTINGS = 'GET_SETTINGS';
export const GET_ADVERTISEMENTS = 'GET_ADVERTISEMENTS';
export const GET_USER_ADDRESSES = 'GET_USER_ADDRESSES';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';

/**
 * Fetch all products or filtered products by category, search, sorting
 */
export const getProducts = (params = {}) => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const res = await axiosInstance.get('/products.php', { params });
      if (res.data?.data && Array.isArray(res.data.data)) {
        dispatch({ type: GET_PRODUCTS, payload: res.data.data });
        return res.data;
      }
      dispatch({ type: GET_PRODUCTS, payload: initialProducts });
      return { status: true, data: initialProducts };
    } catch (err) {
      console.warn('Backend unavailable, using initial products fallback:', err.message);
      dispatch({ type: GET_PRODUCTS, payload: initialProducts });
      return { status: true, data: initialProducts };
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };
};

/**
 * Fetch product details by ID or Slug
 */
export const getProductDetails = (id) => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const res = await axiosInstance.get(`/products.php?id=${id}`);
      if (res.data?.data) {
        dispatch({ type: GET_PRODUCT_DETAILS, payload: res.data.data });
        return res.data;
      }
      const fallback = initialProducts.find((p) => p.id === Number(id)) || initialProducts[9];
      dispatch({ type: GET_PRODUCT_DETAILS, payload: fallback });
      return { status: true, data: fallback };
    } catch (err) {
      console.warn('Backend unavailable, using initial product details fallback:', err.message);
      const fallback = initialProducts.find((p) => p.id === Number(id)) || initialProducts[9];
      dispatch({ type: GET_PRODUCT_DETAILS, payload: fallback });
      return { status: true, data: fallback };
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };
};

/**
 * Fetch all categories with product counts
 */
export const getCategories = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get('/categories.php');
      if (res.data?.data && Array.isArray(res.data.data)) {
        dispatch({ type: GET_CATEGORIES, payload: res.data.data });
        return res.data;
      }
      dispatch({ type: GET_CATEGORIES, payload: initialCategories });
      return { status: true, data: initialCategories };
    } catch (err) {
      console.warn('Backend unavailable, using initial categories fallback:', err.message);
      dispatch({ type: GET_CATEGORIES, payload: initialCategories });
      return { status: true, data: initialCategories };
    }
  };
};

/**
 * Fetch Admin Dashboard statistics, charts, and KPI data
 */
export const getDashboardStats = () => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const res = await axiosInstance.get('/dashboard.php');
      if (res.data?.data) {
        dispatch({ type: GET_DASHBOARD_STATS, payload: res.data.data });
        return res.data;
      }
      dispatch({ type: GET_DASHBOARD_STATS, payload: initialDashboard });
      return { status: true, data: initialDashboard };
    } catch (err) {
      console.warn('Backend unavailable, using initial dashboard stats fallback:', err.message);
      dispatch({ type: GET_DASHBOARD_STATS, payload: initialDashboard });
      return { status: true, data: initialDashboard };
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };
};

/**
 * Fetch all customer orders (Admin)
 */
export const getOrders = (params = {}) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get('/orders.php', { params });
      if (res.data?.data && Array.isArray(res.data.data)) {
        dispatch({ type: GET_ORDERS, payload: res.data.data });
        return res.data;
      }
      dispatch({ type: GET_ORDERS, payload: initialDashboard.recent_orders });
      return { status: true, data: initialDashboard.recent_orders };
    } catch (err) {
      console.warn('Backend unavailable, using initial orders fallback:', err.message);
      dispatch({ type: GET_ORDERS, payload: initialDashboard.recent_orders });
      return { status: true, data: initialDashboard.recent_orders };
    }
  };
};

/**
 * Fetch single order tracking and line items
 */
export const getOrderDetails = (identifier) => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const res = await axiosInstance.get(`/orders.php?id=${identifier}`);
      if (res.data?.data) {
        dispatch({ type: GET_ORDER_DETAILS, payload: res.data.data });
        return res.data;
      }
    } catch (err) {
      console.warn('Backend unavailable, using default tracking details:', err.message);
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };
};

/**
 * Fetch registered customers
 */
export const getCustomers = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get('/customers.php');
      if (res.data?.data && Array.isArray(res.data.data)) {
        dispatch({ type: GET_CUSTOMERS, payload: res.data.data });
        return res.data;
      }
    } catch (err) {
      console.warn('Backend unavailable, using default customers fallback:', err.message);
    }
  };
};

/**
 * Check delivery availability by pincode
 */
export const checkDeliveryPincode = (pincode) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get(`/check_pincode.php?pincode=${pincode}`);
      dispatch({ type: CHECK_PINCODE, payload: res.data });
      return res.data;
    } catch (err) {
      const isDeliverable = String(pincode).startsWith('491') || String(pincode).startsWith('492');
      const fallbackRes = {
        status: true,
        deliverable: isDeliverable,
        message: isDeliverable
          ? `✓ Delivery available to Pincode ${pincode} (Bemetara / Raipur Region)!`
          : 'Sorry, we currently deliver only to Bemetara, Raipur & Nearby Areas.'
      };
      dispatch({ type: CHECK_PINCODE, payload: fallbackRes });
      return fallbackRes;
    }
  };
};

/**
 * Fetch all coupons for admin
 */
export const getCoupons = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get('/coupons.php');
      if (res.data?.data && Array.isArray(res.data.data)) {
        dispatch({ type: GET_COUPONS, payload: res.data.data });
        return res.data;
      }
      dispatch({ type: GET_COUPONS, payload: initialCoupons });
      return { status: true, data: initialCoupons };
    } catch (err) {
      console.warn('Backend unavailable, using initial coupons fallback:', err.message);
      dispatch({ type: GET_COUPONS, payload: initialCoupons });
      return { status: true, data: initialCoupons };
    }
  };
};

/**
 * Fetch all serviceable delivery areas/pincodes for admin
 */
export const getDeliveryAreas = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get('/delivery_areas.php');
      if (res.data?.data && Array.isArray(res.data.data)) {
        dispatch({ type: GET_DELIVERY_AREAS, payload: res.data.data });
        return res.data;
      }
      dispatch({ type: GET_DELIVERY_AREAS, payload: initialDeliveryAreas });
      return { status: true, data: initialDeliveryAreas };
    } catch (err) {
      console.warn('Backend unavailable, using initial delivery areas fallback:', err.message);
      dispatch({ type: GET_DELIVERY_AREAS, payload: initialDeliveryAreas });
      return { status: true, data: initialDeliveryAreas };
    }
  };
};

/**
 * Fetch dynamic company settings from database
 */
export const getCompanySettings = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get('/settings.php');
      if (res.data?.status && res.data?.data) {
        dispatch({ type: GET_SETTINGS, payload: res.data.data });
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend settings unavailable:', err.message);
    }
  };
};

/**
 * Fetch dynamic advertisement banners from database
 */
export const getAdvertisements = (params = {}) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get('/advertisements.php', { params });
      if (res.data?.status && Array.isArray(res.data?.data)) {
        dispatch({ type: GET_ADVERTISEMENTS, payload: res.data.data });
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend advertisements unavailable:', err.message);
    }
  };
};

/**
 * Fetch dynamic addresses for customer
 */
export const getUserAddresses = (customerId) => {
  return async (dispatch) => {
    if (!customerId) return [];
    try {
      const res = await axiosInstance.get(`/auth.php?action=get_addresses&customer_id=${customerId}`);
      if (res.data?.status && Array.isArray(res.data?.data)) {
        dispatch({ type: GET_USER_ADDRESSES, payload: res.data.data });
        return res.data.data;
      }
    } catch (err) {
      console.warn('Could not load user addresses:', err.message);
    }
    return [];
  };
};