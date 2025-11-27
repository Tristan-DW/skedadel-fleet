import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';

class Challenge extends Model {}

Challenge.init({
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
        msg: 'Please add a challenge name'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add a challenge description'
      }
    }
  },
  type: {
    type: DataTypes.ENUM('COMPLETE_ORDERS', 'SUCCESS_RATE', 'ON_TIME_DELIVERIES'),
    allowNull: false
  },
  goal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: 1,
        msg: 'Goal must be at least 1'
      }
    }
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: 1,
        msg: 'Points must be at least 1'
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'challenge',
  timestamps: true,
  hooks: {
    // Before a challenge is deleted, delete all related driver challenges
    beforeDestroy: async (challenge) => {
      const DriverChallenge = await import('./DriverChallenge.js');
      await DriverChallenge.default.destroy({
        where: { challengeId: challenge.id }
      });
    }
  }
});

export default Challenge;