<script setup>
import Header from '../components/Header.vue'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()

const token = localStorage.getItem('token');
const parkCode = ref('');
const stateCode = ref('');
const query = ref('');
const start = ref(0);
const limit = 12;
const thingsToDo = ref([]);
const totalResults = ref(0); 
const parkCodesList = ref([]); 
const stateCodesList = ref([]);


function buildQueryParams() {
    const params = new URLSearchParams();
    params.append('limit', limit);
    params.append('start', start.value.toString());

    if (parkCode.value.trim()) params.append('parkCode', parkCode.value.trim().split(' ').join(','));
    if (stateCode.value.trim()) params.append('stateCode', stateCode.value.trim().split(' ').join(','));
    if (query.value.trim()) params.append('q', query.value.trim());

    return params.toString();
}

async function fetchCodes() {
    const url = "https://excursions-api-server.azurewebsites.net/national-parks/codes";

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    };

    try {
        let response = await fetch(url, options);
        if (response.status === 200) {
            const data = await response.json();

            parkCodesList.value = data.parks.codes; 
            stateCodesList.value = data.states.codes;
            console.log("Fetched codes:", data);
        } else {
            console.error("Error fetching codes:", response.status);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}


async function getThingsToDo() {
    const url = `https://excursions-api-server.azurewebsites.net/things-to-do?${buildQueryParams()}`;

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    };

    let response = await fetch(url, options);

    if (response.status === 200) {
        const data = await response.json();
        thingsToDo.value = data.data;
        totalResults.value = parseInt(data.total); 
        console.log(thingsToDo.value);
    } else {
        console.log("Error fetching data: ", response.status);
    }
}

function getNextthingsToDo() {
    if (start.value + limit < totalResults.value) {
        start.value += limit;
        getThingsToDo();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

}

onMounted(() => {
    fetchCodes();
    getThingsToDo();
});
</script>

<template>
    <div>

        <div @click="router.back()">
            ◁ Back
        </div>
        <br>

        <div class="search-container">
        <!-- State Code Dropdown -->
            <select v-model="stateCode">
                <option value="">Select a State</option>
                <option v-for="state in stateCodesList" :key="state" :value="state">{{ state }}</option>
            </select>

        <!-- Park Code Dropdown -->
            <select v-model="parkCode">
                <option value="">Select a Park Code</option>
                <option v-for="code in parkCodesList" :key="code" :value="code">{{ code }}</option>
            </select>

            <input v-model="query" placeholder="Search Term" />
            <button @click="getThingsToDo">Search</button>
        </div>

        <div v-if="thingsToDo.length > 0" class="things-to-do-list">
        <div v-for="activity in thingsToDo" :key="activity.id" class="activity-card">
        
        <img 
            v-if="activity.images.length > 0" 
            :src="activity.images[0].url" 
            :alt="activity.images[0].altText || activity.title" 
            class="activity-image"
        />

        <div class="activity-content">
            <h3 class="activity-title">{{ activity.title }}</h3>
            <p class="activity-description">{{ activity.shortDescription }}</p>
            
            <p v-if="activity.images.length > 0 && activity.images[0].caption" class="activity-caption">
                {{ activity.images[0].caption }}
            </p>

            <p v-if="activity.location" class="activity-caption">
              Location:  {{ activity.location}}
            </p>

            <a :href="activity.url" target="_blank" class="activity-link">Learn More</a>
        </div>
    </div>
</div>


        <!-- Next Button -->
        <div v-if="start + limit < totalResults" class="next-button-container">
            <button @click="getNextthingsToDo" class="next-button">Next</button>
        </div>

        <p v-else class="no-results">No results found.</p>
    </div>
</template>


<style scoped>

/* Search container styles */
.search-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.search-container select,
.search-container input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search-container button {
  padding: 8px 12px;
  background-color: #33363d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-container button:hover {
  background-color: #484e5e;
}

/* List of activities */
.things-to-do-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* Each activity card */
.activity-image {
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 300px; 
    object-fit: contain; 
    margin: 0 auto; 
    display: block;
    border-radius: 10px; 
}


/* Each activity card */
.activity-card {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    border-radius: 10px; 
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border: 1px solid #ddd; 
    padding: 10px;
}

/* Hover effect for the card */
.activity-card:hover {
    transform: translateY(-5px);
}


/* Image inside activity card */
.activity-image {
    width: 100%;
    height: 250px; 
    object-fit: cover;
    display: block;
}


/* Content inside activity card */
.activity-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.activity-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.activity-description {
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
}

.activity-caption {
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
}

/* "Learn more" link */
.activity-link {
  display: inline-block;
  margin-top: auto;
  padding: 8px 12px;
  background-color: #33363d;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  transition: background 0.3s;
}

.activity-link:hover {
  background-color: #484e5e;
}

/* No results found text */
.no-results {
  text-align: center;
  font-size: 16px;
  color: #777;
  margin-top: 20px;
}

/* Next button */
.next-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.next-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #33363d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.next-button:hover {
  background-color: #484e5e;
}

</style>
