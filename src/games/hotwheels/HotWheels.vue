<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import GameScene from './components/GameScene.vue'
import GameUI from './components/GameUI.vue'
import { useGameState } from './composables/useGameState'

const router = useRouter()
const gameSceneRef = ref(null)
const racePosition = ref(1)
const { 
  gameState, 
  lapCount, 
  totalLaps, 
  raceTime, 
  bestTime, 
  countdown,
  startGame, 
  resetGame,
  pauseGame,
  resumeGame,
  completeLap,
  updateTime
} = useGameState()

function handleStart() {
  startGame()
}

function handleRestart() {
  resetGame()
  racePosition.value = 1
  startGame()
}

function handleLapComplete() {
  completeLap()
}

function handleBackToMenu() {
  if (gameState.value === 'menu') {
    router.push('/')
  } else {
    resetGame()
  }
}

function handlePause() {
  pauseGame()
}

function handleResume() {
  resumeGame()
}

function handlePositionUpdate(pos) {
  racePosition.value = pos
}
</script>

<template>
  <div class="hotwheels-game">
    <GameScene
      v-if="gameState === 'playing' || gameState === 'countdown' || gameState === 'paused'"
      ref="gameSceneRef"
      :game-state="gameState"
      :countdown="countdown"
      @lap-complete="handleLapComplete"
      @update-time="updateTime"
      @position-update="handlePositionUpdate"
    />
    
    <GameUI
      :game-state="gameState"
      :lap-count="lapCount"
      :total-laps="totalLaps"
      :race-time="raceTime"
      :best-time="bestTime"
      :countdown="countdown"
      :race-position="racePosition"
      @start="handleStart"
      @restart="handleRestart"
      @pause="handlePause"
      @resume="handleResume"
      @back-to-menu="handleBackToMenu"
    />
  </div>
</template>

<style scoped>
.hotwheels-game {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%);
}
</style>
