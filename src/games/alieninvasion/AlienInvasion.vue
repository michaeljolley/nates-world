<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import GameScene from './components/GameScene.vue'
import GameUI from './components/GameUI.vue'
import WorldMap from './components/WorldMap.vue'
import AlienShop from './components/AlienShop.vue'
import AlienUpgrades from './components/AlienUpgrades.vue'
import MainMenu from './components/MainMenu.vue'
import VictoryScreen from './components/VictoryScreen.vue'
import DefeatScreen from './components/DefeatScreen.vue'
import { useGameState } from './composables/useGameState'

const router = useRouter()
const isReplay = ref(false)

const {
  gameState,
  coins,
  currentAlien,
  currentRegion,
  unlockedAliens,
  alienUpgrades,
  conqueredRegions,
  startGame,
  selectRegion,
  selectAlien,
  upgradeAlien,
  buyAlien,
  endGame,
  winRegion,
  addCoins,
  takeDamage,
  resetToMenu,
  goToWorldMap,
  goToShop,
  goToUpgrades,
  saveGame,
  loadGame
} = useGameState()

// Load saved game on mount
loadGame()

function handleBackToHome() {
  saveGame()
  router.push('/')
}

function handleStartMission() {
  if (currentAlien.value && currentRegion.value) {
    // Track if this is a replay
    isReplay.value = conqueredRegions.value.includes(currentRegion.value.id)
    startGame()
  }
}

function handleVictory() {
  winRegion()
}

function handleDefeat() {
  endGame()
}

function handleCoinsEarned(amount) {
  addCoins(amount)
}

function handleDamage(amount) {
  takeDamage(amount)
}

const victoryCoins = computed(() => {
  if (!currentRegion.value) return 0
  return isReplay.value ? Math.floor(currentRegion.value.coinReward / 2) : currentRegion.value.coinReward
})
</script>

<template>
  <div class="alien-invasion-game">
    <!-- Main Menu -->
    <MainMenu
      v-if="gameState === 'menu'"
      @play="goToWorldMap"
      @back="handleBackToHome"
    />

    <!-- World Map -->
    <WorldMap
      v-if="gameState === 'worldmap'"
      :conquered-regions="conqueredRegions"
      :current-region="currentRegion"
      @select-region="selectRegion"
      @go-to-shop="goToShop"
      @go-to-upgrades="goToUpgrades"
      @start-mission="handleStartMission"
      @back="resetToMenu"
      :coins="coins"
      :current-alien="currentAlien"
    />

    <!-- Alien Shop -->
    <AlienShop
      v-if="gameState === 'shop'"
      :coins="coins"
      :unlocked-aliens="unlockedAliens"
      @buy="buyAlien"
      @select="selectAlien"
      @back="goToWorldMap"
    />

    <!-- Alien Upgrades -->
    <AlienUpgrades
      v-if="gameState === 'upgrades'"
      :coins="coins"
      :current-alien="currentAlien"
      :alien-upgrades="alienUpgrades"
      @upgrade="upgradeAlien"
      @back="goToWorldMap"
    />

    <!-- Playing -->
    <template v-if="gameState === 'playing'">
      <GameScene
        :current-alien="currentAlien"
        :alien-upgrades="alienUpgrades"
        :current-region="currentRegion"
        @coins="handleCoinsEarned"
        @damage="handleDamage"
        @victory="handleVictory"
        @defeat="handleDefeat"
      />
      <GameUI
        :coins="coins"
        :current-alien="currentAlien"
        :alien-upgrades="alienUpgrades"
        @pause="goToWorldMap"
      />
    </template>

    <!-- Victory Screen -->
    <VictoryScreen
      v-if="gameState === 'victory'"
      :region="currentRegion"
      :coins-earned="victoryCoins"
      :is-replay="isReplay"
      @continue="goToWorldMap"
    />

    <!-- Defeat Screen -->
    <DefeatScreen
      v-if="gameState === 'defeat'"
      @retry="handleStartMission"
      @back="goToWorldMap"
    />
  </div>
</template>

<style scoped>
.alien-invasion-game {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a20 0%, #1a0a30 50%, #0a1a20 100%);
}
</style>
