import React, { useEffect, useState, useMemo } from 'react';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import WhatsAppButton from './WhatsAppButton';
import { ThemeProvider } from '@mui/material/styles';
import { createCustomTheme } from '../theme/customTheme';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import Badge from '@mui/material/Badge';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import useMediaQuery from '@mui/material/useMediaQuery';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

const cacheLtr = createCache({
  key: 'muiltr',
});

const Layout = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser: user, logout } = useAuth();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const itemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // Dark Mode Logic
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';



  const [searchQuery, setSearchQuery] = useState('');

  const theme = useMemo(
    () => createCustomTheme(mode, direction),
    [mode, direction],
  );

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 3,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));



  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <CacheProvider value={direction === 'rtl' ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar 
            position="sticky" 
            elevation={0} 
            sx={{ 
              bgcolor: 'background.paper',
              color: 'text.primary',
              borderBottom: 1,
              borderColor: 'divider',
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha('#ffffff', 0.9),
            }}
          >
            <Container maxWidth="lg">
              <Toolbar sx={{ gap: 2 }}>
                <Typography
                  variant="h6"
                  component={RouterLink}
                  to="/"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    background: theme.palette.gradient?.moroccan || 'linear-gradient(135deg, #00695c 0%, #26a69a 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                  }}
                >
                  MarocCart
                </Typography>
                
                <Box sx={{ flexGrow: 1 }} />
                
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <form onSubmit={handleSearch}>
                    <StyledInputBase
                      placeholder="بحث عن منتجات..."
                      inputProps={{ 'aria-label': 'search' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                </Search>

                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton
                    color="primary"
                    onClick={() => navigate('/')}
                    aria-label="home"
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'primary.light', 
                        color: 'white' 
                      } 
                    }}
                  >
                    <HomeIcon />
                  </IconButton>
                  
                  <IconButton
                    color="primary"
                    onClick={() => navigate('/favorites')}
                    aria-label="favorites"
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'primary.light', 
                        color: 'white' 
                      } 
                    }}
                  >
                    <Badge badgeContent={favorites?.length || 0} color="secondary" max={99}>
                      <FavoriteIcon />
                    </Badge>
                  </IconButton>
                  
                  <IconButton
                    color="primary"
                    onClick={() => navigate('/cart')}
                    aria-label="cart"
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'primary.light', 
                        color: 'white' 
                      } 
                    }}
                  >
                    <Badge badgeContent={itemCount} color="secondary" max={99}>
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                  
                  {user ? (
                    <>
                      <Button
                        color="primary"
                        onClick={handleMenuOpen}
                        startIcon={<PersonIcon />}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          borderRadius: 3,
                          textTransform: 'none',
                        }}
                      >
                        {user.name}
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                          {t('my_profile')}
                        </MenuItem>
                        <MenuItem onClick={() => { navigate('/checkout'); handleMenuClose(); }}>
                          {t('common.checkout')}
                        </MenuItem>
                        <MenuItem onClick={() => { logout(); handleMenuClose(); }}>
                          {t('common.logout')}
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <Button
                      color="primary"
                      component={RouterLink}
                      to="/login"
                      variant="outlined"
                      size="small"
                      sx={{ 
                        borderRadius: 3,
                        textTransform: 'none',
                      }}
                    >
                      {t('common.login')}
                    </Button>
                  )}
                  
                  <IconButton
                    color="primary"
                    onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'primary.light', 
                        color: 'white' 
                      } 
                    }}
                  >
                    {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                  </IconButton>
                </Stack>
              </Toolbar>
            </Container>
          </AppBar>
          <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
            <Outlet />
          </Container>

          {/* WhatsApp Support Button */}
          <WhatsAppButton 
            phoneNumber="+212600000000"
            message={t('whatsapp_message', 'مرحبا، أحتاج مساعدة في التسوق من Maroc-Cart')}
          />

          <Box
            sx={{
              bgcolor: mode === 'light' ? 'grey.100' : 'grey.900',
              color: 'text.secondary',
              p: { xs: 4, sm: 6 },
              mt: 'auto',
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
            component="footer"
          >
            <Container maxWidth="lg">
              <Grid container spacing={5}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    {t('app_name')}
                  </Typography>
                  <Typography variant="body2">
                    {t('footer_subtitle')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    {t('quick_links')}
                  </Typography>
                  <Stack spacing={1}>
                    <Link component={RouterLink} to="/" color="inherit" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                      <HomeIcon sx={{ mr: 1 }} />
                      {t('home_page')}
                    </Link>
                    <Link component={RouterLink} to="/cart" color="inherit" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                      <ShoppingCartIcon sx={{ mr: 1 }} />
                      {t('your_cart_title')}
                    </Link>
                  </Stack>
                  {/* Add other links as needed */}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    {t('follow_us')}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <IconButton 
                      href="https://facebook.com/maroccart" 
                      target="_blank"
                      rel="noopener noreferrer"
                      color="inherit" 
                      aria-label="Facebook"
                      sx={{ '&:hover': { color: '#1877f2' } }}
                    >
                      <FacebookIcon />
                    </IconButton>
                    <IconButton 
                      href="https://twitter.com/maroccart" 
                      target="_blank"
                      rel="noopener noreferrer"
                      color="inherit" 
                      aria-label="Twitter"
                      sx={{ '&:hover': { color: '#1da1f2' } }}
                    >
                      <TwitterIcon />
                    </IconButton>
                    <IconButton 
                      href="https://instagram.com/maroccart" 
                      target="_blank"
                      rel="noopener noreferrer"
                      color="inherit" 
                      aria-label="Instagram"
                      sx={{ '&:hover': { color: '#e4405f' } }}
                    >
                      <InstagramIcon />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Typography variant="body2" align="center">
                  {t('copyright')} 
                  {' '}
                  <Link color="inherit" component={RouterLink} to="/">
                    {t('app_name')}
                  </Link>{' '}
                  {new Date().getFullYear()}
                  {'.'}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
                  <IconButton 
                    color="inherit" 
                    component={RouterLink} 
                    to="/cart"
                    aria-label="عربة التسوق"
                    sx={{ '&:hover': { color: 'primary.main' } }}
                  >
                    <Badge badgeContent={cart?.length || 0} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                  <IconButton 
                    color="inherit" 
                    component={RouterLink} 
                    to="/favorites"
                    aria-label="المفضلة"
                    sx={{ '&:hover': { color: 'primary.main' } }}
                  >
                    <Badge badgeContent={favorites?.length || 0} color="error">
                      <FavoriteIcon />
                    </Badge>
                  </IconButton>
                </Box>
              </Box>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default Layout;
