<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import GameScene from './components/GameScene.vue'
import GameUI from './components/GameUI.vue'
import { useGameState } from './composables/useGameState'

const router = useRouter()
const gameSceneRef = ref(null)
const racePosition = ref(1)
const currentSpeed = ref(0)
const { 
  gameState, 
  currentTrack,
  lapCount, 
  totalLaps, 
  raceTime, 
  bestTime, 
  countdown,
  tracks,
  showTrackSelect,
  selectTrack,
  startGame, 
  resetGame,
  pauseGame,
  resumeGame,
  completeLap,
  updateTime
} = useGameState()

function handleShowTrackSelect() {
  showTrackSelect()
}

function handleSelectTrack(trackId) {
  selectTrack(trackId)
}

function handleStart() {
  startGame()
}

function handleRestart() {
  resetGame()
  racePosition.value = 1
  showTrackSelect()
}

function handleLapComplete() {
  completeLap()
}

function handleBackToMenu() {
  if (gameState.value === 'menu') {
    router.push('/')
  } else if (gameState.value === 'trackSelect') {
    resetGame()
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

function handleSpeedUpdate(spd) {
  currentSpeed.value = spd
}
</script>

<template>
  <div class="hotwheels-game">
    <GameScene
      v-if="gameState === 'playing' || gameState === 'countdown' || gameState === 'paused'"
      ref="gameSceneRef"
      :game-state="gameState"
      :countdown="countdown"
      :current-track="currentTrack"
      @lap-complete="handleLapComplete"
      @update-time="updateTime"
      @position-update="handlePositionUpdate"
      @speed-update="handleSpeedUpdate"
    />
    
    <GameUI
      :game-state="gameState"
      :lap-count="lapCount"
      :total-laps="totalLaps"
      :race-time="raceTime"
      :best-time="bestTime"
      :countdown="countdown"
      :race-position="racePosition"
      :speed="currentSpeed"
      :tracks="tracks"
      :current-track="currentTrack"
      @start="handleStart"
      @restart="handleRestart"
      @pause="handlePause"
      @resume="handleResume"
      @back-to-menu="handleBackToMenu"
      @show-track-select="handleShowTrackSelect"
      @select-track="handleSelectTrack"
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
