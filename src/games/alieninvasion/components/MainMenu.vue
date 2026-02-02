<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['play', 'back'])
</script>

<template>
  <div class="main-menu">
    <div class="stars"></div>
    <div class="ufo">🛸</div>
    
    <div class="menu-content">
      <h1 class="title">
        <span class="alien-emoji">👽</span>
        ALIEN INVASION
        <span class="alien-emoji">👽</span>
      </h1>
      <p class="subtitle">Take Over The World!</p>
      
      <div class="menu-buttons">
        <button class="menu-btn play-btn" @click="emit('play')">
          🚀 START INVASION
        </button>
        <button class="menu-btn back-btn" @click="emit('back')">
          ← Back to Games
        </button>
      </div>
      
      <div class="instructions">
        <h3>How to Play</h3>
        <ul>
          <li>🎮 Use WASD or Arrow Keys to move</li>
          <li>💥 Press SPACE or Click to attack</li>
          <li>🏢 Destroy buildings to earn coins</li>
          <li>👽 Buy and upgrade aliens</li>
          <li>🌍 Conquer all regions!</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-menu {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0a0015 0%, #1a0030 50%, #0a0020 100%);
  overflow: hidden;
}

.stars {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, white, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, white, transparent),
    radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent),
    radial-gradient(1px 1px at 230px 80px, white, transparent),
    radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 350px 200px, white, transparent),
    radial-gradient(2px 2px at 420px 50px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 500px 180px, white, transparent),
    radial-gradient(2px 2px at 580px 100px, rgba(255,255,255,0.9), transparent);
  background-size: 600px 250px;
  animation: twinkle 4s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.ufo {
  position: absolute;
  font-size: 4rem;
  top: 10%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateX(-200px) translateY(0); }
  50% { transform: translateX(200px) translateY(-20px); }
}

.menu-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
}

.title {
  font-size: 3.5rem;
  color: #00ff00;
  text-shadow: 
    0 0 10px #00ff00,
    0 0 20px #00ff00,
    0 0 40px #00aa00;
  margin-bottom: 0.5rem;
  letter-spacing: 4px;
}

.alien-emoji {
  display: inline-block;
  animation: bounce 1s ease-in-out infinite;
}

.alien-emoji:last-child {
  animation-delay: 0.5s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.subtitle {
  font-size: 1.5rem;
  color: #88ffaa;
  margin-bottom: 2rem;
  letter-spacing: 8px;
  text-transform: uppercase;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}

.menu-btn {
  padding: 1rem 2.5rem;
  font-size: 1.3rem;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 280px;
}

.play-btn {
  background: linear-gradient(135deg, #00ff00 0%, #00aa00 100%);
  color: #000;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
}

.play-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.8);
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #aaa;
  border: 2px solid #555;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.instructions {
  background: rgba(0, 255, 0, 0.1);
  border: 2px solid rgba(0, 255, 0, 0.3);
  border-radius: 15px;
  padding: 1.5rem 2rem;
  max-width: 400px;
  margin: 0 auto;
}

.instructions h3 {
  color: #00ff00;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.instructions ul {
  list-style: none;
  padding: 0;
  text-align: left;
}

.instructions li {
  color: #aaffaa;
  margin: 0.5rem 0;
  font-size: 1rem;
}
</style>
