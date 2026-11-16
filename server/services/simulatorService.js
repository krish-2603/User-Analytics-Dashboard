// Simulator Service: Realistic Web Traffic Generator for Analytics Testing
const { generateRealisticIp } = require('./geoService');

const BROWSERS = [
  { name: 'Chrome', versions: ['130.0', '129.0', '128.0'], weight: 55 },
  { name: 'Safari', versions: ['18.1', '17.6', '18.0'], weight: 20 },
  { name: 'Firefox', versions: ['132.0', '131.0', '130.0'], weight: 12 },
  { name: 'Edge', versions: ['130.0', '129.0'], weight: 9 },
  { name: 'Opera', versions: ['114.0', '113.0'], weight: 4 }
];

const OPERATING_SYSTEMS = [
  { name: 'Windows 11', device: 'Desktop', weight: 40 },
  { name: 'macOS Sequoia', device: 'Desktop', weight: 25 },
  { name: 'iOS 18', device: 'Mobile', weight: 18 },
  { name: 'Android 15', device: 'Mobile', weight: 12 },
  { name: 'Linux Ubuntu', device: 'Desktop', weight: 5 }
];

const PAGES = [
  { path: '/', title: 'Home Page', weight: 30 },
  { path: '/pricing', title: 'Pricing & Plans', weight: 18 },
  { path: '/features', title: 'Product Features', weight: 15 },
  { path: '/docs/api', title: 'API Documentation', weight: 12 },
  { path: '/dashboard', title: 'User Dashboard', weight: 10 },
  { path: '/signup', title: 'Account Registration', weight: 7 },
  { path: '/blog/data-analytics-guide', title: 'Blog: Analytics Guide', weight: 5 },
  { path: '/checkout', title: 'Subscription Checkout', weight: 3 }
];

const REFERRERS = [
  { name: 'https://google.com', label: 'Google Organic Search', weight: 45 },
  { name: 'Direct / Bookmark', label: 'Direct Traffic', weight: 25 },
  { name: 'https://github.com', label: 'GitHub Referral', weight: 12 },
  { name: 'https://x.com', label: 'X (Twitter)', weight: 8 },
  { name: 'https://linkedin.com', label: 'LinkedIn', weight: 6 },
  { name: 'https://news.ycombinator.com', label: 'Hacker News', weight: 4 }
];

function pickWeighted(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * total;
  for (const item of items) {
    if (random < item.weight) return item;
    random -= item.weight;
  }
  return items[0];
}

// Generate a single realistic request record
function generateSingleRequest(options = {}) {
  const {
    preferredCountry = null,
    preferredPage = null,
    timestamp = new Date().toISOString(),
    statusOverride = null
  } = options;

  const geo = generateRealisticIp(preferredCountry);
  const browserObj = pickWeighted(BROWSERS);
  const browserVersion = browserObj.versions[Math.floor(Math.random() * browserObj.versions.length)];
  const osObj = pickWeighted(OPERATING_SYSTEMS);

  const selectedPage = preferredPage
    ? (PAGES.find(p => p.path === preferredPage) || { path: preferredPage, title: preferredPage })
    : pickWeighted(PAGES);

  const referrerObj = pickWeighted(REFERRERS);

  // Status codes: 94% 200 OK, 3% 304 Not Modified, 2% 201 Created, 1% 404
  const randStatus = Math.random();
  let statusCode = statusOverride || (randStatus < 0.94 ? 200 : randStatus < 0.97 ? 304 : randStatus < 0.99 ? 201 : 404);

  // Response time between 15ms and 380ms
  const responseTimeMs = Math.floor(Math.random() * 320) + 25;

  const randomHex = Math.random().toString(36).substring(2, 10);
  const requestId = `req_${Date.now()}_${randomHex}`;

  return {
    request_id: requestId,
    ip_address: geo.ip,
    country_code: geo.countryCode,
    country_name: geo.countryName,
    city: geo.city,
    continent: geo.continent,
    latitude: geo.latitude,
    longitude: geo.longitude,
    browser: `${browserObj.name} ${browserVersion}`,
    browser_family: browserObj.name,
    os: osObj.name,
    device_type: osObj.device,
    page_visited: selectedPage.path,
    page_title: selectedPage.title,
    referrer: referrerObj.name,
    status_code: statusCode,
    response_time_ms: responseTimeMs,
    timestamp: timestamp
  };
}

// Generate multiple requests batch
function generateBatch(count = 10, options = {}) {
  const requests = [];
  const safeCount = Math.min(Math.max(1, parseInt(count, 10) || 1), 200);

  for (let i = 0; i < safeCount; i++) {
    // Stagger timestamps slightly if generated in batch
    const jitterSeconds = Math.floor(Math.random() * (safeCount * 2));
    const now = new Date();
    const reqTime = options.timestamp
      ? new Date(options.timestamp)
      : new Date(now.getTime() - jitterSeconds * 1000);

    requests.push(generateSingleRequest({
      ...options,
      timestamp: reqTime.toISOString()
    }));
  }

  // Sort descending by timestamp
  requests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return requests;
}

module.exports = {
  BROWSERS,
  OPERATING_SYSTEMS,
  PAGES,
  REFERRERS,
  generateSingleRequest,
  generateBatch
};
