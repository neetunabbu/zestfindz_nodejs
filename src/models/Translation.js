const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Translation extends Model {
  static TTL = 8640000; // 100 days

  static filter(query, array = {}) {
    return query
      .where(array.search ? {
        [Op.or]: [
          { key: { [Op.like]: `%${array.search}%` } },
          { value: { [Op.like]: `%${array.search.toLowerCase()}%` } }
        ]
      } : {})
      .where(array.group !== undefined ? { group: array.group } : {})
      .where(array.locale !== undefined ? { locale: array.locale } : {});
  }
}

Translation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  locale: {
    type: DataTypes.STRING,
    allowNull: false
  },
  group: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'group'   // important: maps JS `group` to quoted "group" in DB
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'key'     // important: maps JS `key` to quoted "key" in DB
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Translation',
  tableName: 'translations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

module.exports = Translation;
