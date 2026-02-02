import { ref, computed } from 'vue'

const STORAGE_KEY = 'lilypadhopper_highscore'

export function useGameLogic() {
  const gameState = ref('menu') // menu, playing, gameover
  const jumpCount = ref(0)
  const highScore = ref(loadHighScore())
  const isNewRecord = ref(false)

  // Difficulty settings based on jump count
  const difficulty = computed(() => {
    const jumps = jumpCount.value
    if (jumps < 10) {
      return { 
        padSize: 80, 
        driftSpeed: 0.5, 
        spawnDistance: 120,
        name: 'Easy'
      }
    } else if (jumps < 25) {
      return { 
        padSize: 70, 
        driftSpeed: 0.8, 
        spawnDistance: 140,
        name: 'Medium'
      }
    } else if (jumps < 50) {
      return { 
        padSize: 55, 
        driftSpeed: 1.2, 
        spawnDistance: 160,
        name: 'Hard'
      }
    } else {
      return { 
        padSize: 45, 
        driftSpeed: 1.8, 
        spawnDistance: 180,
        name: 'Extreme'
      }
    }
  })

  function loadHighScore() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? parseInt(saved, 10) : 0
    } catch {
      return 0
    }
  }

  function saveHighScore(score) {
    try {
      localStorage.setItem(STORAGE_KEY, score.toString())
    } catch {
      // localStorage not available
    }
  }

  function startGame() {
    jumpCount.value = 0
    isNewRecord.value = false
    gameState.value = 'playing'
  }

  function addJump() {
    jumpCount.value++
  }

  function endGame() {
    gameState.value = 'gameover'
    
    if (jumpCount.value > highScore.value) {
      highScore.value = jumpCount.value
      saveHighScore(jumpCount.value)
      isNewRecord.value = true
    }
  }

  function backToMenu() {
    gameState.value = 'menu'
    isNewRecord.value = false
  }

  return {
    gameState,
    jumpCount,
    highScore,
    isNewRecord,
    difficulty,
    startGame,
    addJump,
    endGame,
    backToMenu
  }
}
