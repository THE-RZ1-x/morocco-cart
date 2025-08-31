import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.userInfo?.token}`,
        },
      };

      const { data } = await axios.post('/api/orders', orderData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create order'
      );
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'orders/getDetails',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo?.token}`,
        },
      };

      const { data } = await axios.get(`/api/orders/${orderId}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get order details'
      );
    }
  }
);

export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo?.token}`,
        },
      };

      const { data } = await axios.get('/api/orders/myorders', config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get orders'
      );
    }
  }
);

export const payOrder = createAsyncThunk(
  'orders/pay',
  async ({ orderId, paymentResult }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.userInfo?.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Payment failed'
      );
    }
  }
);

export const processCheckout = createAsyncThunk(
  'orders/processCheckout',
  async (checkoutData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.userInfo?.token}`,
        },
      };

      const { data } = await axios.post('/api/checkout/process', checkoutData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Checkout failed'
      );
    }
  }
);

export const validateCheckout = createAsyncThunk(
  'orders/validateCheckout',
  async (checkoutData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.userInfo?.token}`,
        },
      };

      const { data } = await axios.post('/api/checkout/validate', checkoutData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Validation failed'
      );
    }
  }
);

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
  checkoutData: null,
  shippingOptions: [],
  taxCalculation: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get order details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get my orders
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Pay order
      .addCase(payOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Process checkout
      .addCase(processCheckout.pending, (state) => {
        state.loading = true;
      })
      .addCase(processCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Validate checkout
      .addCase(validateCheckout.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutData = action.payload;
      })
      .addCase(validateCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
