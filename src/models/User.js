const { DataTypes, Model, Op } = require('sequelize');
const bcrypt = require('bcrypt');
const redis = require('redis');
const sequelize = require('../config/db'); // PostgreSQL connection

const redisClient = redis.createClient(); // Configure as per your Redis setup

class User extends Model {
  static init() {
    super.init({
      id: {
        type: DataTypes.BIGINT, // Suitable for PostgreSQL, aligns with first code
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID, // PostgreSQL native UUID type
        defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
        allowNull: false,
        unique: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'firstname', // From first code
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: { isEmail: true }, // From second code for validation
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      birthday: {
        type: DataTypes.DATEONLY, // PostgreSQL DATE, no time, from first code
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'male', // From first code
      },
      email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      phone_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // From first code
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      firebase_token: {
        type: DataTypes.JSONB, // PostgreSQL-specific, from first code
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
          if (value) {
            this.setDataValue('password', bcrypt.hashSync(value, 10)); // From second code
          }
        },
      },
      remember_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verify_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      referral: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      my_referral: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'YmbFrKPu', // From first code
      },
      r_count: {
        type: DataTypes.DOUBLE, // From first code, works in PostgreSQL as DOUBLE PRECISION
        allowNull: true,
        defaultValue: 0,
      },
      r_avg: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      r_sum: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      o_count: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      o_sum: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      currency_id: {
        type: DataTypes.BIGINT, // From first code
        allowNull: true,
      },
      lang: {
        type: DataTypes.STRING,
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
      sequelize, // PostgreSQL connection
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {
        beforeCreate: (user) => {
          user.created_at = new Date();
          user.updated_at = new Date();
        },
        beforeUpdate: (user) => {
          user.updated_at = new Date();
        },
      },
    });
  }

  static associate(models) {
    // Relationships
    this.hasOne(models.Shop, { foreignKey: 'user_id' });
    this.hasOne(models.EmailSubscription, { foreignKey: 'user_id' });
    this.hasOne(models.Wallet, { foreignKey: 'user_id' });
    this.hasOne(models.UserPoint, { foreignKey: 'user_id' });
    this.hasOne(models.DeliveryManSetting, { foreignKey: 'user_id' });
    this.hasOne(models.UserActivity, { foreignKey: 'user_id' });
    this.hasOne(models.UserAddress, { foreignKey: 'user_id' });
    this.hasOne(models.Invitation, { foreignKey: 'user_id', as: 'invite' });

    this.hasMany(models.Review, { foreignKey: 'user_id' });
    this.hasMany(models.Transaction, { foreignKey: 'user_id' });
    this.hasMany(models.Invitation, { foreignKey: 'user_id', as: 'invitations' });
    this.hasMany(models.SocialProvider, { foreignKey: 'user_id' });
    this.hasMany(models.Order, { foreignKey: 'user_id', as: 'orders' });
    this.hasMany(models.PaymentProcess, { foreignKey: 'user_id' });
    this.hasMany(models.Order, { foreignKey: 'deliveryman_id', as: 'deliveryManOrders' });
    this.hasMany(models.UserActivity, { foreignKey: 'user_id', as: 'activities' });
    this.hasMany(models.UserAddress, { foreignKey: 'user_id', as: 'addresses' });
    this.hasMany(models.PointHistory, { foreignKey: 'user_id' });
    this.hasMany(models.Gallery, { foreignKey: 'user_id', as: 'galleries' }); // Added
    this.hasMany(models.PersonalAccessToken, { foreignKey: 'user_id', as: 'tokens' }); // Added

    this.belongsToMany(models.Notification, {
      through: 'notification_users',
      foreignKey: 'user_id',
      as: 'notifications',
    });
    this.belongsToMany(models.Banner, {
      through: 'likes',
      foreignKey: 'user_id',
      as: 'likes',
    });
    this.belongsToMany(models.Role, {
      through: 'model_has_roles',
      foreignKey: 'model_id',
      as: 'roles',
    });
    this.belongsToMany(models.Permission, {
      through: 'model_has_permissions',
      foreignKey: 'model_id',
      as: 'permissions',
    });

    this.belongsTo(models.Currency, { foreignKey: 'currency_id' });

    // HasOneThrough equivalent for moderatorShop
    this.hasOne(models.Invitation, {
      foreignKey: 'user_id',
      as: 'moderatorInvitation',
    }).then((invitation) => {
      if (invitation) {
        return models.Shop.findOne({ where: { id: invitation.shop_id } });
      }
    });

    // MorphMany equivalent for assignReviews
    this.hasMany(models.Review, {
      foreignKey: 'assignable_id',
      constraints: false,
      as: 'assignReviews',
      scope: { assignable_type: 'User' },
    });

    // HasManyThrough equivalent for orderDetails
    this.hasMany(models.OrderDetail, {
      through: models.Order,
      foreignKey: 'user_id',
      as: 'orderDetails',
    });
  }

  // Methods
  async isOnline() {
    return await redisClient.exists(`user-online-${this.id}`);
  }

  get role() {
    return this.roles && this.roles.length > 0 ? this.roles[this.roles.length - 1].name : 'no role';
  }

  get name_or_email() {
    return this.firstname || this.email;
  }

  get full_name() {
    return `${this.firstname} ${this.lastname || ''}`.trim();
  }

  static async filter(query, filter) {
    let qb = this;

    if (filter.role) {
      if (filter.role === 'deliveryman') {
        qb = qb.where({ 'roles.name': 'deliveryman' });
      } else {
        qb = qb.where({ 'roles.name': filter.role });
      }
    }

    if (filter.roles) {
      const roles = Array.isArray(filter.roles) ? filter.roles : [filter.roles];
      qb = qb.where({ 'roles.name': { [Op.in]: roles } });
    }

    if (filter.shop_id) {
      qb = qb.where({ 'invitations.shop_id': filter.shop_id });
    }

    if (filter.not_shop_id) {
      qb = qb.whereNot({ 'invitations.shop_id': filter.not_shop_id });
    }

    if (filter['empty-shop']) {
      qb = qb.whereNotExists({ model: 'Shop', foreignKey: 'user_id' });
    }

    if (filter.search) {
      qb = qb.where({
        [Op.or]: [
          { firstname: { [Op.like]: `%${filter.search}%` } },
          { lastname: { [Op.like]: `%${filter.search}%` } },
          { email: { [Op.like]: `%${filter.search}%` } },
        ],
      });
    }

    if (filter.statuses && Array.isArray(filter.statuses)) {
      const statuses = filter.statuses.filter((s) => ['new', 'accepted', 'delivered'].includes(s)); // Example statuses
      if (filter.role === 'deliveryman') {
        qb = qb.where({ 'deliveryManOrders.status': { [Op.in]: statuses } });
      } else {
        qb = qb.where({ 'orders.status': { [Op.in]: statuses } });
      }
    }

    if (filter.date_from) {
      const dateFrom = new Date(new Date(filter.date_from).setDate(new Date(filter.date_from).getDate() - 1));
      const dateTo = filter.date_to ? new Date(new Date(filter.date_to).setDate(new Date(filter.date_to).getDate() + 1)) : new Date();
      if (filter.role === 'deliveryman') {
        qb = qb.where({
          'deliveryManOrders.created_at': { [Op.between]: [dateFrom, dateTo] },
        });
      } else {
        qb = qb.where({
          'orders.created_at': { [Op.between]: [dateFrom, dateTo] },
        });
      }
    }

    if (filter.online !== undefined || filter.type_of_technique) {
      qb = qb.where({
        'deliveryManSetting': {
          ...(filter.online !== undefined && {
            online: !!parseInt(filter.online),
            location: { [Op.ne]: null },
          }),
          ...(filter.type_of_technique && {
            type_of_technique: filter.type_of_technique,
          }),
        },
      });
    }

    if (filter.active !== undefined) {
      qb = qb.where({ active: filter.active });
    }

    if (filter.exist_token) {
      qb = qb.where({ firebase_token: { [Op.ne]: null } });
    }

    if (filter.walletSort) {
      qb = qb.order([[ { model: 'Wallet', as: 'wallet' }, filter.walletSort, filter.sort || 'DESC' ]]);
    }

    if (filter['empty-setting']) {
      qb = qb.whereNotExists({ model: 'DeliveryManSetting', foreignKey: 'user_id' });
    }

    if (filter.column) {
      const column = {
        rating: 'r_avg',
        count: 'o_count',
        sum: 'o_sum',
        wallet_sum: 'wallet_sum_price',
      }[filter.column] || (await this.rawAttributes[filter.column] ? filter.column : 'id');
      qb = qb.order([[column, filter.sort || 'DESC']]);

      if (filter.by_rating) {
        const operator = filter.by_rating === 'top' ? Op.gte : Op.lt;
        qb = qb.having('r_avg', operator, 3.99);
      }
    }

    return qb;
  }
}

// Initialize the model
User.init();

module.exports = User;