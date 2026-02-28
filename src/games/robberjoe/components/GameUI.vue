<script setup>
import { computed } from 'vue'
import { levels } from '../data/levels'

const props = defineProps({
  gameState: { type: String, required: true },
  currentLevelIndex: { type: Number, default: 0 },
  lootCollected: { type: Number, default: 0 },
  totalLoot: { type: Number, default: 0 },
  requiredLoot: { type: Number, default: 0 },
  timeElapsed: { type: Number, default: 0 },
  isLevelComplete: { type: Boolean, default: false },
  playerHiding: { type: Boolean, default: false },
  playerSneaking: { type: Boolean, default: false },
  playerRunning: { type: Boolean, default: false }
})

const emit = defineEmits(['start', 'select-level', 'restart', 'back-to-menu', 'next-level'])

const formattedTime = computed(() => {
  const seconds = Math.floor(props.timeElapsed)
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

const currentLevelName = computed(() => {
  return levels[props.currentLevelIndex]?.name || 'Unknown'
})

const currentLevelDescription = computed(() => {
  return levels[props.currentLevelIndex]?.description || ''
})

const statusText = computed(() => {
  if (props.playerHiding) return '👁️ HIDDEN'
  if (props.playerSneaking) return '🤫 SNEAKING'
  if (props.playerRunning) return '🏃 RUNNING'
  return ''
})

const statusClass = computed(() => {
  if (props.playerHiding) return 'status-hidden'
  if (props.playerSneaking) return 'status-sneaking'
  if (props.playerRunning) return 'status-running'
  return ''
})
</script>

<template>
  <div class="game-ui">
    <!-- Menu Screen -->
    <div v-if="gameState === 'menu'" class="menu-screen">
      <div class="menu-header">
        <div class="title-icon">🦹</div>
        <h1 class="title">ROBBER JOE</h1>
        <p class="subtitle">A Stealth Puzzle Game</p>
      </div>
      
      <div class="menu-buttons">
        <button class="btn btn-primary" @click="emit('start')">
          <span class="btn-icon">▶</span> START GAME
        </button>
      </div>

      <div class="level-select">
        <h3>📋 Select Level</h3>
        <div class="level-buttons">
          <button 
            v-for="(level, index) in levels" 
            :key="level.id"
            class="btn btn-level"
            @click="emit('select-level', index)"
          >
            <span class="level-num">{{ level.id }}</span>
            <span class="level-name">{{ level.name }}</span>
            <span class="level-desc">{{ level.description }}</span>
          </button>
        </div>
      </div>

      <div class="instructions">
        <h3>📖 How to Play</h3>
        <div class="controls-grid">
          <div class="control-item">
            <span class="key">WASD</span>
            <span class="action">Move Joe</span>
          </div>
          <div class="control-item">
            <span class="key">SHIFT</span>
            <span class="action">Sneak (slow & quiet)</span>
          </div>
          <div class="control-item">
            <span class="key">CTRL</span>
            <span class="action">Run (fast but noisy!)</span>
          </div>
        </div>
        <div class="tips">
          <p>💰 Collect enough loot to unlock the exit</p>
          <p>👁️ Avoid guard vision cones</p>
          <p>🌑 Hide in shadows to become invisible</p>
          <p>📹 Watch out for security cameras</p>
          <p>🚪 Reach the exit to complete the level</p>
        </div>
      </div>
    </div>

    <!-- HUD -->
    <div v-if="gameState === 'playing'" class="hud">
      <div class="hud-left">
        <div class="level-info">
          <span class="level-badge">Level {{ currentLevelIndex + 1 }}</span>
          <span class="level-title">{{ currentLevelName }}</span>
        </div>
        <div class="time">
          <span class="time-icon">⏱️</span>
          <span class="time-value">{{ formattedTime }}</span>
        </div>
      </div>
      
      <div class="hud-center">
        <div class="loot-counter" :class="{ complete: isLevelComplete }">
          <span class="loot-icon">💰</span>
          <span class="loot-value">{{ lootCollected }} / {{ requiredLoot }}</span>
          <span v-if="isLevelComplete" class="exit-hint">
            <span class="arrow">→</span> Find Exit!
          </span>
        </div>
        <div v-if="statusText" class="player-status" :class="statusClass">
          {{ statusText }}
        </div>
      </div>
      
      <div class="hud-right">
        <button class="btn btn-hud" @click="emit('restart')">
          <span>↺</span> Restart
        </button>
        <button class="btn btn-hud" @click="emit('back-to-menu')">
          <span>✕</span> Menu
        </button>
      </div>
    </div>

    <!-- Caught Screen -->
    <div v-if="gameState === 'caught'" class="overlay">
      <div class="modal caught">
        <div class="modal-icon">🚨</div>
        <h2>CAUGHT!</h2>
        <p>A guard spotted you!</p>
        <div class="modal-buttons">
          <button class="btn btn-primary" @click="emit('restart')">
            <span>↺</span> Try Again
          </button>
          <button class="btn btn-secondary" @click="emit('back-to-menu')">
            Back to Menu
          </button>
        </div>
      </div>
    </div>

    <!-- Win Screen -->
    <div v-if="gameState === 'win'" class="overlay">
      <div class="modal win">
        <div class="modal-icon">🎉</div>
        <h2>CONGRATULATIONS!</h2>
        <p>You completed all levels!</p>
        <div class="stats">
          <div class="stat">
            <span class="stat-label">Total Time</span>
            <span class="stat-value">{{ formattedTime }}</span>
          </div>
        </div>
        <div class="modal-buttons">
          <button class="btn btn-primary" @click="emit('start')">
            <span>▶</span> Play Again
          </button>
          <button class="btn btn-secondary" @click="emit('back-to-menu')">
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  font-family: 'Orbitron', 'Segoe UI', sans-serif;
}

.game-ui > * {
  pointer-events: auto;
}

/* Menu Screen */
.menu-screen {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  background: rgba(10, 10, 18, 0.95);
  padding: 40px 50px;
  border-radius: 20px;
  border: 2px solid #2d8cf0;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 40px rgba(45, 140, 240, 0.3);
}

.menu-header {
  margin-bottom: 30px;
}

.title-icon {
  font-size: 60px;
  margin-bottom: 10px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.title {
  font-size: 42px;
  font-weight: 900;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #f1c40f, #e67e22);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.menu-buttons {
  margin-bottom: 30px;
}

/* Buttons */
.btn {
  background: #2d3436;
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  font-family: 'Orbitron', sans-serif;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 5px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:hover {
  background: #4a6278;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  font-size: 18px;
  padding: 16px 36px;
  font-weight: 700;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2ecc71, #58d68d);
  box-shadow: 0 4px 20px rgba(46, 204, 113, 0.4);
}

.btn-secondary {
  background: #34495e;
}

.btn-hud {
  padding: 8px 16px;
  font-size: 12px;
  background: rgba(45, 52, 54, 0.8);
  border: 1px solid #4a6278;
}

.btn-icon {
  font-size: 20px;
}

/* Level Select */
.level-select {
  margin-bottom: 30px;
}

.level-select h3 {
  color: #2d8cf0;
  margin-bottom: 15px;
  font-size: 16px;
}

.level-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-level {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  background: rgba(45, 52, 54, 0.6);
  border: 1px solid #4a6278;
}

.btn-level:hover {
  background: rgba(45, 140, 240, 0.2);
  border-color: #2d8cf0;
}

.level-num {
  background: #2d8cf0;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  margin-right: 12px;
}

.level-name {
  font-weight: 600;
  flex: 1;
}

.level-desc {
  font-size: 11px;
  color: #7f8c8d;
}

/* Instructions */
.instructions {
  text-align: left;
  background: rgba(45, 52, 54, 0.4);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #4a6278;
}

.instructions h3 {
  color: #2d8cf0;
  margin: 0 0 15px 0;
  font-size: 16px;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.control-item {
  text-align: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.key {
  display: block;
  background: #2d8cf0;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 6px;
}

.action {
  font-size: 10px;
  color: #bdc3c7;
}

.tips {
  border-top: 1px solid #4a6278;
  padding-top: 15px;
}

.tips p {
  margin: 6px 0;
  font-size: 12px;
  color: #bdc3c7;
}

/* HUD */
.hud {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background: linear-gradient(to bottom, rgba(10, 10, 18, 0.95), rgba(10, 10, 18, 0.8) 80%, transparent);
  color: #fff;
}

.hud-left, .hud-right {
  display: flex;
  gap: 15px;
  align-items: center;
}

.hud-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.level-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-badge {
  background: #2d8cf0;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
}

.level-title {
  font-size: 16px;
  color: #fff;
  font-weight: 600;
}

.time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #bdc3c7;
}

.loot-counter {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  padding: 10px 24px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 25px;
  border: 2px solid #f1c40f;
}

.loot-counter.complete {
  border-color: #27ae60;
  animation: pulse-border 1s infinite;
}

@keyframes pulse-border {
  0%, 100% { box-shadow: 0 0 10px rgba(39, 174, 96, 0.5); }
  50% { box-shadow: 0 0 25px rgba(39, 174, 96, 0.8); }
}

.loot-icon {
  font-size: 24px;
}

.exit-hint {
  color: #2ecc71;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.exit-hint .arrow {
  animation: point 0.8s infinite;
}

@keyframes point {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}

.player-status {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: bold;
}

.status-hidden {
  background: rgba(46, 204, 113, 0.3);
  color: #2ecc71;
}

.status-sneaking {
  background: rgba(52, 152, 219, 0.3);
  color: #3498db;
}

.status-running {
  background: rgba(231, 76, 60, 0.3);
  color: #e74c3c;
}

/* Overlay & Modals */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}

.modal {
  background: rgba(10, 10, 18, 0.98);
  padding: 50px 70px;
  border-radius: 20px;
  text-align: center;
  color: #fff;
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal.caught {
  border: 3px solid #e74c3c;
  box-shadow: 0 0 50px rgba(231, 76, 60, 0.4);
}

.modal.win {
  border: 3px solid #f1c40f;
  box-shadow: 0 0 50px rgba(241, 196, 15, 0.4);
}

.modal-icon {
  font-size: 60px;
  margin-bottom: 15px;
}

.modal h2 {
  font-size: 36px;
  margin: 0 0 15px 0;
  letter-spacing: 3px;
}

.modal.caught h2 {
  color: #e74c3c;
}

.modal.win h2 {
  color: #f1c40f;
}

.modal p {
  font-size: 16px;
  color: #bdc3c7;
  margin: 10px 0;
}

.stats {
  margin: 25px 0;
  padding: 15px 30px;
  background: rgba(45, 52, 54, 0.5);
  border-radius: 10px;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  color: #7f8c8d;
  font-size: 14px;
}

.stat-value {
  color: #2d8cf0;
  font-size: 22px;
  font-weight: bold;
}

.modal-buttons {
  margin-top: 30px;
  display: flex;
  gap: 15px;
  justify-content: center;
}
</style>
