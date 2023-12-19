const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const GroupDetail = sequelize.define('GroupDetail', {
   groupId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   creatorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   groupName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
   }
});

module.exports = GroupDetail;
