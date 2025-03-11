<script setup>
defineProps({
  senderName: String,
  updatedAt: String,
  text: String
});
</script>

<template>
  <div class="feedback-card">
    <div class="feedback-header">
      <strong>{{ senderName }}</strong>
      <span class="feedback-time">{{ new Date(updatedAt).toLocaleString() }}</span>
    </div>
    <p class="feedback-text">{{ text }}</p>
  </div>
</template>

<style scoped>
.feedback-card {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  margin: 8px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.feedback-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #333;
}
.feedback-time {
  font-size: 12px;
  color: gray;
}
.feedback-text {
  margin-top: 6px;
  font-size: 14px;
  color: #444;
}
strong{
    font-weight: 700;
}
</style>
