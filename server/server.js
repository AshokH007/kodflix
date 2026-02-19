const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Basic environment check - DO THIS FIRST before importing db/routes
console.log('--- Environment Check ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);
console.log('JWT_SECRET defined:', !!process.env.JWT_SECRET);
console.log('-------------------------');

if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL is not defined in environment variables');
  // Don't exit immediately in some environments to allow logs to flush
  setTimeout(() => process.exit(1), 1000);
}

const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();

// Simplified CORS for debugging - will refine once it's up
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'KODFLIX API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ status: 'error', message: err.message });
});

const PORT = process.env.PORT || 5000;

// Sync database and start server
const startServer = async () => {
  try {
    console.log('📡 Connecting to database...');
    await connectDB();

    console.log('🔄 Syncing models...');
    await sequelize.sync();
    console.log('✅ Database models synced');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 KODFLIX server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ FATAL: Server failed to start:', error);
    process.exit(1);
  }
};

process.on('uncaughtException', (err) => {
  console.error('🔥 CRITICAL: Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();
