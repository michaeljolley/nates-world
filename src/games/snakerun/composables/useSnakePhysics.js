import { ref } from 'vue'

export function useSnakePhysics(arenaSize = 2000) {
  const segments = ref([])
  const direction = ref({ x: 0, y: -1 })
  const targetDirection = ref({ x: 0, y: -1 })
  const speed = ref(150) // pixels per second
  const isAlive = ref(true)
  const segmentsToGrow = ref(0)
  
  const SEGMENT_SIZE = 12
  const SEGMENT_SPACING = 10
  const TURN_SPEED = 8 // How fast snake turns

  function init(startX, startY, initialLength = 5) {
    segments.value = []
    for (let i = 0; i < initialLength; i++) {
      segments.value.push({
        x: startX,
        y: startY + i * SEGMENT_SPACING
      })
    }
    direction.value = { x: 0, y: -1 }
    targetDirection.value = { x: 0, y: -1 }
    isAlive.value = true
    segmentsToGrow.value = 0
  }

  function setDirection(dx, dy) {
    // Normalize
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len > 0) {
      targetDirection.value = { x: dx / len, y: dy / len }
    }
  }

  function update(delta) {
    if (!isAlive.value || segments.value.length === 0) return

    // Smooth turning
    const turnAmount = TURN_SPEED * delta
    direction.value.x += (targetDirection.value.x - direction.value.x) * turnAmount
    direction.value.y += (targetDirection.value.y - direction.value.y) * turnAmount
    
    // Normalize direction
    const len = Math.sqrt(direction.value.x ** 2 + direction.value.y ** 2)
    if (len > 0) {
      direction.value.x /= len
      direction.value.y /= len
    }

    // Move head
    const head = segments.value[0]
    const moveDistance = speed.value * delta
    
    const newHead = {
      x: head.x + direction.value.x * moveDistance,
      y: head.y + direction.value.y * moveDistance
    }

    // Wrap around arena edges
    if (newHead.x < 0) newHead.x = arenaSize
    if (newHead.x > arenaSize) newHead.x = 0
    if (newHead.y < 0) newHead.y = arenaSize
    if (newHead.y > arenaSize) newHead.y = 0

    // Add new head position
    segments.value.unshift(newHead)

    // Remove tail unless growing
    if (segmentsToGrow.value > 0) {
      segmentsToGrow.value--
    } else {
      segments.value.pop()
    }
  }

  function grow(amount = 3) {
    segmentsToGrow.value += amount
  }

  function die() {
    isAlive.value = false
  }

  function getHead() {
    return segments.value[0] || { x: 0, y: 0 }
  }

  function getLength() {
    return segments.value.length
  }

  return {
    segments,
    direction,
    targetDirection,
    speed,
    isAlive,
    SEGMENT_SIZE,
    SEGMENT_SPACING,
    init,
    setDirection,
    update,
    grow,
    die,
    getHead,
    getLength
  }
}

// AI Snake class
export class AISnake {
  constructor(id, color, arenaSize = 2000) {
    this.id = id
    this.name = `Snake ${id}`
    this.color = color
    this.arenaSize = arenaSize
    this.segments = []
    this.direction = { x: 0, y: -1 }
    this.targetDirection = { x: 0, y: -1 }
    this.speed = 130 + Math.random() * 40 // Varied speeds
    this.isAlive = true
    this.segmentsToGrow = 0
    this.SEGMENT_SIZE = 12
    this.SEGMENT_SPACING = 10
    this.thinkTimer = 0
    this.thinkInterval = 0.2 + Math.random() * 0.3 // Think every 0.2-0.5 seconds
    this.personality = Math.random() // 0-1, affects aggression
  }

  init(startX, startY, initialLength = 5) {
    this.segments = []
    const angle = Math.random() * Math.PI * 2
    this.direction = { x: Math.cos(angle), y: Math.sin(angle) }
    this.targetDirection = { ...this.direction }
    
    for (let i = 0; i < initialLength; i++) {
      this.segments.push({
        x: startX - this.direction.x * i * this.SEGMENT_SPACING,
        y: startY - this.direction.y * i * this.SEGMENT_SPACING
      })
    }
    this.isAlive = true
    this.segmentsToGrow = 0
  }

  think(food, allSnakes) {
    if (!this.isAlive || this.segments.length === 0) return

    const head = this.segments[0]
    let bestTarget = null
    let bestScore = -Infinity

    // Find best food target
    for (const f of food) {
      const dist = Math.sqrt((f.x - head.x) ** 2 + (f.y - head.y) ** 2)
      const score = 100 - dist * 0.1 + f.size
      if (score > bestScore) {
        bestScore = score
        bestTarget = { x: f.x, y: f.y }
      }
    }

    // Check for nearby snakes to avoid
    for (const snake of allSnakes) {
      if (snake === this || !snake.isAlive) continue
      
      const snakeSegments = snake.segments || []
      for (let i = 0; i < Math.min(snakeSegments.length, 20); i++) {
        const seg = snakeSegments[i]
        const dist = Math.sqrt((seg.x - head.x) ** 2 + (seg.y - head.y) ** 2)
        
        if (dist < 80) {
          // Too close! Turn away
          const awayX = head.x - seg.x
          const awayY = head.y - seg.y
          const len = Math.sqrt(awayX ** 2 + awayY ** 2)
          if (len > 0) {
            this.targetDirection.x = awayX / len
            this.targetDirection.y = awayY / len
            return // Prioritize avoidance
          }
        }
      }
    }

    // Move toward target
    if (bestTarget) {
      const dx = bestTarget.x - head.x
      const dy = bestTarget.y - head.y
      const len = Math.sqrt(dx * dx + dy * dy)
      if (len > 0) {
        this.targetDirection.x = dx / len
        this.targetDirection.y = dy / len
      }
    }

    // Add some randomness
    this.targetDirection.x += (Math.random() - 0.5) * 0.3
    this.targetDirection.y += (Math.random() - 0.5) * 0.3
    const len = Math.sqrt(this.targetDirection.x ** 2 + this.targetDirection.y ** 2)
    if (len > 0) {
      this.targetDirection.x /= len
      this.targetDirection.y /= len
    }
  }

  update(delta, food, allSnakes) {
    if (!this.isAlive || this.segments.length === 0) return

    // Think periodically
    this.thinkTimer += delta
    if (this.thinkTimer >= this.thinkInterval) {
      this.thinkTimer = 0
      this.think(food, allSnakes)
    }

    // Smooth turning
    const turnAmount = 6 * delta
    this.direction.x += (this.targetDirection.x - this.direction.x) * turnAmount
    this.direction.y += (this.targetDirection.y - this.direction.y) * turnAmount
    
    // Normalize
    const len = Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2)
    if (len > 0) {
      this.direction.x /= len
      this.direction.y /= len
    }

    // Move
    const moveDistance = this.speed * delta
    const head = this.segments[0]
    const newHead = {
      x: head.x + this.direction.x * moveDistance,
      y: head.y + this.direction.y * moveDistance
    }

    // Wrap around
    if (newHead.x < 0) newHead.x = this.arenaSize
    if (newHead.x > this.arenaSize) newHead.x = 0
    if (newHead.y < 0) newHead.y = this.arenaSize
    if (newHead.y > this.arenaSize) newHead.y = 0

    this.segments.unshift(newHead)

    if (this.segmentsToGrow > 0) {
      this.segmentsToGrow--
    } else {
      this.segments.pop()
    }
  }

  grow(amount = 3) {
    this.segmentsToGrow += amount
  }

  die() {
    this.isAlive = false
  }

  respawn() {
    const x = 100 + Math.random() * (this.arenaSize - 200)
    const y = 100 + Math.random() * (this.arenaSize - 200)
    this.init(x, y, 5)
  }
}
