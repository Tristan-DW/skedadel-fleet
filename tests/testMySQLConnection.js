// Test script to verify MySQL connection
import dotenv from 'dotenv';
import sequelize, { testConnection } from '../server/config/database.js';

// Load environment variables
dotenv.config();

// Verify that MySQL is being used
console.log('Database configuration:');
console.log(`- Using SQL Database: ${process.env.USE_SQL_DATABASE === 'true' ? 'Yes' : 'No'}`);
console.log(`- Database Host: ${process.env.DB_HOST}`);
console.log(`- Database Name: ${process.env.DB_NAME}`);
console.log(`- Database User: ${process.env.DB_USER}`);

// Test the connection
const runTest = async () => {
  try {
    console.log('\nTesting MySQL connection...');
    const connected = await testConnection();
    
    if (connected) {
      console.log('\n✅ MySQL connection successful!');
      
      // Get a list of all tables in the database
      try {
        const [results] = await sequelize.query('SHOW TABLES');
        console.log('\nDatabase tables:');
        if (results.length === 0) {
          console.log('No tables found in the database.');
        } else {
          results.forEach((row, index) => {
            const tableName = Object.values(row)[0];
            console.log(`${index + 1}. ${tableName}`);
          });
        }
      } catch (error) {
        console.error('Error querying database tables:', error.message);
      }
    } else {
      console.error('\n❌ MySQL connection failed!');
    }
  } catch (error) {
    console.error('\n❌ Error testing MySQL connection:', error.message);
  } finally {
    // Close the connection
    await sequelize.close();
    console.log('\nConnection closed.');
  }
};

// Run the test
runTest();