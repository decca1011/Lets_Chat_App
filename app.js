const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const sequelize = require('./util/database');

require('dotenv').config();

// Enable CORS for all routes
app.use(cors());

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Import the User_Login router
const User_Login = require('./router/user');

// Use the User_Login router for the '/post' route
app.use('/post', User_Login);

// Start the server on port 3000
sequelize.sync()
.then(() => {
    app.listen( process.env.PORT || 3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch(err => console.log(err));