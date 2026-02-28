import { ref } from 'vue'
import { TILE_SIZE, TILE_TYPES } from '../data/levels'

export function useGuards() {
  const guards = ref([])
  const cameras = ref([])
  const noiseEvents = ref([])

  const GUARD_SPEED = 50 // pixels per second
  const GUARD_ALERT_SPEED = 80 // faster when alert
  const VISION_RANGE = 4.5 // tiles
  const VISION_ANGLE = Math.PI / 3 // 60 degree cone
  const HEARING_RANGE = 3 // tiles - guards can hear running

  function init(level) {
    guards.value = level.guardPatrols.map((patrol, index) => ({
      id: index,
      x: patrol.path[0][0] * TILE_SIZE,
      y: patrol.path[0][1] * TILE_SIZE,
      path: patrol.path,
      pathIndex: 0,
      direction: 'down',
      alertLevel: 0, // 0=normal, 1=suspicious, 2=alert
      alertTimer: 0,
      pauseTimer: 0,
      pauseTime: patrol.pauseTime || 1,
      investigateTarget: null,
      originalPath: patrol.path,
      state: 'patrol' // patrol, paused, investigating, returning
    }))

    // Initialize cameras
    cameras.value = (level.cameras || []).map((cam, index) => ({
      id: index,
      x: cam.x * TILE_SIZE,
      y: cam.y * TILE_SIZE,
      baseDirection: cam.direction,
      direction: cam.direction,
      sweepAngle: cam.sweepAngle || Math.PI / 3,
      sweepSpeed: 0.8,
      sweepProgress: 0,
      sweepDir: 1,
      alertLevel: 0
    }))
    
    noiseEvents.value = []
  }

  function getDirection(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left'
    }
    return dy > 0 ? 'down' : 'up'
  }

  function getDirectionVector(direction) {
    switch (direction) {
      case 'up': return { x: 0, y: -1 }
      case 'down': return { x: 0, y: 1 }
      case 'left': return { x: -1, y: 0 }
      case 'right': return { x: 1, y: 0 }
    }
    return { x: 0, y: 1 }
  }

  function getAngleFromDirection(direction) {
    switch (direction) {
      case 'right': return 0
      case 'down': return Math.PI / 2
      case 'left': return Math.PI
      case 'up': return -Math.PI / 2
    }
    return 0
  }

  function addNoise(x, y, radius = HEARING_RANGE) {
    noiseEvents.value.push({ x, y, radius, timer: 0.5 })
  }

  function update(delta, levelGrid) {
    // Update noise events
    noiseEvents.value = noiseEvents.value.filter(noise => {
      noise.timer -= delta
      return noise.timer > 0
    })

    // Update guards
    for (const guard of guards.value) {
      const speed = guard.alertLevel > 0 ? GUARD_ALERT_SPEED : GUARD_SPEED

      // Check for nearby noise
      for (const noise of noiseEvents.value) {
        const dx = noise.x - (guard.x + TILE_SIZE / 2)
        const dy = noise.y - (guard.y + TILE_SIZE / 2)
        const dist = Math.sqrt(dx * dx + dy * dy) / TILE_SIZE
        
        if (dist < noise.radius) {
          // Guard heard something
          guard.alertLevel = Math.max(guard.alertLevel, 1)
          guard.alertTimer = 3
          guard.investigateTarget = { x: noise.x, y: noise.y }
          guard.state = 'investigating'
        }
      }

      // State machine for guard behavior
      if (guard.state === 'paused') {
        guard.pauseTimer -= delta
        if (guard.pauseTimer <= 0) {
          guard.state = 'patrol'
          guard.pathIndex = (guard.pathIndex + 1) % guard.path.length
        }
      } else if (guard.state === 'investigating' && guard.investigateTarget) {
        // Move toward investigation target
        const targetX = guard.investigateTarget.x - TILE_SIZE / 2
        const targetY = guard.investigateTarget.y - TILE_SIZE / 2
        const dx = targetX - guard.x
        const dy = targetY - guard.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 5) {
          guard.direction = getDirection(dx, dy)
          const step = speed * delta
          guard.x += (dx / dist) * step
          guard.y += (dy / dist) * step
        } else {
          // Reached investigation point, look around
          guard.pauseTimer = 2
          guard.state = 'returning'
          guard.investigateTarget = null
        }
      } else if (guard.state === 'returning') {
        guard.pauseTimer -= delta
        if (guard.pauseTimer <= 0) {
          guard.state = 'patrol'
          guard.alertLevel = 0
        }
      } else {
        // Normal patrol
        const targetPoint = guard.path[guard.pathIndex]
        const targetX = targetPoint[0] * TILE_SIZE
        const targetY = targetPoint[1] * TILE_SIZE
        
        const dx = targetX - guard.x
        const dy = targetY - guard.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist > 2) {
          guard.direction = getDirection(dx, dy)
          const step = speed * delta
          guard.x += (dx / dist) * step
          guard.y += (dy / dist) * step
        } else {
          guard.x = targetX
          guard.y = targetY
          guard.pauseTimer = guard.pauseTime
          guard.state = 'paused'
        }
      }

      // Decay alert level
      if (guard.alertLevel > 0 && guard.state === 'patrol') {
        guard.alertTimer -= delta
        if (guard.alertTimer <= 0) {
          guard.alertLevel = Math.max(0, guard.alertLevel - 1)
          guard.alertTimer = 2
        }
      }
    }

    // Update cameras
    for (const camera of cameras.value) {
      // Sweep back and forth
      camera.sweepProgress += camera.sweepSpeed * camera.sweepDir * delta
      
      if (camera.sweepProgress >= 1) {
        camera.sweepProgress = 1
        camera.sweepDir = -1
      } else if (camera.sweepProgress <= -1) {
        camera.sweepProgress = -1
        camera.sweepDir = 1
      }

      // Decay camera alert
      if (camera.alertLevel > 0) {
        camera.alertLevel -= delta * 0.5
        if (camera.alertLevel < 0) camera.alertLevel = 0
      }
    }
  }

  function checkLineOfSight(fromX, fromY, toX, toY, levelGrid) {
    // Simple raycast to check if path is blocked by walls
    const steps = 20
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = fromX + (toX - fromX) * t
      const y = fromY + (toY - fromY) * t
      const gridX = Math.floor(x / TILE_SIZE)
      const gridY = Math.floor(y / TILE_SIZE)
      
      if (gridY >= 0 && gridY < levelGrid.length && 
          gridX >= 0 && gridX < levelGrid[0].length) {
        const tile = levelGrid[gridY][gridX]
        if (tile === TILE_TYPES.WALL || tile === TILE_TYPES.FURNITURE) {
          return false
        }
      }
    }
    return true
  }

  function checkVision(playerX, playerY, playerIsSneaking, isHiding, levelGrid) {
    const playerCenterX = playerX + TILE_SIZE / 2
    const playerCenterY = playerY + TILE_SIZE / 2

    // Player is invisible when hiding in shadows
    if (isHiding) return false
    
    // Check guards
    for (const guard of guards.value) {
      const guardCenterX = guard.x + TILE_SIZE / 2
      const guardCenterY = guard.y + TILE_SIZE / 2
      
      const dx = playerCenterX - guardCenterX
      const dy = playerCenterY - guardCenterY
      const distance = Math.sqrt(dx * dx + dy * dy) / TILE_SIZE
      
      // Sneaking reduces detection range
      const range = playerIsSneaking ? VISION_RANGE * 0.5 : VISION_RANGE
      
      if (distance > range) continue

      // Check line of sight
      if (!checkLineOfSight(guardCenterX, guardCenterY, playerCenterX, playerCenterY, levelGrid)) {
        continue
      }
      
      // Check if player is in vision cone
      const dirVec = getDirectionVector(guard.direction)
      const toPlayer = { x: dx / (distance * TILE_SIZE), y: dy / (distance * TILE_SIZE) }
      const dot = dirVec.x * toPlayer.x + dirVec.y * toPlayer.y
      const angle = Math.acos(Math.max(-1, Math.min(1, dot)))
      
      if (angle <= VISION_ANGLE) {
        // Player spotted!
        guard.alertLevel = 2
        guard.alertTimer = 3
        return true
      } else if (angle <= VISION_ANGLE * 1.5 && distance < 1.5) {
        // Very close peripheral vision
        if (guard.alertLevel < 1) {
          guard.alertLevel = 1
          guard.alertTimer = 2
        }
      }
    }

    // Check cameras
    for (const camera of cameras.value) {
      const camCenterX = camera.x + TILE_SIZE / 2
      const camCenterY = camera.y + TILE_SIZE / 2
      
      const dx = playerCenterX - camCenterX
      const dy = playerCenterY - camCenterY
      const distance = Math.sqrt(dx * dx + dy * dy) / TILE_SIZE
      
      const camRange = playerIsSneaking ? 3 : 5
      if (distance > camRange) continue

      // Check line of sight
      if (!checkLineOfSight(camCenterX, camCenterY, playerCenterX, playerCenterY, levelGrid)) {
        continue
      }

      // Calculate camera's current look direction with sweep
      const baseAngle = getAngleFromDirection(camera.baseDirection)
      const currentAngle = baseAngle + camera.sweepProgress * camera.sweepAngle

      const toPlayerAngle = Math.atan2(dy, dx)
      let angleDiff = Math.abs(toPlayerAngle - currentAngle)
      if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff

      if (angleDiff <= camera.sweepAngle * 0.7) {
        camera.alertLevel = 1
        return true
      }
    }
    
    return false
  }

  return {
    guards,
    cameras,
    noiseEvents,
    init,
    update,
    checkVision,
    addNoise,
    VISION_RANGE,
    VISION_ANGLE,
    HEARING_RANGE
  }
}
