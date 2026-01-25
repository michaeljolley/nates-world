<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const auth = useAuthStore()

onMounted(() => {
  auth.init()
})
</script>

<template>
  <AppHeader />

  <main class="main-content">
    <router-view />
  </main>

  <AppFooter />
</template>

<style>
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: rgba(26, 26, 26, 0.8);
  --bg-card: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
  --text-primary: #ffffff;
  --text-secondary: #bbb;
  --text-muted: #555;
  --accent-green: #00c853;
  --accent-orange: #ff6600;
  --border-color: rgba(0, 200, 83, 0.3);
}

[data-theme="light"] {
  --bg-primary: #f5f5f5;
  --bg-secondary: rgba(255, 255, 255, 0.9);
  --bg-card: linear-gradient(145deg, #ffffff 0%, #e8e8e8 100%);
  --text-primary: #1a1a1a;
  --text-secondary: #444;
  --text-muted: #888;
  --accent-green: #00a844;
  --accent-orange: #e65c00;
  --border-color: rgba(0, 150, 60, 0.4);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  background: var(--bg-primary);
  font-family: 'Orbitron', 'Arial Black', sans-serif;
  overflow-x: hidden;
  transition: background 0.3s ease;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px 40px;
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
  color: var(--accent-green);
}

[data-theme="light"] .bolt {
  opacity: 0.08;
}

.bolt-1 { top: 10%; left: 5%; transform: rotate(-15deg); }
.bolt-2 { bottom: 10%; right: 5%; transform: rotate(15deg); color: var(--accent-orange); }

.logo-container {
  position: relative;
  z-index: 1;
  margin-bottom: 10px;
  text-align: center;
}

h1 {
  font-size: 5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 4px;
  background: linear-gradient(180deg, #00c853 0%, #00e676 50%, #69f0ae 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(0, 200, 83, 0.5));
  transform: skewX(-5deg);
  display: inline-block;
}

[data-theme="light"] h1 {
  background: linear-gradient(180deg, #00a844 0%, #00c853 50%, #00e676 100%);
  -webkit-background-clip: text;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(0, 150, 60, 0.4));
}

.main-page-bolt-icon {
  display: inline-block;
  color: var(--accent-orange);
  filter: drop-shadow(0 0 20px rgba(255, 102, 0, 0.8));
  animation: pulse 1.5s ease-in-out infinite;
  -webkit-text-fill-color: var(--accent-orange);
  font-size: 1.5em;
  margin-right: -50px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

.subtitle {
  position: relative;
  z-index: 1;
  color: var(--text-primary);
  font-size: 1.4rem;
  margin-bottom: 50px;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
}

.games-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  max-width: 900px;
}

.about-section {
  position: relative;
  z-index: 1;
  max-width: 700px;
  margin-top: 60px;
  padding: 30px 40px;
  background: var(--bg-card, linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%));
  border: none;
  text-align: center;
  transform: skewX(-2deg);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
  box-shadow: 
    0 0 20px rgba(0, 200, 83, 0.2),
    inset 0 0 30px rgba(0, 200, 83, 0.05);
}

.about-section::before {
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

.about-section::after {
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

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes rotate-border {
  from { --angle: 0deg; }
  to { --angle: 360deg; }
}

.about-title {
  font-size: 1.8rem;
  color: var(--accent-green);
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 3px;
  background: none;
  -webkit-text-fill-color: var(--accent-green);
  filter: none;
  transform: none;
}

.about-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.8;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-weight: 400;
}

footer {
  position: relative;
  z-index: 1;
  margin-top: auto;
  padding-top: 50px;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-family: 'Segoe UI', Arial, sans-serif;
}

footer span {
  color: var(--accent-green);
}

.github-link {
  color: var(--text-muted);
  transition: color 0.3s ease;
  vertical-align: middle;
}

.github-link:hover {
  color: var(--accent-green);
}
</style>
