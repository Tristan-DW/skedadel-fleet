import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

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
    port: process.env.DB_PORT || 3306,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true, // Adds createdAt and updatedAt timestamps to every model
      underscored: true, // Use snake_case for fields in the database
    },
    dialectOptions: {
      connectTimeout: 120000, // 120 seconds connection timeout (increased for remote database)
      options: {
        requestTimeout: 120000 // 120 seconds query timeout (increased for remote database)
      }
    },
    pool: {
      max: 10, // Increased maximum number of connections in pool
      min: 2, // Increased minimum number of connections in pool
      acquire: 120000, // Increased to 120 seconds - maximum time that pool will try to get connection
      idle: 30000, // Increased to 30 seconds - maximum time a connection can be idle
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