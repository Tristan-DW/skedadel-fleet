// Test script to verify remote SQL connection and diagnose issues
import dotenv from 'dotenv';
import sequelize from '../server/config/database.js';
import { performance } from 'perf_hooks';

// Load environment variables
dotenv.config();

// Verify database configuration
console.log('Database configuration:');
console.log(`- Using SQL Database: ${process.env.USE_SQL_DATABASE === 'true' ? 'Yes' : 'No'}`);
console.log(`- Database Host: ${process.env.DB_HOST}`);
console.log(`- Database Name: ${process.env.DB_NAME}`);
console.log(`- Database User: ${process.env.DB_USER}`);
console.log(`- Connection Timeout: 120 seconds`);
console.log(`- Query Timeout: 120 seconds`);

// Helper function to measure query execution time
const measureQueryTime = async (queryName, queryFn) => {
  try {
    const startTime = performance.now();
    const result = await queryFn();
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    console.log(`✅ ${queryName} - Execution time: ${executionTime.toFixed(2)}ms`);
    return { success: true, executionTime, result };
  } catch (error) {
    console.error(`❌ ${queryName} - Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Test the connection and run diagnostic queries
const runDiagnostics = async () => {
  try {
    console.log('\n--- TESTING REMOTE SQL CONNECTION ---');
    
    // Test 1: Basic connection
    console.log('\n1. Testing basic connection...');
    const connectionStart = performance.now();
    await sequelize.authenticate();
    const connectionEnd = performance.now();
    const connectionTime = connectionEnd - connectionStart;
    
    console.log(`✅ Connection successful - Time: ${connectionTime.toFixed(2)}ms`);
    console.log(`   Connection latency is ${connectionTime > 1000 ? 'HIGH' : 'acceptable'}`);
    
    // Test 2: Get database information
    console.log('\n2. Getting database information...');
    await measureQueryTime('Database version query', async () => {
      const [results] = await sequelize.query('SELECT VERSION() as version');
      console.log(`   Database version: ${results[0].version}`);
      return results;
    });
    
    // Test 3: List tables and count rows
    console.log('\n3. Listing tables and counting rows...');
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log(`   Found ${tables.length} tables in the database`);
    
    // Test 4: Test query performance on each table
    console.log('\n4. Testing query performance on each table...');
    
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      
      // Count rows in the table
      await measureQueryTime(`COUNT query on ${tableName}`, async () => {
        const [countResult] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const rowCount = countResult[0].count;
        console.log(`   Table ${tableName}: ${rowCount} rows`);
        return countResult;
      });
      
      // If the table has rows, test a simple SELECT query
      await measureQueryTime(`SELECT query on ${tableName}`, async () => {
        const [selectResult] = await sequelize.query(`SELECT * FROM ${tableName} LIMIT 1`);
        return selectResult;
      });
    }
    
    // Test 5: Test a complex join query if possible
    console.log('\n5. Testing a complex query...');
    
    // Try to find tables that might be related
    const relatedTables = [];
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      try {
        // Check if this table has foreign keys
        const [foreignKeys] = await sequelize.query(`
          SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
          FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
          WHERE REFERENCED_TABLE_SCHEMA = '${process.env.DB_NAME}'
            AND TABLE_NAME = '${tableName}'
            AND REFERENCED_TABLE_NAME IS NOT NULL
        `);
        
        if (foreignKeys.length > 0) {
          relatedTables.push({
            table: tableName,
            references: foreignKeys.map(fk => ({
              column: fk.COLUMN_NAME,
              referencedTable: fk.REFERENCED_TABLE_NAME,
              referencedColumn: fk.REFERENCED_COLUMN_NAME
            }))
          });
        }
      } catch (error) {
        // Ignore errors when checking for foreign keys
      }
    }
    
    if (relatedTables.length > 0) {
      // Find a pair of tables that can be joined
      const joinablePair = relatedTables.find(rt => 
        tables.some(t => Object.values(t)[0] === rt.references[0].referencedTable)
      );
      
      if (joinablePair) {
        const { table, references } = joinablePair;
        const referencedTable = references[0].referencedTable;
        const column = references[0].column;
        const referencedColumn = references[0].referencedColumn;
        
        await measureQueryTime(`JOIN query between ${table} and ${referencedTable}`, async () => {
          const [joinResult] = await sequelize.query(`
            SELECT a.*, b.*
            FROM ${table} a
            JOIN ${referencedTable} b ON a.${column} = b.${referencedColumn}
            LIMIT 10
          `);
          console.log(`   Join query returned ${joinResult.length} rows`);
          return joinResult;
        });
      } else {
        console.log('   No suitable tables found for testing a join query');
      }
    } else {
      console.log('   No related tables found for testing a join query');
    }
    
    // Test 6: Test network stability with multiple sequential queries
    console.log('\n6. Testing network stability with multiple sequential queries...');
    
    const stabilityResults = [];
    for (let i = 0; i < 5; i++) {
      const result = await measureQueryTime(`Stability test query ${i + 1}`, async () => {
        const [results] = await sequelize.query('SELECT 1 as test');
        return results;
      });
      stabilityResults.push(result.executionTime);
    }
    
    const avgTime = stabilityResults.reduce((sum, time) => sum + time, 0) / stabilityResults.length;
    const maxTime = Math.max(...stabilityResults);
    const minTime = Math.min(...stabilityResults);
    const variance = maxTime - minTime;
    
    console.log(`   Average query time: ${avgTime.toFixed(2)}ms`);
    console.log(`   Min query time: ${minTime.toFixed(2)}ms`);
    console.log(`   Max query time: ${maxTime.toFixed(2)}ms`);
    console.log(`   Time variance: ${variance.toFixed(2)}ms (${variance > 500 ? 'HIGH - network may be unstable' : 'acceptable'})`);
    
    // Summary and recommendations
    console.log('\n--- DIAGNOSTICS SUMMARY ---');
    
    if (connectionTime > 1000) {
      console.log('⚠️ High connection latency detected. This may cause API timeouts.');
      console.log('   Recommendations:');
      console.log('   - Ensure the server and database are in the same region');
      console.log('   - Check network quality between server and database');
      console.log('   - Consider increasing connection timeouts further');
    } else {
      console.log('✅ Connection latency is acceptable');
    }
    
    if (variance > 500) {
      console.log('⚠️ High query time variance detected. Network may be unstable.');
      console.log('   Recommendations:');
      console.log('   - Check for network congestion or packet loss');
      console.log('   - Consider implementing more aggressive retry mechanisms');
      console.log('   - Monitor network quality over time');
    } else {
      console.log('✅ Network stability is acceptable');
    }
    
    const slowQueries = stabilityResults.filter(time => time > 1000).length;
    if (slowQueries > 0) {
      console.log(`⚠️ ${slowQueries} out of 5 queries took more than 1 second to complete`);
      console.log('   Recommendations:');
      console.log('   - Optimize database queries');
      console.log('   - Consider adding indexes to frequently queried columns');
      console.log('   - Implement query caching if possible');
    } else {
      console.log('✅ Query performance is acceptable');
    }
    
  } catch (error) {
    console.error('\n❌ Error during diagnostics:', error.message);
    if (error.message.includes('connect')) {
      console.error('\nPossible network connectivity issues:');
      console.error('1. Check if the database server is running and accessible');
      console.error('2. Verify that the database host, port, username, and password are correct');
      console.error('3. Check if there are any firewalls blocking the connection');
      console.error('4. Ensure the database server allows remote connections');
    }
  } finally {
    // Close the connection
    await sequelize.close();
    console.log('\nConnection closed.');
  }
};

// Run the diagnostics
runDiagnostics();