// Simple test script to verify that the service methods work correctly
import OrderService from '../services/orderService';
import AlertService from '../services/alertService';
import ChallengeService from '../services/challengeService';
import InvoiceService from '../services/invoiceService';

// Test OrderService.getAllOrders()
async function testOrderService() {
  try {
    console.log('Testing OrderService.getAllOrders()...');
    const orders = await OrderService.getAllOrders();
    console.log('OrderService.getAllOrders() returned:', orders);
    console.log('Test passed!');
  } catch (error) {
    console.error('Error testing OrderService.getAllOrders():', error);
  }
}

// Test AlertService.getAllAlerts()
async function testAlertService() {
  try {
    console.log('Testing AlertService.getAllAlerts()...');
    const alerts = await AlertService.getAllAlerts();
    console.log('AlertService.getAllAlerts() returned:', alerts);
    console.log('Test passed!');
  } catch (error) {
    console.error('Error testing AlertService.getAllAlerts():', error);
  }
}

// Test ChallengeService.getAllDriverChallenges()
async function testChallengeService() {
  try {
    console.log('Testing ChallengeService.getAllDriverChallenges()...');
    const driverChallenges = await ChallengeService.getAllDriverChallenges();
    console.log('ChallengeService.getAllDriverChallenges() returned:', driverChallenges);
    console.log('Test passed!');
  } catch (error) {
    console.error('Error testing ChallengeService.getAllDriverChallenges():', error);
  }
}

// Test InvoiceService.getAllInvoices()
async function testInvoiceService() {
  try {
    console.log('Testing InvoiceService.getAllInvoices()...');
    const invoices = await InvoiceService.getAllInvoices();
    console.log('InvoiceService.getAllInvoices() returned:', invoices);
    console.log('Test passed!');
  } catch (error) {
    console.error('Error testing InvoiceService.getAllInvoices():', error);
  }
}

// Run the tests
async function runTests() {
  console.log('=== Starting Service Method Tests ===');
  await testOrderService();
  await testAlertService();
  await testChallengeService();
  await testInvoiceService();
  console.log('=== All tests completed! ===');
}

runTests();