import React, { useState } from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PayPalIcon from '@mui/icons-material/Payment';

const PaymentCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const MoroccanPayment = ({ totalAmount, onPaymentSelect, onPaymentSubmit }) => {
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    phoneNumber: '',
    bankName: '',
    accountNumber: ''
  });

  const paymentMethods = [
    {
      id: 'cod',
      name: 'الدفع عند الاستلام',
      description: 'ادفع نقداً عند استلام طلبك',
      icon: <LocalShippingIcon />,
      color: '#4caf50',
      supported: true
    },
    {
      id: 'cashplus',
      name: 'CashPlus',
      description: 'الدفع الإلكتروني عبر CashPlus',
      icon: <PaymentIcon />,
      color: '#ff6b35',
      supported: true
    },
    {
      id: 'wafa_cash',
      name: 'Wafa Cash',
      description: 'الدفع عبر تطبيق Wafa Cash',
      icon: <PaymentIcon />,
      color: '#1976d2',
      supported: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'الدفع الآمن عبر PayPal',
      icon: <PayPalIcon />,
      color: '#003087',
      supported: true
    },
    {
      id: 'card',
      name: 'بطاقة ائتمان',
      description: 'الدفع ببطاقة Visa أو Mastercard',
      icon: <CreditCardIcon />,
      color: '#1976d2',
      supported: true
    },
    {
      id: 'bank_transfer',
      name: 'التحويل البنكي',
      description: 'الدفع عبر التحويل البنكي',
      icon: <AccountBalanceIcon />,
      color: '#795548',
      supported: true
    }
  ];

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
    onPaymentSelect(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onPaymentSubmit({
      method: selectedMethod,
      details: paymentDetails
    });
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              معلومات البطاقة
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="رقم البطاقة"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="تاريخ الانتهاء"
                  name="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 'cashplus':
        return (
          <Box sx={{ mt: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              سيتم إرسال رابط الدفع إلى هاتفك عبر SMS
            </Alert>
            <TextField
              fullWidth
              label="رقم الهاتف CashPlus"
              name="phoneNumber"
              value={paymentDetails.phoneNumber}
              onChange={handleInputChange}
              placeholder="06XXXXXXXX"
            />
          </Box>
        );

      case 'wafa_cash':
        return (
          <Box sx={{ mt: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              سيتم إرسال رابط الدفع إلى تطبيق Wafa Cash
            </Alert>
            <TextField
              fullWidth
              label="رقم الهاتف Wafa Cash"
              name="phoneNumber"
              value={paymentDetails.phoneNumber}
              onChange={handleInputChange}
              placeholder="06XXXXXXXX"
            />
          </Box>
        );

      case 'bank_transfer':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              معلومات التحويل البنكي
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              سيتم عرض تفاصيل الحساب البنكي بعد تأكيد الطلب
            </Alert>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>البنك:</strong> Attijariwafa Bank
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>رقم الحساب:</strong> 1234567890
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>RIB:</strong> 2301234567890123456789012
              </Typography>
            </Box>
          </Box>
        );

      case 'paypal':
        return (
          <Box sx={{ mt: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              سيتم توجيهك إلى صفحة PayPal الآمنة لإتمام الدفع
            </Alert>
            <TextField
              fullWidth
              label="البريد الإلكتروني PayPal"
              name="email"
              value={paymentDetails.email || ''}
              onChange={handleInputChange}
              placeholder="email@example.com"
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#8B4513', mb: 4 }}>
        اختر طريقة الدفع
      </Typography>
      
      <PaymentCard>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            المبلغ الإجمالي: {totalAmount} درهم
          </Typography>
          
          <RadioGroup value={selectedMethod} onChange={handleMethodChange}>
            <Grid container spacing={2}>
              {paymentMethods.map((method) => (
                <Grid item xs={12} sm={6} key={method.id}>
                  <FormControlLabel
                    value={method.id}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ color: method.color }}>
                          {method.icon}
                        </Box>
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {method.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {method.description}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{
                      width: '100%',
                      p: 2,
                      border: 1,
                      borderColor: selectedMethod === method.id ? method.color : 'divider',
                      borderRadius: 2,
                      bgcolor: selectedMethod === method.id ? `${method.color}10` : 'transparent',
                      '&:hover': {
                        bgcolor: `${method.color}05`
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </RadioGroup>

          <Divider sx={{ my: 3 }} />

          {renderPaymentForm()}

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmit}
              sx={{
                backgroundColor: '#8B4513',
                color: 'white',
                borderRadius: 3,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#CD853F'
                }
              }}
            >
              تأكيد الدفع
            </Button>
          </Box>
        </CardContent>
      </PaymentCard>
    </Box>
  );
};

export default MoroccanPayment;
