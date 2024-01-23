require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_TABLE, process.env.DATABASE_USER_NAME, process.env.DATABASE_PASSWORD, 
{ dialect: 'mysql',
 host: process.env.DATABASE_HOST,
});

module.exports = sequelize;
