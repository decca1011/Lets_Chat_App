const sendChat = async (event) => {
   event.preventDefault();
   const token = localStorage.getItem('token');
   const messageInput = document.getElementById('message-input').value.trim();
   if (messageInput === '') {
     return alert("Please enter a message");
   }
 
   const messageBody = {
     "body": messageInput,
     // Add other user details or any additional data you want to send
   };
 
   try {
     if (token) {
       await axios.post(`${baseUrl}/chat/Data`, messageBody, {
         headers: {
           Authorization: `MyAuthHeader ${token}`
         }
       });
 
       // Clear the input field after sending the message
       document.getElementById('message-input').value = '';
      return window.location.reload()
     }
   } catch (err) {
     // Handle errors more gracefully, show user-friendly messages
     console.error('Error sending message:', err);
     alert('Error sending message. Please try again.');
   }
 };
 
 document.addEventListener('DOMContentLoaded',async ()=> {
   const token = localStorage.getItem('token');
   if (token) {
     try {
      const response = await axios.get(`${baseUrl}/chat/getMessages`, {
         headers: {
           Authorization: `MyAuthHeader ${token}`,
         },
       });
      const { formattedChats } = response.data;
       displayChats( formattedChats);
 
   
     }
     catch (err) {
       console.error('Error getting chat list:', err);
   }
   }

 } )


 function displayChats(chats) {
   const chatList = document.getElementById('messages');
   chats.forEach(chat => {
     const messageElement = document.createElement('li');
     messageElement.textContent = `${chat.userName}: ${chat.ChatMessage}`;
     if(chat.currentUser){
      messageElement.classList.add('right');
     }
     else{
      messageElement.classList.add('left');
     }
     chatList.appendChild(messageElement);
   });
 }
 

 setInterval(async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${baseUrl}/chat/getMessages`, {
      headers: {
        Authorization: `MyAuthHeader ${token}`,
      },
    });

    const { formattedChats} = response.data;
    displayChats( formattedChats);
 
  } catch (error) {
    console.error('Error fetching new messages:', error);
  }
}, 1000); // Fetch new messages every 1 second
