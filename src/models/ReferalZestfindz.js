module.exports = (sequelize, DataTypes) => {
  const ReferalZestfindz = sequelize.define('ReferalZestfindz', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Use this instead of `code` as PK if `code` is referral string
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
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
    tableName: 'referal_zestfindz',
    underscored: true,
    timestamps: true,
    freezeTableName: true,
  });

  // ✅ Setup associations using models object, not require()
  ReferalZestfindz.associate = (models) => {
    ReferalZestfindz.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });

    // ❓ If you have another FK like `refered_person_id`, then it should exist in your model definition:
    // ReferalZestfindz.belongsTo(models.User, { as: 'referedPerson', foreignKey: 'refered_person_id' });
  };

  return ReferalZestfindz;
};
