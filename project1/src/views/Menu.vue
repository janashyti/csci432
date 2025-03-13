<script setup>
import { useUserStore } from '@/stores/user.js';
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { setUser } = userStore
const { firstName, lastName, userName, email, token, wholeName } = storeToRefs(userStore)


//const username = localStorage.getItem('username');

</script>

<template> 
   <section class="container center">
		<h2>Welcome {{ userName }}</h2>
   </section>
</template>
<style scoped>
.container {
   position: relative;
    width: 100%;
    height: 100vh;
    background-image: url('/main2.PNG');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: 800;
    font-family:'Georgia', serif;
}

.center {
   text-align: center;
}

</style>