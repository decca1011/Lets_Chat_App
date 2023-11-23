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
       await axios.post(`${baseUrl}/post_chat/Data`, messageBody, {
         headers: {
           Authorization: `MyAuthHeader ${token}`
         }
       });
 
       // Clear the input field after sending the message
       document.getElementById('message-input').value = '';
     }
   } catch (err) {
     // Handle errors more gracefully, show user-friendly messages
     console.error('Error sending message:', err);
     alert('Error sending message. Please try again.');
   }
 };
 