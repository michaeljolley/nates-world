<script setup>
const props = defineProps({
  coins: { type: Number, required: true },
  currentAlien: { type: Object, default: null },
  alienUpgrades: { type: Object, required: true }
})

const emit = defineEmits(['pause'])
</script>

<template>
  <div class="game-ui">
    <div class="top-bar">
      <button class="pause-btn" @click="emit('pause')">⏸️ Pause</button>
      
      <div class="coins-display">
        💰 {{ coins.toLocaleString() }}
      </div>
    </div>
    
    <div class="alien-status" v-if="currentAlien">
      <div class="alien-info">
        <span class="alien-icon" :style="{ color: currentAlien.color }">👽</span>
        <span class="alien-name">{{ currentAlien.name }}</span>
      </div>
    </div>
    
    <div class="controls-hint">
      <span>WASD / Arrows: Move</span>
      <span>SPACE / Click: Attack</span>
    </div>
  </div>
</template>

<style scoped>
.game-ui {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

.game-ui > * {
  pointer-events: auto;
}

.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%);
}

.pause-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid #fff;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.pause-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.coins-display {
  font-size: 1.5rem;
  color: #ffd700;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
}

.alien-status {
  position: absolute;
  bottom: 80px;
  left: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #00ff00;
  border-radius: 10px;
  padding: 0.5rem 1rem;
}

.alien-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alien-icon {
  font-size: 1.5rem;
}

.alien-name {
  color: #00ff00;
  font-weight: bold;
}

.controls-hint {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2rem;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  pointer-events: none;
}

.controls-hint span {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}
</style>
