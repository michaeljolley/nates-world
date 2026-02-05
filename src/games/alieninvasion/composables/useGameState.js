import { ref, computed } from 'vue'
import { aliens, getAlienById } from '../data/aliens'
import { regions, getRegionById } from '../data/regions'

const STORAGE_KEY = 'alienInvasion_save'

export function useGameState() {
  const gameState = ref('menu') // menu, worldmap, shop, upgrades, playing, victory, defeat
  const coins = ref(500) // Starting coins
  const currentAlienId = ref(null)
  const currentRegionId = ref(null)
  const unlockedAliens = ref(['alien_001']) // Start with first alien unlocked
  const conqueredRegions = ref([])
  const alienUpgrades = ref({}) // { alien_id: { attack: 0, defense: 0, speed: 0, hp: 0 } }
  const currentHP = ref(0)
  const maxHP = ref(0)

  const currentAlien = computed(() => {
    if (!currentAlienId.value) return null
    return getAlienById(currentAlienId.value)
  })

  const currentRegion = computed(() => {
    if (!currentRegionId.value) return null
    return getRegionById(currentRegionId.value)
  })

  function getUpgradeCost(level) {
    return Math.floor(50 * Math.pow(1.5, level))
  }

  function getAlienStats(alienId) {
    const alien = getAlienById(alienId)
    if (!alien) return null
    
    const upgrades = alienUpgrades.value[alienId] || { attack: 0, defense: 0, speed: 0, hp: 0 }
    
    return {
      attack: alien.baseAttack + upgrades.attack * 5,
      defense: alien.baseDefense + upgrades.defense * 3,
      speed: alien.baseSpeed + upgrades.speed * 0.5,
      hp: alien.baseHP + upgrades.hp * 20
    }
  }

  function startGame() {
    if (!currentAlienId.value || !currentRegionId.value) return
    
    const stats = getAlienStats(currentAlienId.value)
    maxHP.value = stats.hp
    currentHP.value = stats.hp
    gameState.value = 'playing'
  }

  function selectRegion(regionId) {
    const region = getRegionById(regionId)
    if (!region) return
    
    // Check if region is unlocked
    if (region.unlockRequirement && !conqueredRegions.value.includes(region.unlockRequirement)) {
      return
    }
    
    currentRegionId.value = regionId
  }

  function selectAlien(alienId) {
    if (unlockedAliens.value.includes(alienId)) {
      currentAlienId.value = alienId
    }
  }

  function buyAlien(alienId) {
    const alien = getAlienById(alienId)
    if (!alien) return false
    if (unlockedAliens.value.includes(alienId)) return false
    if (coins.value < alien.cost) return false
    
    coins.value -= alien.cost
    unlockedAliens.value.push(alienId)
    
    // Initialize upgrades for new alien
    alienUpgrades.value[alienId] = { attack: 0, defense: 0, speed: 0, hp: 0 }
    
    // Auto-select the new alien
    currentAlienId.value = alienId
    
    saveGame()
    return true
  }

  function upgradeAlien(alienId, stat) {
    if (!unlockedAliens.value.includes(alienId)) return false
    
    if (!alienUpgrades.value[alienId]) {
      alienUpgrades.value[alienId] = { attack: 0, defense: 0, speed: 0, hp: 0 }
    }
    
    const currentLevel = alienUpgrades.value[alienId][stat]
    if (currentLevel >= 20) return false // Max level
    
    const cost = getUpgradeCost(currentLevel)
    if (coins.value < cost) return false
    
    coins.value -= cost
    alienUpgrades.value[alienId][stat]++
    
    saveGame()
    return true
  }

  function addCoins(amount) {
    coins.value += amount
  }

  function takeDamage(amount) {
    const stats = getAlienStats(currentAlienId.value)
    const reducedDamage = Math.max(1, amount - stats.defense * 0.5)
    currentHP.value = Math.max(0, currentHP.value - reducedDamage)
    
    if (currentHP.value <= 0) {
      gameState.value = 'defeat'
    }
  }

  function winRegion() {
    const region = getRegionById(currentRegionId.value)
    if (region) {
      if (conqueredRegions.value.includes(currentRegionId.value)) {
        // Replay - give half reward
        coins.value += Math.floor(region.coinReward / 2)
      } else {
        // First time - full reward and mark as conquered
        conqueredRegions.value.push(currentRegionId.value)
        coins.value += region.coinReward
      }
    }
    gameState.value = 'victory'
    saveGame()
  }

  function endGame() {
    gameState.value = 'defeat'
  }

  function resetToMenu() {
    gameState.value = 'menu'
    saveGame()
  }

  function goToWorldMap() {
    gameState.value = 'worldmap'
  }

  function goToShop() {
    gameState.value = 'shop'
  }

  function goToUpgrades() {
    gameState.value = 'upgrades'
  }

  function saveGame() {
    const saveData = {
      coins: coins.value,
      currentAlienId: currentAlienId.value,
      unlockedAliens: unlockedAliens.value,
      conqueredRegions: conqueredRegions.value,
      alienUpgrades: alienUpgrades.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData))
  }

  function loadGame() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        coins.value = data.coins ?? 500
        currentAlienId.value = data.currentAlienId ?? null
        unlockedAliens.value = data.unlockedAliens ?? ['alien_001']
        conqueredRegions.value = data.conqueredRegions ?? []
        alienUpgrades.value = data.alienUpgrades ?? {}
      } catch (e) {
        console.error('Failed to load save:', e)
      }
    }
    
    // Ensure first alien has upgrades initialized
    if (!alienUpgrades.value['alien_001']) {
      alienUpgrades.value['alien_001'] = { attack: 0, defense: 0, speed: 0, hp: 0 }
    }
    
    // Auto-select first alien if none selected
    if (!currentAlienId.value && unlockedAliens.value.length > 0) {
      currentAlienId.value = unlockedAliens.value[0]
    }
  }

  return {
    gameState,
    coins,
    currentAlien,
    currentRegion,
    currentHP,
    maxHP,
    unlockedAliens,
    alienUpgrades,
    conqueredRegions,
    getAlienStats,
    getUpgradeCost,
    startGame,
    selectRegion,
    selectAlien,
    upgradeAlien,
    buyAlien,
    addCoins,
    takeDamage,
    winRegion,
    endGame,
    resetToMenu,
    goToWorldMap,
    goToShop,
    goToUpgrades,
    saveGame,
    loadGame
  }
}
