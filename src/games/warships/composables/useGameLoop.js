import { ref, shallowRef } from 'vue'
import * as THREE from 'three'

export function useGameLoop(scene, playerData, gameState, audio) {
  const playerShip = shallowRef(null)
  const enemyShips = ref([])
  const bullets = ref([])
  const lastShot = ref(0)
  const playerHealth = ref(100)
  const maxPlayerHealth = ref(100)

  // Material colors for ships
  const hullGray = new THREE.Color(0x4a5258)
  const darkGray = new THREE.Color(0x2d3236)
  const deckWood = new THREE.Color(0x6b4423)
  const metalDark = new THREE.Color(0x1a1c1e)
  const rust = new THREE.Color(0x5a3d2b)

  function createDetailedShip(teamColor, scale = 1, isPlayer = false, shipData = null) {
    const group = new THREE.Group()
    
    const isBlue = teamColor === 0x0088ff
    const team = new THREE.Color(isBlue ? 0x1c3d5a : 0x8b0000)
    
    // If player with ship data, use unique design based on ship ID
    if (isPlayer && shipData) {
      return createUniqueShip(team, scale, shipData)
    }
    
    // Standard detailed ship for enemies
    const hullMat = new THREE.MeshPhongMaterial({ color: hullGray, shininess: 25 })
    const armorMat = new THREE.MeshPhongMaterial({ color: darkGray, shininess: 45 })
    const deckMat = new THREE.MeshPhongMaterial({ color: deckWood, shininess: 10 })
    const metalMat = new THREE.MeshPhongMaterial({ color: metalDark, shininess: 60 })

    // Lower hull
    const lowerHullGeo = new THREE.BoxGeometry(10 * scale, 3 * scale, 30 * scale)
    const lowerHull = new THREE.Mesh(lowerHullGeo, new THREE.MeshPhongMaterial({ color: 0x2a1515, shininess: 15 }))
    lowerHull.position.y = -1 * scale
    lowerHull.castShadow = true
    group.add(lowerHull)

    // Upper hull
    const upperHullGeo = new THREE.BoxGeometry(10 * scale, 4 * scale, 30 * scale)
    const upperHull = new THREE.Mesh(upperHullGeo, hullMat)
    upperHull.position.y = 2.5 * scale
    upperHull.castShadow = true
    group.add(upperHull)

    // Bow (front point)
    const bowGeo = new THREE.ConeGeometry(5 * scale, 10 * scale, 4)
    const bow = new THREE.Mesh(bowGeo, hullMat)
    bow.rotation.x = Math.PI / 2
    bow.position.set(0, 1.5 * scale, 20 * scale)
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
    const deck = new THREE.Mesh(deckGeo, deckMat)
    deck.position.y = 4.8 * scale
    deck.receiveShadow = true
    group.add(deck)

    // Deck planking detail
    for (let i = -12; i <= 12; i += 2) {
      const plankGeo = new THREE.BoxGeometry(0.1 * scale, 0.1 * scale, 26 * scale)
      const plankMat = new THREE.MeshPhongMaterial({ color: 0x3d2817 })
      const plank = new THREE.Mesh(plankGeo, plankMat)
      plank.position.set(i * 0.35 * scale, 5.1 * scale, 0)
      group.add(plank)
    }

    // Bridge / superstructure
    const bridgeGeo = new THREE.BoxGeometry(6 * scale, 5 * scale, 8 * scale)
    const bridge = new THREE.Mesh(bridgeGeo, armorMat)
    bridge.position.set(0, 7.5 * scale, -4 * scale)
    bridge.castShadow = true
    group.add(bridge)

    // Bridge upper level
    const bridge2Geo = new THREE.BoxGeometry(4 * scale, 3 * scale, 5 * scale)
    const bridge2 = new THREE.Mesh(bridge2Geo, armorMat)
    bridge2.position.set(0, 11.5 * scale, -4 * scale)
    bridge2.castShadow = true
    group.add(bridge2)

    // Bridge windows
    for (let i = -2; i <= 2; i++) {
      const windowGeo = new THREE.BoxGeometry(0.8 * scale, 0.4 * scale, 0.2 * scale)
      const windowMat = new THREE.MeshPhongMaterial({ color: 0x1a3050, emissive: 0x0a1525, emissiveIntensity: 0.5 })
      const windowMesh = new THREE.Mesh(windowGeo, windowMat)
      windowMesh.position.set(i * 0.9 * scale, 11 * scale, -1.5 * scale)
      group.add(windowMesh)
    }

    // Forward turret barbette
    const barbetteGeo = new THREE.CylinderGeometry(3 * scale, 3.5 * scale, 2 * scale, 12)
    const barbette = new THREE.Mesh(barbetteGeo, armorMat)
    barbette.position.set(0, 6 * scale, 8 * scale)
    barbette.castShadow = true
    group.add(barbette)

    // Forward turret housing
    const turretGeo = new THREE.CylinderGeometry(2.5 * scale, 3 * scale, 2 * scale, 12)
    const turret1 = new THREE.Mesh(turretGeo, armorMat)
    turret1.position.set(0, 7.5 * scale, 8 * scale)
    turret1.castShadow = true
    group.add(turret1)

    // Gun barrels (forward) - triple
    for (let x of [-1, 0, 1]) {
      const barrelGeo = new THREE.CylinderGeometry(0.3 * scale, 0.4 * scale, 10 * scale, 8)
      const barrel = new THREE.Mesh(barrelGeo, metalMat)
      barrel.rotation.x = Math.PI / 2
      barrel.position.set(x * scale, 7.5 * scale, 15 * scale)
      barrel.castShadow = true
      group.add(barrel)
    }

    // Aft turret
    const turret2 = new THREE.Mesh(turretGeo.clone(), armorMat)
    turret2.position.set(0, 7.5 * scale, -12 * scale)
    turret2.castShadow = true
    group.add(turret2)

    // Aft gun barrels
    for (let x of [-1, 0, 1]) {
      const barrelGeo = new THREE.CylinderGeometry(0.3 * scale, 0.4 * scale, 10 * scale, 8)
      const barrel = new THREE.Mesh(barrelGeo, metalMat)
      barrel.rotation.x = -Math.PI / 2
      barrel.position.set(x * scale, 7.5 * scale, -19 * scale)
      barrel.castShadow = true
      group.add(barrel)
    }

    // Funnel
    const funnelGeo = new THREE.CylinderGeometry(1.2 * scale, 1.6 * scale, 6 * scale, 12)
    const funnelMat = new THREE.MeshPhongMaterial({ color: 0x222222 })
    const funnel = new THREE.Mesh(funnelGeo, funnelMat)
    funnel.position.set(0, 10 * scale, 0)
    funnel.castShadow = true
    group.add(funnel)

    // Funnel band (team color)
    const bandGeo = new THREE.CylinderGeometry(1.4 * scale, 1.4 * scale, 1 * scale, 12)
    const bandMat = new THREE.MeshPhongMaterial({ color: team })
    const band = new THREE.Mesh(bandGeo, bandMat)
    band.position.set(0, 11 * scale, 0)
    group.add(band)

    // Mast
    const mastGeo = new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 12 * scale, 8)
    const mastMat = new THREE.MeshPhongMaterial({ color: darkGray })
    const mast = new THREE.Mesh(mastGeo, mastMat)
    mast.position.set(0, 18 * scale, -4 * scale)
    group.add(mast)

    // Radar
    const radarGeo = new THREE.BoxGeometry(5 * scale, 0.3 * scale, 2 * scale)
    const radar = new THREE.Mesh(radarGeo, new THREE.MeshPhongMaterial({ color: 0x444444 }))
    radar.position.set(0, 24 * scale, -4 * scale)
    group.add(radar)

    // Navigation lights
    const lightGeo = new THREE.SphereGeometry(0.4 * scale, 8, 8)
    
    // Port (red) and starboard (green) lights - player gets green
    const portColor = isPlayer ? 0x00ff88 : 0xff0000
    const starboardColor = isPlayer ? 0x00ff88 : 0x00ff00
    
    const portLight = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: portColor }))
    portLight.position.set(0, 11 * scale, 3 * scale)
    group.add(portLight)
    
    const starboardLight = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: starboardColor }))
    starboardLight.position.set(3 * scale, 11 * scale, 0)
    group.add(starboardLight)

    // Player indicator ring
    if (isPlayer) {
      const glowGeo = new THREE.TorusGeometry(12 * scale, 0.5 * scale, 8, 32)
      const glowMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.4 })
      const glow = new THREE.Mesh(glowGeo, glowMat)
      glow.rotation.x = Math.PI / 2
      glow.position.y = 1 * scale
      group.add(glow)

      const spotlight = new THREE.PointLight(0x00ff88, 1.5, 60 * scale)
      spotlight.position.set(0, 15 * scale, 0)
      group.add(spotlight)
    }

    // Rust streaks (weathering detail)
    for (let i = 0; i < 6; i++) {
      const rustGeo = new THREE.PlaneGeometry(0.3 * scale, (2 + Math.random() * 2) * scale)
      const rustMat = new THREE.MeshBasicMaterial({ 
        color: rust, 
        transparent: true, 
        opacity: 0.3 + Math.random() * 0.3,
        side: THREE.DoubleSide
      })
      const rustStreak = new THREE.Mesh(rustGeo, rustMat)
      rustStreak.position.set(
        -10 + Math.random() * 20,
        2 + Math.random() * 3,
        (Math.random() > 0.5 ? 5.1 : -5.1) * scale
      )
      group.add(rustStreak)
    }

    // Team flag
    const flagPoleGeo = new THREE.CylinderGeometry(0.08 * scale, 0.08 * scale, 5 * scale, 6)
    const flagPole = new THREE.Mesh(flagPoleGeo, mastMat)
    flagPole.position.set(0, 7 * scale, -14 * scale)
    group.add(flagPole)

    const flagGeo = new THREE.PlaneGeometry(3 * scale, 2 * scale)
    const flagMat = new THREE.MeshPhongMaterial({ 
      color: isBlue ? 0x3366ff : 0xff3333, 
      side: THREE.DoubleSide 
    })
    const flag = new THREE.Mesh(flagGeo, flagMat)
    flag.position.set(0, 9 * scale, -12.5 * scale)
    group.add(flag)

    return group
  }

  function createUniqueShip(team, scale, shipData) {
    const group = new THREE.Group()
    const shipId = shipData.id
    
    // Generate unique colors based on ship ID hash
    function hashCode(str) {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i)
        hash = hash & hash
      }
      return Math.abs(hash)
    }
    
    const hash = hashCode(shipId)
    const hue1 = (hash % 360) / 360
    const hue2 = ((hash * 7) % 360) / 360
    const hue3 = ((hash * 13) % 360) / 360
    
    const hullColor = new THREE.Color().setHSL(hue1, 0.4, 0.25)
    const accentColor = new THREE.Color().setHSL(hue2, 0.7, 0.5)
    const glowColor = new THREE.Color().setHSL(hue3, 0.9, 0.6)
    
    const hullMat = new THREE.MeshPhongMaterial({ color: hullColor, shininess: 30 })
    const accentMat = new THREE.MeshPhongMaterial({ color: accentColor, shininess: 60 })
    const darkMat = new THREE.MeshPhongMaterial({ color: 0x1a1a1a, shininess: 40 })
    const glowMat = new THREE.MeshBasicMaterial({ color: glowColor })
    
    // Ship parameters from stats
    const healthScale = 0.6 + (shipData.health / 150) * 0.8
    const damageScale = 0.8 + (shipData.damage - 1) * 0.3
    
    // Unique hull shape parameters based on hash
    const bowLength = 8 + (hash % 20)
    const hullWidth = 4 + (hash % 6)
    
    // Main hull
    const hullGeo = new THREE.BoxGeometry((bowLength + 18) * scale, 5 * healthScale * scale, hullWidth * 2 * scale)
    const hull = new THREE.Mesh(hullGeo, hullMat)
    hull.position.y = 2 * scale
    hull.castShadow = true
    group.add(hull)
    
    // Bow
    const bowGeo = new THREE.ConeGeometry(hullWidth * scale, 10 * scale, 4)
    const bow = new THREE.Mesh(bowGeo, hullMat)
    bow.rotation.x = Math.PI / 2
    bow.position.set(0, 2 * scale, (bowLength + 5) * scale)
    bow.castShadow = true
    group.add(bow)
    
    // Deck
    const deckGeo = new THREE.BoxGeometry((bowLength + 16) * scale, 0.5 * scale, (hullWidth * 1.8) * scale)
    const deckMat = new THREE.MeshPhongMaterial({ color: 0x4a3a2a, shininess: 10 })
    const deck = new THREE.Mesh(deckGeo, deckMat)
    deck.position.set(0, 5 * healthScale * scale, 0)
    group.add(deck)
    
    // === SUPERSTRUCTURE - unique per ship ===
    const bridgeStyle = hash % 5
    const bridgeHeight = 4 + ((hash >> 3) % 5)
    const bridgeWidth = 4 + ((hash >> 5) % 4)
    
    if (bridgeStyle === 0) {
      // Box bridge
      const bridgeGeo = new THREE.BoxGeometry(8 * scale, bridgeHeight * scale, bridgeWidth * scale)
      const bridge = new THREE.Mesh(bridgeGeo, accentMat)
      bridge.position.set(0, (5 * healthScale + bridgeHeight/2) * scale, -2 * scale)
      bridge.castShadow = true
      group.add(bridge)
    } else if (bridgeStyle === 1) {
      // Cylinder tower
      const towerGeo = new THREE.CylinderGeometry(bridgeWidth/2 * scale, (bridgeWidth/2 + 1) * scale, bridgeHeight * scale, 8)
      const tower = new THREE.Mesh(towerGeo, accentMat)
      tower.position.set(0, (5 * healthScale + bridgeHeight/2) * scale, -2 * scale)
      tower.castShadow = true
      group.add(tower)
    } else if (bridgeStyle === 2) {
      // Stepped bridge
      for (let i = 0; i < 3; i++) {
        const stepGeo = new THREE.BoxGeometry((8 - i*2) * scale, (bridgeHeight/3) * scale, (bridgeWidth - i) * scale)
        const step = new THREE.Mesh(stepGeo, accentMat)
        step.position.set(0, (5 * healthScale + bridgeHeight/3 * (i + 0.5)) * scale, -2 * scale)
        step.castShadow = true
        group.add(step)
      }
    } else if (bridgeStyle === 3) {
      // Angled bridge
      const bridgeGeo = new THREE.BoxGeometry(10 * scale, bridgeHeight * scale, bridgeWidth * scale)
      const bridge = new THREE.Mesh(bridgeGeo, accentMat)
      bridge.position.set(0, (5 * healthScale + bridgeHeight/2) * scale, -2 * scale)
      bridge.rotation.z = 0.15
      bridge.castShadow = true
      group.add(bridge)
    } else {
      // Dome bridge
      const domeGeo = new THREE.SphereGeometry(bridgeWidth * scale, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2)
      const dome = new THREE.Mesh(domeGeo, accentMat)
      dome.position.set(0, 5 * healthScale * scale, -2 * scale)
      dome.castShadow = true
      group.add(dome)
    }
    
    // === TURRETS - number based on damage stat ===
    const numTurrets = Math.max(1, Math.min(4, Math.floor(shipData.damage)))
    const turretPositions = [
      [bowLength - 2, 0],
      [-8, 0],
      [bowLength - 8, -3],
      [bowLength - 8, 3]
    ]
    
    const turretStyle = (hash >> 10) % 3
    for (let i = 0; i < numTurrets; i++) {
      const [tx, tz] = turretPositions[i]
      
      let turretGeo
      if (turretStyle === 0) {
        turretGeo = new THREE.CylinderGeometry(2 * scale, 2.5 * scale, 2 * scale, 8)
      } else if (turretStyle === 1) {
        turretGeo = new THREE.BoxGeometry(3 * scale, 2 * scale, 3 * scale)
      } else {
        turretGeo = new THREE.CylinderGeometry(2 * scale, 2.3 * scale, 2 * scale, 6)
      }
      
      const turret = new THREE.Mesh(turretGeo, darkMat)
      turret.position.set(0, 6 * healthScale * scale, tx * scale)
      turret.castShadow = true
      group.add(turret)
      
      // Gun barrels - number varies
      const numBarrels = 1 + ((hash >> (12 + i)) % 3)
      const barrelSpacing = 1.2
      const startX = -(numBarrels - 1) * barrelSpacing / 2
      
      for (let b = 0; b < numBarrels; b++) {
        const barrelLen = 8 + damageScale * 4
        const barrelGeo = new THREE.CylinderGeometry((0.3 + damageScale * 0.2) * scale, (0.4 + damageScale * 0.2) * scale, barrelLen * scale, 8)
        const barrel = new THREE.Mesh(barrelGeo, accentMat)
        barrel.rotation.x = Math.PI / 2
        barrel.position.set((startX + b * barrelSpacing) * scale, 6 * healthScale * scale, (tx + barrelLen/2 + 2) * scale)
        barrel.castShadow = true
        group.add(barrel)
      }
    }
    
    // === DECORATIVE ELEMENTS based on category ===
    const category = shipData.category
    
    if (category === 'speed') {
      // Speed fins
      for (let x of [-(hullWidth + 1), hullWidth + 1]) {
        const finGeo = new THREE.BoxGeometry(15 * scale, 0.3 * scale, 2 * scale)
        const fin = new THREE.Mesh(finGeo, accentMat)
        fin.position.set(x * scale, 3 * scale, -5 * scale)
        fin.rotation.z = x > 0 ? 0.1 : -0.1
        group.add(fin)
      }
      // Engine glows
      for (let x of [-2, 0, 2]) {
        const engineGeo = new THREE.SphereGeometry(0.8 * scale, 8, 8)
        const engine = new THREE.Mesh(engineGeo, glowMat)
        engine.position.set(x * scale, 3 * scale, -22 * scale)
        group.add(engine)
      }
    } else if (category === 'tank') {
      // Armor plates
      for (let z = -10; z <= 15; z += 5) {
        const plateGeo = new THREE.BoxGeometry(4 * scale, 3 * scale, (hullWidth * 2 + 2) * scale)
        const plateMat = new THREE.MeshPhongMaterial({ color: 0x333333, shininess: 20 })
        const plate = new THREE.Mesh(plateGeo, plateMat)
        plate.position.set(0, 6 * healthScale * scale, z * scale)
        group.add(plate)
      }
    } else if (category === 'damage') {
      // Weapon glow strips
      for (let x of [-(hullWidth + 0.5), hullWidth + 0.5]) {
        const stripGeo = new THREE.BoxGeometry((bowLength + 20) * scale, 0.4 * scale, 0.4 * scale)
        const strip = new THREE.Mesh(stripGeo, glowMat)
        strip.position.set(x * scale, 4 * scale, 0)
        group.add(strip)
      }
    } else if (category === 'special') {
      // Unique rotating rings
      const ringGeo = new THREE.TorusGeometry(4 * scale, 0.3 * scale, 8, 24)
      const ring1 = new THREE.Mesh(ringGeo, glowMat)
      ring1.position.set(0, 12 * healthScale * scale, 0)
      ring1.rotation.x = Math.PI / 4
      group.add(ring1)
      
      const ring2 = new THREE.Mesh(ringGeo.clone(), glowMat)
      ring2.position.set(0, 12 * healthScale * scale, 0)
      ring2.rotation.x = -Math.PI / 4
      group.add(ring2)
    }
    
    // === PLAYER INDICATOR ===
    const lightGeo = new THREE.SphereGeometry(0.5 * scale, 8, 8)
    const playerLight = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: 0x00ff88 }))
    playerLight.position.set(3 * scale, 8 * scale, bowLength * scale)
    group.add(playerLight)
    
    const playerLight2 = new THREE.Mesh(lightGeo.clone(), new THREE.MeshBasicMaterial({ color: 0x00ff88 }))
    playerLight2.position.set(-3 * scale, 8 * scale, bowLength * scale)
    group.add(playerLight2)
    
    // Player glow ring
    const glowRingGeo = new THREE.TorusGeometry(18 * scale, 0.5 * scale, 8, 32)
    const glowRingMat = new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: 0.4 })
    const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat)
    glowRing.rotation.x = Math.PI / 2
    glowRing.position.y = 1 * scale
    group.add(glowRing)
    
    // Player spotlight
    const spotlight = new THREE.PointLight(glowColor, 1.5, 60 * scale)
    spotlight.position.set(0, 15 * scale, 0)
    group.add(spotlight)
    
    return group
  }

  function createPlayer() {
    const ship = playerData.selectedShip.value
    const shipScale = (ship.scale || 1) * 0.5
    const mesh = createDetailedShip(0x0088ff, shipScale, true, ship)
    mesh.position.set(0, 0, 0)
    scene.value.add(mesh)
    
    // Use multiplier-based stats from game2
    const baseHealth = 100
    const baseSpeed = 0.5
    const baseDamage = 25
    const baseFireRate = 1
    
    playerShip.value = {
      mesh,
      speed: 0,
      maxSpeed: baseSpeed * ship.speed * 1.5,
      rotationSpeed: 0.02,
      health: Math.round(baseHealth * ship.health / 100),
      maxHealth: Math.round(baseHealth * ship.health / 100),
      damage: Math.round(baseDamage * ship.damage),
      fireRate: baseFireRate * ship.fireRate
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
    
    const mesh = createDetailedShip(0xff4444, 0.4, false, null)
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
    if (keys.a || keys.q) {
      playerShip.value.mesh.rotation.y += playerShip.value.rotationSpeed
    }
    if (keys.d || keys.e) {
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
