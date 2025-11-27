import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';

class DriverChallenge extends Model {}

DriverChallenge.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Foreign keys for relationships
  driverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'drivers',
      key: 'id'
    }
  },
  challengeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'challenges',
      key: 'id'
    }
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'driverChallenge',
  timestamps: true,
  indexes: [
    // Temporarily removed the compound index on driverId and challengeId
    // Will add back after table is properly created
    // {
    //   unique: true,
    //   fields: ['driverId', 'challengeId']
    // }
  ],
  hooks: {
    // Before saving, check if challenge is completed
    beforeSave: async (driverChallenge) => {
      if (driverChallenge.changed('progress')) {
        try {
          // Get the challenge to check the goal
          const Challenge = await import('./Challenge.js');
          const challenge = await Challenge.default.findByPk(driverChallenge.challenge_id);
          
          if (challenge && driverChallenge.progress >= challenge.goal && !driverChallenge.isCompleted) {
            driverChallenge.isCompleted = true;
            driverChallenge.completedAt = new Date();
            
            // Update driver points
            const Driver = await import('./Driver.js');
            await Driver.default.increment('points', { 
              by: challenge.points,
              where: { id: driverChallenge.driver_id }
            });
            
            // Create alert for challenge completion
            const Alert = await import('./Alert.js');
            const driver = await Driver.default.findByPk(driverChallenge.driver_id);
            
            if (driver) {
              await Alert.default.create({
                type: 'Challenge Completed',
                message: `${driver.name} completed the '${challenge.name}' challenge!`,
                priority: 'low',
                relatedEntityType: 'Driver',
                relatedEntityId: driverChallenge.driver_id,
                timestamp: new Date()
              });
            }
          }
        } catch (error) {
          console.error('Error in DriverChallenge beforeSave hook:', error);
        }
      }
    }
  }
});

export default DriverChallenge;