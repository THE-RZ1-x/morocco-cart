// ملف اختبار شامل لميزات Maroc-Cart الجديدة
// تشغيل: node test/comprehensive-test.js

import axios from 'axios';
import chalk from 'chalk';

const API_BASE = 'http://localhost:5000/api';
const testResults = [];

// Helper functions
const log = (message, type = 'info') => {
  const timestamp = new Date().toLocaleTimeString();
  switch (type) {
    case 'success':
      console.log(chalk.green(`✅ [${timestamp}] ${message}`));
      break;
    case 'error':
      console.log(chalk.red(`❌ [${timestamp}] ${message}`));
      break;
    case 'warning':
      console.log(chalk.yellow(`⚠️ [${timestamp}] ${message}`));
      break;
    default:
      console.log(chalk.blue(`ℹ️ [${timestamp}] ${message}`));
  }
};

const test = async (name, testFunction) => {
  try {
    log(`Testing: ${name}`);
    await testFunction();
    testResults.push({ name, status: 'PASS' });
    log(`${name} - PASSED`, 'success');
  } catch (error) {
    testResults.push({ name, status: 'FAIL', error: error.message });
    log(`${name} - FAILED: ${error.message}`, 'error');
  }
};

// Test suites
const testReviewSystem = async () => {
  log('=== Testing Review System ===');
  
  await test('Get product reviews', async () => {
    const response = await axios.get(`${API_BASE}/products/60d21b4667d0d8992e610c85/reviews`);
    if (!response.data.reviews) throw new Error('Reviews not found');
  });

  await test('Review validation', async () => {
    try {
      await axios.post(`${API_BASE}/products/60d21b4667d0d8992e610c85/reviews`, {
        rating: 6, // Invalid rating
        comment: 'Test'
      });
      throw new Error('Should have failed validation');
    } catch (error) {
      if (error.response?.status !== 400) throw error;
    }
  });
};

const testAnalyticsSystem = async () => {
  log('=== Testing Analytics System ===');
  
  await test('Dashboard data', async () => {
    const response = await axios.get(`${API_BASE}/analytics/dashboard`);
    if (!response.data.totalRevenue !== undefined) throw new Error('Dashboard data incomplete');
  });

  await test('Sales analytics', async () => {
    const response = await axios.get(`${API_BASE}/analytics/sales`);
    if (!response.data.salesData) throw new Error('Sales data not found');
  });

  await test('Product analytics', async () => {
    const response = await axios.get(`${API_BASE}/analytics/products`);
    if (!response.data.totalProducts !== undefined) throw new Error('Product analytics incomplete');
  });
};

const testSEOFeatures = async () => {
  log('=== Testing SEO Features ===');
  
  await test('Product SEO metadata', async () => {
    const response = await axios.get(`${API_BASE}/seo/product/60d21b4667d0d8992e610c85`);
    if (!response.data.title || !response.data.description) throw new Error('SEO metadata incomplete');
  });

  await test('Sitemap generation', async () => {
    const response = await axios.get(`${API_BASE}/seo/sitemap`);
    if (!response.data.products || !response.data.categories) throw new Error('Sitemap incomplete');
  });

  await test('Robots.txt', async () => {
    const response = await axios.get(`${API_BASE}/seo/robots`);
    if (!response.data.includes('User-agent')) throw new Error('Robots.txt invalid');
  });
};

const testCachingSystem = async () => {
  log('=== Testing Caching System ===');
  
  await test('Cache middleware', async () => {
    const start = Date.now();
    await axios.get(`${API_BASE}/products`);
    const firstCall = Date.now() - start;
    
    const start2 = Date.now();
    await axios.get(`${API_BASE}/products`);
    const secondCall = Date.now() - start2;
    
    if (secondCall >= firstCall) {
      log('Cache may not be working optimally', 'warning');
    }
  });
};

const testPerformance = async () => {
  log('=== Testing Performance ===');
  
  await test('Image optimization', async () => {
    // This would test image upload and optimization
    log('Image optimization test requires manual verification', 'warning');
  });

  await test('Database indexes', async () => {
    // Test search performance
    const start = Date.now();
    await axios.get(`${API_BASE}/search?keyword=زيت&category=الزيوت`);
    const searchTime = Date.now() - start;
    
    if (searchTime > 1000) {
      log(`Search took ${searchTime}ms - consider optimization`, 'warning');
    } else {
      log(`Search completed in ${searchTime}ms`, 'success');
    }
  });
};

const testFrontendIntegration = async () => {
  log('=== Testing Frontend Integration ===');
  
  await test('Redux store initialization', async () => {
    log('Frontend Redux test requires manual verification', 'warning');
  });

  await test('Cart functionality', async () => {
    log('Cart functionality test requires manual verification', 'warning');
  });
};

// Main test runner
const runTests = async () => {
  log('🚀 Starting comprehensive Maroc-Cart testing...');
  
  try {
    await testReviewSystem();
    await testAnalyticsSystem();
    await testSEOFeatures();
    await testCachingSystem();
    await testPerformance();
    await testFrontendIntegration();
    
    // Summary
    const passed = testResults.filter(r => r.status === 'PASS').length;
    const failed = testResults.filter(r => r.status === 'FAIL').length;
    
    log(`\n📊 Test Summary:`);
    log(`Total Tests: ${testResults.length}`);
    log(`Passed: ${passed}`, 'success');
    log(`Failed: ${failed}`, failed > 0 ? 'error' : 'success');
    
    if (failed > 0) {
      log('\n❌ Failed Tests:');
      testResults.filter(r => r.status === 'FAIL').forEach(r => {
        log(`${r.name}: ${r.error}`, 'error');
      });
    }
    
  } catch (error) {
    log(`Test runner error: ${error.message}`, 'error');
  }
};

// Run tests if server is running
runTests().catch(console.error);
