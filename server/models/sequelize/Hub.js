import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';

class Hub extends Model {}

Hub.init({
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
        msg: 'Please add a hub name'
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
  // Foreign key for relationship with Geofence
  geofenceId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'geofences',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'hub',
  timestamps: true,
  indexes: [
    // Index for foreign keys to improve join performance
    { fields: ['geofence_id'] },
    // Spatial index for location-based queries
    { fields: ['latitude', 'longitude'] }
  ],
  hooks: {
    // Before a hub is deleted, update all teams and stores to have no hub
    beforeDestroy: async (hub) => {
      const Team = await import('./Team.js');
      const Store = await import('./Store.js');
      
      await Team.default.update(
        { hub_id: null },
        { where: { hub_id: hub.id } }
      );
      
      await Store.default.update(
        { hub_id: null },
        { where: { hub_id: hub.id } }
      );
    }
  }
});

export default Hub;