import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

const LazyImage = ({ 
  src, 
  alt, 
  height = 200, 
  width = '100%',
  sx = {},
  onClick,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <Box
      ref={imgRef}
      sx={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        ...sx,
      }}
      onClick={onClick}
      {...props}
    >
      {!isInView ? (
        <Skeleton variant="rectangular" width="100%" height="100%" />
      ) : (
        <>
          {!isLoaded && (
            <Skeleton variant="rectangular" width="100%" height="100%" />
          )}
          {hasError ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'grey.500',
                height: '100%',
              }}
            >
              <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
              <span style={{ fontSize: '0.875rem' }}>صورة غير متاحة</span>
            </Box>
          ) : (
            <img
              src={src}
              alt={alt}
              onLoad={handleLoad}
              onError={handleError}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: isLoaded ? 'block' : 'none',
              }}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default LazyImage;