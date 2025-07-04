const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Ticket extends Model {}

Ticket.init({
  id: {
    type: DataTypes.INTEGER, // or BIGINT if you'd prefer exact parity
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  uuid: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  created_by: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  model_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  parent_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'question'
  },
  subject: {
    type: DataTypes.STRING(191),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'open'
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Ticket',
  tableName: 'tickets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

module.exports = Ticket;

const { Sequelize } = require('sequelize');

// ✅ Create Sequelize instance
const sequelize = new Sequelize('zestfindz_DB', 'postgres', '9700912007', {
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