<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import GameCanvas from './components/GameCanvas.vue'
import GameUI from './components/GameUI.vue'
import { useGameLogic } from './composables/useGameLogic'

const router = useRouter()

const {
  gameState,
  jumpCount,
  highScore,
  isNewRecord,
  difficulty,
  startGame,
  addJump,
  endGame,
  backToMenu
} = useGameLogic()

const isPlaying = computed(() => gameState.value === 'playing')

function handleStart() {
  startGame()
}

function handleRestart() {
  startGame()
}

function handleJump() {
  addJump()
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
  <div class="lily-pad-hopper">
    <GameCanvas
      v-if="gameState === 'playing'"
      :is-playing="isPlaying"
      :difficulty="difficulty"
      @jump="handleJump"
      @fall="handleFall"
    />
    
    <GameUI
      :game-state="gameState"
      :jump-count="jumpCount"
      :high-score="highScore"
      :is-new-record="isNewRecord"
      :difficulty="difficulty"
      @start="handleStart"
      @restart="handleRestart"
      @back-to-menu="handleBackToMenu"
    />
  </div>
</template>

<style scoped>
.lily-pad-hopper {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, 
    #0a2a1a 0%, 
    #0d3d25 50%,
    #1a5035 100%
  );
}
</style>
