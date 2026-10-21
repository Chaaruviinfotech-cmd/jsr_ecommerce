import {
  GET_PRODUCTS,
  GET_PRODUCT_DETAILS,
  GET_CATEGORIES,
  GET_DASHBOARD_STATS,
  GET_ORDERS,
  GET_ORDER_DETAILS,
  GET_CUSTOMERS,
  GET_COUPONS,
  GET_DELIVERY_AREAS,
  GET_SETTINGS,
  GET_ADVERTISEMENTS,
  GET_USER_ADDRESSES,
  SET_LOADING,
  SET_ERROR
} from '../Actions/getApis';

import {
  CREATE_ORDER_SUCCESS,
  UPDATE_ORDER_STATUS_SUCCESS,
  ADD_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_SUCCESS,
  ADD_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_SUCCESS,
  APPLY_COUPON_SUCCESS,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QTY,
  CLEAR_CART,
  SHOW_ALERT,
  HIDE_ALERT,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  UPDATE_PROFILE_SUCCESS,
  ADD_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_SUCCESS,
  SET_DEFAULT_ADDRESS_SUCCESS,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGOUT_SUCCESS,
  CREATE_COUPON_SUCCESS,
  TOGGLE_COUPON_SUCCESS,
  DELETE_COUPON_SUCCESS,
  CREATE_DELIVERY_AREA_SUCCESS,
  TOGGLE_DELIVERY_AREA_SUCCESS,
  DELETE_DELIVERY_AREA_SUCCESS,
  UPDATE_SETTINGS_SUCCESS,
  CREATE_ADVERTISEMENT_SUCCESS,
  UPDATE_ADVERTISEMENT_SUCCESS,
  TOGGLE_ADVERTISEMENT_SUCCESS,
  DELETE_ADVERTISEMENT_SUCCESS
} from '../Actions/postApis';

import calculationService from '../Helper/CalculationService';
import {
  initialProducts,
  initialCategories,
  initialDashboard,
  initialCoupons,
  initialDeliveryAreas,
  initialUser,
  initialAddresses,
  initialUserOrders
} from '../initialData';

// ------------------------------------------------------------------
// Initial States
// ------------------------------------------------------------------
const initialProductState = {
  products: initialProducts,
  categories: initialCategories,
  selectedProduct: initialProducts[9], // Fresh Oyster Mushroom default
  isLoading: false,
  error: null
};

export const productReducer = (state = initialProductState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, isLoading: action.payload };

    case SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case GET_PRODUCTS:
      return { ...state, products: action.payload, isLoading: false };

    case GET_PRODUCT_DETAILS:
      return { ...state, selectedProduct: action.payload, isLoading: false };

    case GET_CATEGORIES:
      return { ...state, categories: action.payload };

    case ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        products: [action.payload, ...state.products]
      };

    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
        selectedProduct:
          state.selectedProduct?.id === action.payload.id
            ? { ...state.selectedProduct, ...action.payload }
            : state.selectedProduct
      };

    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload)
      };

    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };

    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        )
      };

    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload)
      };

    default:
      return state;
  }
};

// ------------------------------------------------------------------
// Cart Initial State & Reducer (Dynamic with localStorage)
// ------------------------------------------------------------------
const getStoredCart = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('jsr_cart_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading jsr_cart_items', e);
    }
  }
  return [];
};

const saveStoredCart = (items) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('jsr_cart_items', JSON.stringify(items));
    } catch (e) {
      console.warn('Error saving jsr_cart_items', e);
    }
  }
};

const initialCartItems = getStoredCart();
const initialCartSubtotal = calculationService.calculateSubtotal(initialCartItems);
const initialCartDelivery = calculationService.calculateDeliveryFee(initialCartSubtotal);
const initialCoupon = null;
const initialCartTotal = calculationService.calculateGrandTotal(initialCartSubtotal, 0, initialCartDelivery);

const initialCartState = {
  items: initialCartItems,
  subtotal: initialCartSubtotal,
  deliveryFee: initialCartDelivery,
  discount: 0,
  appliedCoupon: null,
  total: initialCartTotal
};

export const cartReducer = (state = initialCartState, action) => {
  let updatedItems = [];

  switch (action.type) {
    case ADD_TO_CART: {
      const { product, quantity, selectedWeight } = action.payload;
      const cartId = `cart_${product.id}_${selectedWeight || product.unit}`;
      const existingIndex = state.items.findIndex((item) => item.cartId === cartId);

      if (existingIndex > -1) {
        updatedItems = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem = {
          cartId,
          id: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          selected_weight: selectedWeight || product.unit,
          quantity,
          image: product.image
        };
        updatedItems = [...state.items, newItem];
      }

      saveStoredCart(updatedItems);
      const subtotal = calculationService.calculateSubtotal(updatedItems);
      const deliveryFee = calculationService.calculateDeliveryFee(subtotal);
      const discount = state.appliedCoupon ? state.discount : 0;
      const total = calculationService.calculateGrandTotal(subtotal, discount, deliveryFee);

      return {
        ...state,
        items: updatedItems,
        subtotal,
        deliveryFee,
        total
      };
    }

    case REMOVE_FROM_CART: {
      updatedItems = state.items.filter((item) => item.cartId !== action.payload);
      saveStoredCart(updatedItems);
      const subtotal = calculationService.calculateSubtotal(updatedItems);
      const deliveryFee = calculationService.calculateDeliveryFee(subtotal);
      const discount = updatedItems.length > 0 && state.appliedCoupon ? state.discount : 0;
      const total = calculationService.calculateGrandTotal(subtotal, discount, deliveryFee);

      return {
        ...state,
        items: updatedItems,
        subtotal,
        deliveryFee,
        discount,
        total
      };
    }

    case UPDATE_CART_QTY: {
      const { cartItemId, quantity } = action.payload;
      updatedItems = state.items.map((item) =>
        item.cartId === cartItemId ? { ...item, quantity } : item
      );
      saveStoredCart(updatedItems);
      const subtotal = calculationService.calculateSubtotal(updatedItems);
      const deliveryFee = calculationService.calculateDeliveryFee(subtotal);
      const discount = state.appliedCoupon ? state.discount : 0;
      const total = calculationService.calculateGrandTotal(subtotal, discount, deliveryFee);

      return {
        ...state,
        items: updatedItems,
        subtotal,
        deliveryFee,
        total
      };
    }

    case APPLY_COUPON_SUCCESS: {
      const coupon = action.payload;
      const discount = Number(coupon?.discount) || 0;
      const total = calculationService.calculateGrandTotal(state.subtotal, discount, state.deliveryFee);

      return {
        ...state,
        appliedCoupon: coupon,
        discount,
        total
      };
    }

    case CLEAR_CART:
      saveStoredCart([]);
      return {
        ...state,
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        discount: 0,
        appliedCoupon: null,
        total: 0
      };

    default:
      return state;
  }
};

// ------------------------------------------------------------------
// Orders & Tracking Reducer
// ------------------------------------------------------------------
const initialOrderState = {
  orders: initialDashboard.recent_orders,
  currentOrder: null,
  trackingOrder: {
    order_id: '#ORD1256',
    order_date: '06 Jun 2024, 10:30 AM',
    status: 'Processing',
    customer_name: 'Ravi Verma',
    total_amount: 650,
    items: [
      { id: 1, product_name: 'Fresh Oyster Mushroom', unit_price: 60, weight_unit: '200 gm', quantity: 1, item_total: 60, product_image: initialProducts[9].image },
      { id: 2, product_name: 'Farm Fresh Tomato', unit_price: 25, weight_unit: '1 kg', quantity: 2, item_total: 50, product_image: initialProducts[1].image },
      { id: 3, product_name: 'Fresh Cucumber', unit_price: 20, weight_unit: '1 kg', quantity: 1, item_total: 20, product_image: initialProducts[2].image }
    ],
    tracking_timeline: [
      { title: 'Order Placed', time: '06 Jun 2024, 10:30 AM', completed: true },
      { title: 'Confirmed', time: '06 Jun 2024, 10:35 AM', completed: true },
      { title: 'Packed', time: '06 Jun 2024, 11:20 AM', completed: true },
      { title: 'Out for Delivery', time: '06 Jun 2024, 12:10 PM', completed: false },
      { title: 'Delivered', time: 'Pending', completed: false }
    ]
  }
};

export const orderReducer = (state = initialOrderState, action) => {
  switch (action.type) {
    case GET_ORDERS:
      return { ...state, orders: action.payload };

    case GET_ORDER_DETAILS:
      return { ...state, trackingOrder: action.payload };

    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        currentOrder: action.payload,
        trackingOrder: action.payload.data || action.payload,
        orders: [action.payload, ...state.orders]
      };

    case UPDATE_ORDER_STATUS_SUCCESS: {
      const { orderId, status } = action.payload;
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === orderId || o.order_id === orderId || o.order_number === orderId
            ? { ...o, status }
            : o
        ),
        trackingOrder:
          state.trackingOrder?.order_number === orderId || state.trackingOrder?.id === orderId
            ? { ...state.trackingOrder, status }
            : state.trackingOrder
      };
    }

    default:
      return state;
  }
};

// ------------------------------------------------------------------
// Admin & UI Reducer
// ------------------------------------------------------------------
const getStoredAdmin = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('jsr_admin_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading jsr_admin_user', e);
    }
  }
  return null;
};

const initialAdminState = {
  adminUser: getStoredAdmin(),
  isAdminAuthenticated: !!getStoredAdmin(),
  dashboard: initialDashboard,
  customers: [
    { id: 1, name: 'Rakesh Sahu', mobile: '9827011111', total_orders: 8, total_spend: 3420 },
    { id: 2, name: 'Anita Verma', mobile: '9827022222', total_orders: 6, total_spend: 2150 },
    { id: 3, name: 'Manish Patel', mobile: '9827033333', total_orders: 4, total_spend: 1800 },
    { id: 4, name: 'Pooja Sahu', mobile: '9827044444', total_orders: 5, total_spend: 2420 },
    { id: 5, name: 'Sandeep Kumar', mobile: '9827055555', total_orders: 3, total_spend: 1310 }
  ],
  coupons: initialCoupons,
  deliveryAreas: initialDeliveryAreas,
  companySettings: {
    id: 1,
    company_name: 'JSR Fruit & Vegetable Company',
    logo: '',
    tagline: '100% Farm Fresh Fruits, Vegetables & Mushrooms Direct to Your Doorstep',
    phone: '+91 98270 12345',
    alternate_phone: '+91 78980 54321',
    email: 'care@jsrvegetables.com',
    address: 'Main Market Road, Near Krishi Mandi',
    city: 'Bemetara',
    state: 'Chhattisgarh',
    pincode: '491335',
    gst_number: '22AAAAA0000A1Z5',
    free_delivery_above: 300,
    announcement_text: '⚡ Super Fast Delivery across Bemetara, Raipur & Durg | Order before 6 PM for same-day delivery!',
    whatsapp: '+919827012345',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com'
  },
  advertisements: [],
  isLoading: false,
  error: null
};

export const adminReducer = (state = initialAdminState, action) => {
  switch (action.type) {
    case GET_DASHBOARD_STATS:
      return { ...state, dashboard: action.payload };

    case GET_CUSTOMERS:
      return { ...state, customers: action.payload };

    case GET_COUPONS:
      return { ...state, coupons: action.payload };

    case GET_DELIVERY_AREAS:
      return { ...state, deliveryAreas: action.payload };

    case GET_SETTINGS:
      return { ...state, companySettings: action.payload };

    case UPDATE_SETTINGS_SUCCESS:
      return { ...state, companySettings: { ...state.companySettings, ...action.payload } };

    case GET_ADVERTISEMENTS:
      return { ...state, advertisements: action.payload };

    case CREATE_ADVERTISEMENT_SUCCESS:
      return {
        ...state,
        advertisements: [action.payload, ...state.advertisements]
      };

    case UPDATE_ADVERTISEMENT_SUCCESS:
      return {
        ...state,
        advertisements: state.advertisements.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a
        )
      };

    case TOGGLE_ADVERTISEMENT_SUCCESS:
      return {
        ...state,
        advertisements: state.advertisements.map((a) =>
          a.id === action.payload ? { ...a, status: a.status === 1 ? 0 : 1 } : a
        )
      };

    case DELETE_ADVERTISEMENT_SUCCESS:
      return {
        ...state,
        advertisements: state.advertisements.filter((a) => a.id !== action.payload)
      };

    case ADMIN_LOGIN_SUCCESS: {
      if (typeof window !== 'undefined') {
        localStorage.setItem('jsr_admin_user', JSON.stringify(action.payload));
      }
      return {
        ...state,
        adminUser: action.payload,
        isAdminAuthenticated: true,
        error: null
      };
    }

    case ADMIN_LOGOUT_SUCCESS: {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jsr_admin_user');
      }
      return {
        ...state,
        adminUser: null,
        isAdminAuthenticated: false
      };
    }

    case CREATE_COUPON_SUCCESS:
      return {
        ...state,
        coupons: [action.payload, ...state.coupons.filter(c => c.code !== action.payload.code)]
      };

    case TOGGLE_COUPON_SUCCESS:
      return {
        ...state,
        coupons: state.coupons.map(c =>
          c.id === action.payload ? { ...c, status: c.status === 1 ? 0 : 1 } : c
        )
      };

    case DELETE_COUPON_SUCCESS:
      return {
        ...state,
        coupons: state.coupons.filter(c => c.id !== action.payload)
      };

    case CREATE_DELIVERY_AREA_SUCCESS:
      return {
        ...state,
        deliveryAreas: [action.payload, ...state.deliveryAreas.filter(a => a.pincode !== action.payload.pincode)]
      };

    case TOGGLE_DELIVERY_AREA_SUCCESS:
      return {
        ...state,
        deliveryAreas: state.deliveryAreas.map(a =>
          a.id === action.payload ? { ...a, status: a.status === 1 ? 0 : 1 } : a
        )
      };

    case DELETE_DELIVERY_AREA_SUCCESS:
      return {
        ...state,
        deliveryAreas: state.deliveryAreas.filter(a => a.id !== action.payload)
      };

    default:
      return state;
  }
};

const initialAlertState = {
  alert: null // { type: 'success' | 'error' | 'warning' | 'info', title, message }
};

export const alertReducer = (state = initialAlertState, action) => {
  switch (action.type) {
    case SHOW_ALERT:
      return { ...state, alert: action.payload };

    case HIDE_ALERT:
      return { ...state, alert: null };

    default:
      return state;
  }
};

// ------------------------------------------------------------------
// User Authentication & Profile Reducer
// ------------------------------------------------------------------
const getStoredUser = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('jsr_auth_user');
      if (saved) return JSON.parse(saved);
      const loggedOut = localStorage.getItem('jsr_auth_logged_out');
      if (loggedOut === 'true') {
        return null;
      }
    } catch (e) {
      console.warn('Error reading jsr_auth_user', e);
    }
  }
  return initialUser;
};

const initialAuthState = {
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),
  addresses: initialAddresses,
  userOrders: initialUserOrders,
  isLoading: false,
  error: null
};

export const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      if (typeof window !== 'undefined') {
        localStorage.setItem('jsr_auth_user', JSON.stringify(action.payload));
        localStorage.removeItem('jsr_auth_logged_out');
      }
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        addresses: state.addresses.length > 0 ? state.addresses : initialAddresses,
        userOrders: state.userOrders.length > 0 ? state.userOrders : initialUserOrders,
        error: null
      };
    }

    case LOGOUT_SUCCESS: {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jsr_auth_user');
        localStorage.setItem('jsr_auth_logged_out', 'true');
      }
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        addresses: [],
        userOrders: []
      };
    }

    case UPDATE_PROFILE_SUCCESS: {
      const updatedUser = { ...state.user, ...action.payload };
      if (typeof window !== 'undefined') {
        localStorage.setItem('jsr_auth_user', JSON.stringify(updatedUser));
      }
      return {
        ...state,
        user: updatedUser
      };
    }

    case GET_USER_ADDRESSES: {
      return {
        ...state,
        addresses: action.payload?.length > 0 ? action.payload : (state.addresses.length > 0 ? state.addresses : initialAddresses)
      };
    }

    case ADD_ADDRESS_SUCCESS: {
      return {
        ...state,
        addresses: [action.payload, ...state.addresses]
      };
    }

    case UPDATE_ADDRESS_SUCCESS: {
      return {
        ...state,
        addresses: state.addresses.map((addr) =>
          addr.id === action.payload.id ? { ...addr, ...action.payload } : addr
        )
      };
    }

    case DELETE_ADDRESS_SUCCESS: {
      return {
        ...state,
        addresses: state.addresses.filter((addr) => addr.id !== action.payload)
      };
    }

    case SET_DEFAULT_ADDRESS_SUCCESS: {
      return {
        ...state,
        addresses: state.addresses.map((addr) => ({
          ...addr,
          is_default: addr.id === action.payload
        }))
      };
    }

    case CREATE_ORDER_SUCCESS: {
      const newOrder = action.payload.data || action.payload;
      return {
        ...state,
        userOrders: [newOrder, ...state.userOrders]
      };
    }

    default:
      return state;
  }
};