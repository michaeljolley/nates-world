<script setup>
import { computed } from 'vue'
import { aliens } from '../data/aliens'

const props = defineProps({
  coins: { type: Number, required: true },
  unlockedAliens: { type: Array, required: true }
})

const emit = defineEmits(['buy', 'select', 'back'])

const sortedAliens = computed(() => {
  return [...aliens].sort((a, b) => a.cost - b.cost)
})

function isUnlocked(alienId) {
  return props.unlockedAliens.includes(alienId)
}

function canAfford(cost) {
  return props.coins >= cost
}

function getTierColor(tier) {
  const colors = {
    1: '#888888',
    2: '#00ff00',
    3: '#00ffff',
    4: '#ff00ff',
    5: '#ff8800',
    6: '#ffd700'
  }
  return colors[tier] || '#ffffff'
}

function getTierName(tier) {
  const names = {
    1: 'Common',
    2: 'Uncommon',
    3: 'Rare',
    4: 'Epic',
    5: 'Legendary',
    6: 'Mythic'
  }
  return names[tier] || 'Unknown'
}
</script>

<template>
  <div class="alien-shop">
    <div class="shop-header">
      <button class="back-btn" @click="emit('back')">← Back</button>
      <h1>👽 Alien Shop</h1>
      <div class="coins">💰 {{ coins.toLocaleString() }}</div>
    </div>
    
    <div class="shop-content">
      <div class="aliens-grid">
        <div
          v-for="alien in sortedAliens"
          :key="alien.id"
          class="alien-card"
          :class="{
            'unlocked': isUnlocked(alien.id),
            'affordable': !isUnlocked(alien.id) && canAfford(alien.cost)
          }"
          :style="{ borderColor: getTierColor(alien.tier) }"
        >
          <div class="tier-badge" :style="{ background: getTierColor(alien.tier) }">
            {{ getTierName(alien.tier) }}
          </div>
          
          <div class="alien-icon" :style="{ color: alien.color }">👽</div>
          <h3 class="alien-name">{{ alien.name }}</h3>
          
          <div class="alien-stats">
            <div class="stat">⚔️ {{ alien.baseAttack }}</div>
            <div class="stat">🛡️ {{ alien.baseDefense }}</div>
            <div class="stat">⚡ {{ alien.baseSpeed }}</div>
            <div class="stat">❤️ {{ alien.baseHP }}</div>
          </div>
          
          <div class="alien-actions">
            <template v-if="isUnlocked(alien.id)">
              <button class="select-btn" @click="emit('select', alien.id)">
                ✓ Select
              </button>
            </template>
            <template v-else>
              <div class="price" :class="{ 'cannot-afford': !canAfford(alien.cost) }">
                💰 {{ alien.cost.toLocaleString() }}
              </div>
              <button 
                class="buy-btn" 
                :disabled="!canAfford(alien.cost)"
                @click="emit('buy', alien.id)"
              >
                Buy
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alien-shop {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0a0020 0%, #1a0040 50%, #0a0030 100%);
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid #ff00ff;
}

.shop-header h1 {
  color: #ff00ff;
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

.shop-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.aliens-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.alien-card {
  background: rgba(0, 0, 0, 0.6);
  border: 3px solid;
  border-radius: 15px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.alien-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.alien-card.unlocked {
  background: rgba(0, 100, 0, 0.3);
}

.alien-card.affordable {
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.tier-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 0.6rem;
  font-weight: bold;
  color: #000;
}

.alien-icon {
  font-size: 3rem;
  text-shadow: 0 0 20px currentColor;
}

.alien-name {
  color: #fff;
  margin: 0;
  font-size: 1rem;
}

.alien-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem;
  width: 100%;
}

.stat {
  font-size: 0.75rem;
  color: #aaa;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.2rem;
  border-radius: 3px;
}

.alien-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  margin-top: auto;
  width: 100%;
}

.price {
  font-size: 0.9rem;
  color: #ffd700;
  font-weight: bold;
}

.price.cannot-afford {
  color: #ff4444;
}

.buy-btn, .select-btn {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.buy-btn {
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
  color: #000;
}

.buy-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.select-btn {
  background: linear-gradient(135deg, #00ff00 0%, #00aa00 100%);
  color: #000;
}

.buy-btn:hover:not(:disabled), .select-btn:hover {
  transform: scale(1.05);
}
</style>
