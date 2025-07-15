// models/MetaTag.js

module.exports = (sequelize, DataTypes) => {
  const MetaTag = sequelize.define('MetaTag', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    model_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    model_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    keywords: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    h1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seo_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    canonical: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    robots: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    change_freq: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    priority: {
      type: DataTypes.STRING(10),
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
    tableName: 'meta_tags',
    timestamps: false, // or true if Sequelize should manage createdAt/updatedAt
    underscored: true,
  });

  return MetaTag;
};
