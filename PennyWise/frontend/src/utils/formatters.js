/**
 * Format currency in Indian Rupees using ₹ and Indian number formatting.
 * Examples: 1000 -> ₹1,000; 125000 -> ₹1,25,000
 */
export const formatINR = (amount, includeDecimals = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const num = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(num);
};

/**
 * Format date nicely (e.g. "24 Oct 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Category metadata: icons, cute tags, and colors
 */
export const CATEGORIES = {
  // Expense categories
  'Food & Dining': { icon: '🍰', color: '#F8DCE8', type: 'expense' },
  'Shopping': { icon: '🛍️', color: '#DCD3FF', type: 'expense' },
  'Housing': { icon: '🏡', color: '#DDF2E4', type: 'expense' },
  'Beauty & Self-Care': { icon: '💄', color: '#F8DCE8', type: 'expense' },
  'Transportation': { icon: '🚗', color: '#DCD3FF', type: 'expense' },
  'Bills & Utilities': { icon: '📱', color: '#FFE5D4', type: 'expense' },
  'Entertainment': { icon: '🍿', color: '#F8DCE8', type: 'expense' },
  'Health & Wellness': { icon: '🧘‍♀️', color: '#DDF2E4', type: 'expense' },
  'Education': { icon: '📚', color: '#DCD3FF', type: 'expense' },
  'Travel': { icon: '✈️', color: '#DCD3FF', type: 'expense' },
  'Gifts': { icon: '🎁', color: '#F8DCE8', type: 'expense' },
  'Other Expense': { icon: '✨', color: '#DCD3FF', type: 'expense' },

  // Income categories
  'Salary': { icon: '💼', color: '#DDF2E4', type: 'income' },
  'Freelance': { icon: '💻', color: '#DCD3FF', type: 'income' },
  'Investments': { icon: '📈', color: '#DDF2E4', type: 'income' },
  'Gift Received': { icon: '🎀', color: '#F8DCE8', type: 'income' },
  'Allowance': { icon: '🪙', color: '#FFE5D4', type: 'income' },
  'Other Income': { icon: '🌸', color: '#DDF2E4', type: 'income' },
};

export const getCategoryIcon = (catName) => {
  return CATEGORIES[catName]?.icon || '🌸';
};

export const getCategoryColor = (catName) => {
  return CATEGORIES[catName]?.color || '#DCD3FF';
};

/**
 * Greeting based on current time
 */
export const getTimeGreeting = (greetingTitle = 'princess') => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return `Good morning, ${greetingTitle} ✨`;
  } else if (hour < 17) {
    return `Good afternoon, ${greetingTitle} 🌸`;
  } else {
    return `Good evening, ${greetingTitle} 🌙`;
  }
};

/**
 * Motivational quote collection
 */
export const MOTIVATIONAL_QUOTES = [
  'Little steps today, bigger dreams tomorrow. ✨',
  'You are worthy of financial peace, softness and abundance. 🌸',
  'Save like a queen, spend like a mindful princess. 👑',
  'Every single rupee has a purpose and a little sprinkle of magic. 🎀',
  'Gentle budgets create sparkling futures. 🌷',
  'Celebrating every small victory on your financial journey! 💖',
];

export const getRandomQuote = () => {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
};
