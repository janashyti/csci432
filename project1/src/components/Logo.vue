<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js';
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { setUser } = userStore
const { firstName, lastName, userName, email, token, wholeName } = storeToRefs(userStore)


//const token = localStorage.getItem('token')  
const router = useRouter()


function navigateToHome() {
    if (token.value) {
        
        router.push('/main')
    } else {
        
        router.push('/')
    }
}
</script>

<template>
    <div>
        <img src="/image.png" @click="navigateToHome" alt="Logo">
    </div>
</template>

<style>
img {
    max-width: 50px;
    cursor: pointer;
}
</style>