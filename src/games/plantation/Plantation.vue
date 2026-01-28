<script setup>
import { ref } from 'vue'
import MenuScreen from './components/MenuScreen.vue'
import GameScreen from './components/GameScreen.vue'

const gameState = ref('menu') // 'menu' | 'playing' | 'paused' | 'won' | 'lost'
const selectedMap = ref('garden')
const difficultySettings = ref(null)

function startGame(settings) {
  selectedMap.value = settings.mapId
  difficultySettings.value = settings
  gameState.value = 'playing'
}

function exitToMenu() {
  gameState.value = 'menu'
}

function gameOver(won) {
  gameState.value = won ? 'won' : 'lost'
}
</script>

<template>
  <div class="plantation">
    <MenuScreen 
      v-if="gameState === 'menu'"
      @start="startGame"
    />
    
    <GameScreen
      v-else-if="gameState === 'playing'"
      :map-id="selectedMap"
      :difficulty="difficultySettings"
      @exit="exitToMenu"
      @gameover="gameOver"
    />
    
    <!-- Victory/Defeat overlays -->
    <div v-else-if="gameState === 'won'" class="result-overlay victory">
      <div class="result-modal">
        <h1>🏆 Victory!</h1>
        <p>You defended the garden!</p>
        <button @click="exitToMenu">Back to Menu</button>
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
  margin-bottom: 2rem;
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

.result-modal button:hover {
  transform: scale(1.05);
}
</style>
