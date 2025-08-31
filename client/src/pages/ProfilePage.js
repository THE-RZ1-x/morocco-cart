import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { styled } from '@mui/material/styles';

// Styled components for tier display
const TierCard = styled(Card)(({ theme, tier }) => ({
  height: '100%',
  backgroundColor: 
    tier === 'platinum' ? '#e5e4e2' :
    tier === 'gold' ? '#FFD700' :
    tier === 'silver' ? '#C0C0C0' :
    '#CD7F32',
  color: tier === 'gold' ? '#000' : '#fff',
  border: tier === 'platinum' ? '2px solid #d4af37' : 'none',
}));

const TierTitle = styled(Typography)(({ theme, tier }) => ({
  fontWeight: 'bold',
  color: 
    tier === 'gold' ? '#000' :
    tier === 'silver' ? '#fff' :
    tier === 'platinum' ? '#000' : '#fff',
}));

const ProfilePage = () => {
  const { t } = useTranslation();
  const { currentUser, wishlist, getReferralInfo } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [referralInfo, setReferralInfo] = useState(null);
  const [referralLoading, setReferralLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/myorders`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchReferralInfo = async () => {
    setReferralLoading(true);
    try {
      const data = await getReferralInfo();
      setReferralInfo(data);
    } catch (err) {
      console.error('Failed to fetch referral info:', err);
    } finally {
      setReferralLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}?ref=${currentUser.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    alert(t('referral_link_copied', 'Referral link copied to clipboard!'));
  };

  // Tier benefits based on user tier
  const getTierBenefits = (tier) => {
    switch (tier) {
      case 'platinum':
        return [
          t('platinum_benefit_1', '15% discount on all products'),
          t('platinum_benefit_2', 'Free shipping on all orders'),
          t('platinum_benefit_3', 'Priority customer support'),
          t('platinum_benefit_4', 'Exclusive gifts and promotions'),
          t('platinum_benefit_5', 'Personal account manager')
        ];
      case 'gold':
        return [
          t('gold_benefit_1', '10% discount on all products'),
          t('gold_benefit_2', 'Free shipping on orders over 200 MAD'),
          t('gold_benefit_3', 'Priority customer support'),
          t('gold_benefit_4', 'Exclusive promotions')
        ];
      case 'silver':
        return [
          t('silver_benefit_1', '5% discount on all products'),
          t('silver_benefit_2', 'Free shipping on orders over 300 MAD'),
          t('silver_benefit_3', 'Priority processing')
        ];
      default:
        return [
          t('bronze_benefit_1', '2% discount on all products'),
          t('bronze_benefit_2', 'Standard customer support')
        ];
    }
  };

  // Progress to next tier
  const getProgressToNextTier = () => {
    if (!currentUser) return { progress: 0, nextTier: '', requirement: '' };
    
    const { tier, totalSpent, totalOrders } = currentUser;
    
    switch (tier) {
      case 'bronze':
        if (totalOrders >= 5 || totalSpent >= 1000) {
          return { progress: 100, nextTier: 'Silver', requirement: '' };
        } else {
          const progress = Math.max((totalOrders / 5) * 100, (totalSpent / 1000) * 100);
          return { 
            progress, 
            nextTier: 'Silver', 
            requirement: `${Math.max(5 - totalOrders, 0)} ${t('orders_left')} ${t('or')} ${Math.max(1000 - totalSpent, 0)} MAD ${t('spending_left')}` 
          };
        }
      case 'silver':
        if (totalOrders >= 15 || totalSpent >= 3000) {
          return { progress: 100, nextTier: 'Gold', requirement: '' };
        } else {
          const progress = Math.max((totalOrders / 15) * 100, (totalSpent / 3000) * 100);
          return { 
            progress, 
            nextTier: 'Gold', 
            requirement: `${Math.max(15 - totalOrders, 0)} ${t('orders_left')} ${t('or')} ${Math.max(3000 - totalSpent, 0)} MAD ${t('spending_left')}` 
          };
        }
      case 'gold':
        if (totalOrders >= 30 || totalSpent >= 7000) {
          return { progress: 100, nextTier: 'Platinum', requirement: '' };
        } else {
          const progress = Math.max((totalOrders / 30) * 100, (totalSpent / 7000) * 100);
          return { 
            progress, 
            nextTier: 'Platinum', 
            requirement: `${Math.max(30 - totalOrders, 0)} ${t('orders_left')} ${t('or')} ${Math.max(7000 - totalSpent, 0)} MAD ${t('spending_left')}` 
          };
        }
      default:
        return { progress: 100, nextTier: 'Platinum', requirement: '' };
    }
  };

  const { progress, nextTier, requirement } = getProgressToNextTier();

  if (!currentUser) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="info">
          {t('please_login_to_view_profile', 'Please log in to view your profile')}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('profile_page_title', 'My Profile')}
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* User Tier Card */}
        <Grid item xs={12} md={6}>
          <TierCard tier={currentUser.tier}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StarIcon sx={{ mr: 1 }} />
                <TierTitle variant="h5" tier={currentUser.tier}>
                  {t(`${currentUser.tier}_tier`, `${currentUser.tier.charAt(0).toUpperCase() + currentUser.tier.slice(1)} Tier`)}
                </TierTitle>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('current_points', 'Points')}: <strong>{currentUser.points}</strong>
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('total_spent', 'Total Spent')}: <strong>{currentUser.totalSpent} MAD</strong>
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('total_orders', 'Total Orders')}: <strong>{currentUser.totalOrders}</strong>
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('progress_to_next_tier', 'Progress to {{nextTier}} Tier', { nextTier })}: <strong>{Math.round(progress)}%</strong>
              </Typography>
              
              {requirement && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {requirement}
                </Typography>
              )}
              
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                {t('tier_benefits', 'Tier Benefits')}:
              </Typography>
              <ul>
                {getTierBenefits(currentUser.tier).map((benefit, index) => (
                  <li key={index}>
                    <Typography variant="body2">{benefit}</Typography>
                  </li>
                ))}
              </ul>
            </CardContent>
          </TierCard>
        </Grid>
        
        {/* Referral Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShareIcon sx={{ mr: 1 }} />
                <Typography variant="h5">
                  {t('referral_program', 'Referral Program')}
                </Typography>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('your_referral_code', 'Your Referral Code')}: <strong>{currentUser.referralCode}</strong>
              </Typography>
              
              <Button 
                variant="contained" 
                onClick={copyReferralLink}
                sx={{ mb: 2 }}
              >
                {t('copy_referral_link', 'Copy Referral Link')}
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={fetchReferralInfo}
                disabled={referralLoading}
                sx={{ mb: 2, ml: 2 }}
              >
                {referralLoading ? <CircularProgress size={24} /> : t('view_referral_info', 'View Referral Info')}
              </Button>
              
              {referralInfo && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {t('referred_users', 'Referred Users')} ({referralInfo.referredUsers.length})
                  </Typography>
                  {referralInfo.referredUsers.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('name')}</TableCell>
                            <TableCell>{t('email')}</TableCell>
                            <TableCell>{t('date')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {referralInfo.referredUsers.map((user, index) => (
                            <TableRow key={index}>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2">
                      {t('no_referred_users', 'You haven\'t referred any users yet.')}
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Wishlist Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FavoriteIcon sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h5">
                  {t('wishlist', 'Wishlist')} ({wishlist.length})
                </Typography>
              </Box>
              
              {wishlist.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {wishlist.slice(0, 5).map((product) => (
                    <Card key={product._id} sx={{ width: 150 }}>
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{ width: '100%', height: 100, objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="body2" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {product.priceMAD} MAD
                        </Typography>
                        <Button 
                          size="small" 
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          {t('view')}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {wishlist.length > 5 && (
                    <Button 
                      variant="outlined" 
                      onClick={() => navigate('/wishlist')}
                      sx={{ height: 150 }}
                    >
                      {t('view_all_wishlist', 'View All ({{count}})', { count: wishlist.length })}
                    </Button>
                  )}
                </Box>
              ) : (
                <Typography variant="body1">
                  {t('wishlist_empty', 'Your wishlist is empty. Start adding products you love!')}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        {t('my_orders_title', 'My Orders')}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{t('error_fetching_orders', 'Error fetching orders')}</Alert>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table aria-label="orders table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('order_id', 'ID')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('order_date', 'DATE')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('order_total', 'TOTAL')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">{t('order_paid', 'PAID')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">{t('order_delivered', 'DELIVERED')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{order.totalPrice.toFixed(2)} {t('currency_mad')}</TableCell>
                  <TableCell align="center">
                    {order.isPaid ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {order.isDelivered ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ProfilePage;
