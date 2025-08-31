import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../context/FavoritesContext';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../features/products/productSlice';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import Fade from '@mui/material/Fade';
import { useDebounce } from '../hooks/useDebounce';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const bannerImages = [
  '/images/tapis.avif',
  '/images/babouches.avif',
  '/images/tajine.avif',
  '/images/lanterne.webp',
  '/images/theiere.avif',
  '/images/argan-oil.avif'
];

const HomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { products, pages, status, error } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useFavorites();

  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];
  
  // Use debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, []);

  useEffect(() => {
    dispatch(fetchProducts({ 
      keyword: debouncedSearchTerm, 
      pageNumber: currentPage, 
      category: selectedCategory === 'All' ? '' : selectedCategory 
    }));
  }, [dispatch, debouncedSearchTerm, currentPage, selectedCategory]);

  // Wishlist handlers
  const handleWishlistToggle = (product) => {
    toggleFavorite(product);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  

  if (status === 'loading') {
    return <LoadingSpinner message={t('loading_products', 'جاري تحميل المنتجات...')} showLogo />;
  }

  if (status === 'failed') {
    return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          mb: 6,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          p: 2,
          backgroundImage: `url(${bannerImages[currentImageIndex]})`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                {t('welcome')}
              </Typography>
              <Typography variant="h5" paragraph sx={{ opacity: 0.9, mb: 4 }}>
                {t('welcome_subtitle')}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                  }}
                >
                  تسوق الآن
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  عروض خاصة
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={bannerImages[currentImageIndex]}
                  alt="Featured Product"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Main Content */}
      <Container sx={{ pb: 8 }} maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <TextField 
            fullWidth
            label={t('search_placeholder')}
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={handleClearSearch}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-focused': {
                  backgroundColor: 'background.paper',
                },
              },
            }}
          />
          
          {/* Search Results Info */}
          {debouncedSearchTerm && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 1, ml: 1 }}
            >
              {t('search_results_for', 'نتائج البحث عن')}: "{debouncedSearchTerm}"
            </Typography>
          )}
        </Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          p: { xs: 1, sm: 2 },
          mb: 6,
          bgcolor: 'action.hover',
          borderRadius: 2,
        }}>
          <ToggleButtonGroup
            value={selectedCategory}
            exclusive
            onChange={(event, newCategory) => {
              if (newCategory !== null) {
                setSelectedCategory(newCategory);
                setCurrentPage(1); // Reset to first page when category changes
              }
            }}
            aria-label="product categories"
          >
            {categories.map(category => (
              <ToggleButton
                key={category}
                value={category}
                aria-label={category}
                sx={{
                  m: 0.5,
                  border: 0,
                  borderRadius: 1,
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                  '&:not(.Mui-selected)': {
                    bgcolor: 'background.paper',
                    color: 'text.secondary',
                  },
                }}
              >
                {t(`category_${category.toLowerCase()}`)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Products Grid */}
        {products.length === 0 && status !== 'loading' ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('no_products_found', 'لم يتم العثور على منتجات')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {debouncedSearchTerm 
                ? t('try_different_search', 'جرب كلمات بحث مختلفة')
                : t('no_products_available', 'لا توجد منتجات متاحة حالياً')
              }
            </Typography>
            {debouncedSearchTerm && (
              <Button variant="outlined" onClick={handleClearSearch}>
                {t('clear_search', 'مسح البحث')}
              </Button>
            )}
          </Box>
        ) : (
          <Fade in={true} timeout={500}>
            <Grid container spacing={3}>
              {products.map((product, index) => (
                <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                  <Fade in={true} timeout={300 + (index * 100)}>
                    <div>
                      <ProductCard 
                        product={product}
                        onWishlistToggle={handleWishlistToggle}
                        isWishlisted={isFavorite(product._id)}
                      />
                    </div>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
