// War Ships Game Module
// Self-contained feature module with its own components, composables, and data

// Main game component - use this to embed the game
export { default as WarShips } from './WarShips.vue'

// Composables - for advanced usage or extending the game
export { useGameState } from './composables/useGameState'
export { usePlayerData } from './composables/usePlayerData'
export { useControls } from './composables/useControls'
export { useAudio } from './composables/useAudio'
export { useThreeScene } from './composables/useThreeScene'
export { useGameLoop } from './composables/useGameLoop'

// Data - ships and quests definitions
export { shipTemplates } from './data/ships'
export { questTemplates } from './data/quests'
