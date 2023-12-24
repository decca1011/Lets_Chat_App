const User = require('../../models/user');
const groupDetail = require('../../models/groupDetail');
const groupMember = require('../../models/groupMember')
const sequelize = require('../../util/database');
const Sequelize = require('sequelize');

 // createGroup function
const createGroup = async (req, res) => {
   const id = req.user.user_id;
   const groupName = req.body.name;
 
   try {
     const createdGroup = await groupDetail.create({
       creatorId: id,
       groupName: groupName,
     });
 
     const groupId = createdGroup.groupId;
     const groupMembers = req.body.users_id;
 
     var members = [{ isAdmin: true , UserUserId: id , GroupDetailGroupId: groupId }];
 
     for (let i = 0; i < groupMembers.length; i++) {
       var obj = {
        UserUserId: groupMembers[i],
        GroupDetailGroupId: groupId,
       };
       members.push(obj);
     }
//  console.log(members)
     await groupMember.bulkCreate(members, { returning: true });
      res.status(201).json({
       success: true,
       message: `${createGroup.name}group created`,
     });
   } catch (error) {
     console.log(error);
     res.status(500).json({ message: 'Internal Server Error' });
   }
 };
 
const getMember = async (req , res) => {
   try{
      const user_id  = req.user.user_id
      const users = await User.findAll({
         attributes: ['user_id', 'user_name'], 

         where: {
            user_id: {
              [Sequelize.Op.not]: user_id,
            },
          },
      });

getUserList = users.map( ( { dataValues: { user_id, user_name  } })  => ({user_id, user_name}))
      // console.log(getUserList)

    res.status(200).json({ getUserList });

   }
   catch {
      res.status(400).json({ message: 'Bad Request' });
   }
}

module.exports = {
   createGroup,
   getMember
}



