const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const Shop = require('./Shop');

class ShopClosedDate extends Model {
  static filter(query, filter) {
    return query
      .modify((q) => {
        if (filter.shop_id) {
          q.where({ shop_id: filter.shop_id });
        }
      })
      .modify((q) => {
        if (filter.date_from) {
          q.where({ date: { [Op.gte]: filter.date_from } });
        }
      })
      .modify((q) => {
        if (filter.date_to) {
          q.where({ date: { [Op.lte]: filter.date_to } });
        }
      });
  }
}

ShopClosedDate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false, // corrected to match NOT NULL in DB
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
    modelName: 'ShopClosedDate',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true, // Prevent Sequelize from pluralizing table name
  }
);

// Relationships
ShopClosedDate.belongsTo(Shop, { as: 'shop', foreignKey: 'shop_id' });

module.exports = ShopClosedDate;
