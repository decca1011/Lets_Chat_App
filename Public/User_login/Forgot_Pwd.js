 

// Function to open the forgot password modal
async function openForgotPasswordModal() {
   const modal = document.getElementById('forgot-password-modal');
   modal.style.display = 'block';
   const signInForm = document.getElementById('signInForm');
   signInForm.style.display = 'none';
   const signUpButton = document.getElementById('sign_up_button');
   signUpButton.style.display = 'none';
 }
 
 // Function to close the forgot password modal
 async function closeForgotPasswordModal() {
   const modal = document.getElementById('forgot-password-modal');
   modal.style.display = 'none';
   window.location.reload();
 }
 
 // Function to handle forgot password submission
 async function forgotPassword() {
   const emailInput = document.getElementById('forgot-password-email').value;
   const user_data = { email: emailInput };
 
   try {
     const result = await axios.post(`${baseUrl}/called/password/forgotpassword`, user_data);
     console.log(`Forgot password for email: ${emailInput}`);
     alert('Check your email');
     console.log('POST request successful');
     console.log('Response:', result.data);
     window.location.reload();
   } catch (err) {
     alert('Enter valid email ID');
     console.log(err);
   }
   openForgotPasswordModal();
 }
 
 