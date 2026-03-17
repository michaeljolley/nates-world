// Monkey tower definitions for Monkey Fish TD
// Each monkey has base stats and two upgrade paths (top/bottom) with 4 tiers each

export const monkeys = {
  dart: {
    id: 'dart',
    name: 'Dart Thrower',
    cost: 200,
    damage: 1,
    range: 100,
    attackSpeed: 950,
    pierce: 1,
    description: 'Throws sharp darts',
    color: '#8B4513',
    secondaryColor: '#D2691E',
    upgrades: {
      top: [
        { name: 'Sharp Darts', cost: 140, damage: 1, pierce: 1, desc: '+1 damage, +1 pierce' },
        { name: 'Faster Throwing', cost: 190, attackSpeedMult: 0.75, desc: 'Attacks 25% faster' },
        { name: 'Triple Darts', cost: 400, projectiles: 3, desc: 'Throws 3 darts at once' },
        { name: 'Super Darts', cost: 1800, damage: 3, pierce: 4, desc: 'Massive damage boost' }
      ],
      bottom: [
        { name: 'Long Range', cost: 90, range: 25, desc: '+25 range' },
        { name: 'Enhanced Vision', cost: 200, camo: true, desc: 'Can see camo fish' },
        { name: 'Spike Darts', cost: 450, damage: 2, desc: '+2 damage' },
        { name: 'Crossbow', cost: 1500, damage: 3, range: 40, attackSpeedMult: 0.65, desc: 'Powerful crossbow' }
      ]
    }
  },

  tack: {
    id: 'tack',
    name: 'Tack Shooter',
    cost: 280,
    damage: 1,
    range: 65,
    attackSpeed: 1400,
    pierce: 1,
    projectiles: 8,
    spread: true,
    description: 'Shoots 8 tacks in all directions',
    color: '#666666',
    secondaryColor: '#999999',
    upgrades: {
      top: [
        { name: 'Faster Shooting', cost: 150, attackSpeedMult: 0.75, desc: 'Attacks faster' },
        { name: 'Even Faster', cost: 250, attackSpeedMult: 0.65, desc: 'Attacks even faster' },
        { name: 'Tack Sprayer', cost: 500, projectiles: 16, desc: 'Shoots 16 tacks' },
        { name: 'Ring of Fire', cost: 2200, special: 'ring', damage: 3, desc: 'Burns all nearby fish' }
      ],
      bottom: [
        { name: 'Longer Tacks', cost: 100, range: 15, desc: '+15 range' },
        { name: 'Super Range', cost: 200, range: 25, desc: '+25 more range' },
        { name: 'Blade Shooter', cost: 600, damage: 2, pierce: 3, desc: 'Blades deal more damage' },
        { name: 'Blade Storm', cost: 2800, damage: 4, pierce: 6, projectiles: 16, desc: 'Deadly blade storm' }
      ]
    }
  },

  sniper: {
    id: 'sniper',
    name: 'Sniper',
    cost: 350,
    damage: 4,
    range: 999,
    attackSpeed: 1600,
    pierce: 1,
    description: 'Infinite range, targets strongest',
    color: '#2F4F4F',
    secondaryColor: '#4682B4',
    targeting: 'strong',
    upgrades: {
      top: [
        { name: 'Full Jacket', cost: 350, damage: 3, desc: '+3 damage' },
        { name: 'Large Caliber', cost: 500, damage: 5, desc: '+5 damage' },
        { name: 'Deadly Precision', cost: 1200, damage: 10, crit: 0.15, critMult: 3, desc: '15% crit chance' },
        { name: 'Cripple Fish', cost: 3000, damage: 15, slow: 0.5, desc: 'Slows targets 50%' }
      ],
      bottom: [
        { name: 'Fast Firing', cost: 400, attackSpeedMult: 0.7, desc: 'Faster shots' },
        { name: 'Night Vision', cost: 300, camo: true, desc: 'Can see camo fish' },
        { name: 'Semi-Auto', cost: 1500, attackSpeedMult: 0.4, desc: 'Much faster firing' },
        { name: 'Full Auto', cost: 4000, attackSpeedMult: 0.2, damage: 2, desc: 'Rapid fire sniper' }
      ]
    }
  },

  bomb: {
    id: 'bomb',
    name: 'Bomb Launcher',
    cost: 525,
    damage: 2,
    range: 100,
    attackSpeed: 1500,
    pierce: 14,
    splash: 40,
    description: 'Launches explosive bombs',
    color: '#1a1a1a',
    secondaryColor: '#444444',
    upgrades: {
      top: [
        { name: 'Bigger Bombs', cost: 350, splash: 15, pierce: 6, desc: 'Larger explosions' },
        { name: 'Heavy Bombs', cost: 600, damage: 2, desc: '+2 damage' },
        { name: 'Cluster Bombs', cost: 900, cluster: true, desc: 'Spawns mini bombs' },
        { name: 'Bomb Blitz', cost: 2500, damage: 6, splash: 25, desc: 'Massive explosions' }
      ],
      bottom: [
        { name: 'Faster Reload', cost: 250, attackSpeedMult: 0.8, desc: 'Faster reload' },
        { name: 'Missile Launcher', cost: 400, range: 40, desc: 'Missiles travel further' },
        { name: 'MOAB Mauler', cost: 800, bossDamage: 10, desc: '+10 damage to bosses' },
        { name: 'MOAB Assassin', cost: 3200, bossDamage: 25, desc: 'Destroys boss fish' }
      ]
    }
  },

  ice: {
    id: 'ice',
    name: 'Ice Tower',
    cost: 300,
    damage: 0,
    range: 60,
    attackSpeed: 2400,
    freeze: true,
    freezeDuration: 1500,
    description: 'Freezes nearby fish',
    color: '#87CEEB',
    secondaryColor: '#E0FFFF',
    upgrades: {
      top: [
        { name: 'Permafrost', cost: 100, slowAfter: 0.5, desc: 'Fish stay slowed after' },
        { name: 'Cold Snap', cost: 350, freezeDuration: 500, desc: 'Longer freeze' },
        { name: 'Arctic Wind', cost: 1500, range: 30, slow: 0.6, desc: 'Slows unfrozen fish' },
        { name: 'Absolute Zero', cost: 2800, damage: 2, range: 40, desc: 'Damages frozen fish' }
      ],
      bottom: [
        { name: 'Enhanced Freeze', cost: 200, pierce: 10, desc: 'Freezes more fish' },
        { name: 'Deep Freeze', cost: 400, damage: 1, desc: 'Deals 1 damage' },
        { name: 'Cryo Cannon', cost: 1200, range: 100, attackSpeed: 1000, projectile: true, desc: 'Shoots ice blasts' },
        { name: 'Icicle Impale', cost: 3000, damage: 6, slow: 0.3, desc: 'Devastating ice spears' }
      ]
    }
  },

  glue: {
    id: 'glue',
    name: 'Glue Gunner',
    cost: 275,
    damage: 0,
    range: 85,
    attackSpeed: 1200,
    pierce: 1,
    slow: 0.5,
    slowDuration: 6000,
    description: 'Slows fish with glue',
    color: '#90EE90',
    secondaryColor: '#32CD32',
    upgrades: {
      top: [
        { name: 'Glue Soak', cost: 200, slowDuration: 5000, desc: 'Glue lasts longer' },
        { name: 'Corrosive Glue', cost: 300, dot: 1, dotInterval: 2000, desc: 'Glue damages over time' },
        { name: 'Glue Splatter', cost: 650, splash: 30, pierce: 4, desc: 'Glue splashes' },
        { name: 'Glue Storm', cost: 3500, ability: 'glueAll', desc: 'Ability: glue all fish' }
      ],
      bottom: [
        { name: 'Stickier Glue', cost: 120, slow: 0.15, desc: 'Slows 15% more' },
        { name: 'Super Glue', cost: 400, slow: 0.25, desc: 'Even slower fish' },
        { name: 'Relentless Glue', cost: 800, permanent: true, desc: 'Glue never wears off' },
        { name: 'Fish Dissolver', cost: 2500, damage: 3, dot: 2, desc: 'Dissolves fish' }
      ]
    }
  },

  cannon: {
    id: 'cannon',
    name: 'Cannon Ship',
    cost: 650,
    damage: 3,
    range: 110,
    attackSpeed: 1200,
    pierce: 20,
    splash: 50,
    description: 'Naval cannon with big splash',
    color: '#8B0000',
    secondaryColor: '#CD5C5C',
    upgrades: {
      top: [
        { name: 'Grapeshot', cost: 450, damage: 1, pierce: 10, desc: 'More pierce' },
        { name: 'Hot Shot', cost: 600, burn: true, desc: 'Sets fish on fire' },
        { name: 'Cannon Crew', cost: 1100, attackSpeedMult: 0.6, desc: 'Much faster firing' },
        { name: 'Artillery Battery', cost: 4500, projectiles: 3, damage: 3, desc: 'Triple cannons' }
      ],
      bottom: [
        { name: 'Longer Cannon', cost: 200, range: 30, desc: '+30 range' },
        { name: 'Crow\'s Nest', cost: 400, camo: true, desc: 'Can see camo fish' },
        { name: 'Destroyer', cost: 2200, damage: 4, splash: 25, desc: 'Bigger explosions' },
        { name: 'Flagship', cost: 5500, buff: true, buffRange: 150, desc: 'Buffs nearby towers' }
      ]
    }
  },

  wizard: {
    id: 'wizard',
    name: 'Wizard',
    cost: 400,
    damage: 2,
    range: 100,
    attackSpeed: 1100,
    pierce: 3,
    description: 'Magical attacks',
    color: '#9400D3',
    secondaryColor: '#DA70D6',
    upgrades: {
      top: [
        { name: 'Intense Magic', cost: 300, damage: 2, pierce: 2, desc: 'Stronger magic' },
        { name: 'Fireball', cost: 500, splash: 30, burn: true, desc: 'Fiery explosions' },
        { name: 'Wall of Fire', cost: 1200, wallOfFire: true, desc: 'Creates fire walls' },
        { name: 'Dragon Breath', cost: 3500, damage: 6, splash: 40, desc: 'Devastating fire breath' }
      ],
      bottom: [
        { name: 'Arcane Blast', cost: 250, attackSpeedMult: 0.8, desc: 'Faster casting' },
        { name: 'Shimmer', cost: 350, camo: true, decamo: true, desc: 'Removes camo from fish' },
        { name: 'Necromancer', cost: 1400, summon: true, desc: 'Summons undead fish to fight' },
        { name: 'Prince of Darkness', cost: 4000, summonStrong: true, desc: 'Powerful undead army' }
      ]
    }
  },

  super: {
    id: 'super',
    name: 'Super Monkey',
    cost: 2500,
    damage: 1,
    range: 130,
    attackSpeed: 60,
    pierce: 1,
    description: 'Incredibly fast attacks',
    color: '#4169E1',
    secondaryColor: '#6495ED',
    upgrades: {
      top: [
        { name: 'Laser Vision', cost: 2500, damage: 1, pierce: 2, desc: 'Lasers pierce more' },
        { name: 'Plasma Vision', cost: 4000, damage: 2, pierce: 3, desc: 'Plasma deals more damage' },
        { name: 'Sun Avatar', cost: 20000, damage: 3, projectiles: 3, desc: 'Triple sun beams' },
        { name: 'Sun Temple', cost: 100000, damage: 8, pierce: 20, desc: 'Ultimate power' }
      ],
      bottom: [
        { name: 'Super Range', cost: 1000, range: 40, desc: '+40 range' },
        { name: 'Epic Range', cost: 1400, range: 30, desc: '+30 more range' },
        { name: 'Robo Monkey', cost: 8000, projectiles: 2, independent: true, desc: 'Two independent arms' },
        { name: 'Tech Terror', cost: 22000, ability: 'annihilate', desc: 'Ability: destroy fish in range' }
      ]
    }
  },

  village: {
    id: 'village',
    name: 'Monkey Village',
    cost: 1200,
    damage: 0,
    range: 100,
    attackSpeed: 0,
    buff: true,
    description: 'Buffs nearby towers',
    color: '#DAA520',
    secondaryColor: '#FFD700',
    upgrades: {
      top: [
        { name: 'Bigger Radius', cost: 400, range: 30, desc: '+30 range' },
        { name: 'Jungle Drums', cost: 1500, attackSpeedBuff: 0.85, desc: '15% attack speed buff' },
        { name: 'Radar Scanner', cost: 2000, camoBuff: true, desc: 'All towers see camo' },
        { name: 'MIB', cost: 7500, damageTypeBuff: true, desc: 'All damage types' }
      ],
      bottom: [
        { name: 'Discount', cost: 500, discount: 0.1, desc: '10% discount nearby' },
        { name: 'Better Discount', cost: 800, discount: 0.1, desc: '20% total discount' },
        { name: 'Ability Training', cost: 2500, xpBuff: true, desc: 'Faster upgrades' },
        { name: 'Homeland Defense', cost: 5000, ability: 'homeland', desc: 'Ability: double attack speed' }
      ]
    }
  },

  farm: {
    id: 'farm',
    name: 'Banana Farm',
    cost: 1250,
    damage: 0,
    range: 0,
    attackSpeed: 0,
    income: 80,
    incomeInterval: 8000,
    description: 'Generates bananas',
    color: '#FFD700',
    secondaryColor: '#FFA500',
    upgrades: {
      top: [
        { name: 'Increased Production', cost: 500, income: 40, desc: '+40 income' },
        { name: 'Greater Production', cost: 600, income: 60, desc: '+60 more income' },
        { name: 'Banana Plantation', cost: 3000, income: 200, desc: '+200 income' },
        { name: 'Banana Research', cost: 5000, income: 400, desc: '+400 income' }
      ],
      bottom: [
        { name: 'Long Life', cost: 300, autoCollect: true, desc: 'Auto collect bananas' },
        { name: 'Valuable Bananas', cost: 800, incomeMult: 1.25, desc: '25% more value' },
        { name: 'Monkey Bank', cost: 3500, bank: true, bankLimit: 5000, desc: 'Stores money over time' },
        { name: 'IMF Loan', cost: 6500, ability: 'loan', desc: 'Ability: loan 10000 bananas' }
      ]
    }
  },

  spike: {
    id: 'spike',
    name: 'Spike Factory',
    cost: 850,
    damage: 1,
    range: 40,
    attackSpeed: 2000,
    pierce: 5,
    spikes: true,
    spikeLife: 30000,
    description: 'Places spike piles on track',
    color: '#696969',
    secondaryColor: '#A9A9A9',
    upgrades: {
      top: [
        { name: 'Bigger Stacks', cost: 600, pierce: 4, desc: '+4 pierce' },
        { name: 'White Hot', cost: 750, damage: 1, desc: '+1 damage' },
        { name: 'Spiked Balls', cost: 2200, damage: 2, pierce: 10, desc: 'Rolling spiked balls' },
        { name: 'Spiked Mines', cost: 4000, explode: true, desc: 'Exploding spike mines' }
      ],
      bottom: [
        { name: 'Faster Production', cost: 500, attackSpeedMult: 0.75, desc: 'More spikes' },
        { name: 'Even Faster', cost: 700, attackSpeedMult: 0.6, desc: 'Even more spikes' },
        { name: 'Spike Storm', cost: 2500, ability: 'spikes', desc: 'Ability: cover track in spikes' },
        { name: 'Carpet of Spikes', cost: 5500, permanent: true, desc: 'Spikes never disappear' }
      ]
    }
  }
}

// Ordered list for UI
export const monkeyOrder = [
  'dart', 'tack', 'sniper', 'bomb', 'ice', 'glue', 
  'cannon', 'wizard', 'super', 'village', 'farm', 'spike'
]

// Get upgrade cost for a tower
export function getUpgradeCost(monkeyType, path, tier) {
  const monkey = monkeys[monkeyType]
  if (!monkey || !monkey.upgrades) return 0
  const upgrades = monkey.upgrades[path]
  if (!upgrades || tier < 0 || tier >= upgrades.length) return 0
  return upgrades[tier].cost
}

// Apply upgrades to get final stats
export function getMonkeyStats(monkeyType, topPath = 0, bottomPath = 0) {
  const base = { ...monkeys[monkeyType] }
  const stats = {
    damage: base.damage || 0,
    range: base.range || 0,
    attackSpeed: base.attackSpeed || 1000,
    pierce: base.pierce || 1,
    splash: base.splash || 0,
    projectiles: base.projectiles || 1,
    camo: false,
    slow: base.slow || 0,
    slowDuration: base.slowDuration || 0,
    freeze: base.freeze || false,
    freezeDuration: base.freezeDuration || 0,
    burn: false,
    special: null,
    income: base.income || 0,
    buff: base.buff || false
  }
  
  // Apply top path upgrades
  if (base.upgrades?.top) {
    for (let i = 0; i < topPath && i < base.upgrades.top.length; i++) {
      const upgrade = base.upgrades.top[i]
      if (upgrade.damage) stats.damage += upgrade.damage
      if (upgrade.range) stats.range += upgrade.range
      if (upgrade.pierce) stats.pierce += upgrade.pierce
      if (upgrade.splash) stats.splash += upgrade.splash
      if (upgrade.projectiles) stats.projectiles = upgrade.projectiles
      if (upgrade.attackSpeedMult) stats.attackSpeed *= upgrade.attackSpeedMult
      if (upgrade.camo) stats.camo = true
      if (upgrade.burn) stats.burn = true
      if (upgrade.slow) stats.slow = Math.max(stats.slow, upgrade.slow)
      if (upgrade.freezeDuration) stats.freezeDuration += upgrade.freezeDuration
      if (upgrade.income) stats.income += upgrade.income
    }
  }
  
  // Apply bottom path upgrades
  if (base.upgrades?.bottom) {
    for (let i = 0; i < bottomPath && i < base.upgrades.bottom.length; i++) {
      const upgrade = base.upgrades.bottom[i]
      if (upgrade.damage) stats.damage += upgrade.damage
      if (upgrade.range) stats.range += upgrade.range
      if (upgrade.pierce) stats.pierce += upgrade.pierce
      if (upgrade.splash) stats.splash += upgrade.splash
      if (upgrade.projectiles) stats.projectiles = upgrade.projectiles
      if (upgrade.attackSpeedMult) stats.attackSpeed *= upgrade.attackSpeedMult
      if (upgrade.camo) stats.camo = true
      if (upgrade.slow) stats.slow = Math.max(stats.slow, upgrade.slow)
      if (upgrade.slowDuration) stats.slowDuration += upgrade.slowDuration
      if (upgrade.income) stats.income += upgrade.income
      if (upgrade.incomeMult) stats.income *= upgrade.incomeMult
    }
  }
  
  return stats
}
