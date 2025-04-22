<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted} from 'vue';
import Datepicker from 'vue3-datepicker';


const router = useRouter()
const token = localStorage.getItem('token')

const name = ref()
const description = ref()
const startDate = ref()
const endDate = ref()
const park = ref()
const campGround = ref()
const thingsToDo = ref([])

const stateCodesList = ref([]);
const parkCodesList = ref([]);
const campgroundList = ref([]);
const thingsToDoList = ref([]);

const selectedStateCode = ref('');
const selectedParkCode = ref('');
const selectedCampground = ref('');
const selectedThingsToDo = ref('');

const selectedParkId = ref('');


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
        } else {
            console.error("Error fetching codes:", response.status);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

async function fetchParksByState(stateCode) {
  console.log(stateCode)
  const url = `https://excursions-api-server.azurewebsites.net/national-parks?limit=35&stateCode=${stateCode}`;
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
      console.log(data.data)
      parkCodesList.value = data.data.map(park => ({
        id: park.id,  
        parkCode: park.parkCode,  
        fullName: park.fullName
      }));
      //return data.data;
    } else {
      console.error("Error fetching parks:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Network error:", error);
    return [];
  }
}


async function fetchCampgroundsAndThingsToDo(parkCode) {
  console.log(parkCode)
  const campgroundUrl = `https://excursions-api-server.azurewebsites.net/campgrounds?limit=35&parkCode=${parkCode}`;
  const thingsToDoUrl = `https://excursions-api-server.azurewebsites.net/things-to-do?limit=60&parkCode=${parkCode}`;

  try {
    const campgroundResponse = await fetch(campgroundUrl, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });

    const thingsToDoResponse = await fetch(thingsToDoUrl, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });

    if (campgroundResponse.status === 200 && thingsToDoResponse.status === 200) {
      const campgroundData = await campgroundResponse.json();
      const thingsToDoData = await thingsToDoResponse.json();
      
      campgroundList.value = campgroundData.data
      thingsToDoList.value = thingsToDoData.data
    } else {
      console.error("Error fetching campgrounds or things to do");
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

async function handleStateChange() {
  console.log("Selected state:", selectedStateCode.value);
  if (selectedStateCode.value) {
    console.log(selectedStateCode.value)
    const parks = await fetchParksByState(selectedStateCode.value);
    parkCodesList.value = parks.map(park => ({
      parkCode: park.parkCode,
      fullName: park.fullName
    }));
  }
}


async function handleParkChange() {
  if (selectedParkCode.value) {
    const selectedPark = parkCodesList.value.find(park => park.parkCode === selectedParkCode.value);
    selectedParkId.value = selectedPark ? selectedPark.id : '';  
    await fetchCampgroundsAndThingsToDo(selectedParkCode.value);  
  }
}

onMounted(() => {
  fetchCodes()
});

async function createTrip(){

    const data = {
        name: name.value,
        description: description.value,
        startDate: startDate.value,
        endDate: endDate.value,
        park: selectedParkId.value,
        campground: campGround.value,
        thingstodo: thingsToDo.value
    }

    const jsonData = JSON.stringify(data)   
    console.log(data)

    const url = 'https://excursions-api-server.azurewebsites.net/trip'
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
}
else if (response.status === 400) {
        console.log("Invalid name or description")
    }
}

</script>
<template>
    <div>
      <main>
        <div class="background"></div>
        <section class="container center">
          <div class="form">
            <h1>Create Trip</h1>
            <label for="name"><b>Name</b></label>
            <input type="text" placeholder="Enter Trip Name" v-model="name" name="name" id="name" required>
  
            <label for="description"><b>Description</b></label>
            <input type="text" placeholder="Enter Description" v-model="description" name="description" id="description" required>
  
            <label for="startDate"><b>Start Date</b></label>
            <datepicker v-model="startDate" format="yyyy-MM-dd" id="startDate" :required="true"></datepicker>
  
            <label for="endDate"><b>End Date</b></label>
            <datepicker v-model="endDate" format="yyyy-MM-dd" id="endDate" :required="true"></datepicker>
  
            <!-- Select State -->
            <label for="state"><b>Select State</b></label>
            <select v-model="selectedStateCode" @change="handleStateChange" id="state" required>
              <option value="" disabled>Select a State</option>
              <option v-for="state in stateCodesList" :key="state" :value="state">
                {{state}}
              </option>
            </select>
  
            <!-- Select Park -->
            <label for="park"><b>Select Park</b></label>
            <select v-model="selectedParkCode" @change="handleParkChange" id="park" required>
            <option value="" disabled>Select a Park</option>
            <option v-for="park in parkCodesList" :key="park.id" :value="park.parkCode"> 
              {{ park.fullName }}
            </option>
            </select>
           <!-- Select Campground -->
          <label for="campground"><b>Select Campground</b></label>
          <select v-model="campGround" id="campground">
          <option value="" disabled>Select a Campground</option>
          <option v-for="campground in campgroundList" :key="campground.id" :value="campground.id">
          {{ campground.name }}
          </option>
          </select>

        <!-- Select Things To Do -->
        <label for="thingsToDo"><b>Select Things To Do</b></label>
        <select v-model="thingsToDo" id="thingsToDo">
        <option value="" disabled>Select an Activity</option>
        <option v-for="thing in thingsToDoList" :key="thing.id" :value="thing.id">
          {{ thing.title }}
        </option>
        </select>

  
            <p v-if="errorMessage" id="error-message" style="color: black; font-weight: bold;">
              {{ errorMessage }}
            </p>
  
            <button class="button" @click="createTrip">Create</button>
          </div>
        </section>
      </main>
    </div>
  </template>
  