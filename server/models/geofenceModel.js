import mongoose from 'mongoose';

const coordinateSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  }
}, { _id: false });

const geofenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a geofence name'],
    trim: true,
    unique: true
  },
  coordinates: {
    type: [coordinateSchema],
    required: [true, 'Please add coordinates for the geofence'],
    validate: {
      validator: function(coords) {
        // A valid polygon needs at least 3 points
        return coords.length >= 3;
      },
      message: 'A geofence must have at least 3 coordinates'
    }
  },
  color: {
    type: String,
    default: 'rgba(59, 130, 246, 0.2)'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for hubs associated with this geofence
geofenceSchema.virtual('hubs', {
  ref: 'Hub',
  localField: '_id',
  foreignField: 'geofenceId',
  justOne: false
});

// Pre-remove hook to handle related hubs
geofenceSchema.pre('remove', async function(next) {
  // Update all hubs in this geofence to have no geofence
  await this.model('Hub').updateMany(
    { geofenceId: this._id },
    { geofenceId: null }
  );
  
  next();
});

export default mongoose.model('Geofence', geofenceSchema);