const jwt = require('jsonwebtoken');
const User = require('../models/user')
const JWT_SECRET = process.env.JWT_SECRET;

const Authenticated = async ( req, res , next ) => {
try {
   const customAuthorization = req.header('Authorization');
   console.log(req.body)

   if(!customAuthorization || !customAuthorization.startsWith('MyAuthHeader')) {
      return res.status(401).send({message: 'Unauthorized '});
   }

   const token = customAuthorization.split(" ")[1];  //  

const user = jwt.verify( token , JWT_SECRET);
// console.log(user, '======>')
 const foundUser = await User.findByPk(user.id);

//   console.log( foundUser.dataValues,"=======================")
 if (!foundUser){
   console.log('not found')
   return res.status(401).json({ message: 'Authentication failed: User not found' });
 }
 req.user = foundUser;

// console.log(req.user)
 
 next();
} 
catch (err) {
   console.log(err)
}
 }

 module.exports = Authenticated;


 