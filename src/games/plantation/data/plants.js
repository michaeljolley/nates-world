// Plant definitions for Plantation tower defense
// Range values: 0=touch, 50=short, 100=medium, 150=long, 200=very long, 999=infinite
// Speed values (ms between attacks): 500=very fast, 750=fast, 1000=medium, 1500=slow, 2500=very slow
// DPS = damage / (attackSpeed/1000) - balanced so expensive plants have better DPS

export const plants = {
  // TIER 1: Cheap (25-75 cost) - Low DPS, basic utility
  peashooter: {
    id: 'peashooter',
    name: 'Peashooter',
    emoji: '🌱',
    cost: 50,
    damage: 8,
    range: 80,
    attackSpeed: 1000,
    description: 'Basic shooter plant',
    special: null
  },
  sunflower: {
    id: 'sunflower',
    name: 'Sunflower',
    emoji: '🌻',
    cost: 75,
    damage: 5,
    range: 80,
    attackSpeed: 1000,
    description: 'Weak but cheerful shooter',
    special: null
  },
  tulip: {
    id: 'tulip',
    name: 'Tulip Turret',
    emoji: '🌷',
    cost: 65,
    damage: 6,
    range: 70,
    attackSpeed: 600,
    description: 'Fast but weak shooter',
    special: null
  },
  thornybush: {
    id: 'thornybush',
    name: 'Thorny Bush',
    emoji: '🌿',
    cost: 40,
    damage: 3,
    range: 0,
    attackSpeed: 0,
    description: 'Damages weeds walking past',
    special: 'thorns',
    thornDamage: 3
  },
  mushroom: {
    id: 'mushroom',
    name: 'Mushroom',
    emoji: '🍄',
    cost: 75,
    damage: 10,
    range: 50,
    attackSpeed: 800,
    description: 'Cheap short-range attacker',
    special: null
  },

  // TIER 2: Medium (100-175 cost) - Decent DPS, some utility
  cactus: {
    id: 'cactus',
    name: 'Cactus',
    emoji: '🌵',
    cost: 125,
    damage: 20,
    range: 120,
    attackSpeed: 1200,
    description: 'Pierces multiple enemies',
    special: 'pierce',
    pierceCount: 3
  },
  mint: {
    id: 'mint',
    name: 'Mint',
    emoji: '🌿',
    cost: 100,
    damage: 8,
    range: 90,
    attackSpeed: 900,
    description: 'Poisons enemies (damage over time)',
    special: 'poison',
    poisonDamage: 4,
    poisonDuration: 3000
  },
  frostrose: {
    id: 'frostrose',
    name: 'Frost Rose',
    emoji: '🥀',
    cost: 150,
    damage: 10,
    range: 100,
    attackSpeed: 800,
    description: 'Slows enemies by 40%',
    special: 'slow',
    slowAmount: 0.4,
    slowDuration: 2500
  },
  dandelion: {
    id: 'dandelion',
    name: 'Dandelion',
    emoji: '🌼',
    cost: 125,
    damage: 4,
    range: 999,
    attackSpeed: 1200,
    description: 'Hits all enemies in range',
    special: 'hitAll'
  },
  blueberrybush: {
    id: 'blueberrybush',
    name: 'Blueberry Bush',
    emoji: '🫐',
    cost: 150,
    damage: 12,
    range: 100,
    attackSpeed: 1000,
    description: 'Triple shot burst',
    special: 'multishot',
    shotCount: 3
  },
  pumpkinguard: {
    id: 'pumpkinguard',
    name: 'Pumpkin Guard',
    emoji: '🎃',
    cost: 125,
    damage: 0,
    range: 0,
    attackSpeed: 0,
    description: 'Shield that protects another plant',
    special: 'shield',
    shieldHealth: 300
  },

  // TIER 3: Expensive (175-275 cost) - Good DPS, strong abilities
  venusflytrap: {
    id: 'venusflytrap',
    name: 'Venus Flytrap',
    emoji: '🪴',
    cost: 200,
    damage: 45,
    range: 60,
    attackSpeed: 900,
    description: 'High single-target damage',
    special: null
  },
  chilipepper: {
    id: 'chilipepper',
    name: 'Chili Pepper',
    emoji: '🌶️',
    cost: 250,
    damage: 35,
    range: 60,
    attackSpeed: 700,
    description: 'Area splash damage',
    special: 'splash',
    splashRadius: 50
  },
  electricfern: {
    id: 'electricfern',
    name: 'Electric Fern',
    emoji: '⚡',
    cost: 225,
    damage: 25,
    range: 100,
    attackSpeed: 650,
    description: 'Chains lightning to 4 enemies',
    special: 'chain',
    chainCount: 4,
    chainRange: 60
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    emoji: '💜',
    cost: 200,
    damage: 0,
    range: 120,
    attackSpeed: 1500,
    description: 'Confuses weeds (random movement)',
    special: 'confuse',
    confuseDuration: 3000
  },
  snapdragon: {
    id: 'snapdragon',
    name: 'Snapdragon',
    emoji: '🐉',
    cost: 275,
    damage: 40,
    range: 70,
    attackSpeed: 600,
    description: 'Fire cone attack, burns enemies',
    special: 'burn',
    burnDamage: 8,
    burnDuration: 3000,
    coneAngle: 60
  },
  rose: {
    id: 'rose',
    name: 'Thorned Rose',
    emoji: '🌹',
    cost: 200,
    damage: 22,
    range: 90,
    attackSpeed: 750,
    description: 'Causes bleeding damage over time',
    special: 'bleed',
    bleedDamage: 12,
    bleedDuration: 4000
  },
  acorn: {
    id: 'acorn',
    name: 'Acorn Artillery',
    emoji: '🌰',
    cost: 250,
    damage: 55,
    range: 180,
    attackSpeed: 1500,
    description: 'Lobs acorns over obstacles',
    special: 'lob'
  },
  clover: {
    id: 'clover',
    name: 'Lucky Clover',
    emoji: '🍀',
    cost: 225,
    damage: 18,
    range: 100,
    attackSpeed: 800,
    description: '30% chance for double seeds on kill',
    special: 'luck',
    luckChance: 0.30
  },
  cherry: {
    id: 'cherry',
    name: 'Cherry Bomb',
    emoji: '🍒',
    cost: 175,
    damage: 300,
    range: 80,
    attackSpeed: 0,
    description: 'Explodes once dealing massive damage',
    special: 'explode',
    splashRadius: 100
  },

  // TIER 4: Premium (300-500 cost) - High DPS, powerful abilities
  bamboocannon: {
    id: 'bamboocannon',
    name: 'Bamboo Cannon',
    emoji: '🎋',
    cost: 350,
    damage: 120,
    range: 250,
    attackSpeed: 1800,
    description: 'Long-range sniper, massive damage',
    special: null
  },
  coconut: {
    id: 'coconut',
    name: 'Coconut Cannon',
    emoji: '🥥',
    cost: 325,
    damage: 80,
    range: 140,
    attackSpeed: 1200,
    description: 'Launches explosive coconuts',
    special: 'splash',
    splashRadius: 60
  },
  carnivorouslily: {
    id: 'carnivorouslily',
    name: 'Carnivorous Lily',
    emoji: '🪷',
    cost: 400,
    damage: 150,
    range: 70,
    attackSpeed: 2000,
    description: 'Instant kills weeds under 80 HP',
    special: 'execute',
    executeThreshold: 80
  },
  oaksapling: {
    id: 'oaksapling',
    name: 'Oak Sapling',
    emoji: '🌳',
    cost: 450,
    damage: 35,
    range: 100,
    attackSpeed: 800,
    description: 'Blocks path, extremely tanky',
    special: 'block',
    health: 800
  },
  rafflesia: {
    id: 'rafflesia',
    name: 'Rafflesia',
    emoji: '🌺',
    cost: 500,
    damage: 0,
    range: 150,
    attackSpeed: 8000,
    description: 'Stun bomb every 8 seconds',
    special: 'stun',
    stunDuration: 4000
  },

  // TIER 5: Ultimate (750+ cost) - Game-changing power
  worldtree: {
    id: 'worldtree',
    name: 'World Tree',
    emoji: '🌲',
    cost: 1000,
    damage: 60,
    range: 180,
    attackSpeed: 700,
    description: 'Buffs nearby plants +75% damage',
    special: 'buff',
    buffRadius: 150,
    buffAmount: 0.75
  }
}

// Ordered list for UI (sorted by cost tier)
export const plantOrder = [
  // Tier 1: Cheap (40-75)
  'thornybush', 'peashooter', 'sunflower', 'tulip', 'mushroom',
  // Tier 2: Medium (100-150)
  'mint', 'cactus', 'pumpkinguard', 'dandelion', 'frostrose', 'blueberrybush',
  // Tier 3: Expensive (175-275)
  'cherry', 'lavender', 'venusflytrap', 'rose', 'electricfern', 'clover', 'chilipepper', 'acorn', 'snapdragon',
  // Tier 4: Premium (300-500)
  'coconut', 'bamboocannon', 'carnivorouslily', 'oaksapling', 'rafflesia',
  // Tier 5: Ultimate (1000)
  'worldtree'
]
