import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

const WishlistPage = () => {
  const { t } = useTranslation();
  const { currentUser, wishlist, removeFromWishlist } = useAuth();
  const navigate = useNavigate();
  
  if (!currentUser) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="info">
          {t('please_login_to_view_wishlist', 'Please log in to view your wishlist')}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('my_wishlist', 'My Wishlist')}
      </Typography>
      
      {wishlist.length === 0 ? (
        <Alert severity="info">
          {t('wishlist_empty', 'Your wishlist is empty. Start adding products you love!')}
        </Alert>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {t('wishlist_count', 'You have {{count}} items in your wishlist', { count: wishlist.length })}
          </Typography>
          
          <Grid container spacing={3}>
            {wishlist.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {product.priceMAD} MAD
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', padding: 2 }}>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {t('view_details', 'View Details')}
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => removeFromWishlist(product._id)}
                    >
                      {t('remove', 'Remove')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default WishlistPage;
