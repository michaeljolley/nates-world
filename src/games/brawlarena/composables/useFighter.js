import * as THREE from 'three'
import { ref } from 'vue'

export function useFighter(scene) {
  const fighters = ref([])
  const globalEffects = [] // For hit sparks, etc.
  
  const createFighter = (playerData, spawnPosition) => {
    const character = playerData.character
    const fighterGroup = new THREE.Group()
    
    // Body (torso)
    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.6)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: character.color,
      roughness: 0.4,
      metalness: 0.3
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.y = 0.6
    body.castShadow = true
    fighterGroup.add(body)
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.35, 16, 16)
    const headMaterial = new THREE.MeshStandardMaterial({
      color: character.secondaryColor,
      roughness: 0.5,
      metalness: 0.2
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = 1.55
    head.castShadow = true
    fighterGroup.add(head)
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8)
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const pupilGeometry = new THREE.SphereGeometry(0.04, 8, 8)
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 })
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    leftEye.position.set(-0.12, 1.6, 0.28)
    fighterGroup.add(leftEye)
    
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
    leftPupil.position.set(-0.12, 1.6, 0.34)
    fighterGroup.add(leftPupil)
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    rightEye.position.set(0.12, 1.6, 0.28)
    fighterGroup.add(rightEye)
    
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
    rightPupil.position.set(0.12, 1.6, 0.34)
    fighterGroup.add(rightPupil)
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.25, 0.7, 0.25)
    const armMaterial = new THREE.MeshStandardMaterial({
      color: character.color,
      roughness: 0.5,
      metalness: 0.2
    })
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial)
    leftArm.position.set(-0.55, 0.6, 0)
    leftArm.castShadow = true
    fighterGroup.add(leftArm)
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial)
    rightArm.position.set(0.55, 0.6, 0)
    rightArm.castShadow = true
    fighterGroup.add(rightArm)
    
    // Hands (fists)
    const handGeometry = new THREE.SphereGeometry(0.15, 8, 8)
    const handMaterial = new THREE.MeshStandardMaterial({
      color: character.secondaryColor,
      roughness: 0.6
    })
    
    const leftHand = new THREE.Mesh(handGeometry, handMaterial)
    leftHand.position.set(-0.55, 0.15, 0)
    leftHand.name = 'leftHand'
    fighterGroup.add(leftHand)
    
    const rightHand = new THREE.Mesh(handGeometry, handMaterial)
    rightHand.position.set(0.55, 0.15, 0)
    rightHand.name = 'rightHand'
    fighterGroup.add(rightHand)
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.3, 0.6, 0.3)
    const legMaterial = new THREE.MeshStandardMaterial({
      color: character.secondaryColor,
      roughness: 0.5,
      metalness: 0.2
    })
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
    leftLeg.position.set(-0.2, -0.3, 0)
    leftLeg.castShadow = true
    fighterGroup.add(leftLeg)
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
    rightLeg.position.set(0.2, -0.3, 0)
    rightLeg.castShadow = true
    fighterGroup.add(rightLeg)
    
    // Player indicator
    const indicatorGeometry = new THREE.ConeGeometry(0.2, 0.4, 4)
    const indicatorMaterial = new THREE.MeshBasicMaterial({
      color: playerData.id === 1 ? 0x4488ff : 0xff4444
    })
    const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial)
    indicator.position.y = 2.2
    indicator.rotation.x = Math.PI
    fighterGroup.add(indicator)
    
    // Shield bubble (initially invisible)
    const shieldGeometry = new THREE.SphereGeometry(1.2, 24, 16)
    const shieldMaterial = new THREE.MeshBasicMaterial({
      color: playerData.id === 1 ? 0x4488ff : 0xff4444,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial)
    shield.position.y = 0.6
    shield.name = 'shield'
    fighterGroup.add(shield)
    
    // Position the fighter
    fighterGroup.position.set(spawnPosition.x, spawnPosition.y, 0)
    scene.value.add(fighterGroup)
    
    const fighter = {
      group: fighterGroup,
      body,
      head,
      leftArm,
      rightArm,
      leftHand,
      rightHand,
      leftLeg,
      rightLeg,
      indicator,
      shield,
      playerId: playerData.id,
      character,
      attackEffects: []
    }
    
    fighters.value.push(fighter)
    return fighter
  }
  
  const updateFighterPosition = (fighter, position, facing) => {
    fighter.group.position.x = position.x
    fighter.group.position.y = position.y
    fighter.group.rotation.y = facing > 0 ? 0 : Math.PI
  }
  
  const animateFighter = (fighter, state, frame, playerData = null) => {
    const t = frame * 0.15
    
    // Reset positions first
    fighter.rightArm.position.z = 0
    fighter.body.rotation.y = 0
    fighter.body.rotation.z = 0
    
    switch (state) {
      case 'idle':
        // Subtle breathing animation
        fighter.body.position.y = 0.6 + Math.sin(t) * 0.02
        fighter.leftArm.rotation.x = Math.sin(t) * 0.05
        fighter.rightArm.rotation.x = -Math.sin(t) * 0.05
        fighter.leftLeg.rotation.x = 0
        fighter.rightLeg.rotation.x = 0
        break
        
      case 'running':
        // Running animation
        fighter.leftArm.rotation.x = Math.sin(t * 2) * 0.8
        fighter.rightArm.rotation.x = -Math.sin(t * 2) * 0.8
        fighter.leftLeg.rotation.x = -Math.sin(t * 2) * 0.6
        fighter.rightLeg.rotation.x = Math.sin(t * 2) * 0.6
        fighter.body.position.y = 0.6 + Math.abs(Math.sin(t * 2)) * 0.1
        break
        
      case 'jumping':
        // Arms up during jump
        fighter.leftArm.rotation.x = -0.5
        fighter.rightArm.rotation.x = -0.5
        fighter.leftLeg.rotation.x = 0.3
        fighter.rightLeg.rotation.x = 0.3
        break
        
      case 'falling':
        fighter.leftArm.rotation.x = 0.3
        fighter.rightArm.rotation.x = 0.3
        fighter.leftLeg.rotation.x = -0.2
        fighter.rightLeg.rotation.x = -0.2
        break
        
      case 'attacking':
        // Punch animation
        fighter.rightArm.rotation.x = -1.5
        fighter.rightArm.position.z = 0.3
        fighter.body.rotation.y = 0.2
        break
        
      case 'hitstun':
        // Getting hit animation - tumble
        fighter.body.position.y = 0.6 + Math.sin(t * 4) * 0.05
        fighter.body.rotation.z = Math.sin(t * 4) * 0.15
        fighter.leftArm.rotation.x = 0.5
        fighter.rightArm.rotation.x = 0.5
        break
        
      case 'shielding':
        // Defensive crouch
        fighter.body.position.y = 0.4
        fighter.leftArm.rotation.x = -0.8
        fighter.rightArm.rotation.x = -0.8
        fighter.leftLeg.rotation.x = 0.4
        fighter.rightLeg.rotation.x = 0.4
        break
        
      case 'rolling':
      case 'spotdodge':
        // Dodge animation
        fighter.body.rotation.z = Math.sin(t * 6) * 0.3
        fighter.body.position.y = 0.4
        break
        
      case 'airdodge':
        // Air dodge - curl up
        fighter.body.position.y = 0.5
        fighter.leftArm.rotation.x = 1
        fighter.rightArm.rotation.x = 1
        fighter.leftLeg.rotation.x = -0.8
        fighter.rightLeg.rotation.x = -0.8
        break
        
      default:
        // Reset to idle pose
        fighter.leftArm.rotation.x = 0
        fighter.rightArm.rotation.x = 0
        fighter.leftLeg.rotation.x = 0
        fighter.rightLeg.rotation.x = 0
    }
    
    // Animate indicator bobbing
    fighter.indicator.position.y = 2.2 + Math.sin(t * 2) * 0.1
  }
  
  const createAttackEffect = (fighter, attackType, facing, isSmash = false) => {
    const effectGroup = new THREE.Group()
    
    // Create attack visual based on type
    const colors = {
      neutral: 0xffffff,
      forward: fighter.character.color,
      forwardSmash: fighter.character.color,
      up: 0xffff00,
      upSmash: 0xffff00,
      down: 0xff8800,
      downSmash: 0xff8800,
      special: 0xff00ff,
      upSpecial: 0x00ffff,
      sideSpecial: 0xff6600,
      downSpecial: 0x8800ff
    }
    
    const size = isSmash ? 0.8 : 0.5
    const effectGeometry = new THREE.SphereGeometry(size, 8, 8)
    const effectMaterial = new THREE.MeshBasicMaterial({
      color: colors[attackType] || 0xffffff,
      transparent: true,
      opacity: 0.8
    })
    const effect = new THREE.Mesh(effectGeometry, effectMaterial)
    effectGroup.add(effect)
    
    // Add glow ring
    const ringGeometry = new THREE.RingGeometry(size * 0.6, size * 1.2, 16)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: colors[attackType] || 0xffffff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    effectGroup.add(ring)
    
    // Add smash charge lines for smash attacks
    if (isSmash) {
      for (let i = 0; i < 4; i++) {
        const lineGeo = new THREE.BoxGeometry(0.05, 0.6, 0.05)
        const lineMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.7
        })
        const line = new THREE.Mesh(lineGeo, lineMat)
        line.position.set(
          Math.cos(i * Math.PI / 2) * 0.5,
          0,
          Math.sin(i * Math.PI / 2) * 0.5
        )
        line.rotation.z = i * Math.PI / 4
        effectGroup.add(line)
      }
    }
    
    effectGroup.position.copy(fighter.group.position)
    effectGroup.position.x += facing * 1.2
    effectGroup.position.y += 0.6
    
    scene.value.add(effectGroup)
    
    // Store for cleanup
    const effectData = {
      group: effectGroup,
      life: isSmash ? 15 : 10
    }
    fighter.attackEffects.push(effectData)
    
    return effectData
  }
  
  const createHitEffect = (position, damage) => {
    const effectGroup = new THREE.Group()
    
    // Hit spark
    const sparkCount = Math.min(Math.floor(damage / 3) + 3, 12)
    for (let i = 0; i < sparkCount; i++) {
      const sparkGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1)
      const sparkMat = new THREE.MeshBasicMaterial({
        color: damage > 15 ? 0xff4400 : 0xffff00,
        transparent: true,
        opacity: 1
      })
      const spark = new THREE.Mesh(sparkGeo, sparkMat)
      spark.position.set(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 0.5
      )
      spark.userData.velocity = {
        x: (Math.random() - 0.5) * 0.3,
        y: Math.random() * 0.2 + 0.1,
        z: (Math.random() - 0.5) * 0.2
      }
      effectGroup.add(spark)
    }
    
    // Central flash
    const flashGeo = new THREE.SphereGeometry(0.4, 8, 8)
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    })
    const flash = new THREE.Mesh(flashGeo, flashMat)
    effectGroup.add(flash)
    
    effectGroup.position.set(position.x, position.y + 0.6, 0)
    scene.value.add(effectGroup)
    
    globalEffects.push({
      group: effectGroup,
      life: 20,
      type: 'hit'
    })
  }
  
  const createShieldHitEffect = (position) => {
    const effectGroup = new THREE.Group()
    
    // Shield ripple
    const rippleGeo = new THREE.RingGeometry(0.5, 0.7, 24)
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    })
    const ripple = new THREE.Mesh(rippleGeo, rippleMat)
    ripple.rotation.y = Math.PI / 4
    effectGroup.add(ripple)
    
    effectGroup.position.set(position.x, position.y + 0.6, 0.5)
    scene.value.add(effectGroup)
    
    globalEffects.push({
      group: effectGroup,
      life: 15,
      type: 'shield'
    })
  }
  
  const updateAttackEffects = (fighter) => {
    fighter.attackEffects = fighter.attackEffects.filter(effect => {
      effect.life--
      effect.group.scale.multiplyScalar(1.12)
      effect.group.children.forEach(child => {
        if (child.material) {
          child.material.opacity *= 0.85
        }
      })
      
      if (effect.life <= 0) {
        scene.value.remove(effect.group)
        return false
      }
      return true
    })
    
    // Update global effects
    for (let i = globalEffects.length - 1; i >= 0; i--) {
      const effect = globalEffects[i]
      effect.life--
      
      if (effect.type === 'hit') {
        effect.group.children.forEach(child => {
          if (child.userData.velocity) {
            child.position.x += child.userData.velocity.x
            child.position.y += child.userData.velocity.y
            child.userData.velocity.y -= 0.02
          }
          if (child.material) {
            child.material.opacity *= 0.9
          }
        })
      } else if (effect.type === 'shield') {
        effect.group.scale.multiplyScalar(1.15)
        effect.group.children.forEach(child => {
          if (child.material) {
            child.material.opacity *= 0.85
          }
        })
      }
      
      if (effect.life <= 0) {
        scene.value.remove(effect.group)
        globalEffects.splice(i, 1)
      }
    }
  }
  
  const setFighterInvincible = (fighter, isInvincible) => {
    fighter.group.traverse(child => {
      if (child.material && child !== fighter.indicator && child.name !== 'shield') {
        child.material.transparent = true
        child.material.opacity = isInvincible ? 0.5 : 1
      }
    })
  }
  
  const updateShieldVisual = (fighter, isShielding, shieldHealth) => {
    if (isShielding) {
      fighter.shield.material.opacity = 0.4 * (shieldHealth / 100)
      fighter.shield.scale.setScalar(0.8 + (shieldHealth / 100) * 0.4)
    } else {
      fighter.shield.material.opacity = 0
    }
  }
  
  const cleanup = () => {
    fighters.value.forEach(fighter => {
      scene.value.remove(fighter.group)
      fighter.attackEffects.forEach(effect => {
        scene.value.remove(effect.group)
      })
    })
    globalEffects.forEach(effect => {
      scene.value.remove(effect.group)
    })
    globalEffects.length = 0
    fighters.value = []
  }
  
  return {
    fighters,
    createFighter,
    updateFighterPosition,
    animateFighter,
    createAttackEffect,
    createHitEffect,
    createShieldHitEffect,
    updateAttackEffects,
    setFighterInvincible,
    updateShieldVisual,
    cleanup
  }
}
