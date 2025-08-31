import React, { useState } from 'react';
import { Container, Typography, Stepper, Step, StepLabel, Button, Box, CircularProgress, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import ShippingAddressForm from '../components/ShippingAddressForm';
import PaymentForm from '../components/PaymentForm';
import OrderSummary from '../components/OrderSummary';

const steps = ['shipping_address', 'payment_method', 'place_order'];

function getStepContent(step, t, address, setAddress, paymentMethod, setPaymentMethod) {
  switch (step) {
    case 0:
      return <ShippingAddressForm address={address} setAddress={setAddress} />;
    case 1:
      return <PaymentForm paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />;
    case 2:
      return <OrderSummary shippingAddress={address} paymentMethod={paymentMethod} />;
    default:
      throw new Error('Unknown step');
  }
}

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { cart, getCartTotal, clearCart } = useCart();
  const { loading, error, createOrder } = useOrder();

  const [activeStep, setActiveStep] = useState(0);
  // Retrieve from local storage or set default
  const [shippingAddress, setShippingAddress] = useState(() => {
      const saved = localStorage.getItem('shippingAddress');
      return saved ? JSON.parse(saved) : {};
  });
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const handleNext = async () => {
    if (activeStep === 0) {
        // Save shipping address to local storage
        localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    }

    if (activeStep === steps.length - 1) {
      // This is the 'Place Order' step
      const orderData = {
        orderItems: cart.map(item => ({...item, product: item._id})),
        shippingAddress,
        paymentMethod,
        itemsPrice: getCartTotal(),
        taxPrice: (getCartTotal() * 0.15).toFixed(2), // Example tax
        shippingPrice: (getCartTotal() > 100 ? 0 : 10).toFixed(2), // Example shipping
        totalPrice: (parseFloat(getCartTotal()) + parseFloat((getCartTotal() * 0.15).toFixed(2)) + parseFloat((getCartTotal() > 100 ? 0 : 10).toFixed(2))).toFixed(2),
      };
      try {
        const createdOrder = await createOrder(orderData);
        if(createdOrder) {
            clearCart();
            setActiveStep((prev) => prev + 1);
        }
      } catch (err) {
        // error is already set in context, just log it
        console.error(err);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        {t('checkout')}
      </Typography>
      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{t(label)}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <React.Fragment>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography variant="h5" gutterBottom>
              {t('order_success_title')}
            </Typography>
            <Typography variant="subtitle1">
              {t('order_success_message')}
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            {getStepContent(activeStep, t, shippingAddress, setShippingAddress, paymentMethod, setPaymentMethod)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                  {t('back')}
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ mt: 3, ml: 1 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : (activeStep === steps.length - 1 ? t('place_order') : t('next'))}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </React.Fragment>
    </Container>
  );
};

export default CheckoutPage;
