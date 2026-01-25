<script setup>
defineProps({
  playerHealth: Number,
  maxHealth: Number,
  blueScore: Number,
  redScore: Number,
  paused: Boolean,
  difficulty: Number,
  difficultyName: String
})

const emit = defineEmits(['pause', 'quit'])

const healthPercent = (health, max) => Math.max(0, Math.min(100, (health / max) * 100))
</script>

<template>
  <div class="game-ui">
    <div class="top-bar">
      <div class="score-panel">
        <div class="score blue">
          <span class="label">YOU</span>
          <span class="value">{{ blueScore }}</span>
        </div>
        <div class="vs">VS</div>
        <div class="score red">
          <span class="label">ENEMY</span>
          <span class="value">{{ redScore }}</span>
        </div>
      </div>
      
      <div class="difficulty-badge" :class="difficultyName?.toLowerCase()">
        {{ difficultyName }}
      </div>
      
      <div class="controls">
        <button class="ui-btn" @click="$emit('pause')">
          {{ paused ? '▶' : '⏸' }}
        </button>
        <button class="ui-btn quit" @click="$emit('quit')">✕</button>
      </div>
    </div>
    
    <div class="health-bar">
      <div class="health-label">HULL INTEGRITY</div>
      <div class="health-track">
        <div 
          class="health-fill" 
          :style="{ width: healthPercent(playerHealth, maxHealth) + '%' }"
          :class="{ low: playerHealth < maxHealth * 0.3 }"
        ></div>
      </div>
      <div class="health-text">{{ playerHealth }} / {{ maxHealth }}</div>
    </div>
    
    <div class="controls-hint">
      <span>W/S</span> Throttle
      <span>A/D</span> Steer
      <span>SPACE</span> Fire
      <span>ESC</span> Pause
    </div>
    
    <div v-if="paused" class="paused-overlay">
      <div class="paused-text">PAUSED</div>
      <button class="resume-btn" @click="$emit('pause')">▶ RESUME</button>
    </div>
  </div>
</template>

<style scoped>
.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: #fff;
}

.game-ui > * {
  pointer-events: auto;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background: linear-gradient(180deg, rgba(0,0,0,0.7), transparent);
}

.score-panel {
  display: flex;
  align-items: center;
  gap: 20px;
}

.score {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 25px;
  border-radius: 10px;
}

.score.blue {
  background: rgba(0, 100, 200, 0.5);
  border: 2px solid #00aaff;
}

.score.red {
  background: rgba(200, 50, 50, 0.5);
  border: 2px solid #ff4444;
}

.score .label {
  font-size: 0.7rem;
  letter-spacing: 2px;
  opacity: 0.8;
}

.score .value {
  font-size: 2rem;
  font-weight: bold;
}

.vs {
  font-size: 1.2rem;
  color: #888;
}

.difficulty-badge {
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  letter-spacing: 2px;
}

.difficulty-badge.easy { background: #228822; }
.difficulty-badge.medium { background: #888822; }
.difficulty-badge.hard { background: #884422; }
.difficulty-badge.extreme { background: #882222; }
.difficulty-badge.nightmare { background: #662266; }

.controls {
  display: flex;
  gap: 10px;
}

.ui-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid #00d4ff;
  background: rgba(0, 100, 150, 0.5);
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}

.ui-btn:hover {
  background: rgba(0, 150, 200, 0.7);
  transform: scale(1.1);
}

.ui-btn.quit {
  border-color: #ff4444;
  background: rgba(150, 50, 50, 0.5);
}

.health-bar {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.health-label {
  font-size: 0.75rem;
  letter-spacing: 2px;
  color: #88ccff;
  margin-bottom: 5px;
}

.health-track {
  width: 300px;
  height: 20px;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #446688;
  border-radius: 10px;
  overflow: hidden;
}

.health-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #00dd66);
  transition: width 0.3s;
}

.health-fill.low {
  background: linear-gradient(90deg, #ff4444, #ff0000);
  animation: pulse 0.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.health-text {
  margin-top: 5px;
  font-size: 0.9rem;
  color: #88aacc;
}

.controls-hint {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: #556677;
}

.controls-hint span {
  color: #00d4ff;
  font-weight: bold;
  margin: 0 5px;
}

.paused-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.paused-text {
  font-size: 4rem;
  font-weight: bold;
  letter-spacing: 10px;
  color: #fff;
  text-shadow: 0 0 30px #00d4ff;
  margin-bottom: 30px;
}

.resume-btn {
  padding: 15px 40px;
  font-size: 1.2rem;
  background: linear-gradient(180deg, #00d4ff, #0066aa);
  border: 2px solid #00ffff;
  border-radius: 30px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.resume-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
}
</style>
