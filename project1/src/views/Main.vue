<script setup>
import Header from '../components/Header.vue'
import Modal from '../components/Modal.vue'
import { useRouter } from 'vue-router'
import { ref, useTemplateRef } from 'vue';

const username = ref(localStorage.getItem('username'));
const router = useRouter()

const dropdownVisible = ref(false);


async function signOut(event) {
	
	const token = localStorage.getItem("token")
	console.log(token)

	const url = 'https://hap-app-api.azurewebsites.net/user/logout'

	const options = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}

	let response = await fetch(url, options)

	if (response.ok) {
		if (response.status === 200) {
			localStorage.removeItem("token")
			localStorage.removeItem("username")
			localStorage.removeItem("userLog")

			router.push({
			name: 'home'
			})
		}
	} else {
		console.log("HTTP-Error: " + response.status)
	}
}


async function deleteUser(event){

	const token = localStorage.getItem("token")

	const url = 'https://hap-app-api.azurewebsites.net/user'

	const isConfirmed = window.confirm("Are you sure you want to delete your account?");

	if (!isConfirmed) {
    	return;
    }

	else if(isConfirmed){
		const options = {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}


		let response = await fetch(url, options)

		if (response.ok) {
			if (response.status === 200) {
				localStorage.removeItem("token")
				localStorage.removeItem("username")


				router.push({
				name: 'home'
				})
			}
		} 
		else {
			console.log("HTTP-Error: " + response.status)
		}

	}	

}

	const editUsername = ref('');
	const editFirstname = ref('');
	const editLastname = ref('');
	const editEmail = ref('');

// GET Data
async function getData(){
	

let url = 'https://hap-app-api.azurewebsites.net/user'
const token = localStorage.getItem("token")
const options = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	let response = await fetch(url, options)

	if (response.status === 200) {
		const data = await response.json()
        
        editUsername.value = data.userName
		editFirstname.value = data.firstName
		editLastname.value = data.lastName
		editEmail.value = data.email
		console.log(data)
	
		

		localStorage.setItem('username', editUsername.value);
		localStorage.setItem('firstname', editFirstname.value);
		localStorage.setItem('lastname', editLastname.value);
		localStorage.setItem('email', editEmail.value)
		localStorage.setItem('myUserId', data._id)
		console.log(data._id)
	}

	else if (response.status === 401) {
         console.log("Unauthorized")
    }

	else if (response.status === 500) {
         console.log("Internal server error")
    }

}
getData()



//Modal

const modal = useTemplateRef('name-modal')


function cancel() {
	modal.value.close()
}

const uName = ref(localStorage.getItem("username"))
const fName = ref(localStorage.getItem("firstname"))
const lName = ref(localStorage.getItem("lastname"))
const email = ref(localStorage.getItem("email"))
const password = ref()

//Save edited data
async function save() {

	const url = 'https://hap-app-api.azurewebsites.net/user'
	const token = localStorage.getItem("token")


	
let userData

	const userData1 = {
        firstName: fName.value, 
		lastName: lName.value,
        userName: uName.value, 
		email: email.value,  
		password: password.value   
	}

	const userData2 = {
        firstName: fName.value, 
		lastName: lName.value,
        userName: uName.value, 
		email: email.value,   
	}

	if (password.value){
		userData = userData1
	}
	else if(!password.value){
		userData = userData2
	}

	const jsonData = JSON.stringify(userData)

	

	const options = {
		method: "PATCH",
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: jsonData,
	}



	let response = await fetch(url, options)

	if(response.status === 200) {
		console.log("data was changed")
		modal.value.close()
		location.reload()

		localStorage.setItem('username', uName.value);
		localStorage.setItem('firstname', fName.value);
		localStorage.setItem('lastname', lName.value);
		localStorage.setItem('email', email.value)
		//window.location.reload()
		//router.push('/main')
	}

	else if(response.status === 400) {
		console.log("bad request")
	}
			
	else if(response.status === 500) {
		console.log("internal server error")
	}

}

function modalOpen() {
    if (modal.value) {
		getData()
        modal.value.open();
    }
}


 
</script>

<template>
	<Header>
		<nav>
			<div @mouseover="dropdownVisible = true" @mouseleave="dropdownVisible = false">
        
				<button class="button">Account Options</button>
				
      			<div v-if="dropdownVisible" class="dropdown-menu">
        			<a @click="signOut">Sign Out</a>
        			<a @click="deleteUser">Delete</a>
					<RouterLink to="/profiledata" @click="getData">Profile</RouterLink>
					<a @click="modalOpen">Edit</a>
					<RouterLink to="/search" @click="getData">Search</RouterLink>
      			</div>
			</div>
		</nav>
	</Header>
	
	<main class="padding-block-700">
		<RouterView name="leftSidebar" class="grid-panel"></RouterView>
		<RouterView name="focus" class="grid-panel vline"></RouterView>
		<RouterView name="rightSidebar" class="grid-panel vline"></RouterView>
	</main>

	<Modal ref="name-modal">
		<template #header>
		</template>
		<template #main>
			<div class="form">
			<label for="firstname"><b>First Name</b></label>
			<input v-model="fName" type="text">

			<label for="lastname"><b>Last Name</b></label>
			<input v-model="lName" type="text">

			<label for="username"><b>Username</b></label>
			<input v-model="uName" type="text">

			<label for="email"><b>Email</b></label>
			<input v-model="email" type="text">

			<label for="password"><b>Password</b></label>
			<input v-model="password" type="password" placeholder="Enter new password">

			</div>
		</template>
		<template #footer>
			<button class="button" @click.stop="cancel">Cancel</button>
			<button class="button" @click.stop="save">Save</button>
		</template>
	</Modal>
</template>

<style scoped>

.dropdown-menu {
  position: absolute;
  top: 88px;
  right: 122px;
  background-color: white;
  border: 1px solid #ddd;
  padding: 7px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.dropdown-menu a {
  display: block;
  padding: 8px 15px;
  margin: 5px 0;
  color: #333;
  text-decoration: none;
  cursor: pointer;
}

.dropdown-menu a:hover {
  background-color: #f1f1f1;
}


.view {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto 1fr auto;
	height: 100%;
}

.grid-panel {
	padding: var(--size-300);
	margin: var(--size-300);
}

header, footer {
	margin: 0 auto;
}

@media (min-width: 50em) {
	main {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr;
	}

	.vline {
		border-left: 1px lightgrey solid;		
	}
}

.form {
    position: relative; 
    z-index: 10; 
    background: rgba(255, 255, 255, 0.9); 
    padding: 5px;
    border-radius: 5px;
    pointer-events: auto; 
}

</style>