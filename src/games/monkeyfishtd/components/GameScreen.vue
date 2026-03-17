<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { maps } from '../data/maps'
import { monkeys, monkeyOrder, getMonkeyStats, getUpgradeCost } from '../data/monkeys'
import { fishTypes, waves } from '../data/fish'

const props = defineProps({
  mapId: { type: String, required: true },
  difficulty: { type: Object, default: () => ({ bananaMult: 1, lifeMult: 1, enemyHealthMult: 1, enemySpeedMult: 1, rewardMult: 1 }) }
})

const emit = defineEmits(['exit', 'gameover'])

const canvas = ref(null)
const ctx = ref(null)
const gameLoop = ref(null)

const cash = ref(650)
const lives = ref(100)
const currentWave = ref(0)
const waveInProgress = ref(false)
const endlessMode = ref(false)
const gameSpeed = ref(1)

const placedTowers = ref([])
const activeFish = ref([])
const projectiles = ref([])

const selectedTowerType = ref(null)
const selectedTower = ref(null)
const hoveredCell = ref(null)

const currentMap = computed(() => maps[props.mapId])

onMounted(() => {
  const canvasEl = canvas.value
  ctx.value = canvasEl.getContext('2d')
  canvasEl.width = currentMap.value.width
  canvasEl.height = currentMap.value.height
  
  cash.value = Math.floor(650 * props.difficulty.bananaMult)
  lives.value = Math.floor(100 * props.difficulty.lifeMult)
  
  startGameLoop()
})

onUnmounted(() => {
  if (gameLoop.value) cancelAnimationFrame(gameLoop.value)
})

let lastTime = 0
function startGameLoop() {
  function loop(timestamp) {
    const rawDelta = timestamp - lastTime
    lastTime = timestamp
    
    const dt = rawDelta * gameSpeed.value
    update(dt)
    render()
    
    gameLoop.value = requestAnimationFrame(loop)
  }
  gameLoop.value = requestAnimationFrame(loop)
}

function enableEndless() { endlessMode.value = true }
defineExpose({ enableEndless })

let fishIdCounter = 0

function update(dt) {
  // Update fish
  for (let i = activeFish.value.length - 1; i >= 0; i--) {
    const fish = activeFish.value[i]
    updateFish(fish, dt)
    
    if (fish.pathIndex >= currentMap.value.path.length - 1) {
      lives.value -= 1
      activeFish.value.splice(i, 1)
      if (lives.value <= 0) emit('gameover', false)
      continue
    }
    
    if (fish.health <= 0) {
      cash.value += fish.cashValue || 1
      if (fish.children?.length > 0) {
        for (const childType of fish.children) {
          spawnChildFish(childType, fish.x, fish.y, fish.pathIndex, fish.progress, fish.camo, fish.regrow)
        }
      }
      activeFish.value.splice(i, 1)
    }
  }
  
  // Regrow fish
  for (const fish of activeFish.value) {
    if (fish.regrow && fish.originalType && fish.type !== fish.originalType) {
      fish.regrowTimer = (fish.regrowTimer || 0) + dt
      if (fish.regrowTimer >= 3000) {
        const types = Object.keys(fishTypes)
        const idx = types.indexOf(fish.type)
        const targetIdx = types.indexOf(fish.originalType)
        if (idx < targetIdx && idx < types.length - 1) {
          const next = types[idx + 1]
          const data = fishTypes[next]
          fish.type = next
          fish.health = data.health * (fish.fortified ? 2 : 1)
          fish.maxHealth = fish.health
          fish.color = data.color
          fish.regrowTimer = 0
        }
      }
    }
  }
  
  // Update towers
  for (const tower of placedTowers.value) {
    updateTower(tower, dt)
  }
  
  // Update projectiles
  for (let i = projectiles.value.length - 1; i >= 0; i--) {
    const proj = projectiles.value[i]
    updateProjectile(proj, dt)
    if (proj.dead) projectiles.value.splice(i, 1)
  }
  
  // Wave complete
  if (waveInProgress.value && activeFish.value.length === 0) {
    waveInProgress.value = false
    const maxWaves = props.difficulty.waves || 40
    if (currentWave.value >= maxWaves && !endlessMode.value) {
      emit('gameover', true)
    }
  }
}

function updateFish(fish, dt) {
  const path = currentMap.value.path
  if (fish.pathIndex >= path.length - 1) return
  
  let speedMult = 1
  if (fish.slowTimer > 0) {
    speedMult = fish.slowAmount || 0.5
    fish.slowTimer -= dt
  }
  if (fish.frozen) {
    speedMult = 0
    fish.freezeTimer -= dt
    if (fish.freezeTimer <= 0) fish.frozen = false
  }
  
  const target = path[fish.pathIndex + 1]
  const dx = target.x - fish.x
  const dy = target.y - fish.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  
  if (dist < 5) {
    fish.pathIndex++
    fish.progress = 0
  } else {
    const moveSpeed = fish.speed * speedMult * (dt / 1000)
    fish.x += (dx / dist) * moveSpeed
    fish.y += (dy / dist) * moveSpeed
    fish.progress += moveSpeed
    fish.angle = Math.atan2(dy, dx)
  }
  
  if (fish.burnTimer > 0) {
    fish.burnTickTimer = (fish.burnTickTimer || 0) + dt
    if (fish.burnTickTimer >= 250) {
      fish.health -= 1
      fish.burnTickTimer = 0
    }
    fish.burnTimer -= dt
  }
}

function updateTower(tower, dt) {
  const stats = getMonkeyStats(tower.type, tower.topPath, tower.bottomPath)
  
  if (stats.income > 0 && tower.type === 'farm') {
    tower.incomeTimer = (tower.incomeTimer || 0) + dt
    if (tower.incomeTimer >= 8000) {
      cash.value += stats.income
      tower.incomeTimer = 0
    }
    return
  }
  
  if (tower.type === 'village') return
  if (!stats.attackSpeed || stats.attackSpeed <= 0) return
  
  tower.attackTimer = (tower.attackTimer || 0) + dt
  if (tower.attackTimer < stats.attackSpeed) return
  
  const targets = findTargets(tower, stats)
  if (targets.length === 0) return
  
  tower.attackTimer = 0
  
  if (tower.type === 'ice' && !stats.projectile) {
    for (const target of targets) {
      if (!target.frozen && !target.immune?.includes('freeze')) {
        target.frozen = true
        target.freezeTimer = stats.freezeDuration || 1500
        if (stats.damage > 0) target.health -= stats.damage
      }
    }
    return
  }
  
  if (tower.type === 'glue') {
    const target = targets[0]
    if (!target.glued) {
      target.glued = true
      target.slowTimer = stats.slowDuration || 6000
      target.slowAmount = 1 - (stats.slow || 0.5)
    }
    return
  }
  
  if (tower.type === 'tack' && stats.spread !== false) {
    const numProj = stats.projectiles || 8
    for (let i = 0; i < numProj; i++) {
      const angle = (Math.PI * 2 * i) / numProj
      projectiles.value.push({
        x: tower.x, y: tower.y, angle, directional: true,
        damage: stats.damage, pierce: stats.pierce, pierceHits: [],
        speed: 400, range: stats.range, traveled: 0, tower, burn: stats.burn
      })
    }
    return
  }
  
  const numProj = stats.projectiles || 1
  for (let p = 0; p < Math.min(numProj, targets.length); p++) {
    projectiles.value.push({
      x: tower.x, y: tower.y, targetId: targets[p].id,
      damage: stats.damage, pierce: stats.pierce, pierceHits: [],
      speed: 400, splash: stats.splash, slow: stats.slow, burn: stats.burn, tower
    })
  }
}

function findTargets(tower, stats) {
  const valid = []
  for (const fish of activeFish.value) {
    const dx = fish.x - tower.x
    const dy = fish.y - tower.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist > stats.range) continue
    if (fish.camo && !stats.camo) continue
    valid.push({ fish, dist, progress: fish.pathIndex * 10000 + fish.progress })
  }
  
  const targeting = tower.targeting || 'first'
  valid.sort((a, b) => {
    if (targeting === 'first') return b.progress - a.progress
    if (targeting === 'last') return a.progress - b.progress
    if (targeting === 'close') return a.dist - b.dist
    if (targeting === 'strong') return (b.fish.maxHealth || 1) - (a.fish.maxHealth || 1)
    return 0
  })
  
  return valid.map(f => f.fish).slice(0, 10)
}

function updateProjectile(proj, dt) {
  if (proj.directional) {
    const speed = proj.speed * (dt / 1000)
    proj.x += Math.cos(proj.angle) * speed
    proj.y += Math.sin(proj.angle) * speed
    proj.traveled += speed
    
    for (const fish of activeFish.value) {
      if (proj.pierceHits.includes(fish.id)) continue
      const dx = fish.x - proj.x
      const dy = fish.y - proj.y
      if (Math.sqrt(dx * dx + dy * dy) < 15) {
        applyDamage(fish, proj)
        proj.pierceHits.push(fish.id)
        if (proj.pierceHits.length >= proj.pierce) { proj.dead = true; return }
      }
    }
    if (proj.traveled > proj.range) proj.dead = true
    return
  }
  
  const target = activeFish.value.find(f => f.id === proj.targetId)
  if (!target) { proj.dead = true; return }
  
  const dx = target.x - proj.x
  const dy = target.y - proj.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  
  if (dist < 15) {
    applyDamage(target, proj)
    proj.pierceHits.push(target.id)
    
    if (proj.splash) {
      for (const fish of activeFish.value) {
        if (fish.id === target.id) continue
        const sdist = Math.sqrt((fish.x - target.x) ** 2 + (fish.y - target.y) ** 2)
        if (sdist <= proj.splash) applyDamage(fish, proj, true)
      }
    }
    
    if (proj.pierceHits.length >= proj.pierce) {
      proj.dead = true
    } else {
      const next = activeFish.value.find(f => !proj.pierceHits.includes(f.id) && 
        Math.sqrt((f.x - proj.x) ** 2 + (f.y - proj.y) ** 2) < 80)
      if (next) proj.targetId = next.id
      else proj.dead = true
    }
  } else {
    const speed = proj.speed * (dt / 1000)
    proj.x += (dx / dist) * speed
    proj.y += (dy / dist) * speed
  }
}

function applyDamage(fish, proj, isSplash = false) {
  let damage = isSplash ? Math.floor(proj.damage / 2) : proj.damage
  if (fish.armor) damage = 0
  fish.health -= damage
  if (proj.slow && !fish.glued) { fish.slowTimer = 3000; fish.slowAmount = 1 - proj.slow }
  if (proj.burn && !fish.immune?.includes('fire')) fish.burnTimer = 3000
}

function spawnChildFish(type, x, y, pathIndex, progress, camo, regrow) {
  const data = fishTypes[type]
  if (!data) return
  activeFish.value.push({
    id: fishIdCounter++, type,
    x: x + (Math.random() - 0.5) * 10, y: y + (Math.random() - 0.5) * 10,
    angle: 0, health: data.health, maxHealth: data.health, speed: data.speed,
    cashValue: data.reward, children: data.children ? [...data.children] : null,
    color: data.color, pathIndex, progress, camo, regrow,
    originalType: regrow ? type : null, immune: data.immune, armor: data.armor,
    isBoss: data.isBoss, size: data.size || 1
  })
}

function render() {
  const c = ctx.value
  const map = currentMap.value
  
  c.fillStyle = map.landColor
  c.fillRect(0, 0, map.width, map.height)
  
  c.strokeStyle = map.waterColor
  c.lineWidth = 38
  c.lineCap = 'round'
  c.lineJoin = 'round'
  c.beginPath()
  c.moveTo(map.path[0].x, map.path[0].y)
  for (let i = 1; i < map.path.length; i++) c.lineTo(map.path[i].x, map.path[i].y)
  c.stroke()
  
  c.strokeStyle = 'rgba(255,255,255,0.2)'
  c.lineWidth = 10
  c.beginPath()
  c.moveTo(map.path[0].x, map.path[0].y - 8)
  for (let i = 1; i < map.path.length; i++) c.lineTo(map.path[i].x, map.path[i].y - 8)
  c.stroke()
  
  if (selectedTowerType.value && hoveredCell.value) {
    const cell = hoveredCell.value
    const monkey = monkeys[selectedTowerType.value]
    const canPlace = canPlaceAt(cell.x, cell.y)
    c.fillStyle = canPlace ? 'rgba(76,175,80,0.4)' : 'rgba(244,67,54,0.4)'
    c.beginPath()
    c.arc(cell.x, cell.y, 18, 0, Math.PI * 2)
    c.fill()
    if (canPlace) {
      c.strokeStyle = 'rgba(100,181,246,0.4)'
      c.lineWidth = 1
      c.beginPath()
      c.arc(cell.x, cell.y, monkey.range, 0, Math.PI * 2)
      c.stroke()
    }
  }
  
  for (const tower of placedTowers.value) {
    const monkey = monkeys[tower.type]
    const stats = getMonkeyStats(tower.type, tower.topPath, tower.bottomPath)
    if (selectedTower.value === tower) {
      c.strokeStyle = 'rgba(100,181,246,0.5)'
      c.fillStyle = 'rgba(100,181,246,0.1)'
      c.lineWidth = 2
      c.beginPath()
      c.arc(tower.x, tower.y, stats.range, 0, Math.PI * 2)
      c.fill()
      c.stroke()
    }
    drawMonkey(c, tower.x, tower.y, monkey, tower.topPath, tower.bottomPath)
  }
  
  for (const fish of activeFish.value) drawFish(c, fish)
  
  c.fillStyle = '#333'
  for (const proj of projectiles.value) {
    c.beginPath()
    c.arc(proj.x, proj.y, 4, 0, Math.PI * 2)
    c.fill()
  }
}

function drawMonkey(c, x, y, data, topPath, bottomPath) {
  c.fillStyle = data.color
  c.beginPath()
  c.ellipse(x, y + 2, 11, 13, 0, 0, Math.PI * 2)
  c.fill()
  
  c.fillStyle = data.secondaryColor
  c.beginPath()
  c.arc(x, y - 7, 9, 0, Math.PI * 2)
  c.fill()
  
  c.fillStyle = '#FFE4C4'
  c.beginPath()
  c.ellipse(x, y - 5, 5, 6, 0, 0, Math.PI * 2)
  c.fill()
  
  c.fillStyle = '#000'
  c.beginPath()
  c.arc(x - 2, y - 7, 1.5, 0, Math.PI * 2)
  c.arc(x + 2, y - 7, 1.5, 0, Math.PI * 2)
  c.fill()
  
  if (topPath > 0 || bottomPath > 0) {
    c.fillStyle = '#FFD700'
    c.beginPath()
    c.arc(x + 10, y - 10, 6, 0, Math.PI * 2)
    c.fill()
    c.fillStyle = '#000'
    c.font = '9px Arial'
    c.textAlign = 'center'
    c.fillText(`${topPath}-${bottomPath}`, x + 10, y - 7)
  }
}

function drawFish(c, fish) {
  c.save()
  c.translate(fish.x, fish.y)
  c.rotate(fish.angle || 0)
  c.scale(fish.size || 1, fish.size || 1)
  
  if (fish.color === 'rainbow') {
    const grad = c.createLinearGradient(-12, 0, 12, 0)
    grad.addColorStop(0, '#FF0000')
    grad.addColorStop(0.2, '#FF8800')
    grad.addColorStop(0.4, '#FFFF00')
    grad.addColorStop(0.6, '#00FF00')
    grad.addColorStop(0.8, '#0088FF')
    grad.addColorStop(1, '#8800FF')
    c.fillStyle = grad
  } else {
    c.fillStyle = fish.color
  }
  
  c.beginPath()
  c.ellipse(0, 0, 12, 7, 0, 0, Math.PI * 2)
  c.fill()
  
  c.beginPath()
  c.moveTo(-10, 0)
  c.lineTo(-18, -6)
  c.lineTo(-18, 6)
  c.closePath()
  c.fill()
  
  if (fish.camo) {
    c.fillStyle = 'rgba(0,100,0,0.5)'
    c.beginPath()
    c.ellipse(3, -2, 4, 2, 0.3, 0, Math.PI * 2)
    c.fill()
  }
  
  if (fish.regrow) {
    c.fillStyle = '#FF69B4'
    c.beginPath()
    c.arc(0, -10, 4, 0, Math.PI * 2)
    c.fill()
  }
  
  if (fish.fortified) {
    c.strokeStyle = '#888'
    c.lineWidth = 2
    c.beginPath()
    c.arc(0, 0, 14, 0, Math.PI * 2)
    c.stroke()
  }
  
  if (fish.isBoss) {
    c.strokeStyle = '#FFD700'
    c.lineWidth = 3
    c.beginPath()
    c.ellipse(0, 0, 16, 10, 0, 0, Math.PI * 2)
    c.stroke()
  }
  
  c.fillStyle = '#fff'
  c.beginPath()
  c.arc(7, -1, 3, 0, Math.PI * 2)
  c.fill()
  c.fillStyle = '#000'
  c.beginPath()
  c.arc(8, -1, 1.5, 0, Math.PI * 2)
  c.fill()
  
  c.restore()
  
  if (fish.maxHealth > 1) {
    const pct = fish.health / fish.maxHealth
    const w = 20 * (fish.size || 1)
    c.fillStyle = '#333'
    c.fillRect(fish.x - w/2, fish.y - 18 * (fish.size || 1), w, 4)
    c.fillStyle = pct > 0.5 ? '#4CAF50' : pct > 0.25 ? '#FF9800' : '#F44336'
    c.fillRect(fish.x - w/2, fish.y - 18 * (fish.size || 1), w * pct, 4)
  }
}

function canPlaceAt(x, y) {
  if (isOnPath(x, y)) return false
  for (const tower of placedTowers.value) {
    if (Math.sqrt((tower.x - x) ** 2 + (tower.y - y) ** 2) < 30) return false
  }
  return true
}

function isOnPath(x, y) {
  const path = currentMap.value.path
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i], p2 = path[i + 1]
    const dx = p2.x - p1.x, dy = p2.y - p1.y
    const len = dx * dx + dy * dy
    if (len === 0) continue
    let t = Math.max(0, Math.min(1, ((x - p1.x) * dx + (y - p1.y) * dy) / len))
    if (Math.sqrt((x - (p1.x + t * dx)) ** 2 + (y - (p1.y + t * dy)) ** 2) < 24) return true
  }
  return false
}

function startWave() {
  if (waveInProgress.value) return
  const maxWaves = props.difficulty.waves || 40
  if (!endlessMode.value && currentWave.value >= maxWaves) return
  
  waveInProgress.value = true
  const waveIndex = currentWave.value % waves.length
  const wave = waves[waveIndex]
  currentWave.value++
  
  let globalDelay = 0
  for (const group of wave.fish) {
    globalDelay += group.delay || 0
    for (let i = 0; i < group.count; i++) {
      const t = globalDelay + i * group.spacing
      setTimeout(() => spawnFish(group.type, group.camo, group.regrow, group.fortified), t)
    }
    globalDelay += group.count * group.spacing
  }
}

function spawnFish(type, camo = false, regrow = false, fortified = false) {
  const data = fishTypes[type]
  if (!data) return
  const path = currentMap.value.path
  const diff = props.difficulty
  const health = data.health * (fortified ? 2 : 1) * diff.enemyHealthMult
  
  activeFish.value.push({
    id: fishIdCounter++, type, x: path[0].x, y: path[0].y, angle: 0,
    health, maxHealth: health, speed: data.speed * diff.enemySpeedMult,
    cashValue: Math.floor(data.reward * diff.rewardMult),
    children: data.children ? [...data.children] : null, color: data.color,
    pathIndex: 0, progress: 0, camo, regrow, fortified,
    originalType: regrow ? type : null, immune: data.immune, armor: data.armor,
    isBoss: data.isBoss, size: data.size || 1
  })
}

function handleCanvasClick(e) {
  const rect = canvas.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) * (canvas.value.width / rect.width)
  const y = (e.clientY - rect.top) * (canvas.value.height / rect.height)
  
  if (selectedTowerType.value) {
    if (canPlaceAt(x, y)) {
      const monkey = monkeys[selectedTowerType.value]
      if (cash.value >= monkey.cost) {
        cash.value -= monkey.cost
        placedTowers.value.push({
          id: Date.now(), type: selectedTowerType.value, x, y,
          topPath: 0, bottomPath: 0, targeting: 'first', attackTimer: 0, incomeTimer: 0
        })
        selectedTowerType.value = null
      }
    }
    return
  }
  
  for (const tower of placedTowers.value) {
    if (Math.sqrt((tower.x - x) ** 2 + (tower.y - y) ** 2) < 20) {
      selectedTower.value = tower
      return
    }
  }
  selectedTower.value = null
}

function handleCanvasMove(e) {
  const rect = canvas.value.getBoundingClientRect()
  hoveredCell.value = {
    x: (e.clientX - rect.left) * (canvas.value.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.value.height / rect.height)
  }
}

function selectMonkeyType(type) {
  if (cash.value >= monkeys[type].cost) {
    selectedTowerType.value = type
    selectedTower.value = null
  }
}

function cancelSelection() {
  selectedTowerType.value = null
  selectedTower.value = null
}

function upgradeTower(path) {
  if (!selectedTower.value) return
  const tower = selectedTower.value
  const tier = path === 'top' ? tower.topPath : tower.bottomPath
  if (tier >= 4) return
  if (path === 'top' && tower.bottomPath > 2 && tier >= 2) return
  if (path === 'bottom' && tower.topPath > 2 && tier >= 2) return
  const cost = getUpgradeCost(tower.type, path, tier)
  if (cash.value < cost) return
  cash.value -= cost
  if (path === 'top') tower.topPath++
  else tower.bottomPath++
}

function getSellValue() {
  if (!selectedTower.value) return 0
  const tower = selectedTower.value
  let total = monkeys[tower.type].cost
  for (let i = 0; i < tower.topPath; i++) total += getUpgradeCost(tower.type, 'top', i)
  for (let i = 0; i < tower.bottomPath; i++) total += getUpgradeCost(tower.type, 'bottom', i)
  return Math.floor(total * 0.7)
}

function sellTower() {
  if (!selectedTower.value) return
  cash.value += getSellValue()
  placedTowers.value = placedTowers.value.filter(t => t !== selectedTower.value)
  selectedTower.value = null
}

function changeTargeting() {
  if (!selectedTower.value) return
  const opts = ['first', 'last', 'close', 'strong']
  const i = opts.indexOf(selectedTower.value.targeting)
  selectedTower.value.targeting = opts[(i + 1) % opts.length]
}

const maxWaves = computed(() => props.difficulty.waves || 40)
const waveDisplay = computed(() => endlessMode.value ? `Wave ${currentWave.value}` : `${currentWave.value}/${maxWaves.value}`)

const selectedTowerUpgrades = computed(() => {
  if (!selectedTower.value) return null
  const tower = selectedTower.value
  const monkey = monkeys[tower.type]
  if (!monkey.upgrades) return null
  return {
    top: monkey.upgrades.top.map((u, i) => ({
      ...u, purchased: i < tower.topPath,
      available: i === tower.topPath && (tower.bottomPath <= 2 || tower.topPath < 2),
      affordable: cash.value >= u.cost
    })),
    bottom: monkey.upgrades.bottom.map((u, i) => ({
      ...u, purchased: i < tower.bottomPath,
      available: i === tower.bottomPath && (tower.topPath <= 2 || tower.bottomPath < 2),
      affordable: cash.value >= u.cost
    }))
  }
})
</script>

<template>
  <div class="game-screen">
    <div class="hud">
      <button class="exit-btn" @click="$emit('exit')">✕</button>
      <div class="stat cash">💰 {{ cash }}</div>
      <div class="stat lives">❤️ {{ lives }}</div>
      <div class="stat wave">🌊 {{ waveDisplay }}</div>
      <div class="speed-controls">
        <button :class="{ active: gameSpeed === 1 }" @click="gameSpeed = 1">▶</button>
        <button :class="{ active: gameSpeed === 2 }" @click="gameSpeed = 2">▶▶</button>
        <button :class="{ active: gameSpeed === 3 }" @click="gameSpeed = 3">▶▶▶</button>
      </div>
      <button class="wave-btn" :disabled="waveInProgress" @click="startWave">
        {{ waveInProgress ? 'In Progress...' : 'Start Wave' }}
      </button>
    </div>
    
    <div class="game-area">
      <canvas ref="canvas" @click="handleCanvasClick" @mousemove="handleCanvasMove" @contextmenu.prevent="cancelSelection"></canvas>
      
      <div class="tower-panel" v-if="!selectedTower">
        <h3>Towers</h3>
        <div class="tower-grid">
          <button v-for="type in monkeyOrder" :key="type" class="tower-btn"
            :class="{ selected: selectedTowerType === type, disabled: cash < monkeys[type].cost }"
            :title="`${monkeys[type].name}\n${monkeys[type].description}\nCost: $${monkeys[type].cost}`"
            @click="selectMonkeyType(type)">
            <div class="tower-icon" :style="{ background: monkeys[type].color }">
              <div class="tower-head" :style="{ background: monkeys[type].secondaryColor }"></div>
            </div>
            <span class="tower-name">{{ monkeys[type].name.split(' ')[0] }}</span>
            <span class="tower-cost">${{ monkeys[type].cost }}</span>
          </button>
        </div>
      </div>
      
      <div class="upgrade-panel" v-if="selectedTower">
        <div class="panel-header">
          <h3>{{ monkeys[selectedTower.type].name }}</h3>
          <button class="close-btn" @click="selectedTower = null">✕</button>
        </div>
        <div class="targeting">
          <span>Target:</span>
          <button @click="changeTargeting">{{ selectedTower.targeting.toUpperCase() }}</button>
        </div>
        <div class="upgrade-paths" v-if="selectedTowerUpgrades">
          <div class="path">
            <h4>Path 1</h4>
            <div v-for="(up, i) in selectedTowerUpgrades.top" :key="i" class="upgrade"
              :class="{ purchased: up.purchased, available: up.available, affordable: up.affordable }"
              @click="up.available && up.affordable && upgradeTower('top')">
              <span class="up-name">{{ up.name }}</span>
              <span class="up-cost" v-if="!up.purchased">${{ up.cost }}</span>
              <span class="up-check" v-else>✓</span>
            </div>
          </div>
          <div class="path">
            <h4>Path 2</h4>
            <div v-for="(up, i) in selectedTowerUpgrades.bottom" :key="i" class="upgrade"
              :class="{ purchased: up.purchased, available: up.available, affordable: up.affordable }"
              @click="up.available && up.affordable && upgradeTower('bottom')">
              <span class="up-name">{{ up.name }}</span>
              <span class="up-cost" v-if="!up.purchased">${{ up.cost }}</span>
              <span class="up-check" v-else>✓</span>
            </div>
          </div>
        </div>
        <button class="sell-btn" @click="sellTower">Sell (${{ getSellValue() }})</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-screen { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.hud { display: flex; align-items: center; gap: 1rem; padding: 0.5rem 1rem; background: rgba(0,0,0,0.85); border-radius: 10px; }
.exit-btn { width: 32px; height: 32px; background: #666; color: white; border: none; border-radius: 50%; cursor: pointer; }
.stat { font-size: 1.1rem; font-weight: bold; color: white; padding: 0.25rem 0.5rem; border-radius: 5px; }
.stat.cash { background: #388E3C; }
.stat.lives { background: #C62828; }
.stat.wave { background: #1565C0; }
.speed-controls { display: flex; gap: 0.25rem; }
.speed-controls button { padding: 0.25rem 0.5rem; background: #444; color: white; border: none; border-radius: 4px; cursor: pointer; }
.speed-controls button.active { background: #1976D2; }
.wave-btn { padding: 0.5rem 1rem; background: linear-gradient(135deg, #4CAF50, #388E3C); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
.wave-btn:disabled { background: #666; cursor: not-allowed; }
.game-area { display: flex; gap: 0.5rem; }
canvas { border: 3px solid #333; border-radius: 8px; cursor: crosshair; }
.tower-panel, .upgrade-panel { width: 160px; background: rgba(0,0,0,0.9); border-radius: 10px; padding: 0.5rem; color: white; max-height: 360px; overflow-y: auto; }
.tower-panel h3, .upgrade-panel h3 { margin: 0 0 0.5rem 0; font-size: 0.9rem; text-align: center; }
.tower-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.3rem; }
.tower-btn { display: flex; flex-direction: column; align-items: center; padding: 0.3rem; background: #333; border: 2px solid #555; border-radius: 6px; cursor: pointer; }
.tower-btn:hover:not(.disabled) { background: #444; border-color: #4CAF50; }
.tower-btn.selected { background: #4CAF50; border-color: #2E7D32; }
.tower-btn.disabled { opacity: 0.4; cursor: not-allowed; }
.tower-icon { width: 28px; height: 28px; border-radius: 50%; position: relative; }
.tower-head { position: absolute; width: 16px; height: 16px; border-radius: 50%; top: -4px; left: 6px; }
.tower-name { font-size: 0.6rem; margin-top: 0.1rem; }
.tower-cost { font-size: 0.65rem; color: #4CAF50; }
.tower-btn.disabled .tower-cost { color: #F44336; }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
.close-btn { background: none; border: none; color: #aaa; cursor: pointer; font-size: 1rem; }
.targeting { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-size: 0.8rem; }
.targeting button { padding: 0.2rem 0.4rem; background: #444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.7rem; }
.upgrade-paths { display: flex; flex-direction: column; gap: 0.4rem; }
.path h4 { margin: 0 0 0.2rem 0; font-size: 0.75rem; color: #888; }
.upgrade { display: flex; justify-content: space-between; padding: 0.25rem 0.4rem; background: #333; border-radius: 4px; font-size: 0.7rem; margin-bottom: 0.15rem; opacity: 0.4; }
.upgrade.purchased { background: #2E7D32; opacity: 1; }
.upgrade.available { opacity: 1; cursor: pointer; border: 1px solid #666; }
.upgrade.available.affordable { border-color: #4CAF50; }
.upgrade.available.affordable:hover { background: #444; }
.up-cost { color: #4CAF50; }
.upgrade:not(.affordable) .up-cost { color: #F44336; }
.up-check { color: #4CAF50; }
.sell-btn { width: 100%; margin-top: 0.5rem; padding: 0.4rem; background: #C62828; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem; }
.sell-btn:hover { background: #E53935; }
</style>
