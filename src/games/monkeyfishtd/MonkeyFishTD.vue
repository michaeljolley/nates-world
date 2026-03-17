<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MenuScreen from './components/MenuScreen.vue'
import GameScreen from './components/GameScreen.vue'

const router = useRouter()

const gameState = ref('menu')
const selectedMap = ref('riverbank')
const difficultySettings = ref(null)
const gameScreenRef = ref(null)
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

function goHome() {
  router.push('/')
}

function gameOver(won) {
  if (won) {
    earnedNewToken.value = awardToken(selectedMap.value, difficultySettings.value.difficulty)
  }
  gameState.value = won ? 'won' : 'lost'
}

function awardToken(mapId, difficulty) {
  const saved = localStorage.getItem('monkeyfishtd-tokens')
  const tokens = saved ? JSON.parse(saved) : {}
  
  if (!tokens[mapId]) {
    tokens[mapId] = {}
  }
  
  const isNew = !tokens[mapId][difficulty]
  tokens[mapId][difficulty] = true
  
  localStorage.setItem('monkeyfishtd-tokens', JSON.stringify(tokens))
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
  <div class="monkey-fish-td">
    <button class="home-btn" @click="goHome">🏠 Home</button>
    
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
    
    <!-- Victory overlay -->
    <div v-if="gameState === 'won'" class="result-overlay victory">
      <div class="result-modal">
        <h1>🎉 Victory!</h1>
        <p>You defended the shore from the fish!</p>
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
    
    <!-- Defeat overlay -->
    <div v-else-if="gameState === 'lost'" class="result-overlay defeat">
      <div class="result-modal">
        <h1>💀 Defeat!</h1>
        <p>The fish have invaded the shore...</p>
        <button @click="exitToMenu">Try Again</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.monkey-fish-td {
  min-height: 100vh;
  background: linear-gradient(180deg, #1E3A5F 0%, #2E5A7E 30%, #4A7C59 70%, #3D5A3D 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
}

.home-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  z-index: 10;
}

.home-btn:hover {
  background: rgba(0, 0, 0, 0.8);
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
  background: rgba(46, 125, 50, 0.9);
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
  background: linear-gradient(135deg, #2196F3, #1976D2);
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
