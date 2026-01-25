import { ref } from 'vue'

const difficulty = ref(2) // 1=Easy, 2=Medium, 3=Hard, 4=Extreme, 5=Nightmare
const gameStarted = ref(false)
const paused = ref(true)
const gameOver = ref(false)
const winner = ref(null)
const redScore = ref(0)
const blueScore = ref(0)

export function useGameState() {
  function setDifficulty(level) {
    difficulty.value = level
  }

  function startGame() {
    gameStarted.value = true
    paused.value = false
    gameOver.value = false
    winner.value = null
    redScore.value = 0
    blueScore.value = 0
  }

  function togglePause() {
    if (gameStarted.value && !gameOver.value) {
      paused.value = !paused.value
    }
  }

  function endGame(winningTeam) {
    gameOver.value = true
    paused.value = true
    winner.value = winningTeam
  }

  function resetGame() {
    redScore.value = 0
    blueScore.value = 0
    gameOver.value = false
    winner.value = null
    paused.value = false
  }

  function goToHome() {
    gameStarted.value = false
    paused.value = true
    gameOver.value = false
    winner.value = null
    redScore.value = 0
    blueScore.value = 0
  }

  function addScore(team, points = 1) {
    if (team === 'red') {
      redScore.value += points
    } else if (team === 'blue') {
      blueScore.value += points
    }
  }

  const difficultyNames = {
    1: 'Easy',
    2: 'Medium', 
    3: 'Hard',
    4: 'Extreme',
    5: 'Nightmare'
  }

  return {
    difficulty,
    gameStarted,
    paused,
    gameOver,
    winner,
    redScore,
    blueScore,
    difficultyNames,
    setDifficulty,
    startGame,
    togglePause,
    endGame,
    resetGame,
    goToHome,
    addScore
  }
}
