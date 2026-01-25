<script setup>
defineProps({
  winner: String,
  blueScore: Number,
  redScore: Number,
  moneyEarned: Number
})

const emit = defineEmits(['playAgain', 'quit'])
</script>

<template>
  <div class="victory-overlay">
    <div class="victory-panel" :class="winner === 'blue' ? 'win' : 'lose'">
      <div class="trophy">{{ winner === 'blue' ? '🏆' : '💀' }}</div>
      <h1>{{ winner === 'blue' ? 'VICTORY!' : 'DEFEAT' }}</h1>
      <p class="subtitle">{{ winner === 'blue' ? 'You sunk all enemy ships!' : 'Your ship was destroyed!' }}</p>
      
      <div class="final-score">
        <div class="score-item">
          <span class="label">Your Kills</span>
          <span class="value blue">{{ blueScore }}</span>
        </div>
        <div class="score-item">
          <span class="label">Enemy Kills</span>
          <span class="value red">{{ redScore }}</span>
        </div>
      </div>
      
      <div v-if="moneyEarned > 0" class="earnings">
        <span class="money-icon">💰</span>
        <span class="money-text">+${{ moneyEarned.toLocaleString() }}</span>
      </div>
      
      <div class="buttons">
        <button class="btn primary" @click="$emit('playAgain')">⚓ BATTLE AGAIN</button>
        <button class="btn secondary" @click="$emit('quit')">🏠 MAIN MENU</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.victory-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.victory-panel {
  background: linear-gradient(180deg, #0a1628 0%, #1a3a5c 100%);
  border-radius: 25px;
  padding: 40px 60px;
  text-align: center;
  animation: slideIn 0.5s ease-out;
}

.victory-panel.win {
  border: 3px solid #ffd700;
  box-shadow: 0 0 60px rgba(255, 215, 0, 0.4);
}

.victory-panel.lose {
  border: 3px solid #ff4444;
  box-shadow: 0 0 60px rgba(255, 68, 68, 0.4);
}

@keyframes slideIn {
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.trophy {
  font-size: 5rem;
  margin-bottom: 10px;
}

h1 {
  margin: 0;
  font-size: 3rem;
  letter-spacing: 5px;
}

.victory-panel.win h1 {
  color: #ffd700;
  text-shadow: 0 0 30px #ffd700;
}

.victory-panel.lose h1 {
  color: #ff4444;
  text-shadow: 0 0 30px #ff4444;
}

.subtitle {
  color: #88aacc;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.final-score {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-bottom: 25px;
}

.score-item {
  display: flex;
  flex-direction: column;
}

.score-item .label {
  font-size: 0.8rem;
  color: #668899;
  letter-spacing: 2px;
  margin-bottom: 5px;
}

.score-item .value {
  font-size: 2.5rem;
  font-weight: bold;
}

.score-item .value.blue { color: #00aaff; }
.score-item .value.red { color: #ff4444; }

.earnings {
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid #ffd700;
  border-radius: 15px;
  padding: 15px 30px;
  margin-bottom: 30px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.money-icon {
  font-size: 2rem;
}

.money-text {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffd700;
}

.buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  padding: 15px 35px;
  font-size: 1.1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;
  letter-spacing: 1px;
}

.btn.primary {
  background: linear-gradient(180deg, #00d4ff, #0066aa);
  border: 2px solid #00ffff;
  color: #fff;
}

.btn.primary:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
}

.btn.secondary {
  background: transparent;
  border: 2px solid #668899;
  color: #88aacc;
}

.btn.secondary:hover {
  border-color: #88aacc;
  color: #fff;
}
</style>
