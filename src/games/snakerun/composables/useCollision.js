export function useCollision() {
  const COLLISION_RADIUS = 10

  function checkHeadToBody(head, snake, skipHead = true) {
    // Check if head collides with any segment of another snake
    const segments = snake.segments || []
    const startIndex = skipHead ? 1 : 0
    
    for (let i = startIndex; i < segments.length; i++) {
      const seg = segments[i]
      const dist = Math.sqrt((head.x - seg.x) ** 2 + (head.y - seg.y) ** 2)
      if (dist < COLLISION_RADIUS) {
        return true
      }
    }
    return false
  }

  function checkHeadToHead(head1, head2) {
    const dist = Math.sqrt((head1.x - head2.x) ** 2 + (head1.y - head2.y) ** 2)
    return dist < COLLISION_RADIUS * 1.5
  }

  function checkFoodCollision(head, food, foodSize = 8) {
    for (let i = 0; i < food.length; i++) {
      const f = food[i]
      const dist = Math.sqrt((head.x - f.x) ** 2 + (head.y - f.y) ** 2)
      if (dist < COLLISION_RADIUS + f.size / 2) {
        return i
      }
    }
    return -1
  }

  function checkSelfCollision(snake) {
    const segments = snake.segments || []
    if (segments.length < 10) return false // Too short to self-collide
    
    const head = segments[0]
    // Skip first 10 segments (can't hit yourself immediately)
    for (let i = 10; i < segments.length; i++) {
      const seg = segments[i]
      const dist = Math.sqrt((head.x - seg.x) ** 2 + (head.y - seg.y) ** 2)
      if (dist < COLLISION_RADIUS * 0.8) {
        return true
      }
    }
    return false
  }

  return {
    checkHeadToBody,
    checkHeadToHead,
    checkFoodCollision,
    checkSelfCollision,
    COLLISION_RADIUS
  }
}
