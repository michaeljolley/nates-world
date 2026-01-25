import { ref, shallowRef } from 'vue'
import * as THREE from 'three'

export function useGameLoop(scene, playerData, gameState, audio) {
  const playerShip = shallowRef(null)
  const enemyShips = ref([])
  const bullets = ref([])
  const lastShot = ref(0)
  const playerHealth = ref(100)
  const maxPlayerHealth = ref(100)

  function createDetailedShip(teamColor, scale = 1) {
    const group = new THREE.Group()
    
    const isBlue = teamColor === 0x0088ff
    const hullGray = new THREE.Color(0x4a5258)
    const darkGray = new THREE.Color(0x2d3236)
    const deckWood = new THREE.Color(0x6b4423)
    const metalDark = new THREE.Color(0x1a1c1e)
    const team = new THREE.Color(isBlue ? 0x1c3d5a : 0x8b0000)
    
    // Simplified but visible hull
    const hullGeo = new THREE.BoxGeometry(10 * scale, 3 * scale, 30 * scale)
    const hullMat = new THREE.MeshPhongMaterial({ color: hullGray, shininess: 25 })
    const hull = new THREE.Mesh(hullGeo, hullMat)
    hull.position.y = 1.5 * scale
    hull.castShadow = true
    hull.receiveShadow = true
    group.add(hull)

    // Bow (front point)
    const bowGeo = new THREE.ConeGeometry(5 * scale, 8 * scale, 4)
    const bow = new THREE.Mesh(bowGeo, hullMat)
    bow.rotation.x = Math.PI / 2
    bow.position.set(0, 1.5 * scale, 19 * scale)
    bow.castShadow = true
    group.add(bow)

    // Waterline stripe
    const waterlineGeo = new THREE.BoxGeometry(10.2 * scale, 0.5 * scale, 30 * scale)
    const waterlineMat = new THREE.MeshPhongMaterial({ color: team })
    const waterline = new THREE.Mesh(waterlineGeo, waterlineMat)
    waterline.position.y = 0.3 * scale
    group.add(waterline)

    // Main deck
    const deckGeo = new THREE.BoxGeometry(9 * scale, 0.5 * scale, 28 * scale)
    const deckMat = new THREE.MeshPhongMaterial({ color: deckWood, shininess: 10 })
    const deck = new THREE.Mesh(deckGeo, deckMat)
    deck.position.y = 3.3 * scale
    deck.receiveShadow = true
    group.add(deck)

    // Bridge / superstructure
    const bridgeGeo = new THREE.BoxGeometry(6 * scale, 4 * scale, 8 * scale)
    const bridgeMat = new THREE.MeshPhongMaterial({ color: darkGray, shininess: 40 })
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat)
    bridge.position.set(0, 5.5 * scale, -5 * scale)
    bridge.castShadow = true
    group.add(bridge)

    // Bridge upper level
    const bridge2Geo = new THREE.BoxGeometry(4 * scale, 2 * scale, 5 * scale)
    const bridge2 = new THREE.Mesh(bridge2Geo, bridgeMat)
    bridge2.position.set(0, 8.5 * scale, -5 * scale)
    bridge2.castShadow = true
    group.add(bridge2)

    // Forward turret
    const turretGeo = new THREE.CylinderGeometry(2.5 * scale, 3 * scale, 2 * scale, 12)
    const turretMat = new THREE.MeshPhongMaterial({ color: darkGray, shininess: 60 })
    const turret1 = new THREE.Mesh(turretGeo, turretMat)
    turret1.position.set(0, 4.5 * scale, 8 * scale)
    turret1.castShadow = true
    group.add(turret1)

    // Gun barrels (forward)
    for (let x of [-1, 0, 1]) {
      const barrelGeo = new THREE.CylinderGeometry(0.3 * scale, 0.4 * scale, 8 * scale, 8)
      const barrelMat = new THREE.MeshPhongMaterial({ color: metalDark, shininess: 80 })
      const barrel = new THREE.Mesh(barrelGeo, barrelMat)
      barrel.rotation.x = Math.PI / 2
      barrel.position.set(x * scale, 5 * scale, 14 * scale)
      barrel.castShadow = true
      group.add(barrel)
    }

    // Aft turret
    const turret2 = new THREE.Mesh(turretGeo, turretMat)
    turret2.position.set(0, 4.5 * scale, -12 * scale)
    turret2.castShadow = true
    group.add(turret2)

    // Funnel
    const funnelGeo = new THREE.CylinderGeometry(1 * scale, 1.5 * scale, 4 * scale, 12)
    const funnelMat = new THREE.MeshPhongMaterial({ color: 0x222222 })
    const funnel = new THREE.Mesh(funnelGeo, funnelMat)
    funnel.position.set(0, 7 * scale, 0)
    funnel.castShadow = true
    group.add(funnel)

    return group
  }

  function createPlayer() {
    const ship = playerData.selectedShip.value
    const shipScale = (ship.scale || 1) * 0.5
    const mesh = createDetailedShip(0x0088ff, shipScale)
    mesh.position.set(0, 0, 0)
    scene.value.add(mesh)
    
    playerShip.value = {
      mesh,
      speed: 0,
      maxSpeed: (ship.speed || 0.5) * 1.5,
      rotationSpeed: 0.02,
      health: ship.health || 100,
      maxHealth: ship.health || 100,
      damage: ship.damage || 20,
      fireRate: ship.fireRate || 1
    }
    
    playerHealth.value = playerShip.value.health
    maxPlayerHealth.value = playerShip.value.maxHealth
  }

  function spawnEnemy() {
    if (!scene.value) return
    
    const difficulty = gameState.difficulty.value
    const angle = Math.random() * Math.PI * 2
    const distance = 60 + Math.random() * 40
    
    const healthMultiplier = 0.5 + (difficulty * 0.3)
    const speedMultiplier = 0.5 + (difficulty * 0.2)
    const damageMultiplier = 0.5 + (difficulty * 0.25)
    
    const mesh = createDetailedShip(0xff4444, 0.4)
    mesh.position.set(
      Math.cos(angle) * distance,
      0,
      Math.sin(angle) * distance
    )
    scene.value.add(mesh)
    
    enemyShips.value.push({
      mesh,
      speed: (0.2 + Math.random() * 0.3) * speedMultiplier,
      health: Math.round((50 + Math.random() * 50) * healthMultiplier),
      maxHealth: Math.round((50 + Math.random() * 50) * healthMultiplier),
      damage: Math.round((10 + Math.random() * 10) * damageMultiplier),
      lastShot: 0,
      fireRate: 2.5 - (difficulty * 0.2)
    })
  }

  function shoot(ship, isPlayer = true) {
    if (!scene.value) return
    
    const now = Date.now()
    const fireDelay = isPlayer ? (1000 / playerShip.value.fireRate) : (ship.fireRate * 1000)
    
    if (now - (isPlayer ? lastShot.value : ship.lastShot) < fireDelay) return
    
    if (isPlayer) {
      lastShot.value = now
      playerData.updateStat('shotsFired')
      audio.playShot()
    } else {
      ship.lastShot = now
    }

    const bulletGeom = new THREE.SphereGeometry(0.5)
    const bulletMat = new THREE.MeshBasicMaterial({ 
      color: isPlayer ? 0x00ffff : 0xff0000 
    })
    const bullet = new THREE.Mesh(bulletGeom, bulletMat)
    
    const source = isPlayer ? playerShip.value.mesh : ship.mesh
    bullet.position.copy(source.position)
    bullet.position.y = 4
    
    const direction = new THREE.Vector3(0, 0, 1)
    direction.applyQuaternion(source.quaternion)
    
    scene.value.add(bullet)
    
    bullets.value.push({
      mesh: bullet,
      direction,
      speed: isPlayer ? 3 : 1.5,
      isPlayer,
      damage: isPlayer ? playerShip.value.damage : ship.damage,
      life: 150
    })
  }

  function updatePlayer(keys) {
    if (!playerShip.value) return

    // Throttle
    if (keys.w) {
      playerShip.value.speed = Math.min(
        playerShip.value.speed + 0.015, 
        playerShip.value.maxSpeed
      )
    } else if (keys.s) {
      playerShip.value.speed = Math.max(playerShip.value.speed - 0.015, -playerShip.value.maxSpeed / 2)
    } else {
      playerShip.value.speed *= 0.98
    }

    // Steering
    if (keys.a) {
      playerShip.value.mesh.rotation.y += playerShip.value.rotationSpeed
    }
    if (keys.d) {
      playerShip.value.mesh.rotation.y -= playerShip.value.rotationSpeed
    }

    // Move forward
    const direction = new THREE.Vector3(0, 0, 1)
    direction.applyQuaternion(playerShip.value.mesh.quaternion)
    playerShip.value.mesh.position.add(direction.multiplyScalar(playerShip.value.speed))

    // Shoot
    if (keys.space) {
      shoot(playerShip.value, true)
    }
  }

  function updateEnemies() {
    if (!playerShip.value) return

    enemyShips.value.forEach(enemy => {
      const dx = playerShip.value.mesh.position.x - enemy.mesh.position.x
      const dz = playerShip.value.mesh.position.z - enemy.mesh.position.z
      const targetAngle = Math.atan2(dx, dz)
      
      let angleDiff = targetAngle - enemy.mesh.rotation.y
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2
      
      enemy.mesh.rotation.y += Math.sign(angleDiff) * Math.min(0.015, Math.abs(angleDiff))
      
      const direction = new THREE.Vector3(0, 0, 1)
      direction.applyQuaternion(enemy.mesh.quaternion)
      enemy.mesh.position.add(direction.multiplyScalar(enemy.speed))
      
      const distance = Math.sqrt(dx * dx + dz * dz)
      if (distance < 80) {
        shoot(enemy, false)
      }
    })
  }

  function updateBullets() {
    if (!scene.value) return
    
    bullets.value = bullets.value.filter(bullet => {
      bullet.mesh.position.add(bullet.direction.clone().multiplyScalar(bullet.speed))
      bullet.life--
      
      if (bullet.life <= 0) {
        scene.value.remove(bullet.mesh)
        return false
      }

      if (bullet.isPlayer) {
        for (let i = enemyShips.value.length - 1; i >= 0; i--) {
          const enemy = enemyShips.value[i]
          const dist = bullet.mesh.position.distanceTo(enemy.mesh.position)
          if (dist < 8) {
            enemy.health -= bullet.damage
            playerData.updateStat('shotsHit')
            playerData.updateStat('damageDealt', bullet.damage)
            
            if (enemy.health <= 0) {
              scene.value.remove(enemy.mesh)
              enemyShips.value.splice(i, 1)
              gameState.addScore('blue')
              playerData.updateStat('kills')
              audio.playExplosion()
              
              setTimeout(() => spawnEnemy(), 1500)
            }
            
            scene.value.remove(bullet.mesh)
            return false
          }
        }
      } else {
        if (playerShip.value) {
          const dist = bullet.mesh.position.distanceTo(playerShip.value.mesh.position)
          if (dist < 8) {
            playerShip.value.health -= bullet.damage
            playerHealth.value = playerShip.value.health
            
            if (playerShip.value.health <= 0) {
              gameState.addScore('red')
              gameState.endGame('red')
            }
            
            scene.value.remove(bullet.mesh)
            return false
          }
        }
      }
      
      return true
    })
  }

  function updateCamera(camera) {
    if (!playerShip.value || !camera.value) return
    
    // Camera follows behind and above the player ship
    const offset = new THREE.Vector3(0, 15, -35)
    offset.applyQuaternion(playerShip.value.mesh.quaternion)
    
    const targetPos = playerShip.value.mesh.position.clone().add(offset)
    camera.value.position.lerp(targetPos, 0.1)
    
    // Look slightly ahead of the ship
    const lookTarget = playerShip.value.mesh.position.clone()
    lookTarget.y += 3
    camera.value.lookAt(lookTarget)
  }

  function startGame() {
    cleanup()
    createPlayer()
    
    const difficulty = gameState.difficulty.value
    const enemyCount = 2 + difficulty
    for (let i = 0; i < enemyCount; i++) {
      spawnEnemy()
    }
    
    playerData.updateStat('gamesPlayed')
  }

  function cleanup() {
    if (!scene.value) return
    
    if (playerShip.value) {
      scene.value.remove(playerShip.value.mesh)
      playerShip.value = null
    }
    
    enemyShips.value.forEach(e => {
      if (scene.value) scene.value.remove(e.mesh)
    })
    enemyShips.value = []
    
    bullets.value.forEach(b => {
      if (scene.value) scene.value.remove(b.mesh)
    })
    bullets.value = []
  }

  return {
    playerShip,
    enemyShips,
    bullets,
    playerHealth,
    maxPlayerHealth,
    createPlayer,
    spawnEnemy,
    shoot,
    updatePlayer,
    updateEnemies,
    updateBullets,
    updateCamera,
    startGame,
    cleanup
  }
}
