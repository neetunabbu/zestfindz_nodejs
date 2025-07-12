module.exports = (sequelize, DataTypes) => {
  const CategoryTranslation = sequelize.define('CategoryTranslation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'category_translations',
    timestamps: false,
    underscored: true,
    freezeTableName: true,
  });

  CategoryTranslation.associate = (models) => {
    CategoryTranslation.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  };

  return CategoryTranslation;
};
