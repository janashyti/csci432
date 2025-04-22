<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Modal from '../components/Modal.vue'
import Header from '../components/Header.vue'

const router = useRouter()
const userId = ref()
const firstname = ref()
const username = ref()
const lastname = ref()
const email = ref()
const password = ref('')
const modal = ref(null)
const token = localStorage.getItem('token')
const dropdownVisible = ref(false);

// Fetch user data
async function getData() {
    const url = 'https://excursions-api-server.azurewebsites.net/user'
    
    const options = {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    }
    
    try {
        let response = await fetch(url, options)
        if (response.status === 200) {
            const rawdata = await response.json()
            const data = rawdata.user
            username.value = data.userName
            firstname.value = data.firstName
            lastname.value = data.lastName
            email.value = data.email
            userId.value = data._id
        } else {
            console.error("Failed to fetch user data")
        }
    } catch (error) {
        console.error("Error fetching user data", error)
    }
}

onMounted(getData)

// Save edited data
async function save() {
    const url = 'https://excursions-api-server.azurewebsites.net/user'
    
    const userData = {
        firstName: firstname.value, 
        lastName: lastname.value,
        userName: username.value, 
        email: email.value,
        ...(password.value && { password: password.value })
    }
    
    try {
        let response = await fetch(url, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData)
        })
        
        if (response.status === 200) {
            console.log("Data updated successfully")
            modal.value.close()
            localStorage.setItem('username', username.value)
            localStorage.setItem('firstname', firstname.value)
            localStorage.setItem('lastname', lastname.value)
            localStorage.setItem('email', email.value)
        } else {
            console.error("Failed to update data")
        }
    } catch (error) {
        console.error("Error updating user data", error)
    }
}
</script>

<template>

        <div class="back-button button" @click="router.back()">
            ◁ Back
        </div>
        <br>

    <div class="profile-container">
        <h1>Profile</h1>
        <div class="profile-data">
            <p><strong>Username:</strong> {{ username }}</p>
            <p><strong>First Name:</strong> {{ firstname }}</p>
            <p><strong>Last Name:</strong> {{ lastname }}</p>
            <p><strong>Email:</strong> {{ email }}</p>
        </div>
        <button class="button" @click="modal.open()">Edit Profile</button>
    </div>

    <Modal ref="modal">
        <template #header>
            <h2>Edit Profile</h2>
        </template>
        <template #main>
    <div class="form-group">
        <label>Username:</label>
        <input v-model="username" type="text" />
    </div>
    <div class="form-group">
        <label>First Name:</label>
        <input v-model="firstname" type="text" />
    </div>
    <div class="form-group">
        <label>Last Name:</label>
        <input v-model="lastname" type="text" />
    </div>
    <div class="form-group">
        <label>Email:</label>
        <input v-model="email" type="email" />
    </div>
    <div class="form-group">
        <label>Password:</label>
        <input v-model="password" type="password" placeholder="Leave blank to keep unchanged" />
    </div>
</template>

        <template #footer>
            <button class="button" @click="save">Save</button>
            <button class="button" @click="modal.close()">Cancel</button>
        </template>
    </Modal>
</template>

<style scoped>
/* Back Button */
.back-button {
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  display: inline-block;
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  width: fit-content;
  transition: background-color 0.3s ease;
}

/* Profile Container */
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(to bottom right, #ecf0ec, #ffffff);
  border: 2px solid #eef4ee;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  text-align: center;
}

h1 {
  font-weight: 700;
  color: #212722;
  margin-bottom: 1rem;
}

.profile-data p {
  font-size: 18px;
  margin: 10px 0;
  color: #494b49;
}

/* Modal and Form Styles */
label {
  font-weight: 700;
  color: #3b3c3b;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  margin-bottom: 5px;
}

.form-group input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #fafbfa;
  border-radius: 5px;
  background-color: #f5f7f3;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #f1fef2;
  outline: none;
}

/* Button Styling */
.button {
  margin: 0.5rem;
  padding: 0.6rem 1.2rem;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

</style>
