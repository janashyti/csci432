<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToHome() {
    const token = localStorage.getItem('token')  
    if (token) {
        router.push('/main')
    } else {
        router.push('/')
    }
}
</script>

<template>
  <div>
    <img src="/park2.png" @click="navigateToHome" alt="Logo">
  </div>
</template>

<style>
img {
  max-width: 100px;
  cursor: pointer;
}
</style>
