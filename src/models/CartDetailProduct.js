const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class CartDetailProduct extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        stock_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cart_detail_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        parent_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        discount: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        bonus: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
        modelName: 'CartDetailProduct',
        tableName: 'cart_detail_products',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
        // Casts: 'bonus' is BOOLEAN
      }
    );
  }

  // Trait (to be implemented separately as needed)
  // Loadable: Custom trait for data-loading functionality
  // Note: This trait is not implemented here as per "no additions" instruction
  // Implement as a separate utility or include in a base class if needed

  static associate(models) {
    // Relationships
    this.belongsTo(models.CartDetail, { foreignKey: 'cart_detail_id', as: 'cartDetail' });
    this.belongsTo(models.Stock, { foreignKey: 'stock_id', as: 'stock' });
    this.belongsTo(models.CartDetailProduct, { foreignKey: 'parent_id', as: 'parent' });
    this.hasMany(models.CartDetailProduct, { foreignKey: 'parent_id', as: 'children' });
  }

  // Replicate Laravel's getRatePriceAttribute accessor
  get ratePrice() {
    // Simulate Laravel's request()->is() for API routes
    // In a real app, pass request context explicitly (e.g., via middleware or parameter)
    const isApiRoute = false; // Placeholder for request()->is('api/v1/dashboard/user/*') || request()->is('api/v1/rest/*')

    if (isApiRoute) {
      return this.price * (this.cartDetail?.userCart?.cart?.rate || 1);
    }

    return this.price;
  }

  // Replicate Laravel's getRateDiscountAttribute accessor
  get rateDiscount() {
    // Simulate Laravel's request()->is() for API routes
    // In a real app, pass request context explicitly (e.g., via middleware or parameter)
    const isApiRoute = false; // Placeholder for request()->is('api/v1/dashboard/user/*') || request()->is('api/v1/rest/*')

    if (isApiRoute) {
      return this.discount * (this.cartDetail?.userCart?.cart?.rate || 1);
    }

    return this.discount;
  }
}

// Initialize the model
CartDetailProduct.init();

module.exports = CartDetailProduct;