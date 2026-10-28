const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// Helper to get default month string
const getCurrentMonthStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// @desc    Get all budgets for a month with live spent calculation from transactions
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res, next) => {
  try {
    const month = req.query.month || getCurrentMonthStr();
    const userId = req.user.id;

    // Get all budgets for this month
    const budgets = await Budget.find({ user: userId, month }).lean();

    // Get date range for the month to query transactions
    const [year, m] = month.split('-');
    const startOfMonth = new Date(Date.UTC(Number(year), Number(m) - 1, 1));
    const endOfMonth = new Date(Date.UTC(Number(year), Number(m), 1));

    // Aggregate actual expense transactions for this month grouped by category
    const expenseAggregation = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
        },
      },
    ]);

    const spentMap = {};
    expenseAggregation.forEach((item) => {
      spentMap[item._id] = item.totalSpent;
    });

    // Merge budgets with live spending calculations
    let totalBudgeted = 0;
    let totalSpent = 0;

    const enrichedBudgets = budgets.map((b) => {
      const spent = spentMap[b.category] || 0;
      const remaining = Math.max(0, b.limit - spent);
      const percent = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;
      let status = 'safe'; // green/mint
      if (percent >= 100) {
        status = 'exceeded'; // plum/warning
      } else if (percent >= 80) {
        status = 'warning'; // peach/pink
      }

      totalBudgeted += b.limit;
      totalSpent += spent;

      return {
        ...b,
        spent,
        remaining,
        percent,
        status,
        isOverBudget: spent > b.limit,
        overAmount: spent > b.limit ? spent - b.limit : 0,
      };
    });

    const totalRemaining = Math.max(0, totalBudgeted - totalSpent);
    const overallPercent = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

    res.status(200).json({
      success: true,
      month,
      overview: {
        totalBudgeted,
        totalSpent,
        totalRemaining,
        overallPercent,
      },
      data: enrichedBudgets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or upsert budget
// @route   POST /api/budgets
// @access  Private
exports.createBudget = async (req, res, next) => {
  try {
    const { category, limit, month = getCurrentMonthStr(), notes } = req.body;

    if (!category || !limit) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both category and monthly limit 🌸',
      });
    }

    // Check if a budget already exists for this category and month
    let budget = await Budget.findOne({
      user: req.user.id,
      category,
      month,
    });

    if (budget) {
      budget.limit = Number(limit);
      if (notes !== undefined) budget.notes = notes;
      await budget.save();
      return res.status(200).json({
        success: true,
        message: 'Budget updated successfully! ✨',
        data: budget,
      });
    }

    budget = await Budget.create({
      user: req.user.id,
      category,
      limit: Number(limit),
      month,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Budget created successfully! 💖',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = async (req, res, next) => {
  try {
    const { limit, notes, category } = req.body;
    let budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found 🌸',
      });
    }

    if (limit !== undefined) budget.limit = Number(limit);
    if (notes !== undefined) budget.notes = notes;
    if (category !== undefined) budget.category = category;

    await budget.save();

    res.status(200).json({
      success: true,
      message: 'Budget updated with love ✨',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found 🌸',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget removed gracefully ✨',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
