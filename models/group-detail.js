const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const GroupDetail = sequelize.define('group-detail', {
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
