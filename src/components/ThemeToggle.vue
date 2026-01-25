<script setup>
import { ref, onMounted, watch } from 'vue'

const isDark = ref(true)

onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved ? saved === 'dark' : true
  applyTheme()
})

watch(isDark, () => {
  applyTheme()
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
})

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

function toggle() {
  isDark.value = !isDark.value
}
</script>

<template>
  <button class="theme-toggle" @click="toggle" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
    <span v-if="isDark">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid rgba(0, 200, 83, 0.3);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  border-color: #ff6600;
  transform: scale(1.1);
}

[data-theme="light"] .theme-toggle {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 150, 60, 0.3);
}
</style>
