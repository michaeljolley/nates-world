<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { useCarPhysics, AICar } from '../composables/useCarPhysics'
import { getTrackById } from '../composables/tracks'

const props = defineProps({
  gameState: String,
  countdown: Number,
  currentTrack: Number
})

const emit = defineEmits(['lap-complete', 'update-time', 'position-update', 'speed-update'])

const containerRef = ref(null)

let trackData = null
let carPhysics = null
let scene, camera, renderer, playerCar
let animationId = null
let clock = new THREE.Clock()
let lastWaypointIdx = 0
let waypointsPassed = 0
let playerLapCount = 0
let lastFinishCross = 0

// AI opponents - Hot Wheels metallic colors
const aiCars = []
const AI_COLORS = [
  0xFF0000, // Candy Red
  0x00AA00, // Racing Green
  0xFFCC00, // Gold
  0xFF00FF, // Hot Pink
  0x00CCCC, // Teal
  0xFF6600, // Orange Flame
  0x6600FF, // Purple Haze
]

function createScene() {
  // Load track data based on current track selection
  trackData = getTrackById(props.currentTrack)
  carPhysics = useCarPhysics(trackData.waypoints, trackData.startPosition, trackData.loops, trackData.jumps)
  
  scene = new THREE.Scene()
  // Warm bedroom lighting feel
  scene.background = new THREE.Color(0xD4C4A8)  // Warm beige/cream
  scene.fog = new THREE.Fog(0xD4C4A8, 400, 900)

  camera = new THREE.PerspectiveCamera(
    70,
    containerRef.value.clientWidth / containerRef.value.clientHeight,
    0.1,
    1200
  )

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  renderer.shadowMap.enabled = true
  containerRef.value.appendChild(renderer.domElement)

  // Warm indoor lighting
  const ambientLight = new THREE.AmbientLight(0xFFF8E7, 0.7)  // Warm white
  scene.add(ambientLight)

  // Main room light (like ceiling light)
  const roomLight = new THREE.DirectionalLight(0xFFFAF0, 0.9)
  roomLight.position.set(0, 300, 0)
  roomLight.castShadow = true
  roomLight.shadow.mapSize.width = 4096
  roomLight.shadow.mapSize.height = 4096
  roomLight.shadow.camera.near = 0.5
  roomLight.shadow.camera.far = 800
  roomLight.shadow.camera.left = -600
  roomLight.shadow.camera.right = 600
  roomLight.shadow.camera.top = 600
  roomLight.shadow.camera.bottom = -600
  scene.add(roomLight)

  // Orange accent lights (like Hot Wheels themed lamps)
  const accentColors = [0xFF6600, 0xFF6600, 0xFFCC00, 0xFF3300]
  accentColors.forEach((color, i) => {
    const angle = (i / 4) * Math.PI * 2
    const spotlight = new THREE.SpotLight(color, 2, 400, Math.PI / 4)
    spotlight.position.set(Math.cos(angle) * 200, 100, Math.sin(angle) * 200)
    scene.add(spotlight)
  })

  createTrack()
  createPlayerCar()
  createAICars()
  createEnvironment()
}

function createTrack() {
  const trackWidth = 12  // Narrower like real Hot Wheels tracks
  const waypoints = trackData.waypoints

  // Ground - looks like a bedroom floor / wood
  const groundGeometry = new THREE.PlaneGeometry(1200, 1200)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B7355,  // Tan wood/carpet color
    roughness: 0.95
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.5
  ground.receiveShadow = true
  scene.add(ground)

  // Hot Wheels iconic orange track material
  const orangeTrackMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF6600,  // Hot Wheels orange
    roughness: 0.4,
    metalness: 0.1
  })
  
  // Blue connector material
  const blueConnectorMaterial = new THREE.MeshStandardMaterial({
    color: 0x0066CC,  // Hot Wheels blue
    roughness: 0.3,
    metalness: 0.2
  })

  // Track groove material (darker orange for depth)
  const grooveMaterial = new THREE.MeshStandardMaterial({
    color: 0xCC5500,
    roughness: 0.5
  })

  // Draw track path with Hot Wheels style
  for (let i = 0; i < waypoints.length; i++) {
    const curr = waypoints[i]
    const next = waypoints[(i + 1) % waypoints.length]
    
    const dx = next.x - curr.x
    const dz = next.z - curr.z
    const length = Math.sqrt(dx * dx + dz * dz)
    const angle = Math.atan2(dx, dz)

    // Main orange track base
    const trackBaseGeometry = new THREE.BoxGeometry(trackWidth, 0.8, length)
    const trackBase = new THREE.Mesh(trackBaseGeometry, orangeTrackMaterial)
    trackBase.position.set(
      curr.x + dx / 2,
      0.4,
      curr.z + dz / 2
    )
    trackBase.rotation.y = angle
    trackBase.castShadow = true
    trackBase.receiveShadow = true
    scene.add(trackBase)

    // Raised edges/rails on sides (characteristic Hot Wheels look)
    const railGeometry = new THREE.BoxGeometry(1.5, 1.2, length)
    
    const leftRail = new THREE.Mesh(railGeometry, orangeTrackMaterial)
    leftRail.position.set(
      curr.x + dx / 2 - Math.cos(angle) * (trackWidth / 2 - 0.75),
      0.6,
      curr.z + dz / 2 + Math.sin(angle) * (trackWidth / 2 - 0.75)
    )
    leftRail.rotation.y = angle
    scene.add(leftRail)

    const rightRail = new THREE.Mesh(railGeometry, orangeTrackMaterial)
    rightRail.position.set(
      curr.x + dx / 2 + Math.cos(angle) * (trackWidth / 2 - 0.75),
      0.6,
      curr.z + dz / 2 - Math.sin(angle) * (trackWidth / 2 - 0.75)
    )
    rightRail.rotation.y = angle
    scene.add(rightRail)

    // Center groove (where cars drive)
    const grooveGeometry = new THREE.BoxGeometry(trackWidth - 3, 0.3, length)
    const groove = new THREE.Mesh(grooveGeometry, grooveMaterial)
    groove.position.set(
      curr.x + dx / 2,
      0.15,
      curr.z + dz / 2
    )
    groove.rotation.y = angle
    scene.add(groove)

    // Blue connectors every few segments
    if (i % 3 === 0) {
      const connectorGeometry = new THREE.BoxGeometry(trackWidth + 2, 1.4, 3)
      const connector = new THREE.Mesh(connectorGeometry, blueConnectorMaterial)
      connector.position.set(curr.x, 0.7, curr.z)
      connector.rotation.y = angle
      scene.add(connector)
    }
  }

  // Create loops from track data
  for (const loop of trackData.loops) {
    createLoop(loop.x, loop.z, loop.rotation, loop.color, loop.size || 20)
  }

  // Create jumps from track data
  for (const jump of trackData.jumps) {
    createJump(jump.x, jump.z, jump.rotation)
  }

  // Start/Finish gantry
  createFinishLine()
}

function createLoop(x, z, rotationY, color, size = 20) {
  const loopRadius = size
  const tubeRadius = 6  // Wider like Hot Wheels track

  // Hot Wheels orange loop
  const orangeLoopMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF6600,  // Hot Wheels orange
    roughness: 0.4,
    metalness: 0.1
  })

  // Main loop structure - orange plastic
  const loopGeometry = new THREE.TorusGeometry(loopRadius, tubeRadius, 32, 64)
  const loop = new THREE.Mesh(loopGeometry, orangeLoopMaterial)
  loop.position.set(x, loopRadius + 2, z)
  loop.rotation.y = rotationY
  scene.add(loop)

  // Blue plastic supports (like real Hot Wheels)
  const blueSupportMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x0066CC,
    roughness: 0.3,
    metalness: 0.2
  })
  
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2
    const supportGeometry = new THREE.CylinderGeometry(1.5, 2, loopRadius + 5, 8)
    const support = new THREE.Mesh(supportGeometry, blueSupportMaterial)
    support.position.set(
      x + Math.cos(rotationY) * Math.cos(angle) * (loopRadius + 8),
      (loopRadius + 5) / 2,
      z + Math.sin(rotationY) * Math.cos(angle) * (loopRadius + 8)
    )
    scene.add(support)
  }

  // Hot Wheels flame decals around loop (yellow/red accents)
  for (let i = 0; i < 6; i++) {
    const ringAngle = (i / 6) * Math.PI * 2
    const flameGeometry = new THREE.ConeGeometry(1.5, 4, 8)
    const flameColor = i % 2 === 0 ? 0xFFCC00 : 0xFF3300
    const flameMaterial = new THREE.MeshStandardMaterial({
      color: flameColor,
      emissive: flameColor,
      emissiveIntensity: 0.3
    })
    const flame = new THREE.Mesh(flameGeometry, flameMaterial)
    flame.position.set(
      x + Math.sin(rotationY) * Math.cos(ringAngle) * (loopRadius + tubeRadius + 1),
      loopRadius + 2 + Math.sin(ringAngle) * (loopRadius + tubeRadius + 1),
      z + Math.cos(rotationY) * Math.cos(ringAngle) * (loopRadius + tubeRadius + 1)
    )
    flame.rotation.z = ringAngle + Math.PI / 2
    scene.add(flame)
  }
}

function createJump(x, z, rotationY) {
  // Hot Wheels style jump ramp
  const rampLength = 20
  const rampHeight = 6
  const rampWidth = 12  // Match track width
  
  // Orange plastic ramp material
  const orangeRampMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF6600,  // Hot Wheels orange
    roughness: 0.4,
    metalness: 0.1
  })
  
  // Blue support material
  const blueSupportMaterial = new THREE.MeshStandardMaterial({
    color: 0x0066CC,
    roughness: 0.3,
    metalness: 0.2
  })
  
  const rampGeometry = new THREE.BoxGeometry(rampWidth, 1, rampLength)
  
  // Up ramp
  const upRamp = new THREE.Mesh(rampGeometry, orangeRampMaterial)
  upRamp.position.set(x - 15, rampHeight / 2, z)
  upRamp.rotation.z = Math.atan2(rampHeight, rampLength)
  upRamp.rotation.y = rotationY
  upRamp.castShadow = true
  scene.add(upRamp)

  // Down ramp
  const downRamp = new THREE.Mesh(rampGeometry, orangeRampMaterial)
  downRamp.position.set(x + 15, rampHeight / 2, z)
  downRamp.rotation.z = -Math.atan2(rampHeight, rampLength)
  downRamp.rotation.y = rotationY
  downRamp.castShadow = true
  scene.add(downRamp)

  // Blue connector at top of jump
  const connectorGeometry = new THREE.BoxGeometry(rampWidth + 2, 1.5, 8)
  const connector = new THREE.Mesh(connectorGeometry, blueSupportMaterial)
  connector.position.set(x, rampHeight + 1, z)
  connector.rotation.y = rotationY
  scene.add(connector)

  // Side rails on ramps (orange)
  const railGeometry = new THREE.BoxGeometry(1.5, 1.5, rampLength)
  
  // Left rails
  const leftUpRail = new THREE.Mesh(railGeometry, orangeRampMaterial)
  leftUpRail.position.set(x - 15 - (rampWidth / 2 - 0.75) * Math.cos(rotationY), rampHeight / 2 + 0.5, z + (rampWidth / 2 - 0.75) * Math.sin(rotationY))
  leftUpRail.rotation.z = Math.atan2(rampHeight, rampLength)
  leftUpRail.rotation.y = rotationY
  scene.add(leftUpRail)
  
  // Blue support pillars
  const pillarGeometry = new THREE.CylinderGeometry(1, 1.5, rampHeight + 2, 8)
  
  const pillar1 = new THREE.Mesh(pillarGeometry, blueSupportMaterial)
  pillar1.position.set(x - 8, (rampHeight + 2) / 2, z - 8)
  scene.add(pillar1)
  
  const pillar2 = new THREE.Mesh(pillarGeometry, blueSupportMaterial)
  pillar2.position.set(x - 8, (rampHeight + 2) / 2, z + 8)
  scene.add(pillar2)
  
  const pillar3 = new THREE.Mesh(pillarGeometry, blueSupportMaterial)
  pillar3.position.set(x + 8, (rampHeight + 2) / 2, z - 8)
  scene.add(pillar3)
  
  const pillar4 = new THREE.Mesh(pillarGeometry, blueSupportMaterial)
  pillar4.position.set(x + 8, (rampHeight + 2) / 2, z + 8)
  scene.add(pillar4)

  // Hot Wheels flame decals on sides
  const flameGeometry = new THREE.ConeGeometry(2, 5, 8)
  const flameMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFCC00,
    emissive: 0xFF6600,
    emissiveIntensity: 0.4
  })
  
  for (let i = 0; i < 4; i++) {
    const flame = new THREE.Mesh(flameGeometry, flameMaterial)
    flame.position.set(
      x - 20 + i * 13,
      2,
      z + (i % 2 === 0 ? -10 : 10)
    )
    flame.rotation.z = Math.PI  // Point up
    scene.add(flame)
  }
}

function createFinishLine() {
  // Position finish line at first waypoint (where laps are counted)
  const finishWp = trackData.waypoints[0]
  const startZ = finishWp.z
  const startX = finishWp.x
  
  const gantryWidth = 27 // Slightly wider than track (25) to place poles at walls
  const gantryHeight = 15
  
  // Poles - positioned at the walls
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 })
  const poleGeometry = new THREE.CylinderGeometry(1, 1, gantryHeight, 8)
  
  const leftPole = new THREE.Mesh(poleGeometry, poleMaterial)
  leftPole.position.set(startX - gantryWidth / 2, gantryHeight / 2, startZ)
  scene.add(leftPole)
  
  const rightPole = new THREE.Mesh(poleGeometry, poleMaterial)
  rightPole.position.set(startX + gantryWidth / 2, gantryHeight / 2, startZ)
  scene.add(rightPole)

  // Top bar with checkered pattern
  const topBarGeometry = new THREE.BoxGeometry(gantryWidth, 3, 2)
  const topBarMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const topBar = new THREE.Mesh(topBarGeometry, topBarMaterial)
  topBar.position.set(startX, gantryHeight, startZ)
  scene.add(topBar)

  // Checkered pattern on gantry
  const gantryCheckerSize = 1.5
  const numCheckers = Math.floor(gantryWidth / gantryCheckerSize)
  for (let i = 0; i < numCheckers; i++) {
    for (let j = 0; j < 2; j++) {
      if ((i + j) % 2 === 0) {
        const checker = new THREE.Mesh(
          new THREE.BoxGeometry(gantryCheckerSize, gantryCheckerSize, 0.1),
          new THREE.MeshStandardMaterial({ color: 0x000000 })
        )
        checker.position.set(startX - gantryWidth / 2 + i * gantryCheckerSize + gantryCheckerSize / 2, gantryHeight - 1.5 + j * gantryCheckerSize + gantryCheckerSize / 2, startZ + 1)
        scene.add(checker)
      }
    }
  }

  // Ground start/finish line - spans wall to wall
  const trackWidth = 25
  const finishLineGeometry = new THREE.PlaneGeometry(trackWidth, 3)
  const finishLineMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.3
  })
  const finishLine = new THREE.Mesh(finishLineGeometry, finishLineMaterial)
  finishLine.rotation.x = -Math.PI / 2
  finishLine.position.set(startX, 0.05, startZ)
  scene.add(finishLine)

  // Checkered ground pattern - wall to wall
  const checkerSize = 2.5
  const checkersAcross = Math.floor(trackWidth / checkerSize)
  for (let i = 0; i < checkersAcross; i++) {
    for (let j = 0; j < 2; j++) {
      if ((i + j) % 2 === 0) {
        const checker = new THREE.Mesh(
          new THREE.PlaneGeometry(checkerSize, checkerSize),
          new THREE.MeshStandardMaterial({ color: 0x000000 })
        )
        checker.rotation.x = -Math.PI / 2
        checker.position.set(startX - trackWidth / 2 + i * checkerSize + checkerSize / 2, 0.06, startZ - checkerSize / 2 + j * checkerSize)
        scene.add(checker)
      }
    }
  }
}

function createPlayerCar() {
  playerCar = new THREE.Group()

  // Hot Wheels die-cast style car - metallic blue with flames
  // Low-slung muscle car body
  const bodyGeometry = new THREE.BoxGeometry(1.8, 0.5, 3.5)
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x0044AA,  // Metallic blue
    roughness: 0.15,
    metalness: 0.9
  })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.y = 0.4
  body.castShadow = true
  playerCar.add(body)

  // Hood scoop
  const scoopGeometry = new THREE.BoxGeometry(0.6, 0.25, 0.8)
  const scoopMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.3,
    metalness: 0.7
  })
  const scoop = new THREE.Mesh(scoopGeometry, scoopMaterial)
  scoop.position.set(0, 0.75, 1)
  playerCar.add(scoop)

  // Cabin/windshield - tinted
  const cabinGeometry = new THREE.BoxGeometry(1.5, 0.4, 1.4)
  const cabinMaterial = new THREE.MeshStandardMaterial({
    color: 0x222244,
    roughness: 0.1,
    metalness: 0.5,
    transparent: true,
    opacity: 0.7
  })
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
  cabin.position.set(0, 0.75, -0.2)
  playerCar.add(cabin)

  // Rear spoiler - big racing spoiler
  const spoilerGeometry = new THREE.BoxGeometry(2, 0.08, 0.35)
  const spoilerMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.8
  })
  const spoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial)
  spoiler.position.set(0, 1, -1.6)
  playerCar.add(spoiler)
  
  // Spoiler supports
  const supportGeometry = new THREE.BoxGeometry(0.08, 0.3, 0.08)
  const leftSupport = new THREE.Mesh(supportGeometry, spoilerMaterial)
  leftSupport.position.set(-0.8, 0.85, -1.6)
  playerCar.add(leftSupport)
  const rightSupport = new THREE.Mesh(supportGeometry, spoilerMaterial)
  rightSupport.position.set(0.8, 0.85, -1.6)
  playerCar.add(rightSupport)

  // Hot Wheels style oversized wheels with chrome
  const wheelGeometry = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 20)
  const wheelMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x111111,
    roughness: 0.4
  })
  const hubGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 12)
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xCCCCCC,
    roughness: 0.1,
    metalness: 1.0
  })
  
  const wheelPositions = [
    { x: -1, z: 1.2 },
    { x: 1, z: 1.2 },
    { x: -1, z: -1.2 },
    { x: 1, z: -1.2 }
  ]

  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel.rotation.z = Math.PI / 2
    wheel.position.set(pos.x, 0.38, pos.z)
    playerCar.add(wheel)
    
    // Chrome hubcap
    const hub = new THREE.Mesh(hubGeometry, chromeMaterial)
    hub.rotation.z = Math.PI / 2
    hub.position.set(pos.x * 1.15, 0.38, pos.z)
    playerCar.add(hub)
  })

  // Flame decals on sides (Hot Wheels signature look)
  const flameGeometry = new THREE.ConeGeometry(0.3, 1.2, 6)
  const flameMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF6600,
    emissive: 0xFF3300,
    emissiveIntensity: 0.3
  })
  
  // Left side flames
  for (let i = 0; i < 3; i++) {
    const flame = new THREE.Mesh(flameGeometry, flameMaterial)
    flame.rotation.z = Math.PI / 2
    flame.rotation.y = Math.PI / 2
    flame.position.set(-0.91, 0.4, 0.8 - i * 0.5)
    flame.scale.set(0.8 - i * 0.2, 1, 0.5)
    playerCar.add(flame)
  }
  
  // Right side flames
  for (let i = 0; i < 3; i++) {
    const flame = new THREE.Mesh(flameGeometry, flameMaterial)
    flame.rotation.z = -Math.PI / 2
    flame.rotation.y = -Math.PI / 2
    flame.position.set(0.91, 0.4, 0.8 - i * 0.5)
    flame.scale.set(0.8 - i * 0.2, 1, 0.5)
    playerCar.add(flame)
  }

  // Chrome exhaust pipes
  const exhaustGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.4, 8)
  const exhaustL = new THREE.Mesh(exhaustGeometry, chromeMaterial)
  exhaustL.rotation.x = Math.PI / 2
  exhaustL.position.set(-0.5, 0.25, -1.8)
  playerCar.add(exhaustL)
  const exhaustR = new THREE.Mesh(exhaustGeometry, chromeMaterial)
  exhaustR.rotation.x = Math.PI / 2
  exhaustR.position.set(0.5, 0.25, -1.8)
  playerCar.add(exhaustR)

  // Headlights
  const headlightGeometry = new THREE.CircleGeometry(0.15, 16)
  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffcc,
    emissive: 0xffffaa,
    emissiveIntensity: 0.8
  })
  const headlightL = new THREE.Mesh(headlightGeometry, headlightMaterial)
  headlightL.position.set(-0.55, 0.4, 1.76)
  playerCar.add(headlightL)
  const headlightR = new THREE.Mesh(headlightGeometry, headlightMaterial)
  headlightR.position.set(0.55, 0.4, 1.76)
  playerCar.add(headlightR)

  // Taillights (red)
  const taillightGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.05)
  const taillightMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 0.5
  })
  const taillightL = new THREE.Mesh(taillightGeometry, taillightMaterial)
  taillightL.position.set(-0.6, 0.4, -1.76)
  playerCar.add(taillightL)
  const taillightR = new THREE.Mesh(taillightGeometry, taillightMaterial)
  taillightR.position.set(0.6, 0.4, -1.76)
  playerCar.add(taillightR)

  scene.add(playerCar)
  carPhysics.reset()
}

function createAICars() {
  // Clear existing AI cars
  aiCars.length = 0
  
  // Create 7 AI opponents
  for (let i = 0; i < 7; i++) {
    const aiCar = new AICar(AI_COLORS[i], i + 1, trackData.waypoints, trackData.startPosition)
    const mesh = aiCar.createMesh()
    scene.add(mesh)
    aiCars.push(aiCar)
  }
}

function createEnvironment() {
  // Kid's bedroom environment with toys
  
  // Toy boxes around the track area
  const toyBoxMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x3366CC,  // Blue plastic
    roughness: 0.5
  })
  const redToyBoxMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xCC3333,
    roughness: 0.5
  })

  // Scattered toy boxes like storage bins
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2
    const radius = 450 + Math.random() * 100
    
    const boxGeometry = new THREE.BoxGeometry(40 + Math.random() * 20, 25, 30 + Math.random() * 15)
    const box = new THREE.Mesh(boxGeometry, i % 2 === 0 ? toyBoxMaterial : redToyBoxMaterial)
    box.position.set(
      Math.cos(angle) * radius,
      12.5,
      Math.sin(angle) * radius
    )
    box.rotation.y = angle + Math.random() * 0.5
    box.castShadow = true
    scene.add(box)
  }

  // Giant Hot Wheels logo sign
  const logoBaseMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF6600,
    emissive: 0xFF3300,
    emissiveIntensity: 0.3
  })
  const logoGeometry = new THREE.BoxGeometry(100, 30, 5)
  const logo = new THREE.Mesh(logoGeometry, logoBaseMaterial)
  logo.position.set(0, 60, -500)
  scene.add(logo)
  
  // Flame decorations on logo
  const flameColors = [0xFFCC00, 0xFF6600, 0xFF3300]
  for (let i = 0; i < 8; i++) {
    const flameGeometry = new THREE.ConeGeometry(8, 25, 8)
    const flameMaterial = new THREE.MeshStandardMaterial({
      color: flameColors[i % 3],
      emissive: flameColors[i % 3],
      emissiveIntensity: 0.4
    })
    const flame = new THREE.Mesh(flameGeometry, flameMaterial)
    flame.position.set(-35 + i * 10, 85, -500)
    scene.add(flame)
  }

  // Scattered toy dinosaurs and action figures (representing other toys)
  const greenToyMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.6 })
  const brownToyMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.6 })
  
  // Toy dinosaurs around the edges
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + 0.3
    const radius = 520
    
    // Simple dino shape (blocky toy style)
    const dinoBody = new THREE.Mesh(
      new THREE.BoxGeometry(15, 20, 35),
      greenToyMaterial
    )
    dinoBody.position.set(
      Math.cos(angle) * radius,
      10,
      Math.sin(angle) * radius
    )
    dinoBody.rotation.y = -angle
    scene.add(dinoBody)
    
    // Dino head
    const dinoHead = new THREE.Mesh(
      new THREE.BoxGeometry(8, 10, 12),
      greenToyMaterial
    )
    dinoHead.position.set(
      Math.cos(angle) * (radius - 20),
      18,
      Math.sin(angle) * (radius - 20)
    )
    scene.add(dinoHead)
  }

  // Building blocks scattered
  const blockColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF]
  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 480 + Math.random() * 80
    const blockSize = 8 + Math.random() * 12
    
    const blockGeometry = new THREE.BoxGeometry(blockSize, blockSize * 1.5, blockSize)
    const blockMaterial = new THREE.MeshStandardMaterial({
      color: blockColors[i % 5],
      roughness: 0.4
    })
    const block = new THREE.Mesh(blockGeometry, blockMaterial)
    block.position.set(
      Math.cos(angle) * radius,
      blockSize * 0.75,
      Math.sin(angle) * radius
    )
    block.rotation.y = Math.random() * Math.PI
    scene.add(block)
  }

  // Bedroom walls in the far distance (suggesting indoor setting)
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xE8DCC8,  // Beige wall color
    roughness: 0.9
  })
  
  // Back wall with poster
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(1200, 200),
    wallMaterial
  )
  backWall.position.set(0, 100, -600)
  scene.add(backWall)
  
  // Side walls
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(1200, 200),
    wallMaterial
  )
  leftWall.position.set(-600, 100, 0)
  leftWall.rotation.y = Math.PI / 2
  scene.add(leftWall)
  
  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(1200, 200),
    wallMaterial
  )
  rightWall.position.set(600, 100, 0)
  rightWall.rotation.y = -Math.PI / 2
  scene.add(rightWall)
}

function updateCamera() {
  if (!carPhysics) return
  
  const cameraDistance = 15
  const cameraHeightOffset = 6
  
  const pos = carPhysics.position.value
  const rot = carPhysics.rotation.value
  
  // Camera follows behind car and adjusts height based on car height
  const targetX = pos.x - Math.sin(rot) * cameraDistance
  const targetZ = pos.z - Math.cos(rot) * cameraDistance
  const targetY = pos.y + cameraHeightOffset
  
  camera.position.lerp(
    new THREE.Vector3(targetX, targetY, targetZ),
    0.08
  )
  camera.lookAt(pos.x, pos.y + 1, pos.z)
}

function checkLapCompletion() {
  if (!carPhysics) return
  
  const pos = carPhysics.position.value
  const waypoints = trackData.waypoints
  
  // Get first waypoint as finish line reference
  const finishWp = waypoints[0]
  
  // Check if passed through start/finish line (first waypoint area)
  const distToFinish = Math.sqrt(
    Math.pow(pos.x - finishWp.x, 2) + 
    Math.pow(pos.z - finishWp.z, 2)
  )
  
  const now = Date.now()
  
  // Within finish zone and enough waypoints passed and cooldown elapsed
  if (distToFinish < 20 && 
      waypointsPassed > Math.floor(waypoints.length * 0.6) &&
      now - lastFinishCross > 3000) {
    playerLapCount++
    emit('lap-complete')
    waypointsPassed = 0
    lastFinishCross = now
  }
  
  // Track progress through waypoints
  let closestDist = Infinity
  let closestIdx = 0
  for (let i = 0; i < waypoints.length; i++) {
    const wp = waypoints[i]
    const dist = Math.sqrt(
      Math.pow(pos.x - wp.x, 2) + 
      Math.pow(pos.z - wp.z, 2)
    )
    if (dist < closestDist) {
      closestDist = dist
      closestIdx = i
    }
  }
  
  // Only count forward progress
  if (closestIdx !== lastWaypointIdx) {
    const expectedNext = (lastWaypointIdx + 1) % waypoints.length
    // Allow some flexibility in waypoint detection
    if (Math.abs(closestIdx - expectedNext) < 3 || 
        (lastWaypointIdx > waypoints.length - 3 && closestIdx < 3)) {
      waypointsPassed++
    }
    lastWaypointIdx = closestIdx
  }
}

function getPlayerPosition() {
  // Calculate position among all racers based on laps and waypoints
  const waypoints = trackData.waypoints
  const playerProgress = playerLapCount * waypoints.length + waypointsPassed
  let pos = 1
  
  for (const ai of aiCars) {
    const aiProgress = ai.lapCount * waypoints.length + ai.currentWaypoint
    if (aiProgress > playerProgress) {
      pos++
    }
  }
  
  return pos
}

function animate() {
  animationId = requestAnimationFrame(animate)
  
  const delta = Math.min(clock.getDelta(), 0.1)
  
  if (props.gameState === 'playing' && carPhysics) {
    // Update player
    carPhysics.updatePhysics(delta)
    playerCar.position.copy(carPhysics.position.value)
    playerCar.rotation.y = carPhysics.rotation.value
    playerCar.rotation.x = carPhysics.pitchRotation.value  // Tilt for ramps
    playerCar.rotation.z = carPhysics.rollRotation.value   // Roll for loops
    
    // Update AI cars
    for (const ai of aiCars) {
      ai.update(delta)
    }
    
    checkLapCompletion()
    emit('update-time', delta)
    emit('position-update', getPlayerPosition())
    emit('speed-update', Math.abs(carPhysics.speed.value))
  }
  
  updateCamera()
  renderer.render(scene, camera)
}

function handleResize() {
  if (!containerRef.value || !camera || !renderer) return
  camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
}

function resetRace() {
  if (!carPhysics) return
  
  carPhysics.reset()
  waypointsPassed = 0
  lastWaypointIdx = 0
  playerLapCount = 0
  lastFinishCross = 0
  
  if (playerCar) {
    playerCar.position.copy(carPhysics.position.value)
    playerCar.rotation.set(0, carPhysics.rotation.value, 0)
  }
  
  // Reset AI cars
  aiCars.forEach((ai, i) => {
    ai.reset(i + 1)
  })
}

watch(() => props.gameState, (newVal) => {
  if (newVal === 'countdown') {
    resetRace()
    clock.start()
  }
})

function handleKeyDown(event) {
  if (carPhysics) carPhysics.handleKeyDown(event)
}

function handleKeyUp(event) {
  if (carPhysics) carPhysics.handleKeyUp(event)
}

onMounted(() => {
  createScene()
  animate()
  
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  
  if (renderer && containerRef.value) {
    containerRef.value.removeChild(renderer.domElement)
    renderer.dispose()
  }
})

defineExpose({ resetRace })
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
