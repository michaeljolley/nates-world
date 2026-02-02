<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GameScene from './components/GameScene.vue'
import GameUI from './components/GameUI.vue'
import { useGameState } from './composables/useGameState'

const containerRef = ref(null)
const { gameState, currentLevel, startGame, restartLevel, nextLevel, resetGame } = useGameState()

function handleStart() {
  startGame()
}

function handleRestart() {
  restartLevel()
}

function handleNextLevel() {
  nextLevel()
}

function handleCrash() {
  gameState.value = 'crashed'
}

function handleGoalReached() {
  if (currentLevel.value >= 5) {
    gameState.value = 'victory'
  } else {
    gameState.value = 'level-complete'
  }
}

function handleBackToMenu() {
  resetGame()
}
</script>

<template>
  <div ref="containerRef" class="paper-airplane-game">
    <GameScene
      v-if="gameState === 'playing'"
      :level="currentLevel"
      @crash="handleCrash"
      @goal-reached="handleGoalReached"
    />
    
    <GameUI
      :game-state="gameState"
      :current-level="currentLevel"
      @start="handleStart"
      @restart="handleRestart"
      @next-level="handleNextLevel"
      @back-to-menu="handleBackToMenu"
    />
  </div>
</template>

<style scoped>
.paper-airplane-game {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}
</style>
