const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for this transaction ✨'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount in ₹'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: {
        values: ['income', 'expense'],
        message: '{VALUE} is not a valid transaction type (income or expense)',
      },
      required: [true, 'Please specify transaction type'],
    },
    category: {
      type: String,
      required: [true, 'Please choose a category 🌸'],
      trim: true,
      default: 'Other',
    },
    paymentMethod: {
      type: String,
      enum: {
        values: [
          'Cash',
          'UPI / GPay / PhonePe',
          'Credit Card',
          'Debit Card',
          'Net Banking',
        ],
        message: '{VALUE} is not a recognized payment method',
      },
      default: 'UPI / GPay / PhonePe',
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying per user and date range
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
