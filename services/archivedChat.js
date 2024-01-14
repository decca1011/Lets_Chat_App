 // chatArchiverService.js
const { Op } = require('sequelize');
const sequelize = require('../util/database');
const Chat = require('../models/chat');
const ArchivedChat = require('../models/archievedChat');

async function archiveChats() {
  try {
    // Get chats older than 1 day
    const oneDayAgo = new Date(new Date() - 24 * 60 * 60 * 1000);
    const chatsToArchive = await Chat.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    });

    // Archive chats
    await ArchivedChat.bulkCreate(chatsToArchive.map((chat) => chat.toJSON()));

    // Delete archived chats from the original Chat table
    await Chat.destroy({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    });

    console.log('Chats archived successfully');
  } catch (error) {
    console.error('Error archiving chats:', error);
  }
}

module.exports = archiveChats;
