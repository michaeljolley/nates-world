<script setup>
defineProps({
  href: {
    type: String,
    required: true
  },
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
  }
})
</script>

<template>
  <a :href="href" class="game-card">
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: conic-gradient(from var(--angle, 0deg), #00c853, #69f0ae, #00e676, #00c853);
  z-index: -2;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
  animation: rotate-border 3s linear infinite;
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes rotate-border {
  from { --angle: 0deg; }
  to { --angle: 360deg; }
}

.game-card:hover::before {
  background: conic-gradient(from var(--angle, 0deg), #ff6600, #ff8533, #ffaa66, #ff6600);
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
  font-family: 'Impact', 'Arial Black', sans-serif;
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
</style>
