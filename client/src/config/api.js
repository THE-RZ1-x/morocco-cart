const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default {
  API_URL,
  ENDPOINTS: {
    PRODUCTS: `${API_URL}/api/products`,
    PRODUCT: `${API_URL}/api/products`,
    AUTH: `${API_URL}/api/auth`,
    USERS: `${API_URL}/api/users`,
    ORDERS: `${API_URL}/api/orders`,
    UPLOAD: `${API_URL}/api/upload`,
  }
};
