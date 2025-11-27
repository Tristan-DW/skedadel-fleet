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

const exclusionZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an exclusion zone name'],
    trim: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['No-go', 'Slow-down'],
    default: 'Slow-down'
  },
  coordinates: {
    type: [coordinateSchema],
    required: [true, 'Please add coordinates for the exclusion zone'],
    validate: {
      validator: function(coords) {
        // A valid polygon needs at least 3 points
        return coords.length >= 3;
      },
      message: 'An exclusion zone must have at least 3 coordinates'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ExclusionZone', exclusionZoneSchema);