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

const hubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a hub name'],
    trim: true,
    unique: true
  },
  location: {
    type: locationSchema,
    required: true
  },
  geofenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Geofence'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for teams associated with this hub
hubSchema.virtual('teams', {
  ref: 'Team',
  localField: '_id',
  foreignField: 'hubId',
  justOne: false
});

// Virtual for stores associated with this hub
hubSchema.virtual('stores', {
  ref: 'Store',
  localField: '_id',
  foreignField: 'hubId',
  justOne: false
});

// Pre-remove hook to handle related teams and stores
hubSchema.pre('remove', async function(next) {
  // Update all teams in this hub to have no hub
  await this.model('Team').updateMany(
    { hubId: this._id },
    { hubId: null }
  );
  
  // Update all stores in this hub to have no hub
  await this.model('Store').updateMany(
    { hubId: this._id },
    { hubId: null }
  );
  
  next();
});

export default mongoose.model('Hub', hubSchema);