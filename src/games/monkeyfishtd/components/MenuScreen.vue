<script setup>
import { ref, computed } from 'vue'
import { maps } from '../data/maps'

const emit = defineEmits(['start'])

const selectedMap = ref('riverbank')
const selectedDifficulty = ref('normal')

const mapList = computed(() => Object.values(maps))

const difficulties = [
  { id: 'easy', name: 'Easy', color: '#4CAF50', waves: 15, bananaMult: 1.5, lifeMult: 1.5, enemyHealthMult: 0.7, enemySpeedMult: 0.8, rewardMult: 1.2 },
  { id: 'normal', name: 'Normal', color: '#2196F3', waves: 20, bananaMult: 1, lifeMult: 1, enemyHealthMult: 1, enemySpeedMult: 1, rewardMult: 1 },
  { id: 'hard', name: 'Hard', color: '#FF9800', waves: 30, bananaMult: 0.8, lifeMult: 0.7, enemyHealthMult: 1.3, enemySpeedMult: 1.2, rewardMult: 0.9 },
  { id: 'extreme', name: 'Extreme', color: '#F44336', waves: 40, bananaMult: 0.6, lifeMult: 0.5, enemyHealthMult: 1.6, enemySpeedMult: 1.4, rewardMult: 0.8 }
]

// Load tokens
const tokens = computed(() => {
  const saved = localStorage.getItem('monkeyfishtd-tokens')
  return saved ? JSON.parse(saved) : {}
})

function getTokenForMap(mapId, diffId) {
  return tokens.value[mapId]?.[diffId]
}

function startGame() {
  const diff = difficulties.find(d => d.id === selectedDifficulty.value)
  emit('start', {
    mapId: selectedMap.value,
    difficulty: selectedDifficulty.value,
    ...diff
  })
}
</script>

<template>
  <div class="menu-screen">
    <h1 class="title">🐵 Monkey Fish TD 🐟</h1>
    <p class="subtitle">Defend the shore from the fish invasion!</p>
    
    <div class="menu-content">
      <!-- Map Selection -->
      <div class="section">
        <h2>Select Map</h2>
        <div class="map-grid">
          <div 
            v-for="map in mapList" 
            :key="map.id"
            class="map-card"
            :class="{ selected: selectedMap === map.id }"
            @click="selectedMap = map.id"
          >
            <div class="map-preview" :style="{ background: `linear-gradient(135deg, ${map.landColor}, ${map.waterColor})` }">
              <svg :viewBox="`0 0 ${map.width} ${map.height}`" class="map-path">
                <polyline 
                  :points="map.path.map(p => `${p.x},${p.y}`).join(' ')"
                  fill="none"
                  :stroke="map.waterColor"
                  stroke-width="20"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span class="map-name">{{ map.name }}</span>
            <div class="map-tokens">
              <span 
                v-for="diff in difficulties" 
                :key="diff.id"
                class="token"
                :class="{ earned: getTokenForMap(map.id, diff.id) }"
                :style="{ background: getTokenForMap(map.id, diff.id) ? diff.color : '#ccc' }"
              >★</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Difficulty Selection -->
      <div class="section">
        <h2>Select Difficulty</h2>
        <div class="difficulty-grid">
          <button 
            v-for="diff in difficulties" 
            :key="diff.id"
            class="difficulty-btn"
            :class="{ selected: selectedDifficulty === diff.id }"
            :style="{ '--diff-color': diff.color }"
            @click="selectedDifficulty = diff.id"
          >
            <span class="diff-name">{{ diff.name }}</span>
            <span class="diff-waves">{{ diff.waves }} Waves</span>
          </button>
        </div>
      </div>
      
      <!-- Start Button -->
      <button class="start-btn" @click="startGame">
        Start Game
      </button>
    </div>
  </div>
</template>

<style scoped>
.menu-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
  color: white;
}

.title {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 1.2rem;
  color: #FFD700;
  margin-bottom: 2rem;
}

.menu-content {
  background: rgba(0, 0, 0, 0.7);
  padding: 2rem;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
}

.section {
  margin-bottom: 1.5rem;
}

.section h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #87CEEB;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
}

.map-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid transparent;
}

.map-card:hover {
  background: rgba(255, 255, 255, 0.2);
}

.map-card.selected {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.2);
}

.map-preview {
  width: 120px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.map-path {
  width: 100%;
  height: 100%;
}

.map-name {
  font-size: 0.85rem;
  font-weight: bold;
  text-align: center;
}

.map-tokens {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.token {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  color: white;
}

.token:not(.earned) {
  opacity: 0.3;
}

.difficulty-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.difficulty-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 3px solid var(--diff-color);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.difficulty-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.difficulty-btn.selected {
  background: var(--diff-color);
}

.diff-name {
  font-size: 1.1rem;
  font-weight: bold;
}

.diff-waves {
  font-size: 0.8rem;
  opacity: 0.8;
}

.start-btn {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 1rem auto 0;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #333;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: transform 0.2s;
}

.start-btn:hover {
  transform: scale(1.05);
}
</style>
