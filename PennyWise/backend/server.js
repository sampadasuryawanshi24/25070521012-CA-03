require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getDBStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { protect } = require('./middleware/auth');
const { seedUserData } = require('./utils/seedData');

// Route imports
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint (Required by specifications)
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    status: 'ok',
    message: 'PennyWise API is running smoothly ✨🌸',
    app: 'PennyWise Finance Tracker',
    database: {
      connected: dbStatus.connected,
      state: dbStatus.readyState === 1 ? 'Connected' : 'Disconnected / Connecting',
      host: dbStatus.host,
      name: dbStatus.name,
    },
    timestamp: new Date().toISOString(),
  });
});

// Seed endpoint for quick demo setup
app.post('/api/seed', protect, async (req, res, next) => {
  try {
    const result = await seedUserData(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Aesthetic sample transactions, budgets, and savings goals created! ✨🌸',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Fallback for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found ✨`,
  });
});

// Centralized error handling
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🌸 PennyWise server floating gracefully on http://localhost:${PORT} ✨`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Error: ${err.message}`);
});

module.exports = app;
