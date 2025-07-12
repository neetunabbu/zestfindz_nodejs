module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
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
