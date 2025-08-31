const axios = require('axios');

async function detailedTest() {
  try {
    console.log('Starting detailed test...');
    
    // Register a user first
    console.log('\n1. Registering user...');
    const registerResponse = await axios.post('http://localhost:5000/api/users/register', {
      name: 'Test User',
      email: 'test2@example.com',
      password: 'Test123!',
      confirmPassword: 'Test123!'
    });
    
    console.log('Registration successful:', registerResponse.data._id);
    
    // Login with the registered user
    console.log('\n2. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
      email: 'test2@example.com',
      password: 'Test123!'
    });
    
    console.log('Login successful:', loginResponse.data._id);
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('\nError occurred:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Message:', error.message);
    }
  }
}

detailedTest();
