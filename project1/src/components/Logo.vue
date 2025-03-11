<script setup>
import { useRouter } from 'vue-router'

const token = localStorage.getItem('token')  
const router = useRouter()


function navigateToHome() {
    if (token) {
        
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