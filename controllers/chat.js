const user = require('../models/user');
const Chats = require('../models/chat');
const Sequelize = require('sequelize')
const multer = require('multer');
const { uploadFileToS3 , GetObjectUrl} = require('../services/file-upload-aws');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const crypto = require('crypto');

const createChatMessage = async (req, res) => {
  try {
    const id = req.user.id
    const chatMessage = req.body.body; 
    await Chats.create({
      chatMessage: chatMessage,
      userId: id,
    });
    res.status(201).json({ message: 'Chat message added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllChatMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId, '====>hhuhhu');
    const chats = await Chats.findAll({
      include: [
        {
          model: user,
          attributes: ['id', 'name'],
        },
      ],
      attributes: ['chatId', 'chatMessage', 'caption', 'imageName', 'createdAt', 'updatedAt', 'userId'],
    });

    // Map the Sequelize instances to plain JavaScript objects
    const formattedChats = await Promise.all(
      chats.map(async (chat) => {
        const { chatId, chatMessage, caption, imageName, createdAt, updatedAt, user } = chat.dataValues;
        console.log(user);
        let isCurrentUser = false;

        if (chat.userId === userId) isCurrentUser = true;

        // If imageName is not null, fetch the image from AWS
        let imageUrl = null;

        if (imageName) {
          imageUrl = await GetObjectUrl(imageName);
        }

        // Use User properties directly without checking for undefined
        return {
          chatId,
          chatMessage,
          caption,
          imageUrl,
          createdAt,
          updatedAt,
          userId: user.id,
          userName: user.name,
          currentUser: isCurrentUser,
        };
      })
    );

    console.log(formattedChats);
    // Send the formattedChats as a JSON response to the frontend
    res.status(200).json({ formattedChats });
  } catch (error) {
    console.error(error);
    // Handle the error, e.g., send an error response to the frontend
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getNewChatMessage = async (req, res, next) => {
  const userId = req.user.id;
  const lastChatItemId = req.params.lastChatItemId;
 
  try {
    const newMessages = await Chats.findAll({
      include: [
        {
          model: user,
          attributes: ['id', 'name'],
        },

      ],
      
      where: {
        chatId: {
          [Sequelize.Op.gt]: lastChatItemId,
        },
      },      attributes: ['chatId', 'chatMessage', 'caption', 'imageName', 'createdAt', 'updatedAt', 'userId'],
    });
    

  // Map the Sequelize instances to plain JavaScript objects
  const formattedNewMessages = await Promise.all(newMessages.map(async (chat) => {
    const { chatId, chatMessage, caption, imageName, createdAt, updatedAt, User } = chat.dataValues;

  let isCurrentUser = false
  if(chat.userId === userId) isCurrentUser = true;
     // If imageName is not null, fetch the image from AWS
     let imageUrl = null;
     if (imageName) {
       imageUrl = await GetObjectUrl(imageName)
       //console.log(imageUrl,'===========>nnn')
     }
      return {
        chatId,
        chatMessage,
        caption,
        imageUrl, // Add the imageUrl to the response
        createdAt,
        updatedAt,
        userId: User ? User.id : null,
        userName: User ? User.name : null,
        currentUser: isCurrentUser,
      };
    }));
    res.status(200).json({formattedNewMessages});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const uploadChatFiles = async (req, res, next) => {
  try {
  
           // Multer middleware for handling file upload
           upload.single('file')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(500).json({ error: err.message });
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(500).json({ error: 'Unknown error occurred.' });
            }
            console.log(req.file)
            // Upload to S3
            const imageName = await uploadFileToS3(req);
 
      // Store file details in the database
      const userId = req.user.id; // Replace with the actual user ID
      const chatMessage = 'my image'; // Adjust this based on your requirements
      const caption = req.body.caption;
 
      const postCreate = await Chats.create({
          chatMessage: chatMessage,
          userId: userId,
          caption: caption,
          imageName: imageName,
      });

      res.status(200).json({ message: 'File uploaded successfully', post: postCreate });
  })
}
catch (error) {
      console.error('Error in controller:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports = {
  createChatMessage,getAllChatMessages,getNewChatMessage,uploadChatFiles
};

