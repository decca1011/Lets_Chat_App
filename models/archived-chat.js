// archivedChat.js

const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const ArchivedChat = sequelize.define('archived-chat', {

  chatMessage: Sequelize.STRING,
  caption: Sequelize.STRING,
  imageName: Sequelize.STRING,
});

module.exports = ArchivedChat;