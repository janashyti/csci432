<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js';
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { setUser } = userStore
const { firstName, lastName, userName, email, token, wholeName } = storeToRefs(userStore)


//const token = localStorage.getItem("token")
const myUserId = localStorage.getItem("myUserId")
const userId = ref(route.params.userId) 
//const userName = ref(route.query.name)  
const newMessage = ref("")
const messages = ref([])
let intervalId = null
let initialLoad = true 

// Fetch private messages
async function getMessages() {
    try {
        const url = `https://hap-app-api.azurewebsites.net/messages/${userId.value}`;
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.value}`
            }
        };

        let response = await fetch(url, options);
        if (response.ok) {
            let fetchedMessages = await response.json();
            messages.value = fetchedMessages.reverse();

            if (initialLoad) {
                scrollToBottom();
                initialLoad = false; 
            }
        } else {
            console.error("Failed to fetch messages");
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}

// Send a new message
async function sendMessage() {
    if (!newMessage.value.trim()) return;

    try {
        const url = `https://hap-app-api.azurewebsites.net/message/${userId.value}`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.value}`
            },
            body: JSON.stringify({ text: newMessage.value })
        };

        let response = await fetch(url, options);
        if (response.ok) {
            const sentMessage = await response.json();
            
            messages.value.push({
                ...sentMessage,  
                senderId: myUserId, 
            });

            newMessage.value = "";
            getMessages();
            scrollToBottom(); 
        } else {
            console.error("Failed to send message");
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// Scroll to bottom
function scrollToBottom() {
    setTimeout(() => {
        const messagesContainer = document.querySelector(".messages");
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, 100);
}


onMounted(() => {
    getMessages();
    intervalId = setInterval(getMessages, 1000); 
});

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
});

</script>
<template>
    <div>
    <div class="flex align-center" @click="router.back()">◁</div>
    <div class="chat-container">
        <h2>Chat with {{ userName }}</h2>
        
        <div class="messages">
            <div v-for="msg in messages" :key="msg.messageId" 
                :class="{'sent': msg.senderId === myUserId, 'received': msg.senderId !== myUserId}">
                <p><strong>{{ msg.senderId === myUserId ? 'You' : userName }}:</strong> {{ msg.text }}</p>
            </div>
        </div>

        <div class="message-input">
            <input v-model="newMessage" type="text" placeholder="Type a message..." @keyup.enter="sendMessage"/>
            <button @click="sendMessage">Send</button>
        </div>
    </div>
</div>
</template>

<style scoped>
.chat-container {
    max-width: 500px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #f9f9f9;
}

.messages {
    height: 300px;
    overflow-y: auto;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
}

.sent {
    text-align: right;
    background-color: #d1e7ff;
    padding: 8px;
    border-radius: 10px;
    margin: 5px 0;
}

.received {
    text-align: left;
    background-color: #f1f1f1;
    padding: 8px;
    border-radius: 10px;
    margin: 5px 0;
}

.message-input {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.message-input input {
    flex: 1;
    padding: 8px;
}

.message-input button {
    padding: 8px;
}
</style>
