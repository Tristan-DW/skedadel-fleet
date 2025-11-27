import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';

class Store extends Model {}

Store.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Please add a store name'
      }
    }
  },
  // Location data
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please provide latitude'
      }
    }
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please provide longitude'
      }
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add an address'
      }
    }
  },
  manager: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add a manager name'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('ONLINE', 'OFFLINE'),
    defaultValue: 'ONLINE'
  },
  // Foreign key for relationship with Hub
  hubId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'hubs',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'Please assign a hub to this store'
      }
    }
  }
}, {
  sequelize,
  modelName: 'store',
  timestamps: true,
  indexes: [
    // Index for foreign keys to improve join performance
    { fields: ['hub_id'] },
    // Index for frequently queried fields
    { fields: ['status'] },
    // Composite indexes for common query patterns
    { fields: ['hub_id', 'status'] },
    // Spatial index for location-based queries
    { fields: ['latitude', 'longitude'] }
  ]
});

export default Store;