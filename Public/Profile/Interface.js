
document.addEventListener("DOMContentLoaded", function () {
    const usersContainer = document.getElementById("users");
    const messagesContainer = document.getElementById("messages");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");

    // Mock data, replace with your actual user data from the backend
    const currentUser = { username: "User1" };
    const onlineUsers = [{ username: "User2" }, { username: "User3" }];

    // Function to display a new message in the chat
    function displayMessage(message) {
        const li = document.createElement("li");
        li.textContent = message;
        messagesContainer.appendChild(li);
    }

    // Function to display online users
    function displayOnlineUsers() {
        usersContainer.innerHTML = "";
        onlineUsers.forEach(use=> {
            const li = document.createElement("li");
            li.textContent = use.username;
            usersContainer.appendChild(li);
        });
    }

    // Display online users when the page loads
    displayOnlineUsers();

    // Event listener for the send button
    sendButton.addEventListener("click", function () {
        const message = messageInput.value;
        if (message.trim() !== "") {
            // For simplicity, just display the message locally
            displayMessage(`${currentUser.username}: ${message}`);
         
            const messageBody = {
                sender_id: 1,
                message: message
            }
            console.log(messageBody)   
          axios.post(`${baseUrl}/post_chat/Data`, messageBody);
            messageInput.value = "";
        }
    });
});