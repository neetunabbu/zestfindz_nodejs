// src/models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
    uuid: { type: DataTypes.STRING(36), allowNull: false },
    firstname: { type: DataTypes.STRING, allowNull: false, defaultValue: 'firstname' },
    lastname: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    birthday: { type: DataTypes.DATE },
    gender: { type: DataTypes.STRING, allowNull: false, defaultValue: 'male' },
    email_verified_at: { type: DataTypes.DATE },
    phone_verified_at: { type: DataTypes.DATE },
    ip_address: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    img: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    verify_token: { type: DataTypes.STRING },
    my_referral: { type: DataTypes.STRING, defaultValue: 'YmbFrKPu' },
    referral: { type: DataTypes.STRING },
    firebase_token: { type: DataTypes.JSON },
    r_count: { type: DataTypes.DOUBLE, defaultValue: 0 },
    r_avg: { type: DataTypes.DOUBLE, defaultValue: 0 },
    r_sum: { type: DataTypes.DOUBLE, defaultValue: 0 },
    o_count: { type: DataTypes.DOUBLE, defaultValue: 0 },
    o_sum: { type: DataTypes.DOUBLE, defaultValue: 0 },
    remember_token: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
    currency_id: { type: DataTypes.BIGINT },
    lang: { type: DataTypes.STRING },
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
// ✅ Helper Method
  User.prototype.getFullName = function () {
    return `${this.firstname} ${this.lastname || ''}`.trim();
  };

  // ✅ Association Setup
  User.associate = (models) => {
  User.belongsToMany(models.Role, {
    as: 'roles',
    through: {
      model: models.ModelHasRole,
      scope: {
        model_type: 'User',
      },
    },
    foreignKey: 'model_id',
    otherKey: 'role_id',
    constraints: false,
  });
  // // User model
  // User.hasOne(CustomerVerify, { foreignKey: 'user_id' });
  // User.hasMany(ReferalZestfindz, { foreignKey: 'user_id' });

};


  return User;
};
