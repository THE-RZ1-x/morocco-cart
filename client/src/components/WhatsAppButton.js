import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useTranslation } from 'react-i18next';

const WhatsAppButton = ({ 
  phoneNumber = "+212600000000", 
  message = "مرحبا، أحتاج مساعدة في التسوق",
  position = { bottom: 20, right: 20 }
}) => {
  const { t } = useTranslation();

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Tooltip title={t('contact_whatsapp', 'تواصل معنا عبر واتساب')} placement="left">
      <Fab
        color="success"
        aria-label="WhatsApp"
        onClick={handleWhatsAppClick}
        sx={{
          position: 'fixed',
          bottom: position.bottom,
          right: position.right,
          backgroundColor: '#25D366',
          '&:hover': {
            backgroundColor: '#128C7E',
          },
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
        }}
      >
        <WhatsAppIcon />
      </Fab>
    </Tooltip>
  );
};

export default WhatsAppButton;