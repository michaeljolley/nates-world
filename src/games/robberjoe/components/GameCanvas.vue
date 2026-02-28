<script setup>
import { computed, ref } from 'vue'
import { TILE_SIZE, TILE_TYPES } from '../data/levels'

const props = defineProps({
  level: { type: Object, required: true },
  player: { type: Object, required: true },
  guards: { type: Array, required: true },
  cameras: { type: Array, default: () => [] },
  noiseEvents: { type: Array, default: () => [] },
  collectedLoot: { type: Set, required: true },
  visionRange: { type: Number, default: 4.5 },
  visionAngle: { type: Number, default: Math.PI / 3 }
})

const canvasWidth = computed(() => props.level.grid[0].length * TILE_SIZE)
const canvasHeight = computed(() => props.level.grid.length * TILE_SIZE)

// Animation frame for subtle animations
const animFrame = ref(0)
setInterval(() => animFrame.value = (animFrame.value + 1) % 60, 50)

function getTileColor(tile, row, col) {
  switch (tile) {
    case TILE_TYPES.WALL: return '#1a1a2e'
    case TILE_TYPES.FLOOR: return '#2d3436'
    case TILE_TYPES.PLAYER_SPAWN: return '#2d3436'
    case TILE_TYPES.GUARD_SPAWN: return '#2d3436'
    case TILE_TYPES.LOOT: return '#2d3436'
    case TILE_TYPES.EXIT: return '#1e4d2b'
    case TILE_TYPES.SHADOW: return '#1a1a24'
    case TILE_TYPES.FURNITURE: return '#4a4a5c'
    case TILE_TYPES.CAMERA: return '#2d3436'
    default: return '#2d3436'
  }
}

function getTilePattern(tile) {
  if (tile === TILE_TYPES.SHADOW) return 'url(#shadowPattern)'
  return null
}

function getVisionPath(guard) {
  const range = props.visionRange * TILE_SIZE
  const angle = props.visionAngle
  
  const centerX = guard.x + TILE_SIZE / 2
  const centerY = guard.y + TILE_SIZE / 2
  
  let baseAngle = 0
  switch (guard.direction) {
    case 'up': baseAngle = -Math.PI / 2; break
    case 'down': baseAngle = Math.PI / 2; break
    case 'left': baseAngle = Math.PI; break
    case 'right': baseAngle = 0; break
  }
  
  const x1 = centerX + Math.cos(baseAngle - angle) * range
  const y1 = centerY + Math.sin(baseAngle - angle) * range
  const x2 = centerX + Math.cos(baseAngle + angle) * range
  const y2 = centerY + Math.sin(baseAngle + angle) * range
  
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${range} ${range} 0 0 1 ${x2} ${y2} Z`
}

function getCameraVisionPath(camera) {
  const range = 5 * TILE_SIZE
  const angle = camera.sweepAngle * 0.7
  
  const centerX = camera.x + TILE_SIZE / 2
  const centerY = camera.y + TILE_SIZE / 2
  
  let baseAngle = 0
  switch (camera.baseDirection) {
    case 'up': baseAngle = -Math.PI / 2; break
    case 'down': baseAngle = Math.PI / 2; break
    case 'left': baseAngle = Math.PI; break
    case 'right': baseAngle = 0; break
  }
  
  const currentAngle = baseAngle + camera.sweepProgress * camera.sweepAngle
  
  const x1 = centerX + Math.cos(currentAngle - angle) * range
  const y1 = centerY + Math.sin(currentAngle - angle) * range
  const x2 = centerX + Math.cos(currentAngle + angle) * range
  const y2 = centerY + Math.sin(currentAngle + angle) * range
  
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${range} ${range} 0 0 1 ${x2} ${y2} Z`
}

function getGuardColor(guard) {
  switch (guard.alertLevel) {
    case 2: return '#e74c3c'
    case 1: return '#f39c12'
    default: return '#6c5ce7'
  }
}

function getVisionColor(guard) {
  switch (guard.alertLevel) {
    case 2: return 'rgba(231, 76, 60, 0.35)'
    case 1: return 'rgba(243, 156, 18, 0.3)'
    default: return 'rgba(108, 92, 231, 0.2)'
  }
}

function getCameraVisionColor(camera) {
  if (camera.alertLevel > 0) return 'rgba(231, 76, 60, 0.4)'
  return 'rgba(52, 152, 219, 0.15)'
}

const playerColor = computed(() => {
  if (props.player.isHiding) return '#2d3436'
  if (props.player.isSneaking) return '#1e3a5f'
  return '#2d8cf0'
})

const playerOpacity = computed(() => {
  if (props.player.isHiding) return 0.5
  return 1
})
</script>

<template>
  <svg 
    :width="canvasWidth" 
    :height="canvasHeight"
    :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`"
    class="game-canvas"
  >
    <!-- Definitions for patterns and gradients -->
    <defs>
      <pattern id="shadowPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#1a1a24"/>
        <circle cx="4" cy="4" r="1" fill="#15151f" opacity="0.5"/>
      </pattern>
      
      <radialGradient id="lootGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f1c40f" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#f39c12" stop-opacity="0"/>
      </radialGradient>

      <radialGradient id="exitGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#27ae60" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#27ae60" stop-opacity="0"/>
      </radialGradient>

      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Floor tiles -->
    <g class="tiles">
      <template v-for="(row, rowIndex) in level.grid" :key="'row-' + rowIndex">
        <rect
          v-for="(tile, colIndex) in row"
          :key="'tile-' + rowIndex + '-' + colIndex"
          :x="colIndex * TILE_SIZE"
          :y="rowIndex * TILE_SIZE"
          :width="TILE_SIZE"
          :height="TILE_SIZE"
          :fill="getTilePattern(tile) || getTileColor(tile, rowIndex, colIndex)"
          stroke="#14141f"
          stroke-width="1"
        />
      </template>
    </g>

    <!-- Shadow overlay for hiding spots -->
    <g class="shadows">
      <template v-for="(row, rowIndex) in level.grid" :key="'shadow-row-' + rowIndex">
        <g v-for="(tile, colIndex) in row" :key="'shadow-' + rowIndex + '-' + colIndex">
          <rect
            v-if="tile === TILE_TYPES.SHADOW"
            :x="colIndex * TILE_SIZE + 2"
            :y="rowIndex * TILE_SIZE + 2"
            :width="TILE_SIZE - 4"
            :height="TILE_SIZE - 4"
            fill="none"
            stroke="#0a0a12"
            stroke-width="2"
            stroke-dasharray="4,4"
            rx="4"
            opacity="0.6"
          />
        </g>
      </template>
    </g>

    <!-- Furniture -->
    <g class="furniture">
      <template v-for="(row, rowIndex) in level.grid" :key="'furn-row-' + rowIndex">
        <g v-for="(tile, colIndex) in row" :key="'furn-' + rowIndex + '-' + colIndex">
          <rect
            v-if="tile === TILE_TYPES.FURNITURE"
            :x="colIndex * TILE_SIZE + 4"
            :y="rowIndex * TILE_SIZE + 4"
            :width="TILE_SIZE - 8"
            :height="TILE_SIZE - 8"
            fill="#5c5c7a"
            stroke="#3d3d52"
            stroke-width="2"
            rx="3"
          />
        </g>
      </template>
    </g>

    <!-- Loot items -->
    <g class="loot">
      <template v-for="(row, rowIndex) in level.grid" :key="'loot-row-' + rowIndex">
        <g 
          v-for="(tile, colIndex) in row" 
          :key="'loot-' + rowIndex + '-' + colIndex"
          v-if="tile === TILE_TYPES.LOOT && !collectedLoot.has(`${colIndex},${rowIndex}`)"
        >
          <!-- Glow effect -->
          <circle
            :cx="colIndex * TILE_SIZE + TILE_SIZE / 2"
            :cy="rowIndex * TILE_SIZE + TILE_SIZE / 2"
            :r="TILE_SIZE / 2"
            fill="url(#lootGlow)"
            class="loot-glow"
          />
          <!-- Money bag -->
          <ellipse
            :cx="colIndex * TILE_SIZE + TILE_SIZE / 2"
            :cy="rowIndex * TILE_SIZE + TILE_SIZE / 2 + 2"
            :rx="TILE_SIZE / 4"
            :ry="TILE_SIZE / 3.5"
            fill="#d4a017"
            stroke="#8b6914"
            stroke-width="1"
          />
          <ellipse
            :cx="colIndex * TILE_SIZE + TILE_SIZE / 2"
            :cy="rowIndex * TILE_SIZE + TILE_SIZE / 2 - 4"
            :rx="TILE_SIZE / 6"
            :ry="TILE_SIZE / 10"
            fill="#b8860b"
          />
          <text
            :x="colIndex * TILE_SIZE + TILE_SIZE / 2"
            :y="rowIndex * TILE_SIZE + TILE_SIZE / 2 + 6"
            text-anchor="middle"
            fill="#1a1a1a"
            font-size="12"
            font-weight="bold"
          >$</text>
        </g>
      </template>
    </g>

    <!-- Exit -->
    <g class="exit">
      <template v-for="(row, rowIndex) in level.grid" :key="'exit-row-' + rowIndex">
        <g 
          v-for="(tile, colIndex) in row" 
          :key="'exit-' + rowIndex + '-' + colIndex"
          v-if="tile === TILE_TYPES.EXIT"
        >
          <!-- Exit glow -->
          <circle
            :cx="colIndex * TILE_SIZE + TILE_SIZE / 2"
            :cy="rowIndex * TILE_SIZE + TILE_SIZE / 2"
            :r="TILE_SIZE * 0.7"
            fill="url(#exitGlow)"
            class="exit-glow"
          />
          <!-- Door frame -->
          <rect
            :x="colIndex * TILE_SIZE + 3"
            :y="rowIndex * TILE_SIZE + 2"
            :width="TILE_SIZE - 6"
            :height="TILE_SIZE - 4"
            fill="#1e4d2b"
            stroke="#27ae60"
            stroke-width="2"
            rx="3"
          />
          <!-- Door handle -->
          <circle
            :cx="colIndex * TILE_SIZE + TILE_SIZE - 10"
            :cy="rowIndex * TILE_SIZE + TILE_SIZE / 2"
            :r="3"
            fill="#f1c40f"
          />
          <text
            :x="colIndex * TILE_SIZE + TILE_SIZE / 2 - 2"
            :y="rowIndex * TILE_SIZE + TILE_SIZE / 2 + 4"
            text-anchor="middle"
            fill="#2ecc71"
            font-size="10"
            font-weight="bold"
          >EXIT</text>
        </g>
      </template>
    </g>

    <!-- Camera vision cones -->
    <g class="camera-vision">
      <path
        v-for="camera in cameras"
        :key="'cam-vision-' + camera.id"
        :d="getCameraVisionPath(camera)"
        :fill="getCameraVisionColor(camera)"
        class="camera-cone"
      />
    </g>

    <!-- Guard vision cones -->
    <g class="guard-vision">
      <path
        v-for="guard in guards"
        :key="'vision-' + guard.id"
        :d="getVisionPath(guard)"
        :fill="getVisionColor(guard)"
      />
    </g>

    <!-- Cameras -->
    <g class="cameras">
      <g 
        v-for="camera in cameras" 
        :key="'camera-' + camera.id"
        :transform="`translate(${camera.x}, ${camera.y})`"
      >
        <!-- Camera body -->
        <rect
          :x="TILE_SIZE * 0.25"
          :y="TILE_SIZE * 0.25"
          :width="TILE_SIZE * 0.5"
          :height="TILE_SIZE * 0.4"
          :fill="camera.alertLevel > 0 ? '#e74c3c' : '#34495e'"
          rx="3"
        />
        <!-- Camera lens -->
        <circle
          :cx="TILE_SIZE / 2"
          :cy="TILE_SIZE * 0.55"
          :r="TILE_SIZE * 0.12"
          fill="#2c3e50"
          stroke="#1a252f"
          stroke-width="2"
        />
        <!-- Red light when alert -->
        <circle
          v-if="camera.alertLevel > 0"
          :cx="TILE_SIZE / 2"
          :cy="TILE_SIZE * 0.55"
          :r="TILE_SIZE * 0.06"
          fill="#e74c3c"
          filter="url(#glow)"
          class="camera-alert"
        />
      </g>
    </g>

    <!-- Noise indicators -->
    <g class="noise-indicators">
      <circle
        v-for="(noise, index) in noiseEvents"
        :key="'noise-' + index"
        :cx="noise.x"
        :cy="noise.y"
        :r="noise.radius * TILE_SIZE * (1 - noise.timer)"
        fill="none"
        stroke="rgba(241, 196, 15, 0.5)"
        stroke-width="2"
        class="noise-wave"
      />
    </g>

    <!-- Guards -->
    <g class="guards">
      <g 
        v-for="guard in guards" 
        :key="'guard-' + guard.id"
        :transform="`translate(${guard.x}, ${guard.y})`"
      >
        <!-- Shadow -->
        <ellipse
          :cx="TILE_SIZE / 2"
          :cy="TILE_SIZE - 4"
          :rx="TILE_SIZE * 0.35"
          :ry="TILE_SIZE * 0.1"
          fill="rgba(0,0,0,0.3)"
        />
        <!-- Body -->
        <rect
          :x="TILE_SIZE * 0.2"
          :y="TILE_SIZE * 0.15"
          :width="TILE_SIZE * 0.6"
          :height="TILE_SIZE * 0.7"
          :fill="getGuardColor(guard)"
          rx="8"
        />
        <!-- Hat -->
        <rect
          :x="TILE_SIZE * 0.15"
          :y="TILE_SIZE * 0.08"
          :width="TILE_SIZE * 0.7"
          :height="TILE_SIZE * 0.18"
          fill="#1a1a2e"
          rx="3"
        />
        <!-- Hat badge -->
        <rect
          :x="TILE_SIZE * 0.4"
          :y="TILE_SIZE * 0.1"
          :width="TILE_SIZE * 0.2"
          :height="TILE_SIZE * 0.08"
          :fill="guard.alertLevel > 0 ? '#e74c3c' : '#f1c40f'"
        />
        <!-- Face -->
        <ellipse
          :cx="TILE_SIZE / 2"
          :cy="TILE_SIZE * 0.4"
          :rx="TILE_SIZE * 0.18"
          :ry="TILE_SIZE * 0.15"
          fill="#ffeaa7"
        />
        <!-- Eyes based on direction -->
        <circle
          :cx="guard.direction === 'left' ? TILE_SIZE * 0.38 : guard.direction === 'right' ? TILE_SIZE * 0.48 : TILE_SIZE * 0.42"
          :cy="guard.direction === 'up' ? TILE_SIZE * 0.36 : guard.direction === 'down' ? TILE_SIZE * 0.42 : TILE_SIZE * 0.38"
          :r="3"
          fill="#2c3e50"
        />
        <circle
          :cx="guard.direction === 'left' ? TILE_SIZE * 0.52 : guard.direction === 'right' ? TILE_SIZE * 0.62 : TILE_SIZE * 0.58"
          :cy="guard.direction === 'up' ? TILE_SIZE * 0.36 : guard.direction === 'down' ? TILE_SIZE * 0.42 : TILE_SIZE * 0.38"
          :r="3"
          fill="#2c3e50"
        />
        <!-- Alert indicator -->
        <g v-if="guard.alertLevel === 1">
          <text
            :x="TILE_SIZE / 2"
            :y="-2"
            text-anchor="middle"
            fill="#f39c12"
            font-size="14"
            font-weight="bold"
          >?</text>
        </g>
        <g v-if="guard.alertLevel === 2">
          <text
            :x="TILE_SIZE / 2"
            :y="-2"
            text-anchor="middle"
            fill="#e74c3c"
            font-size="14"
            font-weight="bold"
          >!</text>
        </g>
      </g>
    </g>

    <!-- Player (Joe) -->
    <g 
      class="player"
      :transform="`translate(${player.x}, ${player.y})`"
      :opacity="playerOpacity"
    >
      <!-- Shadow -->
      <ellipse
        :cx="TILE_SIZE / 2"
        :cy="TILE_SIZE - 4"
        :rx="TILE_SIZE * 0.3"
        :ry="TILE_SIZE * 0.1"
        fill="rgba(0,0,0,0.3)"
      />
      <!-- Body -->
      <rect
        :x="TILE_SIZE * 0.2"
        :y="TILE_SIZE * 0.15"
        :width="TILE_SIZE * 0.6"
        :height="TILE_SIZE * 0.7"
        :fill="playerColor"
        rx="8"
      />
      <!-- Head -->
      <ellipse
        :cx="TILE_SIZE / 2"
        :cy="TILE_SIZE * 0.25"
        :rx="TILE_SIZE * 0.22"
        :ry="TILE_SIZE * 0.18"
        :fill="playerColor"
      />
      <!-- Mask/Bandana -->
      <rect
        :x="TILE_SIZE * 0.22"
        :y="TILE_SIZE * 0.2"
        :width="TILE_SIZE * 0.56"
        :height="TILE_SIZE * 0.18"
        fill="#1a1a2e"
        rx="4"
      />
      <!-- Eyes (through mask) -->
      <ellipse
        :cx="TILE_SIZE * 0.38"
        :cy="TILE_SIZE * 0.28"
        :rx="4"
        :ry="5"
        fill="#fff"
      />
      <ellipse
        :cx="TILE_SIZE * 0.62"
        :cy="TILE_SIZE * 0.28"
        :rx="4"
        :ry="5"
        fill="#fff"
      />
      <circle
        :cx="TILE_SIZE * 0.38"
        :cy="TILE_SIZE * 0.28"
        :r="2"
        fill="#2c3e50"
      />
      <circle
        :cx="TILE_SIZE * 0.62"
        :cy="TILE_SIZE * 0.28"
        :r="2"
        fill="#2c3e50"
      />
      <!-- Loot bag on back when has loot -->
      <g v-if="collectedLoot.size > 0">
        <ellipse
          :cx="TILE_SIZE * 0.75"
          :cy="TILE_SIZE * 0.55"
          :rx="TILE_SIZE * 0.18"
          :ry="TILE_SIZE * 0.22"
          fill="#8b6914"
          stroke="#5c4a0f"
          stroke-width="1"
        />
        <text
          :x="TILE_SIZE * 0.75"
          :y="TILE_SIZE * 0.6"
          text-anchor="middle"
          fill="#f1c40f"
          font-size="10"
          font-weight="bold"
        >$</text>
      </g>
      <!-- Sneaking indicator -->
      <g v-if="player.isSneaking" class="sneak-indicator">
        <circle
          v-for="i in 3"
          :key="'sneak-' + i"
          :cx="TILE_SIZE / 2 + (i - 2) * 6"
          :cy="TILE_SIZE + 8"
          :r="2"
          fill="#3498db"
          :opacity="0.3 + i * 0.2"
        />
      </g>
      <!-- Hiding indicator -->
      <g v-if="player.isHiding" class="hide-indicator">
        <text
          :x="TILE_SIZE / 2"
          :y="-4"
          text-anchor="middle"
          fill="#2ecc71"
          font-size="10"
        >HIDDEN</text>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.game-canvas {
  display: block;
  background: #0a0a12;
  border-radius: 8px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.8);
}

.loot-glow {
  animation: pulse-loot 1.5s ease-in-out infinite;
}

.exit-glow {
  animation: pulse-exit 2s ease-in-out infinite;
}

@keyframes pulse-loot {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

@keyframes pulse-exit {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.camera-alert {
  animation: blink 0.5s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.noise-wave {
  animation: expand 0.5s ease-out forwards;
}

@keyframes expand {
  0% { opacity: 0.8; }
  100% { opacity: 0; }
}

.player {
  transition: opacity 0.2s ease;
}

.sneak-indicator circle {
  animation: sneak-dots 1s ease-in-out infinite;
}

@keyframes sneak-dots {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

.guard-vision path,
.camera-vision path {
  transition: fill 0.3s ease;
}
</style>
