import mongoose from 'mongoose';

const webhookSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please add a webhook URL'],
    match: [
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
      'Please add a valid URL'
    ]
  },
  events: {
    type: [String],
    enum: [
      'order.created',
      'order.status_changed',
      'driver.status_changed',
      'driver.location_updated'
    ],
    required: [true, 'Please select at least one event to subscribe to'],
    validate: {
      validator: function(events) {
        return events.length > 0;
      },
      message: 'At least one event must be selected'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  secret: {
    type: String,
    required: [true, 'A secret key is required for webhook security']
  },
  description: {
    type: String,
    trim: true
  },
  lastTriggered: {
    type: Date,
    default: null
  },
  failureCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to mark webhook as triggered
webhookSchema.methods.markTriggered = function(success = true) {
  this.lastTriggered = new Date();
  if (!success) {
    this.failureCount += 1;
    
    // Automatically deactivate webhook after 5 consecutive failures
    if (this.failureCount >= 5) {
      this.isActive = false;
    }
  } else {
    // Reset failure count on success
    this.failureCount = 0;
  }
  return this.save();
};

export default mongoose.model('Webhook', webhookSchema);