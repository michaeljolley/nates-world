import { ref, computed } from 'vue'
import { levels, TILE_TYPES } from '../data/levels'

export function useGameState() {
  const gameState = ref('menu') // 'menu', 'playing', 'paused', 'win', 'caught'
  const currentLevelIndex = ref(0)
  const lootCollected = ref(0)
  const totalLoot = ref(0)
  const timeElapsed = ref(0)
  
  const currentLevel = computed(() => levels[currentLevelIndex.value])
  const levelCount = computed(() => levels.length)
  
  const isLevelComplete = computed(() => {
    return lootCollected.value >= currentLevel.value.requiredLoot
  })

  function startGame() {
    currentLevelIndex.value = 0
    resetLevel()
    gameState.value = 'playing'
  }

  function startLevel(index) {
    currentLevelIndex.value = index
    resetLevel()
    gameState.value = 'playing'
  }

  function resetLevel() {
    lootCollected.value = 0
    timeElapsed.value = 0
    
    // Count total loot in level
    const level = currentLevel.value
    let count = 0
    for (const row of level.grid) {
      for (const cell of row) {
        if (cell === TILE_TYPES.LOOT) count++
      }
    }
    totalLoot.value = count
  }

  function collectLoot() {
    lootCollected.value++
  }

  function nextLevel() {
    if (currentLevelIndex.value < levels.length - 1) {
      currentLevelIndex.value++
      resetLevel()
      gameState.value = 'playing'
    } else {
      gameState.value = 'win'
    }
  }

  function playerCaught() {
    gameState.value = 'caught'
  }

  function playerEscaped() {
    if (isLevelComplete.value) {
      nextLevel()
    }
  }

  function updateTime(delta) {
    timeElapsed.value += delta
  }

  function backToMenu() {
    gameState.value = 'menu'
  }

  return {
    gameState,
    currentLevel,
    currentLevelIndex,
    levelCount,
    lootCollected,
    totalLoot,
    timeElapsed,
    isLevelComplete,
    startGame,
    startLevel,
    resetLevel,
    collectLoot,
    nextLevel,
    playerCaught,
    playerEscaped,
    updateTime,
    backToMenu
  }
}
