<script setup>
import Header from '../components/Header.vue'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()

const token = localStorage.getItem('token');
const dropdownVisible = ref(false);
const parkCode = ref('');
const stateCode = ref('');
const query = ref('');
const start = ref(0);
const limit = 12;
const parks = ref([]);
const totalResults = ref(0); 
const parkCodesList = ref([]); 
const stateCodesList = ref([]);




function buildQueryParams() {
    const params = new URLSearchParams();
    params.append('limit', limit);
    params.append('start', start.value.toString()); 

    if (parkCode.value.trim()) params.append('parkCode', parkCode.value.trim()); 
    if (stateCode.value.trim()) params.append('stateCode', stateCode.value.trim());
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


async function getParks() {
    const url = `https://excursions-api-server.azurewebsites.net/national-parks/summary?${buildQueryParams()}`;

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
        parks.value = data.data;
        totalResults.value = parseInt(data.total); 
        console.log(parks.value);
    } else {
        console.log("Error fetching data: ", response.status);
    }
}

function getNextParks() {
    if (start.value + limit < totalResults.value) {
        start.value += limit;
        getParks();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

}

onMounted(() => {
    fetchCodes();
    getParks();
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
            <button @click="getParks">Search</button>
        </div>

        <div v-if="parks.length > 0" class="parks-list">
            <div v-for="park in parks" :key="park.id" class="park-card">
                <div class="park-content">
                    <h3 class="park-title">{{ park.fullName }}</h3>
                    <p class="park-description">{{ park.description }}</p>
                    <small class="park-code">Code: {{ park.parkCode }}</small>
                    <br />
                    <small class="park-states">Located in: {{ park.states }}</small>
                    <br />
                    <a :href="park.url" target="_blank" class="park-link">Visit Park Website</a>
                </div>
            </div>
        </div>

        <!-- Next Button -->
        <div v-if="start + limit < totalResults" class="next-button-container">
            <button @click="getNextParks" class="next-button">Next</button>
        </div>

        <p v-else class="no-results">No results found.</p>
    </div>
</template>


<style scoped>

.search-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.search-container input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.parks-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.park-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 15px;
    transition: transform 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.park-card:hover {
    transform: translateY(-5px);
}

.park-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
}

.park-description {
    font-size: 14px;
    color: #555;
    margin-bottom: 12px;
}

.park-code {
    font-size: 12px;
    color: #888;
}

.park-link {
    display: inline-block;
    margin-top: 10px;
    padding: 8px 12px;
    background-color:rgb(51, 54, 45);
    color: white;
    text-decoration: none;
    border-radius: 5px;
    text-align: center;
    font-size: 14px;
    transition: background 0.3s;
}

.park-link:hover {
    background-color:rgb(72, 78, 62);
}

.no-results {
    text-align: center;
    font-size: 16px;
    color: #777;
    margin-top: 20px;
}

.next-button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.next-button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: rgb(51, 54, 45);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.next-button:hover {
    background-color: rgb(72, 78, 62);
}

</style>