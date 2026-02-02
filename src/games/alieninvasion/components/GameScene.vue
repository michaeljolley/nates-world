<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getBuildingsForDifficulty, getBuildingById } from '../data/buildings'
import { getEnemiesForRegion, getEnemyById } from '../data/enemies'

const props = defineProps({
  currentAlien: { type: Object, required: true },
  alienUpgrades: { type: Object, required: true },
  currentRegion: { type: Object, required: true }
})

const emit = defineEmits(['coins', 'damage', 'victory', 'defeat'])

// Canvas refs
const canvasRef = ref(null)
let ctx = null
let animationId = null
let lastTime = 0

// Game constants
const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 600
const WORLD_WIDTH = 2000
const WORLD_HEIGHT = 1500

// Player state
const player = ref({
  x: WORLD_WIDTH / 2,
  y: WORLD_HEIGHT / 2,
  width: 50,
  height: 50,
  hp: 100,
  maxHp: 100,
  attackCooldown: 0,
  facing: 1
})

// Camera
const camera = ref({ x: 0, y: 0 })

// Game objects
const buildings = ref([])
const enemies = ref([])
const projectiles = ref([])
const particles = ref([])
const damageNumbers = ref([])
const roads = ref([])
const decorations = ref([])

// Input
const keys = ref({})
const mouse = ref({ x: 0, y: 0, down: false })

// Stats computed from alien + upgrades
const alienStats = computed(() => {
  if (!props.currentAlien) return { attack: 10, defense: 5, speed: 3, hp: 100 }
  
  const upgrades = props.alienUpgrades[props.currentAlien.id] || { attack: 0, defense: 0, speed: 0, hp: 0 }
  
  return {
    attack: props.currentAlien.baseAttack + upgrades.attack * 5,
    defense: props.currentAlien.baseDefense + upgrades.defense * 3,
    speed: props.currentAlien.baseSpeed + upgrades.speed * 0.5,
    hp: props.currentAlien.baseHP + upgrades.hp * 20
  }
})

// Map theme based on region difficulty
const mapTheme = computed(() => {
  const difficulty = props.currentRegion.difficulty
  if (difficulty <= 2) return 'village'      // Grass, small roads
  if (difficulty <= 4) return 'city'         // Urban, streets
  if (difficulty <= 6) return 'industrial'   // Concrete, factories
  return 'military'                           // Base, fortified
})

// Game state
let totalBuildings = 0
let destroyedBuildings = 0

function generateMap() {
  roads.value = []
  decorations.value = []
  
  const theme = mapTheme.value
  
  // Generate roads
  if (theme === 'village') {
    // Simple dirt roads
    for (let i = 0; i < 3; i++) {
      roads.value.push({
        x1: 0, y1: 300 + i * 400,
        x2: WORLD_WIDTH, y2: 300 + i * 400,
        width: 40, color: '#8B7355'
      })
    }
    for (let i = 0; i < 4; i++) {
      roads.value.push({
        x1: 400 + i * 400, y1: 0,
        x2: 400 + i * 400, y2: WORLD_HEIGHT,
        width: 40, color: '#8B7355'
      })
    }
  } else {
    // Paved roads with sidewalks
    for (let i = 0; i < 4; i++) {
      roads.value.push({
        x1: 0, y1: 250 + i * 350,
        x2: WORLD_WIDTH, y2: 250 + i * 350,
        width: 60, color: '#333333', sidewalk: true
      })
    }
    for (let i = 0; i < 5; i++) {
      roads.value.push({
        x1: 300 + i * 350, y1: 0,
        x2: 300 + i * 350, y2: WORLD_HEIGHT,
        width: 60, color: '#333333', sidewalk: true
      })
    }
  }
  
  // Generate decorations
  const decoCount = theme === 'village' ? 80 : theme === 'city' ? 40 : 20
  for (let i = 0; i < decoCount; i++) {
    const x = Math.random() * WORLD_WIDTH
    const y = Math.random() * WORLD_HEIGHT
    
    if (theme === 'village') {
      decorations.value.push({
        type: Math.random() > 0.3 ? 'tree' : 'bush',
        x, y, size: 15 + Math.random() * 20
      })
    } else if (theme === 'city') {
      decorations.value.push({
        type: Math.random() > 0.5 ? 'lamppost' : 'bench',
        x, y, size: 10
      })
    } else if (theme === 'industrial') {
      decorations.value.push({
        type: Math.random() > 0.5 ? 'barrel' : 'crate',
        x, y, size: 15
      })
    } else {
      decorations.value.push({
        type: Math.random() > 0.5 ? 'sandbag' : 'barrier',
        x, y, size: 20
      })
    }
  }
  
  // Add parked cars on city/industrial maps
  if (theme === 'city' || theme === 'industrial') {
    for (let i = 0; i < 15; i++) {
      decorations.value.push({
        type: 'car',
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        size: 20,
        color: ['#cc0000', '#0000cc', '#00cc00', '#cccc00', '#ffffff', '#333333'][Math.floor(Math.random() * 6)]
      })
    }
  }
}

function initGame() {
  // Set player HP from alien stats
  player.value.hp = alienStats.value.hp
  player.value.maxHp = alienStats.value.hp
  player.value.x = WORLD_WIDTH / 2
  player.value.y = WORLD_HEIGHT / 2
  
  buildings.value = []
  enemies.value = []
  projectiles.value = []
  particles.value = []
  damageNumbers.value = []
  destroyedBuildings = 0
  
  // Generate the map
  generateMap()
  
  // Spawn buildings based on region
  const buildingTypes = getBuildingsForDifficulty(props.currentRegion.difficulty)
  totalBuildings = props.currentRegion.buildings
  
  for (let i = 0; i < totalBuildings; i++) {
    const type = buildingTypes[Math.floor(Math.random() * buildingTypes.length)]
    const building = {
      id: `building-${i}`,
      ...type,
      x: 100 + Math.random() * (WORLD_WIDTH - 200),
      y: 100 + Math.random() * (WORLD_HEIGHT - 200),
      currentHp: type.hp,
      destroyed: false,
      windowPattern: Math.floor(Math.random() * 3),
      roofStyle: Math.floor(Math.random() * 3)
    }
    buildings.value.push(building)
  }
  
  // Spawn initial enemies
  spawnEnemies(3)
}

function spawnEnemies(count) {
  const enemyTypes = getEnemiesForRegion(props.currentRegion.enemyTypes)
  
  for (let i = 0; i < count; i++) {
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)]
    const angle = Math.random() * Math.PI * 2
    const distance = 400 + Math.random() * 200
    
    const enemy = {
      id: `enemy-${Date.now()}-${i}`,
      ...type,
      x: player.value.x + Math.cos(angle) * distance,
      y: player.value.y + Math.sin(angle) * distance,
      currentHp: type.hp,
      attackCooldown: 0,
      width: 40,
      height: 40
    }
    
    // Clamp to world bounds
    enemy.x = Math.max(50, Math.min(WORLD_WIDTH - 50, enemy.x))
    enemy.y = Math.max(50, Math.min(WORLD_HEIGHT - 50, enemy.y))
    
    enemies.value.push(enemy)
  }
}

function handleKeyDown(e) {
  keys.value[e.code] = true
  
  if (e.code === 'Space') {
    e.preventDefault()
    playerAttack()
  }
}

function handleKeyUp(e) {
  keys.value[e.code] = false
}

function handleMouseMove(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  mouse.value.x = e.clientX - rect.left
  mouse.value.y = e.clientY - rect.top
}

function handleMouseDown(e) {
  mouse.value.down = true
  playerAttack()
}

function handleMouseUp() {
  mouse.value.down = false
}

function playerAttack() {
  const p = player.value
  if (p.attackCooldown > 0) return
  
  p.attackCooldown = 0.3 // Attack cooldown
  
  const attackRange = 80
  const attackDamage = alienStats.value.attack
  
  // Create attack visual
  particles.value.push({
    x: p.x + p.facing * 30,
    y: p.y,
    radius: attackRange,
    color: props.currentAlien.color,
    lifetime: 0.2,
    type: 'attack'
  })
  
  // Damage nearby buildings
  buildings.value.forEach(building => {
    if (building.destroyed) return
    
    const dx = building.x + building.width/2 - p.x
    const dy = building.y + building.height/2 - p.y
    const dist = Math.sqrt(dx*dx + dy*dy)
    
    if (dist < attackRange + building.width/2) {
      building.currentHp -= attackDamage
      
      // Damage number
      damageNumbers.value.push({
        x: building.x + building.width/2,
        y: building.y,
        value: attackDamage,
        lifetime: 1,
        color: '#ffff00'
      })
      
      if (building.currentHp <= 0) {
        building.destroyed = true
        destroyedBuildings++
        emit('coins', building.coins)
        
        // Explosion particles
        for (let i = 0; i < 10; i++) {
          particles.value.push({
            x: building.x + building.width/2,
            y: building.y + building.height/2,
            vx: (Math.random() - 0.5) * 200,
            vy: (Math.random() - 0.5) * 200,
            radius: 5 + Math.random() * 10,
            color: building.color,
            lifetime: 0.5 + Math.random() * 0.5,
            type: 'debris'
          })
        }
        
        // Coin popup
        damageNumbers.value.push({
          x: building.x + building.width/2,
          y: building.y - 20,
          value: `+${building.coins}`,
          lifetime: 1.5,
          color: '#ffd700'
        })
      }
    }
  })
  
  // Damage nearby enemies
  enemies.value.forEach(enemy => {
    const dx = enemy.x - p.x
    const dy = enemy.y - p.y
    const dist = Math.sqrt(dx*dx + dy*dy)
    
    if (dist < attackRange + enemy.width/2) {
      const damage = Math.max(1, attackDamage - enemy.armor * 2)
      enemy.currentHp -= damage
      
      damageNumbers.value.push({
        x: enemy.x,
        y: enemy.y - 20,
        value: damage,
        lifetime: 1,
        color: '#ff4444'
      })
      
      if (enemy.currentHp <= 0) {
        emit('coins', enemy.coins)
        damageNumbers.value.push({
          x: enemy.x,
          y: enemy.y - 40,
          value: `+${enemy.coins}`,
          lifetime: 1.5,
          color: '#ffd700'
        })
      }
    }
  })
  
  // Remove dead enemies
  enemies.value = enemies.value.filter(e => e.currentHp > 0)
}

function update(deltaTime) {
  const p = player.value
  const dt = Math.min(deltaTime, 0.05)
  
  // Update cooldowns
  if (p.attackCooldown > 0) p.attackCooldown -= dt
  
  // Player movement
  const speed = alienStats.value.speed * 60
  let moveX = 0
  let moveY = 0
  
  if (keys.value['ArrowUp'] || keys.value['KeyW']) moveY -= 1
  if (keys.value['ArrowDown'] || keys.value['KeyS']) moveY += 1
  if (keys.value['ArrowLeft'] || keys.value['KeyA']) { moveX -= 1; p.facing = -1 }
  if (keys.value['ArrowRight'] || keys.value['KeyD']) { moveX += 1; p.facing = 1 }
  
  // Normalize diagonal movement
  if (moveX !== 0 && moveY !== 0) {
    moveX *= 0.707
    moveY *= 0.707
  }
  
  p.x += moveX * speed * dt
  p.y += moveY * speed * dt
  
  // Clamp to world bounds
  p.x = Math.max(p.width/2, Math.min(WORLD_WIDTH - p.width/2, p.x))
  p.y = Math.max(p.height/2, Math.min(WORLD_HEIGHT - p.height/2, p.y))
  
  // Update camera
  camera.value.x = p.x - CANVAS_WIDTH / 2
  camera.value.y = p.y - CANVAS_HEIGHT / 2
  camera.value.x = Math.max(0, Math.min(WORLD_WIDTH - CANVAS_WIDTH, camera.value.x))
  camera.value.y = Math.max(0, Math.min(WORLD_HEIGHT - CANVAS_HEIGHT, camera.value.y))
  
  // Update enemies
  enemies.value.forEach(enemy => {
    // Move toward player
    const dx = p.x - enemy.x
    const dy = p.y - enemy.y
    const dist = Math.sqrt(dx*dx + dy*dy)
    
    if (dist > enemy.range) {
      // Move closer
      enemy.x += (dx / dist) * enemy.speed * 60 * dt
      enemy.y += (dy / dist) * enemy.speed * 60 * dt
    } else if (enemy.attackCooldown <= 0) {
      // Attack player
      enemy.attackCooldown = enemy.attackSpeed
      
      // Create projectile
      projectiles.value.push({
        x: enemy.x,
        y: enemy.y,
        vx: (dx / dist) * 300,
        vy: (dy / dist) * 300,
        damage: enemy.damage,
        color: enemy.color,
        radius: 8
      })
    }
    
    if (enemy.attackCooldown > 0) enemy.attackCooldown -= dt
  })
  
  // Update projectiles
  projectiles.value.forEach(proj => {
    proj.x += proj.vx * dt
    proj.y += proj.vy * dt
    
    // Check hit player
    const dx = proj.x - p.x
    const dy = proj.y - p.y
    const dist = Math.sqrt(dx*dx + dy*dy)
    
    if (dist < p.width/2 + proj.radius) {
      const damage = Math.max(1, proj.damage - alienStats.value.defense * 0.5)
      p.hp -= damage
      proj.hit = true
      
      damageNumbers.value.push({
        x: p.x,
        y: p.y - 30,
        value: Math.floor(damage),
        lifetime: 1,
        color: '#ff0000'
      })
      
      emit('damage', damage)
    }
  })
  
  // Remove hit/offscreen projectiles
  projectiles.value = projectiles.value.filter(proj => {
    if (proj.hit) return false
    if (proj.x < 0 || proj.x > WORLD_WIDTH || proj.y < 0 || proj.y > WORLD_HEIGHT) return false
    return true
  })
  
  // Update particles
  particles.value.forEach(particle => {
    particle.lifetime -= dt
    if (particle.type === 'debris') {
      particle.x += particle.vx * dt
      particle.y += particle.vy * dt
      particle.vy += 500 * dt // gravity
    }
  })
  particles.value = particles.value.filter(p => p.lifetime > 0)
  
  // Update damage numbers
  damageNumbers.value.forEach(dn => {
    dn.lifetime -= dt
    dn.y -= 30 * dt
  })
  damageNumbers.value = damageNumbers.value.filter(dn => dn.lifetime > 0)
  
  // Spawn more enemies periodically
  if (Math.random() < 0.01 && enemies.value.length < 10) {
    spawnEnemies(1)
  }
  
  // Check victory
  if (destroyedBuildings >= totalBuildings) {
    emit('victory')
    return false
  }
  
  // Check defeat
  if (p.hp <= 0) {
    emit('defeat')
    return false
  }
  
  return true
}

function render() {
  if (!ctx) return
  
  const cam = camera.value
  const p = player.value
  const theme = mapTheme.value
  
  // Draw sky/background based on theme
  if (theme === 'village') {
    ctx.fillStyle = '#90EE90'  // Light green grass
  } else if (theme === 'city') {
    ctx.fillStyle = '#707070'  // Gray concrete
  } else if (theme === 'industrial') {
    ctx.fillStyle = '#505050'  // Dark concrete
  } else {
    ctx.fillStyle = '#3d3d29'  // Military brown-green
  }
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Draw grass texture for village
  if (theme === 'village') {
    ctx.fillStyle = '#7CCD7C'
    for (let x = -cam.x % 40; x < CANVAS_WIDTH; x += 40) {
      for (let y = -cam.y % 40; y < CANVAS_HEIGHT; y += 40) {
        if ((Math.floor((x + cam.x) / 40) + Math.floor((y + cam.y) / 40)) % 2 === 0) {
          ctx.fillRect(x, y, 40, 40)
        }
      }
    }
  }
  
  ctx.save()
  ctx.translate(-cam.x, -cam.y)
  
  // Draw roads
  roads.value.forEach(road => {
    // Sidewalk first (if applicable)
    if (road.sidewalk) {
      ctx.fillStyle = '#999999'
      if (road.x1 === road.x2) {
        ctx.fillRect(road.x1 - road.width/2 - 10, road.y1, road.width + 20, road.y2 - road.y1)
      } else {
        ctx.fillRect(road.x1, road.y1 - road.width/2 - 10, road.x2 - road.x1, road.width + 20)
      }
    }
    
    // Road surface
    ctx.fillStyle = road.color
    if (road.x1 === road.x2) {
      ctx.fillRect(road.x1 - road.width/2, road.y1, road.width, road.y2 - road.y1)
    } else {
      ctx.fillRect(road.x1, road.y1 - road.width/2, road.x2 - road.x1, road.width)
    }
    
    // Road markings (dashed yellow line)
    if (road.color === '#333333') {
      ctx.strokeStyle = '#ffff00'
      ctx.lineWidth = 2
      ctx.setLineDash([20, 20])
      ctx.beginPath()
      if (road.x1 === road.x2) {
        ctx.moveTo(road.x1, road.y1)
        ctx.lineTo(road.x2, road.y2)
      } else {
        ctx.moveTo(road.x1, road.y1)
        ctx.lineTo(road.x2, road.y2)
      }
      ctx.stroke()
      ctx.setLineDash([])
    }
  })
  
  // Draw decorations
  decorations.value.forEach(deco => {
    const screenX = deco.x - cam.x
    const screenY = deco.y - cam.y
    if (screenX < -50 || screenX > CANVAS_WIDTH + 50) return
    if (screenY < -50 || screenY > CANVAS_HEIGHT + 50) return
    
    if (deco.type === 'tree') {
      // Tree trunk
      ctx.fillStyle = '#8B4513'
      ctx.fillRect(deco.x - 4, deco.y - 5, 8, 15)
      // Tree foliage
      ctx.fillStyle = '#228B22'
      ctx.beginPath()
      ctx.arc(deco.x, deco.y - 15, deco.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#2E8B57'
      ctx.beginPath()
      ctx.arc(deco.x - 5, deco.y - 10, deco.size * 0.7, 0, Math.PI * 2)
      ctx.fill()
    } else if (deco.type === 'bush') {
      ctx.fillStyle = '#32CD32'
      ctx.beginPath()
      ctx.arc(deco.x, deco.y, deco.size * 0.6, 0, Math.PI * 2)
      ctx.fill()
    } else if (deco.type === 'lamppost') {
      ctx.fillStyle = '#333'
      ctx.fillRect(deco.x - 2, deco.y - 30, 4, 35)
      ctx.fillStyle = '#ffff88'
      ctx.beginPath()
      ctx.arc(deco.x, deco.y - 32, 6, 0, Math.PI * 2)
      ctx.fill()
    } else if (deco.type === 'bench') {
      ctx.fillStyle = '#8B4513'
      ctx.fillRect(deco.x - 15, deco.y - 3, 30, 6)
      ctx.fillRect(deco.x - 12, deco.y + 3, 4, 8)
      ctx.fillRect(deco.x + 8, deco.y + 3, 4, 8)
    } else if (deco.type === 'car') {
      // Car body
      ctx.fillStyle = deco.color
      ctx.fillRect(deco.x - 15, deco.y - 8, 30, 16)
      // Car roof
      ctx.fillStyle = deco.color === '#333333' ? '#222' : '#222'
      ctx.fillRect(deco.x - 8, deco.y - 12, 16, 6)
      // Wheels
      ctx.fillStyle = '#111'
      ctx.beginPath()
      ctx.arc(deco.x - 10, deco.y + 8, 4, 0, Math.PI * 2)
      ctx.arc(deco.x + 10, deco.y + 8, 4, 0, Math.PI * 2)
      ctx.fill()
      // Windows
      ctx.fillStyle = '#88ccff'
      ctx.fillRect(deco.x - 6, deco.y - 10, 5, 4)
      ctx.fillRect(deco.x + 1, deco.y - 10, 5, 4)
    } else if (deco.type === 'barrel') {
      ctx.fillStyle = '#8B0000'
      ctx.beginPath()
      ctx.ellipse(deco.x, deco.y, 10, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 2
      ctx.stroke()
    } else if (deco.type === 'crate') {
      ctx.fillStyle = '#DEB887'
      ctx.fillRect(deco.x - 10, deco.y - 10, 20, 20)
      ctx.strokeStyle = '#8B4513'
      ctx.lineWidth = 2
      ctx.strokeRect(deco.x - 10, deco.y - 10, 20, 20)
      ctx.beginPath()
      ctx.moveTo(deco.x - 10, deco.y - 10)
      ctx.lineTo(deco.x + 10, deco.y + 10)
      ctx.moveTo(deco.x + 10, deco.y - 10)
      ctx.lineTo(deco.x - 10, deco.y + 10)
      ctx.stroke()
    } else if (deco.type === 'sandbag') {
      ctx.fillStyle = '#C2B280'
      ctx.beginPath()
      ctx.ellipse(deco.x, deco.y, 15, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#8B7355'
      ctx.lineWidth = 1
      ctx.stroke()
    } else if (deco.type === 'barrier') {
      ctx.fillStyle = '#ff6600'
      ctx.fillRect(deco.x - 20, deco.y - 5, 40, 10)
      ctx.fillStyle = '#fff'
      ctx.fillRect(deco.x - 15, deco.y - 5, 10, 10)
      ctx.fillRect(deco.x + 5, deco.y - 5, 10, 10)
    }
  })
  
  // Draw buildings with proper architecture
  buildings.value.forEach(building => {
    if (building.destroyed) return
    
    const bx = building.x
    const by = building.y
    const bw = building.width
    const bh = building.height
    
    // Skip if off screen
    if (bx + bw < cam.x || bx > cam.x + CANVAS_WIDTH) return
    if (by + bh < cam.y || by > cam.y + CANVAS_HEIGHT) return
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fillRect(bx + 5, by + 5, bw, bh)
    
    // Determine building style based on ID
    const isHouse = building.id.includes('house') || building.hp <= 120
    const isSkyscraper = building.id.includes('skyscraper') || building.height > 120
    const isMilitary = building.id.includes('military') || building.id.includes('bunker')
    
    if (isHouse) {
      drawHouse(bx, by, bw, bh, building)
    } else if (isSkyscraper) {
      drawSkyscraper(bx, by, bw, bh, building)
    } else if (isMilitary) {
      drawMilitaryBuilding(bx, by, bw, bh, building)
    } else {
      drawOfficeBuilding(bx, by, bw, bh, building)
    }
    
    // HP bar
    const hpPercent = building.currentHp / building.hp
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(bx, by - 12, bw, 8)
    ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000'
    ctx.fillRect(bx + 1, by - 11, (bw - 2) * hpPercent, 6)
  })
  
  // Draw enemies with proper military look
  enemies.value.forEach(enemy => {
    drawEnemy(enemy)
  })
  
  // Draw projectiles
  projectiles.value.forEach(proj => {
    ctx.fillStyle = '#ff6600'
    ctx.beginPath()
    ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2)
    ctx.fill()
    // Bullet trail
    ctx.strokeStyle = 'rgba(255, 100, 0, 0.5)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(proj.x, proj.y)
    ctx.lineTo(proj.x - proj.vx * 0.05, proj.y - proj.vy * 0.05)
    ctx.stroke()
  })
  
  // Draw particles
  particles.value.forEach(particle => {
    ctx.globalAlpha = particle.lifetime
    if (particle.type === 'attack') {
      ctx.strokeStyle = particle.color
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius * (1 - particle.lifetime * 0.5), 0, Math.PI * 2)
      ctx.stroke()
    } else {
      ctx.fillStyle = particle.color
      ctx.fillRect(particle.x - particle.radius/2, particle.y - particle.radius/2, particle.radius, particle.radius)
    }
    ctx.globalAlpha = 1
  })
  
  // Draw player (alien)
  drawAlien(p)
  
  // Draw damage numbers
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  damageNumbers.value.forEach(dn => {
    ctx.globalAlpha = Math.min(1, dn.lifetime)
    ctx.fillStyle = dn.color
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 3
    ctx.strokeText(dn.value, dn.x, dn.y)
    ctx.fillText(dn.value, dn.x, dn.y)
    ctx.globalAlpha = 1
  })
  
  ctx.restore()
  
  // Draw HUD
  drawHUD(p)
}

function drawHouse(x, y, w, h, building) {
  // Main structure
  ctx.fillStyle = building.color
  ctx.fillRect(x, y + h * 0.3, w, h * 0.7)
  
  // Roof (triangle)
  ctx.fillStyle = '#8B0000'
  ctx.beginPath()
  ctx.moveTo(x - 5, y + h * 0.3)
  ctx.lineTo(x + w / 2, y)
  ctx.lineTo(x + w + 5, y + h * 0.3)
  ctx.closePath()
  ctx.fill()
  
  // Door
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(x + w * 0.4, y + h * 0.6, w * 0.2, h * 0.4)
  // Door knob
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.arc(x + w * 0.55, y + h * 0.8, 2, 0, Math.PI * 2)
  ctx.fill()
  
  // Windows
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.2, h * 0.15)
  ctx.fillRect(x + w * 0.7, y + h * 0.4, w * 0.2, h * 0.15)
  
  // Window frames
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 1
  ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.2, h * 0.15)
  ctx.strokeRect(x + w * 0.7, y + h * 0.4, w * 0.2, h * 0.15)
  
  // Chimney
  ctx.fillStyle = '#8B0000'
  ctx.fillRect(x + w * 0.7, y + h * 0.05, w * 0.15, h * 0.2)
}

function drawSkyscraper(x, y, w, h, building) {
  // Main structure with gradient effect
  const gradient = ctx.createLinearGradient(x, y, x + w, y)
  gradient.addColorStop(0, building.color)
  gradient.addColorStop(0.5, '#ddd')
  gradient.addColorStop(1, building.color)
  ctx.fillStyle = gradient
  ctx.fillRect(x, y, w, h)
  
  // Windows grid
  ctx.fillStyle = '#4488cc'
  const windowW = w / 6
  const windowH = h / 12
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 4; col++) {
      const wx = x + w * 0.1 + col * (windowW + 2)
      const wy = y + h * 0.05 + row * (windowH + 3)
      ctx.fillRect(wx, wy, windowW, windowH)
      // Random lit windows
      if (Math.random() > 0.7) {
        ctx.fillStyle = '#ffff88'
        ctx.fillRect(wx, wy, windowW, windowH)
        ctx.fillStyle = '#4488cc'
      }
    }
  }
  
  // Building top decoration
  ctx.fillStyle = '#555'
  ctx.fillRect(x + w * 0.3, y - 10, w * 0.4, 12)
  
  // Antenna
  ctx.fillStyle = '#333'
  ctx.fillRect(x + w * 0.48, y - 25, 4, 20)
  ctx.fillStyle = '#ff0000'
  ctx.beginPath()
  ctx.arc(x + w * 0.5, y - 27, 3, 0, Math.PI * 2)
  ctx.fill()
  
  // Outline
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, w, h)
}

function drawOfficeBuilding(x, y, w, h, building) {
  // Main structure
  ctx.fillStyle = building.color
  ctx.fillRect(x, y, w, h)
  
  // Windows
  ctx.fillStyle = '#6699cc'
  const cols = Math.floor(w / 15)
  const rows = Math.floor(h / 18)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const wx = x + 5 + col * 15
      const wy = y + 8 + row * 18
      ctx.fillRect(wx, wy, 10, 12)
    }
  }
  
  // Entrance
  ctx.fillStyle = '#444'
  ctx.fillRect(x + w * 0.3, y + h - 25, w * 0.4, 25)
  ctx.fillStyle = '#88ccff'
  ctx.fillRect(x + w * 0.32, y + h - 23, w * 0.16, 21)
  ctx.fillRect(x + w * 0.52, y + h - 23, w * 0.16, 21)
  
  // Roof edge
  ctx.fillStyle = '#555'
  ctx.fillRect(x - 2, y - 5, w + 4, 8)
  
  // Outline
  ctx.strokeStyle = '#222'
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, w, h)
}

function drawMilitaryBuilding(x, y, w, h, building) {
  // Bunker style
  ctx.fillStyle = '#4a5d23'
  ctx.fillRect(x, y + h * 0.2, w, h * 0.8)
  
  // Sloped top
  ctx.beginPath()
  ctx.moveTo(x, y + h * 0.2)
  ctx.lineTo(x + w * 0.1, y)
  ctx.lineTo(x + w * 0.9, y)
  ctx.lineTo(x + w, y + h * 0.2)
  ctx.closePath()
  ctx.fill()
  
  // Reinforced look
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 3
  ctx.strokeRect(x + 5, y + h * 0.3, w - 10, h * 0.6)
  
  // Small windows/slots
  ctx.fillStyle = '#222'
  ctx.fillRect(x + w * 0.15, y + h * 0.4, w * 0.2, h * 0.08)
  ctx.fillRect(x + w * 0.65, y + h * 0.4, w * 0.2, h * 0.08)
  
  // Door
  ctx.fillStyle = '#333'
  ctx.fillRect(x + w * 0.35, y + h * 0.5, w * 0.3, h * 0.5)
  
  // Sandbags at base
  ctx.fillStyle = '#C2B280'
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.ellipse(x + w * 0.2 + i * w * 0.2, y + h - 5, 12, 6, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawEnemy(enemy) {
  const ex = enemy.x
  const ey = enemy.y
  const size = enemy.width
  
  // Different rendering based on enemy type
  if (enemy.id.includes('soldier') || enemy.type === 'soldier' || enemy.type === 'marine' || enemy.type === 'elite') {
    drawSoldier(ex, ey, size, enemy)
  } else if (enemy.type === 'police' || enemy.type === 'swat') {
    drawPolice(ex, ey, size, enemy)
  } else if (enemy.type === 'tank') {
    drawTank(ex, ey, size, enemy)
  } else if (enemy.type === 'helicopter') {
    drawHelicopter(ex, ey, size, enemy)
  } else if (enemy.type === 'jet') {
    drawJet(ex, ey, size, enemy)
  } else if (enemy.type === 'mech' || enemy.type === 'robot') {
    drawMech(ex, ey, size, enemy)
  } else if (enemy.type === 'drone') {
    drawDrone(ex, ey, size, enemy)
  } else {
    drawSoldier(ex, ey, size, enemy) // Default
  }
  
  // HP bar
  const hpPercent = enemy.currentHp / enemy.hp
  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.fillRect(ex - 20, ey - size/2 - 10, 40, 6)
  ctx.fillStyle = '#ff4444'
  ctx.fillRect(ex - 19, ey - size/2 - 9, 38 * hpPercent, 4)
}

function drawSoldier(x, y, size, enemy) {
  // Body (uniform)
  ctx.fillStyle = enemy.color
  ctx.fillRect(x - 8, y - 5, 16, 20)
  
  // Head with helmet
  ctx.fillStyle = '#4a5d23'  // Helmet
  ctx.beginPath()
  ctx.arc(x, y - 12, 8, 0, Math.PI * 2)
  ctx.fill()
  
  // Face
  ctx.fillStyle = '#DEB887'
  ctx.beginPath()
  ctx.arc(x, y - 10, 5, 0, Math.PI)
  ctx.fill()
  
  // Eyes
  ctx.fillStyle = '#000'
  ctx.fillRect(x - 3, y - 12, 2, 2)
  ctx.fillRect(x + 1, y - 12, 2, 2)
  
  // Gun
  ctx.fillStyle = '#333'
  ctx.fillRect(x + 8, y - 5, 15, 4)
  ctx.fillRect(x + 8, y - 8, 4, 6)
  
  // Legs
  ctx.fillStyle = enemy.color
  ctx.fillRect(x - 6, y + 15, 5, 10)
  ctx.fillRect(x + 1, y + 15, 5, 10)
  
  // Boots
  ctx.fillStyle = '#222'
  ctx.fillRect(x - 7, y + 22, 6, 5)
  ctx.fillRect(x + 1, y + 22, 6, 5)
}

function drawPolice(x, y, size, enemy) {
  // Body (blue uniform)
  ctx.fillStyle = '#000080'
  ctx.fillRect(x - 8, y - 5, 16, 20)
  
  // Head
  ctx.fillStyle = '#DEB887'
  ctx.beginPath()
  ctx.arc(x, y - 12, 7, 0, Math.PI * 2)
  ctx.fill()
  
  // Police cap
  ctx.fillStyle = '#000080'
  ctx.fillRect(x - 8, y - 18, 16, 5)
  ctx.fillStyle = '#FFD700'
  ctx.fillRect(x - 3, y - 16, 6, 3)  // Badge
  
  // Eyes
  ctx.fillStyle = '#000'
  ctx.fillRect(x - 3, y - 12, 2, 2)
  ctx.fillRect(x + 1, y - 12, 2, 2)
  
  // Pistol
  ctx.fillStyle = '#222'
  ctx.fillRect(x + 8, y, 10, 3)
  
  // Legs
  ctx.fillStyle = '#000080'
  ctx.fillRect(x - 6, y + 15, 5, 10)
  ctx.fillRect(x + 1, y + 15, 5, 10)
}

function drawTank(x, y, size, enemy) {
  // Tank body
  ctx.fillStyle = '#4a5d23'
  ctx.fillRect(x - 25, y - 10, 50, 25)
  
  // Tank turret
  ctx.fillStyle = '#3d4d1c'
  ctx.beginPath()
  ctx.arc(x, y - 5, 15, 0, Math.PI * 2)
  ctx.fill()
  
  // Tank barrel
  ctx.fillStyle = '#333'
  ctx.save()
  ctx.translate(x, y - 5)
  const angle = Math.atan2(player.value.y - y, player.value.x - x)
  ctx.rotate(angle)
  ctx.fillRect(0, -3, 35, 6)
  ctx.restore()
  
  // Tracks
  ctx.fillStyle = '#222'
  ctx.fillRect(x - 28, y + 12, 56, 8)
  // Track wheels
  ctx.fillStyle = '#333'
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.arc(x - 20 + i * 10, y + 16, 5, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawHelicopter(x, y, size, enemy) {
  // Body
  ctx.fillStyle = '#2F4F4F'
  ctx.beginPath()
  ctx.ellipse(x, y, 25, 12, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Cockpit
  ctx.fillStyle = '#88ccff'
  ctx.beginPath()
  ctx.ellipse(x + 15, y, 8, 8, 0, -Math.PI/2, Math.PI/2)
  ctx.fill()
  
  // Tail
  ctx.fillStyle = '#2F4F4F'
  ctx.fillRect(x - 45, y - 4, 25, 8)
  
  // Tail rotor
  ctx.fillStyle = '#666'
  ctx.fillRect(x - 48, y - 12, 3, 20)
  
  // Main rotor (spinning effect)
  ctx.strokeStyle = '#444'
  ctx.lineWidth = 3
  const rotorAngle = Date.now() / 50
  ctx.beginPath()
  ctx.moveTo(x - 35 * Math.cos(rotorAngle), y - 15 - 5 * Math.sin(rotorAngle))
  ctx.lineTo(x + 35 * Math.cos(rotorAngle), y - 15 + 5 * Math.sin(rotorAngle))
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x - 35 * Math.cos(rotorAngle + Math.PI/2), y - 15 - 5 * Math.sin(rotorAngle + Math.PI/2))
  ctx.lineTo(x + 35 * Math.cos(rotorAngle + Math.PI/2), y - 15 + 5 * Math.sin(rotorAngle + Math.PI/2))
  ctx.stroke()
  
  // Skids
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x - 15, y + 12)
  ctx.lineTo(x - 15, y + 18)
  ctx.lineTo(x - 25, y + 18)
  ctx.moveTo(x + 15, y + 12)
  ctx.lineTo(x + 15, y + 18)
  ctx.lineTo(x + 25, y + 18)
  ctx.stroke()
}

function drawJet(x, y, size, enemy) {
  ctx.save()
  ctx.translate(x, y)
  const angle = Math.atan2(player.value.y - y, player.value.x - x)
  ctx.rotate(angle)
  
  // Fuselage
  ctx.fillStyle = '#C0C0C0'
  ctx.beginPath()
  ctx.moveTo(30, 0)
  ctx.lineTo(-20, -8)
  ctx.lineTo(-20, 8)
  ctx.closePath()
  ctx.fill()
  
  // Wings
  ctx.fillStyle = '#A0A0A0'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(-15, -25)
  ctx.lineTo(-20, -25)
  ctx.lineTo(-20, 0)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(-15, 25)
  ctx.lineTo(-20, 25)
  ctx.lineTo(-20, 0)
  ctx.closePath()
  ctx.fill()
  
  // Tail
  ctx.fillStyle = '#888'
  ctx.beginPath()
  ctx.moveTo(-20, 0)
  ctx.lineTo(-30, -12)
  ctx.lineTo(-30, 12)
  ctx.closePath()
  ctx.fill()
  
  // Cockpit
  ctx.fillStyle = '#4488ff'
  ctx.beginPath()
  ctx.ellipse(15, 0, 8, 4, 0, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.restore()
}

function drawMech(x, y, size, enemy) {
  // Legs
  ctx.fillStyle = '#555'
  ctx.fillRect(x - 15, y + 5, 8, 25)
  ctx.fillRect(x + 7, y + 5, 8, 25)
  
  // Feet
  ctx.fillStyle = '#333'
  ctx.fillRect(x - 18, y + 28, 14, 5)
  ctx.fillRect(x + 4, y + 28, 14, 5)
  
  // Body
  ctx.fillStyle = '#708090'
  ctx.fillRect(x - 18, y - 15, 36, 25)
  
  // Cockpit/head
  ctx.fillStyle = '#ff4444'
  ctx.beginPath()
  ctx.arc(x, y - 20, 10, 0, Math.PI * 2)
  ctx.fill()
  
  // Eye/sensor
  ctx.fillStyle = '#ffff00'
  ctx.beginPath()
  ctx.arc(x, y - 20, 5, 0, Math.PI * 2)
  ctx.fill()
  
  // Arms/guns
  ctx.fillStyle = '#444'
  ctx.fillRect(x - 28, y - 10, 12, 8)
  ctx.fillRect(x + 16, y - 10, 12, 8)
  ctx.fillStyle = '#222'
  ctx.fillRect(x - 35, y - 8, 10, 4)
  ctx.fillRect(x + 25, y - 8, 10, 4)
}

function drawDrone(x, y, size, enemy) {
  // Central body
  ctx.fillStyle = '#333'
  ctx.beginPath()
  ctx.arc(x, y, 12, 0, Math.PI * 2)
  ctx.fill()
  
  // Arms
  ctx.strokeStyle = '#555'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x - 20, y - 20)
  ctx.lineTo(x + 20, y + 20)
  ctx.moveTo(x + 20, y - 20)
  ctx.lineTo(x - 20, y + 20)
  ctx.stroke()
  
  // Rotors
  ctx.fillStyle = '#666'
  const rotorAngle = Date.now() / 30
  const positions = [[-20, -20], [20, -20], [-20, 20], [20, 20]]
  positions.forEach(([rx, ry]) => {
    ctx.save()
    ctx.translate(x + rx, y + ry)
    ctx.rotate(rotorAngle)
    ctx.fillRect(-10, -2, 20, 4)
    ctx.restore()
  })
  
  // Camera/sensor
  ctx.fillStyle = '#ff0000'
  ctx.beginPath()
  ctx.arc(x, y + 5, 4, 0, Math.PI * 2)
  ctx.fill()
}

function drawAlien(p) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.scale(p.facing, 1)
  
  // Glow effect
  ctx.shadowColor = props.currentAlien.color
  ctx.shadowBlur = 25
  
  // Body
  ctx.fillStyle = props.currentAlien.color
  ctx.beginPath()
  ctx.ellipse(0, 0, p.width/2, p.height/2, 0, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.shadowBlur = 0
  
  // Body highlight
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.beginPath()
  ctx.ellipse(-8, -8, p.width/4, p.height/4, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Eyes
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.ellipse(-10, -8, 10, 14, 0, 0, Math.PI * 2)
  ctx.ellipse(10, -8, 10, 14, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Eye shine
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(-8, -12, 4, 0, Math.PI * 2)
  ctx.arc(12, -12, 4, 0, Math.PI * 2)
  ctx.fill()
  
  // Antenna
  ctx.strokeStyle = props.currentAlien.color
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(-5, -p.height/2 + 5)
  ctx.quadraticCurveTo(-15, -p.height/2 - 15, -10, -p.height/2 - 25)
  ctx.moveTo(5, -p.height/2 + 5)
  ctx.quadraticCurveTo(15, -p.height/2 - 15, 10, -p.height/2 - 25)
  ctx.stroke()
  
  // Antenna tips
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(-10, -p.height/2 - 25, 5, 0, Math.PI * 2)
  ctx.arc(10, -p.height/2 - 25, 5, 0, Math.PI * 2)
  ctx.fill()
  
  // Mouth (slight smile)
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(0, 5, 8, 0.2, Math.PI - 0.2)
  ctx.stroke()
  
  ctx.restore()
}

function drawHUD(p) {
  // HP bar
  const hpPercent = p.hp / p.maxHp
  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.fillRect(15, 55, 210, 30)
  ctx.fillStyle = '#333'
  ctx.fillRect(20, 60, 200, 20)
  
  const hpGradient = ctx.createLinearGradient(20, 0, 220, 0)
  if (hpPercent > 0.5) {
    hpGradient.addColorStop(0, '#00ff00')
    hpGradient.addColorStop(1, '#88ff88')
  } else if (hpPercent > 0.25) {
    hpGradient.addColorStop(0, '#ffff00')
    hpGradient.addColorStop(1, '#ffaa00')
  } else {
    hpGradient.addColorStop(0, '#ff0000')
    hpGradient.addColorStop(1, '#ff4444')
  }
  ctx.fillStyle = hpGradient
  ctx.fillRect(20, 60, 200 * hpPercent, 20)
  
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2
  ctx.strokeRect(20, 60, 200, 20)
  
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(`HP: ${Math.floor(p.hp)} / ${p.maxHp}`, 25, 75)
  
  // Progress bar
  const progress = destroyedBuildings / totalBuildings
  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.fillRect(CANVAS_WIDTH - 225, 15, 210, 30)
  ctx.fillStyle = '#333'
  ctx.fillRect(CANVAS_WIDTH - 220, 20, 200, 20)
  ctx.fillStyle = '#00ffff'
  ctx.fillRect(CANVAS_WIDTH - 220, 20, 200 * progress, 20)
  ctx.strokeStyle = '#fff'
  ctx.strokeRect(CANVAS_WIDTH - 220, 20, 200, 20)
  
  ctx.textAlign = 'right'
  ctx.fillText(`Buildings: ${destroyedBuildings} / ${totalBuildings}`, CANVAS_WIDTH - 25, 35)
  
  // Region name
  ctx.textAlign = 'center'
  ctx.font = 'bold 16px Arial'
  ctx.fillStyle = '#fff'
  ctx.fillText(props.currentRegion.name, CANVAS_WIDTH / 2, 30)
  
  // Minimap
  const mapSize = 130
  const mapX = CANVAS_WIDTH - mapSize - 15
  const mapY = CANVAS_HEIGHT - mapSize - 15
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
  ctx.fillRect(mapX - 5, mapY - 5, mapSize + 10, mapSize + 10)
  
  // Minimap background
  ctx.fillStyle = mapTheme.value === 'village' ? '#4a7c4a' : '#444'
  ctx.fillRect(mapX, mapY, mapSize, mapSize)
  
  ctx.strokeStyle = '#00ff00'
  ctx.lineWidth = 2
  ctx.strokeRect(mapX, mapY, mapSize, mapSize)
  
  // Buildings on minimap
  ctx.fillStyle = '#888'
  buildings.value.forEach(b => {
    if (b.destroyed) return
    const mx = mapX + (b.x / WORLD_WIDTH) * mapSize
    const my = mapY + (b.y / WORLD_HEIGHT) * mapSize
    ctx.fillRect(mx - 2, my - 2, 4, 4)
  })
  
  // Enemies on minimap
  ctx.fillStyle = '#ff4444'
  enemies.value.forEach(e => {
    const mx = mapX + (e.x / WORLD_WIDTH) * mapSize
    const my = mapY + (e.y / WORLD_HEIGHT) * mapSize
    ctx.fillRect(mx - 2, my - 2, 5, 5)
  })
  
  // Player on minimap
  ctx.fillStyle = '#00ff00'
  const pmx = mapX + (p.x / WORLD_WIDTH) * mapSize
  const pmy = mapY + (p.y / WORLD_HEIGHT) * mapSize
  ctx.beginPath()
  ctx.arc(pmx, pmy, 5, 0, Math.PI * 2)
  ctx.fill()
  
  // Camera view box on minimap
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = 1
  const viewX = mapX + (camera.value.x / WORLD_WIDTH) * mapSize
  const viewY = mapY + (camera.value.y / WORLD_HEIGHT) * mapSize
  const viewW = (CANVAS_WIDTH / WORLD_WIDTH) * mapSize
  const viewH = (CANVAS_HEIGHT / WORLD_HEIGHT) * mapSize
  ctx.strokeRect(viewX, viewY, viewW, viewH)
}

function gameLoop(currentTime) {
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime
  
  const continueGame = update(deltaTime)
  render()
  
  if (continueGame) {
    animationId = requestAnimationFrame(gameLoop)
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  
  initGame()
  
  lastTime = performance.now()
  animationId = requestAnimationFrame(gameLoop)
  
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<template>
  <div class="game-scene">
    <canvas ref="canvasRef" class="game-canvas"></canvas>
  </div>
</template>

<style scoped>
.game-scene {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.game-canvas {
  border-radius: 10px;
  box-shadow: 0 0 50px rgba(0, 255, 0, 0.3);
  border: 3px solid #00ff00;
  cursor: crosshair;
}
</style>
