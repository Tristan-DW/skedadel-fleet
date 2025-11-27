// Script to test which database implementation is being used
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Print environment configuration
console.log('Environment Configuration:');
console.log('-------------------------');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`USE_SQL_DATABASE: ${process.env.USE_SQL_DATABASE}`);
console.log(`USE_SQL_DATABASE === 'true': ${process.env.USE_SQL_DATABASE === 'true'}`);
console.log(`typeof USE_SQL_DATABASE: ${typeof process.env.USE_SQL_DATABASE}`);

if (process.env.USE_SQL_DATABASE === 'true') {
  console.log('\nMySQL Configuration:');
  console.log('-------------------');
  console.log(`DB_HOST: ${process.env.DB_HOST}`);
  console.log(`DB_PORT: ${process.env.DB_PORT}`);
  console.log(`DB_NAME: ${process.env.DB_NAME}`);
  console.log(`DB_USER: ${process.env.DB_USER}`);
} else {
  console.log('\nMongoDB Configuration:');
  console.log('---------------------');
  console.log(`MONGO_URI: ${process.env.MONGO_URI}`);
}

// Test API endpoint
const API_URL = 'http://localhost:5000/api';

async function testOrdersEndpoint() {
  try {
    console.log('\nTesting /api/orders endpoint...');
    console.log('----------------------------');
    
    const response = await axios.get(`${API_URL}/orders`);
    
    console.log('Response status:', response.status);
    console.log('Response success:', response.data.success);
    console.log('Number of orders:', response.data.count);
    
    if (response.data.data && response.data.data.length > 0) {
      // Check if the first order has the expected structure with populated associations
      const firstOrder = response.data.data[0];
      console.log('\nFirst order details:');
      console.log('------------------');
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
      
      // Print the full order object for inspection
      console.log('\nFull order object:');
      console.log('----------------');
      console.log(JSON.stringify(firstOrder, null, 2));
    } else {
      console.log('No orders found in the response');
    }
    
    console.log('\nTest successful!');
  } catch (error) {
    console.error('\nTest failed!');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      // Print more detailed error information
      if (error.response.data && error.response.data.message) {
        console.error('\nDetailed error message:', error.response.data.message);
        
        // Check if the error is related to MongoDB associations
        if (error.response.data.message.includes('Association with alias')) {
          console.error('\nThis error suggests that the system is using MongoDB even though USE_SQL_DATABASE is set to true.');
          console.error('Check if the environment variables are being loaded correctly in the server.');
        }
      }
    } else if (error.request) {
      console.error('No response received. The server might not be running.');
    } else {
      console.error('Error:', error.message);
    }
    
    console.error('\nError stack trace:');
    console.error(error.stack);
  }
}

// Run the test
testOrdersEndpoint();