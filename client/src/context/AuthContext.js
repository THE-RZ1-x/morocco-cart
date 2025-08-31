import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfoFromStorage) {
      setCurrentUser(userInfoFromStorage);
      
      // Load wishlist if user is logged in
      loadWishlist(userInfoFromStorage.token);
    }
    setLoading(false);
  }, []);

  const loadWishlist = async (token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/wishlist`,
        config
      );
      
      setWishlist(data);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const register = async (name, email, password, referralCode = null) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/users/register`,
      { name, email, password, referralCode },
      config
    );
    localStorage.setItem('userInfo', JSON.stringify(data));
    setCurrentUser(data);
    
    // Load wishlist after registration
    if (data.token) {
      loadWishlist(data.token);
    }
    
    return data;
  };

  const login = async (email, password) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/users/login`,
      { email, password },
      config
    );
    localStorage.setItem('userInfo', JSON.stringify(data));
    setCurrentUser(data);
    
    // Load wishlist after login
    if (data.token) {
      loadWishlist(data.token);
    }
    
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setCurrentUser(null);
    setWishlist([]);
  };

  const updateProfile = async (userData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        userData,
        config
      );
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setCurrentUser(data);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/wishlist`,
        { productId },
        config
      );
      
      // Reload wishlist
      await loadWishlist(currentUser.token);
    } catch (error) {
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/users/wishlist/${productId}`,
        config
      );
      
      // Reload wishlist
      await loadWishlist(currentUser.token);
    } catch (error) {
      throw error;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  const getReferralInfo = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/referral`,
        config
      );
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    wishlist,
    login,
    register,
    logout,
    updateProfile,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getReferralInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
