const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Blog = sequelize.define('Blog', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    type: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
    published_at: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    img: {
      type: DataTypes.STRING(191),
      allowNull: true,
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
    category_id: {
      type: DataTypes.INTEGER,
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
    tableName: 'blogs',
    underscored: true,
    timestamps: false, // since we manually handle created_at and updated_at
  });

  Blog.associate = (models) => {
    Blog.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    Blog.belongsTo(models.BlogCategory, {
      foreignKey: 'category_id',
      as: 'category',
      onDelete: 'CASCADE',
    });
  };

  return Blog;
};
