import React from 'react';
import { Box, CircularProgress, Typography, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ 
  message, 
  size = 40, 
  showLogo = false, 
  fullScreen = false,
  variant = 'circular' // 'circular', 'skeleton', 'dots'
}) => {
  const { t } = useTranslation();

  const defaultMessage = t('loading', 'جاري التحميل...');

  if (variant === 'skeleton') {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={20} />
      </Box>
    );
  }

  if (variant === 'dots') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: fullScreen ? '100vh' : '200px',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: 'bounce 1.4s ease-in-out infinite both',
                animationDelay: `${index * 0.16}s`,
                '@keyframes bounce': {
                  '0%, 80%, 100%': {
                    transform: 'scale(0)',
                  },
                  '40%': {
                    transform: 'scale(1.0)',
                  },
                },
              }}
            />
          ))}
        </Box>
        {message && (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: fullScreen ? '100vh' : '200px',
        flexDirection: 'column',
        gap: 2
      }}
    >
      {showLogo && (
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            mb: 1
          }}
        >
          {t('app_name', 'ماروك كارت')}
        </Typography>
      )}
      
      <CircularProgress 
        size={size} 
        thickness={4}
        sx={{
          color: 'primary.main',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      
      {message && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ textAlign: 'center', maxWidth: 300 }}
        >
          {message || defaultMessage}
        </Typography>
      )}
    </Box>
  );
};

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2, borderRadius: 1 }} />
    <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Skeleton variant="rectangular" width="48%" height={36} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width="48%" height={36} sx={{ borderRadius: 1 }} />
    </Box>
  </Box>
);

// Page Loading with brand
export const PageLoading = ({ message }) => (
  <LoadingSpinner 
    message={message} 
    showLogo={true} 
    fullScreen={true} 
    size={60}
  />
);

export default LoadingSpinner;