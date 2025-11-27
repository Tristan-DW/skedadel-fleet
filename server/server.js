import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB as connectMongoDB } from './config/db.js';
import sequelize, { testConnection as testSequelizeConnection, syncDatabase } from './config/database.js';

// Load environment variables
dotenv.config();

console.log('='.repeat(50));
console.log('Starting Skedadel Fleet Management Server...');
console.log('='.repeat(50));

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const USE_SQL_DATABASE = process.env.USE_SQL_DATABASE === 'true';

// Connect to appropriate database with retry logic
if (USE_SQL_DATABASE) {
  console.log('Using SQL database (MySQL with Sequelize)');
  console.log('Database Configuration:');
  console.log('  Host:', process.env.DB_HOST);
  console.log('  Port:', process.env.DB_PORT);
  console.log('  Database:', process.env.DB_NAME);
  console.log('  User:', process.env.DB_USER);
  console.log('  Password:', process.env.DB_PASSWORD ? '***SET***' : '***NOT SET***');

  // Test Sequelize connection and sync models with retry logic
  (async () => {
    const maxRetries = 10;
    const retryDelay = 5000; // 5 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`\nDatabase connection attempt ${attempt}/${maxRetries}...`);
        const connected = await testSequelizeConnection();
        if (connected) {
          // Sync all models with the database
          console.log('Syncing database models...');
          await syncDatabase(false);
          console.log('✓ Database initialized successfully');
          break;
        } else {
          throw new Error('Connection test failed');
        }
      } catch (error) {
        console.error(`✗ Database connection attempt ${attempt} failed:`);
        console.error('  Error:', error.message);
        if (error.original) {
          console.error('  Original error:', error.original.message);
          console.error('  Code:', error.original.code);
          console.error('  Errno:', error.original.errno);
        }
        if (attempt < maxRetries) {
          console.log(`  Retrying in ${retryDelay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          console.error('\n⚠ Max retries reached. Database connection failed.');
          console.error('⚠ App will continue running but API calls may fail.');
        }
      }
    }
  })();
} else {
  console.log('Using NoSQL database (MongoDB)');
  // Connect to MongoDB
  connectMongoDB();
}

// Import routes
import userRoutes from './routes/userRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import hubRoutes from './routes/hubRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import geofenceRoutes from './routes/geofenceRoutes.js';
import exclusionZoneRoutes from './routes/exclusionZoneRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import driverChallengeRoutes from './routes/driverChallengeRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
// import tookanRoutes from './routes/tookanRoutes.js'; // TEMPORARILY DISABLED

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/hubs', hubRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/geofences', geofenceRoutes);
app.use('/api/exclusion-zones', exclusionZoneRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/driver-challenges', driverChallengeRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/invoices', invoiceRoutes);
// app.use('/api', tookanRoutes); // Tookan-compatible endpoints - TEMPORARILY DISABLED DUE TO ROUTE CONFLICT

// Basic route for testing
// Basic route for testing
app.get('/api/health', (req, res) => {
  res.send('Fleet Management API is running...');
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Fleet Management API is running...');
  });
}

// Start server
const PORT = process.env.PORT || 5000;

// Add global error handlers to prevent crashes
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit - log and continue
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - log and continue
});

try {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Database mode: ${USE_SQL_DATABASE ? 'SQL (MySQL)' : 'NoSQL (MongoDB)'}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}