import { ref } from 'vue'

const STORAGE_KEY = 'fruitninja_highscore'

export function useGameState() {
  const gameState = ref('menu') // menu, playing, gameover
  const score = ref(0)
  const highScore = ref(loadHighScore())
  const lives = ref(5)
  const combo = ref(0)
  const maxCombo = ref(0)

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
    lives.value = 5
    combo.value = 0
    maxCombo.value = 0
    gameState.value = 'playing'
  }

  function addScore(points) {
    score.value += points * (1 + Math.floor(combo.value / 3) * 0.5)
    combo.value++
    if (combo.value > maxCombo.value) {
      maxCombo.value = combo.value
    }
  }

  function resetCombo() {
    combo.value = 0
  }

  function loseLife() {
    lives.value--
    combo.value = 0
    
    if (lives.value <= 0) {
      endGame()
    }
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
    lives,
    combo,
    maxCombo,
    startGame,
    addScore,
    resetCombo,
    loseLife,
    endGame,
    backToMenu
  }
}
