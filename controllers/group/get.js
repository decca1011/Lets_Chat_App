const User = require('../../models/user');
const GroupDetail = require('../../models/group-detail');
const GroupMember = require('../../models/group-member');
const GroupMessages = require('../../models/chat');
const Sequelize = require('sequelize');
const multer = require('multer');
const { uploadFileToS3 , GetObjectUrl} = require('../../services/file-upload-aws');
// const crypto = require('crypto');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const getGroup = async (req, res) => {
  const id = req.user.id;
  try {
    const Memberlist = await GroupMember.findAll(
      { where: { userId: id },
    attributes: ['id', 'isAdmin', 'userId', 'groupDetailGroupId']
      });

      const userGoupDetailGroup= Memberlist.map(member => {
        return member.groupDetailGroupId
      })
    //  console.log(userGoupDetailGroup)

    if (Memberlist.length > 0) {
      // Fetching group details based on GroupDetailGroupId values
      const groupDetails = await GroupDetail.findAll({
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
    const userId = req.user.id;
   console.log( req.body , userId)

    const { groupId, chatMessage } = req.body; 
    
    // Check if the user is a member of the group
    const isMember = await GroupMember.findOne({
      where: { userId: userId, groupDetailGroupId: groupId },
    });

    if (!isMember) {
      return res.status(403).json({ message: 'User is not a member of the group' });
    }

    // Create the chat message
    await GroupMessages.create({
      chatMessage: chatMessage,
      userId:  userId, // Associate the user with the message
      groupDetailGroupId: groupId, // Associate the group with the message
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
    const userId = req.user.id;
     // Assuming you have a Chats model defined with Sequelize 
     const chats = await GroupMessages.findAll({
      where: { groupDetailGroupId: groupId },

      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        
        },
      ],
      attributes: ['chatId', 'chatMessage', 'caption', 'imageName', 'createdAt', 'updatedAt', 'userId'],
   
    });
   // Map the Sequelize instances to plain JavaScript objects
   const formattedChats = await Promise.all(chats.map(async (chat) => {
    const { chatId, chatMessage, caption, imageName, createdAt, updatedAt, user } = chat.dataValues;
  let isCurrentUser = false
  if(chat.userId === userId) isCurrentUser = true;
     // If imageName is not null, fetch the image from AWS
     let imageUrl = null;
     if (imageName) {
       imageUrl = await GetObjectUrl(imageName)
     }

     return {
       chatId,
       chatMessage,
       caption,
       imageUrl, // Add the imageUrl to the response
       createdAt,
       updatedAt,
       userId: User.id,
       name: User.name,
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
  const userId = req.user.id;
  const lastChatItemId = req.params.lastChatItemId;
  const groupId = req.params.groupId;
 
  console.log(lastChatItemId , userId ,groupId)
  try {
    const newMessages = await GroupMessages.findAll({
      where: {
        groupDetailGroupId: groupId,
        chatId: {
          [Sequelize.Op.gt]: lastChatItemId,
        },
      },
      include: [
        {
          model: User,
          attributes: ['userId', 'name'],
        },

      ],
      attributes: ['chatId', 'chatMessage', 'caption', 'imageName', 'createdAt', 'updatedAt', 'UserUserId'],
    });

    console.log(newMessages)
   
  // Map the Sequelize instances to plain JavaScript objects
  const formattedNewMessages = await Promise.all(newMessages.map(async (chat) => {
    const { chatId, chatMessage, caption, imageName, createdAt, updatedAt, user } = chat.dataValues;
  let isCurrentUser = false
  if(chat.userId === userId) isCurrentUser = true;
     // If imageName is not null, fetch the image from AWS
     let imageUrl = null;
     if (imageName) {
       imageUrl = await GetObjectUrl(imageName)
       console.log(imageUrl,'===========>nnnxxx')
     }
      return {
        chatId,
        chatMessage,
        caption,
        imageUrl, // Add the imageUrl to the response
        createdAt,
        updatedAt,
        userId: user ? user.id : null,
        name: user ? user.name : null,
        currentUser: isCurrentUser,
      };
  }));
    res.status(200).json({formattedNewMessages});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const uploadFiles = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    console.log(groupId)
           // Multer middleware for handling file upload
           upload.single('file')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(500).json({ error: err.message });
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(500).json({ error: 'Unknown error occurred.' });
            }
            console.log(req.file,'================>', req.body)
            // Upload to S3
         const imageName = await uploadFileToS3(req);
 
// const imageName = 'scdcdcdc'

      // Store file details in the database
      const userId = req.user.user_id; // Replace with the actual user ID
      const chatMessage = 'my image'; // Adjust this based on your requirements
      const caption = req.body.caption;
     
 
      const postCreate = await GroupMessages.create({
          chatMessage: chatMessage,
          userId: userId,
          caption: caption,
          imageName: imageName,
          groupDetailGroupId: groupId,
      });

      res.status(200).json({ message: 'File uploaded successfully', post: postCreate });
  })
}
catch (error) {
      console.error('Error in controller:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports ={
   getGroup,
   addChatMessage, 
   getMessage,
   getNewMessage, uploadFiles
}