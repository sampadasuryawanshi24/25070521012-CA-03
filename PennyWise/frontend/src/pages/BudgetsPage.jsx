import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatINR, getCategoryIcon } from '../utils/formatters';
import { AddBudgetModal } from '../components/AddBudgetModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

export const BudgetsPage = () => {
  const { showToast } = useToast();

  const getCurrentMonthStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthStr());
  const [budgets, setBudgets] = useState([]);
  const [overview, setOverview] = useState({
    totalBudgeted: 0,
    totalSpent: 0,
    totalRemaining: 0,
    overallPercent: 0,
  });
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await api.getBudgets(selectedMonth);
      if (res.success) {
        setBudgets(res.data);
        if (res.overview) setOverview(res.overview);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading monthly budgets 🌸', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

  // Navigate months
  const handlePrevMonth = () => {
    const [year, m] = selectedMonth.split('-').map(Number);
    const date = new Date(year, m - 2, 1);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, m] = selectedMonth.split('-').map(Number);
    const date = new Date(year, m, 1);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleSaveBudget = async (payload) => {
    try {
      if (editingBudget) {
        await api.updateBudget(editingBudget._id, payload);
        showToast('Budget updated with love! ✨', 'success');
      } else {
        await api.createBudget(payload);
        showToast('New category budget planned! 🎀', 'success');
      }
      setIsModalOpen(false);
      setEditingBudget(null);
      fetchBudgets();
    } catch (err) {
      showToast(err.message || 'Failed to save budget', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBudget) return;
    try {
      setIsDeleting(true);
      await api.deleteBudget(deletingBudget._id);
      showToast('Budget removed gently ✨', 'success');
      setDeletingBudget(null);
      fetchBudgets();
    } catch (err) {
      showToast(err.message || 'Could not delete budget', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Format month for display (e.g. October 2026)
  const getDisplayMonth = () => {
    const [year, m] = selectedMonth.split('-').map(Number);
    const date = new Date(year, m - 1, 1);
    return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-deep-plum)' }}>
            Monthly Budgets & Allowances 🎀✨
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-plum-subtle)' }}>
            Gentle boundaries keep your dreams sparkling bright
          </p>
        </div>

        {/* Month selector & Add budget button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-white)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--color-lavender)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <button
              onClick={handlePrevMonth}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
            >
              <ChevronLeft size={18} color="var(--color-deep-plum)" />
            </button>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.92rem', minWidth: '120px', textAlign: 'center' }}>
              {getDisplayMonth()}
            </span>
            <button
              onClick={handleNextMonth}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
            >
              <ChevronRight size={18} color="var(--color-deep-plum)" />
            </button>
          </div>

          <button
            onClick={() => {
              setEditingBudget(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span>Set New Budget</span>
          </button>
        </div>
      </div>

      {/* Overview Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(221, 242, 228, 0.4) 0%, rgba(220, 211, 255, 0.4) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 30px',
          border: '1.5px solid rgba(220, 211, 255, 0.7)',
          boxShadow: 'var(--shadow-md)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-plum-subtle)' }}>
            Total Budgeted
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-deep-plum)' }}>
            {formatINR(overview.totalBudgeted)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-plum-subtle)' }}>
            Total Spent So Far
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#8f2e51' }}>
            {formatINR(overview.totalSpent)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-plum-subtle)' }}>
            Remaining Safe Zone
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1f5933' }}>
            {formatINR(overview.totalRemaining)}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.84rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-plum-subtle)' }}>Monthly Pace</span>
            <span style={{ fontWeight: 800, color: 'var(--color-deep-plum)' }}>{overview.overallPercent}%</span>
          </div>
          <div className="cute-progress-track">
            <div
              className="cute-progress-fill"
              style={{
                width: `${Math.min(100, overview.overallPercent)}%`,
                background:
                  overview.overallPercent >= 100
                    ? '#e0536e'
                    : overview.overallPercent >= 80
                    ? '#f59e0b'
                    : 'var(--color-muted-purple)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Budgets Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-plum-subtle)' }}>
          <span style={{ fontSize: '2.5rem' }}>✨</span>
          <p style={{ marginTop: '10px' }}>Loading budget plans...</p>
        </div>
      ) : budgets.length === 0 ? (
        <div className="cute-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <span style={{ fontSize: '3.5rem' }}>🎀</span>
          <h3 style={{ marginTop: '14px', fontSize: '1.3rem', color: 'var(--color-deep-plum)' }}>
            No category budgets set for {getDisplayMonth()}
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-plum-subtle)', maxWidth: '420px', margin: '8px auto 20px auto' }}>
            Setting spending limits for categories like Food, Shopping or Skincare helps you save effortlessly.
          </p>
          <button
            onClick={() => {
              setEditingBudget(null);
              setIsModalOpen(true);
            }}
            className="btn btn-pink"
          >
            <Plus size={16} />
            <span>Create First Budget for {getDisplayMonth()} ✨</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {budgets.map((b) => (
            <div
              key={b._id}
              className="cute-card"
              style={{
                borderTop: `6px solid ${
                  b.percent >= 100
                    ? '#e0536e'
                    : b.percent >= 80
                    ? '#f59e0b'
                    : 'var(--color-muted-purple)'
                }`,
              }}
            >
              {/* Card top info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-lavender-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {getCategoryIcon(b.category)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{b.category}</h3>
                    {b.notes && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-plum-subtle)', margin: '2px 0 0 0' }}>
                        {b.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => {
                      setEditingBudget(b);
                      setIsModalOpen(true);
                    }}
                    title="Edit budget"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-muted-purple)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeletingBudget(b)}
                    title="Delete budget"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#b52945',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Progress bar and percentages */}
              <div style={{ margin: '18px 0 14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.86rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-plum-subtle)' }}>Spent</span>
                  <span style={{ fontWeight: 700, color: b.isOverBudget ? '#b52945' : 'var(--color-deep-plum)' }}>
                    {b.percent}% of budget
                  </span>
                </div>

                <div className="cute-progress-track" style={{ height: '10px' }}>
                  <div
                    className="cute-progress-fill"
                    style={{
                      width: `${Math.min(100, b.percent)}%`,
                      background:
                        b.percent >= 100
                          ? '#e0536e'
                          : b.percent >= 80
                          ? '#f59e0b'
                          : 'linear-gradient(90deg, #DCD3FF 0%, #8C78C8 100%)',
                    }}
                  />
                </div>
              </div>

              {/* Figures row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-cream)',
                  fontSize: '0.88rem',
                  marginBottom: '10px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-plum-subtle)' }}>Spent</div>
                  <div style={{ fontWeight: 800, color: '#8f2e51' }}>{formatINR(b.spent)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-plum-subtle)' }}>Limit</div>
                  <div style={{ fontWeight: 800, color: 'var(--color-deep-plum)' }}>{formatINR(b.limit)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-plum-subtle)' }}>Remaining</div>
                  <div style={{ fontWeight: 800, color: b.remaining === 0 ? '#b52945' : '#1f5933' }}>
                    {formatINR(b.remaining)}
                  </div>
                </div>
              </div>

              {/* Alert Status Banner */}
              {b.isOverBudget ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#ffe3e8',
                    color: '#a8203d',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  <AlertTriangle size={15} />
                  <span>Exceeded by {formatINR(b.overAmount)}! Time to pause 🌸</span>
                </div>
              ) : b.percent >= 80 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#fff3cd',
                    color: '#856404',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  <ShieldAlert size={15} />
                  <span>Approaching limit ({b.percent}%). Mindful spending! ✨</span>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-mint-light)',
                    color: '#1f5933',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={15} />
                  <span>On track! {formatINR(b.remaining)} left to spend safely 🌷</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Budget Modal */}
      <AddBudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleSaveBudget}
        initialData={editingBudget}
        currentMonth={selectedMonth}
      />

      {/* Polite Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingBudget}
        onClose={() => setDeletingBudget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete budget limit?"
        message={`Are you sure you want to remove the budget for ${deletingBudget?.category}?`}
        isDeleting={isDeleting}
      />
    </div>
  );
};
