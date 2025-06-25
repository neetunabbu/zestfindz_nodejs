const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class AssignShopTag extends Model {}

AssignShopTag.init(
    {
        shop_tag_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        shop_id: {
            type: DataTypes.INTEGER,
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
    },
    {
        sequelize,
        modelName: 'AssignShopTag',
        tableName: 'assign_shop_tags',
        timestamps: true, // ✅ Sequelize will automatically manage created_at and updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

// ✅ Relationships
AssignShopTag.associate = (models) => {
    AssignShopTag.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shop' });
    AssignShopTag.belongsTo(models.ShopTag, { foreignKey: 'shop_tag_id', as: 'shopTag' });
};

module.exports = AssignShopTag;
