module.exports = (sequelize, DataTypes) => {
  
  const Settings = sequelize.define('Settings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'settings', // exact table name in the DB
    timestamps: true,      // adds createdAt and updatedAt columns automatically
    underscored: true,     // uses snake_case column names
    freezeTableName: true  // disables plural table name generation
  });

  // If Settings had any associations, they would be defined here,
  // similar to how CustomerVerify.associate is defined.
  // Settings.associate = models => {
  //   // Define associations here if any
  // };

  return Settings;
};
