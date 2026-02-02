<script setup>
import { computed } from 'vue'

const props = defineProps({
  gameState: String,
  jumpCount: Number,
  highScore: Number,
  isNewRecord: Boolean,
  difficulty: Object
})

const emit = defineEmits(['start', 'restart', 'back-to-menu'])
</script>

<template>
  <div class="game-ui">
    <!-- Menu Screen -->
    <div v-if="gameState === 'menu'" class="menu-overlay">
      <div class="menu-content">
        <div class="frog-icon">🐸</div>
        <h1 class="game-title">Lily Pad Hopper</h1>
        <p class="subtitle">How far can you jump?</p>
        
        <div class="high-score-display" v-if="highScore > 0">
          <span class="trophy">🏆</span>
          <span>Best: {{ highScore }} jumps</span>
        </div>
        
        <button class="btn btn-start" @click="emit('start')">
          🐸 Start Hopping!
        </button>
        
        <div class="instructions">
          <h3>How to Play</h3>
          <p>Press <span class="key">SPACE</span> to jump forward</p>
          <p>Land on lily pads to score points</p>
          <p>Don't fall in the water!</p>
        </div>
        
        <button class="btn btn-back" @click="emit('back-to-menu')">
          ← Back to Games
        </button>
      </div>
    </div>

    <!-- HUD during gameplay -->
    <div v-if="gameState === 'playing'" class="hud">
      <div class="hud-left">
        <div class="jump-counter">
          <span class="jump-label">JUMPS</span>
          <span class="jump-value">{{ jumpCount }}</span>
        </div>
        <div class="difficulty-badge" :class="difficulty?.name?.toLowerCase()">
          {{ difficulty?.name }}
        </div>
      </div>
      <div class="hud-right">
        <div class="best-score">
          <span class="trophy-small">🏆</span>
          <span>{{ highScore }}</span>
        </div>
      </div>
    </div>

    <!-- Game Over Screen -->
    <div v-if="gameState === 'gameover'" class="menu-overlay gameover">
      <div class="menu-content">
        <div class="splash-icon">💦</div>
        <h1 class="gameover-title">Splash!</h1>
        
        <div class="final-score">
          <span class="score-label">You made</span>
          <span class="score-value">{{ jumpCount }}</span>
          <span class="score-label">jumps!</span>
        </div>
        
        <div v-if="isNewRecord" class="new-record">
          🎉 NEW RECORD! 🎉
        </div>
        
        <div class="high-score-display">
          <span class="trophy">🏆</span>
          <span>Best: {{ highScore }} jumps</span>
        </div>
        
        <button class="btn btn-start" @click="emit('restart')">
          🐸 Try Again
        </button>
        
        <button class="btn btn-back" @click="emit('back-to-menu')">
          ← Menu
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
  font-family: 'Arial Black', Arial, sans-serif;
}

.menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, 
    rgba(0, 100, 50, 0.95) 0%, 
    rgba(0, 60, 30, 0.98) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.menu-overlay.gameover {
  background: linear-gradient(180deg, 
    rgba(20, 60, 100, 0.95) 0%, 
    rgba(10, 40, 80, 0.98) 100%
  );
}

.menu-content {
  text-align: center;
  color: white;
}

.frog-icon {
  font-size: 6rem;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.splash-icon {
  font-size: 5rem;
  animation: splash 0.5s ease-out;
}

@keyframes splash {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); opacity: 1; }
}

.game-title {
  font-size: 3rem;
  margin: 0.5rem 0;
  background: linear-gradient(135deg, #88ff88 0%, #00cc44 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 10px rgba(0, 255, 100, 0.5));
}

.gameover-title {
  font-size: 3rem;
  color: #66ccff;
  margin: 0.5rem 0;
}

.subtitle {
  font-size: 1.2rem;
  color: #aaffaa;
  margin-bottom: 1.5rem;
}

.high-score-display {
  font-size: 1.3rem;
  color: #ffdd44;
  margin: 1rem 0;
}

.trophy {
  margin-right: 0.5rem;
}

.btn {
  display: block;
  width: 250px;
  margin: 0.8rem auto;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-start {
  background: linear-gradient(135deg, #44dd44 0%, #22aa22 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 200, 0, 0.4);
}

.btn-start:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 30px rgba(0, 255, 0, 0.5);
}

.btn-back {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
}

.btn-back:hover {
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.instructions {
  margin: 2rem auto;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  max-width: 280px;
}

.instructions h3 {
  margin: 0 0 0.8rem;
  color: #88ff88;
}

.instructions p {
  margin: 0.4rem 0;
  color: #aaa;
  font-size: 0.95rem;
}

.key {
  display: inline-block;
  background: #444;
  padding: 0.2rem 0.6rem;
  border-radius: 5px;
  font-family: monospace;
  color: #fff;
}

/* HUD */
.hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  box-sizing: border-box;
}

.hud-left, .hud-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.jump-counter {
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 2px solid #44dd44;
}

.jump-label {
  display: block;
  font-size: 0.7rem;
  color: #88ff88;
}

.jump-value {
  font-size: 2rem;
  color: white;
  font-weight: bold;
}

.difficulty-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.difficulty-badge.easy { background: #44cc44; color: white; }
.difficulty-badge.medium { background: #ddaa00; color: white; }
.difficulty-badge.hard { background: #dd4444; color: white; }
.difficulty-badge.extreme { background: #aa00aa; color: white; }

.best-score {
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  color: #ffdd44;
  font-size: 1.2rem;
}

.trophy-small {
  margin-right: 0.3rem;
}

/* Game Over */
.final-score {
  margin: 1.5rem 0;
}

.score-label {
  display: block;
  font-size: 1rem;
  color: #aaa;
}

.score-value {
  font-size: 5rem;
  color: #66ccff;
  font-weight: bold;
  line-height: 1.2;
}

.new-record {
  font-size: 1.5rem;
  color: #ffdd44;
  animation: recordPulse 0.5s ease-in-out infinite alternate;
  margin: 1rem 0;
}

@keyframes recordPulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}
</style>
