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
  SEGMENT_SIZE: 12
})

const {
  segments: playerSegments,
  direction: playerDirection,
  isAlive: playerIsAlive,
  init: initPlayer,
  setDirection,
  update: updatePlayer,
  grow: growPlayer,
  die: diePlayer,
  getLength
} = useSnakePhysics(ARENA_SIZE)

const { checkHeadToBody, checkFoodCollision, checkSelfCollision } = useCollision()

const aiSnakes = ref([])
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
  initPlayer(ARENA_SIZE / 2, ARENA_SIZE / 2, 5)
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
    
    // Sync reactive object
    playerSnake.segments = [...playerSegments.value]
    playerSnake.direction = { ...playerDirection.value }
    playerSnake.isAlive = playerIsAlive.value

    // Check food collision
    const head = playerSegments.value[0]
    if (head) {
      const foodIdx = checkFoodCollision(head, food.value)
      if (foodIdx >= 0) {
        growPlayer(3)
        removeFood(foodIdx)
      }

      // Check collision with AI snakes
      for (const ai of aiSnakes.value) {
        if (!ai.isAlive) continue
        
        if (checkHeadToBody(head, ai, false)) {
          // Player died
          diePlayer()
          playerSnake.isAlive = false
          spawnFoodAt(head.x, head.y, Math.floor(playerSegments.value.length / 2))
          endGame()
          break
        }
      }

      // Check self collision
      if (checkSelfCollision({ segments: playerSegments.value })) {
        diePlayer()
        playerSnake.isAlive = false
        spawnFoodAt(head.x, head.y, Math.floor(playerSegments.value.length / 2))
        endGame()
      }
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
        ai.grow(3)
        removeFood(foodIdx)
      }

      // Check collision with player body
      if (playerIsAlive.value && checkHeadToBody(aiHead, { segments: playerSegments.value }, false)) {
        // AI died hitting player
        ai.die()
        spawnFoodAt(aiHead.x, aiHead.y, Math.floor(ai.segments.length / 2))
        playerKills.value++
      }

      // Check collision with other AI
      for (const other of aiSnakes.value) {
        if (other === ai || !other.isAlive) continue
        if (checkHeadToBody(aiHead, other, false)) {
          ai.die()
          spawnFoodAt(aiHead.x, aiHead.y, Math.floor(ai.segments.length / 2))
          break
        }
      }

      // Check self collision
      if (checkSelfCollision(ai)) {
        ai.die()
        spawnFoodAt(aiHead.x, aiHead.y, Math.floor(ai.segments.length / 2))
      }
    }
  }

  // Update score and leaderboard
  playerScore.value = playerSegments.value.length
  updateLeaderboard(allSnakes)

  gameLoopId = requestAnimationFrame(gameLoop)
}

function handleKeyDown(e) {
  if (gameState.value !== 'playing' || !playerIsAlive.value) return

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
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
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
