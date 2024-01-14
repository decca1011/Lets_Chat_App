const User = require('../../models/user');
const groupDetail = require('../../models/groupDetail');
const groupMember = require('../../models/groupMember')
const { Sequelize, Op } = require('sequelize');
const { response } = require('express');

const showUserListforAdminToadd = async (req ,res) => {
  const groupId = req.params.groupId;
  const user_id = req.user.user_id;
 try {
  const isAdmin = await groupMember.findOne({
    attributes: ['isAdmin'],
    where: {
      GroupDetailGroupId: groupId,
      UserUserId: user_id,
    },
  });

  console.log(isAdmin?.isAdmin)
  if (isAdmin?.isAdmin) {
    // If the user is an admin, fetch all non-admin members
    const nonGroupUser = await User.findAll({
      attributes: ['user_id', 'user_name', 'user_email_id'],
      where: {
        user_id: {
          [Sequelize.Op.notIn]: Sequelize.literal(
            `(SELECT UserUserId FROM groupmembers WHERE GroupDetailGroupId = ${groupId})`
          )
        }
      }
    })
  console.log(nonGroupUser)
    if (nonGroupUser.length > 0) {
           res.status(200).json({ message: 'User is an admin', getUserList: nonGroupUser });
    } else {
      console.log(user_id)
      res.status(200).json({ message: 'User is an admin', getUserList: null });
    }
  } else {
    console.log(isAdmin);
    res.status(400).json({ message: 'User is not an admin' });
  }

}
catch(error) {

      console.error('Error retrieving users:', error);
    }
  };

  const addMemberInGroup = async (req, res) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const userIDs = req.body.users_id.map(id => parseInt(id));
  
      const groupMembers = userIDs.map(userId => {
        return {
          isAdmin: false,
          UserUserId: userId,
          GroupDetailGroupId: groupId,
        };
      });
  
      const createdMembers = await groupMember.bulkCreate(groupMembers);
  
      console.log('Added to group', createdMembers);
      res.status(200).json({ message: 'Members added to group', addedMembers: createdMembers });
    } catch (error) {
      console.error('Error adding members to group:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
const getNonAdminMember = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const user_id = req.user.user_id;

    const isAdmin = await groupMember.findOne({
      attributes: ['isAdmin'],
      where: {
        GroupDetailGroupId: groupId,
        UserUserId: user_id,
      },
    });

    if (isAdmin?.isAdmin) {
      // If the user is an admin, fetch all non-admin members
      const nonAdminMembers = await groupMember.findAll({
        attributes: ['UserUserId'],
        where: {
          GroupDetailGroupId: groupId,
          isAdmin: false,
        },
      });

      console.log(nonAdminMembers)
      if (nonAdminMembers.length > 0) {
        const nonAdminUserIds = nonAdminMembers.map((member) => member.UserUserId);
        const nonAdminUsers = await getMemberDetails(nonAdminUserIds);

        res.status(200).json({ message: 'User is an admin', getUserList: nonAdminUsers });
      } else {
        res.status(200).json({ message: 'User is an admin', getUserList: null });
      }
    } else {
    //  console.log(isAdmin);
      res.status(400).json({ message: 'User is not an admin' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getMemberDetails = async (nonAdminUserIds) => {
  try {
    const users = await User.findAll({
      attributes: ['user_id', 'user_name'],
      where: {
        user_id: {
          [Sequelize.Op.in]: nonAdminUserIds,
        },
      },
    });

    return users.map(({ user_id, user_name }) => ({ user_id, user_name }));
  } catch (error) {
    console.error('Error in getMemberDetails:', error);
    throw error;
  }
};

const makeAdmin = async (req, res) => {
  const groupId = req.params.groupId;
  //const user_id = req.user.user_id;
  const userIDs = req.body.users_id.map(id => parseInt(id));

  try {
    const nonAdminMembers = await Promise.all(userIDs.map(async (memberId) => {
      return await groupMember.update(
        { isAdmin: true },
        {
          where: {
            GroupDetailGroupId: groupId,
            UserUserId: memberId,
          },
        }
      );
    }));

    const updatedRows = nonAdminMembers.reduce((acc, rows) => acc + rows[0], 0);
    console.log(`Number of updated rows: ${updatedRows}`);
    res.status(200).json({ message: 'Successfully updated members to admin' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const removeUser = async (req , res) => {
  const groupId = req.params.groupId;
  //const user_id = req.user.user_id;
  const userIDs = req.body.users_id.map(id => parseInt(id));

  try {
    const removeGroupUser= await Promise.all(userIDs.map(async (memberId) => {
      return await groupMember.destroy(
        {
          where: {
            GroupDetailGroupId: groupId,
            UserUserId: memberId,
          },
        }
      );
    }));

    const updatedRows = removeGroupUser.reduce((acc, rows) => acc + rows[0], 0);
    console.log(`Number of deleted rows: ${updatedRows}`);
    res.status(200).json({ message: 'Successfully remove by admin' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


module.exports = {
 showUserListforAdminToadd ,addMemberInGroup,  getNonAdminMember , makeAdmin ,removeUser
}

