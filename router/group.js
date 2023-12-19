const express = require('express');

const router = express.Router();

 // Import middleware if needed
const Authenticated = require('../middleware/authMiddleware.js');

const groupController =  require('../controller/createGroup');
const showGroup =  require('../controller/getGroup.js');


router.get('/addMember', Authenticated ,groupController.getMember);

router.post('/GroupDetail', Authenticated , groupController.createGroup);

router.get('/GroupDetail/get-groups', Authenticated ,showGroup.getGroup);

router.get('/GroupDetail/get-groups/chat/:groupId', Authenticated ,showGroup.getMessage);

router.get('/GroupDetail/get-groups/newchat/:groupId/:lastChatItemId', Authenticated ,showGroup.getNewMessage);

router.post('/GroupDetail/post-groups/chat/', Authenticated ,showGroup.addChatMessage);



module.exports = router ;