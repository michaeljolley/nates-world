<script setup>
import { computed } from 'vue'

const props = defineProps({
  gameState: String,
  aiCount: Number,
  playerScore: Number,
  playerKills: Number,
  leaderboard: Array
})

const emit = defineEmits(['start', 'set-ai-count', 'back-to-menu', 'play-again'])

const playerRank = computed(() => {
  const idx = props.leaderboard?.findIndex(e => e.id === 'player')
  return idx >= 0 ? idx + 1 : props.leaderboard?.length || 1
})
</script>

<template>
  <div class="game-ui">
    <!-- Main Menu -->
    <div v-if="gameState === 'menu'" class="menu-overlay">
      <div class="menu-content">
        <h1 class="game-title">🐍 SNAKE RUN</h1>
        <p class="subtitle">Slither. Eat. Dominate.</p>

        <div class="ai-selector">
          <label>AI Opponents</label>
          <div class="slider-container">
            <button class="slider-btn" @click="emit('set-ai-count', aiCount - 1)">-</button>
            <span class="ai-count">{{ aiCount }}</span>
            <button class="slider-btn" @click="emit('set-ai-count', aiCount + 1)">+</button>
          </div>
          <div class="slider-range">
            <input 
              type="range" 
              min="1" 
              max="20" 
              :value="aiCount"
              @input="emit('set-ai-count', parseInt($event.target.value))"
            >
          </div>
        </div>

        <button class="btn btn-start" @click="emit('start')">
          🎮 START GAME
        </button>

        <div class="controls-info">
          <h3>Controls</h3>
          <div class="control-row">
            <span class="key">↑ ← ↓ →</span>
            <span>or</span>
            <span class="key">W A S D</span>
          </div>
          <p class="control-hint">Move your snake to collect food and grow!</p>
        </div>

        <button class="btn btn-back" @click="emit('back-to-menu')">
          ← Back to Games
        </button>
      </div>
    </div>

    <!-- HUD during gameplay -->
    <div v-if="gameState === 'playing'" class="hud">
      <div class="hud-left">
        <div class="score-display">
          <span class="score-label">Length</span>
          <span class="score-value">{{ playerScore }}</span>
        </div>
        <div class="kills-display">
          <span class="kills-label">Kills</span>
          <span class="kills-value">{{ playerKills }}</span>
        </div>
      </div>

      <div class="leaderboard">
        <h3>🏆 Top Snakes</h3>
        <div 
          v-for="(entry, idx) in leaderboard" 
          :key="entry.id"
          class="leaderboard-entry"
          :class="{ 'is-player': entry.id === 'player' }"
        >
          <span class="rank">{{ idx + 1 }}</span>
          <span class="name">{{ entry.name }}</span>
          <span class="entry-score">{{ entry.score }}</span>
        </div>
      </div>
    </div>

    <!-- Game Over -->
    <div v-if="gameState === 'gameover'" class="menu-overlay">
      <div class="menu-content gameover">
        <h1 class="gameover-title">💀 GAME OVER</h1>
        
        <div class="stats">
          <div class="stat">
            <span class="stat-label">Final Length</span>
            <span class="stat-value">{{ playerScore }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Snakes Eliminated</span>
            <span class="stat-value">{{ playerKills }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Final Rank</span>
            <span class="stat-value">#{{ playerRank }}</span>
          </div>
        </div>

        <button class="btn btn-start" @click="emit('play-again')">
          🔄 PLAY AGAIN
        </button>
        <button class="btn btn-back" @click="emit('back-to-menu')">
          ← Back to Menu
        </button>
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
  font-family: 'Arial Black', Arial, sans-serif;
}

.game-ui button, .game-ui input {
  pointer-events: auto;
}

/* Menu Overlay */
.menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(20, 30, 20, 0.95) 0%, rgba(10, 40, 20, 0.95) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.menu-content {
  text-align: center;
  color: white;
  padding: 2rem;
}

.game-title {
  font-size: 4rem;
  margin: 0;
  color: #00ff66;
  text-shadow: 0 0 30px rgba(0, 255, 102, 0.5);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.subtitle {
  font-size: 1.2rem;
  color: #88ff88;
  margin: 0.5rem 0 2rem;
  letter-spacing: 4px;
}

/* AI Selector */
.ai-selector {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 15px;
  margin: 1.5rem auto;
  max-width: 300px;
}

.ai-selector label {
  display: block;
  color: #00ff66;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.slider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.slider-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #00cc55;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.slider-btn:hover {
  background: #00ff66;
  transform: scale(1.1);
}

.ai-count {
  font-size: 2.5rem;
  color: white;
  font-weight: bold;
  min-width: 60px;
}

.slider-range input {
  width: 100%;
  accent-color: #00ff66;
}

/* Buttons */
.btn {
  display: block;
  width: 280px;
  margin: 1rem auto;
  padding: 1rem 2rem;
  font-size: 1.3rem;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.btn-start {
  background: linear-gradient(135deg, #00cc55 0%, #00ff66 100%);
  color: #003311;
  box-shadow: 0 4px 20px rgba(0, 255, 102, 0.4);
}

.btn-start:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 30px rgba(0, 255, 102, 0.6);
}

.btn-back {
  background: transparent;
  color: #888;
  border: 2px solid #444;
}

.btn-back:hover {
  border-color: #00ff66;
  color: #00ff66;
}

/* Controls Info */
.controls-info {
  margin: 2rem auto;
  padding: 1rem;
  max-width: 300px;
}

.controls-info h3 {
  color: #00ff66;
  margin-bottom: 0.5rem;
}

.control-row {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  align-items: center;
  color: #aaa;
}

.key {
  background: #333;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  font-family: monospace;
  color: #fff;
}

.control-hint {
  color: #888;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* HUD */
.hud {
  padding: 1rem;
}

.hud-left {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  gap: 1rem;
}

.score-display, .kills-display {
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 2px solid #00ff66;
}

.score-label, .kills-label {
  display: block;
  font-size: 0.7rem;
  color: #00ff66;
  text-transform: uppercase;
}

.score-value, .kills-value {
  font-size: 1.8rem;
  color: white;
  font-weight: bold;
}

/* Leaderboard */
.leaderboard {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.75rem;
  border-radius: 10px;
  border: 2px solid #00ff66;
  min-width: 150px;
}

.leaderboard h3 {
  color: #00ff66;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.leaderboard-entry {
  display: flex;
  gap: 0.5rem;
  padding: 0.2rem 0;
  font-size: 0.8rem;
  color: #ccc;
}

.leaderboard-entry.is-player {
  color: #ffcc00;
  font-weight: bold;
}

.leaderboard-entry .rank {
  color: #888;
  min-width: 20px;
}

.leaderboard-entry .name {
  flex: 1;
}

.leaderboard-entry .entry-score {
  color: #00ff66;
}

/* Game Over */
.gameover-title {
  font-size: 3rem;
  color: #ff4444;
  text-shadow: 0 0 30px rgba(255, 68, 68, 0.5);
}

.stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.stat-value {
  font-size: 2rem;
  color: #00ff66;
  font-weight: bold;
}
</style>
