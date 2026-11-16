// Routes: CSS Generator & Export Endpoints
const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { AVAILABLE_COLUMNS, generateCss } = require('../services/cssService');

// GET /api/css/columns - Returns metadata on all available exportable columns
router.get('/columns', (req, res) => {
  res.json({
    success: true,
    data: AVAILABLE_COLUMNS
  });
});

// POST /api/css/preview - Preview CSS representation and table data before downloading
router.post('/preview', (req, res) => {
  try {
    const {
      selectedColumns = ['ip_address', 'country_name', 'timestamp', 'browser', 'os', 'page_visited', 'status_code'],
      columnAliases = {},
      includeHeaders = true,
      dateFilter = 'all',
      startDate = '',
      endDate = '',
      country = '',
      browser = '',
      os = '',
      pageVisited = ''
    } = req.body;

    // Resolve date cutoff if using preset
    let resolvedStartDate = startDate;
    if (dateFilter && dateFilter !== 'all' && dateFilter !== 'custom') {
      const now = new Date();
      if (dateFilter === 'today') {
        resolvedStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      } else if (dateFilter === 'last7days') {
        resolvedStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      } else if (dateFilter === 'last30days') {
        resolvedStartDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      }
    }

    const records = db.getRequestsForExport({
      startDate: resolvedStartDate,
      endDate,
      country,
      browser,
      os,
      pageVisited
    });

    const cssResult = generateCss(records, {
      selectedColumns,
      columnAliases,
      includeHeaders
    });

    // Provide preview lines
    const cssPreviewLines = cssResult.cssContent.split('\n').slice(0, 40).join('\n');

    res.json({
      success: true,
      data: {
        totalRows: cssResult.totalRows,
        byteSize: cssResult.byteSize,
        previewRows: cssResult.previewRows,
        cssPreview: cssPreviewLines,
        headerLabels: cssResult.headerLabels,
        activeColumns: cssResult.activeColumns
      }
    });
  } catch (error) {
    console.error('Error generating CSS preview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/css/download - Generate and download valid CSS file using selected data
router.post('/download', (req, res) => {
  try {
    const {
      selectedColumns = ['ip_address', 'country_name', 'timestamp', 'browser', 'os', 'page_visited', 'status_code'],
      columnAliases = {},
      includeHeaders = true,
      filename = 'user_analytics.css',
      dateFilter = 'all',
      startDate = '',
      endDate = '',
      country = '',
      browser = '',
      os = '',
      pageVisited = ''
    } = req.body;

    let resolvedStartDate = startDate;
    if (dateFilter && dateFilter !== 'all' && dateFilter !== 'custom') {
      const now = new Date();
      if (dateFilter === 'today') {
        resolvedStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      } else if (dateFilter === 'last7days') {
        resolvedStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      } else if (dateFilter === 'last30days') {
        resolvedStartDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      }
    }

    const records = db.getRequestsForExport({
      startDate: resolvedStartDate,
      endDate,
      country,
      browser,
      os,
      pageVisited
    });

    const cssResult = generateCss(records, {
      selectedColumns,
      columnAliases,
      includeHeaders
    });

    let safeFilename = filename && filename.trim() ? filename.trim() : 'user_analytics.css';
    if (!safeFilename.toLowerCase().endsWith('.css')) {
      safeFilename = safeFilename.replace(/\.[^/.]+$/, '') + '.css';
    }

    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeFilename)}"`);
    res.setHeader('Content-Length', Buffer.byteLength(cssResult.cssContent, 'utf8'));

    return res.send(cssResult.cssContent);
  } catch (error) {
    console.error('Error generating CSS download:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
