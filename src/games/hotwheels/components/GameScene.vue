<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { useCarPhysics, AICar, trackWaypoints } from '../composables/useCarPhysics'

const props = defineProps({
  gameState: String,
  countdown: Number
})

const emit = defineEmits(['lap-complete', 'update-time', 'position-update'])

const containerRef = ref(null)
const { position, rotation, speed, updatePhysics, handleKeyDown, handleKeyUp, reset } = useCarPhysics(trackWaypoints)

let scene, camera, renderer, playerCar
let animationId = null
let clock = new THREE.Clock()
let lastWaypointIdx = 0
let waypointsPassed = 0

// AI opponents
const aiCars = []
const AI_COLORS = [
  0x00ff00, // Green
  0x0066ff, // Blue  
  0xffff00, // Yellow
  0xff00ff, // Pink
  0x00ffff, // Cyan
  0xff8800, // Orange
  0x8800ff, // Purple
]

function createScene() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a1a)
  scene.fog = new THREE.Fog(0x0a0a1a, 100, 400)

  camera = new THREE.PerspectiveCamera(
    70,
    containerRef.value.clientWidth / containerRef.value.clientHeight,
    0.1,
    1000
  )

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  renderer.shadowMap.enabled = true
  containerRef.value.appendChild(renderer.domElement)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404060, 0.6)
  scene.add(ambientLight)

  const sunLight = new THREE.DirectionalLight(0xffffff, 0.8)
  sunLight.position.set(100, 200, 100)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.width = 4096
  sunLight.shadow.mapSize.height = 4096
  sunLight.shadow.camera.near = 0.5
  sunLight.shadow.camera.far = 600
  sunLight.shadow.camera.left = -200
  sunLight.shadow.camera.right = 200
  sunLight.shadow.camera.top = 200
  sunLight.shadow.camera.bottom = -200
  scene.add(sunLight)

  // Colored spotlights
  const colors = [0xff6600, 0x00aaff, 0xff00ff, 0x00ff66]
  colors.forEach((color, i) => {
    const angle = (i / 4) * Math.PI * 2
    const spotlight = new THREE.SpotLight(color, 3, 200, Math.PI / 3)
    spotlight.position.set(Math.cos(angle) * 80, 60, Math.sin(angle) * 80)
    scene.add(spotlight)
  })

  createTrack()
  createPlayerCar()
  createAICars()
  createEnvironment()
}

function createTrack() {
  const trackWidth = 25

  // Ground
  const groundGeometry = new THREE.PlaneGeometry(500, 500)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a2a,
    roughness: 0.9
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.5
  ground.receiveShadow = true
  scene.add(ground)

  // Neon grid
  const gridHelper = new THREE.GridHelper(500, 50, 0xff6600, 0x002244)
  gridHelper.position.y = -0.4
  scene.add(gridHelper)

  // Create track segments between waypoints
  const neonOrange = new THREE.MeshStandardMaterial({
    color: 0xff6600,
    emissive: 0xff4400,
    emissiveIntensity: 0.5
  })
  
  const neonBlue = new THREE.MeshStandardMaterial({
    color: 0x00aaff,
    emissive: 0x0066ff,
    emissiveIntensity: 0.5
  })

  const trackMaterial = new THREE.MeshStandardMaterial({
    color: 0x333344,
    roughness: 0.7,
    metalness: 0.3
  })

  // Draw track path
  for (let i = 0; i < trackWaypoints.length; i++) {
    const curr = trackWaypoints[i]
    const next = trackWaypoints[(i + 1) % trackWaypoints.length]
    
    const dx = next.x - curr.x
    const dz = next.z - curr.z
    const length = Math.sqrt(dx * dx + dz * dz)
    const angle = Math.atan2(dx, dz)

    // Track segment
    const segmentGeometry = new THREE.PlaneGeometry(trackWidth, length)
    const segment = new THREE.Mesh(segmentGeometry, trackMaterial)
    segment.rotation.x = -Math.PI / 2
    segment.rotation.z = -angle
    segment.position.set(
      curr.x + dx / 2,
      0.01,
      curr.z + dz / 2
    )
    scene.add(segment)

    // Left border (neon)
    const borderGeometry = new THREE.BoxGeometry(1.5, 2, length)
    const leftBorder = new THREE.Mesh(borderGeometry, neonOrange)
    leftBorder.position.set(
      curr.x + dx / 2 - Math.cos(angle) * (trackWidth / 2 + 0.75),
      1,
      curr.z + dz / 2 + Math.sin(angle) * (trackWidth / 2 + 0.75)
    )
    leftBorder.rotation.y = angle
    scene.add(leftBorder)

    // Right border (neon blue)
    const rightBorder = new THREE.Mesh(borderGeometry, neonBlue)
    rightBorder.position.set(
      curr.x + dx / 2 + Math.cos(angle) * (trackWidth / 2 + 0.75),
      1,
      curr.z + dz / 2 - Math.sin(angle) * (trackWidth / 2 + 0.75)
    )
    rightBorder.rotation.y = angle
    scene.add(rightBorder)

    // Racing stripes on track
    const stripeGeometry = new THREE.PlaneGeometry(1, length - 5)
    const stripeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.2
    })
    const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial)
    stripe.rotation.x = -Math.PI / 2
    stripe.rotation.z = -angle
    stripe.position.set(
      curr.x + dx / 2,
      0.02,
      curr.z + dz / 2
    )
    scene.add(stripe)
  }

  // LOOP THE LOOPS!
  createLoop(100, 0, Math.PI / 2, 0xff6600)   // Right side loop
  createLoop(-100, 0, -Math.PI / 2, 0x00aaff)  // Left side loop

  // BIG JUMPS!
  createJump(80, -100, 0)      // Jump 1
  createJump(-80, -100, Math.PI) // Jump 2
  createJump(0, -120, Math.PI / 2) // Center jump

  // Start/Finish gantry
  createFinishLine()
}

function createLoop(x, z, rotationY, color) {
  const loopRadius = 20
  const tubeRadius = 3

  // Main loop structure
  const loopGeometry = new THREE.TorusGeometry(loopRadius, tubeRadius, 32, 64)
  const loopMaterial = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.4,
    metalness: 0.8,
    roughness: 0.2
  })
  const loop = new THREE.Mesh(loopGeometry, loopMaterial)
  loop.position.set(x, loopRadius + 2, z)
  loop.rotation.y = rotationY
  scene.add(loop)

  // Loop supports
  const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 })
  
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2
    const supportGeometry = new THREE.CylinderGeometry(1, 1.5, loopRadius + 5, 8)
    const support = new THREE.Mesh(supportGeometry, supportMaterial)
    support.position.set(
      x + Math.cos(rotationY) * Math.cos(angle) * (loopRadius + 5),
      (loopRadius + 5) / 2,
      z + Math.sin(rotationY) * Math.cos(angle) * (loopRadius + 5)
    )
    scene.add(support)
  }

  // Neon rings on loop
  for (let i = 0; i < 8; i++) {
    const ringAngle = (i / 8) * Math.PI * 2
    const ringGeometry = new THREE.TorusGeometry(tubeRadius + 0.5, 0.3, 8, 32)
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0xff6600 : 0x00aaff,
      emissive: i % 2 === 0 ? 0xff6600 : 0x00aaff,
      emissiveIntensity: 1
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.position.set(
      x + Math.sin(rotationY) * Math.cos(ringAngle) * loopRadius,
      loopRadius + 2 + Math.sin(ringAngle) * loopRadius,
      z + Math.cos(rotationY) * Math.cos(ringAngle) * loopRadius
    )
    ring.rotation.y = rotationY
    ring.rotation.x = ringAngle
    scene.add(ring)
  }
}

function createJump(x, z, rotationY) {
  // Ramp up
  const rampLength = 30
  const rampHeight = 8
  
  const rampGeometry = new THREE.BoxGeometry(20, 1, rampLength)
  const rampMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6600,
    emissive: 0xff3300,
    emissiveIntensity: 0.3,
    metalness: 0.7
  })
  
  // Up ramp
  const upRamp = new THREE.Mesh(rampGeometry, rampMaterial)
  upRamp.position.set(x - 20, rampHeight / 2, z)
  upRamp.rotation.z = Math.atan2(rampHeight, rampLength)
  upRamp.rotation.y = rotationY
  scene.add(upRamp)

  // Down ramp
  const downRamp = new THREE.Mesh(rampGeometry, rampMaterial)
  downRamp.position.set(x + 20, rampHeight / 2, z)
  downRamp.rotation.z = -Math.atan2(rampHeight, rampLength)
  downRamp.rotation.y = rotationY
  scene.add(downRamp)

  // Gap platform (floating)
  const platformGeometry = new THREE.BoxGeometry(15, 1, 15)
  const platformMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 0.5
  })
  const platform = new THREE.Mesh(platformGeometry, platformMaterial)
  platform.position.set(x, rampHeight + 2, z)
  scene.add(platform)

  // Fire effects at jump
  for (let i = 0; i < 6; i++) {
    const flameGeometry = new THREE.ConeGeometry(1.5, 5, 8)
    const flameMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4400,
      emissive: 0xff2200,
      emissiveIntensity: 1,
      transparent: true,
      opacity: 0.8
    })
    const flame = new THREE.Mesh(flameGeometry, flameMaterial)
    flame.position.set(
      x - 25 + (i % 3) * 25,
      3,
      z + (i < 3 ? -12 : 12)
    )
    scene.add(flame)
  }

  // Neon arrow signs
  const arrowGeometry = new THREE.ConeGeometry(3, 6, 3)
  const arrowMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 1
  })
  
  for (let i = 0; i < 3; i++) {
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial)
    arrow.position.set(x - 30 + i * 30, rampHeight + 8, z)
    arrow.rotation.z = -Math.PI / 2
    scene.add(arrow)
  }
}

function createFinishLine() {
  // Finish gantry
  const gantryWidth = 30
  const gantryHeight = 15
  
  // Poles
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 })
  const poleGeometry = new THREE.CylinderGeometry(1, 1, gantryHeight, 8)
  
  const leftPole = new THREE.Mesh(poleGeometry, poleMaterial)
  leftPole.position.set(-gantryWidth / 2, gantryHeight / 2, 100)
  scene.add(leftPole)
  
  const rightPole = new THREE.Mesh(poleGeometry, poleMaterial)
  rightPole.position.set(gantryWidth / 2, gantryHeight / 2, 100)
  scene.add(rightPole)

  // Top bar with checkered pattern
  const topBarGeometry = new THREE.BoxGeometry(gantryWidth, 3, 2)
  const topBarMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const topBar = new THREE.Mesh(topBarGeometry, topBarMaterial)
  topBar.position.set(0, gantryHeight, 100)
  scene.add(topBar)

  // Checkered pattern
  const checkerSize = 1.5
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 2; j++) {
      if ((i + j) % 2 === 0) {
        const checker = new THREE.Mesh(
          new THREE.BoxGeometry(checkerSize, checkerSize, 0.1),
          new THREE.MeshStandardMaterial({ color: 0x000000 })
        )
        checker.position.set(-gantryWidth / 2 + i * checkerSize + checkerSize / 2, gantryHeight - 1.5 + j * checkerSize + checkerSize / 2, 101)
        scene.add(checker)
      }
    }
  }

  // Ground finish line
  const finishLineGeometry = new THREE.PlaneGeometry(30, 8)
  const finishLineMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.3
  })
  const finishLine = new THREE.Mesh(finishLineGeometry, finishLineMaterial)
  finishLine.rotation.x = -Math.PI / 2
  finishLine.position.set(0, 0.05, 100)
  scene.add(finishLine)

  // Checkered ground pattern
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 4; j++) {
      if ((i + j) % 2 === 0) {
        const checker = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.MeshStandardMaterial({ color: 0x000000 })
        )
        checker.rotation.x = -Math.PI / 2
        checker.position.set(-14 + i * 2, 0.06, 96 + j * 2)
        scene.add(checker)
      }
    }
  }

  // Starting grid positions
  for (let i = 0; i < 8; i++) {
    const row = Math.floor(i / 2)
    const col = i % 2
    const gridMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.3
    })
    const gridLine = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 0.5),
      gridMaterial
    )
    gridLine.rotation.x = -Math.PI / 2
    gridLine.position.set(-5 + col * 10, 0.03, 90 - row * 6)
    scene.add(gridLine)
  }
}

function createPlayerCar() {
  playerCar = new THREE.Group()

  // Main body - red race car
  const bodyGeometry = new THREE.BoxGeometry(2, 0.6, 4)
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    roughness: 0.2,
    metalness: 0.8
  })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.y = 0.5
  body.castShadow = true
  playerCar.add(body)

  // Cabin
  const cabinGeometry = new THREE.BoxGeometry(1.6, 0.5, 2)
  const cabinMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.1
  })
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
  cabin.position.set(0, 0.95, -0.3)
  playerCar.add(cabin)

  // Spoiler
  const spoilerGeometry = new THREE.BoxGeometry(2.2, 0.1, 0.4)
  const spoiler = new THREE.Mesh(spoilerGeometry, bodyMaterial)
  spoiler.position.set(0, 1.1, -1.8)
  playerCar.add(spoiler)

  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16)
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 })
  
  const wheelPositions = [
    { x: -1.1, z: 1.3 },
    { x: 1.1, z: 1.3 },
    { x: -1.1, z: -1.3 },
    { x: 1.1, z: -1.3 }
  ]

  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel.rotation.z = Math.PI / 2
    wheel.position.set(pos.x, 0.4, pos.z)
    playerCar.add(wheel)
  })

  // Number "1" on top
  const numberGeometry = new THREE.PlaneGeometry(1, 1)
  const numberMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.3
  })
  const number = new THREE.Mesh(numberGeometry, numberMaterial)
  number.rotation.x = -Math.PI / 2
  number.position.set(0, 0.81, 0)
  playerCar.add(number)

  // Headlights
  const headlightGeometry = new THREE.CircleGeometry(0.2, 16)
  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffcc,
    emissive: 0xffffcc,
    emissiveIntensity: 1
  })
  const headlightL = new THREE.Mesh(headlightGeometry, headlightMaterial)
  headlightL.position.set(-0.6, 0.5, 2.01)
  playerCar.add(headlightL)
  const headlightR = new THREE.Mesh(headlightGeometry, headlightMaterial)
  headlightR.position.set(0.6, 0.5, 2.01)
  playerCar.add(headlightR)

  scene.add(playerCar)
  reset()
}

function createAICars() {
  // Create 7 AI opponents
  for (let i = 0; i < 7; i++) {
    const aiCar = new AICar(AI_COLORS[i], i + 1, trackWaypoints)
    const mesh = aiCar.createMesh()
    scene.add(mesh)
    aiCars.push(aiCar)
  }
}

function createEnvironment() {
  // Stadium structures
  const standMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333344,
    metalness: 0.3
  })

  // Grandstands around track
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const radius = 180
    
    const standGeometry = new THREE.BoxGeometry(50, 20, 15)
    const stand = new THREE.Mesh(standGeometry, standMaterial)
    stand.position.set(
      Math.cos(angle) * radius,
      10,
      Math.sin(angle) * radius
    )
    stand.rotation.y = -angle
    scene.add(stand)

    // Neon trim
    const trimColors = [0xff6600, 0x00aaff, 0xff00ff, 0x00ff00]
    const trimGeometry = new THREE.BoxGeometry(52, 1, 1)
    const trimMaterial = new THREE.MeshStandardMaterial({
      color: trimColors[i % 4],
      emissive: trimColors[i % 4],
      emissiveIntensity: 1
    })
    const trim = new THREE.Mesh(trimGeometry, trimMaterial)
    trim.position.set(
      Math.cos(angle) * radius,
      21,
      Math.sin(angle) * radius
    )
    trim.rotation.y = -angle
    scene.add(trim)
  }

  // Giant floating rings
  for (let i = 0; i < 4; i++) {
    const ringRadius = 200 + i * 30
    const ringGeometry = new THREE.TorusGeometry(ringRadius, 1, 8, 128)
    const colors = [0xff6600, 0x00aaff, 0xff00ff, 0x00ff00]
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: colors[i],
      emissive: colors[i],
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.5
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    ring.position.y = 50 + i * 15
    scene.add(ring)
  }

  // Spotlights towers
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2
    const radius = 160
    
    const towerGeometry = new THREE.CylinderGeometry(2, 3, 40, 8)
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 })
    const tower = new THREE.Mesh(towerGeometry, towerMaterial)
    tower.position.set(
      Math.cos(angle) * radius,
      20,
      Math.sin(angle) * radius
    )
    scene.add(tower)

    // Light on top
    const lightGeometry = new THREE.SphereGeometry(3, 16, 16)
    const colors = [0xff6600, 0x00aaff, 0xff00ff, 0x00ff00]
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: colors[i % 4],
      emissive: colors[i % 4],
      emissiveIntensity: 1
    })
    const light = new THREE.Mesh(lightGeometry, lightMaterial)
    light.position.set(
      Math.cos(angle) * radius,
      42,
      Math.sin(angle) * radius
    )
    scene.add(light)
  }

  // Stars
  const starGeometry = new THREE.BufferGeometry()
  const starCount = 2000
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)
  
  for (let i = 0; i < starCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 800
    positions[i + 1] = Math.random() * 200 + 50
    positions[i + 2] = (Math.random() - 0.5) * 800
    
    const c = Math.random()
    if (c < 0.33) {
      colors[i] = 1; colors[i + 1] = 0.4; colors[i + 2] = 0
    } else if (c < 0.66) {
      colors[i] = 0; colors[i + 1] = 0.7; colors[i + 2] = 1
    } else {
      colors[i] = 1; colors[i + 1] = 1; colors[i + 2] = 1
    }
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const starMaterial = new THREE.PointsMaterial({
    size: 1.5,
    transparent: true,
    opacity: 0.9,
    vertexColors: true
  })
  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)
}

function updateCamera() {
  const cameraDistance = 15
  const cameraHeight = 8
  
  const targetX = position.value.x - Math.sin(rotation.value) * cameraDistance
  const targetZ = position.value.z - Math.cos(rotation.value) * cameraDistance
  
  camera.position.lerp(
    new THREE.Vector3(targetX, cameraHeight, targetZ),
    0.08
  )
  camera.lookAt(position.value.x, 2, position.value.z)
}

function checkLapCompletion() {
  // Check if passed through start/finish (z around 100, x around 0)
  if (position.value.z > 95 && position.value.z < 105 && 
      Math.abs(position.value.x) < 15) {
    // Going forward through finish
    if (waypointsPassed > 10) {
      emit('lap-complete')
      waypointsPassed = 0
    }
  }
  
  // Track progress through waypoints
  let closestDist = Infinity
  let closestIdx = 0
  for (let i = 0; i < trackWaypoints.length; i++) {
    const wp = trackWaypoints[i]
    const dist = Math.sqrt(
      Math.pow(position.value.x - wp.x, 2) + 
      Math.pow(position.value.z - wp.z, 2)
    )
    if (dist < closestDist) {
      closestDist = dist
      closestIdx = i
    }
  }
  
  if (closestIdx !== lastWaypointIdx) {
    waypointsPassed++
    lastWaypointIdx = closestIdx
  }
}

function getPlayerPosition() {
  // Calculate position among all racers
  const playerProgress = waypointsPassed
  let pos = 1
  
  for (const ai of aiCars) {
    const aiProgress = ai.lapCount * trackWaypoints.length + ai.currentWaypoint
    if (aiProgress > playerProgress) {
      pos++
    }
  }
  
  return pos
}

function animate() {
  animationId = requestAnimationFrame(animate)
  
  const delta = Math.min(clock.getDelta(), 0.1)
  
  if (props.gameState === 'playing') {
    // Update player
    updatePhysics(delta)
    playerCar.position.copy(position.value)
    playerCar.rotation.y = rotation.value
    
    // Update AI cars
    for (const ai of aiCars) {
      ai.update(delta)
    }
    
    checkLapCompletion()
    emit('update-time', delta)
    emit('position-update', getPlayerPosition())
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
  reset()
  waypointsPassed = 0
  lastWaypointIdx = 0
  
  if (playerCar) {
    playerCar.position.copy(position.value)
    playerCar.rotation.y = rotation.value
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
