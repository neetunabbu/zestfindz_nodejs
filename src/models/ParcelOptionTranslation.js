module.exports = (sequelize, DataTypes) => {
  const ParcelOptionTranslation = sequelize.define('ParcelOptionTranslation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parcel_option_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'parcel_option_translations',
    timestamps: false, // Laravel model also disabled timestamps
    underscored: true,
  });

  ParcelOptionTranslation.associate = (models) => {
    ParcelOptionTranslation.belongsTo(models.ParcelOption, {
      foreignKey: 'parcel_option_id',
      as: 'option',
    });
  };

  return ParcelOptionTranslation;
};
