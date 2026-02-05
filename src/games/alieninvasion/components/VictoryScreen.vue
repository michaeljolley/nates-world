<script setup>
const props = defineProps({
  region: { type: Object, default: null },
  coinsEarned: { type: Number, default: 0 },
  isReplay: { type: Boolean, default: false }
})

const emit = defineEmits(['continue'])
</script>

<template>
  <div class="victory-screen">
    <div class="victory-content">
      <div class="trophy">{{ isReplay ? '🔄' : '🏆' }}</div>
      <h1>{{ isReplay ? 'COMPLETE!' : 'VICTORY!' }}</h1>
      <h2 v-if="region">{{ region.name }} {{ isReplay ? 'Replayed!' : 'Conquered!' }}</h2>
      
      <div class="rewards">
        <div class="reward-item">
          <span class="reward-icon">💰</span>
          <span class="reward-value">+{{ coinsEarned.toLocaleString() }}</span>
          <span v-if="isReplay" class="replay-note">(replay bonus)</span>
        </div>
      </div>
      
      <button class="continue-btn" @click="emit('continue')">
        Continue 🚀
      </button>
    </div>
  </div>
</template>

<style scoped>
.victory-screen {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 50, 0, 0.9);
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.victory-content {
  text-align: center;
  padding: 3rem;
}

.trophy {
  font-size: 6rem;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
}

h1 {
  font-size: 4rem;
  color: #ffd700;
  text-shadow: 0 0 30px #ffd700;
  margin: 1rem 0;
  letter-spacing: 10px;
}

h2 {
  font-size: 1.5rem;
  color: #00ff00;
  margin-bottom: 2rem;
}

.rewards {
  margin: 2rem 0;
}

.reward-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 215, 0, 0.2);
  border: 2px solid #ffd700;
  border-radius: 15px;
  padding: 1rem 2rem;
}

.reward-icon {
  font-size: 2rem;
}

.reward-value {
  font-size: 2rem;
  color: #ffd700;
  font-weight: bold;
}

.replay-note {
  font-size: 0.9rem;
  color: #aaa;
  margin-left: 0.5rem;
}

.continue-btn {
  padding: 1rem 3rem;
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #00ff00 0%, #00aa00 100%);
  border: none;
  border-radius: 50px;
  color: #000;
  cursor: pointer;
  transition: all 0.3s;
}

.continue-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
}
</style>
