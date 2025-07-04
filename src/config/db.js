const { Sequelize } = require('sequelize');

// ✅ Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'zestfindz',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'Kumar@2000',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false, // Disable SQL logging in terminal
    timezone: '+05:30' // Set to your local timezone if needed
  }
);

// ✅ Test Database Connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL Database Connected Successfully!');
    } catch (error) {
        console.error('❌ Database Connection Failed:', error);
    }
})();

module.exports = sequelize;
