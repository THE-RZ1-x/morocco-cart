const axios = require('axios');

async function simulateFrontendRequest() {
  try {
    console.log('Simulating frontend request...');
    
    // Simulate the exact headers that the frontend might be sending
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // Register a user first
    console.log('\n1. Registering user...');
    const registerResponse = await axios.post('http://localhost:5000/api/users/register', {
      name: 'Frontend Test User',
      email: 'frontend@example.com',
      password: 'Frontend123!',
      confirmPassword: 'Frontend123!'
    }, config);
    
    console.log('Registration successful:', registerResponse.data._id);
    
    // Login with the registered user using the same configuration
    console.log('\n2. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
      email: 'frontend@example.com',
      password: 'Frontend123!'
    }, config);
    
    console.log('Login successful:', loginResponse.data._id);
    
    console.log('\nFrontend simulation completed successfully!');
  } catch (error) {
    console.error('\nError occurred in frontend simulation:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Message:', error.message);
    }
  }
}

simulateFrontendRequest();
