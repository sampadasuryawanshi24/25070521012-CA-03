const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// @desc    Get complete analytics data and smart insights
// @route   GET /api/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all transactions for this user
    const transactions = await Transaction.find({ user: userId }).sort({ date: 1 });

    if (transactions.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          monthlyTrends: [],
          categoryBreakdown: [],
          paymentMethodBreakdown: [],
          insights: [
            {
              type: 'info',
              icon: '✨',
              title: 'Welcome to your financial journey!',
              text: 'Start adding your daily expenses and income to unlock adorable personalized analytics and smart tips.',
            },
          ],
          metrics: {
            totalIncome: 0,
            totalExpenses: 0,
            netSavings: 0,
            savingsRate: 0,
            avgDailySpend: 0,
            topCategory: 'None yet',
          },
        },
      });
    }

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryMap = {};
    const paymentMap = {};
    const monthMap = {}; // key: 'YYYY-MM'

    // Process transactions
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      if (!monthMap[monthKey]) {
        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        monthMap[monthKey] = {
          monthKey,
          label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
          income: 0,
          expenses: 0,
          savings: 0,
        };
      }

      if (t.type === 'income') {
        totalIncome += t.amount;
        monthMap[monthKey].income += t.amount;
      } else if (t.type === 'expense') {
        totalExpenses += t.amount;
        monthMap[monthKey].expenses += t.amount;
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        paymentMap[t.paymentMethod] = (paymentMap[t.paymentMethod] || 0) + t.amount;
      }
    });

    // Format monthly trends
    const monthlyTrends = Object.values(monthMap).map((m) => ({
      ...m,
      savings: Math.max(0, m.income - m.expenses),
    }));

    // Format category breakdown
    const categoryBreakdown = Object.keys(categoryMap)
      .map((cat) => ({
        category: cat,
        amount: categoryMap[cat],
        percentage:
          totalExpenses > 0 ? Math.round((categoryMap[cat] / totalExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Format payment method breakdown
    const paymentMethodBreakdown = Object.keys(paymentMap)
      .map((pm) => ({
        method: pm,
        amount: paymentMap[pm],
        percentage:
          totalExpenses > 0 ? Math.round((paymentMap[pm] / totalExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Calculate smart metrics
    const netSavings = totalIncome - totalExpenses;
    const savingsRate =
      totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

    // Daily spend estimate (over distinct days or past 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent30DaysExpenses = transactions
      .filter((t) => t.type === 'expense' && new Date(t.date) >= thirtyDaysAgo)
      .reduce((sum, t) => sum + t.amount, 0);

    const avgDailySpend = Math.round(recent30DaysExpenses / 30);
    const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0].category : 'None';

    // Generate cute real-time insights
    const insights = [];

    if (savingsRate >= 30) {
      insights.push({
        type: 'success',
        icon: '👑',
        title: 'Royalty Savings Habit!',
        text: `You have an incredible ${savingsRate}% savings rate! Your future self is already dancing with joy.`,
      });
    } else if (savingsRate > 0) {
      insights.push({
        type: 'info',
        icon: '🌱',
        title: 'Building Momentum',
        text: `Your current savings rate is ${savingsRate}%. A gentle goal of 20% will give you even more peace of mind!`,
      });
    } else {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Budget Alert, Princess',
        text: `Expenses are matching or exceeding your income. Let's look at non-essential treats to restore balance!`,
      });
    }

    if (categoryBreakdown.length > 0) {
      const top = categoryBreakdown[0];
      insights.push({
        type: 'neutral',
        icon: '🛍️',
        title: `Top Spending: ${top.category}`,
        text: `${top.category} represents ${top.percentage}% of your total spending (₹${top.amount.toLocaleString('en-IN')}).`,
      });
    }

    if (paymentMethodBreakdown.length > 0) {
      const favPayment = paymentMethodBreakdown[0];
      insights.push({
        type: 'neutral',
        icon: '📱',
        title: `Preferred Payment Method`,
        text: `You use ${favPayment.method} for ${favPayment.percentage}% of your purchases. Quick tap and go!`,
      });
    }

    insights.push({
      type: 'tip',
      icon: '✨',
      title: 'Princess Wealth Secret',
      text: 'Every small rupee consciously saved is a seed planted for your biggest, most beautiful dreams.',
    });

    res.status(200).json({
      success: true,
      data: {
        monthlyTrends,
        categoryBreakdown,
        paymentMethodBreakdown,
        insights,
        metrics: {
          totalIncome,
          totalExpenses,
          netSavings,
          savingsRate,
          avgDailySpend,
          topCategory,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
