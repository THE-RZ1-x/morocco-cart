import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showNotification = useCallback((message, severity = 'success', options = {}) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      severity,
      autoHideDuration: options.autoHideDuration || 4000,
      action: options.action,
      ...options
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove notification after duration
    if (notification.autoHideDuration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.autoHideDuration);
    }

    return id;
  }, [removeNotification]);

  const showSuccess = useCallback((message, options) => {
    return showNotification(message, 'success', options);
  }, [showNotification]);

  const showError = useCallback((message, options) => {
    return showNotification(message, 'error', { autoHideDuration: 6000, ...options });
  }, [showNotification]);

  const showWarning = useCallback((message, options) => {
    return showNotification(message, 'warning', options);
  }, [showNotification]);

  const showInfo = useCallback((message, options) => {
    return showNotification(message, 'info', options);
  }, [showNotification]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll,
    notifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Render notifications */}
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={true}
          onClose={() => removeNotification(notification.id)}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            bottom: { xs: 16, sm: 24 + (index * 70) }, // Stack notifications
            zIndex: 9999 + index
          }}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.severity}
            variant="filled"
            action={notification.action}
            sx={{
              minWidth: 300,
              maxWidth: 500,
              boxShadow: 3,
              '& .MuiAlert-message': {
                fontSize: '0.875rem',
                fontWeight: 500
              }
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
