<script setup>
import { ref, watch } from 'vue'
import GameCanvas from './components/GameCanvas.vue'
import GameUI from './components/GameUI.vue'
import { useGameState } from './composables/useGameState'

const gameCanvasRef = ref(null)
const {
  gameState,
  score,
  highScore,
  lives,
  combo,
  maxCombo,
  startGame,
  addScore,
  resetCombo,
  loseLife,
  backToMenu
} = useGameState()

function handleStart() {
  startGame()
}

function handleRestart() {
  startGame()
}

function handleScore(points) {
  addScore(points)
}

function handleBombHit() {
  loseLife()
}

function handleResetCombo() {
  resetCombo()
}

function handleBackToMenu() {
  backToMenu()
}

// Restart game canvas when game starts
watch(gameState, (newState, oldState) => {
  if (newState === 'playing' && oldState !== 'playing') {
    // Canvas will reinitialize when mounted
  }
})
</script>

<template>
  <div class="fruit-ninja-game">
    <GameCanvas
      v-if="gameState === 'playing'"
      ref="gameCanvasRef"
      :on-score="handleScore"
      :on-bomb-hit="handleBombHit"
      :on-reset-combo="handleResetCombo"
    />
    
    <GameUI
      :game-state="gameState"
      :score="score"
      :high-score="highScore"
      :lives="lives"
      :combo="combo"
      :max-combo="maxCombo"
      @start="handleStart"
      @restart="handleRestart"
      @back-to-menu="handleBackToMenu"
    />
  </div>
</template>

<style scoped>
.fruit-ninja-game {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}
</style>
