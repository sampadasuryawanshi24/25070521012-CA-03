const SavingsGoal = require('../models/SavingsGoal');

// @desc    Get all savings goals with calculated progress
// @route   GET /api/savings
// @access  Private
exports.getSavingsGoals = async (req, res, next) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user.id }).sort({ targetDate: 1 });

    const enrichedGoals = goals.map((goal) => {
      const g = goal.toObject();
      const percent = g.targetAmount > 0
        ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))
        : 0;

      const now = new Date();
      const target = new Date(g.targetDate);
      const diffTime = target - now;
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...g,
        percent,
        daysRemaining: daysRemaining >= 0 ? daysRemaining : 0,
        isPastDue: daysRemaining < 0 && !g.isCompleted,
        remainingAmount: Math.max(0, g.targetAmount - g.currentAmount),
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedGoals.length,
      data: enrichedGoals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new savings goal
// @route   POST /api/savings
// @access  Private
exports.createSavingsGoal = async (req, res, next) => {
  try {
    const {
      title,
      targetAmount,
      currentAmount = 0,
      targetDate,
      icon = '💖',
      color = '#DCD3FF',
      notes = '',
    } = req.body;

    if (!title || !targetAmount || !targetDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, target amount, and target date 🌸',
      });
    }

    const isCompleted = Number(currentAmount) >= Number(targetAmount);

    const goal = await SavingsGoal.create({
      user: req.user.id,
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      targetDate: new Date(targetDate),
      icon,
      color,
      notes,
      isCompleted,
      contributions:
        Number(currentAmount) > 0
          ? [
              {
                amount: Number(currentAmount),
                date: new Date(),
                note: 'Initial deposit ✨',
              },
            ]
          : [],
    });

    res.status(201).json({
      success: true,
      message: 'Savings goal created! Every rupee brings you closer to your dream ✨',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add contribution to a savings goal
// @route   POST /api/savings/:id/contribute
// @access  Private
exports.addContribution = async (req, res, next) => {
  try {
    const { amount, note } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please specify a positive contribution amount in ₹ 🌸',
      });
    }

    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user.id });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found 🌸',
      });
    }

    const contributionVal = Number(amount);
    goal.currentAmount += contributionVal;
    goal.contributions.push({
      amount: contributionVal,
      date: new Date(),
      note: note || 'Savings contribution ✨',
    });

    const justCompleted = !goal.isCompleted && goal.currentAmount >= goal.targetAmount;
    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }

    await goal.save();

    res.status(200).json({
      success: true,
      justCompleted,
      message: justCompleted
        ? '🎉 OMG yay! You reached your savings goal! You did it princess! ✨💖'
        : `Added ₹${contributionVal.toLocaleString('en-IN')} to "${goal.title}"! Keep shining ✨`,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update savings goal
// @route   PUT /api/savings/:id
// @access  Private
exports.updateSavingsGoal = async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user.id });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found 🌸',
      });
    }

    const { title, targetAmount, currentAmount, targetDate, icon, color, notes, isCompleted } =
      req.body;

    if (title !== undefined) goal.title = title;
    if (targetAmount !== undefined) goal.targetAmount = Number(targetAmount);
    if (currentAmount !== undefined) goal.currentAmount = Number(currentAmount);
    if (targetDate !== undefined) goal.targetDate = new Date(targetDate);
    if (icon !== undefined) goal.icon = icon;
    if (color !== undefined) goal.color = color;
    if (notes !== undefined) goal.notes = notes;
    if (isCompleted !== undefined) goal.isCompleted = isCompleted;

    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }

    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Savings goal updated with love ✨',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete savings goal
// @route   DELETE /api/savings/:id
// @access  Private
exports.deleteSavingsGoal = async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found 🌸',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Savings goal removed ✨',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
