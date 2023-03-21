module.exports = (sequelize, DataTypes) => {
    const Grup = sequelize.define('Grup', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false,
            validate: {
              notEmpty: true,
            }
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
              notEmpty: true,
              len: [1, 100]
            }
          },
          deskripsi: {
            type: DataTypes.TEXT,
            allowNull: true
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
        tableName: 'grups'
    });
    return Grup;
};