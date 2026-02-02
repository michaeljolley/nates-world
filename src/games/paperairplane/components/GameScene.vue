<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { levels, obstacleColors } from '../data/levels'
import { useAirplanePhysics } from '../composables/useAirplanePhysics'
import { useCollision } from '../composables/useCollision'

const props = defineProps({
  level: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['crash', 'goal-reached'])

const containerRef = ref(null)
let renderer, scene, camera
let airplane
let animationFrameId
let lastTime = 0

const physics = useAirplanePhysics()
const collision = useCollision()

function createPaperAirplane() {
  const group = new THREE.Group()
  
  // Main body (triangle shape)
  const bodyGeometry = new THREE.BufferGeometry()
  const bodyVertices = new Float32Array([
    // Top surface
    0, 0, 0.5,      // nose
    -0.3, 0, -0.3,  // left back
    0.3, 0, -0.3,   // right back
    // Bottom surface  
    0, -0.02, 0.5,
    0.3, -0.02, -0.3,
    -0.3, -0.02, -0.3,
  ])
  bodyGeometry.setAttribute('position', new THREE.BufferAttribute(bodyVertices, 3))
  bodyGeometry.setIndex([0, 1, 2, 3, 4, 5])
  bodyGeometry.computeVertexNormals()
  
  const bodyMaterial = new THREE.MeshLambertMaterial({ 
    color: 0xffffff, 
    side: THREE.DoubleSide 
  })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  group.add(body)

  // Wing folds (slight angle)
  const wingGeometry = new THREE.BufferGeometry()
  const wingVertices = new Float32Array([
    // Left wing
    0, 0, 0.3,
    -0.4, 0.08, -0.2,
    -0.15, 0, -0.2,
    // Right wing
    0, 0, 0.3,
    0.15, 0, -0.2,
    0.4, 0.08, -0.2,
  ])
  wingGeometry.setAttribute('position', new THREE.BufferAttribute(wingVertices, 3))
  wingGeometry.setIndex([0, 1, 2, 3, 4, 5])
  wingGeometry.computeVertexNormals()
  
  const wingMaterial = new THREE.MeshLambertMaterial({ 
    color: 0xf0f0f0, 
    side: THREE.DoubleSide 
  })
  const wings = new THREE.Mesh(wingGeometry, wingMaterial)
  group.add(wings)

  // Add a small line decoration
  const lineGeometry = new THREE.BufferGeometry()
  const lineVertices = new Float32Array([
    0, 0.01, 0.4,
    0, 0.01, -0.2
  ])
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(lineVertices, 3))
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x4a90d9 })
  const line = new THREE.Line(lineGeometry, lineMaterial)
  group.add(line)

  return group
}

function createRoom(levelData) {
  const group = new THREE.Group()
  const { width, height, depth } = levelData.roomSize

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(width, depth)
  const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0, depth / 2)
  group.add(floor)

  // Ceiling
  const ceilingGeometry = new THREE.PlaneGeometry(width, depth)
  const ceilingMaterial = new THREE.MeshLambertMaterial({ color: 0xF5F5DC })
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.set(0, height, depth / 2)
  group.add(ceiling)

  // Walls
  const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFACD })
  
  // Left wall
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(depth, height),
    wallMaterial
  )
  leftWall.rotation.y = Math.PI / 2
  leftWall.position.set(-width / 2, height / 2, depth / 2)
  group.add(leftWall)

  // Right wall
  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(depth, height),
    wallMaterial
  )
  rightWall.rotation.y = -Math.PI / 2
  rightWall.position.set(width / 2, height / 2, depth / 2)
  group.add(rightWall)

  // Back wall (behind player start)
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    wallMaterial
  )
  backWall.position.set(0, height / 2, 0)
  group.add(backWall)

  // Front wall with door/window opening
  const frontWallLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(width / 2 - 1.5, height),
    wallMaterial
  )
  frontWallLeft.rotation.y = Math.PI
  frontWallLeft.position.set(-width / 4 - 0.75, height / 2, depth)
  group.add(frontWallLeft)

  const frontWallRight = new THREE.Mesh(
    new THREE.PlaneGeometry(width / 2 - 1.5, height),
    wallMaterial
  )
  frontWallRight.rotation.y = Math.PI
  frontWallRight.position.set(width / 4 + 0.75, height / 2, depth)
  group.add(frontWallRight)

  return group
}

function createObstacles(levelData) {
  const group = new THREE.Group()
  const collisionBoxes = []

  levelData.obstacles.forEach(obs => {
    const color = obstacleColors[obs.type] || 0x888888
    const geometry = new THREE.BoxGeometry(obs.size.x, obs.size.y, obs.size.z)
    const material = new THREE.MeshLambertMaterial({ color })
    const mesh = new THREE.Mesh(geometry, material)
    
    mesh.position.set(
      obs.position.x,
      obs.position.y + obs.size.y / 2,
      obs.position.z
    )
    group.add(mesh)

    // Add collision box
    collisionBoxes.push({
      min: {
        x: obs.position.x - obs.size.x / 2,
        y: obs.position.y,
        z: obs.position.z - obs.size.z / 2
      },
      max: {
        x: obs.position.x + obs.size.x / 2,
        y: obs.position.y + obs.size.y,
        z: obs.position.z + obs.size.z / 2
      }
    })
  })

  return { group, collisionBoxes }
}

function createGoalIndicator(goal) {
  const width = goal.max.x - goal.min.x
  const height = goal.max.y - goal.min.y
  const depth = goal.max.z - goal.min.z
  
  const geometry = new THREE.BoxGeometry(width, height, depth)
  const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ff00, 
    transparent: true, 
    opacity: 0.3,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(geometry, material)
  
  mesh.position.set(
    (goal.min.x + goal.max.x) / 2,
    (goal.min.y + goal.max.y) / 2,
    (goal.min.z + goal.max.z) / 2
  )
  
  return mesh
}

function initScene() {
  const levelData = levels[props.level - 1]
  
  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87CEEB)
  scene.fog = new THREE.Fog(0x87CEEB, 10, 50)

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    containerRef.value.clientWidth / containerRef.value.clientHeight,
    0.1,
    100
  )

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  containerRef.value.appendChild(renderer.domElement)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 5)
  scene.add(directionalLight)

  // Room
  const room = createRoom(levelData)
  scene.add(room)

  // Obstacles
  const { group: obstacleGroup, collisionBoxes } = createObstacles(levelData)
  scene.add(obstacleGroup)
  collision.setObstacles(collisionBoxes)
  collision.setGoal(levelData.goal)
  collision.setRoomBounds(levelData.roomSize)

  // Goal indicator
  const goalIndicator = createGoalIndicator(levelData.goal)
  scene.add(goalIndicator)

  // Paper airplane
  airplane = createPaperAirplane()
  scene.add(airplane)

  // Initialize physics
  physics.reset()
  physics.launch(levelData.startPosition)
}

function updateCamera() {
  // Follow camera behind and above the airplane
  const offset = new THREE.Vector3(0, 1, -3)
  const euler = new THREE.Euler(physics.rotation.pitch * 0.3, physics.rotation.yaw, 0, 'YXZ')
  offset.applyEuler(euler)
  
  camera.position.set(
    physics.position.x + offset.x,
    physics.position.y + offset.y,
    physics.position.z + offset.z
  )
  camera.lookAt(physics.position.x, physics.position.y, physics.position.z + 2)
}

function gameLoop(currentTime) {
  animationFrameId = requestAnimationFrame(gameLoop)
  
  const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1)
  lastTime = currentTime

  // Update physics
  physics.update(deltaTime)

  // Update airplane position and rotation
  airplane.position.set(physics.position.x, physics.position.y, physics.position.z)
  airplane.rotation.set(physics.rotation.pitch, physics.rotation.yaw, physics.rotation.roll, 'YXZ')

  // Check collisions
  const collisionResult = collision.checkCollision(physics.position)
  if (collisionResult) {
    if (collisionResult.type === 'crash') {
      physics.stop()
      emit('crash')
      return
    } else if (collisionResult.type === 'goal') {
      physics.stop()
      emit('goal-reached')
      return
    }
  }

  // Update camera
  updateCamera()

  // Render
  renderer.render(scene, camera)
}

function handleKeyDown(e) {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      physics.setInput('up', true)
      break
    case 'ArrowDown':
    case 's':
    case 'S':
      physics.setInput('down', true)
      break
    case 'ArrowLeft':
    case 'a':
    case 'A':
      physics.setInput('left', true)
      break
    case 'ArrowRight':
    case 'd':
    case 'D':
      physics.setInput('right', true)
      break
  }
}

function handleKeyUp(e) {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      physics.setInput('up', false)
      break
    case 'ArrowDown':
    case 's':
    case 'S':
      physics.setInput('down', false)
      break
    case 'ArrowLeft':
    case 'a':
    case 'A':
      physics.setInput('left', false)
      break
    case 'ArrowRight':
    case 'd':
    case 'D':
      physics.setInput('right', false)
      break
  }
}

function handleResize() {
  if (!containerRef.value || !camera || !renderer) return
  
  camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
}

function cleanup() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (renderer) {
    renderer.dispose()
    if (containerRef.value && renderer.domElement) {
      containerRef.value.removeChild(renderer.domElement)
    }
  }
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('resize', handleResize)
}

onMounted(() => {
  initScene()
  lastTime = performance.now()
  animationFrameId = requestAnimationFrame(gameLoop)
  
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cleanup()
})

watch(() => props.level, () => {
  cleanup()
  initScene()
  lastTime = performance.now()
  animationFrameId = requestAnimationFrame(gameLoop)
  
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('resize', handleResize)
})
</script>

<template>
  <div ref="containerRef" class="game-scene"></div>
</template>

<style scoped>
.game-scene {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
