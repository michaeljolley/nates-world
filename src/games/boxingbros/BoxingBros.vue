<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

// Game constants
const ARENA_SIZE = 10
const MOVE_SPEED = 0.08
const ATTACK_RANGE = 2.5
const ATTACK_COOLDOWN = 500
const ATTACK_DAMAGE = 10
const NPC_ATTACK_COOLDOWN = 1000

// Game state
const gameState = ref('start')
const playerHealth = ref(100)
const npcHealth = ref(100)
const canvasRef = ref(null)
const firstPersonMode = ref(true) // First-person view by default

// Three.js objects
let scene, camera, renderer, animationId
let playerMesh, npcMesh
let playerGlove, npcGlove
let playerPos = { x: -3, z: 0 }
let npcPos = { x: 3, z: 0 }
let playerFacing = 1
let npcFacing = -1
let playerCanAttack = true
let npcCanAttack = true
let playerPunching = false
let npcPunching = false

const keys = ref({ up: false, down: false, left: false, right: false })

function initThreeJS() {
  const canvas = canvasRef.value
  const width = canvas.clientWidth
  const height = canvas.clientHeight

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a2e)

  // Camera - first-person uses wider FOV
  camera = new THREE.PerspectiveCamera(firstPersonMode.value ? 80 : 60, width / height, 0.1, 100)
  if (!firstPersonMode.value) {
    camera.position.set(0, 8, 12)
    camera.lookAt(0, 0, 0)
  }

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  const spotlight1 = new THREE.SpotLight(0xff6600, 1.5)
  spotlight1.position.set(-5, 10, 5)
  spotlight1.castShadow = true
  scene.add(spotlight1)

  const spotlight2 = new THREE.SpotLight(0x0066ff, 1.5)
  spotlight2.position.set(5, 10, 5)
  spotlight2.castShadow = true
  scene.add(spotlight2)

  // Boxing ring floor
  const ringGeometry = new THREE.BoxGeometry(ARENA_SIZE * 2, 0.3, ARENA_SIZE * 2)
  const ringMaterial = new THREE.MeshStandardMaterial({ color: 0x2a4a6a })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  ring.position.y = -0.15
  ring.receiveShadow = true
  scene.add(ring)

  // Ring ropes
  createRopes()

  // Corner posts
  createCornerPosts()

  // Create boxers
  playerMesh = createBoxer(0x3498db)
  playerMesh.position.set(playerPos.x, 0, playerPos.z)
  scene.add(playerMesh)

  npcMesh = createBoxer(0xe74c3c)
  npcMesh.position.set(npcPos.x, 0, npcPos.z)
  scene.add(npcMesh)

  // Get glove references
  playerGlove = playerMesh.getObjectByName('rightGlove')
  npcGlove = npcMesh.getObjectByName('rightGlove')
}

function createBoxer(color) {
  const group = new THREE.Group()

  // Body
  const bodyGeo = new THREE.CylinderGeometry(0.4, 0.35, 1.2, 8)
  const bodyMat = new THREE.MeshStandardMaterial({ color })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.position.y = 0.9
  body.castShadow = true
  group.add(body)

  // Head
  const headGeo = new THREE.SphereGeometry(0.35, 16, 16)
  const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac })
  const head = new THREE.Mesh(headGeo, headMat)
  head.position.y = 1.85
  head.castShadow = true
  group.add(head)

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.05, 8, 8)
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 })
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat)
  leftEye.position.set(-0.12, 1.9, 0.28)
  group.add(leftEye)
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat)
  rightEye.position.set(0.12, 1.9, 0.28)
  group.add(rightEye)

  // Boxing gloves
  const gloveGeo = new THREE.SphereGeometry(0.2, 12, 12)
  const gloveMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 })

  const leftGlove = new THREE.Mesh(gloveGeo, gloveMat)
  leftGlove.position.set(-0.6, 1.3, 0.3)
  leftGlove.castShadow = true
  leftGlove.name = 'leftGlove'
  group.add(leftGlove)

  const rightGlove = new THREE.Mesh(gloveGeo, gloveMat)
  rightGlove.position.set(0.6, 1.3, 0.3)
  rightGlove.castShadow = true
  rightGlove.name = 'rightGlove'
  group.add(rightGlove)

  // Shorts
  const shortsGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.4, 8)
  const shortsMat = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const shorts = new THREE.Mesh(shortsGeo, shortsMat)
  shorts.position.y = 0.4
  shorts.castShadow = true
  group.add(shorts)

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.5, 8)
  const legMat = new THREE.MeshStandardMaterial({ color: 0xffdbac })
  const leftLeg = new THREE.Mesh(legGeo, legMat)
  leftLeg.position.set(-0.18, 0.1, 0)
  group.add(leftLeg)
  const rightLeg = new THREE.Mesh(legGeo, legMat)
  rightLeg.position.set(0.18, 0.1, 0)
  group.add(rightLeg)

  return group
}

function createRopes() {
  const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
  const ropeRadius = 0.05
  const heights = [0.5, 1.0, 1.5]
  const halfSize = ARENA_SIZE - 0.5

  heights.forEach(y => {
    // Front and back ropes
    const frontRope = new THREE.Mesh(
      new THREE.CylinderGeometry(ropeRadius, ropeRadius, halfSize * 2, 8),
      ropeMaterial
    )
    frontRope.rotation.z = Math.PI / 2
    frontRope.position.set(0, y, halfSize)
    scene.add(frontRope)

    const backRope = new THREE.Mesh(
      new THREE.CylinderGeometry(ropeRadius, ropeRadius, halfSize * 2, 8),
      ropeMaterial
    )
    backRope.rotation.z = Math.PI / 2
    backRope.position.set(0, y, -halfSize)
    scene.add(backRope)

    // Left and right ropes
    const leftRope = new THREE.Mesh(
      new THREE.CylinderGeometry(ropeRadius, ropeRadius, halfSize * 2, 8),
      ropeMaterial
    )
    leftRope.rotation.x = Math.PI / 2
    leftRope.position.set(-halfSize, y, 0)
    scene.add(leftRope)

    const rightRope = new THREE.Mesh(
      new THREE.CylinderGeometry(ropeRadius, ropeRadius, halfSize * 2, 8),
      ropeMaterial
    )
    rightRope.rotation.x = Math.PI / 2
    rightRope.position.set(halfSize, y, 0)
    scene.add(rightRope)
  })
}

function createCornerPosts() {
  const postMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 })
  const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8)
  const halfSize = ARENA_SIZE - 0.5

  const positions = [
    [-halfSize, 1, -halfSize],
    [halfSize, 1, -halfSize],
    [-halfSize, 1, halfSize],
    [halfSize, 1, halfSize]
  ]

  positions.forEach(([x, y, z]) => {
    const post = new THREE.Mesh(postGeometry, postMaterial)
    post.position.set(x, y, z)
    post.castShadow = true
    scene.add(post)

    // Turnbuckle pad
    const padGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3)
    const padMat = new THREE.MeshStandardMaterial({ color: 0xff6600 })
    const pad = new THREE.Mesh(padGeo, padMat)
    pad.position.set(x, 1, z)
    scene.add(pad)
  })
}

function startGame() {
  playerHealth.value = 100
  npcHealth.value = 100
  playerPos = { x: -3, z: 0 }
  npcPos = { x: 3, z: 0 }
  playerFacing = 1
  npcFacing = -1
  playerCanAttack = true
  npcCanAttack = true
  gameState.value = 'playing'

  if (playerMesh) {
    playerMesh.position.set(playerPos.x, 0, playerPos.z)
    playerMesh.rotation.y = 0
  }
  if (npcMesh) {
    npcMesh.position.set(npcPos.x, 0, npcPos.z)
    npcMesh.rotation.y = Math.PI
  }
}

function animate() {
  animationId = requestAnimationFrame(animate)

  if (gameState.value === 'playing') {
    updatePlayer()
    updateNPC()
    checkWinConditions()
  }

  // Idle animation
  if (playerMesh) {
    playerMesh.position.y = Math.sin(Date.now() * 0.005) * 0.05
  }
  if (npcMesh) {
    npcMesh.position.y = Math.sin(Date.now() * 0.005 + 1) * 0.05
  }

  // First-person camera follows player's eyes
  if (firstPersonMode.value && playerMesh) {
    // Position camera at player's eye level
    camera.position.set(playerPos.x, 1.85, playerPos.z)
    // Look in the direction the player is facing (toward NPC)
    const lookDistance = 10
    camera.lookAt(
      playerPos.x + Math.sin(playerMesh.rotation.y) * lookDistance,
      1.5,
      playerPos.z + Math.cos(playerMesh.rotation.y) * lookDistance
    )
    // Hide player mesh in first-person
    playerMesh.visible = false
  } else if (playerMesh) {
    playerMesh.visible = true
  }

  renderer.render(scene, camera)
}

function updatePlayer() {
  let dx = 0, dz = 0

  if (keys.value.left) dx -= MOVE_SPEED
  if (keys.value.right) dx += MOVE_SPEED
  if (keys.value.up) dz -= MOVE_SPEED
  if (keys.value.down) dz += MOVE_SPEED

  // Update position with bounds
  const bound = ARENA_SIZE - 1
  playerPos.x = Math.max(-bound, Math.min(bound, playerPos.x + dx))
  playerPos.z = Math.max(-bound, Math.min(bound, playerPos.z + dz))

  if (playerMesh) {
    playerMesh.position.x = playerPos.x
    playerMesh.position.z = playerPos.z

    // Face NPC
    const angle = Math.atan2(npcPos.x - playerPos.x, npcPos.z - playerPos.z)
    playerMesh.rotation.y = angle
  }
}

function updateNPC() {
  const distX = playerPos.x - npcPos.x
  const distZ = playerPos.z - npcPos.z
  const distance = Math.sqrt(distX * distX + distZ * distZ)

  if (distance > ATTACK_RANGE) {
    const moveX = (distX / distance) * MOVE_SPEED * 0.6
    const moveZ = (distZ / distance) * MOVE_SPEED * 0.6

    const bound = ARENA_SIZE - 1
    npcPos.x = Math.max(-bound, Math.min(bound, npcPos.x + moveX))
    npcPos.z = Math.max(-bound, Math.min(bound, npcPos.z + moveZ))
  } else if (npcCanAttack) {
    npcAttack()
  }

  if (npcMesh) {
    npcMesh.position.x = npcPos.x
    npcMesh.position.z = npcPos.z

    // Face player
    const angle = Math.atan2(playerPos.x - npcPos.x, playerPos.z - npcPos.z)
    npcMesh.rotation.y = angle
  }
}

function playerAttack() {
  if (gameState.value !== 'playing' || !playerCanAttack) return

  playerCanAttack = false
  playerPunching = true

  // Animate punch
  if (playerGlove) {
    const originalZ = playerGlove.position.z
    playerGlove.position.z = 1.0
    setTimeout(() => {
      if (playerGlove) playerGlove.position.z = originalZ
      playerPunching = false
    }, 150)
  }

  // Check hit
  const distX = npcPos.x - playerPos.x
  const distZ = npcPos.z - playerPos.z
  const distance = Math.sqrt(distX * distX + distZ * distZ)

  if (distance < ATTACK_RANGE) {
    npcHealth.value = Math.max(0, npcHealth.value - ATTACK_DAMAGE)
    // Hit effect - make NPC flash
    if (npcMesh) {
      const body = npcMesh.children[0]
      const originalColor = body.material.color.getHex()
      body.material.color.setHex(0xffffff)
      setTimeout(() => body.material.color.setHex(originalColor), 100)
    }
  }

  setTimeout(() => {
    playerCanAttack = true
  }, ATTACK_COOLDOWN)
}

function npcAttack() {
  if (gameState.value !== 'playing' || !npcCanAttack) return

  npcCanAttack = false
  npcPunching = true

  // Animate punch
  if (npcGlove) {
    const originalZ = npcGlove.position.z
    npcGlove.position.z = 1.0
    setTimeout(() => {
      if (npcGlove) npcGlove.position.z = originalZ
      npcPunching = false
    }, 150)
  }

  // Check hit
  const distX = playerPos.x - npcPos.x
  const distZ = playerPos.z - npcPos.z
  const distance = Math.sqrt(distX * distX + distZ * distZ)

  if (distance < ATTACK_RANGE) {
    playerHealth.value = Math.max(0, playerHealth.value - ATTACK_DAMAGE)
    // Hit effect
    if (playerMesh) {
      const body = playerMesh.children[0]
      const originalColor = body.material.color.getHex()
      body.material.color.setHex(0xffffff)
      setTimeout(() => body.material.color.setHex(originalColor), 100)
    }
  }

  setTimeout(() => {
    npcCanAttack = true
  }, NPC_ATTACK_COOLDOWN)
}

function checkWinConditions() {
  if (npcHealth.value <= 0) {
    gameState.value = 'won'
  } else if (playerHealth.value <= 0) {
    gameState.value = 'lost'
  }
}

function toggleCameraView() {
  firstPersonMode.value = !firstPersonMode.value
  if (camera) {
    camera.fov = firstPersonMode.value ? 80 : 60
    camera.updateProjectionMatrix()
    if (!firstPersonMode.value) {
      // Reset to third-person position
      camera.position.set(0, 8, 12)
      camera.lookAt(0, 0, 0)
    }
  }
}

function handleKeyDown(e) {
  // V toggles camera view anytime
  if (e.key === 'v' || e.key === 'V') {
    e.preventDefault()
    toggleCameraView()
    return
  }

  if (gameState.value !== 'playing') return

  switch (e.key) {
    case 'ArrowUp': case 'w': case 'W':
      e.preventDefault()
      keys.value.up = true
      break
    case 'ArrowDown': case 's': case 'S':
      e.preventDefault()
      keys.value.down = true
      break
    case 'ArrowLeft': case 'a': case 'A':
      e.preventDefault()
      keys.value.left = true
      break
    case 'ArrowRight': case 'd': case 'D':
      e.preventDefault()
      keys.value.right = true
      break
    case ' ':
      e.preventDefault()
      playerAttack()
      break
  }
}

function handleKeyUp(e) {
  switch (e.key) {
    case 'ArrowUp': case 'w': case 'W':
      keys.value.up = false
      break
    case 'ArrowDown': case 's': case 'S':
      keys.value.down = false
      break
    case 'ArrowLeft': case 'a': case 'A':
      keys.value.left = false
      break
    case 'ArrowRight': case 'd': case 'D':
      keys.value.right = false
      break
  }
}

function handleResize() {
  if (!canvasRef.value || !renderer || !camera) return
  const width = canvasRef.value.clientWidth
  const height = canvasRef.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  initThreeJS()
  animate()
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="boxing-wrapper">
    <!-- Full screen 3D arena -->
    <div class="arena-3d">
      <canvas ref="canvasRef" class="game-canvas"></canvas>
      
      <!-- HUD overlay -->
      <div class="hud">
        <h1>BOXING BROS</h1>
        <div class="health-bars">
          <div class="health-container player-health">
            <span class="health-label">YOU</span>
            <div class="health-bar">
              <div class="health-fill" :style="{ width: `${playerHealth}%` }"></div>
            </div>
          </div>
          <div class="vs">VS</div>
          <div class="health-container npc-health">
            <span class="health-label">CPU</span>
            <div class="health-bar npc">
              <div class="health-fill npc" :style="{ width: `${npcHealth}%` }"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Start Overlay -->
      <div v-if="gameState === 'start'" class="overlay">
        <h2>🥊 BOXING BROS 🥊</h2>
        <div class="controls-hint">
          <p>WASD or Arrow Keys to Move</p>
          <p>SPACE to Punch</p>
          <p>V to Toggle Camera View</p>
        </div>
        <button class="start-btn" @click="startGame">START FIGHT</button>
      </div>
      
      <!-- Win Overlay -->
      <div v-if="gameState === 'won'" class="overlay win">
        <h2>🏆 KNOCKOUT! 🏆</h2>
        <p class="result-text">You Win!</p>
        <button class="start-btn" @click="startGame">FIGHT AGAIN</button>
      </div>
      
      <!-- Lose Overlay -->
      <div v-if="gameState === 'lost'" class="overlay lose">
        <h2>💫 DOWN! 💫</h2>
        <p class="result-text">You Lost!</p>
        <button class="start-btn" @click="startGame">TRY AGAIN</button>
      </div>
      
      <!-- Mobile controls -->
      <div class="mobile-controls" v-if="gameState === 'playing'">
        <div class="control-row">
          <button class="control-btn" @touchstart.prevent="keys.up = true" @touchend.prevent="keys.up = false">↑</button>
        </div>
        <div class="control-row">
          <button class="control-btn" @touchstart.prevent="keys.left = true" @touchend.prevent="keys.left = false">←</button>
          <button class="control-btn attack" @touchstart.prevent="playerAttack">🥊</button>
          <button class="control-btn" @touchstart.prevent="keys.right = true" @touchend.prevent="keys.right = false">→</button>
        </div>
        <div class="control-row">
          <button class="control-btn" @touchstart.prevent="keys.down = true" @touchend.prevent="keys.down = false">↓</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.boxing-wrapper {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  font-family: 'Courier New', monospace;
  color: #ff6600;
  --primary: #ff6600;
  --secondary: #ff0000;
}

.arena-3d {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.game-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.hud {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  pointer-events: none;
  z-index: 10;
}

.hud h1 {
  font-size: 1.8em;
  margin-bottom: 10px;
  letter-spacing: 4px;
  text-align: center;
  color: #ff6600;
  text-shadow: 0 0 10px #ff6600, 0 0 20px rgba(255, 102, 0, 0.5), 2px 2px 4px rgba(0,0,0,0.8);
}

.health-bars {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.health-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.health-label {
  font-size: 1em;
  font-weight: bold;
  min-width: 40px;
  text-shadow: 0 0 10px #ff6600, 2px 2px 4px rgba(0,0,0,0.8);
}

.health-bar {
  width: 180px;
  height: 25px;
  background: rgba(0, 0, 0, 0.7);
  border: 3px solid #00ff00;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.health-bar.npc {
  border-color: #ff0000;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}

.health-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff00, #00cc00);
  transition: width 0.3s ease;
  box-shadow: inset 0 0 10px rgba(255,255,255,0.3);
}

.health-fill.npc {
  background: linear-gradient(90deg, #ff0000, #cc0000);
}

.vs {
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 10px #fff, 2px 2px 4px rgba(0,0,0,0.8);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);
  z-index: 20;
}

.overlay h2 {
  font-size: 3em;
  margin-bottom: 20px;
  color: #ff6600;
  text-shadow: 0 0 20px #ff6600;
  letter-spacing: 4px;
}

.overlay.win h2 {
  color: #00ff00;
  text-shadow: 0 0 30px #00ff00;
}

.overlay.lose h2 {
  color: #ff0000;
  text-shadow: 0 0 30px #ff0000;
}

.result-text {
  font-size: 1.8em;
  margin-bottom: 25px;
  color: #fff;
}

.controls-hint {
  margin-bottom: 25px;
  font-size: 1.1em;
  opacity: 0.9;
  line-height: 2;
  color: #ccc;
}

.start-btn {
  font-family: 'Courier New', monospace;
  font-size: 1.4em;
  padding: 18px 50px;
  background: transparent;
  color: var(--primary);
  border: 3px solid var(--primary);
  border-radius: 10px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
  letter-spacing: 3px;
  font-weight: bold;
}

.start-btn:hover {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  color: #000;
  box-shadow: 0 0 40px var(--primary);
  text-shadow: none;
  transform: scale(1.05);
}

.mobile-controls {
  display: none;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: column;
  gap: 8px;
  z-index: 15;
}

.control-row {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.control-btn {
  font-family: 'Courier New', monospace;
  font-size: 1.5em;
  width: 65px;
  height: 65px;
  background: rgba(255, 102, 0, 0.2);
  color: var(--primary);
  border: 3px solid var(--primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.control-btn.attack {
  width: 75px;
  background: rgba(255, 0, 0, 0.3);
  border-color: #ff0000;
}

.control-btn:active {
  background: var(--primary);
  color: #000;
  transform: scale(0.9);
}

@media (max-width: 850px) {
  .mobile-controls {
    display: flex;
  }
  
  .health-bar {
    width: 120px;
  }
  
  .hud h1 {
    font-size: 1.4em;
  }
}

@media (max-width: 500px) {
  .health-bars {
    gap: 10px;
  }
  
  .health-bar {
    width: 80px;
    height: 20px;
  }
  
  .health-label {
    font-size: 0.8em;
    min-width: 30px;
  }
  
  .vs {
    font-size: 1em;
  }
  
  .hud h1 {
    font-size: 1.2em;
    margin-bottom: 5px;
  }
  
  .control-btn {
    width: 55px;
    height: 55px;
    font-size: 1.3em;
  }
  
  .control-btn.attack {
    width: 65px;
  }
}
</style>
