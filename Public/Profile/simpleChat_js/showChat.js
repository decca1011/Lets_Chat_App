socket.on('connect', () => {
   console.log(`Connected with socket ID: ${socket.id}`);
});

// Separate handling for 'socket-id' event
socket.on('socket-id', (data) => {
   // This line should not be here. It was included by mistake.
   // displayChatsViaSocket({ user: 'System', body: `Connected with socket ID: ${data.socketId}`, event: 'user-join' });
});

// Handling the 'user-join' event
socket.on('user-join', (data) => {
   console.log(`User joined: ${data.user}`);
});


document.addEventListener('DOMContentLoaded', async () => {
   const token = localStorage.getItem('token');
  const chatString = localStorage.getItem('message');
  const chatArray = JSON.parse(chatString);
 
  if (!token)  return alert('Error: Please sign in again');

  if (chatArray && chatArray.length > 0) {
      displayChats(chatArray);
    try {
       const lastChatItemId = chatArray[chatArray.length - 1].chat_id;

       const response = await axios.get(`${baseUrl}/chat/${lastChatItemId}`, { headers: {  Authorization: `MyAuthHeader ${token}` } });

       const { formattedNewMessages } = response.data;
      
      const updatedChats = [...chatArray, ...formattedNewMessages];

       localStorage.setItem('message', JSON.stringify(updatedChats));
   
        displayChats(formattedNewMessages);       // Display new messages

    } catch (err) {  console.log('Error getting chat list:', err)    }

  }
  
    else {                    // If there are no existing chats, fetch and display messages
      try {
         const response = await axios.get(`${baseUrl}/chat/getMessages`, {headers: { Authorization: `MyAuthHeader ${token}`,}, });

         const { formattedChats } = response.data;
         console.log(formattedChats)

          localStorage.setItem('message', JSON.stringify(formattedChats));   // Update local storage with new messages

          displayChats(formattedChats);          // Display new messages

      } catch (error) { console.log('Error getting chat list:', error);}

   }

   const maxChatsToStore = 10;
  
   if (chatArray.length > maxChatsToStore) {                      // Check if the length of chatArray exceeds the maximum allowed chats
      const trimmedChats = chatArray.slice(-maxChatsToStore);    // Use slice to extract the recent maxChatsToStore elements
      localStorage.removeItem('message')                        // Update local storage with the trimmed array
      localStorage.setItem('message', JSON.stringify(trimmedChats)); 
   }
  });

 
function displayChats(chats) {
   const chatList = document.getElementById('messages');

   chats.forEach(chat => {
       const messageElement = document.createElement('li');
       messageElement.textContent = `${chat.userName}: ${chat.ChatMessage}`;

       if (chat.imageUrl) {
           // If imageUrl is not null, create an image element and append it
           const imageElement = document.createElement('img');
           imageElement.src = chat.imageUrl;
           messageElement.appendChild(imageElement);
       }

       if (chat.currentUser) {
           messageElement.classList.add('right');
       } else {
           messageElement.classList.add('left');
       }

       chatList.appendChild(messageElement);
   });
}

     // Function to periodically check for new messages
     const checkForNewMessages = async () => {
      const token = localStorage.getItem('token');
      const chatString = localStorage.getItem('message');
      const chatArray = JSON.parse(chatString);

      if (!token)   return alert('Error: Please sign in again');       // Check if the user is signed in
 
      if (chatArray && chatArray.length > 0) {
    
         try {
            const lastChatItemId = chatArray[chatArray.length - 1].chat_id;

            const response = await axios.get(`${baseUrl}/chat/${lastChatItemId}`, {   headers: { Authorization: `MyAuthHeader ${token}`, }, });

            const { formattedNewMessages } = response.data;
         
            const updatedChats = [...chatArray, ...formattedNewMessages];
      
            localStorage.setItem('message', JSON.stringify(updatedChats));
      
            displayChats(formattedNewMessages);          // Display new messages
           } 
            catch (err) {
            console.log('Error getting chat list:', err);
         }

      }
        
   }
 
 
    // Set up an interval to check for new messages every 5 seconds (adjust as needed)
  //const messageCheckInterval = setInterval(checkForNewMessages, 1000);