// Original characters for Brawl Arena
export const characters = [
  {
    id: 'blazer',
    name: 'Blazer',
    description: 'A fire warrior with powerful close-range attacks',
    color: 0xff4400,
    secondaryColor: 0xffaa00,
    weight: 1.0, // Medium weight
    speed: 1.0,
    jumpPower: 1.0,
    attacks: {
      neutral: { damage: 8, knockback: 0.3, range: 1.2, startup: 3 },
      forward: { damage: 12, knockback: 0.5, range: 1.5, startup: 5 },
      up: { damage: 10, knockback: 0.6, range: 1.3, startup: 4 },
      down: { damage: 6, knockback: 0.2, range: 1.0, startup: 2 },
      special: { damage: 18, knockback: 0.8, range: 2.0, startup: 12 }
    }
  },
  {
    id: 'frostbite',
    name: 'Frostbite',
    description: 'An ice mage with freezing projectiles',
    color: 0x00aaff,
    secondaryColor: 0xaaddff,
    weight: 0.8, // Light weight
    speed: 0.9,
    jumpPower: 1.2,
    attacks: {
      neutral: { damage: 6, knockback: 0.2, range: 1.0, startup: 2 },
      forward: { damage: 10, knockback: 0.4, range: 2.5, startup: 6, projectile: true },
      up: { damage: 8, knockback: 0.5, range: 1.5, startup: 4 },
      down: { damage: 5, knockback: 0.15, range: 1.2, startup: 3 },
      special: { damage: 15, knockback: 0.6, range: 3.0, startup: 10, projectile: true }
    }
  },
  {
    id: 'titan',
    name: 'Titan',
    description: 'A heavy brawler with devastating power',
    color: 0x666666,
    secondaryColor: 0x333333,
    weight: 1.4, // Heavy weight
    speed: 0.7,
    jumpPower: 0.8,
    attacks: {
      neutral: { damage: 12, knockback: 0.4, range: 1.3, startup: 5 },
      forward: { damage: 18, knockback: 0.8, range: 1.8, startup: 10 },
      up: { damage: 14, knockback: 0.7, range: 1.4, startup: 6 },
      down: { damage: 10, knockback: 0.5, range: 1.5, startup: 4 },
      special: { damage: 25, knockback: 1.2, range: 2.0, startup: 18 }
    }
  },
  {
    id: 'swift',
    name: 'Swift',
    description: 'A lightning-fast ninja with combo potential',
    color: 0x9933ff,
    secondaryColor: 0xcc99ff,
    weight: 0.7, // Very light
    speed: 1.4,
    jumpPower: 1.3,
    attacks: {
      neutral: { damage: 4, knockback: 0.15, range: 0.9, startup: 1 },
      forward: { damage: 7, knockback: 0.3, range: 1.2, startup: 3 },
      up: { damage: 6, knockback: 0.4, range: 1.1, startup: 2 },
      down: { damage: 5, knockback: 0.2, range: 1.0, startup: 2 },
      special: { damage: 12, knockback: 0.5, range: 1.5, startup: 6 }
    }
  },
  {
    id: 'boulder',
    name: 'Boulder',
    description: 'An earth guardian with great defense',
    color: 0x886633,
    secondaryColor: 0x554422,
    weight: 1.5, // Heaviest
    speed: 0.6,
    jumpPower: 0.7,
    attacks: {
      neutral: { damage: 10, knockback: 0.35, range: 1.1, startup: 4 },
      forward: { damage: 16, knockback: 0.7, range: 1.6, startup: 8 },
      up: { damage: 12, knockback: 0.6, range: 1.2, startup: 5 },
      down: { damage: 14, knockback: 0.8, range: 1.8, startup: 7, groundPound: true },
      special: { damage: 20, knockback: 1.0, range: 2.5, startup: 15, shockwave: true }
    }
  },
  {
    id: 'volt',
    name: 'Volt',
    description: 'An electric fighter with shocking speed',
    color: 0xffff00,
    secondaryColor: 0xaaaa00,
    weight: 0.85,
    speed: 1.3,
    jumpPower: 1.15,
    attacks: {
      neutral: { damage: 5, knockback: 0.2, range: 1.0, startup: 2 },
      forward: { damage: 9, knockback: 0.4, range: 1.8, startup: 4 },
      up: { damage: 11, knockback: 0.55, range: 1.4, startup: 4 },
      down: { damage: 7, knockback: 0.3, range: 1.3, startup: 3 },
      special: { damage: 14, knockback: 0.6, range: 2.2, startup: 8, chain: true }
    }
  }
]

export const getCharacter = (id) => characters.find(c => c.id === id) || characters[0]
