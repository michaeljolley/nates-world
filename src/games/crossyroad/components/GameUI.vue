<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  gameState: { type: String, required: true },
  score: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  coinsEarned: { type: Number, default: 0 },
  wallet: { type: Number, default: 0 },
  currentSkin: { type: Object, default: () => ({ id: 'chicken', name: 'Chicken', emoji: '🐔' }) },
  skins: { type: Array, default: () => [] },
  ownedSkins: { type: Array, default: () => ['chicken'] },
  selectedSkin: { type: String, default: 'chicken' }
})

const emit = defineEmits(['start', 'back-to-menu', 'play-again', 'open-shop', 'close-shop', 'buy-skin', 'select-skin'])

const router = useRouter()
const shopFilter = ref('all') // 'all', 'owned', 'affordable'

const filteredSkins = computed(() => {
  let skins = props.skins
  if (shopFilter.value === 'owned') {
    skins = skins.filter(s => props.ownedSkins.includes(s.id))
  } else if (shopFilter.value === 'affordable') {
    skins = skins.filter(s => props.ownedSkins.includes(s.id) || s.price <= props.wallet)
  }
  return skins
})

const skinTiers = computed(() => {
  const tiers = [
    { name: 'Free', min: 0, max: 0 },
    { name: 'Common', min: 1, max: 99 },
    { name: 'Uncommon', min: 100, max: 249 },
    { name: 'Rare', min: 250, max: 499 },
    { name: 'Epic', min: 500, max: 999 },
    { name: 'Legendary', min: 1000, max: 2499 },
    { name: 'Mythic', min: 2500, max: 99999 },
  ]
  
  return tiers.map(tier => ({
    ...tier,
    skins: filteredSkins.value.filter(s => s.price >= tier.min && s.price <= tier.max)
  })).filter(tier => tier.skins.length > 0)
})

function handleBackToMenu() {
  if (props.gameState === 'menu') {
    router.push('/')
  } else {
    emit('back-to-menu')
  }
}

function getSkinStatus(skin) {
  if (props.ownedSkins.includes(skin.id)) {
    return props.selectedSkin === skin.id ? 'selected' : 'owned'
  }
  return props.wallet >= skin.price ? 'affordable' : 'locked'
}

function handleSkinClick(skin) {
  const status = getSkinStatus(skin)
  if (status === 'owned') {
    emit('select-skin', skin.id)
  } else if (status === 'affordable') {
    emit('buy-skin', skin.id)
  }
}
</script>

<template>
  <div class="game-ui">
    <!-- HUD (during gameplay) -->
    <div v-if="gameState === 'playing'" class="hud">
      <div class="score">
        <span class="score-value">{{ score }}</span>
      </div>
      <div class="coins">
        <span class="coin-icon">🪙</span>
        <span class="coin-value">{{ coins }}</span>
      </div>
    </div>

    <!-- Menu Screen -->
    <div v-if="gameState === 'menu'" class="menu-overlay">
      <div class="menu-content">
        <h1 class="game-title">CROSSY ROAD</h1>
        <div class="character-preview">{{ currentSkin.emoji }}</div>
        <p class="character-name">{{ currentSkin.name }}</p>
        <p class="instructions">
          Use <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or Arrow Keys to hop
        </p>
        <p class="sub-instructions">
          Cross roads, rivers, and railroad tracks!<br>
          Avoid cars, trains, and don't fall in the water!
        </p>
        
        <div class="wallet-display">
          <span class="coin-icon">🪙</span>
          <span class="wallet-amount">{{ wallet }}</span>
        </div>
        
        <div v-if="highScore > 0" class="high-score">
          High Score: {{ highScore }}
        </div>

        <div class="menu-buttons">
          <button class="btn btn-primary" @click="$emit('start')">
            🎮 PLAY
          </button>
          <button class="btn btn-shop" @click="$emit('open-shop')">
            🛒 SHOP
          </button>
          <button class="btn btn-secondary" @click="handleBackToMenu">
            ← Back
          </button>
        </div>
      </div>
    </div>

    <!-- Game Over Screen -->
    <div v-if="gameState === 'gameover'" class="menu-overlay gameover">
      <div class="menu-content">
        <h1 class="gameover-title">GAME OVER</h1>
        <div class="final-score">
          <span class="label">Score</span>
          <span class="value">{{ score }}</span>
        </div>
        <div class="coins-earned">
          <span class="coins-label">Coins Earned</span>
          <div class="coins-breakdown">
            <span class="coin-icon">🪙</span>
            <span class="coins-amount">+{{ coinsEarned }}</span>
          </div>
        </div>
        <div class="wallet-total">
          Total: 🪙 {{ wallet }}
        </div>
        <div v-if="score >= highScore && score > 0" class="new-record">
          🏆 NEW RECORD! 🏆
        </div>
        <div class="high-score">
          High Score: {{ highScore }}
        </div>
        <div class="menu-buttons">
          <button class="btn btn-primary" @click="$emit('play-again')">
            🔄 PLAY AGAIN
          </button>
          <button class="btn btn-shop" @click="$emit('open-shop')">
            🛒 SHOP
          </button>
          <button class="btn btn-secondary" @click="handleBackToMenu">
            ← Menu
          </button>
        </div>
      </div>
    </div>

    <!-- Shop Screen -->
    <div v-if="gameState === 'shop'" class="menu-overlay shop">
      <div class="shop-content">
        <div class="shop-header">
          <h1 class="shop-title">🛒 SKIN SHOP</h1>
          <div class="shop-wallet">
            <span class="coin-icon">🪙</span>
            <span class="wallet-amount">{{ wallet }}</span>
          </div>
        </div>
        
        <div class="shop-filters">
          <button 
            class="filter-btn" 
            :class="{ active: shopFilter === 'all' }"
            @click="shopFilter = 'all'"
          >All ({{ skins.length }})</button>
          <button 
            class="filter-btn" 
            :class="{ active: shopFilter === 'owned' }"
            @click="shopFilter = 'owned'"
          >Owned ({{ ownedSkins.length }})</button>
          <button 
            class="filter-btn" 
            :class="{ active: shopFilter === 'affordable' }"
            @click="shopFilter = 'affordable'"
          >Can Buy</button>
        </div>

        <div class="shop-skins">
          <div v-for="tier in skinTiers" :key="tier.name" class="skin-tier">
            <h3 class="tier-name" :class="tier.name.toLowerCase()">{{ tier.name }}</h3>
            <div class="skin-grid">
              <div 
                v-for="skin in tier.skins" 
                :key="skin.id"
                class="skin-card"
                :class="getSkinStatus(skin)"
                @click="handleSkinClick(skin)"
              >
                <div class="skin-emoji">{{ skin.emoji }}</div>
                <div class="skin-name">{{ skin.name }}</div>
                <div class="skin-price" v-if="!ownedSkins.includes(skin.id)">
                  <span class="coin-icon-small">🪙</span>{{ skin.price }}
                </div>
                <div class="skin-status" v-else>
                  <span v-if="selectedSkin === skin.id">✓ Selected</span>
                  <span v-else>Owned</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="shop-footer">
          <button class="btn btn-secondary" @click="$emit('close-shop')">
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>

    <!-- Controls hint -->
    <div v-if="gameState === 'playing'" class="controls-hint">
      <span>WASD / Arrows to move</span>
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
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.hud {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 30px;
  pointer-events: none;
}

.score {
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 30px;
  border-radius: 25px;
}

.score-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.coins {
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.coin-icon {
  font-size: 1.5rem;
}

.coin-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffc107;
}

.menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a237e 0%, #4a148c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.menu-overlay.gameover {
  background: linear-gradient(135deg, #b71c1c 0%, #4a148c 100%);
}

.menu-content {
  text-align: center;
  color: white;
  padding: 40px;
}

.game-title {
  font-size: 4rem;
  font-weight: 900;
  margin: 0 0 10px 0;
  text-shadow: 4px 4px 0 #000, -2px -2px 0 #ffeb3b;
  letter-spacing: 4px;
}

.chicken-preview {
  font-size: 6rem;
  margin: 20px 0;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.instructions {
  font-size: 1.2rem;
  margin: 20px 0 10px;
  opacity: 0.9;
}

.instructions kbd {
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0 3px;
  font-family: inherit;
}

.sub-instructions {
  font-size: 1rem;
  opacity: 0.7;
  line-height: 1.6;
  margin-bottom: 20px;
}

.high-score {
  font-size: 1.2rem;
  color: #ffc107;
  margin: 15px 0;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  margin-top: 30px;
}

.btn {
  padding: 15px 50px;
  font-size: 1.3rem;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 200px;
}

.btn:hover {
  transform: scale(1.05);
}

.btn:active {
  transform: scale(0.98);
}

.btn-primary {
  background: linear-gradient(180deg, #4caf50 0%, #388e3c 100%);
  color: white;
  box-shadow: 0 4px 0 #2e7d32;
}

.btn-primary:hover {
  background: linear-gradient(180deg, #66bb6a 0%, #43a047 100%);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-shop {
  background: linear-gradient(180deg, #ffc107 0%, #ff9800 100%);
  color: #1a1a1a;
  box-shadow: 0 4px 0 #e65100;
}

.btn-shop:hover {
  background: linear-gradient(180deg, #ffca28 0%, #ffb300 100%);
}

.gameover-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0 0 30px 0;
  text-shadow: 4px 4px 0 #000;
}

.final-score {
  margin: 20px 0;
}

.final-score .label {
  display: block;
  font-size: 1.5rem;
  opacity: 0.8;
}

.final-score .value {
  display: block;
  font-size: 5rem;
  font-weight: bold;
  text-shadow: 3px 3px 0 #000;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 20px 0;
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5rem;
}

.new-record {
  font-size: 1.5rem;
  color: #ffc107;
  margin: 15px 0;
  animation: pulse 0.5s ease-in-out infinite alternate;
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.controls-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 20px;
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  opacity: 0.7;
}

/* Character Preview */
.character-preview {
  font-size: 6rem;
  margin: 15px 0 5px;
  animation: bounce 1s ease-in-out infinite;
}

.character-name {
  font-size: 1.3rem;
  color: #ffc107;
  margin-bottom: 15px;
}

/* Wallet Display */
.wallet-display {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.4);
  padding: 8px 20px;
  border-radius: 20px;
  margin: 10px 0;
}

.wallet-amount {
  font-size: 1.3rem;
  font-weight: bold;
  color: #ffc107;
}

/* Coins Earned (Game Over) */
.coins-earned {
  margin: 15px 0;
}

.coins-label {
  display: block;
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 5px;
}

.coins-breakdown {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 25px;
  border-radius: 20px;
}

.coins-amount {
  font-size: 2rem;
  font-weight: bold;
  color: #4caf50;
}

.wallet-total {
  font-size: 1.1rem;
  color: #ffc107;
  margin: 10px 0;
}

/* Shop Styles */
.menu-overlay.shop {
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
}

.shop-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  margin-bottom: 15px;
}

.shop-title {
  font-size: 2rem;
  font-weight: 900;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 0 #000;
}

.shop-wallet {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.4);
  padding: 10px 20px;
  border-radius: 25px;
}

.shop-wallet .wallet-amount {
  font-size: 1.5rem;
}

.shop-filters {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.filter-btn {
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.filter-btn.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: #ffc107;
  color: #ffc107;
}

.shop-skins {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.skin-tier {
  margin-bottom: 20px;
}

.tier-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  padding: 5px 15px;
  display: inline-block;
  border-radius: 10px;
  color: white;
}

.tier-name.free { background: #9e9e9e; }
.tier-name.common { background: #4caf50; }
.tier-name.uncommon { background: #2196f3; }
.tier-name.rare { background: #9c27b0; }
.tier-name.epic { background: #ff5722; }
.tier-name.legendary { background: linear-gradient(90deg, #ffc107, #ff9800); }
.tier-name.mythic { background: linear-gradient(90deg, #e91e63, #9c27b0, #3f51b5); }

.skin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.skin-card {
  background: rgba(255, 255, 255, 0.1);
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 15px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.skin-card:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.15);
}

.skin-card.selected {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.3);
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
}

.skin-card.owned {
  border-color: #2196f3;
  background: rgba(33, 150, 243, 0.2);
}

.skin-card.affordable {
  border-color: #ffc107;
}

.skin-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.skin-emoji {
  font-size: 2.5rem;
  margin-bottom: 5px;
}

.skin-name {
  font-size: 0.85rem;
  color: white;
  font-weight: bold;
  margin-bottom: 5px;
}

.skin-price {
  font-size: 0.9rem;
  color: #ffc107;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.coin-icon-small {
  font-size: 0.9rem;
}

.skin-status {
  font-size: 0.75rem;
  color: #4caf50;
}

.shop-footer {
  padding-top: 15px;
  display: flex;
  justify-content: center;
}
</style>
