import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';

// Define OrderItem model for the items in an order
class OrderItem extends Model { }

OrderItem.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  // Foreign key for relationship with Order
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: 'orderItem',
  timestamps: true
});

// Define ActivityLog model for tracking order status changes
class ActivityLog extends Model { }

ActivityLog.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM(
      'Unassigned',
      'Assigned',
      'At Store',
      'Picked Up',
      'In Progress',
      'Successful',
      'Failed'
    ),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  // Foreign key for relationship with Order
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: 'activityLog',
  timestamps: false // We're using our own timestamp field
});

// Define the main Order model
class Order extends Model { }

Order.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add an order title'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add an order description'
      }
    }
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add a customer name'
      }
    }
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add a customer phone number'
      }
    }
  },
  // Origin location
  originLat: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  originLng: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  originAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Destination location
  destinationLat: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  destinationLng: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  destinationAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      'Unassigned',
      'Assigned',
      'At Store',
      'Picked Up',
      'In Progress',
      'Successful',
      'Failed'
    ),
    defaultValue: 'Unassigned'
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
    defaultValue: 'Medium'
  },
  orderType: {
    type: DataTypes.ENUM('PICKUP', 'DELIVERY'),
    defaultValue: 'DELIVERY'
  },
  // Foreign keys for relationships
  driverId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'drivers',
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
  storeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'stores',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'order',
  timestamps: true,
  indexes: [
    // Index for foreign keys to improve join performance
    { fields: ['driver_id'] },
    { fields: ['vehicle_id'] },
    { fields: ['store_id'] },
    // Index for frequently queried fields
    { fields: ['status'] },
    { fields: ['priority'] },
    // Composite indexes for common query patterns
    { fields: ['status', 'priority'] },
    { fields: ['store_id', 'status'] },
    { fields: ['driver_id', 'status'] }
  ],
  hooks: {
    // Add activity log entry when status changes (only on updates, not creation)
    afterUpdate: async (order) => {
      if (order.changed('status')) {
        await ActivityLog.create({
          orderId: order.id,
          status: order.status,
          timestamp: new Date()
        });
      }
    }
  }
});

// Associations are defined in associations.js

export { Order, OrderItem, ActivityLog };