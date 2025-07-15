// models/Story.js

module.exports = (sequelize, DataTypes) => {
  const Story = sequelize.define('Story', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    file_urls: {
      type: DataTypes.JSONB, // for PostgreSQL, store JSON array
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
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  }, {
    tableName: 'stories',
    timestamps: false, // set to true if you want Sequelize to handle timestamps automatically
    underscored: true,
  });

  Story.associate = (models) => {
    // belongsTo Shop
    Story.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // belongsTo Product
    Story.belongsTo(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Story;
};
