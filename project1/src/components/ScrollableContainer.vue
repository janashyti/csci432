<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";

const props = defineProps({
  items: Array, 
  fetchOlderItems: Function, 
  fetchNewItems: Function, 
  itemComponent: Object, 
  itemKey: String, 
  newItemCount: Number,  
});

const containerRef = ref(null);
const isLoading = ref(false);
const localNewItemCount = ref();


watch(() => props.newItemCount, (newValue) => {
  console.log("New message count updated:", newValue);
  localNewItemCount.value = newValue;  
});

async function loadOlderItems() {
  if (isLoading.value || !props.fetchOlderItems) return;
  isLoading.value = true;
  await props.fetchOlderItems();
  isLoading.value = false;
}

async function loadNewItems() {
  if (!props.fetchNewItems) return;
  
  console.log("Fetching new messages...");
  const newMessages = await props.fetchNewItems(); 

  if (Array.isArray(newMessages) && newMessages.length > 0) {
    console.log("New messages received:", newMessages.length);
  } else {
    console.warn("No new messages fetched.");
  }

  await nextTick();  
  containerRef.value.scrollTop = 0;  
  localNewItemCount.value = 0;  
}

function handleScroll() {
  const container = containerRef.value;
  if (!container) return;

  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
    loadOlderItems();
  }

  if (container.scrollTop === 0) {
    console.log("Reached top - New messages:", localNewItemCount.value);
  }
}

async function checkNewItems() {
  if (!props.fetchNewItems) return;
  await props.fetchNewItems(true); 
}

onMounted(() => {
  containerRef.value.addEventListener("scroll", handleScroll);
 const interval = setInterval(checkNewItems, 1000);  
  onUnmounted(() => clearInterval(interval));
});
</script>

<template>
  <div class="scrollable-container" ref="containerRef">
    <div class="sticky-header">
      <button class="button" @click="loadNewItems">
        {{ localNewItemCount }} New Messages
      </button>
    </div>

    <component 
      v-for="item in items" 
      :is="itemComponent"
      :key="item[itemKey]"
      v-bind="item"
    />
    
    <p v-if="isLoading" class="loading-text">Loading...</p>
  </div>
</template>

<style scoped>
.scrollable-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  position: relative;
}

.sticky-header {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.564);
  padding: 5px;
  z-index: 1;
  text-align: center;
}

.loading-text {
  text-align: center;
  font-size: 14px;
  color: gray;
  padding: 10px 0;
}
</style>
