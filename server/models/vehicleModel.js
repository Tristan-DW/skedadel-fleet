import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a vehicle name'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please add a vehicle type'],
    trim: true
  },
  licensePlate: {
    type: String,
    required: [true, 'Please add a license plate'],
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Maintenance', 'Decommissioned'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for drivers assigned to this vehicle
vehicleSchema.virtual('drivers', {
  ref: 'Driver',
  localField: '_id',
  foreignField: 'vehicleId',
  justOne: false
});

// Virtual for orders assigned to this vehicle
vehicleSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'vehicleId',
  justOne: false
});

export default mongoose.model('Vehicle', vehicleSchema);