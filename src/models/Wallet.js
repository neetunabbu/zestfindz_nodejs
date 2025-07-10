// models/Wallet.js

module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    currency_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
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
  }, {
    tableName: 'wallets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'wallets_uuid_user_id_unique',
        unique: true,
        fields: ['uuid', 'user_id']
      },
      {
        name: 'wallets_user_id_foreign',
        fields: ['user_id']
      },
      {
        name: 'wallets_uuid_index',
        fields: ['uuid']
      }
    ]
  });

  Wallet.associate = (models) => {
    Wallet.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Uncomment if Currency model exists and has a relationship
    // Wallet.belongsTo(models.Currency, {
    //   foreignKey: 'currency_id',
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE',
    // });
  };

  return Wallet;
};
