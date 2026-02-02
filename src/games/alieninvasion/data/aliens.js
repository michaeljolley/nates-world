// 50 unique aliens with base stats, costs, and visual data
export const aliens = [
  // Tier 1 - Starter aliens (cheap, basic)
  { id: 'alien_001', name: 'Zyx', baseAttack: 10, baseDefense: 5, baseSpeed: 3, baseHP: 100, cost: 0, color: '#00ff00', sprite: 'blob', tier: 1 },
  { id: 'alien_002', name: 'Blorp', baseAttack: 12, baseDefense: 4, baseSpeed: 3.5, baseHP: 90, cost: 200, color: '#00ffaa', sprite: 'blob', tier: 1 },
  { id: 'alien_003', name: 'Glim', baseAttack: 8, baseDefense: 7, baseSpeed: 2.5, baseHP: 120, cost: 250, color: '#aaffaa', sprite: 'round', tier: 1 },
  { id: 'alien_004', name: 'Skree', baseAttack: 15, baseDefense: 3, baseSpeed: 4, baseHP: 70, cost: 300, color: '#ffff00', sprite: 'spiky', tier: 1 },
  { id: 'alien_005', name: 'Morp', baseAttack: 9, baseDefense: 6, baseSpeed: 3, baseHP: 110, cost: 280, color: '#88ff88', sprite: 'blob', tier: 1 },
  
  // Tier 2 - Early game
  { id: 'alien_006', name: 'Vexar', baseAttack: 18, baseDefense: 8, baseSpeed: 3.5, baseHP: 130, cost: 500, color: '#ff6600', sprite: 'angular', tier: 2 },
  { id: 'alien_007', name: 'Krix', baseAttack: 22, baseDefense: 5, baseSpeed: 4.5, baseHP: 100, cost: 550, color: '#ff3300', sprite: 'spiky', tier: 2 },
  { id: 'alien_008', name: 'Thulm', baseAttack: 14, baseDefense: 12, baseSpeed: 2.5, baseHP: 160, cost: 600, color: '#8888ff', sprite: 'round', tier: 2 },
  { id: 'alien_009', name: 'Zixel', baseAttack: 20, baseDefense: 7, baseSpeed: 4, baseHP: 120, cost: 580, color: '#ff00ff', sprite: 'angular', tier: 2 },
  { id: 'alien_010', name: 'Prax', baseAttack: 16, baseDefense: 10, baseSpeed: 3, baseHP: 140, cost: 620, color: '#00ffff', sprite: 'blob', tier: 2 },
  
  // Tier 3 - Mid game
  { id: 'alien_011', name: 'Drexel', baseAttack: 28, baseDefense: 10, baseSpeed: 4, baseHP: 150, cost: 900, color: '#ff4444', sprite: 'angular', tier: 3 },
  { id: 'alien_012', name: 'Glutch', baseAttack: 20, baseDefense: 15, baseSpeed: 3, baseHP: 200, cost: 950, color: '#44ff44', sprite: 'round', tier: 3 },
  { id: 'alien_013', name: 'Nyx', baseAttack: 35, baseDefense: 6, baseSpeed: 5, baseHP: 110, cost: 1000, color: '#aa00ff', sprite: 'spiky', tier: 3 },
  { id: 'alien_014', name: 'Orbus', baseAttack: 24, baseDefense: 12, baseSpeed: 3.5, baseHP: 170, cost: 980, color: '#ffaa00', sprite: 'round', tier: 3 },
  { id: 'alien_015', name: 'Scrix', baseAttack: 30, baseDefense: 8, baseSpeed: 4.5, baseHP: 130, cost: 1050, color: '#ff0066', sprite: 'spiky', tier: 3 },
  { id: 'alien_016', name: 'Threx', baseAttack: 26, baseDefense: 14, baseSpeed: 3, baseHP: 180, cost: 1100, color: '#6600ff', sprite: 'angular', tier: 3 },
  { id: 'alien_017', name: 'Vorn', baseAttack: 22, baseDefense: 18, baseSpeed: 2.5, baseHP: 220, cost: 1150, color: '#0066ff', sprite: 'round', tier: 3 },
  { id: 'alien_018', name: 'Wrix', baseAttack: 32, baseDefense: 9, baseSpeed: 4, baseHP: 140, cost: 1080, color: '#ff6699', sprite: 'spiky', tier: 3 },
  { id: 'alien_019', name: 'Xarn', baseAttack: 28, baseDefense: 11, baseSpeed: 3.5, baseHP: 160, cost: 1120, color: '#99ff00', sprite: 'angular', tier: 3 },
  { id: 'alien_020', name: 'Yex', baseAttack: 25, baseDefense: 13, baseSpeed: 3.5, baseHP: 175, cost: 1080, color: '#00ff99', sprite: 'blob', tier: 3 },
  
  // Tier 4 - Late-mid game
  { id: 'alien_021', name: 'Zargon', baseAttack: 40, baseDefense: 15, baseSpeed: 4, baseHP: 200, cost: 1600, color: '#ff2222', sprite: 'angular', tier: 4 },
  { id: 'alien_022', name: 'Blithrax', baseAttack: 35, baseDefense: 20, baseSpeed: 3.5, baseHP: 240, cost: 1700, color: '#22ff22', sprite: 'round', tier: 4 },
  { id: 'alien_023', name: 'Cruxel', baseAttack: 45, baseDefense: 12, baseSpeed: 5, baseHP: 170, cost: 1750, color: '#ff00aa', sprite: 'spiky', tier: 4 },
  { id: 'alien_024', name: 'Dravix', baseAttack: 38, baseDefense: 18, baseSpeed: 4, baseHP: 210, cost: 1680, color: '#aa00aa', sprite: 'angular', tier: 4 },
  { id: 'alien_025', name: 'Ethrix', baseAttack: 42, baseDefense: 14, baseSpeed: 4.5, baseHP: 190, cost: 1720, color: '#ffff44', sprite: 'spiky', tier: 4 },
  { id: 'alien_026', name: 'Fluxor', baseAttack: 36, baseDefense: 22, baseSpeed: 3, baseHP: 260, cost: 1800, color: '#44ffff', sprite: 'round', tier: 4 },
  { id: 'alien_027', name: 'Grexil', baseAttack: 50, baseDefense: 10, baseSpeed: 5.5, baseHP: 150, cost: 1850, color: '#ff8800', sprite: 'spiky', tier: 4 },
  { id: 'alien_028', name: 'Huxley', baseAttack: 40, baseDefense: 16, baseSpeed: 4, baseHP: 220, cost: 1780, color: '#8800ff', sprite: 'angular', tier: 4 },
  { id: 'alien_029', name: 'Ixion', baseAttack: 44, baseDefense: 15, baseSpeed: 4.5, baseHP: 200, cost: 1820, color: '#00ff66', sprite: 'blob', tier: 4 },
  { id: 'alien_030', name: 'Juxtar', baseAttack: 38, baseDefense: 19, baseSpeed: 3.5, baseHP: 230, cost: 1750, color: '#6666ff', sprite: 'round', tier: 4 },
  
  // Tier 5 - Late game
  { id: 'alien_031', name: 'Kronix', baseAttack: 55, baseDefense: 22, baseSpeed: 4.5, baseHP: 280, cost: 2500, color: '#ff1111', sprite: 'angular', tier: 5 },
  { id: 'alien_032', name: 'Luxar', baseAttack: 50, baseDefense: 28, baseSpeed: 4, baseHP: 320, cost: 2600, color: '#11ff11', sprite: 'round', tier: 5 },
  { id: 'alien_033', name: 'Mordex', baseAttack: 65, baseDefense: 18, baseSpeed: 5.5, baseHP: 240, cost: 2700, color: '#ff11ff', sprite: 'spiky', tier: 5 },
  { id: 'alien_034', name: 'Nexar', baseAttack: 58, baseDefense: 24, baseSpeed: 4.5, baseHP: 290, cost: 2650, color: '#ffaa44', sprite: 'angular', tier: 5 },
  { id: 'alien_035', name: 'Oxulon', baseAttack: 52, baseDefense: 30, baseSpeed: 3.5, baseHP: 350, cost: 2750, color: '#44aaff', sprite: 'round', tier: 5 },
  { id: 'alien_036', name: 'Praxus', baseAttack: 60, baseDefense: 20, baseSpeed: 5, baseHP: 260, cost: 2580, color: '#aa44ff', sprite: 'spiky', tier: 5 },
  { id: 'alien_037', name: 'Quorix', baseAttack: 55, baseDefense: 26, baseSpeed: 4, baseHP: 300, cost: 2680, color: '#ffff11', sprite: 'blob', tier: 5 },
  { id: 'alien_038', name: 'Raxion', baseAttack: 62, baseDefense: 21, baseSpeed: 5, baseHP: 275, cost: 2720, color: '#11ffff', sprite: 'angular', tier: 5 },
  { id: 'alien_039', name: 'Sythex', baseAttack: 58, baseDefense: 25, baseSpeed: 4.5, baseHP: 295, cost: 2650, color: '#ff4488', sprite: 'spiky', tier: 5 },
  { id: 'alien_040', name: 'Thraxus', baseAttack: 54, baseDefense: 28, baseSpeed: 4, baseHP: 310, cost: 2600, color: '#88ff44', sprite: 'round', tier: 5 },
  
  // Tier 6 - End game (legendary)
  { id: 'alien_041', name: 'Ultrax', baseAttack: 75, baseDefense: 35, baseSpeed: 5, baseHP: 400, cost: 4000, color: '#ff0000', sprite: 'legendary', tier: 6 },
  { id: 'alien_042', name: 'Vortexus', baseAttack: 80, baseDefense: 30, baseSpeed: 5.5, baseHP: 380, cost: 4200, color: '#00ff00', sprite: 'legendary', tier: 6 },
  { id: 'alien_043', name: 'Wraithon', baseAttack: 90, baseDefense: 25, baseSpeed: 6, baseHP: 350, cost: 4500, color: '#9900ff', sprite: 'legendary', tier: 6 },
  { id: 'alien_044', name: 'Xenarch', baseAttack: 70, baseDefense: 40, baseSpeed: 4.5, baseHP: 450, cost: 4300, color: '#ff9900', sprite: 'legendary', tier: 6 },
  { id: 'alien_045', name: 'Yggdrax', baseAttack: 85, baseDefense: 32, baseSpeed: 5, baseHP: 420, cost: 4600, color: '#0099ff', sprite: 'legendary', tier: 6 },
  { id: 'alien_046', name: 'Zephyron', baseAttack: 78, baseDefense: 35, baseSpeed: 5.5, baseHP: 400, cost: 4400, color: '#ff0099', sprite: 'legendary', tier: 6 },
  { id: 'alien_047', name: 'Apocalyx', baseAttack: 95, baseDefense: 28, baseSpeed: 5.5, baseHP: 370, cost: 5000, color: '#990000', sprite: 'legendary', tier: 6 },
  { id: 'alien_048', name: 'Behemox', baseAttack: 65, baseDefense: 50, baseSpeed: 3.5, baseHP: 550, cost: 5200, color: '#009900', sprite: 'legendary', tier: 6 },
  { id: 'alien_049', name: 'Cosmorn', baseAttack: 88, baseDefense: 38, baseSpeed: 5, baseHP: 430, cost: 5500, color: '#9900ff', sprite: 'legendary', tier: 6 },
  { id: 'alien_050', name: 'Devastar', baseAttack: 100, baseDefense: 40, baseSpeed: 5.5, baseHP: 500, cost: 6000, color: '#ffffff', sprite: 'legendary', tier: 6 },
]

export function getAlienById(id) {
  return aliens.find(a => a.id === id)
}

export function getAliensByTier(tier) {
  return aliens.filter(a => a.tier === tier)
}
