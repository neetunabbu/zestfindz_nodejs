const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Cart extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        owner_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        total_price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        currency_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        region_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        country_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        city_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        wallet_applied_amount: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        area_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        rate: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        group: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true, // Match Laravel's Carbon|null
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true, // Match Laravel's Carbon|null
        },
      },
      {
        sequelize,
        modelName: 'Cart',
        tableName: 'carts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
        // Casts: 'status' and 'group' are BOOLEAN, 'rate' and 'total_price' are FLOAT, 'created_at' and 'updated_at' are DATE
      }
    );
  }

  // Traits (to be implemented separately as needed)
  // Regions: Custom trait for region-related functionality
  // Countries: Custom trait for country-related functionality
  // Cities: Custom trait for city-related functionality
  // Areas: Custom trait for area-related functionality
  // Note: These traits are not implemented here as per "no additions" instruction
  // Implement these as separate utilities or include in a base class if needed

  static associate(models) {
    // Relationships
    this.belongsTo(models.User, { foreignKey: 'owner_id', targetKey: 'id', as: 'user' });
    this.belongsTo(models.Currency, { foreignKey: 'currency_id', as: 'currency' });
    this.belongsTo(models.Order, { foreignKey: 'id', as: 'order' }); // Assumes order_id is cart.id
    this.hasMany(models.UserCart, { foreignKey: 'cart_id', as: 'userCarts' });
    this.hasOne(models.UserCart, { foreignKey: 'cart_id', as: 'userCart' });
    this.hasOne(models.PaymentProcess, {
      foreignKey: 'model_id',
      constraints: false,
      scope: {
        model_type: 'App\\Models\\Cart',
      },
      as: 'paymentProcess',
    });
  }

  // Replicate Laravel's getRateTotalPriceAttribute accessor
  get rateTotalPrice() {
    // Simulate Laravel's request()->is() for API routes
    // In a real app, pass request context explicitly (e.g., via middleware or parameter)
    const isApiRoute = false; // Placeholder for request()->is('api/v1/dashboard/user/*') || request()->is('api/v1/rest/*')

    if (isApiRoute) {
      return this.total_price * (this.rate <= 0 ? 1 : this.rate);
    }

    return this.total_price;
  }

  // Replicate Laravel's scopeFilter
  static filter(query, filter) {
    const regionId = filter.region_id;
    const countryId = filter.country_id;
    const cityId = filter.city_id;
    const areaId = filter.area_id;
    const byLocation = regionId || countryId || cityId || areaId;

    query
      .when(filter.user_cart_uuid, (q, uuid) => q.where({
        '$userCarts.uuid$': uuid,
      }, {
        include: [{ model: this.sequelize.models.UserCart, as: 'userCarts' }],
      }))
      .when(filter.cart_id, (q, cartId) => q.where({ id: cartId }))
      .when(filter.user_id, (q, userId) => q.where({ owner_id: userId }))
      .when(byLocation, (q) => q.where({
        [Op.and]: [
          { region_id: regionId },
          { country_id: countryId },
          { city_id: cityId },
          { area_id: areaId },
        ],
      }));

    return query;
  }
}

// Initialize the model
Cart.init();

module.exports = Cart;