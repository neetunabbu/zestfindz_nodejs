const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

const Referral = sequelize.define('Referral', {
  id: {
    type: DataTypes.BIGINT,       // ✅ BIGINT to match PostgreSQL BIGSERIAL
    primaryKey: true,
    autoIncrement: true,
  },
  price_from: {
    type: DataTypes.DOUBLE,
    allowNull: true,              // ✅ should be NULLABLE as per DB
  },
  price_to: {
    type: DataTypes.DOUBLE,
    allowNull: true,              // ✅ should be NULLABLE as per DB
  },
  expired_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,              // ✅ should be NULLABLE as per DB
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'referrals',
  timestamps: true,               // ✅ Sequelize timestamps enabled
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Relationships
Referral.associate = (models) => {
  Referral.hasMany(models.ReferralTranslation, { as: 'translations', foreignKey: 'referral_id' });
  Referral.hasOne(models.ReferralTranslation, { as: 'translation', foreignKey: 'referral_id' });
};

module.exports = Referral;
