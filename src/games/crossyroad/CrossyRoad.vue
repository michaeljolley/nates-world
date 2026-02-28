<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import GameCanvas from './components/GameCanvas.vue'
import GameUI from './components/GameUI.vue'
import { useGameState } from './composables/useGameState'
import { useWorld } from './composables/useWorld'
import { usePlayer } from './composables/usePlayer'
import { useCollision } from './composables/useCollision'

const router = useRouter()

const {
  gameState,
  score,
  highScore,
  coins,
  coinsEarned,
  wallet,
  ownedSkins,
  selectedSkin,
  currentSkin,
  skins,
  startGame: startGameState,
  endGame,
  resetGame,
  incrementScore,
  addCoin,
  openShop,
  closeShop,
  buySkin,
  selectSkin
} = useGameState()

const {
  lanes,
  initWorld,
  updateWorld,
  getLane,
  updateVehicles,
  updateTrains,
  removeCoin
} = useWorld()

const {
  position: playerPosition,
  rotation: playerRotation,
  isMoving: playerIsMoving,
  isAlive: playerIsAlive,
  hopProgress,
  init: initPlayer,
  hop,
  update: updatePlayer,
  die: diePlayer,
  setPositionX
} = usePlayer()

const {
  checkVehicleCollision,
  checkWaterCollision,
  checkTrainCollision,
  checkCoinCollision
} = useCollision()

let gameLoopId = null
let lastTime = 0
let furthestZ = 0
let idleTimer = 0
const IDLE_DEATH_TIME = 10 // seconds before eagle catches you

function startGame() {
  startGameState()
  initPlayer()
  initWorld()
  furthestZ = 0
  idleTimer = 0
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

  // Update player movement
  updatePlayer(delta)

  // Update world based on player position
  updateWorld(Math.floor(playerPosition.value.z))
  
  // Update moving objects
  updateVehicles(delta)
  updateTrains(delta)

  // Score when reaching new lanes
  const currentZ = Math.floor(playerPosition.value.z)
  if (currentZ > furthestZ) {
    furthestZ = currentZ
    incrementScore()
    idleTimer = 0 // Reset idle timer on progress
  }

  // Check collisions only when not moving
  if (!playerIsMoving.value && playerIsAlive.value) {
    const lane = getLane(currentZ)
    
    if (lane) {
      // Vehicle collision
      if (checkVehicleCollision(playerPosition.value, lane)) {
        diePlayer()
        endGame()
      }

      // Water collision
      const waterResult = checkWaterCollision(playerPosition.value, lane)
      if (waterResult.inWater) {
        if (waterResult.onLog) {
          // Move with log
          const newX = playerPosition.value.x + waterResult.logVelocity * delta
          if (Math.abs(newX) <= 10) {
            setPositionX(newX)
          } else {
            // Pushed off screen
            diePlayer()
            endGame()
          }
        } else {
          // Drowned!
          diePlayer()
          endGame()
        }
      }

      // Train collision
      if (checkTrainCollision(playerPosition.value, lane)) {
        diePlayer()
        endGame()
      }

      // Coin collection
      const coin = checkCoinCollision(playerPosition.value, lane)
      if (coin) {
        addCoin()
        removeCoin(lane.z, coin.x)
      }
    }
  }

  // Idle timer (eagle catches you if you stay still too long)
  if (playerIsAlive.value) {
    idleTimer += delta
    if (idleTimer >= IDLE_DEATH_TIME) {
      diePlayer()
      endGame()
    }
  }

  gameLoopId = requestAnimationFrame(gameLoop)
}

function handleKeyDown(e) {
  if (gameState.value !== 'playing' || !playerIsAlive.value) return

  let direction = null

  switch (e.code) {
    case 'ArrowUp':
    case 'KeyW':
      direction = 'forward'
      break
    case 'ArrowDown':
    case 'KeyS':
      direction = 'backward'
      break
    case 'ArrowLeft':
    case 'KeyA':
      direction = 'left'
      break
    case 'ArrowRight':
    case 'KeyD':
      direction = 'right'
      break
    default:
      return
  }

  e.preventDefault()
  
  if (direction && hop(direction, getLane)) {
    idleTimer = 0
  }
}

function handlePlayAgain() {
  resetGame()
  startGame()
}

function handleBackToMenu() {
  if (gameState.value === 'menu') {
    router.push('/')
  } else {
    resetGame()
  }
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
  <div class="crossyroad-game">
    <GameCanvas
      v-if="gameState === 'playing'"
      :player-position="playerPosition"
      :player-rotation="playerRotation"
      :player-alive="playerIsAlive"
      :hop-progress="hopProgress"
      :lanes="lanes"
      :game-state="gameState"
      :player-skin="currentSkin"
    />

    <GameUI
      :game-state="gameState"
      :score="score"
      :high-score="highScore"
      :coins="coins"
      :coins-earned="coinsEarned"
      :wallet="wallet"
      :current-skin="currentSkin"
      :skins="skins"
      :owned-skins="ownedSkins"
      :selected-skin="selectedSkin"
      @start="startGame"
      @back-to-menu="handleBackToMenu"
      @play-again="handlePlayAgain"
      @open-shop="openShop"
      @close-shop="closeShop"
      @buy-skin="buySkin"
      @select-skin="selectSkin"
    />
  </div>
</template>

<style scoped>
.crossyroad-game {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #87ceeb;
  z-index: 100;
}
</style>
