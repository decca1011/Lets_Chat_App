 

// Function to toggle the sign-up form
async function toggleSignUp() {
  const signUpButton = document.querySelector(".btn-signup-toggle");
  const signUpContainer = document.getElementById("signUpContainer");
  const signInForm = document.getElementById("signInForm");

  signInForm.style.display = "none";
  signUpContainer.style.display = "block";
  signUpButton.style.display = "none";
}


// Function to handle user sign-up
async function signUp(event) {
   event.preventDefault();
   const username = document.getElementById("username").value;
   const email = document.getElementById("email").value;
   const password = document.getElementById("password").value;
   const mobile = document.getElementById("mobile").value;
   const userData = { username, email, password, mobile };
 
   try {
     await axios.post(`${baseUrl}/post/Data`, userData);
     alert(`User Created Successfully ====> NOW SIGN_IN`);
     console.log('POST Request Successful');
     window.location.reload();
   } catch (err) {
     if (err.response && err.response.data) {
       const errorMessage = err.response.data.error;
       if (errorMessage === 'Email already exists') {
         alert('User with this email already exists. Please use a different email.');
       } else if (errorMessage === 'User with this detail already exists') {
         alert('User with this mobile number already exists. Please use a different mobile number.');
       }
     } else {
       // Handle other errors here
       console.log(`other error`)
     }
   }
 }
 