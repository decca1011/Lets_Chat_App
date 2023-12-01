document.addEventListener('DOMContentLoaded', async () => {
  // Retrieve token and chat messages from local storage
  const token = localStorage.getItem('token');
  const chatString = localStorage.getItem('message');
  const chatArray = JSON.parse(chatString);

  // Check if the user is signed in
  if (!token) {
     return alert('Error: Please sign in again');
  }

  console.log(chatArray , chatString ,'=============')
 
  if (chatArray && chatArray.length > 0) {
     await displayChats(chatArray);
    try {
       const lastChatItemId = chatArray[chatArray.length - 1].chat_id;
       const response = await axios.get(`${baseUrl}/chat/${lastChatItemId}`, {
          headers: {
             Authorization: `MyAuthHeader ${token}`,
          },
       });
       const { formattedNewMessages } = response.data;

       // Update local storage with new messages
       localStorage.setItem('message', JSON.stringify(formattedNewMessages));

       // Display new messages
       displayChats(formattedNewMessages);
    } catch (err) {
       console.log('Error getting chat list:', err);
    }
  }
     // If there are no existing chats, fetch and display messages
    else {
      try {
         const response = await axios.get(`${baseUrl}/chat/getMessages`, {
            headers: {
               Authorization: `MyAuthHeader ${token}`,
            },
         });
         const { formattedChats } = response.data;

         // Update local storage with new messages
         localStorage.setItem('message', JSON.stringify(formattedChats));

         // Display new messages
         displayChats(formattedChats);
      } catch (error) {
         console.log('Error getting chat list:', error);
      }
   }

   const maxChatsToStore = 10;

   // Check if the length of chatArray exceeds the maximum allowed chats
   if (chatArray.length > maxChatsToStore) {
      // Use slice to extract the recent maxChatsToStore elements
      const trimmedChats = chatArray.slice(-maxChatsToStore);
   
      // Update local storage with the trimmed array
      localStorage.setItem('message', JSON.stringify(trimmedChats));
   }
   

  });

// Function to display chat messages in the UI
function displayChats(chats) {
  const chatList = document.getElementById('messages');
  chats.forEach(chat => {
     const messageElement = document.createElement('li');
     messageElement.textContent = `${chat.userName}: ${chat.ChatMessage}`;
     // Add styling based on whether the message belongs to the current user
     if (chat.currentUser) {
        messageElement.classList.add('right');
     } else {
        messageElement.classList.add('left');
     }
     // Append the message element to the chat list
     chatList.appendChild(messageElement);
  });
}

// Uncomment the setInterval code if you want to periodically fetch new messages
// setInterval(async () => {
//    // Your code for fetching and displaying new messages goes here
// }, 5000); // Fetch new messages every 5 seconds

  
 