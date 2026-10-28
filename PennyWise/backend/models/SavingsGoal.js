const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: [1, 'Contribution must be at least ₹1'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    trim: true,
    default: 'Savings contribution ✨',
  },
});

const savingsGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please name your savings goal ✨'],
      trim: true,
      maxlength: [100, 'Goal title cannot exceed 100 characters'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please set a target amount in ₹'],
      min: [1, 'Target amount must be at least ₹1'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount cannot be negative'],
    },
    targetDate: {
      type: Date,
      required: [true, 'Please select a target date for your goal 🌸'],
    },
    icon: {
      type: String,
      default: '💖',
    },
    color: {
      type: String,
      default: '#DCD3FF',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
      default: '',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    contributions: [contributionSchema],
  },
  {
    timestamps: true,
  }
);

savingsGoalSchema.index({ user: 1, targetDate: 1 });

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
