import { ref } from 'vue'

export function usePhysics() {
  const gravity = -0.6
  const terminalVelocity = -18
  const groundFriction = 0.88
  const airFriction = 0.97
  const hitstunFriction = 0.95
  
  // Smash Bros-style knockback formula constants
  const BASE_KNOCKBACK_SCALING = 0.12
  const WEIGHT_FACTOR = 200
  
  const updatePhysics = (player, platforms, blastZones, deltaTime = 1) => {
    // Skip if stunned (shield break)
    if (player.stunned > 0) {
      player.stunned--
      return null
    }
    
    // Handle hitstun
    if (player.hitstun > 0) {
      player.hitstun--
      // DI (Directional Influence) - slight control during hitstun
      // This is handled in the game loop via input
    }
    
    // Apply gravity (reduced during hitstun for combo potential)
    if (!player.isGrounded) {
      const gravityMod = player.hitstun > 0 ? 0.7 : 1
      player.velocity.y += gravity * gravityMod
      player.velocity.y = Math.max(player.velocity.y, terminalVelocity)
    }
    
    // Apply friction
    let friction
    if (player.hitstun > 0) {
      friction = hitstunFriction
    } else if (player.isGrounded) {
      friction = groundFriction
    } else {
      friction = airFriction
    }
    player.velocity.x *= friction
    
    // Apply velocity
    player.position.x += player.velocity.x
    player.position.y += player.velocity.y
    
    // Platform collision
    let onPlatform = false
    for (const platform of platforms) {
      const bounds = platform.bounds
      
      // Check if player is within horizontal bounds
      if (player.position.x >= bounds.left - 0.4 && 
          player.position.x <= bounds.right + 0.4) {
        
        // Check if landing on top of platform (only if moving downward)
        const prevY = player.position.y - player.velocity.y
        if (prevY >= bounds.top && 
            player.position.y <= bounds.top + 0.5 && 
            player.velocity.y <= 0) {
          player.position.y = bounds.top
          player.velocity.y = 0
          player.isGrounded = true
          player.jumpCount = 0
          player.airDodgeUsed = false
          onPlatform = true
          
          // Tech opportunity on landing during hitstun
          if (player.hitstun > 0 && player.techInput) {
            player.hitstun = 0
            player.invincible = 15
            player.state = 'tech'
          }
          break
        }
      }
    }
    
    if (!onPlatform && player.isGrounded) {
      // Check if still on any platform
      let stillOnPlatform = false
      for (const platform of platforms) {
        const bounds = platform.bounds
        if (player.position.x >= bounds.left - 0.4 && 
            player.position.x <= bounds.right + 0.4 &&
            Math.abs(player.position.y - bounds.top) < 0.1) {
          stillOnPlatform = true
          break
        }
      }
      if (!stillOnPlatform) {
        player.isGrounded = false
      }
    }
    
    // Update state based on velocity (only if not in special states)
    if (player.hitstun <= 0 && !player.shielding && !player.dodging && player.attackCooldown <= 0) {
      if (!player.isGrounded) {
        if (player.velocity.y > 0) {
          player.state = 'jumping'
        } else {
          player.state = 'falling'
        }
      } else if (Math.abs(player.velocity.x) > 0.5) {
        player.state = 'running'
      } else {
        player.state = 'idle'
      }
    }
    
    // Check blast zones (KO)
    if (player.position.x < blastZones.left ||
        player.position.x > blastZones.right ||
        player.position.y > blastZones.top ||
        player.position.y < blastZones.bottom) {
      return 'ko'
    }
    
    // Decrease invincibility
    if (player.invincible > 0) {
      player.invincible--
    }
    
    // Decrease attack cooldown
    if (player.attackCooldown > 0) {
      player.attackCooldown--
    }
    
    return null
  }
  
  // Smash Bros-style knockback formula
  const calculateKnockback = (damage, baseDamage, baseKnockback, knockbackGrowth, weight, isMeteor = false) => {
    // Formula inspired by Smash Bros
    // ((((damage / 10 + damage * baseDamage / 20) * (200 / (weight + 100)) * 1.4) + 18) * knockbackGrowth) + baseKnockback
    const damageRatio = damage / 10 + (damage * baseDamage) / 20
    const weightRatio = WEIGHT_FACTOR / (weight * 100 + 100)
    const baseValue = damageRatio * weightRatio * 1.4 + 18
    const totalKnockback = baseValue * knockbackGrowth + baseKnockback * 10
    
    return totalKnockback * BASE_KNOCKBACK_SCALING
  }
  
  const applyKnockback = (player, knockback, direction, damage, isMeteor = false) => {
    const weight = player.character?.weight || 1.0
    
    // Add damage first (affects knockback calculation)
    const oldDamage = player.damage
    player.damage += damage
    
    // Calculate knockback using Smash-style formula
    const knockbackMultiplier = calculateKnockback(
      player.damage,
      damage,
      knockback,
      0.1 + knockback, // knockback growth
      weight,
      isMeteor
    )
    
    // Normalize and apply direction
    const dirMag = Math.sqrt(direction.x * direction.x + direction.y * direction.y)
    const normalizedDir = {
      x: direction.x / (dirMag || 1),
      y: direction.y / (dirMag || 1)
    }
    
    // Apply knockback velocity
    player.velocity.x = normalizedDir.x * knockbackMultiplier
    player.velocity.y = normalizedDir.y * knockbackMultiplier + 3 // Base upward pop
    
    // Meteor smash special handling
    if (isMeteor && !player.isGrounded) {
      player.velocity.y = -knockbackMultiplier * 0.8 // Strong downward
    }
    
    // Take player off ground
    player.isGrounded = false
    
    // Calculate hitstun (Smash Bros formula)
    // Hitstun = knockback * 0.4
    player.hitstun = Math.floor(knockbackMultiplier * 3)
    player.state = 'hitstun'
    
    // Tumble state if knockback is high enough
    if (knockbackMultiplier > 8) {
      player.tumbling = true
    }
  }
  
  const jump = (player, character) => {
    const maxJumps = 2
    if (player.jumpCount < maxJumps && !player.shielding && !player.dodging) {
      // First jump is higher than double jump
      const isDoubleJump = player.jumpCount > 0
      const baseJump = isDoubleJump ? 10 : 13
      const jumpForce = baseJump * (character.jumpPower || 1)
      
      player.velocity.y = jumpForce
      player.isGrounded = false
      player.jumpCount++
      player.state = 'jumping'
      player.tumbling = false // Cancel tumble with jump
      return true
    }
    return false
  }
  
  const shortHop = (player, character) => {
    if (player.isGrounded && !player.shielding && !player.dodging) {
      const jumpForce = 8 * (character.jumpPower || 1)
      player.velocity.y = jumpForce
      player.isGrounded = false
      player.jumpCount++
      player.state = 'jumping'
      return true
    }
    return false
  }
  
  const move = (player, direction, character) => {
    if (player.hitstun > 0) {
      // DI (Directional Influence) during hitstun
      player.velocity.x += direction * 0.15
      return
    }
    if (player.shielding || player.dodging || player.stunned > 0) return
    
    const speed = 0.9 * (character.speed || 1)
    const acceleration = player.isGrounded ? speed : speed * 0.65
    
    player.velocity.x += direction * acceleration
    
    // Cap horizontal speed (higher in air for mobility)
    const maxSpeed = player.isGrounded ? 7 : 9
    const charMaxSpeed = maxSpeed * (character.speed || 1)
    player.velocity.x = Math.max(-charMaxSpeed, Math.min(charMaxSpeed, player.velocity.x))
    
    // Update facing direction
    if (direction !== 0) {
      player.facing = direction > 0 ? 1 : -1
    }
  }
  
  const fastFall = (player) => {
    if (!player.isGrounded && player.velocity.y < 0 && !player.fastFalling) {
      player.velocity.y = terminalVelocity * 1.2
      player.fastFalling = true
    }
  }
  
  const resetFastFall = (player) => {
    player.fastFalling = false
  }
  
  return {
    updatePhysics,
    applyKnockback,
    calculateKnockback,
    jump,
    shortHop,
    move,
    fastFall,
    resetFastFall
  }
}
