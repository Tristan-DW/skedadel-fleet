import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a team name'],
    trim: true,
    unique: true
  },
  hubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hub',
    required: [true, 'Please assign a hub to this team']
  },
  teamLeadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please assign a team lead']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for drivers in this team
teamSchema.virtual('drivers', {
  ref: 'Driver',
  localField: '_id',
  foreignField: 'teamId',
  justOne: false
});

// Pre-remove hook to handle related drivers
teamSchema.pre('remove', async function(next) {
  // Update all drivers in this team to have no team
  await this.model('Driver').updateMany(
    { teamId: this._id },
    { teamId: null }
  );
  next();
});

export default mongoose.model('Team', teamSchema);