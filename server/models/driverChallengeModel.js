import mongoose from 'mongoose';

const driverChallengeSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a driver can only have one instance of each challenge
driverChallengeSchema.index({ driverId: 1, challengeId: 1 }, { unique: true });

// Pre-save hook to check if challenge is completed
driverChallengeSchema.pre('save', async function(next) {
  if (this.isModified('progress')) {
    try {
      // Get the challenge to check the goal
      const Challenge = this.model('Challenge');
      const challenge = await Challenge.findById(this.challengeId);
      
      if (challenge && this.progress >= challenge.goal && !this.isCompleted) {
        this.isCompleted = true;
        this.completedAt = new Date();
        
        // Update driver points
        const Driver = this.model('Driver');
        await Driver.findByIdAndUpdate(
          this.driverId,
          { $inc: { points: challenge.points } }
        );
        
        // Create an alert for challenge completion
        const Alert = this.model('Alert');
        const driver = await Driver.findById(this.driverId);
        if (driver) {
          await Alert.create({
            type: 'Challenge Completed',
            message: `${driver.name} completed the '${challenge.name}' challenge!`,
            priority: 'low',
            relatedEntityType: 'Driver',
            relatedEntityId: this.driverId
          });
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export default mongoose.model('DriverChallenge', driverChallengeSchema);