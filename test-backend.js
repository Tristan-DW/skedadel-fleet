// Simple script to test the backend server
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testOrdersEndpoint() {
  try {
    console.log('Testing /api/orders endpoint...');
    const response = await axios.get(`${API_URL}/orders`);
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    console.log('Test successful!');
  } catch (error) {
    console.error('Test failed!');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testOrdersEndpoint();