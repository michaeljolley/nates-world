import { ref } from 'vue'

export function useGameState() {
  // Game states: 'menu', 'playing', 'crashed', 'level-complete', 'victory'
  const gameState = ref('menu')
  const currentLevel = ref(1)

  function startGame() {
    currentLevel.value = 1
    gameState.value = 'playing'
  }

  function restartLevel() {
    gameState.value = 'playing'
  }

  function nextLevel() {
    if (currentLevel.value < 5) {
      currentLevel.value++
      gameState.value = 'playing'
    } else {
      gameState.value = 'victory'
    }
  }

  function resetGame() {
    currentLevel.value = 1
    gameState.value = 'menu'
  }

  return {
    gameState,
    currentLevel,
    startGame,
    restartLevel,
    nextLevel,
    resetGame
  }
}
