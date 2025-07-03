//zestfindz_nodejs\scripts\seedRoles.js
const db = require('../src/models'); // This loads all models and associations
const sequelize = require('../src/config/db');

(async () => {
  try {
    await sequelize.authenticate();
    await db.Role.bulkCreate([
      { name: 'admin' },
      { name: 'manager' },
      { name: 'user' }
    ], { ignoreDuplicates: true });
    console.log('Sample roles seeded.');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await sequelize.close();
    process.exit();
  }
})();