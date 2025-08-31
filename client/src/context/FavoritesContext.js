import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { showNotification } = useNotification();

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (product) => {
    if (!favorites.find(item => item._id === product._id)) {
      setFavorites([...favorites, product]);
      showNotification('تمت الإضافة إلى المفضلة', 'success');
    }
  };

  const removeFromFavorites = (productId) => {
    setFavorites(favorites.filter(item => item._id !== productId));
    showNotification('تمت الإزالة من المفضلة', 'info');
  };

  const toggleFavorite = (product) => {
    if (favorites.find(item => item._id === product._id)) {
      removeFromFavorites(product._id);
    } else {
      addToFavorites(product);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item._id === productId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
