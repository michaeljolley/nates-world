// Paper Airplane Game Module
// Fly a paper airplane through the school and out the window!

// Main game component
export { default as PaperAirplane } from './PaperAirplane.vue'

// Composables
export { useGameState } from './composables/useGameState'
export { useAirplanePhysics } from './composables/useAirplanePhysics'
export { useCollision } from './composables/useCollision'

// Data
export { levels } from './data/levels'
