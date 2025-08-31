import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { useFavorites } from '../context/FavoritesContext';
import { formatPriceSimple } from '../utils/currency';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LazyImage from './ui/LazyImage';

const ProductCard = ({ product, onQuickView, onWishlistToggle, isWishlisted = false }) => {
  const { t } = useTranslation();
  const { addToCart, cart } = useCart();
  const { showSuccess, showError } = useNotification();
  const { toggleFavorite: contextToggleFavorite } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);

  // Check if product is in cart
  const cartItem = cart.find(item => item._id === product._id);
  const isInCart = Boolean(cartItem);
  const cartQuantity = cartItem?.quantity || 0;

  // Check stock availability
  const isOutOfStock = product.countInStock === 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showError(t('out_of_stock', 'المنتج غير متوفر'));
      return;
    }

    if (cartQuantity >= product.countInStock) {
      showError(t('max_quantity_reached', 'تم الوصول للحد الأقصى المتاح'));
      return;
    }

    addToCart(product);
    showSuccess(t('added_to_cart_notification', { productName: product.name }));
  };

  const handleWishlistToggle = () => {
    // استخدام onWishlistToggle إذا تم تمريره، وإلا استخدام FavoritesContext
    if (onWishlistToggle) {
      onWishlistToggle(product);
    } else {
      // إذا لم يتم تمرير onWishlistToggle، نستخدم FavoritesContext مباشرة
      contextToggleFavorite(product);
    }
    
    // عرض رسالة النجاح
    showSuccess(
      isWishlisted 
        ? t('removed_from_wishlist', 'تم الحذف من المفضلة')
        : t('added_to_wishlist', 'تم الإضافة للمفضلة')
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: `${window.location.origin}/product/${product._id}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/product/${product._id}`);
      showSuccess(t('link_copied', 'تم نسخ الرابط'));
    }
  };

  return (
    <Card 
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        color: 'text.primary',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stock Status Badge */}
      {(isOutOfStock || isLowStock) && (
        <Chip
          label={isOutOfStock ? t('out_of_stock', 'نفد المخزون') : t('low_stock', 'مخزون قليل')}
          color={isOutOfStock ? 'error' : 'warning'}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2,
            fontSize: '0.75rem',
          }}
        />
      )}

      {/* Wishlist & Share Actions */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <Tooltip title={isWishlisted ? t('remove_from_wishlist') : t('add_to_wishlist')}>
          <IconButton
            size="small"
            onClick={handleWishlistToggle}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              mb: 1,
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            {isWishlisted ? (
              <FavoriteIcon color="error" fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        
        <Tooltip title={t('share_product', 'مشاركة المنتج')}>
          <IconButton
            size="small"
            onClick={handleShare}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      {/* Product Image */}
      <LazyImage
        src={product.image}
        alt={product.name}
        height={200}
        sx={{ cursor: 'pointer' }}
        onClick={() => onQuickView && onQuickView(product)}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Product Category */}
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {product.category}
        </Typography>

        {/* Product Name */}
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2"
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
          }}
        >
          {product.name}
        </Typography>

        {/* Product Rating */}
        {product.rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <Rating
              value={product.rating}
              precision={0.5}
              size="small"
              readOnly
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              ({product.numReviews})
            </Typography>
          </div>
        )}

        {/* Product Description */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          {product.description}
        </Typography>

        {/* Price */}
        <Typography 
          variant="h6" 
          color="primary" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '1.25rem',
          }}
        >
          {formatPriceSimple(product.priceMAD || product.price)}
        </Typography>

        {/* Stock Info */}
        {!isOutOfStock && (
          <Typography variant="caption" color="text.secondary">
            {t('in_stock', 'متوفر')}: {product.countInStock}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          variant="outlined"
          startIcon={<VisibilityIcon />}
          component={RouterLink} 
          to={`/product/${product._id}`}
          sx={{ flex: 1 }}
        >
          {t('view_button')}
        </Button>
        
        <Badge badgeContent={cartQuantity} color="secondary" invisible={!isInCart}>
          <Button 
            size="small" 
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            sx={{ flex: 1, ml: 1 }}
          >
            {isInCart ? t('add_more', 'إضافة المزيد') : t('add_to_cart_button')}
          </Button>
        </Badge>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
