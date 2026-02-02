import { ref } from 'vue'

const STORAGE_KEY = 'treehoppers_highscore'

export function useGameState() {
  const gameState = ref('menu') // menu, playing, gameover
  const score = ref(0)
  const highScore = ref(loadHighScore())

  function loadHighScore() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? parseInt(saved, 10) : 0
    } catch {
      return 0
    }
  }

  function saveHighScore(newScore) {
    try {
      localStorage.setItem(STORAGE_KEY, newScore.toString())
    } catch {
      // localStorage not available
    }
  }

  function startGame() {
    score.value = 0
    gameState.value = 'playing'
  }

  function addScore(points) {
    score.value += points
  }

  function endGame() {
    gameState.value = 'gameover'
    
    if (score.value > highScore.value) {
      highScore.value = score.value
      saveHighScore(score.value)
    }
  }

  function backToMenu() {
    gameState.value = 'menu'
  }

  return {
    gameState,
    score,
    highScore,
    startGame,
    addScore,
    endGame,
    backToMenu
  }
}
