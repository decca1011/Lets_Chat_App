const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const sequelize = require('../util/database');
const { use } = require('../router/user');

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

if(err.name === 'SequelizeUniqueConstraintError') {
     const field = err.errors[0].path;
     const value = err.errors[0].value;
let errorMessage;
     if(field ==='user_email_id'){
    errorMessage = 'Email address is already in use.';

}
else if (field === 'user_mobile_no') {
    errorMessage = 'Mobile number is already in use.';
} else {
    errorMessage = 'Duplicate entry error.';
}

    // Send a custom response for duplicate entry
    res.status(400).json({ error: errorMessage });

        
}
else {
  // Log the error and send a 500 Internal Server Error response
  console.error('Error in adding user:', err.errors);
  res.status(500).json({ error: 'Failed to add user' });
}
      
}
};

const UserLogin = async (req, res, next) => {
    // Destructuring email and password from the request body
    const { email, password } = req.body;

    try {
        // Finding user by email in the database
        const user = await User.findOne({ where: { user_email_id: email } });

        if (user) {
            // Comparing the provided password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, user.user_password);

            if (passwordMatch) {
                // Generating a token for successful login
                const token = generateToken(user.user_id, user.username, user.user_email_id);

                // Sending a success response with the generated token
                res.status(200).json({ success: true, message: 'User Login Successful', token: token });
            } else {
                // Sending an error response for invalid password
                res.status(401).json({ success: false, message: "User not authorized" });
            }
        } else {
            // Sending an unauthorized response if the user is not found
            res.status(404).json({ success: false, message: "User Not Found" });
        }
    } catch (err) {
        // Logging and sending a server error response in case of an exception
        console.log(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


module.exports = {
    createUserController,
    UserLogin
};
