<script setup>
// Embed the game2 version directly for exact match
</script>

<template>
  <div class="warships-wrapper">
    <iframe 
      src="/game2/index.html" 
      class="game-iframe"
      frameborder="0"
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
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: calc(100vh - 150px);
  background: #0a1628;
  padding: 20px;
}

.game-iframe {
  width: 90%;
  height: 85vh;
  max-width: 1400px;
  border: none;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}
</style>
