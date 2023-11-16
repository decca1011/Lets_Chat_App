const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const sequelize = require('../util/database');

// Load environment variables from .env file
dotenv.config();

// Get the JWT secret from environment variables
var JWT_SECRET = process.env.JWT_SECRET;

// Function to generate a JWT token
function generateToken(id, name, email) {
    return jwt.sign({ id: id, name: name, email: email }, JWT_SECRET);
}

var createUserController = async (req, res, next) => {
    // Start a transaction
    const t = await sequelize.transaction();

    try {
        // Extract user data from the request body
        const username = req.body.username;
        const userEmail = req.body.email;
        const password = req.body.password;
        const userMobileNo = req.body.mobile;
        const saltRounds = 10;

        // Check if a user with the given email already exists
        var existingUser = await User.findOne({ where: { user_email_id: userEmail } });

        if (existingUser) {
            // If a user with the same email already exists, handle accordingly
            await t.rollback(); // Rollback the transaction
            res.status(400).json({ error: 'User with this detail already exists' });
            return;
        }

        // Hash the user's password
        const hash = await bcrypt.hash(password, saltRounds);

        // Create a new user in the database within the transaction
        const user = await User.create(
            {
                user_name: username,
                user_email_id: userEmail,
                user_password: hash,
                user_mobile_no: userMobileNo,
            },
            { transaction: t }
        );

        // Generate a JWT token for the newly created user
        const token = generateToken(user.id, user.username, user.user_email_id);

        // Commit the transaction
        await t.commit();

        // Log relevant information (for debugging purposes)
        console.log(`User created successfully. User ID: ${user.id}, Username: ${user.username}`);

        // Send a success response with the generated token
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
        });
    } catch (err) {
        // Rollback the transaction in case of an error
        await t.rollback();

        // Log the error and send a 500 Internal Server Error response
        console.error('Error in adding user:', err);
        res.status(500).json({ error: 'Failed to add user' });
    }
};

module.exports = {
    createUserController
};
