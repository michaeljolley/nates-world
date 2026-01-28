<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { maps, getPlacementGrid } from '../data/maps'
import { plants, plantOrder } from '../data/plants'
import { weeds, waves } from '../data/weeds'

const props = defineProps({
  mapId: { type: String, required: true },
  difficulty: { type: Object, default: () => ({ seedMult: 1, lifeMult: 1, enemyHealthMult: 1, enemySpeedMult: 1, rewardMult: 1 }) }
})

const emit = defineEmits(['exit', 'gameover', 'continue'])

// Game state
const canvas = ref(null)
const ctx = ref(null)
const gameLoop = ref(null)

const seeds = ref(100)
const lives = ref(10)
const currentWave = ref(0)
const waveInProgress = ref(false)
const isPaused = ref(false)
const endlessMode = ref(false)

const placedPlants = ref([])
const activeWeeds = ref([])
const projectiles = ref([])
const placementGrid = ref([])

const selectedPlant = ref(null)
const hoveredCell = ref(null)

// Get current map
const currentMap = computed(() => maps[props.mapId])

// Initialize game
onMounted(() => {
  const canvasEl = canvas.value
  ctx.value = canvasEl.getContext('2d')
  canvasEl.width = currentMap.value.width
  canvasEl.height = currentMap.value.height
  
  seeds.value = Math.floor(currentMap.value.startSeeds * props.difficulty.seedMult)
  lives.value = Math.floor(currentMap.value.lives * props.difficulty.lifeMult)
  placementGrid.value = getPlacementGrid(currentMap.value)
  
  startGameLoop()
})

onUnmounted(() => {
  if (gameLoop.value) {
    cancelAnimationFrame(gameLoop.value)
  }
})

// Game loop
let lastTime = 0
function startGameLoop() {
  function loop(timestamp) {
    const deltaTime = timestamp - lastTime
    lastTime = timestamp
    
    if (!isPaused.value) {
      update(deltaTime)
      render()
    }
    
    gameLoop.value = requestAnimationFrame(loop)
  }
  gameLoop.value = requestAnimationFrame(loop)
}

function update(dt) {
  // Update weeds
  for (let i = activeWeeds.value.length - 1; i >= 0; i--) {
    const weed = activeWeeds.value[i]
    updateWeed(weed, dt)
    
    // Check if weed reached end
    if (weed.pathIndex >= currentMap.value.path.length - 1) {
      lives.value--
      activeWeeds.value.splice(i, 1)
      
      if (lives.value <= 0) {
        emit('gameover', false)
      }
      continue
    }
    
    // Check if weed is dead
    if (weed.health <= 0) {
      seeds.value += weed.reward
      activeWeeds.value.splice(i, 1)
    }
  }
  
  // Update plants (attack)
  for (const plant of placedPlants.value) {
    updatePlant(plant, dt)
  }
  
  // Update projectiles
  for (let i = projectiles.value.length - 1; i >= 0; i--) {
    const proj = projectiles.value[i]
    updateProjectile(proj, dt)
    
    if (proj.hit || proj.outOfBounds) {
      projectiles.value.splice(i, 1)
    }
  }
  
  // Check wave complete
  if (waveInProgress.value && activeWeeds.value.length === 0) {
    waveInProgress.value = false
    
    const maxWaves = props.difficulty.waves || 20
    if (currentWave.value >= maxWaves && !endlessMode.value) {
      emit('gameover', true)
    }
  }
}

// Enable endless mode (called from parent when continuing after win)
function enableEndless() {
  endlessMode.value = true
}

defineExpose({ enableEndless })

function updateWeed(weed, dt) {
  const path = currentMap.value.path
  if (weed.pathIndex >= path.length - 1) return
  
  const target = path[weed.pathIndex + 1]
  const dx = target.x - weed.x
  const dy = target.y - weed.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  
  if (dist < 5) {
    weed.pathIndex++
  } else {
    const speed = (weed.speed * (weed.slowMult || 1)) * (dt / 1000)
    weed.x += (dx / dist) * speed
    weed.y += (dy / dist) * speed
  }
  
  // Update slow effect
  if (weed.slowTimer) {
    weed.slowTimer -= dt
    if (weed.slowTimer <= 0) {
      weed.slowMult = 1
      weed.slowTimer = 0
    }
  }
}

function updatePlant(plant, dt) {
  const plantData = plants[plant.type]
  if (!plantData.damage || plantData.damage === 0) return
  
  plant.attackTimer = (plant.attackTimer || 0) + dt
  
  if (plant.attackTimer >= plantData.attackSpeed) {
    // Find target in range
    const target = findTarget(plant, plantData.range)
    
    if (target) {
      plant.attackTimer = 0
      
      // Create projectile
      projectiles.value.push({
        x: plant.x,
        y: plant.y,
        targetId: target.id,
        damage: plantData.damage,
        speed: 300,
        special: plantData.special,
        plantData
      })
    }
  }
}

function findTarget(plant, range) {
  let closest = null
  let closestDist = Infinity
  
  for (const weed of activeWeeds.value) {
    const dx = weed.x - plant.x
    const dy = weed.y - plant.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist <= range && dist < closestDist) {
      closest = weed
      closestDist = dist
    }
  }
  
  return closest
}

function updateProjectile(proj, dt) {
  const target = activeWeeds.value.find(w => w.id === proj.targetId)
  
  if (!target) {
    proj.hit = true
    return
  }
  
  const dx = target.x - proj.x
  const dy = target.y - proj.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  
  if (dist < 15) {
    // Hit!
    let damage = proj.damage
    
    // Apply armor reduction
    if (target.special === 'armor') {
      damage *= (1 - target.armorReduction)
    }
    
    target.health -= damage
    
    // Apply slow effect
    if (proj.special === 'slow') {
      target.slowMult = 1 - proj.plantData.slowAmount
      target.slowTimer = proj.plantData.slowDuration
    }
    
    proj.hit = true
  } else {
    const speed = proj.speed * (dt / 1000)
    proj.x += (dx / dist) * speed
    proj.y += (dy / dist) * speed
  }
  
  // Check out of bounds
  if (proj.x < 0 || proj.x > currentMap.value.width || 
      proj.y < 0 || proj.y > currentMap.value.height) {
    proj.outOfBounds = true
  }
}

function render() {
  const c = ctx.value
  const map = currentMap.value
  
  // Clear
  c.fillStyle = '#7CFC00'
  c.fillRect(0, 0, map.width, map.height)
  
  // Draw path
  c.strokeStyle = '#8B4513'
  c.lineWidth = 30
  c.lineCap = 'round'
  c.lineJoin = 'round'
  c.beginPath()
  c.moveTo(map.path[0].x, map.path[0].y)
  for (let i = 1; i < map.path.length; i++) {
    c.lineTo(map.path[i].x, map.path[i].y)
  }
  c.stroke()
  
  // Draw path border
  c.strokeStyle = '#654321'
  c.lineWidth = 34
  c.beginPath()
  c.moveTo(map.path[0].x, map.path[0].y)
  for (let i = 1; i < map.path.length; i++) {
    c.lineTo(map.path[i].x, map.path[i].y)
  }
  c.stroke()
  
  // Redraw path on top
  c.strokeStyle = '#D2691E'
  c.lineWidth = 28
  c.beginPath()
  c.moveTo(map.path[0].x, map.path[0].y)
  for (let i = 1; i < map.path.length; i++) {
    c.lineTo(map.path[i].x, map.path[i].y)
  }
  c.stroke()
  
  // Draw placement grid (when selecting)
  if (selectedPlant.value && hoveredCell.value) {
    const cell = hoveredCell.value
    const isOccupied = placedPlants.value.some(p => p.col === cell.col && p.row === cell.row)
    const onPath = isOnPath(cell.x, cell.y)
    
    // Path-only plants (can only be placed ON the path)
    const pathOnlyPlants = ['thornybush', 'oaksapling', 'pumpkinguard']
    const isPathOnly = pathOnlyPlants.includes(selectedPlant.value)
    
    // Valid placement: path-only on path, or regular off path
    const validPlacement = !isOccupied && ((isPathOnly && onPath) || (!isPathOnly && !onPath))
    
    if (validPlacement) {
      c.fillStyle = 'rgba(76, 175, 80, 0.6)'
      c.fillRect(cell.x - 18, cell.y - 18, 36, 36)
      c.strokeStyle = '#4CAF50'
      c.lineWidth = 2
      c.strokeRect(cell.x - 18, cell.y - 18, 36, 36)
    } else {
      c.fillStyle = 'rgba(244, 67, 54, 0.6)'
      c.fillRect(cell.x - 18, cell.y - 18, 36, 36)
    }
  }
  
  // Draw placed plants
  c.font = '28px Arial'
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  for (const plant of placedPlants.value) {
    const plantData = plants[plant.type]
    
    // Highlight and show range when hovering
    if (hoveredCell.value && hoveredCell.value.col === plant.col && hoveredCell.value.row === plant.row) {
      // Draw range circle
      if (plantData.range > 0) {
        c.beginPath()
        c.arc(plant.x, plant.y, plantData.range, 0, Math.PI * 2)
        c.fillStyle = 'rgba(100, 181, 246, 0.15)'
        c.fill()
        c.strokeStyle = 'rgba(100, 181, 246, 0.6)'
        c.lineWidth = 2
        c.stroke()
      }
      
      // Show sell indicator when not placing
      if (!selectedPlant.value) {
        c.fillStyle = 'rgba(255, 193, 7, 0.4)'
        c.fillRect(plant.x - 18, plant.y - 18, 36, 36)
        c.strokeStyle = '#FFC107'
        c.lineWidth = 2
        c.strokeRect(plant.x - 18, plant.y - 18, 36, 36)
        
        // Show sell price
        c.fillStyle = '#FFC107'
        c.font = '10px Arial'
        c.fillText(`+${plantData.cost}`, plant.x, plant.y - 24)
        c.font = '28px Arial'
      }
    }
    
    c.fillText(plantData.emoji, plant.x, plant.y)
  }
  
  // Draw weeds
  for (const weed of activeWeeds.value) {
    const weedData = weeds[weed.type]
    c.fillText(weedData.emoji, weed.x, weed.y)
    
    // Health bar
    const healthPct = weed.health / weed.maxHealth
    c.fillStyle = '#333'
    c.fillRect(weed.x - 15, weed.y - 22, 30, 5)
    c.fillStyle = healthPct > 0.5 ? '#4CAF50' : healthPct > 0.25 ? '#FF9800' : '#F44336'
    c.fillRect(weed.x - 15, weed.y - 22, 30 * healthPct, 5)
  }
  
  // Draw projectiles
  c.fillStyle = '#8BC34A'
  for (const proj of projectiles.value) {
    c.beginPath()
    c.arc(proj.x, proj.y, 5, 0, Math.PI * 2)
    c.fill()
  }
}

// Wave spawning
function startWave() {
  const maxWaves = props.difficulty.waves || 20
  if (waveInProgress.value || (!endlessMode.value && currentWave.value >= maxWaves)) return
  
  waveInProgress.value = true
  // Use modulo to loop waves if we have more waves than defined
  const waveIndex = currentWave.value % waves.length
  const wave = waves[waveIndex]
  currentWave.value++
  
  let delay = 0
  for (const weedType of wave.weeds) {
    setTimeout(() => spawnWeed(weedType), delay)
    delay += 800
  }
}

let weedIdCounter = 0
function spawnWeed(type) {
  const weedData = weeds[type]
  const path = currentMap.value.path
  const diff = props.difficulty
  
  activeWeeds.value.push({
    id: weedIdCounter++,
    type,
    x: path[0].x,
    y: path[0].y,
    health: Math.floor(weedData.health * diff.enemyHealthMult),
    maxHealth: Math.floor(weedData.health * diff.enemyHealthMult),
    speed: weedData.speed * diff.enemySpeedMult,
    reward: Math.floor(weedData.reward * diff.rewardMult),
    special: weedData.special,
    armorReduction: weedData.armorReduction || 0,
    pathIndex: 0,
    slowMult: 1,
    slowTimer: 0
  })
}

// Check if a point is on the path
function isOnPath(x, y) {
  const path = currentMap.value.path
  const threshold = 20 // Half the path width
  
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i]
    const p2 = path[i + 1]
    
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const lengthSq = dx * dx + dy * dy
    
    if (lengthSq === 0) continue
    
    let t = ((x - p1.x) * dx + (y - p1.y) * dy) / lengthSq
    t = Math.max(0, Math.min(1, t))
    
    const projX = p1.x + t * dx
    const projY = p1.y + t * dy
    const dist = Math.sqrt((x - projX) ** 2 + (y - projY) ** 2)
    
    if (dist < threshold) return true
  }
  return false
}

// Plant placement
function selectPlant(plantId) {
  const plantData = plants[plantId]
  if (seeds.value >= plantData.cost) {
    selectedPlant.value = plantId
  }
}

function handleCanvasClick(e) {
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  // Snap to grid
  const gridSize = currentMap.value.gridSize
  const col = Math.floor(x / gridSize)
  const row = Math.floor(y / gridSize)
  const snapX = col * gridSize + gridSize / 2
  const snapY = row * gridSize + gridSize / 2
  
  // Check if clicking on existing plant to sell
  const existingPlantIndex = placedPlants.value.findIndex(p => p.col === col && p.row === row)
  if (existingPlantIndex !== -1 && !selectedPlant.value) {
    const existingPlant = placedPlants.value[existingPlantIndex]
    const plantData = plants[existingPlant.type]
    seeds.value += plantData.cost
    placedPlants.value.splice(existingPlantIndex, 1)
    return
  }
  
  if (!selectedPlant.value) return
  
  // Path-only plants (can only be placed ON the path)
  const pathOnlyPlants = ['thornybush', 'oaksapling', 'pumpkinguard']
  const isPathOnly = pathOnlyPlants.includes(selectedPlant.value)
  const onPath = isOnPath(snapX, snapY)
  
  // Check placement validity
  if (isPathOnly && !onPath) return  // Path-only plants must be on path
  if (!isPathOnly && onPath) return  // Regular plants cannot be on path
  
  // Check if occupied
  const isOccupied = placedPlants.value.some(p => p.col === col && p.row === row)
  
  if (!isOccupied) {
    const plantData = plants[selectedPlant.value]
    seeds.value -= plantData.cost
    
    placedPlants.value.push({
      type: selectedPlant.value,
      x: snapX,
      y: snapY,
      col: col,
      row: row,
      attackTimer: 0
    })
    
    selectedPlant.value = null
  }
}

function handleCanvasMove(e) {
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const gridSize = currentMap.value.gridSize
  const col = Math.floor(x / gridSize)
  const row = Math.floor(y / gridSize)
  hoveredCell.value = { col, row, x: col * gridSize + gridSize / 2, y: row * gridSize + gridSize / 2 }
}

function cancelSelection() {
  selectedPlant.value = null
}

const maxWaves = computed(() => props.difficulty.waves || 20)
const waveDisplay = computed(() => endlessMode.value ? `Wave ${currentWave.value} (Endless)` : `Wave ${currentWave.value}/${maxWaves.value}`)
</script>

<template>
  <div class="game-screen">
    <!-- HUD -->
    <div class="hud">
      <button class="exit-btn" @click="$emit('exit')">← Exit</button>
      <div class="stat">🌰 {{ seeds }}</div>
      <div class="stat">❤️ {{ lives }}</div>
      <div class="stat">{{ waveDisplay }}</div>
      <button 
        class="wave-btn"
        :disabled="waveInProgress || (!endlessMode && currentWave >= maxWaves)"
        @click="startWave"
      >
        {{ waveInProgress ? 'Wave in progress...' : (!endlessMode && currentWave >= maxWaves) ? 'All waves complete!' : '▶ Start Wave' }}
      </button>
    </div>
    
    <!-- Canvas -->
    <canvas 
      ref="canvas"
      @click="handleCanvasClick"
      @mousemove="handleCanvasMove"
      @contextmenu.prevent="cancelSelection"
    ></canvas>
    
    <!-- Plant Selection Bar -->
    <div class="plant-bar">
      <button
        v-for="plantId in plantOrder"
        :key="plantId"
        class="plant-btn"
        :class="{ 
          selected: selectedPlant === plantId,
          disabled: seeds < plants[plantId].cost 
        }"
        :title="`${plants[plantId].name} - ${plants[plantId].description} (Cost: ${plants[plantId].cost})`"
        @click="selectPlant(plantId)"
      >
        <span class="emoji">{{ plants[plantId].emoji }}</span>
        <span class="cost">{{ plants[plantId].cost }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.hud {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.exit-btn {
  padding: 0.5rem 1rem;
  background: #e0e0e0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.exit-btn:hover {
  background: #bdbdbd;
}

.stat {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.wave-btn {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

.wave-btn:disabled {
  background: #9E9E9E;
  cursor: not-allowed;
}

canvas {
  border: 4px solid #2E7D32;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  cursor: crosshair;
}

.plant-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  max-width: 820px;
}

.plant-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0.6rem;
  background: #E8F5E9;
  border: 2px solid #A5D6A7;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 50px;
}

.plant-btn:hover:not(.disabled) {
  background: #C8E6C9;
  transform: scale(1.05);
}

.plant-btn.selected {
  background: #4CAF50;
  border-color: #1B5E20;
}

.plant-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.plant-btn .emoji {
  font-size: 1.4rem;
}

.plant-btn .cost {
  font-size: 0.7rem;
  font-weight: bold;
  color: #2E7D32;
}

.plant-btn.selected .cost {
  color: white;
}
</style>
