<script setup>
import Header from '../components/Header.vue'
</script>

<template>
    <Header>
        <nav>
            <RouterLink to="/join">Join</RouterLink>
            <RouterLink to="/signin">Sign In</RouterLink>
        </nav>
    </Header>

    <main class="background ">
        <section class="container center vertical">
        </section>
    </main>
</template>

<style scoped>

:deep(a) {
    text-decoration: none;
}

html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden; 
}


.background {
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

</style>



