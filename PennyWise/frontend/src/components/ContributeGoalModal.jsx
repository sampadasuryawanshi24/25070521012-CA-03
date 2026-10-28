import React, { useState } from 'react';
import { X, Sparkles, HeartHandshake } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const ContributeGoalModal = ({
  isOpen,
  onClose,
  onSubmit,
  goal,
}) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !goal) return null;

  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    try {
      setIsSubmitting(true);
      await onSubmit(goal._id, {
        amount: Number(amount),
        note: note.trim() || 'Savings deposit ✨',
      });
      setAmount('');
      setNote('');
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
        style={{ maxWidth: '420px' }}
      >
        <div className="card-header-cute">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>{goal.icon || '🌸'}</span>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-deep-plum)' }}>
              Add to "{goal.title}"
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

        {/* Goal status snapshot */}
        <div
          style={{
            background: 'var(--color-cream)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            border: '1px solid var(--color-lavender)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--color-plum-subtle)' }}>Saved so far:</span>
            <span style={{ fontWeight: 700 }}>{formatINR(goal.currentAmount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--color-plum-subtle)' }}>Remaining to target:</span>
            <span style={{ fontWeight: 700, color: 'var(--color-muted-purple)' }}>{formatINR(remaining)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Contribution Amount */}
          <div className="form-group">
            <label className="form-label">Contribution Amount (₹)</label>
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
                placeholder="1000"
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

          {/* Quick preset buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
            {[500, 1000, 2000, 5000].map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setAmount(String(preset))}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, padding: '6px' }}
              >
                +₹{preset}
              </button>
            ))}
          </div>

          {/* Note */}
          <div className="form-group">
            <label className="form-label">Note (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Saved from skipped dining out 🍰"
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
              className="btn btn-pink"
              style={{ flex: 2 }}
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Adding...' : 'Deposit Rupee Sparkles ✨'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
