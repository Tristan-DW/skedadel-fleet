import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'Driver Delayed',
      'Order Failed',
      'Low Coverage',
      'Order Status Updated',
      'Entered Exclusion Zone',
      'Challenge Completed'
    ],
    required: true
  },
  message: {
    type: String,
    required: [true, 'Please add an alert message'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedEntityType: {
    type: String,
    enum: ['Driver', 'Order', 'Store', 'Team', 'Hub', 'Challenge'],
    required: false
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries and automatic expiration
alertSchema.index({ timestamp: 1 }, { 
  expireAfterSeconds: 7 * 24 * 60 * 60 // Automatically delete alerts after 7 days
});

export default mongoose.model('Alert', alertSchema);