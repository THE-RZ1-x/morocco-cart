// Debug script to test API connection
const axios = require('axios');

// Test the same configuration as the client
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const PRODUCTS_ENDPOINT = `${API_URL}/api/products`;

console.log('Testing API connection...');
console.log('API_URL:', API_URL);
console.log('PRODUCTS_ENDPOINT:', PRODUCTS_ENDPOINT);
console.log('Environment REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

async function testAPI() {
  try {
    console.log('\n🔄 Making request to:', PRODUCTS_ENDPOINT);
    const response = await axios.get(PRODUCTS_ENDPOINT);
    
    console.log('✅ Success!');
    console.log('Status:', response.status);
    console.log('Data keys:', Object.keys(response.data));
    console.log('Products count:', response.data.products ? response.data.products.length : 'No products array');
    
    if (response.data.products && response.data.products.length > 0) {
      console.log('First product:', response.data.products[0].name);
    }
    
  } catch (error) {
    console.log('❌ Error occurred:');
    console.log('Message:', error.message);
    
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    } else if (error.request) {
      console.log('No response received');
      console.log('Request config:', error.config);
    } else {
      console.log('Error setting up request:', error.message);
    }
  }
}

testAPI();