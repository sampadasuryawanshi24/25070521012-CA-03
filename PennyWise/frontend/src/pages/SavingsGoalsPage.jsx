import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Sparkles,
  Heart,
  Calendar,
  CheckCircle2,
  Edit2,
  Trash2,
  PlusCircle,
  Coins,
  PartyPopper,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatINR, formatDate } from '../utils/formatters';
import { AddGoalModal } from '../components/AddGoalModal';
import { ContributeGoalModal } from '../components/ContributeGoalModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

export const SavingsGoalsPage = () => {
  const { showToast } = useToast();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [contributingGoal, setContributingGoal] = useState(null);
  const [deletingGoal, setDeletingGoal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const triggerConfetti = () => {
    // Multi-shot cute pastel confetti burst
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#DCD3FF', '#F8DCE8', '#DDF2E4', '#FFE5D4', '#8C78C8', '#FFB7B2'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.getSavingsGoals();
      if (res.success) {
        setGoals(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading savings goals 🌸', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSaveGoal = async (payload) => {
    try {
      if (editingGoal) {
        await api.updateSavingsGoal(editingGoal._id, payload);
        showToast('Savings goal updated with love! ✨', 'success');
      } else {
        await api.createSavingsGoal(payload);
        showToast('Dream goal planted! Every seed blooms into an empire 🌸', 'success');
      }
      setIsGoalModalOpen(false);
      setEditingGoal(null);
      fetchGoals();
    } catch (err) {
      showToast(err.message || 'Failed to save goal', 'error');
    }
  };

  const handleContribute = async (goalId, payload) => {
    try {
      const res = await api.addContribution(goalId, payload);
      if (res.success) {
        if (res.justCompleted) {
          triggerConfetti();
          showToast('🎉 OMG YOU ACHIEVED YOUR GOAL! SO PROUD OF YOU, PRINCESS! 👑💖✨', 'success', 6000);
        } else {
          showToast(res.message || 'Contribution added! ✨', 'success');
        }
        setContributingGoal(null);
        fetchGoals();
      }
    } catch (err) {
      showToast(err.message || 'Could not add contribution', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingGoal) return;
    try {
      setIsDeleting(true);
      await api.deleteSavingsGoal(deletingGoal._id);
      showToast('Savings goal removed gently ✨', 'success');
      setDeletingGoal(null);
      fetchGoals();
    } catch (err) {
      showToast(err.message || 'Could not delete goal', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalSavedAcrossGoals = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTargetAcrossGoals = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const completedGoalsCount = goals.filter((g) => g.isCompleted).length;

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
            Dream Savings Goals & Milestones 🎯✨
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-plum-subtle)' }}>
            Turn your sweetest wishes into realized treasures
          </p>
        </div>

        <button
          onClick={() => {
            setEditingGoal(null);
            setIsGoalModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Dream a New Goal</span>
        </button>
      </div>

      {/* Summary Highlight Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        <div className="cute-card" style={{ borderLeft: '5px solid var(--color-muted-purple)' }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-plum-subtle)', marginBottom: '8px' }}>
            Total Dream Stash 💖
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-deep-plum)' }}>
            {formatINR(totalSavedAcrossGoals)}
          </div>
          <span className="badge badge-lavender" style={{ marginTop: '4px' }}>
            Across {goals.length} goals
          </span>
        </div>

        <div className="cute-card" style={{ borderLeft: '5px solid var(--color-blush-pink)' }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-plum-subtle)', marginBottom: '8px' }}>
            Target Grand Total 🏰
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#723450' }}>
            {formatINR(totalTargetAcrossGoals)}
          </div>
          <span className="badge badge-pink" style={{ marginTop: '4px' }}>
            Vision Board
          </span>
        </div>

        <div className="cute-card" style={{ borderLeft: '5px solid var(--color-soft-mint)' }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-plum-subtle)', marginBottom: '8px' }}>
            Goals Conquered 🎉
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1f5933' }}>
            {completedGoalsCount} of {goals.length}
          </div>
          <span className="badge badge-mint" style={{ marginTop: '4px' }}>
            {completedGoalsCount > 0 ? 'Royalty achievement!' : 'Journey underway'}
          </span>
        </div>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-plum-subtle)' }}>
          <span style={{ fontSize: '2.5rem' }}>✨</span>
          <p style={{ marginTop: '10px' }}>Loading your dreams...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="cute-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <span style={{ fontSize: '3.5rem' }}>💖</span>
          <h3 style={{ marginTop: '14px', fontSize: '1.3rem', color: 'var(--color-deep-plum)' }}>
            Your dream board is waiting for its first spark!
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-plum-subtle)', maxWidth: '420px', margin: '8px auto 20px auto' }}>
            Whether it's a cozy vacation, a rose-gold laptop, or a peaceful rainy-day stash, save for what makes your soul happy.
          </p>
          <button
            onClick={() => {
              setEditingGoal(null);
              setIsGoalModalOpen(true);
            }}
            className="btn btn-pink"
          >
            <Plus size={16} />
            <span>Create Your First Goal ✨</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: '24px',
          }}
        >
          {goals.map((goal) => (
            <div
              key={goal._id}
              className="cute-card"
              style={{
                background: goal.isCompleted
                  ? 'linear-gradient(180deg, #FFFFFF 70%, var(--color-mint-light) 100%)'
                  : '#FFFFFF',
                border: `1.5px solid ${goal.isCompleted ? 'var(--color-soft-mint)' : 'rgba(220, 211, 255, 0.7)'}`,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      background: goal.color || 'var(--color-lavender)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      boxShadow: '0 4px 12px rgba(220, 211, 255, 0.4)',
                    }}
                  >
                    {goal.icon || '💖'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--color-deep-plum)' }}>
                      {goal.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <Calendar size={13} color="var(--color-plum-subtle)" />
                      <span style={{ fontSize: '0.76rem', color: 'var(--color-plum-subtle)' }}>
                        Target: {formatDate(goal.targetDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => {
                      setEditingGoal(goal);
                      setIsGoalModalOpen(true);
                    }}
                    title="Edit goal"
                    style={{ background: 'none', border: 'none', color: 'var(--color-muted-purple)', cursor: 'pointer', padding: '4px' }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeletingGoal(goal)}
                    title="Delete goal"
                    style={{ background: 'none', border: 'none', color: '#b52945', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ margin: '14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.86rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-plum-subtle)' }}>Progress</span>
                  <span style={{ fontWeight: 800, color: goal.isCompleted ? '#1f5933' : 'var(--color-deep-plum)' }}>
                    {goal.percent}%
                  </span>
                </div>

                <div className="cute-progress-track" style={{ height: '12px' }}>
                  <div
                    className="cute-progress-fill"
                    style={{
                      width: `${goal.percent}%`,
                      background: goal.isCompleted
                        ? 'linear-gradient(90deg, #8ccba2 0%, #48bb78 100%)'
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
                  marginBottom: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-plum-subtle)' }}>Saved</div>
                  <div style={{ fontWeight: 800, color: '#1f5933' }}>{formatINR(goal.currentAmount)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-plum-subtle)' }}>Target</div>
                  <div style={{ fontWeight: 800, color: 'var(--color-deep-plum)' }}>{formatINR(goal.targetAmount)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-plum-subtle)' }}>Countdown</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-muted-purple)' }}>
                    {goal.isCompleted ? 'Achieved! 👑' : `${goal.daysRemaining} days`}
                  </div>
                </div>
              </div>

              {/* Action / Celebration */}
              {goal.isCompleted ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-soft-mint)',
                    color: '#1f5933',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                  }}
                >
                  <PartyPopper size={18} />
                  <span>Goal Achieved, Princess! 🎉✨</span>
                </div>
              ) : (
                <button
                  onClick={() => setContributingGoal(goal)}
                  className="btn btn-pink"
                  style={{ width: '100%', padding: '10px' }}
                >
                  <Coins size={16} />
                  <span>+ Add Contribution ₹</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Goal Modal */}
      <AddGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleSaveGoal}
        initialData={editingGoal}
      />

      {/* Add Contribution Modal */}
      <ContributeGoalModal
        isOpen={!!contributingGoal}
        onClose={() => setContributingGoal(null)}
        onSubmit={handleContribute}
        goal={contributingGoal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingGoal}
        onClose={() => setDeletingGoal(null)}
        onConfirm={handleConfirmDelete}
        title="Delete savings goal?"
        message={`Are you sure you want to remove "${deletingGoal?.title}"? Any saved logs for it will be cleared, princess 🌸`}
        isDeleting={isDeleting}
      />
    </div>
  );
};
