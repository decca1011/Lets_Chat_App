const User = require('../../models/user');
const GroupDetail = require('../../models/group-detail');
const GroupMember = require('../../models/group-member')
const sequelize = require('../../utils/database');
const Sequelize = require('sequelize');

 // createGroup function
const createGroup = async (req, res) => {
   const id = req.user.id;
   const groupName = req.body.groupName;
 
   try {
     const createdGroup = await GroupDetail.create({
       creatorId: id,
       groupName: groupName,
     });
 
     //console.log(req.body)
     const groupId = createdGroup.groupId;
     const groupMembers = req.body.selectedIds;
 
     var members = [{ isAdmin: true , userId: id , groupDetailGroupId: groupId }];
 
     for (let i = 0; i < groupMembers.length; i++) {
       var obj = {
        userId: groupMembers[i],
        groupDetailGroupId: groupId,
       };
       members.push(obj);
     }
  console.log(members)
     await GroupMember.bulkCreate(members, { returning: true });
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
      const user_id  = req.user.id
      const users = await User.findAll({
         attributes: ['id', 'name'], 

         where: {
            id: {
              [Sequelize.Op.not]: user_id,
            },
          },
      });

getUserList = users.map( ( { dataValues: { id, name  } })  => ({id, name}))
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



