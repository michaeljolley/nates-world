<script setup>
import { useGameState } from '../composables/useGameState'
import { usePlayerData } from '../composables/usePlayerData'

const emit = defineEmits(['start', 'openShop', 'openQuests', 'openTeam'])

const { difficulty, setDifficulty, difficultyNames } = useGameState()
const { money, selectedShip } = usePlayerData()

const difficulties = [
  { level: 1, name: 'Easy', class: 'easy' },
  { level: 2, name: 'Medium', class: 'medium' },
  { level: 3, name: 'Hard', class: 'hard' },
  { level: 4, name: 'Extreme', class: 'extreme' },
  { level: 5, name: 'Nightmare', class: 'nightmare' }
]
</script>

<template>
  <div class="home-screen">
    <div class="ship-silhouette">🚢</div>
    <h1>⚓ WAR SHIPS ⚓</h1>
    <div class="subtitle">NAVAL COMBAT SIMULATOR</div>
    
    <div class="money-display">💰 ${{ money.toLocaleString() }}</div>
    
    <div class="current-ship">Current Ship: {{ selectedShip.name }}</div>
    
    <div class="menu-buttons">
      <button class="menu-btn-small" @click="$emit('openShop')">🚢 SHIP SHOP</button>
      <button class="menu-btn-small team" @click="$emit('openTeam')">👥 FLEET</button>
      <button class="menu-btn-small quests" @click="$emit('openQuests')">📜 QUESTS</button>
    </div>
    
    <div class="difficulty-container">
      <div class="difficulty-label">SELECT DIFFICULTY</div>
      <div class="difficulty-buttons">
        <button 
          v-for="diff in difficulties" 
          :key="diff.level"
          class="diff-btn"
          :class="[diff.class, { selected: difficulty === diff.level }]"
          @click="setDifficulty(diff.level)"
        >
          {{ diff.name }}
        </button>
      </div>
    </div>
    
    <button class="menu-btn" @click="$emit('start')">▶ START BATTLE</button>
    
    <div class="controls-info">
      <span>W/S</span> Throttle &nbsp;|&nbsp; 
      <span>A/D</span> Steer &nbsp;|&nbsp; 
      <span>SPACE</span> Fire Main Guns
    </div>
    
    <div class="version">v2.0</div>
  </div>
</template>

<style scoped>
.home-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 20px;
  background: linear-gradient(180deg, #0a1628 0%, #1a3a5c 50%, #0d2840 100%);
  color: #fff;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.ship-silhouette {
  font-size: 6rem;
  filter: drop-shadow(0 0 20px #00d4ff);
  margin-bottom: 20px;
}

h1 {
  font-size: 3rem;
  color: #fff;
  text-shadow: 0 0 30px #00d4ff, 0 0 60px #00d4ff;
  margin-bottom: 10px;
  letter-spacing: 8px;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { text-shadow: 0 0 30px #00d4ff, 0 0 60px #00d4ff; }
  to { text-shadow: 0 0 40px #00ffff, 0 0 80px #00ffff, 0 0 120px #0088ff; }
}

.subtitle {
  font-size: 1.2rem;
  color: #88ccff;
  margin-bottom: 30px;
  letter-spacing: 4px;
}

.money-display {
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #ffd700;
  border-radius: 10px;
  padding: 10px 25px;
  color: #ffd700;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.current-ship {
  color: #00d4ff;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.menu-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.menu-btn-small {
  background: linear-gradient(180deg, #ff9900, #cc6600);
  border: 2px solid #ffaa00;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-btn-small.team {
  background: linear-gradient(180deg, #44aa88, #228866);
  border-color: #44ddaa;
}

.menu-btn-small.quests {
  background: linear-gradient(180deg, #00d4ff, #0088aa);
  border-color: #00d4ff;
}

.menu-btn-small:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 153, 0, 0.5);
}

.difficulty-container {
  margin-bottom: 30px;
  text-align: center;
}

.difficulty-label {
  color: #88ccff;
  font-size: 1rem;
  margin-bottom: 15px;
  letter-spacing: 2px;
}

.difficulty-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.diff-btn {
  background: rgba(0, 100, 150, 0.3);
  border: 2px solid #446688;
  padding: 10px 20px;
  font-size: 0.9rem;
  color: #88aacc;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 90px;
}

.diff-btn:hover {
  background: rgba(0, 150, 200, 0.4);
  border-color: #00d4ff;
  color: #fff;
}

.diff-btn.selected {
  color: #fff;
  box-shadow: 0 0 20px currentColor;
}

.diff-btn.easy { border-color: #44aa44; }
.diff-btn.easy.selected { background: linear-gradient(180deg, #44dd44, #228822); border-color: #66ff66; }
.diff-btn.medium { border-color: #aaaa44; }
.diff-btn.medium.selected { background: linear-gradient(180deg, #dddd44, #888822); border-color: #ffff66; }
.diff-btn.hard { border-color: #dd8844; }
.diff-btn.hard.selected { background: linear-gradient(180deg, #ff8844, #884422); border-color: #ffaa66; }
.diff-btn.extreme { border-color: #dd4444; }
.diff-btn.extreme.selected { background: linear-gradient(180deg, #ff4444, #882222); border-color: #ff6666; }
.diff-btn.nightmare { border-color: #aa44aa; }
.diff-btn.nightmare.selected { background: linear-gradient(180deg, #dd44dd, #662266); border-color: #ff66ff; }

.menu-btn {
  background: linear-gradient(180deg, #00d4ff, #0066aa);
  border: 2px solid #00ffff;
  padding: 18px 50px;
  font-size: 1.4rem;
  color: #fff;
  border-radius: 30px;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.menu-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 40px rgba(0, 212, 255, 0.8);
  background: linear-gradient(180deg, #00ffff, #0088cc);
}

.controls-info {
  color: #668899;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.controls-info span {
  color: #00d4ff;
  font-weight: bold;
}

.version {
  position: absolute;
  bottom: 15px;
  right: 20px;
  color: #445566;
  font-size: 0.8rem;
}
</style>
