// AI Logic for Monopoly players

import { BOARD_SPACES, COLOR_GROUPS, RAILROADS, UTILITIES } from './gameData'

export class MonopolyAI {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty
  }

  // Decide whether to buy a property
  shouldBuyProperty(player, property, gameState) {
    const { money } = player
    const { price } = property
    
    // Always keep some reserve cash
    const reserveCash = this.getReserveCash()
    
    if (money - price < reserveCash) {
      return false
    }

    // Check strategic value
    const strategicValue = this.evaluatePropertyValue(player, property, gameState)
    
    if (this.difficulty === 'easy') {
      return Math.random() > 0.3 && money > price
    }
    
    if (this.difficulty === 'medium') {
      return strategicValue > 0.4 && money > price * 1.2
    }
    
    // Hard difficulty - more strategic
    return strategicValue > 0.3 && money > price * 1.5
  }

  getReserveCash() {
    switch (this.difficulty) {
      case 'easy': return 50
      case 'medium': return 150
      case 'hard': return 250
      default: return 150
    }
  }

  evaluatePropertyValue(player, property, gameState) {
    let value = 0.5 // Base value
    
    if (property.type === 'property') {
      // Check how many of this color group we own
      const colorGroup = COLOR_GROUPS[property.color]
      const ownedInGroup = colorGroup.filter(id => 
        gameState.properties[id]?.owner === player.id
      ).length
      
      // Higher value if we're close to monopoly
      value += ownedInGroup * 0.2
      
      // Check if opponents are close to monopoly
      const opponentOwned = colorGroup.filter(id => {
        const prop = gameState.properties[id]
        return prop?.owner !== undefined && prop.owner !== player.id
      }).length
      
      // Block opponents
      if (opponentOwned > 0) {
        value += 0.15
      }
      
      // Prefer orange and red (most landed on)
      if (property.color === 'orange' || property.color === 'red') {
        value += 0.1
      }
    }
    
    if (property.type === 'railroad') {
      const ownedRailroads = RAILROADS.filter(id => 
        gameState.properties[id]?.owner === player.id
      ).length
      value += ownedRailroads * 0.15
    }
    
    if (property.type === 'utility') {
      const ownedUtilities = UTILITIES.filter(id => 
        gameState.properties[id]?.owner === player.id
      ).length
      value += ownedUtilities * 0.1
    }
    
    return Math.min(value, 1)
  }

  // Decide whether to build houses
  shouldBuildHouse(player, property, gameState) {
    const { money } = player
    const housePrice = property.housePrice
    const reserveCash = this.getReserveCash()
    
    if (money - housePrice < reserveCash * 1.5) {
      return false
    }
    
    // Check if we have monopoly
    const colorGroup = COLOR_GROUPS[property.color]
    const hasMonopoly = colorGroup.every(id => 
      gameState.properties[id]?.owner === player.id
    )
    
    if (!hasMonopoly) return false
    
    // Check even build rule
    const currentHouses = gameState.properties[property.id].houses || 0
    const minHousesInGroup = Math.min(...colorGroup.map(id => 
      gameState.properties[id].houses || 0
    ))
    
    if (currentHouses > minHousesInGroup) return false
    
    if (currentHouses >= 5) return false // Already a hotel
    
    if (this.difficulty === 'easy') {
      return Math.random() > 0.5
    }
    
    return true
  }

  // Decide whether to mortgage a property
  shouldMortgage(player, property, amountNeeded, gameState) {
    // Never mortgage if we have monopoly and houses
    const colorGroup = property.color ? COLOR_GROUPS[property.color] : null
    
    if (colorGroup) {
      const hasMonopoly = colorGroup.every(id => 
        gameState.properties[id]?.owner === player.id
      )
      const hasHouses = colorGroup.some(id => 
        (gameState.properties[id]?.houses || 0) > 0
      )
      
      if (hasMonopoly && hasHouses) {
        return false
      }
    }
    
    // Prefer mortgaging lower value properties
    return true
  }

  // Decide what to do when in jail
  shouldPayJailFine(player, turnsInJail, gameState) {
    // Early game - try to get out quickly
    if (this.countOwnedProperties(player, gameState) < 3) {
      return true
    }
    
    // Late game with dangerous board - stay in jail
    if (this.isBoardDangerous(player, gameState) && turnsInJail < 3) {
      return false
    }
    
    // After 2 turns, pay to get out
    return turnsInJail >= 2
  }

  countOwnedProperties(player, gameState) {
    return Object.values(gameState.properties).filter(p => p?.owner === player.id).length
  }

  isBoardDangerous(player, gameState) {
    let dangerousSpaces = 0
    
    for (const [id, prop] of Object.entries(gameState.properties)) {
      if (prop?.owner !== undefined && prop.owner !== player.id) {
        const space = BOARD_SPACES[parseInt(id)]
        if (space && (prop.houses || 0) >= 3) {
          dangerousSpaces++
        }
      }
    }
    
    return dangerousSpaces >= 3
  }

  // Get properties to mortgage when short on cash
  getPropertiesToMortgage(player, amountNeeded, gameState) {
    const ownedProps = Object.entries(gameState.properties)
      .filter(([id, prop]) => prop?.owner === player.id && !prop.mortgaged)
      .map(([id, prop]) => ({ id: parseInt(id), ...prop, space: BOARD_SPACES[parseInt(id)] }))
      .sort((a, b) => {
        // Sort by strategic value (lowest first for mortgaging)
        const aValue = this.evaluatePropertyValue(player, a.space, gameState)
        const bValue = this.evaluatePropertyValue(player, b.space, gameState)
        return aValue - bValue
      })

    const toMortgage = []
    let totalMortgageValue = 0

    for (const prop of ownedProps) {
      if (totalMortgageValue >= amountNeeded) break
      if (prop.houses > 0) continue // Can't mortgage with houses
      
      toMortgage.push(prop.id)
      totalMortgageValue += prop.space.price / 2
    }

    return toMortgage
  }

  // Decide which houses to sell when short on cash
  getHousesToSell(player, amountNeeded, gameState) {
    const housesToSell = []
    let totalValue = 0

    for (const color of Object.keys(COLOR_GROUPS)) {
      const group = COLOR_GROUPS[color]
      const maxHouses = Math.max(...group.map(id => 
        gameState.properties[id]?.houses || 0
      ))

      if (maxHouses > 0) {
        // Sell from highest house count first
        const sortedByHouses = [...group].sort((a, b) => 
          (gameState.properties[b]?.houses || 0) - (gameState.properties[a]?.houses || 0)
        )

        for (const propId of sortedByHouses) {
          if (totalValue >= amountNeeded) break
          const prop = gameState.properties[propId]
          if (prop?.owner === player.id && prop.houses > 0) {
            housesToSell.push(propId)
            totalValue += BOARD_SPACES[propId].housePrice / 2
          }
        }
      }
    }

    return housesToSell
  }

  // Simulate thinking delay based on difficulty
  getThinkingDelay() {
    switch (this.difficulty) {
      case 'easy': return 500
      case 'medium': return 800
      case 'hard': return 1200
      default: return 800
    }
  }
}
