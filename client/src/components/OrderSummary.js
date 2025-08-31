import React from 'react';
import { Typography, List, ListItem, ListItemText, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const OrderSummary = ({ shippingAddress, paymentMethod }) => {
  const { t } = useTranslation();
  const { cart, getCartTotal } = useCart();

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {t('order_summary')}
      </Typography>
      <List disablePadding>
        {cart.map((product) => (
          <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
            <ListItemText primary={product.name} secondary={`${t('quantity')}: ${product.quantity}`} />
            <Typography variant="body2">${(product.price * product.quantity).toFixed(2)}</Typography>
          </ListItem>
        ))}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={t('total')} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${getCartTotal()}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            {t('shipping')}
          </Typography>
          <Typography gutterBottom>{`${shippingAddress.address}, ${shippingAddress.city}`}</Typography>
          <Typography gutterBottom>{`${shippingAddress.postalCode}, ${shippingAddress.country}`}</Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            {t('payment_details')}
          </Typography>
          <Grid container>
            <Grid item xs={6}>
              <Typography gutterBottom>{t('payment_method')}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>{paymentMethod}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default OrderSummary;
