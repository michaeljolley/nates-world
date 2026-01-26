import { ref, computed } from 'vue'
import { shipTemplates } from '../data/ships'
import { questTemplates } from '../data/quests'

// Default team members - naval crew with realistic roles
const DEFAULT_TEAM_MEMBERS = [
  { id: 'first-mate', name: 'First Mate Rodriguez', role: 'Flanker', assignedShipId: null, personality: 'aggressive' },
  { id: 'gunner', name: 'Chief Gunner Chen', role: 'Support', assignedShipId: null, personality: 'cautious' },
  { id: 'navigator', name: 'Navigator Williams', role: 'Scout', assignedShipId: null, personality: 'balanced' }
]

// Singleton state for player data persistence
const money = ref(parseInt(localStorage.getItem('warships_money') || '0'))
const totalMoneyEarned = ref(parseInt(localStorage.getItem('warships_totalEarned') || '0'))
const ownedShips = ref(JSON.parse(localStorage.getItem('warships_ownedShips') || '["starter"]'))
const selectedShipId = ref(localStorage.getItem('warships_selectedShip') || 'starter')
const teamMembers = ref(JSON.parse(localStorage.getItem('warships_teamMembers') || JSON.stringify(DEFAULT_TEAM_MEMBERS)))

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
    localStorage.setItem('warships_teamMembers', JSON.stringify(teamMembers.value))
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

  // Get ship data for a team member (returns starter if none assigned)
  function getTeamMemberShip(memberId) {
    const member = teamMembers.value.find(m => m.id === memberId)
    if (!member || !member.assignedShipId) {
      return shipTemplates.find(s => s.id === 'starter')
    }
    return shipTemplates.find(s => s.id === member.assignedShipId) || shipTemplates.find(s => s.id === 'starter')
  }

  // Assign a ship to a team member (replaces existing assignment)
  function assignShipToMember(memberId, shipId) {
    // Can only assign owned ships
    if (!ownedShips.value.includes(shipId)) return false
    
    // Can't assign the player's currently selected ship
    if (shipId === selectedShipId.value) return false
    
    // Remove this ship from any other team member who has it
    teamMembers.value.forEach(m => {
      if (m.assignedShipId === shipId) {
        m.assignedShipId = null
      }
    })
    
    // Assign to the target member
    const member = teamMembers.value.find(m => m.id === memberId)
    if (member) {
      member.assignedShipId = shipId
      saveData()
      return true
    }
    return false
  }

  // Unassign a ship from a team member
  function unassignShipFromMember(memberId) {
    const member = teamMembers.value.find(m => m.id === memberId)
    if (member) {
      member.assignedShipId = null
      saveData()
      return true
    }
    return false
  }

  // Get list of ships available for assignment (owned, not player's, not already assigned)
  const availableShipsForAssignment = computed(() => {
    const assignedShipIds = teamMembers.value
      .filter(m => m.assignedShipId)
      .map(m => m.assignedShipId)
    
    return ownedShips.value.filter(shipId => 
      shipId !== selectedShipId.value && !assignedShipIds.includes(shipId)
    )
  })

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
    saveData,
    teamMembers,
    getTeamMemberShip,
    assignShipToMember,
    unassignShipFromMember,
    availableShipsForAssignment
  }
}
