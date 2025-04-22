<script setup>
import { ref } from 'vue'

const showModal = ref(false)

defineExpose({
    open, close
})

function open() {
    showModal.value = true
}

function close() {
    showModal.value = false
}

</script>

<template>
    <div v-show="showModal" class="modal-backdrop" @click.stop.self="close">
        <div class="modal">
            <header>
                <slot name="header"></slot>
                <button class="icon button modal-button"
                    @click.stop.self="close">✖️</button>
            </header>

            <main>
                <slot name="main"></slot>
            </main>

            <footer>
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--modal-backdrop-clr);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
}

.modal {
    background-color: var(--modal-background-clr);
    padding: var(--size-300);
}

.modal-button:hover {
    background-color: var(--clr-accent-200);
    border-radius: 50%;
}

header {
    display: flex;
    margin-bottom: var(--size-100);
    justify-content: space-between;
    text-align: right;
}

header > img {
    margin-left: var(--size-500);
}

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: var(--size-400);
    gap: 5px;
}
</style>