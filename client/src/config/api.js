// Centralized API Configuration
// Following API security requirements: using environment variables
const getApiUrl = () => {
  // Production API URL (you'll need to deploy your backend first)
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || 'https://your-backend-url.railway.app';
  }
  // Development API URL
  return process.env.REACT_APP_API_URL || 'http://localhost:5001';
};

const API_URL = getApiUrl();

const API = {
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

export default API;
