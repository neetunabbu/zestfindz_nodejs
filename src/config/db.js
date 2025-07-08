const { Sequelize } = require('sequelize');
require('dotenv').config();
// ✅ Create Sequelize instance
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // needed for Render
    },
  },
  logging: false, // disable SQL logs
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
