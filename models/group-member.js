const Sequelize = require("sequelize");
const sequelize = require('../utils/database');

const GroupMember = sequelize.define("group-members", {
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

module.exports = GroupMember;







