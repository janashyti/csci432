<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const userLog = ref('false')

async function signIn (event) {
	event.preventDefault()

	if (!email.value || !password.value) {
        errorMessage.value = 'All fields are required.';
        return;
    }

	const data = { 
		email:email.value, 
		password: password.value }

	const url = 'https://hap-app-api.azurewebsites.net/user/login'

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}

	let response = await fetch(url, options)

	if (response.status === 200) {
		const data = await response.json()

		localStorage.setItem("token", data.token)
		localStorage.setItem("userLog", true)
		console.log(data)
		console.log(data.token)

		const user = data.user
        console.log(user)

		const username = user.userName
		const firstname = user.firstName
		const lastname = user.lastName
		const email = user.email
        console.log(username)

		localStorage.setItem('username', username);
		localStorage.setItem('firstname', firstname);
		localStorage.setItem('lastname', lastname);
		localStorage.setItem('email', email);
		

			router.push('/main')
	}
	else if (response.status === 400) {
		errorMessage.value ="Invalid email or password. Please try again!";
		console.log("Invalid email or password.")
	}

}

</script>

<template>
	<Header>
		<nav>
			<RouterLink to="/">Home</RouterLink>
            <RouterLink to="/join">Join</RouterLink>
		</nav>
	</Header>

	<main class="padding-block-700">
	<div class="background"></div>
	<section class="container center">
		<div class="form">		
   			<label for="email"><b>Email</b></label>
    		<input type="text" placeholder="Enter Email" v-model="email" name="email" id="email" required>

    		<label for="psw"><b>Password</b></label>
    		<input type="password" placeholder="Enter Password" v-model="password" name="psw" id="psw" required>

			<p v-if="errorMessage" id="error-message" style="color: black; font-weight: bold;">{{ errorMessage }}</p>	
			<button class="button" @click="signIn">Sign In</button>
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
    background-image: url('/ModalBackground.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    width: 100vw;
    position: fixed; 
    top: 0;
    left: 0;
    z-index: -10; 
}


.form {
    position: relative; 
    z-index: 10; 
    background: rgba(255, 255, 255, 0.9); 
    padding: 20px;
    border-radius: 10px;
    pointer-events: auto; 
}


</style>