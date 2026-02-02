// Enemy types that fight back against the player
export const enemies = [
  // Tier 1 - Basic
  { id: 'soldier', name: 'Soldier', hp: 30, damage: 5, speed: 1.5, range: 100, attackSpeed: 1, coins: 5, color: '#556B2F' },
  { id: 'police', name: 'Police', hp: 40, damage: 8, speed: 1.8, range: 120, attackSpeed: 0.8, coins: 8, color: '#000080' },
  
  // Tier 2 - Trained
  { id: 'swat', name: 'SWAT', hp: 60, damage: 12, speed: 2, range: 150, attackSpeed: 0.6, coins: 15, color: '#1C1C1C' },
  { id: 'marine', name: 'Marine', hp: 70, damage: 15, speed: 1.8, range: 140, attackSpeed: 0.7, coins: 18, color: '#228B22' },
  { id: 'navy', name: 'Navy Seal', hp: 80, damage: 18, speed: 2.2, range: 160, attackSpeed: 0.5, coins: 22, color: '#000033' },
  
  // Tier 3 - Air support
  { id: 'drone', name: 'Attack Drone', hp: 40, damage: 10, speed: 3, range: 200, attackSpeed: 0.4, coins: 20, color: '#808080' },
  { id: 'helicopter', name: 'Helicopter', hp: 150, damage: 25, speed: 2.5, range: 250, attackSpeed: 0.8, coins: 40, color: '#2F4F4F' },
  { id: 'airforce', name: 'Airforce Pilot', hp: 50, damage: 20, speed: 2, range: 180, attackSpeed: 0.6, coins: 25, color: '#4169E1' },
  
  // Tier 4 - Heavy
  { id: 'tank', name: 'Tank', hp: 300, damage: 40, speed: 1, range: 200, attackSpeed: 1.5, coins: 60, color: '#6B8E23' },
  { id: 'jet', name: 'Fighter Jet', hp: 100, damage: 50, speed: 5, range: 300, attackSpeed: 2, coins: 80, color: '#C0C0C0' },
  
  // Tier 5 - Advanced
  { id: 'mech', name: 'Battle Mech', hp: 400, damage: 35, speed: 1.5, range: 180, attackSpeed: 0.8, coins: 100, color: '#708090' },
  { id: 'robot', name: 'Combat Robot', hp: 250, damage: 30, speed: 2, range: 160, attackSpeed: 0.5, coins: 75, color: '#A9A9A9' },
  
  // Tier 6 - Elite
  { id: 'elite', name: 'Elite Soldier', hp: 150, damage: 40, speed: 2.5, range: 200, attackSpeed: 0.4, coins: 50, color: '#8B0000' },
  { id: 'ufo', name: 'Human UFO', hp: 200, damage: 45, speed: 3.5, range: 280, attackSpeed: 0.6, coins: 120, color: '#9400D3' },
  
  // Tier 7 - Boss units
  { id: 'superweapon', name: 'Superweapon', hp: 600, damage: 60, speed: 0.8, range: 350, attackSpeed: 2, coins: 200, color: '#FF4500' },
  { id: 'boss', name: 'Commander', hp: 1000, damage: 80, speed: 1.2, range: 250, attackSpeed: 1.5, coins: 500, color: '#FFD700' },
]

export function getEnemyById(id) {
  return enemies.find(e => e.id === id)
}

export function getEnemiesForRegion(enemyTypes) {
  return enemyTypes.map(id => getEnemyById(id)).filter(Boolean)
}
