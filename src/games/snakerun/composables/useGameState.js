import { ref, computed } from 'vue'

export function useGameState() {
  const gameState = ref('menu') // menu, playing, gameover
  const aiCount = ref(5)
  const food = ref([])
  const playerScore = ref(0)
  const playerKills = ref(0)
  const leaderboard = ref([])
  
  const ARENA_SIZE = 2000
  const FOOD_COUNT = 100
  const FOOD_SIZE = 8

  function setAiCount(count) {
    aiCount.value = Math.max(1, Math.min(20, count))
  }

  function startGame() {
    gameState.value = 'playing'
    playerScore.value = 0
    playerKills.value = 0
    spawnInitialFood()
  }

  function endGame() {
    gameState.value = 'gameover'
  }

  function resetGame() {
    gameState.value = 'menu'
    food.value = []
    playerScore.value = 0
    playerKills.value = 0
    leaderboard.value = []
  }

  function spawnInitialFood() {
    food.value = []
    for (let i = 0; i < FOOD_COUNT; i++) {
      spawnFood()
    }
  }

  function spawnFood() {
    const padding = 50
    food.value.push({
      x: padding + Math.random() * (ARENA_SIZE - padding * 2),
      y: padding + Math.random() * (ARENA_SIZE - padding * 2),
      size: FOOD_SIZE + Math.random() * 4,
      color: Math.floor(Math.random() * 6)
    })
  }

  function removeFood(index) {
    food.value.splice(index, 1)
    // Spawn new food to maintain count
    if (food.value.length < FOOD_COUNT) {
      spawnFood()
    }
  }

  function spawnFoodAt(x, y, count = 5) {
    // Spawn food when a snake dies
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const dist = 20 + Math.random() * 30
      food.value.push({
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        size: FOOD_SIZE + Math.random() * 6,
        color: Math.floor(Math.random() * 6)
      })
    }
  }

  function updateLeaderboard(snakes) {
    leaderboard.value = snakes
      .filter(s => s.isAlive)
      .map(s => ({ id: s.id, name: s.name, score: s.segments.length }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }

  function addKill() {
    playerKills.value++
  }

  return {
    gameState,
    aiCount,
    food,
    playerScore,
    playerKills,
    leaderboard,
    ARENA_SIZE,
    FOOD_SIZE,
    setAiCount,
    startGame,
    endGame,
    resetGame,
    spawnFood,
    removeFood,
    spawnFoodAt,
    updateLeaderboard,
    addKill
  }
}
