const sendChat = async (event) => {
   event.preventDefault();
   const token = localStorage.getItem('token');
   const  groupId = JSON.parse(localStorage.getItem('currentGroupDetail')).groupId
   const messageInput = document.getElementById('messageInput').value.trim();
   if (messageInput === '') {
    console.log(messageInput)
     return alert("Please enter a message");
   } 
   const messageBody = {
    "groupId": groupId,
    "chatMessage": messageInput,
     // Add other user details or any additional data you want to send
   }; 
   try {
     if (token) {
       await axios.post(`${baseUrl}/group/GroupDetail/post-groups/chat/`, messageBody, {
         headers: {
           Authorization: `MyAuthHeader ${token}`
         }
       });
       // Clear the input field after sending the message
       document.getElementById('messageInput').value = '';
     }
   } catch (err) {
     // Handle errors more gracefully, show user-friendly messages
     console.error('Error sending message:', err);
   //  alert('Error sending message. Please try again.');
   }
 };
 