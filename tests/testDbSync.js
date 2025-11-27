import dotenv from 'dotenv';
import sequelize, { testConnection, syncDatabase } from '../server/config/database.js';

// Load environment variables
dotenv.config();

// Test database synchronization
async function testDatabaseSync() {
  try {
    console.log('Testing database connection and synchronization...');
    
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to the database');
      process.exit(1);
    }
    
    console.log('Database connection successful. Attempting to synchronize models...');
    
    // Sync database (false = don't force drop tables)
    const synced = await syncDatabase(false);
    
    if (synced) {
      console.log('Database synchronization successful!');
      
      // Get the Alert model and check its structure
      const models = await import('../server/models/sequelize/index.js');
      const Alert = models.Alert;
      
      // Log the model attributes to verify structure
      console.log('Alert model attributes:', Object.keys(Alert.rawAttributes));
      
      // Check if the problematic columns exist
      if (Alert.rawAttributes.relatedEntityType && Alert.rawAttributes.relatedEntityId) {
        console.log('The relatedEntityType and relatedEntityId columns are defined in the model.');
      } else {
        console.log('Warning: One or both of the relatedEntityType and relatedEntityId columns are missing from the model.');
      }
      
      // Query the database to check the actual table structure
      const [results] = await sequelize.query('DESCRIBE alerts');
      console.log('Actual database table columns:', results.map(r => r.Field));
      
      // Check if the columns exist in the actual table
      const hasRelatedEntityType = results.some(r => r.Field === 'relatedEntityType');
      const hasRelatedEntityId = results.some(r => r.Field === 'relatedEntityId');
      
      if (hasRelatedEntityType && hasRelatedEntityId) {
        console.log('Success: The relatedEntityType and relatedEntityId columns exist in the database table.');
      } else {
        console.log('Warning: One or both of the relatedEntityType and relatedEntityId columns are missing from the database table.');
      }
    } else {
      console.error('Database synchronization failed');
    }
  } catch (error) {
    console.error('Error testing database synchronization:', error);
  } finally {
    // Close the connection
    await sequelize.close();
    process.exit(0);
  }
}

// Run the test
testDatabaseSync();