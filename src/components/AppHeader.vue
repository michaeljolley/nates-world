<script setup>
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ThemeToggle.vue'
import AuthButton from '@/components/AuthButton.vue'

defineEmits(['back'])

const auth = useAuthStore()
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <a href="#" class="logo" @click.prevent="$emit('back')">
        <span class="bolt-icon">⚡</span>
        <span class="logo-text">Natorade</span>
      </a>
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
  gap: 5px;
  text-decoration: none;
}

.bolt-icon {
  font-size: 1.8rem;
  color: var(--accent-orange, #ff6600);
  filter: drop-shadow(0 0 10px rgba(255, 102, 0, 0.6));
}

.logo-text {
  font-family: 'Impact', 'Arial Black', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  background: linear-gradient(180deg, #00c853 0%, #00e676 50%, #69f0ae 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

[data-theme="light"] .logo-text {
  background: linear-gradient(180deg, #00a844 0%, #00c853 50%, #00e676 100%);
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
}
</style>
