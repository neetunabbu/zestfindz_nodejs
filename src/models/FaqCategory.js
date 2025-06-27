const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class FaqCategory extends Model {
  static associate(models) {
    // Define relationships if any
    this.hasMany(models.Faq, { foreignKey: 'category_id', sourceKey: 'id' });
  }
}

FaqCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'FaqCategory',
    tableName: 'faq_categories',
    timestamps: false,
    underscored: true,
    freezeTableName: true,
  }
);

module.exports = FaqCategory;
