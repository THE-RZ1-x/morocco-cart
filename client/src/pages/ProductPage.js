import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API from '../config/api';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
// import StarIcon from '@mui/icons-material/Star';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ProductCard from '../components/ProductCard';

const ProductPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const { currentUser, wishlist, addToWishlist, removeFromWishlist } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratings, setRatings] = useState([]);

  // Check if product is in wishlist
  const isInWishlist = wishlist?.some(item => item._id === product?._id) || false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API.ENDPOINTS.PRODUCT}/${id}`);
        setProduct(data);
      } catch (err) {
        setError(t('product_not_found'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, t]);

  useEffect(() => {
    if (product) {
      const fetchRelatedProducts = async () => {
        try {
          const { data } = await axios.get(API.ENDPOINTS.PRODUCTS);
          const filtered = data.filter(
            (p) => p.category === product.category && p._id !== product._id
          );
          setRelatedProducts(filtered.slice(0, 4)); // Show up to 4 related products
        } catch (err) {
          console.error('Failed to fetch related products:', err);
        }
      };
      fetchRelatedProducts();
    }
  }, [product]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 8 }} />;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 8 }}>{error}</Alert>;
  }

  if (!product) {
    return null; // Should be handled by loading/error states
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      showNotification('تمت إضافة المنتج إلى السلة', 'success');
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
  };

  const handleSubmitRating = () => {
    if (userRating > 0) {
      const newRating = {
        rating: userRating,
        comment: ratingComment,
        userName: 'مستخدم',
        date: new Date().toLocaleDateString('ar-SA')
      };
      setRatings([...ratings, newRating]);
      setUserRating(0);
      setRatingComment('');
      showNotification('شكراً لتقييمك!', 'success');
    }
  };

  return (
    <Container sx={{ py: 8 }}>
      <Grid container spacing={{ xs: 2, md: 6 }}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 2,
              boxShadow: 3,
            }}
            alt={product.name}
            src={product.image}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography component="h1" variant="h3" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3rem' } }}>
            {product.name}
          </Typography>
          <Typography variant="h4" color="primary" paragraph sx={{ fontWeight: 'bold', fontSize: { xs: '1.8rem', sm: '2.1rem', md: '2.25rem' } }}>
            {product.price} {t('currency_mad')}
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', flexGrow: 1 }}>
            {product.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Quantity Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mr: 3 }}>{t('quantity_label')}:</Typography>
            <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))} size="small">
              <RemoveCircleOutlineIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mx: 2, minWidth: '2rem', textAlign: 'center' }}>{quantity}</Typography>
            <IconButton onClick={() => setQuantity(q => q + 1)} size="small">
              <AddCircleOutlineIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <Button variant="contained" size="large" sx={{ flex: 1, py: 1.5 }} onClick={handleAddToCart}>
              أضف إلى السلة
            </Button>
            <IconButton
              onClick={handleToggleFavorite}
              sx={{
                border: 1,
                borderColor: 'divider',
                color: isFavorite(product._id) ? 'error.main' : 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                }
              }}
            >
              {isFavorite(product._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            {currentUser && (
              <IconButton
                onClick={() => isInWishlist ? removeFromWishlist(product._id) : addToWishlist(product)}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  color: isInWishlist ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  }
                }}
              >
                {isInWishlist ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            )}
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Rating value={4.5} precision={0.5} readOnly size="medium" />
              <Typography variant="body2" color="text.secondary">
                (4.5 من 5 - 128 تقييم)
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Ratings and Reviews Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          التقييمات والمراجعات
        </Typography>
        
        {/* Add Rating Form */}
        <Card sx={{ mb: 4, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              أضف تقييمك
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>التقييم:</Typography>
              <Rating
                value={userRating}
                onChange={(event, newValue) => setUserRating(newValue)}
                size="large"
                sx={{ mb: 2 }}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="شاركنا رأيك عن هذا المنتج"
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSubmitRating}
              disabled={userRating === 0}
            >
              أرسل التقييم
            </Button>
          </CardContent>
        </Card>

        {/* Display Ratings */}
        {ratings.length > 0 && (
          <Box>
            {ratings.map((rating, index) => (
              <Card key={index} sx={{ mb: 2, boxShadow: 1 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {rating.userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {rating.date}
                    </Typography>
                  </Box>
                  <Rating value={rating.rating} readOnly size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {rating.comment}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, fontSize: { xs: '1.8rem', sm: '2rem' } }}>
            منتجات قد تعجبك
          </Typography>
          <Grid container spacing={4}>
            {relatedProducts.map((relatedProduct) => (
              <Grid item key={relatedProduct._id} xs={12} sm={6} md={3}>
                <ProductCard 
                  product={relatedProduct}
                  onWishlistToggle={toggleFavorite}
                  isWishlisted={isFavorite(relatedProduct._id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductPage;
