import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '*',
  credentials: true
}));
app.use(express.json());

// Database configuration
const USE_SQL_DATABASE = process.env.USE_SQL_DATABASE === 'true';

// Track database initialization
let dbInitialized = false;
let sequelize = null;

// Initialize database connection for serverless
async function initializeDatabase() {
  if (dbInitialized) return;

  if (USE_SQL_DATABASE) {
    try {
      console.log('Initializing database connection...');

      // Dynamic import to ensure mysql2 is loaded
      const { default: Sequelize } = await import('sequelize');

      sequelize = new Sequelize(
        process.env.DB_NAME || 'fleet_management',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
          host: process.env.DB_HOST || 'localhost',
          dialect: 'mysql',
          port: process.env.DB_PORT || 3306,
          logging: false,
          dialectOptions: {
            connectTimeout: 60000,
          },
          pool: {
            max: 2,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
        }
      );

      await sequelize.authenticate();
      console.log('✓ Database initialized successfully');
      dbInitialized = true;
    } catch (error) {
      console.error('✗ Database initialization failed:', error.message);
      // Don't throw - let the API continue and handle errors per-request
    }
  }
}

// Import routes
import userRoutes from '../server/routes/userRoutes.js';
import driverRoutes from '../server/routes/driverRoutes.js';
import vehicleRoutes from '../server/routes/vehicleRoutes.js';
import teamRoutes from '../server/routes/teamRoutes.js';
import hubRoutes from '../server/routes/hubRoutes.js';
import storeRoutes from '../server/routes/storeRoutes.js';
import geofenceRoutes from '../server/routes/geofenceRoutes.js';
import exclusionZoneRoutes from '../server/routes/exclusionZoneRoutes.js';
import orderRoutes from '../server/routes/orderRoutes.js';
import alertRoutes from '../server/routes/alertRoutes.js';
import challengeRoutes from '../server/routes/challengeRoutes.js';
import driverChallengeRoutes from '../server/routes/driverChallengeRoutes.js';
import webhookRoutes from '../server/routes/webhookRoutes.js';
import invoiceRoutes from '../server/routes/invoiceRoutes.js';

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Fleet Management API is running on Vercel',
    environment: process.env.NODE_ENV,
    database: USE_SQL_DATABASE ? 'MySQL' : 'MongoDB',
    dbInitialized
  });
});

// Export handler for Vercel serverless
export default async function handler(req, res) {
  // Initialize database on first request (cold start)
  await initializeDatabase();

  // Handle the request with Express
  return app(req, res);
}
