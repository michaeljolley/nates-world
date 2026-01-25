// Ship definitions for War Ships game
export const shipTemplates = [
  // STARTER (free)
  { id: 'starter', name: 'Starter Vessel', category: 'balanced', price: 0, health: 100, speed: 0.5, fireRate: 1.0, damage: 20, scale: 1.0, rarity: 'common', emoji: '🚢', buffs: ['Free ship'], debuffs: ['Basic stats'] },
  
  // SPEED SHIPS
  { id: 'swift1', name: 'Swift Runner', category: 'speed', price: 500, health: 80, speed: 0.65, fireRate: 1.0, damage: 18, scale: 0.9, rarity: 'common', emoji: '⛵', buffs: ['+30% Speed'], debuffs: ['-20% Health', '-10% Damage'] },
  { id: 'swift2', name: 'Sea Dart', category: 'speed', price: 1200, health: 75, speed: 0.7, fireRate: 1.1, damage: 17, scale: 0.85, rarity: 'uncommon', emoji: '🏎️', buffs: ['+40% Speed', '+10% Fire Rate'], debuffs: ['-25% Health', '-15% Damage'] },
  { id: 'swift3', name: 'Velocity', category: 'speed', price: 2500, health: 70, speed: 0.75, fireRate: 1.0, damage: 18, scale: 0.9, rarity: 'uncommon', emoji: '💨', buffs: ['+50% Speed', '+10% Accuracy'], debuffs: ['-30% Health'] },
  { id: 'swift4', name: 'Lightning Bolt', category: 'speed', price: 5000, health: 65, speed: 0.8, fireRate: 1.2, damage: 17, scale: 0.85, rarity: 'rare', emoji: '⚡', buffs: ['+60% Speed', '+20% Fire Rate'], debuffs: ['-35% Health', '-15% Damage'] },
  { id: 'swift5', name: 'Tempest', category: 'speed', price: 8000, health: 70, speed: 0.85, fireRate: 1.0, damage: 20, scale: 0.9, rarity: 'rare', emoji: '🌪️', buffs: ['+70% Speed'], debuffs: ['-30% Health', '-10% Accuracy'] },
  { id: 'swift8', name: 'Sonic Wave', category: 'speed', price: 25000, health: 55, speed: 1.0, fireRate: 1.0, damage: 20, scale: 0.8, rarity: 'epic', emoji: '🌊', buffs: ['+100% Speed'], debuffs: ['-45% Health'] },
  { id: 'swift12', name: 'Hyperdrive', category: 'speed', price: 100000, health: 50, speed: 1.2, fireRate: 1.0, damage: 20, scale: 0.75, rarity: 'legendary', emoji: '🚀', buffs: ['+140% Speed'], debuffs: ['-50% Health'] },
  { id: 'swift20', name: 'Speed Demon', category: 'speed', price: 2000000, health: 40, speed: 1.5, fireRate: 1.5, damage: 16, scale: 0.7, rarity: 'legendary', emoji: '👹', buffs: ['+250% Speed', '+50% Fire Rate', '+30% Accuracy'], debuffs: ['-60% Health', '-20% Damage'] },
  
  // TANK SHIPS
  { id: 'tank1', name: 'Iron Hull', category: 'tank', price: 500, health: 140, speed: 0.4, fireRate: 1.0, damage: 20, scale: 1.2, rarity: 'common', emoji: '🛡️', buffs: ['+40% Health'], debuffs: ['-20% Speed'] },
  { id: 'tank3', name: 'Fortress', category: 'tank', price: 2500, health: 180, speed: 0.35, fireRate: 1.0, damage: 20, scale: 1.3, rarity: 'uncommon', emoji: '🏰', buffs: ['+80% Health'], debuffs: ['-30% Speed'] },
  { id: 'tank5', name: 'Behemoth', category: 'tank', price: 8000, health: 220, speed: 0.35, fireRate: 0.9, damage: 22, scale: 1.4, rarity: 'rare', emoji: '🦣', buffs: ['+120% Health', '+10% Damage'], debuffs: ['-30% Speed', '-10% Fire Rate'] },
  { id: 'tank10', name: 'Dreadnought', category: 'tank', price: 50000, health: 320, speed: 0.25, fireRate: 0.75, damage: 26, scale: 1.5, rarity: 'epic', emoji: '⚓', buffs: ['+220% Health', '+30% Damage'], debuffs: ['-50% Speed', '-25% Fire Rate', '-10% Accuracy'] },
  { id: 'tank20', name: 'Immortal', category: 'tank', price: 2000000, health: 600, speed: 0.2, fireRate: 0.6, damage: 32, scale: 1.8, rarity: 'legendary', emoji: '👑', buffs: ['+500% Health', '+60% Damage'], debuffs: ['-65% Speed', '-40% Fire Rate', '-20% Accuracy'] },
  
  // DAMAGE SHIPS
  { id: 'dmg1', name: 'Striker', category: 'damage', price: 500, health: 85, speed: 0.48, fireRate: 1.0, damage: 25, scale: 1.0, rarity: 'common', emoji: '💥', buffs: ['+25% Damage'], debuffs: ['-15% Health'] },
  { id: 'dmg3', name: 'Destroyer', category: 'damage', price: 2500, health: 90, speed: 0.5, fireRate: 0.9, damage: 29, scale: 1.1, rarity: 'uncommon', emoji: '🔥', buffs: ['+45% Damage'], debuffs: ['-10% Health', '-10% Fire Rate'] },
  { id: 'dmg5', name: 'Executioner', category: 'damage', price: 8000, health: 85, speed: 0.48, fireRate: 1.0, damage: 32, scale: 1.1, rarity: 'rare', emoji: '⚔️', buffs: ['+60% Damage'], debuffs: ['-15% Health'] },
  { id: 'dmg10', name: 'Terminator', category: 'damage', price: 50000, health: 60, speed: 0.4, fireRate: 1.3, damage: 40, scale: 1.0, rarity: 'epic', emoji: '🤖', buffs: ['+100% Damage', '+30% Fire Rate'], debuffs: ['-40% Health', '-20% Speed', '-10% Accuracy'] },
  { id: 'dmg20', name: 'World Ender', category: 'damage', price: 2000000, health: 40, speed: 0.33, fireRate: 1.6, damage: 80, scale: 1.2, rarity: 'legendary', emoji: '💀', buffs: ['+300% Damage', '+60% Fire Rate'], debuffs: ['-60% Health', '-35% Speed', '-20% Accuracy'] },
  
  // BALANCED SHIPS
  { id: 'bal1', name: 'Voyager', category: 'balanced', price: 800, health: 110, speed: 0.55, fireRate: 1.05, damage: 21, scale: 1.0, rarity: 'common', emoji: '🌟', buffs: ['+10% All Stats'], debuffs: [] },
  { id: 'bal5', name: 'Crusader', category: 'balanced', price: 10000, health: 130, speed: 0.6, fireRate: 1.15, damage: 23, scale: 1.1, rarity: 'rare', emoji: '✨', buffs: ['+30% Health', '+20% Speed', '+15% Damage'], debuffs: [] },
  { id: 'bal10', name: 'Vindicator', category: 'balanced', price: 55000, health: 160, speed: 0.65, fireRate: 1.25, damage: 25, scale: 1.15, rarity: 'epic', emoji: '🔱', buffs: ['+60% Health', '+30% Speed', '+25% Offense'], debuffs: [] },
  { id: 'bal15', name: 'Warlord', category: 'balanced', price: 250000, health: 210, speed: 0.7, fireRate: 1.4, damage: 28, scale: 1.2, rarity: 'epic', emoji: '🎖️', buffs: ['+110% Health', '+40% All Offense'], debuffs: [] },
  { id: 'bal20', name: 'Perfection', category: 'balanced', price: 2000000, health: 300, speed: 0.8, fireRate: 1.6, damage: 32, scale: 1.3, rarity: 'legendary', emoji: '💎', buffs: ['+200% Health', '+60% All Stats'], debuffs: [] },
  
  // SPECIAL SHIPS
  { id: 'spec1', name: 'Glass Cannon', category: 'special', price: 3000, health: 40, speed: 0.6, fireRate: 1.5, damage: 50, scale: 0.9, rarity: 'rare', emoji: '🔮', buffs: ['+150% Damage', '+50% Fire Rate', '+20% Accuracy'], debuffs: ['-60% Health'] },
  { id: 'spec2', name: 'Sniper', category: 'special', price: 5000, health: 70, speed: 0.35, fireRate: 0.5, damage: 60, scale: 1.1, rarity: 'rare', emoji: '🎯', buffs: ['+200% Damage', '+50% Accuracy'], debuffs: ['-30% Health', '-30% Speed', '-50% Fire Rate'] },
  { id: 'spec4', name: 'Vampire', category: 'special', price: 15000, health: 80, speed: 0.55, fireRate: 1.2, damage: 26, scale: 1.0, rarity: 'epic', emoji: '🧛', buffs: ['+30% Damage', '+20% Fire Rate', 'Lifesteal'], debuffs: ['-20% Health'] },
  { id: 'spec6', name: 'Turtle', category: 'special', price: 25000, health: 400, speed: 0.15, fireRate: 0.5, damage: 40, scale: 1.6, rarity: 'epic', emoji: '🐢', buffs: ['+300% Health', '+100% Damage'], debuffs: ['-70% Speed', '-50% Fire Rate'] },
  { id: 'spec8', name: 'Assassin', category: 'special', price: 40000, health: 45, speed: 0.9, fireRate: 0.8, damage: 80, scale: 0.8, rarity: 'epic', emoji: '🗡️', buffs: ['+300% Damage', '+40% Accuracy', '+80% Speed'], debuffs: ['-55% Health', '-20% Fire Rate'] },
  { id: 'spec16', name: 'Destroyer Elite', category: 'special', price: 500000, health: 150, speed: 0.65, fireRate: 1.5, damage: 50, scale: 1.2, rarity: 'legendary', emoji: '🏆', buffs: ['+50% Health', '+30% Speed', '+50% Fire Rate', '+150% Damage'], debuffs: [] },
  { id: 'spec19', name: 'Divine', category: 'special', price: 3000000, health: 350, speed: 1.0, fireRate: 2.0, damage: 60, scale: 1.4, rarity: 'legendary', emoji: '👼', buffs: ['+250% Health', '+100% Speed', '+100% Fire Rate', '+200% Damage'], debuffs: [] }
]

export const shipCategories = ['all', 'speed', 'tank', 'damage', 'balanced', 'special']
