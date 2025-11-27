import dotenv from 'dotenv';
import sequelize, { testConnection, syncDatabase } from '../server/config/database.js';
import * as SequelizeModels from '../server/models/sequelize/index.js';

// Load environment variables
dotenv.config();

// Test the fixes for database synchronization and seeding
async function testFixes() {
  try {
    console.log('Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('Failed to connect to the database. Aborting test.');
      process.exit(1);
    }
    
    console.log('Database connection successful!');
    
    console.log('Syncing database models...');
    // Force true will drop tables before recreating them
    const synced = await syncDatabase(true);
    
    if (!synced) {
      console.error('Failed to synchronize database models.');
      process.exit(1);
    }
    
    console.log('Database models synchronized successfully!');
    
    // Test creating a geofence with coordinates as an array
    console.log('Testing geofence creation with coordinates as an array...');
    const testGeofence = await SequelizeModels.Geofence.create({
      name: 'Test Geofence',
      coordinates: [
        { lat: -26.09, lng: 28.04 }, 
        { lat: -26.09, lng: 28.07 }, 
        { lat: -26.12, lng: 28.07 }, 
        { lat: -26.12, lng: 28.04 }
      ],
      color: 'rgba(59, 130, 246, 0.2)'
    });
    
    console.log('Geofence created successfully:', testGeofence.id);
    
    // Test creating a driver challenge
    console.log('Testing driver challenge creation...');
    
    // First create a user for the driver
    console.log('Creating a test user...');
    const testUser = await SequelizeModels.User.create({
      name: 'Test User',
      email: 'test.user@example.com',
      role: 'Driver',
      password: 'password123'
    });
    
    console.log('Test user created successfully:', testUser.id);
    
    // Now create a driver with the user ID
    console.log('Creating a test driver...');
    const testDriver = await SequelizeModels.Driver.create({
      name: 'Test Driver',
      phone: '123-456-7890',
      email: 'test.driver@example.com',
      latitude: -26.105,
      longitude: 28.05,
      address: 'Test Address',
      status: 'Available',
      points: 0,
      rank: 1,
      userId: testUser.id
    });
    
    const testChallenge = await SequelizeModels.Challenge.create({
      name: 'Test Challenge',
      description: 'Test challenge description',
      type: 'COMPLETE_ORDERS',
      goal: 5,
      points: 50,
      isActive: true
    });
    
    // Now create a driver challenge
    const testDriverChallenge = await SequelizeModels.DriverChallenge.create({
      driverId: testDriver.id,
      challengeId: testChallenge.id,
      progress: 0,
      isCompleted: false
    });
    
    console.log('Driver challenge created successfully:', testDriverChallenge.id);
    
    console.log('All tests passed successfully!');
    console.log('The fixes for both issues have been verified.');
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
    process.exit(0);
  }
}

// Run the test function
testFixes();