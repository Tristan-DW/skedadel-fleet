import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';

class Vehicle extends Model {}

Vehicle.init({
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
        msg: 'Please add a vehicle name'
      }
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add a vehicle type'
      }
    }
  },
  licensePlate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Please add a license plate'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('Active', 'Maintenance', 'Decommissioned'),
    defaultValue: 'Active'
  }
}, {
  sequelize,
  modelName: 'vehicle',
  timestamps: true
});

export default Vehicle;