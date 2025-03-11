<script setup>

const username = localStorage.getItem('username');

</script>

<template> 
   <section class="container center">
		<h2>Welcome {{ username }}</h2>
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