import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import HomePageFixed from './pages/HomePageFixed';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import FavoritesPage from './pages/FavoritesPage';
import PaymentPage from './pages/PaymentPage';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { FavoritesProvider } from './context/FavoritesContext';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <FavoritesProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>                    <Route index element={<HomePageFixed />} />
                    <Route path="product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes */}
                    <Route path='' element={<ProtectedRoute />}>                      <Route path='/checkout' element={<CheckoutPage />} />
                      <Route path='/profile' element={<ProfilePage />} />
                    </Route>
                  </Route>
                </Routes>
              </FavoritesProvider>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
