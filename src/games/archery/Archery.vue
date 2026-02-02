<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

// Game state
const gamePhase = ref('aiming') // 'aiming', 'flying', 'result'
const angle = ref(15) // Lower default angle - easier
const power = ref(70) // Higher default power - easier
const score = ref(0)
const totalScore = ref(0)
const arrowsLeft = ref(5)
const roundScores = ref([])

// 3D Scene
const containerRef = ref(null)
let scene, camera, renderer
let arrow, target, bow, archer
let animationId = null
let clock = new THREE.Clock()

// Arrow physics (3D)
let arrowPos = { x: -12, y: 2.5, z: 0 }
let arrowVel = { x: 0, y: 0, z: 0 }
let arrowRotation = 0

// Target position - CLOSER for easier game
const TARGET_X = 20
const TARGET_Y = 2.5

// Ring sizes - LARGER for easier hits
const ringRadii = [0.5, 1.2, 2.0, 2.8, 3.6]
const ringPoints = [100, 80, 60, 40, 20]

// Physics - EASIER settings
const GRAVITY = 0.012
const ARROW_START = { x: -12, y: 2.5, z: 0 }

// Wind - minimal for easier game
const wind = ref(0)

function createScene() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87CEEB)
  scene.fog = new THREE.Fog(0x87CEEB, 50, 150)

  camera = new THREE.PerspectiveCamera(
    60,
    containerRef.value.clientWidth / containerRef.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(-18, 5, 12)
  camera.lookAt(0, 2, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  renderer.shadowMap.enabled = true
  containerRef.value.appendChild(renderer.domElement)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const sunLight = new THREE.DirectionalLight(0xffffcc, 1)
  sunLight.position.set(20, 30, 10)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.width = 2048
  sunLight.shadow.mapSize.height = 2048
  scene.add(sunLight)

  createEnvironment()
  createTarget()
  createArcher()
  createArrow()
}

function createEnvironment() {
  // Ground
  const groundGeometry = new THREE.PlaneGeometry(200, 200)
  const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x228B22,
    roughness: 0.8
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // Some trees in background
  for (let i = 0; i < 15; i++) {
    const treeX = Math.random() * 80 - 40
    const treeZ = -20 - Math.random() * 30
    createTree(treeX, treeZ)
  }

  // Sun (visual)
  const sunGeometry = new THREE.SphereGeometry(3, 32, 32)
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFDD00 })
  const sun = new THREE.Mesh(sunGeometry, sunMaterial)
  sun.position.set(30, 25, -20)
  scene.add(sun)

  // Clouds
  createCloud(10, 15, -15)
  createCloud(-15, 18, -25)
  createCloud(25, 12, -10)
}

function createTree(x, z) {
  const tree = new THREE.Group()
  
  // Trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8)
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
  trunk.position.y = 1.5
  trunk.castShadow = true
  tree.add(trunk)
  
  // Foliage
  const foliageGeometry = new THREE.ConeGeometry(2, 4, 8)
  const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 })
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial)
  foliage.position.y = 5
  foliage.castShadow = true
  tree.add(foliage)
  
  tree.position.set(x, 0, z)
  scene.add(tree)
}

function createCloud(x, y, z) {
  const cloud = new THREE.Group()
  const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
  
  for (let i = 0; i < 5; i++) {
    const puffGeometry = new THREE.SphereGeometry(1 + Math.random(), 16, 16)
    const puff = new THREE.Mesh(puffGeometry, cloudMaterial)
    puff.position.set(i * 1.2 - 2, Math.random() * 0.5, Math.random() - 0.5)
    cloud.add(puff)
  }
  
  cloud.position.set(x, y, z)
  scene.add(cloud)
}

function createTarget() {
  target = new THREE.Group()
  
  // Target stand
  const standGeometry = new THREE.CylinderGeometry(0.1, 0.15, 3, 8)
  const standMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  const stand = new THREE.Mesh(standGeometry, standMaterial)
  stand.position.y = -1.5
  stand.castShadow = true
  target.add(stand)
  
  // Target rings (from outside in) - BIGGER rings
  const colors = [0xffffff, 0x000000, 0x0066ff, 0xff0000, 0xffd700]
  
  for (let i = ringRadii.length - 1; i >= 0; i--) {
    const ringGeometry = new THREE.CylinderGeometry(ringRadii[i], ringRadii[i], 0.15, 32)
    const ringMaterial = new THREE.MeshStandardMaterial({ color: colors[i] })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    ring.position.z = 0.01 * i
    target.add(ring)
  }
  
  // Bullseye center
  const bullseyeGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16)
  const bullseyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.3 })
  const bullseye = new THREE.Mesh(bullseyeGeometry, bullseyeMaterial)
  bullseye.rotation.x = Math.PI / 2
  bullseye.position.z = 0.1
  target.add(bullseye)
  
  target.position.set(TARGET_X, TARGET_Y, 0)
  target.rotation.y = Math.PI / 2
  target.castShadow = true
  scene.add(target)
}

function createArcher() {
  archer = new THREE.Group()
  
  // Body
  const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8)
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x2E8B57 })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.y = 1.4
  body.castShadow = true
  archer.add(body)
  
  // Head
  const headGeometry = new THREE.SphereGeometry(0.3, 16, 16)
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xDEB887 })
  const head = new THREE.Mesh(headGeometry, headMaterial)
  head.position.y = 2.2
  head.castShadow = true
  archer.add(head)
  
  // Legs
  const legGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x4a4a4a })
  
  const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
  leftLeg.position.set(-0.15, 0.4, 0)
  leftLeg.castShadow = true
  archer.add(leftLeg)
  
  const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
  rightLeg.position.set(0.15, 0.4, 0)
  rightLeg.castShadow = true
  archer.add(rightLeg)
  
  // Bow arm group (rotates with aim)
  bow = new THREE.Group()
  
  // Front arm (holding bow) - skin colored
  const armMaterial = new THREE.MeshStandardMaterial({ color: 0xDEB887 })
  const armGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.7, 8)
  
  const frontArm = new THREE.Mesh(armGeometry, armMaterial)
  frontArm.rotation.z = Math.PI / 2
  frontArm.position.set(0.35, 0, 0)
  frontArm.castShadow = true
  bow.add(frontArm)
  
  // Hand at end of front arm
  const handGeometry = new THREE.SphereGeometry(0.1, 8, 8)
  const frontHand = new THREE.Mesh(handGeometry, armMaterial)
  frontHand.position.set(0.7, 0, 0)
  frontHand.castShadow = true
  bow.add(frontHand)
  
  // Bow curve
  const bowCurve = new THREE.TorusGeometry(0.6, 0.04, 8, 16, Math.PI * 0.8)
  const bowMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  const bowMesh = new THREE.Mesh(bowCurve, bowMaterial)
  bowMesh.rotation.z = Math.PI / 2
  bowMesh.position.set(0.7, 0, 0)
  bowMesh.castShadow = true
  bow.add(bowMesh)
  
  // Bowstring
  const stringGeometry = new THREE.CylinderGeometry(0.008, 0.008, 1.1, 4)
  const stringMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 })
  const string = new THREE.Mesh(stringGeometry, stringMaterial)
  string.rotation.z = Math.PI / 2
  string.position.set(0.7, 0, 0)
  bow.add(string)
  
  // Back arm (pulling string)
  const backArm = new THREE.Mesh(armGeometry, armMaterial)
  backArm.rotation.z = Math.PI / 2
  backArm.position.set(-0.1, 0, 0)
  backArm.castShadow = true
  bow.add(backArm)
  
  // Hand pulling string
  const backHand = new THREE.Mesh(handGeometry, armMaterial)
  backHand.position.set(-0.4, 0, 0)
  backHand.castShadow = true
  bow.add(backHand)
  
  bow.position.set(0.3, 1.6, 0)
  archer.add(bow)
  
  archer.position.set(-12, 0, 0)
  scene.add(archer)
}

function createArrow() {
  arrow = new THREE.Group()
  
  // Shaft
  const shaftGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8)
  const shaftMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial)
  shaft.rotation.z = Math.PI / 2
  arrow.add(shaft)
  
  // Arrow head
  const headGeometry = new THREE.ConeGeometry(0.08, 0.25, 8)
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8 })
  const arrowHead = new THREE.Mesh(headGeometry, headMaterial)
  arrowHead.rotation.z = -Math.PI / 2
  arrowHead.position.x = 0.85
  arrow.add(arrowHead)
  
  // Fletching
  const fletchGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.02)
  const fletchMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
  
  const fletch1 = new THREE.Mesh(fletchGeometry, fletchMaterial)
  fletch1.position.set(-0.6, 0.08, 0)
  arrow.add(fletch1)
  
  const fletch2 = new THREE.Mesh(fletchGeometry, fletchMaterial)
  fletch2.position.set(-0.6, -0.08, 0)
  arrow.add(fletch2)
  
  const fletch3 = new THREE.Mesh(fletchGeometry, fletchMaterial)
  fletch3.position.set(-0.6, 0, 0.08)
  fletch3.rotation.x = Math.PI / 2
  arrow.add(fletch3)
  
  arrow.visible = false
  scene.add(arrow)
}

function startNewRound() {
  arrowsLeft.value = 5
  totalScore.value = 0
  roundScores.value = []
  wind.value = (Math.random() - 0.5) * 0.003 // Very light wind
  resetArrow()
}

function resetArrow() {
  gamePhase.value = 'aiming'
  angle.value = 15
  power.value = 70
  arrowPos = { ...ARROW_START }
  arrowVel = { x: 0, y: 0, z: 0 }
  arrowRotation = 0
  score.value = 0
  
  if (arrow) {
    arrow.visible = false
    arrow.position.set(ARROW_START.x, ARROW_START.y, ARROW_START.z)
    arrow.rotation.set(0, 0, 0)
  }
  
  if (bow) {
    bow.rotation.z = (angle.value * Math.PI) / 180
  }
  
  wind.value = (Math.random() - 0.5) * 0.003
}

function shoot() {
  if (gamePhase.value !== 'aiming') return
  
  gamePhase.value = 'flying'
  arrow.visible = true
  
  const radians = (angle.value * Math.PI) / 180
  const velocity = power.value * 0.012 // Adjusted for 3D scale
  
  arrowVel.x = Math.cos(radians) * velocity
  arrowVel.y = Math.sin(radians) * velocity
  arrowVel.z = 0
  
  arrowPos = { ...ARROW_START }
}

function updateArrow() {
  if (gamePhase.value !== 'flying') return
  
  // Apply gravity and wind
  arrowVel.y -= GRAVITY
  arrowVel.z += wind.value
  
  arrowPos.x += arrowVel.x
  arrowPos.y += arrowVel.y
  arrowPos.z += arrowVel.z
  
  // Update arrow position and rotation
  arrow.position.set(arrowPos.x, arrowPos.y, arrowPos.z)
  
  // Rotate arrow to face velocity direction
  const velocityAngle = Math.atan2(arrowVel.y, arrowVel.x)
  arrow.rotation.z = velocityAngle
  arrow.rotation.y = Math.atan2(arrowVel.z, arrowVel.x) * 0.5
  
  // Check if arrow hit target (at x = TARGET_X)
  if (arrowPos.x >= TARGET_X - 0.5) {
    const dy = arrowPos.y - TARGET_Y
    const dz = arrowPos.z
    const distance = Math.sqrt(dy * dy + dz * dz)
    
    if (distance < ringRadii[ringRadii.length - 1] + 0.5) {
      // Hit the target!
      calculateScore(distance)
      endShot()
      return
    }
  }
  
  // Check if arrow is out of bounds
  if (arrowPos.x > TARGET_X + 10 || arrowPos.y < -2 || Math.abs(arrowPos.z) > 15) {
    score.value = 0
    endShot()
  }
}

function calculateScore(distance) {
  score.value = 0
  for (let i = 0; i < ringRadii.length; i++) {
    if (distance <= ringRadii[i]) {
      score.value = ringPoints[i]
      break
    }
  }
}

function endShot() {
  gamePhase.value = 'result'
  totalScore.value += score.value
  roundScores.value.push(score.value)
  arrowsLeft.value--
}

function nextArrow() {
  if (arrowsLeft.value > 0) {
    resetArrow()
  }
}

function handleKeyDown(e) {
  if (gamePhase.value === 'aiming') {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      angle.value = Math.min(60, angle.value + 2)
      if (bow) bow.rotation.z = (angle.value * Math.PI) / 180
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      angle.value = Math.max(0, angle.value - 2)
      if (bow) bow.rotation.z = (angle.value * Math.PI) / 180
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      power.value = Math.min(100, power.value + 3)
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      power.value = Math.max(20, power.value - 3)
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      shoot()
    }
  } else if (gamePhase.value === 'result') {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (arrowsLeft.value > 0) {
        nextArrow()
      } else {
        startNewRound()
      }
    }
  }
}

function handleResize() {
  if (!containerRef.value || !camera || !renderer) return
  camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
}

function animate() {
  animationId = requestAnimationFrame(animate)
  
  updateArrow()
  renderer.render(scene, camera)
}

onMounted(() => {
  createScene()
  startNewRound()
  animate()
  
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
  
  if (renderer && containerRef.value) {
    containerRef.value.removeChild(renderer.domElement)
    renderer.dispose()
  }
})
</script>

<template>
  <div class="archery-wrapper">
    <div class="container">
      <h1>🏹 ARCHERY 3D 🎯</h1>
      
      <div ref="containerRef" class="game-scene"></div>
      
      <!-- HUD Overlay -->
      <div class="hud">
        <div class="hud-left">
          <div class="stat">Score: <span class="gold">{{ totalScore }}</span></div>
          <div class="stat">Arrows: {{ arrowsLeft }}</div>
        </div>
        
        <div class="hud-center">
          <div class="wind-indicator">
            <span>Wind: </span>
            <span v-if="Math.abs(wind) < 0.001">Calm 🍃</span>
            <span v-else-if="wind > 0">→ Light</span>
            <span v-else>← Light</span>
          </div>
        </div>
        
        <div class="hud-right">
          <div class="stat">Angle: {{ angle }}°</div>
          <div class="power-bar">
            <div class="power-label">Power</div>
            <div class="power-track">
              <div class="power-fill" :style="{ width: power + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Result Overlay -->
      <div v-if="gamePhase === 'result'" class="result-overlay">
        <div class="result-box">
          <div class="result-score" :class="{ gold: score >= 80, silver: score >= 40 && score < 80, miss: score === 0 }">
            {{ score > 0 ? '+' + score : 'MISS!' }}
          </div>
          <div v-if="arrowsLeft > 0" class="result-hint">Press SPACE for next arrow</div>
          <div v-else class="final-score">
            <div>Final Score: <span class="gold">{{ totalScore }}</span></div>
            <div class="result-hint">Press SPACE to play again</div>
          </div>
        </div>
      </div>
      
      <!-- Aiming hint -->
      <div v-if="gamePhase === 'aiming'" class="aim-hint">
        ↑↓ Angle | ←→ Power | SPACE to Shoot
      </div>
      
      <div class="score-history" v-if="roundScores.length > 0">
        <span class="history-label">Shots:</span>
        <span 
          v-for="(s, i) in roundScores" 
          :key="i" 
          class="shot-score"
          :class="{ gold: s >= 80, silver: s >= 40 && s < 80, miss: s === 0 }"
        >
          {{ s || '✗' }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.archery-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.container {
  text-align: center;
  background: rgba(10, 10, 30, 0.95);
  border-radius: 20px;
  padding: 20px;
  position: relative;
}

.container::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: conic-gradient(from 0deg, #00c853, #FFD700, #00c853);
  border-radius: 22px;
  z-index: -1;
  animation: rotateBorder 4s linear infinite;
}

@keyframes rotateBorder {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

h1 {
  color: #FFD700;
  font-size: 2rem;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.game-scene {
  width: 1200px;
  height: 700px;
  border-radius: 10px;
  overflow: hidden;
}

.hud {
  position: absolute;
  top: 70px;
  left: 30px;
  right: 30px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.hud-left, .hud-right {
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 15px;
  border-radius: 10px;
}

.hud-center {
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 10px;
}

.stat {
  color: #fff;
  font-size: 1rem;
  margin: 5px 0;
}

.gold {
  color: #FFD700;
  font-weight: bold;
}

.wind-indicator {
  color: #88ccff;
  font-size: 1rem;
}

.power-bar {
  margin-top: 5px;
}

.power-label {
  color: #aaa;
  font-size: 0.8rem;
}

.power-track {
  width: 100px;
  height: 10px;
  background: #333;
  border-radius: 5px;
  overflow: hidden;
}

.power-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff00, #ffff00, #ff0000);
  transition: width 0.1s;
}

.result-overlay {
  position: absolute;
  top: 70px;
  left: 20px;
  right: 20px;
  bottom: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.result-box {
  background: rgba(0, 0, 0, 0.85);
  padding: 30px 50px;
  border-radius: 15px;
  text-align: center;
}

.result-score {
  font-size: 3rem;
  font-weight: bold;
  color: #fff;
}

.result-score.gold {
  color: #FFD700;
  text-shadow: 0 0 20px #FFD700;
}

.result-score.silver {
  color: #C0C0C0;
}

.result-score.miss {
  color: #ff4444;
}

.result-hint {
  color: #aaa;
  margin-top: 15px;
  font-size: 0.9rem;
}

.final-score {
  color: #fff;
  font-size: 1.2rem;
  margin-top: 10px;
}

.aim-hint {
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.score-history {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.history-label {
  color: #aaa;
  font-weight: bold;
}

.shot-score {
  padding: 5px 12px;
  border-radius: 5px;
  font-weight: bold;
  background: #333;
  color: #fff;
}

.shot-score.gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
}

.shot-score.silver {
  background: linear-gradient(135deg, #C0C0C0, #888);
  color: #000;
}

.shot-score.miss {
  background: #660000;
  color: #ff6666;
}
</style>
