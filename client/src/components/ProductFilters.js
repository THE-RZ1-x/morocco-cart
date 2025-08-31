import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  Button,
  Typography,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Divider,
  IconButton,
  Badge,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import { formatPriceSimple } from '../utils/currency';

const ProductFilters = ({ 
  filters, 
  onFiltersChange, 
  categories = [],
  priceRange = { min: 0, max: 10000 },
  onClearFilters 
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceValues, setPriceValues] = useState([
    filters.minPrice || priceRange.min,
    filters.maxPrice || priceRange.max
  ]);

  useEffect(() => {
    setLocalFilters(filters);
    setPriceValues([
      filters.minPrice || priceRange.min,
      filters.maxPrice || priceRange.max
    ]);
  }, [filters, priceRange]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    if (!isMobile) {
      // Apply filters immediately on desktop
      onFiltersChange(newFilters);
    }
  };

  const handlePriceChange = (event, newValue) => {
    setPriceValues(newValue);
    const newFilters = {
      ...localFilters,
      minPrice: newValue[0],
      maxPrice: newValue[1]
    };
    setLocalFilters(newFilters);
    
    if (!isMobile) {
      onFiltersChange(newFilters);
    }
  };

  const applyFilters = () => {
    onFiltersChange({
      ...localFilters,
      minPrice: priceValues[0],
      maxPrice: priceValues[1]
    });
    setDrawerOpen(false);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      rating: '',
      sortBy: 'newest',
      inStock: false
    };
    setLocalFilters(clearedFilters);
    setPriceValues([priceRange.min, priceRange.max]);
    onClearFilters();
    setDrawerOpen(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.category) count++;
    if (localFilters.minPrice > priceRange.min || localFilters.maxPrice < priceRange.max) count++;
    if (localFilters.rating) count++;
    if (localFilters.inStock) count++;
    return count;
  };

  const sortOptions = [
    { value: 'newest', label: t('sort_newest', 'الأحدث') },
    { value: 'price_asc', label: t('sort_price_low', 'السعر: من الأقل للأعلى') },
    { value: 'price_desc', label: t('sort_price_high', 'السعر: من الأعلى للأقل') },
    { value: 'rating', label: t('sort_rating', 'الأعلى تقييماً') },
    { value: 'popular', label: t('sort_popular', 'الأكثر شعبية') }
  ];

  const FilterContent = () => (
    <Box sx={{ p: 2, width: isMobile ? '100%' : 300 }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{t('filters', 'الفلاتر')}</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      {/* Sort By */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">{t('sort_by', 'ترتيب حسب')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={localFilters.sortBy || 'newest'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              {sortOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Categories */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">{t('categories', 'الفئات')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label={t('category_all', 'الكل')}
              onClick={() => handleFilterChange('category', '')}
              color={!localFilters.category ? 'primary' : 'default'}
              variant={!localFilters.category ? 'filled' : 'outlined'}
            />
            {categories.map((category) => (
              <Chip
                key={category}
                label={t(`category_${category.toLowerCase()}`, category)}
                onClick={() => handleFilterChange('category', category)}
                color={localFilters.category === category ? 'primary' : 'default'}
                variant={localFilters.category === category ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Price Range */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">{t('price_range', 'نطاق السعر')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceValues}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={priceRange.min}
              max={priceRange.max}
              step={50}
              valueLabelFormat={(value) => formatPriceSimple(value)}
              marks={[
                { value: priceRange.min, label: formatPriceSimple(priceRange.min) },
                { value: priceRange.max, label: formatPriceSimple(priceRange.max) }
              ]}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {formatPriceSimple(priceValues[0])}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatPriceSimple(priceValues[1])}
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Rating Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">{t('rating', 'التقييم')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={localFilters.rating || ''}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <FormControlLabel
                value=""
                control={<Radio size="small" />}
                label={t('all_ratings', 'جميع التقييمات')}
              />
              {[4, 3, 2, 1].map((rating) => (
                <FormControlLabel
                  key={rating}
                  value={rating.toString()}
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {t('and_up', 'فأكثر')}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Stock Filter */}
      <FormControlLabel
        control={
          <Radio
            checked={localFilters.inStock || false}
            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
          />
        }
        label={t('in_stock_only', 'المتوفر فقط')}
      />

      {/* Mobile Action Buttons */}
      {isMobile && (
        <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={clearAllFilters}
            startIcon={<ClearIcon />}
            fullWidth
          >
            {t('clear_all', 'مسح الكل')}
          </Button>
          <Button
            variant="contained"
            onClick={applyFilters}
            fullWidth
          >
            {t('apply_filters', 'تطبيق الفلاتر')}
          </Button>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setDrawerOpen(true)}
          sx={{ mb: 2 }}
        >
          <Badge badgeContent={getActiveFiltersCount()} color="primary">
            {t('filters', 'الفلاتر')}
          </Badge>
        </Button>
        
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: { maxHeight: '80vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 }
          }}
        >
          <FilterContent />
        </Drawer>
      </>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{t('filters', 'الفلاتر')}</Typography>
        {getActiveFiltersCount() > 0 && (
          <Button
            size="small"
            onClick={clearAllFilters}
            startIcon={<ClearIcon />}
          >
            {t('clear_all', 'مسح الكل')}
          </Button>
        )}
      </Box>
      <FilterContent />
    </Box>
  );
};

export default ProductFilters;