const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');

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
const Group_List= require('./router/group');

const user  = require('./models/user');
const chat = require('./models/chat');
const groupDetail = require('./models/groupDetail');
const groupMember = require('./models/groupMember');

// Use the User_Login router for the '/post' route
app.use('/post', User_Login);
app.use('/chat', Chat_Add);
app.use('/group', Group_List);

app.use(function(req ,res){
console.log(req.url)
res.sendFile(path.join(__dirname, 'Public', req.url));
});
//user has many chat where chat belong to one user
user.hasMany(chat);
chat.belongsTo(user);

//one user hve many group & group contain many group member. 
user.belongsToMany(groupDetail, { through: groupMember });
groupDetail.belongsToMany(user, { through: groupMember});

// one message belong to on particular group and one group can have multiple message.
groupDetail.hasMany(chat);
chat.belongsTo(groupDetail);

// Use compression middleware
app.use(compression());

// Start the server on port 3000
sequelize.sync()
.then(() => {
    app.listen( process.env.PORT || 3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch(err => console.log(err));
