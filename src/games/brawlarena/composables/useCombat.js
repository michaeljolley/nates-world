import { ref } from 'vue'

export function useCombat() {
  // Smash attack charge thresholds
  const SMASH_CHARGE_MIN = 10
  const SMASH_CHARGE_MAX = 60
  
  const checkAttackHit = (attacker, defender, attackType, isSmash = false, chargeTime = 0) => {
    if (defender.invincible > 0) return null
    if (defender.shielding) {
      // Shield hit - deplete shield
      defender.shieldHealth -= 5
      if (defender.shieldHealth <= 0) {
        // Shield break!
        defender.shieldBroken = true
        defender.stunned = 90 // Long stun
      }
      return { blocked: true }
    }
    if (defender.dodging) return null
    
    const attack = attacker.character.attacks[attackType]
    if (!attack) return null
    
    // Calculate attack hitbox position
    const attackX = attacker.position.x + (attacker.facing * attack.range * 0.5)
    const attackY = attackType === 'up' || attackType === 'upSmash'
      ? attacker.position.y + 1.5 
      : attackType === 'down' || attackType === 'downSmash'
        ? attacker.position.y - 0.5 
        : attacker.position.y + 0.6
    
    // Check distance to defender
    const dx = defender.position.x - attackX
    const dy = defender.position.y - attackY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Extend range for smash attacks
    const effectiveRange = isSmash ? attack.range * 1.3 : attack.range
    
    // Hit if within range
    if (distance < effectiveRange) {
      // Calculate smash multiplier
      const chargeMultiplier = isSmash 
        ? 1.0 + (Math.min(chargeTime, SMASH_CHARGE_MAX) / SMASH_CHARGE_MAX) * 0.5
        : 1.0
      
      // Calculate knockback direction based on attack type and position
      let knockbackDir = { x: attacker.facing, y: 0.3 }
      
      if (attackType === 'up' || attackType === 'upSmash') {
        knockbackDir = { x: attacker.facing * 0.3, y: 1 }
      } else if (attackType === 'down' || attackType === 'downSmash') {
        // Meteor smash if in air, otherwise pops up
        knockbackDir = defender.isGrounded 
          ? { x: attacker.facing * 0.5, y: 0.8 }
          : { x: attacker.facing * 0.2, y: -1 } // Spike!
      } else if (attackType === 'forward' || attackType === 'forwardSmash') {
        knockbackDir = { x: attacker.facing, y: 0.4 }
      }
      
      const baseDamage = attack.damage * chargeMultiplier
      const baseKnockback = attack.knockback * chargeMultiplier
      
      return {
        damage: baseDamage,
        knockback: baseKnockback,
        direction: knockbackDir,
        isSmash,
        isMeteor: attackType === 'down' && !defender.isGrounded
      }
    }
    
    return null
  }
  
  const performAttack = (player, attackType, isSmash = false, chargeTime = 0) => {
    if (player.attackCooldown > 0 || player.hitstun > 0 || player.shielding || player.dodging) return null
    
    const attack = player.character.attacks[attackType]
    if (!attack) return null
    
    // Smash attacks have longer startup and endlag
    const smashStartupMultiplier = isSmash ? 1.5 : 1
    const smashEndlagMultiplier = isSmash ? 1.3 : 1
    
    // Set cooldown
    player.attackCooldown = Math.floor((attack.startup + 10) * smashStartupMultiplier * smashEndlagMultiplier)
    player.state = 'attacking'
    player.currentAttack = attackType
    
    return {
      type: attackType,
      startup: Math.floor(attack.startup * smashStartupMultiplier),
      active: true,
      isSmash,
      chargeTime
    }
  }
  
  const startShield = (player) => {
    if (player.shieldBroken || player.hitstun > 0 || player.attackCooldown > 0) return false
    
    player.shielding = true
    player.state = 'shielding'
    return true
  }
  
  const releaseShield = (player) => {
    player.shielding = false
    if (player.state === 'shielding') {
      player.state = player.isGrounded ? 'idle' : 'falling'
    }
  }
  
  const performDodge = (player, direction = 0) => {
    if (player.dodgeCooldown > 0 || player.shieldBroken || player.hitstun > 0) return false
    
    player.dodging = true
    player.dodgeFrames = 15
    player.invincible = 12 // i-frames during dodge
    player.dodgeCooldown = 30
    
    if (direction !== 0 && player.isGrounded) {
      // Roll dodge
      player.velocity.x = direction * 8
      player.state = 'rolling'
    } else if (!player.isGrounded) {
      // Air dodge
      player.state = 'airdodge'
      player.velocity.x *= 0.5
      player.velocity.y *= 0.5
    } else {
      // Spot dodge
      player.state = 'spotdodge'
    }
    
    return true
  }
  
  const updateCombatState = (player) => {
    // Update dodge
    if (player.dodging) {
      player.dodgeFrames--
      if (player.dodgeFrames <= 0) {
        player.dodging = false
        if (player.state === 'rolling' || player.state === 'spotdodge' || player.state === 'airdodge') {
          player.state = player.isGrounded ? 'idle' : 'falling'
        }
      }
    }
    
    // Update dodge cooldown
    if (player.dodgeCooldown > 0) {
      player.dodgeCooldown--
    }
    
    // Regenerate shield
    if (!player.shielding && player.shieldHealth < 100) {
      player.shieldHealth = Math.min(100, player.shieldHealth + 0.2)
    }
    
    // Shield broken recovery
    if (player.shieldBroken) {
      player.stunned--
      if (player.stunned <= 0) {
        player.shieldBroken = false
        player.shieldHealth = 30
      }
    }
  }
  
  return {
    checkAttackHit,
    performAttack,
    startShield,
    releaseShield,
    performDodge,
    updateCombatState,
    SMASH_CHARGE_MIN
  }
}
