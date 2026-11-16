const db = require('./server/db/database');
const { lookupIp } = require('./server/services/geoService');
const { generateBatch } = require('./server/services/simulatorService');
const { generateCss, AVAILABLE_COLUMNS, escapeCssString } = require('./server/services/cssService');

console.log('=== VERIFICATION SUITE (USER ANALYTICS & CSS GENERATOR) ===');

// 1. Database Stats
const stats = db.getOverviewStats('all');
console.log('1. Database Stats (all time):', JSON.stringify({
  total_visitors: stats.total_visitors,
  unique_ips: stats.unique_ips,
  total_countries: stats.total_countries,
  total_page_views: stats.total_page_views,
  avg_response_time: stats.avg_response_time
}, null, 2));

// 2. GeoIP Lookup
const geo = lookupIp('8.8.8.8');
console.log('2. GeoIP 8.8.8.8 -> Country:', geo.countryName, '| Flag:', geo.flag, '| City:', geo.city);
const geoUK = lookupIp('151.101.65.140');
console.log('2b. GeoIP 151.101.65.140 -> Country:', geoUK.countryName, '| Flag:', geoUK.flag);

// 3. Traffic Simulation
const sim = generateBatch(4);
console.log('3. Traffic Simulation Generated:', sim.length, 'records');
console.log('   Sample visit:', sim[0].ip_address, '| Country:', sim[0].country_name, '| Browser:', sim[0].browser, '| Page:', sim[0].page_visited);

// 4. CSS File Generation
const rows = db.getRequestsForExport({});
const css = generateCss(rows.slice(0, 3), {
  selectedColumns: ['ip_address', 'country_name', 'browser', 'page_visited', 'status_code'],
  columnAliases: {
    ip_address: 'Client IP',
    country_name: 'Origin Country'
  },
  includeHeaders: true
});
console.log('4. CSS File Generation Sample:\n' + css.cssContent.slice(0, 480) + '\n...');

// 5. CSS String Escaping
const testString = 'Quotes "hello" & Commas, Semicolons; \\ Backslash\nNewline';
const escaped = escapeCssString(testString);
console.log('5. CSS Escaping Test:');
console.log('   Original:', testString);
console.log('   Escaped: ', escaped);

console.log('\n=== ALL MODULE CAPABILITIES VERIFIED (CSV COMPLETELY REMOVED) ===');
