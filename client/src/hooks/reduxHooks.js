import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
  validateCartStock,
} from '../features/cart/cartSlice';
import {
  loginUser,
  registerUser,
  logout,
  getUserDetails,
  updateUserProfile,
} from '../features/user/userSlice';
import {
  createOrder,
  getOrderDetails,
  getMyOrders,
  processCheckout,
  validateCheckout,
} from '../features/orders/orderSlice';

// Cart hooks
export const useCart = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);

  return {
    ...cartState,
    addToCart: useCallback(
      (productId, quantity = 1) => dispatch(addToCart({ productId, quantity })),
      [dispatch]
    ),
    removeFromCart: useCallback(
      (productId) => dispatch(removeFromCart(productId)),
      [dispatch]
    ),
    updateQuantity: useCallback(
      (productId, quantity) => dispatch(updateCartQuantity({ productId, quantity })),
      [dispatch]
    ),
    saveShippingAddress: useCallback(
      (address) => dispatch(saveShippingAddress(address)),
      [dispatch]
    ),
    savePaymentMethod: useCallback(
      (method) => dispatch(savePaymentMethod(method)),
      [dispatch]
    ),
    clearCart: useCallback(() => dispatch(clearCart()), [dispatch]),
    validateStock: useCallback(() => dispatch(validateCartStock()), [dispatch]),
  };
};

// User hooks
export const useAuth = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  return {
    ...userState,
    login: useCallback(
      (email, password) => dispatch(loginUser({ email, password })),
      [dispatch]
    ),
    register: useCallback(
      (userData) => dispatch(registerUser(userData)),
      [dispatch]
    ),
    logout: useCallback(() => dispatch(logout()), [dispatch]),
    getUserDetails: useCallback(() => dispatch(getUserDetails()), [dispatch]),
    updateProfile: useCallback(
      (userData) => dispatch(updateUserProfile(userData)),
      [dispatch]
    ),
  };
};

// Order hooks
export const useOrders = () => {
  const dispatch = useDispatch();
  const orderState = useSelector((state) => state.orders);

  return {
    ...orderState,
    createOrder: useCallback(
      (orderData) => dispatch(createOrder(orderData)),
      [dispatch]
    ),
    getOrderDetails: useCallback(
      (orderId) => dispatch(getOrderDetails(orderId)),
      [dispatch]
    ),
    getMyOrders: useCallback(() => dispatch(getMyOrders()), [dispatch]),
    processCheckout: useCallback(
      (checkoutData) => dispatch(processCheckout(checkoutData)),
      [dispatch]
    ),
    validateCheckout: useCallback(
      (checkoutData) => dispatch(validateCheckout(checkoutData)),
      [dispatch]
    ),
  };
};

// Product hooks
export const useProducts = () => {
  const productsState = useSelector((state) => state.products);
  return productsState;
};

// Combined hooks
export const useApp = () => {
  const cart = useCart();
  const auth = useAuth();
  const orders = useOrders();
  const products = useProducts();

  return {
    cart,
    auth,
    orders,
    products,
  };
};
