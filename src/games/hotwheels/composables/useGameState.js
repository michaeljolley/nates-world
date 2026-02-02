import { ref, computed } from 'vue'

export function useGameState() {
  const gameState = ref('menu') // menu, playing, paused, finished, crashed
  const currentTrack = ref(1)
  const lapCount = ref(0)
  const totalLaps = ref(3)
  const raceTime = ref(0)
  const bestTime = ref(null)
  const countdown = ref(0)

  const isRacing = computed(() => gameState.value === 'playing' && countdown.value === 0)

  function startGame() {
    gameState.value = 'countdown'
    lapCount.value = 0
    raceTime.value = 0
    countdown.value = 3
    
    const countdownInterval = setInterval(() => {
      countdown.value--
      if (countdown.value === 0) {
        clearInterval(countdownInterval)
        gameState.value = 'playing'
      }
    }, 1000)
  }

  function pauseGame() {
    if (gameState.value === 'playing') {
      gameState.value = 'paused'
    }
  }

  function resumeGame() {
    if (gameState.value === 'paused') {
      gameState.value = 'playing'
    }
  }

  function completeLap() {
    lapCount.value++
    if (lapCount.value >= totalLaps.value) {
      finishRace()
    }
  }

  function finishRace() {
    gameState.value = 'finished'
    if (!bestTime.value || raceTime.value < bestTime.value) {
      bestTime.value = raceTime.value
    }
  }

  function crashCar() {
    gameState.value = 'crashed'
  }

  function resetGame() {
    gameState.value = 'menu'
    lapCount.value = 0
    raceTime.value = 0
    countdown.value = 0
  }

  function selectTrack(track) {
    currentTrack.value = track
  }

  function updateTime(delta) {
    if (isRacing.value) {
      raceTime.value += delta
    }
  }

  return {
    gameState,
    currentTrack,
    lapCount,
    totalLaps,
    raceTime,
    bestTime,
    countdown,
    isRacing,
    startGame,
    pauseGame,
    resumeGame,
    completeLap,
    crashCar,
    resetGame,
    selectTrack,
    updateTime
  }
}
