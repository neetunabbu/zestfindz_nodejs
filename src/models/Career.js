// models/Career.js

module.exports = (sequelize, DataTypes) => {
  const Career = sequelize.define('Career', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    location: {
      type: DataTypes.JSONB, // PostgreSQL supports JSONB
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'careers',
    underscored: true,
    timestamps: false, // Disable if you're not using Sequelize's timestamps
  });

  Career.associate = (models) => {
    Career.belongsTo(models.Category, {
      foreignKey: 'category_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Career;
};
