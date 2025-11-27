import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a challenge name'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a challenge description']
  },
  type: {
    type: String,
    enum: ['COMPLETE_ORDERS', 'SUCCESS_RATE', 'ON_TIME_DELIVERIES'],
    required: true
  },
  goal: {
    type: Number,
    required: [true, 'Please add a goal value'],
    min: 1
  },
  points: {
    type: Number,
    required: [true, 'Please add points for completing this challenge'],
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for driver challenges (progress tracking)
challengeSchema.virtual('driverChallenges', {
  ref: 'DriverChallenge',
  localField: '_id',
  foreignField: 'challengeId',
  justOne: false
});

// Pre-remove hook to handle related driver challenges
challengeSchema.pre('remove', async function(next) {
  // Remove all driver challenges for this challenge
  await this.model('DriverChallenge').deleteMany({ challengeId: this._id });
  next();
});

export default mongoose.model('Challenge', challengeSchema);