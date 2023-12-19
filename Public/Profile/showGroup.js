const getGroupButton = document.getElementById("some");
const chatContainer = document.getElementById('chat-container')
  const callGrp = async (event) => {
   event.preventDefault();
   try {
      const token = localStorage.getItem('token');
      // console.log('Token:', token);

      const  grp_info = await axios.get(`${baseUrl}/group/GroupDetail/get-groups`, {
         headers: {
            Authorization: `MyAuthHeader ${token}`,
         },
      });
     console.log(grp_info.data.getGroup) 
var groups = document.getElementById('groups')
     var data = grp_info.data.getGroup.flat();
     if (Array.isArray(data)) {
      getGroupButton.style.display = "none";
      data.forEach((group) => {
         const button = document.createElement("button");
         button.id = group.groupId;
         button.innerHTML = group.groupName;
         button.addEventListener("click", (event) => {
            const currentGroupDetail = {
               groupId: group.groupId,
               groupName: group.groupName
             };
             localStorage.removeItem('grpMessage')
             localStorage.setItem('currentGroupDetail', JSON.stringify(currentGroupDetail));
             
            fetchGroup(event,group);
        });
         groups.appendChild(button);
      });
   } else {
      // Handle the case when data is not an array
      console.error("Error: Data is not an array");
   }

   } catch (err) {
 document.getElementById("error").innerHTML = "<span style='color: red;'>"+ "Oops! no group found</span>"
     console.log(err, "in Dom to load group information");
   }
 };

 async function fetchGroup(event, group) {
   chatContainer.style.display = 'block';
   event.preventDefault();
   const { groupId, groupName } = group;
   document.getElementById("grpName").innerHTML = "<span style='color: Black;'>" + groupName + " </span>";
   console.log(groupName);
 
   try {
     // Retrieve token and chat messages from local storage
     const token = localStorage.getItem('token');
     const chatString = localStorage.getItem('grpMessage');
     const chatArray = JSON.parse(chatString) || [];
 
     // Clear existing messages in the UI
     clearChatDisplay();
 
     // Check if the user is signed in
     if (!token) {
       return alert('Error: Please sign in again');
     }
 
     // Fetch and display messages for the selected group
     try {
       const response = await axios.get(`${baseUrl}/group/GroupDetail/get-groups/chat/${groupId}`, {
         headers: {
           Authorization: `MyAuthHeader ${token}`,
         },
       });
       const { formattedChats } = response.data;
 
       // Update local storage with new messages
       localStorage.setItem('grpMessage', JSON.stringify(formattedChats));
 
       // Display new messages
       displayChats(formattedChats);
     } catch (error) {
       console.log('Error getting chat list:', error);
     }
 
     // Trim the chat array if needed
     const maxChatsToStore = 10;
     if (chatArray.length > maxChatsToStore) {
       const trimmedChats = chatArray.slice(-maxChatsToStore);
       localStorage.removeItem('grpMessage');
       localStorage.setItem('grpMessage', JSON.stringify(trimmedChats));
     }
   } catch (error) {
     console.log(error, "in Dom to load group information");
   }
 }
 
 // Function to clear existing messages in the UI
 function clearChatDisplay() {
   const chatList = document.getElementById('messages');
   while (chatList.firstChild) {
     chatList.removeChild(chatList.firstChild);
   }
 }
 

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
    
      // Function to periodically check for new messages
      const checkForNewMessages = async () => {
       const token = localStorage.getItem('token');
       const chatString = localStorage.getItem('message');
       const chatArray = JSON.parse(chatString);
       const  groupId = JSON.parse(localStorage.getItem('currentGroupDetail')).groupId
       // Check if the user is signed in
       if (!token) {
          return alert('Error: Please sign in again');
       }
     //   console.log(chatArray , chatString ,'=============')
       if (chatArray && chatArray.length > 0) {
     
         try {
            const lastChatItemId = chatArray[chatArray.length - 1].chat_id;
            const response = await axios.get(`${baseUrl}/group/GroupDetail/get-groups/newchat/${groupId}/${lastChatItemId}`, {
               headers: {
                  Authorization: `MyAuthHeader ${token}`,
               },
            });
            const { formattedNewMessages } = response.data;
            // Update local storage with new messages
              // Add new messages to the existing array
console.log(formattedNewMessages)
              if (formattedNewMessages.length > 0) {
               // Update local storage with new messages
               const updatedChats = [...chatArray, ...formattedNewMessages];
               localStorage.setItem('grpMessage', JSON.stringify(updatedChats));
             
               // Display new messages
              // displayChats(formattedNewMessages);
             }
 
         } catch (err) {
            console.log('Error getting chat list:', err);
         }
       }
         
    }
   
     // Set up an interval to check for new messages every 5 seconds (adjust as needed)
  const messageCheckInterval = setInterval(checkForNewMessages, 5000);
