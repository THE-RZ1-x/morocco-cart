import React from 'react';
import { Typography, FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PaymentForm = ({ paymentMethod, setPaymentMethod }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {t('payment_method')}
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="payment-method"
          name="payment-method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel 
            value="PayPal" 
            control={<Radio />} 
            label={t('paypal_or_credit_card')} 
          />
          <FormControlLabel 
            value="CashOnDelivery" 
            control={<Radio />} 
            label={t('cash_on_delivery')} 
            disabled // Example: disable if not available
          />
        </RadioGroup>
      </FormControl>
    </React.Fragment>
  );
};

export default PaymentForm;
