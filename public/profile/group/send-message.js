
socket.on('connect', (data) => {
    console.log(`Connected with socket ID: ${socket.id}`);
});

socket.on('socket-id', (data) => {
    // Display the connected socket ID
    displayChatsViaSocket({ user: 'System', body: `Connected with socket ID: ${data.socketId}`, event: 'user-join' });
});

socket.on('receive-message', (data) => {
    displayChatsViaSocket(data);
});

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

       socket.emit("send-message", { body: messageInput, user: parseJwt(token).name });
       // Clear the input field after sending the message
       document.getElementById('messageInput').value = '';
     }
   } catch (err) {
     // Handle errors more gracefully, show user-friendly messages
     console.error('Error sending message:', err);
   //  alert('Error sending message. Please try again.');
   }
 };
 
 function parseJwt(token) {
   var base64Url = token.split('.')[1];
   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
   var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
   }).join(''));

   return JSON.parse(jsonPayload);
}



  // Function to display chat messages in the UI
function displayChatsViaSocket(data) {
   const chatList = document.getElementById('messages');
   const messageElement = document.createElement('li');

   if (data.event === 'user-join') {
   // Display a message when a new user joins
   messageElement.textContent = `${data.body}`;
   messageElement.classList.add('join-message'); // Add specific styling for join messages
   } else {
       const userName = data.user || 'Unknown User';
       const messageBody = data.body || '';

       messageElement.textContent = `${userName}: ${messageBody}`;

       if (data.user === parseJwt(localStorage.getItem('token')).name) {
           messageElement.classList.add('right'); // Add styling for the current user's messages
       } else {
           messageElement.classList.add('left'); // Add styling for other users' messages
       }
   }

   chatList.appendChild(messageElement);
}

