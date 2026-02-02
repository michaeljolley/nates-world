import { ref, reactive } from 'vue'
import * as THREE from 'three'

export function useAirplanePhysics() {
  const isFlying = ref(false)
  
  const position = reactive({ x: 0, y: 2, z: 0 })
  const velocity = reactive({ x: 0, y: 0, z: 0 })
  const rotation = reactive({ pitch: 0, yaw: 0, roll: 0 })
  
  // Physics constants - tuned for better control
  const FORWARD_SPEED = 6
  const GRAVITY = 1.2
  const LIFT_FACTOR = 0.8
  const PITCH_SPEED = 3.5
  const YAW_SPEED = 3.5
  const ROLL_SPEED = 4
  const MAX_PITCH = Math.PI / 3
  const MAX_ROLL = Math.PI / 2.5

  // Input state
  const input = reactive({
    up: false,
    down: false,
    left: false,
    right: false
  })

  function launch(startPosition) {
    position.x = startPosition?.x ?? 0
    position.y = startPosition?.y ?? 2
    position.z = startPosition?.z ?? 0
    
    velocity.x = 0
    velocity.y = 0
    velocity.z = FORWARD_SPEED
    
    rotation.pitch = 0
    rotation.yaw = 0
    rotation.roll = 0
    
    isFlying.value = true
  }

  function update(deltaTime) {
    if (!isFlying.value) return

    // Handle steering input
    if (input.up) {
      rotation.pitch = Math.max(rotation.pitch - PITCH_SPEED * deltaTime, -MAX_PITCH)
    } else if (input.down) {
      rotation.pitch = Math.min(rotation.pitch + PITCH_SPEED * deltaTime, MAX_PITCH)
    } else {
      // Return pitch to neutral
      rotation.pitch *= 0.95
    }

    if (input.left) {
      rotation.yaw -= YAW_SPEED * deltaTime
      rotation.roll = Math.max(rotation.roll - ROLL_SPEED * deltaTime, -MAX_ROLL)
    } else if (input.right) {
      rotation.yaw += YAW_SPEED * deltaTime
      rotation.roll = Math.min(rotation.roll + ROLL_SPEED * deltaTime, MAX_ROLL)
    } else {
      // Return roll to neutral
      rotation.roll *= 0.9
    }

    // Calculate direction from rotation
    const direction = new THREE.Vector3(0, 0, 1)
    const euler = new THREE.Euler(rotation.pitch, rotation.yaw, rotation.roll, 'YXZ')
    direction.applyEuler(euler)

    // Apply forward velocity in direction of travel
    velocity.x = direction.x * FORWARD_SPEED
    velocity.z = direction.z * FORWARD_SPEED
    
    // Apply gravity and lift
    const lift = -rotation.pitch * LIFT_FACTOR * FORWARD_SPEED
    velocity.y = direction.y * FORWARD_SPEED - GRAVITY * deltaTime + lift * deltaTime

    // Update position
    position.x += velocity.x * deltaTime
    position.y += velocity.y * deltaTime
    position.z += velocity.z * deltaTime
  }

  function stop() {
    isFlying.value = false
  }

  function reset() {
    isFlying.value = false
    position.x = 0
    position.y = 2
    position.z = 0
    velocity.x = 0
    velocity.y = 0
    velocity.z = 0
    rotation.pitch = 0
    rotation.yaw = 0
    rotation.roll = 0
  }

  function setInput(key, pressed) {
    if (key in input) {
      input[key] = pressed
    }
  }

  return {
    isFlying,
    position,
    velocity,
    rotation,
    input,
    launch,
    update,
    stop,
    reset,
    setInput
  }
}
