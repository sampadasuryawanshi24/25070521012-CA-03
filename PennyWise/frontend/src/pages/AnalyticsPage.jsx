import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  PieChart as PieIcon,
  Sparkles,
  Award,
  Calendar,
  CreditCard,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatINR, getCategoryIcon } from '../utils/formatters';

const PASTEL_PALETTE = ['#8C78C8', '#F8DCE8', '#DDF2E4', '#DCD3FF', '#FFE5D4', '#B8A7F7', '#F0B8D2', '#C4B5FD'];

export const AnalyticsPage = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    monthlyTrends: [],
    categoryBreakdown: [],
    paymentMethodBreakdown: [],
    insights: [],
    metrics: {
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0,
      savingsRate: 0,
      avgDailySpend: 0,
      topCategory: 'None yet',
    },
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.getAnalytics();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading analytics 🌸', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const { metrics, monthlyTrends, categoryBreakdown, paymentMethodBreakdown, insights } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-deep-plum)' }}>
          Financial Analytics & Smart Insights 📊✨
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-plum-subtle)' }}>
          Real patterns and gentle reflections calculated from your transaction records
        </p>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}
      >
        <div className="cute-card" style={{ borderLeft: '5px solid #8ccba2' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-plum-subtle)', marginBottom: '6px' }}>
            Total Inflow 🌸
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1f5933' }}>
            {formatINR(metrics.totalIncome)}
          </div>
          <span className="badge badge-mint" style={{ marginTop: '6px' }}>All-Time</span>
        </div>

        <div className="cute-card" style={{ borderLeft: '5px solid #f0b8d2' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-plum-subtle)', marginBottom: '6px' }}>
            Total Outflow 💸
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#8f2e51' }}>
            {formatINR(metrics.totalExpenses)}
          </div>
          <span className="badge badge-pink" style={{ marginTop: '6px' }}>All-Time</span>
        </div>

        <div className="cute-card" style={{ borderLeft: '5px solid var(--color-muted-purple)' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-plum-subtle)', marginBottom: '6px' }}>
            Net Wealth Saved ✨
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-deep-plum)' }}>
            {formatINR(metrics.netSavings)}
          </div>
          <span className="badge badge-lavender" style={{ marginTop: '6px' }}>
            {metrics.savingsRate}% Rate
          </span>
        </div>

        <div className="cute-card" style={{ borderLeft: '5px solid #FFE5D4' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-plum-subtle)', marginBottom: '6px' }}>
            Daily Average Spend 🍰
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#8c420b' }}>
            {formatINR(metrics.avgDailySpend)}
          </div>
          <span className="badge badge-warning" style={{ marginTop: '6px' }}>Past 30 Days</span>
        </div>
      </div>

      {/* Smart Insights Cards */}
      <div className="cute-card" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9F2 100%)' }}>
        <div className="card-header-cute">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>💡</span>
            <div>
              <h2 style={{ fontSize: '1.15rem' }}>Personalized Princess Insights</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-plum-subtle)' }}>
                Mindfully computed advice based on your real spending
              </p>
            </div>
          </div>
          <Sparkles size={20} color="var(--color-muted-purple)" className="sparkle-icon" />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginTop: '10px',
          }}
        >
          {insights.map((insight, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: '#FFFFFF',
                border: '1.5px solid var(--color-lavender)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>{insight.icon}</span>
                <h4 style={{ fontSize: '0.96rem', margin: 0, color: 'var(--color-deep-plum)' }}>
                  {insight.title}
                </h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-plum-subtle)', margin: 0, lineHeight: 1.5 }}>
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Spending Trends Chart */}
      <div className="cute-card">
        <div className="card-header-cute">
          <div>
            <h2 style={{ fontSize: '1.2rem' }}>Monthly Spending Trends</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-plum-subtle)' }}>
              Income vs Expenses movement over time
            </p>
          </div>
          <TrendingUp size={20} color="var(--color-muted-purple)" />
        </div>

        <div style={{ width: '100%', height: 320 }}>
          {monthlyTrends.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-plum-subtle)' }}>
              <span style={{ fontSize: '2.5rem' }}>📈</span>
              <p style={{ marginTop: '10px' }}>Log more transactions across months to see beautiful trend lines!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8ccba2" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8ccba2" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f0b8d2" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f0b8d2" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#8C78C8" />
                <YAxis stroke="#8C78C8" tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`} />
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
                <Area type="monotone" dataKey="income" name="Income" stroke="#8ccba2" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f0b8d2" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Two Column Section: Category Breakdown & Payment Methods */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Category Breakdown */}
        <div className="cute-card">
          <div className="card-header-cute">
            <div>
              <h2 style={{ fontSize: '1.15rem' }}>Expense Categories</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-plum-subtle)' }}>
                Detailed breakdown and percentages
              </p>
            </div>
            <PieIcon size={20} color="var(--color-muted-purple)" />
          </div>

          {categoryBreakdown.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-plum-subtle)' }}>
              <span style={{ fontSize: '2rem' }}>🍰</span>
              <p style={{ marginTop: '8px' }}>No categories logged yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {categoryBreakdown.map((item, idx) => (
                <div key={item.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.88rem' }}>
                    <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{getCategoryIcon(item.category)}</span> {item.category}
                    </span>
                    <span style={{ fontWeight: 800 }}>
                      {formatINR(item.amount)}{' '}
                      <span style={{ fontWeight: 500, color: 'var(--color-plum-subtle)', fontSize: '0.78rem' }}>
                        ({item.percentage}%)
                      </span>
                    </span>
                  </div>

                  <div className="cute-progress-track" style={{ height: '8px' }}>
                    <div
                      className="cute-progress-fill"
                      style={{
                        width: `${item.percentage}%`,
                        background: PASTEL_PALETTE[idx % PASTEL_PALETTE.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Method Breakdown */}
        <div className="cute-card">
          <div className="card-header-cute">
            <div>
              <h2 style={{ fontSize: '1.15rem' }}>Payment Methods Used</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-plum-subtle)' }}>
                Cash vs Cards vs UPI / GPay
              </p>
            </div>
            <CreditCard size={20} color="var(--color-muted-purple)" />
          </div>

          {paymentMethodBreakdown.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-plum-subtle)' }}>
              <span style={{ fontSize: '2rem' }}>💳</span>
              <p style={{ marginTop: '8px' }}>No payments logged yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {paymentMethodBreakdown.map((pm, idx) => (
                <div
                  key={pm.method}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-cream)',
                    border: '1px solid rgba(220, 211, 255, 0.5)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                      {pm.method}
                    </span>
                    <span className="badge badge-lavender">{pm.percentage}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--color-plum-subtle)' }}>
                    <span>Total spent</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-deep-plum)' }}>{formatINR(pm.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
