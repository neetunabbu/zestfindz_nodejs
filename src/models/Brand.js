module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
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
