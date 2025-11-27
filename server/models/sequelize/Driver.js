import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';

class Driver extends Model {}

Driver.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add a name'
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add a phone number'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Please add a valid email'
      }
    }
  },
  // Location data
  latitude: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  longitude: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  address: {
    type: DataTypes.STRING,
    defaultValue: 'Offline'
  },
  status: {
    type: DataTypes.ENUM('On Duty', 'Available', 'Offline', 'Maintenance'),
    defaultValue: 'Offline'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rank: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Foreign keys will be added when associations are defined
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users', // This is the table name, which is pluralized by Sequelize
      key: 'id'
    }
  },
  vehicleId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'vehicles',
      key: 'id'
    }
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'teams',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'driver',
  timestamps: true,
  indexes: [
    // Index for foreign keys to improve join performance
    { fields: ['user_id'] },
    { fields: ['vehicle_id'] },
    { fields: ['team_id'] },
    // Index for frequently queried fields
    { fields: ['status'] },
    { fields: ['email'] },
    { fields: ['points'] },
    { fields: ['rank'] },
    // Composite indexes for common query patterns
    { fields: ['team_id', 'status'] },
    { fields: ['points', 'rank'] }, // For leaderboard queries
    // Spatial index for location-based queries
    { fields: ['latitude', 'longitude'] }
  ]
});

export default Driver;