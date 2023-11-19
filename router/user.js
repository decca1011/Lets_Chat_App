const express = require('express');
const UserController =  require('../controller/user')

// Import middleware if needed
// const Authenticated = require('../Middleware/Auth_Middleware');

const router = express.Router();
 
router.post('/Data', UserController.createUserController)
router.post('/SignIn', UserController.UserLogin)
// router.get('/Data/:id', UserController.getUserById);
module.exports = router;
