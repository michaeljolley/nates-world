<script setup>
import { computed } from 'vue'
import { shipTemplates } from '../data/ships'
import { usePlayerData } from '../composables/usePlayerData'

const emit = defineEmits(['close'])

const { money, ownedShips, selectedShipId, buyShip, selectShip } = usePlayerData()

const ships = computed(() => 
  shipTemplates.map(ship => ({
    ...ship,
    owned: ownedShips.value.includes(ship.id),
    selected: selectedShipId.value === ship.id,
    canAfford: money.value >= ship.price
  }))
)

function handleBuy(ship) {
  if (buyShip(ship.id)) {
    selectShip(ship.id)
  }
}

function handleSelect(ship) {
  if (ship.owned) {
    selectShip(ship.id)
  }
}

const rarityColors = {
  common: '#88aacc',
  uncommon: '#44dd44',
  rare: '#4488ff',
  epic: '#aa44dd',
  legendary: '#ff8800'
}
</script>

<template>
  <div class="shop-overlay" @click.self="$emit('close')">
    <div class="shop-panel">
      <div class="shop-header">
        <h2>🚢 SHIP SHOP</h2>
        <div class="money">💰 ${{ money.toLocaleString() }}</div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      
      <div class="ships-grid">
        <div 
          v-for="ship in ships" 
          :key="ship.id"
          class="ship-card"
          :class="{ owned: ship.owned, selected: ship.selected }"
          :style="{ borderColor: rarityColors[ship.rarity] || '#446688' }"
          @click="ship.owned ? handleSelect(ship) : handleBuy(ship)"
        >
          <div class="ship-emoji">{{ ship.emoji || '🚢' }}</div>
          <div class="ship-name">{{ ship.name }}</div>
          <div class="rarity-tag" :style="{ color: rarityColors[ship.rarity] }">
            {{ ship.rarity?.toUpperCase() || 'COMMON' }}
          </div>
          <div class="ship-stats">
            <span title="Health">❤️ {{ ship.health }}</span>
            <span title="Speed">⚡ {{ ship.speed?.toFixed(1) || '0.0' }}</span>
            <span title="Damage">💥 {{ ship.damage }}</span>
          </div>
          <div v-if="ship.owned" class="owned-badge">
            {{ ship.selected ? '✓ SELECTED' : 'OWNED' }}
          </div>
          <div v-else class="price" :class="{ affordable: ship.canAfford }">
            ${{ ship.price.toLocaleString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.shop-panel {
  background: linear-gradient(180deg, #0a1628 0%, #1a3a5c 100%);
  border: 2px solid #00d4ff;
  border-radius: 20px;
  padding: 25px;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 0 50px rgba(0, 212, 255, 0.3);
}

.shop-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #446688;
}

.shop-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #fff;
  flex-grow: 1;
}

.money {
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid #ffd700;
  border-radius: 10px;
  padding: 8px 20px;
  color: #ffd700;
  font-weight: bold;
  font-size: 1.2rem;
}

.close-btn {
  background: #ff4444;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #ff6666;
  transform: scale(1.1);
}

.ships-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.ship-card {
  background: rgba(0, 50, 100, 0.4);
  border: 2px solid #446688;
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.ship-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
}

.ship-card.owned {
  background: rgba(0, 100, 50, 0.3);
}

.ship-card.selected {
  background: rgba(0, 150, 100, 0.4);
  box-shadow: 0 0 30px rgba(0, 255, 150, 0.5);
}

.ship-emoji {
  font-size: 3rem;
  margin-bottom: 10px;
}

.ship-name {
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.rarity-tag {
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.ship-stats {
  display: flex;
  justify-content: space-around;
  font-size: 0.85rem;
  color: #88aacc;
  margin-bottom: 10px;
}

.owned-badge {
  background: linear-gradient(180deg, #44aa44, #228822);
  color: #fff;
  padding: 8px;
  border-radius: 8px;
  font-weight: bold;
}

.price {
  background: linear-gradient(180deg, #664422, #442211);
  color: #ff6666;
  padding: 8px;
  border-radius: 8px;
  font-weight: bold;
}

.price.affordable {
  background: linear-gradient(180deg, #ff9900, #cc6600);
  color: #fff;
}
</style>
