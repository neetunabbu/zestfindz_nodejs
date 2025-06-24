// src/models/Role.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true
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
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'roles',
  timestamps: false // Set true only if Sequelize should auto-manage timestamps
});

module.exports = Role;
