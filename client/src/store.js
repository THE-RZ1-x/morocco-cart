import { configureStore } from '@reduxjs/toolkit';
import productReducer from './features/products/productSlice';
import cartReducer from './features/cart/cartSlice';
import userReducer from './features/user/userSlice';
import orderReducer from './features/orders/orderSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    user: userReducer,
    orders: orderReducer,
  },
});

export default store;
