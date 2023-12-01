const User = require('../models/user');
const Chats = require('../models/chat');
const sequelize = require('../util/database');
const Sequelize = require('sequelize')

const addChatMessage = async (req, res) => {
  try {
    const id = req.user.user_id
    console.log(id)
    const chatMessage = req.body.body; // Fixed variable name (ChatMessage to chatMessage)
// console.log(id ,req.body)
    await Chats.create({
      ChatMessage: chatMessage,
      UserUserId: id,
    });

    res.status(201).json({ message: 'Chat message added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const  getAllChats = async (req, res , next ) => {
  try {
   
    const userId = req.user.user_id;
     // Assuming you have a Chats model defined with Sequelize
 
     const chats = await Chats.findAll({
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
  console.log(lastChatItemId, "<<>>==========>");
  try {
    const newMessages = await Chats.findAll({
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
    
    console.log(formattedNewMessages)
    res.status(200).json({formattedNewMessages});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addChatMessage,
  getAllChats,
  getNewMessage
};

