const User = require('../models/user');
const Chats = require('../models/chat');
const sequelize = require('../util/database');

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

module.exports = {
  addChatMessage,
};
