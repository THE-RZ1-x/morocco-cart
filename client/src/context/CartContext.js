import React, { createContext, useReducer, useContext, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.find(item => item._id === action.payload._id);
      if (existingItem) {
        return state.map(item =>
          item._id === action.payload._id
            ? { ...item, qty: item.qty + action.payload.qty }
            : item
        );
      } else {
        return [...state, action.payload];
      }
    }
    case 'REMOVE_FROM_CART':
      return state.filter(item => item._id !== action.payload);
    case 'UPDATE_CART_QTY':
      return state.map(item =>
        item._id === action.payload.id
          ? { ...item, qty: action.payload.qty }
          : item
      );
    case 'CLEAR_CART':
      return [];
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, qty } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateCartQty = (id, qty) => {
    dispatch({ type: 'UPDATE_CART_QTY', payload: { id, qty } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const loadCart = (items) => {
    dispatch({ type: 'LOAD_CART', payload: items });
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.qty, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.priceMAD * item.qty), 0).toFixed(2);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      loadCart,
      getCartCount,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
