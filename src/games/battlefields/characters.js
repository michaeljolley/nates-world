// 25 Unique Fighters for Battlefields
// Each has different stats and a special move

export const characters = [
  {
    id: 'blaze',
    name: 'Blaze',
    color: '#ff4444',
    skinTone: '#e0a070',
    stats: { health: 100, speed: 5, damage: 12, defense: 5 },
    special: { name: 'Fireball', damage: 30, cooldown: 3000, type: 'projectile', color: '#ff6600' }
  },
  {
    id: 'frost',
    name: 'Frost',
    color: '#44ccff',
    skinTone: '#f0d0c0',
    stats: { health: 90, speed: 6, damage: 10, defense: 6 },
    special: { name: 'Ice Blast', damage: 25, cooldown: 2500, type: 'projectile', color: '#88eeff' }
  },
  {
    id: 'thunder',
    name: 'Thunder',
    color: '#ffff00',
    skinTone: '#c08050',
    stats: { health: 95, speed: 7, damage: 11, defense: 4 },
    special: { name: 'Lightning Strike', damage: 35, cooldown: 4000, type: 'instant', color: '#ffff88' }
  },
  {
    id: 'shadow',
    name: 'Shadow',
    color: '#333333',
    skinTone: '#d0b090',
    stats: { health: 85, speed: 8, damage: 13, defense: 3 },
    special: { name: 'Dark Slash', damage: 28, cooldown: 2000, type: 'melee', color: '#666666' }
  },
  {
    id: 'titan',
    name: 'Titan',
    color: '#8b4513',
    skinTone: '#e8c0a0',
    stats: { health: 130, speed: 3, damage: 15, defense: 8 },
    special: { name: 'Ground Pound', damage: 40, cooldown: 5000, type: 'aoe', color: '#aa6633' }
  },
  {
    id: 'swift',
    name: 'Swift',
    color: '#00ff88',
    skinTone: '#f0d8c0',
    stats: { health: 75, speed: 10, damage: 8, defense: 4 },
    special: { name: 'Dash Strike', damage: 20, cooldown: 1500, type: 'dash', color: '#44ffaa' }
  },
  {
    id: 'venom',
    name: 'Venom',
    color: '#88ff00',
    skinTone: '#d0a880',
    stats: { health: 90, speed: 5, damage: 10, defense: 5 },
    special: { name: 'Poison Spit', damage: 22, cooldown: 2500, type: 'projectile', color: '#aaff44' }
  },
  {
    id: 'iron',
    name: 'Iron',
    color: '#888888',
    skinTone: '#e0b890',
    stats: { health: 120, speed: 4, damage: 12, defense: 10 },
    special: { name: 'Steel Shield', damage: 0, cooldown: 4000, type: 'block', color: '#aaaaaa' }
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    color: '#ff6600',
    skinTone: '#f0c8a0',
    stats: { health: 85, speed: 6, damage: 14, defense: 4 },
    special: { name: 'Flame Burst', damage: 32, cooldown: 3500, type: 'aoe', color: '#ff8833' }
  },
  {
    id: 'storm',
    name: 'Storm',
    color: '#6666ff',
    skinTone: '#d8b8a0',
    stats: { health: 95, speed: 6, damage: 11, defense: 5 },
    special: { name: 'Cyclone', damage: 26, cooldown: 3000, type: 'aoe', color: '#8888ff' }
  },
  {
    id: 'wolf',
    name: 'Wolf',
    color: '#666688',
    skinTone: '#e0c0a0',
    stats: { health: 90, speed: 7, damage: 12, defense: 5 },
    special: { name: 'Feral Lunge', damage: 24, cooldown: 2000, type: 'dash', color: '#8888aa' }
  },
  {
    id: 'cobra',
    name: 'Cobra',
    color: '#448844',
    skinTone: '#c8a878',
    stats: { health: 80, speed: 8, damage: 11, defense: 4 },
    special: { name: 'Viper Strike', damage: 28, cooldown: 2200, type: 'melee', color: '#66aa66' }
  },
  {
    id: 'boulder',
    name: 'Boulder',
    color: '#aa8866',
    skinTone: '#d0a080',
    stats: { health: 140, speed: 2, damage: 14, defense: 12 },
    special: { name: 'Rock Throw', damage: 35, cooldown: 4500, type: 'projectile', color: '#ccaa88' }
  },
  {
    id: 'ninja',
    name: 'Ninja',
    color: '#222244',
    skinTone: '#f0d0b0',
    stats: { health: 70, speed: 9, damage: 10, defense: 3 },
    special: { name: 'Shuriken', damage: 18, cooldown: 1200, type: 'projectile', color: '#444466' }
  },
  {
    id: 'samurai',
    name: 'Samurai',
    color: '#cc0000',
    skinTone: '#e8c8a8',
    stats: { health: 100, speed: 5, damage: 14, defense: 6 },
    special: { name: 'Katana Slash', damage: 30, cooldown: 2800, type: 'melee', color: '#ff2222' }
  },
  {
    id: 'monk',
    name: 'Monk',
    color: '#ff9900',
    skinTone: '#c09060',
    stats: { health: 95, speed: 6, damage: 10, defense: 7 },
    special: { name: 'Chi Blast', damage: 24, cooldown: 2500, type: 'projectile', color: '#ffbb44' }
  },
  {
    id: 'reaper',
    name: 'Reaper',
    color: '#440044',
    skinTone: '#e0d0c0',
    stats: { health: 80, speed: 7, damage: 15, defense: 3 },
    special: { name: 'Soul Drain', damage: 28, cooldown: 3500, type: 'melee', color: '#880088' }
  },
  {
    id: 'angel',
    name: 'Angel',
    color: '#ffffff',
    skinTone: '#ffe8d8',
    stats: { health: 90, speed: 6, damage: 10, defense: 8 },
    special: { name: 'Holy Light', damage: 22, cooldown: 3000, type: 'aoe', color: '#ffffcc' }
  },
  {
    id: 'demon',
    name: 'Demon',
    color: '#880000',
    skinTone: '#ff6666',
    stats: { health: 100, speed: 5, damage: 14, defense: 5 },
    special: { name: 'Hellfire', damage: 34, cooldown: 4000, type: 'aoe', color: '#cc0000' }
  },
  {
    id: 'cyber',
    name: 'Cyber',
    color: '#00ffff',
    skinTone: '#88cccc',
    stats: { health: 95, speed: 6, damage: 12, defense: 6 },
    special: { name: 'Laser Beam', damage: 26, cooldown: 2800, type: 'projectile', color: '#44ffff' }
  },
  {
    id: 'golem',
    name: 'Golem',
    color: '#668866',
    skinTone: '#88aa88',
    stats: { health: 150, speed: 2, damage: 13, defense: 15 },
    special: { name: 'Stone Slam', damage: 38, cooldown: 5000, type: 'melee', color: '#88aa88' }
  },
  {
    id: 'pirate',
    name: 'Pirate',
    color: '#884400',
    skinTone: '#d8a878',
    stats: { health: 100, speed: 5, damage: 12, defense: 5 },
    special: { name: 'Cannon Shot', damage: 30, cooldown: 3500, type: 'projectile', color: '#aa6622' }
  },
  {
    id: 'knight',
    name: 'Knight',
    color: '#4444aa',
    skinTone: '#e8c8b0',
    stats: { health: 110, speed: 4, damage: 12, defense: 9 },
    special: { name: 'Shield Bash', damage: 22, cooldown: 2500, type: 'melee', color: '#6666cc' }
  },
  {
    id: 'mage',
    name: 'Mage',
    color: '#aa44aa',
    skinTone: '#f0d8c8',
    stats: { health: 75, speed: 5, damage: 9, defense: 4 },
    special: { name: 'Arcane Bolt', damage: 35, cooldown: 3000, type: 'projectile', color: '#cc66cc' }
  },
  {
    id: 'beast',
    name: 'Beast',
    color: '#885522',
    skinTone: '#aa7744',
    stats: { health: 115, speed: 6, damage: 13, defense: 6 },
    special: { name: 'Wild Fury', damage: 32, cooldown: 3500, type: 'melee', color: '#aa7744' }
  }
]

export function getRandomCharacter(excludeId = null) {
  const available = excludeId 
    ? characters.filter(c => c.id !== excludeId)
    : characters
  return available[Math.floor(Math.random() * available.length)]
}

export function getCharacterById(id) {
  return characters.find(c => c.id === id)
}
