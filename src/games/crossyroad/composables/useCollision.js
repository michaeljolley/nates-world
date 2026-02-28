export function useCollision() {
  const PLAYER_RADIUS = 0.4

  function checkVehicleCollision(playerPos, lane) {
    if (lane.type !== 'road') return false

    for (const vehicle of lane.vehicles) {
      const vehicleHalfWidth = vehicle.width / 2
      const minX = vehicle.x - vehicleHalfWidth - PLAYER_RADIUS
      const maxX = vehicle.x + vehicleHalfWidth + PLAYER_RADIUS

      if (playerPos.x >= minX && playerPos.x <= maxX) {
        return true
      }
    }
    return false
  }

  function checkWaterCollision(playerPos, lane) {
    if (lane.type !== 'water') return { inWater: false, onLog: false, logVelocity: 0 }

    // Check if player is on a log
    for (const log of lane.logs) {
      const logHalfWidth = log.width / 2
      if (playerPos.x >= log.x - logHalfWidth && playerPos.x <= log.x + logHalfWidth) {
        return { 
          inWater: true, 
          onLog: true, 
          logVelocity: lane.vehicleDirection * lane.vehicleSpeed 
        }
      }
    }

    // In water but not on log - drowning!
    return { inWater: true, onLog: false, logVelocity: 0 }
  }

  function checkTrainCollision(playerPos, lane) {
    if (lane.type !== 'rail' || !lane.trainActive) return false

    for (const train of lane.trains) {
      const trainHalfWidth = train.width / 2
      const minX = train.x - trainHalfWidth - PLAYER_RADIUS
      const maxX = train.x + trainHalfWidth + PLAYER_RADIUS

      if (playerPos.x >= minX && playerPos.x <= maxX) {
        return true
      }
    }
    return false
  }

  function checkCoinCollision(playerPos, lane) {
    if (!lane.decorations) return null

    for (const dec of lane.decorations) {
      if (dec.type === 'coin') {
        const dx = playerPos.x - dec.x
        if (Math.abs(dx) < 0.8) {
          return dec
        }
      }
    }
    return null
  }

  return {
    checkVehicleCollision,
    checkWaterCollision,
    checkTrainCollision,
    checkCoinCollision
  }
}
