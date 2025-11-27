// Simple script to test the orders API endpoint
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testOrdersEndpoint() {
  try {
    console.log('Testing /api/orders endpoint...');
    const response = await axios.get(`${API_URL}/orders`);
    
    console.log('Response status:', response.status);
    console.log('Response success:', response.data.success);
    console.log('Number of orders:', response.data.count);
    
    if (response.data.data && response.data.data.length > 0) {
      // Check if the first order has the expected structure with populated associations
      const firstOrder = response.data.data[0];
      console.log('\nFirst order details:');
      console.log('- ID:', firstOrder.id);
      console.log('- Title:', firstOrder.title);
      console.log('- Status:', firstOrder.status);
      
      // Check if driver was populated
      if (firstOrder.driver) {
        console.log('- Driver:', firstOrder.driver.name);
      } else {
        console.log('- Driver: Not populated or null');
      }
      
      // Check if store was populated
      if (firstOrder.store) {
        console.log('- Store:', firstOrder.store.name);
      } else {
        console.log('- Store: Not populated or null');
      }
      
      // Check if vehicle was populated
      if (firstOrder.vehicle) {
        console.log('- Vehicle:', firstOrder.vehicle.name);
      } else {
        console.log('- Vehicle: Not populated or null');
      }
    } else {
      console.log('No orders found in the response');
    }
    
    console.log('\nTest successful!');
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