<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useStreaksStore } from '@/stores/streaks'
import SignInModal from '@/components/SignInModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const streaksStore = useStreaksStore()

// Game constants
const ROWS = 6
const COLS = 7
const EMPTY = 0
const PLAYER = 1
const AI = 2

// Game state
const board = ref(Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY)))
const currentPlayer = ref(PLAYER)
const gameOver = ref(false)
const winner = ref(null)
const winningCells = ref([])
const isThinking = ref(false)
const difficulty = ref('medium')
const hoverColumn = ref(-1)
const showSignInModal = ref(false)
const newRecord = ref(false)

// Streak tracking
const STREAK_LEVEL = 8
const currentStreak = computed(() => streaksStore.getStreak(STREAK_LEVEL))

// Load streaks
watch(() => authStore.isLoggedIn, async (loggedIn) => {
  if (loggedIn) await streaksStore.loadStreaks()
}, { immediate: true })

onMounted(async () => {
  if (authStore.isLoggedIn) await streaksStore.loadStreaks()
  initGame()
})

function initGame() {
  // Create empty board
  board.value = Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY))
  currentPlayer.value = PLAYER
  gameOver.value = false
  winner.value = null
  winningCells.value = []
  isThinking.value = false
}

function getLowestEmptyRow(col) {
  if (!board.value || !board.value[0]) return -1
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board.value[row] && board.value[row][col] === EMPTY) {
      return row
    }
  }
  return -1
}

function dropDisc(col) {
  if (gameOver.value || isThinking.value || currentPlayer.value !== PLAYER) return
  
  const row = getLowestEmptyRow(col)
  if (row === -1) return // Column is full
  
  board.value[row][col] = PLAYER
  
  if (checkWin(row, col, PLAYER)) {
    gameOver.value = true
    winner.value = 'player'
    handleWin()
    return
  }
  
  if (isBoardFull()) {
    gameOver.value = true
    winner.value = 'draw'
    return
  }
  
  currentPlayer.value = AI
  makeAIMove()
}

function makeAIMove() {
  isThinking.value = true
  
  setTimeout(() => {
    let col
    
    if (difficulty.value === 'easy') {
      // Easy: Mostly random, occasionally blocks obvious wins
      if (Math.random() > 0.7) {
        col = getBlockingMove() ?? getRandomMove()
      } else {
        col = getRandomMove()
      }
    } else if (difficulty.value === 'medium') {
      // Medium: Always blocks wins, sometimes makes smart moves
      col = getWinningMove() ?? getBlockingMove() ?? (Math.random() > 0.5 ? getSmartMove() : getRandomMove())
    } else {
      // Hard: Uses minimax with look-ahead for best possible play
      col = getWinningMove() ?? getBlockingMove() ?? getMiniMaxMove()
    }
    
    const row = getLowestEmptyRow(col)
    if (row !== -1) {
      board.value[row][col] = AI
      
      if (checkWin(row, col, AI)) {
        gameOver.value = true
        winner.value = 'ai'
        handleLoss()
      } else if (isBoardFull()) {
        gameOver.value = true
        winner.value = 'draw'
      } else {
        currentPlayer.value = PLAYER
      }
    }
    
    isThinking.value = false
  }, 500)
}

function getRandomMove() {
  const validCols = []
  for (let col = 0; col < COLS; col++) {
    if (getLowestEmptyRow(col) !== -1) {
      validCols.push(col)
    }
  }
  return validCols[Math.floor(Math.random() * validCols.length)]
}

function getWinningMove() {
  for (let col = 0; col < COLS; col++) {
    const row = getLowestEmptyRow(col)
    if (row !== -1) {
      board.value[row][col] = AI
      if (checkWin(row, col, AI)) {
        board.value[row][col] = EMPTY
        return col
      }
      board.value[row][col] = EMPTY
    }
  }
  return null
}

function getBlockingMove() {
  for (let col = 0; col < COLS; col++) {
    const row = getLowestEmptyRow(col)
    if (row !== -1) {
      board.value[row][col] = PLAYER
      if (checkWin(row, col, PLAYER)) {
        board.value[row][col] = EMPTY
        return col
      }
      board.value[row][col] = EMPTY
    }
  }
  return null
}

function getSmartMove() {
  // Prefer center, then evaluate positions
  if (getLowestEmptyRow(3) !== -1 && Math.random() > 0.3) {
    return 3
  }
  
  let bestCol = -1
  let bestScore = -1
  
  for (let col = 0; col < COLS; col++) {
    const row = getLowestEmptyRow(col)
    if (row !== -1) {
      const score = evaluatePosition(row, col, AI)
      if (score > bestScore) {
        bestScore = score
        bestCol = col
      }
    }
  }
  
  return bestCol !== -1 ? bestCol : getRandomMove()
}

function getMiniMaxMove() {
  let bestCol = 3
  let bestScore = -Infinity
  
  // Check center columns first (better moves usually)
  const colOrder = [3, 2, 4, 1, 5, 0, 6]
  
  for (const col of colOrder) {
    const row = getLowestEmptyRow(col)
    if (row !== -1) {
      board.value[row][col] = AI
      const score = minimax(4, false, -Infinity, Infinity)
      board.value[row][col] = EMPTY
      
      if (score > bestScore) {
        bestScore = score
        bestCol = col
      }
    }
  }
  
  return bestCol
}

function minimax(depth, isMaximizing, alpha, beta) {
  // Check for terminal states
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (board.value[r][c] === AI && checkWinAt(r, c, AI)) {
        return 1000 + depth
      }
      if (board.value[r][c] === PLAYER && checkWinAt(r, c, PLAYER)) {
        return -1000 - depth
      }
    }
  }
  
  if (depth === 0 || isBoardFull()) {
    return evaluateBoard()
  }
  
  if (isMaximizing) {
    let maxScore = -Infinity
    for (let col = 0; col < COLS; col++) {
      const row = getLowestEmptyRow(col)
      if (row !== -1) {
        board.value[row][col] = AI
        const score = minimax(depth - 1, false, alpha, beta)
        board.value[row][col] = EMPTY
        maxScore = Math.max(maxScore, score)
        alpha = Math.max(alpha, score)
        if (beta <= alpha) break
      }
    }
    return maxScore
  } else {
    let minScore = Infinity
    for (let col = 0; col < COLS; col++) {
      const row = getLowestEmptyRow(col)
      if (row !== -1) {
        board.value[row][col] = PLAYER
        const score = minimax(depth - 1, true, alpha, beta)
        board.value[row][col] = EMPTY
        minScore = Math.min(minScore, score)
        beta = Math.min(beta, score)
        if (beta <= alpha) break
      }
    }
    return minScore
  }
}

function checkWinAt(row, col, player) {
  if (board.value[row][col] !== player) return false
  
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]]
  
  for (const [dr, dc] of directions) {
    let count = 1
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i, c = col + dc * i
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board.value[r][c] === player) count++
      else break
    }
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i, c = col - dc * i
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board.value[r][c] === player) count++
      else break
    }
    if (count >= 4) return true
  }
  return false
}

function evaluateBoard() {
  let score = 0
  
  // Evaluate all positions
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board.value[row][col] === AI) {
        score += evaluatePosition(row, col, AI)
      } else if (board.value[row][col] === PLAYER) {
        score -= evaluatePosition(row, col, PLAYER)
      }
    }
  }
  
  // Center column bonus
  for (let row = 0; row < ROWS; row++) {
    if (board.value[row][3] === AI) score += 3
    if (board.value[row][3] === PLAYER) score -= 3
  }
  
  return score
}

function getBestMove() {
  // Check if AI can win
  const winMove = getWinningMove()
  if (winMove !== null) return winMove
  
  // Check if need to block player
  const blockMove = getBlockingMove()
  if (blockMove !== null) return blockMove
  
  // Prefer center column
  if (getLowestEmptyRow(3) !== -1) {
    return 3
  }
  
  // Try to build sequences
  let bestCol = -1
  let bestScore = -1
  
  for (let col = 0; col < COLS; col++) {
    const row = getLowestEmptyRow(col)
    if (row !== -1) {
      const score = evaluatePosition(row, col, AI)
      if (score > bestScore) {
        bestScore = score
        bestCol = col
      }
    }
  }
  
  return bestCol !== -1 ? bestCol : getRandomMove()
}

function evaluatePosition(row, col, player) {
  let score = 0
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal
    [1, -1]   // anti-diagonal
  ]
  
  for (const [dr, dc] of directions) {
    let count = 1
    let openEnds = 0
    
    // Check positive direction
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i
      const c = col + dc * i
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        if (board.value[r][c] === player) count++
        else if (board.value[r][c] === EMPTY) { openEnds++; break }
        else break
      }
    }
    
    // Check negative direction
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i
      const c = col - dc * i
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        if (board.value[r][c] === player) count++
        else if (board.value[r][c] === EMPTY) { openEnds++; break }
        else break
      }
    }
    
    if (count >= 3) score += 100
    else if (count >= 2 && openEnds > 0) score += 10
  }
  
  // Bonus for center columns
  score += (3 - Math.abs(col - 3)) * 2
  
  return score
}

function checkWin(row, col, player) {
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal
    [1, -1]   // anti-diagonal
  ]
  
  for (const [dr, dc] of directions) {
    const cells = [[row, col]]
    
    // Check positive direction
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i
      const c = col + dc * i
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board.value[r][c] === player) {
        cells.push([r, c])
      } else break
    }
    
    // Check negative direction
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i
      const c = col - dc * i
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board.value[r][c] === player) {
        cells.push([r, c])
      } else break
    }
    
    if (cells.length >= 4) {
      winningCells.value = cells
      return true
    }
  }
  
  return false
}

function isBoardFull() {
  if (!board.value || !board.value[0]) return false
  return board.value[0].every(cell => cell !== EMPTY)
}

function isWinningCell(row, col) {
  return winningCells.value.some(([r, c]) => r === row && c === col)
}

function getCellClass(row, col) {
  if (!board.value || !board.value[row]) return 'cell empty'
  const cell = board.value[row][col]
  const classes = ['cell']
  
  if (cell === PLAYER) classes.push('player')
  else if (cell === AI) classes.push('ai')
  else classes.push('empty')
  
  if (isWinningCell(row, col)) classes.push('winning')
  
  return classes.join(' ')
}

function getPreviewRow(col) {
  if (gameOver.value || isThinking.value || currentPlayer.value !== PLAYER) return -1
  return getLowestEmptyRow(col)
}

async function handleWin() {
  if (authStore.isLoggedIn) {
    const result = await streaksStore.recordWin(STREAK_LEVEL)
    newRecord.value = result.newRecord
  }
}

function handleLoss() {
  if (authStore.isLoggedIn) {
    streaksStore.recordLoss(STREAK_LEVEL)
  }
  newRecord.value = false
}

function setDifficulty(level) {
  difficulty.value = level
  initGame()
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="connect-four">
    <div class="game-container">
      <header class="game-header">
        <button class="back-btn" @click="goHome">← Back</button>
        <h1>🔴🟡 Connect Four</h1>
        <div class="streak-display" 
             :class="{ guest: !authStore.isLoggedIn }"
             @click="!authStore.isLoggedIn && (showSignInModal = true)">
          <span v-if="authStore.isLoggedIn">🔥 {{ currentStreak }}</span>
          <span v-else>Sign in for streaks</span>
        </div>
      </header>

      <div class="difficulty-selector">
        <button 
          v-for="level in ['easy', 'medium', 'hard']" 
          :key="level"
          :class="['diff-btn', { active: difficulty === level }]"
          @click="setDifficulty(level)"
        >
          {{ level.charAt(0).toUpperCase() + level.slice(1) }}
        </button>
      </div>

      <div class="game-status">
        <div v-if="gameOver" class="status-message">
          <span v-if="winner === 'player'" class="win">🎉 You Win!</span>
          <span v-else-if="winner === 'ai'" class="lose">😢 AI Wins!</span>
          <span v-else class="draw">🤝 It's a Draw!</span>
          <span v-if="newRecord" class="new-record">🏆 New Record!</span>
        </div>
        <div v-else class="status-message">
          <span v-if="isThinking" class="thinking">🤔 AI is thinking...</span>
          <span v-else class="your-turn">Your turn - Drop a 🔴</span>
        </div>
      </div>

      <div class="board-container">
        <!-- Column hover indicators -->
        <div class="column-indicators">
          <div 
            v-for="col in COLS" 
            :key="col"
            class="column-indicator"
            :class="{ 
              active: hoverColumn === col - 1 && !gameOver && !isThinking,
              disabled: getLowestEmptyRow(col - 1) === -1
            }"
            @mouseenter="hoverColumn = col - 1"
            @mouseleave="hoverColumn = -1"
            @click="dropDisc(col - 1)"
          >
            <div class="preview-disc" v-if="hoverColumn === col - 1 && getPreviewRow(col - 1) !== -1">
              🔴
            </div>
          </div>
        </div>

        <!-- Game board -->
        <div class="board">
          <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
            <div 
              v-for="(cell, colIndex) in row" 
              :key="colIndex"
              :class="getCellClass(rowIndex, colIndex)"
              @click="dropDisc(colIndex)"
              @mouseenter="hoverColumn = colIndex"
              @mouseleave="hoverColumn = -1"
            >
              <div class="disc" v-if="cell !== EMPTY">
                {{ cell === PLAYER ? '🔴' : '🟡' }}
              </div>
              <div 
                class="ghost-disc" 
                v-else-if="hoverColumn === colIndex && getPreviewRow(colIndex) === rowIndex"
              >
                🔴
              </div>
            </div>
          </div>
        </div>
      </div>

      <button v-if="gameOver" class="play-again-btn" @click="initGame">
        🔄 Play Again
      </button>

      <div class="instructions">
        <p>Click a column to drop your disc. Connect 4 in a row to win!</p>
        <p class="hint">Horizontal, vertical, or diagonal - any direction counts!</p>
      </div>
    </div>

    <SignInModal 
      v-if="showSignInModal" 
      @close="showSignInModal = false"
    />
  </div>
</template>

<style scoped>
.connect-four {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.game-container {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.game-header h1 {
  font-size: 1.8rem;
  background: linear-gradient(90deg, #ff4444, #ffcc00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.streak-display {
  padding: 8px 16px;
  border: 2px solid #ff9900;
  border-radius: 8px;
  background: rgba(255, 153, 0, 0.1);
  color: #ff9900;
  font-weight: bold;
}

.streak-display.guest {
  cursor: pointer;
  font-size: 0.85rem;
}

.streak-display.guest:hover {
  background: rgba(255, 153, 0, 0.2);
}

.difficulty-selector {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.diff-btn {
  padding: 8px 20px;
  border: 2px solid #444;
  background: transparent;
  color: #888;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: bold;
}

.diff-btn:hover {
  border-color: #666;
  color: #aaa;
}

.diff-btn.active {
  border-color: #ff9900;
  color: #ff9900;
  background: rgba(255, 153, 0, 0.1);
}

.game-status {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.status-message {
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 15px;
}

.win { color: #44ff44; }
.lose { color: #ff4444; }
.draw { color: #ffcc00; }
.thinking { color: #ffcc00; }
.your-turn { color: #88ccff; }
.new-record { 
  color: #ffcc00; 
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.board-container {
  display: inline-block;
  position: relative;
}

.column-indicators {
  display: flex;
  gap: 8px;
  margin-bottom: 5px;
  padding: 0 12px;
}

.column-indicator {
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  transition: background 0.2s;
}

.column-indicator.active {
  background: rgba(255, 68, 68, 0.2);
}

.column-indicator.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.preview-disc {
  font-size: 1.5rem;
  opacity: 0.6;
  animation: bounce 0.5s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.board {
  background: linear-gradient(135deg, #1a4a9e, #0d3178);
  padding: 12px;
  border-radius: 12px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.row {
  display: flex;
  gap: 8px;
}

.row:not(:last-child) {
  margin-bottom: 8px;
}

.cell {
  width: 60px;
  height: 60px;
  background: radial-gradient(circle at 30% 30%, #0a2555, #051530);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 
    inset 0 4px 8px rgba(0, 0, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.3);
}

.cell:hover:not(.player):not(.ai) {
  background: radial-gradient(circle at 30% 30%, #1a3565, #0a2545);
}

.cell.winning {
  animation: glow 0.5s ease-in-out infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 10px 5px rgba(255, 255, 0, 0.5); }
  to { box-shadow: 0 0 20px 10px rgba(255, 255, 0, 0.8); }
}

.disc {
  font-size: 2.5rem;
  animation: drop 0.3s ease-out;
}

@keyframes drop {
  from { 
    transform: translateY(-200px);
    opacity: 0.5;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}

.ghost-disc {
  font-size: 2.5rem;
  opacity: 0.3;
}

.play-again-btn {
  margin-top: 20px;
  padding: 12px 30px;
  font-size: 1.2rem;
  background: linear-gradient(90deg, #ff6600, #ff9900);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-weight: bold;
}

.play-again-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 153, 0, 0.5);
}

.instructions {
  margin-top: 20px;
  color: #888;
  font-size: 0.9rem;
}

.instructions .hint {
  color: #666;
  font-size: 0.8rem;
  margin-top: 5px;
}

@media (max-width: 500px) {
  .cell {
    width: 45px;
    height: 45px;
  }
  
  .column-indicator {
    width: 45px;
  }
  
  .disc, .ghost-disc {
    font-size: 2rem;
  }
  
  .game-header h1 {
    font-size: 1.3rem;
  }
}
</style>
