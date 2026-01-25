<script setup>
import { ref, computed, onUnmounted } from 'vue'

const gameState = ref(['', '', '', '', '', '', '', '', ''])
const currentPlayer = ref('X')
const gameActive = ref(true)
const playerSymbol = 'X'
const aiSymbol = 'O'

const scores = ref({ player: 0, ai: 0, draw: 0 })
const difficulty = ref('easy')

// Audio state
let audioCtx = null
const musicPlaying = ref(false)
let beatInterval = null

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
]

const statusMessage = ref('Your turn (X)')
const winningCells = ref([])
const playerWon = ref(false)
const playerLost = ref(false)

const statusText = computed(() => statusMessage.value)

function handleCellClick(index) {
  if (gameState.value[index] !== '' || !gameActive.value || currentPlayer.value !== playerSymbol) {
    return
  }
  makeMove(index, playerSymbol)
  if (gameActive.value && currentPlayer.value === aiSymbol) {
    setTimeout(aiMove, 500)
  }
}

function makeMove(index, player) {
  gameState.value[index] = player
  checkResult()
}

function checkResult() {
  let roundWon = false
  let winningCombination = null

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i]
    if (gameState.value[a] === '' || gameState.value[b] === '' || gameState.value[c] === '') {
      continue
    }
    if (gameState.value[a] === gameState.value[b] && gameState.value[b] === gameState.value[c]) {
      roundWon = true
      winningCombination = [a, b, c]
      break
    }
  }

  if (roundWon) {
    statusMessage.value = currentPlayer.value === playerSymbol ? 'You Win!' : 'Computer Wins!'
    gameActive.value = false
    winningCells.value = winningCombination
    updateScore(currentPlayer.value === playerSymbol ? 'player' : 'ai')
    if (currentPlayer.value === playerSymbol) {
      playerWon.value = true
      playWinSound()
    } else {
      playerLost.value = true
      playLoseSound()
    }
    return
  }

  if (!gameState.value.includes('')) {
    statusMessage.value = 'Draw!'
    gameActive.value = false
    updateScore('draw')
    return
  }

  currentPlayer.value = currentPlayer.value === playerSymbol ? aiSymbol : playerSymbol
  statusMessage.value = currentPlayer.value === playerSymbol ? 'Your turn (X)' : 'Computer thinking...'
}

function updateScore(winner) {
  scores.value[winner]++
}

function playWinSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const notes = [523.25, 659.25, 783.99, 1046.50]
  
  notes.forEach((freq, i) => {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.frequency.value = freq
    oscillator.type = 'square'
    const startTime = ctx.currentTime + i * 0.15
    gainNode.gain.setValueAtTime(0.1, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2)
    oscillator.start(startTime)
    oscillator.stop(startTime + 0.2)
  })
}

function playLoseSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const notes = [392.00, 349.23, 311.13, 261.63]
  
  notes.forEach((freq, i) => {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.frequency.value = freq
    oscillator.type = 'sawtooth'
    const startTime = ctx.currentTime + i * 0.25
    gainNode.gain.setValueAtTime(0.08, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)
    oscillator.start(startTime)
    oscillator.stop(startTime + 0.3)
  })
}

function aiMove() {
  if (!gameActive.value) return
  const bestMove = findBestMove()
  makeMove(bestMove, aiSymbol)
}

function findBestMove() {
  if (difficulty.value === 'easy') {
    return findRandomMove()
  } else if (difficulty.value === 'medium') {
    if (Math.random() < 0.3) return findRandomMove()
    return findSmartMove()
  } else {
    if (Math.random() < 0.3) return findSmartMove()
    return findPerfectMove()
  }
}

function findRandomMove() {
  const availableMoves = gameState.value.map((val, idx) => val === '' ? idx : null).filter(val => val !== null)
  return availableMoves[Math.floor(Math.random() * availableMoves.length)]
}

function findSmartMove() {
  // Check if AI can win
  for (let i = 0; i < 9; i++) {
    if (gameState.value[i] === '') {
      gameState.value[i] = aiSymbol
      if (checkWinner(aiSymbol)) {
        gameState.value[i] = ''
        return i
      }
      gameState.value[i] = ''
    }
  }

  // Block player from winning
  for (let i = 0; i < 9; i++) {
    if (gameState.value[i] === '') {
      gameState.value[i] = playerSymbol
      if (checkWinner(playerSymbol)) {
        gameState.value[i] = ''
        return i
      }
      gameState.value[i] = ''
    }
  }

  // Take center if available
  if (gameState.value[4] === '') return 4

  // Take a corner
  const corners = [0, 2, 6, 8]
  const availableCorners = corners.filter(i => gameState.value[i] === '')
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)]
  }

  return findRandomMove()
}

function findPerfectMove() {
  let bestScore = -Infinity
  let bestMove = 0
  
  for (let i = 0; i < 9; i++) {
    if (gameState.value[i] === '') {
      gameState.value[i] = aiSymbol
      const score = minimax([...gameState.value], 0, false)
      gameState.value[i] = ''
      if (score > bestScore) {
        bestScore = score
        bestMove = i
      }
    }
  }
  return bestMove
}

function minimax(state, depth, isMaximizing) {
  if (checkWinnerState(state, aiSymbol)) return 10 - depth
  if (checkWinnerState(state, playerSymbol)) return depth - 10
  if (!state.includes('')) return 0
  
  if (isMaximizing) {
    let bestScore = -Infinity
    for (let i = 0; i < 9; i++) {
      if (state[i] === '') {
        state[i] = aiSymbol
        const score = minimax(state, depth + 1, false)
        state[i] = ''
        bestScore = Math.max(score, bestScore)
      }
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (let i = 0; i < 9; i++) {
      if (state[i] === '') {
        state[i] = playerSymbol
        const score = minimax(state, depth + 1, true)
        state[i] = ''
        bestScore = Math.min(score, bestScore)
      }
    }
    return bestScore
  }
}

function checkWinner(player) {
  return winningConditions.some(condition => {
    return condition.every(index => gameState.value[index] === player)
  })
}

function checkWinnerState(state, player) {
  return winningConditions.some(condition => {
    return condition.every(index => state[index] === player)
  })
}

function restartGame() {
  gameState.value = ['', '', '', '', '', '', '', '', '']
  currentPlayer.value = playerSymbol
  gameActive.value = true
  statusMessage.value = 'Your turn (X)'
  winningCells.value = []
  playerWon.value = false
  playerLost.value = false
}

function setDifficulty(level) {
  difficulty.value = level
  restartGame()
  if (musicPlaying.value) {
    stopMusic()
    startMusic()
  }
}

function createBeatboxLoop() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  
  let beatIndex = 0
  const settings = {
    easy: { bpm: 80, kickVol: 0.3, bassVol: 0.08, hihatVol: 0.1, snareVol: 0.15 },
    medium: { bpm: 110, kickVol: 0.4, bassVol: 0.12, hihatVol: 0.18, snareVol: 0.25 },
    hard: { bpm: 140, kickVol: 0.5, bassVol: 0.15, hihatVol: 0.22, snareVol: 0.3 }
  }
  
  const cfg = settings[difficulty.value] || settings.easy
  const beatDuration = 60 / cfg.bpm

  function playKick(time) {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.frequency.setValueAtTime(difficulty.value === 'hard' ? 180 : 150, time)
    osc.frequency.exponentialRampToValueAtTime(difficulty.value === 'hard' ? 40 : 50, time + 0.1)
    gain.gain.setValueAtTime(cfg.kickVol, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
    osc.start(time)
    osc.stop(time + 0.15)
  }

  function playHiHat(time) {
    const bufferSize = audioCtx.sampleRate * 0.05
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const noise = audioCtx.createBufferSource()
    noise.buffer = buffer
    const filter = audioCtx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = difficulty.value === 'hard' ? 8000 : 7000
    const gain = audioCtx.createGain()
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(audioCtx.destination)
    gain.gain.setValueAtTime(cfg.hihatVol, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05)
    noise.start(time)
    noise.stop(time + 0.05)
  }

  function playSnare(time) {
    const bufferSize = audioCtx.sampleRate * 0.1
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const noise = audioCtx.createBufferSource()
    noise.buffer = buffer
    const filter = audioCtx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = difficulty.value === 'hard' ? 4000 : 3000
    const gain = audioCtx.createGain()
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(audioCtx.destination)
    gain.gain.setValueAtTime(cfg.snareVol, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
    noise.start(time)
    noise.stop(time + 0.1)
    
    const osc = audioCtx.createOscillator()
    const oscGain = audioCtx.createGain()
    osc.connect(oscGain)
    oscGain.connect(audioCtx.destination)
    osc.frequency.value = difficulty.value === 'hard' ? 220 : 180
    oscGain.gain.setValueAtTime(cfg.snareVol * 0.7, time)
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08)
    osc.start(time)
    osc.stop(time + 0.08)
  }

  function playBass(time, note) {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.type = difficulty.value === 'hard' ? 'sawtooth' : 'square'
    osc.frequency.value = note
    gain.gain.setValueAtTime(cfg.bassVol, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2)
    osc.start(time)
    osc.stop(time + 0.2)
  }

  function playSynth(time, note) {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.type = 'square'
    osc.frequency.value = note
    gain.gain.setValueAtTime(0.08, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
    osc.start(time)
    osc.stop(time + 0.15)
  }

  const easyPattern = [
    { kick: true, bass: 65.41 }, { hihat: true }, { snare: true }, { hihat: true },
    { kick: true, bass: 82.41 }, { hihat: true }, { snare: true }, { hihat: true }
  ]

  const mediumPattern = [
    { kick: true, hihat: true, bass: 73.42 }, { hihat: true, synth: 293.66 },
    { snare: true, hihat: true }, { hihat: true, bass: 87.31 },
    { kick: true, hihat: true }, { hihat: true, synth: 329.63 },
    { snare: true, hihat: true, bass: 98.00 }, { kick: true, hihat: true },
    { hihat: true }, { snare: true, hihat: true, synth: 392.00 },
    { hihat: true, bass: 73.42 }, { kick: true, hihat: true }
  ]

  const hardPattern = [
    { kick: true, hihat: true, bass: 55.00, synth: 440.00 }, { kick: true, hihat: true },
    { snare: true, hihat: true, synth: 523.25 }, { hihat: true, bass: 61.74 },
    { kick: true, hihat: true }, { kick: true, hihat: true, synth: 587.33 },
    { snare: true, hihat: true, bass: 73.42 }, { hihat: true },
    { kick: true, hihat: true, synth: 659.25 }, { kick: true, hihat: true, bass: 82.41 },
    { snare: true, hihat: true }, { kick: true, hihat: true, synth: 523.25 },
    { hihat: true, bass: 55.00 }, { kick: true, snare: true, hihat: true },
    { hihat: true, synth: 698.46 }, { kick: true, hihat: true, bass: 61.74 }
  ]

  const patterns = { easy: easyPattern, medium: mediumPattern, hard: hardPattern }
  const pattern = patterns[difficulty.value] || easyPattern

  beatInterval = setInterval(() => {
    if (!musicPlaying.value) return
    const time = audioCtx.currentTime
    const beat = pattern[beatIndex % pattern.length]
    
    if (beat.kick) playKick(time)
    if (beat.hihat) playHiHat(time)
    if (beat.snare) playSnare(time)
    if (beat.bass) playBass(time, beat.bass)
    if (beat.synth) playSynth(time, beat.synth)
    
    beatIndex++
  }, beatDuration * 1000 / 2)
}

function startMusic() {
  musicPlaying.value = true
  createBeatboxLoop()
}

function stopMusic() {
  musicPlaying.value = false
  if (beatInterval) {
    clearInterval(beatInterval)
    beatInterval = null
  }
}

function toggleMusic() {
  if (musicPlaying.value) {
    stopMusic()
  } else {
    startMusic()
  }
}

onUnmounted(() => {
  stopMusic()
})

function getCellClass(index) {
  const classes = ['cell']
  const val = gameState.value[index]
  if (val === 'X') classes.push('x')
  if (val === 'O') classes.push('o')
  if (winningCells.value.includes(index)) classes.push('winning')
  return classes.join(' ')
}
</script>

<template>
  <div class="ttt-wrapper" :class="{ 'player-won': playerWon, 'player-lost': playerLost, 'music-playing': musicPlaying }" :data-difficulty="difficulty">
    <div class="lightning-bg"></div>
    <div class="bolt bolt-1">⚡</div>
    <div class="bolt bolt-2">⚡</div>
    
    <div class="container">
      <h1>TIC-TAC-TOE</h1>
      
      <div class="difficulty-selector">
        <span>Difficulty:</span>
        <button 
          v-for="level in ['easy', 'medium', 'hard']" 
          :key="level"
          class="diff-btn"
          :class="{ active: difficulty === level }"
          @click="setDifficulty(level)"
        >
          {{ level }}
        </button>
      </div>

      <div class="scoreboard">
        <div class="score">
          <span class="score-label">You (X)</span>
          <span class="score-value">{{ scores.player }}</span>
        </div>
        <div class="score">
          <span class="score-label">Draws</span>
          <span class="score-value">{{ scores.draw }}</span>
        </div>
        <div class="score">
          <span class="score-label">CPU (O)</span>
          <span class="score-value">{{ scores.ai }}</span>
        </div>
      </div>

      <div class="game-info">
        <p id="status">{{ statusText }}</p>
      </div>

      <div class="board">
        <div 
          v-for="(cell, index) in gameState" 
          :key="index"
          :class="getCellClass(index)"
          @click="handleCellClick(index)"
        >
          {{ cell }}
        </div>
      </div>

      <button class="restart-btn" @click="restartGame">New Game</button>
      <button class="music-btn" @click="toggleMusic">
        {{ musicPlaying ? '🔊 Music' : '🔇 Music' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.ttt-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Courier New', monospace;
  color: #0f0;
  text-shadow: 0 0 10px #0f0, 0 0 20px #0f0;
  transition: all 0.5s ease;
  --primary: #0f0;
  --secondary: #0ff;
  padding: 20px;
  position: relative;
}

.lightning-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: 
    linear-gradient(135deg, transparent 40%, rgba(255, 102, 0, 0.03) 50%, transparent 60%),
    linear-gradient(-135deg, transparent 40%, rgba(0, 200, 83, 0.03) 50%, transparent 60%);
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

.ttt-wrapper[data-difficulty="easy"] {
  --primary: #0f0;
  --secondary: #0ff;
  color: #0f0;
  text-shadow: 0 0 10px #0f0, 0 0 20px #0f0;
}

.ttt-wrapper[data-difficulty="medium"] {
  --primary: #ff0;
  --secondary: #f90;
  color: #ff0;
  text-shadow: 0 0 10px #ff0, 0 0 20px #ff0;
}

.ttt-wrapper[data-difficulty="hard"] {
  --primary: #f00;
  --secondary: #f0f;
  color: #f00;
  text-shadow: 0 0 10px #f00, 0 0 20px #f00;
}

.container {
  text-align: center;
  padding: 30px;
  background: rgba(10, 10, 30, 0.9);
  border-radius: 20px;
  position: relative;
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
  margin-bottom: 20px;
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

.scoreboard {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 15px;
  border: 2px solid var(--primary);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
}

.score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.score-label {
  font-size: 0.9em;
  opacity: 0.8;
}

.score-value {
  font-size: 2em;
  font-weight: bold;
}

.game-info {
  margin-bottom: 20px;
}

#status {
  font-size: 1.5em;
  min-height: 30px;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 10px;
  margin: 20px auto;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid var(--primary);
  border-radius: 15px;
  justify-content: center;
}

.cell {
  background: rgba(20, 20, 40, 0.8);
  border: 2px solid var(--primary);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cell:hover {
  background: rgba(30, 30, 60, 0.9);
  box-shadow: 0 0 20px var(--primary);
  transform: scale(1.05);
}

.cell.x {
  color: #0ff;
  text-shadow: 0 0 10px #0ff, 0 0 20px #0ff;
  animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.cell.o {
  color: #f0f;
  text-shadow: 0 0 10px #f0f, 0 0 20px #f0f;
  animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes popIn {
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.cell.winning {
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  color: #000;
  text-shadow: none;
  animation: winPulse 0.5s ease-in-out infinite;
}

@keyframes winPulse {
  0%, 100% { box-shadow: 0 0 20px var(--primary); transform: scale(1); }
  50% { box-shadow: 0 0 40px var(--secondary); transform: scale(1.1); }
}

.restart-btn, .music-btn {
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
  margin: 10px 5px 0;
}

.restart-btn:hover, .music-btn:hover {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  color: #000;
  box-shadow: 0 0 30px var(--primary);
  text-shadow: none;
}

/* Win animation */
.ttt-wrapper.player-won .container::before {
  background: conic-gradient(from 0deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #ff00ff, #ff0000);
  animation: rotateBorder 0.5s linear infinite;
}

/* Lose animation */
@keyframes fallOff {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

.ttt-wrapper.player-lost .cell {
  animation: fallOff 1.5s ease-in forwards;
}

.ttt-wrapper.player-lost .cell:nth-child(1) { animation-delay: 0.1s; }
.ttt-wrapper.player-lost .cell:nth-child(2) { animation-delay: 0.2s; }
.ttt-wrapper.player-lost .cell:nth-child(3) { animation-delay: 0.05s; }
.ttt-wrapper.player-lost .cell:nth-child(4) { animation-delay: 0.25s; }
.ttt-wrapper.player-lost .cell:nth-child(5) { animation-delay: 0.15s; }
.ttt-wrapper.player-lost .cell:nth-child(6) { animation-delay: 0.3s; }
.ttt-wrapper.player-lost .cell:nth-child(7) { animation-delay: 0s; }
.ttt-wrapper.player-lost .cell:nth-child(8) { animation-delay: 0.35s; }
.ttt-wrapper.player-lost .cell:nth-child(9) { animation-delay: 0.2s; }
</style>
