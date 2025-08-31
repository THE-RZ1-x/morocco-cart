import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  product = null 
}) => {
  const { t, i18n } = useTranslation();
  
  const defaultTitle = t('app_name', 'ماروك كارت');
  const defaultDescription = t('seo_description', 'متجرك الإلكتروني المغربي للإلكترونيات والمنتجات عالية الجودة. تسوق بأمان مع خدمة الدفع عند الاستلام.');
  const defaultKeywords = t('seo_keywords', 'تسوق إلكتروني، المغرب، إلكترونيات، دفع عند الاستلام، ماروك كارت');
  const defaultImage = '/images/logo-social.jpg';
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://maroc-cart.com';

  const seoTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoImage = image ? `${siteUrl}${image}` : `${siteUrl}${defaultImage}`;
  const seoUrl = url ? `${siteUrl}${url}` : siteUrl;

  // Structured data for products
  const productStructuredData = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "MarocCart"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/product/${product._id}`,
      "priceCurrency": "MAD",
      "price": product.priceMAD || product.price,
      "availability": product.countInStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "MarocCart"
      }
    },
    "aggregateRating": product.numReviews > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.numReviews
    } : undefined
  } : null;

  // Organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MarocCart",
    "url": siteUrl,
    "logo": `${siteUrl}/images/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+212-600-000-000",
      "contactType": "customer service",
      "availableLanguage": ["Arabic", "French"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MA",
      "addressLocality": "Casablanca"
    },
    "sameAs": [
      "https://www.facebook.com/maroccart",
      "https://www.instagram.com/maroccart"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="MarocCart" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content={i18n.language} />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content="MarocCart" />
      <meta property="og:locale" content={i18n.language === 'ar' ? 'ar_MA' : 'fr_FR'} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Mobile Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1976d2" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationStructuredData)}
      </script>
      
      {productStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(productStructuredData)}
        </script>
      )}

      {/* Alternate Language Links */}
      <link rel="alternate" hrefLang="ar" href={`${seoUrl}?lang=ar`} />
      <link rel="alternate" hrefLang="fr" href={`${seoUrl}?lang=fr`} />
      <link rel="alternate" hrefLang="x-default" href={seoUrl} />
    </Helmet>
  );
};

export default SEO;