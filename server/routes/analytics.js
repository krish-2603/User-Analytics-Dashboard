// Routes: Analytics Endpoints
const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/analytics/overview
router.get('/overview', (req, res) => {
  try {
    const { dateFilter = 'all' } = req.query;
    const stats = db.getOverviewStats(dateFilter);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/charts
router.get('/charts', (req, res) => {
  try {
    const { dateFilter = 'last7days' } = req.query;
    const timeSeries = db.getTimeSeries(dateFilter);
    const countryBreakdown = db.getCountryBreakdown(dateFilter);
    const distribution = db.getTrafficDistribution(dateFilter);

    res.json({
      success: true,
      data: {
        timeSeries,
        countryBreakdown,
        distribution
      }
    });
  } catch (error) {
    console.error('Error fetching chart analytics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/requests
router.get('/requests', (req, res) => {
  try {
    const {
      page = 1,
      limit = 15,
      search = '',
      country = '',
      browser = '',
      os = '',
      pageVisited = '',
      startDate = '',
      endDate = '',
      sortBy = 'timestamp',
      sortOrder = 'DESC'
    } = req.query;

    const result = db.getPaginatedRequests({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      search,
      country,
      browser,
      os,
      pageVisited,
      startDate,
      endDate,
      sortBy,
      sortOrder
    });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching paginated requests:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/filters - Returns unique values for dropdown options
router.get('/filters', (req, res) => {
  try {
    const countries = db.db.prepare(`
      SELECT DISTINCT country_code, country_name 
      FROM requests 
      WHERE country_code IS NOT NULL 
      ORDER BY country_name ASC
    `).all();

    const browsers = db.db.prepare(`
      SELECT DISTINCT browser_family AS name 
      FROM requests 
      WHERE browser_family IS NOT NULL 
      ORDER BY name ASC
    `).all();

    const operatingSystems = db.db.prepare(`
      SELECT DISTINCT os AS name 
      FROM requests 
      WHERE os IS NOT NULL 
      ORDER BY name ASC
    `).all();

    const pages = db.db.prepare(`
      SELECT DISTINCT page_visited AS path 
      FROM requests 
      WHERE page_visited IS NOT NULL 
      ORDER BY path ASC
    `).all();

    res.json({
      success: true,
      data: {
        countries,
        browsers: browsers.map(b => b.name),
        operatingSystems: operatingSystems.map(o => o.name),
        pages: pages.map(p => p.path)
      }
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
