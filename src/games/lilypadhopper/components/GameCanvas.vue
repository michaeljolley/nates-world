<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  isPlaying: Boolean,
  difficulty: Object
})

const emit = defineEmits(['jump', 'fall'])

const canvasRef = ref(null)
const frog = ref({ x: 300, y: 450, isJumping: false, angle: 0 }) // angle: -1 (left), 0 (straight), 1 (right)
const lilyPads = ref([])
const showSplash = ref(false)
const aimDirection = ref(0) // -1 left, 0 center, 1 right

let animationId = null
let padIdCounter = 0
let spawnTimer = null

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 500
const FROG_SIZE = 50
const JUMP_DISTANCE = 80
const JUMP_DURATION = 300

// Create a lily pad at random position
function createLilyPad(forceY = null) {
  const id = padIdCounter++
  const size = 50 + Math.random() * 30 // 50-80px
  const x = Math.random() * (CANVAS_WIDTH - size) + size / 2
  const y = forceY !== null ? forceY : -size // Start above screen
  
  // Drift speed - moves down and slightly sideways
  const driftSpeed = (props.difficulty?.driftSpeed || 0.5) + Math.random() * 0.3
  
  return {
    id,
    x,
    y,
    size,
    driftSpeedY: driftSpeed, // Move down
    driftSpeedX: (Math.random() - 0.5) * 0.5, // Slight horizontal drift
    rotation: Math.random() * 360,
    hasFlower: Math.random() > 0.7
  }
}

// Initialize game with lily pads scattered everywhere
function initGame() {
  lilyPads.value = []
  showSplash.value = false
  padIdCounter = 0
  
  // Create starting pad under frog
  const startPad = {
    id: padIdCounter++,
    x: 300,
    y: 450,
    size: 80,
    driftSpeedY: 0, // Starting pad doesn't move initially
    driftSpeedX: 0,
    rotation: 0,
    hasFlower: false,
    isStartPad: true
  }
  lilyPads.value.push(startPad)
  
  // Scatter lily pads all over the screen
  for (let i = 0; i < 12; i++) {
    const pad = createLilyPad()
    // Distribute across screen initially
    pad.y = Math.random() * (CANVAS_HEIGHT - 100) + 50
    lilyPads.value.push(pad)
  }
  
  // Position frog on starting pad
  frog.value = { 
    x: 300, 
    y: 450, 
    isJumping: false,
    jumpArc: 0
  }
  
  // Start spawning new pads
  startSpawning()
}

function startSpawning() {
  if (spawnTimer) clearInterval(spawnTimer)
  
  spawnTimer = setInterval(() => {
    if (props.isPlaying && !showSplash.value && lilyPads.value.length < 15) {
      lilyPads.value.push(createLilyPad())
    }
  }, 1500)
}

function handleJump() {
  if (!props.isPlaying || frog.value.isJumping || showSplash.value) return
  
  // Calculate jump target based on aim direction
  // Aim direction affects horizontal movement: -1 = left, 0 = straight, 1 = right
  const horizontalOffset = aimDirection.value * 60 // pixels left/right
  const targetX = frog.value.x + horizontalOffset
  const targetY = frog.value.y - JUMP_DISTANCE
  
  frog.value.isJumping = true
  frog.value.angle = aimDirection.value
  
  const startX = frog.value.x
  const startY = frog.value.y
  const startTime = Date.now()
  
  function animateJump() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(1, elapsed / JUMP_DURATION)
    
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 2)
    
    frog.value.x = startX + (targetX - startX) * eased
    frog.value.y = startY + (targetY - startY) * eased
    
    // Keep within bounds
    frog.value.x = Math.max(30, Math.min(CANVAS_WIDTH - 30, frog.value.x))
    
    // Arc effect
    const arcProgress = Math.sin(progress * Math.PI)
    frog.value.jumpArc = arcProgress * 30
    
    if (progress < 1) {
      requestAnimationFrame(animateJump)
    } else {
      frog.value.isJumping = false
      frog.value.jumpArc = 0
      frog.value.angle = 0
      checkLanding()
    }
  }
  
  requestAnimationFrame(animateJump)
}

function checkLanding() {
  // Check if frog landed on any lily pad
  let landedOnPad = false
  
  for (const pad of lilyPads.value) {
    const dx = frog.value.x - pad.x
    const dy = frog.value.y - pad.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    const landingRadius = pad.size / 2 + FROG_SIZE / 4
    
    if (dist <= landingRadius) {
      landedOnPad = true
      emit('jump')
      break
    }
  }
  
  if (!landedOnPad) {
    // Fell in water!
    showSplash.value = true
    if (spawnTimer) clearInterval(spawnTimer)
    emit('fall')
  }
}

function updatePads() {
  lilyPads.value.forEach((pad) => {
    // Move pads down (and slightly sideways)
    pad.y += pad.driftSpeedY
    pad.x += pad.driftSpeedX
    
    // Slight rotation
    pad.rotation += 0.2
    
    // Bounce off side edges
    if (pad.x < pad.size / 2 || pad.x > CANVAS_WIDTH - pad.size / 2) {
      pad.driftSpeedX *= -1
    }
  })
  
  // Remove pads that have drifted off the bottom
  lilyPads.value = lilyPads.value.filter(pad => pad.y < CANVAS_HEIGHT + 100)
  
  // Start pad begins drifting after a moment
  const startPad = lilyPads.value.find(p => p.isStartPad)
  if (startPad && startPad.driftSpeedY === 0) {
    // Start drifting after 2 seconds
    setTimeout(() => {
      if (startPad) {
        startPad.driftSpeedY = 0.3
        startPad.isStartPad = false
      }
    }, 2000)
  }
}

// Game loop
let lastTime = 0
function gameLoop(timestamp) {
  if (props.isPlaying && !showSplash.value) {
    updatePads()
    
    // Check if frog is still on a pad (pad might have drifted away)
    if (!frog.value.isJumping) {
      let onPad = false
      for (const pad of lilyPads.value) {
        const dx = frog.value.x - pad.x
        const dy = frog.value.y - pad.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist <= pad.size / 2 + FROG_SIZE / 4) {
          onPad = true
          // Move frog with the pad
          frog.value.x += pad.driftSpeedX
          frog.value.y += pad.driftSpeedY
          break
        }
      }
      
      // If frog drifted off screen or off pad, game over
      if (!onPad || frog.value.y > CANVAS_HEIGHT - 20) {
        showSplash.value = true
        if (spawnTimer) clearInterval(spawnTimer)
        emit('fall')
      }
    }
  }
  
  animationId = requestAnimationFrame(gameLoop)
}

// Keyboard handler
function handleKeyDown(e) {
  if (!props.isPlaying || showSplash.value) return
  
  if (e.code === 'Space') {
    e.preventDefault()
    handleJump()
  } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    e.preventDefault()
    aimDirection.value = -1
  } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    e.preventDefault()
    aimDirection.value = 1
  }
}

function handleKeyUp(e) {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'ArrowRight' || e.code === 'KeyD') {
    aimDirection.value = 0
  }
}

watch(() => props.isPlaying, (playing) => {
  if (playing) {
    initGame()
  }
})

onMounted(() => {
  animationId = requestAnimationFrame(gameLoop)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (spawnTimer) clearInterval(spawnTimer)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="game-canvas" ref="canvasRef">
    <!-- Water background -->
    <div class="water">
      <div class="ripple ripple-1"></div>
      <div class="ripple ripple-2"></div>
      <div class="ripple ripple-3"></div>
      <div class="ripple ripple-4"></div>
    </div>
    
    <!-- Lily Pads -->
    <div
      v-for="pad in lilyPads"
      :key="pad.id"
      class="lily-pad"
      :style="{
        left: pad.x + 'px',
        top: pad.y + 'px',
        width: pad.size + 'px',
        height: pad.size + 'px',
        transform: `translate(-50%, -50%) rotate(${pad.rotation}deg)`
      }"
    >
      <div class="pad-base"></div>
      <div v-if="pad.hasFlower" class="flower">🌸</div>
    </div>
    
    <!-- Frog -->
    <div
      v-if="!showSplash"
      class="frog"
      :class="{ jumping: frog.isJumping }"
      :style="{
        left: frog.x + 'px',
        top: frog.y + 'px',
        transform: `translate(-50%, -50%) translateY(${-(frog.jumpArc || 0)}px) scale(${frog.isJumping ? 1.2 : 1})`
      }"
    >
      🐸
    </div>
    
    <!-- Splash effect -->
    <div
      v-if="showSplash"
      class="splash"
      :style="{ left: frog.x + 'px', top: frog.y + 'px' }"
    >
      💦
    </div>
    
    <!-- Jump prompt -->
    <div v-if="isPlaying && !frog.isJumping && !showSplash" class="jump-prompt">
      Press SPACE to jump forward!
    </div>
    
    <!-- Direction arrow -->
    <div v-if="isPlaying && !showSplash" class="direction-arrow">
      ⬆️
    </div>
  </div>
</template>

<style scoped>
.game-canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 500px;
  overflow: hidden;
  border-radius: 20px;
  border: 4px solid #2d5a27;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.water {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, 
    #0d3d4d 0%,
    #1a5f7a 30%, 
    #0d4d5d 70%,
    #082a35 100%
  );
}

.ripple {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  animation: rippleExpand 5s ease-out infinite;
}

.ripple-1 { left: 10%; top: 20%; animation-delay: 0s; }
.ripple-2 { left: 70%; top: 40%; animation-delay: 1.2s; }
.ripple-3 { left: 30%; top: 70%; animation-delay: 2.5s; }
.ripple-4 { left: 80%; top: 80%; animation-delay: 3.8s; }

@keyframes rippleExpand {
  0% { width: 0; height: 0; opacity: 0.6; }
  100% { width: 150px; height: 150px; opacity: 0; transform: translate(-50%, -50%); }
}

.lily-pad {
  position: absolute;
  pointer-events: none;
  transition: none;
}

.pad-base {
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 40% 40%,
    #5aac3d 0%,
    #3d7a2a 50%,
    #2a5a1a 100%
  );
  border-radius: 50%;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.4),
    inset 0 -5px 15px rgba(0, 0, 0, 0.3),
    inset 0 5px 15px rgba(255, 255, 255, 0.15);
}

.pad-base::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 50%;
  width: 30%;
  height: 60%;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 0 50% 50% 0;
  transform: translateX(-100%);
}

.flower {
  position: absolute;
  top: 5%;
  right: 10%;
  font-size: 1rem;
  animation: flowerBob 3s ease-in-out infinite;
}

@keyframes flowerBob {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(10deg); }
}

.frog {
  position: absolute;
  font-size: 2.8rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
  z-index: 10;
  transition: transform 0.1s ease-out;
}

.frog.jumping {
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.4));
}

.splash {
  position: absolute;
  font-size: 5rem;
  transform: translate(-50%, -50%);
  animation: splashAnim 0.8s ease-out forwards;
  z-index: 20;
}

@keyframes splashAnim {
  0% { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}

.jump-prompt {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: #88ff88;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  font-family: 'Arial', sans-serif;
  font-size: 0.95rem;
  font-weight: bold;
  animation: promptPulse 1.5s ease-in-out infinite;
  white-space: nowrap;
}

@keyframes promptPulse {
  0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
  50% { opacity: 1; transform: translateX(-50%) scale(1.05); }
}

.direction-arrow {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  opacity: 0.6;
  animation: arrowBounce 1s ease-in-out infinite;
}

@keyframes arrowBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-8px); }
}
</style>
