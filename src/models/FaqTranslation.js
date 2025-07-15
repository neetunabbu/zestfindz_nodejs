// models/faq_translation.js

module.exports = (sequelize, DataTypes) => {
  const FaqTranslation = sequelize.define('FaqTranslation', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    faq_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    locale: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: 'faq_translations',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['faq_id', 'locale']
      },
      {
        fields: ['locale']
      }
    ]
  });

  FaqTranslation.associate = (models) => {
    FaqTranslation.belongsTo(models.Faq, {
      foreignKey: 'faq_id',
      as: 'faq',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return FaqTranslation;
};
