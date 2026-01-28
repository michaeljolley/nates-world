// Weed (enemy) definitions for Plantation tower defense
// Speed values: pixels per second

export const weeds = {
  dandelionpuff: {
    id: 'dandelionpuff',
    name: 'Dandelion Puff',
    emoji: '🌾',
    health: 20,
    speed: 60,
    reward: 10,
    description: 'Basic fast enemy',
    special: null
  },
  crabgrass: {
    id: 'crabgrass',
    name: 'Crabgrass',
    emoji: '🌿',
    health: 40,
    speed: 40,
    reward: 15,
    description: 'Standard enemy',
    special: null
  },
  thistle: {
    id: 'thistle',
    name: 'Thistle',
    emoji: '🥀',
    health: 60,
    speed: 30,
    reward: 20,
    description: 'Armored - takes 50% less damage',
    special: 'armor',
    armorReduction: 0.5
  },
  ivyrunner: {
    id: 'ivyrunner',
    name: 'Ivy Runner',
    emoji: '🍃',
    health: 30,
    speed: 80,
    reward: 12,
    description: 'Very fast enemy',
    special: null
  },
  kudzu: {
    id: 'kudzu',
    name: 'Kudzu',
    emoji: '☘️',
    health: 100,
    speed: 40,
    reward: 30,
    description: 'Tanky enemy',
    special: null
  },
  poisonoak: {
    id: 'poisonoak',
    name: 'Poison Oak',
    emoji: '🍂',
    health: 50,
    speed: 40,
    reward: 25,
    description: 'Damages plants when passing',
    special: 'toxic',
    toxicDamage: 10
  },
  bindweed: {
    id: 'bindweed',
    name: 'Bindweed',
    emoji: '🪻',
    health: 35,
    speed: 60,
    reward: 18,
    description: 'Wraps and disables plants',
    special: 'disable',
    disableDuration: 3000
  },
  gianthogweed: {
    id: 'gianthogweed',
    name: 'Giant Hogweed',
    emoji: '🪴',
    health: 200,
    speed: 30,
    reward: 50,
    description: 'Mini-boss enemy',
    special: null
  },
  tumbleweed: {
    id: 'tumbleweed',
    name: 'Tumble Weed',
    emoji: '🍁',
    health: 25,
    speed: 80,
    reward: 8,
    description: 'Bounces past first plant',
    special: 'dodge',
    dodgeCount: 1
  },
  creepingcharlie: {
    id: 'creepingcharlie',
    name: 'Creeping Charlie',
    emoji: '🌱',
    health: 45,
    speed: 40,
    reward: 20,
    description: 'Spawns 2 small weeds on death',
    special: 'split',
    splitCount: 2,
    splitType: 'dandelionpuff'
  },
  bramble: {
    id: 'bramble',
    name: 'Bramble',
    emoji: '🥬',
    health: 80,
    speed: 30,
    reward: 28,
    description: 'Reflects 20% damage back',
    special: 'reflect',
    reflectAmount: 0.2
  },
  mossblob: {
    id: 'mossblob',
    name: 'Moss Blob',
    emoji: '🧩',
    health: 150,
    speed: 20,
    reward: 40,
    description: 'Regenerates health over time',
    special: 'regen',
    regenAmount: 5,
    regenInterval: 1000
  },
  sporecloud: {
    id: 'sporecloud',
    name: 'Spore Cloud',
    emoji: '🍄',
    health: 30,
    speed: 40,
    reward: 15,
    description: 'Flying - avoids ground plants',
    special: 'flying'
  },
  rootburrower: {
    id: 'rootburrower',
    name: 'Root Burrower',
    emoji: '🫚',
    health: 60,
    speed: 40,
    reward: 25,
    description: 'Invisible until close to plants',
    special: 'burrow',
    revealDistance: 60
  },
  nettleswarm: {
    id: 'nettleswarm',
    name: 'Nettle Swarm',
    emoji: '🌾',
    health: 10,
    speed: 60,
    reward: 5,
    description: 'Tiny but comes in swarms',
    special: null,
    swarmSize: 5
  },
  stranglerfig: {
    id: 'stranglerfig',
    name: 'Strangler Fig',
    emoji: '🎋',
    health: 120,
    speed: 30,
    reward: 35,
    description: 'Steals seeds when hitting plants',
    special: 'steal',
    stealAmount: 10
  },
  corpseflower: {
    id: 'corpseflower',
    name: 'Corpse Flower',
    emoji: '🪷',
    health: 250,
    speed: 20,
    reward: 60,
    description: 'Heals nearby weeds',
    special: 'heal',
    healAmount: 10,
    healRadius: 80,
    healInterval: 2000
  },
  devilssnare: {
    id: 'devilssnare',
    name: "Devil's Snare",
    emoji: '🌵',
    health: 180,
    speed: 40,
    reward: 45,
    description: 'Pulls plants out of ground',
    special: 'pull',
    pullRange: 60
  },
  blight: {
    id: 'blight',
    name: 'Blight',
    emoji: '🥦',
    health: 100,
    speed: 60,
    reward: 40,
    description: 'Leaves poison trail',
    special: 'trail',
    trailDamage: 3,
    trailDuration: 5000
  },
  elderweed: {
    id: 'elderweed',
    name: 'Elder Weed',
    emoji: '🌳',
    health: 500,
    speed: 25,
    reward: 100,
    description: 'BOSS - Summons smaller weeds',
    special: 'summon',
    summonType: 'crabgrass',
    summonInterval: 5000,
    isBoss: true
  }
}

// Wave definitions - which weeds spawn in each wave
export const waves = [
  // Wave 1-5: Easy
  { weeds: ['dandelionpuff', 'dandelionpuff', 'dandelionpuff'] },
  { weeds: ['dandelionpuff', 'dandelionpuff', 'crabgrass', 'dandelionpuff'] },
  { weeds: ['crabgrass', 'crabgrass', 'dandelionpuff', 'dandelionpuff', 'crabgrass'] },
  { weeds: ['ivyrunner', 'ivyrunner', 'crabgrass', 'crabgrass'] },
  { weeds: ['thistle', 'crabgrass', 'crabgrass', 'dandelionpuff', 'dandelionpuff', 'thistle'] },
  
  // Wave 6-10: Medium
  { weeds: ['kudzu', 'crabgrass', 'crabgrass', 'ivyrunner', 'ivyrunner'] },
  { weeds: ['bindweed', 'crabgrass', 'thistle', 'bindweed', 'crabgrass'] },
  { weeds: ['tumbleweed', 'tumbleweed', 'tumbleweed', 'kudzu', 'crabgrass'] },
  { weeds: ['poisonoak', 'crabgrass', 'thistle', 'poisonoak', 'ivyrunner'] },
  { weeds: ['gianthogweed', 'crabgrass', 'crabgrass', 'crabgrass'] },
  
  // Wave 11-15: Hard
  { weeds: ['creepingcharlie', 'creepingcharlie', 'kudzu', 'thistle', 'thistle'] },
  { weeds: ['mossblob', 'bramble', 'crabgrass', 'crabgrass', 'bramble'] },
  { weeds: ['sporecloud', 'sporecloud', 'sporecloud', 'kudzu', 'kudzu'] },
  { weeds: ['rootburrower', 'rootburrower', 'gianthogweed', 'crabgrass', 'crabgrass'] },
  { weeds: ['stranglerfig', 'kudzu', 'kudzu', 'thistle', 'thistle', 'stranglerfig'] },
  
  // Wave 16-20: Very Hard
  { weeds: ['corpseflower', 'kudzu', 'kudzu', 'mossblob', 'bramble', 'bramble'] },
  { weeds: ['devilssnare', 'devilssnare', 'gianthogweed', 'sporecloud', 'sporecloud'] },
  { weeds: ['blight', 'blight', 'kudzu', 'kudzu', 'stranglerfig', 'corpseflower'] },
  { weeds: ['gianthogweed', 'gianthogweed', 'devilssnare', 'blight', 'mossblob'] },
  { weeds: ['elderweed', 'kudzu', 'kudzu', 'thistle', 'thistle'] },
  
  // Wave 21-25: Nightmare
  { weeds: ['elderweed', 'gianthogweed', 'gianthogweed', 'corpseflower'] },
  { weeds: ['blight', 'blight', 'blight', 'devilssnare', 'devilssnare', 'mossblob'] },
  { weeds: ['stranglerfig', 'stranglerfig', 'corpseflower', 'corpseflower', 'kudzu', 'kudzu'] },
  { weeds: ['gianthogweed', 'gianthogweed', 'gianthogweed', 'elderweed'] },
  { weeds: ['elderweed', 'elderweed', 'blight', 'blight'] },
  
  // Wave 26-30: Insane
  { weeds: ['corpseflower', 'corpseflower', 'devilssnare', 'devilssnare', 'stranglerfig', 'stranglerfig'] },
  { weeds: ['elderweed', 'gianthogweed', 'gianthogweed', 'mossblob', 'mossblob', 'blight'] },
  { weeds: ['blight', 'blight', 'blight', 'blight', 'corpseflower', 'corpseflower'] },
  { weeds: ['devilssnare', 'devilssnare', 'devilssnare', 'elderweed', 'elderweed'] },
  { weeds: ['elderweed', 'elderweed', 'corpseflower', 'corpseflower'] },
  
  // Wave 31-35: Apocalypse
  { weeds: ['elderweed', 'elderweed', 'elderweed', 'gianthogweed', 'gianthogweed'] },
  { weeds: ['corpseflower', 'corpseflower', 'corpseflower', 'blight', 'blight', 'blight', 'blight'] },
  { weeds: ['devilssnare', 'devilssnare', 'devilssnare', 'devilssnare', 'stranglerfig', 'stranglerfig'] },
  { weeds: ['elderweed', 'elderweed', 'mossblob', 'mossblob', 'mossblob', 'corpseflower'] },
  { weeds: ['elderweed', 'elderweed', 'elderweed', 'blight', 'blight'] },
  
  // Wave 36-40: Final Stand
  { weeds: ['elderweed', 'elderweed', 'corpseflower', 'corpseflower', 'devilssnare', 'devilssnare'] },
  { weeds: ['gianthogweed', 'gianthogweed', 'gianthogweed', 'gianthogweed', 'elderweed', 'elderweed'] },
  { weeds: ['blight', 'blight', 'blight', 'blight', 'blight', 'elderweed', 'elderweed'] },
  { weeds: ['corpseflower', 'corpseflower', 'corpseflower', 'elderweed', 'elderweed', 'elderweed'] },
  { weeds: ['elderweed', 'elderweed', 'elderweed', 'elderweed', 'elderweed'] }
]
