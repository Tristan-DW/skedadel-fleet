import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql2 from 'mysql2'; // Explicit import to force bundling

// Load environment variables
dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'fleet_management',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    dialectModule: mysql2, // Explicitly provide the dialect module
    port: process.env.DB_PORT || 3306,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true, // Adds createdAt and updatedAt timestamps to every model
      underscored: true, // Use snake_case for fields in the database
    },
    dialectOptions: {
      connectTimeout: 60000, // 60 seconds connection timeout
      // Removed invalid nested 'options' object
    },
    pool: {
      // Serverless-optimized pool settings - strictly limited
      max: 1, // STRICTLY 1 connection per lambda to avoid max_user_connections error
      min: 0, // No minimum to allow scaling to zero
      acquire: 30000, // 30 seconds
      idle: 5000, // Release idle connections very quickly (5s)
    },
  }
);

// Test the connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

// Sync all models with the database
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log(`All models were synchronized ${force ? 'with force' : 'successfully'}.`);
    return true;
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
    return false;
  }
};

export default sequelize;