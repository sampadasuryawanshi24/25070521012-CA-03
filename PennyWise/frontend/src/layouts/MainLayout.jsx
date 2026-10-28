import React, { useState } from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Target,
  Sparkles,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Heart,
  PlusCircle,
  Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export const MainLayout = ({ activeTab, setActiveTab, onQuickAdd, children }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'savings', label: 'Savings Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      await api.seedSampleData();
      showToast('🌸 Loaded beautiful demo transactions, budgets & goals! ✨', 'success');
      // trigger page reload or tab refresh
      window.location.reload();
    } catch (err) {
      showToast(err.message || 'Could not load demo data', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Mobile Header */}
      <div
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: 'rgba(255, 249, 242, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--color-lavender)',
          zIndex: 900,
          padding: '0 20px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="mobile-top-nav"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem' }}>🌸</span>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-deep-plum)' }}>
            PennyWise
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-deep-plum)' }}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`cute-sidebar ${mobileMenuOpen ? 'open' : ''}`}
        style={{
          width: '270px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDFC 100%)',
          borderRight: '1.5px solid rgba(220, 211, 255, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 18px',
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 950,
          transition: 'all 0.3s ease',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 10px 24px 10px', borderBottom: '1px solid rgba(220, 211, 255, 0.4)' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--color-lavender) 0%, var(--color-blush-pink) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 4px 12px rgba(220, 211, 255, 0.5)',
            }}
          >
            🌸
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-deep-plum)', margin: 0, letterSpacing: '-0.02em' }}>
                PennyWise
              </h1>
              <Sparkles size={16} color="var(--color-muted-purple)" className="sparkle-icon" />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-plum-subtle)', margin: 0, fontWeight: 500 }}>
              Cute & Mindful Finance
            </p>
          </div>
        </div>

        {/* Quick Add Button */}
        <div style={{ margin: '20px 8px 14px 8px' }}>
          <button
            onClick={() => {
              if (onQuickAdd) onQuickAdd();
              setMobileMenuOpen(false);
            }}
            className="btn btn-pink"
            style={{ width: '100%', padding: '11px', display: 'flex', justifyContent: 'center', gap: '8px' }}
          >
            <PlusCircle size={18} />
            <span>+ Quick Add ₹</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 0' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'var(--color-lavender-light)' : 'transparent',
                  color: isActive ? 'var(--color-deep-plum)' : 'var(--color-plum-light)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.94rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'left',
                  width: '100%',
                  position: 'relative',
                  boxShadow: isActive ? '0 2px 8px rgba(140, 120, 200, 0.12)' : 'none',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: isActive ? 'var(--color-lavender)' : 'rgba(220, 211, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-deep-plum)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon size={17} />
                </div>
                <span>{item.label}</span>
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      right: '12px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--color-muted-purple)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Demo Seed Data Helper */}
        <div style={{ padding: '8px 8px 16px 8px' }}>
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 10px',
              background: 'var(--color-mint-light)',
              border: '1px dashed var(--color-mint-dark)',
              borderRadius: 'var(--radius-sm)',
              color: '#1f5933',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            title="Load aesthetic prefilled data to instantly explore charts and features"
          >
            <Database size={14} />
            <span>{isSeeding ? 'Seeding...' : 'Load Demo Data ✨'}</span>
          </button>
        </div>

        {/* User Profile Card */}
        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-cream)',
            border: '1px solid rgba(220, 211, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--color-blush-pink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                border: '1.5px solid var(--color-white)',
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0,
              }}
            >
              {user?.avatar || '👑'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: 'var(--color-deep-plum)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name || 'Princess'}
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-plum-subtle)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-deep-plum)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              opacity: 0.7,
              transition: 'opacity 0.2s',
            }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          padding: '36px 42px',
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
        }}
        className="main-content-area"
      >
        {children}
      </main>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .mobile-top-nav {
            display: flex !important;
          }
          .cute-sidebar {
            position: fixed !important;
            left: -290px;
            top: 64px !important;
            height: calc(100vh - 64px) !important;
            background: #ffffff !important;
          }
          .cute-sidebar.open {
            left: 0 !important;
          }
          .main-content-area {
            padding: 84px 18px 40px 18px !important;
          }
        }
      `}</style>
    </div>
  );
};
