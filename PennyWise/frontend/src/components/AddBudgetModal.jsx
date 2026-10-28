import React, { useState, useEffect } from 'react';
import { X, Sparkles, PieChart } from 'lucide-react';
import { CATEGORIES } from '../utils/formatters';

export const AddBudgetModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  currentMonth = '',
}) => {
  const [category, setCategory] = useState('Food & Dining');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category || 'Food & Dining');
      setLimit(initialData.limit ? String(initialData.limit) : '');
      setMonth(initialData.month || currentMonth);
      setNotes(initialData.notes || '');
    } else {
      setCategory('Food & Dining');
      setLimit('');
      setMonth(currentMonth || new Date().toISOString().substring(0, 7));
      setNotes('');
    }
  }, [initialData, isOpen, currentMonth]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !limit || Number(limit) <= 0) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        category,
        limit: Number(limit),
        month: month || new Date().toISOString().substring(0, 7),
        notes: notes.trim(),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const expenseCategories = Object.keys(CATEGORIES).filter(
    (c) => CATEGORIES[c].type === 'expense'
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        <div className="card-header-cute">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>🎀</span>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-deep-plum)' }}>
              {initialData ? 'Edit Budget' : 'Set Category Budget'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-deep-plum)',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              {expenseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORIES[cat]?.icon} {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Monthly Limit */}
          <div className="form-group">
            <label className="form-label">Monthly Limit (₹)</label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: 'var(--color-deep-plum)',
                }}
              >
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="1"
                required
                placeholder="5000"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="form-input"
                style={{
                  paddingLeft: '38px',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                }}
              />
            </div>
          </div>

          {/* Month */}
          <div className="form-group">
            <label className="form-label">Budget Month</label>
            <input
              type="month"
              required
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Keep dining expenses mindful 🍰"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ flex: 2 }}
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Saving...' : initialData ? 'Save Budget' : 'Create Budget ✨'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
