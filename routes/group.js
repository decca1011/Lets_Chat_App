const express = require('express');
const router = express.Router();
 
const Authenticated = require('../middleware/authMiddleware.js');
const groupController =  require('../controllers/group/create.js');
const showGroup =  require('../controllers/group/get.js');
const groupAdmin = require('../controllers/group/admin.js') 

router.get('/addMember', Authenticated ,groupController.getMember); // fetch list of user

router.post('/GroupDetail', Authenticated , groupController.createGroup); // create group

router.get('/GroupDetail/get-groups', Authenticated , showGroup.getGroup); //get group 

router.get('/GroupDetail/get-groups/chat/:groupId', Authenticated , showGroup.getMessage);  //show @start message 

router.get('/GroupDetail/get-groups/newchat/:groupId/:lastChatItemId', Authenticated , showGroup.getNewMessage);  //search for new message 

router.post('/GroupDetail/post-groups/chat/', Authenticated , showGroup.addChatMessage); // add message to chat

router.post('/upload/file/:groupId', Authenticated, showGroup.uploadFiles)// add file to chat

//Superpowers of the Admin
router.get('/fetchforaddMemberInGroup/:groupId', Authenticated, groupAdmin.showUserListforAdminToadd); // show user list other than current  group member 
router.post('/addMemberInGroup/:groupId', Authenticated, groupAdmin.addMemberInGroup); // add the selected user to group

router.get('/fetchforaddMember/:groupId', Authenticated, groupAdmin.getNonAdminMember);

router.post('/makeAdmin/:groupId', Authenticated , groupAdmin.makeAdmin); // make them admin

router.get('/fetchforRemoveMember/:groupId', Authenticated, groupAdmin.getNonAdminMember);

router.post('/removeUser/:groupId', Authenticated , groupAdmin.removeUser); // remove user from group


module.exports = router ;