<template>
  <div class="punch-out">
    <!-- Menu Screen -->
    <div v-if="gameState.gamePhase.value === 'menu'" class="menu-screen">
      <h1 class="game-title">PUNCH OUT</h1>
      <p class="subtitle">Super Smash Battle!</p>
      
      <div class="menu-buttons">
        <button class="menu-btn" @click="startVsCPU">VS CPU</button>
        <button class="menu-btn" @click="startVsPlayer">VS Player</button>
        <button class="menu-btn back" @click="goHome">Back to Menu</button>
      </div>
      
      <div class="controls-info">
        <div class="control-set">
          <h3>Player 1</h3>
          <p>WASD - Move</p>
          <p>J - Attack / Smash (hold)</p>
          <p>K - Special</p>
          <p>L - Shield / Dodge</p>
          <p>Space - Jump</p>
        </div>
        <div class="control-set">
          <h3>Player 2</h3>
          <p>Arrow Keys - Move</p>
          <p>Numpad 1 - Attack / Smash</p>
          <p>Numpad 2 - Special</p>
          <p>Numpad 3 - Shield / Dodge</p>
          <p>Numpad 0 - Jump</p>
        </div>
      </div>
    </div>

    <!-- Character Select -->
    <div v-if="gameState.gamePhase.value === 'charSelect'" class="select-screen">
      <h2>SELECT YOUR FIGHTER</h2>
      
      <div class="player-selects">
        <div class="player-select" :class="{ ready: gameState.players[0].character }">
          <h3>Player 1</h3>
          <div v-if="gameState.players[0].character" class="selected-char">
            <div class="char-preview" :style="{ backgroundColor: '#' + gameState.players[0].character.color.toString(16).padStart(6, '0') }"></div>
            <span>{{ gameState.players[0].character.name }}</span>
          </div>
          <span v-else>Selecting...</span>
        </div>
        
        <div class="player-select" :class="{ ready: gameState.players[1].character }">
          <h3>{{ isVsCPU ? 'CPU' : 'Player 2' }}</h3>
          <div v-if="gameState.players[1].character" class="selected-char">
            <div class="char-preview" :style="{ backgroundColor: '#' + gameState.players[1].character.color.toString(16).padStart(6, '0') }"></div>
            <span>{{ gameState.players[1].character.name }}</span>
          </div>
          <span v-else>{{ isVsCPU ? 'Waiting...' : 'Selecting...' }}</span>
        </div>
      </div>
      
      <div class="character-grid">
        <div 
          v-for="char in characters" 
          :key="char.id" 
          class="character-card"
          :class="{ 
            selected1: gameState.players[0].character?.id === char.id,
            selected2: gameState.players[1].character?.id === char.id
          }"
          @click="selectCharacter(char.id)"
        >
          <div class="char-icon" :style="{ backgroundColor: '#' + char.color.toString(16).padStart(6, '0') }"></div>
          <span class="char-name">{{ char.name }}</span>
          <span class="char-desc">{{ char.description }}</span>
        </div>
      </div>
      
      <button 
        v-if="gameState.players[0].character && gameState.players[1].character" 
        class="menu-btn continue"
        @click="gameState.goToStageSelect()"
      >
        Continue
      </button>
      
      <button class="menu-btn back small" @click="gameState.goToMenu()">Back</button>
    </div>

    <!-- Stage Select -->
    <div v-if="gameState.gamePhase.value === 'stageSelect'" class="select-screen">
      <h2>SELECT STAGE</h2>
      
      <div class="stage-grid">
        <div 
          v-for="stage in stages" 
          :key="stage.id" 
          class="stage-card"
          :class="{ selected: gameState.selectedStage.value?.id === stage.id }"
          :style="{ backgroundColor: '#' + stage.skyColor.toString(16).padStart(6, '0') }"
          @click="gameState.selectStage(stage.id)"
        >
          <div class="stage-preview">
            <div 
              v-for="(plat, i) in stage.platforms.slice(0, 4)" 
              :key="i"
              class="mini-platform"
              :style="{
                width: plat.width * 3 + 'px',
                left: 50 + plat.x * 3 + '%',
                bottom: 20 + plat.y * 5 + '%',
                backgroundColor: '#' + stage.platformColor.toString(16).padStart(6, '0')
              }"
            ></div>
          </div>
          <span class="stage-name">{{ stage.name }}</span>
        </div>
      </div>
      
      <button 
        v-if="gameState.selectedStage.value" 
        class="menu-btn continue"
        @click="startBattle"
      >
        Start Battle!
      </button>
      
      <button class="menu-btn back small" @click="gameState.goToCharSelect()">Back</button>
    </div>

    <!-- Game Canvas -->
    <canvas 
      v-show="gameState.gamePhase.value === 'playing' || gameState.gamePhase.value === 'gameOver'" 
      ref="canvasRef" 
      class="game-canvas"
    ></canvas>

    <!-- Game UI Overlay -->
    <div v-if="gameState.gamePhase.value === 'playing'" class="game-ui">
      <div class="player-hud left">
        <div class="player-info">
          <span class="player-name">P1 - {{ gameState.players[0].character?.name }}</span>
          <div class="stock-icons">
            <span v-for="i in gameState.players[0].stocks" :key="i" class="stock">●</span>
          </div>
        </div>
        <div class="damage-display" :style="{ color: getDamageColor(gameState.players[0].damage) }">
          {{ Math.floor(gameState.players[0].damage) }}%
        </div>
      </div>
      
      <div class="player-hud right">
        <div class="player-info">
          <span class="player-name">{{ isVsCPU ? 'CPU' : 'P2' }} - {{ gameState.players[1].character?.name }}</span>
          <div class="stock-icons">
            <span v-for="i in gameState.players[1].stocks" :key="i" class="stock">●</span>
          </div>
        </div>
        <div class="damage-display" :style="{ color: getDamageColor(gameState.players[1].damage) }">
          {{ Math.floor(gameState.players[1].damage) }}%
        </div>
      </div>
    </div>

    <!-- Pause Menu -->
    <div v-if="gameState.isPaused.value" class="pause-overlay">
      <div class="pause-menu">
        <h2>PAUSED</h2>
        <button class="menu-btn" @click="gameState.togglePause()">Resume</button>
        <button class="menu-btn" @click="restartBattle">Restart</button>
        <button class="menu-btn" @click="quitToMenu">Quit</button>
      </div>
    </div>

    <!-- Game Over Screen -->
    <div v-if="gameState.gamePhase.value === 'gameOver'" class="gameover-overlay">
      <div class="gameover-content">
        <h1>GAME!</h1>
        <h2>{{ getWinnerText() }}</h2>
        <div class="gameover-buttons">
          <button class="menu-btn" @click="restartBattle">Rematch</button>
          <button class="menu-btn" @click="gameState.goToCharSelect()">Character Select</button>
          <button class="menu-btn" @click="quitToMenu">Main Menu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { characters } from './data/characters.js'
import { stages } from './data/stages.js'
import { useGameState } from './composables/useGameState.js'
import { useRenderer } from './composables/useRenderer.js'
import { useStage } from './composables/useStage.js'
import { useFighter } from './composables/useFighter.js'
import { usePhysics } from './composables/usePhysics.js'
import { useCombat } from './composables/useCombat.js'
import { useControls } from './composables/useControls.js'

const router = useRouter()
const canvasRef = ref(null)

const gameState = useGameState()
const isVsCPU = ref(true)
let currentSelectingPlayer = 0

// Composables (initialized after canvas ready)
let renderer = null
let stage = null
let fighterSystem = null
let physics = null
let combat = null
let controls = null
let stageData = null
let fighterMeshes = []
let frameCount = 0

const goHome = () => {
  router.push('/')
}

const startVsCPU = () => {
  isVsCPU.value = true
  gameState.setPlayer2Mode('cpu')
  gameState.goToCharSelect()
}

const startVsPlayer = () => {
  isVsCPU.value = false
  gameState.setPlayer2Mode('keyboard2')
  gameState.goToCharSelect()
}

const selectCharacter = (charId) => {
  if (currentSelectingPlayer === 0) {
    gameState.selectCharacter(0, charId)
    if (isVsCPU.value) {
      // CPU picks a random character
      const availableChars = characters.filter(c => c.id !== charId)
      const cpuChar = availableChars[Math.floor(Math.random() * availableChars.length)]
      gameState.selectCharacter(1, cpuChar.id)
    } else {
      currentSelectingPlayer = 1
    }
  } else {
    gameState.selectCharacter(1, charId)
    currentSelectingPlayer = 0
  }
}

const startBattle = () => {
  gameState.startGame()
  initGame()
}

const restartBattle = () => {
  cleanupGame()
  gameState.startGame()
  initGame()
}

const quitToMenu = () => {
  cleanupGame()
  gameState.goToMenu()
  currentSelectingPlayer = 0
}

const initGame = () => {
  if (!canvasRef.value) return
  
  renderer = useRenderer(canvasRef)
  renderer.init(gameState.selectedStage.value.skyColor)
  
  stage = useStage(renderer.scene)
  stageData = stage.createStage(gameState.selectedStage.value)
  
  fighterSystem = useFighter(renderer.scene)
  physics = usePhysics()
  combat = useCombat()
  controls = useControls()
  
  controls.setupControls()
  
  // Create fighters
  fighterMeshes = []
  gameState.players.forEach((player, index) => {
    const spawn = gameState.selectedStage.value.spawnPoints[index]
    const fighter = fighterSystem.createFighter(player, spawn)
    fighterMeshes.push(fighter)
  })
  
  frameCount = 0
  renderer.startLoop(gameLoop)
}

const gameLoop = () => {
  if (gameState.isPaused.value || gameState.gamePhase.value !== 'playing') return
  
  frameCount++
  controls.updateHoldTimes()
  
  // Process each player
  gameState.players.forEach((player, index) => {
    const isAI = player.controls === 'cpu'
    const opponent = gameState.players[1 - index]
    
    // Get input
    const input = controls.getInput(index, isAI, isAI ? {
      self: player,
      opponent: opponent,
      platforms: stageData.platforms,
      difficulty: 0.75
    } : null)
    
    // Update combat state (shield regen, dodge cooldown, etc)
    combat.updateCombatState(player)
    
    // Reset fast fall on landing
    if (player.isGrounded) {
      physics.resetFastFall(player)
    }
    
    // Process input based on state
    if (player.stunned > 0) {
      // Shield broken - can't do anything
    } else if (player.hitstun > 0) {
      // DI (Directional Influence) during hitstun
      let moveDir = 0
      if (input.left) moveDir -= 1
      if (input.right) moveDir += 1
      physics.move(player, moveDir, player.character)
    } else if (player.shielding) {
      // While shielding
      if (!input.shield) {
        combat.releaseShield(player)
      } else if (input.left || input.right) {
        // Roll dodge
        const rollDir = input.left ? -1 : 1
        combat.releaseShield(player)
        combat.performDodge(player, rollDir)
      } else if (input.down) {
        // Spot dodge
        combat.releaseShield(player)
        combat.performDodge(player, 0)
      } else if (input.jump) {
        // Jump out of shield
        combat.releaseShield(player)
        physics.jump(player, player.character)
      }
    } else if (!player.dodging) {
      // Normal movement
      let moveDir = 0
      if (input.left) moveDir -= 1
      if (input.right) moveDir += 1
      physics.move(player, moveDir, player.character)
      
      // Jump
      if (input.jump && player.jumpCount < 2) {
        physics.jump(player, player.character)
      }
      
      // Fast fall
      if (input.down && !player.isGrounded && player.velocity.y < 0) {
        physics.fastFall(player)
      }
      
      // Shield
      if (input.shield && player.isGrounded && player.attackCooldown <= 0) {
        combat.startShield(player)
      } else if (input.shield && !player.isGrounded && !player.airDodgeUsed) {
        // Air dodge
        combat.performDodge(player, 0)
        player.airDodgeUsed = true
      }
      
      // Attacks
      if (player.attackCooldown <= 0) {
        let attackType = null
        let isSmash = false
        const chargeTime = input.attackHoldTime || 0
        
        if (input.special) {
          // Special moves
          if (input.up) attackType = 'upSpecial'
          else if (input.down) attackType = 'downSpecial'
          else if (input.left || input.right) attackType = 'sideSpecial'
          else attackType = 'special'
        } else if (input.attack) {
          // Check for smash attack (held attack button + direction)
          if (chargeTime >= combat.SMASH_CHARGE_MIN) {
            isSmash = true
            if (input.up) attackType = 'upSmash'
            else if (input.down) attackType = 'downSmash'
            else if (input.left || input.right) attackType = 'forwardSmash'
            else attackType = 'neutral' // No neutral smash, use neutral
          } else {
            // Tilt attacks
            if (input.up) attackType = 'up'
            else if (input.down) attackType = 'down'
            else if (input.left || input.right) attackType = 'forward'
            else attackType = 'neutral'
          }
        }
        
        // Map smash attacks to their base attack types for damage lookup
        const baseAttackType = attackType?.replace('Smash', '').replace('Special', '') || attackType
        
        if (attackType && player.character.attacks[baseAttackType]) {
          const attack = combat.performAttack(player, baseAttackType, isSmash, chargeTime)
          if (attack) {
            // Create visual effect
            fighterSystem.createAttackEffect(fighterMeshes[index], attackType, player.facing, isSmash)
            
            // Check for hit on opponent
            const hit = combat.checkAttackHit(player, opponent, baseAttackType, isSmash, chargeTime)
            if (hit && !hit.blocked) {
              physics.applyKnockback(opponent, hit.knockback, hit.direction, hit.damage, hit.isMeteor)
              opponent.lastHitBy = index
              opponent.comboCount++
              
              // Create hit effect
              fighterSystem.createHitEffect(opponent.position, hit.damage)
            } else if (hit && hit.blocked) {
              // Shield hit effect
              fighterSystem.createShieldHitEffect(opponent.position)
            }
          }
        }
      }
    }
    
    // Update physics
    const result = physics.updatePhysics(player, stageData.platforms, stageData.blastZones)
    
    if (result === 'ko') {
      gameState.playerKO(index)
    }
    
    // Update fighter visual
    fighterSystem.updateFighterPosition(fighterMeshes[index], player.position, player.facing)
    fighterSystem.animateFighter(fighterMeshes[index], player.state, frameCount, player)
    fighterSystem.updateAttackEffects(fighterMeshes[index])
    fighterSystem.setFighterInvincible(fighterMeshes[index], player.invincible > 0)
    fighterSystem.updateShieldVisual(fighterMeshes[index], player.shielding, player.shieldHealth)
  })
  
  // Update camera to follow players
  renderer.updateCameraForPlayers(
    gameState.players[0].position,
    gameState.players[1].position
  )
}

const cleanupGame = () => {
  if (renderer) {
    renderer.stopLoop()
    renderer.cleanup()
  }
  if (fighterSystem) {
    fighterSystem.cleanup()
  }
  if (stage) {
    stage.cleanup()
  }
  if (controls) {
    controls.cleanupControls()
  }
}

const getDamageColor = (damage) => {
  if (damage < 50) return '#ffffff'
  if (damage < 100) return '#ffff00'
  if (damage < 150) return '#ff8800'
  return '#ff0000'
}

const getWinnerText = () => {
  if (!gameState.winner.value) return ''
  const winnerIndex = gameState.winner.value - 1
  const name = isVsCPU.value && winnerIndex === 1 ? 'CPU' : `Player ${gameState.winner.value}`
  return `${name} Wins!`
}

// Handle keyboard for pause
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && gameState.gamePhase.value === 'playing') {
    gameState.togglePause()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  cleanupGame()
})
</script>

<style scoped>
.punch-out {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  z-index: 100;
  overflow: hidden;
}

.game-canvas {
  width: 100%;
  height: 100%;
}

/* Menu Styles */
.menu-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
}

.game-title {
  font-size: 5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  background: linear-gradient(180deg, #ff3333, #ff6600, #ffcc00, #66ff66, #00ccff, #9966ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(255, 100, 0, 0.6);
  margin-bottom: 0.5rem;
  animation: titlePulse 2s ease-in-out infinite;
}

@keyframes titlePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.subtitle {
  font-size: 1.5rem;
  color: #88aacc;
  margin-bottom: 3rem;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.menu-btn {
  padding: 1rem 3rem;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #4488ff, #2266cc);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 250px;
}

.menu-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(68, 136, 255, 0.6);
}

.menu-btn.back {
  background: linear-gradient(180deg, #666, #444);
}

.menu-btn.back:hover {
  box-shadow: 0 0 20px rgba(100, 100, 100, 0.6);
}

.menu-btn.continue {
  background: linear-gradient(180deg, #44cc44, #228822);
  margin-top: 2rem;
}

.menu-btn.small {
  font-size: 1rem;
  padding: 0.5rem 1.5rem;
  min-width: auto;
  margin-top: 1rem;
}

.controls-info {
  display: flex;
  gap: 4rem;
  margin-top: 2rem;
}

.control-set {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
}

.control-set h3 {
  color: #4488ff;
  margin-bottom: 0.5rem;
}

.control-set p {
  margin: 0.3rem 0;
  color: #aaa;
}

/* Select Screen */
.select-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  height: 100%;
  color: white;
  overflow-y: auto;
}

.select-screen h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #ffcc00;
}

.player-selects {
  display: flex;
  gap: 4rem;
  margin-bottom: 2rem;
}

.player-select {
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  text-align: center;
  min-width: 200px;
  border: 3px solid transparent;
}

.player-select.ready {
  border-color: #44cc44;
}

.player-select h3 {
  color: #88aacc;
  margin-bottom: 0.5rem;
}

.selected-char {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.char-preview {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 800px;
}

.character-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid transparent;
}

.character-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.character-card.selected1 {
  border-color: #4488ff;
  box-shadow: 0 0 15px rgba(68, 136, 255, 0.5);
}

.character-card.selected2 {
  border-color: #ff4444;
  box-shadow: 0 0 15px rgba(255, 68, 68, 0.5);
}

.char-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.char-name {
  font-weight: bold;
  font-size: 1.1rem;
}

.char-desc {
  font-size: 0.75rem;
  color: #aaa;
  text-align: center;
}

/* Stage Select */
.stage-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 900px;
}

.stage-card {
  position: relative;
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid transparent;
  min-height: 120px;
}

.stage-card:hover {
  transform: scale(1.05);
}

.stage-card.selected {
  border-color: #ffcc00;
  box-shadow: 0 0 20px rgba(255, 204, 0, 0.5);
}

.stage-preview {
  position: relative;
  height: 80px;
  margin-bottom: 0.5rem;
}

.mini-platform {
  position: absolute;
  height: 6px;
  border-radius: 2px;
  transform: translateX(-50%);
}

.stage-name {
  color: white;
  font-weight: bold;
  display: block;
  text-align: center;
}

/* Game UI */
.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  pointer-events: none;
}

.player-hud {
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem 2rem;
  border-radius: 10px;
}

.player-hud.left {
  border-left: 4px solid #4488ff;
}

.player-hud.right {
  border-right: 4px solid #ff4444;
  text-align: right;
}

.player-info {
  color: white;
  margin-bottom: 0.5rem;
}

.player-name {
  font-weight: bold;
}

.stock-icons {
  color: #ffcc00;
  letter-spacing: 0.3em;
}

.damage-display {
  font-size: 3rem;
  font-weight: 900;
}

/* Pause/GameOver Overlays */
.pause-overlay,
.gameover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pause-menu,
.gameover-content {
  text-align: center;
  color: white;
}

.pause-menu h2,
.gameover-content h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.gameover-content h2 {
  font-size: 2rem;
  color: #ffcc00;
  margin-bottom: 2rem;
}

.pause-menu button,
.gameover-buttons button {
  margin: 0.5rem;
}

.gameover-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
