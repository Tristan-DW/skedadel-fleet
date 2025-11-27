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

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a store name'],
    trim: true,
    unique: true
  },
  location: {
    type: locationSchema,
    required: true
  },
  manager: {
    type: String,
    required: [true, 'Please add a manager name'],
    trim: true
  },
  hubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hub',
    required: [true, 'Please assign a hub to this store']
  },
  status: {
    type: String,
    enum: ['ONLINE', 'OFFLINE'],
    default: 'ONLINE'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for orders associated with this store
storeSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'storeId',
  justOne: false
});

export default mongoose.model('Store', storeSchema);