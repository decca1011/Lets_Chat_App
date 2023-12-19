const openCreateGrp = document.getElementById("openCreateGrp");
const closeCreateGrp = document.getElementById("closeCreateGrp");
const group  = document.getElementById('group')
const popup = document.getElementById("popup");
const token = localStorage.getItem('token');

openCreateGrp.addEventListener("click", () => {

console.log('cccc')
   popup.style.display = "block"
   group.style.display = "none";
 });
 
 closeCreateGrp.addEventListener("click", () =>{
   popup.style.display = "none";
   group.style.display = "block"
 });

 async function SaveGrpMembers(event) {
   event.preventDefault();
   const groupNameInput = document.getElementById('grp_name').value.trim();
   const selectedUserCheckboxes = document.querySelectorAll('input[name="selectedUsers"]:checked');
  const selectedUserIds = Array.from(selectedUserCheckboxes).map((checkbox) => checkbox.value);
 

  if (groupNameInput === '' || selectedUserIds.length === 0) return;


   const GroupDetailBody = {
      'name':  groupNameInput,
      'users_id': selectedUserIds,
   }
    try{
      const response = await axios.post(`${baseUrl}/group/GroupDetail`,GroupDetailBody ,{
         headers: {
            Authorization: `MyAuthHeader ${token}`,
         },
      });
      console.log(response)
      window.location.reload();
    }
    catch (error) {
      console.log('Error getting chat list:', error);
    }
 }
 
// Group.js
async function showUserList() {
  // Clear the add-people div before appending the user list
const addPeopleDiv = document.getElementById('add-people');
// addPeopleDiv.innerHTML = ''; // This line ensures that any existing content is removed
  // Fetch the list of users from the backend
  try {
    const response = await axios.get(`${baseUrl}/group/addMember`,{
      headers: {
         Authorization: `MyAuthHeader ${token}`,
      },
   });
      const {getUserList} = response.data;
console.log(getUserList)
      // Create a scrollable list of users
      const userList = document.createElement('ul');
      userList.style.overflowY = 'scroll';
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

addPeopleDiv.innerHTML = ''; // This line ensures that any existing content is removed
// Append the user list to the add-people div
addPeopleDiv.appendChild(userList);
  } catch (error) {
      console.log('Error fetching users:', error);
  }
}


