<script setup>
import { ref, shallowRef, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import HomeScreen from './components/HomeScreen.vue'
import ShopPanel from './components/ShopPanel.vue'
import QuestPanel from './components/QuestPanel.vue'
import GameUI from './components/GameUI.vue'
import VictoryOverlay from './components/VictoryOverlay.vue'
import { useGameState } from './composables/useGameState'
import { usePlayerData } from './composables/usePlayerData'
import { useThreeScene } from './composables/useThreeScene'
import { useControls } from './composables/useControls'
import { useAudio } from './composables/useAudio'
import { useGameLoop } from './composables/useGameLoop'

const gameContainer = ref(null)
const showShop = ref(false)
const showQuests = ref(false)
const moneyEarned = ref(0)
const gameReady = ref(false)

// Reactive refs for health display
const currentHealth = ref(100)
const maxHealth = ref(100)

const gameState = useGameState()
const playerData = usePlayerData()
const controls = useControls()
const audio = useAudio()

let sceneComposable = null
let gameLoop = null
let animationId = null
let gameTime = 0

async function startGame() {
  // First show the container
  gameState.startGame()
  
  // Wait for DOM to update
  await nextTick()
  
  // Initialize scene if needed
  if (!sceneComposable || !sceneComposable.scene.value) {
    sceneComposable = useThreeScene(gameContainer)
    const success = sceneComposable.init()
    if (!success) {
      console.error('Failed to initialize scene')
      return
    }
  }
  
  // Create game loop
  gameLoop = useGameLoop(sceneComposable.scene, playerData, gameState, audio)
  gameLoop.startGame()
  
  // Set initial health values
  currentHealth.value = gameLoop.playerHealth.value
  maxHealth.value = gameLoop.maxPlayerHealth.value
  gameReady.value = true
  
  audio.init()
  audio.startMusic(gameState.difficulty.value)
  controls.init()
  
  gameTime = 0
  animate()
}

function animate() {
  if (!gameState.gameStarted.value) return
  
  animationId = requestAnimationFrame(animate)
  
  if (!gameState.paused.value && !gameState.gameOver.value && gameLoop && sceneComposable) {
    gameTime += 0.016
    
    gameLoop.updatePlayer(controls.keys.value)
    gameLoop.updateEnemies()
    gameLoop.updateBullets()
    gameLoop.updateCamera(sceneComposable.camera)
    sceneComposable.updateOceanWaves(gameTime)
    
    // Update health display
    currentHealth.value = gameLoop.playerHealth.value
  }
  
  // Handle ESC for pause
  if (controls.keys.value.escape) {
    controls.keys.value.escape = false
    gameState.togglePause()
  }
  
  if (sceneComposable) {
    sceneComposable.render()
  }
}

function handlePause() {
  gameState.togglePause()
  if (gameState.paused.value) {
    audio.stopMusic()
  } else {
    audio.startMusic(gameState.difficulty.value)
  }
}

function handleQuit() {
  stopAnimation()
  audio.stopMusic()
  controls.resetKeys()
  if (gameLoop) {
    gameLoop.cleanup()
    gameLoop = null
  }
  gameReady.value = false
  gameState.goToHome()
}

async function handlePlayAgain() {
  stopAnimation()
  
  if (gameLoop) {
    gameLoop.cleanup()
  }
  gameState.resetGame()
  
  // Wait a tick
  await nextTick()
  
  // Recreate game loop with existing scene
  gameLoop = useGameLoop(sceneComposable.scene, playerData, gameState, audio)
  gameLoop.startGame()
  
  // Reset health values
  currentHealth.value = gameLoop.playerHealth.value
  maxHealth.value = gameLoop.maxPlayerHealth.value
  
  audio.startMusic(gameState.difficulty.value)
  controls.resetKeys()
  
  gameTime = 0
  animate()
}

function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

function cleanup() {
  stopAnimation()
  audio.stopMusic()
  audio.dispose()
  controls.dispose()
  if (gameLoop) {
    gameLoop.cleanup()
    gameLoop = null
  }
  if (sceneComposable) {
    sceneComposable.dispose()
    sceneComposable = null
  }
}

// Calculate money earned when game ends
watch(() => gameState.gameOver.value, (isOver) => {
  if (isOver) {
    stopAnimation()
    const baseReward = gameState.blueScore.value * 50
    const earned = playerData.addMoney(baseReward, gameState.difficulty.value)
    moneyEarned.value = earned
    
    if (gameState.winner.value === 'blue') {
      playerData.updateStat('survived')
    }
    
    audio.stopMusic()
  }
})

onBeforeUnmount(cleanup)
</script>

<template>
  <div class="warships-wrapper">
    <div class="lightning-bg"></div>
    <div class="bolt bolt-1">⚡</div>
    <div class="bolt bolt-2">⚡</div>
    
    <!-- Home Screen -->
    <HomeScreen 
      v-if="!gameState.gameStarted.value"
      @start="startGame"
      @openShop="showShop = true"
      @openQuests="showQuests = true"
    />
    
    <!-- Game Canvas Container -->
    <div 
      v-if="gameState.gameStarted.value"
      ref="gameContainer" 
      class="game-canvas"
    ></div>
    
    <!-- Game UI Overlay -->
    <GameUI 
      v-if="gameState.gameStarted.value && !gameState.gameOver.value && gameReady"
      :playerHealth="currentHealth"
      :maxHealth="maxHealth"
      :blueScore="gameState.blueScore.value"
      :redScore="gameState.redScore.value"
      :paused="gameState.paused.value"
      :difficulty="gameState.difficulty.value"
      :difficultyName="gameState.difficultyNames[gameState.difficulty.value]"
      @pause="handlePause"
      @quit="handleQuit"
    />
    
    <!-- Victory/Defeat Overlay -->
    <VictoryOverlay 
      v-if="gameState.gameOver.value"
      :winner="gameState.winner.value"
      :blueScore="gameState.blueScore.value"
      :redScore="gameState.redScore.value"
      :moneyEarned="moneyEarned"
      @playAgain="handlePlayAgain"
      @quit="handleQuit"
    />
    
    <!-- Shop Panel -->
    <ShopPanel v-if="showShop" @close="showShop = false" />
    
    <!-- Quest Panel -->
    <QuestPanel v-if="showQuests" @close="showQuests = false" />
  </div>
</template>

<style scoped>
.warships-wrapper {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: calc(100vh - 150px);
  background: #0a1628;
}

.lightning-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: 
    linear-gradient(135deg, transparent 40%, rgba(0, 212, 255, 0.03) 50%, transparent 60%),
    linear-gradient(-135deg, transparent 40%, rgba(0, 136, 170, 0.03) 50%, transparent 60%);
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
  color: #00d4ff;
}

.bolt-2 { 
  bottom: 10%; 
  right: 5%; 
  transform: rotate(15deg); 
  color: #0088aa;
}

.game-canvas {
  flex: 1;
  width: 100%;
  min-height: calc(100vh - 150px);
  z-index: 1;
}
</style>
