<script setup>
import { useRouter } from 'vue-router'
import { ref} from 'vue';

const router = useRouter()
const token = localStorage.getItem('token')

const name = ref()
const description = ref()
const hostedTrips = ref([])
const selectedTrips = ref([])  

async function createExcursion() {
    const data = {
        name: name.value,
        description: description.value,
        trips: selectedTrips.value 
    }

    const jsonData = JSON.stringify(data)   

    const url = 'https://excursions-api-server.azurewebsites.net/excursion'
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: jsonData,
    }

    let response = await fetch(url, options)

    if (response.status === 201) {
        const data = await response.json()
        location.reload()
        console.log(data)
    } else if (response.status === 400) {
        console.log("Invalid name or description")
    }
}

async function getTrips() {
  const url = 'https://excursions-api-server.azurewebsites.net/trips';
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  };

  try {
    const response = await fetch(url, options);
    if (response.status === 200) {
      const data = await response.json();
      hostedTrips.value = data.trips;
      console.log(hostedTrips.value)
    } else {
      console.error("Error fetching trips:", response.status);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

getTrips()
</script>

<template>
    <div>
        <main>
            <div class="background"></div>
            <section class="container center">
              
                <div class="form">    
                  <h1>Create Excursion</h1>    
                    <label for="name"><b>Name</b></label>
                    <input type="text" placeholder="Enter Excursion Name" v-model="name" name="name" id="name" required>

                    <label for="description"><b>Description</b></label>
                    <input type="text" placeholder="Enter Description" v-model="description" name="description" id="description" required>

                    
                    <label for="trips"><b>Select Hosted Trips</b></label>
                    <select id="trips" v-model="selectedTrips" multiple required>
                        <option v-for="trip in hostedTrips" :key="trip._id" :value="trip._id">
                            {{ trip.name }}
                        </option>
                    </select>

                    <p v-if="errorMessage" id="error-message" style="color: black; font-weight: bold;">{{ errorMessage }}</p>    
                    <button class="button" @click="createExcursion">Create</button>
                </div>
            </section>
        </main>
    </div>
</template>

<style scoped>

</style>
