const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Chat = sequelize.define('chat', {
 chatId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  chatMessage: Sequelize.STRING,
  caption:Sequelize.STRING,
  imageName: Sequelize.STRING,
});

module.exports = Chat;