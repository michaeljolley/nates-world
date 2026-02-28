import { ref, computed } from 'vue'

export function usePlayer() {
  const position = ref({ x: 0, z: 0 })
  const targetPosition = ref({ x: 0, z: 0 })
  const isMoving = ref(false)
  const isAlive = ref(true)
  const rotation = ref(0) // Facing direction in degrees
  const hopProgress = ref(0)

  const MOVE_DURATION = 0.12 // seconds for hop animation
  const LANE_WIDTH = 20

  let moveStartTime = 0
  let moveStartPos = { x: 0, z: 0 }

  function init() {
    position.value = { x: 0, z: 0 }
    targetPosition.value = { x: 0, z: 0 }
    isMoving.value = false
    isAlive.value = true
    rotation.value = 0
    hopProgress.value = 0
  }

  function hop(direction, getLane) {
    if (isMoving.value || !isAlive.value) return false

    let dx = 0, dz = 0
    let newRotation = rotation.value

    switch (direction) {
      case 'forward':
        dz = 1
        newRotation = 0
        break
      case 'backward':
        dz = -1
        newRotation = 180
        break
      case 'left':
        dx = 1
        newRotation = 90
        break
      case 'right':
        dx = -1
        newRotation = 270
        break
      default:
        return false
    }

    const newX = position.value.x + dx
    const newZ = position.value.z + dz

    // Boundary check
    if (Math.abs(newX) > LANE_WIDTH / 2) return false
    if (newZ < 0) return false // Can't go back past start

    // Check for obstacles on target lane
    const targetLane = getLane(newZ)
    if (targetLane && targetLane.type === 'grass') {
      const hasObstacle = targetLane.obstacles.some(obs => obs.x === newX)
      if (hasObstacle) return false
    }

    // Start the hop
    rotation.value = newRotation
    moveStartPos = { ...position.value }
    targetPosition.value = { x: newX, z: newZ }
    isMoving.value = true
    moveStartTime = performance.now()
    hopProgress.value = 0

    return dz > 0 // Return true if moving forward (for scoring)
  }

  function update(delta) {
    if (!isMoving.value) return

    const elapsed = (performance.now() - moveStartTime) / 1000
    const progress = Math.min(elapsed / MOVE_DURATION, 1)
    
    hopProgress.value = progress

    // Interpolate position
    position.value = {
      x: moveStartPos.x + (targetPosition.value.x - moveStartPos.x) * progress,
      z: moveStartPos.z + (targetPosition.value.z - moveStartPos.z) * progress
    }

    if (progress >= 1) {
      position.value = { ...targetPosition.value }
      isMoving.value = false
      hopProgress.value = 0
    }
  }

  function die() {
    isAlive.value = false
  }

  function setPositionX(x) {
    if (!isMoving.value) {
      position.value.x = x
      targetPosition.value.x = x
    }
  }

  return {
    position,
    targetPosition,
    isMoving,
    isAlive,
    rotation,
    hopProgress,
    init,
    hop,
    update,
    die,
    setPositionX
  }
}
