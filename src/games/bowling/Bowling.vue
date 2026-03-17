<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

// Game states
const STATES = {
  MENU: 'menu',
  SHOP: 'shop',
  SELECT_BALL: 'select_ball',
  AIMING: 'aiming',
  ROLLING: 'rolling',
  RESULT: 'result'
}

// Available bowling balls
const ALL_BALLS = [
  { id: 'black', name: 'Classic Black', color: 0x1a1a1a, cssColor: '#1a1a1a', price: 0, owned: true },
  { id: 'red', name: 'Ruby Red', color: 0xdc143c, cssColor: '#dc143c', price: 50, owned: false },
  { id: 'blue', name: 'Ocean Blue', color: 0x1e90ff, cssColor: '#1e90ff', price: 50, owned: false },
  { id: 'green', name: 'Emerald', color: 0x2ecc71, cssColor: '#2ecc71', price: 75, owned: false },
  { id: 'purple', name: 'Royal Purple', color: 0x9b59b6, cssColor: '#9b59b6', price: 75, owned: false },
  { id: 'orange', name: 'Sunset Orange', color: 0xff6600, cssColor: '#ff6600', price: 100, owned: false },
  { id: 'pink', name: 'Hot Pink', color: 0xff69b4, cssColor: '#ff69b4', price: 100, owned: false },
  { id: 'gold', name: 'Golden Glory', color: 0xffd700, cssColor: '#ffd700', price: 200, owned: false },
  { id: 'silver', name: 'Chrome Silver', color: 0xc0c0c0, cssColor: '#c0c0c0', price: 300, owned: false },
  { id: 'teal', name: 'Tropical Teal', color: 0x20b2aa, cssColor: '#20b2aa', price: 400, owned: false },
  { id: 'crimson', name: 'Dark Crimson', color: 0x8b0000, cssColor: '#8b0000', price: 500, owned: false },
  { id: 'midnight', name: 'Midnight Blue', color: 0x191970, cssColor: '#191970', price: 750, owned: false },
]

// Game state
const gameState = ref(STATES.MENU)
const coins = ref(0)
const balls = ref(ALL_BALLS.map(b => ({ ...b })))
const selectedBallId = ref('black')
const canvasRef = ref(null)
const aimAngle = ref(0)
const aimPower = ref(70)
const isAimingAngle = ref(true)
const pinsKnocked = ref(0)
const rollNumber = ref(1)
const frameScore = ref(0)
const lastResult = ref('')
const showMessage = ref('')

// Three.js objects
let scene, camera, renderer, animationId
let bowlingBall
let pinMeshes = []
let laneGroup

// Physics
const GRAVITY = -0.015
const FRICTION = 0.995

// Ball physics state
let ballPos = { x: 0, y: 0.3, z: 8 }
let ballVel = { x: 0, y: 0, z: 0 }
let ballSpin = 0
let isRolling = false

// Pin physics state
let pinStates = []

const selectedBall = computed(() => {
  return balls.value.find(b => b.id === selectedBallId.value) || balls.value[0]
})

const ownedBalls = computed(() => {
  return balls.value.filter(b => b.owned)
})

let aimInterval = null
let aimDirection = 1

onMounted(() => {
  loadGameData()
})

onUnmounted(() => {
  cleanupThreeJS()
  if (aimInterval) clearInterval(aimInterval)
})

function loadGameData() {
  try {
    const saved = localStorage.getItem('bowling_save')
    if (saved) {
      const data = JSON.parse(saved)
      coins.value = data.coins || 0
      selectedBallId.value = data.selectedBallId || 'black'
      if (data.ownedBalls) {
        balls.value.forEach(ball => {
          ball.owned = data.ownedBalls.includes(ball.id)
        })
      }
    }
  } catch (e) {
    console.error('Failed to load save data')
  }
}

function saveGameData() {
  try {
    const data = {
      coins: coins.value,
      selectedBallId: selectedBallId.value,
      ownedBalls: balls.value.filter(b => b.owned).map(b => b.id)
    }
    localStorage.setItem('bowling_save', JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save data')
  }
}

function initThreeJS() {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const width = canvas.clientWidth
  const height = canvas.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a2e)

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
  camera.position.set(0, 3, 12)
  camera.lookAt(0, 0, -5)

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
  mainLight.position.set(5, 10, 5)
  mainLight.castShadow = true
  scene.add(mainLight)

  createLane()
  createBall()
  createPins()
  
  animate()
}

function createLane() {
  laneGroup = new THREE.Group()

  const laneGeo = new THREE.BoxGeometry(2.5, 0.1, 20)
  const laneMat = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.3 })
  const lane = new THREE.Mesh(laneGeo, laneMat)
  lane.position.y = -0.05
  lane.position.z = -2
  lane.receiveShadow = true
  laneGroup.add(lane)

  const gutterGeo = new THREE.BoxGeometry(0.3, 0.15, 20)
  const gutterMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a })
  
  const leftGutter = new THREE.Mesh(gutterGeo, gutterMat)
  leftGutter.position.set(-1.4, -0.05, -2)
  laneGroup.add(leftGutter)
  
  const rightGutter = new THREE.Mesh(gutterGeo, gutterMat)
  rightGutter.position.set(1.4, -0.05, -2)
  laneGroup.add(rightGutter)

  const deckGeo = new THREE.BoxGeometry(2.5, 0.12, 3)
  const deckMat = new THREE.MeshStandardMaterial({ color: 0xc4a672 })
  const deck = new THREE.Mesh(deckGeo, deckMat)
  deck.position.set(0, -0.04, -10)
  laneGroup.add(deck)

  const wallGeo = new THREE.BoxGeometry(4, 2, 0.2)
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const backWall = new THREE.Mesh(wallGeo, wallMat)
  backWall.position.set(0, 1, -12)
  laneGroup.add(backWall)

  scene.add(laneGroup)
}

function createBall() {
  const ballGeo = new THREE.SphereGeometry(0.3, 32, 32)
  const ballMat = new THREE.MeshStandardMaterial({ 
    color: selectedBall.value.color,
    roughness: 0.2,
    metalness: 0.3
  })
  bowlingBall = new THREE.Mesh(ballGeo, ballMat)
  bowlingBall.castShadow = true
  bowlingBall.position.set(0, 0.3, 8)
  
  const holeGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16)
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x000000 })
  
  const hole1 = new THREE.Mesh(holeGeo, holeMat)
  hole1.rotation.x = Math.PI / 2
  hole1.position.set(-0.08, 0.25, 0)
  bowlingBall.add(hole1)
  
  const hole2 = new THREE.Mesh(holeGeo, holeMat)
  hole2.rotation.x = Math.PI / 2
  hole2.position.set(0.08, 0.25, 0)
  bowlingBall.add(hole2)
  
  const hole3 = new THREE.Mesh(holeGeo, holeMat)
  hole3.rotation.x = Math.PI / 2
  hole3.position.set(0, 0.2, -0.1)
  bowlingBall.add(hole3)

  scene.add(bowlingBall)
  ballPos = { x: 0, y: 0.3, z: 8 }
  ballVel = { x: 0, y: 0, z: 0 }
}

function createPins() {
  pinMeshes = []
  pinStates = []
  
  const pinPositions = [
    { x: 0, z: -9 },
    { x: -0.3, z: -9.5 }, { x: 0.3, z: -9.5 },
    { x: -0.6, z: -10 }, { x: 0, z: -10 }, { x: 0.6, z: -10 },
    { x: -0.9, z: -10.5 }, { x: -0.3, z: -10.5 }, { x: 0.3, z: -10.5 }, { x: 0.9, z: -10.5 }
  ]

  pinPositions.forEach((pos) => {
    const pin = createPin()
    pin.position.set(pos.x, 0.5, pos.z)
    scene.add(pin)
    pinMeshes.push(pin)
    pinStates.push({
      x: pos.x, y: 0.5, z: pos.z,
      vx: 0, vy: 0, vz: 0,
      fallen: false, rotation: 0, rotationSpeed: 0
    })
  })
}

function createPin() {
  const pinGroup = new THREE.Group()

  const bodyGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.6, 16)
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.position.y = 0.3
  body.castShadow = true
  pinGroup.add(body)

  const neckGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.2, 16)
  const neck = new THREE.Mesh(neckGeo, bodyMat)
  neck.position.y = 0.7
  pinGroup.add(neck)

  const headGeo = new THREE.SphereGeometry(0.07, 16, 16)
  const head = new THREE.Mesh(headGeo, bodyMat)
  head.position.y = 0.85
  pinGroup.add(head)

  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 })
  const stripeGeo = new THREE.TorusGeometry(0.09, 0.015, 8, 32)
  
  const stripe1 = new THREE.Mesh(stripeGeo, stripeMat)
  stripe1.rotation.x = Math.PI / 2
  stripe1.position.y = 0.55
  pinGroup.add(stripe1)
  
  const stripe2 = new THREE.Mesh(stripeGeo, stripeMat)
  stripe2.rotation.x = Math.PI / 2
  stripe2.position.y = 0.65
  pinGroup.add(stripe2)

  return pinGroup
}

function resetPins() {
  const pinPositions = [
    { x: 0, z: -9 },
    { x: -0.3, z: -9.5 }, { x: 0.3, z: -9.5 },
    { x: -0.6, z: -10 }, { x: 0, z: -10 }, { x: 0.6, z: -10 },
    { x: -0.9, z: -10.5 }, { x: -0.3, z: -10.5 }, { x: 0.3, z: -10.5 }, { x: 0.9, z: -10.5 }
  ]

  pinMeshes.forEach((pin, i) => {
    if (!pinStates[i].fallen || rollNumber.value === 1) {
      pin.position.set(pinPositions[i].x, 0.5, pinPositions[i].z)
      pin.rotation.set(0, 0, 0)
      pin.visible = true
      pinStates[i] = {
        x: pinPositions[i].x, y: 0.5, z: pinPositions[i].z,
        vx: 0, vy: 0, vz: 0,
        fallen: false, rotation: 0, rotationSpeed: 0
      }
    }
  })
}

function updateBallColor() {
  if (bowlingBall) {
    bowlingBall.material.color.setHex(selectedBall.value.color)
  }
}

function startGame() {
  if (!scene) {
    setTimeout(() => {
      initThreeJS()
      setTimeout(startGame, 100)
    }, 50)
    return
  }
  
  rollNumber.value = 1
  frameScore.value = 0
  pinsKnocked.value = 0
  isRolling = false
  
  ballPos = { x: 0, y: 0.3, z: 8 }
  ballVel = { x: 0, y: 0, z: 0 }
  if (bowlingBall) {
    bowlingBall.position.set(0, 0.3, 8)
    updateBallColor()
  }
  
  resetPins()
  
  aimAngle.value = 0
  aimPower.value = 70
  isAimingAngle.value = true
  gameState.value = STATES.AIMING
  startAimAnimation()
}

function startAimAnimation() {
  if (aimInterval) clearInterval(aimInterval)
  aimDirection = 1
  
  aimInterval = setInterval(() => {
    if (gameState.value !== STATES.AIMING) {
      clearInterval(aimInterval)
      return
    }
    
    if (isAimingAngle.value) {
      aimAngle.value += aimDirection * 1.5
      if (aimAngle.value >= 25 || aimAngle.value <= -25) {
        aimDirection *= -1
      }
      if (bowlingBall) {
        bowlingBall.position.x = aimAngle.value * 0.04
      }
    } else {
      aimPower.value += aimDirection * 1
      if (aimPower.value >= 100 || aimPower.value <= 40) {
        aimDirection *= -1
      }
    }
  }, 30)
}

function confirmAim() {
  if (isAimingAngle.value) {
    isAimingAngle.value = false
    aimDirection = 1
  } else {
    if (aimInterval) clearInterval(aimInterval)
    rollBall()
  }
}

function rollBall() {
  gameState.value = STATES.ROLLING
  isRolling = true
  
  const power = aimPower.value / 100
  const angle = aimAngle.value * 0.02
  
  ballPos.x = bowlingBall.position.x
  ballVel = {
    x: angle * power * 0.3,
    y: 0,
    z: -power * 0.4
  }
  ballSpin = angle * 0.1
}

function animate() {
  animationId = requestAnimationFrame(animate)
  
  if (isRolling) {
    updatePhysics()
  }
  
  if (gameState.value === STATES.ROLLING && ballPos.z < 5) {
    camera.position.z = Math.max(5, ballPos.z + 5)
    camera.lookAt(0, 0, ballPos.z - 5)
  }
  
  renderer.render(scene, camera)
}

function updatePhysics() {
  ballPos.x += ballVel.x
  ballPos.y += ballVel.y
  ballPos.z += ballVel.z
  
  ballVel.x += ballSpin * 0.001
  ballVel.x *= FRICTION
  ballVel.z *= FRICTION
  
  if (ballPos.y > 0.3) {
    ballVel.y += GRAVITY
  } else {
    ballPos.y = 0.3
    ballVel.y = 0
  }
  
  if (Math.abs(ballPos.x) > 1.1) {
    ballVel.x *= 0.5
    ballVel.z *= 0.8
  }
  
  bowlingBall.position.set(ballPos.x, ballPos.y, ballPos.z)
  bowlingBall.rotation.x -= ballVel.z * 2
  bowlingBall.rotation.z += ballVel.x * 2
  
  checkPinCollisions()
  updatePins()
  
  if (ballPos.z < -11 || (Math.abs(ballVel.z) < 0.001 && Math.abs(ballVel.x) < 0.001)) {
    setTimeout(finishRoll, 800)
    isRolling = false
  }
}

function checkPinCollisions() {
  pinStates.forEach((pin, i) => {
    if (pin.fallen) return
    
    const dx = ballPos.x - pin.x
    const dz = ballPos.z - pin.z
    const dist = Math.sqrt(dx * dx + dz * dz)
    
    if (dist < 0.45) {
      pin.fallen = true
      pinsKnocked.value++
      
      const force = Math.sqrt(ballVel.x * ballVel.x + ballVel.z * ballVel.z) * 2
      pin.vx = (dx / dist) * force + ballVel.x * 0.5
      pin.vz = (dz / dist) * force + ballVel.z * 0.5
      pin.vy = 0.1
      pin.rotationSpeed = (Math.random() - 0.5) * 0.3
      
      ballVel.z *= 0.9
      ballVel.x *= 0.9
      
      pinStates.forEach((otherPin, j) => {
        if (j !== i && !otherPin.fallen) {
          const odx = pin.x - otherPin.x
          const odz = pin.z - otherPin.z
          const odist = Math.sqrt(odx * odx + odz * odz)
          if (odist < 0.5) {
            setTimeout(() => {
              if (!otherPin.fallen) {
                otherPin.fallen = true
                pinsKnocked.value++
                otherPin.vx = -odx * 0.3
                otherPin.vz = -odz * 0.3
                otherPin.vy = 0.05
                otherPin.rotationSpeed = (Math.random() - 0.5) * 0.2
              }
            }, 50 + Math.random() * 100)
          }
        }
      })
    }
  })
}

function updatePins() {
  pinStates.forEach((pin, i) => {
    if (!pin.fallen) return
    
    pin.x += pin.vx
    pin.z += pin.vz
    pin.y += pin.vy
    pin.vy += GRAVITY
    
    if (pin.y < 0.2) {
      pin.y = 0.2
      pin.vy *= -0.3
      pin.vx *= 0.8
      pin.vz *= 0.8
    }
    
    pin.rotation += pin.rotationSpeed
    pin.rotationSpeed *= 0.98
    
    const mesh = pinMeshes[i]
    mesh.position.set(pin.x, pin.y, pin.z)
    mesh.rotation.x = pin.rotation
    mesh.rotation.z = pin.rotation * 0.5
  })
}

function finishRoll() {
  camera.position.set(0, 3, 12)
  camera.lookAt(0, 0, -5)
  
  const knocked = pinsKnocked.value
  frameScore.value = knocked
  
  if (rollNumber.value === 1) {
    if (knocked === 10) {
      lastResult.value = 'STRIKE!'
      coins.value += 100
      showMessage.value = '+100 coins!'
      gameState.value = STATES.RESULT
      saveGameData()
    } else {
      rollNumber.value = 2
      pinsKnocked.value = 0
      
      ballPos = { x: 0, y: 0.3, z: 8 }
      ballVel = { x: 0, y: 0, z: 0 }
      bowlingBall.position.set(0, 0.3, 8)
      
      aimAngle.value = 0
      aimPower.value = 70
      isAimingAngle.value = true
      gameState.value = STATES.AIMING
      startAimAnimation()
    }
  } else {
    const totalKnocked = frameScore.value + pinsKnocked.value
    frameScore.value = totalKnocked
    
    if (totalKnocked === 10) {
      lastResult.value = 'SPARE!'
      coins.value += 25
      showMessage.value = '+25 coins!'
    } else if (totalKnocked === 0) {
      lastResult.value = 'GUTTER!'
      showMessage.value = 'No coins earned'
    } else {
      lastResult.value = `${totalKnocked} PINS`
      const earnedCoins = Math.floor(totalKnocked / 2)
      if (earnedCoins > 0) {
        coins.value += earnedCoins
        showMessage.value = `+${earnedCoins} coins`
      } else {
        showMessage.value = 'No coins earned'
      }
    }
    gameState.value = STATES.RESULT
    saveGameData()
  }
}

function cleanupThreeJS() {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
  scene = null
  camera = null
  renderer = null
}

function buyBall(ball) {
  if (ball.owned || coins.value < ball.price) return
  coins.value -= ball.price
  ball.owned = true
  saveGameData()
}

function selectBall(ballId) {
  selectedBallId.value = ballId
  saveGameData()
}

function goToMenu() {
  gameState.value = STATES.MENU
  cleanupThreeJS()
}

function goToShop() {
  gameState.value = STATES.SHOP
}

function goToSelectBall() {
  gameState.value = STATES.SELECT_BALL
}

function getBallStyle(ball) {
  return { backgroundColor: ball.cssColor }
}
</script>

<template>
  <canvas 
    v-show="gameState === STATES.AIMING || gameState === STATES.ROLLING" 
    ref="canvasRef" 
    class="game-canvas"
  ></canvas>
  
  <div v-if="gameState === STATES.AIMING || gameState === STATES.ROLLING" class="game-hud">
    <div class="hud-header">
      <h1>🎳 LET'S GO BOWLING</h1>
      <div class="coins-display">
        <span class="coin-icon">🪙</span>
        <span class="coin-amount">{{ coins }}</span>
      </div>
    </div>
    
    <div class="hud-game-info">
      <span>Roll {{ rollNumber }}/2</span>
      <span>Pins: {{ frameScore }}/10</span>
    </div>
    
    <div v-if="gameState === STATES.AIMING" class="hud-aim-controls">
      <div class="aim-indicator">
        <span v-if="isAimingAngle">Aiming: {{ aimAngle > 0 ? '+' : '' }}{{ Math.round(aimAngle) }}°</span>
        <span v-else>Power: {{ Math.round(aimPower) }}%</span>
      </div>
      <button class="roll-btn" @click="confirmAim">
        {{ isAimingAngle ? 'SET ANGLE' : 'ROLL!' }}
      </button>
    </div>
    
    <div v-if="gameState === STATES.ROLLING" class="rolling-text">
      Rolling...
    </div>
  </div>

  <div v-if="gameState !== STATES.AIMING && gameState !== STATES.ROLLING" class="bowling-wrapper">
    <div class="container">
      <div class="header">
        <h1>🎳 LET'S GO BOWLING</h1>
        <div class="coins-display">
          <span class="coin-icon">🪙</span>
          <span class="coin-amount">{{ coins }}</span>
        </div>
      </div>

      <div v-if="gameState === STATES.MENU" class="menu-screen">
        <div class="current-ball-display">
          <span class="label">Your Ball:</span>
          <div class="ball-preview large" :style="getBallStyle(selectedBall)"></div>
          <span class="ball-name">{{ selectedBall.name }}</span>
        </div>
        
        <div class="menu-buttons">
          <button class="menu-btn play" @click="startGame">🎳 PLAY</button>
          <button class="menu-btn" @click="goToSelectBall">🎱 SELECT BALL</button>
          <button class="menu-btn" @click="goToShop">🛒 SHOP</button>
        </div>
      </div>

      <div v-if="gameState === STATES.SELECT_BALL" class="select-screen">
        <h2>Choose Your Ball</h2>
        <div class="ball-grid">
          <div 
            v-for="ball in ownedBalls" 
            :key="ball.id"
            class="ball-option"
            :class="{ selected: selectedBallId === ball.id }"
            @click="selectBall(ball.id)"
          >
            <div class="ball-preview" :style="getBallStyle(ball)"></div>
            <span class="ball-name">{{ ball.name }}</span>
          </div>
        </div>
        <button class="back-btn" @click="goToMenu">← Back</button>
      </div>

      <div v-if="gameState === STATES.SHOP" class="shop-screen">
        <h2>🛒 Ball Shop</h2>
        <div class="shop-grid">
          <div 
            v-for="ball in balls" 
            :key="ball.id"
            class="shop-item"
            :class="{ owned: ball.owned, affordable: !ball.owned && coins >= ball.price }"
          >
            <div class="ball-preview" :style="getBallStyle(ball)"></div>
            <span class="ball-name">{{ ball.name }}</span>
            <div v-if="ball.owned" class="owned-badge">OWNED</div>
            <button 
              v-else 
              class="buy-btn"
              :disabled="coins < ball.price"
              @click="buyBall(ball)"
            >
              🪙 {{ ball.price }}
            </button>
          </div>
        </div>
        <button class="back-btn" @click="goToMenu">← Back</button>
      </div>

      <div v-if="gameState === STATES.RESULT" class="result-screen">
        <h2 class="result-title" :class="{ strike: lastResult === 'STRIKE!', spare: lastResult === 'SPARE!' }">
          {{ lastResult }}
        </h2>
        <p class="result-message">{{ showMessage }}</p>
        <div class="result-buttons">
          <button class="menu-btn play" @click="startGame">Play Again</button>
          <button class="menu-btn" @click="goToMenu">Menu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.game-hud {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  font-family: 'Arial', sans-serif;
  color: #fff;
}

.hud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);
}

.hud-header h1 {
  font-size: 1.5em;
  color: #ff6600;
  text-shadow: 0 0 10px rgba(255, 102, 0, 0.5), 2px 2px 4px rgba(0,0,0,0.8);
  margin: 0;
}

.hud-game-info {
  display: flex;
  justify-content: center;
  gap: 40px;
  font-size: 1.3em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  padding: 10px;
}

.hud-aim-controls {
  margin-top: auto;
  padding: 20px;
  text-align: center;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  pointer-events: auto;
}

.aim-indicator {
  font-size: 1.4em;
  margin-bottom: 15px;
  color: #ffff00;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

.roll-btn {
  padding: 15px 50px;
  font-size: 1.4em;
  font-weight: bold;
  background: linear-gradient(135deg, #00ff00, #00cc00);
  color: #000;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 255, 0, 0.4);
}

.roll-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.6);
}

.rolling-text {
  margin-top: auto;
  padding: 30px;
  text-align: center;
  font-size: 2em;
  color: #ffff00;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  animation: pulse 0.5s ease-in-out infinite;
}

.bowling-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
}

.container {
  width: 100%;
  max-width: 600px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 20px;
  border: 2px solid #ff6600;
  box-shadow: 0 0 30px rgba(255, 102, 0, 0.3);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

h1 {
  font-size: 1.8em;
  color: #ff6600;
  text-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
  margin: 0;
}

.coins-display {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 215, 0, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid #ffd700;
}

.coin-icon {
  font-size: 1.5em;
}

.coin-amount {
  font-size: 1.3em;
  font-weight: bold;
  color: #ffd700;
}

.menu-screen {
  text-align: center;
  padding: 20px;
}

.current-ball-display {
  margin-bottom: 30px;
}

.current-ball-display .label {
  display: block;
  font-size: 1.1em;
  color: #aaa;
  margin-bottom: 10px;
}

.ball-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5), inset 0 -5px 15px rgba(0, 0, 0, 0.3);
}

.ball-preview.large {
  width: 100px;
  height: 100px;
}

.ball-name {
  font-size: 1em;
  color: #fff;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-btn {
  padding: 15px 30px;
  font-size: 1.2em;
  font-weight: bold;
  border: 2px solid #ff6600;
  background: transparent;
  color: #ff6600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-btn:hover {
  background: #ff6600;
  color: #000;
  box-shadow: 0 0 20px rgba(255, 102, 0, 0.5);
}

.menu-btn.play {
  background: linear-gradient(135deg, #ff6600, #ff8533);
  color: #000;
  border: none;
  font-size: 1.4em;
}

.menu-btn.play:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 102, 0, 0.7);
}

.select-screen, .shop-screen {
  text-align: center;
}

h2 {
  color: #ff6600;
  margin-bottom: 20px;
}

.ball-grid, .shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.ball-option, .shop-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.ball-option:hover, .shop-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.ball-option.selected {
  border-color: #00ff00;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
}

.shop-item.owned {
  opacity: 0.7;
}

.shop-item.affordable {
  border-color: #ffd700;
}

.owned-badge {
  background: #00ff00;
  color: #000;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 0.7em;
  font-weight: bold;
  margin-top: 8px;
}

.buy-btn {
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  color: #000;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.3s;
}

.buy-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.buy-btn:disabled {
  background: #666;
  color: #999;
  cursor: not-allowed;
}

.back-btn {
  background: transparent;
  border: 2px solid #888;
  color: #888;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  border-color: #fff;
  color: #fff;
}

.result-screen {
  text-align: center;
  padding: 40px 20px;
}

.result-title {
  font-size: 3em;
  margin-bottom: 10px;
  color: #fff;
}

.result-title.strike {
  color: #ffd700;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
  animation: celebrate 0.5s ease-in-out infinite;
}

.result-title.spare {
  color: #00ff00;
  text-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
}

@keyframes celebrate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.result-message {
  font-size: 1.5em;
  color: #ffd700;
  margin-bottom: 30px;
}

.result-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 500px) {
  h1 {
    font-size: 1.3em;
  }
  
  .ball-grid, .shop-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .result-title {
    font-size: 2em;
  }
  
  .hud-header h1 {
    font-size: 1.2em;
  }
  
  .hud-game-info {
    font-size: 1.1em;
    gap: 20px;
  }
}
</style>
