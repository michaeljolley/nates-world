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
  }
})

const emit = defineEmits(['start', 'restart', 'back-to-menu'])
</script>

<template>
  <div class="game-ui">
    <!-- Menu Screen -->
    <div v-if="gameState === 'menu'" class="overlay menu-overlay">
      <div class="menu-content">
        <h1 class="game-title">🌳 Tree Hoppers 🐒</h1>
        <p class="game-subtitle">Jump from tree to tree - don't fall!</p>
        
        <div class="instructions">
          <h3>How to Play</h3>
          <p>🌳 Jump between trees to stay alive</p>
          <p>🌿 Grab vines to swing across gaps</p>
          <p>⬆️ or SPACE to jump</p>
          <p>⬅️➡️ Swing left/right on vines</p>
          <p>☠️ Touch the ground = Game Over!</p>
        </div>

        <div class="high-score-display" v-if="highScore > 0">
          🏆 High Score: {{ highScore }}
        </div>

        <button class="start-btn" @click="emit('start')">
          🚀 Start Game
        </button>
        
        <button class="back-btn" @click="emit('back-to-menu')">
          ← Back to Games
        </button>
      </div>
    </div>

    <!-- HUD (during gameplay) -->
    <div v-if="gameState === 'playing'" class="hud">
      <div class="score-panel">
        <span class="score-label">Score</span>
        <span class="score-value">{{ score }}</span>
      </div>
      
      <div class="high-score-panel" v-if="highScore > 0">
        <span class="high-label">Best: {{ highScore }}</span>
      </div>
    </div>

    <!-- Game Over Screen -->
    <div v-if="gameState === 'gameover'" class="overlay gameover-overlay">
      <div class="overlay-content">
        <h2 class="gameover-title">💀 SPLAT!</h2>
        <p>You hit the ground!</p>
        <div class="final-stats">
          <p>🎯 Score: {{ score }}</p>
          <p v-if="score >= highScore && score > 0">🏆 NEW HIGH SCORE!</p>
        </div>
        <div class="button-group">
          <button class="retry-btn" @click="emit('restart')">
            🔄 Try Again
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
  background: linear-gradient(135deg, #1a472a 0%, #2d5a27 50%, #1a3a1a 100%);
}

.gameover-overlay {
  background: rgba(100, 50, 20, 0.95);
}

.menu-content {
  text-align: center;
  color: white;
  max-width: 500px;
  padding: 2rem;
}

.game-title {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.game-subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.instructions {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.instructions h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.instructions p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.high-score-display {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #ffd700;
}

.start-btn {
  background: linear-gradient(135deg, #ff6600 0%, #00c853 100%);
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-weight: bold;
  display: block;
  margin: 0 auto 1rem;
}

.start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 102, 0, 0.5);
}

.back-btn {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: rgba(255, 255, 255, 0.6);
  color: white;
}

/* HUD */
.hud {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2rem;
  pointer-events: none;
}

.score-panel {
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5rem 1.5rem;
  border-radius: 10px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-label {
  font-size: 0.7rem;
  opacity: 0.8;
  text-transform: uppercase;
}

.score-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffd700;
}

.high-score-panel {
  background: rgba(0, 0, 0, 0.7);
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  color: #aaa;
  display: flex;
  align-items: center;
}

.high-label {
  font-size: 0.9rem;
}

/* Overlay content */
.overlay-content {
  text-align: center;
  color: white;
  padding: 2rem;
}

.gameover-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.final-stats {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem 2rem;
  border-radius: 10px;
  margin: 1.5rem 0;
}

.final-stats p {
  margin: 0.5rem 0;
  font-size: 1.3rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.retry-btn {
  background: linear-gradient(135deg, #ff6600 0%, #00c853 100%);
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
