import React, { useState } from 'react';
import { Container, Box, Typography, Paper, Grid, TextField } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import MoroccanPayment from '../components/Payment/MoroccanPayment';

const PaymentPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    phoneNumber: ''
  });

  const totalAmount = cart.reduce((sum, item) => sum + (item.priceMAD * item.qty), 0);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#8B4513', fontWeight: 700, mb: 4 }}>
        إتمام الطلب
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              معلومات الشحن
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="العنوان الكامل"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="المدينة"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="رقم الهاتف"
                  value={shippingInfo.phoneNumber}
                  onChange={(e) => setShippingInfo({...shippingInfo, phoneNumber: e.target.value})}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              ملخص الطلب
            </Typography>
            {cart.map(item => (
              <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">{item.name}</Typography>
                <Typography variant="body2">{item.priceMAD * item.qty} درهم</Typography>
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="h6">الإجمالي</Typography>
              <Typography variant="h6">{totalAmount} درهم</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <MoroccanPayment 
          totalAmount={totalAmount} 
          onPaymentSelect={() => {}} 
          onPaymentSubmit={() => {}} 
        />
      </Box>
    </Container>
  );
};

export default PaymentPage;
