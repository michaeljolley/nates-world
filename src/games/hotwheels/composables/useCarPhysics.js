import { ref, computed } from 'vue'
import * as THREE from 'three'

export function useCarPhysics(trackPoints, startPosition = { x: 0, z: -100, rotation: 0 }, loops = [], jumps = []) {
  const position = ref(new THREE.Vector3(startPosition.x, 0.5, startPosition.z))
  const rotation = ref(startPosition.rotation)
  const pitchRotation = ref(0)  // For going up/down ramps
  const rollRotation = ref(0)   // For loops
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

    // Track boundary collision - check distance from track centerline
    // Use a more forgiving approach that checks multiple segments
    const trackHalfWidth = 14  // Half of track width (slightly wider for tolerance)
    const closestIdx = getClosestWaypoint()
    
    // Check distance against multiple nearby segments for better accuracy
    let minDistFromTrack = Infinity
    let onTrack = false
    
    // Check current segment and adjacent segments
    for (let offset = -2; offset <= 2; offset++) {
      const idx1 = (closestIdx + offset + trackPoints.length) % trackPoints.length
      const idx2 = (idx1 + 1) % trackPoints.length
      
      const wp1 = trackPoints[idx1]
      const wp2 = trackPoints[idx2]
      
      // Calculate distance from this track segment
      const trackDirX = wp2.x - wp1.x
      const trackDirZ = wp2.z - wp1.z
      const trackLen = Math.sqrt(trackDirX * trackDirX + trackDirZ * trackDirZ)
      
      // Skip very long segments (like start/finish wrap-around)
      if (trackLen > 150) continue
      
      if (trackLen > 0) {
        // Normalized track direction
        const trackNormX = trackDirX / trackLen
        const trackNormZ = trackDirZ / trackLen
        
        // Vector from waypoint to car
        const toCarX = position.value.x - wp1.x
        const toCarZ = position.value.z - wp1.z
        
        // Project onto track segment to check if we're between waypoints
        const alongTrack = toCarX * trackNormX + toCarZ * trackNormZ
        
        // Only consider this segment if car is roughly between the two waypoints
        if (alongTrack >= -10 && alongTrack <= trackLen + 10) {
          // Perpendicular distance from track centerline
          const perpDist = Math.abs(toCarX * (-trackNormZ) + toCarZ * trackNormX)
          
          if (perpDist < minDistFromTrack) {
            minDistFromTrack = perpDist
          }
          
          if (perpDist <= trackHalfWidth) {
            onTrack = true
          }
        }
      }
    }
    
    // Also check raw distance to closest waypoint as fallback
    const closestWP = trackPoints[closestIdx]
    const distToWaypoint = Math.sqrt(
      Math.pow(position.value.x - closestWP.x, 2) + 
      Math.pow(position.value.z - closestWP.z, 2)
    )
    
    // If close to any waypoint, consider it on track (helps at corners and start/finish)
    if (distToWaypoint < trackHalfWidth + 8) {
      onTrack = true
    }
    
    // Check distance to first and last waypoints specifically (start/finish area)
    const firstWP = trackPoints[0]
    const lastWP = trackPoints[trackPoints.length - 1]
    const distToFirst = Math.sqrt(
      Math.pow(position.value.x - firstWP.x, 2) + 
      Math.pow(position.value.z - firstWP.z, 2)
    )
    const distToLast = Math.sqrt(
      Math.pow(position.value.x - lastWP.x, 2) + 
      Math.pow(position.value.z - lastWP.z, 2)
    )
    if (distToFirst < 30 || distToLast < 30) {
      onTrack = true  // Always allow movement near start/finish
    }
    
    // If off track, gently push back instead of stopping completely
    if (!onTrack && minDistFromTrack < Infinity) {
      // Reduce speed but don't stop completely
      speed.value *= 0.97
      
      // If way off track, do a harder correction
      if (minDistFromTrack > trackHalfWidth + 15) {
        position.value.copy(oldPosition)
        speed.value *= 0.85
      }
    }

    // Handle loops - make car go in a vertical circle
    let targetY = 0.5  // Default ground level
    let targetPitch = 0
    let targetRoll = 0
    let inLoop = false
    
    for (const loop of loops) {
      const loopX = loop.x
      const loopZ = loop.z
      const loopRadius = loop.size || 20
      const loopRotation = loop.rotation || 0
      
      // Calculate car position relative to loop center
      const dx = position.value.x - loopX
      const dz = position.value.z - loopZ
      
      // Rotate to loop's local coordinate system
      const cosR = Math.cos(-loopRotation)
      const sinR = Math.sin(-loopRotation)
      const localX = dx * cosR - dz * sinR  // Perpendicular to loop plane
      const localZ = dx * sinR + dz * cosR  // Along loop direction (forward/back through loop)
      
      // Check if car is within the loop's cylinder of influence
      const distFromLoopPlane = Math.abs(localX)  // Distance from the loop's vertical plane
      const distAlongLoop = localZ  // How far through the loop
      
      // Loop entry/exit zone
      const loopDepth = 15  // How thick the loop zone is
      
      if (distFromLoopPlane < loopDepth && Math.abs(distAlongLoop) < loopRadius + 10) {
        // Car is in the loop zone!
        inLoop = true
        
        // Calculate angle in the loop based on progress through it
        // distAlongLoop: negative = entering, 0 = at center bottom/top, positive = exiting
        // Map this to an angle: -radius to +radius maps to 0 to PI (half circle going up and over)
        
        const progressThroughLoop = (distAlongLoop + loopRadius) / (loopRadius * 2)  // 0 to 1
        const loopAngle = progressThroughLoop * Math.PI  // 0 to PI (bottom, up, top, down, bottom)
        
        // Height follows a sine wave - bottom at entry/exit, top in middle
        targetY = 0.5 + (1 - Math.cos(loopAngle)) * loopRadius
        
        // Pitch the car to follow the loop curvature
        // At entry (angle=0): pitch up, at top (angle=PI/2): upside down, at exit (angle=PI): pitch down
        targetPitch = loopAngle - Math.PI / 2
        
        // Roll the car as it goes around (upside down at top)
        targetRoll = loopAngle
        
        // Keep car on the loop track - constrain to loop plane
        const constrainedX = loopX + localX * 0.3  // Gently pull toward loop center plane
        position.value.x += (constrainedX - position.value.x) * 0.15
        
        // Minimum speed to complete loop
        if (speed.value < 15 && loopAngle > 0.3 && loopAngle < Math.PI - 0.3) {
          speed.value = 15  // Boost to prevent falling off
        }
      }
    }
    
    // Handle jumps - check if car is on a ramp (but not if in a loop)
    if (!inLoop) {
      for (const jump of jumps) {
        const jumpX = jump.x
        const jumpZ = jump.z
        const jumpRotation = jump.rotation
        
        // Distance to jump center
        const dx = position.value.x - jumpX
        const dz = position.value.z - jumpZ
        const distToJump = Math.sqrt(dx * dx + dz * dz)
        
        // Ramp dimensions
        const rampLength = 20
        const rampHeight = 6
        
        if (distToJump < 35) {
          // Calculate position along jump direction
          const jumpDirX = Math.sin(jumpRotation)
          const jumpDirZ = Math.cos(jumpRotation)
          
          // Project car position onto jump axis
          const alongJump = dx * jumpDirX + dz * jumpDirZ
          
          // Check if on approach ramp (going up)
          if (alongJump < -5 && alongJump > -25) {
            const rampProgress = (alongJump + 25) / 20  // 0 at start, 1 at top
            targetY = rampProgress * rampHeight + 0.5
            targetPitch = -Math.atan2(rampHeight, rampLength)  // Tilt up
          }
          // At the top/gap
          else if (alongJump >= -5 && alongJump <= 5) {
            targetY = rampHeight + 2
            targetPitch = 0
          }
          // On descent ramp (going down)
          else if (alongJump > 5 && alongJump < 25) {
            const rampProgress = (25 - alongJump) / 20  // 1 at top, 0 at bottom
            targetY = rampProgress * rampHeight + 0.5
            targetPitch = Math.atan2(rampHeight, rampLength)  // Tilt down
          }
        }
      }
    }
    
    // Smoothly interpolate to target height and rotations
    // Use faster interpolation when in a loop for snappier response
    const heightLerp = inLoop ? 0.25 : 0.15
    const rotLerp = inLoop ? 0.2 : 0.1
    
    position.value.y += (targetY - position.value.y) * heightLerp
    pitchRotation.value += (targetPitch - pitchRotation.value) * rotLerp
    rollRotation.value += (targetRoll - rollRotation.value) * rotLerp

    return {
      position: position.value.clone(),
      rotation: rotation.value,
      pitch: pitchRotation.value,
      roll: rollRotation.value,
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
    pitchRotation.value = 0
    rollRotation.value = 0
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
    pitchRotation,
    rollRotation,
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
  constructor(color, startOffset, trackPoints, startPosition = { x: 0, z: -100, rotation: 0 }) {
    this.trackPoints = trackPoints
    this.startPosition = startPosition
    this.startOffset = startOffset
    this.currentWaypoint = 0
    
    // Grid formation: 2 cars per row, staggered behind start line
    const row = Math.floor(startOffset / 2)
    const col = startOffset % 2
    const xOffset = col === 0 ? -5 : 5
    const zOffset = 8 + row * 6
    
    this.position = new THREE.Vector3(
      startPosition.x + xOffset, 
      0.5, 
      startPosition.z + zOffset
    )
    this.rotation = startPosition.rotation
    this.speed = 0
    this.maxSpeed = 22 + Math.random() * 10
    this.acceleration = 10 + Math.random() * 6
    this.color = color
    this.mesh = null
    this.lapCount = 0
  }

  createMesh() {
    const car = new THREE.Group()

    // Hot Wheels die-cast style body
    const bodyGeometry = new THREE.BoxGeometry(1.6, 0.45, 3.2)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.15,
      metalness: 0.9
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.y = 0.35
    body.castShadow = true
    car.add(body)

    // Hood scoop
    const scoopGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.6)
    const scoopMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.3,
      metalness: 0.7
    })
    const scoop = new THREE.Mesh(scoopGeometry, scoopMaterial)
    scoop.position.set(0, 0.65, 0.9)
    car.add(scoop)

    // Cabin - tinted glass
    const cabinGeometry = new THREE.BoxGeometry(1.3, 0.35, 1.2)
    const cabinMaterial = new THREE.MeshStandardMaterial({
      color: 0x222233,
      roughness: 0.1,
      metalness: 0.5,
      transparent: true,
      opacity: 0.7
    })
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
    cabin.position.set(0, 0.65, -0.1)
    car.add(cabin)

    // Spoiler
    const spoilerGeometry = new THREE.BoxGeometry(1.8, 0.06, 0.3)
    const spoilerMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.8
    })
    const spoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial)
    spoiler.position.set(0, 0.85, -1.4)
    car.add(spoiler)

    // Hot Wheels style wheels with chrome
    const wheelGeometry = new THREE.CylinderGeometry(0.32, 0.32, 0.24, 16)
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111,
      roughness: 0.4
    })
    const hubGeometry = new THREE.CylinderGeometry(0.16, 0.16, 0.26, 10)
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xCCCCCC,
      roughness: 0.1,
      metalness: 1.0
    })
    
    const wheelPositions = [
      { x: -0.85, z: 1 },
      { x: 0.85, z: 1 },
      { x: -0.85, z: -1 },
      { x: 0.85, z: -1 }
    ]

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
      wheel.rotation.z = Math.PI / 2
      wheel.position.set(pos.x, 0.32, pos.z)
      car.add(wheel)
      
      // Chrome hubcap
      const hub = new THREE.Mesh(hubGeometry, chromeMaterial)
      hub.rotation.z = Math.PI / 2
      hub.position.set(pos.x * 1.12, 0.32, pos.z)
      car.add(hub)
    })

    // Flame decals on sides
    const flameGeometry = new THREE.ConeGeometry(0.25, 1, 6)
    const flameMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF6600,
      emissive: 0xFF3300,
      emissiveIntensity: 0.3
    })
    
    for (let i = 0; i < 2; i++) {
      const flameL = new THREE.Mesh(flameGeometry, flameMaterial)
      flameL.rotation.z = Math.PI / 2
      flameL.rotation.y = Math.PI / 2
      flameL.position.set(-0.81, 0.35, 0.6 - i * 0.4)
      flameL.scale.set(0.7 - i * 0.2, 1, 0.4)
      car.add(flameL)
      
      const flameR = new THREE.Mesh(flameGeometry, flameMaterial)
      flameR.rotation.z = -Math.PI / 2
      flameR.rotation.y = -Math.PI / 2
      flameR.position.set(0.81, 0.35, 0.6 - i * 0.4)
      flameR.scale.set(0.7 - i * 0.2, 1, 0.4)
      car.add(flameR)
    }

    // Chrome exhaust
    const exhaustGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.3, 8)
    const exhaustL = new THREE.Mesh(exhaustGeometry, chromeMaterial)
    exhaustL.rotation.x = Math.PI / 2
    exhaustL.position.set(-0.4, 0.2, -1.65)
    car.add(exhaustL)
    const exhaustR = new THREE.Mesh(exhaustGeometry, chromeMaterial)
    exhaustR.rotation.x = Math.PI / 2
    exhaustR.position.set(0.4, 0.2, -1.65)
    car.add(exhaustR)

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
    // Grid formation: 2 cars per row, staggered behind start line
    const row = Math.floor(startOffset / 2)
    const col = startOffset % 2
    const xOffset = col === 0 ? -5 : 5
    const zOffset = 8 + row * 6
    
    this.position.set(
      this.startPosition.x + xOffset, 
      0.5, 
      this.startPosition.z + zOffset
    )
    this.rotation = this.startPosition.rotation
    this.speed = 0
    this.currentWaypoint = 0
    this.lapCount = 0
  }
}
