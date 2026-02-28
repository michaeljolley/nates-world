import { TILE_SIZE, TILE_TYPES } from '../data/levels'

export function useCollision() {
  function checkLoot(playerGridX, playerGridY, level, onCollect) {
    const tile = level.grid[playerGridY]?.[playerGridX]
    if (tile === TILE_TYPES.LOOT) {
      level.grid[playerGridY][playerGridX] = TILE_TYPES.FLOOR
      onCollect()
      return true
    }
    return false
  }

  function checkExit(playerGridX, playerGridY, level) {
    const tile = level.grid[playerGridY]?.[playerGridX]
    return tile === TILE_TYPES.EXIT
  }

  function checkGuardCollision(playerX, playerY, guards) {
    const COLLISION_DIST = TILE_SIZE * 0.7
    
    for (const guard of guards) {
      const dx = (playerX + TILE_SIZE/2) - (guard.x + TILE_SIZE/2)
      const dy = (playerY + TILE_SIZE/2) - (guard.y + TILE_SIZE/2)
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < COLLISION_DIST) {
        return true
      }
    }
    return false
  }

  return {
    checkLoot,
    checkExit,
    checkGuardCollision
  }
}
