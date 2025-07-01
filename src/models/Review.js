const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const User = require('./User');
const Blog = require('./Blog');
const Order = require('./Order');
const Product = require('./product');
const Shop = require('./Shop');

class Review extends Model {
  static REVIEW_TYPES = ['blog', 'order', 'shop', 'product'];
  static ASSIGN_TYPES = ['shop', 'user'];
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    reviewable_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reviewable_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    assignable_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assignable_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 5,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reply: {
      type: DataTypes.TEXT,
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
  },
  {
    sequelize,
    modelName: 'Review',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
  }
);

// Associations
Review.belongsTo(User, { as: 'user', foreignKey: 'user_id' });

Review.morphTo('reviewable', [
  { model: Blog, foreignKey: 'reviewable_id', discriminator: 'reviewable_type' },
  { model: Order, foreignKey: 'reviewable_id', discriminator: 'reviewable_type' },
  { model: Shop, foreignKey: 'reviewable_id', discriminator: 'reviewable_type' },
  { model: Product, foreignKey: 'reviewable_id', discriminator: 'reviewable_type' },
]);

Review.morphTo('assignable', [
  { model: Shop, foreignKey: 'assignable_id', discriminator: 'assignable_type' },
  { model: User, foreignKey: 'assignable_id', discriminator: 'assignable_type' },
]);

module.exports = Review;
