const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RequestModel = sequelize.define('RequestModel', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    model_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    model_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    status_note: {
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
    tableName: 'request_models',
    underscored: true,
    timestamps: false,
  });

  // Associations
  RequestModel.associate = (models) => {
    RequestModel.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return RequestModel;
};
