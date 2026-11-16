// Database Layer: SQLite via better-sqlite3 with High Performance Indexing & Aggregations
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'analytics.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT UNIQUE NOT NULL,
    ip_address TEXT NOT NULL,
    country_code TEXT NOT NULL,
    country_name TEXT NOT NULL,
    city TEXT,
    continent TEXT,
    latitude REAL,
    longitude REAL,
    browser TEXT NOT NULL,
    browser_family TEXT,
    os TEXT NOT NULL,
    device_type TEXT,
    page_visited TEXT NOT NULL,
    page_title TEXT,
    referrer TEXT,
    status_code INTEGER DEFAULT 200,
    response_time_ms INTEGER DEFAULT 50,
    timestamp TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_requests_timestamp ON requests(timestamp);
  CREATE INDEX IF NOT EXISTS idx_requests_ip ON requests(ip_address);
  CREATE INDEX IF NOT EXISTS idx_requests_country ON requests(country_code);
  CREATE INDEX IF NOT EXISTS idx_requests_page ON requests(page_visited);
`);

// Prepared statement for single insert
const insertStmt = db.prepare(`
  INSERT INTO requests (
    request_id, ip_address, country_code, country_name, city, continent,
    latitude, longitude, browser, browser_family, os, device_type,
    page_visited, page_title, referrer, status_code, response_time_ms, timestamp
  ) VALUES (
    @request_id, @ip_address, @country_code, @country_name, @city, @continent,
    @latitude, @longitude, @browser, @browser_family, @os, @device_type,
    @page_visited, @page_title, @referrer, @status_code, @response_time_ms, @timestamp
  )
`);

// Transaction for high-speed batch insert
const insertManyTx = db.transaction((requests) => {
  for (const req of requests) {
    insertStmt.run(req);
  }
});

function insertSingle(request) {
  insertStmt.run(request);
  return request;
}

function insertBatch(requests) {
  insertManyTx(requests);
  return requests;
}

// Helper to calculate date cutoff based on filter
function getDateCondition(dateFilter) {
  const now = new Date();
  let cutoffDate;

  switch (dateFilter) {
    case 'today': {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      cutoffDate = todayStart.toISOString();
      return { sql: 'WHERE timestamp >= ?', params: [cutoffDate] };
    }
    case 'last7days': {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      cutoffDate = sevenDaysAgo.toISOString();
      return { sql: 'WHERE timestamp >= ?', params: [cutoffDate] };
    }
    case 'last30days': {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      cutoffDate = thirtyDaysAgo.toISOString();
      return { sql: 'WHERE timestamp >= ?', params: [cutoffDate] };
    }
    case 'all':
    default:
      return { sql: '', params: [] };
  }
}

// Get high-level KPI metrics
function getOverviewStats(dateFilter = 'all') {
  const { sql, params } = getDateCondition(dateFilter);

  const query = `
    SELECT 
      COUNT(*) AS total_visitors,
      COUNT(DISTINCT ip_address) AS unique_ips,
      COUNT(DISTINCT country_code) AS total_countries,
      COUNT(page_visited) AS total_page_views,
      ROUND(AVG(response_time_ms), 1) AS avg_response_time,
      ROUND(SUM(CASE WHEN status_code = 200 THEN 1.0 ELSE 0.0 END) * 100.0 / NULLIF(COUNT(*), 0), 1) AS success_rate
    FROM requests
    ${sql}
  `;

  const stats = db.prepare(query).get(...params) || {
    total_visitors: 0,
    unique_ips: 0,
    total_countries: 0,
    total_page_views: 0,
    avg_response_time: 0,
    success_rate: 100
  };

  // Recent 10 visitors
  const recentVisitors = db.prepare(`
    SELECT id, request_id, ip_address, country_code, country_name, city, browser, os, device_type, page_visited, status_code, timestamp
    FROM requests
    ORDER BY timestamp DESC
    LIMIT 10
  `).all();

  return {
    ...stats,
    recentVisitors
  };
}

// Get time-series aggregated data for charts
function getTimeSeries(dateFilter = 'last7days') {
  const { sql, params } = getDateCondition(dateFilter);

  // Group by day for last 7/30 days, or by hour for 'today'
  let groupByFormat = '%Y-%m-%d';
  if (dateFilter === 'today') {
    groupByFormat = '%Y-%m-%d %H:00';
  }

  const query = `
    SELECT 
      strftime('${groupByFormat}', timestamp) AS time_bucket,
      COUNT(*) AS visitors,
      COUNT(DISTINCT ip_address) AS unique_ips,
      COUNT(page_visited) AS page_views
    FROM requests
    ${sql}
    GROUP BY time_bucket
    ORDER BY time_bucket ASC
  `;

  return db.prepare(query).all(...params);
}

// Get visitors by country
function getCountryBreakdown(dateFilter = 'all') {
  const { sql, params } = getDateCondition(dateFilter);

  const query = `
    SELECT 
      country_code,
      country_name,
      COUNT(*) AS count,
      COUNT(DISTINCT ip_address) AS unique_ips,
      ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM requests ${sql}), 1) AS percentage
    FROM requests
    ${sql}
    GROUP BY country_code, country_name
    ORDER BY count DESC
    LIMIT 12
  `;

  return db.prepare(query).all(...params, ...params);
}

// Get traffic distribution by Browser, OS, Page
function getTrafficDistribution(dateFilter = 'all') {
  const { sql, params } = getDateCondition(dateFilter);

  const browserQuery = `
    SELECT 
      COALESCE(browser_family, 'Other') AS name,
      COUNT(*) AS count
    FROM requests
    ${sql}
    GROUP BY name
    ORDER BY count DESC
    LIMIT 6
  `;

  const osQuery = `
    SELECT 
      os AS name,
      COUNT(*) AS count
    FROM requests
    ${sql}
    GROUP BY name
    ORDER BY count DESC
    LIMIT 6
  `;

  const pagesQuery = `
    SELECT 
      page_visited AS path,
      COALESCE(page_title, page_visited) AS title,
      COUNT(*) AS hits,
      COUNT(DISTINCT ip_address) AS unique_visitors
    FROM requests
    ${sql}
    GROUP BY page_visited
    ORDER BY hits DESC
    LIMIT 8
  `;

  const deviceQuery = `
    SELECT 
      COALESCE(device_type, 'Desktop') AS name,
      COUNT(*) AS count
    FROM requests
    ${sql}
    GROUP BY name
    ORDER BY count DESC
  `;

  return {
    browsers: db.prepare(browserQuery).all(...params),
    os: db.prepare(osQuery).all(...params),
    topPages: db.prepare(pagesQuery).all(...params),
    devices: db.prepare(deviceQuery).all(...params)
  };
}

// Paginated requests table with rich filtering and sorting
function getPaginatedRequests({
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
} = {}) {
  const whereClauses = [];
  const queryParams = [];

  if (search && search.trim()) {
    whereClauses.push('(ip_address LIKE ? OR country_name LIKE ? OR page_visited LIKE ? OR browser LIKE ? OR city LIKE ?)');
    const term = `%${search.trim()}%`;
    queryParams.push(term, term, term, term, term);
  }

  if (country) {
    whereClauses.push('country_code = ?');
    queryParams.push(country);
  }

  if (browser) {
    whereClauses.push('browser_family = ?');
    queryParams.push(browser);
  }

  if (os) {
    whereClauses.push('os = ?');
    queryParams.push(os);
  }

  if (pageVisited) {
    whereClauses.push('page_visited = ?');
    queryParams.push(pageVisited);
  }

  if (startDate) {
    whereClauses.push('timestamp >= ?');
    queryParams.push(startDate);
  }

  if (endDate) {
    whereClauses.push('timestamp <= ?');
    queryParams.push(endDate);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Validate sort field
  const allowedSortCols = ['id', 'ip_address', 'country_name', 'timestamp', 'browser', 'os', 'page_visited', 'status_code', 'response_time_ms'];
  const safeSortCol = allowedSortCols.includes(sortBy) ? sortBy : 'timestamp';
  const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  // Count total matching
  const countSql = `SELECT COUNT(*) AS total FROM requests ${whereSql}`;
  const totalCount = db.prepare(countSql).get(...queryParams).total;

  // Fetch page
  const offset = (Math.max(1, parseInt(page, 10)) - 1) * limit;
  const dataSql = `
    SELECT * FROM requests
    ${whereSql}
    ORDER BY ${safeSortCol} ${safeSortOrder}
    LIMIT ? OFFSET ?
  `;

  const rows = db.prepare(dataSql).all(...queryParams, limit, offset);

  return {
    rows,
    pagination: {
      total: totalCount,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(totalCount / limit) || 1
    }
  };
}

// Fetch all filtered rows for CSS export
function getRequestsForExport({
  startDate = '',
  endDate = '',
  country = '',
  browser = '',
  os = '',
  pageVisited = ''
} = {}) {
  const whereClauses = [];
  const queryParams = [];

  if (startDate) {
    whereClauses.push('timestamp >= ?');
    queryParams.push(startDate);
  }

  if (endDate) {
    whereClauses.push('timestamp <= ?');
    queryParams.push(endDate);
  }

  if (country) {
    whereClauses.push('country_code = ?');
    queryParams.push(country);
  }

  if (browser) {
    whereClauses.push('browser_family = ?');
    queryParams.push(browser);
  }

  if (os) {
    whereClauses.push('os = ?');
    queryParams.push(os);
  }

  if (pageVisited) {
    whereClauses.push('page_visited = ?');
    queryParams.push(pageVisited);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const sql = `SELECT * FROM requests ${whereSql} ORDER BY timestamp DESC`;

  return db.prepare(sql).all(...queryParams);
}

// Reset all requests table
function resetDatabase() {
  db.exec('DELETE FROM requests;');
  db.exec('VACUUM;');
}

// Total count
function getTotalCount() {
  return db.prepare('SELECT COUNT(*) AS count FROM requests').get().count;
}

module.exports = {
  db,
  insertSingle,
  insertBatch,
  getOverviewStats,
  getTimeSeries,
  getCountryBreakdown,
  getTrafficDistribution,
  getPaginatedRequests,
  getRequestsForExport,
  resetDatabase,
  getTotalCount
};
