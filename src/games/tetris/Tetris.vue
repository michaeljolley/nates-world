<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const COLS = 10
const BLOCK_SIZE = 30

// Difficulty settings - affects board height
const difficulty = ref('easy')
const DIFFICULTY_ROWS = {
  easy: 20,
  normal: 15,
  hard: 10
}

// Get current rows based on difficulty
const ROWS = computed(() => DIFFICULTY_ROWS[difficulty.value])

// Tetromino shapes
const SHAPES = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f0f0' },
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000f0' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f0a000' }
}

const SHAPE_KEYS = Object.keys(SHAPES)

// Game state
const board = ref(createEmptyBoard())
const currentPiece = ref(null)
const currentPosition = ref({ x: 0, y: 0 })
const nextPiece = ref(null)
const heldPiece = ref(null)
const canHold = ref(true)
const score = ref(0)
const level = ref(1)
const lines = ref(0)
const gameOver = ref(false)
const isNewHighScore = ref(false)
const isPaused = ref(false)
const isPlaying = ref(false)
const clearingLines = ref([])
const isClearing = ref(false)
const highScores = ref(loadHighScores())

function loadHighScores() {
  try {
    return JSON.parse(localStorage.getItem('tetris_highscores') || '{}')
  } catch { return {} }
}

function saveHighScore() {
  const key = difficulty.value
  if (!highScores.value[key] || score.value > highScores.value[key]) {
    highScores.value[key] = score.value
    localStorage.setItem('tetris_highscores', JSON.stringify(highScores.value))
    return true
  }
  return false
}

const currentHighScore = computed(() => highScores.value[difficulty.value] || 0)

// Audio state
let audioCtx = null
const musicPlaying = ref(false)
let beatIndex = 0

// Musical notes for Tetris-style melody (based on Korobeiniki)
const MELODY_NOTES = [
  659.25, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00,
  440.00, 523.25, 659.25, 587.33, 523.25, 493.88,
  523.25, 587.33, 659.25, 523.25, 440.00, 440.00,
  587.33, 698.46, 880.00, 783.99, 698.46, 659.25,
  523.25, 659.25, 587.33, 523.25, 493.88, 493.88,
  523.25, 587.33, 659.25, 523.25, 440.00, 440.00
]

const BASS_NOTES = [
  164.81, 164.81, 174.61, 196.00, 174.61, 164.81, 146.83,
  146.83, 174.61, 220.00, 196.00, 174.61, 164.81,
  174.61, 196.00, 220.00, 174.61, 146.83, 146.83,
  196.00, 233.08, 293.66, 261.63, 233.08, 220.00,
  174.61, 220.00, 196.00, 174.61, 164.81, 164.81,
  174.61, 196.00, 220.00, 174.61, 146.83, 146.83
]

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
}

function playDropBeat() {
  if (!musicPlaying.value || !audioCtx) return
  
  const time = audioCtx.currentTime
  
  // Play melody note
  const melodyNote = MELODY_NOTES[beatIndex % MELODY_NOTES.length]
  playNote(melodyNote, time, 0.15, 'square', 0.12)
  
  // Play bass note
  const bassNote = BASS_NOTES[beatIndex % BASS_NOTES.length]
  playNote(bassNote, time, 0.2, 'triangle', 0.08)
  
  // Add percussion on every other beat
  if (beatIndex % 2 === 0) {
    playDrum(time)
  }
  
  beatIndex++
}

function playNote(frequency, time, duration, type, volume) {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  
  osc.type = type
  osc.frequency.setValueAtTime(frequency, time)
  
  gain.gain.setValueAtTime(volume, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + duration)
  
  osc.start(time)
  osc.stop(time + duration)
}

function playDrum(time) {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  
  osc.frequency.setValueAtTime(150, time)
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.1)
  
  gain.gain.setValueAtTime(0.15, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
  
  osc.start(time)
  osc.stop(time + 0.1)
}

function playLineClearSound() {
  if (!audioCtx) initAudio()
  
  const time = audioCtx.currentTime
  const notes = [523.25, 659.25, 783.99, 1046.50]
  
  notes.forEach((freq, i) => {
    playNote(freq, time + i * 0.08, 0.15, 'square', 0.1)
  })
}

function toggleMusic() {
  if (musicPlaying.value) {
    musicPlaying.value = false
  } else {
    initAudio()
    musicPlaying.value = true
    beatIndex = 0
  }
}

let gameLoop = null
let dropInterval = 1000

function createEmptyBoard() {
  const rows = DIFFICULTY_ROWS[difficulty.value]
  return Array(rows).fill(null).map(() => Array(COLS).fill(null))
}

function getRandomPiece() {
  const key = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)]
  return { ...SHAPES[key], type: key }
}

function resetGame() {
  board.value = createEmptyBoard()
  score.value = 0
  level.value = 1
  lines.value = 0
  gameOver.value = false
  isNewHighScore.value = false
  isPaused.value = false
  heldPiece.value = null
  canHold.value = true
  clearingLines.value = []
  isClearing.value = false
  dropInterval = 1000
  spawnPiece()
}

function spawnPiece() {
  currentPiece.value = nextPiece.value || getRandomPiece()
  nextPiece.value = getRandomPiece()
  currentPosition.value = {
    x: Math.floor(COLS / 2) - Math.floor(currentPiece.value.shape[0].length / 2),
    y: 0
  }
  
  if (checkCollision(currentPiece.value.shape, currentPosition.value)) {
    gameOver.value = true
    isNewHighScore.value = saveHighScore()
    stopGame()
  }
}

function checkCollision(shape, pos) {
  const rows = ROWS.value
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = pos.x + x
        const newY = pos.y + y
        
        if (newX < 0 || newX >= COLS || newY >= rows) {
          return true
        }
        
        if (newY >= 0 && board.value[newY][newX]) {
          return true
        }
      }
    }
  }
  return false
}

function rotatePiece() {
  if (!currentPiece.value || gameOver.value || isPaused.value || isClearing.value) return
  
  const shape = currentPiece.value.shape
  const rotated = shape[0].map((_, i) => 
    shape.map(row => row[i]).reverse()
  )
  
  if (!checkCollision(rotated, currentPosition.value)) {
    currentPiece.value = { ...currentPiece.value, shape: rotated }
  } else {
    // Wall kick - try moving left or right
    const kicks = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 2, y: 0 }]
    for (const kick of kicks) {
      const newPos = { x: currentPosition.value.x + kick.x, y: currentPosition.value.y + kick.y }
      if (!checkCollision(rotated, newPos)) {
        currentPiece.value = { ...currentPiece.value, shape: rotated }
        currentPosition.value = newPos
        break
      }
    }
  }
}

function holdPiece() {
  if (!currentPiece.value || gameOver.value || isPaused.value || !canHold.value) return
  
  const current = { ...SHAPES[currentPiece.value.type], type: currentPiece.value.type }
  
  if (heldPiece.value) {
    const held = { ...SHAPES[heldPiece.value.type], type: heldPiece.value.type }
    heldPiece.value = current
    currentPiece.value = held
    currentPosition.value = {
      x: Math.floor(COLS / 2) - Math.floor(held.shape[0].length / 2),
      y: 0
    }
  } else {
    heldPiece.value = current
    spawnPiece()
  }
  canHold.value = false
}

function movePiece(dx, dy) {
  if (!currentPiece.value || gameOver.value || isPaused.value || isClearing.value) return false
  
  const newPos = { x: currentPosition.value.x + dx, y: currentPosition.value.y + dy }
  
  if (!checkCollision(currentPiece.value.shape, newPos)) {
    currentPosition.value = newPos
    return true
  }
  return false
}

function dropPiece() {
  if (!movePiece(0, 1)) {
    lockPiece()
  }
}

function hardDrop() {
  if (!currentPiece.value || gameOver.value || isPaused.value || isClearing.value) return
  
  let dropDistance = 0
  while (movePiece(0, 1)) {
    dropDistance++
  }
  score.value += dropDistance * 2
  lockPiece()
}

function lockPiece() {
  const shape = currentPiece.value.shape
  const pos = currentPosition.value
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardY = pos.y + y
        const boardX = pos.x + x
        if (boardY >= 0) {
          board.value[boardY][boardX] = currentPiece.value.color
        }
      }
    }
  }
  
  const hasClears = checkForClears()
  canHold.value = true
  if (!hasClears) {
    spawnPiece()
  }
}

function checkForClears() {
  const rows = ROWS.value
  const linesToClear = []
  
  for (let y = rows - 1; y >= 0; y--) {
    if (board.value[y].every(cell => cell !== null)) {
      linesToClear.push(y)
    }
  }
  
  if (linesToClear.length > 0) {
    clearingLines.value = linesToClear
    isClearing.value = true
    playLineClearSound()
    
    setTimeout(() => {
      linesToClear.sort((a, b) => b - a).forEach(y => {
        board.value.splice(y, 1)
        board.value.unshift(Array(COLS).fill(null))
      })
      clearingLines.value = []
      
      const linesCleared = linesToClear.length
      lines.value += linesCleared
      const points = [0, 100, 300, 500, 800][linesCleared] * level.value
      score.value += points
      
      const newLevel = Math.floor(lines.value / 10) + 1
      if (newLevel > level.value) {
        level.value = newLevel
        dropInterval = Math.max(100, 1000 - (level.value - 1) * 100)
        restartGameLoop()
      }
      
      isClearing.value = false
      spawnPiece()
    }, 300)
    return true
  }
  return false
}

function handleKeyDown(e) {
  if (gameOver.value) return
  
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      movePiece(-1, 0)
      break
    case 'ArrowRight':
      e.preventDefault()
      movePiece(1, 0)
      break
    case 'ArrowDown':
      e.preventDefault()
      dropPiece()
      score.value += 1
      break
    case 'ArrowUp':
      e.preventDefault()
      rotatePiece()
      break
    case ' ':
      e.preventDefault()
      hardDrop()
      break
    case 'p':
    case 'P':
      e.preventDefault()
      togglePause()
      break
    case 'c':
    case 'C':
      e.preventDefault()
      holdPiece()
      break
  }
}

function startGame() {
  isPlaying.value = true
  initAudio()
  beatIndex = 0
  musicPlaying.value = true
  resetGame()
  startGameLoop()
  window.addEventListener('keydown', handleKeyDown)
}

function stopGame() {
  isPlaying.value = false
  musicPlaying.value = false
  if (gameLoop) {
    clearInterval(gameLoop)
    gameLoop = null
  }
}

function togglePause() {
  if (gameOver.value) return
  
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    if (gameLoop) {
      clearInterval(gameLoop)
      gameLoop = null
    }
  } else {
    startGameLoop()
  }
}

function startGameLoop() {
  if (gameLoop) clearInterval(gameLoop)
  gameLoop = setInterval(() => {
    if (!isPaused.value && !gameOver.value && !isClearing.value) {
      dropPiece()
    }
  }, dropInterval)
}

function restartGameLoop() {
  if (!isPaused.value && !gameOver.value) {
    startGameLoop()
  }
}

// Difficulty selection
function setDifficulty(level) {
  difficulty.value = level
  board.value = createEmptyBoard()
}

// Computed styles for rendering
const boardStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${COLS}, ${BLOCK_SIZE}px)`,
  gridTemplateRows: `repeat(${ROWS.value}, ${BLOCK_SIZE}px)`,
  gap: '1px',
  background: 'rgba(0, 0, 0, 0.8)',
  border: '3px solid var(--primary)',
  borderRadius: '5px',
  padding: '5px'
}))

const nextPieceStyle = computed(() => {
  if (!nextPiece.value) return {}
  const cols = nextPiece.value.shape[0].length
  const rows = nextPiece.value.shape.length
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 20px)`,
    gridTemplateRows: `repeat(${rows}, 20px)`,
    gap: '1px'
  }
})

const heldPieceStyle = computed(() => {
  if (!heldPiece.value) return {}
  const cols = heldPiece.value.shape[0].length
  const rows = heldPiece.value.shape.length
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 20px)`,
    gridTemplateRows: `repeat(${rows}, 20px)`,
    gap: '1px'
  }
})

// Calculate ghost piece Y position (hard drop preview)
const ghostY = computed(() => {
  if (!currentPiece.value) return 0
  const shape = currentPiece.value.shape
  const pos = currentPosition.value
  let testY = pos.y
  
  while (true) {
    testY++
    if (checkCollision(shape, { x: pos.x, y: testY })) {
      return testY - 1
    }
  }
})

// Get rendered board with ghost piece and current piece
const renderedBoard = computed(() => {
  const rendered = board.value.map(row => [...row])
  const rows = ROWS.value
  
  if (currentPiece.value && !gameOver.value) {
    const shape = currentPiece.value.shape
    const pos = currentPosition.value
    
    // Draw ghost piece first (underneath current piece)
    const gy = ghostY.value
    if (gy !== pos.y) {
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardY = gy + y
            const boardX = pos.x + x
            if (boardY >= 0 && boardY < rows && boardX >= 0 && boardX < COLS && !rendered[boardY][boardX]) {
              rendered[boardY][boardX] = currentPiece.value.color + '_ghost'
            }
          }
        }
      }
    }
    
    // Draw current piece (overwrites ghost if overlapping)
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardY = pos.y + y
          const boardX = pos.x + x
          if (boardY >= 0 && boardY < rows && boardX >= 0 && boardX < COLS) {
            rendered[boardY][boardX] = currentPiece.value.color
          }
        }
      }
    }
  }
  
  // Mark clearing lines
  clearingLines.value.forEach(lineY => {
    for (let x = 0; x < COLS; x++) {
      rendered[lineY][x] = 'clearing'
    }
  })
  
  return rendered
})

onMounted(() => {
  // Pre-generate first next piece
  nextPiece.value = getRandomPiece()
})

onUnmounted(() => {
  stopGame()
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="tetris-wrapper" :data-difficulty="difficulty">
    <div class="lightning-bg"></div>
    <div class="bolt bolt-1">⚡</div>
    <div class="bolt bolt-2">⚡</div>
    
    <div class="container">
      <h1>TETRIS</h1>
      
      <div class="difficulty-selector" v-if="!isPlaying">
        <span>Difficulty:</span>
        <button 
          v-for="level in ['easy', 'normal', 'hard']" 
          :key="level"
          class="diff-btn"
          :class="{ active: difficulty === level }"
          @click="setDifficulty(level)"
        >
          {{ level }}
        </button>
      </div>
      
      <div class="difficulty-info" v-if="!isPlaying">
        <span class="diff-hint">
          {{ difficulty === 'easy' ? '20 rows - More room to play!' : difficulty === 'normal' ? '15 rows - Standard challenge!' : '10 rows - Expert mode!' }}
        </span>
      </div>
      
      <div class="game-area">
        <div class="stats-panel">
          <div class="stat-box">
            <span class="stat-label">Score</span>
            <span class="stat-value">{{ score }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Level</span>
            <span class="stat-value">{{ level }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Lines</span>
            <span class="stat-value">{{ lines }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Best</span>
            <span class="stat-value hi-score">{{ currentHighScore }}</span>
          </div>
          <div class="stat-box next-piece-box">
            <span class="stat-label">Next</span>
            <div class="next-piece-preview" :style="nextPieceStyle" v-if="nextPiece">
              <template v-for="(row, y) in nextPiece.shape" :key="y">
                <div 
                  v-for="(cell, x) in row" 
                  :key="`${y}-${x}`"
                  class="preview-cell"
                  :style="{ background: cell ? nextPiece.color : 'transparent' }"
                ></div>
              </template>
            </div>
          </div>
          <div class="stat-box next-piece-box">
            <span class="stat-label">Hold <kbd>C</kbd></span>
            <div class="next-piece-preview" :style="heldPieceStyle" v-if="heldPiece">
              <template v-for="(row, y) in heldPiece.shape" :key="y">
                <div 
                  v-for="(cell, x) in row" 
                  :key="`hold-${y}-${x}`"
                  class="preview-cell"
                  :style="{ background: cell ? heldPiece.color : 'transparent' }"
                ></div>
              </template>
            </div>
            <div class="empty-hold" v-else>—</div>
          </div>
        </div>
        
        <div class="board-container">
          <div class="board" :style="boardStyle">
            <template v-for="(row, y) in renderedBoard" :key="y">
              <div 
                v-for="(cell, x) in row" 
                :key="`${y}-${x}`"
                class="cell"
                :style="{ background: cell && !cell.endsWith('_ghost') && cell !== 'clearing' ? cell : cell === 'clearing' ? '#fff' : 'rgba(20, 20, 40, 0.5)' }"
                :class="{ 
                  filled: cell && !cell.endsWith('_ghost') && cell !== 'clearing', 
                  ghost: cell && cell.endsWith('_ghost'),
                  clearing: cell === 'clearing'
                }"
              ></div>
            </template>
          </div>
          
          <div v-if="!isPlaying" class="overlay start-overlay">
            <button class="start-btn" @click="startGame">START GAME</button>
            <div class="controls-hint">
              <p>← → Move</p>
              <p>↑ Rotate</p>
              <p>↓ Soft Drop</p>
              <p>Space Hard Drop</p>
              <p>C Hold Piece</p>
              <p>P Pause</p>
            </div>
          </div>
          
          <div v-if="gameOver" class="overlay game-over-overlay">
            <h2>GAME OVER</h2>
            <p v-if="isNewHighScore" class="new-high-score">🏆 NEW HIGH SCORE! 🏆</p>
            <p class="final-score">Score: {{ score }}</p>
            <p class="high-score-line">Best: {{ currentHighScore }}</p>
            <button class="restart-btn" @click="startGame">PLAY AGAIN</button>
          </div>
          
          <div v-if="isPaused && !gameOver" class="overlay pause-overlay">
            <h2>PAUSED</h2>
            <button class="resume-btn" @click="togglePause">RESUME</button>
          </div>
        </div>
      </div>
      
      <div class="mobile-controls" v-if="isPlaying && !gameOver">
        <div class="control-row">
          <button class="control-btn" @click="holdPiece">⬒</button>
          <button class="control-btn" @click="rotatePiece">↻</button>
        </div>
        <div class="control-row">
          <button class="control-btn" @click="movePiece(-1, 0)">←</button>
          <button class="control-btn" @click="hardDrop">⬇</button>
          <button class="control-btn" @click="movePiece(1, 0)">→</button>
        </div>
        <div class="control-row">
          <button class="control-btn small" @click="dropPiece">▼</button>
          <button class="control-btn small" @click="togglePause">⏸</button>
        </div>
      </div>
      
      <button class="music-btn" @click="toggleMusic">
        {{ musicPlaying ? '🔊 Music' : '🔇 Music' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.tetris-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Courier New', monospace;
  color: #0ff;
  text-shadow: 0 0 10px #0ff, 0 0 20px #0ff;
  --primary: #0ff;
  --secondary: #f0f;
  padding: 20px;
  position: relative;
  box-sizing: border-box;
  transition: all 0.5s ease;
}

.tetris-wrapper[data-difficulty="easy"] {
  --primary: #0f0;
  --secondary: #0ff;
  color: #0f0;
  text-shadow: 0 0 10px #0f0, 0 0 20px #0f0;
}

.tetris-wrapper[data-difficulty="normal"] {
  --primary: #ff0;
  --secondary: #f90;
  color: #ff0;
  text-shadow: 0 0 10px #ff0, 0 0 20px #ff0;
}

.tetris-wrapper[data-difficulty="hard"] {
  --primary: #f00;
  --secondary: #f0f;
  color: #f00;
  text-shadow: 0 0 10px #f00, 0 0 20px #f00;
}

.lightning-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: 
    linear-gradient(135deg, transparent 40%, rgba(0, 255, 255, 0.03) 50%, transparent 60%),
    linear-gradient(-135deg, transparent 40%, rgba(255, 0, 255, 0.03) 50%, transparent 60%);
  z-index: 0;
}

.bolt {
  position: fixed;
  font-size: 15rem;
  opacity: 0.03;
  z-index: 0;
  pointer-events: none;
}

[data-theme="light"] .bolt {
  opacity: 0.08;
}

.bolt-1 { 
  top: 10%; 
  left: 5%; 
  transform: rotate(-15deg); 
  color: var(--primary);
}

.bolt-2 { 
  bottom: 10%; 
  right: 5%; 
  transform: rotate(15deg); 
  color: var(--secondary);
}

.container {
  text-align: center;
  padding: 30px;
  background: rgba(10, 10, 30, 0.9);
  border-radius: 20px;
  position: relative;
  z-index: 1;
}

.container::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: conic-gradient(from 0deg, #0ff, #f0f, #ff0, #0f0, #0ff);
  border-radius: 22px;
  z-index: -1;
  animation: rotateBorder 3s linear infinite;
}

@keyframes rotateBorder {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
  letter-spacing: 8px;
  background: linear-gradient(90deg, #0ff, #f0f, #0ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

.difficulty-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  font-size: 1em;
}

.diff-btn {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  padding: 8px 16px;
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
}

.diff-btn:hover {
  box-shadow: 0 0 15px var(--primary);
}

.diff-btn.active {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  color: #000;
  border-color: transparent;
  box-shadow: 0 0 20px var(--primary);
  text-shadow: none;
}

.difficulty-info {
  margin-bottom: 20px;
}

.diff-hint {
  font-size: 0.9em;
  opacity: 0.8;
}

.music-btn {
  font-family: 'Courier New', monospace;
  font-size: 1em;
  padding: 12px 30px;
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: 30px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
  margin-top: 20px;
}

.music-btn:hover {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  color: #000;
  box-shadow: 0 0 30px var(--primary);
  text-shadow: none;
}

.game-area {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
}

.stats-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 120px;
}

.stat-box {
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid var(--primary);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.8;
  text-transform: uppercase;
}

.stat-value {
  font-size: 1.8em;
  font-weight: bold;
}

.next-piece-box {
  min-height: 100px;
}

.next-piece-preview {
  margin-top: 10px;
}

.preview-cell {
  border-radius: 2px;
  box-shadow: inset 0 0 3px rgba(255, 255, 255, 0.3);
}

.board-container {
  position: relative;
}

.board {
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
}

.cell {
  border-radius: 2px;
  transition: background 0.1s ease;
}

.cell.filled {
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.5), 0 0 5px currentColor;
}

.cell.ghost {
  border: 2px dashed rgba(255, 255, 255, 0.4);
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08) !important;
}

.cell.clearing {
  background: #fff !important;
  box-shadow: 0 0 15px #fff, 0 0 30px #fff;
  animation: line-flash 0.3s ease-out;
}

@keyframes line-flash {
  0% { background: #fff; box-shadow: 0 0 30px #fff; }
  50% { background: #ff0; box-shadow: 0 0 20px #ff0; }
  100% { background: #fff; box-shadow: 0 0 10px #fff; }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 5px;
  z-index: 10;
}

.overlay h2 {
  font-size: 2em;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #f00, #ff0, #f00);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 2s linear infinite;
}

.final-score {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #ff0;
}

.high-score-line {
  font-size: 1em;
  margin-bottom: 20px;
  opacity: 0.7;
}

.new-high-score {
  font-size: 1.3em;
  color: #f0f;
  text-shadow: 0 0 20px #f0f, 0 0 40px #f0f;
  animation: high-score-pulse 0.5s ease-in-out infinite alternate;
  margin-bottom: 10px;
}

@keyframes high-score-pulse {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.hi-score {
  color: #f0f;
}

.empty-hold {
  opacity: 0.3;
  font-size: 1.5em;
  text-align: center;
  margin-top: 5px;
}

kbd {
  font-size: 0.7em;
  opacity: 0.6;
  background: rgba(255, 255, 255, 0.1);
  padding: 1px 4px;
  border-radius: 3px;
}

.controls-hint {
  margin-top: 20px;
  font-size: 0.9em;
  opacity: 0.8;
  line-height: 1.8;
}

.controls-hint p {
  margin: 5px 0;
}

.start-btn, .restart-btn, .resume-btn {
  font-family: 'Courier New', monospace;
  font-size: 1.2em;
  padding: 15px 40px;
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: 30px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
  letter-spacing: 2px;
}

.start-btn:hover, .restart-btn:hover, .resume-btn:hover {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  color: #000;
  box-shadow: 0 0 30px var(--primary);
  text-shadow: none;
}

.mobile-controls {
  display: none;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.control-row {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.control-btn {
  font-family: 'Courier New', monospace;
  font-size: 1.5em;
  width: 60px;
  height: 60px;
  background: rgba(0, 255, 255, 0.1);
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn.small {
  width: 50px;
  height: 50px;
  font-size: 1.2em;
}

.control-btn:active {
  background: var(--primary);
  color: #000;
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .game-area {
    flex-direction: column;
    align-items: center;
  }
  
  .stats-panel {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    min-width: unset;
  }
  
  .stat-box {
    min-width: 80px;
    padding: 10px;
  }
  
  .next-piece-box {
    min-height: unset;
  }
  
  .mobile-controls {
    display: flex;
  }
  
  h1 {
    font-size: 1.8em;
    letter-spacing: 4px;
  }
}

@media (max-width: 400px) {
  .container {
    padding: 15px;
  }
  
  .board {
    transform: scale(0.85);
    transform-origin: top center;
  }
}
</style>
