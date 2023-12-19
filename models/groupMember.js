const Sequelize = require("sequelize");
const sequelize = require('../util/database');

const GroupMembers = sequelize.define("groupMembers", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
   isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  }
});

module.exports = GroupMembers;
