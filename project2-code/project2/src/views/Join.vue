<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import validator from 'validator';


const router = useRouter()

const fname = ref('');
const lname = ref('');
const email = ref('');
const username = ref('');
const password = ref('');
const confirm_password = ref('');
const errorMessage = ref('');
const userLog = ref('false')



async function join (event) {

     event.preventDefault()

    if (!fname.value || !lname.value || !email.value || !username.value || !password.value || !confirm_password.value) {
        errorMessage.value = 'All fields are required.';
        return;
    }

    if (!validator.isEmail(email.value)) {
        errorMessage.value = 'Please enter a valid email address.';
        return;
    }

    if(password.value.length < 8){
        errorMessage.value = 'Your password needs to be at least 8 characters long!';
        return;
    }

    if (password.value !== confirm_password.value) {
        errorMessage.value = "Passwords do not match! Please try again!"
        return;
    }

    const data = { 
        email: email.value, 
        password: password.value, 
        firstName: fname.value, 
        userName: username.value, 
        lastName: lname.value,
    }

    console.log(data)

    const jsonData = JSON.stringify(data)

    const url = 'https://excursions-api-server.azurewebsites.net/user'

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: jsonData,
    }

    console.log(url)
    console.log(options)

    let response = await fetch(url, options)

    console.log(response.status)

    if (response.status === 201) {
        const data = await response.json()
        const token = data.token
        console.log(token)

        localStorage.setItem("token", data.token)
        console.log(data)
        localStorage.setItem("userLog", true)

        const user = data.user
        console.log(user)
        
        const username = user.userName
		const firstname = user.firstName
		const lastname = user.lastName
		const email = user.email
        const id = user._id
        console.log(username)

		localStorage.setItem('username', username);
		localStorage.setItem('firstname', firstname);
		localStorage.setItem('lastname', lastname);
		localStorage.setItem('email', email);
        localStorage.setItem('myUserId', id)

        router.push('/main')
    }
    else if (response.status === 400) {
        errorMessage.value = "Invalid credentials. Please try again."
        console.log("Invalid email or password.")
    }

}

</script>

<template>
	<Header>
		<nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/signin">Sign In</RouterLink>
		</nav>
	</Header>

	<main class="padding-block-700">
        <div class="background"></div>
		<section class="container center">   
		<div class="form">
            <label for="fname"><b>First Name</b></label>
    		<input type="text" placeholder="Enter First Name" v-model="fname" name="fname" id="fname" required>

            <label for="lname"><b>Last Name</b></label>
    		<input type="text" placeholder="Enter Last Name" v-model="lname" name="lname" id="lname" required>

            <label for="email"><b>Email</b></label>
    		<input type="text" placeholder="Enter Email" v-model="email" name="email" id="email" required>
            
   			<label for="uname"><b>Username</b></label>
    		<input type="text" placeholder="Enter Username" v-model="username" name="uname" id="uname" required>

    		<label for="psw"><b>Password</b></label>
    		<input type="password" placeholder="Enter Password" v-model="password" name="psw" id="psw" required>

            <label for="psw"><b>Confirm Password</b></label>
    		<input type="password" placeholder="Confirm Password" v-model="confirm_password" name="cpsw" id="cpsw" required>

            <p id="error-message" style="color: black; font-weight: bold;" v-if="errorMessage">{{ errorMessage }}</p>
            <button class="button" @click="join">Join</button>
        </div>	
		</section>
	</main>
</template>

<style scoped>
:deep(a) {
	text-decoration: none;
}

html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden; 
}


.background {
    background-image: url('/explore2.png');
    background-size: cover; 
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh; 
    width: 100vw; 
    position: fixed; 
    top: 0;
    left: 0;
    z-index: -1; 
}


</style>