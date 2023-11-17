const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();


const sequelize = require('./util/database');

require('dotenv').config();
 
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(204).send();
});

// Enable CORS for all routes
app.use(cors({
    // origin: "http://localhost:3000",
    origin: "*",
    methods: ["GET","POST"],
    credentials: true
}));
 

// app.use(cors());

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