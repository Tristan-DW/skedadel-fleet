import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';

// Define LineItem model for the items in an invoice
class LineItem extends Model {}

LineItem.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  // Foreign key for relationship with Invoice
  invoiceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'invoices',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: 'lineItem',
  timestamps: true
});

// Define the main Invoice model
class Invoice extends Model {
  // Instance method to mark invoice as paid
  async markAsPaid() {
    this.status = 'Paid';
    this.paymentDate = new Date();
    return this.save();
  }
}

Invoice.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Please add an invoice number'
      }
    }
  },
  clientName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add a client name'
      }
    }
  },
  // Foreign key for relationship with Store (optional)
  storeId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'stores',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  issueDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please add a due date'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('Paid', 'Pending', 'Overdue', 'Cancelled'),
    defaultValue: 'Pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Foreign key for relationship with User (who created the invoice)
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'invoice',
  timestamps: true,
  hooks: {
    // Before saving, calculate total amount if amount or tax changes
    beforeSave: async (invoice) => {
      if (invoice.changed('amount') || invoice.changed('tax')) {
        invoice.totalAmount = parseFloat(invoice.amount) + parseFloat(invoice.tax);
      }
      
      // Check if due date has passed and update status to Overdue if needed
      if (invoice.status === 'Pending' && new Date() > invoice.dueDate) {
        invoice.status = 'Overdue';
      }
    }
  }
});

// Associations are defined in associations.js

export { Invoice, LineItem };