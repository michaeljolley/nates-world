<script setup>
const emit = defineEmits(['retry', 'back'])
</script>

<template>
  <div class="defeat-screen">
    <div class="defeat-content">
      <div class="skull">💀</div>
      <h1>DEFEATED!</h1>
      <p>Your alien was destroyed by the humans!</p>
      
      <div class="defeat-buttons">
        <button class="retry-btn" @click="emit('retry')">
          🔄 Try Again
        </button>
        <button class="back-btn" @click="emit('back')">
          ← Back to Map
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.defeat-screen {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(50, 0, 0, 0.9);
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.defeat-content {
  text-align: center;
  padding: 3rem;
}

.skull {
  font-size: 6rem;
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

h1 {
  font-size: 4rem;
  color: #ff4444;
  text-shadow: 0 0 30px #ff0000;
  margin: 1rem 0;
  letter-spacing: 10px;
}

p {
  font-size: 1.2rem;
  color: #ff8888;
  margin-bottom: 2rem;
}

.defeat-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.retry-btn, .back-btn {
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 220px;
}

.retry-btn {
  background: linear-gradient(135deg, #ff6600 0%, #ff3300 100%);
  color: #fff;
}

.retry-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 100, 0, 0.5);
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #aaa;
  border: 2px solid #555;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
</style>
