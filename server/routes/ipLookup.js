// Routes: IP-to-Country Lookup Endpoints
const express = require('express');
const router = express.Router();
const { lookupIp, SAMPLE_IPS } = require('../services/geoService');

// GET /api/ip-lookup/samples - Returns interesting sample IPs for testing
router.get('/samples', (req, res) => {
  res.json({
    success: true,
    data: SAMPLE_IPS
  });
});

// GET /api/ip-lookup/:ip - Look up country details for any given IP
router.get('/:ip', (req, res) => {
  try {
    const { ip } = req.params;
    if (!ip) {
      return res.status(400).json({ success: false, message: 'IP address is required' });
    }

    const geoResult = lookupIp(ip);

    res.json({
      success: true,
      data: geoResult
    });
  } catch (error) {
    console.error('Error during IP lookup:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
