// Express Server Entry Point: Admin Dashboard – User Analytics & CSS Generator
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { seedDatabase } = require('./db/seedData');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Admin Dashboard – User Analytics & CSS Generator',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/simulator', require('./routes/simulator'));
app.use('/api/ip-lookup', require('./routes/ipLookup'));
app.use('/api/css', require('./routes/cssExport'));
app.use('/api/settings', require('./routes/settings'));

// Serve frontend static build if present
const clientDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(clientDistPath));

// Fallback for SPA routing and 404s
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint '${req.originalUrl}' not found.`
    });
  }

  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  next();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🚀 Admin Dashboard Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints mounted at http://localhost:${PORT}/api/`);
  console.log(`========================================================`);

  // Ensure initial data is seeded on first run
  try {
    seedDatabase(false, 180);
  } catch (err) {
    console.warn('[Seed] Note: Auto-seed encountered an issue:', err.message);
  }
});
