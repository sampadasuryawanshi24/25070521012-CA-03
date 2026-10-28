const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');

const seedUserData = async (userId) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const currentMonthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Clear existing demo data for user
  await Transaction.deleteMany({ user: userId });
  await Budget.deleteMany({ user: userId });
  await SavingsGoal.deleteMany({ user: userId });

  // 1. Transactions
  const sampleTransactions = [
    {
      user: userId,
      title: 'Monthly Tech Salary 💼',
      amount: 85000,
      type: 'income',
      category: 'Salary',
      paymentMethod: 'Net Banking',
      date: new Date(year, month, 1),
      notes: 'Monthly direct deposit from dream job ✨',
    },
    {
      user: userId,
      title: 'UI/UX Freelance Design Project 💻',
      amount: 25000,
      type: 'income',
      category: 'Freelance',
      paymentMethod: 'UPI / GPay / PhonePe',
      date: new Date(year, month, 5),
      notes: 'Branding kit for client 🌸',
    },
    {
      user: userId,
      title: 'Cozy Studio Apartment Rent 🏡',
      amount: 28000,
      type: 'expense',
      category: 'Housing',
      paymentMethod: 'Net Banking',
      date: new Date(year, month, 2),
      notes: 'Rent + maintenance for our sanctuary 🕊️',
    },
    {
      user: userId,
      title: 'Pink Matcha Latte & Croissant 🍵🥐',
      amount: 450,
      type: 'expense',
      category: 'Food & Dining',
      paymentMethod: 'UPI / GPay / PhonePe',
      date: new Date(year, month, 4),
      notes: 'Sunday study date with besties 💕',
    },
    {
      user: userId,
      title: 'Korean Skincare & Sunscreen Haul 🧴💄',
      amount: 3200,
      type: 'expense',
      category: 'Beauty & Self-Care',
      paymentMethod: 'Credit Card',
      date: new Date(year, month, 7),
      notes: 'Restocked glass-skin serums ✨',
    },
    {
      user: userId,
      title: 'Cute Gen-Z Planner & Pastel Highlighters 🎀',
      amount: 1250,
      type: 'expense',
      category: 'Shopping',
      paymentMethod: 'UPI / GPay / PhonePe',
      date: new Date(year, month, 10),
      notes: 'Stationery addiction strikes again! 🌸',
    },
    {
      user: userId,
      title: 'Organic Groceries & Berries 🍓🥑',
      amount: 4200,
      type: 'expense',
      category: 'Food & Dining',
      paymentMethod: 'Debit Card',
      date: new Date(year, month, 12),
      notes: 'Healthy wholesome treats for meal prep',
    },
    {
      user: userId,
      title: 'Metro Smart Card Recharge 🚇',
      amount: 1000,
      type: 'expense',
      category: 'Transportation',
      paymentMethod: 'UPI / GPay / PhonePe',
      date: new Date(year, month, 14),
      notes: 'Monthly commute pass',
    },
    {
      user: userId,
      title: 'Pilates Studio Membership 🧘‍♀️',
      amount: 3500,
      type: 'expense',
      category: 'Health & Wellness',
      paymentMethod: 'UPI / GPay / PhonePe',
      date: new Date(year, month, 15),
      notes: 'Core strength & cute pink grip socks',
    },
    {
      user: userId,
      title: 'High-speed Fiber WiFi & Netflix 🎬',
      amount: 1499,
      type: 'expense',
      category: 'Bills & Utilities',
      paymentMethod: 'Net Banking',
      date: new Date(year, month, 16),
      notes: 'Essential cozy weekend binge utilities ✨',
    },
    {
      user: userId,
      title: 'Cute Lavender Summer Dress 👗',
      amount: 2800,
      type: 'expense',
      category: 'Shopping',
      paymentMethod: 'Credit Card',
      date: new Date(year, month, 18),
      notes: 'For next weekend brunch 🌷',
    },
  ];

  await Transaction.insertMany(sampleTransactions);

  // 2. Budgets
  const sampleBudgets = [
    {
      user: userId,
      category: 'Food & Dining',
      limit: 12000,
      month: currentMonthStr,
      notes: 'Cafes, lunches and boba teas 🍰',
    },
    {
      user: userId,
      category: 'Shopping',
      limit: 8000,
      month: currentMonthStr,
      notes: 'Fashion, stationery and cute accessories 🛍️',
    },
    {
      user: userId,
      category: 'Housing',
      limit: 30000,
      month: currentMonthStr,
      notes: 'Rent and home upkeep 🏡',
    },
    {
      user: userId,
      category: 'Beauty & Self-Care',
      limit: 6000,
      month: currentMonthStr,
      notes: 'Skincare, hair and pampering 💄',
    },
    {
      user: userId,
      category: 'Health & Wellness',
      limit: 5000,
      month: currentMonthStr,
      notes: 'Fitness and vitamins 🧘‍♀️',
    },
  ];

  await Budget.insertMany(sampleBudgets);

  // 3. Savings Goals
  const sampleGoals = [
    {
      user: userId,
      title: 'Cherry Blossom Trip to Kyoto 🌸✈️',
      targetAmount: 150000,
      currentAmount: 95000,
      targetDate: new Date(year + 1, 3, 1),
      icon: '✈️',
      color: '#F8DCE8',
      notes: 'Springtime blossom walks and matcha soft serve!',
      isCompleted: false,
      contributions: [
        { amount: 50000, date: new Date(year, month - 2, 1), note: 'Initial savings deposit 🌸' },
        { amount: 25000, date: new Date(year, month - 1, 1), note: 'Monthly contribution ✨' },
        { amount: 20000, date: new Date(year, month, 5), note: 'Freelance project bonus 💕' },
      ],
    },
    {
      user: userId,
      title: 'M3 MacBook Pro Rose Silver 💻',
      targetAmount: 120000,
      currentAmount: 120000,
      targetDate: new Date(year, month + 1, 15),
      icon: '💻',
      color: '#DCD3FF',
      notes: 'For coding cute apps and digital journaling! ✨',
      isCompleted: true,
      contributions: [
        { amount: 60000, date: new Date(year, month - 2, 10), note: 'First half saved!' },
        { amount: 60000, date: new Date(year, month - 1, 20), note: 'Goal reached! 🎉' },
      ],
    },
    {
      user: userId,
      title: 'Rainy Day Emergency Sanctuary 🛡️',
      targetAmount: 100000,
      currentAmount: 65000,
      targetDate: new Date(year, 11, 31),
      icon: '🛡️',
      color: '#DDF2E4',
      notes: '6 months of peace of mind and comfort 🌿',
      isCompleted: false,
      contributions: [
        { amount: 35000, date: new Date(year, month - 3, 1), note: 'Base fund' },
        { amount: 30000, date: new Date(year, month - 1, 15), note: 'Added savings' },
      ],
    },
  ];

  await SavingsGoal.insertMany(sampleGoals);

  return { message: 'Sample demo data seeded with love! ✨' };
};

module.exports = { seedUserData };
