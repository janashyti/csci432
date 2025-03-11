<script setup>
import {ref} from 'vue'
const token = localStorage.getItem("token")

const feedback = ref()

async function postFeedback(){
    const url = 'https://hap-app-api.azurewebsites.net/message'
    const jsonData = JSON.stringify({ text: feedback.value })
    console.log(feedback.value)

    const options = {
		method: "POST",
		headers: {
            'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
        body: jsonData,
	}

	let response = await fetch(url, options)

    if(response.status === 201){
        alert("Your feedback has been submitted: " + feedback.value)
        feedback.value = ""
    }

    else if(response.status === 400){
        console.log("Bad Request")
        alert("Please try again!")
    }
    else if(response.status === 401){
        console.log("Unauthorized")
    }
    else if(response.status === 500){
        console.log("internal server error")
        alert("There was an error trying to save your response. Please try again later!")
    }
}

</script>
<template> 
<section>
    <h2>Share your feedback</h2>
    <br>
    <div class="input-container">
        <input v-model="feedback" type="text">
        <button class="button" @click="postFeedback">+</button> 
    </div>
</section> 
</template>
<style scoped>
    h2{
        font-weight:600;
    }
    .button{
        padding: 5px 10px; 
        font-size: 16px;
        width: 35px; 
        height: 35px;
    }
    input{
        width: 300px;
        padding: 5px;
        margin-right: 5px;
    }
    section{
        text-align: center;
    }
    

</style>