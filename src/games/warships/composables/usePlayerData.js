import { ref, computed } from 'vue'
import { shipTemplates } from '../data/ships'
import { questTemplates } from '../data/quests'

// Singleton state for player data persistence
const money = ref(parseInt(localStorage.getItem('warships_money') || '0'))
const totalMoneyEarned = ref(parseInt(localStorage.getItem('warships_totalEarned') || '0'))
const ownedShips = ref(JSON.parse(localStorage.getItem('warships_ownedShips') || '["starter"]'))
const selectedShipId = ref(localStorage.getItem('warships_selectedShip') || 'starter')

const questStats = ref(JSON.parse(localStorage.getItem('warships_stats') || JSON.stringify({
  kills: 0,
  shotsFired: 0,
  shotsHit: 0,
  damageDealt: 0,
  survived: 0,
  gamesPlayed: 0
})))

const completedQuestIds = ref(JSON.parse(localStorage.getItem('warships_completedQuests') || '[]'))

export function usePlayerData() {
  const selectedShip = computed(() => 
    shipTemplates.find(s => s.id === selectedShipId.value) || shipTemplates[0]
  )

  function saveData() {
    localStorage.setItem('warships_money', money.value.toString())
    localStorage.setItem('warships_totalEarned', totalMoneyEarned.value.toString())
    localStorage.setItem('warships_ownedShips', JSON.stringify(ownedShips.value))
    localStorage.setItem('warships_selectedShip', selectedShipId.value)
    localStorage.setItem('warships_stats', JSON.stringify(questStats.value))
    localStorage.setItem('warships_completedQuests', JSON.stringify(completedQuestIds.value))
  }

  function addMoney(amount, difficulty = 2) {
    const multipliers = { 1: 1, 2: 1.5, 3: 2, 4: 3, 5: 5 }
    const earned = Math.round(amount * (multipliers[difficulty] || 1))
    money.value += earned
    totalMoneyEarned.value += earned
    saveData()
    return earned
  }

  function spendMoney(amount) {
    if (money.value >= amount) {
      money.value -= amount
      saveData()
      return true
    }
    return false
  }

  function buyShip(shipId) {
    const ship = shipTemplates.find(s => s.id === shipId)
    if (!ship || ownedShips.value.includes(shipId)) return false
    if (spendMoney(ship.price)) {
      ownedShips.value.push(shipId)
      saveData()
      return true
    }
    return false
  }

  function selectShip(shipId) {
    if (ownedShips.value.includes(shipId)) {
      selectedShipId.value = shipId
      saveData()
      return true
    }
    return false
  }

  function updateStat(type, amount = 1) {
    if (questStats.value[type] !== undefined) {
      questStats.value[type] += amount
      saveData()
    }
  }

  function completeQuest(questId) {
    if (!completedQuestIds.value.includes(questId)) {
      completedQuestIds.value.push(questId)
      saveData()
    }
  }

  function isQuestCompleted(questId) {
    return completedQuestIds.value.includes(questId)
  }

  function getQuestProgress(quest) {
    if (isQuestCompleted(quest.id)) return quest.target
    if (quest.type === 'moneyEarned') return Math.min(totalMoneyEarned.value, quest.target)
    return Math.min(questStats.value[quest.type] || 0, quest.target)
  }

  return {
    money,
    totalMoneyEarned,
    ownedShips,
    selectedShipId,
    selectedShip,
    questStats,
    completedQuestIds,
    addMoney,
    spendMoney,
    buyShip,
    selectShip,
    updateStat,
    completeQuest,
    isQuestCompleted,
    getQuestProgress,
    saveData
  }
}
