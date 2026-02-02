// 25 world regions with increasing difficulty
export const regions = [
  // Starting regions (no requirements)
  { id: 'region_01', name: 'Peaceful Village', difficulty: 1, buildings: 10, enemyTypes: ['soldier'], coinReward: 150, unlockRequirement: null, x: 10, y: 60 },
  { id: 'region_02', name: 'Quiet Town', difficulty: 1, buildings: 12, enemyTypes: ['soldier'], coinReward: 180, unlockRequirement: null, x: 25, y: 55 },
  
  // Tier 2 regions
  { id: 'region_03', name: 'Suburban Area', difficulty: 2, buildings: 15, enemyTypes: ['soldier', 'police'], coinReward: 250, unlockRequirement: 'region_01', x: 15, y: 45 },
  { id: 'region_04', name: 'Small City', difficulty: 2, buildings: 18, enemyTypes: ['soldier', 'police'], coinReward: 280, unlockRequirement: 'region_02', x: 35, y: 50 },
  { id: 'region_05', name: 'Industrial Zone', difficulty: 2, buildings: 16, enemyTypes: ['soldier', 'police'], coinReward: 300, unlockRequirement: 'region_02', x: 40, y: 40 },
  
  // Tier 3 regions
  { id: 'region_06', name: 'Metro City', difficulty: 3, buildings: 22, enemyTypes: ['soldier', 'police', 'swat'], coinReward: 400, unlockRequirement: 'region_03', x: 20, y: 35 },
  { id: 'region_07', name: 'Port Harbor', difficulty: 3, buildings: 20, enemyTypes: ['soldier', 'police', 'navy'], coinReward: 420, unlockRequirement: 'region_04', x: 50, y: 55 },
  { id: 'region_08', name: 'Airport District', difficulty: 3, buildings: 18, enemyTypes: ['soldier', 'police', 'airforce'], coinReward: 450, unlockRequirement: 'region_05', x: 55, y: 35 },
  { id: 'region_09', name: 'Tech Campus', difficulty: 3, buildings: 20, enemyTypes: ['soldier', 'swat', 'drone'], coinReward: 480, unlockRequirement: 'region_05', x: 45, y: 30 },
  
  // Tier 4 regions
  { id: 'region_10', name: 'Downtown Core', difficulty: 4, buildings: 28, enemyTypes: ['swat', 'tank', 'helicopter'], coinReward: 600, unlockRequirement: 'region_06', x: 25, y: 25 },
  { id: 'region_11', name: 'Naval Base', difficulty: 4, buildings: 25, enemyTypes: ['navy', 'marine', 'helicopter'], coinReward: 650, unlockRequirement: 'region_07', x: 60, y: 50 },
  { id: 'region_12', name: 'Air Force Base', difficulty: 4, buildings: 24, enemyTypes: ['airforce', 'tank', 'jet'], coinReward: 680, unlockRequirement: 'region_08', x: 65, y: 30 },
  { id: 'region_13', name: 'Research Lab', difficulty: 4, buildings: 20, enemyTypes: ['swat', 'drone', 'mech'], coinReward: 700, unlockRequirement: 'region_09', x: 50, y: 20 },
  
  // Tier 5 regions
  { id: 'region_14', name: 'Financial District', difficulty: 5, buildings: 32, enemyTypes: ['swat', 'tank', 'mech'], coinReward: 850, unlockRequirement: 'region_10', x: 30, y: 18 },
  { id: 'region_15', name: 'Military Outpost', difficulty: 5, buildings: 28, enemyTypes: ['marine', 'tank', 'helicopter', 'jet'], coinReward: 900, unlockRequirement: 'region_11', x: 70, y: 45 },
  { id: 'region_16', name: 'Defense HQ', difficulty: 5, buildings: 30, enemyTypes: ['tank', 'mech', 'jet'], coinReward: 950, unlockRequirement: 'region_12', x: 75, y: 25 },
  { id: 'region_17', name: 'Robotics Factory', difficulty: 5, buildings: 26, enemyTypes: ['drone', 'mech', 'robot'], coinReward: 920, unlockRequirement: 'region_13', x: 55, y: 12 },
  
  // Tier 6 regions
  { id: 'region_18', name: 'Capital City', difficulty: 6, buildings: 40, enemyTypes: ['tank', 'mech', 'jet', 'elite'], coinReward: 1200, unlockRequirement: 'region_14', x: 35, y: 10 },
  { id: 'region_19', name: 'Nuclear Plant', difficulty: 6, buildings: 30, enemyTypes: ['mech', 'robot', 'elite'], coinReward: 1300, unlockRequirement: 'region_17', x: 60, y: 8 },
  { id: 'region_20', name: 'Fortress Island', difficulty: 6, buildings: 35, enemyTypes: ['marine', 'tank', 'jet', 'elite'], coinReward: 1400, unlockRequirement: 'region_15', x: 80, y: 40 },
  
  // Tier 7 regions (final)
  { id: 'region_21', name: 'Pentagon', difficulty: 7, buildings: 45, enemyTypes: ['elite', 'mech', 'jet', 'superweapon'], coinReward: 1800, unlockRequirement: 'region_18', x: 40, y: 5 },
  { id: 'region_22', name: 'Area 51', difficulty: 7, buildings: 40, enemyTypes: ['robot', 'mech', 'ufo', 'superweapon'], coinReward: 2000, unlockRequirement: 'region_19', x: 65, y: 5 },
  { id: 'region_23', name: 'Secret Bunker', difficulty: 7, buildings: 35, enemyTypes: ['elite', 'mech', 'superweapon'], coinReward: 2200, unlockRequirement: 'region_20', x: 85, y: 30 },
  { id: 'region_24', name: 'World Summit', difficulty: 8, buildings: 50, enemyTypes: ['elite', 'mech', 'jet', 'superweapon'], coinReward: 3000, unlockRequirement: 'region_21', x: 50, y: 3 },
  { id: 'region_25', name: 'Final Stronghold', difficulty: 8, buildings: 60, enemyTypes: ['elite', 'mech', 'superweapon', 'boss'], coinReward: 5000, unlockRequirement: 'region_24', x: 75, y: 3 },
]

export function getRegionById(id) {
  return regions.find(r => r.id === id)
}

export function getAvailableRegions(conqueredRegions) {
  return regions.filter(r => {
    if (!r.unlockRequirement) return true
    return conqueredRegions.includes(r.unlockRequirement)
  })
}
