// Database Seeder: Generates Realistic Historical Web Traffic for 30-day Analytics
const { insertBatch, getTotalCount } = require('./database');
const { generateSingleRequest } = require('../services/simulatorService');

function seedDatabase(force = false, targetCount = 180) {
  const currentCount = getTotalCount();
  if (currentCount > 0 && !force) {
    console.log(`[Seed] Database already contains ${currentCount} requests. Skipping initial seed.`);
    return currentCount;
  }

  console.log(`[Seed] Generating ${targetCount} realistic historical requests across past 30 days...`);

  const requests = [];
  const now = new Date();

  // Distribute records:
  // ~40 records for today
  // ~70 records for days 1-7
  // ~70 records for days 8-30

  for (let i = 0; i < targetCount; i++) {
    let daysAgo;
    if (i < 40) {
      // Today: random minutes/hours today
      daysAgo = Math.random() * 0.9;
    } else if (i < 110) {
      // Past 7 days
      daysAgo = 1 + Math.random() * 6;
    } else {
      // Past 8 to 30 days
      daysAgo = 7 + Math.random() * 23;
    }

    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Add random hour & minute jitter
    timestamp.setMinutes(Math.floor(Math.random() * 60));
    timestamp.setSeconds(Math.floor(Math.random() * 60));

    const req = generateSingleRequest({
      timestamp: timestamp.toISOString()
    });

    requests.push(req);
  }

  // Insert all in a single SQLite transaction
  insertBatch(requests);
  console.log(`[Seed] Successfully seeded ${requests.length} requests into SQLite!`);
  return requests.length;
}

module.exports = {
  seedDatabase
};
