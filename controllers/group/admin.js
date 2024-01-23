const User = require('../../models/user');
const GroupMember = require('../../models/group-member')
const { Sequelize, Op } = require('sequelize');
const sequelize = require('../../utils/database');


const showUserListforAdminToadd = async (req ,res) => {
  const groupId = req.params.groupId;
  const userId = req.user.id;
 try {
  const isAdmin = await GroupMember.findOne({
    attributes: ['isAdmin'],
    where: {
      groupDetailGroupId: groupId,
      userId: userId,
    },
  });
  console.log(isAdmin?.isAdmin)

  if (isAdmin?.isAdmin) {
    // If the user is an admin, fetch all non-admin members
    const nonGroupUser = await User.findAll({
      attributes: ['id', 'name', 'email'],
      where: {
        id: {
          [Op.notIn]: sequelize.literal(`(SELECT userId FROM \`group-members\` WHERE groupDetailGroupId = ${groupId})`)
        }
      }
    });
    if (nonGroupUser.length > 0) {
           res.status(200).json({ message: 'User is an admin', getUserList: nonGroupUser });
    } else {
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
          userId: userId,
          groupDetailGroupId: groupId,
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
    const id = req.user.id;

    const isAdmin = await GroupMember.findOne({
      attributes: ['isAdmin'],
      where: {
        userId: id,
        groupDetailGroupId: groupId,
      
      },
    });

    if (isAdmin?.isAdmin) {
      // If the user is an admin, fetch all non-admin members
      const nonAdminMembers = await GroupMember.findAll({
        attributes: ['userId'],
        where: {
          groupDetailGroupId: groupId,
          isAdmin: false,
        },
      });

      console.log(nonAdminMembers)
      if (nonAdminMembers.length > 0) {
        const nonAdminUserIds = nonAdminMembers.map((member) => member.userId);
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
      attributes: ['id', 'name'],
      where: {
        id: {
          [Sequelize.Op.in]: nonAdminUserIds,
        },
      },
    });

    return users.map(({ id, name }) => ({ id, name }));
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
      return await GroupMember.update(
        { isAdmin: true },
        {
          where: {
            groupDetailGroupId: groupId,
            userId: memberId,
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
      return await GroupMember.destroy(
        {
          where: {
            userId: memberId,
            groupDetailGroupId: groupId,
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

