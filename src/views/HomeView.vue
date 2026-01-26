<script setup>
import { useRouter } from 'vue-router'
import GameCard from '@/components/GameCard.vue'

const router = useRouter()

const games = [
  {
    id: 'tic-tac-toe',
    icon: '❌⭕',
    title: 'Tic-Tac-Toe',
    description: "The classic game of X's and O's! Challenge the computer at Easy, Medium, or Hard difficulty."
  },
  {
    id: 'warships',
    icon: '🚢💥',
    title: 'War Ships 3D',
    description: 'An epic 3D battleship game! Sink the enemy fleet before they sink yours!',
    wip: true
  }
]

function openGame(game) {
  router.push({ name: game.id })
}
</script>

<template>
  <div class="home-view">
    <div class="lightning-bg"></div>
    <div class="bolt bolt-1">⚡</div>
    <div class="bolt bolt-2">⚡</div>

    <div class="logo-container">
      <h1><span class="main-page-bolt-icon">⚡</span> Natorade</h1>
    </div>
    <p class="subtitle">Fuel Your Game</p>

    <div class="games-container">
      <GameCard
        v-for="game in games"
        :key="game.title"
        :icon="game.icon"
        :title="game.title"
        :description="game.description"
        :wip="game.wip"
        @click="openGame(game)"
      />
    </div>

    <section class="about-section">
      <h2 class="about-title">About Nate</h2>
      <p class="about-text">
        Nate is a 10 year-old game developer who loves creating fun and challenging games. 
        With the help of AI and a passion for coding, he's building awesome experiences 
        for players of all ages. Stay tuned for more games coming soon!
      </p>
    </section>

  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.lightning-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: 
    linear-gradient(135deg, transparent 40%, rgba(255, 102, 0, 0.03) 50%, transparent 60%),
    linear-gradient(-135deg, transparent 40%, rgba(0, 200, 83, 0.03) 50%, transparent 60%);
  z-index: 0;
}

.bolt {
  position: fixed;
  font-size: 15rem;
  opacity: 0.03;
  z-index: 0;
  pointer-events: none;
}

[data-theme="light"] .bolt {
  opacity: 0.08;
}

.bolt-1 { 
  top: 10%; 
  left: 5%; 
  transform: rotate(-15deg); 
  color: var(--accent-orange);
}

.bolt-2 { 
  bottom: 10%; 
  right: 5%; 
  transform: rotate(15deg); 
  color: var(--accent-green);
}

.logo-container {
  position: relative;
  z-index: 1;
  margin-bottom: 0.25rem;
}

.logo-container h1 {
  font-size: 4rem;
  text-transform: uppercase;
  letter-spacing: 4px;
  background: linear-gradient(135deg, var(--accent-orange) 0%, var(--accent-green) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 0 30px rgba(255, 102, 0, 0.3));
}

.bolt-icon {
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
  -webkit-text-fill-color: var(--accent-orange);
  filter: drop-shadow(0 0 20px var(--accent-orange));
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  letter-spacing: 8px;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
}

.games-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
}

.about-section {
  margin-top: 4rem;
  padding: 2rem;
  max-width: 600px;
  text-align: center;
  position: relative;
  z-index: 1;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.about-title {
  font-size: 1.5rem;
  color: var(--accent-green);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 4px;
}

.about-text {
  font-family: Arial, sans-serif;
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

</style>
