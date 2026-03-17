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
let frameCount = 0

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

  // Floor with wood texture appearance
  const floorGeometry = new THREE.PlaneGeometry(width, depth, 20, 20)
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B6914,
    roughness: 0.8,
    metalness: 0.0
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0, depth / 2)
  floor.receiveShadow = true
  group.add(floor)
  
  // Floor trim/baseboard
  const baseboardMat = new THREE.MeshStandardMaterial({ 
    color: 0x5c4033, 
    roughness: 0.6 
  })
  const baseboardHeight = 0.12
  
  // Left baseboard
  const leftBaseboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, baseboardHeight, depth),
    baseboardMat
  )
  leftBaseboard.position.set(-width / 2 + 0.04, baseboardHeight / 2, depth / 2)
  group.add(leftBaseboard)
  
  // Right baseboard
  const rightBaseboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, baseboardHeight, depth),
    baseboardMat
  )
  rightBaseboard.position.set(width / 2 - 0.04, baseboardHeight / 2, depth / 2)
  group.add(rightBaseboard)

  // Ceiling with tiles pattern
  const ceilingGeometry = new THREE.PlaneGeometry(width, depth)
  const ceilingMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xF8F8F0,
    roughness: 0.9,
    metalness: 0.0
  })
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.set(0, height, depth / 2)
  group.add(ceiling)

  // Walls with realistic material
  const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xE8DCC8,
    roughness: 0.85,
    metalness: 0.0
  })
  
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
  
  // Door frame around exit
  const frameMat = new THREE.MeshStandardMaterial({ 
    color: 0x4a3728, 
    roughness: 0.5 
  })
  const frameWidth = 0.1
  
  // Left door frame
  const leftFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameWidth, height, frameWidth),
    frameMat
  )
  leftFrame.position.set(-1.5, height / 2, depth - frameWidth / 2)
  group.add(leftFrame)
  
  // Right door frame
  const rightFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameWidth, height, frameWidth),
    frameMat
  )
  rightFrame.position.set(1.5, height / 2, depth - frameWidth / 2)
  group.add(rightFrame)
  
  // Top door frame
  const topFrame = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, frameWidth, frameWidth),
    frameMat
  )
  topFrame.position.set(0, height - frameWidth / 2, depth - frameWidth / 2)
  group.add(topFrame)

  return group
}

// 3D obstacle creation functions for realistic appearance
function createDesk(size, color) {
  const group = new THREE.Group()
  
  // Wooden desktop with grain-like appearance
  const topGeo = new THREE.BoxGeometry(size.x, size.y * 0.08, size.z)
  const topMat = new THREE.MeshStandardMaterial({ 
    color: 0x8B5A2B,
    roughness: 0.7, 
    metalness: 0.0 
  })
  const top = new THREE.Mesh(topGeo, topMat)
  top.position.y = size.y - size.y * 0.04
  top.castShadow = true
  group.add(top)
  
  // Desktop edge trim
  const edgeMat = new THREE.MeshStandardMaterial({ 
    color: 0x654321,
    roughness: 0.6 
  })
  const edgeGeo = new THREE.BoxGeometry(size.x + 0.02, size.y * 0.03, size.z + 0.02)
  const edge = new THREE.Mesh(edgeGeo, edgeMat)
  edge.position.y = size.y - size.y * 0.085
  group.add(edge)
  
  // Metal legs with realistic proportions
  const legHeight = size.y * 0.92
  const legGeo = new THREE.CylinderGeometry(0.025, 0.025, legHeight, 12)
  const legMat = new THREE.MeshStandardMaterial({ 
    color: 0x2a2a2a, 
    roughness: 0.3, 
    metalness: 0.8 
  })
  
  const legPositions = [
    [-size.x * 0.42, legHeight / 2, -size.z * 0.38],
    [size.x * 0.42, legHeight / 2, -size.z * 0.38],
    [-size.x * 0.42, legHeight / 2, size.z * 0.38],
    [size.x * 0.42, legHeight / 2, size.z * 0.38]
  ]
  
  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo, legMat)
    leg.position.set(...pos)
    leg.castShadow = true
    group.add(leg)
    
    // Leg foot cap
    const footGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.02, 12)
    const foot = new THREE.Mesh(footGeo, legMat)
    foot.position.set(pos[0], 0.01, pos[2])
    group.add(foot)
  })
  
  // Cross support beam
  const beamGeo = new THREE.BoxGeometry(size.x * 0.7, 0.04, 0.04)
  const beam = new THREE.Mesh(beamGeo, legMat)
  beam.position.set(0, size.y * 0.3, 0)
  group.add(beam)
  
  // Under-desk storage basket/tray
  const trayGeo = new THREE.BoxGeometry(size.x * 0.6, 0.02, size.z * 0.4)
  const trayMat = new THREE.MeshStandardMaterial({ 
    color: 0x4a4a4a, 
    roughness: 0.5,
    metalness: 0.3
  })
  const tray = new THREE.Mesh(trayGeo, trayMat)
  tray.position.set(0, size.y * 0.5, 0)
  group.add(tray)
  
  return group
}

function createLocker(size, color) {
  const group = new THREE.Group()
  
  // Main locker body - slightly inset panels
  const bodyGeo = new THREE.BoxGeometry(size.x, size.y, size.z)
  const bodyMat = new THREE.MeshStandardMaterial({ 
    color, 
    roughness: 0.4, 
    metalness: 0.7 
  })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.position.y = size.y / 2
  body.castShadow = true
  group.add(body)
  
  // Door panel (slightly raised)
  const doorGeo = new THREE.BoxGeometry(size.x * 0.88, size.y * 0.94, 0.03)
  const doorMat = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(color).multiplyScalar(1.1), 
    roughness: 0.35, 
    metalness: 0.75 
  })
  const door = new THREE.Mesh(doorGeo, doorMat)
  door.position.set(0, size.y / 2, size.z * 0.5 + 0.015)
  group.add(door)
  
  // Vent slots at top (realistic horizontal slits)
  const slotMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a, 
    roughness: 0.9 
  })
  for (let i = 0; i < 4; i++) {
    const slotGeo = new THREE.BoxGeometry(size.x * 0.5, 0.008, 0.04)
    const slot = new THREE.Mesh(slotGeo, slotMat)
    slot.position.set(0, size.y * 0.88 - i * 0.025, size.z * 0.52)
    group.add(slot)
  }
  
  // Handle - vertical bar style
  const handleMat = new THREE.MeshStandardMaterial({ 
    color: 0xd0d0d0, 
    roughness: 0.15, 
    metalness: 0.95 
  })
  const handleGeo = new THREE.BoxGeometry(0.015, size.y * 0.12, 0.025)
  const handle = new THREE.Mesh(handleGeo, handleMat)
  handle.position.set(size.x * 0.38, size.y * 0.5, size.z * 0.53)
  group.add(handle)
  
  // Number plate
  const plateGeo = new THREE.BoxGeometry(size.x * 0.25, size.y * 0.08, 0.01)
  const plateMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, 
    roughness: 0.3 
  })
  const plate = new THREE.Mesh(plateGeo, plateMat)
  plate.position.set(0, size.y * 0.75, size.z * 0.52)
  group.add(plate)
  
  return group
}

function createStudent(size, color) {
  const group = new THREE.Group()
  
  // Body (cylinder with slight taper)
  const bodyGeo = new THREE.CylinderGeometry(size.x * 0.4, size.x * 0.5, size.y * 0.5, 12)
  const bodyMat = new THREE.MeshStandardMaterial({ 
    color: 0x3366cc, // shirt color
    roughness: 0.8 
  })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.position.y = size.y * 0.35
  group.add(body)
  
  // Head (sphere)
  const headGeo = new THREE.SphereGeometry(size.x * 0.4, 16, 12)
  const headMat = new THREE.MeshStandardMaterial({ 
    color, // skin color
    roughness: 0.6 
  })
  const head = new THREE.Mesh(headGeo, headMat)
  head.position.y = size.y * 0.75
  group.add(head)
  
  // Hair
  const hairGeo = new THREE.SphereGeometry(size.x * 0.42, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5)
  const hairMat = new THREE.MeshStandardMaterial({ 
    color: 0x2a1a0a, 
    roughness: 0.9 
  })
  const hair = new THREE.Mesh(hairGeo, hairMat)
  hair.position.y = size.y * 0.8
  group.add(hair)
  
  // Legs (simple cylinders)
  const legGeo = new THREE.CylinderGeometry(size.x * 0.15, size.x * 0.12, size.y * 0.35, 8)
  const legMat = new THREE.MeshStandardMaterial({ 
    color: 0x2244aa, // pants
    roughness: 0.8 
  })
  const leftLeg = new THREE.Mesh(legGeo, legMat)
  leftLeg.position.set(-size.x * 0.15, size.y * 0.1, 0)
  group.add(leftLeg)
  
  const rightLeg = new THREE.Mesh(legGeo, legMat)
  rightLeg.position.set(size.x * 0.15, size.y * 0.1, 0)
  group.add(rightLeg)
  
  return group
}

function createLight(size, color) {
  const group = new THREE.Group()
  
  // Fluorescent light housing - realistic rectangular fixture
  const housingGeo = new THREE.BoxGeometry(size.x, size.y * 0.25, size.z)
  const housingMat = new THREE.MeshStandardMaterial({ 
    color: 0xe8e8e8, 
    roughness: 0.4, 
    metalness: 0.3 
  })
  const housing = new THREE.Mesh(housingGeo, housingMat)
  housing.position.y = size.y * 0.875
  housing.castShadow = true
  group.add(housing)
  
  // Light diffuser panel (frosted plastic look)
  const diffuserGeo = new THREE.BoxGeometry(size.x * 0.92, size.y * 0.05, size.z * 0.88)
  const diffuserMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.0,
    emissive: 0xffffee,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.9
  })
  const diffuser = new THREE.Mesh(diffuserGeo, diffuserMat)
  diffuser.position.y = size.y * 0.72
  group.add(diffuser)
  
  // Metal frame edges
  const frameMat = new THREE.MeshStandardMaterial({ 
    color: 0xcccccc, 
    roughness: 0.3, 
    metalness: 0.7 
  })
  
  // Side frames
  const sideFrameGeo = new THREE.BoxGeometry(0.02, size.y * 0.35, size.z)
  const leftFrame = new THREE.Mesh(sideFrameGeo, frameMat)
  leftFrame.position.set(-size.x * 0.48, size.y * 0.825, 0)
  group.add(leftFrame)
  
  const rightFrame = new THREE.Mesh(sideFrameGeo, frameMat)
  rightFrame.position.set(size.x * 0.48, size.y * 0.825, 0)
  group.add(rightFrame)
  
  return group
}

function createTable(size, color) {
  const group = new THREE.Group()
  
  // Realistic cafeteria/folding table
  // Tabletop with rounded edges effect
  const topGeo = new THREE.BoxGeometry(size.x, size.y * 0.06, size.z)
  const topMat = new THREE.MeshStandardMaterial({ 
    color: 0xd4c4a8, // light wood/laminate
    roughness: 0.4, 
    metalness: 0.05 
  })
  const top = new THREE.Mesh(topGeo, topMat)
  top.position.y = size.y - size.y * 0.03
  top.castShadow = true
  group.add(top)
  
  // Edge banding
  const edgeMat = new THREE.MeshStandardMaterial({ 
    color: 0x8b7355, 
    roughness: 0.5 
  })
  const edgeGeo = new THREE.BoxGeometry(size.x + 0.02, size.y * 0.02, size.z + 0.02)
  const edge = new THREE.Mesh(edgeGeo, edgeMat)
  edge.position.y = size.y - size.y * 0.07
  group.add(edge)
  
  // Folding metal legs (A-frame style)
  const legMat = new THREE.MeshStandardMaterial({ 
    color: 0x404040, 
    roughness: 0.35, 
    metalness: 0.75 
  })
  
  // Create A-frame legs
  const legGeo = new THREE.CylinderGeometry(0.02, 0.02, size.y * 0.92, 8)
  
  // Front left pair
  const fl1 = new THREE.Mesh(legGeo, legMat)
  fl1.position.set(-size.x * 0.35, size.y * 0.46, size.z * 0.3)
  fl1.rotation.z = 0.1
  group.add(fl1)
  
  const fl2 = new THREE.Mesh(legGeo, legMat)
  fl2.position.set(-size.x * 0.35, size.y * 0.46, size.z * 0.3)
  fl2.rotation.z = -0.1
  group.add(fl2)
  
  // Front right pair
  const fr1 = new THREE.Mesh(legGeo, legMat)
  fr1.position.set(size.x * 0.35, size.y * 0.46, size.z * 0.3)
  fr1.rotation.z = 0.1
  group.add(fr1)
  
  const fr2 = new THREE.Mesh(legGeo, legMat)
  fr2.position.set(size.x * 0.35, size.y * 0.46, size.z * 0.3)
  fr2.rotation.z = -0.1
  group.add(fr2)
  
  // Back left pair
  const bl1 = new THREE.Mesh(legGeo, legMat)
  bl1.position.set(-size.x * 0.35, size.y * 0.46, -size.z * 0.3)
  bl1.rotation.z = 0.1
  group.add(bl1)
  
  const bl2 = new THREE.Mesh(legGeo, legMat)
  bl2.position.set(-size.x * 0.35, size.y * 0.46, -size.z * 0.3)
  bl2.rotation.z = -0.1
  group.add(bl2)
  
  // Back right pair
  const br1 = new THREE.Mesh(legGeo, legMat)
  br1.position.set(size.x * 0.35, size.y * 0.46, -size.z * 0.3)
  br1.rotation.z = 0.1
  group.add(br1)
  
  const br2 = new THREE.Mesh(legGeo, legMat)
  br2.position.set(size.x * 0.35, size.y * 0.46, -size.z * 0.3)
  br2.rotation.z = -0.1
  group.add(br2)
  
  // Cross braces
  const braceGeo = new THREE.CylinderGeometry(0.015, 0.015, size.x * 0.6, 6)
  const brace1 = new THREE.Mesh(braceGeo, legMat)
  brace1.rotation.z = Math.PI / 2
  brace1.position.set(0, size.y * 0.3, size.z * 0.3)
  group.add(brace1)
  
  const brace2 = new THREE.Mesh(braceGeo, legMat)
  brace2.rotation.z = Math.PI / 2
  brace2.position.set(0, size.y * 0.3, -size.z * 0.3)
  group.add(brace2)
  
  return group
}

function createBackpack(size, color) {
  const group = new THREE.Group()
  
  // Main body with rounded shape
  const mainGeo = new THREE.BoxGeometry(size.x * 0.85, size.y * 0.8, size.z * 0.7)
  const mainMat = new THREE.MeshStandardMaterial({ 
    color: 0x2d5a9e, // Blue backpack
    roughness: 0.75,
    metalness: 0.0
  })
  const main = new THREE.Mesh(mainGeo, mainMat)
  main.position.set(0, size.y * 0.42, 0)
  main.castShadow = true
  group.add(main)
  
  // Top flap/lid
  const flapGeo = new THREE.BoxGeometry(size.x * 0.8, size.y * 0.12, size.z * 0.6)
  const flapMat = new THREE.MeshStandardMaterial({ 
    color: 0x234a82, 
    roughness: 0.7 
  })
  const flap = new THREE.Mesh(flapGeo, flapMat)
  flap.position.set(0, size.y * 0.88, size.z * 0.08)
  group.add(flap)
  
  // Front pocket
  const pocketGeo = new THREE.BoxGeometry(size.x * 0.65, size.y * 0.35, size.z * 0.12)
  const pocketMat = new THREE.MeshStandardMaterial({ 
    color: 0x1e4070, 
    roughness: 0.8 
  })
  const pocket = new THREE.Mesh(pocketGeo, pocketMat)
  pocket.position.set(0, size.y * 0.28, size.z * 0.38)
  group.add(pocket)
  
  // Zippers
  const zipMat = new THREE.MeshStandardMaterial({ 
    color: 0xaaaaaa, 
    roughness: 0.2,
    metalness: 0.85 
  })
  
  // Main zipper
  const zip1Geo = new THREE.BoxGeometry(size.x * 0.6, 0.015, 0.02)
  const zip1 = new THREE.Mesh(zip1Geo, zipMat)
  zip1.position.set(0, size.y * 0.78, size.z * 0.36)
  group.add(zip1)
  
  // Pocket zipper
  const zip2Geo = new THREE.BoxGeometry(size.x * 0.45, 0.012, 0.02)
  const zip2 = new THREE.Mesh(zip2Geo, zipMat)
  zip2.position.set(0, size.y * 0.42, size.z * 0.44)
  group.add(zip2)
  
  // Shoulder straps (visible at top)
  const strapMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a3a60, 
    roughness: 0.8 
  })
  const strapGeo = new THREE.BoxGeometry(size.x * 0.15, size.y * 0.25, 0.03)
  
  const leftStrap = new THREE.Mesh(strapGeo, strapMat)
  leftStrap.position.set(-size.x * 0.25, size.y * 0.75, -size.z * 0.35)
  group.add(leftStrap)
  
  const rightStrap = new THREE.Mesh(strapGeo, strapMat)
  rightStrap.position.set(size.x * 0.25, size.y * 0.75, -size.z * 0.35)
  group.add(rightStrap)
  
  return group
}

function createGlobe(size, color) {
  const group = new THREE.Group()
  
  // Wooden base - octagonal for realism
  const baseGeo = new THREE.CylinderGeometry(size.x * 0.35, size.x * 0.42, size.y * 0.08, 8)
  const baseMat = new THREE.MeshStandardMaterial({ 
    color: 0x5c3317, 
    roughness: 0.6, 
    metalness: 0.1 
  })
  const base = new THREE.Mesh(baseGeo, baseMat)
  base.position.y = size.y * 0.04
  base.castShadow = true
  group.add(base)
  
  // Stand pole - turned wood style
  const poleGeo = new THREE.CylinderGeometry(0.025, 0.035, size.y * 0.4, 12)
  const poleMat = new THREE.MeshStandardMaterial({ 
    color: 0x6b4423, 
    roughness: 0.5, 
    metalness: 0.1 
  })
  const pole = new THREE.Mesh(poleGeo, poleMat)
  pole.position.y = size.y * 0.28
  group.add(pole)
  
  // Decorative rings on pole
  const ringMat = new THREE.MeshStandardMaterial({ 
    color: 0x7a5230, 
    roughness: 0.4 
  })
  for (let i = 0; i < 2; i++) {
    const ringGeo = new THREE.TorusGeometry(0.04, 0.008, 8, 16)
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.y = size.y * 0.15 + i * size.y * 0.2
    group.add(ring)
  }
  
  // Globe sphere with ocean/land colors
  const globeGeo = new THREE.SphereGeometry(size.x * 0.4, 32, 24)
  const globeMat = new THREE.MeshStandardMaterial({ 
    color: 0x1e90ff, // Ocean blue
    roughness: 0.3, 
    metalness: 0.1 
  })
  const globe = new THREE.Mesh(globeGeo, globeMat)
  globe.position.y = size.y * 0.65
  globe.castShadow = true
  group.add(globe)
  
  // Meridian ring (brass)
  const meridianGeo = new THREE.TorusGeometry(size.x * 0.43, 0.012, 8, 48)
  const meridianMat = new THREE.MeshStandardMaterial({ 
    color: 0xb8860b, 
    roughness: 0.25, 
    metalness: 0.85 
  })
  const meridian = new THREE.Mesh(meridianGeo, meridianMat)
  meridian.position.y = size.y * 0.65
  group.add(meridian)
  
  // Axis rod
  const axisGeo = new THREE.CylinderGeometry(0.008, 0.008, size.x * 0.9, 8)
  const axisMat = new THREE.MeshStandardMaterial({ 
    color: 0xc0a040, 
    roughness: 0.2, 
    metalness: 0.9 
  })
  const axis = new THREE.Mesh(axisGeo, axisMat)
  axis.rotation.z = Math.PI * 0.12 // Tilted like Earth
  axis.position.y = size.y * 0.65
  group.add(axis)
  
  return group
}

function createFountain(size, color) {
  const group = new THREE.Group()
  
  // Wall-mounted drinking fountain
  // Back plate
  const plateMat = new THREE.MeshStandardMaterial({ 
    color: 0x7a8a9a, 
    roughness: 0.3, 
    metalness: 0.7 
  })
  const plateGeo = new THREE.BoxGeometry(size.x * 0.9, size.y * 0.7, size.z * 0.15)
  const plate = new THREE.Mesh(plateGeo, plateMat)
  plate.position.set(0, size.y * 0.45, -size.z * 0.4)
  plate.castShadow = true
  group.add(plate)
  
  // Basin (curved bowl shape)
  const basinMat = new THREE.MeshStandardMaterial({ 
    color: 0x8899aa, 
    roughness: 0.25, 
    metalness: 0.75 
  })
  const basinGeo = new THREE.CylinderGeometry(size.x * 0.35, size.x * 0.28, size.y * 0.2, 16, 1, true)
  const basin = new THREE.Mesh(basinGeo, basinMat)
  basin.position.set(0, size.y * 0.35, 0)
  group.add(basin)
  
  // Basin bottom
  const bottomGeo = new THREE.CylinderGeometry(size.x * 0.28, size.x * 0.28, 0.02, 16)
  const bottom = new THREE.Mesh(bottomGeo, basinMat)
  bottom.position.set(0, size.y * 0.25, 0)
  group.add(bottom)
  
  // Drain
  const drainGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 12)
  const drainMat = new THREE.MeshStandardMaterial({ 
    color: 0x333333, 
    roughness: 0.5 
  })
  const drain = new THREE.Mesh(drainGeo, drainMat)
  drain.position.set(0, size.y * 0.26, 0)
  group.add(drain)
  
  // Spout
  const spoutMat = new THREE.MeshStandardMaterial({ 
    color: 0xc0c0c0, 
    roughness: 0.15, 
    metalness: 0.9 
  })
  const spoutGeo = new THREE.CylinderGeometry(0.02, 0.025, size.x * 0.2, 8)
  const spout = new THREE.Mesh(spoutGeo, spoutMat)
  spout.rotation.z = Math.PI / 2.5
  spout.position.set(0, size.y * 0.55, -size.z * 0.15)
  group.add(spout)
  
  // Push button
  const buttonGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.03, 12)
  const buttonMat = new THREE.MeshStandardMaterial({ 
    color: 0x404040, 
    roughness: 0.4, 
    metalness: 0.6 
  })
  const button = new THREE.Mesh(buttonGeo, buttonMat)
  button.rotation.x = Math.PI / 2
  button.position.set(size.x * 0.25, size.y * 0.5, -size.z * 0.25)
  group.add(button)
  
  return group
}

function createTrophy(size, color) {
  const group = new THREE.Group()
  
  // Multi-tiered base
  const baseMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a0f05, 
    roughness: 0.4, 
    metalness: 0.2 
  })
  
  // Bottom tier
  const base1Geo = new THREE.BoxGeometry(size.x * 0.7, size.y * 0.08, size.z * 0.7)
  const base1 = new THREE.Mesh(base1Geo, baseMat)
  base1.position.y = size.y * 0.04
  base1.castShadow = true
  group.add(base1)
  
  // Middle tier
  const base2Geo = new THREE.BoxGeometry(size.x * 0.55, size.y * 0.06, size.z * 0.55)
  const base2 = new THREE.Mesh(base2Geo, baseMat)
  base2.position.y = size.y * 0.11
  group.add(base2)
  
  // Name plate
  const plateMat = new THREE.MeshStandardMaterial({ 
    color: 0xd4af37, 
    roughness: 0.2, 
    metalness: 0.85 
  })
  const plateGeo = new THREE.BoxGeometry(size.x * 0.4, size.y * 0.04, 0.01)
  const plate = new THREE.Mesh(plateGeo, plateMat)
  plate.position.set(0, size.y * 0.1, size.z * 0.28)
  group.add(plate)
  
  // Gold trophy parts
  const goldMat = new THREE.MeshStandardMaterial({ 
    color: 0xffd700, 
    roughness: 0.1, 
    metalness: 0.95 
  })
  
  // Stem with decorative elements
  const stemGeo = new THREE.CylinderGeometry(size.x * 0.06, size.x * 0.1, size.y * 0.25, 12)
  const stem = new THREE.Mesh(stemGeo, goldMat)
  stem.position.y = size.y * 0.27
  group.add(stem)
  
  // Decorative ring
  const ringGeo = new THREE.TorusGeometry(size.x * 0.12, 0.015, 8, 24)
  const ring = new THREE.Mesh(ringGeo, goldMat)
  ring.rotation.x = Math.PI / 2
  ring.position.y = size.y * 0.35
  group.add(ring)
  
  // Cup body
  const cupGeo = new THREE.CylinderGeometry(size.x * 0.3, size.x * 0.12, size.y * 0.35, 16)
  const cup = new THREE.Mesh(cupGeo, goldMat)
  cup.position.y = size.y * 0.6
  cup.castShadow = true
  group.add(cup)
  
  // Cup rim
  const rimGeo = new THREE.TorusGeometry(size.x * 0.3, 0.02, 8, 24)
  const rim = new THREE.Mesh(rimGeo, goldMat)
  rim.rotation.x = Math.PI / 2
  rim.position.y = size.y * 0.775
  group.add(rim)
  
  // Handles (curved)
  const handleGeo = new THREE.TorusGeometry(size.x * 0.12, 0.018, 8, 16, Math.PI)
  
  const leftHandle = new THREE.Mesh(handleGeo, goldMat)
  leftHandle.rotation.y = Math.PI / 2
  leftHandle.rotation.z = Math.PI / 2
  leftHandle.position.set(-size.x * 0.32, size.y * 0.55, 0)
  group.add(leftHandle)
  
  const rightHandle = new THREE.Mesh(handleGeo, goldMat)
  rightHandle.rotation.y = -Math.PI / 2
  rightHandle.rotation.z = Math.PI / 2
  rightHandle.position.set(size.x * 0.32, size.y * 0.55, 0)
  group.add(rightHandle)
  
  return group
}

function createGenericObstacle(size, color) {
  // More realistic fallback with beveled edges
  const group = new THREE.Group()
  
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z)
  const material = new THREE.MeshStandardMaterial({ 
    color, 
    roughness: 0.6, 
    metalness: 0.1 
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = size.y / 2
  mesh.castShadow = true
  group.add(mesh)
  
  // Subtle edge darkening for depth
  const edgeMat = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(color).multiplyScalar(0.7), 
    roughness: 0.7 
  })
  
  // Top edge trim
  const topEdgeGeo = new THREE.BoxGeometry(size.x + 0.01, 0.015, size.z + 0.01)
  const topEdge = new THREE.Mesh(topEdgeGeo, edgeMat)
  topEdge.position.y = size.y + 0.0075
  group.add(topEdge)
  
  // Bottom edge trim
  const bottomEdgeGeo = new THREE.BoxGeometry(size.x + 0.01, 0.015, size.z + 0.01)
  const bottomEdge = new THREE.Mesh(bottomEdgeGeo, edgeMat)
  bottomEdge.position.y = 0.0075
  group.add(bottomEdge)
  
  return group
}

function createObstacles(levelData) {
  const group = new THREE.Group()
  const collisionBoxes = []

  levelData.obstacles.forEach(obs => {
    const color = obstacleColors[obs.type] || 0x888888
    let obstacleGroup
    
    // Create detailed 3D model based on type
    switch (obs.type) {
      case 'desk':
        obstacleGroup = createDesk(obs.size, color)
        break
      case 'locker':
        obstacleGroup = createLocker(obs.size, color)
        break
      case 'student':
        obstacleGroup = createStudent(obs.size, color)
        break
      case 'light':
        obstacleGroup = createLight(obs.size, color)
        break
      case 'table':
        obstacleGroup = createTable(obs.size, color)
        break
      case 'backpack':
        obstacleGroup = createBackpack(obs.size, color)
        break
      case 'globe':
        obstacleGroup = createGlobe(obs.size, color)
        break
      case 'fountain':
        obstacleGroup = createFountain(obs.size, color)
        break
      case 'trophy':
        obstacleGroup = createTrophy(obs.size, color)
        break
      default:
        obstacleGroup = createGenericObstacle(obs.size, color)
    }
    
    obstacleGroup.position.set(
      obs.position.x,
      obs.position.y,
      obs.position.z
    )
    group.add(obstacleGroup)

    // Add collision box (unchanged from before)
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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
  directionalLight.position.set(5, 10, 5)
  directionalLight.castShadow = true
  scene.add(directionalLight)
  
  // Add fill light from below/behind for better 3D appearance
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
  fillLight.position.set(-3, 2, -5)
  scene.add(fillLight)

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
  
  // Skip collision checks for first few frames to let physics stabilize
  frameCount++
  
  const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1)
  lastTime = currentTime

  // Update physics
  physics.update(deltaTime)

  // Update airplane position and rotation
  airplane.position.set(physics.position.x, physics.position.y, physics.position.z)
  airplane.rotation.set(physics.rotation.pitch, physics.rotation.yaw, physics.rotation.roll, 'YXZ')

  // Check collisions (skip first 5 frames to let physics stabilize)
  if (frameCount > 5) {
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
  frameCount = 0
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
  frameCount = 0
  lastTime = performance.now()
  animationFrameId = requestAnimationFrame(gameLoop)
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
