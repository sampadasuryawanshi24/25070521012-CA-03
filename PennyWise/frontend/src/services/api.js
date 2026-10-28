const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Universal request handler with JWT token injection and JSON parsing
 */
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('pennywise_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // If unauthorized, clean up expired token
      if (response.status === 401) {
        localStorage.removeItem('pennywise_token');
        localStorage.removeItem('pennywise_user');
      }
      throw new Error(data.message || 'Something went wrong ✨');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),
  updateProfile: (payload) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),

  // Transactions
  getTransactions: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/transactions${queryString}`);
  },
  getTransactionSummary: () => request('/transactions/summary'),
  createTransaction: (payload) => request('/transactions', { method: 'POST', body: JSON.stringify(payload) }),
  updateTransaction: (id, payload) => request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),

  // Budgets
  getBudgets: (month) => request(`/budgets${month ? `?month=${month}` : ''}`),
  createBudget: (payload) => request('/budgets', { method: 'POST', body: JSON.stringify(payload) }),
  updateBudget: (id, payload) => request(`/budgets/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteBudget: (id) => request(`/budgets/${id}`, { method: 'DELETE' }),

  // Savings
  getSavingsGoals: () => request('/savings'),
  createSavingsGoal: (payload) => request('/savings', { method: 'POST', body: JSON.stringify(payload) }),
  updateSavingsGoal: (id, payload) => request(`/savings/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteSavingsGoal: (id) => request(`/savings/${id}`, { method: 'DELETE' }),
  addContribution: (id, payload) => request(`/savings/${id}/contribute`, { method: 'POST', body: JSON.stringify(payload) }),

  // Analytics
  getAnalytics: () => request('/analytics'),

  // Demo Seed
  seedSampleData: () => request('/seed', { method: 'POST' }),
};

export default api;
