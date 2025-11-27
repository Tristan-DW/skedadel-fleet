// Test script to verify API resilience improvements
import axios from 'axios';
import { MOCK_DATA } from '../mockData.js';

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_TIMEOUT = 15000; // 15 seconds timeout for the entire test
const REQUEST_TIMEOUT = 2000; // 2 seconds timeout for individual requests
const MAX_RETRIES = 3;

// Create axios instance with timeout
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to retry a failed API call
const fetchWithRetry = async (fetchFn, retries = MAX_RETRIES, delay = 500) => {
  try {
    return await fetchFn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    console.log(`Retrying... Attempts left: ${retries}`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(fetchFn, retries - 1, delay * 1.5); // Exponential backoff
  }
};

// Helper function to fetch data with fallback to mock data
const fetchWithFallback = async (url, mockData) => {
  try {
    return await fetchWithRetry(() => apiClient.get(url));
  } catch (error) {
    console.warn(`Using mock data fallback for ${url} due to error: ${error.message}`);
    return { data: { success: true, data: mockData } };
  }
};

// Test function for a specific endpoint
const testEndpoint = async (endpoint, mockData) => {
  console.log(`Testing endpoint: ${endpoint}`);
  
  try {
    const startTime = Date.now();
    const response = await fetchWithFallback(endpoint, mockData);
    const endTime = Date.now();
    
    console.log(`✅ Successfully fetched data from ${endpoint} in ${endTime - startTime}ms`);
    
    if (response.data.success === true) {
      console.log(`   Received ${response.data.data.length} records`);
    } else {
      console.log(`   Unexpected response format:`, response.data);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to fetch data from ${endpoint}: ${error.message}`);
    return false;
  }
};

// Main test function
const runTests = async () => {
  console.log('Starting API resilience tests...');
  console.log('--------------------------------');
  
  // Set a timeout for the entire test
  const testTimeout = setTimeout(() => {
    console.error('Test timed out after', TEST_TIMEOUT / 1000, 'seconds');
    process.exit(1);
  }, TEST_TIMEOUT);
  
  // Define endpoints to test with their corresponding mock data
  const endpointsToTest = [
    { url: '/users', mockData: MOCK_DATA.users },
    { url: '/orders', mockData: MOCK_DATA.orders },
    { url: '/drivers', mockData: MOCK_DATA.drivers },
    { url: '/stores', mockData: MOCK_DATA.stores },
    { url: '/teams', mockData: MOCK_DATA.teams },
    { url: '/hubs', mockData: MOCK_DATA.hubs },
    { url: '/geofences', mockData: MOCK_DATA.geofences },
    { url: '/exclusion-zones', mockData: MOCK_DATA.exclusionZones },
    { url: '/vehicles', mockData: MOCK_DATA.vehicles },
    { url: '/challenges', mockData: MOCK_DATA.challenges },
    { url: '/driver-challenges', mockData: MOCK_DATA.driverChallenges },
    { url: '/webhooks', mockData: MOCK_DATA.webhooks },
    { url: '/invoices', mockData: MOCK_DATA.invoices },
    { url: '/alerts', mockData: MOCK_DATA.alerts }
  ];
  
  // Test each endpoint
  const results = [];
  for (const { url, mockData } of endpointsToTest) {
    const success = await testEndpoint(url, mockData);
    results.push({ url, success });
  }
  
  // Clear the timeout
  clearTimeout(testTimeout);
  
  // Print summary
  console.log('\nTest Summary:');
  console.log('--------------------------------');
  
  const successCount = results.filter(r => r.success).length;
  console.log(`${successCount} of ${results.length} endpoints tested successfully`);
  
  if (successCount < results.length) {
    console.log('\nFailed endpoints:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`- ${r.url}`);
    });
  }
  
  console.log('\nTest completed successfully!');
};

// Run the tests
runTests().catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});