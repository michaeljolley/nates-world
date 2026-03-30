<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  BOARD_SPACES, 
  CHANCE_CARDS, 
  COMMUNITY_CARDS, 
  PLAYER_TOKENS, 
  COLOR_GROUPS,
  PROPERTY_COLORS,
  RAILROADS,
  UTILITIES
} from './gameData'
import { MonopolyAI } from './ai'

const router = useRouter()

// Game configuration
const gameStarted = ref(false)
const humanPlayerCount = ref(1)
const difficulty = ref('medium')

// Game state
const players = ref([])
const currentPlayerIndex = ref(0)
const properties = reactive({})
const dice = ref([1, 1])
const doublesCount = ref(0)
const gamePhase = ref('roll') // roll, moving, action, buy, turnEnd, gameOver
const message = ref('')
const actionQueue = ref([])
const winner = ref(null)

// Card state
const currentCard = ref(null)
const shuffledChance = ref([])
const shuffledCommunity = ref([])

// AI
const aiControllers = ref({})

// Animation
const animatingPlayer = ref(null)
const showDice = ref(false)

const currentPlayer = computed(() => players.value[currentPlayerIndex.value])

const boardLayout = computed(() => {
  const layout = {
    bottom: [],
    left: [],
    top: [],
    right: []
  }
  
  // Bottom: 0-10 (row-reverse CSS flips so Jail is left, GO is right)
  for (let i = 0; i <= 10; i++) layout.bottom.push(BOARD_SPACES[i])
  // Left: 11-19 (column-reverse CSS flips so 11 at bottom near Jail, 19 at top near Free Parking)
  for (let i = 11; i <= 19; i++) layout.left.push(BOARD_SPACES[i])
  // Top: 20-30 (Free Parking left, Go To Jail right)
  for (let i = 20; i <= 30; i++) layout.top.push(BOARD_SPACES[i])
  // Right: 31-39 (31 at top near Go To Jail, 39 at bottom near GO)
  for (let i = 31; i <= 39; i++) layout.right.push(BOARD_SPACES[i])
  
  return layout
})

function initGame() {
  // Reset state
  Object.keys(properties).forEach(key => delete properties[key])
  players.value = []
  currentPlayerIndex.value = 0
  doublesCount.value = 0
  gamePhase.value = 'roll'
  message.value = ''
  winner.value = null
  currentCard.value = null
  
  // Shuffle cards
  shuffledChance.value = [...CHANCE_CARDS].sort(() => Math.random() - 0.5)
  shuffledCommunity.value = [...COMMUNITY_CARDS].sort(() => Math.random() - 0.5)
  
  // Create players
  const totalPlayers = 4
  for (let i = 0; i < totalPlayers; i++) {
    const isHuman = i < humanPlayerCount.value
    players.value.push({
      id: i,
      name: isHuman ? `Player ${i + 1}` : `AI ${i + 1 - humanPlayerCount.value}`,
      token: PLAYER_TOKENS[i],
      money: 1500,
      position: 0,
      inJail: false,
      jailTurns: 0,
      hasJailCard: false,
      isHuman,
      isBankrupt: false
    })
    
    if (!isHuman) {
      aiControllers.value[i] = new MonopolyAI(difficulty.value)
    }
  }
  
  gameStarted.value = true
  message.value = `${currentPlayer.value.name}'s turn. Roll the dice!`
  
  // If first player is AI, start their turn
  if (!currentPlayer.value.isHuman) {
    setTimeout(executeAITurn, 1000)
  }
}

function rollDice() {
  if (gamePhase.value !== 'roll' || !currentPlayer.value.isHuman) return
  
  performRoll()
}

function performRoll() {
  showDice.value = true
  
  // Animate dice
  let rollCount = 0
  const rollInterval = setInterval(() => {
    dice.value = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ]
    rollCount++
    if (rollCount >= 10) {
      clearInterval(rollInterval)
      processDiceRoll()
    }
  }, 100)
}

function processDiceRoll() {
  const isDoubles = dice.value[0] === dice.value[1]
  const total = dice.value[0] + dice.value[1]
  
  if (currentPlayer.value.inJail) {
    handleJailRoll(isDoubles, total)
    return
  }
  
  if (isDoubles) {
    doublesCount.value++
    if (doublesCount.value >= 3) {
      message.value = `${currentPlayer.value.name} rolled 3 doubles! Go to Jail!`
      sendToJail()
      return
    }
  }
  
  movePlayer(total)
}

function handleJailRoll(isDoubles, total) {
  if (isDoubles) {
    currentPlayer.value.inJail = false
    currentPlayer.value.jailTurns = 0
    message.value = `${currentPlayer.value.name} rolled doubles and is out of jail!`
    movePlayer(total)
  } else {
    currentPlayer.value.jailTurns++
    if (currentPlayer.value.jailTurns >= 3) {
      // Must pay fine after 3 turns
      payMoney(currentPlayer.value, 50)
      currentPlayer.value.inJail = false
      currentPlayer.value.jailTurns = 0
      message.value = `${currentPlayer.value.name} paid $50 and is out of jail.`
      movePlayer(total)
    } else {
      message.value = `${currentPlayer.value.name} didn't roll doubles. Still in jail.`
      endTurn()
    }
  }
}

function payJailFine() {
  if (!currentPlayer.value.inJail || currentPlayer.value.money < 50) return
  
  payMoney(currentPlayer.value, 50)
  currentPlayer.value.inJail = false
  currentPlayer.value.jailTurns = 0
  message.value = `${currentPlayer.value.name} paid $50 to get out of jail.`
  gamePhase.value = 'roll'
  
  if (!currentPlayer.value.isHuman) {
    setTimeout(performRoll, 500)
  }
}

function useJailCard() {
  if (!currentPlayer.value.inJail || !currentPlayer.value.hasJailCard) return
  
  currentPlayer.value.hasJailCard = false
  currentPlayer.value.inJail = false
  currentPlayer.value.jailTurns = 0
  message.value = `${currentPlayer.value.name} used Get Out of Jail Free card!`
  gamePhase.value = 'roll'
  
  if (!currentPlayer.value.isHuman) {
    setTimeout(performRoll, 500)
  }
}

async function movePlayer(spaces) {
  gamePhase.value = 'moving'
  const player = currentPlayer.value
  animatingPlayer.value = player.id
  
  const startPos = player.position
  const endPos = (startPos + spaces) % 40
  
  // Animate movement
  for (let i = 1; i <= spaces; i++) {
    await new Promise(resolve => setTimeout(resolve, 150))
    player.position = (startPos + i) % 40
    
    // Check if passed GO
    if (player.position === 0 && i < spaces) {
      receiveMoney(player, 200)
      message.value = `${player.name} passed GO! Collect $200.`
    }
  }
  
  animatingPlayer.value = null
  
  // Handle landing space
  await handleLanding(player)
}

async function moveToPosition(player, targetPos, collectGo = true) {
  gamePhase.value = 'moving'
  animatingPlayer.value = player.id
  
  const startPos = player.position
  // Calculate forward distance around the board
  const forwardSteps = (targetPos - startPos + 40) % 40
  
  if (forwardSteps === 0) {
    animatingPlayer.value = null
    return
  }
  
  for (let i = 1; i <= forwardSteps; i++) {
    await new Promise(resolve => setTimeout(resolve, 120))
    player.position = (startPos + i) % 40
    
    if (collectGo && player.position === 0 && i < forwardSteps) {
      receiveMoney(player, 200)
      message.value = `${player.name} passed GO! Collect $200.`
    }
  }
  
  animatingPlayer.value = null
}

async function moveBackSteps(player, steps) {
  gamePhase.value = 'moving'
  animatingPlayer.value = player.id
  
  const startPos = player.position
  
  for (let i = 1; i <= steps; i++) {
    await new Promise(resolve => setTimeout(resolve, 150))
    player.position = (startPos - i + 40) % 40
  }
  
  animatingPlayer.value = null
}

async function handleLanding(player) {
  const space = BOARD_SPACES[player.position]
  
  switch (space.type) {
    case 'go':
      message.value = `${player.name} landed on GO!`
      endTurnOrRollAgain()
      break
      
    case 'property':
    case 'railroad':
    case 'utility':
      await handlePropertySpace(player, space)
      break
      
    case 'tax':
      payMoney(player, space.amount)
      message.value = `${player.name} pays $${space.amount} tax.`
      endTurnOrRollAgain()
      break
      
    case 'chance':
      await drawCard('chance', player)
      break
      
    case 'community':
      await drawCard('community', player)
      break
      
    case 'jail':
      message.value = `${player.name} is just visiting jail.`
      endTurnOrRollAgain()
      break
      
    case 'parking':
      message.value = `${player.name} is taking a break at Free Parking.`
      endTurnOrRollAgain()
      break
      
    case 'gotojail':
      sendToJail()
      break
  }
}

async function handlePropertySpace(player, space) {
  const prop = properties[space.id]
  
  if (!prop) {
    // Unowned property
    gamePhase.value = 'buy'
    message.value = `${space.name} is available for $${space.price}. Buy it?`
    
    if (!player.isHuman) {
      await handleAIPropertyDecision(player, space)
    }
  } else if (prop.owner !== player.id && !prop.mortgaged) {
    // Pay rent
    const owner = players.value[prop.owner]
    if (!owner.isBankrupt) {
      const rent = calculateRent(space, prop)
      message.value = `${player.name} pays $${rent} rent to ${owner.name}.`
      await payRent(player, owner, rent)
    }
    endTurnOrRollAgain()
  } else {
    message.value = prop.mortgaged 
      ? `${space.name} is mortgaged.` 
      : `${player.name} owns ${space.name}.`
    endTurnOrRollAgain()
  }
}

function calculateRent(space, prop) {
  if (space.type === 'railroad') {
    const ownedRailroads = RAILROADS.filter(id => properties[id]?.owner === prop.owner).length
    return 25 * Math.pow(2, ownedRailroads - 1)
  }
  
  if (space.type === 'utility') {
    const ownedUtilities = UTILITIES.filter(id => properties[id]?.owner === prop.owner).length
    const multiplier = ownedUtilities === 2 ? 10 : 4
    return (dice.value[0] + dice.value[1]) * multiplier
  }
  
  // Regular property
  const houses = prop.houses || 0
  let rent = space.rent[houses]
  
  // Double rent for monopoly with no houses
  if (houses === 0) {
    const colorGroup = COLOR_GROUPS[space.color]
    const hasMonopoly = colorGroup.every(id => properties[id]?.owner === prop.owner)
    if (hasMonopoly) rent *= 2
  }
  
  return rent
}

async function payRent(payer, receiver, amount) {
  if (payer.money >= amount) {
    payMoney(payer, amount)
    receiveMoney(receiver, amount)
  } else {
    // Player needs to raise funds or go bankrupt
    const raised = await raiseFunds(payer, amount)
    if (raised) {
      payMoney(payer, amount)
      receiveMoney(receiver, amount)
    } else {
      declareBankruptcy(payer, receiver)
    }
  }
}

async function raiseFunds(player, needed) {
  if (player.isHuman) {
    // For human players, show dialog
    message.value = `${player.name} needs $${needed}. Sell houses or mortgage properties.`
    return new Promise(resolve => {
      // Simple auto-handling for now - could be expanded with UI
      const totalAssets = calculateTotalAssets(player)
      if (totalAssets >= needed) {
        autoRaiseFunds(player, needed)
        resolve(true)
      } else {
        resolve(false)
      }
    })
  } else {
    // AI handles it
    const ai = aiControllers.value[player.id]
    const totalAssets = calculateTotalAssets(player)
    
    if (totalAssets < needed) return false
    
    autoRaiseFunds(player, needed)
    return true
  }
}

function calculateTotalAssets(player) {
  let total = player.money
  
  Object.entries(properties).forEach(([id, prop]) => {
    if (prop.owner === player.id) {
      const space = BOARD_SPACES[parseInt(id)]
      if (prop.houses > 0) {
        total += prop.houses * (space.housePrice / 2)
      }
      if (!prop.mortgaged) {
        total += space.price / 2
      }
    }
  })
  
  return total
}

function autoRaiseFunds(player, needed) {
  const ai = aiControllers.value[player.id] || new MonopolyAI('medium')
  
  // First sell houses
  while (player.money < needed) {
    const housesToSell = ai.getHousesToSell(player, needed - player.money, { properties })
    if (housesToSell.length === 0) break
    
    const propId = housesToSell[0]
    const space = BOARD_SPACES[propId]
    properties[propId].houses--
    receiveMoney(player, space.housePrice / 2)
  }
  
  // Then mortgage properties
  while (player.money < needed) {
    const toMortgage = ai.getPropertiesToMortgage(player, needed - player.money, { properties })
    if (toMortgage.length === 0) break
    
    const propId = toMortgage[0]
    const space = BOARD_SPACES[propId]
    properties[propId].mortgaged = true
    receiveMoney(player, space.price / 2)
  }
}

function declareBankruptcy(player, creditor) {
  player.isBankrupt = true
  message.value = `${player.name} is bankrupt!`
  
  // Transfer all properties to creditor (or bank)
  Object.entries(properties).forEach(([id, prop]) => {
    if (prop.owner === player.id) {
      if (creditor) {
        properties[id].owner = creditor.id
      } else {
        delete properties[id]
      }
    }
  })
  
  // Check for winner
  const activePlayers = players.value.filter(p => !p.isBankrupt)
  if (activePlayers.length === 1) {
    winner.value = activePlayers[0]
    gamePhase.value = 'gameOver'
    message.value = `${winner.value.name} wins the game!`
    return
  }
  
  endTurn()
}

function buyProperty() {
  const space = BOARD_SPACES[currentPlayer.value.position]
  
  if (currentPlayer.value.money < space.price) {
    message.value = `Not enough money to buy ${space.name}!`
    return
  }
  
  payMoney(currentPlayer.value, space.price)
  properties[space.id] = {
    owner: currentPlayer.value.id,
    houses: 0,
    mortgaged: false
  }
  
  message.value = `${currentPlayer.value.name} bought ${space.name} for $${space.price}.`
  endTurnOrRollAgain()
}

function skipBuy() {
  message.value = `${currentPlayer.value.name} passed on buying.`
  endTurnOrRollAgain()
}

async function handleAIPropertyDecision(player, space) {
  const ai = aiControllers.value[player.id]
  await new Promise(resolve => setTimeout(resolve, ai.getThinkingDelay()))
  
  const shouldBuy = ai.shouldBuyProperty(player, space, { properties })
  
  if (shouldBuy && player.money >= space.price) {
    buyProperty()
  } else {
    skipBuy()
  }
}

async function drawCard(type, player) {
  const deck = type === 'chance' ? shuffledChance : shuffledCommunity
  const card = deck.shift()
  deck.push(card) // Put it at the bottom
  
  currentCard.value = { ...card, type }
  message.value = card.text
  
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  await executeCardAction(card, player)
  currentCard.value = null
}

async function executeCardAction(card, player) {
  switch (card.action) {
    case 'moveTo':
      await moveToPosition(player, card.value, card.value !== 0)
      if (card.value === 0) receiveMoney(player, 200)
      await handleLanding(player)
      return
      
    case 'moveBack':
      await moveBackSteps(player, card.value)
      await handleLanding(player)
      return
      
    case 'receive':
      receiveMoney(player, card.value)
      break
      
    case 'pay':
      payMoney(player, card.value)
      break
      
    case 'goToJail':
      sendToJail()
      return
      
    case 'jailCard':
      player.hasJailCard = true
      break
      
    case 'repairs':
      let cost = 0
      Object.entries(properties).forEach(([id, prop]) => {
        if (prop.owner === player.id) {
          if (prop.houses === 5) cost += card.hotel
          else cost += prop.houses * card.house
        }
      })
      payMoney(player, cost)
      message.value = `${player.name} pays $${cost} for repairs.`
      break
      
    case 'payEach':
      const others = players.value.filter(p => p.id !== player.id && !p.isBankrupt)
      payMoney(player, card.value * others.length)
      others.forEach(p => receiveMoney(p, card.value))
      break
      
    case 'collectFromEach':
      const otherPlayers = players.value.filter(p => p.id !== player.id && !p.isBankrupt)
      otherPlayers.forEach(p => payMoney(p, card.value))
      receiveMoney(player, card.value * otherPlayers.length)
      break
      
    case 'nearestRailroad':
      const railroads = [5, 15, 25, 35]
      let nearest = railroads.find(r => r > player.position) || railroads[0]
      await moveToPosition(player, nearest)
      await handleLanding(player)
      return
      
    case 'nearestUtility':
      const utilities = [12, 28]
      let nearestUtil = utilities.find(u => u > player.position) || utilities[0]
      await moveToPosition(player, nearestUtil)
      await handleLanding(player)
      return
  }
  
  endTurnOrRollAgain()
}

function sendToJail() {
  currentPlayer.value.position = 10
  currentPlayer.value.inJail = true
  currentPlayer.value.jailTurns = 0
  doublesCount.value = 0
  message.value = `${currentPlayer.value.name} goes to Jail!`
  endTurn()
}

function endTurnOrRollAgain() {
  const isDoubles = dice.value[0] === dice.value[1]
  
  if (isDoubles && !currentPlayer.value.inJail && doublesCount.value < 3) {
    message.value = `${currentPlayer.value.name} rolled doubles! Roll again.`
    gamePhase.value = 'roll'
    
    if (!currentPlayer.value.isHuman) {
      setTimeout(performRoll, 1000)
    }
  } else {
    endTurn()
  }
}

function endTurn() {
  doublesCount.value = 0
  showDice.value = false
  
  // Find next active player
  let nextIndex = (currentPlayerIndex.value + 1) % 4
  while (players.value[nextIndex].isBankrupt) {
    nextIndex = (nextIndex + 1) % 4
    if (nextIndex === currentPlayerIndex.value) {
      // Only one player left
      return
    }
  }
  
  currentPlayerIndex.value = nextIndex
  gamePhase.value = 'roll'
  message.value = `${currentPlayer.value.name}'s turn. Roll the dice!`
  
  if (!currentPlayer.value.isHuman) {
    setTimeout(executeAITurn, 1000)
  }
}

async function executeAITurn() {
  const player = currentPlayer.value
  if (player.isHuman || player.isBankrupt) return
  
  const ai = aiControllers.value[player.id]
  
  // Handle jail
  if (player.inJail) {
    await new Promise(resolve => setTimeout(resolve, ai.getThinkingDelay()))
    
    if (player.hasJailCard) {
      useJailCard()
      return
    }
    
    if (ai.shouldPayJailFine(player, player.jailTurns, { properties })) {
      if (player.money >= 50) {
        payJailFine()
        return
      }
    }
  }
  
  // Build houses before rolling
  await tryBuildHouses(player, ai)
  
  // Roll
  await new Promise(resolve => setTimeout(resolve, ai.getThinkingDelay()))
  performRoll()
}

async function tryBuildHouses(player, ai) {
  // Check each color group for building opportunities
  for (const color of Object.keys(COLOR_GROUPS)) {
    const group = COLOR_GROUPS[color]
    const hasMonopoly = group.every(id => properties[id]?.owner === player.id)
    
    if (!hasMonopoly) continue
    
    // Try to build evenly
    let built = true
    while (built) {
      built = false
      const minHouses = Math.min(...group.map(id => properties[id]?.houses || 0))
      
      for (const propId of group) {
        const prop = properties[propId]
        const space = BOARD_SPACES[propId]
        
        if ((prop?.houses || 0) === minHouses && (prop?.houses || 0) < 5) {
          if (ai.shouldBuildHouse(player, space, { properties }) && player.money >= space.housePrice) {
            payMoney(player, space.housePrice)
            if (!properties[propId]) {
              properties[propId] = { owner: player.id, houses: 0, mortgaged: false }
            }
            properties[propId].houses = (properties[propId].houses || 0) + 1
            built = true
            await new Promise(resolve => setTimeout(resolve, 300))
          }
        }
      }
    }
  }
}

function buildHouse(propId) {
  if (!currentPlayer.value.isHuman) return
  
  const prop = properties[propId]
  const space = BOARD_SPACES[propId]
  
  if (!prop || prop.owner !== currentPlayer.value.id) return
  if (prop.houses >= 5) return
  if (currentPlayer.value.money < space.housePrice) return
  
  // Check monopoly
  const colorGroup = COLOR_GROUPS[space.color]
  const hasMonopoly = colorGroup.every(id => properties[id]?.owner === currentPlayer.value.id)
  if (!hasMonopoly) return
  
  // Check even build rule
  const minHouses = Math.min(...colorGroup.map(id => properties[id]?.houses || 0))
  if (prop.houses > minHouses) return
  
  payMoney(currentPlayer.value, space.housePrice)
  properties[propId].houses++
}

function payMoney(player, amount) {
  player.money -= amount
}

function receiveMoney(player, amount) {
  player.money += amount
}

function getPropertyOwnerColor(spaceId) {
  const prop = properties[spaceId]
  if (!prop) return null
  return players.value[prop.owner]?.token.color
}

function getPlayersOnSpace(spaceId) {
  return players.value.filter(p => p.position === spaceId && !p.isBankrupt)
}

function getPropertyInfo(spaceId) {
  return properties[spaceId]
}

function goHome() {
  router.push('/')
}

function restartGame() {
  gameStarted.value = false
  winner.value = null
}
</script>

<template>
  <div class="monopoly-container">
    <button class="back-btn" @click="goHome">← Back</button>
    
    <!-- Setup Screen -->
    <div v-if="!gameStarted" class="setup-screen">
      <h1>🎩 Monopoly</h1>
      <p class="subtitle">4 Player Board Game</p>
      
      <div class="setup-options">
        <div class="option-group">
          <label>Human Players:</label>
          <div class="btn-group">
            <button 
              v-for="n in 4" 
              :key="n"
              :class="{ active: humanPlayerCount === n }"
              @click="humanPlayerCount = n"
            >{{ n }}</button>
          </div>
        </div>
        
        <div class="option-group">
          <label>AI Difficulty:</label>
          <div class="btn-group">
            <button 
              v-for="d in ['easy', 'medium', 'hard']" 
              :key="d"
              :class="{ active: difficulty === d }"
              @click="difficulty = d"
            >{{ d }}</button>
          </div>
        </div>
        
        <button class="start-btn" @click="initGame">Start Game</button>
      </div>
    </div>

    <!-- Game Board -->
    <div v-else class="game-area">
      <!-- Player Info Panel -->
      <div class="players-panel">
        <div 
          v-for="player in players" 
          :key="player.id"
          class="player-card"
          :class="{ 
            active: currentPlayerIndex === player.id,
            bankrupt: player.isBankrupt
          }"
        >
          <div class="player-token" :style="{ background: player.token.color }">
            {{ player.token.emoji }}
          </div>
          <div class="player-info">
            <div class="player-name">
              {{ player.name }}
              <span v-if="!player.isHuman" class="ai-badge">AI</span>
              <span v-if="player.inJail" class="jail-badge">🔒</span>
            </div>
            <div class="player-money">${{ player.money }}</div>
          </div>
        </div>
      </div>

      <!-- Main Board -->
      <div class="board-wrapper">
        <div class="board">
          <!-- Top Row -->
          <div class="board-row top">
            <div 
              v-for="space in boardLayout.top" 
              :key="space.id"
              class="board-space"
              :class="[space.type, space.color]"
            >
              <div v-if="space.color" class="color-bar" :style="{ background: PROPERTY_COLORS[space.color] }"></div>
              <div class="space-name">{{ space.name }}</div>
              <div v-if="space.price" class="space-price">${{ space.price }}</div>
              <div v-if="getPropertyInfo(space.id)" class="property-indicator">
                <div class="owner-marker" :style="{ background: getPropertyOwnerColor(space.id) }"></div>
                <span v-if="getPropertyInfo(space.id).houses">
                  {{ getPropertyInfo(space.id).houses === 5 ? '🏨' : '🏠'.repeat(getPropertyInfo(space.id).houses) }}
                </span>
              </div>
              <div class="players-on-space">
                <span 
                  v-for="p in getPlayersOnSpace(space.id)" 
                  :key="p.id"
                  class="player-marker"
                  :style="{ background: p.token.color }"
                >{{ p.token.emoji }}</span>
              </div>
            </div>
          </div>

          <!-- Middle Section (Left, Center, Right) -->
          <div class="board-middle">
            <!-- Left Column -->
            <div class="board-col left">
              <div 
                v-for="space in boardLayout.left" 
                :key="space.id"
                class="board-space"
                :class="[space.type, space.color]"
              >
                <div v-if="space.color" class="color-bar" :style="{ background: PROPERTY_COLORS[space.color] }"></div>
                <div class="space-name">{{ space.name }}</div>
                <div v-if="space.price" class="space-price">${{ space.price }}</div>
                <div v-if="getPropertyInfo(space.id)" class="property-indicator">
                  <div class="owner-marker" :style="{ background: getPropertyOwnerColor(space.id) }"></div>
                  <span v-if="getPropertyInfo(space.id).houses">
                    {{ getPropertyInfo(space.id).houses === 5 ? '🏨' : '🏠'.repeat(getPropertyInfo(space.id).houses) }}
                  </span>
                </div>
                <div class="players-on-space">
                  <span 
                    v-for="p in getPlayersOnSpace(space.id)" 
                    :key="p.id"
                    class="player-marker"
                    :style="{ background: p.token.color }"
                  >{{ p.token.emoji }}</span>
                </div>
              </div>
            </div>

            <!-- Center Area -->
            <div class="board-center">
              <h2>MONOPOLY</h2>
              
              <!-- Dice Display -->
              <div v-if="showDice" class="dice-display">
                <div class="die">{{ dice[0] }}</div>
                <div class="die">{{ dice[1] }}</div>
              </div>
              
              <!-- Card Display -->
              <div v-if="currentCard" class="card-display" :class="currentCard.type">
                <div class="card-title">{{ currentCard.type === 'chance' ? 'CHANCE' : 'COMMUNITY CHEST' }}</div>
                <div class="card-text">{{ currentCard.text }}</div>
              </div>
              
              <!-- Message -->
              <div class="game-message">{{ message }}</div>
              
              <!-- Action Buttons -->
              <div class="action-buttons">
                <template v-if="currentPlayer?.isHuman && !winner">
                  <template v-if="gamePhase === 'roll' && !currentPlayer.inJail">
                    <button class="action-btn roll" @click="rollDice">🎲 Roll Dice</button>
                  </template>
                  
                  <template v-if="currentPlayer.inJail && gamePhase === 'roll'">
                    <button class="action-btn" @click="rollDice">🎲 Roll for Doubles</button>
                    <button v-if="currentPlayer.money >= 50" class="action-btn" @click="payJailFine">💰 Pay $50 Fine</button>
                    <button v-if="currentPlayer.hasJailCard" class="action-btn" @click="useJailCard">🎫 Use Jail Card</button>
                  </template>
                  
                  <template v-if="gamePhase === 'buy'">
                    <button class="action-btn buy" @click="buyProperty">✅ Buy Property</button>
                    <button class="action-btn skip" @click="skipBuy">❌ Pass</button>
                  </template>
                </template>
                
                <template v-if="winner">
                  <button class="action-btn" @click="restartGame">🔄 Play Again</button>
                </template>
              </div>
            </div>

            <!-- Right Column -->
            <div class="board-col right">
              <div 
                v-for="space in boardLayout.right" 
                :key="space.id"
                class="board-space"
                :class="[space.type, space.color]"
              >
                <div v-if="space.color" class="color-bar" :style="{ background: PROPERTY_COLORS[space.color] }"></div>
                <div class="space-name">{{ space.name }}</div>
                <div v-if="space.price" class="space-price">${{ space.price }}</div>
                <div v-if="getPropertyInfo(space.id)" class="property-indicator">
                  <div class="owner-marker" :style="{ background: getPropertyOwnerColor(space.id) }"></div>
                  <span v-if="getPropertyInfo(space.id).houses">
                    {{ getPropertyInfo(space.id).houses === 5 ? '🏨' : '🏠'.repeat(getPropertyInfo(space.id).houses) }}
                  </span>
                </div>
                <div class="players-on-space">
                  <span 
                    v-for="p in getPlayersOnSpace(space.id)" 
                    :key="p.id"
                    class="player-marker"
                    :style="{ background: p.token.color }"
                  >{{ p.token.emoji }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Row -->
          <div class="board-row bottom">
            <div 
              v-for="space in boardLayout.bottom" 
              :key="space.id"
              class="board-space"
              :class="[space.type, space.color]"
            >
              <div v-if="space.color" class="color-bar" :style="{ background: PROPERTY_COLORS[space.color] }"></div>
              <div class="space-name">{{ space.name }}</div>
              <div v-if="space.price" class="space-price">${{ space.price }}</div>
              <div v-if="getPropertyInfo(space.id)" class="property-indicator">
                <div class="owner-marker" :style="{ background: getPropertyOwnerColor(space.id) }"></div>
                <span v-if="getPropertyInfo(space.id).houses">
                  {{ getPropertyInfo(space.id).houses === 5 ? '🏨' : '🏠'.repeat(getPropertyInfo(space.id).houses) }}
                </span>
              </div>
              <div class="players-on-space">
                <span 
                  v-for="p in getPlayersOnSpace(space.id)" 
                  :key="p.id"
                  class="player-marker"
                  :style="{ background: p.token.color }"
                >{{ p.token.emoji }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Property Management -->
      <div v-if="currentPlayer?.isHuman && gamePhase === 'roll'" class="property-panel">
        <h3>Your Properties</h3>
        <div class="property-list">
          <div 
            v-for="[id, prop] in Object.entries(properties).filter(([id, p]) => p.owner === currentPlayer.id)"
            :key="id"
            class="property-item"
            :class="{ mortgaged: prop.mortgaged }"
          >
            <div 
              class="prop-color" 
              :style="{ background: PROPERTY_COLORS[BOARD_SPACES[id].color] || '#666' }"
            ></div>
            <span class="prop-name">{{ BOARD_SPACES[id].name }}</span>
            <span v-if="prop.houses" class="prop-houses">
              {{ prop.houses === 5 ? '🏨' : '🏠'.repeat(prop.houses) }}
            </span>
            <button 
              v-if="BOARD_SPACES[id].color && prop.houses < 5 && !prop.mortgaged"
              class="build-btn"
              @click="buildHouse(parseInt(id))"
              :disabled="currentPlayer.money < BOARD_SPACES[id].housePrice"
            >
              +🏠 ${{ BOARD_SPACES[id].housePrice }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.monopoly-container {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
}

.back-btn {
  position: fixed;
  top: 80px;
  left: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Setup Screen */
.setup-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
}

.setup-screen h1 {
  font-size: 4rem;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #ffd700, #ff6b35);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.5rem;
  color: #aaa;
  margin-bottom: 40px;
}

.setup-options {
  background: rgba(255, 255, 255, 0.05);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.option-group {
  margin-bottom: 30px;
}

.option-group label {
  display: block;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #ddd;
}

.btn-group {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-group button {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.3s;
}

.btn-group button.active {
  background: linear-gradient(45deg, #00c853, #00e676);
  border-color: #00c853;
}

.btn-group button:hover:not(.active) {
  background: rgba(255, 255, 255, 0.2);
}

.start-btn {
  padding: 15px 50px;
  font-size: 1.3rem;
  background: linear-gradient(45deg, #00c853, #00e676);
  border: none;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s;
}

.start-btn:hover {
  transform: scale(1.05);
}

/* Game Area */
.game-area {
  display: flex;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 60px;
}

/* Players Panel */
.players-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 200px;
  flex-shrink: 0;
}

.player-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.player-card.active {
  border-color: #00c853;
  background: rgba(0, 200, 83, 0.1);
}

.player-card.bankrupt {
  opacity: 0.4;
}

.player-token {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.player-info {
  flex: 1;
}

.player-name {
  font-weight: bold;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.ai-badge {
  font-size: 0.7rem;
  background: #666;
  padding: 2px 6px;
  border-radius: 4px;
}

.jail-badge {
  font-size: 0.9rem;
}

.player-money {
  color: #00c853;
  font-size: 1.1rem;
}

/* Board */
.board-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

.board {
  width: 700px;
  height: 700px;
  background: #c8e6c9;
  border: 4px solid #2e7d32;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.board-row {
  display: flex;
  height: 80px;
}

.board-row.top {
  flex-direction: row;
}

.board-row.bottom {
  flex-direction: row-reverse;
}

.board-middle {
  flex: 1;
  display: flex;
}

.board-col {
  width: 80px;
  display: flex;
  flex-direction: column;
}

.board-col.left {
  flex-direction: column-reverse;
}

.board-col.right {
  flex-direction: column;
}

.board-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #a5d6a7;
}

.board-center h2 {
  font-size: 2.5rem;
  color: #1b5e20;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  margin-bottom: 20px;
}

/* Board Spaces */
.board-space {
  flex: 1;
  min-width: 60px;
  border: 1px solid #2e7d32;
  background: #e8f5e9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px;
  position: relative;
  font-size: 0.6rem;
  text-align: center;
  color: #1a1a1a;
}

.color-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 15px;
}

.board-row.top .color-bar,
.board-col.left .color-bar {
  top: auto;
  bottom: 0;
}

.space-name {
  font-weight: bold;
  font-size: 0.55rem;
  line-height: 1.2;
  margin-top: 12px;
}

.space-price {
  font-size: 0.6rem;
  color: #666;
}

/* Corner spaces */
.board-space.go,
.board-space.jail,
.board-space.parking,
.board-space.gotojail {
  width: 80px;
  min-width: 80px;
  height: 80px;
  background: #fff9c4;
}

/* Special spaces */
.board-space.chance {
  background: #ffecb3;
}

.board-space.community {
  background: #e1f5fe;
}

.board-space.tax {
  background: #ffcdd2;
}

.board-space.railroad {
  background: #f5f5f5;
}

.board-space.utility {
  background: #f5f5f5;
}

/* Property indicators */
.property-indicator {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 2px;
}

.owner-marker {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid white;
}

/* Players on space */
.players-on-space {
  position: absolute;
  bottom: 2px;
  display: flex;
  gap: 2px;
}

.player-marker {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  border: 1px solid white;
}

/* Dice */
.dice-display {
  display: flex;
  gap: 15px;
  margin: 20px 0;
}

.die {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: #1a1a1a;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  animation: diceShake 0.1s infinite;
}

@keyframes diceShake {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

/* Cards */
.card-display {
  padding: 20px;
  border-radius: 10px;
  max-width: 250px;
  text-align: center;
  margin: 15px 0;
  color: #1a1a1a;
}

.card-display.chance {
  background: #ff9800;
}

.card-display.community {
  background: #2196f3;
  color: white;
}

.card-title {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.card-text {
  font-size: 0.85rem;
}

/* Messages */
.game-message {
  text-align: center;
  padding: 15px;
  background: rgba(0,0,0,0.3);
  border-radius: 10px;
  margin: 10px 0;
  min-height: 50px;
  color: white;
  font-size: 0.95rem;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: transform 0.2s;
  color: white;
  background: #666;
}

.action-btn:hover {
  transform: scale(1.05);
}

.action-btn.roll {
  background: linear-gradient(45deg, #00c853, #00e676);
}

.action-btn.buy {
  background: linear-gradient(45deg, #2196f3, #64b5f6);
}

.action-btn.skip {
  background: linear-gradient(45deg, #f44336, #e57373);
}

/* Property Panel */
.property-panel {
  width: 250px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 15px;
  max-height: 600px;
  overflow-y: auto;
}

.property-panel h3 {
  margin-bottom: 15px;
  color: #00c853;
}

.property-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.property-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 0.85rem;
}

.property-item.mortgaged {
  opacity: 0.5;
}

.prop-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.prop-name {
  flex: 1;
  font-size: 0.75rem;
}

.prop-houses {
  font-size: 0.7rem;
}

.build-btn {
  padding: 4px 8px;
  font-size: 0.7rem;
  background: #00c853;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.build-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 1200px) {
  .game-area {
    flex-direction: column;
    align-items: center;
  }
  
  .players-panel {
    flex-direction: row;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .property-panel {
    width: 100%;
    max-width: 700px;
  }
}

@media (max-width: 750px) {
  .board {
    width: 95vw;
    height: 95vw;
    max-width: 500px;
    max-height: 500px;
  }
  
  .board-row {
    height: 50px;
  }
  
  .board-col {
    width: 50px;
  }
  
  .board-space {
    font-size: 0.4rem;
    min-width: 40px;
  }
  
  .space-name {
    font-size: 0.35rem;
  }
  
  .board-center h2 {
    font-size: 1.5rem;
  }
}
</style>
