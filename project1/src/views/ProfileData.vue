<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useUserStore } from '@/stores/user.js';
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { setUser } = userStore
const { firstName, lastName, userName, email, token, wholeName } = storeToRefs(userStore)


//const firstname = ref(localStorage.getItem('firstname'))
//const username = ref(localStorage.getItem('username'))
//const lastname = ref(localStorage.getItem('lastname'))
//const email = ref(localStorage.getItem('email'))
//console.log(firstname.value)
//console.log(lastname.value)

//console.log(email)
//console.log(username)
</script>
<template> 
<div class="flex align-center" @click="router.back()">
    ◁
    <br>
    <p> Firstname: {{ firstName }}</p>
    <p> Lastname: {{ lastName }}</p>
    <p> Username:  {{ userName }}</p>
    <p>Email: {{ email }}</p>
   </div> 
</template>