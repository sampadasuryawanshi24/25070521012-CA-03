import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Download,
  Edit2,
  Trash2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  formatINR,
  formatDate,
  getCategoryIcon,
  CATEGORIES,
} from '../utils/formatters';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

export const TransactionsPage = () => {
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters and search states
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        type: typeFilter,
        category: categoryFilter,
        paymentMethod: paymentFilter,
        sortBy,
      };
      const res = await api.getTransactions(params);
      if (res.success) {
        setTransactions(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading transactions 🌸', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, categoryFilter, paymentFilter, sortBy]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTransactions();
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Handle Add/Edit submission
  const handleSaveTransaction = async (formData) => {
    try {
      if (editingTransaction) {
        await api.updateTransaction(editingTransaction._id, formData);
        showToast('Transaction updated beautifully! ✨', 'success');
      } else {
        await api.createTransaction(formData);
        showToast('New transaction added to your sanctuary! 🌸', 'success');
      }
      setIsModalOpen(false);
      setEditingTransaction(null);
      fetchTransactions();
    } catch (err) {
      showToast(err.message || 'Failed to save transaction', 'error');
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;
    try {
      setIsDeleting(true);
      await api.deleteTransaction(deletingTransaction._id);
      showToast('Transaction deleted gently ✨', 'success');
      setDeletingTransaction(null);
      fetchTransactions();
    } catch (err) {
      showToast(err.message || 'Could not delete transaction', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      showToast('No transactions to export, lovely! 🌸', 'info');
      return;
    }

    const headers = ['Date', 'Title', 'Type', 'Category', 'Amount (INR)', 'Payment Method', 'Notes'];
    const rows = transactions.map((t) => [
      new Date(t.date).toISOString().split('T')[0],
      `"${t.title.replace(/"/g, '""')}"`,
      t.type,
      `"${t.category}"`,
      t.amount,
      `"${t.paymentMethod}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PennyWise_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported your sparkles to CSV! 🌸', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
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
            Transactions & Spending Sanctuary 💳✨
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-plum-subtle)' }}>
            Keep track of every rupee that flows in and out with mindfulness
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary"
            title="Export transactions as CSV"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setEditingTransaction(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="cute-card"
        style={{
          padding: '18px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 240px', minWidth: '220px', position: 'relative' }}>
          <Search
            size={18}
            color="var(--color-muted-purple)"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search title, notes... 🌸"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Filters Group */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '130px' }}
          >
            <option value="all">All Types</option>
            <option value="expense">💸 Expenses</option>
            <option value="income">💰 Incomes</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="all">All Categories</option>
            {Object.keys(CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORIES[cat].icon} {cat}
              </option>
            ))}
          </select>

          {/* Payment Method */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="all">All Payment Modes</option>
            <option value="UPI / GPay / PhonePe">UPI / GPay / PhonePe</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="Net Banking">Net Banking</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '140px' }}
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="cute-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-plum-subtle)' }}>
            <span style={{ fontSize: '2.5rem' }}>✨</span>
            <p style={{ marginTop: '10px' }}>Gathering your records, princess...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-plum-subtle)' }}>
            <span style={{ fontSize: '3rem' }}>🌸</span>
            <h3 style={{ marginTop: '14px', color: 'var(--color-deep-plum)', fontSize: '1.2rem' }}>
              No transactions found
            </h3>
            <p style={{ fontSize: '0.9rem', maxWidth: '380px', margin: '6px auto 18px auto' }}>
              Either nothing matches your current filter, or you haven't logged any sweet treats yet!
            </p>
            <button
              onClick={() => {
                setEditingTransaction(null);
                setIsModalOpen(true);
              }}
              className="btn btn-pink"
            >
              <Plus size={16} />
              <span>Record a Transaction ✨</span>
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    background: 'var(--color-cream)',
                    borderBottom: '1.5px solid var(--color-lavender)',
                    fontSize: '0.84rem',
                    color: 'var(--color-plum-subtle)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  <th style={{ padding: '16px 20px' }}>Category & Title</th>
                  <th style={{ padding: '16px 20px' }}>Date</th>
                  <th style={{ padding: '16px 20px' }}>Method</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    style={{
                      borderBottom: '1px solid rgba(220, 211, 255, 0.4)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 249, 242, 0.6)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Title & Category */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: 'var(--radius-md)',
                            background: tx.type === 'income' ? 'var(--color-mint-light)' : 'var(--color-pink-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.3rem',
                            flexShrink: 0,
                            border: `1px solid ${tx.type === 'income' ? 'var(--color-soft-mint)' : 'var(--color-blush-pink)'}`,
                          }}
                        >
                          {getCategoryIcon(tx.category)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--color-deep-plum)' }}>
                            {tx.title}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            <span
                              className={`badge ${tx.type === 'income' ? 'badge-mint' : 'badge-pink'}`}
                              style={{ fontSize: '0.72rem' }}
                            >
                              {tx.category}
                            </span>
                            {tx.notes && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-plum-subtle)', fontStyle: 'italic' }}>
                                "{tx.notes}"
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '16px 20px', fontSize: '0.88rem', color: 'var(--color-deep-plum)' }}>
                      {formatDate(tx.date)}
                    </td>

                    {/* Payment Method */}
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge badge-lavender" style={{ fontSize: '0.76rem' }}>
                        {tx.paymentMethod}
                      </span>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '1.08rem',
                          color: tx.type === 'income' ? '#1f5933' : '#8f2e51',
                        }}
                      >
                        {tx.type === 'income' ? '+' : '-'} {formatINR(tx.amount)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setEditingTransaction(tx);
                            setIsModalOpen(true);
                          }}
                          title="Edit transaction"
                          style={{
                            background: 'var(--color-lavender-light)',
                            border: 'none',
                            color: 'var(--color-muted-purple)',
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeletingTransaction(tx)}
                          title="Delete transaction"
                          style={{
                            background: '#ffe8ec',
                            border: 'none',
                            color: '#b52945',
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSaveTransaction}
        initialData={editingTransaction}
      />

      {/* Polite Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this transaction?"
        message={`Are you sure you want to delete "${deletingTransaction?.title}" (₹${deletingTransaction?.amount})? This cannot be undone, sweetheart 🌸`}
        isDeleting={isDeleting}
      />
    </div>
  );
};
