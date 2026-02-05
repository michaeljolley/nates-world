<script setup>
import { computed } from 'vue'
import { regions } from '../data/regions'
import { aliens } from '../data/aliens'

const props = defineProps({
  conqueredRegions: { type: Array, required: true },
  currentRegion: { type: Object, default: null },
  coins: { type: Number, required: true },
  currentAlien: { type: Object, default: null }
})

const emit = defineEmits(['selectRegion', 'goToShop', 'goToUpgrades', 'startMission', 'back'])

const availableRegions = computed(() => {
  return regions.filter(r => {
    if (!r.unlockRequirement) return true
    return props.conqueredRegions.includes(r.unlockRequirement)
  })
})

function isConquered(regionId) {
  return props.conqueredRegions.includes(regionId)
}

function isAvailable(region) {
  if (!region.unlockRequirement) return true
  return props.conqueredRegions.includes(region.unlockRequirement)
}

function getDifficultyColor(difficulty) {
  const colors = {
    1: '#00ff00',
    2: '#88ff00',
    3: '#ffff00',
    4: '#ffaa00',
    5: '#ff6600',
    6: '#ff3300',
    7: '#ff0000',
    8: '#ff00ff'
  }
  return colors[difficulty] || '#ffffff'
}
</script>

<template>
  <div class="world-map">
    <div class="map-header">
      <button class="back-btn" @click="emit('back')">← Menu</button>
      <h1>🌍 World Domination</h1>
      <div class="coins">💰 {{ coins.toLocaleString() }}</div>
    </div>
    
    <div class="map-container">
      <div class="map-grid">
        <!-- Region nodes -->
        <div
          v-for="region in regions"
          :key="region.id"
          class="region-node"
          :class="{
            'conquered': isConquered(region.id),
            'available': isAvailable(region) && !isConquered(region.id),
            'locked': !isAvailable(region),
            'selected': currentRegion?.id === region.id
          }"
          :style="{
            left: region.x + '%',
            top: region.y + '%',
            borderColor: getDifficultyColor(region.difficulty)
          }"
          @click="isAvailable(region) && emit('selectRegion', region.id)"
        >
          <span class="region-icon">
            {{ isConquered(region.id) ? '✅' : isAvailable(region) ? '🎯' : '🔒' }}
          </span>
          <span class="region-name">{{ region.name }}</span>
          <span class="region-difficulty" :style="{ color: getDifficultyColor(region.difficulty) }">
            ⭐ {{ region.difficulty }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="bottom-panel">
      <div class="alien-panel">
        <div v-if="currentAlien" class="current-alien">
          <span class="alien-icon" :style="{ color: currentAlien.color }">👽</span>
          <span class="alien-name">{{ currentAlien.name }}</span>
        </div>
        <div v-else class="no-alien">No alien selected</div>
        
        <div class="panel-buttons">
          <button class="panel-btn shop-btn" @click="emit('goToShop')">🛒 Shop</button>
          <button class="panel-btn upgrade-btn" @click="emit('goToUpgrades')" :disabled="!currentAlien">⬆️ Upgrades</button>
        </div>
      </div>
      
      <div class="mission-panel" v-if="currentRegion">
        <div class="mission-info">
          <h3>{{ currentRegion.name }}</h3>
          <p>Difficulty: <span :style="{ color: getDifficultyColor(currentRegion.difficulty) }">{{ '⭐'.repeat(currentRegion.difficulty) }}</span></p>
          <p>Buildings: {{ currentRegion.buildings }}</p>
          <p>Reward: 💰 {{ currentRegion.coinReward }}{{ isConquered(currentRegion.id) ? ' (replay: half)' : '' }}</p>
        </div>
        <button 
          class="start-btn" 
          :class="{ 'replay': isConquered(currentRegion.id) }"
          @click="emit('startMission')"
          :disabled="!currentAlien"
        >
          {{ isConquered(currentRegion.id) ? '🔄 Replay' : '🚀 Start Mission' }}
        </button>
      </div>
      <div class="mission-panel empty" v-else>
        <p>Select a region to invade</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.world-map {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0a1628 0%, #1a2a40 50%, #0a1020 100%);
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid #00ff00;
}

.map-header h1 {
  color: #00ff00;
  font-size: 1.5rem;
  margin: 0;
}

.back-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #555;
  color: #aaa;
  border-radius: 5px;
  cursor: pointer;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.coins {
  font-size: 1.3rem;
  color: #ffd700;
  font-weight: bold;
}

.map-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.map-grid {
  position: absolute;
  inset: 20px;
}

.region-node {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 0.5rem 0.8rem;
  background: rgba(0, 0, 0, 0.8);
  border: 3px solid;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  min-width: 100px;
}

.region-node:hover:not(.locked) {
  transform: translate(-50%, -50%) scale(1.1);
  z-index: 10;
}

.region-node.conquered {
  background: rgba(0, 100, 0, 0.5);
  border-color: #00ff00 !important;
}

.region-node.available {
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
}

.region-node.locked {
  opacity: 0.4;
  cursor: not-allowed;
}

.region-node.selected {
  box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff;
  border-color: #00ffff !important;
}

.region-icon {
  font-size: 1.2rem;
}

.region-name {
  font-size: 0.7rem;
  color: #fff;
  text-align: center;
  white-space: nowrap;
}

.region-difficulty {
  font-size: 0.6rem;
}

.bottom-panel {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border-top: 2px solid #00ff00;
}

.alien-panel {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-alien {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 10px;
}

.alien-icon {
  font-size: 2rem;
}

.alien-name {
  color: #00ff00;
  font-weight: bold;
}

.no-alien {
  color: #888;
  font-style: italic;
}

.panel-buttons {
  display: flex;
  gap: 0.5rem;
}

.panel-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.shop-btn {
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
  color: #000;
}

.upgrade-btn {
  background: linear-gradient(135deg, #00ff00 0%, #00aa00 100%);
  color: #000;
}

.panel-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.panel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mission-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid #00ffff;
  border-radius: 10px;
}

.mission-panel.empty {
  justify-content: center;
  color: #888;
}

.mission-info h3 {
  color: #00ffff;
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
}

.mission-info p {
  margin: 0.1rem 0;
  font-size: 0.8rem;
  color: #aaa;
}

.start-btn {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #00ffff 0%, #0088aa 100%);
  border: none;
  border-radius: 10px;
  color: #000;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.start-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.start-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.start-btn.replay {
  background: linear-gradient(135deg, #aa00ff 0%, #6600aa 100%);
}

.start-btn.replay:hover:not(:disabled) {
  box-shadow: 0 0 20px rgba(170, 0, 255, 0.5);
}
</style>
