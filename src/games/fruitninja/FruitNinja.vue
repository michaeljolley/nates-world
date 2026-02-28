<script setup>
import { ref, watch, onUnmounted } from 'vue'
import GameCanvas from './components/GameCanvas.vue'
import GameUI from './components/GameUI.vue'
import { useGameState } from './composables/useGameState'

const gameCanvasRef = ref(null)
const {
  gameState,
  score,
  highScore,
  lives,
  combo,
  maxCombo,
  startGame,
  addScore,
  resetCombo,
  loseLife,
  backToMenu
} = useGameState()

// Background music using Web Audio API
let audioContext = null
let musicInterval = null
const isMusicPlaying = ref(false)

// Ninja/Asian pentatonic scale frequencies
const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]

function createAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// Play a drum hit sound
function playDrum(time = 0) {
  const ctx = createAudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  
  osc.connect(gain)
  gain.connect(ctx.destination)
  
  osc.frequency.setValueAtTime(80, ctx.currentTime + time)
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + time + 0.1)
  
  gain.gain.setValueAtTime(0.4, ctx.currentTime + time)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + 0.3)
  
  osc.start(ctx.currentTime + time)
  osc.stop(ctx.currentTime + time + 0.3)
}

// Play a gong/bell sound
function playGong(freq, time = 0) {
  const ctx = createAudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  
  osc.type = 'sine'
  osc.connect(gain)
  gain.connect(ctx.destination)
  
  osc.frequency.setValueAtTime(freq, ctx.currentTime + time)
  
  gain.gain.setValueAtTime(0.15, ctx.currentTime + time)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + 0.8)
  
  osc.start(ctx.currentTime + time)
  osc.stop(ctx.currentTime + time + 0.8)
}

// Play a flute-like melody note
function playFlute(freq, time = 0, duration = 0.4) {
  const ctx = createAudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  
  osc.type = 'triangle'
  osc.connect(gain)
  gain.connect(ctx.destination)
  
  osc.frequency.setValueAtTime(freq, ctx.currentTime + time)
  
  gain.gain.setValueAtTime(0, ctx.currentTime + time)
  gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + time + 0.05)
  gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + time + duration * 0.7)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + duration)
  
  osc.start(ctx.currentTime + time)
  osc.stop(ctx.currentTime + time + duration)
}

// Play a complete ninja music loop
let beatCount = 0
function playMusicBeat() {
  const beat = beatCount % 16
  
  // Taiko drum pattern
  if (beat === 0 || beat === 4 || beat === 8 || beat === 12) {
    playDrum()
  }
  if (beat === 2 || beat === 6 || beat === 10 || beat === 14) {
    playDrum()
  }
  
  // Melody (pentatonic Asian scale)
  if (beat === 0) {
    playFlute(pentatonicScale[4], 0, 0.5) // A
  } else if (beat === 4) {
    playFlute(pentatonicScale[2], 0, 0.3) // E
  } else if (beat === 6) {
    playFlute(pentatonicScale[3], 0, 0.3) // G
  } else if (beat === 8) {
    playFlute(pentatonicScale[4], 0, 0.5) // A
  } else if (beat === 10) {
    playFlute(pentatonicScale[5], 0, 0.3) // C high
  } else if (beat === 12) {
    playFlute(pentatonicScale[3], 0, 0.6) // G
  }
  
  // Occasional gong
  if (beat === 0 && beatCount % 32 === 0) {
    playGong(220, 0)
  }
  
  beatCount++
}

function playMusic() {
  if (isMusicPlaying.value) return
  
  createAudioContext()
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  
  beatCount = 0
  musicInterval = setInterval(playMusicBeat, 200) // 300 BPM feel
  isMusicPlaying.value = true
}

function pauseMusic() {
  if (musicInterval) {
    clearInterval(musicInterval)
    musicInterval = null
  }
  isMusicPlaying.value = false
}

function toggleMusic() {
  if (isMusicPlaying.value) {
    pauseMusic()
  } else {
    playMusic()
  }
}

function handleStart() {
  startGame()
  playMusic()
}

function handleRestart() {
  startGame()
  playMusic()
}

function handleScore(points) {
  addScore(points)
}

function handleBombHit() {
  loseLife()
}

function handleResetCombo() {
  resetCombo()
}

function handleBackToMenu() {
  backToMenu()
  pauseMusic()
}

// Cleanup on unmount
onUnmounted(() => {
  pauseMusic()
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
})

// Pause music when game ends
watch(gameState, (newState) => {
  if (newState === 'gameOver') {
    pauseMusic()
  }
})
</script>

<template>
  <div class="fruit-ninja-game">
    <!-- Music toggle button -->
    <button class="music-toggle" @click="toggleMusic" :title="isMusicPlaying ? 'Mute Music' : 'Play Music'">
      {{ isMusicPlaying ? '🔊' : '🔇' }}
    </button>
    
    <GameCanvas
      v-if="gameState === 'playing'"
      ref="gameCanvasRef"
      :on-score="handleScore"
      :on-bomb-hit="handleBombHit"
      :on-reset-combo="handleResetCombo"
    />
    
    <GameUI
      :game-state="gameState"
      :score="score"
      :high-score="highScore"
      :lives="lives"
      :combo="combo"
      :max-combo="maxCombo"
      @start="handleStart"
      @restart="handleRestart"
      @back-to-menu="handleBackToMenu"
    />
  </div>
</template>

<style scoped>
.fruit-ninja-game {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.music-toggle {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 100;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.music-toggle:hover {
  background: rgba(0, 0, 0, 0.7);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}
</style>
