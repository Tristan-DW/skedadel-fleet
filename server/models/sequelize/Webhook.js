import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';

class Webhook extends Model {
  // Instance method to mark webhook as triggered
  async markTriggered(success = true) {
    this.lastTriggered = new Date();
    
    if (!success) {
      this.failureCount += 1;
      
      // Automatically deactivate webhook after 5 consecutive failures
      if (this.failureCount >= 5) {
        this.isActive = false;
      }
    } else {
      // Reset failure count on success
      this.failureCount = 0;
    }
    
    return this.save();
  }
}

Webhook.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: {
        msg: 'Please add a valid URL'
      },
      notEmpty: {
        msg: 'Please add a webhook URL'
      }
    }
  },
  // Store events as a JSON string
  events: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('events');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue('events', JSON.stringify(value));
      } else {
        this.setDataValue('events', '[]');
      }
    },
    validate: {
      isValidEvents(value) {
        try {
          const events = JSON.parse(value);
          if (!Array.isArray(events) || events.length === 0) {
            throw new Error('Please select at least one event to subscribe to');
          }
          
          // Check that each event is a valid event type
          const validEvents = [
            'order.created',
            'order.status_changed',
            'driver.status_changed',
            'driver.location_updated'
          ];
          
          for (const event of events) {
            if (!validEvents.includes(event)) {
              throw new Error(`Invalid event type: ${event}`);
            }
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'A secret key is required for webhook security'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lastTriggered: {
    type: DataTypes.DATE,
    allowNull: true
  },
  failureCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Foreign key for relationship with User
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'webhook',
  timestamps: true
});

export default Webhook;