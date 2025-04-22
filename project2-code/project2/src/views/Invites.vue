<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userId = localStorage.getItem('myUserId');
const token = localStorage.getItem('token');

const invites = ref([]);
const incomingInvites = ref([]);
const outgoingInvites = ref([]);

async function getInvites() {
  const url = 'https://excursions-api-server.azurewebsites.net/share/excursions';

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
      invites.value = data.excursionInvites;

      filterInvites();

      console.log("All Invites:", invites.value);
      console.log("Incoming:", incomingInvites.value);
      console.log("Outgoing:", outgoingInvites.value);
    } else {
      console.error('Error fetching invites:', response.status);
    }
  } catch (error) {
    console.error('Network error while fetching invites:', error);
  }
}

function filterInvites() {
  incomingInvites.value = invites.value.filter(invite => invite.sender[0]._id !== userId);
  outgoingInvites.value = invites.value.filter(invite => invite.sender[0]._id === userId);
}



async function acceptInvite(inviteId) {
  const url = `https://excursions-api-server.azurewebsites.net/share/excursions/${inviteId}`

  const options = {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      'isAccepted' : true  
    }),
  }

  try {
    const response = await fetch(url, options);
    if (response.status === 200) {
      console.log("Accepted")
      location.reload()
    } else {
      console.error('Error updating invite:', response.status);
      alert('Failed to update invite.');
    }
  } catch (error) {
    console.error('Network error while updating invite:', error);
    alert('Network error.');
  }
}

async function declineInvite(inviteId) {
  const url = `https://excursions-api-server.azurewebsites.net/share/excursions/${inviteId}`

  const options = {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      'isAccepted' : false  
    }),
  }

  try {
    const response = await fetch(url, options);
    if (response.status === 200) {
      console.log("Declined")
      location.reload()
    } else {
      console.error('Error updating invite:', response.status);
      alert('Failed to update invite.');
    }
  } catch (error) {
    console.error('Network error while updating invite:', error);
    alert('Network error.');
  }
}

async function revokeInvite(inviteId) {
   const url = `https://excursions-api-server.azurewebsites.net/share/excursions/${inviteId}`

   const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  try {
    const response = await fetch(url, options);
    if (response.status === 200) {
      console.log("deleted")
      location.reload()
    } else {
      console.error('Error fetching invites:', response.status);
    }
  } catch (error) {
    console.error('Network error while fetching invites:', error);
  }
}

onMounted(() => {
  getInvites();
});
</script>


<template>

<div class="back-button button" @click="router.back()">
            ◁ Back
        </div>
        <br><br>

    <div class="invite-section">
      <h2>Incoming Invites</h2>
      <div v-if="incomingInvites.length === 0">No incoming invites.</div>
      <div v-for="invite in incomingInvites" :key="invite._id" class="invite-card">
        <p><strong>From:</strong> {{ invite.sender[0].firstName }} {{ invite.sender[0].lastName }}</p>
        <p><strong>Excursion:</strong> {{ invite.excursion[0].name }}</p>
        <button class="button" @click="acceptInvite(invite._id)">Accept</button>
        <button class="button" @click="declineInvite(invite._id)">Decline</button>
      </div>
  
      <h2>Outgoing Invites</h2>
      <div v-if="outgoingInvites.length === 0">No outgoing invites.</div>
      <div v-for="invite in outgoingInvites" :key="invite._id" class="invite-card">
        <p><strong>To:</strong> {{ invite.receiver[0].firstName }} {{ invite.receiver[0].lastName }}</p>
        <p><strong>Excursion:</strong> {{ invite.excursion[0].name }}</p>
        <button class="button" @click="revokeInvite(invite._id)">Revoke</button>
      </div>
    </div>
  </template>


<style scoped>

.back-button {
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  display: inline-block;
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  width: fit-content;
  transition: background-color 0.3s ease;
}

.invite-section {
  padding: 2rem;
  background-color: #f9fafb;
}

.invite-section h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
  font-weight: 600;
}

.invite-card {
  background-color: #ffffff;
  border-left: 4px solid #2b372c;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.invite-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.invite-card p {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #374151;
}

.invite-card strong {
  color: #111827;
}

.invite-card button {
  margin-top: 1rem;
  margin-right: 0.75rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

</style>
