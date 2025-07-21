// models/faq_category.js

module.exports = (sequelize, DataTypes) => {
  const FaqCategory = sequelize.define('FaqCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'faq_categories',
    timestamps: false
  });

  FaqCategory.associate = (models) => {
    FaqCategory.hasMany(models.Faq, {
      foreignKey: 'category_id',
      as: 'faqs',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };

  return FaqCategory;
};
