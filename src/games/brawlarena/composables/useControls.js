import { ref, onMounted, onUnmounted } from 'vue'

export function useControls() {
  const keys = ref({})
  const player1Input = ref({
    left: false,
    right: false,
    up: false,
    down: false,
    attack: false,
    special: false,
    jump: false,
    shield: false,
    attackHoldTime: 0
  })
  const player2Input = ref({
    left: false,
    right: false,
    up: false,
    down: false,
    attack: false,
    special: false,
    jump: false,
    shield: false,
    attackHoldTime: 0
  })
  
  // Key mappings
  const player1Keys = {
    'KeyA': 'left',
    'KeyD': 'right',
    'KeyW': 'up',
    'KeyS': 'down',
    'KeyJ': 'attack',
    'KeyK': 'special',
    'KeyL': 'shield',
    'Space': 'jump'
  }
  
  const player2Keys = {
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'Numpad1': 'attack',
    'Numpad2': 'special',
    'Numpad3': 'shield',
    'Numpad0': 'jump'
  }
  
  const handleKeyDown = (e) => {
    if (keys.value[e.code]) return // Already held
    keys.value[e.code] = true
    
    if (player1Keys[e.code]) {
      player1Input.value[player1Keys[e.code]] = true
    }
    if (player2Keys[e.code]) {
      player2Input.value[player2Keys[e.code]] = true
    }
  }
  
  const handleKeyUp = (e) => {
    keys.value[e.code] = false
    
    if (player1Keys[e.code]) {
      player1Input.value[player1Keys[e.code]] = false
      if (player1Keys[e.code] === 'attack') {
        player1Input.value.attackHoldTime = 0
      }
    }
    if (player2Keys[e.code]) {
      player2Input.value[player2Keys[e.code]] = false
      if (player2Keys[e.code] === 'attack') {
        player2Input.value.attackHoldTime = 0
      }
    }
  }
  
  const setupControls = () => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  }
  
  const cleanupControls = () => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  }
  
  // Update hold times each frame
  const updateHoldTimes = () => {
    if (player1Input.value.attack) {
      player1Input.value.attackHoldTime++
    }
    if (player2Input.value.attack) {
      player2Input.value.attackHoldTime++
    }
  }
  
  const getInput = (playerIndex, isAI = false, aiState = null) => {
    if (isAI && aiState) {
      return getAIInput(aiState)
    }
    return playerIndex === 0 ? player1Input.value : player2Input.value
  }
  
  // Smash Bros-style AI logic
  const getAIInput = (aiState) => {
    const { self, opponent, platforms, difficulty = 0.5 } = aiState
    const input = {
      left: false,
      right: false,
      up: false,
      down: false,
      attack: false,
      special: false,
      jump: false,
      shield: false,
      attackHoldTime: 0
    }
    
    // Random factor for imperfect play
    if (Math.random() > difficulty) return input
    
    const dx = opponent.position.x - self.position.x
    const dy = opponent.position.y - self.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Shield if opponent is attacking nearby
    if (opponent.state === 'attacking' && distance < 3 && Math.random() > 0.5) {
      input.shield = true
      return input
    }
    
    // Move towards opponent with some variance
    if (Math.abs(dx) > 1.5) {
      if (dx > 0) input.right = true
      else input.left = true
    } else if (Math.abs(dx) > 0.5 && Math.random() > 0.3) {
      // Micro-spacing
      if (dx > 0) input.right = true
      else input.left = true
    }
    
    // Jump if opponent is above or for approach
    if (dy > 2 && Math.random() > 0.6) {
      input.jump = true
    }
    
    // Aerial approach
    if (!self.isGrounded && distance < 4 && Math.random() > 0.7) {
      if (dy > 0.5) input.up = true
      else if (dy < -0.5) input.down = true
      input.attack = true
    }
    
    // Recovery if falling off
    if (self.position.y < -4) {
      input.jump = true
      if (self.position.x < 0) input.right = true
      else input.left = true
      // Use up special for recovery
      if (self.jumpCount >= 2 && Math.random() > 0.3) {
        input.up = true
        input.special = true
      }
    }
    
    // Ground attacks when close
    if (distance < 2.5 && self.attackCooldown <= 0 && self.isGrounded) {
      const attackRoll = Math.random()
      if (attackRoll > 0.7) {
        // Smash attack (hold)
        input.attack = true
        input.attackHoldTime = 20
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) input.right = true
          else input.left = true
        } else {
          if (dy > 0) input.up = true
          else input.down = true
        }
      } else if (attackRoll > 0.3) {
        // Tilt attack
        input.attack = true
        if (dy > 1) input.up = true
        else if (dy < -0.5) input.down = true
      } else {
        // Jab
        input.attack = true
      }
    }
    
    // Use special moves strategically
    if (self.attackCooldown <= 0 && Math.random() > 0.85) {
      if (distance > 4 && distance < 8) {
        // Projectile range
        input.special = true
      } else if (distance < 2 && opponent.damage > 80) {
        // Kill confirm range
        input.special = true
        if (dx > 0) input.right = true
        else input.left = true
      }
    }
    
    // Fast fall to return to stage or combo
    if (!self.isGrounded && self.velocity?.y < 0 && self.position.y > 3) {
      if (Math.random() > 0.6) input.down = true
    }
    
    // Edge guard
    if (opponent.position.y < -2 && Math.abs(opponent.position.x) > 8) {
      if (opponent.position.x > 0) input.right = true
      else input.left = true
      if (Math.random() > 0.7) input.attack = true
    }
    
    return input
  }
  
  return {
    keys,
    player1Input,
    player2Input,
    setupControls,
    cleanupControls,
    updateHoldTimes,
    getInput
  }
}
