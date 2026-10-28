import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { CATEGORIES } from '../utils/formatters';

export const AddTransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  defaultType = 'expense',
}) => {
  const [type, setType] = useState(defaultType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay / PhonePe');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setTitle(initialData.title || '');
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setCategory(initialData.category || '');
      setPaymentMethod(initialData.paymentMethod || 'UPI / GPay / PhonePe');
      setDate(
        initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setNotes(initialData.notes || '');
    } else {
      setType(defaultType);
      setTitle('');
      setAmount('');
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);
      // Set default category according to type
      const available = Object.keys(CATEGORIES).filter(
        (cat) => CATEGORIES[cat].type === defaultType
      );
      setCategory(available[0] || 'Food & Dining');
    }
  }, [initialData, isOpen, defaultType]);

  // Update default category when type toggles
  const handleTypeChange = (newType) => {
    setType(newType);
    const available = Object.keys(CATEGORIES).filter(
      (cat) => CATEGORIES[cat].type === newType
    );
    if (!available.includes(category)) {
      setCategory(available[0] || (newType === 'income' ? 'Salary' : 'Food & Dining'));
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0 || !category) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        amount: Number(amount),
        type,
        category,
        paymentMethod,
        date,
        notes: notes.trim(),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = Object.keys(CATEGORIES).filter(
    (c) => CATEGORIES[c].type === type
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px' }}
      >
        {/* Header */}
        <div className="card-header-cute">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>{type === 'income' ? '🌸' : '🎀'}</span>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-deep-plum)' }}>
              {initialData ? 'Edit Transaction' : 'Add New Transaction'}
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
              borderRadius: '50%',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Type Toggle: Expense vs Income */}
        <div
          style={{
            display: 'flex',
            background: 'var(--color-cream)',
            padding: '5px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '20px',
            border: '1px solid var(--color-lavender)',
          }}
        >
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: type === 'expense' ? 'var(--color-blush-pink)' : 'transparent',
              color: type === 'expense' ? '#723450' : 'var(--color-plum-subtle)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            💸 Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: type === 'income' ? 'var(--color-soft-mint)' : 'transparent',
              color: type === 'income' ? '#1f5933' : 'var(--color-plum-subtle)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            💰 Income
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount Input */}
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
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
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                style={{
                  paddingLeft: '38px',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                }}
              />
            </div>
          </div>

          {/* Title Input */}
          <div className="form-group">
            <label className="form-label">Title / Description</label>
            <input
              type="text"
              required
              placeholder={type === 'income' ? 'e.g. Freelance Design Kit 💻' : 'e.g. Iced Matcha Latte 🍵'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Category Selector */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              {filteredCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORIES[cat]?.icon} {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method & Date in 2 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-select"
              >
                <option value="UPI / GPay / PhonePe">UPI / GPay / PhonePe</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              rows="2"
              placeholder="Any sweet memory or detail... 🌸"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
            />
          </div>

          {/* Action Buttons */}
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
              className={`btn ${type === 'income' ? 'btn-mint' : 'btn-pink'}`}
              style={{ flex: 2 }}
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Saving...' : initialData ? 'Update Record ✨' : 'Add Record ✨'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
