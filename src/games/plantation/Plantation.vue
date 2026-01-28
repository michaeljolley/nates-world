<script setup>
import { ref } from 'vue'
import MenuScreen from './components/MenuScreen.vue'
import GameScreen from './components/GameScreen.vue'

const gameState = ref('menu') // 'menu' | 'playing' | 'paused' | 'won' | 'lost'
const selectedMap = ref('garden')
const difficultySettings = ref(null)
const gameScreenRef = ref(null)
const menuScreenRef = ref(null)
const earnedNewToken = ref(false)

function startGame(settings) {
  selectedMap.value = settings.mapId
  difficultySettings.value = settings
  gameState.value = 'playing'
  earnedNewToken.value = false
}

function exitToMenu() {
  gameState.value = 'menu'
}

function gameOver(won) {
  if (won) {
    earnedNewToken.value = awardToken(selectedMap.value, difficultySettings.value.difficulty)
  }
  gameState.value = won ? 'won' : 'lost'
}

function awardToken(mapId, difficulty) {
  const saved = localStorage.getItem('plantation-tokens')
  const tokens = saved ? JSON.parse(saved) : {}
  
  if (!tokens[mapId]) {
    tokens[mapId] = {}
  }
  
  const isNew = !tokens[mapId][difficulty]
  tokens[mapId][difficulty] = true
  
  localStorage.setItem('plantation-tokens', JSON.stringify(tokens))
  return isNew
}

function continueGame() {
  if (gameScreenRef.value) {
    gameScreenRef.value.enableEndless()
  }
  gameState.value = 'playing'
}
</script>

<template>
  <div class="plantation">
    <MenuScreen 
      v-if="gameState === 'menu'"
      @start="startGame"
    />
    
    <GameScreen
      v-if="gameState === 'playing' || gameState === 'won'"
      v-show="gameState === 'playing'"
      ref="gameScreenRef"
      :map-id="selectedMap"
      :difficulty="difficultySettings"
      @exit="exitToMenu"
      @gameover="gameOver"
    />
    
    <!-- Victory/Defeat overlays -->
    <div v-if="gameState === 'won'" class="result-overlay victory">
      <div class="result-modal">
        <h1>🏆 Victory!</h1>
        <p>You defended the garden!</p>
        <div v-if="earnedNewToken" class="token-earned">
          <span class="token-star" :style="{ background: difficultySettings?.color }">★</span>
          <span>New {{ difficultySettings?.name }} token earned!</span>
        </div>
        <div class="button-row">
          <button class="continue-btn" @click="continueGame">Keep Playing</button>
          <button @click="exitToMenu">Back to Menu</button>
        </div>
      </div>
    </div>
    
    <div v-else-if="gameState === 'lost'" class="result-overlay defeat">
      <div class="result-modal">
        <h1>💀 Defeat!</h1>
        <p>The weeds have overrun your garden...</p>
        <button @click="exitToMenu">Try Again</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plantation {
  min-height: 100vh;
  background: linear-gradient(180deg, #87CEEB 0%, #98FB98 50%, #228B22 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.result-overlay.victory {
  background: rgba(34, 139, 34, 0.9);
}

.result-overlay.defeat {
  background: rgba(139, 0, 0, 0.9);
}

.result-modal {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.result-modal h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.result-modal p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
}

.token-earned {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #FFF8E1, #FFECB3);
  border: 2px solid #FFD54F;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  font-weight: bold;
  color: #F57F17;
}

.token-star {
  width: 24px;
  height: 24px;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  color: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.button-row {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.result-modal button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}

.result-modal button.continue-btn {
  background: linear-gradient(135deg, #FF9800, #F57C00);
}

.result-modal button:hover {
  transform: scale(1.05);
}
</style>
