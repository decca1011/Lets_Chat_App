const express = require('express');
const router = express.Router();
const authenticatedMiddleware = require('../middleware/authMiddleware');
const chatController = require('../controllers/chat');


router.post('/data', authenticatedMiddleware, chatController.createChatMessage);

router.get('/messages', authenticatedMiddleware, chatController.getAllChatMessages);

router.get('/:lastChatItemId', authenticatedMiddleware, chatController.getNewChatMessage);

router.post('/upload/file', authenticatedMiddleware, chatController.uploadChatFiles);

module.exports = router;
 
