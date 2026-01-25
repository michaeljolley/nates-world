<script setup>
// War Ships 3D game wrapper
// The game is complex (3500+ lines with Three.js) so we embed it in an iframe
// This allows us to keep the consistent header/footer while the game runs
</script>

<template>
  <div class="warships-wrapper">
    <div class="lightning-bg"></div>
    <div class="bolt bolt-1">⚡</div>
    <div class="bolt bolt-2">⚡</div>
    
    <iframe 
      src="/game2/index.html" 
      class="game-frame"
      title="War Ships 3D"
      allowfullscreen
    ></iframe>
  </div>
</template>

<style scoped>
.warships-wrapper {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: calc(100vh - 150px);
}

.lightning-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: 
    linear-gradient(135deg, transparent 40%, rgba(0, 212, 255, 0.03) 50%, transparent 60%),
    linear-gradient(-135deg, transparent 40%, rgba(0, 136, 170, 0.03) 50%, transparent 60%);
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
  color: #00d4ff;
}

.bolt-2 { 
  bottom: 10%; 
  right: 5%; 
  transform: rotate(15deg); 
  color: #0088aa;
}

.game-frame {
  flex: 1;
  width: 100%;
  border: none;
  background: #000;
  z-index: 1;
  min-height: calc(100vh - 150px);
}
</style>
