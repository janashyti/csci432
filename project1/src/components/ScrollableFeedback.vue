<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import Feedback from "./Feedback.vue"; 
import { useUserStore } from '@/stores/user.js';
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { setUser } = userStore
const { firstName, lastName, userName, email, token, wholeName } = storeToRefs(userStore)


const feedbackList = ref([]); 
const newFeedbackCount = ref(0); 
const feedbackContainer = ref(null); 
const isLoading = ref(false);
//const token = localStorage.getItem("token");

const fetchLimit = 15; 

async function fetchFeedback(before = null, append = false) {
    if (isLoading.value) return; 
    isLoading.value = true;

    let url = `https://hap-app-api.azurewebsites.net/messages?limit=${fetchLimit}`;
    if (before) url += `&before=${before}`;

    const options = {
        method: "GET",
        headers: { Authorization: `Bearer ${token.value}` },
    };

    try {
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            if (append) {
                feedbackList.value.push(...data);
            } else {
                feedbackList.value = data;
            }
        }
    } catch (error) {
        console.error("Error fetching feedback:", error);
    } finally {
        isLoading.value = false;
    }
}

async function fetchNewFeedback() {
    let afterTime = new Date().toISOString();
    let url = `https://hap-app-api.azurewebsites.net/messages?limit=${fetchLimit}&after=${afterTime}`;

    const options = {
        method: "GET",
        headers: { Authorization: `Bearer ${token.value}` },
    };

    try {
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                feedbackList.value.unshift(...data);
                newFeedbackCount.value = 0;
                await nextTick(); 
                feedbackContainer.value.scrollTop = 0; 
            }
        }
    } catch (error) {
        console.error("Error fetching new feedback:", error);
    }
}

async function checkNewFeedbackCount() {
    let afterTime = new Date().toISOString();
    let url = `https://hap-app-api.azurewebsites.net/messages/count?after=${afterTime}`;

    const options = {
        method: "GET",
        headers: { Authorization: `Bearer ${token.value}` },
    };

    try {
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            newFeedbackCount.value = data;
        }
    } catch (error) {
        console.error("Error checking new feedback count:", error);
    }
}

// Infinite scroll behavior
function handleScroll() {
    const container = feedbackContainer.value;
    if (!container) return;

 
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
        let lastFeedback = feedbackList.value[feedbackList.value.length - 1];
        if (lastFeedback) {
            fetchFeedback(lastFeedback.updatedAt, true);
        }
    }

    if (container.scrollTop === 0 && newFeedbackCount.value > 0) {
        fetchNewFeedback();
    }
}

onMounted(() => {
    fetchFeedback(); 
    feedbackContainer.value.addEventListener("scroll", handleScroll);

    const interval = setInterval(checkNewFeedbackCount, 10000);
    onUnmounted(() => clearInterval(interval));
});

</script>

<template>
  <div class="scrollable-feedback-container" ref="feedbackContainer">
    <button v-if="newFeedbackCount > 0" class="new-feedback-btn" @click="fetchNewFeedback">
      {{ newFeedbackCount }} New Messages
    </button>
    
    <Feedback 
      v-for="feedback in feedbackList" 
      :key="feedback.updatedAt" 
      :senderName="feedback.senderName" 
      :updatedAt="feedback.updatedAt" 
      :feedbackText="feedback.text" 
    />

    <p v-if="isLoading" class="loading-text">Loading...</p>
  </div>
</template>

<style scoped>
.scrollable-feedback-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
    background: #fff;
    position: relative;
}
.new-feedback-btn {
    width: 100%;
    background: #007bff;
    color: white;
    border: none;
    padding: 8px;
    cursor: pointer;
    margin-bottom: 10px;
    border-radius: 5px;
}
.new-feedback-btn:hover {
    background: #0056b3;
}
.loading-text {
    text-align: center;
    font-size: 14px;
    color: gray;
    padding: 10px 0;
}
</style>
