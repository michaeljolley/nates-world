import * as THREE from 'three'

export function useCollision() {
  const obstacles = []
  const goalZone = { min: null, max: null }
  const roomBounds = { width: 10, height: 4, depth: 20 }
  
  // Airplane bounding box (small for tight navigation)
  const airplaneSize = new THREE.Vector3(0.3, 0.1, 0.4)

  function setObstacles(obstacleList) {
    obstacles.length = 0
    obstacleList.forEach(obs => {
      obstacles.push({
        min: new THREE.Vector3(obs.min.x, obs.min.y, obs.min.z),
        max: new THREE.Vector3(obs.max.x, obs.max.y, obs.max.z)
      })
    })
  }

  function setGoal(zone) {
    goalZone.min = new THREE.Vector3(zone.min.x, zone.min.y, zone.min.z)
    goalZone.max = new THREE.Vector3(zone.max.x, zone.max.y, zone.max.z)
  }

  function setRoomBounds(roomSize) {
    roomBounds.width = roomSize.width
    roomBounds.height = roomSize.height
    roomBounds.depth = roomSize.depth
  }

  function checkCollision(position) {
    const planeMin = new THREE.Vector3(
      position.x - airplaneSize.x / 2,
      position.y - airplaneSize.y / 2,
      position.z - airplaneSize.z / 2
    )
    const planeMax = new THREE.Vector3(
      position.x + airplaneSize.x / 2,
      position.y + airplaneSize.y / 2,
      position.z + airplaneSize.z / 2
    )

    // Check floor collision
    if (position.y < 0.1) {
      return { type: 'crash', reason: 'floor' }
    }

    // Check ceiling collision
    if (position.y > roomBounds.height - 0.1) {
      return { type: 'crash', reason: 'ceiling' }
    }

    // Check left wall collision
    if (position.x < -roomBounds.width / 2 + 0.2) {
      return { type: 'crash', reason: 'wall' }
    }

    // Check right wall collision
    if (position.x > roomBounds.width / 2 - 0.2) {
      return { type: 'crash', reason: 'wall' }
    }

    // Check back wall collision (behind start)
    if (position.z < 0.2) {
      return { type: 'crash', reason: 'wall' }
    }

    // Check obstacle collisions
    for (const obs of obstacles) {
      if (boxesIntersect(planeMin, planeMax, obs.min, obs.max)) {
        return { type: 'crash', reason: 'obstacle' }
      }
    }

    // Check goal
    if (goalZone.min && goalZone.max) {
      if (boxesIntersect(planeMin, planeMax, goalZone.min, goalZone.max)) {
        return { type: 'goal' }
      }
    }

    return null
  }

  function boxesIntersect(aMin, aMax, bMin, bMax) {
    return (
      aMin.x <= bMax.x && aMax.x >= bMin.x &&
      aMin.y <= bMax.y && aMax.y >= bMin.y &&
      aMin.z <= bMax.z && aMax.z >= bMin.z
    )
  }

  function clear() {
    obstacles.length = 0
    goalZone.min = null
    goalZone.max = null
  }

  return {
    setObstacles,
    setGoal,
    setRoomBounds,
    checkCollision,
    clear
  }
}
