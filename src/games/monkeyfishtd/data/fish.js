// Fish enemy definitions for Monkey Fish TD
// Fish come in colors like balloons, each color has more health

export const fishTypes = {
  red: { id: 'red', name: 'Red Fish', health: 1, speed: 85, children: null, color: '#FF4444', reward: 1 },
  blue: { id: 'blue', name: 'Blue Fish', health: 1, speed: 100, children: ['red'], color: '#4444FF', reward: 2 },
  green: { id: 'green', name: 'Green Fish', health: 1, speed: 90, children: ['blue'], color: '#44FF44', reward: 3 },
  yellow: { id: 'yellow', name: 'Yellow Fish', health: 1, speed: 120, children: ['green'], color: '#FFFF44', reward: 4 },
  pink: { id: 'pink', name: 'Pink Fish', health: 1, speed: 140, children: ['yellow'], color: '#FF88CC', reward: 5 },
  black: { id: 'black', name: 'Black Fish', health: 1, speed: 90, children: ['pink', 'pink'], color: '#222222', reward: 11, immune: ['explosion'] },
  white: { id: 'white', name: 'White Fish', health: 1, speed: 100, children: ['pink', 'pink'], color: '#EEEEEE', reward: 11, immune: ['freeze'] },
  purple: { id: 'purple', name: 'Purple Fish', health: 1, speed: 135, children: ['pink', 'pink'], color: '#9944CC', reward: 11, immune: ['fire'] },
  lead: { id: 'lead', name: 'Lead Fish', health: 1, speed: 50, children: ['black', 'black'], color: '#555555', reward: 23, immune: ['sharp'], armor: true },
  zebra: { id: 'zebra', name: 'Zebra Fish', health: 1, speed: 90, children: ['black', 'white'], color: '#888888', stripe: true, reward: 23 },
  rainbow: { id: 'rainbow', name: 'Rainbow Fish', health: 1, speed: 110, children: ['zebra', 'zebra'], color: 'rainbow', reward: 47 },
  ceramic: { id: 'ceramic', name: 'Ceramic Fish', health: 10, speed: 115, children: ['rainbow', 'rainbow'], color: '#CC8844', reward: 104 },
  moab: { id: 'moab', name: 'M.O.A.B', health: 200, speed: 25, children: ['ceramic', 'ceramic', 'ceramic', 'ceramic'], color: '#4488FF', isBoss: true, reward: 381, size: 2 },
  bfb: { id: 'bfb', name: 'B.F.B', health: 700, speed: 18, children: ['moab', 'moab', 'moab', 'moab'], color: '#FF4444', isBoss: true, reward: 1525, size: 2.5 },
  zomg: { id: 'zomg', name: 'Z.O.M.G', health: 4000, speed: 10, children: ['bfb', 'bfb', 'bfb', 'bfb'], color: '#44BB44', isBoss: true, reward: 6101, size: 3 }
}

// Camo variants exist for most fish
export const camoTypes = ['blue', 'green', 'yellow', 'pink', 'black', 'white', 'purple', 'lead', 'zebra', 'rainbow', 'ceramic']

// Regrow variants
export const regrowTypes = ['blue', 'green', 'yellow', 'pink', 'black', 'white', 'purple', 'zebra', 'rainbow', 'ceramic']

// Fortified variants (double health)
export const fortifiedTypes = ['lead', 'ceramic', 'moab', 'bfb', 'zomg']

// Wave definitions - more structured like BTD
export const waves = [
  // Wave 1-10: Learning waves
  { fish: [{ type: 'red', count: 20, spacing: 600 }] },
  { fish: [{ type: 'red', count: 30, spacing: 400 }] },
  { fish: [{ type: 'red', count: 15, spacing: 500 }, { type: 'blue', count: 5, spacing: 800, delay: 3000 }] },
  { fish: [{ type: 'blue', count: 20, spacing: 500 }] },
  { fish: [{ type: 'blue', count: 25, spacing: 400 }, { type: 'red', count: 10, spacing: 300, delay: 2000 }] },
  { fish: [{ type: 'green', count: 15, spacing: 600 }] },
  { fish: [{ type: 'blue', count: 20, spacing: 400 }, { type: 'green', count: 10, spacing: 600, delay: 2500 }] },
  { fish: [{ type: 'green', count: 20, spacing: 500 }] },
  { fish: [{ type: 'yellow', count: 10, spacing: 400 }] },
  { fish: [{ type: 'green', count: 30, spacing: 300 }, { type: 'yellow', count: 10, spacing: 500, delay: 3000 }] },
  
  // Wave 11-20: Intermediate
  { fish: [{ type: 'yellow', count: 20, spacing: 350 }] },
  { fish: [{ type: 'pink', count: 10, spacing: 400 }] },
  { fish: [{ type: 'yellow', count: 30, spacing: 250 }, { type: 'pink', count: 10, spacing: 400, delay: 2000 }] },
  { fish: [{ type: 'pink', count: 20, spacing: 300 }] },
  { fish: [{ type: 'pink', count: 30, spacing: 250 }] },
  { fish: [{ type: 'black', count: 6, spacing: 800 }] },
  { fish: [{ type: 'white', count: 6, spacing: 800 }] },
  { fish: [{ type: 'black', count: 8, spacing: 600 }, { type: 'white', count: 8, spacing: 600, delay: 2000 }] },
  { fish: [{ type: 'yellow', count: 40, spacing: 200, camo: true }] },
  { fish: [{ type: 'zebra', count: 6, spacing: 700 }] },
  
  // Wave 21-30: Challenge waves
  { fish: [{ type: 'purple', count: 10, spacing: 500 }] },
  { fish: [{ type: 'lead', count: 4, spacing: 1000 }] },
  { fish: [{ type: 'zebra', count: 10, spacing: 500 }, { type: 'lead', count: 4, spacing: 800, delay: 3000 }] },
  { fish: [{ type: 'pink', count: 50, spacing: 150, camo: true }] },
  { fish: [{ type: 'rainbow', count: 4, spacing: 800 }] },
  { fish: [{ type: 'zebra', count: 15, spacing: 400 }, { type: 'rainbow', count: 6, spacing: 700, delay: 2500 }] },
  { fish: [{ type: 'lead', count: 8, spacing: 600, camo: true }] },
  { fish: [{ type: 'rainbow', count: 10, spacing: 500 }] },
  { fish: [{ type: 'rainbow', count: 15, spacing: 400, regrow: true }] },
  { fish: [{ type: 'ceramic', count: 4, spacing: 1200 }] },
  
  // Wave 31-40: MOAB class
  { fish: [{ type: 'ceramic', count: 8, spacing: 800 }] },
  { fish: [{ type: 'ceramic', count: 10, spacing: 600, camo: true }] },
  { fish: [{ type: 'rainbow', count: 20, spacing: 300 }, { type: 'ceramic', count: 6, spacing: 700, delay: 3000 }] },
  { fish: [{ type: 'ceramic', count: 12, spacing: 500 }] },
  { fish: [{ type: 'ceramic', count: 8, spacing: 600, fortified: true }] },
  { fish: [{ type: 'ceramic', count: 15, spacing: 400 }, { type: 'ceramic', count: 10, spacing: 500, camo: true, delay: 4000 }] },
  { fish: [{ type: 'rainbow', count: 30, spacing: 200, regrow: true }] },
  { fish: [{ type: 'ceramic', count: 20, spacing: 350 }] },
  { fish: [{ type: 'ceramic', count: 12, spacing: 400, fortified: true, camo: true }] },
  { fish: [{ type: 'moab', count: 1, spacing: 0 }] },
  
  // Wave 41-50: Multiple MOABs
  { fish: [{ type: 'moab', count: 1, spacing: 0 }, { type: 'ceramic', count: 10, spacing: 400, delay: 5000 }] },
  { fish: [{ type: 'ceramic', count: 30, spacing: 250, camo: true }] },
  { fish: [{ type: 'moab', count: 2, spacing: 3000 }] },
  { fish: [{ type: 'ceramic', count: 20, spacing: 300, regrow: true, camo: true }] },
  { fish: [{ type: 'moab', count: 3, spacing: 2500 }] },
  { fish: [{ type: 'ceramic', count: 40, spacing: 180, fortified: true }] },
  { fish: [{ type: 'moab', count: 2, spacing: 2000, fortified: true }] },
  { fish: [{ type: 'moab', count: 4, spacing: 2000 }] },
  { fish: [{ type: 'moab', count: 3, spacing: 1500, fortified: true }] },
  { fish: [{ type: 'bfb', count: 1, spacing: 0 }] },
  
  // Wave 51-60: BFBs
  { fish: [{ type: 'bfb', count: 1, spacing: 0 }, { type: 'moab', count: 3, spacing: 2000, delay: 6000 }] },
  { fish: [{ type: 'moab', count: 6, spacing: 1500, camo: true }] },
  { fish: [{ type: 'bfb', count: 2, spacing: 4000 }] },
  { fish: [{ type: 'ceramic', count: 50, spacing: 150, fortified: true, regrow: true }] },
  { fish: [{ type: 'bfb', count: 2, spacing: 3000, fortified: true }] },
  { fish: [{ type: 'moab', count: 8, spacing: 1200 }, { type: 'bfb', count: 2, spacing: 3500, delay: 5000 }] },
  { fish: [{ type: 'bfb', count: 3, spacing: 3000 }] },
  { fish: [{ type: 'bfb', count: 2, spacing: 2500, fortified: true }, { type: 'moab', count: 6, spacing: 1500, camo: true, delay: 4000 }] },
  { fish: [{ type: 'bfb', count: 4, spacing: 2500 }] },
  { fish: [{ type: 'zomg', count: 1, spacing: 0 }] },
  
  // Wave 61+: ZOMGs (endless continues from here)
  { fish: [{ type: 'zomg', count: 1, spacing: 0 }, { type: 'bfb', count: 3, spacing: 3000, delay: 8000 }] },
  { fish: [{ type: 'bfb', count: 5, spacing: 2000, fortified: true }] },
  { fish: [{ type: 'zomg', count: 2, spacing: 6000 }] },
  { fish: [{ type: 'moab', count: 12, spacing: 1000, fortified: true, camo: true }] },
  { fish: [{ type: 'zomg', count: 1, spacing: 0, fortified: true }, { type: 'bfb', count: 4, spacing: 2500, delay: 10000 }] }
]

// Get total health of a fish type (including children)
export function getTotalHealth(fishType, fortified = false) {
  const fish = fishTypes[fishType]
  if (!fish) return 0
  
  let health = fish.health * (fortified ? 2 : 1)
  if (fish.children) {
    for (const childType of fish.children) {
      health += getTotalHealth(childType, false) // Children aren't fortified
    }
  }
  return health
}
