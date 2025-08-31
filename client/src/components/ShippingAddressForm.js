import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ShippingAddressForm = ({ address, setAddress }) => {
  const { t } = useTranslation();

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {t('shipping_address')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="address"
            name="address"
            label={t('address_line_1')}
            fullWidth
            autoComplete="shipping address-line1"
            variant="standard"
            value={address.address || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label={t('city')}
            fullWidth
            autoComplete="shipping address-level2"
            variant="standard"
            value={address.city || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="postalCode"
            name="postalCode"
            label={t('postal_code')}
            fullWidth
            autoComplete="shipping postal-code"
            variant="standard"
            value={address.postalCode || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label={t('country')}
            fullWidth
            autoComplete="shipping country"
            variant="standard"
            value={address.country || ''}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default ShippingAddressForm;
