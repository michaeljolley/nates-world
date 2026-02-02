<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStreaksStore } from '@/stores/streaks'
import SignInModal from '@/components/SignInModal.vue'
import { characters, getRandomCharacter, getCharacterById } from './characters'

const authStore = useAuthStore()
const streaksStore = useStreaksStore()

// Game phases: 'select', 'fight', 'roundEnd', 'matchEnd'
const gamePhase = ref('select')
const selectedCharacter = ref(null)
const opponent = ref(null)
const playerRounds = ref(0)
const opponentRounds = ref(0)
const roundWinner = ref(null)
const matchWinner = ref(null)
const showSignInModal = ref(false)
const newRecord = ref(false)

// Streak tracking (use unique level ID for battlefields)
const STREAK_LEVEL = 7

const currentStreak = computed(() => streaksStore.getStreak(STREAK_LEVEL))

// Canvas and game loop
const canvasRef = ref(null)
let ctx = null
let animationId = null
let lastTime = 0

// Audio
let audioCtx = null

// Game state
const player = ref(null)
const enemy = ref(null)
const keys = ref({})
const gameActive = ref(false)
const countdown = ref(0)
const roundTime = ref(99)
let roundTimerInterval = null
const currentArena = ref(0)

// Arena definitions - cool battlefield maps!
const arenas = [
  {
    name: 'Volcanic Crater',
    skyGradient: ['#1a0a00', '#4a1500', '#8a2500'],
    groundColor: '#2a1a0a',
    groundLineColor: '#ff4400',
    features: 'lava',
    particles: 'embers'
  },
  {
    name: 'Cyber Stadium',
    skyGradient: ['#0a0a1a', '#1a1a3a', '#0a2a4a'],
    groundColor: '#0a1a2a',
    groundLineColor: '#00ffff',
    features: 'grid',
    particles: 'data'
  },
  {
    name: 'Ancient Temple',
    skyGradient: ['#1a1a0a', '#3a3a1a', '#5a4a2a'],
    groundColor: '#3a2a1a',
    groundLineColor: '#c9a227',
    features: 'pillars',
    particles: 'dust'
  },
  {
    name: 'Frozen Tundra',
    skyGradient: ['#0a1a2a', '#2a3a4a', '#4a5a6a'],
    groundColor: '#2a3a4a',
    groundLineColor: '#aaccff',
    features: 'ice',
    particles: 'snow'
  },
  {
    name: 'Thunder Dome',
    skyGradient: ['#1a0a2a', '#3a1a4a', '#2a0a3a'],
    groundColor: '#1a0a2a',
    groundLineColor: '#aa00ff',
    features: 'lightning',
    particles: 'sparks'
  },
  {
    name: 'Sunset Dojo',
    skyGradient: ['#4a1a0a', '#8a3a1a', '#ca6a2a'],
    groundColor: '#2a1a0a',
    groundLineColor: '#ffaa44',
    features: 'dojo',
    particles: 'petals'
  },
  {
    name: 'Space Station',
    skyGradient: ['#000010', '#000020', '#000030'],
    groundColor: '#1a1a2a',
    groundLineColor: '#4488ff',
    features: 'space',
    particles: 'stars'
  },
  {
    name: 'Jungle Ruins',
    skyGradient: ['#0a1a0a', '#1a3a1a', '#2a4a2a'],
    groundColor: '#1a2a1a',
    groundLineColor: '#44aa44',
    features: 'vines',
    particles: 'fireflies'
  }
]

// Arena particle system
const arenaParticles = ref([])

// Projectiles
const projectiles = ref([])

// Constants
const GROUND_Y = 350
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 450
const GRAVITY = 0.6
const JUMP_FORCE = -14

// Load streaks
watch(() => authStore.isLoggedIn, async (loggedIn) => {
  if (loggedIn) await streaksStore.loadStreaks()
}, { immediate: true })

onMounted(async () => {
  if (authStore.isLoggedIn) await streaksStore.loadStreaks()
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  stopGame()
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})

function handleKeyDown(e) {
  keys.value[e.key.toLowerCase()] = true
  keys.value[e.code] = true
  if (e.code === 'Space') e.preventDefault()
}

function handleKeyUp(e) {
  keys.value[e.key.toLowerCase()] = false
  keys.value[e.code] = false
}

function selectCharacter(char) {
  selectedCharacter.value = char
}

function startMatch() {
  if (!selectedCharacter.value) return
  opponent.value = getRandomCharacter(selectedCharacter.value.id)
  playerRounds.value = 0
  opponentRounds.value = 0
  startRound()
}

function startRound() {
  gamePhase.value = 'fight'
  roundWinner.value = null
  projectiles.value = []
  
  // Pick random arena
  currentArena.value = Math.floor(Math.random() * arenas.length)
  initArenaParticles()
  
  // Initialize fighters
  player.value = createFighter(selectedCharacter.value, 150, true)
  enemy.value = createFighter(opponent.value, 650, false)
  
  // Countdown then start
  countdown.value = 3
  gameActive.value = false
  
  const countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval)
      gameActive.value = true
      roundTime.value = 99
      startRoundTimer()
      startGameLoop()
    }
  }, 1000)
}

function createFighter(charData, x, isPlayer) {
  return {
    ...charData,
    x,
    y: GROUND_Y,
    vx: 0,
    vy: 0,
    health: charData.stats.health,
    maxHealth: charData.stats.health,
    facingRight: isPlayer,
    isPlayer,
    state: 'idle', // idle, walk, jump, punch, kick, hit, block, special
    stateTimer: 0,
    attackCooldown: 0,
    specialCooldown: 0,
    isBlocking: false,
    comboCount: 0
  }
}

function initArenaParticles() {
  arenaParticles.value = []
  const arena = arenas[currentArena.value]
  const count = arena.particles === 'stars' ? 50 : 30
  
  for (let i = 0; i < count; i++) {
    arenaParticles.value.push({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: arena.particles === 'snow' ? Math.random() * 2 + 0.5 : 
              arena.particles === 'embers' ? -Math.random() * 2 - 0.5 :
              (Math.random() - 0.5) * 1,
      alpha: Math.random() * 0.7 + 0.3,
      flicker: Math.random() * Math.PI * 2
    })
  }
}

function updateArenaParticles() {
  const arena = arenas[currentArena.value]
  arenaParticles.value.forEach(p => {
    p.x += p.speedX
    p.y += p.speedY
    p.flicker += 0.1
    
    // Wrap around
    if (p.x < 0) p.x = CANVAS_WIDTH
    if (p.x > CANVAS_WIDTH) p.x = 0
    if (p.y < 0) p.y = CANVAS_HEIGHT
    if (p.y > CANVAS_HEIGHT) p.y = 0
    
    // Special behaviors
    if (arena.particles === 'petals') {
      p.x += Math.sin(p.flicker) * 0.5
    }
  })
}

function renderArena() {
  const arena = arenas[currentArena.value]
  
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
  gradient.addColorStop(0, arena.skyGradient[0])
  gradient.addColorStop(0.5, arena.skyGradient[1])
  gradient.addColorStop(1, arena.skyGradient[2])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Arena-specific features
  renderArenaFeatures(arena)
  
  // Ground
  ctx.fillStyle = arena.groundColor
  ctx.fillRect(0, GROUND_Y + 60, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y - 60)
  
  // Ground line with glow
  ctx.shadowColor = arena.groundLineColor
  ctx.shadowBlur = 10
  ctx.strokeStyle = arena.groundLineColor
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, GROUND_Y + 60)
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y + 60)
  ctx.stroke()
  ctx.shadowBlur = 0
  
  // Particles
  renderArenaParticles(arena)
}

function renderArenaFeatures(arena) {
  switch (arena.features) {
    case 'lava':
      // Lava pools in ground
      ctx.fillStyle = '#ff4400'
      ctx.shadowColor = '#ff4400'
      ctx.shadowBlur = 20
      for (let i = 0; i < 3; i++) {
        const x = 100 + i * 300
        ctx.beginPath()
        ctx.ellipse(x, GROUND_Y + 80, 40 + Math.sin(Date.now()/500 + i) * 5, 10, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
      break
      
    case 'grid':
      // Cyber grid lines
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)'
      ctx.lineWidth = 1
      for (let x = 0; x < CANVAS_WIDTH; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, CANVAS_HEIGHT)
        ctx.stroke()
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(CANVAS_WIDTH, y)
        ctx.stroke()
      }
      // Neon side barriers
      ctx.fillStyle = 'rgba(0, 255, 255, 0.3)'
      ctx.fillRect(0, 0, 10, CANVAS_HEIGHT)
      ctx.fillRect(CANVAS_WIDTH - 10, 0, 10, CANVAS_HEIGHT)
      break
      
    case 'pillars':
      // Ancient stone pillars
      ctx.fillStyle = '#5a4a3a'
      ctx.fillRect(50, 200, 40, 210)
      ctx.fillRect(710, 200, 40, 210)
      // Pillar tops
      ctx.fillStyle = '#6a5a4a'
      ctx.fillRect(40, 180, 60, 30)
      ctx.fillRect(700, 180, 60, 30)
      // Cracks
      ctx.strokeStyle = '#3a2a1a'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(70, 220)
      ctx.lineTo(60, 280)
      ctx.lineTo(75, 350)
      ctx.stroke()
      break
      
    case 'ice':
      // Ice crystals
      ctx.fillStyle = 'rgba(170, 220, 255, 0.4)'
      const icePositions = [[80, 300], [720, 280], [400, 320]]
      icePositions.forEach(([x, y]) => {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - 15, y + 60)
        ctx.lineTo(x + 15, y + 60)
        ctx.closePath()
        ctx.fill()
      })
      // Frost overlay at edges
      const frostGradient = ctx.createLinearGradient(0, 0, 100, 0)
      frostGradient.addColorStop(0, 'rgba(200, 230, 255, 0.3)')
      frostGradient.addColorStop(1, 'transparent')
      ctx.fillStyle = frostGradient
      ctx.fillRect(0, 0, 100, CANVAS_HEIGHT)
      break
      
    case 'lightning':
      // Random lightning flashes
      if (Math.random() < 0.02) {
        ctx.fillStyle = 'rgba(170, 0, 255, 0.3)'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      }
      // Electric arcs on sides
      ctx.strokeStyle = '#aa00ff'
      ctx.shadowColor = '#aa00ff'
      ctx.shadowBlur = 15
      ctx.lineWidth = 2
      const time = Date.now() / 100
      ctx.beginPath()
      ctx.moveTo(30, 100)
      for (let y = 100; y < 350; y += 20) {
        ctx.lineTo(30 + Math.sin(y/20 + time) * 15, y)
      }
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(770, 100)
      for (let y = 100; y < 350; y += 20) {
        ctx.lineTo(770 + Math.sin(y/20 + time + 2) * 15, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
      break
      
    case 'dojo':
      // Wooden posts
      ctx.fillStyle = '#4a3020'
      ctx.fillRect(60, 250, 25, 160)
      ctx.fillRect(715, 250, 25, 160)
      // Banners
      ctx.fillStyle = '#aa2222'
      ctx.fillRect(55, 150, 35, 100)
      ctx.fillRect(710, 150, 35, 100)
      // Banner symbols
      ctx.fillStyle = '#ffcc00'
      ctx.font = '24px serif'
      ctx.fillText('武', 62, 210)
      ctx.fillText('道', 717, 210)
      break
      
    case 'space':
      // Stars in background
      ctx.fillStyle = '#ffffff'
      for (let i = 0; i < 100; i++) {
        const x = (i * 37) % CANVAS_WIDTH
        const y = (i * 23) % CANVAS_HEIGHT
        const size = (i % 3) + 1
        ctx.fillRect(x, y, size, size)
      }
      // Earth in background
      ctx.fillStyle = '#2244aa'
      ctx.beginPath()
      ctx.arc(-100, CANVAS_HEIGHT + 200, 350, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#44aa44'
      ctx.beginPath()
      ctx.arc(-80, CANVAS_HEIGHT + 180, 100, 0, Math.PI * 2)
      ctx.fill()
      break
      
    case 'vines':
      // Hanging vines
      ctx.strokeStyle = '#228822'
      ctx.lineWidth = 4
      const vinePositions = [50, 200, 400, 600, 750]
      vinePositions.forEach((x, i) => {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        const length = 100 + (i % 3) * 50
        for (let y = 0; y < length; y += 20) {
          ctx.lineTo(x + Math.sin(y/30 + Date.now()/1000) * 10, y)
        }
        ctx.stroke()
        // Leaves
        ctx.fillStyle = '#44cc44'
        ctx.beginPath()
        ctx.ellipse(x + 5, length - 10, 8, 15, 0.3, 0, Math.PI * 2)
        ctx.fill()
      })
      break
  }
}

function renderArenaParticles(arena) {
  arenaParticles.value.forEach(p => {
    ctx.globalAlpha = p.alpha * (0.5 + Math.sin(p.flicker) * 0.3)
    
    switch (arena.particles) {
      case 'embers':
        ctx.fillStyle = `hsl(${20 + Math.random() * 20}, 100%, 50%)`
        break
      case 'snow':
        ctx.fillStyle = '#ffffff'
        break
      case 'data':
        ctx.fillStyle = '#00ffff'
        break
      case 'dust':
        ctx.fillStyle = '#c9a227'
        break
      case 'sparks':
        ctx.fillStyle = '#aa00ff'
        break
      case 'petals':
        ctx.fillStyle = '#ffaacc'
        break
      case 'stars':
        ctx.fillStyle = '#ffffff'
        break
      case 'fireflies':
        ctx.fillStyle = '#aaffaa'
        ctx.shadowColor = '#aaffaa'
        ctx.shadowBlur = 10
        break
      default:
        ctx.fillStyle = '#ffffff'
    }
    
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  })
  ctx.globalAlpha = 1
}

function startRoundTimer() {
  roundTimerInterval = setInterval(() => {
    if (gameActive.value && roundTime.value > 0) {
      roundTime.value--
      if (roundTime.value <= 0) {
        endRoundByTimeout()
      }
    }
  }, 1000)
}

function stopRoundTimer() {
  if (roundTimerInterval) {
    clearInterval(roundTimerInterval)
    roundTimerInterval = null
  }
}

function endRoundByTimeout() {
  // Higher health wins
  if (player.value.health > enemy.value.health) {
    endRound('player')
  } else if (enemy.value.health > player.value.health) {
    endRound('opponent')
  } else {
    // Tie goes to player
    endRound('player')
  }
}

function startGameLoop() {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  lastTime = performance.now()
  gameLoop()
}

function gameLoop(currentTime = performance.now()) {
  const deltaTime = (currentTime - lastTime) / 16.67 // Normalize to ~60fps
  lastTime = currentTime
  
  if (gameActive.value) {
    update(deltaTime)
    checkCollisions()
    updateAI(deltaTime)
  }
  
  render()
  animationId = requestAnimationFrame(gameLoop)
}

function stopGame() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  stopRoundTimer()
}

function update(dt) {
  updateFighter(player.value, dt, true)
  updateFighter(enemy.value, dt, false)
  updateProjectiles(dt)
}

function updateFighter(fighter, dt, isPlayer) {
  if (!fighter) return
  
  // Reduce cooldowns
  fighter.attackCooldown = Math.max(0, fighter.attackCooldown - dt * 16.67)
  fighter.specialCooldown = Math.max(0, fighter.specialCooldown - dt * 16.67)
  fighter.stateTimer = Math.max(0, fighter.stateTimer - dt * 16.67)
  
  // State recovery
  if (fighter.stateTimer <= 0 && ['punch', 'kick', 'hit', 'special'].includes(fighter.state)) {
    fighter.state = 'idle'
  }
  
  // Player controls
  if (isPlayer && !['punch', 'kick', 'hit', 'special'].includes(fighter.state)) {
    const speed = fighter.stats.speed
    
    // Movement
    if (keys.value['a'] || keys.value['arrowleft']) {
      fighter.vx = -speed
      fighter.facingRight = false
      if (fighter.y >= GROUND_Y) fighter.state = 'walk'
    } else if (keys.value['d'] || keys.value['arrowright']) {
      fighter.vx = speed
      fighter.facingRight = true
      if (fighter.y >= GROUND_Y) fighter.state = 'walk'
    } else {
      fighter.vx = 0
      if (fighter.y >= GROUND_Y && fighter.state === 'walk') fighter.state = 'idle'
    }
    
    // Jump
    if ((keys.value['w'] || keys.value['arrowup']) && fighter.y >= GROUND_Y) {
      fighter.vy = JUMP_FORCE
      fighter.state = 'jump'
    }
    
    // Block
    fighter.isBlocking = keys.value['s'] || keys.value['arrowdown']
    if (fighter.isBlocking && fighter.y >= GROUND_Y) {
      fighter.state = 'block'
      fighter.vx = 0
    }
  }
  
  // Physics
  fighter.vy += GRAVITY * dt
  fighter.x += fighter.vx * dt
  fighter.y += fighter.vy * dt
  
  // Ground collision
  if (fighter.y >= GROUND_Y) {
    fighter.y = GROUND_Y
    fighter.vy = 0
    if (fighter.state === 'jump') fighter.state = 'idle'
  }
  
  // Boundaries
  fighter.x = Math.max(30, Math.min(CANVAS_WIDTH - 30, fighter.x))
  
  // Face opponent
  if (isPlayer && fighter.state === 'idle') {
    fighter.facingRight = fighter.x < enemy.value.x
  }
}

function updateProjectiles(dt) {
  projectiles.value = projectiles.value.filter(p => {
    p.x += p.vx * dt
    return p.x > 0 && p.x < CANVAS_WIDTH
  })
}

function handleCanvasClick(e) {
  if (!gameActive.value || !player.value) return
  if (['punch', 'kick', 'hit', 'special'].includes(player.value.state)) return
  if (player.value.attackCooldown > 0) return
  
  // Punch attack
  player.value.state = 'punch'
  player.value.stateTimer = 300
  player.value.attackCooldown = 400
  playSound('punch')
  
  // Check hit
  const range = 70
  const dx = enemy.value.x - player.value.x
  if (Math.abs(dx) < range && Math.abs(enemy.value.y - player.value.y) < 50) {
    dealDamage(enemy.value, player.value.stats.damage, player.value)
  }
}

function handleRightClick(e) {
  e.preventDefault()
  if (!gameActive.value || !player.value) return
  performKick()
}

function handleKeyAction(e) {
  if (!gameActive.value || !player.value) return
  
  if (e.code === 'Space') {
    performKick()
  } else if ((e.key === 'q' || e.key === 'Q' || e.shiftKey) && player.value.specialCooldown <= 0) {
    performSpecial(player.value, enemy.value)
  }
}

function performKick() {
  if (['punch', 'kick', 'hit', 'special'].includes(player.value.state)) return
  if (player.value.attackCooldown > 0) return
  
  player.value.state = 'kick'
  player.value.stateTimer = 400
  player.value.attackCooldown = 500
  playSound('kick')
  
  const range = 80
  const dx = enemy.value.x - player.value.x
  if (Math.abs(dx) < range && Math.abs(enemy.value.y - player.value.y) < 50) {
    dealDamage(enemy.value, player.value.stats.damage * 1.2, player.value)
  }
}

function performSpecial(attacker, target) {
  if (attacker.specialCooldown > 0) return
  
  attacker.state = 'special'
  attacker.stateTimer = 500
  attacker.specialCooldown = attacker.special.cooldown
  playSound('special')
  
  const special = attacker.special
  
  if (special.type === 'projectile') {
    projectiles.value.push({
      x: attacker.x + (attacker.facingRight ? 30 : -30),
      y: attacker.y - 40,
      vx: attacker.facingRight ? 12 : -12,
      color: special.color,
      damage: special.damage,
      owner: attacker.isPlayer ? 'player' : 'enemy'
    })
  } else if (special.type === 'melee' || special.type === 'dash') {
    const range = special.type === 'dash' ? 150 : 90
    const dx = target.x - attacker.x
    if (Math.abs(dx) < range) {
      dealDamage(target, special.damage, attacker)
    }
    if (special.type === 'dash') {
      attacker.x += attacker.facingRight ? 100 : -100
    }
  } else if (special.type === 'aoe') {
    const range = 120
    const dx = target.x - attacker.x
    if (Math.abs(dx) < range) {
      dealDamage(target, special.damage, attacker)
    }
  } else if (special.type === 'instant') {
    dealDamage(target, special.damage, attacker)
  }
}

function dealDamage(target, damage, attacker) {
  let actualDamage = damage
  
  if (target.isBlocking) {
    actualDamage = Math.floor(damage * 0.3)
    target.state = 'block'
  } else {
    target.state = 'hit'
    target.stateTimer = 200
    // Knockback
    target.vx = attacker.facingRight ? 5 : -5
  }
  
  actualDamage = Math.max(1, actualDamage - target.stats.defense / 2)
  target.health = Math.max(0, target.health - actualDamage)
  
  playSound('hit')
  
  if (target.health <= 0) {
    endRound(target.isPlayer ? 'opponent' : 'player')
  }
}

function checkCollisions() {
  // Projectile collisions
  projectiles.value = projectiles.value.filter(p => {
    const target = p.owner === 'player' ? enemy.value : player.value
    const dx = Math.abs(p.x - target.x)
    const dy = Math.abs(p.y - (target.y - 40))
    
    if (dx < 30 && dy < 50) {
      const attacker = p.owner === 'player' ? player.value : enemy.value
      dealDamage(target, p.damage, attacker)
      return false
    }
    return true
  })
}

// AI System
function updateAI(dt) {
  if (!enemy.value || !player.value) return
  if (['punch', 'kick', 'hit', 'special'].includes(enemy.value.state)) return
  
  const dx = player.value.x - enemy.value.x
  const distance = Math.abs(dx)
  const speed = enemy.value.stats.speed * 0.8
  
  // Face player
  enemy.value.facingRight = dx > 0
  
  // AI decision making
  const rand = Math.random()
  
  if (distance > 150) {
    // Approach
    enemy.value.vx = dx > 0 ? speed : -speed
    enemy.value.state = 'walk'
  } else if (distance > 80) {
    // Mid range - maybe use special or approach
    if (enemy.value.specialCooldown <= 0 && rand < 0.02) {
      performSpecial(enemy.value, player.value)
    } else if (rand < 0.03) {
      enemy.value.vx = dx > 0 ? speed : -speed
    } else {
      enemy.value.vx = 0
      enemy.value.state = 'idle'
    }
  } else {
    // Close range - attack or block
    enemy.value.vx = 0
    
    if (player.value.state === 'punch' || player.value.state === 'kick') {
      // Try to block
      if (rand < 0.4) {
        enemy.value.isBlocking = true
        enemy.value.state = 'block'
      }
    } else {
      enemy.value.isBlocking = false
      
      if (enemy.value.attackCooldown <= 0) {
        if (rand < 0.03) {
          // Punch
          enemy.value.state = 'punch'
          enemy.value.stateTimer = 300
          enemy.value.attackCooldown = 500
          
          if (distance < 70 && Math.abs(player.value.y - enemy.value.y) < 50) {
            dealDamage(player.value, enemy.value.stats.damage, enemy.value)
          }
        } else if (rand < 0.05) {
          // Kick
          enemy.value.state = 'kick'
          enemy.value.stateTimer = 400
          enemy.value.attackCooldown = 600
          
          if (distance < 80 && Math.abs(player.value.y - enemy.value.y) < 50) {
            dealDamage(player.value, enemy.value.stats.damage * 1.2, enemy.value)
          }
        }
      }
    }
  }
  
  // Random jump
  if (rand < 0.005 && enemy.value.y >= GROUND_Y) {
    enemy.value.vy = JUMP_FORCE
    enemy.value.state = 'jump'
  }
}

function endRound(winner) {
  gameActive.value = false
  stopGame()
  stopRoundTimer()
  roundWinner.value = winner
  
  if (winner === 'player') {
    playerRounds.value++
    playSound('win')
  } else {
    opponentRounds.value++
    playSound('lose')
  }
  
  // Check for match end
  if (playerRounds.value >= 3 || opponentRounds.value >= 3) {
    matchWinner.value = playerRounds.value >= 3 ? 'player' : 'opponent'
    gamePhase.value = 'matchEnd'
    recordMatch(matchWinner.value === 'player')
  } else {
    gamePhase.value = 'roundEnd'
  }
}

async function recordMatch(isWin) {
  if (!authStore.isLoggedIn) return
  
  if (isWin) {
    const result = await streaksStore.recordWin(STREAK_LEVEL)
    if (result?.isNewRecord) {
      newRecord.value = true
      setTimeout(() => { newRecord.value = false }, 3000)
    }
  } else {
    await streaksStore.recordLoss(STREAK_LEVEL)
  }
}

function nextRound() {
  startRound()
}

function backToSelect() {
  gamePhase.value = 'select'
  selectedCharacter.value = null
  opponent.value = null
  newRecord.value = false
}

// Rendering
function render() {
  if (!ctx) return
  
  // Update and render arena with cool background
  updateArenaParticles()
  renderArena()
  
  if (player.value) renderFighter(player.value)
  if (enemy.value) renderFighter(enemy.value)
  
  // Projectiles
  projectiles.value.forEach(p => {
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2)
    ctx.fill()
    
    // Glow
    ctx.shadowColor = p.color
    ctx.shadowBlur = 15
    ctx.fill()
    ctx.shadowBlur = 0
  })
  
  // UI
  renderUI()
}

function renderFighter(fighter) {
  const x = fighter.x
  const y = fighter.y
  const facing = fighter.facingRight ? 1 : -1
  
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(facing, 1)
  
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.beginPath()
  ctx.ellipse(0, 60, 25, 8, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Body color based on state
  let bodyColor = fighter.color
  if (fighter.state === 'hit') {
    bodyColor = '#ff0000'
  } else if (fighter.state === 'block') {
    bodyColor = '#888888'
  }
  
  // Legs
  ctx.fillStyle = '#333355'
  const legOffset = fighter.state === 'walk' ? Math.sin(Date.now() / 100) * 8 : 0
  const kickOffset = fighter.state === 'kick' ? 25 : 0
  
  // Left leg
  ctx.fillRect(-12, 20, 10, 40 + legOffset)
  // Right leg
  ctx.fillRect(2, 20, 10 + kickOffset, 40 - legOffset)
  
  // Body
  ctx.fillStyle = bodyColor
  ctx.fillRect(-18, -30, 36, 55)
  
  // Arms
  const punchOffset = fighter.state === 'punch' ? 25 : 0
  
  // Left arm
  ctx.fillRect(-28, -20, 12, 35)
  // Right arm (punch arm)
  ctx.fillRect(16, -20, 12 + punchOffset, 35)
  
  // Head
  ctx.fillStyle = fighter.skinTone
  ctx.beginPath()
  ctx.arc(0, -45, 20, 0, Math.PI * 2)
  ctx.fill()
  
  // Eyes
  ctx.fillStyle = '#000'
  ctx.fillRect(-8, -50, 5, 5)
  ctx.fillRect(3, -50, 5, 5)
  
  // Special effect
  if (fighter.state === 'special') {
    ctx.strokeStyle = fighter.special.color
    ctx.lineWidth = 3
    ctx.shadowColor = fighter.special.color
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.arc(0, -10, 40, 0, Math.PI * 2)
    ctx.stroke()
    ctx.shadowBlur = 0
  }
  
  ctx.restore()
}

function renderUI() {
  if (!player.value || !enemy.value) return
  
  const arena = arenas[currentArena.value]
  
  // Arena name at top center
  ctx.font = 'bold 12px Courier New'
  ctx.fillStyle = arena.groundLineColor
  ctx.textAlign = 'center'
  ctx.fillText(arena.name.toUpperCase(), CANVAS_WIDTH / 2, 15)
  ctx.textAlign = 'left'
  
  // Health bars background
  ctx.fillStyle = '#333'
  ctx.fillRect(20, 20, 300, 25)
  ctx.fillRect(CANVAS_WIDTH - 320, 20, 300, 25)
  
  // Player health
  const playerHealthWidth = (player.value.health / player.value.maxHealth) * 296
  ctx.fillStyle = player.value.health > 30 ? '#00ff00' : '#ff0000'
  ctx.fillRect(22, 22, playerHealthWidth, 21)
  
  // Enemy health
  const enemyHealthWidth = (enemy.value.health / enemy.value.maxHealth) * 296
  ctx.fillStyle = enemy.value.health > 30 ? '#00ff00' : '#ff0000'
  ctx.fillRect(CANVAS_WIDTH - 318, 22, enemyHealthWidth, 21)
  
  // Names
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 14px Courier New'
  ctx.fillText(player.value.name, 22, 60)
  ctx.fillText(enemy.value.name, CANVAS_WIDTH - 100, 60)
  
  // Round timer
  ctx.font = 'bold 30px Courier New'
  ctx.fillStyle = roundTime.value <= 10 ? '#ff0000' : '#ffffff'
  ctx.textAlign = 'center'
  ctx.fillText(roundTime.value.toString(), CANVAS_WIDTH / 2, 45)
  ctx.textAlign = 'left'
  
  // Round indicators
  ctx.font = '20px Courier New'
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < playerRounds.value ? '#00ff00' : '#444'
    ctx.fillText('●', 22 + i * 25, 85)
    
    ctx.fillStyle = i < opponentRounds.value ? '#ff0000' : '#444'
    ctx.fillText('●', CANVAS_WIDTH - 82 + i * 25, 85)
  }
  
  // Countdown
  if (countdown.value > 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    ctx.fillStyle = '#ffff00'
    ctx.font = 'bold 120px Courier New'
    ctx.textAlign = 'center'
    ctx.fillText(countdown.value.toString(), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40)
    ctx.textAlign = 'left'
  }
  
  // Special meter
  if (player.value.specialCooldown <= 0) {
    ctx.fillStyle = player.value.special.color
    ctx.font = 'bold 12px Courier New'
    ctx.fillText('⚡ SPECIAL READY (Q)', 22, CANVAS_HEIGHT - 20)
  }
}

// Sound effects
function playSound(type) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  
  switch (type) {
    case 'punch':
      osc.frequency.value = 150
      osc.type = 'square'
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.1)
      break
    case 'kick':
      osc.frequency.value = 100
      osc.type = 'sawtooth'
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.15)
      break
    case 'hit':
      osc.frequency.value = 200
      osc.type = 'square'
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.08)
      break
    case 'special':
      osc.frequency.setValueAtTime(300, audioCtx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.2)
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.3)
      break
    case 'win':
      const notes = [523.25, 659.25, 783.99, 1046.50]
      notes.forEach((freq, i) => {
        const o = audioCtx.createOscillator()
        const g = audioCtx.createGain()
        o.connect(g)
        g.connect(audioCtx.destination)
        o.frequency.value = freq
        o.type = 'square'
        const t = audioCtx.currentTime + i * 0.15
        g.gain.setValueAtTime(0.1, t)
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.2)
        o.start(t)
        o.stop(t + 0.2)
      })
      break
    case 'lose':
      const loseNotes = [392, 349, 311, 261]
      loseNotes.forEach((freq, i) => {
        const o = audioCtx.createOscillator()
        const g = audioCtx.createGain()
        o.connect(g)
        g.connect(audioCtx.destination)
        o.frequency.value = freq
        o.type = 'sawtooth'
        const t = audioCtx.currentTime + i * 0.2
        g.gain.setValueAtTime(0.08, t)
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.25)
        o.start(t)
        o.stop(t + 0.25)
      })
      break
  }
}
</script>

<template>
  <div class="battlefields-wrapper">
    <div class="lightning-bg"></div>
    <div class="bolt bolt-1">⚡</div>
    <div class="bolt bolt-2">⚡</div>
    
    <div class="container">
      <h1>⚔️ BATTLEFIELDS ⚔️</h1>
      
      <!-- Character Select -->
      <template v-if="gamePhase === 'select'">
        <p class="subtitle">Choose your fighter!</p>
        
        <div v-if="authStore.isLoggedIn" class="streak-display">
          <div class="streak-item">
            <span class="streak-label">🔥 Streak</span>
            <span class="streak-value">{{ currentStreak.current }}</span>
          </div>
          <div class="streak-item">
            <span class="streak-label">🏆 Best</span>
            <span class="streak-value best">{{ currentStreak.max }}</span>
          </div>
        </div>
        <div v-else class="streak-display guest" @click="showSignInModal = true">
          <span class="streak-hint">Sign in to track your streak!</span>
        </div>
        
        <SignInModal :show="showSignInModal" @close="showSignInModal = false" />
        
        <div class="character-grid">
          <div
            v-for="char in characters"
            :key="char.id"
            class="character-card"
            :class="{ selected: selectedCharacter?.id === char.id }"
            :style="{ borderColor: char.color, '--char-color': char.color }"
            @click="selectCharacter(char)"
          >
            <div class="char-avatar" :style="{ backgroundColor: char.color }">
              <div class="char-head" :style="{ backgroundColor: char.skinTone }"></div>
            </div>
            <span class="char-name">{{ char.name }}</span>
          </div>
        </div>
        
        <div v-if="selectedCharacter" class="selected-info">
          <h3 :style="{ color: selectedCharacter.color }">{{ selectedCharacter.name }}</h3>
          <div class="stats-grid">
            <div class="stat">
              <span>❤️ HP</span>
              <div class="stat-bar">
                <div class="stat-fill" :style="{ width: selectedCharacter.stats.health + '%' }"></div>
              </div>
            </div>
            <div class="stat">
              <span>⚡ SPD</span>
              <div class="stat-bar">
                <div class="stat-fill" :style="{ width: selectedCharacter.stats.speed * 10 + '%' }"></div>
              </div>
            </div>
            <div class="stat">
              <span>👊 DMG</span>
              <div class="stat-bar">
                <div class="stat-fill" :style="{ width: selectedCharacter.stats.damage * 6 + '%' }"></div>
              </div>
            </div>
            <div class="stat">
              <span>🛡️ DEF</span>
              <div class="stat-bar">
                <div class="stat-fill" :style="{ width: selectedCharacter.stats.defense * 6 + '%' }"></div>
              </div>
            </div>
          </div>
          <p class="special-info">
            Special: <span :style="{ color: selectedCharacter.special.color }">{{ selectedCharacter.special.name }}</span>
          </p>
          <button class="fight-btn" @click="startMatch">FIGHT!</button>
        </div>
        
        <div class="controls-info">
          <h4>Controls</h4>
          <p>WASD / Arrows: Move & Jump</p>
          <p>Click: Punch | Space: Kick | Q: Special</p>
        </div>
      </template>
      
      <!-- Fight Phase -->
      <template v-if="gamePhase === 'fight'">
        <canvas
          ref="canvasRef"
          :width="CANVAS_WIDTH"
          :height="CANVAS_HEIGHT"
          class="game-canvas"
          @click="handleCanvasClick"
          @contextmenu="handleRightClick"
          @keydown="handleKeyAction"
          tabindex="0"
        ></canvas>
      </template>
      
      <!-- Round End -->
      <template v-if="gamePhase === 'roundEnd'">
        <div class="round-result">
          <h2 :class="roundWinner === 'player' ? 'win-text' : 'lose-text'">
            {{ roundWinner === 'player' ? 'Round Won!' : 'Round Lost!' }}
          </h2>
          <div class="score-display">
            <span class="player-score">{{ playerRounds }}</span>
            <span class="vs">-</span>
            <span class="enemy-score">{{ opponentRounds }}</span>
          </div>
          <p>First to 3 wins!</p>
          <button class="fight-btn" @click="nextRound">Next Round</button>
        </div>
      </template>
      
      <!-- Match End -->
      <template v-if="gamePhase === 'matchEnd'">
        <div class="match-result">
          <h2 :class="matchWinner === 'player' ? 'win-text' : 'lose-text'">
            {{ matchWinner === 'player' ? '🏆 VICTORY! 🏆' : '💀 DEFEAT 💀' }}
          </h2>
          <div class="score-display">
            <span class="player-score">{{ playerRounds }}</span>
            <span class="vs">-</span>
            <span class="enemy-score">{{ opponentRounds }}</span>
          </div>
          
          <div v-if="authStore.isLoggedIn" class="streak-display">
            <div class="streak-item">
              <span class="streak-label">🔥 Streak</span>
              <span class="streak-value" :class="{ 'new-record': newRecord }">{{ currentStreak.current }}</span>
            </div>
            <div class="streak-item">
              <span class="streak-label">🏆 Best</span>
              <span class="streak-value best">{{ currentStreak.max }}</span>
            </div>
          </div>
          
          <button class="fight-btn" @click="backToSelect">Play Again</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.battlefields-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Courier New', monospace;
  color: #ff6600;
  text-shadow: 0 0 10px #ff6600, 0 0 20px #ff6600;
  padding: 20px;
  position: relative;
}

.lightning-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: 
    linear-gradient(135deg, transparent 40%, rgba(255, 102, 0, 0.03) 50%, transparent 60%),
    linear-gradient(-135deg, transparent 40%, rgba(255, 0, 0, 0.03) 50%, transparent 60%);
  z-index: 0;
}

.bolt {
  position: fixed;
  font-size: 15rem;
  opacity: 0.03;
  z-index: 0;
  pointer-events: none;
}

.bolt-1 { 
  top: 10%; 
  left: 5%; 
  transform: rotate(-15deg); 
  color: #ff6600;
}

.bolt-2 { 
  bottom: 10%; 
  right: 5%; 
  transform: rotate(15deg); 
  color: #ff0000;
}

.container {
  text-align: center;
  padding: 30px;
  background: rgba(10, 10, 30, 0.95);
  border-radius: 20px;
  position: relative;
  max-width: 900px;
  width: 100%;
}

.container::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: conic-gradient(from 0deg, #ff6600, #ff0000, #ff6600);
  border-radius: 22px;
  z-index: -1;
  animation: rotateBorder 3s linear infinite;
}

@keyframes rotateBorder {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

h1 {
  font-size: 2.2em;
  margin-bottom: 10px;
  letter-spacing: 4px;
  background: linear-gradient(90deg, #ff6600, #ff0000, #ff6600);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

.subtitle {
  font-size: 1.2em;
  margin-bottom: 15px;
  opacity: 0.9;
}

.streak-display {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  padding: 12px 20px;
  border: 2px solid #ff9900;
  border-radius: 10px;
  background: rgba(255, 153, 0, 0.1);
}

.streak-display.guest {
  cursor: pointer;
  transition: all 0.3s ease;
}

.streak-display.guest:hover {
  background: rgba(255, 153, 0, 0.2);
  transform: scale(1.02);
}

.streak-hint {
  color: #ff9900;
  font-weight: bold;
  text-transform: uppercase;
}

.streak-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.streak-label {
  font-size: 0.85em;
  color: #ff9900;
}

.streak-value {
  font-size: 1.8em;
  font-weight: bold;
  color: #ff9900;
  text-shadow: 0 0 10px #ff9900;
}

.streak-value.best {
  color: #ffd700;
  text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700;
}

.streak-value.new-record {
  animation: newRecord 0.5s ease-in-out 3;
}

@keyframes newRecord {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); color: #00ff00; }
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 20px;
  max-height: 320px;
  overflow-y: auto;
  padding: 10px;
}

.character-card {
  background: rgba(30, 30, 50, 0.8);
  border: 2px solid #444;
  border-radius: 10px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.character-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px var(--char-color);
}

.character-card.selected {
  border-width: 3px;
  box-shadow: 0 0 20px var(--char-color);
}

.char-avatar {
  width: 40px;
  height: 50px;
  border-radius: 5px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 5px;
}

.char-head {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.char-name {
  font-size: 0.7em;
  color: #fff;
  text-shadow: none;
}

.selected-info {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.selected-info h3 {
  margin-bottom: 15px;
  font-size: 1.5em;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat span {
  width: 70px;
  text-align: left;
  font-size: 0.9em;
}

.stat-bar {
  flex: 1;
  height: 12px;
  background: #333;
  border-radius: 6px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6600, #ff9900);
  border-radius: 6px;
  transition: width 0.3s;
}

.special-info {
  font-size: 1em;
  margin-bottom: 15px;
}

.fight-btn {
  font-family: 'Courier New', monospace;
  font-size: 1.3em;
  padding: 15px 50px;
  background: linear-gradient(90deg, #ff6600, #ff0000);
  color: #fff;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  transition: all 0.3s;
}

.fight-btn:hover {
  box-shadow: 0 0 30px #ff6600;
  transform: scale(1.05);
}

.controls-info {
  margin-top: 15px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  font-size: 0.9em;
}

.controls-info h4 {
  margin-bottom: 8px;
  color: #ff9900;
}

.controls-info p {
  margin: 4px 0;
  color: #ccc;
  text-shadow: none;
}

.game-canvas {
  border: 3px solid #ff6600;
  border-radius: 10px;
  cursor: crosshair;
  outline: none;
}

.round-result, .match-result {
  padding: 40px;
}

.win-text {
  color: #00ff00;
  font-size: 2.5em;
  text-shadow: 0 0 20px #00ff00;
}

.lose-text {
  color: #ff0000;
  font-size: 2.5em;
  text-shadow: 0 0 20px #ff0000;
}

.score-display {
  font-size: 3em;
  margin: 20px 0;
}

.player-score {
  color: #00ff00;
}

.vs {
  color: #888;
  margin: 0 20px;
}

.enemy-score {
  color: #ff0000;
}

@media (max-width: 600px) {
  .character-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .game-canvas {
    max-width: 100%;
    height: auto;
  }
}
</style>
