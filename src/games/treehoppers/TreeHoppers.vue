<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import GameScene from './components/GameScene.vue'
import GameUI from './components/GameUI.vue'
import { useGameState } from './composables/useGameState'

const router = useRouter()
const gameSceneRef = ref(null)

const {
  gameState,
  score,
  highScore,
  startGame,
  addScore,
  endGame,
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

function handleFall() {
  endGame()
}

function handleBackToMenu() {
  if (gameState.value === 'menu') {
    router.push('/')
  } else {
    backToMenu()
  }
}
</script>

<template>
  <div class="tree-hoppers-game">
    <GameScene
      v-if="gameState === 'playing'"
      ref="gameSceneRef"
      @score="handleScore"
      @fall="handleFall"
    />
    
    <GameUI
      :game-state="gameState"
      :score="score"
      :high-score="highScore"
      @start="handleStart"
      @restart="handleRestart"
      @back-to-menu="handleBackToMenu"
    />
  </div>
</template>

<style scoped>
.tree-hoppers-game {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #87CEEB 0%, #98D8AA 50%, #2d5a27 100%);
}
</style>
