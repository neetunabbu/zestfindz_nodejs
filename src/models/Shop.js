module.exports = (sequelize, DataTypes) => {
  const Shop = sequelize.define('Shop', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
      name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tax: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.00,
    },
    percentage: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    lat_long: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    open: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    background_img: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    logo_img: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    min_amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.1,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'new',
    },
    status_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    delivery_time: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    type: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    verify: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    r_count: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    r_avg: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    r_sum: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    o_count: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    od_count: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    delivery_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1,
    },
    email_statuses: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    application_id: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
  }, {
    tableName: 'shops',
    timestamps: false,
  });

  Shop.associate = (models) => {
    Shop.belongsTo(models.User, { as: 'seller', foreignKey: 'user_id' });
  };

  return Shop;
};