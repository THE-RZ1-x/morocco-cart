import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const CartPage = () => {
  const { t } = useTranslation();
  const { cart, addToCart, decreaseItemQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>{t('cart_is_empty')}</Typography>
        <Button component={RouterLink} to="/" variant="contained">{t('continue_shopping_button')}</Button>
      </Container>
    );
  }

  const cartTotal = getCartTotal();

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>{t('your_cart_title')}</Typography>
      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} variant="outlined">
            <List>
              {cart.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem sx={{ p: { xs: 1, sm: 2 } }}>
                    <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="center">
                      <Grid item xs={3} sm={2}>
                        <Avatar src={item.image} variant="rounded" sx={{ width: '100%', height: 'auto', aspectRatio: '1 / 1' }} />
                      </Grid>
                      <Grid item xs={9} sm={4}>
                        <ListItemText
                          primary={item.name}
                          secondary={`${t('unit_price')}: ${item.price} ${t('currency_mad')}`}
                          primaryTypographyProps={{ fontWeight: 'bold', component: 'h2', variant: 'h6' }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton onClick={() => decreaseItemQuantity(item)} size="small">
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                          <Typography sx={{ mx: 2, fontWeight: 'bold' }}>{item.quantity}</Typography>
                          <IconButton onClick={() => addToCart(item)} size="small">
                            <AddCircleOutlineIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: { xs: 'left', sm: 'right' } }}>
                          {(item.price * item.quantity).toFixed(2)} {t('currency_mad')}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1} sx={{ textAlign: 'right' }}>
                        <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {index < cart.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              p: 3,
              position: 'sticky',
              top: '88px',
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              {t('order_summary_title', 'Order Summary')}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
              <Typography variant="body1">{t('subtotal')}</Typography>
              <Typography variant="body1">{cartTotal} {t('currency_mad')}</Typography>
            </Box>
            {/* Can add shipping/taxes here later */}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{t('total_price')}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{cartTotal} {t('currency_mad')}</Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={cart.length === 0}
              onClick={() => navigate('/checkout')}
            >
              متابعة إلى الدفع
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
