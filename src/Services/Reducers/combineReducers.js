import { combineReducers } from 'redux';
import {
  productReducer,
  cartReducer,
  orderReducer,
  adminReducer,
  alertReducer,
  authReducer
} from './reducer';

const rootReducer = combineReducers({
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
  admin: adminReducer,
  alert: alertReducer,
  auth: authReducer
});

export default rootReducer;