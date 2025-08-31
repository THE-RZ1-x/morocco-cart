import React from 'react';
import { Box, Typography, Button, Container, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error} 
        resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
      />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, resetError }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRefresh = () => {
    resetError();
    window.location.reload();
  };

  const handleGoHome = () => {
    resetError();
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '60vh',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '6rem', mb: 2, color: 'error.main' }}>
          😵
        </Typography>
        
        <Typography variant="h4" gutterBottom color="error">
          {t('something_went_wrong', 'حدث خطأ ما')}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
          {t('error_message', 'نعتذر، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.')}
        </Typography>

        {process.env.NODE_ENV === 'development' && error && (
          <Alert severity="error" sx={{ mb: 4, textAlign: 'left', width: '100%' }}>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {error.toString()}
            </Typography>
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size="large"
          >
            {t('try_again', 'حاول مرة أخرى')}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            size="large"
          >
            {t('go_home', 'العودة للرئيسية')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ErrorBoundary;