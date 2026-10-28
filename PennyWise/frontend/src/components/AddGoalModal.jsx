import React, { useState, useEffect } from 'react';
import { X, Sparkles, Target } from 'lucide-react';

const CUTE_ICONS = ['💖', '✈️', '💻', '🌸', '👑', '💍', '🏡', '🛵', '📚', '👗', '🎨', '🏖️'];
const CUTE_COLORS = ['#DCD3FF', '#F8DCE8', '#DDF2E4', '#FFE5D4', '#B8A7F7', '#F0B8D2'];

export const AddGoalModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [icon, setIcon] = useState('💖');
  const [color, setColor] = useState('#DCD3FF');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setTargetAmount(initialData.targetAmount ? String(initialData.targetAmount) : '');
      setCurrentAmount(initialData.currentAmount !== undefined ? String(initialData.currentAmount) : '0');
      setTargetDate(
        initialData.targetDate
          ? new Date(initialData.targetDate).toISOString().split('T')[0]
          : ''
      );
      setIcon(initialData.icon || '💖');
      setColor(initialData.color || '#DCD3FF');
      setNotes(initialData.notes || '');
    } else {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('0');
      // Default target date to 6 months in future
      const d = new Date();
      d.setMonth(d.getMonth() + 6);
      setTargetDate(d.toISOString().split('T')[0]);
      setIcon('💖');
      setColor('#DCD3FF');
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount || Number(targetAmount) <= 0 || !targetDate) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount) || 0,
        targetDate,
        icon,
        color,
        notes: notes.trim(),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '460px' }}
      >
        <div className="card-header-cute">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>{icon}</span>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-deep-plum)' }}>
              {initialData ? 'Edit Savings Goal' : 'Dream a New Goal ✨'}
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
          {/* Goal Title */}
          <div className="form-group">
            <label className="form-label">Goal Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Kyoto Cherry Blossom Trip 🌸"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Icon Picker */}
          <div className="form-group">
            <label className="form-label">Choose an Adorable Icon</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CUTE_ICONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  style={{
                    fontSize: '1.3rem',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: icon === emoji ? '2px solid var(--color-muted-purple)' : '1px solid rgba(220, 211, 255, 0.6)',
                    background: icon === emoji ? 'var(--color-lavender-light)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Amounts: Target and Current */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Target Amount (₹)</label>
              <input
                type="number"
                step="any"
                min="1"
                required
                placeholder="50000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="form-input"
                style={{ fontWeight: 700 }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Starting Saved (₹)</label>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="form-input"
                style={{ fontWeight: 700 }}
              />
            </div>
          </div>

          {/* Target Date */}
          <div className="form-group">
            <label className="form-label">Target Completion Date</label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Color Accent Picker */}
          <div className="form-group">
            <label className="form-label">Pastel Accent Color</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {CUTE_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: c,
                    border: color === c ? '2.5px solid var(--color-deep-plum)' : '1.5px solid rgba(73, 59, 90, 0.15)',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Dream Notes (Optional)</label>
            <textarea
              rows="2"
              placeholder="Why this dream makes your heart sparkle... ✨"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
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
              <span>{isSubmitting ? 'Saving...' : initialData ? 'Update Goal' : 'Create Goal ✨'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
