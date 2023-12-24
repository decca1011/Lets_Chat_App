  const addAdmin = document.getElementById('addAdmin');
 const removeGroupUser = document.getElementById('removeGroupUser');
 const addMember = document.getElementById('addmember')
 const forAdmin = document.getElementById('forAdmin')

 const chatContent = document.getElementById('chat-content');
 const adminForm = document.getElementById('admin-form');

 const adminControlDiv = document.getElementById('admincontrol');
 const makeMemberAdmin = document.getElementById('makeMemberAdmin');
 const addMemberInGroup = document.getElementById('addMemberInGroup' );
 const removeMember = document.getElementById('removeMember')
 

addMember.addEventListener('click', async () => {
showUserListforAdminToadd()
.then(result => {
  const { getUserList } = result;
  console.log(getUserList)
  // Clear the admincontrol div before appending the user list
  adminControlDiv.innerHTML = '';
 chatContent.style.display = "none";
  forAdmin.style.display = 'none';
  addMemberInGroup.style.display = "block";
 
  if (getUserList.length > 0) {
    // Create a scrollable list of users
    const userList = document.createElement('ul');
    userList.style.overflow = 'scroll';
    userList.style.maxHeight = '100px'; // Set the maximum height as needed

    getUserList.forEach(user => {
      const listItem = document.createElement('li');
      // Create a checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'selectedUsers'; // Add a common name for all checkboxes
      checkbox.value = user.user_id; // Set the user_id as the value

      // Create a label for the checkbox with the user's name
      const label = document.createElement('label');
      label.textContent = user.user_name;
      label.appendChild(checkbox);
      // Append the label to the list item
      listItem.appendChild(label);
      // Append the list item to the user list
      userList.appendChild(listItem);
    });

    // Append the user list to the admincontrol div
    adminControlDiv.appendChild(userList);
     // Display the admin form after populating the user list
     adminForm.style.display = 'block';
  } else {
    // Show a message indicating that there are no users to display
    adminControlDiv.textContent = 'No users available for admin control.';
  }
})
.catch(error => {
  console.error('Error in getting User List', error);
  if (error.response && error.response.status === 400) {
    // Show an error message to the user
    adminControlDiv.textContent = 'Sorry, you are not a group admin.';
  } else {
    // Handle other errors as needed
    adminControlDiv.textContent = 'Error fetching user list. Please try again later.';
  }
});
})

addMemberInGroup.addEventListener('click', async (event) => {
  // Get selected members from the checkboxes
  event.preventDefault();
  const groupId = JSON.parse(localStorage.getItem('currentGroupDetail')).groupId;

  const selectedUserCheckboxes = document.querySelectorAll('input[name="selectedUsers"]:checked');
  const selectedUserIds = Array.from(selectedUserCheckboxes).map((checkbox) => checkbox.value);

  if (selectedUserIds.length === 0) return;

  const makeMemberGroupMember = {
    'users_id': selectedUserIds,
  };

  try {
    await axios.post(`${baseUrl}/group/addMemberInGroup/${groupId}`, makeMemberGroupMember, {
      headers: {
        Authorization: `MyAuthHeader ${token}`,
      },
    });

  //  window.location.reload();

  alert('done')
  } catch (error) {
    console.error('Error making member admin:', error);
    alert('Error making member admin. Please check the console for details.');
  }
  forAdmin.style.display = 'block';
    chatContent.style.display = "block";
    adminForm.style.display = "none";

})

const showUserListforAdminToadd =async () => {
  try {
     const groupId = JSON.parse(localStorage.getItem('currentGroupDetail')).groupId;
console.log(groupId)
     
     const response = await axios.get(`${baseUrl}/group/fetchforaddMemberInGroup/${groupId}`, {
        headers: {
          Authorization: `MyAuthHeader ${token}`,
        },
      });

    const { getUserList } = response.data;

    if (response.status === 200) {
           
         
         console.log('User list fetched successfully:', getUserList);
      return { getUserList }; // Returning an object for consistency
    } else {
      // Show an error message if the response status is not 200
 
      throw new Error(`Failed to fetch user list. Status: ${response.status}`);
    }
  } catch (error) {
     alert('you are not admin')
    console.error('Error fetching users:', error);
    throw error; // Re-throw the error for further handling
  }
}



 addAdmin.addEventListener('click', async () => {
   showUserListforAdmin()
     .then(result => {
       const { getUserList } = result;
 
       // Clear the admincontrol div before appending the user list
       adminControlDiv.innerHTML = '';

    
       chatContent.style.display = "none";
       forAdmin.style.display = 'none';
       makeMemberAdmin.style.display = "block";
      
       if (getUserList.length > 0) {
         // Create a scrollable list of users
         const userList = document.createElement('ul');
         userList.style.overflow = 'scroll';
         userList.style.maxHeight = '100px'; // Set the maximum height as needed
 
         getUserList.forEach(user => {
           const listItem = document.createElement('li');
 
           // Create a checkbox
           const checkbox = document.createElement('input');
           checkbox.type = 'checkbox';
           checkbox.name = 'selectedUsers'; // Add a common name for all checkboxes
           checkbox.value = user.user_id; // Set the user_id as the value
 
           // Create a label for the checkbox with the user's name
           const label = document.createElement('label');
           label.textContent = user.user_name;
           label.appendChild(checkbox);
           // Append the label to the list item
           listItem.appendChild(label);
           // Append the list item to the user list
           userList.appendChild(listItem);

         });
 
         // Append the user list to the admincontrol div
         adminControlDiv.appendChild(userList);
          // Display the admin form after populating the user list
          adminForm.style.display = 'block';
       } else {
         // Show a message indicating that there are no users to display
         adminControlDiv.textContent = 'No users available for admin control.';
       }
     })
     .catch(error => {
       console.error('Error in getting User List', error);
       if (error.response && error.response.status === 400) {
         // Show an error message to the user
         adminControlDiv.textContent = 'Sorry, you are not a group admin.';
       } else {
         // Handle other errors as needed
         adminControlDiv.textContent = 'Error fetching user list. Please try again later.';
       }
     });
 });
 

 async function showUserListforAdmin() {
   try {
      const groupId = JSON.parse(localStorage.getItem('currentGroupDetail')).groupId;
console.log(groupId)
      
      const response = await axios.get(`${baseUrl}/group/fetchforaddMember/${groupId}`, {
         headers: {
           Authorization: `MyAuthHeader ${token}`,
         },
       });
 
     const { getUserList } = response.data;
 
     if (response.status === 200) {
            
          
          console.log('User list fetched successfully:', getUserList);
       return { getUserList }; // Returning an object for consistency
     } else {
       // Show an error message if the response status is not 200
  
       throw new Error(`Failed to fetch user list. Status: ${response.status}`);
     }
   } catch (error) {
      alert('you are not admin')
     console.error('Error fetching users:', error);
     throw error; // Re-throw the error for further handling
   }
 }

 makeMemberAdmin.addEventListener('click', async (event) => {
  event.preventDefault();
  const groupId = JSON.parse(localStorage.getItem('currentGroupDetail')).groupId;

  const selectedUserCheckboxes = document.querySelectorAll('input[name="selectedUsers"]:checked');
  const selectedUserIds = Array.from(selectedUserCheckboxes).map((checkbox) => checkbox.value);

  if (selectedUserIds.length === 0) return;

  const makeMemberAdmin = {
    'users_id': selectedUserIds,
  };

  try {
    await axios.post(`${baseUrl}/group/makeAdmin/${groupId}`, makeMemberAdmin, {
      headers: {
        Authorization: `MyAuthHeader ${token}`,
      },
    });

  //  window.location.reload();

  alert('done')
    forAdmin.style.display = 'block';
    chatContent.style.display = "block";
    adminForm.style.display = "none";



  } catch (error) {
    console.error('Error making member admin:', error);
    alert('Error making member admin. Please check the console for details.');
  }
});

removeGroupUser.addEventListener('click', async () => {
   //  alert("This feature is not yet available");
   showUserListforAdmin()
   .then(result => {
    const { getUserList } = result;

    // Clear the admincontrol div before appending the user list
    adminControlDiv.innerHTML = '';
 
    forAdmin.style.display = 'none';
    chatContent.style.display = "none";
    removeMember.style.display = "block";

    if (getUserList.length > 0) {
      // Create a scrollable list of users
      const userList = document.createElement('ul');
      userList.style.overflow = 'scroll';
      userList.style.maxHeight = '100px'; // Set the maximum height as needed

      getUserList.forEach(user => {
        const listItem = document.createElement('li');

        // Create a checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'selectedUsers'; // Add a common name for all checkboxes
        checkbox.value = user.user_id; // Set the user_id as the value

        // Create a label for the checkbox with the user's name
        const label = document.createElement('label');
        label.textContent = user.user_name;
        label.appendChild(checkbox);
        // Append the label to the list item
        listItem.appendChild(label);
        // Append the list item to the user list
        userList.appendChild(listItem);

      });

      // Append the user list to the admincontrol div
      adminControlDiv.appendChild(userList);
       // Display the admin form after populating the user list
       adminForm.style.display = 'block';
    } else {
      // Show a message indicating that there are no users to display
      adminControlDiv.textContent = 'user can not be remove please check .';
    }
  })
  .catch(error => {
    console.error('Error in getting User List', error);
    if (error.response && error.response.status === 400) {
      // Show an error message to the user
      adminControlDiv.textContent = 'Sorry, you are not a group admin.';
    } else {
      // Handle other errors as needed
      adminControlDiv.textContent = 'Error fetching user list. Please try again later.';
    }
  });s
 });
 
 removeMember.addEventListener('click', async (event) =>{
  event.preventDefault();
  const groupId = JSON.parse(localStorage.getItem('currentGroupDetail')).groupId;

  const selectedUserCheckboxes = document.querySelectorAll('input[name="selectedUsers"]:checked');
  const selectedUserIds = Array.from(selectedUserCheckboxes).map((checkbox) => checkbox.value);

  if (selectedUserIds.length === 0) return;

  const removeGroupUser = {
    'users_id': selectedUserIds,
  };

  try {
    await axios.post(`${baseUrl}/group/removeUser/${groupId}`, removeGroupUser, {
      headers: {
        Authorization: `MyAuthHeader ${token}`,
      },
    });

  //  window.location.reload();

  alert('done')
    forAdmin.style.display = 'block';
    chatContent.style.display = "block";
    adminForm.style.display = "none";

  } catch (error) {
    console.error('Error making member admin:', error);
    alert('Error making member admin. Please check the console for details.');
  }

 })