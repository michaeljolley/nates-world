import { ref, reactive } from 'vue'
import { getCharacter } from '../data/characters.js'
import { getStage } from '../data/stages.js'

export function useGameState() {
  const gamePhase = ref('menu') // menu, charSelect, stageSelect, playing, paused, gameOver
  const winner = ref(null)
  const stockCount = ref(3)
  
  const createPlayerState = (id, controls) => ({
    id,
    character: null,
    stocks: 3,
    damage: 0,
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    facing: id === 1 ? 1 : -1,
    state: 'idle',
    isGrounded: false,
    jumpCount: 0,
    attackCooldown: 0,
    hitstun: 0,
    invincible: 0,
    controls,
    // Smash Bros additions
    shielding: false,
    shieldHealth: 100,
    shieldBroken: false,
    stunned: 0,
    dodging: false,
    dodgeFrames: 0,
    dodgeCooldown: 0,
    airDodgeUsed: false,
    fastFalling: false,
    tumbling: false,
    techInput: false,
    currentAttack: null,
    comboCount: 0,
    lastHitBy: null
  })
  
  const players = reactive([
    createPlayerState(1, 'keyboard1'),
    createPlayerState(2, 'cpu')
  ])
  
  const selectedStage = ref(null)
  const isPaused = ref(false)
  
  const selectCharacter = (playerIndex, characterId) => {
    players[playerIndex].character = getCharacter(characterId)
  }
  
  const selectStage = (stageId) => {
    selectedStage.value = getStage(stageId)
  }
  
  const resetPlayerState = (player, spawn, facingDir) => {
    player.damage = 0
    player.position = { x: spawn.x, y: spawn.y + 2 }
    player.velocity = { x: 0, y: 0 }
    player.facing = facingDir
    player.state = 'idle'
    player.isGrounded = false
    player.jumpCount = 0
    player.attackCooldown = 0
    player.hitstun = 0
    player.invincible = 60
    // Smash Bros state reset
    player.shielding = false
    player.shieldHealth = 100
    player.shieldBroken = false
    player.stunned = 0
    player.dodging = false
    player.dodgeFrames = 0
    player.dodgeCooldown = 0
    player.airDodgeUsed = false
    player.fastFalling = false
    player.tumbling = false
    player.techInput = false
    player.currentAttack = null
    player.comboCount = 0
    player.lastHitBy = null
  }
  
  const startGame = () => {
    if (!selectedStage.value) return
    
    // Reset players
    players.forEach((player, index) => {
      player.stocks = stockCount.value
      const spawn = selectedStage.value.spawnPoints[index]
      resetPlayerState(player, spawn, index === 0 ? 1 : -1)
    })
    
    winner.value = null
    gamePhase.value = 'playing'
    isPaused.value = false
  }
  
  const respawnPlayer = (playerIndex) => {
    const player = players[playerIndex]
    if (player.stocks <= 0) return
    
    const spawn = selectedStage.value.spawnPoints[playerIndex]
    player.position = { x: spawn.x, y: spawn.y + 5 }
    player.velocity = { x: 0, y: 0 }
    player.damage = 0
    player.state = 'idle'
    player.isGrounded = false
    player.jumpCount = 0
    player.hitstun = 0
    player.invincible = 120 // 2 seconds invincibility
    // Reset Smash states
    player.shielding = false
    player.shieldHealth = 100
    player.shieldBroken = false
    player.stunned = 0
    player.dodging = false
    player.dodgeFrames = 0
    player.dodgeCooldown = 0
    player.airDodgeUsed = false
    player.fastFalling = false
    player.tumbling = false
    player.comboCount = 0
  }
  
  const playerKO = (playerIndex) => {
    const player = players[playerIndex]
    player.stocks--
    
    if (player.stocks <= 0) {
      // Check for game over
      const otherPlayer = players[1 - playerIndex]
      if (otherPlayer.stocks > 0) {
        winner.value = otherPlayer.id
        gamePhase.value = 'gameOver'
      }
    } else {
      respawnPlayer(playerIndex)
    }
  }
  
  const togglePause = () => {
    if (gamePhase.value === 'playing') {
      isPaused.value = !isPaused.value
    }
  }
  
  const goToMenu = () => {
    gamePhase.value = 'menu'
    winner.value = null
  }
  
  const goToCharSelect = () => {
    gamePhase.value = 'charSelect'
    players[0].character = null
    players[1].character = null
  }
  
  const goToStageSelect = () => {
    if (players[0].character && players[1].character) {
      gamePhase.value = 'stageSelect'
    }
  }
  
  const setPlayer2Mode = (mode) => {
    players[1].controls = mode
  }
  
  return {
    gamePhase,
    players,
    selectedStage,
    isPaused,
    winner,
    stockCount,
    selectCharacter,
    selectStage,
    startGame,
    respawnPlayer,
    playerKO,
    togglePause,
    goToMenu,
    goToCharSelect,
    goToStageSelect,
    setPlayer2Mode
  }
}
