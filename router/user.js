const express = require('express');
const UserController =  require('../controller/User')

// Import middleware if needed
// const Authenticated = require('../Middleware/Auth_Middleware');

const router = express.Router();
 
router.post('/Data', UserController.createUserController)
// router.get('/Data/:id', UserController.getUserById);
module.exports = router;
