// models/ModelLog.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ModelLog = sequelize.define('ModelLog', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    model_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    model_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB, // Use JSONB for PostgreSQL
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'log',
    },
  }, {
    tableName: 'model_logs',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: 'model_logs_model_type_model_id_index',
        fields: ['model_type', 'model_id'],
      },
    ],
  });

  return ModelLog;
};
