<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userId = localStorage.getItem('myUserId')
const token = localStorage.getItem('token');
const hostedExcursions = ref([]);
const participantExcursions = ref ([]);

async function getExcursions() {
  const url = 'https://excursions-api-server.azurewebsites.net/excursions';

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
      const allExcursions = data.excursions;

      hostedExcursions.value = [];
      participantExcursions.value = [];

      allExcursions.forEach(excursion => {
        if (excursion.host && excursion.host[0]._id === userId) {
          hostedExcursions.value.push(excursion);
        } else {
          participantExcursions.value.push(excursion);
        }
        localStorage.setItem("participantExcursions", participantExcursions)
        console.log(hostedExcursions.value)
        console.log(participantExcursions.value)
      });
    } else {
      console.error("Error fetching excursions:", response.status);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

async function leaveExcursion(excursionId) {
  const url = `https://excursions-api-server.azurewebsites.net/leave/excursions/${excursionId}`

  const options = {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  };

  try {
    const response = await fetch(url, options);
    if (response.status === 200) {
      console.log('User removed');
      location.reload()
    } else if (response.status === 400) {
      console.warn(`Bad Request`);
    } else {
      console.error(`Network Error`);
    }
  } catch (error) {
    console.error('Network error while inviting user:', error);
  }
}




getExcursions()
</script>

<template>
    <div class="excursion-container">
      <h1 class="heading">Shared Excursions</h1>
  
      <div class="excursion-list">
        <div
          v-for="excursion in participantExcursions"
          :key="excursion._id"
          class="excursion-card"
        >
          <div>
            <h2 class="excursion-title">{{ excursion.name }}</h2>
            <p class="excursion-description">{{ excursion.description }}</p>
            <p class="participants-count">
              👥 {{ excursion.participants.length }} participant<span v-if="excursion.participants.length !== 1">s</span>
            </p>
  
            <div v-if="excursion.trips && excursion.trips.length">
              <p class="trip-heading">🧭 Trips:</p>
              <ul class="trip-list">
                <li v-for="trip in excursion.trips" :key="trip._id" class="trip-item">
                  <span class="trip-name">{{ trip.name }}</span>
                  <span class="trip-dates">
                    ({{ new Date(trip.startDate).toLocaleDateString() }} - {{ new Date(trip.endDate).toLocaleDateString() }})
                  </span>
                </li>
              </ul>
            </div>
          </div>
  
          <button @click="leaveExcursion(excursion._id)" class="leave-button button">
            Leave Excursion
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script scoped>
  import { ref, onMounted } from 'vue';
  
  const participantExcursions = ref([]);

  </script>
  
  <style scoped>
  .excursion-container {
    padding: 2rem;
    background-color: #f9fafb;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .heading {
    font-size: 2rem;
    font-weight: bold;
    color: #2a322d;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .excursion-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 600px;
  }
  
  .excursion-card {
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    padding: 1.5rem;
    width: 100%;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: box-shadow 0.3s ease;
  }
  
  .excursion-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
  
  .excursion-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2a322d;
    margin-bottom: 0.5rem;
  }
  
  .excursion-description {
    color: #374151;
    margin-bottom: 0.75rem;
  }
  
  .participants-count {
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 1rem;
  }
  
  .trip-heading {
    font-weight: 600;
    color: #2a322d;
    margin-bottom: 0.5rem;
  }
  
  .trip-list {
    list-style: disc;
    padding-left: 1.25rem;
    margin: 0;
  }
  
  .trip-item {
    font-size: 0.9rem;
    color: #374151;
    margin-bottom: 0.25rem;
  }
  
  .trip-name {
    font-weight: 500;
  }
  
  .trip-dates {
    color: #9ca3af;
    font-size: 0.8rem;
    margin-left: 0.25rem;
  }
  
  .leave-button {
    color: #fff;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
    align-self: flex-start;
    font-weight: 600;
  }
  
  </style>
  