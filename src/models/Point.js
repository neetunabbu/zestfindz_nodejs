const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Point extends Model {
    static async getActualPoint(amount) {
        const point = await this.findOne({
            where: {
                active: true,
                value: { [Op.lte]: parseInt(amount) },
            },
            order: [['value', 'DESC']],
        });

        return point?.type === 'percent'
            ? (parseFloat(amount) / 100) * (parseFloat(point?.price) || 0)
            : (parseFloat(point?.price) || 0);
    }
}

Point.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        shop_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'fix',
        },
        price: {
            type: DataTypes.DECIMAL,   // corrected from STRING to DECIMAL (for NUMERIC in PostgreSQL)
            allowNull: false,
            defaultValue: 0,
        },
        value: {
            type: DataTypes.INTEGER,   // corrected from STRING to INTEGER
            allowNull: false,
            defaultValue: 0,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            get() {
                const value = this.getDataValue('created_at');
                return value
                    ? value.toLocaleString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                      }).replace(/,/, '').replace(/(\d+)\/(\d+)\/(\d+) (\d+:\d+:\d+)/, '$3-$1-$2 $4')
                    : null;
            },
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            get() {
                const value = this.getDataValue('updated_at');
                return value
                    ? value.toLocaleString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                      }).replace(/,/, '').replace(/(\d+)\/(\d+)\/(\d+) (\d+:\d+:\d+)/, '$3-$1-$2 $4')
                    : null;
            },
        },
    },
    {
        sequelize,
        modelName: 'Point',
        tableName: 'points',
        underscored: true,
        timestamps: true,
    }
);

// Define associations
Point.associate = (models) => {
    Point.belongsTo(models.Shop, {
        foreignKey: 'shop_id',
        as: 'shop',
    });
};

module.exports = Point;
