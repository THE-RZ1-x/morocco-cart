import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import API from '../config/api';

const OrderContext = createContext();

export const useOrder = () => {
  return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  const { currentUser } = useAuth();

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
      };

      const { data } = await axios.post(API.ENDPOINTS.ORDERS, orderData, config);

      setOrder(data);
      setLoading(false);
      return data;
    } catch (err) {
      const message = 
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  };

  const value = {
    loading,
    error,
    order,
    createOrder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
