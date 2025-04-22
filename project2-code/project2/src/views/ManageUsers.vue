<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userId = localStorage.getItem('myUserId');
const token = localStorage.getItem('token');
const excursionId = localStorage.getItem('currentExId');

const allUsers = ref([]);
const participants = ref([]);
const notParticipants = computed(() => {
  const ids = Array.isArray(participants.value) ? participants.value.map(p => p._id) : [];
  return allUsers.value.filter(user => !ids.includes(user._id));
});

async function getUsers(q = '') {
  const baseUrl = 'https://excursions-api-server.azurewebsites.net/users?limit=200';
  const url = q
    ? `${baseUrl}&q=${encodeURIComponent(q)}`
    : baseUrl;

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
      allUsers.value = data;
    } else {
      console.error('Error fetching users:', response.status);
    }
  } catch (error) {
    console.error('Network error while fetching users:', error);
  }
}


async function getExcursion(id) {
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
      participants.value = data.excursion[0].participants;
      console.log(data.excursion)
    } else {
      console.error('Error fetching excursion:', response.status);
    }
  } catch (error) {
    console.error('Network error while fetching excursion:', error);
  }
}

const searchQuery = ref('');

function handleSearch() {
  getUsers(searchQuery.value.trim());
}


onMounted(() => {
  getUsers();
  getExcursion(excursionId);
});

async function inviteUser(userId) {
  const url = `https://excursions-api-server.azurewebsites.net/share/excursion/${excursionId}`;

  const payload = {
    friendId: userId
  };

  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload)
  };

  try {
    const response = await fetch(url, options);
    if (response.status === 201) {
      console.log(`Successfully invited user with ID: ${userId}`);
      allUsers.value = allUsers.value.filter(user => user._id !== userId);
    } else if (response.status === 409) {
      console.warn(`User with ID ${userId} is already invited.`);
    } else {
      console.error(`Error inviting user: ${response.status}`);
    }
  } catch (error) {
    console.error('Network error while inviting user:', error);
  }
}


async function removeUser(userId) {
  const url = `https://excursions-api-server.azurewebsites.net/remove/excursions/${excursionId}`

  const options = {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({participantId: `${userId}`})
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
</script>


<template>
    <div class="user-container">
      <!-- Participants Column -->
      <div class="user-column">
        <h2>Participants</h2>
        <div class="user-list">
          <div v-for="user in participants" :key="user._id" class="user-card">
            <p><strong>{{ user.userName }}</strong></p>
            <p>{{ user.firstName }} {{ user.lastName }}</p>
            <p>{{ user.email }}</p>
            <button class="button" @click="removeUser(user._id)">Remove</button>
          </div>
        </div>
      </div>
  
      <!-- Non-Participants Column -->
      <div class="user-column">
        <div class="search-section">
        <input
        type="text"
        v-model="searchQuery"
        placeholder="Search users by name..."
        @input="handleSearch"
        />
        </div>

        <h2>Invite Users</h2>
        <div class="user-list">
          <div v-for="user in notParticipants" :key="user._id" class="user-card">
            <p><strong>{{ user.userName }}</strong></p>
            <p>{{ user.firstName }} {{ user.lastName }}</p>
            <p>{{ user.email }}</p>
            <button class="button" @click="inviteUser(user._id)">Invite</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  

<style scoped>
.user-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
  padding: 2rem;
}

.user-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.05);
}

button {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s ease;
}

.search-section {
  margin-bottom: 1rem;
}

.search-section input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

</style>