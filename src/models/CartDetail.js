const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class CartDetail extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        shop_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        user_cart_id: {
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
        modelName: 'CartDetail',
        tableName: 'cart_details',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have a direct a "guarded" equivalent, but all fields except 'id' are mass-assignable
        // Casts: 'bonus' cast to BOOLEAN, but not included as a column (per PHPDoc)
      }
    );
  }

  static associate(models) {
    // Relationships
    this.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shop' });
    this.belongsTo(models.UserCart, { foreignKey: 'user_cart_id', as: 'userCart' });
    this.hasOne(models.CartDetailProduct, { foreignKey: 'cart_detail_id', as: 'cartDetailProduct' });
    this.hasMany(models.CartDetailProduct, { foreignKey: 'cart_detail_id', as: 'cartDetailProducts' });
  }
}

// Initialize the model
CartDetail.init();

module.exports = CartDetail;