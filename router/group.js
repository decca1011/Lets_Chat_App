const express = require('express');

const router = express.Router();

 // Import middleware if needed
const Authenticated = require('../middleware/authMiddleware.js');
const groupController =  require('../controller/groupJs/createGroup.js');
const showGroup =  require('../controller/groupJs/getGroup.js');
const groupAdmin = require('../controller/groupJs/groupAdmin.js') 


router.get('/addMember', Authenticated ,groupController.getMember); // fetch list of user
router.post('/GroupDetail', Authenticated , groupController.createGroup); // create group

router.get('/GroupDetail/get-groups', Authenticated ,showGroup.getGroup); //get group 
router.get('/GroupDetail/get-groups/chat/:groupId', Authenticated ,showGroup.getMessage);  //show @start message 
router.get('/GroupDetail/get-groups/newchat/:groupId/:lastChatItemId', Authenticated ,showGroup.getNewMessage);  //search for new message 
router.post('/GroupDetail/post-groups/chat/', Authenticated ,showGroup.addChatMessage); // add message to chat

//Superpowers of the Admin
router.get('/fetchforaddMemberInGroup/:groupId', Authenticated, groupAdmin.showUserListforAdminToadd); // show user list other than current  group member 
router.post('/addMemberInGroup/:groupId', Authenticated, groupAdmin.addMemberInGroup); // add the selected user to group


router.get('/fetchforaddMember/:groupId', Authenticated, groupAdmin.getNonAdminMember);
router.post('/makeAdmin/:groupId', Authenticated , groupAdmin.makeAdmin); // make them admin
router.get('/fetchforRemoveMember/:groupId', Authenticated, groupAdmin.getNonAdminMember);
router.post('/removeUser/:groupId', Authenticated , groupAdmin.removeUser); // remove user from group



module.exports = router ;