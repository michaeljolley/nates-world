// Track configurations for Hot Wheels Racing
// Each track has waypoints, loops, jumps, and visual theming

export const tracks = [
  {
    id: 1,
    name: 'Flame Runner',
    description: 'Classic circuit with 2 loops and 3 jumps',
    difficulty: 1,
    laps: 3,
    theme: {
      primary: 0xff6600,
      secondary: 0x00aaff,
      accent: 0xff0000
    },
    startPosition: { x: 0, z: -100, rotation: Math.PI },
    waypoints: [
      { x: 0, z: -100 },
      { x: -50, z: -100 },
      { x: -100, z: -80 },
      { x: -120, z: -40 },
      { x: -100, z: 0 },
      { x: -120, z: 50 },
      { x: -80, z: 100 },
      { x: 0, z: 120 },
      { x: 80, z: 100 },
      { x: 120, z: 50 },
      { x: 100, z: 0 },
      { x: 120, z: -40 },
      { x: 100, z: -80 },
      { x: 50, z: -100 },
    ],
    loops: [
      { x: 100, z: 0, rotation: Math.PI / 2, color: 0xff6600 },
      { x: -100, z: 0, rotation: -Math.PI / 2, color: 0x00aaff }
    ],
    jumps: [
      { x: 80, z: -100, rotation: 0 },
      { x: -80, z: -100, rotation: Math.PI },
      { x: 0, z: -120, rotation: Math.PI / 2 }
    ]
  },
  {
    id: 2,
    name: 'Neon Speedway',
    description: 'Figure-8 crossover with mega loop and 4 big jumps',
    difficulty: 2,
    laps: 3,
    theme: {
      primary: 0xff00ff,
      secondary: 0x00ff00,
      accent: 0xffff00
    },
    startPosition: { x: 0, z: -140, rotation: Math.PI },
    waypoints: [
      { x: 0, z: -140 },      // Start
      { x: -40, z: -130 },
      { x: -80, z: -100 },
      { x: -120, z: -60 },
      { x: -140, z: 0 },      // Left apex
      { x: -120, z: 60 },
      { x: -80, z: 100 },
      { x: -40, z: 120 },
      { x: 0, z: 130 },       // Far end
      { x: 40, z: 120 },
      { x: 80, z: 100 },
      { x: 120, z: 60 },
      { x: 140, z: 0 },       // Right apex (MEGA LOOP)
      { x: 120, z: -60 },
      { x: 80, z: -100 },
      { x: 40, z: -130 },
    ],
    loops: [
      { x: 140, z: 0, rotation: Math.PI / 2, color: 0xff00ff, size: 25 }
    ],
    jumps: [
      { x: -80, z: -100, rotation: Math.PI * 0.75 },
      { x: -80, z: 100, rotation: Math.PI * 0.25 },
      { x: 80, z: 100, rotation: -Math.PI * 0.25 },
      { x: 80, z: -100, rotation: -Math.PI * 0.75 }
    ]
  },
  {
    id: 3,
    name: "Dragon's Lair",
    description: 'Serpentine monster with 3 loops and 5 jumps!',
    difficulty: 3,
    laps: 2,
    theme: {
      primary: 0x00ff00,
      secondary: 0xff0000,
      accent: 0x9900ff
    },
    startPosition: { x: 0, z: -160, rotation: Math.PI },
    waypoints: [
      { x: 0, z: -160 },       // Start
      { x: -60, z: -150 },
      { x: -100, z: -120 },
      { x: -130, z: -80 },     // Loop 1 approach
      { x: -150, z: -40 },
      { x: -140, z: 0 },
      { x: -120, z: 40 },
      { x: -80, z: 70 },
      { x: -30, z: 90 },       // S-curve
      { x: 30, z: 100 },
      { x: 80, z: 90 },
      { x: 120, z: 60 },       // Loop 2 approach
      { x: 150, z: 20 },
      { x: 160, z: -30 },
      { x: 150, z: -80 },      // Loop 3 approach
      { x: 120, z: -120 },
      { x: 80, z: -140 },
      { x: 40, z: -155 },
    ],
    loops: [
      { x: -150, z: -40, rotation: -Math.PI / 2, color: 0x00ff00 },
      { x: 150, z: 20, rotation: Math.PI / 2, color: 0xff0000 },
      { x: 150, z: -80, rotation: Math.PI / 2, color: 0x9900ff }
    ],
    jumps: [
      { x: -100, z: -120, rotation: Math.PI * 0.6 },
      { x: -80, z: 70, rotation: Math.PI * 0.2 },
      { x: 80, z: 90, rotation: -Math.PI * 0.2 },
      { x: 120, z: -120, rotation: -Math.PI * 0.4 },
      { x: 0, z: -160, rotation: Math.PI }
    ]
  }
]

export function getTrackById(id) {
  return tracks.find(t => t.id === id) || tracks[0]
}

export function getTrackWaypoints(trackId) {
  const track = getTrackById(trackId)
  return track.waypoints
}
