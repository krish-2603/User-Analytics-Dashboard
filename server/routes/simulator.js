// Routes: Traffic Simulator Endpoints
const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { generateBatch, generateSingleRequest, PAGES, BROWSERS, OPERATING_SYSTEMS } = require('../services/simulatorService');

// POST /api/simulator/simulate - Generate simulated traffic batch
router.post('/simulate', (req, res) => {
  try {
    const { count = 5, country = null, targetPage = null } = req.body;
    const safeCount = Math.min(Math.max(1, parseInt(count, 10) || 1), 100);

    const generated = generateBatch(safeCount, {
      preferredCountry: country || null,
      preferredPage: targetPage || null
    });

    // Save directly to SQLite
    db.insertBatch(generated);

    // Return the newly created records
    res.json({
      success: true,
      message: `Successfully simulated and recorded ${generated.length} requests.`,
      count: generated.length,
      data: generated
    });
  } catch (error) {
    console.error('Error generating simulated traffic:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/simulator/recent - Latest requests for real-time live feed
router.get('/recent', (req, res) => {
  try {
    const limit = Math.min(Math.max(1, parseInt(req.query.limit, 10) || 15), 50);
    const recent = db.db.prepare(`
      SELECT * FROM requests 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(limit);

    res.json({ success: true, data: recent });
  } catch (error) {
    console.error('Error fetching recent requests:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/simulator/options - Target options for custom simulation
router.get('/options', (req, res) => {
  res.json({
    success: true,
    data: {
      pages: PAGES,
      browsers: BROWSERS.map(b => b.name),
      operatingSystems: OPERATING_SYSTEMS.map(o => o.name)
    }
  });
});

module.exports = router;
