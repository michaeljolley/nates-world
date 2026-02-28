import { ref, computed } from 'vue'
import { TILE_SIZE, TILE_TYPES } from '../data/levels'

export function usePlayer() {
  const x = ref(0)
  const y = ref(0)
  const targetX = ref(0)
  const targetY = ref(0)
  const isMoving = ref(false)
  const direction = ref('down') // 'up', 'down', 'left', 'right'
  const isSneaking = ref(false)
  const isHiding = ref(false)
  const isRunning = ref(false)
  const noiseLevel = ref(0) // 0-1, how much noise player is making
  const lootBag = ref(0) // visual indicator of collected loot
  
  const WALK_SPEED = 120 // pixels per second
  const SNEAK_SPEED = 60
  const RUN_SPEED = 200

  const gridX = computed(() => Math.floor((x.value + TILE_SIZE / 2) / TILE_SIZE))
  const gridY = computed(() => Math.floor((y.value + TILE_SIZE / 2) / TILE_SIZE))

  function init(level) {
    // Find player spawn
    for (let row = 0; row < level.grid.length; row++) {
      for (let col = 0; col < level.grid[row].length; col++) {
        if (level.grid[row][col] === TILE_TYPES.PLAYER_SPAWN) {
          x.value = col * TILE_SIZE
          y.value = row * TILE_SIZE
          targetX.value = x.value
          targetY.value = y.value
          direction.value = 'down'
          isMoving.value = false
          isSneaking.value = false
          isRunning.value = false
          isHiding.value = false
          noiseLevel.value = 0
          lootBag.value = 0
          return
        }
      }
    }
  }

  function canMoveTo(gridCol, gridRow, level) {
    if (gridRow < 0 || gridRow >= level.grid.length) return false
    if (gridCol < 0 || gridCol >= level.grid[0].length) return false
    const tile = level.grid[gridRow][gridCol]
    return tile !== TILE_TYPES.WALL && tile !== TILE_TYPES.FURNITURE
  }

  function checkHiding(level) {
    const tile = level.grid[gridY.value]?.[gridX.value]
    isHiding.value = tile === TILE_TYPES.SHADOW
    return isHiding.value
  }

  function move(dx, dy, level) {
    if (isMoving.value) return false
    
    const newGridX = gridX.value + dx
    const newGridY = gridY.value + dy
    
    if (!canMoveTo(newGridX, newGridY, level)) return false
    
    targetX.value = newGridX * TILE_SIZE
    targetY.value = newGridY * TILE_SIZE
    isMoving.value = true
    
    if (dx > 0) direction.value = 'right'
    else if (dx < 0) direction.value = 'left'
    else if (dy > 0) direction.value = 'down'
    else if (dy < 0) direction.value = 'up'

    // Calculate noise based on movement type
    if (isRunning.value) {
      noiseLevel.value = 1
    } else if (isSneaking.value) {
      noiseLevel.value = 0
    } else {
      noiseLevel.value = 0.3
    }
    
    return true
  }

  function update(delta, level) {
    // Check hiding status
    checkHiding(level)

    if (!isMoving.value) {
      noiseLevel.value = 0
      return
    }

    let speed = WALK_SPEED
    if (isSneaking.value) speed = SNEAK_SPEED
    else if (isRunning.value) speed = RUN_SPEED

    const step = speed * delta

    const dx = targetX.value - x.value
    const dy = targetY.value - y.value
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist <= step) {
      x.value = targetX.value
      y.value = targetY.value
      isMoving.value = false
      noiseLevel.value = 0
    } else {
      x.value += (dx / dist) * step
      y.value += (dy / dist) * step
    }
  }

  function setSneaking(sneaking) {
    isSneaking.value = sneaking
    if (sneaking) isRunning.value = false
  }

  function setRunning(running) {
    isRunning.value = running
    if (running) isSneaking.value = false
  }

  function addLoot() {
    lootBag.value++
  }

  return {
    x,
    y,
    gridX,
    gridY,
    direction,
    isMoving,
    isSneaking,
    isHiding,
    isRunning,
    noiseLevel,
    lootBag,
    init,
    move,
    update,
    setSneaking,
    setRunning,
    addLoot,
    checkHiding
  }
}
