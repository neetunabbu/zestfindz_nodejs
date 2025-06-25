const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true   // ✅ because it's BIGSERIAL
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  guard_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  route_permissions: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'roles',
  timestamps: true,               // ✅ let Sequelize manage timestamps
  createdAt: 'created_at',        // ✅ map Sequelize's createdAt to DB's created_at
  updatedAt: 'updated_at'         // ✅ map Sequelize's updatedAt to DB's updated_at
});

module.exports = Role;
