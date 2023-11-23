const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')
const app = express();


const sequelize = require('./util/database');


require('dotenv').config();
 
 
// Enable CORS for all routes
app.use(cors({
    origin: "http://localhost:3000",
    origin: "*",
    methods: ["GET","POST"],
    credentials: true
}));
 
// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Import the User_Login router
const User_Login = require('./router/user');
const Chat_Add= require('./router/chat');

const User = require('./models/user');
const Chats= require('./models/chat');

// Use the User_Login router for the '/post' route
app.use('/post', User_Login);
app.use('/post_chat', Chat_Add)

app.use(function(req ,res, next){
    console.log('url', req.url)
res.sendFile(path.join(__dirname, 'Public', req.url));
});

User.hasMany(Chats);
Chats.belongsTo(User);


// Start the server on port 3000
sequelize.sync()
.then(() => {
    app.listen( process.env.PORT || 3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch(err => console.log(err));