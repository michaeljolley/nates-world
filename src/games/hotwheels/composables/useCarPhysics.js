import { ref, computed } from 'vue'
import * as THREE from 'three'

export function useCarPhysics(trackPoints, startPosition = { x: 0, z: -100, rotation: Math.PI }) {
  const position = ref(new THREE.Vector3(startPosition.x, 0.5, startPosition.z))
  const rotation = ref(startPosition.rotation)
  const velocity = ref(new THREE.Vector3(0, 0, 0))
  const speed = ref(0)
  
  // Car properties
  const maxSpeed = 35
  const acceleration = 15
  const brakeForce = 25
  const friction = 5
  const turnSpeed = 1.8
  
  // Input state
  const keys = ref({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false
  })

  const isMoving = computed(() => Math.abs(speed.value) > 0.1)

  // Get closest point on track
  function getClosestWaypoint() {
    let closest = 0
    let minDist = Infinity
    for (let i = 0; i < trackPoints.length; i++) {
      const wp = trackPoints[i]
      const dist = Math.sqrt(
        Math.pow(position.value.x - wp.x, 2) + 
        Math.pow(position.value.z - wp.z, 2)
      )
      if (dist < minDist) {
        minDist = dist
        closest = i
      }
    }
    return closest
  }

  function updatePhysics(delta) {
    // Acceleration / Braking
    if (keys.value.forward) {
      speed.value += acceleration * delta
    } else if (keys.value.backward) {
      speed.value -= acceleration * 0.4 * delta
    } else {
      if (speed.value > 0) {
        speed.value -= friction * delta
        if (speed.value < 0) speed.value = 0
      } else if (speed.value < 0) {
        speed.value += friction * delta
        if (speed.value > 0) speed.value = 0
      }
    }

    if (keys.value.brake) {
      if (speed.value > 0) {
        speed.value -= brakeForce * delta
        if (speed.value < 0) speed.value = 0
      } else if (speed.value < 0) {
        speed.value += brakeForce * delta
        if (speed.value > 0) speed.value = 0
      }
    }

    speed.value = Math.max(-maxSpeed * 0.3, Math.min(maxSpeed, speed.value))

    if (isMoving.value) {
      const turnMultiplier = Math.min(1, Math.abs(speed.value) / 15)
      if (keys.value.left) {
        rotation.value += turnSpeed * turnMultiplier * delta * Math.sign(speed.value)
      }
      if (keys.value.right) {
        rotation.value -= turnSpeed * turnMultiplier * delta * Math.sign(speed.value)
      }
    }

    const direction = new THREE.Vector3(
      Math.sin(rotation.value),
      0,
      Math.cos(rotation.value)
    )
    
    velocity.value.copy(direction.multiplyScalar(speed.value))
    
    // Store old position for collision rollback
    const oldPosition = position.value.clone()
    position.value.add(velocity.value.clone().multiplyScalar(delta))

    // Track boundary collision - stay on track between waypoints
    const trackHalfWidth = 12
    const closestIdx = getClosestWaypoint()
    const nextIdx = (closestIdx + 1) % trackPoints.length
    
    // Get the track segment we're on
    const wp1 = trackPoints[closestIdx]
    const wp2 = trackPoints[nextIdx]
    
    // Calculate distance from track centerline
    const trackDirX = wp2.x - wp1.x
    const trackDirZ = wp2.z - wp1.z
    const trackLen = Math.sqrt(trackDirX * trackDirX + trackDirZ * trackDirZ)
    
    if (trackLen > 0) {
      // Normalized track direction
      const trackNormX = trackDirX / trackLen
      const trackNormZ = trackDirZ / trackLen
      
      // Vector from waypoint to car
      const toCarX = position.value.x - wp1.x
      const toCarZ = position.value.z - wp1.z
      
      // Perpendicular distance from track centerline
      const perpDist = Math.abs(toCarX * (-trackNormZ) + toCarZ * trackNormX)
      
      // If too far from track, push back and slow down
      if (perpDist > trackHalfWidth) {
        // Calculate push direction (perpendicular to track)
        const pushX = -trackNormZ
        const pushZ = trackNormX
        
        // Determine which side and push back
        const side = Math.sign(toCarX * pushX + toCarZ * pushZ)
        const pushDist = perpDist - trackHalfWidth + 0.5
        
        position.value.x -= pushX * side * pushDist
        position.value.z -= pushZ * side * pushDist
        
        // Bounce effect - reduce speed
        speed.value *= 0.3
      }
    }
    
    // Also keep within overall arena bounds
    const distFromCenter = Math.sqrt(
      position.value.x * position.value.x + 
      position.value.z * position.value.z
    )
    
    if (distFromCenter > 180) {
      const normal = position.value.clone().normalize()
      position.value.copy(normal.multiplyScalar(175))
      speed.value *= 0.3
    }

    return {
      position: position.value.clone(),
      rotation: rotation.value,
      speed: speed.value
    }
  }

  function handleKeyDown(event) {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        keys.value.forward = true
        break
      case 'KeyS':
      case 'ArrowDown':
        keys.value.backward = true
        break
      case 'KeyA':
      case 'ArrowLeft':
        keys.value.left = true
        break
      case 'KeyD':
      case 'ArrowRight':
        keys.value.right = true
        break
      case 'Space':
        keys.value.brake = true
        break
    }
  }

  function handleKeyUp(event) {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        keys.value.forward = false
        break
      case 'KeyS':
      case 'ArrowDown':
        keys.value.backward = false
        break
      case 'KeyA':
      case 'ArrowLeft':
        keys.value.left = false
        break
      case 'KeyD':
      case 'ArrowRight':
        keys.value.right = false
        break
      case 'Space':
        keys.value.brake = false
        break
    }
  }

  function reset() {
    position.value.set(startPosition.x, 0.5, startPosition.z)
    rotation.value = startPosition.rotation
    velocity.value.set(0, 0, 0)
    speed.value = 0
    keys.value = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      brake: false
    }
  }

  return {
    position,
    rotation,
    velocity,
    speed,
    keys,
    isMoving,
    updatePhysics,
    handleKeyDown,
    handleKeyUp,
    reset,
    getClosestWaypoint
  }
}

// AI Car class
export class AICar {
  constructor(color, startOffset, trackPoints, startPosition = { x: 0, z: -100, rotation: Math.PI }) {
    this.trackPoints = trackPoints
    this.startPosition = startPosition
    this.currentWaypoint = 0
    this.position = new THREE.Vector3(
      startPosition.x + startOffset * 3, 
      0.5, 
      startPosition.z + 5 + startOffset * 2
    )
    this.rotation = startPosition.rotation
    this.speed = 0
    this.maxSpeed = 25 + Math.random() * 8
    this.acceleration = 12 + Math.random() * 5
    this.color = color
    this.mesh = null
    this.lapCount = 0
  }

  createMesh() {
    const car = new THREE.Group()

    // Body
    const bodyGeometry = new THREE.BoxGeometry(1.8, 0.5, 3.5)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.2,
      metalness: 0.8
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.y = 0.4
    body.castShadow = true
    car.add(body)

    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(1.4, 0.4, 1.5)
    const cabinMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.1
    })
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
    cabin.position.set(0, 0.8, -0.2)
    car.add(cabin)

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 12)
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 })
    
    const wheelPositions = [
      { x: -0.95, z: 1.1 },
      { x: 0.95, z: 1.1 },
      { x: -0.95, z: -1.1 },
      { x: 0.95, z: -1.1 }
    ]

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
      wheel.rotation.z = Math.PI / 2
      wheel.position.set(pos.x, 0.35, pos.z)
      car.add(wheel)
    })

    this.mesh = car
    return car
  }

  update(delta) {
    // Get target waypoint
    const target = this.trackPoints[this.currentWaypoint]
    const dx = target.x - this.position.x
    const dz = target.z - this.position.z
    const distToTarget = Math.sqrt(dx * dx + dz * dz)

    // Check if reached waypoint
    if (distToTarget < 15) {
      const prevWaypoint = this.currentWaypoint
      this.currentWaypoint = (this.currentWaypoint + 1) % this.trackPoints.length
      
      // Check for lap completion
      if (this.currentWaypoint === 0 && prevWaypoint === this.trackPoints.length - 1) {
        this.lapCount++
      }
    }

    // Steer towards waypoint
    const targetAngle = Math.atan2(dx, dz)
    let angleDiff = targetAngle - this.rotation
    
    // Normalize angle
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2

    // Turn towards target
    const turnRate = 2.0
    this.rotation += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), turnRate * delta)

    // Accelerate
    if (this.speed < this.maxSpeed) {
      this.speed += this.acceleration * delta
    }
    
    // Slow down for sharp turns
    if (Math.abs(angleDiff) > 0.5) {
      this.speed *= 0.98
    }

    // Update position
    this.position.x += Math.sin(this.rotation) * this.speed * delta
    this.position.z += Math.cos(this.rotation) * this.speed * delta

    // Update mesh
    if (this.mesh) {
      this.mesh.position.copy(this.position)
      this.mesh.rotation.y = this.rotation
    }
  }

  reset(startOffset) {
    this.position.set(
      this.startPosition.x + startOffset * 3, 
      0.5, 
      this.startPosition.z + 5 + startOffset * 2
    )
    this.rotation = this.startPosition.rotation
    this.speed = 0
    this.currentWaypoint = 0
    this.lapCount = 0
  }
}
