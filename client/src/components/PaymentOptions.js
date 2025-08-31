import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  TextField,
  Grid,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const PaymentOptions = ({ selectedPayment, onPaymentChange, onPaymentDataChange }) => {
  const { t } = useTranslation();
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handlePaymentMethodChange = (event) => {
    onPaymentChange(event.target.value);
  };

  const handleCardDataChange = (field, value) => {
    const newCardData = { ...cardData, [field]: value };
    setCardData(newCardData);
    onPaymentDataChange(newCardData);
  };

  const paymentMethods = [
    {
      id: 'cod',
      name: t('cash_on_delivery', 'الدفع عند الاستلام'),
      description: t('cod_description', 'ادفع نقداً عند وصول طلبك'),
      icon: <LocalShippingIcon />,
      popular: true,
      fees: t('no_fees', 'بدون رسوم إضافية')
    },
    {
      id: 'card',
      name: t('credit_debit_card', 'بطاقة ائتمان/خصم'),
      description: t('card_description', 'Visa, Mastercard, CMI'),
      icon: <CreditCardIcon />,
      popular: false,
      fees: t('secure_payment', 'دفع آمن ومشفر')
    },
    {
      id: 'bank_transfer',
      name: t('bank_transfer', 'تحويل بنكي'),
      description: t('bank_transfer_description', 'تحويل مباشر من حسابك البنكي'),
      icon: <AccountBalanceIcon />,
      popular: false,
      fees: t('processing_time', 'يستغرق 1-2 أيام عمل')
    }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('payment_method', 'طريقة الدفع')}
      </Typography>
      
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          value={selectedPayment}
          onChange={handlePaymentMethodChange}
        >
          {paymentMethods.map((method) => (
            <Card 
              key={method.id}
              variant="outlined" 
              sx={{ 
                mb: 2,
                border: selectedPayment === method.id ? 2 : 1,
                borderColor: selectedPayment === method.id ? 'primary.main' : 'divider',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 1
                }
              }}
              onClick={() => onPaymentChange(method.id)}
            >
              <CardContent>
                <FormControlLabel
                  value={method.id}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ mr: 2, color: 'primary.main' }}>
                        {method.icon}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {method.name}
                          </Typography>
                          {method.popular && (
                            <Chip 
                              label={t('popular', 'الأكثر استخداماً')} 
                              size="small" 
                              color="primary" 
                              sx={{ ml: 1, fontSize: '0.75rem' }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {method.description}
                        </Typography>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 500 }}>
                          {method.fees}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ margin: 0, width: '100%' }}
                />
              </CardContent>
            </Card>
          ))}
        </RadioGroup>
      </FormControl>

      {/* Cash on Delivery Info */}
      {selectedPayment === 'cod' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            {t('cod_info', 'سيتم تحصيل المبلغ نقداً عند تسليم الطلب. يرجى التأكد من توفر المبلغ المطلوب.')}
          </Typography>
        </Alert>
      )}

      {/* Credit Card Form */}
      {selectedPayment === 'card' && (
        <Card variant="outlined" sx={{ mt: 2, p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {t('card_details', 'بيانات البطاقة')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('cardholder_name', 'اسم حامل البطاقة')}
                value={cardData.cardholderName}
                onChange={(e) => handleCardDataChange('cardholderName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('card_number', 'رقم البطاقة')}
                value={cardData.cardNumber}
                onChange={(e) => {
                  // Format card number with spaces
                  const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                  if (value.replace(/\s/g, '').length <= 16) {
                    handleCardDataChange('cardNumber', value);
                  }
                }}
                placeholder="1234 5678 9012 3456"
                inputProps={{ maxLength: 19 }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('expiry_date', 'تاريخ الانتهاء')}
                value={cardData.expiryDate}
                onChange={(e) => {
                  // Format MM/YY
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                  }
                  handleCardDataChange('expiryDate', value);
                }}
                placeholder="MM/YY"
                inputProps={{ maxLength: 5 }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('cvv', 'رمز الأمان')}
                value={cardData.cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 3) {
                    handleCardDataChange('cvv', value);
                  }
                }}
                placeholder="123"
                inputProps={{ maxLength: 3 }}
                required
              />
            </Grid>
          </Grid>
          
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              {t('secure_payment_info', 'جميع المعاملات مشفرة ومحمية بأعلى معايير الأمان')}
            </Typography>
          </Alert>
        </Card>
      )}

      {/* Bank Transfer Info */}
      {selectedPayment === 'bank_transfer' && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            {t('bank_transfer_info', 'سيتم إرسال تفاصيل التحويل البنكي إلى بريدك الإلكتروني بعد تأكيد الطلب.')}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default PaymentOptions;