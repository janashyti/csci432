<script setup>
import Feedback from "../components/Feedback.vue"; 
import ScrollableContainer from "../components/ScrollableContainer.vue";
import {ref} from 'vue'
const feedbackList = ref([])
const fetchLimit = 15; 
const newFeedbackCount = ref(0);

const token = localStorage.getItem("token")
    async function getFeedback(){
        let beforeTime = new Date().toISOString(); 
        let url = `https://hap-app-api.azurewebsites.net/messages?limit=15&before=${beforeTime}`;
        const options = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	let response = await fetch(url, options)
    if (response.status === 200) {
        const data = await response.json()
        feedbackList.value = data
        
    }    
    else if (response.status === 401) {
         console.log("Unauthorized")
    }

	else if (response.status === 500) {
         console.log("Internal server error")
    }
    }
    getFeedback()

    async function fetchOlderFeedback() {
        let lastFeedback = feedbackList.value[feedbackList.value.length - 1];
        let beforeTime = lastFeedback ? lastFeedback.updatedAt : new Date().toISOString();
        let url = `https://hap-app-api.azurewebsites.net/messages?limit=${fetchLimit}&before=${beforeTime}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
        const data = await response.json();
        feedbackList.value.push(...data);
        }
    }


    async function fetchNewFeedback(countOnly = false) {
        let afterTime = feedbackList.value.length > 0 ? feedbackList.value[0].updatedAt : new Date().toISOString();
        let url = `https://hap-app-api.azurewebsites.net/messages${countOnly ? "/count" : ""}?limit=${fetchLimit}&after=${afterTime}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Fetched New Messages:", data);

            if (countOnly) {
            if (data) {
                newFeedbackCount.value = data.total; 
                return data;
            } else {
                console.warn("Unexpected API response for count:", data);
                newFeedbackCount.value = 0; 
            }
            } else {
            if (Array.isArray(data) && data.length > 0) {
                feedbackList.value.unshift(...data); 
                newFeedbackCount.value -= data.length; 
                return data;
            }
            console.warn("No new messages received.");
            }
        }
        return [];
    }


</script>
<template> 
    <div>
    <ScrollableContainer 
  :items="feedbackList"
  :fetchOlderItems="fetchOlderFeedback"
  :fetchNewItems="fetchNewFeedback"
  :itemComponent="Feedback"
  :itemKey="'updatedAt'"
  :newItemCount="newFeedbackCount"  
/>
  </div>
</template>