<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  playerPosition: { type: Object, required: true },
  playerRotation: { type: Number, default: 0 },
  playerAlive: { type: Boolean, default: true },
  hopProgress: { type: Number, default: 0 },
  lanes: { type: Array, required: true },
  gameState: { type: String, required: true },
  playerSkin: { type: Object, default: () => ({ id: 'chicken', emoji: '🐔' }) }
})

const canvasRef = ref(null)
const emojiRef = ref(null)
let renderer, scene, camera
let playerMesh, playerGroup
let laneMeshes = new Map()
let animationId = null

const LANE_DEPTH = 1
const LANE_WIDTH = 20

// Colors
const COLORS = {
  grass: 0x4caf50,
  grassDark: 0x388e3c,
  road: 0x424242,
  roadLine: 0xffffff,
  water: 0x2196f3,
  rail: 0x795548,
  railMetal: 0x9e9e9e,
  tree: 0x2e7d32,
  treeTrunk: 0x5d4037,
  rock: 0x757575,
  car: [0xe53935, 0x1e88e5, 0xfdd835, 0x43a047],
  truck: [0xff7043, 0x5c6bc0, 0x26a69a],
  log: 0x8d6e63,
  coin: 0xffc107,
  chicken: 0xffeb3b,
  chickenBeak: 0xff9800,
  train: 0x37474f,
  trainFront: 0xf44336
}

function init() {
  if (!canvasRef.value) return

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb)
  scene.fog = new THREE.Fog(0x87ceeb, 15, 30)

  // Camera - isometric-ish view
  const aspect = canvasRef.value.clientWidth / canvasRef.value.clientHeight
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100)
  updateCameraPosition()

  // Renderer
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvasRef.value, 
    antialias: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.left = -15
  directionalLight.shadow.camera.right = 15
  directionalLight.shadow.camera.top = 15
  directionalLight.shadow.camera.bottom = -15
  scene.add(directionalLight)

  // Create player (chicken)
  createPlayer()

  // Handle resize
  window.addEventListener('resize', handleResize)
}

function createPlayer() {
  playerGroup = new THREE.Group()

  // Create emoji texture from canvas
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  
  // Draw emoji
  ctx.font = '100px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(props.playerSkin.emoji, 64, 64)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  
  // Create sprite material with the emoji
  const spriteMat = new THREE.SpriteMaterial({ 
    map: texture, 
    transparent: true,
    depthTest: true,
    depthWrite: false
  })
  
  const sprite = new THREE.Sprite(spriteMat)
  sprite.scale.set(1.2, 1.2, 1)
  sprite.position.y = 0.6
  sprite.userData.isPlayerSprite = true
  playerGroup.add(sprite)

  // Add a simple shadow underneath
  const shadowGeom = new THREE.PlaneGeometry(0.6, 0.4)
  const shadowMat = new THREE.MeshBasicMaterial({ 
    color: 0x000000, 
    transparent: true, 
    opacity: 0.3 
  })
  const shadow = new THREE.Mesh(shadowGeom, shadowMat)
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.01
  playerGroup.add(shadow)

  scene.add(playerGroup)
  playerMesh = playerGroup
}

function updatePlayerSkin() {
  if (!playerGroup) return
  
  // Find and update the sprite
  playerGroup.children.forEach(child => {
    if (child.userData.isPlayerSprite) {
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 128
      const ctx = canvas.getContext('2d')
      
      ctx.font = '100px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(props.playerSkin.emoji, 64, 64)
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      child.material.map = texture
      child.material.needsUpdate = true
    }
  })
}

function updateCameraPosition() {
  if (!camera) return
  const pz = props.playerPosition.z
  camera.position.set(
    props.playerPosition.x * 0.3,
    8,
    pz - 6
  )
  camera.lookAt(props.playerPosition.x * 0.3, 0, pz + 3)
}

function createLaneMesh(lane) {
  const group = new THREE.Group()
  group.position.z = lane.z * LANE_DEPTH

  // Ground
  const groundGeom = new THREE.BoxGeometry(LANE_WIDTH, 0.1, LANE_DEPTH)
  let groundColor = COLORS.grass

  if (lane.type === 'grass') {
    groundColor = lane.z % 2 === 0 ? COLORS.grass : COLORS.grassDark
  } else if (lane.type === 'road') {
    groundColor = COLORS.road
  } else if (lane.type === 'water') {
    groundColor = COLORS.water
  } else if (lane.type === 'rail') {
    groundColor = COLORS.grassDark
  }

  const groundMat = new THREE.MeshLambertMaterial({ color: groundColor })
  const ground = new THREE.Mesh(groundGeom, groundMat)
  ground.position.y = -0.05
  ground.receiveShadow = true
  group.add(ground)

  // Road markings
  if (lane.type === 'road') {
    const lineGeom = new THREE.BoxGeometry(0.3, 0.02, 0.05)
    const lineMat = new THREE.MeshBasicMaterial({ color: COLORS.roadLine })
    for (let x = -8; x <= 8; x += 2) {
      const line = new THREE.Mesh(lineGeom, lineMat)
      line.position.set(x, 0.01, 0)
      group.add(line)
    }
  }

  // Rail tracks
  if (lane.type === 'rail') {
    const railGeom = new THREE.BoxGeometry(LANE_WIDTH, 0.05, 0.08)
    const railMat = new THREE.MeshLambertMaterial({ color: COLORS.railMetal })
    
    const rail1 = new THREE.Mesh(railGeom, railMat)
    rail1.position.set(0, 0.03, -0.2)
    group.add(rail1)

    const rail2 = new THREE.Mesh(railGeom, railMat)
    rail2.position.set(0, 0.03, 0.2)
    group.add(rail2)

    // Ties
    const tieGeom = new THREE.BoxGeometry(0.3, 0.03, 0.6)
    const tieMat = new THREE.MeshLambertMaterial({ color: COLORS.rail })
    for (let x = -9; x <= 9; x += 1.5) {
      const tie = new THREE.Mesh(tieGeom, tieMat)
      tie.position.set(x, 0.01, 0)
      group.add(tie)
    }
  }

  // Obstacles (trees, rocks)
  for (const obs of lane.obstacles || []) {
    const obsMesh = createObstacle(obs)
    obsMesh.position.x = obs.x
    group.add(obsMesh)
  }

  // Store moving objects reference
  group.userData = {
    type: lane.type,
    vehicles: [],
    logs: [],
    trains: [],
    coins: [],
    warningLight: null
  }

  // Create vehicle/log meshes
  if (lane.type === 'road') {
    for (const vehicle of lane.vehicles || []) {
      const vMesh = createVehicle(vehicle)
      vMesh.position.x = vehicle.x
      vMesh.userData.vehicleData = vehicle
      group.add(vMesh)
      group.userData.vehicles.push(vMesh)
    }
  }

  if (lane.type === 'water') {
    for (const log of lane.logs || []) {
      const logMesh = createLog(log)
      logMesh.position.x = log.x
      logMesh.userData.logData = log
      group.add(logMesh)
      group.userData.logs.push(logMesh)
    }
  }

  if (lane.type === 'rail') {
    // Warning light
    const lightGeom = new THREE.BoxGeometry(0.2, 0.5, 0.2)
    const lightMat = new THREE.MeshLambertMaterial({ color: 0x333333 })
    const light = new THREE.Mesh(lightGeom, lightMat)
    light.position.set(-LANE_WIDTH / 2 + 1, 0.25, 0)
    group.add(light)
    group.userData.warningLight = light
  }

  // Decorations (coins)
  for (const dec of lane.decorations || []) {
    if (dec.type === 'coin') {
      const coinMesh = createCoin()
      coinMesh.position.x = dec.x
      coinMesh.userData.coinX = dec.x
      group.add(coinMesh)
      group.userData.coins.push(coinMesh)
    }
  }

  return group
}

function createObstacle(obs) {
  const group = new THREE.Group()

  if (obs.type === 'tree') {
    // Trunk
    const trunkGeom = new THREE.BoxGeometry(0.3, 0.5, 0.3)
    const trunkMat = new THREE.MeshLambertMaterial({ color: COLORS.treeTrunk })
    const trunk = new THREE.Mesh(trunkGeom, trunkMat)
    trunk.position.y = 0.25
    trunk.castShadow = true
    group.add(trunk)

    // Foliage (stacked boxes for blocky look)
    const leafMat = new THREE.MeshLambertMaterial({ color: COLORS.tree })
    
    const leaf1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.8), leafMat)
    leaf1.position.y = 0.7
    leaf1.castShadow = true
    group.add(leaf1)

    const leaf2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.6), leafMat)
    leaf2.position.y = 1.0
    leaf2.castShadow = true
    group.add(leaf2)

    const leaf3 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.3, 0.35), leafMat)
    leaf3.position.y = 1.25
    leaf3.castShadow = true
    group.add(leaf3)
  } else {
    // Rock
    const rockGeom = new THREE.BoxGeometry(0.5, 0.3, 0.5)
    const rockMat = new THREE.MeshLambertMaterial({ color: COLORS.rock })
    const rock = new THREE.Mesh(rockGeom, rockMat)
    rock.position.y = 0.15
    rock.rotation.y = Math.random() * Math.PI
    rock.castShadow = true
    group.add(rock)
  }

  return group
}

function createVehicle(vehicle) {
  const group = new THREE.Group()
  const color = vehicle.type === 'car' 
    ? COLORS.car[Math.floor(Math.random() * COLORS.car.length)]
    : COLORS.truck[Math.floor(Math.random() * COLORS.truck.length)]

  const width = vehicle.width
  const height = vehicle.type === 'car' ? 0.4 : 0.6
  const depth = 0.6

  // Body
  const bodyGeom = new THREE.BoxGeometry(width, height, depth)
  const bodyMat = new THREE.MeshLambertMaterial({ color })
  const body = new THREE.Mesh(bodyGeom, bodyMat)
  body.position.y = height / 2 + 0.05
  body.castShadow = true
  group.add(body)

  // Windows (for cars)
  if (vehicle.type === 'car') {
    const windowGeom = new THREE.BoxGeometry(width * 0.6, 0.2, depth * 0.9)
    const windowMat = new THREE.MeshLambertMaterial({ color: 0x90caf9 })
    const windows = new THREE.Mesh(windowGeom, windowMat)
    windows.position.y = height + 0.1
    group.add(windows)
  }

  // Wheels
  const wheelGeom = new THREE.BoxGeometry(0.15, 0.15, 0.15)
  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x212121 })

  const wheelPositions = vehicle.type === 'car' 
    ? [[-0.3, 0.08, 0.35], [0.3, 0.08, 0.35], [-0.3, 0.08, -0.35], [0.3, 0.08, -0.35]]
    : [[-0.5, 0.08, 0.35], [0.5, 0.08, 0.35], [-0.5, 0.08, -0.35], [0.5, 0.08, -0.35]]

  for (const [x, y, z] of wheelPositions) {
    const wheel = new THREE.Mesh(wheelGeom, wheelMat)
    wheel.position.set(x, y, z)
    group.add(wheel)
  }

  return group
}

function createLog(log) {
  const group = new THREE.Group()
  
  const logGeom = new THREE.BoxGeometry(log.width, 0.3, 0.7)
  const logMat = new THREE.MeshLambertMaterial({ color: COLORS.log })
  const logMesh = new THREE.Mesh(logGeom, logMat)
  logMesh.position.y = 0.1
  logMesh.castShadow = true
  group.add(logMesh)

  // Add some texture with rings
  const ringGeom = new THREE.BoxGeometry(0.05, 0.32, 0.05)
  const ringMat = new THREE.MeshLambertMaterial({ color: 0x6d4c41 })
  
  for (let x = -log.width / 2 + 0.3; x < log.width / 2; x += 0.4) {
    const ring = new THREE.Mesh(ringGeom, ringMat)
    ring.position.set(x, 0.1, 0)
    group.add(ring)
  }

  return group
}

function createTrain() {
  const group = new THREE.Group()

  // Engine
  const engineGeom = new THREE.BoxGeometry(2, 1.2, 0.8)
  const engineMat = new THREE.MeshLambertMaterial({ color: COLORS.train })
  const engine = new THREE.Mesh(engineGeom, engineMat)
  engine.position.set(0, 0.6, 0)
  engine.castShadow = true
  group.add(engine)

  // Front
  const frontGeom = new THREE.BoxGeometry(0.5, 0.8, 0.7)
  const frontMat = new THREE.MeshLambertMaterial({ color: COLORS.trainFront })
  const front = new THREE.Mesh(frontGeom, frontMat)
  front.position.set(1.2, 0.5, 0)
  group.add(front)

  // Chimney
  const chimneyGeom = new THREE.BoxGeometry(0.3, 0.4, 0.3)
  const chimney = new THREE.Mesh(chimneyGeom, engineMat)
  chimney.position.set(0.5, 1.4, 0)
  group.add(chimney)

  // Cars
  for (let i = 0; i < 5; i++) {
    const carGeom = new THREE.BoxGeometry(1.5, 0.8, 0.75)
    const carMat = new THREE.MeshLambertMaterial({ 
      color: i % 2 === 0 ? 0x5d4037 : 0x8d6e63 
    })
    const car = new THREE.Mesh(carGeom, carMat)
    car.position.set(-2 - i * 1.8, 0.5, 0)
    car.castShadow = true
    group.add(car)
  }

  // Wheels
  const wheelGeom = new THREE.BoxGeometry(0.2, 0.3, 0.15)
  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x212121 })

  for (let x = -10; x <= 1; x += 0.9) {
    const wheel1 = new THREE.Mesh(wheelGeom, wheelMat)
    wheel1.position.set(x, 0.15, 0.45)
    group.add(wheel1)

    const wheel2 = new THREE.Mesh(wheelGeom, wheelMat)
    wheel2.position.set(x, 0.15, -0.45)
    group.add(wheel2)
  }

  return group
}

function createCoin() {
  const group = new THREE.Group()
  
  const coinGeom = new THREE.BoxGeometry(0.3, 0.3, 0.1)
  const coinMat = new THREE.MeshLambertMaterial({ color: COLORS.coin })
  const coin = new THREE.Mesh(coinGeom, coinMat)
  coin.position.y = 0.4
  group.add(coin)

  return group
}

function updateLanes() {
  if (!scene) return

  const currentLaneZs = new Set(props.lanes.map(l => l.z))

  // Remove lanes that are no longer in view
  for (const [z, mesh] of laneMeshes) {
    if (!currentLaneZs.has(z)) {
      scene.remove(mesh)
      laneMeshes.delete(z)
    }
  }

  // Add or update lanes
  for (const lane of props.lanes) {
    if (!laneMeshes.has(lane.z)) {
      const mesh = createLaneMesh(lane)
      scene.add(mesh)
      laneMeshes.set(lane.z, mesh)
    } else {
      // Update moving objects
      const mesh = laneMeshes.get(lane.z)
      
      // Update vehicles
      if (lane.type === 'road') {
        for (let i = 0; i < mesh.userData.vehicles.length && i < lane.vehicles.length; i++) {
          mesh.userData.vehicles[i].position.x = lane.vehicles[i].x
        }
      }
      
      // Update logs
      if (lane.type === 'water') {
        for (let i = 0; i < mesh.userData.logs.length && i < lane.logs.length; i++) {
          mesh.userData.logs[i].position.x = lane.logs[i].x
        }
      }

      // Update trains
      if (lane.type === 'rail') {
        // Warning light
        if (mesh.userData.warningLight) {
          mesh.userData.warningLight.material.color.setHex(
            lane.trainWarning ? 0xff0000 : 0x333333
          )
        }

        // Remove old trains
        for (const train of mesh.userData.trains) {
          mesh.remove(train)
        }
        mesh.userData.trains = []

        // Add new trains
        for (const trainData of lane.trains || []) {
          const trainMesh = createTrain()
          trainMesh.position.x = trainData.x
          mesh.add(trainMesh)
          mesh.userData.trains.push(trainMesh)
        }
      }

      // Update coins (remove collected ones)
      const laneCoins = lane.decorations?.filter(d => d.type === 'coin') || []
      const coinXs = new Set(laneCoins.map(c => c.x))
      
      for (const coinMesh of mesh.userData.coins) {
        if (!coinXs.has(coinMesh.userData.coinX)) {
          mesh.remove(coinMesh)
        }
      }
      mesh.userData.coins = mesh.userData.coins.filter(c => coinXs.has(c.userData.coinX))
    }
  }
}

function updatePlayer() {
  if (!playerMesh) return

  playerMesh.position.x = props.playerPosition.x
  playerMesh.position.z = props.playerPosition.z * LANE_DEPTH
  playerMesh.rotation.y = -props.playerRotation * Math.PI / 180

  // Hop animation
  const hopHeight = Math.sin(props.hopProgress * Math.PI) * 0.3
  playerMesh.position.y = hopHeight

  // Squash and stretch
  const squash = 1 - Math.sin(props.hopProgress * Math.PI) * 0.1
  playerMesh.scale.y = 1 / squash
  playerMesh.scale.x = squash
  playerMesh.scale.z = squash

  // Death animation
  if (!props.playerAlive) {
    playerMesh.rotation.x = Math.PI / 2
    playerMesh.position.y = 0.1
  } else {
    playerMesh.rotation.x = 0
  }
}

function animate() {
  if (!renderer || !scene || !camera) return
  
  updateLanes()
  updatePlayer()
  updateCameraPosition()

  // Rotate coins
  for (const [_, laneMesh] of laneMeshes) {
    for (const coin of laneMesh.userData.coins || []) {
      coin.rotation.y += 0.02
    }
  }

  renderer.render(scene, camera)
  animationId = requestAnimationFrame(animate)
}

function handleResize() {
  if (!canvasRef.value || !camera || !renderer) return
  
  camera.aspect = canvasRef.value.clientWidth / canvasRef.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
}

function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  window.removeEventListener('resize', handleResize)
  
  if (renderer) {
    renderer.dispose()
  }
  
  laneMeshes.clear()
}

watch(() => props.gameState, (newState) => {
  if (newState === 'playing') {
    laneMeshes.forEach((mesh) => scene?.remove(mesh))
    laneMeshes.clear()
    // Update player skin when game starts/restarts
    updatePlayerSkin()
  }
})

watch(() => props.playerSkin.emoji, (newEmoji, oldEmoji) => {
  if (newEmoji !== oldEmoji) {
    updatePlayerSkin()
  }
}, { immediate: true })

onMounted(() => {
  init()
  animate()
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <canvas 
    ref="canvasRef" 
    class="game-canvas"
  />
</template>

<style scoped>
.game-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
