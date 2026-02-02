<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { foodColors } from '../data/colors'

const props = defineProps({
  playerSnake: Object,
  aiSnakes: Array,
  food: Array,
  arenaSize: Number,
  gameState: String
})

const canvasRef = ref(null)
let ctx = null
let animationId = null

const GRID_SIZE = 50
const viewportWidth = ref(800)
const viewportHeight = ref(600)

function resizeCanvas() {
  if (!canvasRef.value) return
  const container = canvasRef.value.parentElement
  viewportWidth.value = container.clientWidth
  viewportHeight.value = container.clientHeight
  canvasRef.value.width = viewportWidth.value
  canvasRef.value.height = viewportHeight.value
}

function drawGrid(offsetX, offsetY) {
  ctx.strokeStyle = 'rgba(100, 100, 120, 0.3)'
  ctx.lineWidth = 1

  const startX = -(offsetX % GRID_SIZE)
  const startY = -(offsetY % GRID_SIZE)

  for (let x = startX; x < viewportWidth.value; x += GRID_SIZE) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, viewportHeight.value)
    ctx.stroke()
  }

  for (let y = startY; y < viewportHeight.value; y += GRID_SIZE) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(viewportWidth.value, y)
    ctx.stroke()
  }
}

function drawFood(offsetX, offsetY) {
  for (const f of props.food) {
    const screenX = f.x - offsetX
    const screenY = f.y - offsetY

    // Skip if off screen
    if (screenX < -20 || screenX > viewportWidth.value + 20 ||
        screenY < -20 || screenY > viewportHeight.value + 20) continue

    // Glow effect
    const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, f.size * 2)
    gradient.addColorStop(0, foodColors[f.color])
    gradient.addColorStop(0.5, foodColors[f.color] + '88')
    gradient.addColorStop(1, 'transparent')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(screenX, screenY, f.size * 2, 0, Math.PI * 2)
    ctx.fill()

    // Core
    ctx.fillStyle = foodColors[f.color]
    ctx.beginPath()
    ctx.arc(screenX, screenY, f.size / 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawSnake(snake, offsetX, offsetY, isPlayer = false) {
  if (!snake || !snake.segments || snake.segments.length === 0) return
  if (!snake.isAlive) return

  const segments = snake.segments
  const color = snake.color || { body: '#00cc66', head: '#00ff88' }
  const segmentSize = snake.SEGMENT_SIZE || 12

  // Draw body segments
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i]
    const screenX = seg.x - offsetX
    const screenY = seg.y - offsetY

    // Skip if off screen
    if (screenX < -segmentSize || screenX > viewportWidth.value + segmentSize ||
        screenY < -segmentSize || screenY > viewportHeight.value + segmentSize) continue

    const isHead = i === 0
    const size = isHead ? segmentSize * 1.2 : segmentSize * (0.8 + (segments.length - i) / segments.length * 0.2)

    // Glow for player
    if (isPlayer && isHead) {
      ctx.shadowColor = color.head
      ctx.shadowBlur = 15
    }

    ctx.fillStyle = isHead ? color.head : color.body
    ctx.beginPath()
    ctx.arc(screenX, screenY, size / 2, 0, Math.PI * 2)
    ctx.fill()

    // Eyes on head
    if (isHead) {
      const dir = snake.direction || { x: 0, y: -1 }
      const eyeOffset = size * 0.25
      const eyeSize = size * 0.2

      // Left eye
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(
        screenX + dir.y * eyeOffset - dir.x * eyeOffset * 0.5,
        screenY - dir.x * eyeOffset - dir.y * eyeOffset * 0.5,
        eyeSize, 0, Math.PI * 2
      )
      ctx.fill()

      // Right eye
      ctx.beginPath()
      ctx.arc(
        screenX - dir.y * eyeOffset - dir.x * eyeOffset * 0.5,
        screenY + dir.x * eyeOffset - dir.y * eyeOffset * 0.5,
        eyeSize, 0, Math.PI * 2
      )
      ctx.fill()

      // Pupils
      ctx.fillStyle = 'black'
      ctx.beginPath()
      ctx.arc(
        screenX + dir.y * eyeOffset - dir.x * eyeOffset * 0.3,
        screenY - dir.x * eyeOffset - dir.y * eyeOffset * 0.3,
        eyeSize * 0.5, 0, Math.PI * 2
      )
      ctx.fill()
      ctx.beginPath()
      ctx.arc(
        screenX - dir.y * eyeOffset - dir.x * eyeOffset * 0.3,
        screenY + dir.x * eyeOffset - dir.y * eyeOffset * 0.3,
        eyeSize * 0.5, 0, Math.PI * 2
      )
      ctx.fill()
    }

    ctx.shadowBlur = 0
  }
}

function drawMinimap(offsetX, offsetY) {
  const mapSize = 120
  const mapX = viewportWidth.value - mapSize - 10
  const mapY = viewportHeight.value - mapSize - 10
  const scale = mapSize / props.arenaSize

  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.fillRect(mapX, mapY, mapSize, mapSize)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.strokeRect(mapX, mapY, mapSize, mapSize)

  // Draw AI snakes
  for (const ai of props.aiSnakes) {
    if (!ai.isAlive || !ai.segments || ai.segments.length === 0) continue
    const head = ai.segments[0]
    ctx.fillStyle = ai.color?.body || '#888'
    ctx.beginPath()
    ctx.arc(mapX + head.x * scale, mapY + head.y * scale, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  // Draw player
  if (props.playerSnake?.segments?.length > 0) {
    const head = props.playerSnake.segments[0]
    ctx.fillStyle = '#ffcc00'
    ctx.beginPath()
    ctx.arc(mapX + head.x * scale, mapY + head.y * scale, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  // Viewport indicator
  const viewX = mapX + offsetX * scale
  const viewY = mapY + offsetY * scale
  const viewW = viewportWidth.value * scale
  const viewH = viewportHeight.value * scale
  ctx.strokeStyle = 'rgba(255, 204, 0, 0.5)'
  ctx.strokeRect(viewX, viewY, viewW, viewH)
}

function render() {
  if (!ctx || props.gameState !== 'playing') {
    animationId = requestAnimationFrame(render)
    return
  }

  // Clear
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, viewportWidth.value, viewportHeight.value)

  // Calculate viewport offset (center on player)
  let offsetX = 0
  let offsetY = 0
  if (props.playerSnake?.segments?.length > 0) {
    const head = props.playerSnake.segments[0]
    offsetX = head.x - viewportWidth.value / 2
    offsetY = head.y - viewportHeight.value / 2
  }

  // Draw layers
  drawGrid(offsetX, offsetY)
  drawFood(offsetX, offsetY)

  // Draw AI snakes
  for (const ai of props.aiSnakes) {
    drawSnake(ai, offsetX, offsetY)
  }

  // Draw player on top
  if (props.playerSnake) {
    drawSnake(props.playerSnake, offsetX, offsetY, true)
  }

  // Draw minimap
  drawMinimap(offsetX, offsetY)
  
  // Draw boost indicator
  drawBoostIndicator()

  animationId = requestAnimationFrame(render)
}

function drawBoostIndicator() {
  if (!props.playerSnake) return
  
  const x = 20
  const y = viewportHeight.value - 50
  const width = 150
  const height = 20
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
  ctx.fillRect(x - 5, y - 25, width + 10, height + 35)
  
  // Label
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 12px Arial'
  ctx.fillText('BOOST (Hold Click/Space)', x, y - 8)
  
  // Track
  ctx.fillStyle = '#333'
  ctx.fillRect(x, y, width, height)
  
  // Boost availability based on length
  const minLength = 10
  const canBoost = props.playerSnake.segments?.length > minLength
  const boostPercent = canBoost ? Math.min(1, (props.playerSnake.segments.length - minLength) / 50) : 0
  
  // Fill
  if (props.playerSnake.isBoosting) {
    ctx.fillStyle = '#ff4444'
  } else if (canBoost) {
    ctx.fillStyle = '#44ff44'
  } else {
    ctx.fillStyle = '#666'
  }
  ctx.fillRect(x, y, width * boostPercent, height)
  
  // Border
  ctx.strokeStyle = props.playerSnake.isBoosting ? '#ff8888' : '#888'
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, width, height)
}

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  render()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<template>
  <canvas ref="canvasRef" class="game-canvas"></canvas>
</template>

<style scoped>
.game-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
