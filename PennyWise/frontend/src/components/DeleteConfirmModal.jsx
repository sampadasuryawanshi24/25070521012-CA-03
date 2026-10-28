import React from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete item?',
  message = 'Are you sure, sweetheart? 🌸 This cannot be undone.',
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '400px', textAlign: 'center', padding: '32px 24px' }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--color-blush-pink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: '#b52945',
            boxShadow: '0 4px 12px rgba(248, 220, 232, 0.6)',
          }}
        >
          <Trash2 size={26} />
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--color-deep-plum)' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--color-plum-subtle)', marginBottom: '24px' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="btn btn-danger"
            style={{ flex: 1 }}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete 🗑️'}
          </button>
        </div>
      </div>
    </div>
  );
};
