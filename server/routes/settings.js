// Routes: Admin Settings & Maintenance Endpoints
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../db/database');
const { seedDatabase } = require('../db/seedData');

// POST /api/settings/reset - Reset all analytics data
router.post('/reset', (req, res) => {
  try {
    db.resetDatabase();
    res.json({
      success: true,
      message: 'All analytics request logs have been reset successfully.'
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/settings/seed - Seed sample realistic traffic
router.post('/seed', (req, res) => {
  try {
    const { count = 180 } = req.body;
    const seededCount = seedDatabase(true, parseInt(count, 10) || 180);
    res.json({
      success: true,
      message: `Seeded ${seededCount} realistic requests successfully.`
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/settings/stats - System and DB info
router.get('/stats', (req, res) => {
  try {
    const totalCount = db.getTotalCount();
    const dbPath = path.join(__dirname, '../data/analytics.db');
    let sizeBytes = 0;
    if (fs.existsSync(dbPath)) {
      sizeBytes = fs.statSync(dbPath).size;
    }

    res.json({
      success: true,
      data: {
        totalRequests: totalCount,
        dbSizeFormatted: `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`,
        serverUptime: `${Math.floor(process.uptime())}s`,
        nodeVersion: process.version,
        platform: process.platform
      }
    });
  } catch (error) {
    console.error('Error fetching settings stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
