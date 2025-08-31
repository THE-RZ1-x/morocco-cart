import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  Button,
  TextField,
  Card,
  CardContent,
  Avatar,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  LinearProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import { formatPriceSimple } from '../utils/currency';

const ProductReviews = ({ product, reviews = [], onAddReview }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(review => Math.floor(review.rating) === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(review => Math.floor(review.rating) === star).length / reviews.length) * 100 : 0
  }));

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  const handleSubmitReview = async () => {
    if (!currentUser) {
      showError(t('login_required', 'يجب تسجيل الدخول لإضافة تقييم'));
      return;
    }

    if (rating === 0) {
      showError(t('rating_required', 'يرجى اختيار تقييم'));
      return;
    }

    if (comment.trim().length < 10) {
      showError(t('comment_too_short', 'يجب أن يكون التعليق 10 أحرف على الأقل'));
      return;
    }

    setLoading(true);
    try {
      await onAddReview({
        rating,
        comment: comment.trim(),
        productId: product._id
      });
      
      setRating(0);
      setComment('');
      setOpen(false);
      showSuccess(t('review_added', 'تم إضافة تقييمك بنجاح'));
    } catch (error) {
      showError(t('review_error', 'حدث خطأ في إضافة التقييم'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box>
      {/* Reviews Summary */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('customer_reviews', 'آراء العملاء')}
        </Typography>
        
        {reviews.length > 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
                  {averageRating.toFixed(1)}
                </Typography>
                <Rating value={averageRating} precision={0.1} readOnly size="large" />
                <Typography variant="body2" color="text.secondary">
                  {t('based_on_reviews', 'بناءً على {{count}} تقييم', { count: reviews.length })}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Box sx={{ p: 2 }}>
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ minWidth: 60 }}>
                      {star} <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{ flexGrow: 1, mx: 2, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" sx={{ minWidth: 40 }}>
                      {count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info">
            {t('no_reviews_yet', 'لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!')}
          </Alert>
        )}
      </Box>

      {/* Add Review Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          disabled={!currentUser}
        >
          {t('write_review', 'اكتب تقييماً')}
        </Button>
        {!currentUser && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
            {t('login_to_review', 'سجل دخولك لإضافة تقييم')}
          </Typography>
        )}
      </Box>

      {/* Reviews List */}
      <Box>
        {reviews.map((review, index) => (
          <Card key={review._id || index} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {review.name}
                    </Typography>
                    <Chip 
                      label={t('verified_purchase', 'مشترٍ موثق')} 
                      size="small" 
                      color="success" 
                      sx={{ ml: 1, fontSize: '0.75rem' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {formatDate(review.createdAt || new Date())}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {review.comment}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Add Review Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('add_review_title', 'إضافة تقييم للمنتج')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('your_rating', 'تقييمك')}
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label={t('your_review', 'رأيك في المنتج')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('review_placeholder', 'شاركنا تجربتك مع هذا المنتج...')}
              helperText={`${comment.length}/500 ${t('characters', 'حرف')}`}
              inputProps={{ maxLength: 500 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            {t('cancel', 'إلغاء')}
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={loading || rating === 0 || comment.trim().length < 10}
          >
            {loading ? t('submitting', 'جاري الإرسال...') : t('submit_review', 'إرسال التقييم')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductReviews;