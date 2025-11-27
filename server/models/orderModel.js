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
    required: [true, 'Please add an address']
  }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const activityLogSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Unassigned', 'Assigned', 'At Store', 'Picked Up', 'In Progress', 'Successful', 'Failed'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an order title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add an order description']
  },
  customerName: {
    type: String,
    required: [true, 'Please add a customer name'],
    trim: true
  },
  customerPhone: {
    type: String,
    required: [true, 'Please add a customer phone number']
  },
  origin: {
    type: locationSchema,
    required: true
  },
  destination: {
    type: locationSchema,
    required: true
  },
  status: {
    type: String,
    enum: ['Unassigned', 'Assigned', 'At Store', 'Picked Up', 'In Progress', 'Successful', 'Failed'],
    default: 'Unassigned'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  orderType: {
    type: String,
    enum: ['PICKUP', 'DELIVERY'],
    default: 'DELIVERY'
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  orderItems: {
    type: [orderItemSchema],
    default: []
  },
  activityLog: {
    type: [activityLogSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add activity log entry when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.activityLog.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

export default mongoose.model('Order', orderSchema);