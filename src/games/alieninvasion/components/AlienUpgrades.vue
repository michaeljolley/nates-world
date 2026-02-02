<script setup>
import { computed } from 'vue'
import { getAlienById } from '../data/aliens'

const props = defineProps({
  coins: { type: Number, required: true },
  currentAlien: { type: Object, default: null },
  alienUpgrades: { type: Object, required: true }
})

const emit = defineEmits(['upgrade', 'back'])

const MAX_LEVEL = 20

const upgrades = computed(() => {
  if (!props.currentAlien) return null
  return props.alienUpgrades[props.currentAlien.id] || { attack: 0, defense: 0, speed: 0, hp: 0 }
})

function getUpgradeCost(level) {
  return Math.floor(50 * Math.pow(1.5, level))
}

function getCurrentStat(baseStat, upgradeLevel, multiplier) {
  return baseStat + upgradeLevel * multiplier
}

function canAfford(level) {
  return props.coins >= getUpgradeCost(level)
}

function isMaxLevel(level) {
  return level >= MAX_LEVEL
}

const stats = computed(() => {
  if (!props.currentAlien || !upgrades.value) return []
  
  const alien = props.currentAlien
  const up = upgrades.value
  
  return [
    {
      id: 'attack',
      name: 'Attack',
      icon: '⚔️',
      base: alien.baseAttack,
      current: getCurrentStat(alien.baseAttack, up.attack, 5),
      level: up.attack,
      cost: getUpgradeCost(up.attack),
      color: '#ff4444'
    },
    {
      id: 'defense',
      name: 'Defense',
      icon: '🛡️',
      base: alien.baseDefense,
      current: getCurrentStat(alien.baseDefense, up.defense, 3),
      level: up.defense,
      cost: getUpgradeCost(up.defense),
      color: '#4488ff'
    },
    {
      id: 'speed',
      name: 'Speed',
      icon: '⚡',
      base: alien.baseSpeed,
      current: getCurrentStat(alien.baseSpeed, up.speed, 0.5).toFixed(1),
      level: up.speed,
      cost: getUpgradeCost(up.speed),
      color: '#ffff00'
    },
    {
      id: 'hp',
      name: 'HP',
      icon: '❤️',
      base: alien.baseHP,
      current: getCurrentStat(alien.baseHP, up.hp, 20),
      level: up.hp,
      cost: getUpgradeCost(up.hp),
      color: '#44ff44'
    }
  ]
})
</script>

<template>
  <div class="alien-upgrades">
    <div class="upgrades-header">
      <button class="back-btn" @click="emit('back')">← Back</button>
      <h1>⬆️ Upgrades</h1>
      <div class="coins">💰 {{ coins.toLocaleString() }}</div>
    </div>
    
    <div class="upgrades-content" v-if="currentAlien">
      <div class="alien-display">
        <div class="alien-icon" :style="{ color: currentAlien.color }">👽</div>
        <h2>{{ currentAlien.name }}</h2>
        <div class="tier-info">Tier {{ currentAlien.tier }}</div>
      </div>
      
      <div class="stats-grid">
        <div 
          v-for="stat in stats" 
          :key="stat.id" 
          class="stat-card"
          :style="{ borderColor: stat.color }"
        >
          <div class="stat-header">
            <span class="stat-icon">{{ stat.icon }}</span>
            <span class="stat-name">{{ stat.name }}</span>
          </div>
          
          <div class="stat-value" :style="{ color: stat.color }">
            {{ stat.current }}
          </div>
          
          <div class="level-bar">
            <div 
              class="level-fill" 
              :style="{ 
                width: (stat.level / MAX_LEVEL * 100) + '%',
                background: stat.color
              }"
            ></div>
            <span class="level-text">Lv. {{ stat.level }} / {{ MAX_LEVEL }}</span>
          </div>
          
          <button
            class="upgrade-btn"
            :disabled="isMaxLevel(stat.level) || !canAfford(stat.level)"
            :style="{ 
              background: isMaxLevel(stat.level) ? '#333' : `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}88 100%)`
            }"
            @click="emit('upgrade', currentAlien.id, stat.id)"
          >
            <template v-if="isMaxLevel(stat.level)">
              MAX
            </template>
            <template v-else>
              Upgrade 💰{{ stat.cost }}
            </template>
          </button>
        </div>
      </div>
      
      <div class="upgrade-info">
        <p>Each upgrade increases the stat:</p>
        <ul>
          <li>⚔️ Attack: +5 per level</li>
          <li>🛡️ Defense: +3 per level</li>
          <li>⚡ Speed: +0.5 per level</li>
          <li>❤️ HP: +20 per level</li>
        </ul>
      </div>
    </div>
    
    <div class="no-alien" v-else>
      <p>No alien selected. Go to the shop to select an alien!</p>
      <button class="back-btn" @click="emit('back')">Go to World Map</button>
    </div>
  </div>
</template>

<style scoped>
.alien-upgrades {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #001020 0%, #002040 50%, #001030 100%);
}

.upgrades-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid #00ffff;
}

.upgrades-header h1 {
  color: #00ffff;
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

.upgrades-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.alien-display {
  text-align: center;
}

.alien-icon {
  font-size: 5rem;
  text-shadow: 0 0 30px currentColor;
}

.alien-display h2 {
  color: #fff;
  margin: 0.5rem 0 0.2rem;
}

.tier-info {
  color: #888;
  font-size: 0.9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 900px;
  width: 100%;
}

.stat-card {
  background: rgba(0, 0, 0, 0.5);
  border: 3px solid;
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-name {
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
}

.level-bar {
  width: 100%;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.level-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s;
}

.level-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #fff;
  text-shadow: 0 0 3px #000;
}

.upgrade-btn {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  transition: all 0.3s;
}

.upgrade-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.upgrade-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #888;
}

.upgrade-info {
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 10px;
  padding: 1rem 1.5rem;
  max-width: 400px;
}

.upgrade-info p {
  color: #00ffff;
  margin: 0 0 0.5rem;
}

.upgrade-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.upgrade-info li {
  color: #aaa;
  font-size: 0.9rem;
  margin: 0.3rem 0;
}

.no-alien {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #888;
}
</style>
