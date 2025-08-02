
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserAddress = sequelize.define('UserAddress', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    location: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zipcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street_house_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    additional_details: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    region_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 1,
    },
    country_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 1,
    },
    city_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    area_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username_or_note: {
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
    tableName: 'user_addresses',
    timestamps: false,
    underscored: true,
  });

  UserAddress.associate = (models) => {
    UserAddress.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    UserAddress.belongsTo(models.Region, {
      foreignKey: 'region_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    UserAddress.belongsTo(models.Country, {
      foreignKey: 'country_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    UserAddress.belongsTo(models.City, {
      foreignKey: 'city_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    UserAddress.belongsTo(models.Area, {
      foreignKey: 'area_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return UserAddress;
};

