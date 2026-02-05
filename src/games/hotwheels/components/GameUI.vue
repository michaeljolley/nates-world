<script setup>
import { computed } from 'vue'

const props = defineProps({
  gameState: String,
  countdown: Number,
  lapCount: Number,
  totalLaps: Number,
  raceTime: Number,
  bestTime: Number,
  speed: Number,
  racePosition: Number,
  tracks: Array,
  currentTrack: Number
})

const emit = defineEmits(['start', 'resume', 'restart', 'back-to-menu', 'show-track-select', 'select-track'])

const formattedTime = computed(() => {
  const minutes = Math.floor(props.raceTime / 60)
  const seconds = Math.floor(props.raceTime % 60)
  const ms = Math.floor((props.raceTime * 100) % 100)
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
})

const formattedBestTime = computed(() => {
  if (!props.bestTime) return '--:--:--'
  const minutes = Math.floor(props.bestTime / 60)
  const seconds = Math.floor(props.bestTime % 60)
  const ms = Math.floor((props.bestTime * 100) % 100)
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
})

const speedDisplay = computed(() => Math.abs(Math.round(props.speed || 0)))

const positionSuffix = computed(() => {
  const pos = props.racePosition || 1
  if (pos === 1) return 'st'
  if (pos === 2) return 'nd'
  if (pos === 3) return 'rd'
  return 'th'
})
</script>

<template>
  <div class="game-ui">
    <!-- Main Menu -->
    <div v-if="gameState === 'menu'" class="menu-overlay">
      <div class="menu-content">
        <h1 class="game-title">
          <span class="fire">🔥</span>
          HOT WHEELS
          <span class="fire">🔥</span>
        </h1>
        <h2 class="subtitle">RACING</h2>
        
        <div class="car-preview">🏎️</div>
        
        <button class="btn btn-start" @click="emit('show-track-select')">
          SELECT TRACK
        </button>
        
        <div class="controls-info">
          <h3>Controls</h3>
          <div class="control-row">
            <span class="key">W / ↑</span>
            <span>Accelerate</span>
          </div>
          <div class="control-row">
            <span class="key">S / ↓</span>
            <span>Reverse</span>
          </div>
          <div class="control-row">
            <span class="key">A / ←</span>
            <span>Turn Left</span>
          </div>
          <div class="control-row">
            <span class="key">D / →</span>
            <span>Turn Right</span>
          </div>
          <div class="control-row">
            <span class="key">SPACE</span>
            <span>Brake</span>
          </div>
        </div>

        <button class="btn btn-back" @click="emit('back-to-menu')">
          ← Back to Games
        </button>
      </div>
    </div>

    <!-- Track Selection -->
    <div v-if="gameState === 'trackSelect'" class="menu-overlay">
      <div class="menu-content track-select">
        <h2 class="track-title">🏁 SELECT YOUR TRACK 🏁</h2>
        
        <div class="track-grid">
          <div 
            v-for="track in (tracks || [])" 
            :key="track.id"
            class="track-card"
            :class="{ selected: currentTrack === track.id }"
            @click="emit('select-track', track.id)"
          >
            <div class="track-preview" :style="{ borderColor: track.theme ? '#' + track.theme.primary.toString(16).padStart(6, '0') : '#666' }">
              <div class="track-icon">
                <span v-if="track.id === 1">🔥</span>
                <span v-else-if="track.id === 2">💜</span>
                <span v-else>🐉</span>
              </div>
              <div class="track-stats">
                <span class="stat">🔄 {{ track.loops.length }} Loops</span>
                <span class="stat">🚀 {{ track.jumps.length }} Jumps</span>
              </div>
            </div>
            <h3 class="track-name">{{ track.name }}</h3>
            <p class="track-desc">{{ track.description }}</p>
            <div class="track-difficulty">
              <span v-for="n in 3" :key="n" :class="{ filled: n <= track.difficulty }">⭐</span>
            </div>
            <div class="track-laps">{{ track.laps }} Laps</div>
          </div>
        </div>
        
        <button class="btn btn-start" @click="emit('start')">
          START RACE
        </button>
        
        <button class="btn btn-back" @click="emit('back-to-menu')">
          ← Back to Menu
        </button>
      </div>
    </div>

    <!-- Countdown -->
    <div v-if="gameState === 'countdown'" class="countdown-overlay">
      <div class="countdown-number" :class="{ go: countdown === 0 }">
        {{ countdown === 0 ? 'GO!' : countdown }}
      </div>
    </div>

    <!-- Racing HUD -->
    <div v-if="gameState === 'playing' || gameState === 'countdown'" class="racing-hud">
      <div class="hud-top">
        <div class="position-display">
          <span class="position-value">{{ racePosition || 1 }}</span>
          <span class="position-suffix">{{ positionSuffix }}</span>
          <span class="position-total">/ 8</span>
        </div>
        <div class="lap-counter">
          <span class="label">LAP</span>
          <span class="value">{{ lapCount + 1 }} / {{ totalLaps }}</span>
        </div>
        <div class="timer">
          <span class="label">TIME</span>
          <span class="value">{{ formattedTime }}</span>
        </div>
      </div>
      
      <div class="speedometer">
        <div class="speed-value">{{ speedDisplay }}</div>
        <div class="speed-unit">MPH</div>
        <div class="speed-bar">
          <div class="speed-fill" :style="{ width: Math.min(100, speedDisplay * 3) + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Paused -->
    <div v-if="gameState === 'paused'" class="menu-overlay">
      <div class="menu-content">
        <h2>PAUSED</h2>
        <button class="btn btn-start" @click="emit('resume')">
          RESUME
        </button>
        <button class="btn btn-restart" @click="emit('restart')">
          RESTART RACE
        </button>
        <button class="btn btn-back" @click="emit('back-to-menu')">
          ← Back to Menu
        </button>
      </div>
    </div>

    <!-- Race Finished -->
    <div v-if="gameState === 'finished'" class="menu-overlay">
      <div class="menu-content victory">
        <h1 class="victory-title">🏆 RACE COMPLETE! 🏆</h1>
        <div class="final-time">
          <span class="label">Your Time</span>
          <span class="time">{{ formattedTime }}</span>
        </div>
        <div class="best-time">
          <span class="label">Best Time</span>
          <span class="time">{{ formattedBestTime }}</span>
        </div>
        <button class="btn btn-start" @click="emit('restart')">
          RACE AGAIN
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

.menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(20, 20, 40, 0.95) 0%, rgba(40, 20, 20, 0.95) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.menu-content {
  text-align: center;
  color: white;
}

.game-title {
  font-size: 4rem;
  margin: 0;
  background: linear-gradient(135deg, #ff6600 0%, #ff0000 50%, #ff6600 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 0 20px rgba(255, 102, 0, 0.5));
  animation: titlePulse 2s ease-in-out infinite;
}

.fire {
  -webkit-text-fill-color: initial;
  animation: fireFlicker 0.5s ease-in-out infinite alternate;
}

@keyframes titlePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes fireFlicker {
  0% { opacity: 0.8; transform: scale(1) rotate(-5deg); }
  100% { opacity: 1; transform: scale(1.1) rotate(5deg); }
}

.subtitle {
  font-size: 2.5rem;
  color: #ffcc00;
  margin: 0.5rem 0 2rem;
  letter-spacing: 1rem;
  text-shadow: 0 0 20px rgba(255, 204, 0, 0.5);
}

.car-preview {
  font-size: 6rem;
  margin: 1rem 0 2rem;
  animation: carBounce 1s ease-in-out infinite;
}

@keyframes carBounce {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

.btn {
  display: block;
  width: 250px;
  margin: 1rem auto;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.btn-start {
  background: linear-gradient(135deg, #ff6600 0%, #ff0000 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(255, 102, 0, 0.4);
}

.btn-start:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 30px rgba(255, 102, 0, 0.6);
}

.btn-restart {
  background: linear-gradient(135deg, #00cc66 0%, #009944 100%);
  color: white;
}

.btn-restart:hover {
  transform: scale(1.05);
}

.btn-back {
  background: transparent;
  color: #888;
  border: 2px solid #444;
}

.btn-back:hover {
  border-color: #666;
  color: #aaa;
}

.controls-info {
  margin: 2rem auto;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  max-width: 300px;
}

.controls-info h3 {
  margin: 0 0 1rem;
  color: #ff6600;
}

.control-row {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
  color: #aaa;
}

.key {
  background: #333;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-family: monospace;
  color: #fff;
}

/* Countdown */
.countdown-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.countdown-number {
  font-size: 15rem;
  font-weight: bold;
  color: #ff6600;
  text-shadow: 0 0 50px rgba(255, 102, 0, 0.8);
  animation: countdownPop 1s ease-out;
}

.countdown-number.go {
  color: #00ff00;
  text-shadow: 0 0 50px rgba(0, 255, 0, 0.8);
}

@keyframes countdownPop {
  0% { transform: scale(2); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* Racing HUD */
.racing-hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hud-top {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 3rem;
}

.lap-counter, .timer {
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5rem 1.5rem;
  border-radius: 10px;
  border: 2px solid #ff6600;
  text-align: center;
}

.position-display {
  background: rgba(0, 0, 0, 0.8);
  padding: 0.5rem 1.5rem;
  border-radius: 10px;
  border: 3px solid #00ff00;
  text-align: center;
  min-width: 80px;
}

.position-value {
  font-size: 2.5rem;
  color: #00ff00;
  font-weight: bold;
  line-height: 1;
}

.position-suffix {
  font-size: 1rem;
  color: #00ff00;
  vertical-align: super;
}

.position-total {
  font-size: 1rem;
  color: #888;
  margin-left: 0.3rem;
}

.lap-counter .label, .timer .label {
  display: block;
  font-size: 0.8rem;
  color: #ff6600;
  margin-bottom: 0.2rem;
}

.lap-counter .value, .timer .value {
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
}

.speedometer {
  position: absolute;
  bottom: 30px;
  right: 30px;
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem 1.5rem;
  border-radius: 15px;
  border: 2px solid #ff6600;
  text-align: center;
  min-width: 120px;
}

.speed-value {
  font-size: 3rem;
  color: white;
  font-weight: bold;
  line-height: 1;
}

.speed-unit {
  font-size: 0.8rem;
  color: #ff6600;
  margin-bottom: 0.5rem;
}

.speed-bar {
  width: 100%;
  height: 8px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
}

.speed-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff00, #ffff00, #ff0000);
  transition: width 0.1s ease;
}

/* Victory Screen */
.victory {
  animation: victoryGlow 2s ease-in-out infinite;
}

@keyframes victoryGlow {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5)); }
  50% { filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.8)); }
}

.victory-title {
  font-size: 3rem;
  color: #ffd700;
  margin-bottom: 2rem;
}

.final-time, .best-time {
  margin: 1rem 0;
}

.final-time .label, .best-time .label {
  display: block;
  font-size: 1rem;
  color: #888;
}

.final-time .time {
  font-size: 3rem;
  color: #ff6600;
}

.best-time .time {
  font-size: 2rem;
  color: #00ff00;
}

/* Track Selection */
.track-select {
  max-width: 900px;
}

.track-title {
  font-size: 2.5rem;
  color: #ffcc00;
  margin-bottom: 2rem;
  text-shadow: 0 0 20px rgba(255, 204, 0, 0.5);
}

.track-grid {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.track-card {
  background: rgba(20, 20, 40, 0.9);
  border: 3px solid #444;
  border-radius: 15px;
  padding: 1rem;
  width: 250px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.track-card:hover {
  border-color: #ff6600;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(255, 102, 0, 0.3);
}

.track-card.selected {
  border-color: #00ff00;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.4);
}

.track-preview {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  border: 2px solid;
  padding: 1rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.track-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.track-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #aaa;
}

.track-stats .stat {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
}

.track-name {
  color: #fff;
  margin: 0.5rem 0 0.3rem;
  font-size: 1.2rem;
}

.track-desc {
  color: #888;
  font-size: 0.85rem;
  margin: 0 0 0.5rem;
  font-weight: normal;
}

.track-difficulty {
  margin-bottom: 0.3rem;
}

.track-difficulty span {
  opacity: 0.3;
  font-size: 1rem;
}

.track-difficulty span.filled {
  opacity: 1;
}

.track-laps {
  color: #ff6600;
  font-size: 0.9rem;
  font-weight: bold;
}
</style>
