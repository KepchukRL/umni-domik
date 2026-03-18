const { Sequelize, DataTypes, Op } = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database/smart_home.db'),
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  }
});

// Импорт моделей
const User = require('./User')(sequelize, DataTypes);
const Widget = require('./Widget')(sequelize, DataTypes);
const UserWidget = require('./UserWidget')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);

// Определение связей
User.hasMany(UserWidget, { foreignKey: 'user_id', as: 'widgets' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

UserWidget.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserWidget.belongsTo(Widget, { foreignKey: 'widget_id', as: 'widget' });

Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Widget,
  UserWidget,
  Notification,
  Op
};