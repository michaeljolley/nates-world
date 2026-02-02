<script setup>
import { levels } from '../data/levels'

const props = defineProps({
  gameState: {
    type: String,
    required: true
  },
  currentLevel: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['start', 'restart', 'next-level', 'back-to-menu'])

const levelName = () => levels[props.currentLevel - 1]?.name || ''
const levelDescription = () => levels[props.currentLevel - 1]?.description || ''
</script>

<template>
  <div class="game-ui">
    <!-- Menu Screen -->
    <div v-if="gameState === 'menu'" class="overlay menu-overlay">
      <div class="menu-content">
        <h1 class="game-title">✈️ Paper Airplane</h1>
        <p class="game-subtitle">Fly through the school and escape!</p>
        
        <div class="instructions">
          <h3>How to Play</h3>
          <p>🎯 Navigate through 5 rooms to reach the window</p>
          <p>⬆️⬇️ Arrow keys to pitch up/down</p>
          <p>⬅️➡️ Arrow keys to turn left/right</p>
          <p>💥 Don't crash into anything!</p>
        </div>

        <button class="start-btn" @click="emit('start')">
          🚀 Start Game
        </button>
      </div>
    </div>

    <!-- HUD (during gameplay) -->
    <div v-if="gameState === 'playing'" class="hud">
      <div class="level-info">
        <span class="level-number">Level {{ currentLevel }}/5</span>
        <span class="level-name">{{ levelName() }}</span>
      </div>
      <div class="controls-hint">
        ⬆️⬇️⬅️➡️ to steer
      </div>
    </div>

    <!-- Crash Screen -->
    <div v-if="gameState === 'crashed'" class="overlay crash-overlay">
      <div class="overlay-content">
        <h2 class="crash-title">💥 Crashed!</h2>
        <p>Your paper airplane hit something!</p>
        <div class="button-group">
          <button class="retry-btn" @click="emit('restart')">
            🔄 Try Again
          </button>
          <button class="menu-btn" @click="emit('back-to-menu')">
            🏠 Menu
          </button>
        </div>
      </div>
    </div>

    <!-- Level Complete Screen -->
    <div v-if="gameState === 'level-complete'" class="overlay success-overlay">
      <div class="overlay-content">
        <h2 class="success-title">🎉 Level Complete!</h2>
        <p>You made it through {{ levelName() }}!</p>
        <p class="next-level-hint" v-if="currentLevel < 5">
          Next: {{ levels[currentLevel]?.name }}
        </p>
        <div class="button-group">
          <button class="next-btn" @click="emit('next-level')">
            ➡️ Next Level
          </button>
          <button class="menu-btn" @click="emit('back-to-menu')">
            🏠 Menu
          </button>
        </div>
      </div>
    </div>

    <!-- Victory Screen -->
    <div v-if="gameState === 'victory'" class="overlay victory-overlay">
      <div class="overlay-content victory-content">
        <h2 class="victory-title">🏆 FREEDOM!</h2>
        <p class="victory-text">You flew the paper airplane out the window!</p>
        <p class="victory-subtext">All 5 levels completed!</p>
        <div class="celebration">✈️🎊🎉🎊✈️</div>
        <button class="play-again-btn" @click="emit('back-to-menu')">
          🔄 Play Again
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all;
}

.menu-overlay {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.crash-overlay {
  background: rgba(139, 0, 0, 0.85);
}

.success-overlay {
  background: rgba(0, 100, 0, 0.85);
}

.victory-overlay {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.menu-content {
  text-align: center;
  color: white;
  max-width: 500px;
  padding: 2rem;
}

.game-title {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.game-subtitle {
  font-size: 1.3rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.instructions {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.instructions h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.instructions p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.start-btn {
  background: linear-gradient(135deg, #ff6600 0%, #00c853 100%);
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-weight: bold;
}

.start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 102, 0, 0.5);
}

/* HUD */
.hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: none;
}

.level-info {
  background: rgba(0, 0, 0, 0.6);
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  color: white;
}

.level-number {
  font-weight: bold;
  font-size: 1.1rem;
  display: block;
}

.level-name {
  font-size: 0.9rem;
  opacity: 0.8;
}

.controls-hint {
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  color: white;
  font-size: 0.9rem;
}

/* Overlay content */
.overlay-content {
  text-align: center;
  color: white;
  padding: 2rem;
}

.crash-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.success-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.next-level-hint {
  margin-top: 1rem;
  font-size: 1.1rem;
  opacity: 0.9;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.retry-btn, .next-btn {
  background: linear-gradient(135deg, #ff6600 0%, #ff9933 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s;
  font-weight: bold;
}

.menu-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 0.75rem 2rem;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.retry-btn:hover, .next-btn:hover, .menu-btn:hover {
  transform: scale(1.05);
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Victory */
.victory-content {
  max-width: 500px;
}

.victory-title {
  font-size: 4rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
}

.victory-text {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.victory-subtext {
  font-size: 1rem;
  opacity: 0.8;
}

.celebration {
  font-size: 3rem;
  margin: 1.5rem 0;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.play-again-btn {
  background: linear-gradient(135deg, #00c853 0%, #69f0ae 100%);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.3rem;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-weight: bold;
  margin-top: 1rem;
}

.play-again-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(0, 200, 83, 0.5);
}
</style>
