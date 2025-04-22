<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()

const username = ref(localStorage.getItem('username'));
const router = useRouter()
const dropdownVisible = ref(false);


async function signOut(event) {
	
	const token = localStorage.getItem("token")
	
	console.log(token)

	const url = 'https://excursions-api-server.azurewebsites.net/user/sign-out'

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

const url = 'https://excursions-api-server.azurewebsites.net/user'

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

</script>
<template>
    <div>
        <Header>
		<nav>
			<div @mouseover="dropdownVisible = true" @mouseleave="dropdownVisible = false">
				<button class="button">Account Options</button>
      			<div v-if="dropdownVisible" class="dropdown-menu">
        			<a @click="signOut">Sign Out</a>
        			<a @click="deleteUser">Delete Account</a>
					<RouterLink to="/profile">Profile</RouterLink>
                    <RouterLink to="/invites">Invites</RouterLink>
      			</div>
			</div>
		</nav>
	</Header>

    <main class="padding-block-700 nature-main">
    <div class="background"></div>
    <div v-if="route.name === 'main'" class="main-links"> 
        <br><br>
            <RouterLink to="/main/nationalparks">Search for National Parks</RouterLink> <br>
            <RouterLink to="/main/campgrounds">Search for Camps</RouterLink> <br>
            <RouterLink to="/main/thingstodo">Things To Do</RouterLink> <br>
            <RouterLink to="/main/excursion">Excursions</RouterLink><br>
            <RouterLink to="/main/trip">Trips</RouterLink>
    </div>
    <router-view />
    </main>

    <main class="padding-block-700 three-column-layout">
		<RouterView name="leftSidebar" class="grid-panel"></RouterView>
		<RouterView name="focus" class="grid-panel vline"></RouterView>
		<RouterView name="rightSidebar" class="grid-panel vline"></RouterView>
	    </main>

    </div>
</template>

<style scoped>
    .dropdown-menu {
  position: absolute;
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

.view {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto 1fr auto;
	height: 100%;
}

.three-column-layout {
  display: flex; 
  flex-direction: row; 
  justify-content: space-between;
  align-items: flex-start; 
  gap: 1rem; 
}

.grid-panel {
  flex: 1; 
  padding: var(--size-300);
  margin: var(--size-300);
  background: white; 
  border: 1px solid #ccc; 
  min-height: 500px; 
}

.button {
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button:hover {
  background-color: #2b3931;
  transform: scale(1.03);
}

.dropdown-menu {
  background-color: #f5f8f3d6; 
  border: 1px solid #b8c4a2;
  border-radius: 10px;
  margin-top: 0.5rem;
  padding: 0.8rem 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: fadeSlideIn 0.3s ease-out;
  position: absolute;
  z-index: 100;
}

.dropdown-menu a {
  text-decoration: none;
  color: #3d4347; 
  font-weight: 500;
  transition: color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.main-links {
  display: flex;
  flex-direction: column;
  align-items:center;
  gap: 1rem;
  padding: 1 rem;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  animation: fadeSlideIn 0.6s ease-out;
  text-align: center;
  background-color:rgba(241, 241, 241, 0.18);
}

.main-links a {
  font-weight: 600;
  color:rgb(248, 250, 248);
  text-decoration: none;
  padding: 0.6rem 1rem;
  background-color:rgb(37, 43, 37);
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.main-links a:hover {
  background-color:rgb(54, 66, 54);
  transform: translateX(5px);
}

@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>