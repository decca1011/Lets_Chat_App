const express = require('express');
const cors = require('cors');
const path = require('path');
const  fs = require('fs')
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
const app = express();  
const io = require('socket.io')(app.listen(3000), {
    cors: true
}); 

app.use(cors({
    origin: "http://localhost:3000", // Allowed origin
    origin: "*", // Allowed origin
    methods: ["GET","POST"], // Allowed HTTP methods
    credentials: true // Whether the request can include user credentials like cookies, authorization headers, or TLS client certificates.
}));

const sequelize = require('./util/database');

require('dotenv').config();
 
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
const accessLogStream = fs.createWriteStream(path.join(__dirname,'acess.log'),{flag: 'a'})

//app.use(helmet());

app.use(morgan('combined', {stream: accessLogStream}) );

app.use(function(req ,res){
    console.log(req.url)
    res.sendFile(path.join(__dirname, 'Public', req.url));
    
     });

// Start the server on port 3000
sequelize.sync()
.then(() => {
    app.listen( process.env.PORT, () => {
        console.log('Server is running on port 3000');
    });
})
.catch(err => console.log(err));

io.on('connection', socket => {
    socket.on('user-join', (data) => {
        console.log(`User joined: ${data.user}`);
    });
    // Send the socket ID to the connected client
    socket.emit('socket-id', { socketId: socket.id });

    // Broadcast to other clients that a new user has joined
    socket.broadcast.emit('user-join', { user: 'System', body: `${socket.id} joined the chat!`, event: 'user-join' });

    socket.on('send-message', (data) => {
        console.log("ssss====>" ,data)
        io.emit('receive-message', data);
    });
    socket.on('send-file', (data) => {
        io.emit('receive-file', data);
    });
    socket.on('newMember', (data => {
        io.emit('addNewUser', data);
    }))
    socket.on('setAdmin', (data => {
        io.emit('setAdmin', data);
    }))
    socket.on('removeMember', (data => {
        io.emit('removeMember', data);
    }))
    socket.on('setMessagefalse', (data => {
        io.emit('setMessagefalse', data);
    }))

});

