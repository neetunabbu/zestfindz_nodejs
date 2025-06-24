const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class AssignShopTag extends Model {
  static init() {
    super.init(
      {
        shop_tag_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        shop_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'AssignShopTag',
        tableName: 'assign_shop_tags',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Replicate Laravel's default mass-assignment behavior: all fields are mass-assignable
        // No guarded attributes specified in Laravel model
      }
    );
  }

  static associate(models) {
    // Relationships
    this.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shop' });
    this.belongsTo(models.ShopTag, { foreignKey: 'shop_tag_id', as: 'shopTag' });
  }
}

// Initialize the model
AssignShopTag.init();

module.exports = AssignShopTag;