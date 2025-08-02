// models/referral_translation.js

module.exports = (sequelize, DataTypes) => {
  const ReferralTranslation = sequelize.define('ReferralTranslation', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    referral_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    locale: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    faq: {
      type: DataTypes.TEXT,
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
    tableName: 'referral_translations',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['referral_id', 'locale']
      },
      {
        fields: ['locale']
      }
    ]
  });

  ReferralTranslation.associate = (models) => {
    ReferralTranslation.belongsTo(models.Referral, {
      foreignKey: 'referral_id',
      as: 'referral',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return ReferralTranslation;
};
