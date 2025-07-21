module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
    id: {
    tableName: 'brands',
    timestamps: false, // Use true if Sequelize should manage timestamps
    underscored: true, // Because your columns use snake_case
    indexes: [
      {
        name: 'brands_uuid_index',
        fields: ['uuid'],
      },
    ],
  });

  Brand.associate = (models) => {
    Brand.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      as: 'shop',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return Brand;
};
