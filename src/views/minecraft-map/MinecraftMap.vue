<template>
  <div class="minecraft-map">
    <div ref="container" class="canvas-container"></div>
    <div class="controls">
      <p>🖱️ Drag to rotate | Scroll to zoom</p>
      <button @click="regenerateMap">🔄 New Map</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)
let scene, camera, renderer, controls
let animationId = null

// Block colors (authentic Minecraft colors)
const BLOCKS = {
  grass: 0x7cbd6b,      // Minecraft grass top green
  dirt: 0x866043,       // Minecraft dirt brown
  stone: 0x7f7f7f,      // Minecraft stone gray
  water: 0x3f76e4,      // Minecraft water blue
  sand: 0xdbd3a0,       // Minecraft sand tan
  snow: 0xfafafa,       // Minecraft snow white
  wood: 0x6b5036,       // Minecraft oak log brown
  leaves: 0x59ae30,     // Minecraft oak leaves green
  darkGrass: 0x507a32,  // Minecraft jungle grass
  jungleLeaves: 0x30bb0b, // Minecraft jungle leaves
  cactus: 0x0d6b21,     // Minecraft cactus green
  ice: 0x91b9f7,        // Minecraft ice blue
  clay: 0x9ea4b0,       // Minecraft clay gray
  gravel: 0x837f7e,     // Minecraft gravel gray
  redSand: 0xbe6621,    // Minecraft red sand orange
  deadGrass: 0x9e814d   // Minecraft savanna grass
}

// Biome types
const BIOMES = {
  OCEAN: 'ocean',
  BEACH: 'beach',
  DESERT: 'desert',
  SAVANNA: 'savanna',
  PLAINS: 'plains',
  FOREST: 'forest',
  JUNGLE: 'jungle',
  TAIGA: 'taiga',
  SNOW: 'snow',
  MOUNTAINS: 'mountains',
  MESA: 'mesa'
}

// Seeded random for consistent noise
let seed = Math.random() * 10000

function seededRandom(x, z) {
  const n = Math.sin(x * 12.9898 + z * 78.233 + seed) * 43758.5453
  return n - Math.floor(n)
}

// Simple 2D noise function
function noise2D(x, z, scale = 1) {
  const sx = x * scale
  const sz = z * scale
  const ix = Math.floor(sx)
  const iz = Math.floor(sz)
  const fx = sx - ix
  const fz = sz - iz
  
  const a = seededRandom(ix, iz)
  const b = seededRandom(ix + 1, iz)
  const c = seededRandom(ix, iz + 1)
  const d = seededRandom(ix + 1, iz + 1)
  
  const ux = fx * fx * (3 - 2 * fx)
  const uz = fz * fz * (3 - 2 * fz)
  
  return a * (1 - ux) * (1 - uz) + b * ux * (1 - uz) + c * (1 - ux) * uz + d * ux * uz
}

// Multi-octave noise
function fractalNoise(x, z, octaves = 4, scale = 0.02) {
  let value = 0
  let amplitude = 1
  let frequency = scale
  let maxValue = 0
  
  for (let i = 0; i < octaves; i++) {
    value += noise2D(x, z, frequency) * amplitude
    maxValue += amplitude
    amplitude *= 0.5
    frequency *= 2
  }
  
  return value / maxValue
}

// Determine biome based on temperature and moisture
function getBiome(x, z) {
  const temperature = fractalNoise(x + 1000, z + 1000, 3, 0.008)
  const moisture = fractalNoise(x + 5000, z + 5000, 3, 0.01)
  const elevation = fractalNoise(x, z, 4, 0.015)
  
  // Ocean check
  if (elevation < 0.3) return BIOMES.OCEAN
  if (elevation < 0.35) return BIOMES.BEACH
  
  // Mountain check
  if (elevation > 0.75) return BIOMES.MOUNTAINS
  if (elevation > 0.65 && temperature < 0.4) return BIOMES.SNOW
  
  // Temperature-based biomes
  if (temperature > 0.7) {
    if (moisture < 0.3) return BIOMES.DESERT
    if (moisture < 0.5) return BIOMES.SAVANNA
    return BIOMES.JUNGLE
  }
  
  if (temperature > 0.4) {
    if (moisture < 0.4) return BIOMES.PLAINS
    return BIOMES.FOREST
  }
  
  if (temperature > 0.25) {
    return BIOMES.TAIGA
  }
  
  return BIOMES.SNOW
}

// Get height based on biome
function getHeight(x, z, biome) {
  const baseNoise = fractalNoise(x, z, 5, 0.02)
  const detailNoise = fractalNoise(x, z, 3, 0.08) * 0.3
  
  let height
  switch (biome) {
    case BIOMES.OCEAN:
      height = 2 + baseNoise * 3
      break
    case BIOMES.BEACH:
      height = 4 + baseNoise * 2
      break
    case BIOMES.DESERT:
      height = 6 + baseNoise * 8 + detailNoise * 4
      break
    case BIOMES.MESA:
      height = 8 + baseNoise * 15
      break
    case BIOMES.PLAINS:
      height = 6 + baseNoise * 4 + detailNoise * 2
      break
    case BIOMES.SAVANNA:
      height = 6 + baseNoise * 6 + detailNoise * 3
      break
    case BIOMES.FOREST:
      height = 7 + baseNoise * 8 + detailNoise * 4
      break
    case BIOMES.JUNGLE:
      height = 6 + baseNoise * 10 + detailNoise * 5
      break
    case BIOMES.TAIGA:
      height = 8 + baseNoise * 10 + detailNoise * 4
      break
    case BIOMES.SNOW:
      height = 10 + baseNoise * 12 + detailNoise * 5
      break
    case BIOMES.MOUNTAINS:
      height = 15 + baseNoise * 25 + detailNoise * 8
      break
    default:
      height = 6 + baseNoise * 6
  }
  
  return Math.floor(height)
}

function getBlockType(x, y, z, surfaceY, biome) {
  const isSurface = y === surfaceY
  const isNearSurface = y >= surfaceY - 2
  
  switch (biome) {
    case BIOMES.OCEAN:
      if (isSurface) return 'gravel'
      return 'stone'
    case BIOMES.BEACH:
      if (isNearSurface) return 'sand'
      return 'stone'
    case BIOMES.DESERT:
      if (y >= surfaceY - 4) return 'sand'
      return 'stone'
    case BIOMES.MESA:
      if (isSurface) return 'redSand'
      if (isNearSurface) return 'clay'
      return 'stone'
    case BIOMES.SAVANNA:
      if (isSurface) return 'deadGrass'
      if (isNearSurface) return 'dirt'
      return 'stone'
    case BIOMES.PLAINS:
    case BIOMES.FOREST:
      if (isSurface) return 'grass'
      if (isNearSurface) return 'dirt'
      return 'stone'
    case BIOMES.JUNGLE:
      if (isSurface) return 'darkGrass'
      if (isNearSurface) return 'dirt'
      return 'stone'
    case BIOMES.TAIGA:
      if (isSurface) return surfaceY > 18 ? 'snow' : 'grass'
      if (isNearSurface) return 'dirt'
      return 'stone'
    case BIOMES.SNOW:
      if (isSurface) return 'snow'
      if (isNearSurface) return 'dirt'
      return 'stone'
    case BIOMES.MOUNTAINS:
      if (surfaceY > 30) return 'snow'
      if (surfaceY > 25) return isSurface ? 'snow' : 'stone'
      if (isSurface) return 'stone'
      return 'stone'
    default:
      if (isSurface) return 'grass'
      if (isNearSurface) return 'dirt'
      return 'stone'
  }
}

function createMap() {
  const mapWidth = 512
  const mapDepth = 512
  const seaLevel = 5
  
  // Create instanced geometries for each block type
  const blockGeometry = new THREE.BoxGeometry(1, 1, 1)
  const materials = {}
  
  for (const [name, color] of Object.entries(BLOCKS)) {
    materials[name] = new THREE.MeshLambertMaterial({ color })
  }
  
  // Group blocks by type for efficiency
  const blocksByType = {}
  for (const type of Object.keys(BLOCKS)) {
    blocksByType[type] = []
  }
  
  // Pre-calculate biomes and heights
  const biomeMap = []
  const heightMap = []
  
  for (let x = 0; x < mapWidth; x++) {
    biomeMap[x] = []
    heightMap[x] = []
    for (let z = 0; z < mapDepth; z++) {
      const biome = getBiome(x, z)
      biomeMap[x][z] = biome
      heightMap[x][z] = getHeight(x, z, biome)
    }
  }
  
  // Generate terrain
  for (let x = 0; x < mapWidth; x++) {
    for (let z = 0; z < mapDepth; z++) {
      const biome = biomeMap[x][z]
      const surfaceY = heightMap[x][z]
      const centerX = x - mapWidth / 2
      const centerZ = z - mapDepth / 2
      
      // Only render surface and a few layers below (optimization)
      const minY = Math.max(0, surfaceY - 3)
      for (let y = minY; y <= surfaceY; y++) {
        const blockType = getBlockType(x, y, z, surfaceY, biome)
        blocksByType[blockType].push({ x: centerX, y, z: centerZ })
      }
      
      // Add water at sea level for ocean and low areas
      if (surfaceY < seaLevel) {
        for (let y = surfaceY + 1; y <= seaLevel; y++) {
          blocksByType.water.push({ x: centerX, y, z: centerZ })
        }
      }
      
      // Add vegetation based on biome
      const treeChance = seededRandom(x * 7, z * 13)
      
      if (biome === BIOMES.FOREST && treeChance < 0.08) {
        addTree(blocksByType, centerX, surfaceY, centerZ, 'leaves', 5 + Math.floor(treeChance * 30) % 3)
      } else if (biome === BIOMES.JUNGLE && treeChance < 0.12) {
        addTree(blocksByType, centerX, surfaceY, centerZ, 'jungleLeaves', 7 + Math.floor(treeChance * 40) % 4)
      } else if (biome === BIOMES.TAIGA && treeChance < 0.06) {
        addSpruceTree(blocksByType, centerX, surfaceY, centerZ, 6 + Math.floor(treeChance * 30) % 4)
      } else if (biome === BIOMES.PLAINS && treeChance < 0.01) {
        addTree(blocksByType, centerX, surfaceY, centerZ, 'leaves', 4)
      } else if (biome === BIOMES.SAVANNA && treeChance < 0.015) {
        addAcaciaTree(blocksByType, centerX, surfaceY, centerZ)
      } else if (biome === BIOMES.DESERT && treeChance < 0.02) {
        addCactus(blocksByType, centerX, surfaceY, centerZ)
      }
    }
  }
  
  // Create meshes
  for (const [type, positions] of Object.entries(blocksByType)) {
    if (positions.length === 0) continue
    
    const instancedMesh = new THREE.InstancedMesh(
      blockGeometry,
      materials[type],
      positions.length
    )
    
    const matrix = new THREE.Matrix4()
    positions.forEach((pos, i) => {
      matrix.setPosition(pos.x, pos.y, pos.z)
      instancedMesh.setMatrixAt(i, matrix)
    })
    
    if (type === 'water') {
      instancedMesh.material.transparent = true
      instancedMesh.material.opacity = 0.7
    }
    if (type === 'ice') {
      instancedMesh.material.transparent = true
      instancedMesh.material.opacity = 0.85
    }
    
    scene.add(instancedMesh)
  }
}

function addTree(blocks, x, surfaceY, z, leafType, height) {
  // Trunk
  for (let ty = 1; ty <= height; ty++) {
    blocks.wood.push({ x, y: surfaceY + ty, z })
  }
  // Leaves
  for (let lx = -2; lx <= 2; lx++) {
    for (let lz = -2; lz <= 2; lz++) {
      for (let ly = -1; ly <= 2; ly++) {
        if (Math.abs(lx) + Math.abs(lz) + Math.abs(ly) < 4) {
          blocks[leafType].push({
            x: x + lx,
            y: surfaceY + height + ly,
            z: z + lz
          })
        }
      }
    }
  }
}

function addSpruceTree(blocks, x, surfaceY, z, height) {
  // Trunk
  for (let ty = 1; ty <= height; ty++) {
    blocks.wood.push({ x, y: surfaceY + ty, z })
  }
  // Conical leaves
  for (let layer = 0; layer < height - 1; layer++) {
    const radius = Math.max(1, Math.floor((height - layer) / 2))
    const y = surfaceY + 2 + layer
    for (let lx = -radius; lx <= radius; lx++) {
      for (let lz = -radius; lz <= radius; lz++) {
        if (Math.abs(lx) + Math.abs(lz) <= radius) {
          blocks.leaves.push({ x: x + lx, y, z: z + lz })
        }
      }
    }
  }
  blocks.leaves.push({ x, y: surfaceY + height + 1, z })
}

function addAcaciaTree(blocks, x, surfaceY, z) {
  // Trunk with bend
  for (let ty = 1; ty <= 4; ty++) {
    blocks.wood.push({ x, y: surfaceY + ty, z })
  }
  blocks.wood.push({ x: x + 1, y: surfaceY + 5, z })
  blocks.wood.push({ x: x + 2, y: surfaceY + 6, z })
  
  // Flat canopy
  for (let lx = -2; lx <= 4; lx++) {
    for (let lz = -2; lz <= 2; lz++) {
      if (Math.random() > 0.2) {
        blocks.leaves.push({ x: x + lx, y: surfaceY + 7, z: z + lz })
      }
    }
  }
}

function addCactus(blocks, x, surfaceY, z) {
  const height = 2 + Math.floor(Math.random() * 3)
  for (let ty = 1; ty <= height; ty++) {
    blocks.cactus.push({ x, y: surfaceY + ty, z })
  }
}

function init() {
  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb) // Sky blue
  
  // Camera
  camera = new THREE.PerspectiveCamera(
    60,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    3000
  )
  camera.position.set(400, 300, 400)
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)
  
  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.target.set(0, 5, 0)
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(50, 100, 50)
  scene.add(directionalLight)
  
  // Create the map
  createMap()
  
  // Handle resize
  window.addEventListener('resize', onResize)
  
  // Animation loop
  animate()
}

function animate() {
  animationId = requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

function onResize() {
  if (!container.value) return
  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

function regenerateMap() {
  // New random seed
  seed = Math.random() * 10000
  
  // Clear existing meshes
  while (scene.children.length > 0) {
    const obj = scene.children[0]
    if (obj.geometry) obj.geometry.dispose()
    if (obj.material) obj.material.dispose()
    scene.remove(obj)
  }
  
  // Re-add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(50, 100, 50)
  scene.add(directionalLight)
  
  // Create new map
  createMap()
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', onResize)
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
.minecraft-map {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1a1a2e;
}

.canvas-container {
  flex: 1;
  width: 100%;
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  color: white;
  font-family: 'Courier New', monospace;
}

.controls p {
  margin: 0;
  font-size: 14px;
}

.controls button {
  padding: 8px 16px;
  font-size: 14px;
  background: #5d8c3d;
  color: white;
  border: 2px solid #3d5c2d;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: background 0.2s;
}

.controls button:hover {
  background: #4d7c2d;
}
</style>
