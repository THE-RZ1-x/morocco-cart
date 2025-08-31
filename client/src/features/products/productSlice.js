import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../config/api';

const initialState = {
  products: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  page: 1,
  pages: 1,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ keyword = '', pageNumber = 1, category = '' }, { rejectWithValue }) => {
    try {
      let url = `${API.API_URL}/api/products?keyword=${keyword}&pageNumber=${pageNumber}`;
      if (category && category !== 'All') {
        url += `&category=${category}`;
      }
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || action.error?.message || 'Failed to fetch products';
      });
  },
});

export default productSlice.reducer;
