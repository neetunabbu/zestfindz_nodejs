// models/faq.js

module.exports = (sequelize, DataTypes) => {
  const Faq = sequelize.define('Faq', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'faqs',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['uuid']
      },
      {
        fields: ['category_id']
      }
    ]
  });

  Faq.associate = (models) => {
    // Association with faq_translations
    Faq.hasMany(models.FaqTranslation, {
      foreignKey: 'faq_id',
      as: 'translations',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Association with faq_categories
    Faq.belongsTo(models.FaqCategory, {
      foreignKey: 'category_id',
      as: 'category',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };

  return Faq;
};
