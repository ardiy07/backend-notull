'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Role = require('./RoleModel')(sequelize, Sequelize);
db.User = require('./UserModel')(sequelize, Sequelize);
db.Grup = require('./GrupModel')(sequelize, Sequelize);
db.CardGrup = require('./CardGrupModel')(sequelize, Sequelize);
db.GrupMember = require('./GrupMemberModel')(sequelize, Sequelize);
db.Board = require('./BoardModel')(sequelize, Sequelize);
db.Card = require('./CardModel')(sequelize, Sequelize);
db.Label = require('./LabelModel')(sequelize, Sequelize);
db.Color = require('./ColorModel')(sequelize, Sequelize);
db.Task = require('./TaskModel')(sequelize, Sequelize);

// User and Role
db.Role.hasMany(db.User, {
  foreignKey: 'role_id',
  as: 'users',
  sourceKey: 'id'
});

db.User.belongsTo(db.Role, {
  foreignKey: 'role_id',
  as: 'roles',
  sourceKey: 'id'
});
// End User and Role

// Grup and Card Grup
db.Grup.hasMany(db.CardGrup, {
  foreignKey: 'id_grup',
  as: 'card_grup',
  sourceKey: 'id'
});

db.CardGrup.belongsTo(db.Grup, {
  foreignKey: 'id_grup',
  as: 'grup',
  sourceKey: 'id'
})
// End Grup and Card Grup

// Member and Card
db.CardGrup.hasMany(db.GrupMember, {
  foreignKey: 'id_card_grup',
  as: 'members',
  sourceKey: 'id'
});

db.GrupMember.belongsTo(db.CardGrup,{
  foreignKey: 'id_card_grup',
  as: 'cardgrup',
  sourceKey: 'id'
});
// End Member and Card

// Member and User
db.User.hasMany(db.GrupMember, {
  foreignKey: 'id_user',
  as: 'members',
  sourceKey: 'id'
});

db.GrupMember.belongsTo(db.User, {
  foreignKey: 'id_user',
  as: 'users',
  sourceKey: 'id'
});
// End Member and user

// CardGrup and Board
db.CardGrup.hasMany(db.Board, {
  foreignKey: 'id_card_grup',
  as: 'boards',
  sourceKey: 'id'
});

db.Board.belongsTo(db.CardGrup, {
  foreignKey: 'id_card_grup',
  as: 'cardgrups',
  sourceKey: 'id'
});
// End CardGrup and Board

// Board and Card
db.Board.hasMany(db.Card, {
  foreignKey: 'id_board',
  as: 'cards',
  sourceKey: 'id'
});

db.Card.belongsTo(db.Board, {
  foreignKey: 'id_board',
  as: 'boards',
  sourceKey: 'id'
});
// End Board and Card

// Card and Label
db.Card.hasMany(db.Label, {
  foreignKey: 'id_card',
  as: 'labels',
  sourceKey: 'id'
});

db.Label.belongsTo(db.Card, {
  foreignKey: 'id_card',
  as: 'cards',
  sourceKey: 'id'
});
// End Card and Label

// Label and Color
db.Color.hasMany(db.Label, {
  foreignKey: 'id_color',
  as: 'labels',
  sourceKey: 'id'
});

db.Label.belongsTo(db.Color, {
  foreignKey: 'id_color',
  as: 'colors',
  sourceKey: 'id'
});
// End Label anc Color

// Card and Task
db.Card.hasMany(db.Task, {
  foreignKey: 'id_card',
  as: 'tasks',
  sourceKey: 'id'
});

db.Task.belongsTo(db.Card, {
  foreignKey: 'id_card',
  as: 'cards',
  sourceKey: 'id'
});
// End Card and Task

module.exports = db;
