<script setup>
import { ref, computed, onMounted } from 'vue'
import { maps } from '../data/maps'

const emit = defineEmits(['start'])

const selectedMap = ref('garden')
const selectedDifficulty = ref('normal')
const mapsExpanded = ref(false)
const tokens = ref({})

const difficulties = {
  easy: { name: 'Easy', seedMult: 1.5, lifeMult: 1.5, enemyHealthMult: 0.7, enemySpeedMult: 0.8, rewardMult: 1.25, waves: 15, color: '#4CAF50' },
  normal: { name: 'Normal', seedMult: 1.0, lifeMult: 1.0, enemyHealthMult: 1.0, enemySpeedMult: 1.0, rewardMult: 1.0, waves: 20, color: '#2196F3' },
  hard: { name: 'Hard', seedMult: 0.8, lifeMult: 0.8, enemyHealthMult: 1.3, enemySpeedMult: 1.15, rewardMult: 0.9, waves: 25, color: '#FF9800' },
  expert: { name: 'Expert', seedMult: 0.6, lifeMult: 0.6, enemyHealthMult: 1.6, enemySpeedMult: 1.3, rewardMult: 0.8, waves: 30, color: '#F44336' },
  nightmare: { name: 'Nightmare', seedMult: 0.5, lifeMult: 0.5, enemyHealthMult: 2.0, enemySpeedMult: 1.5, rewardMult: 0.7, waves: 40, color: '#9C27B0' }
}

const difficultyOrder = ['easy', 'normal', 'hard', 'expert', 'nightmare']

onMounted(() => {
  loadTokens()
})

function loadTokens() {
  const saved = localStorage.getItem('plantation-tokens')
  if (saved) {
    tokens.value = JSON.parse(saved)
  }
}

function getMapTokens(mapId) {
  return tokens.value[mapId] || {}
}

function startGame() {
  emit('start', { mapId: selectedMap.value, difficulty: selectedDifficulty.value, ...difficulties[selectedDifficulty.value] })
}

function selectMap(id) {
  selectedMap.value = id
}
</script>

<template>
  <div class="menu-screen">
    <h1 class="title">🌱 Plantation 🌿</h1>
    <p class="subtitle">Tower Defense</p>
    
    <div class="menu-card">
      <div class="section-header" @click="mapsExpanded = !mapsExpanded">
        <h2>Select Map</h2>
        <span class="selected-map">{{ maps[selectedMap]?.name }}</span>
        <span class="toggle-icon">{{ mapsExpanded ? '▲' : '▼' }}</span>
      </div>
      
      <div class="map-list" v-show="mapsExpanded">
        <button 
          v-for="(map, id) in maps" 
          :key="id"
          :class="{ selected: selectedMap === id }"
          @click="selectMap(id)"
        >
          <span class="map-name">{{ map.name }}</span>
          <span class="map-tokens">
            <span 
              v-for="diff in difficultyOrder" 
              :key="diff"
              class="token"
              :class="{ earned: getMapTokens(id)[diff] }"
              :style="{ background: getMapTokens(id)[diff] ? difficulties[diff].color : '#ccc' }"
              :title="difficulties[diff].name"
            >★</span>
          </span>
        </button>
      </div>
      
      <h2>Difficulty</h2>
      <div class="difficulty-list">
        <button 
          v-for="(diff, id) in difficulties" 
          :key="id"
          :class="['diff-' + id, { selected: selectedDifficulty === id }]"
          @click="selectedDifficulty = id"
        >
          {{ diff.name }}
        </button>
      </div>
      
      <button class="start-btn" @click="startGame">
        🌻 Start Game
      </button>
    </div>
    
    <div class="instructions">
      <h3>How to Play</h3>
      <p>🌱 <strong>Place plants</strong> along the path to stop the weeds</p>
      <p>🎯 <strong>Kill weeds</strong> to earn seeds for more plants</p>
      <p>❤️ <strong>Protect your garden</strong> - don't let weeds reach the end!</p>
    </div>
  </div>
</template>

<style scoped>
.menu-screen {
  text-align: center;
  padding: 2rem;
}

.title {
  font-size: 4rem;
  color: #2E7D32;
  text-shadow: 3px 3px 0 #fff, 4px 4px 0 #1B5E20;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.5rem;
  color: #558B2F;
  letter-spacing: 8px;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.menu-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  margin: 0 auto 2rem;
}

.menu-card h2 {
  color: #2E7D32;
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  margin: -0.5rem -0.5rem 0.5rem -0.5rem;
  border-radius: 10px;
  transition: background 0.2s;
}

.section-header:hover {
  background: #E8F5E9;
}

.section-header h2 {
  margin: 0;
  flex-shrink: 0;
}

.selected-map {
  flex: 1;
  text-align: right;
  color: #4CAF50;
  font-weight: bold;
  font-size: 0.9rem;
}

.toggle-icon {
  color: #666;
  font-size: 0.8rem;
}

.map-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1.5rem;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.map-list button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background: #E8F5E9;
  border: 2px solid #A5D6A7;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.map-list button:hover {
  background: #C8E6C9;
}

.map-list button.selected {
  background: #4CAF50;
  border-color: #2E7D32;
  color: white;
}

.map-name {
  flex: 1;
  text-align: left;
}

.map-tokens {
  display: flex;
  gap: 2px;
}

.token {
  width: 14px;
  height: 14px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  border-radius: 50%;
  color: white;
  opacity: 0.3;
}

.token.earned {
  opacity: 1;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
}

.difficulty-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.difficulty-list button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background: #E8F5E9;
  border: 2px solid #A5D6A7;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.difficulty-list button:hover {
  transform: scale(1.05);
}

.difficulty-list button.selected {
  color: white;
}

.difficulty-list .diff-easy { border-color: #81C784; }
.difficulty-list .diff-easy.selected { background: #4CAF50; }

.difficulty-list .diff-normal { border-color: #64B5F6; }
.difficulty-list .diff-normal.selected { background: #2196F3; }

.difficulty-list .diff-hard { border-color: #FFB74D; }
.difficulty-list .diff-hard.selected { background: #FF9800; }

.difficulty-list .diff-expert { border-color: #E57373; }
.difficulty-list .diff-expert.selected { background: #F44336; }

.difficulty-list .diff-nightmare { border-color: #BA68C8; }
.difficulty-list .diff-nightmare.selected { background: #9C27B0; }

.start-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #FF9800, #F57C00);
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.start-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 5px 20px rgba(255, 152, 0, 0.4);
}

.instructions {
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 15px;
  max-width: 400px;
  margin: 0 auto;
  text-align: left;
}

.instructions h3 {
  color: #2E7D32;
  margin-bottom: 0.75rem;
  text-align: center;
}

.instructions p {
  color: #555;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}
</style>
