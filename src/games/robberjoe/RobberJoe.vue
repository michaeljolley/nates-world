<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import GameCanvas from './components/GameCanvas.vue'
import GameUI from './components/GameUI.vue'
import { useGameState } from './composables/useGameState'
import { usePlayer } from './composables/usePlayer'
import { useGuards } from './composables/useGuards'
import { useCollision } from './composables/useCollision'
import { TILE_SIZE } from './data/levels'

const router = useRouter()

const {
  gameState,
  currentLevel,
  currentLevelIndex,
  levelCount,
  lootCollected,
  totalLoot,
  timeElapsed,
  isLevelComplete,
  startGame,
  startLevel,
  resetLevel,
  collectLoot,
  playerCaught,
  playerEscaped,
  updateTime,
  backToMenu
} = useGameState()

const {
  x: playerX,
  y: playerY,
  gridX: playerGridX,
  gridY: playerGridY,
  direction: playerDirection,
  isMoving: playerIsMoving,
  isSneaking: playerIsSneaking,
  isHiding: playerIsHiding,
  isRunning: playerIsRunning,
  noiseLevel: playerNoiseLevel,
  lootBag: playerLootBag,
  init: initPlayer,
  move: movePlayer,
  update: updatePlayer,
  setSneaking,
  setRunning,
  addLoot: playerAddLoot
} = usePlayer()

const {
  guards,
  cameras,
  noiseEvents,
  init: initGuards,
  update: updateGuards,
  checkVision,
  addNoise,
  VISION_RANGE,
  VISION_ANGLE
} = useGuards()

const { checkLoot, checkExit, checkGuardCollision } = useCollision()

// Track collected loot positions
const collectedLoot = ref(new Set())

// Working copy of level grid (so we can modify it)
const levelGrid = ref([])

// Keys currently pressed (for continuous movement)
const keysPressed = ref(new Set())

const player = computed(() => ({
  x: playerX.value,
  y: playerY.value,
  direction: playerDirection.value,
  isSneaking: playerIsSneaking.value,
  isHiding: playerIsHiding.value,
  isRunning: playerIsRunning.value,
  noiseLevel: playerNoiseLevel.value
}))

let gameLoopId = null
let lastTime = 0

function initLevel() {
  const level = currentLevel.value
  // Deep copy grid
  levelGrid.value = level.grid.map(row => [...row])
  collectedLoot.value = new Set()
  keysPressed.value = new Set()
  
  initPlayer({ grid: levelGrid.value })
  initGuards(level)
}

function handleStart() {
  startGame()
  initLevel()
  lastTime = performance.now()
  gameLoop()
}

function handleSelectLevel(index) {
  startLevel(index)
  initLevel()
  lastTime = performance.now()
  gameLoop()
}

function handleRestart() {
  resetLevel()
  initLevel()
  gameState.value = 'playing'
  lastTime = performance.now()
}

function handleBackToMenu() {
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId)
    gameLoopId = null
  }
  backToMenu()
}

function handleNextLevel() {
  resetLevel()
  initLevel()
}

function processInput() {
  if (playerIsMoving.value) return

  let dx = 0, dy = 0

  if (keysPressed.value.has('up')) dy = -1
  else if (keysPressed.value.has('down')) dy = 1
  else if (keysPressed.value.has('left')) dx = -1
  else if (keysPressed.value.has('right')) dx = 1

  if (dx !== 0 || dy !== 0) {
    const moved = movePlayer(dx, dy, { grid: levelGrid.value })
    
    // Generate noise if running
    if (moved && playerIsRunning.value) {
      addNoise(playerX.value + TILE_SIZE / 2, playerY.value + TILE_SIZE / 2, 4)
    }
  }
}

function gameLoop() {
  const now = performance.now()
  const delta = Math.min((now - lastTime) / 1000, 0.1)
  lastTime = now

  if (gameState.value !== 'playing') {
    if (gameState.value !== 'menu') {
      gameLoopId = requestAnimationFrame(gameLoop)
    }
    return
  }

  // Update time
  updateTime(delta)

  // Process input for continuous movement
  processInput()

  // Update player
  updatePlayer(delta, { grid: levelGrid.value })

  // Update guards with level grid for line-of-sight checks
  updateGuards(delta, levelGrid.value)

  // Check loot collection
  const lootKey = `${playerGridX.value},${playerGridY.value}`
  if (!collectedLoot.value.has(lootKey)) {
    const collected = checkLoot(
      playerGridX.value, 
      playerGridY.value, 
      { grid: levelGrid.value },
      () => {
        collectLoot()
        collectedLoot.value.add(lootKey)
        playerAddLoot()
      }
    )
  }

  // Check exit
  if (isLevelComplete.value && checkExit(playerGridX.value, playerGridY.value, { grid: levelGrid.value })) {
    playerEscaped()
    if (gameState.value === 'playing') {
      initLevel()
    }
  }

  // Check guard collision
  if (checkGuardCollision(playerX.value, playerY.value, guards.value)) {
    playerCaught()
  }

  // Check guard and camera vision
  if (checkVision(playerX.value, playerY.value, playerIsSneaking.value, playerIsHiding.value, levelGrid.value)) {
    playerCaught()
  }

  gameLoopId = requestAnimationFrame(gameLoop)
}

function handleKeyDown(e) {
  if (gameState.value !== 'playing') return

  // Sneaking (Shift)
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    setSneaking(true)
    e.preventDefault()
    return
  }

  // Running (Ctrl) - makes noise but faster
  if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
    setRunning(true)
    e.preventDefault()
    return
  }

  // Movement - add to pressed keys
  switch (e.code) {
    case 'ArrowUp':
    case 'KeyW':
      keysPressed.value.add('up')
      e.preventDefault()
      break
    case 'ArrowDown':
    case 'KeyS':
      keysPressed.value.add('down')
      e.preventDefault()
      break
    case 'ArrowLeft':
    case 'KeyA':
      keysPressed.value.add('left')
      e.preventDefault()
      break
    case 'ArrowRight':
    case 'KeyD':
      keysPressed.value.add('right')
      e.preventDefault()
      break
  }
}

function handleKeyUp(e) {
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    setSneaking(false)
  }
  if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
    setRunning(false)
  }

  // Remove from pressed keys
  switch (e.code) {
    case 'ArrowUp':
    case 'KeyW':
      keysPressed.value.delete('up')
      break
    case 'ArrowDown':
    case 'KeyS':
      keysPressed.value.delete('down')
      break
    case 'ArrowLeft':
    case 'KeyA':
      keysPressed.value.delete('left')
      break
    case 'ArrowRight':
    case 'KeyD':
      keysPressed.value.delete('right')
      break
  }
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
  <div class="robberjoe-game">
    <div v-if="gameState === 'playing'" class="game-container">
      <GameCanvas
        :level="{ grid: levelGrid }"
        :player="player"
        :guards="guards"
        :cameras="cameras"
        :noise-events="noiseEvents"
        :collected-loot="collectedLoot"
        :vision-range="VISION_RANGE"
        :vision-angle="VISION_ANGLE"
      />
    </div>

    <GameUI
      :game-state="gameState"
      :current-level-index="currentLevelIndex"
      :loot-collected="lootCollected"
      :total-loot="totalLoot"
      :required-loot="currentLevel?.requiredLoot || 0"
      :time-elapsed="timeElapsed"
      :is-level-complete="isLevelComplete"
      :player-hiding="playerIsHiding"
      :player-sneaking="playerIsSneaking"
      :player-running="playerIsRunning"
      @start="handleStart"
      @select-level="handleSelectLevel"
      @restart="handleRestart"
      @back-to-menu="handleBackToMenu"
      @next-level="handleNextLevel"
    />
  </div>
</template>

<style scoped>
.robberjoe-game {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #0f0f1a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 80px;
}
</style>
