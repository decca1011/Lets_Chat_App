const User = require('../models/user');
const groupDetail = require('../models/groupDetail');
const groupMember = require('../models/groupMember');
const groupMessages = require('../models/chat');
const Sequelize = require('sequelize');

const getGroup = async (req, res) => {
  const id = req.user.user_id;
  try {
    const Memberlist = await groupMember.findAll(
      { where: { UserUserId: id },
    attributes: ['id', 'isAdmin', 'UserUserId', 'GroupDetailGroupId']
      });

      const userGoupDetailGroup= Memberlist.map(member => {
        return member.GroupDetailGroupId
      })
    //  console.log(userGoupDetailGroup)

    if (Memberlist.length > 0) {
      // Fetching group details based on GroupDetailGroupId values
      const groupDetails = await groupDetail.findAll({
        where: { groupId: userGoupDetailGroup }, // Adjust the condition based on your model
        attributes: ['groupId', 'creatorId', 'groupName'],
      });
  
      const simplifiedGroups = groupDetails.map(group => group.dataValues)

      res.status(201).json({
        success: true,
        getGroup: [simplifiedGroups], // Wrap the simplified group object in an array
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

const addChatMessage = async (req, res) => {
  try {
    const userId = req.user.user_id;
   console.log( req.body ,userId)
    const { groupId, chatMessage } = req.body; // Assuming groupId is sent in the request body
    console.log(chatMessage)
    // Check if the user is a member of the group
    const isMember = await groupMember.findOne({
      where: { UserUserId: userId, GroupDetailGroupId: groupId },
    });

    if (!isMember) {
      return res.status(403).json({ message: 'User is not a member of the group' });
    }

    // Create the chat message
    await groupMessages.create({
      ChatMessage: chatMessage,
      UserUserId:  userId, // Associate the user with the message
      GroupDetailGroupId: groupId, // Associate the group with the message
    });

    res.status(201).json({ message: 'Chat message added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getMessage = async (req , res)  => {
  try {
    const groupId = req.params.groupId;
    console.log(groupId)
    const userId = req.user.user_id;
     // Assuming you have a Chats model defined with Sequelize 
     const chats = await groupMessages.findAll({
      where: { GroupDetailGroupId: groupId },

      include: [
        {
          model: User,
          attributes: ['user_id', 'user_name'],
        
        },
      ],
      attributes: ['chat_id', 'ChatMessage', 'createdAt', 'updatedAt', 'UserUserId'],
   
    });

    // Map the Sequelize instances to plain JavaScript objects
    const formattedChats = chats.map(chat => {
      const { chat_id, ChatMessage, createdAt, updatedAt, User } = chat.dataValues;
      let isCurrentUser = false
      if(chat.UserUserId === userId) isCurrentUser = true;
      return {
        chat_id,
        ChatMessage,
        createdAt,
        updatedAt,
        UserUserId: User.user_id,
        userName: User.user_name,
        currentUser :isCurrentUser
      };
    });
 
    // Send the sortedChats as a JSON response to the frontend
    res.status(200).json({formattedChats});
}
catch (error) {
    console.error(error);
}
}
const getNewMessage = async (req, res, next) => {
  const userId = req.user.user_id;
  const lastChatItemId = req.params.lastChatItemId;
  const groupId = req.params.groupId;
 
  try {
    const newMessages = await groupMessages.findAll({
      where: { GroupDetailGroupId: groupId },
      include: [
        {
          model: User,
          attributes: ['user_id', 'user_name'],
        },

      ],
      
      where: {
        chat_id: {
          [Sequelize.Op.gt]: lastChatItemId,
        },
      },attributes: ['chat_id','ChatMessage', 'createdAt', 'updatedAt', 'UserUserId']
    });
    // Assuming you want to format and send the newMessages as a response
    const formattedNewMessages = newMessages.map(message => {
      const { chat_id, ChatMessage, createdAt, updatedAt, User } = message.dataValues;
    
      let isCurrentUser = false;
      if (User && User.user_id === userId) {
        isCurrentUser = true;
      }
    
      return {
        chat_id,
        ChatMessage,
        createdAt,
        updatedAt,
        UserUserId: User ? User.user_id : null,
        userName: User ? User.user_name : null,
        currentUser: isCurrentUser,
      };
    });
    
    res.status(200).json({formattedNewMessages});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



module.exports ={
   getGroup,
   addChatMessage, 
   getMessage,
   getNewMessage
}