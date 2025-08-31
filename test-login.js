const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login...');
    
    // First, let's try to register a user
    const registerResponse = await axios.post('http://localhost:5000/api/users/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test123!',
      confirmPassword: 'Test123!'
    });
    
    console.log('Registration response:', registerResponse.data);
    
    // Then, let's try to log in
    const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
      email: 'test@example.com',
      password: 'Test123!'
    });
    
    console.log('Login response:', loginResponse.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testLogin();
