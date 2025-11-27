import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, 'Please add an invoice number'],
    unique: true,
    trim: true
  },
  clientName: {
    type: String,
    required: [true, 'Please add a client name'],
    trim: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: false
  },
  amount: {
    type: Number,
    required: [true, 'Please add an invoice amount'],
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please add a total invoice amount'],
    min: 0
  },
  lineItems: {
    type: [lineItemSchema],
    default: []
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue', 'Cancelled'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true
  },
  paymentDate: {
    type: Date,
    default: null
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

// Virtual for related orders
invoiceSchema.virtual('orders', {
  ref: 'Order',
  localField: 'storeId',
  foreignField: 'storeId',
  justOne: false,
  options: { 
    match: { 
      createdAt: { 
        $gte: function() { return new Date(this.issueDate).setDate(new Date(this.issueDate).getDate() - 30) },
        $lte: function() { return this.issueDate }
      } 
    } 
  }
});

// Method to mark invoice as paid
invoiceSchema.methods.markAsPaid = function() {
  this.status = 'Paid';
  this.paymentDate = new Date();
  return this.save();
};

// Pre-save hook to calculate total amount
invoiceSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('tax')) {
    this.totalAmount = this.amount + this.tax;
  }
  
  // Check if due date has passed
  if (this.status === 'Pending' && new Date() > this.dueDate) {
    this.status = 'Overdue';
  }
  
  next();
});

export default mongoose.model('Invoice', invoiceSchema);