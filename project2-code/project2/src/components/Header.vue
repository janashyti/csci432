<script setup>
    import { RouterLink } from 'vue-router';
    import Logo from './Logo.vue'
</script>

<template>
    <header>
        <div class="container">
            <Logo />
            <slot></slot>
        </div>
    </header>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fffcf150;
}

:slotted(*) {
    font-size: var(--fs-600);
    padding: 10px;
}

</style>