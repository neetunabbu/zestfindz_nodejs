module.exports = (sequelize, DataTypes) => {
  const CustomerVerify = sequelize.define('CustomerVerify', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER, // 0 or 1 (not verified or verified)
      allowNull: false,
      defaultValue: 1
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
    tableName: 'customer_verify',
    timestamps: true,
    underscored: true,
    freezeTableName: true
  });

  CustomerVerify.associate = models => {
    CustomerVerify.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return CustomerVerify;
};
