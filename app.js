const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const app = express();
require('dotenv').config();

const { CronJob } = require('cron');
const { ArchiveChats } = require('./services/archived-chat'); 

const io = require('socket.io')(app.listen(process.env.PORT), { cors: true}); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({
    origin: "http://localhost:3000", // Allowed origin
    origin: "*", // Allowed origin
    methods: ["GET","POST"], // Allowed HTTP methods
    credentials: true // Whether the request can include user credentials like cookies, authorization headers, or TLS client certificates.
}));

const sequelize = require('./utils/database');

const userLogin= require('./routes/user'); 
const chatAdd= require('./routes/chat');
const groupList= require('./routes/group');

const User  = require('./models/user');
const Chat = require('./models/chat');
const GroupDetail = require('./models/group-detail');
const GroupMember = require('./models/group-member');
 
app.use('/post', userLogin);  // Use the User_Login router for the '/post' route
app.use('/chat', chatAdd);
app.use('/group', groupList);


User.hasMany(Chat);  
Chat.belongsTo(User);


User.belongsToMany(GroupDetail, { through: GroupMember });  //one user hve many group & group contain many group member. 
GroupDetail.belongsToMany(User, { through: GroupMember});


GroupDetail.hasMany(Chat);  // one message belong to on particular group and one group can have multiple message.
Chat.belongsTo(GroupDetail);


const archiveChatJob = new CronJob(    // Define the archiving cron job
    '*/1 * * * *', 
    ArchiveChats,
    null,
    true,
    'UTC'
  );

 archiveChatJob.start();
 

app.use(compression());   // Use compression middleware

app.use(function(req ,res){res.sendFile(path.join(__dirname, 'Public', req.url)); });

 
sequelize.sync()
.then(() => {
    app.listen( () => {
        console.log(`Server is running on port ${process.env.PORT}` );
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
        socket.emit('image', { bytes: data.bytes, fileName: data.fileName, user: data.user, type: 'image' });
        socket.broadcast.emit('image', { bytes: data.bytes, fileName: data.fileName, user: data.user, type: 'image' });
    });

});











// const accessLogStream = fs.createWriteStream(path.join(__dirname,'acess.log'),{flag: 'a'})
//app.use(helmet());
// app.use(morgan('combined', {stream: accessLogStream}) );


// socket.on('newMember', (data => {
//     io.emit('addNewUser', data);
// }))
// socket.on('setAdmin', (data => {
//     io.emit('setAdmin', data);
// }))
// socket.on('removeMember', (data => {
//     io.emit('removeMember', data);
// }))
// socket.on('setMessagefalse', (data => {
//     io.emit('setMessagefalse', data);
// }))