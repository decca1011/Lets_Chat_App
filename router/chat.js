const express = require('express');

const router = express.Router();

 // Import middleware if needed
const Authenticated = require('../middleware/authMiddleware.js');
const ChatController =  require('../controller/chat.js');

router.post('/Data', Authenticated , ChatController.addChatMessage);

router.get('/getMessages', Authenticated , ChatController.getAllChats);

router.get('/:lastChatItemId',Authenticated , ChatController.getNewMessage);

 
router.post('/upload/file', Authenticated,ChatController.uploadFiles)

 

module.exports = router;
