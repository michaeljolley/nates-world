<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['score', 'fall'])

// Canvas refs
const canvasRef = ref(null)
let ctx = null
let animationId = null
let lastTime = 0

// Game constants
const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 700
const GRAVITY = 0.5
const JUMP_POWER = -12
const VINE_SWING_SPEED = 0.05
const GROUND_Y = CANVAS_HEIGHT - 30

// Player state
const player = ref({
  x: 150,
  y: 200,
  vy: 0,
  width: 40,
  height: 50,
  onTree: true,
  onVine: false,
  currentVine: null,
  currentTree: null,
  vineAngle: 0,
  facing: 1 // 1 = right, -1 = left
})

// Game objects
const trees = ref([])
const vines = ref([])
const cameraX = ref(0)
let treeIdCounter = 0
let vineIdCounter = 0
let nextSpawnX = 0
const gameSpeed = ref(0)

// Input state
const keys = ref({})

function initGame() {
  trees.value = []
  vines.value = []
  treeIdCounter = 0
  vineIdCounter = 0
  nextSpawnX = 0
  cameraX.value = 0
  gameSpeed.value = 0
  
  player.value = {
    x: 150,
    y: 200,
    vy: 0,
    width: 40,
    height: 50,
    onTree: true,
    onVine: false,
    currentVine: null,
    currentTree: null,
    vineAngle: 0,
    facing: 1
  }
  
  // Create starting tree
  const startTree = createTree(100, 250, 300, true)
  player.value.currentTree = startTree
  
  // Spawn initial obstacles
  for (let i = 0; i < 8; i++) {
    spawnNext()
  }
}

function createTree(x, platformY, height, isStart = false) {
  const tree = {
    id: treeIdCounter++,
    x,
    y: GROUND_Y - height,
    width: 60,
    height,
    platformY,
    platformWidth: 80,
    hasVine: !isStart && Math.random() > 0.4
  }
  trees.value.push(tree)
  
  // Add vine hanging from tree
  if (tree.hasVine) {
    const vine = {
      id: vineIdCounter++,
      x: x + 30,
      y: platformY - 20,
      length: 80 + Math.random() * 60,
      angle: -0.3 + Math.random() * 0.6,
      swingDir: Math.random() > 0.5 ? 1 : -1
    }
    vines.value.push(vine)
  }
  
  return tree
}

function spawnNext() {
  const gap = 150 + Math.random() * 100
  const x = nextSpawnX + gap
  const height = 200 + Math.random() * 150
  const platformY = GROUND_Y - height + 50
  
  createTree(x, platformY, height)
  nextSpawnX = x
}

function handleKeyDown(e) {
  keys.value[e.code] = true
  
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault()
    jump()
  }
}

function handleKeyUp(e) {
  keys.value[e.code] = false
}

function jump() {
  const p = player.value
  
  if (p.onTree) {
    // Jump from tree
    p.onTree = false
    p.vy = JUMP_POWER
    p.facing = 1
    emit('score', 10)
  } else if (p.onVine) {
    // Release from vine with momentum
    const vine = p.currentVine
    const swingVelocity = Math.cos(p.vineAngle) * 8
    p.onVine = false
    p.currentVine = null
    p.vy = JUMP_POWER * 0.8
    p.x += swingVelocity * 3
    p.facing = swingVelocity >= 0 ? 1 : -1
    emit('score', 20)
  }
}

function update(deltaTime) {
  const p = player.value
  const dt = Math.min(deltaTime, 0.05)
  
  // Scroll camera
  const targetCameraX = p.x - 200
  cameraX.value += (targetCameraX - cameraX.value) * 0.1
  
  // Update vines swinging
  vines.value.forEach(vine => {
    vine.angle += VINE_SWING_SPEED * vine.swingDir
    if (Math.abs(vine.angle) > 0.5) {
      vine.swingDir *= -1
    }
  })
  
  if (p.onTree) {
    // Standing on tree - can walk forward/backward with left/right
    const tree = p.currentTree
    if (keys.value['ArrowLeft'] || keys.value['KeyA']) {
      p.x -= 3
      p.facing = -1
    }
    if (keys.value['ArrowRight'] || keys.value['KeyD']) {
      p.x += 3
      p.facing = 1
    }
    
    // Check if walked off the tree platform
    if (tree) {
      const onPlatform = p.x > tree.x - 20 && p.x < tree.x + tree.platformWidth + 20
      if (!onPlatform) {
        p.onTree = false
        p.currentTree = null
      }
    }
  } else if (p.onVine) {
    // Swinging on vine
    const vine = p.currentVine
    p.vineAngle += VINE_SWING_SPEED * 1.5 * (keys.value['ArrowLeft'] ? -1 : keys.value['ArrowRight'] ? 1 : vine.swingDir)
    p.vineAngle = Math.max(-0.8, Math.min(0.8, p.vineAngle))
    
    // Update position based on vine
    p.x = vine.x + Math.sin(p.vineAngle) * vine.length
    p.y = vine.y + Math.cos(p.vineAngle) * vine.length
  } else {
    // In the air
    p.vy += GRAVITY
    p.y += p.vy
    p.x += p.facing * 4
    
    // Check landing on trees
    for (const tree of trees.value) {
      const onPlatform = 
        p.x > tree.x - 20 && 
        p.x < tree.x + tree.platformWidth + 20 &&
        p.y + p.height > tree.platformY &&
        p.y + p.height < tree.platformY + 30 &&
        p.vy > 0
      
      if (onPlatform) {
        p.y = tree.platformY - p.height
        p.vy = 0
        p.onTree = true
        p.currentTree = tree
        emit('score', 50)
        break
      }
    }
    
    // Check grabbing vines
    for (const vine of vines.value) {
      const vineEndX = vine.x + Math.sin(vine.angle) * vine.length
      const vineEndY = vine.y + Math.cos(vine.angle) * vine.length
      
      const dx = Math.abs(p.x + p.width/2 - vineEndX)
      const dy = Math.abs(p.y + p.height/2 - vineEndY)
      
      if (dx < 40 && dy < 40 && !p.onVine) {
        p.onVine = true
        p.currentVine = vine
        p.vineAngle = vine.angle
        p.vy = 0
        emit('score', 30)
        break
      }
    }
    
    // Check if hit ground
    if (p.y + p.height > GROUND_Y) {
      emit('fall')
      return false
    }
    
    // Check if fell off screen
    if (p.y > CANVAS_HEIGHT + 100) {
      emit('fall')
      return false
    }
  }
  
  // Spawn more trees
  while (nextSpawnX < cameraX.value + CANVAS_WIDTH + 200) {
    spawnNext()
  }
  
  // Remove old trees and vines
  trees.value = trees.value.filter(t => t.x > cameraX.value - 200)
  vines.value = vines.value.filter(v => v.x > cameraX.value - 200)
  
  return true
}

function render() {
  if (!ctx) return
  
  // Clear
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Draw background clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  for (let i = 0; i < 5; i++) {
    const cloudX = ((i * 200 - cameraX.value * 0.2) % (CANVAS_WIDTH + 200)) - 100
    ctx.beginPath()
    ctx.arc(cloudX, 60 + i * 20, 30, 0, Math.PI * 2)
    ctx.arc(cloudX + 25, 50 + i * 20, 25, 0, Math.PI * 2)
    ctx.arc(cloudX + 50, 60 + i * 20, 30, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Draw ground (danger zone!)
  ctx.fillStyle = '#654321'
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 30)
  ctx.fillStyle = '#228B22'
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 5)
  
  // Draw danger text
  ctx.fillStyle = '#ff4444'
  ctx.font = 'bold 12px Arial'
  ctx.fillText('☠️ DANGER - DON\'T TOUCH! ☠️', 10, GROUND_Y + 20)
  
  ctx.save()
  ctx.translate(-cameraX.value, 0)
  
  // Draw trees
  trees.value.forEach(tree => {
    // Trunk
    ctx.fillStyle = '#8B4513'
    ctx.fillRect(tree.x, tree.y, tree.width, tree.height)
    
    // Trunk texture
    ctx.strokeStyle = '#654321'
    ctx.lineWidth = 2
    for (let i = 0; i < 5; i++) {
      const y = tree.y + 20 + i * 40
      ctx.beginPath()
      ctx.moveTo(tree.x + 10, y)
      ctx.quadraticCurveTo(tree.x + 30, y + 10, tree.x + 50, y)
      ctx.stroke()
    }
    
    // Foliage
    ctx.fillStyle = '#228B22'
    ctx.beginPath()
    ctx.arc(tree.x + 30, tree.y - 30, 50, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#2E8B57'
    ctx.beginPath()
    ctx.arc(tree.x + 10, tree.y - 10, 35, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(tree.x + 50, tree.y - 10, 35, 0, Math.PI * 2)
    ctx.fill()
    
    // Platform
    ctx.fillStyle = '#654321'
    ctx.fillRect(tree.x - 10, tree.platformY, tree.platformWidth, 15)
    ctx.fillStyle = '#228B22'
    ctx.fillRect(tree.x - 10, tree.platformY, tree.platformWidth, 5)
  })
  
  // Draw vines
  vines.value.forEach(vine => {
    const endX = vine.x + Math.sin(vine.angle) * vine.length
    const endY = vine.y + Math.cos(vine.angle) * vine.length
    
    // Vine rope
    ctx.strokeStyle = '#228B22'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(vine.x, vine.y)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    
    // Vine grip point
    ctx.fillStyle = '#32CD32'
    ctx.beginPath()
    ctx.arc(endX, endY, 12, 0, Math.PI * 2)
    ctx.fill()
    
    // Leaves on vine
    ctx.fillStyle = '#228B22'
    for (let i = 0.2; i < 0.9; i += 0.3) {
      const lx = vine.x + Math.sin(vine.angle) * vine.length * i
      const ly = vine.y + Math.cos(vine.angle) * vine.length * i
      ctx.beginPath()
      ctx.ellipse(lx + 8, ly, 10, 5, vine.angle, 0, Math.PI * 2)
      ctx.fill()
    }
  })
  
  // Draw player (monkey)
  const p = player.value
  ctx.save()
  ctx.translate(p.x + p.width/2, p.y + p.height/2)
  ctx.scale(p.facing, 1)
  
  // Body
  ctx.fillStyle = '#CD853F'
  ctx.beginPath()
  ctx.ellipse(0, 5, 18, 22, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Head
  ctx.fillStyle = '#DEB887'
  ctx.beginPath()
  ctx.arc(0, -20, 16, 0, Math.PI * 2)
  ctx.fill()
  
  // Face
  ctx.fillStyle = '#FFDAB9'
  ctx.beginPath()
  ctx.ellipse(5, -18, 10, 12, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Eyes
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(3, -22, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(4, -23, 1, 0, Math.PI * 2)
  ctx.fill()
  
  // Smile
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(5, -15, 5, 0.2, Math.PI - 0.2)
  ctx.stroke()
  
  // Arms
  ctx.fillStyle = '#CD853F'
  if (p.onVine) {
    // Arms up for vine
    ctx.beginPath()
    ctx.ellipse(-12, -10, 8, 20, -0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(12, -10, 8, 20, 0.5, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // Normal arms
    ctx.beginPath()
    ctx.ellipse(-18, 0, 8, 15, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(18, 0, 8, 15, 0.3, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Legs
  ctx.beginPath()
  ctx.ellipse(-8, 25, 8, 12, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(8, 25, 8, 12, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Tail
  ctx.strokeStyle = '#CD853F'
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(-10, 20)
  ctx.quadraticCurveTo(-30, 10, -25, -10)
  ctx.stroke()
  
  ctx.restore()
  ctx.restore()
  
  // Draw score
  ctx.fillStyle = '#fff'
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 3
  ctx.font = 'bold 24px Arial'
  ctx.strokeText(`Score: ${Math.floor(cameraX.value / 10)}`, 20, 40)
  ctx.fillText(`Score: ${Math.floor(cameraX.value / 10)}`, 20, 40)
  
  // Draw controls hint
  ctx.font = '14px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.fillText('SPACE to jump | ←→ to swing on vines', 20, CANVAS_HEIGHT - 45)
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
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<template>
  <div class="game-container">
    <canvas ref="canvasRef" class="game-canvas"></canvas>
  </div>
</template>

<style scoped>
.game-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.game-canvas {
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  border: 4px solid #2d5a27;
}
</style>
