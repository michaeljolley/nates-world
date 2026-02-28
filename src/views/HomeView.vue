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
    description: 'An epic 3D battleship game! Sink the enemy fleet before they sink yours!'
  },
  {
    id: 'plantation',
    icon: '🌱🌿',
    title: 'Plantation',
    description: 'Tower defense! Place plants to stop the invading weeds from overrunning your garden!'
  },
  {
    id: 'animal-trivia',
    icon: '🦁🐘',
    title: 'Animal Trivia',
    description: 'Test your animal knowledge! Answer 10 questions before time runs out.'
  },
  {
    id: 'paper-airplane',
    icon: '✈️🏫',
    title: 'Paper Airplane',
    description: 'Fly a paper airplane through the school! Navigate 10 rooms and escape out the stage!',
    wip: true
  },

  {
    id: 'connect-four',
    icon: '🔴🟡',
    title: 'Connect Four',
    description: 'Drop discs into the grid and connect 4 in a row before the AI does!'
  },

  {
    id: 'snake-run',
    icon: '🐍🍎',
    title: 'Snake Run',
    description: 'Slither and grow! Compete against 1-20 AI snakes in this snake.io style game!',
    wip: true
  },
  {
    id: 'tree-hoppers',
    icon: '🌳🐒',
    title: 'Tree Hoppers',
    description: 'Jump from tree to tree and swing on vines as a monkey! Don\'t fall to the ground!',
    wip: true
  },
  {
    id: 'fruit-ninja',
    icon: '🍉🗡️',
    title: 'Fruit Ninja',
    description: 'Slice flying fruit while avoiding bombs! You have 3 lives - don\'t blow them all!'
  },

  {
    id: 'alien-invasion',
    icon: '👽🌍',
    title: 'Alien Invasion',
    description: 'Control aliens to destroy buildings and take over the world! Buy and upgrade 50 unique aliens!'
  },
  {
    id: 'crossy-road',
    icon: '🐔🚗',
    title: 'Crossy Road',
    description: 'Help the chicken cross busy roads, rivers, and train tracks! How far can you go?'
  },
  {
    id: 'tetris',
    icon: '🧱📦',
    title: 'Tetris',
    description: 'Stack falling blocks and clear lines! Classic puzzle action with increasing speed!',
    wip: true
  },
  {
    id: 'boxing-bros',
    icon: '🥊👊',
    title: 'Boxing Bros',
    description: 'Step into the ring! Fight an NPC boxer using WASD to move and SPACE to punch!',
    wip: true
  },

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
