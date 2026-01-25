<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  wip: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <a class="game-card" :class="{ 'is-wip': wip }">
    <span v-if="wip" class="wip-badge">🚧 WIP</span>
    <div class="game-icon">{{ icon }}</div>
    <h2 class="game-title">{{ title }}</h2>
    <p class="game-description">{{ description }}</p>
    <span class="play-btn">Play Now</span>
  </a>
</template>

<style scoped>
.game-card {
  position: relative;
  background: var(--bg-card, linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%));
  border: none;
  border-radius: 0;
  padding: 30px;
  width: 300px;
  text-align: center;
  box-shadow: 
    0 0 20px rgba(0, 200, 83, 0.2),
    inset 0 0 30px rgba(0, 200, 83, 0.05);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  transform: skewX(-2deg);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
  z-index: 1;
  overflow: hidden;
  cursor: pointer;
}

.game-card::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: var(--bg-card, linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%));
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 13px), calc(100% - 13px) 100%, 0 100%);
  z-index: -1;
}

.game-card::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(#00c853, #69f0ae, #b9f6ca, #69f0ae, #00c853);
  transform: translate(-50%, -50%);
  z-index: -2;
  animation: spin-border 3s linear infinite;
}

@keyframes spin-border {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.game-card:hover::before {
  background: conic-gradient(#ff6600, #ff8533, #ffaa66, #ff8533, #ff6600);
}

.game-card:hover {
  filter: drop-shadow(0 0 25px rgba(255, 102, 0, 0.7)) drop-shadow(0 0 50px rgba(255, 102, 0, 0.5));
  transform: skewX(-2deg) translateY(-5px);
}

.game-icon {
  font-size: 4rem;
  margin-bottom: 15px;
}

.game-title {
  font-size: 1.8rem;
  color: var(--accent-green, #00c853);
  margin-bottom: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Orbitron', 'Arial Black', sans-serif;
}

.game-card:hover .game-title {
  color: var(--accent-orange, #ff6600);
}

.game-description {
  color: var(--text-secondary, #aaa);
  font-size: 0.95rem;
  line-height: 1.6;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-weight: 400;
}

.play-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 14px 35px;
  background: linear-gradient(135deg, #00c853 0%, #00e676 100%);
  color: #000;
  font-weight: 700;
  font-size: 1.4rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Segoe UI', Arial, sans-serif;
  transition: all 0.3s ease;
  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
}

.game-card:hover .play-btn {
  background: linear-gradient(135deg, #ff6600 0%, #ff8533 100%);
  transform: scale(1.05);
  color: #fff;
}

.wip-badge {
  position: absolute;
  top: 10px;
  right: -25px;
  background: linear-gradient(135deg, #666 0%, #888 100%);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: 'Segoe UI', Arial, sans-serif;
  padding: 4px 30px;
  transform: rotate(35deg);
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 10px rgba(100, 100, 100, 0.5);
  z-index: 10;
}

.game-card.is-wip::before {
  background: conic-gradient(#666, #888, #aaa, #888, #666);
}
</style>
