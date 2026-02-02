<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  onScore: {
    type: Function,
    required: true
  },
  onBombHit: {
    type: Function,
    required: true
  },
  onResetCombo: {
    type: Function,
    required: true
  }
})

const canvasRef = ref(null)
let ctx
let animationFrameId
let lastTime = 0

// Game objects
let fruits = []
let sliceTrail = []
let particles = []
let splashes = []

// Mouse/touch state
let isSlicing = false
let lastMousePos = { x: 0, y: 0 }
let mouseVelocity = { x: 0, y: 0 }

// Game timing
let spawnTimer = 0
let spawnInterval = 1.5
let gameTime = 0

// Fruit types
const FRUIT_TYPES = [
  { name: 'watermelon', emoji: '🍉', color: '#ff6b6b', points: 10, radius: 45 },
  { name: 'apple', emoji: '🍎', color: '#e74c3c', points: 15, radius: 35 },
  { name: 'orange', emoji: '🍊', color: '#f39c12', points: 12, radius: 35 },
  { name: 'banana', emoji: '🍌', color: '#f1c40f', points: 10, radius: 35 },
  { name: 'grape', emoji: '🍇', color: '#9b59b6', points: 20, radius: 30 },
  { name: 'strawberry', emoji: '🍓', color: '#e91e63', points: 18, radius: 30 },
  { name: 'pineapple', emoji: '🍍', color: '#f39c12', points: 25, radius: 40 },
  { name: 'peach', emoji: '🍑', color: '#ffab91', points: 15, radius: 35 }
]

const BOMB = { name: 'bomb', emoji: '💣', color: '#2c3e50', radius: 40 }

function spawnFruit() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  // Spawn 1-3 fruits at once
  const count = Math.floor(Math.random() * 3) + 1
  
  for (let i = 0; i < count; i++) {
    // 15% chance of bomb
    const isBomb = Math.random() < 0.15
    const type = isBomb ? BOMB : FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)]
    
    const x = Math.random() * (canvas.width - 100) + 50
    const velocityX = (Math.random() - 0.5) * 300
    const velocityY = -(Math.random() * 200 + 500) // Upward velocity
    
    fruits.push({
      x,
      y: canvas.height + 50,
      velocityX,
      velocityY,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 5,
      type,
      isBomb,
      sliced: false,
      radius: type.radius
    })
  }
}

function createSliceParticles(fruit) {
  const particleCount = fruit.isBomb ? 20 : 12
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5
    const speed = Math.random() * 200 + 100
    
    particles.push({
      x: fruit.x,
      y: fruit.y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      color: fruit.isBomb ? '#ff4444' : fruit.type.color,
      radius: Math.random() * 8 + 4,
      life: 1
    })
  }
  
  // Create splash effect
  if (!fruit.isBomb) {
    splashes.push({
      x: fruit.x,
      y: fruit.y,
      radius: 0,
      maxRadius: fruit.radius * 2,
      color: fruit.type.color,
      life: 1
    })
  }
}

function createSlicedHalves(fruit) {
  if (fruit.isBomb) return
  
  // Left half
  particles.push({
    x: fruit.x - 20,
    y: fruit.y,
    velocityX: fruit.velocityX - 100,
    velocityY: fruit.velocityY - 50,
    color: fruit.type.color,
    radius: fruit.radius * 0.7,
    life: 1,
    isHalf: true,
    emoji: fruit.type.emoji,
    rotation: fruit.rotation
  })
  
  // Right half
  particles.push({
    x: fruit.x + 20,
    y: fruit.y,
    velocityX: fruit.velocityX + 100,
    velocityY: fruit.velocityY - 50,
    color: fruit.type.color,
    radius: fruit.radius * 0.7,
    life: 1,
    isHalf: true,
    emoji: fruit.type.emoji,
    rotation: fruit.rotation + Math.PI
  })
}

function checkSliceCollision(fruit) {
  if (fruit.sliced || sliceTrail.length < 2) return false
  
  // Check if slice trail passes through fruit
  for (let i = 1; i < sliceTrail.length; i++) {
    const p1 = sliceTrail[i - 1]
    const p2 = sliceTrail[i]
    
    // Check if line segment intersects with fruit circle
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const fx = p1.x - fruit.x
    const fy = p1.y - fruit.y
    
    const a = dx * dx + dy * dy
    const b = 2 * (fx * dx + fy * dy)
    const c = fx * fx + fy * fy - fruit.radius * fruit.radius
    
    let discriminant = b * b - 4 * a * c
    
    if (discriminant >= 0) {
      discriminant = Math.sqrt(discriminant)
      const t1 = (-b - discriminant) / (2 * a)
      const t2 = (-b + discriminant) / (2 * a)
      
      if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
        // Calculate slice velocity - low threshold for responsive slicing
        const sliceSpeed = Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2)
        if (sliceSpeed > 5) {
          return true
        }
      }
    }
  }
  
  return false
}

function update(deltaTime) {
  const canvas = canvasRef.value
  if (!canvas) return
  
  gameTime += deltaTime
  
  // Spawn fruits
  spawnTimer += deltaTime
  // Increase spawn rate over time
  const currentInterval = Math.max(0.5, spawnInterval - gameTime * 0.01)
  
  if (spawnTimer >= currentInterval) {
    spawnTimer = 0
    spawnFruit()
  }
  
  // Update fruits
  fruits.forEach(fruit => {
    if (!fruit.sliced) {
      fruit.velocityY += 800 * deltaTime // Gravity
      fruit.x += fruit.velocityX * deltaTime
      fruit.y += fruit.velocityY * deltaTime
      fruit.rotation += fruit.rotationSpeed * deltaTime
      
      // Check for slice
      if (isSlicing && checkSliceCollision(fruit)) {
        fruit.sliced = true
        createSliceParticles(fruit)
        createSlicedHalves(fruit)
        
        if (fruit.isBomb) {
          props.onBombHit()
        } else {
          props.onScore(fruit.type.points)
        }
      }
    }
  })
  
  // Remove off-screen fruits (missed fruits don't cost lives in this version)
  const beforeCount = fruits.filter(f => !f.sliced && !f.isBomb).length
  fruits = fruits.filter(fruit => {
    if (fruit.sliced) return false
    return fruit.y < canvas.height + 100
  })
  const afterCount = fruits.filter(f => !f.sliced && !f.isBomb).length
  
  // Reset combo if fruit was missed
  if (beforeCount > afterCount) {
    props.onResetCombo()
  }
  
  // Update particles
  particles.forEach(p => {
    p.velocityY += 600 * deltaTime // Gravity
    p.x += p.velocityX * deltaTime
    p.y += p.velocityY * deltaTime
    p.life -= deltaTime * 0.8
    if (p.isHalf) {
      p.rotation += 3 * deltaTime
    }
  })
  particles = particles.filter(p => p.life > 0 && p.y < canvas.height + 50)
  
  // Update splashes
  splashes.forEach(s => {
    s.radius += 200 * deltaTime
    s.life -= deltaTime * 2
  })
  splashes = splashes.filter(s => s.life > 0)
  
  // Update slice trail - keep trail longer for better detection
  sliceTrail = sliceTrail.filter(p => Date.now() - p.time < 150)
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  
  // Clear canvas
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Draw background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#1a1a2e')
  gradient.addColorStop(1, '#16213e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Draw splashes
  splashes.forEach(s => {
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
    ctx.fillStyle = s.color + Math.floor(s.life * 50).toString(16).padStart(2, '0')
    ctx.fill()
  })
  
  // Draw particles
  particles.forEach(p => {
    ctx.save()
    ctx.globalAlpha = p.life
    
    if (p.isHalf) {
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.font = `${p.radius * 2}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Clip to show half
      ctx.beginPath()
      ctx.rect(-p.radius, -p.radius * 2, p.radius, p.radius * 4)
      ctx.clip()
      ctx.fillText(p.emoji, 0, 0)
    } else {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
    }
    
    ctx.restore()
  })
  
  // Draw fruits
  fruits.forEach(fruit => {
    if (fruit.sliced) return
    
    ctx.save()
    ctx.translate(fruit.x, fruit.y)
    ctx.rotate(fruit.rotation)
    
    // Draw fruit emoji
    ctx.font = `${fruit.radius * 2}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(fruit.type.emoji, 0, 0)
    
    ctx.restore()
  })
  
  // Draw slice trail
  if (sliceTrail.length >= 2) {
    ctx.beginPath()
    ctx.moveTo(sliceTrail[0].x, sliceTrail[0].y)
    
    for (let i = 1; i < sliceTrail.length; i++) {
      ctx.lineTo(sliceTrail[i].x, sliceTrail[i].y)
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    
    // Glow effect
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.4)'
    ctx.lineWidth = 12
    ctx.stroke()
  }
}

function gameLoop(currentTime) {
  const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1)
  lastTime = currentTime
  
  update(deltaTime)
  draw()
  
  animationFrameId = requestAnimationFrame(gameLoop)
}

function getEventPos(e) {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  
  if (e.touches) {
    return {
      x: (e.touches[0].clientX - rect.left) * (canvas.width / rect.width),
      y: (e.touches[0].clientY - rect.top) * (canvas.height / rect.height)
    }
  }
  
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height)
  }
}

function handleStart(e) {
  e.preventDefault()
  isSlicing = true
  const pos = getEventPos(e)
  lastMousePos = pos
  sliceTrail = [{ ...pos, time: Date.now() }]
}

function handleMove(e) {
  e.preventDefault()
  if (!isSlicing) return
  
  const pos = getEventPos(e)
  
  // Calculate velocity
  mouseVelocity = {
    x: pos.x - lastMousePos.x,
    y: pos.y - lastMousePos.y
  }
  
  sliceTrail.push({ ...pos, time: Date.now() })
  
  // Limit trail length
  if (sliceTrail.length > 20) {
    sliceTrail.shift()
  }
  
  lastMousePos = pos
}

function handleEnd(e) {
  e.preventDefault()
  isSlicing = false
  mouseVelocity = { x: 0, y: 0 }
}

function handleResize() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
}

function cleanup() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  const canvas = canvasRef.value
  if (canvas) {
    canvas.removeEventListener('mousedown', handleStart)
    canvas.removeEventListener('mousemove', handleMove)
    canvas.removeEventListener('mouseup', handleEnd)
    canvas.removeEventListener('mouseleave', handleEnd)
    canvas.removeEventListener('touchstart', handleStart)
    canvas.removeEventListener('touchmove', handleMove)
    canvas.removeEventListener('touchend', handleEnd)
  }
  
  window.removeEventListener('resize', handleResize)
}

function initGame() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  ctx = canvas.getContext('2d')
  
  // Set canvas size
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  
  // Reset game state
  fruits = []
  sliceTrail = []
  particles = []
  splashes = []
  spawnTimer = 0
  gameTime = 0
  
  // Event listeners
  canvas.addEventListener('mousedown', handleStart)
  canvas.addEventListener('mousemove', handleMove)
  canvas.addEventListener('mouseup', handleEnd)
  canvas.addEventListener('mouseleave', handleEnd)
  canvas.addEventListener('touchstart', handleStart, { passive: false })
  canvas.addEventListener('touchmove', handleMove, { passive: false })
  canvas.addEventListener('touchend', handleEnd, { passive: false })
  
  window.addEventListener('resize', handleResize)
  
  // Start game loop
  lastTime = performance.now()
  animationFrameId = requestAnimationFrame(gameLoop)
}

onMounted(() => {
  initGame()
})

onUnmounted(() => {
  cleanup()
})

defineExpose({ cleanup, initGame })
</script>

<template>
  <canvas ref="canvasRef" class="game-canvas"></canvas>
</template>

<style scoped>
.game-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: crosshair;
  touch-action: none;
}
</style>
