const express = require('express');

const router = express.Router();

 // Import middleware if needed
const Authenticated = require('../middleware/authMiddleware.js');
const ChatController =  require('../controller/chat.js');

router.post('/Data', Authenticated , ChatController.addChatMessage);


// router.get('/getUserDetails', Authenticated.Authenticated, (req, res) => {
//    console.log(req.user);
//    // Send a response to the client or perform other actions as needed
//    res.status(200).json({message:'User details retrieved successfully'});
// });


module.exports = router;
