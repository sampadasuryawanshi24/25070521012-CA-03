const Transaction = require('../models/Transaction');

// @desc    Get all transactions with search, filter, and sort
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const {
      type,
      category,
      paymentMethod,
      search,
      month,
      startDate,
      endDate,
      sortBy = 'date_desc',
      limit,
    } = req.query;

    const query = { user: req.user.id };

    // Filter by type (income/expense)
    if (type && type !== 'all') {
      query.type = type;
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by payment method
    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    // Search by title or notes
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by month (YYYY-MM) or date range
    if (month) {
      const [year, m] = month.split('-');
      const startOfMonth = new Date(Date.UTC(Number(year), Number(m) - 1, 1));
      const endOfMonth = new Date(Date.UTC(Number(year), Number(m), 1));
      query.date = { $gte: startOfMonth, $lt: endOfMonth };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Sorting
    let sortOption = { date: -1 };
    if (sortBy === 'date_asc') sortOption = { date: 1 };
    else if (sortBy === 'amount_desc') sortOption = { amount: -1 };
    else if (sortBy === 'amount_asc') sortOption = { amount: 1 };

    let transactionsQuery = Transaction.find(query).sort(sortOption);

    if (limit) {
      transactionsQuery = transactionsQuery.limit(Number(limit));
    }

    const transactions = await transactionsQuery;

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found 🌸',
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, paymentMethod, date, notes } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, amount, type and category ✨',
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount: Number(amount),
      type,
      category,
      paymentMethod: paymentMethod || 'UPI / GPay / PhonePe',
      date: date ? new Date(date) : new Date(),
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Transaction added successfully! 💖',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or not authorized 🌸',
      });
    }

    const { title, amount, type, category, paymentMethod, date, notes } = req.body;

    if (title !== undefined) transaction.title = title;
    if (amount !== undefined) transaction.amount = Number(amount);
    if (type !== undefined) transaction.type = type;
    if (category !== undefined) transaction.category = category;
    if (paymentMethod !== undefined) transaction.paymentMethod = paymentMethod;
    if (date !== undefined) transaction.date = new Date(date);
    if (notes !== undefined) transaction.notes = notes;

    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Transaction updated gracefully ✨',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found 🌸',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully ✨',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard financial totals and recent transactions
// @route   GET /api/transactions/summary
// @access  Private
exports.getTransactionSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const startOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1));
    const endOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 1));

    // Calculate all-time balance
    const allTransactions = await Transaction.find({ user: userId });
    let totalIncomeAllTime = 0;
    let totalExpenseAllTime = 0;

    allTransactions.forEach((t) => {
      if (t.type === 'income') totalIncomeAllTime += t.amount;
      if (t.type === 'expense') totalExpenseAllTime += t.amount;
    });

    const totalBalance = totalIncomeAllTime - totalExpenseAllTime;

    // Calculate current month income & expenses
    const monthlyTransactions = await Transaction.find({
      user: userId,
      date: { $gte: startOfMonth, $lt: endOfMonth },
    });

    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    const categoryExpenses = {};

    monthlyTransactions.forEach((t) => {
      if (t.type === 'income') {
        monthlyIncome += t.amount;
      } else if (t.type === 'expense') {
        monthlyExpenses += t.amount;
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
      }
    });

    const monthlySavings = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? Math.max(0, Math.round((monthlySavings / monthlyIncome) * 100)) : 0;

    // Recent 5 transactions
    const recentTransactions = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        savingsRate,
        recentTransactions,
        categoryExpenses,
      },
    });
  } catch (error) {
    next(error);
  }
};
