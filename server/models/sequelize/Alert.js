import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';

class Alert extends Model {}

Alert.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM(
      'Driver Delayed',
      'Order Failed',
      'Low Coverage',
      'Order Status Updated',
      'Entered Exclusion Zone',
      'Challenge Completed'
    ),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add an alert message'
      }
    }
  },
  priority: {
    type: DataTypes.ENUM('high', 'medium', 'low'),
    defaultValue: 'medium'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Fields for related entity (polymorphic association)
  relatedEntityType: {
    type: DataTypes.ENUM('Driver', 'Order', 'Store', 'Team', 'Hub', 'Challenge'),
    allowNull: true
  },
  relatedEntityId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'alert',
  timestamps: false, // We're using our own timestamp field
  indexes: [
    // Index for faster queries
    {
      fields: ['timestamp']
    }
    // Removed problematic index on relatedEntityType and relatedEntityId
    // Will add back after table is properly created
  ]
});

export default Alert;