import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  InputAdornment,
  Skeleton,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #8B4513 0%, #CD853F 100%)',
  color: 'white',
  py: 8,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  borderRadius: 16,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const HomePageFixed = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products?pageNumber=${currentPage}&pageSize=${itemsPerPage}`
        );
        setProducts(response.data.products || response.data);
        setLoading(false);
      } catch (err) {
        setError('فشل في تحميل المنتجات');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products || []);
    }
  }, [products, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = searchTerm.trim();
    if (searchQuery) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const categories = [
    { name: 'الزيوت الطبيعية', icon: '🌿', color: '#8B4513' },
    { name: 'الأحذية التقليدية', icon: '👞', color: '#CD853F' },
    { name: 'الديكور المنزلي', icon: '🏺', color: '#DEB887' },
    { name: 'الأواني التقليدية', icon: '🍲', color: '#D2691E' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                مرحباً بكم في MarocCart
              </Typography>
              <Typography variant="h5" paragraph sx={{ opacity: 0.9, mb: 4 }}>
                اكتشف أصالة المنتجات المغربية التقليدية
              </Typography>
              
              <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="ابحث عن منتجات مغربية..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ 
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#c0392b' }
                  }}
                >
                  تسوق الآن
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  عرض المزيد
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop"
                alt="منتجات مغربية أصيلة"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: 8,
                  transform: 'rotate(2deg)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'rotate(0deg)' }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Featured Moroccan Products Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 700, mb: 6, color: '#2c3e50' }}>
          منتجات مغربية أصيلة
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 4 }} />
              </Grid>
            ))}
          </Grid>
        ) : filteredProducts.length > 0 ? (
          <Grid container spacing={4}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <ProductCard>
                  <CardMedia
                    component="img"
                    height="250"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden' }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        {product.priceMAD} درهم
                      </Typography>
                      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                        <StarIcon sx={{ color: '#ffc107', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {product.rating} ({product.numReviews})
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        onClick={() => addToCart(product)}
                        sx={{ borderRadius: 2, backgroundColor: '#e74c3c', '&:hover': { backgroundColor: '#c0392b' } }}
                      >
                        أضف للسلة
                      </Button>
                      <IconButton 
                        size="small" 
                        sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}
                        onClick={() => toggleFavorite(product)}
                      >
                        <FavoriteIcon 
                          fontSize="small" 
                          sx={{ color: isFavorite(product._id) ? '#e74c3c' : 'inherit' }}
                        />
                      </IconButton>
                    </Box>
                  </CardContent>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" textAlign="center" color="text.secondary">
            لا توجد منتجات مغربية متاحة حالياً
          </Typography>
        )}
      </Container>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
          تصنيفات المنتجات
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.name}>
              <Box
                sx={{
                  backgroundColor: category.color,
                  color: 'white',
                  p: 4,
                  borderRadius: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'translateY(-8px)' }
                }}
              >
                <Typography variant="h4" sx={{ mb: 2 }}>
                  {category.icon}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {category.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
                اكتشف أصالة المغرب
              </Typography>
              <Typography variant="h6" color="text.secondary">
                استمتع بأجود المنتجات المغربية التقليدية بأفضل الأسعار
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate('/register')}
                sx={{
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  backgroundColor: '#e74c3c',
                  '&:hover': { backgroundColor: '#c0392b' }
                }}
              >
                تسوق الآن
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePageFixed;
