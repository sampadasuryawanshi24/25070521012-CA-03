import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  RefreshCw,
  ChevronRight,
  Target,
  PieChart as PieIcon,
  Heart,
  Smile,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  formatINR,
  formatDate,
  getTimeGreeting,
  getRandomQuote,
  getCategoryIcon,
} from '../utils/formatters';

const PASTEL_COLORS = ['#8C78C8', '#F8DCE8', '#DDF2E4', '#DCD3FF', '#FFE5D4', '#B8A7F7', '#F0B8D2', '#C4B5FD'];

export const DashboardPage = ({ onOpenAddModal, setActiveTab }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySavings: 0,
    savingsRate: 0,
    recentTransactions: [],
  });
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [quote, setQuote] = useState(getRandomQuote());

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, budgetsRes, goalsRes] = await Promise.all([
        api.getTransactionSummary(),
        api.getBudgets(),
        api.getSavingsGoals(),
      ]);

      if (summaryRes.success) {
        setSummary(summaryRes.data);
      }
      if (budgetsRes.success) {
        setBudgets(budgetsRes.data || []);
      }
      if (goalsRes.success) {
        setSavingsGoals(goalsRes.data || []);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not load financial data. Check server connectivity.', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Prepare chart data for Income vs Expense
  const comparisonData = [
    {
      name: 'This Month',
      Income: summary.monthlyIncome,
      Expenses: summary.monthlyExpenses,
      Savings: Math.max(0, summary.monthlySavings),
    },
  ];

  // Category Pie Data
  const categoryPieData = summary.categoryExpenses
    ? Object.keys(summary.categoryExpenses).map((cat) => ({
        name: cat,
        value: summary.categoryExpenses[cat],
      }))
    : [];

  const greeting = getTimeGreeting(user?.preferredGreeting || 'princess');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Top Banner with Greeting & Motivational Quote */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(220, 211, 255, 0.45) 0%, rgba(248, 220, 232, 0.55) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          border: '1.5px solid rgba(220, 211, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.6rem' }}>{user?.avatar || '👑'}</span>
            <h1
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: 'var(--color-deep-plum)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {greeting}, {user?.name || 'Princess'}!
            </h1>
          </div>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-deep-plum)',
              margin: '4px 0 0 0',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>"{quote}"</span>
            <button
              onClick={() => setQuote(getRandomQuote())}
              title="Shuffle motivational quote"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-muted-purple)',
                padding: '2px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <RefreshCw size={14} />
            </button>
          </p>
        </div>

        {/* Quick Add Actions */}
        <div style={{ display: 'flex', gap: '12px', zIndex: 2 }}>
          <button
            onClick={() => onOpenAddModal('expense')}
            className="btn btn-pink"
            style={{ padding: '12px 20px', boxShadow: '0 4px 14px rgba(248, 220, 232, 0.6)' }}
          >
            <ArrowDownRight size={18} />
            <span>+ Add Expense</span>
          </button>
          <button
            onClick={() => onOpenAddModal('income')}
            className="btn btn-mint"
            style={{ padding: '12px 20px', boxShadow: '0 4px 14px rgba(221, 242, 228, 0.6)' }}
          >
            <ArrowUpRight size={18} />
            <span>+ Add Income</span>
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Total Balance */}
        <div className="cute-card" style={{ borderLeft: '5px solid var(--color-muted-purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-plum-subtle)' }}>
              Total Balance 💰
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--color-lavender-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-muted-purple)',
              }}
            >
              <Wallet size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-deep-plum)', marginBottom: '4px' }}>
            {formatINR(summary.totalBalance)}
          </div>
          <span className="badge badge-lavender">All Accounts</span>
        </div>

        {/* Monthly Income */}
        <div className="cute-card" style={{ borderLeft: '5px solid #8ccba2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-plum-subtle)' }}>
              Monthly Income 🌸
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--color-mint-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1f5933',
              }}
            >
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1f5933', marginBottom: '4px' }}>
            {formatINR(summary.monthlyIncome)}
          </div>
          <span className="badge badge-mint">This Month</span>
        </div>

        {/* Monthly Expenses */}
        <div className="cute-card" style={{ borderLeft: '5px solid #f0b8d2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-plum-subtle)' }}>
              Monthly Expenses 💸
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--color-pink-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8f2e51',
              }}
            >
              <TrendingDown size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8f2e51', marginBottom: '4px' }}>
            {formatINR(summary.monthlyExpenses)}
          </div>
          <span className="badge badge-pink">This Month</span>
        </div>

        {/* Monthly Savings & Rate */}
        <div className="cute-card" style={{ borderLeft: '5px solid #b8a7f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-plum-subtle)' }}>
              Monthly Savings ✨
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--color-lavender-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-muted-purple)',
              }}
            >
              <PiggyBank size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-deep-plum)', marginBottom: '4px' }}>
            {formatINR(summary.monthlySavings)}
          </div>
          <span className="badge badge-lavender">
            {summary.savingsRate}% Savings Rate
          </span>
        </div>
      </div>

      {/* Charts Section: Income vs Expense and Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {/* Bar Comparison Chart */}
        <div className="cute-card">
          <div className="card-header-cute">
            <div>
              <h2 style={{ fontSize: '1.15rem' }}>Monthly Overview</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-plum-subtle)' }}>
                Income vs Expenses vs Savings
              </p>
            </div>
            <span className="badge badge-lavender">₹ INR</span>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            {summary.monthlyIncome === 0 && summary.monthlyExpenses === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-plum-subtle)' }}>
                <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🌸</span>
                <p style={{ fontSize: '0.9rem' }}>No transactions recorded for this month yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#8C78C8" />
                  <YAxis stroke="#8C78C8" tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`} />
                  <Tooltip
                    formatter={(val) => [formatINR(val), '']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid var(--color-lavender)',
                      boxShadow: 'var(--shadow-md)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Income" fill="#8ccba2" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#f0b8d2" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="Savings" fill="#8C78C8" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Expense Donut Chart */}
        <div className="cute-card">
          <div className="card-header-cute">
            <div>
              <h2 style={{ fontSize: '1.15rem' }}>Where Money Blooms 🌸</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-plum-subtle)' }}>
                Category-wise expense breakdown
              </p>
            </div>
            <PieIcon size={20} color="var(--color-muted-purple)" />
          </div>

          <div style={{ width: '100%', height: 260 }}>
            {categoryPieData.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-plum-subtle)' }}>
                <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🍰</span>
                <p style={{ fontSize: '0.9rem' }}>No expense categories recorded yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PASTEL_COLORS[index % PASTEL_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [formatINR(val), 'Spent']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid var(--color-lavender)',
                      boxShadow: 'var(--shadow-md)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Lower Row: Recent Transactions & Active Budgets/Goals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Recent Transactions List */}
        <div className="cute-card">
          <div className="card-header-cute">
            <div>
              <h2 style={{ fontSize: '1.15rem' }}>Recent Spending & Treats ✨</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-plum-subtle)' }}>
                Latest 5 activity items
              </p>
            </div>
            <button
              onClick={() => setActiveTab('transactions')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-muted-purple)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View all <ChevronRight size={16} />
            </button>
          </div>

          {summary.recentTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--color-plum-subtle)' }}>
              <span style={{ fontSize: '2.5rem' }}>🛍️</span>
              <p style={{ marginTop: '8px', fontSize: '0.92rem' }}>No recent transactions found.</p>
              <button
                onClick={() => onOpenAddModal('expense')}
                className="btn btn-pink btn-sm"
                style={{ marginTop: '12px' }}
              >
                + Add your first expense 🍰
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {summary.recentTransactions.map((tx) => (
                <div
                  key={tx._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-cream)',
                    border: '1px solid rgba(220, 211, 255, 0.4)',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                        boxShadow: 'var(--shadow-sm)',
                        flexShrink: 0,
                      }}
                    >
                      {getCategoryIcon(tx.category)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-deep-plum)' }}>
                        {tx.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-plum-subtle)' }}>
                        {formatDate(tx.date)} • {tx.paymentMethod}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: tx.type === 'income' ? '#1f5933' : '#8f2e51',
                      }}
                    >
                      {tx.type === 'income' ? '+' : '-'} {formatINR(tx.amount)}
                    </div>
                    <span
                      className={`badge ${tx.type === 'income' ? 'badge-mint' : 'badge-pink'}`}
                      style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                    >
                      {tx.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Budgets & Savings Goals Quick Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Budgets Progress */}
          <div className="cute-card">
            <div className="card-header-cute">
              <div>
                <h2 style={{ fontSize: '1.15rem' }}>Budget Status 🎀</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-plum-subtle)' }}>
                  Active category allowances
                </p>
              </div>
              <button
                onClick={() => setActiveTab('budgets')}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--color-muted-purple)', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Manage <ChevronRight size={16} />
              </button>
            </div>

            {budgets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-plum-subtle)' }}>
                <span style={{ fontSize: '2rem' }}>🎀</span>
                <p style={{ marginTop: '6px', fontSize: '0.88rem' }}>No budgets set for this month.</p>
                <button
                  onClick={() => setActiveTab('budgets')}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '10px' }}
                >
                  Create Monthly Budget ✨
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {budgets.slice(0, 3).map((b) => (
                  <div key={b._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.86rem' }}>
                      <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{getCategoryIcon(b.category)}</span> {b.category}
                      </span>
                      <span>
                        <strong style={{ color: b.isOverBudget ? '#b52945' : 'inherit' }}>
                          {formatINR(b.spent)}
                        </strong>{' '}
                        / {formatINR(b.limit)}
                      </span>
                    </div>

                    <div className="cute-progress-track">
                      <div
                        className="cute-progress-fill"
                        style={{
                          width: `${Math.min(100, b.percent)}%`,
                          background:
                            b.percent >= 100
                              ? '#e0536e'
                              : b.percent >= 80
                              ? '#f59e0b'
                              : 'var(--color-muted-purple)',
                        }}
                      />
                    </div>

                    {b.isOverBudget && (
                      <span className="badge badge-danger" style={{ marginTop: '5px', fontSize: '0.72rem' }}>
                        ⚠️ Exceeded by {formatINR(b.overAmount)}!
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Savings Goals Highlights */}
          <div className="cute-card">
            <div className="card-header-cute">
              <div>
                <h2 style={{ fontSize: '1.15rem' }}>Savings Dreams 🎯</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-plum-subtle)' }}>
                  Vision board milestones
                </p>
              </div>
              <button
                onClick={() => setActiveTab('savings')}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--color-muted-purple)', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View all <ChevronRight size={16} />
              </button>
            </div>

            {savingsGoals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-plum-subtle)' }}>
                <span style={{ fontSize: '2rem' }}>💖</span>
                <p style={{ marginTop: '6px', fontSize: '0.88rem' }}>No dream goals created yet.</p>
                <button
                  onClick={() => setActiveTab('savings')}
                  className="btn btn-pink btn-sm"
                  style={{ marginTop: '10px' }}
                >
                  Dream a New Goal ✨
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {savingsGoals.slice(0, 2).map((goal) => (
                  <div
                    key={goal._id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-cream)',
                      border: '1px solid rgba(220, 211, 255, 0.4)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{goal.icon || '🌸'}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{goal.title}</span>
                      </div>
                      <span className="badge badge-lavender">{goal.percent}%</span>
                    </div>

                    <div className="cute-progress-track" style={{ height: '8px', marginBottom: '6px' }}>
                      <div
                        className="cute-progress-fill"
                        style={{
                          width: `${goal.percent}%`,
                          background: 'linear-gradient(90deg, #DCD3FF 0%, #8C78C8 100%)',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-plum-subtle)' }}>
                      <span>{formatINR(goal.currentAmount)} saved</span>
                      <span>Target: {formatINR(goal.targetAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
