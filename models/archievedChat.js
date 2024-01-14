// archivedChat.js

const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ArchivedChat = sequelize.define('ArchivedChat', {
  chat_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  ChatMessage: Sequelize.STRING,
  caption: Sequelize.STRING,
  imageName: Sequelize.STRING,
});

module.exports = ArchivedChat;
