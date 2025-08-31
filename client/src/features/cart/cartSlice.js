import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/${productId}`);
      
      return {
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.priceMAD,
        countInStock: data.countInStock,
        quantity,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/${productId}`);
      
      if (data.countInStock < quantity) {
        throw new Error(`Only ${data.countInStock} items available`);
      }
      
      return { productId, quantity };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update quantity');
    }
  }
);

export const validateCartStock = createAsyncThunk(
  'cart/validateStock',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { cart } = getState();
      const items = cart.cartItems.map(item => ({
        productId: item.product,
        quantity: item.quantity,
      }));

      const { data } = await axios.post('/api/stock/check', { items });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to validate stock');
    }
  }
);

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: localStorage.getItem('paymentMethod') || 'cash',
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  stockValidation: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        item => item.product !== action.payload
      );
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      localStorage.removeItem('cartItems');
      localStorage.removeItem('shippingAddress');
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const item = action.payload;
        const existingItem = state.cartItems.find(
          (x) => x.product === item.product
        );

        if (existingItem) {
          state.cartItems = state.cartItems.map((x) =>
            x.product === existingItem.product ? item : x
          );
        } else {
          state.cartItems = [...state.cartItems, item];
        }
        
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { productId, quantity } = action.payload;
        state.cartItems = state.cartItems.map(item =>
          item.product === productId
            ? { ...item, quantity }
            : item
        );
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      })
      
      // Validate stock
      .addCase(validateCartStock.fulfilled, (state, action) => {
        state.stockValidation = action.payload;
      })
      
      // Calculate prices
      .addMatcher(
        (action) => action.type.startsWith('cart/'),
        (state) => {
          state.itemsPrice = state.cartItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );
          state.shippingPrice = state.itemsPrice > 500 ? 0 : 30;
          state.taxPrice = Number((state.itemsPrice * 0.2).toFixed(2));
          state.totalPrice =
            state.itemsPrice + state.shippingPrice + state.taxPrice;
        }
      );
  },
});

export const {
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
  setError,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
