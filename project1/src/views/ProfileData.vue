<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const firstname = ref(localStorage.getItem('firstname'))
const username = ref(localStorage.getItem('username'))
const lastname = ref(localStorage.getItem('lastname'))
const email = ref(localStorage.getItem('email'))
console.log(firstname.value)
console.log(lastname.value)

console.log(email)
console.log(username)
</script>
<template> 
<div class="flex align-center" @click="router.back()">
    ◁
    <br>
    <p> Firstname: {{ firstname }}</p>
    <p> Lastname: {{ lastname }}</p>
    <p> Username:  {{ username }}</p>
    <p>Email: {{ email }}</p>
   </div> 
</template>