import { ref, shallowRef } from 'vue'

// Lane types
const LANE_TYPES = ['grass', 'road', 'water', 'rail']

// Weighted random selection for lane types
function getRandomLaneType(prevType) {
  const weights = {
    grass: { grass: 0.3, road: 0.4, water: 0.2, rail: 0.1 },
    road: { grass: 0.3, road: 0.5, water: 0.1, rail: 0.1 },
    water: { grass: 0.4, road: 0.3, water: 0.2, rail: 0.1 },
    rail: { grass: 0.5, road: 0.3, water: 0.1, rail: 0.1 }
  }
  
  const w = weights[prevType] || { grass: 0.4, road: 0.3, water: 0.2, rail: 0.1 }
  const r = Math.random()
  let sum = 0
  
  for (const type of LANE_TYPES) {
    sum += w[type]
    if (r < sum) return type
  }
  return 'grass'
}

function createLane(z, type) {
  const lane = {
    z,
    type,
    obstacles: [],
    vehicles: [],
    logs: [],
    trains: [],
    decorations: [],
    vehicleDirection: Math.random() > 0.5 ? 1 : -1,
    vehicleSpeed: 2 + Math.random() * 4
  }

  const laneWidth = 20

  if (type === 'grass') {
    // Add trees and rocks
    const numObstacles = Math.floor(Math.random() * 4)
    const positions = new Set()
    
    for (let i = 0; i < numObstacles; i++) {
      let x
      do {
        x = Math.floor(Math.random() * laneWidth) - laneWidth / 2
      } while (positions.has(x))
      positions.add(x)
      
      lane.obstacles.push({
        x,
        type: Math.random() > 0.3 ? 'tree' : 'rock'
      })
    }

    // Add coins occasionally
    if (Math.random() > 0.7) {
      let x
      do {
        x = Math.floor(Math.random() * laneWidth) - laneWidth / 2
      } while (positions.has(x))
      
      lane.decorations.push({ x, type: 'coin' })
    }
  } else if (type === 'road') {
    // Add vehicles that move
    const numVehicles = 1 + Math.floor(Math.random() * 3)
    const spacing = laneWidth * 2 / numVehicles
    
    for (let i = 0; i < numVehicles; i++) {
      lane.vehicles.push({
        x: -laneWidth + i * spacing + Math.random() * spacing * 0.5,
        type: Math.random() > 0.5 ? 'car' : 'truck',
        width: Math.random() > 0.5 ? 1 : 1.5
      })
    }
  } else if (type === 'water') {
    // Add logs that player can ride
    const numLogs = 2 + Math.floor(Math.random() * 2)
    const spacing = laneWidth * 2 / numLogs
    
    lane.vehicleDirection = Math.random() > 0.5 ? 1 : -1
    lane.vehicleSpeed = 1 + Math.random() * 2
    
    for (let i = 0; i < numLogs; i++) {
      lane.logs.push({
        x: -laneWidth + i * spacing + Math.random() * spacing * 0.3,
        width: 2 + Math.floor(Math.random() * 2) // 2-3 units wide
      })
    }
  } else if (type === 'rail') {
    // Train tracks - trains come occasionally
    lane.trainWarning = false
    lane.trainActive = false
    lane.trains = []
  }

  return lane
}

export function useWorld() {
  const lanes = shallowRef([])
  const VISIBLE_LANES_BEHIND = 5
  const VISIBLE_LANES_AHEAD = 15

  function initWorld() {
    const initialLanes = []
    
    // Start with grass lanes
    for (let i = -VISIBLE_LANES_BEHIND; i < 3; i++) {
      initialLanes.push(createLane(i, 'grass'))
    }
    
    // Generate more lanes ahead
    let prevType = 'grass'
    for (let i = 3; i <= VISIBLE_LANES_AHEAD; i++) {
      const type = getRandomLaneType(prevType)
      initialLanes.push(createLane(i, type))
      prevType = type
    }
    
    lanes.value = initialLanes
  }

  function updateWorld(playerZ) {
    const currentLanes = [...lanes.value]
    
    // Remove lanes too far behind
    while (currentLanes.length > 0 && currentLanes[0].z < playerZ - VISIBLE_LANES_BEHIND) {
      currentLanes.shift()
    }
    
    // Add new lanes ahead
    const furthestZ = currentLanes.length > 0 ? currentLanes[currentLanes.length - 1].z : playerZ
    const neededZ = playerZ + VISIBLE_LANES_AHEAD
    
    if (furthestZ < neededZ) {
      let prevType = currentLanes.length > 0 ? currentLanes[currentLanes.length - 1].type : 'grass'
      
      for (let z = furthestZ + 1; z <= neededZ; z++) {
        const type = getRandomLaneType(prevType)
        currentLanes.push(createLane(z, type))
        prevType = type
      }
    }
    
    lanes.value = currentLanes
  }

  function getLane(z) {
    return lanes.value.find(l => l.z === z)
  }

  function updateVehicles(delta) {
    const laneWidth = 20
    const updatedLanes = lanes.value.map(lane => {
      if (lane.type === 'road') {
        const vehicles = lane.vehicles.map(v => ({
          ...v,
          x: wrapPosition(v.x + lane.vehicleDirection * lane.vehicleSpeed * delta, laneWidth)
        }))
        return { ...lane, vehicles }
      } else if (lane.type === 'water') {
        const logs = lane.logs.map(log => ({
          ...log,
          x: wrapPosition(log.x + lane.vehicleDirection * lane.vehicleSpeed * delta, laneWidth)
        }))
        return { ...lane, logs }
      }
      return lane
    })
    
    lanes.value = updatedLanes
  }

  function wrapPosition(x, width) {
    if (x > width) return -width
    if (x < -width) return width
    return x
  }

  function updateTrains(delta) {
    const updatedLanes = lanes.value.map(lane => {
      if (lane.type !== 'rail') return lane

      const updated = { ...lane }
      
      // Random chance to spawn a train
      if (!updated.trainActive && !updated.trainWarning && Math.random() < 0.002) {
        updated.trainWarning = true
        updated.trainTimer = 1.5 // Warning time
      }
      
      // Handle warning countdown
      if (updated.trainWarning && updated.trainTimer !== undefined) {
        updated.trainTimer -= delta
        if (updated.trainTimer <= 0) {
          updated.trainWarning = false
          updated.trainActive = true
          updated.trains = [{
            x: -30,
            width: 15,
            speed: 20
          }]
        }
      }
      
      // Move active trains
      if (updated.trainActive) {
        updated.trains = updated.trains.map(t => ({
          ...t,
          x: t.x + t.speed * delta
        })).filter(t => t.x < 30)
        
        if (updated.trains.length === 0) {
          updated.trainActive = false
        }
      }
      
      return updated
    })
    
    lanes.value = updatedLanes
  }

  function removeCoin(laneZ, coinX) {
    const updatedLanes = lanes.value.map(lane => {
      if (lane.z === laneZ) {
        return {
          ...lane,
          decorations: lane.decorations.filter(d => !(d.type === 'coin' && d.x === coinX))
        }
      }
      return lane
    })
    lanes.value = updatedLanes
  }

  return {
    lanes,
    initWorld,
    updateWorld,
    getLane,
    updateVehicles,
    updateTrains,
    removeCoin
  }
}
