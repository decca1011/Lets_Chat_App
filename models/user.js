const Sequelize = require('sequelize');
const sequelize = require('../util/database')


// Define the 'User' model
const User = sequelize.define('User', {
    // Primary key with auto-increment
    user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    
    // User's username
    user_name: Sequelize.STRING,

    // User's email address
    user_email_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true // Validate that the email is in the correct format
        },
    },

    // User's password
    user_password: Sequelize.STRING,

    // User's mobile number
    user_mobile_no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    }
});

// Sync the model with the database
// sequelize.sync({ force: true }); // Uncomment this line if you want to force sync and recreate the table

module.exports = User;
