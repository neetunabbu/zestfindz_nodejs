// models/referral.js

module.exports = (sequelize, DataTypes) => {
  const Referral = sequelize.define('Referral', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    price_from: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    price_to: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    tableName: 'referrals',
    timestamps: false
  });

  Referral.associate = (models) => {
    Referral.hasMany(models.ReferralTranslation, {
      foreignKey: 'referral_id',
      as: 'translations',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Referral;
};
