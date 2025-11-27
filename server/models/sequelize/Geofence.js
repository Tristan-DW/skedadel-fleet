import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';

class Geofence extends Model { }

Geofence.init({
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
        msg: 'Please add a geofence name'
      }
    }
  },
  // For coordinates, we'll store them as a JSON string
  // In a production environment, we might use a specialized spatial data type
  coordinates: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('coordinates');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      if (Array.isArray(value)) {
        // Validate that we have at least 3 coordinates for a valid polygon
        if (value.length < 3) {
          throw new Error('A geofence must have at least 3 coordinates');
        }
        this.setDataValue('coordinates', JSON.stringify(value));
      } else {
        this.setDataValue('coordinates', '[]');
      }
    },
    validate: {
      isValidCoordinates(value) {
        try {
          const coords = JSON.parse(value);
          if (!Array.isArray(coords) || coords.length < 3) {
            throw new Error('A geofence must have at least 3 coordinates');
          }

          // Check that each coordinate has lat and lng
          for (const coord of coords) {
            if (coord.lat === null || coord.lat === undefined || coord.lng === null || coord.lng === undefined) {
              throw new Error('Each coordinate must have lat and lng properties');
            }
          }
        } catch (error) {
          throw new Error('Invalid coordinates format');
        }
      }
    }
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: 'rgba(59, 130, 246, 0.2)'
  }
}, {
  sequelize,
  modelName: 'geofence',
  timestamps: true,
  indexes: [
    // Index for frequently queried fields
    { fields: ['name'] },
    // Note: We can't directly index the coordinates field as it's stored as TEXT
    // Consider using a specialized spatial database or extension for better geospatial query performance
  ],
  hooks: {
    // Before a geofence is deleted, update all hubs to have no geofence
    beforeDestroy: async (geofence) => {
      const Hub = await import('./Hub.js');
      await Hub.default.update(
        { geofence_id: null },
        { where: { geofence_id: geofence.id } }
      );
    }
  }
});

export default Geofence;