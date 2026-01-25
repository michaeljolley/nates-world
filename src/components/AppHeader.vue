<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ThemeToggle.vue'
import AuthButton from '@/components/AuthButton.vue'

const route = useRoute()
const auth = useAuthStore()

const isWipRoute = computed(() => route.name === 'warships')
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <router-link to="/" class="logo">
        <span class="bolt-icon">⚡</span>
        <span class="logo-text">Natorade</span>
      </router-link>
      <span v-if="isWipRoute" class="wip-header-badge">🚧 WIP: Still vibing on this one</span>
    </div>
    <div class="header-right">
      <AuthButton />
      <ThemeToggle />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: rgba(10, 10, 10, 0.95);
  border-bottom: 1px solid var(--border-color, rgba(0, 200, 83, 0.3));
  backdrop-filter: blur(10px);
  z-index: 1000;
}

[data-theme="light"] .app-header {
  background: rgba(245, 245, 245, 0.95);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 2px;
  text-decoration: none;
}

.bolt-icon {
  font-size: 1.8rem;
  color: var(--accent-orange, #ff6600);
  filter: drop-shadow(0 0 15px rgba(255, 102, 0, 0.8)) drop-shadow(0 0 30px rgba(255, 102, 0, 0.5));
  flex-shrink: 0;
  display: inline-block;
  margin-right: -8px;
  margin-top: -10px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

.logo-text {
  font-family: 'Orbitron', 'Arial Black', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  background: linear-gradient(135deg, var(--accent-orange, #ff6600) 0%, var(--accent-green, #00c853) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  display: inline-block;
  filter: drop-shadow(0 0 20px rgba(255, 102, 0, 0.6)) drop-shadow(0 0 40px rgba(0, 200, 83, 0.4));
}

[data-theme="light"] .logo-text {
  background: linear-gradient(135deg, var(--accent-orange, #e65c00) 0%, var(--accent-green, #00a844) 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

@media (max-width: 600px) {
  .logo-text {
    display: none;
  }
  
  .app-header {
    padding: 0 10px;
  }

  .wip-header-badge {
    font-size: 0.65rem;
    padding: 3px 8px;
  }
}

.wip-header-badge {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: #000;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'Segoe UI', Arial, sans-serif;
  padding: 4px 12px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  animation: pulse-wip 2s ease-in-out infinite;
}

@keyframes pulse-wip {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>
