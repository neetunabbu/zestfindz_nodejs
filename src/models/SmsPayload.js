'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SmsPayload extends Model {
    static associate(models) {
      // No associations defined in Laravel version
    }
  }

  SmsPayload.init({
    type: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSON, // Equivalent to Laravel's `cast => array`
      allowNull: true,
    },
    default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'SmsPayload',
    tableName: 'sms_payloads',
    timestamps: false,
  });

  return SmsPayload;
};
