<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Datepicker from 'vue3-datepicker';

const router = useRouter();

const token = localStorage.getItem('token');
const hostedTrips = ref([]);
const parks = ref([]);
const campgrounds = ref([]);
const thingsToDo = ref([]);
const selectedTrip = ref(null); 
const showModal = ref(false); 
const updatedTrip = ref({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  park: '',
  campground: '',
  thingstodo: []
}); 

// Fetch Trips, Parks, Campgrounds, and Things To Do
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
      fetchParkAndCampgroundDetails(); 
    } else {
      console.error("Error fetching trips:", response.status);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

async function fetchParkAndCampgroundDetails() {
  const parkUrl = 'https://excursions-api-server.azurewebsites.net/national-parks?limit=500';
  const parkOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const parkResponse = await fetch(parkUrl, parkOptions);
    if (parkResponse.status === 200) {
      const parkData = await parkResponse.json();
      parks.value = parkData.data; 
    } else {
      console.error("Error fetching parks:", parkResponse.status);
    }
  } catch (error) {
    console.error("Network error fetching parks:", error);
  }

  const campgroundUrl = 'https://excursions-api-server.azurewebsites.net/campgrounds?limit=700';
  const campgroundOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const campgroundResponse = await fetch(campgroundUrl, campgroundOptions);
    if (campgroundResponse.status === 200) {
      const campgroundData = await campgroundResponse.json();
      campgrounds.value = campgroundData.data;
    } else {
      console.error("Error fetching campgrounds:", campgroundResponse.status);
    }
  } catch (error) {
    console.error("Network error fetching campgrounds:", error);
  }

  const thingsToDoUrl = 'https://excursions-api-server.azurewebsites.net/things-to-do?limit=3500';
  const thingsToDoOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const thingsToDoResponse = await fetch(thingsToDoUrl, thingsToDoOptions);
    if (thingsToDoResponse.status === 200) {
      const thingsToDoData = await thingsToDoResponse.json();
      thingsToDo.value = thingsToDoData.data; 
    } else {
      console.error("Error fetching things to do:", thingsToDoResponse.status);
    }
  } catch (error) {
    console.error("Network error fetching things to do:", error);
  }
}

// Get Park Name
const getParkName = (parkId) => {
  const park = parks.value.find(p => p.id === parkId);
  return park ? park.fullName : 'Park information not available'; 
};

// Get Campground Name
const getCampgroundName = (campgroundId) => {
  const campground = campgrounds.value.find(c => c.id === campgroundId);
  return campground ? campground.name : 'Campground information not available'; 
};

// Get Things to Do Name
const getThingsToDoName = (thingId) => {
  const thing = thingsToDo.value.find(t => t.id === thingId);
  return thing ? thing.title : 'Activity name not available';
};

// Edit Trip function (opens modal with trip data)
const editTrip = (tripId) => {
  const trip = hostedTrips.value.find(t => t._id === tripId);
  if (trip) {
    selectedTrip.value = trip;

    updatedTrip.value = {
      name: trip.name || '',
      description: trip.description || '',
      startDate: trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : '',
      endDate: trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : '',
      park: trip.park || '',
      campground: trip.campground || '',
      thingstodo: trip.thingstodo || [],
    };

    showModal.value = true;
  }
};


// Submit Updated Trip
const updateTrip = async () => {
  const url = `https://excursions-api-server.azurewebsites.net/trip/${selectedTrip.value._id}`;
  
  // Send only editable fields
  const payload = {
    name: updatedTrip.value.name,
    description: updatedTrip.value.description,
    startDate: updatedTrip.value.startDate,
    endDate: updatedTrip.value.endDate,
    park: updatedTrip.value.park,
    campground: updatedTrip.value.campground,
    thingstodo: updatedTrip.value.thingstodo,
  };

  const options = {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  };

  console.log('Payload sent to server:', payload);

  try {
    const response = await fetch(url, options);
    if (response.status === 200) {
      const updatedData = await response.json();
      const index = hostedTrips.value.findIndex(t => t._id === updatedData._id);
      if (index !== -1) {
        hostedTrips.value[index] = updatedData;
      }
      showModal.value = false;
      console.log('Trip updated successfully');
      location.reload()
    } else {
      console.error("Error updating trip:", response.status);
    }
  } catch (error) {
    console.error("Network error updating trip:", error);
  }
};

// Delete Trip function
const deleteTrip = async (tripId) => {
  const url = `https://excursions-api-server.azurewebsites.net/trip/${tripId}`;
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (response.status === 200) {
      hostedTrips.value = hostedTrips.value.filter(trip => trip._id !== tripId);
      console.log('Trip deleted successfully');
    } else {
      console.error("Error deleting trip:", response.status);
    }
  } catch (error) {
    console.error("Network error deleting trip:", error);
  }
};

const closeModal = () => {
  showModal.value = false;
};

onMounted(async () => {
  await getTrips();
});
</script>

<template>
    <div class="trip-container">
      <div v-if="hostedTrips.length === 0" class="no-trips">
        <p>No trips available.</p>
      </div>
      <div v-else>
        <div v-for="trip in hostedTrips" :key="trip._id" class="trip-card">
          <h2>{{ trip.name }}</h2>
          <p><strong>Description:</strong> {{ trip.description }}</p>
          <p><strong>Start Date:</strong> {{ new Date(trip.startDate).toLocaleDateString() }}</p>
          <p><strong>End Date:</strong> {{ new Date(trip.endDate).toLocaleDateString() }}</p>
  
          <p><strong>Things to Do:</strong></p>
          <ul>
            <li v-for="thing in trip.thingstodo" :key="thing">{{ getThingsToDoName(thing) }}</li>
          </ul>
  
          <p v-if="trip.park">
            <strong>Park:</strong> 
            {{ getParkName(trip.park) }}
          </p>
  
          <p v-if="trip.campground">
            <strong>Campground:</strong> 
            {{ getCampgroundName(trip.campground) }}
          </p>
  
          <div class="buttons">
            <button class="button" @click="editTrip(trip._id)">Edit</button>
            <button class="button" @click="deleteTrip(trip._id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Edit Trip Modal -->
    <Transition name="modal">
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <h3>Edit Trip</h3>
      <form @submit.prevent="updateTrip">
        <label for="name">Name:</label>
        <input v-model="updatedTrip.name" type="text" id="name" required />

        <label for="description">Description:</label>
        <textarea v-model="updatedTrip.description" id="description" required></textarea>

        <label for="startDate"><b>Start Date</b></label>
        <Datepicker 
          v-model="updatedTrip.startDate" 
          format="yyyy-MM-dd" 
          id="startDate" 
          :required="true" 
          @update:modelValue="updatedTrip.startDate = $event"
        />

        <label for="endDate"><b>End Date</b></label>
        <Datepicker 
          v-model="updatedTrip.endDate" 
          format="yyyy-MM-dd" 
          id="endDate" 
          :required="true" 
          @update:modelValue="updatedTrip.endDate = $event"
        />

        <label for="park">Park:</label>
        <select v-model="updatedTrip.park" id="park" required>
          <option v-for="park in parks" :key="park.id" :value="park.id">{{ park.fullName }}</option>
        </select>

        <label for="campground">Campground:</label>
        <select v-model="updatedTrip.campground" id="campground" required>
          <option v-for="campground in campgrounds" :key="campground.id" :value="campground.id">{{ campground.name }}</option>
        </select>

        <label for="thingstodo">Things to Do:</label>
        <select v-model="updatedTrip.thingstodo" id="thingstodo" multiple>
          <option v-for="thing in thingsToDo" :key="thing.id" :value="thing.id">{{ thing.title }}</option>
        </select>

        <div class="modal-actions">
          <button class="button" type="button" @click="closeModal">Cancel</button>
          <button class="button" type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</Transition>
</template>

<style scoped>
/* Container Styling */
.trip-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.no-trips {
  margin-top: 2rem;
  color: #6b7280;
  font-size: 1.1rem;
}

/* Trip Cards */
.trip-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.trip-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.trip-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.trip-card p {
  margin: 0.25rem 0;
  color: #374151;
  line-height: 1.4;
}

.trip-card ul {
  padding-left: 1.25rem;
  margin: 0.5rem 0;
}

.trip-card li {
  list-style-type: disc;
  color: #4b5563;
}

/* Button Styles */
.buttons {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}


/* Modal Overlay */
.modal-overlay {
  z-index: 13;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
  max-height: 90vh;
  overflow-y: auto;  
}

.modal h3 {
  font-size: 1.5rem;
  color: #111827;
  margin-bottom: 1rem;
}

/* Inputs, Textareas, and Selects */
.modal input,
.modal textarea,
.modal select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  color: #111827;
}

.modal textarea {
  resize: vertical;
  min-height: 80px;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* Fade animation */
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
