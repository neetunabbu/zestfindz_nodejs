const { Sequelize } = require('sequelize');

// ✅ Create Sequelize instance
const sequelize = new Sequelize('zestfindz', 'postgres', '9700912007', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Disable SQL logging in terminal
    timezone: '+05:30' // Set to your local timezone if needed
});

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
