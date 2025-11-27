import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    default: ''
  }
}, { _id: false });

const driverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  location: {
    type: locationSchema,
    required: true,
    default: { lat: 0, lng: 0, address: 'Offline' }
  },
  status: {
    type: String,
    enum: ['On Duty', 'Available', 'Offline', 'Maintenance'],
    default: 'Offline'
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  points: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for orders assigned to this driver
driverSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'driverId',
  justOne: false
});

// Virtual for challenges assigned to this driver
driverSchema.virtual('challenges', {
  ref: 'DriverChallenge',
  localField: '_id',
  foreignField: 'driverId',
  justOne: false
});

export default mongoose.model('Driver', driverSchema);