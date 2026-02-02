<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import GameCanvas from './components/GameCanvas.vue'
import GameUI from './components/GameUI.vue'
import { useGameState } from './composables/useGameState'
import { useSnakePhysics, AISnake } from './composables/useSnakePhysics'
import { useCollision } from './composables/useCollision'
import { snakeColors, playerColor } from './data/colors'

const router = useRouter()

const {
  gameState,
  aiCount,
  food,
  playerScore,
  playerKills,
  leaderboard,
  ARENA_SIZE,
  setAiCount,
  startGame: startGameState,
  endGame,
  resetGame,
  removeFood,
  spawnFoodAt,
  updateLeaderboard
} = useGameState()

const playerSnake = reactive({
  id: 'player',
  name: 'You',
  segments: [],
  direction: { x: 0, y: -1 },
  isAlive: true,
  color: playerColor,
  SEGMENT_SIZE: 12,
  isBoosting: false
})

const {
  segments: playerSegments,
  direction: playerDirection,
  isAlive: playerIsAlive,
  isBoosting: playerIsBoosting,
  init: initPlayer,
  setDirection,
  setMouseTarget,
  update: updatePlayer,
  grow: growPlayer,
  shrink: shrinkPlayer,
  die: diePlayer,
  setBoosting,
  getLength
} = useSnakePhysics(ARENA_SIZE)

const { checkHeadToBody, checkFoodCollision, checkSelfCollision } = useCollision()

const aiSnakes = ref([])
const mousePos = ref({ x: 0, y: 0 })
const canvasCenter = ref({ x: 400, y: 300 })
let gameLoopId = null
let lastTime = 0

function createAISnakes() {
  aiSnakes.value = []
  for (let i = 0; i < aiCount.value; i++) {
    const color = snakeColors[i % snakeColors.length]
    const ai = new AISnake(i + 1, color, ARENA_SIZE)
    const x = 100 + Math.random() * (ARENA_SIZE - 200)
    const y = 100 + Math.random() * (ARENA_SIZE - 200)
    ai.init(x, y, 5 + Math.floor(Math.random() * 5))
    aiSnakes.value.push(ai)
  }
}

function startGame() {
  startGameState()
  
  // Init player at center
  initPlayer(ARENA_SIZE / 2, ARENA_SIZE / 2, 10)
  playerSnake.isAlive = true
  
  // Create AI
  createAISnakes()
  
  // Start game loop
  lastTime = performance.now()
  gameLoop()
}

function gameLoop() {
  const now = performance.now()
  const delta = Math.min((now - lastTime) / 1000, 0.1)
  lastTime = now

  if (gameState.value !== 'playing') {
    gameLoopId = requestAnimationFrame(gameLoop)
    return
  }

  // Update player
  if (playerIsAlive.value) {
    updatePlayer(delta)
    
    // Shrink while boosting (slither.io mechanic)
    if (playerIsBoosting.value && playerSegments.value.length > 10) {
      if (Math.random() < 0.1) { // 10% chance per frame to drop a segment
        shrinkPlayer(1)
        // Drop food behind when boosting
        const tail = playerSegments.value[playerSegments.value.length - 1]
        if (tail) {
          spawnFoodAt(tail.x, tail.y, 1)
        }
      }
    }
    
    // Sync reactive object
    playerSnake.segments = [...playerSegments.value]
    playerSnake.direction = { ...playerDirection.value }
    playerSnake.isAlive = playerIsAlive.value
    playerSnake.isBoosting = playerIsBoosting.value

    // Check food collision
    const head = playerSegments.value[0]
    if (head) {
      const foodIdx = checkFoodCollision(head, food.value)
      if (foodIdx >= 0) {
        growPlayer(food.value[foodIdx].value || 1)
        removeFood(foodIdx)
      }

      // Check collision with AI snakes
      for (const ai of aiSnakes.value) {
        if (!ai.isAlive) continue
        
        if (checkHeadToBody(head, ai, false)) {
          // Player died
          diePlayer()
          playerSnake.isAlive = false
          spawnFoodAt(head.x, head.y, playerSegments.value.length)
          endGame()
          break
        }
      }

      // Player can go through their own snake - no self collision check
    }
  }

  // Update AI snakes
  const allSnakes = [playerSnake, ...aiSnakes.value]
  
  for (const ai of aiSnakes.value) {
    if (!ai.isAlive) {
      // Respawn after a delay
      ai.respawn()
      continue
    }

    ai.update(delta, food.value, allSnakes)

    // Check food collision
    const aiHead = ai.segments[0]
    if (aiHead) {
      const foodIdx = checkFoodCollision(aiHead, food.value)
      if (foodIdx >= 0) {
        ai.grow(food.value[foodIdx].value || 1)
        removeFood(foodIdx)
      }

      // Check collision with player body
      if (playerIsAlive.value && checkHeadToBody(aiHead, { segments: playerSegments.value }, false)) {
        // AI died hitting player
        ai.die()
        spawnFoodAt(aiHead.x, aiHead.y, ai.segments.length)
        playerKills.value++
      }

      // Check collision with other AI
      for (const other of aiSnakes.value) {
        if (other === ai || !other.isAlive) continue
        if (checkHeadToBody(aiHead, other, false)) {
          ai.die()
          spawnFoodAt(aiHead.x, aiHead.y, ai.segments.length)
          break
        }
      }

      // Check self collision
      if (ai.segments.length > 30 && checkSelfCollision(ai)) {
        ai.die()
        spawnFoodAt(aiHead.x, aiHead.y, ai.segments.length)
      }
    }
  }

  // Update score and leaderboard
  playerScore.value = playerSegments.value.length
  updateLeaderboard(allSnakes)

  gameLoopId = requestAnimationFrame(gameLoop)
}

function handleMouseMove(e) {
  if (gameState.value !== 'playing' || !playerIsAlive.value) return
  
  // Get mouse position relative to canvas center
  const rect = e.target.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  const dx = e.clientX - rect.left - centerX
  const dy = e.clientY - rect.top - centerY
  
  // Set direction towards mouse - smaller dead zone for more responsive controls
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len > 5) { // Very small dead zone
    setDirection(dx / len, dy / len)
  }
}

function handleMouseDown(e) {
  if (gameState.value !== 'playing' || !playerIsAlive.value) return
  if (e.button === 0) { // Left click
    setBoosting(true)
  }
}

function handleMouseUp(e) {
  if (e.button === 0) {
    setBoosting(false)
  }
}

function handleKeyDown(e) {
  if (gameState.value !== 'playing' || !playerIsAlive.value) return

  // Space or Shift for boost
  if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    setBoosting(true)
    e.preventDefault()
  }

  // Arrow keys still work as backup
  switch (e.code) {
    case 'ArrowUp':
    case 'KeyW':
      setDirection(0, -1)
      e.preventDefault()
      break
    case 'ArrowDown':
    case 'KeyS':
      setDirection(0, 1)
      e.preventDefault()
      break
    case 'ArrowLeft':
    case 'KeyA':
      setDirection(-1, 0)
      e.preventDefault()
      break
    case 'ArrowRight':
    case 'KeyD':
      setDirection(1, 0)
      e.preventDefault()
      break
  }
}

function handleKeyUp(e) {
  if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    setBoosting(false)
  }
}

function handleBackToMenu() {
  if (gameState.value === 'menu') {
    router.push('/')
  } else {
    resetGame()
  }
}

function handlePlayAgain() {
  resetGame()
  startGame()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  if (gameLoopId) cancelAnimationFrame(gameLoopId)
})
</script>

<template>
  <div class="snakerun-game">
    <GameCanvas
      v-if="gameState === 'playing'"
      :player-snake="playerSnake"
      :ai-snakes="aiSnakes"
      :food="food"
      :arena-size="ARENA_SIZE"
      :game-state="gameState"
      @mousemove="handleMouseMove"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseleave="() => setBoosting(false)"
    />

    <GameUI
      :game-state="gameState"
      :ai-count="aiCount"
      :player-score="playerScore"
      :player-kills="playerKills"
      :leaderboard="leaderboard"
      @start="startGame"
      @set-ai-count="setAiCount"
      @back-to-menu="handleBackToMenu"
      @play-again="handlePlayAgain"
    />
  </div>
</template>

<style scoped>
.snakerun-game {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #1a1a2e;
}
</style>
