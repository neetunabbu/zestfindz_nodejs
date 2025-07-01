const Role = require('../src/models/Role');
const sequelize = require('../src/config/db');

(async () => {
  await sequelize.sync();
  await Role.bulkCreate([
    { name: 'admin' },
    { name: 'manager' },
    { name: 'user' }
  ], { ignoreDuplicates: true });
  console.log('Sample roles seeded.');
  process.exit();
})();
