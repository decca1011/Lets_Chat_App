 // Function to handle file upload



 function uploadFile() {
    const token = localStorage.getItem('token');
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

         // Emit the file data to the server using Socket.IO
         socket.emit("send-file", { body: file.name, user: parseJwt(token).name, type: 'image' });

        // socket.emit("send-file", { body: file, user: parseJwt(token).name, type: 'image' });
       
        // Make Axios request to your backend
        axios.post(`${baseUrl}/chat/upload/file`, formData, {
            headers: {
                'Authorization': `MyAuthHeader ${token}`,

                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            console.log('File uploaded successfully:', response.data);
       // Reload the current page
window.location.reload();

    
        })
        
        .catch(error => {
            console.error('Error uploading file:', error);
            // Handle error if needed
        });
    } else {
        console.error('No file selected.');
    }
}

// Update button visibility based on file selection
document.getElementById('fileUpload').addEventListener('change', function () {
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = this;

    if (fileInput.files.length > 0) {
        // Show the button
        uploadButton.style.display = 'block';
    } else {
        // Hide the button
        uploadButton.style.display = 'none';
    }
});

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
 
    if (data.type === 'image') {
      
        const imageUrl = `${baseUrl}/chat/upload/${data.body}`;

        // Create an image element and append it to the message
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.alt = 'Image';

        // Add styling for the image message
        if (data.user === parseJwt(localStorage.getItem('token')).name) {
            messageElement.classList.add('right'); // Add styling for the current user's messages
        } else {
            messageElement.classList.add('left'); // Add styling for other users' messages
        }

        messageElement.appendChild(imgElement);
    }  

    chatList.appendChild(messageElement);
}
