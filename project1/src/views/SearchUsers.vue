<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    const token = localStorage.getItem("token")
    const router = useRouter()
    const search = ref("")
    const users = ref([])

    async function getUsers(){
        console.log(search.value)
        const url =  `https://hap-app-api.azurewebsites.net/users?search=firstName|lastName|userName:${search.value}`

        const options = {
		method: "GET",
		headers: {
            'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		}
	    }

        let response = await fetch(url, options)

        if(response.status === 200){
        console.log("s")
        const data = await response.json()
        users.value = data
        console.log(data)
        }
        else if(response.status === 401){
        console.log("Unauthorized")
        }
        else if(response.status === 500){
        console.log("internal server error")
        //alert("There was an error trying to save your response. Please try again later!")
        }

    }

</script>

<template>
    <div >
        <div class="flex align-center" @click="router.back()">◁</div>
        <br>
        <h2>Search Users</h2>
        <div class="input-container">
            <input v-model="search" type="text" placeholder="Search by name, lastname OR username">
            <button class="button" @click="getUsers()">🔍</button> 
        </div> 

        <!-- User Cards -->
        <div class="users-container">
            <RouterLink 
                v-for="user in users" 
                :key="user._id" 
                :to="{ path: `/user/${user._id}`, query: { name: user.userName } }"  
                class="user-card"
            >
                <h3>{{ user.firstName }} {{ user.lastName }}</h3>
                <p>@{{ user.userName }}</p>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
input {
    width: 300px;
    padding: 5px;
    margin-right: 5px;
}

.users-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    justify-content: center; 
    align-items: center; 
}

.user-card {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    width: 200px;
    background: #f9f9f9;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}
h3{
    font-weight: 600;
}
</style>
