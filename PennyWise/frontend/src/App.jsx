import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { SavingsGoalsPage } from './pages/SavingsGoalsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MainLayout } from './layouts/MainLayout';
import { AddTransactionModal } from './components/AddTransactionModal';
import api from './services/api';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState('expense');
  const [refreshKey, setRefreshKey] = useState(0);

  // Global Quick Add submission
  const handleQuickAddSubmit = async (formData) => {
    try {
      await api.createTransaction(formData);
      showToast('Transaction added with sparkle! ✨', 'success');
      setIsQuickAddOpen(false);
      // Increment refresh key to trigger active page refresh
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      showToast(err.message || 'Failed to save transaction', 'error');
    }
  };

  const openQuickAdd = (type = 'expense') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '3rem' }} className="sparkle-icon">
          🌸
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-deep-plum)' }}>
          Floating into PennyWise... ✨
        </h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <MainLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onQuickAdd={() => openQuickAdd('expense')}
    >
      <div key={refreshKey}>
        {activeTab === 'dashboard' && (
          <DashboardPage
            onOpenAddModal={openQuickAdd}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'transactions' && <TransactionsPage />}
        {activeTab === 'budgets' && <BudgetsPage />}
        {activeTab === 'savings' && <SavingsGoalsPage />}
        {activeTab === 'analytics' && <AnalyticsPage />}
      </div>

      {/* Global Quick Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSubmit={handleQuickAddSubmit}
        defaultType={quickAddType}
      />
    </MainLayout>
  );
};

export const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
