<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userId = localStorage.getItem('myUserId')
const token = localStorage.getItem('token');
const hostedExcursions = ref([]);
const participantExcursions = ref ([]);
const hostedTrips = ref([]); 
const showModal = ref(false);
const editingExcursionId = ref(null);
const ownerId = ref('')

const form = ref({
  name: '',
  description: '',
  trips: [],
});

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
      console.log("Fetched trips:", hostedTrips.value);
    } else {
      console.error("Error fetching trips:", response.status);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

onMounted(() => {
  getExcursions();
  getTrips();  
});

async function editExcursion(id) {
  const url = `https://excursions-api-server.azurewebsites.net/excursion/${id}`;

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
      form.value.name = data.excursion[0].name;
      form.value.description = data.excursion[0].description;
      form.value.trips = data.excursion.trips || [];
      editingExcursionId.value = id;
      showModal.value = true;
    } else {
      console.error('Error fetching excursion:', response.status);
    }
  } catch (error) {
    console.error('Network error while fetching excursion:', error);
  }
}


async function updateExcursion() {
  const url = `https://excursions-api-server.azurewebsites.net/excursion/${editingExcursionId.value}`;

  const options = {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: form.value.name,
      description: form.value.description,
      trips: form.value.trips,  
    }),
  };

  try {
    const response = await fetch(url, options);
    if (response.status === 200) {
      alert('Excursion updated successfully!');
      showModal.value = false;
      await getExcursions();  
    } else {
      console.error('Error updating excursion:', response.status);
      alert('Failed to update excursion.');
    }
  } catch (error) {
    console.error('Network error while updating excursion:', error);
    alert('Network error.');
  }
}

async function deleteExcursion(id) {
  const confirmed = confirm('Are you sure you want to delete this excursion?');
  if (!confirmed) return;

  const url = `https://excursions-api-server.azurewebsites.net/excursion/${id}`;

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  };

  try {
    const response = await fetch(url, options);
    if (response.status === 200) {
      alert('Excursion deleted successfully!');
      hostedExcursions.value = hostedExcursions.value.filter(excursion => excursion._id !== id);
    } else {
      console.error('Error deleting excursion:', response.status);
      alert('Failed to delete excursion.');
    }
  } catch (error) {
    console.error('Network error while deleting excursion:', error);
    alert('Network error.');
  }
}

function goToManage(id) {
  router.push('manage');
  localStorage.setItem("currentExId", id)
}

</script>

<template>

  <div class="excursions-container">
    <h1>Hosted Excursions</h1>

    <div v-if="hostedExcursions.length">
      <div 
        v-for="(excursion, index) in hostedExcursions" 
        :key="excursion._id" 
        class="excursion-card"
      >
        <h2> Name: {{ excursion.name }}</h2>
        <p>Description: {{ excursion.description }}</p>
        
        <h3>Trips:</h3>
        <ul>
          <li v-if="excursion.trips.length === 0">No trips available</li>
          <li v-else v-for="(trip, i) in excursion.trips" :key="i">
            {{ trip.name }}  
          </li>
        </ul>

        <div class="buttons">
          <button @click="editExcursion(excursion._id)" class="edit-button button">Edit</button>
          <button @click="deleteExcursion(excursion._id)" class="delete-button button">Delete</button>
          <button @click="goToManage(excursion._id)" class="delete-button button">Manage</button>
        </div>
      </div>
    </div>

    <div v-else>
      <p>No hosted excursions :(</p>
    </div>
  </div>


  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h2>Edit Excursion</h2>

      <label>Name:</label>
      <input v-model="form.name" type="text" />

      <label>Description:</label>
      <textarea v-model="form.description"></textarea>

      <label>Trips:</label>
      <select v-model="form.trips" multiple>
        <option v-for="trip in hostedTrips" :key="trip._id" :value="trip._id">
          {{ trip.name }}
        </option>
      </select>

      <div class="modal-buttons">
        <button class="button" @click="updateExcursion">Save</button>
        <button class="button" @click="showModal = false">Cancel</button>
      </div>
    </div>
  </div>

</template>


<style scoped>
.excursions-container {
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.excursions-container h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
}

.excursion-card {
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  width: 100%;
  max-width: 600px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  transition: box-shadow 0.3s ease;
}

.excursion-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.excursion-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2a322d;
  margin-bottom: 0.5rem;
}

.excursion-card p {
  color: #374151;
  margin-bottom: 0.75rem;
}

.excursion-card h3 {
  font-weight: 600;
  color: #2a322d;
  margin-bottom: 0.5rem;
}

.excursion-card ul {
  list-style: disc;
  padding-left: 1.25rem;
  margin: 0 0 1rem 0;
}

.excursion-card li {
  font-size: 0.9rem;
  color: #374151;
  margin-bottom: 0.25rem;
}

.buttons {
  display: flex;
  gap: 0.5rem;
}


.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
}

.modal-content h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.modal-content label {
  margin-top: 1rem;
  font-weight: 500;
  color: #374151;
}

.modal-content input,
.modal-content textarea,
.modal-content select {
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  width: 100%;
  font-size: 1rem;
  font-family: inherit;
  color: #111827;
}

.modal-content textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  gap: 0.75rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

