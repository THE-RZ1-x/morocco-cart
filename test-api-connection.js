const axios = require('axios');

// Test the connection to the local API
async function testApiConnection() {
  try {
    console.log('Testing connection to local API...');
    
    // Test the base URL
    const response = await axios.get('http://localhost:5001');
    console.log('API Base URL Test: SUCCESS');
    console.log('Response:', response.data);
    
    // Test the users endpoint
    try {
      const usersResponse = await axios.get('http://localhost:5001/api/users');
      console.log('Users Endpoint Test: SUCCESS');
    } catch (error) {
      // This might fail if there's no authorization, which is expected
      console.log('Users Endpoint Test: EXPECTED FAILURE (requires authorization)');
    }
    
    // Test the products endpoint
    try {
      const productsResponse = await axios.get('http://localhost:5001/api/products');
      console.log('Products Endpoint Test: SUCCESS');
      console.log(`Found ${productsResponse.data.length} products`);
    } catch (error) {
      console.log('Products Endpoint Test: FAILED');
      console.error(error.message);
    }
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('API Connection Test: FAILED');
    console.error('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Please make sure the server is running on port 5001');
    }
  }
}

testApiConnection();
