import { ref, computed } from 'vue'
import * as THREE from 'three'

// Track waypoints for the big racing circuit
export const trackWaypoints = [
  { x: 0, z: 100 },      // Start/Finish
  { x: 50, z: 100 },     // Straight
  { x: 100, z: 80 },     // Turn 1
  { x: 120, z: 40 },     // Into loop area
  { x: 100, z: 0 },      // After loop
  { x: 120, z: -50 },    // Big sweeper
  { x: 80, z: -100 },    // Jump section
  { x: 0, z: -120 },     // Back straight start
  { x: -80, z: -100 },   // Turn
  { x: -120, z: -50 },   // Sweeper
  { x: -100, z: 0 },     // Loop 2 area
  { x: -120, z: 40 },    // Exit loop
  { x: -100, z: 80 },    // Final turn
  { x: -50, z: 100 },    // Back to start
]

export function useCarPhysics(trackPoints = trackWaypoints) {
  const position = ref(new THREE.Vector3(0, 0.5, 100))
  const rotation = ref(0)
  const velocity = ref(new THREE.Vector3(0, 0, 0))
  const speed = ref(0)
  
  // SLOWER car properties
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
    position.value.add(velocity.value.clone().multiplyScalar(delta))

    // Track boundaries - wider track
    const trackHalfWidth = 15
    const closestIdx = getClosestWaypoint()
    const nextIdx = (closestIdx + 1) % trackPoints.length
    const prevIdx = (closestIdx - 1 + trackPoints.length) % trackPoints.length
    
    // Simple boundary check - keep within 150 units of center
    const distFromCenter = Math.sqrt(
      position.value.x * position.value.x + 
      position.value.z * position.value.z
    )
    
    if (distFromCenter > 160) {
      const normal = position.value.clone().normalize()
      position.value.copy(normal.multiplyScalar(155))
      speed.value *= 0.5
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
    position.value.set(0, 0.5, 100)
    rotation.value = 0
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
  constructor(color, startOffset, trackPoints) {
    this.trackPoints = trackPoints
    this.currentWaypoint = 0
    this.position = new THREE.Vector3(startOffset * 3, 0.5, 95 - startOffset * 2)
    this.rotation = 0
    this.speed = 0
    this.maxSpeed = 25 + Math.random() * 8 // Varied speeds
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
    this.position.set(startOffset * 3, 0.5, 95 - startOffset * 2)
    this.rotation = 0
    this.speed = 0
    this.currentWaypoint = 0
    this.lapCount = 0
  }
}
