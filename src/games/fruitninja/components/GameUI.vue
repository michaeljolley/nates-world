<script setup>
const props = defineProps({
  gameState: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  highScore: {
    type: Number,
    default: 0
  },
  lives: {
    type: Number,
    default: 3
  },
  combo: {
    type: Number,
    default: 0
  },
  maxCombo: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['start', 'restart', 'back-to-menu'])

const livesDisplay = () => '❤️'.repeat(props.lives) + '🖤'.repeat(3 - props.lives)
</script>

<template>
  <div class="game-ui">
    <!-- Menu Screen -->
    <div v-if="gameState === 'menu'" class="overlay menu-overlay">
      <div class="menu-content">
        <h1 class="game-title">🍉 Fruit Ninja 🗡️</h1>
        <div class="high-score-display" v-if="highScore > 0">🏆 {{ highScore }}</div>
        <button class="start-btn" @click="emit('start')">🗡️ Start!</button>
      </div>
    </div>

    <!-- HUD (during gameplay) -->
    <div v-if="gameState === 'playing'" class="hud">
      <div class="score-panel">
        <span class="score-label">Score</span>
        <span class="score-value">{{ Math.floor(score) }}</span>
      </div>
      
      <div class="lives-panel">
        <span class="lives-display">{{ livesDisplay() }}</span>
      </div>
      
      <div class="combo-panel" v-if="combo >= 3">
        <span class="combo-value">🔥 {{ combo }}x COMBO!</span>
      </div>
    </div>

    <!-- Game Over Screen -->
    <div v-if="gameState === 'gameover'" class="overlay gameover-overlay">
      <div class="overlay-content">
        <h2 class="gameover-title">💥 Game Over!</h2>
        <div class="final-stats">
          <p class="final-score">🎯 Score: {{ Math.floor(score) }}</p>
          <p>🔥 Best Combo: {{ maxCombo }}x</p>
          <p v-if="score >= highScore && score > 0" class="new-record">🏆 NEW HIGH SCORE!</p>
        </div>
        <div class="button-group">
          <button class="retry-btn" @click="emit('restart')">
            🔄 Play Again
          </button>
          <button class="menu-btn" @click="emit('back-to-menu')">
            🏠 Menu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all;
}

.menu-overlay {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.gameover-overlay {
  background: rgba(20, 20, 40, 0.95);
}

.menu-content {
  text-align: center;
  color: white;
  padding: 0.5rem;
}

.game-title {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 20px rgba(255, 100, 100, 0.5);
}

.high-score-display {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #ffd700;
}

.start-btn {
  background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.4rem;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-weight: bold;
}

.start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 71, 87, 0.5);
}

/* HUD */
.hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0.4rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
}

.score-panel {
  background: rgba(0, 0, 0, 0.6);
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.score-label {
  font-size: 0.7rem;
  opacity: 0.8;
}

.score-value {
  font-size: 1rem;
  font-weight: bold;
  color: #ffd700;
}

.lives-panel {
  background: rgba(0, 0, 0, 0.6);
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
}

.lives-display {
  font-size: 1rem;
}

.combo-panel {
  position: absolute;
  top: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  animation: pulse 0.3s ease infinite;
}

.combo-value {
  font-size: 1rem;
  font-weight: bold;
  color: white;
}

@keyframes pulse {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.1); }
}

/* Overlay content */
.overlay-content {
  text-align: center;
  color: white;
  padding: 2rem;
}

.gameover-title {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #ff4757;
}

.final-stats {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 15px;
  margin: 1.5rem 0;
}

.final-score {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
}

.final-stats p {
  margin: 0.5rem 0;
  font-size: 1.2rem;
}

.new-record {
  color: #ffd700;
  font-weight: bold;
  animation: glow 1s ease infinite;
}

@keyframes glow {
  0%, 100% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  50% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.retry-btn {
  background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s;
  font-weight: bold;
}

.menu-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 0.75rem 2rem;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.retry-btn:hover, .menu-btn:hover {
  transform: scale(1.05);
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
