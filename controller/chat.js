const User = require('../models/user');
const Chats = require('../models/chat');
const sequelize = require('../util/database');
const Sequelize = require('sequelize')
const multer = require('multer');
const { uploadFileToS3 , GetObjectUrl} = require('../services/uploadAWS');
const crypto = require('crypto');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const addChatMessage = async (req, res) => {
  try {
    const id = req.user.user_id
    const chatMessage = req.body.body; 
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

const  getAllChats = async (req, res ) => {
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
     
      attributes: ['chat_id', 'ChatMessage', 'caption', 'imageName', 'createdAt', 'updatedAt', 'UserUserId'],
    });

    // Map the Sequelize instances to plain JavaScript objects
      const formattedChats = await Promise.all(chats.map(async (chat) => {
        const { chat_id, ChatMessage, caption, imageName, createdAt, updatedAt, User } = chat.dataValues;
      let isCurrentUser = false
      if(chat.UserUserId === userId) isCurrentUser = true;
         // If imageName is not null, fetch the image from AWS
         let imageUrl = null;
         if (imageName) {
           imageUrl = await GetObjectUrl(imageName)
         }
   
         return {
           chat_id,
           ChatMessage,
           caption,
           imageUrl, // Add the imageUrl to the response
           createdAt,
           updatedAt,
           UserUserId: User.user_id,
           userName: User.user_name,
           currentUser: isCurrentUser,
         };
       }));
   
 
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
      },      attributes: ['chat_id', 'ChatMessage', 'caption', 'imageName', 'createdAt', 'updatedAt', 'UserUserId'],
    });
    // Assuming you want to format and send the newMessages as a response
    // const formattedNewMessages = newMessages.map(message => {
    //   const { chat_id, ChatMessage, createdAt, updatedAt, User } = message.dataValues;
    
    //   let isCurrentUser = false;
    //   if (User && User.user_id === userId) {
    //     isCurrentUser = true;
    //   }

  // Map the Sequelize instances to plain JavaScript objects
  const formattedNewMessages = await Promise.all(newMessages.map(async (chat) => {
    const { chat_id, ChatMessage, caption, imageName, createdAt, updatedAt, User } = chat.dataValues;
  let isCurrentUser = false
  if(chat.UserUserId === userId) isCurrentUser = true;
     // If imageName is not null, fetch the image from AWS
     let imageUrl = null;
     if (imageName) {
       imageUrl = await GetObjectUrl(imageName)
       console.log(imageUrl,'===========>nnnxxx')
     }
      return {
        chat_id,
        ChatMessage,
        caption,
        imageUrl, // Add the imageUrl to the response
        createdAt,
        updatedAt,
        UserUserId: User ? User.user_id : null,
        userName: User ? User.user_name : null,
        currentUser: isCurrentUser,
      };
    }));
    res.status(200).json({formattedNewMessages});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const uploadFiles = async (req, res, next) => {
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
      const userId = req.user.user_id; // Replace with the actual user ID
      const chatMessage = 'my image'; // Adjust this based on your requirements
      const caption = req.body.caption;
 
      const postCreate = await Chats.create({
          ChatMessage: chatMessage,
          UserUserId: userId,
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
  addChatMessage,
  getAllChats,
  getNewMessage,uploadFiles
};

