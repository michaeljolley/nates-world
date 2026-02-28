// Level definitions for Robber Joe
// Tile types: 0=floor, 1=wall, 2=loot, 3=exit, 4=guard spawn, 5=player spawn,
// 6=shadow/hiding spot, 7=furniture, 8=camera, 9=locked door, 10=vent, 11=noise trap

export const TILE_SIZE = 40

export const TILE_TYPES = {
  FLOOR: 0,
  WALL: 1,
  LOOT: 2,
  EXIT: 3,
  GUARD_SPAWN: 4,
  PLAYER_SPAWN: 5,
  SHADOW: 6,        // Hiding spot - player is invisible
  FURNITURE: 7,     // Can hide behind
  CAMERA: 8,        // Security camera
  LOCKED_DOOR: 9,   // Must lockpick
  VENT: 10,         // Secret passage
  NOISE_TRAP: 11,   // Makes noise when stepped on
  WINDOW: 12        // Can see through
}

export const levels = [
  // Level 1: Tutorial - The Apartment
  {
    id: 1,
    name: 'The Apartment',
    description: 'Learn the basics of sneaking',
    par: { time: 30, loot: 3 },
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,5,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,6,6,0,0,2,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,0,1,1,1,1,0,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,2,0,0,4,0,0,0,2,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,6,6,6,0,0,0,3,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    requiredLoot: 2,
    guardPatrols: [
      { startX: 5, startY: 6, path: [[5,6],[8,6],[8,6],[5,6]], pauseTime: 1.5 }
    ],
    cameras: []
  },
  
  // Level 2: The Mansion
  {
    id: 2,
    name: 'The Mansion',
    description: 'Multiple guards patrol the halls',
    par: { time: 60, loot: 4 },
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,5,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
      [1,0,6,0,0,1,0,2,0,0,6,6,0,2,0,1],
      [1,0,6,0,0,0,0,0,0,1,1,1,0,0,0,1],
      [1,1,1,0,1,1,1,1,0,1,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1,0,2,0,6,0,1],
      [1,0,2,0,0,4,0,0,0,0,0,0,0,6,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,0,1,1,0,1,1,1,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,4,0,1],
      [1,0,2,0,6,6,0,2,0,0,6,6,0,0,0,1],
      [1,0,0,0,6,6,0,0,0,0,6,6,0,0,3,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    requiredLoot: 3,
    guardPatrols: [
      { startX: 5, startY: 6, path: [[5,6],[8,6],[8,9],[5,9]], pauseTime: 1 },
      { startX: 13, startY: 9, path: [[13,9],[13,6],[10,6],[10,9]], pauseTime: 1 }
    ],
    cameras: []
  },

  // Level 3: The Museum
  {
    id: 3,
    name: 'The Museum',
    description: 'Security cameras watch the exhibits',
    par: { time: 90, loot: 5 },
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,5,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
      [1,0,6,0,0,0,0,1,0,2,0,0,0,1,0,2,0,1],
      [1,0,6,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,4,0,0,6,6,0,0,0,0,6,6,0,4,0,0,1],
      [1,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1],
      [1,0,2,0,0,1,6,0,2,0,0,6,1,0,0,2,0,1],
      [1,0,0,0,0,1,6,0,0,0,0,6,1,0,0,0,0,1],
      [1,0,6,0,0,0,0,0,0,0,0,0,0,0,0,6,0,1],
      [1,0,6,4,0,0,0,0,0,0,0,0,0,0,4,6,3,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    requiredLoot: 4,
    guardPatrols: [
      { startX: 2, startY: 6, path: [[2,6],[2,10],[6,10],[6,6]], pauseTime: 2 },
      { startX: 14, startY: 6, path: [[14,6],[14,2],[10,2],[10,6]], pauseTime: 2 },
      { startX: 3, startY: 11, path: [[3,11],[8,11],[8,11],[3,11]], pauseTime: 1.5 },
      { startX: 14, startY: 11, path: [[14,11],[10,11],[10,11],[14,11]], pauseTime: 1.5 }
    ],
    cameras: [
      { x: 9, y: 1, direction: 'down', sweepAngle: Math.PI / 2 },
      { x: 9, y: 12, direction: 'up', sweepAngle: Math.PI / 2 }
    ]
  },

  // Level 4: The Office Building
  {
    id: 4,
    name: 'The Office',
    description: 'Navigate through cubicles and avoid detection',
    par: { time: 75, loot: 5 },
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,5,0,0,7,0,0,1,0,0,7,0,0,0,0,1],
      [1,0,0,0,7,0,0,1,0,0,7,0,2,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,7,7,0,1,1,0,1,1,0,1,1,0,7,7,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,2,0,0,4,0,6,6,0,4,0,0,2,0,1],
      [1,0,0,0,0,0,0,6,6,0,0,0,0,0,0,1],
      [1,7,7,0,1,1,0,1,1,0,1,1,0,7,7,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,2,0,7,0,0,0,0,0,0,7,0,2,0,1],
      [1,0,0,0,7,0,0,6,6,0,0,7,0,0,3,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    requiredLoot: 4,
    guardPatrols: [
      { startX: 5, startY: 6, path: [[5,6],[5,3],[2,3],[2,6]], pauseTime: 1.5 },
      { startX: 10, startY: 6, path: [[10,6],[10,3],[13,3],[13,6]], pauseTime: 1.5 }
    ],
    cameras: [
      { x: 1, y: 6, direction: 'right', sweepAngle: Math.PI / 3 }
    ]
  },

  // Level 5: The Bank
  {
    id: 5,
    name: 'The Bank',
    description: 'Heavy security protects the vault',
    par: { time: 120, loot: 7 },
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,5,0,6,0,0,0,1,0,0,1,0,0,0,6,0,0,1],
      [1,0,0,6,0,0,0,0,0,0,0,0,0,0,6,0,0,1],
      [1,0,0,0,0,4,0,0,0,0,0,0,4,0,0,0,0,1],
      [1,1,1,0,1,1,1,1,0,0,1,1,1,1,0,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,2,0,6,0,0,1,1,1,1,0,0,6,0,2,0,1],
      [1,0,0,0,6,0,0,1,2,2,1,0,0,6,0,0,0,1],
      [1,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,1],
      [1,1,1,0,1,1,0,1,1,1,1,0,1,1,0,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,2,0,0,4,0,6,6,6,6,0,4,0,0,2,0,1],
      [1,0,0,0,0,0,0,6,6,6,6,0,0,0,0,0,3,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    requiredLoot: 6,
    guardPatrols: [
      { startX: 5, startY: 3, path: [[5,3],[5,5],[2,5],[2,3]], pauseTime: 2 },
      { startX: 12, startY: 3, path: [[12,3],[12,5],[15,5],[15,3]], pauseTime: 2 },
      { startX: 5, startY: 11, path: [[5,11],[5,10],[2,10],[2,11]], pauseTime: 1 },
      { startX: 12, startY: 11, path: [[12,11],[12,10],[15,10],[15,11]], pauseTime: 1 }
    ],
    cameras: [
      { x: 9, y: 5, direction: 'down', sweepAngle: Math.PI / 2 },
      { x: 1, y: 9, direction: 'right', sweepAngle: Math.PI / 3 },
      { x: 16, y: 9, direction: 'left', sweepAngle: Math.PI / 3 }
    ]
  },

  // Level 6: The Vault
  {
    id: 6,
    name: 'The Vault',
    description: 'The ultimate heist awaits',
    par: { time: 150, loot: 10 },
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,5,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,6,0,0,1,0,0,0,0,0,0,0,0,1,0,0,6,0,1],
      [1,0,6,0,0,0,0,0,4,0,0,0,0,0,0,0,0,6,0,1],
      [1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1],
      [1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,1],
      [1,0,6,0,0,0,0,0,0,6,6,0,0,0,0,0,0,6,0,1],
      [1,0,4,0,0,1,1,1,1,6,6,1,1,1,1,0,0,4,0,1],
      [1,0,0,0,0,1,2,6,6,2,2,6,6,2,1,0,0,0,0,1],
      [1,0,0,0,0,1,6,6,6,6,6,6,6,6,1,0,0,0,0,1],
      [1,1,1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1,1],
      [1,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1],
      [1,0,2,0,0,0,0,4,0,6,6,0,4,0,0,0,2,0,3,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    requiredLoot: 8,
    guardPatrols: [
      { startX: 8, startY: 3, path: [[8,3],[12,3],[12,3],[8,3]], pauseTime: 2 },
      { startX: 2, startY: 7, path: [[2,7],[2,12],[4,12],[4,7]], pauseTime: 1.5 },
      { startX: 17, startY: 7, path: [[17,7],[17,12],[15,12],[15,7]], pauseTime: 1.5 },
      { startX: 7, startY: 12, path: [[7,12],[9,12],[9,10],[7,10]], pauseTime: 1 },
      { startX: 12, startY: 12, path: [[12,12],[12,10],[10,10],[10,12]], pauseTime: 1 }
    ],
    cameras: [
      { x: 10, y: 1, direction: 'down', sweepAngle: Math.PI / 2 },
      { x: 10, y: 13, direction: 'up', sweepAngle: Math.PI / 2 },
      { x: 1, y: 7, direction: 'right', sweepAngle: Math.PI / 3 },
      { x: 18, y: 7, direction: 'left', sweepAngle: Math.PI / 3 }
    ]
  }
]
