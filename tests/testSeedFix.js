import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

// Load environment variables
dotenv.config();

const execPromise = promisify(exec);

// Test the fix for the activity log foreign key constraint issue
async function testSeedFix() {
  try {
    console.log('Testing the fix for activity log foreign key constraint issue...');
    
    // Run the seedDatabase.js script
    console.log('Running seedDatabase.js...');
    const { stdout, stderr } = await execPromise('node ../server/config/seedDatabase.js');
    
    // Check if there were any errors
    if (stderr) {
      console.error('Error output from seedDatabase.js:');
      console.error(stderr);
      
      // Check specifically for foreign key constraint errors
      if (stderr.includes('foreign key constraint fails') && 
          stderr.includes('activity_logs') && 
          stderr.includes('order_id')) {
        console.error('The fix did not resolve the foreign key constraint issue.');
        process.exit(1);
      }
    }
    
    // Log the output
    console.log('Output from seedDatabase.js:');
    console.log(stdout);
    
    // Check if the seeding was successful
    if (stdout.includes('Database seeding completed successfully!')) {
      console.log('The fix was successful! The database was seeded without foreign key constraint errors.');
    } else {
      console.error('The seeding process did not complete successfully.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error testing the fix:', error);
    process.exit(1);
  }
}

// Run the test function
testSeedFix();