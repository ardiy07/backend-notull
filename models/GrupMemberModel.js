module.exports = (sequelize, DataTypes) => {
    const GrupMember = sequelize.define('GrupMember', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        id_card_grup: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            references: {
                model: {
                    tableName: 'cards_grup'
                },
                key: 'id',
            },
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            references: {
                model: {
                    tableName: 'users'
                },
                key: 'id',
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {
        tableName: 'grup_members'
    });
    return GrupMember;
};