const Sequelize = require('sequelize');
const sequelize = require('../utils/database')
// Define the 'User' model
const User = sequelize.define('user', {  
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
    name: Sequelize.STRING,
       email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true 
        },
    },
    password: Sequelize.STRING,
     mobileNo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isMobilePhone: true  
        },
    }
});

module.exports = User;
