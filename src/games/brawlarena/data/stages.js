// Original stages for Brawl Arena
export const stages = [
  {
    id: 'battlefield',
    name: 'Battle Platform',
    description: 'A classic floating arena',
    skyColor: 0x1a1a2e,
    groundColor: 0x445566,
    platformColor: 0x667788,
    platforms: [
      // Main platform
      { x: 0, y: 0, z: 0, width: 16, height: 0.5, depth: 8 },
      // Three floating platforms
      { x: -5, y: 3, z: 0, width: 4, height: 0.3, depth: 4 },
      { x: 0, y: 5, z: 0, width: 4, height: 0.3, depth: 4 },
      { x: 5, y: 3, z: 0, width: 4, height: 0.3, depth: 4 }
    ],
    blastZones: { left: -20, right: 20, top: 18, bottom: -12 },
    spawnPoints: [
      { x: -4, y: 1 },
      { x: 4, y: 1 }
    ]
  },
  {
    id: 'skycastle',
    name: 'Sky Castle',
    description: 'A majestic floating fortress',
    skyColor: 0x4488cc,
    groundColor: 0x887766,
    platformColor: 0x998877,
    platforms: [
      // Main castle floor
      { x: 0, y: 0, z: 0, width: 14, height: 0.8, depth: 8 },
      // Tower platforms
      { x: -6, y: 4, z: 0, width: 3, height: 0.4, depth: 4 },
      { x: 6, y: 4, z: 0, width: 3, height: 0.4, depth: 4 },
      // Bridge
      { x: 0, y: 6, z: 0, width: 6, height: 0.3, depth: 3 }
    ],
    blastZones: { left: -18, right: 18, top: 16, bottom: -10 },
    spawnPoints: [
      { x: -5, y: 1 },
      { x: 5, y: 1 }
    ]
  },
  {
    id: 'volcano',
    name: 'Molten Core',
    description: 'A dangerous volcanic arena',
    skyColor: 0x331100,
    groundColor: 0x442211,
    platformColor: 0x553322,
    accentColor: 0xff4400,
    platforms: [
      // Main rock platform
      { x: 0, y: 0, z: 0, width: 12, height: 1, depth: 8 },
      // Side platforms
      { x: -7, y: 2, z: 0, width: 3, height: 0.4, depth: 4 },
      { x: 7, y: 2, z: 0, width: 3, height: 0.4, depth: 4 },
      // Upper platform
      { x: 0, y: 4, z: 0, width: 5, height: 0.3, depth: 4 }
    ],
    blastZones: { left: -16, right: 16, top: 14, bottom: -8 },
    spawnPoints: [
      { x: -3, y: 1 },
      { x: 3, y: 1 }
    ],
    hazards: true
  },
  {
    id: 'forest',
    name: 'Ancient Woods',
    description: 'A mystical forest arena',
    skyColor: 0x224422,
    groundColor: 0x553311,
    platformColor: 0x664422,
    accentColor: 0x44aa44,
    platforms: [
      // Ground
      { x: 0, y: 0, z: 0, width: 18, height: 0.6, depth: 8 },
      // Tree branch platforms
      { x: -6, y: 3, z: 0, width: 4, height: 0.25, depth: 4 },
      { x: 2, y: 4.5, z: 0, width: 3.5, height: 0.25, depth: 3.5 },
      { x: 7, y: 2.5, z: 0, width: 3, height: 0.25, depth: 3.5 },
      { x: -2, y: 7, z: 0, width: 3, height: 0.25, depth: 3 }
    ],
    blastZones: { left: -22, right: 22, top: 18, bottom: -10 },
    spawnPoints: [
      { x: -6, y: 1 },
      { x: 6, y: 1 }
    ]
  },
  {
    id: 'space',
    name: 'Cosmic Arena',
    description: 'A platform among the stars',
    skyColor: 0x000011,
    groundColor: 0x222244,
    platformColor: 0x333355,
    accentColor: 0x8888ff,
    platforms: [
      // Central platform
      { x: 0, y: 0, z: 0, width: 10, height: 0.5, depth: 6 },
      // Orbiting platforms
      { x: -8, y: 1, z: 0, width: 4, height: 0.3, depth: 4 },
      { x: 8, y: 1, z: 0, width: 4, height: 0.3, depth: 4 },
      { x: -4, y: 5, z: 0, width: 3, height: 0.3, depth: 3 },
      { x: 4, y: 5, z: 0, width: 3, height: 0.3, depth: 3 }
    ],
    blastZones: { left: -18, right: 18, top: 16, bottom: -14 },
    spawnPoints: [
      { x: -3, y: 1 },
      { x: 3, y: 1 }
    ]
  }
]

export const getStage = (id) => stages.find(s => s.id === id) || stages[0]
