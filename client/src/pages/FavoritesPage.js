import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  borderRadius: 16,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const FavoritesPage = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    showNotification('تمت إضافة المنتج إلى السلة', 'success');
  };

  const handleRemoveFromFavorites = (productId) => {
    removeFromFavorites(productId);
    showNotification('تمت الإزالة من المفضلة', 'info');
  };

  if (favorites.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Box sx={{ maxWidth: 400, mx: 'auto' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#8B4513', fontWeight: 700 }}>
            ❤️ المفضلة فارغة
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            لم تقم بإضافة أي منتجات مغربية إلى المفضلة بعد
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            size="large"
            sx={{
              backgroundColor: '#8B4513',
              color: 'white',
              borderRadius: 3,
              px: 4,
              py: 1.5,
              mt: 2,
              '&:hover': { backgroundColor: '#CD853F' }
            }}
          >
            اكتشف منتجاتنا المغربية
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#8B4513', fontWeight: 700 }}>
            ❤️ منتجاتك المفضلة
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            لديك {favorites.length} منتج مغربي في المفضلة
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {favorites.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="250"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50' }}>
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
                      <FavoriteIcon sx={{ color: '#ffc107', fontSize: 16 }} />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {product.rating}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleAddToCart(product)}
                      fullWidth
                      sx={{
                        backgroundColor: '#8B4513',
                        color: 'white',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: '#CD853F' }
                      }}
                    >
                      أضف للسلة
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveFromFavorites(product._id)}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        '&:hover': { bgcolor: 'error.light', color: 'white' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FavoritesPage;
