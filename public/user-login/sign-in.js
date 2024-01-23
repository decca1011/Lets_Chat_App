 
// Function to handle user sign-in
async function signIn(event) {
   event.preventDefault();
   const email = document.getElementById("existingEmail").value;
   const password = document.getElementById("existingPassword").value;
   const userData = { email, password };
 
   try {
     const response = await axios.post(`${baseUrl}/post/login`, userData);
 
     if (response.data.success) {
       alert("Login successful");
       localStorage.setItem('token', response.data.token);
       const responseMessage = response.data.message;
       const token = response.data.token;
       console.log('Message:', responseMessage);
       console.log('Token:', token);

      
            // Emit a custom event when the user joins
       socket.emit('user-join', { user: email, token });

       window.location.href = '../profile/simple-chat/chat.html';

     } else {
       console.log(userData);
       console.log('Sign-in failed');
     }
   } catch (err) {
     alert("Login unsuccessful");
     console.log(userData);
     console.error('Sign-in error:', err);
   }
 }