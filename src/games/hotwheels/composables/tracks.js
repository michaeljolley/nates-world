// Track configurations for Hot Wheels Racing
// Each track has waypoints, loops, jumps, and visual theming

export const tracks = [
  {
    id: 1,
    name: 'Flame Runner',
    description: 'Massive track with long straights, 3 loops and 4 mega jumps!',
    difficulty: 1,
    laps: 3,
    theme: {
      primary: 0xff6600,
      secondary: 0x00aaff,
      accent: 0xff0000
    },
    startPosition: { x: 0, z: -180, rotation: 0 },
    waypoints: [
      // Start/finish area
      { x: 0, z: -200 },
      { x: 0, z: -150 },
      { x: 0, z: -100 },
      { x: 0, z: -50 },
      // First turn into long back straight
      { x: -30, z: 0 },
      { x: -80, z: 40 },
      { x: -150, z: 60 },
      { x: -220, z: 60 },
      { x: -300, z: 60 },
      // Hairpin left
      { x: -350, z: 40 },
      { x: -380, z: 0 },
      { x: -380, z: -60 },
      { x: -350, z: -100 },
      // Long diagonal with loop
      { x: -300, z: -120 },
      { x: -250, z: -140 },
      { x: -200, z: -160 },
      // Sharp right into mega straight
      { x: -150, z: -200 },
      { x: -100, z: -250 },
      { x: -50, z: -280 },
      { x: 50, z: -300 },
      { x: 150, z: -300 },
      { x: 250, z: -280 },
      // Loop-de-loop section
      { x: 320, z: -240 },
      { x: 360, z: -180 },
      { x: 380, z: -100 },
      // Corkscrew descent
      { x: 380, z: 0 },
      { x: 360, z: 80 },
      { x: 300, z: 140 },
      { x: 220, z: 160 },
      // Final sweeping turn back to start
      { x: 140, z: 140 },
      { x: 80, z: 80 },
      { x: 40, z: 0 },
      { x: 20, z: -80 },
      { x: 10, z: -140 },
    ],
    loops: [
      { x: -200, z: -160, rotation: Math.PI * 0.75, color: 0xff6600, size: 25 },
      { x: 360, z: -180, rotation: Math.PI / 2, color: 0x00aaff, size: 30 },
      { x: 300, z: 140, rotation: -Math.PI / 4, color: 0xff0000, size: 22 }
    ],
    jumps: [
      { x: -300, z: 60, rotation: 0 },
      { x: 50, z: -300, rotation: Math.PI / 6 },
      { x: 380, z: 0, rotation: Math.PI / 2 },
      { x: 80, z: 80, rotation: -Math.PI / 4 }
    ]
  },
  {
    id: 2,
    name: 'Neon Speedway',
    description: 'Epic figure-8 with 2 mega loops, 5 insane jumps!',
    difficulty: 2,
    laps: 3,
    theme: {
      primary: 0xff00ff,
      secondary: 0x00ff00,
      accent: 0xffff00
    },
    startPosition: { x: 0, z: -230, rotation: 0 },
    waypoints: [
      // Start straight
      { x: 0, z: -250 },
      { x: 0, z: -180 },
      { x: 0, z: -100 },
      // Sweeping left into first loop
      { x: -50, z: -40 },
      { x: -120, z: 20 },
      { x: -200, z: 60 },
      { x: -280, z: 80 },
      // Loop section
      { x: -350, z: 80 },
      { x: -400, z: 40 },
      { x: -420, z: -20 },
      // Long straight back
      { x: -400, z: -100 },
      { x: -350, z: -160 },
      { x: -280, z: -200 },
      { x: -180, z: -220 },
      { x: -80, z: -220 },
      // CROSSOVER POINT - figure 8
      { x: 0, z: -180 },
      { x: 80, z: -140 },
      { x: 160, z: -100 },
      // Right side mega loop approach
      { x: 250, z: -60 },
      { x: 320, z: 0 },
      { x: 380, z: 80 },
      // Mega loop
      { x: 420, z: 160 },
      { x: 400, z: 240 },
      // Sweeping return
      { x: 340, z: 300 },
      { x: 250, z: 320 },
      { x: 150, z: 300 },
      { x: 60, z: 240 },
      // Long diagonal back to start
      { x: 0, z: 160 },
      { x: -40, z: 80 },
      { x: -60, z: 0 },
      // CROSSOVER POINT AGAIN
      { x: -40, z: -80 },
      { x: -10, z: -140 },
    ],
    loops: [
      { x: -420, z: -20, rotation: -Math.PI / 2, color: 0xff00ff, size: 35 },
      { x: 420, z: 160, rotation: Math.PI / 2, color: 0x00ff00, size: 40 }
    ],
    jumps: [
      { x: -200, z: 60, rotation: Math.PI * 0.1 },
      { x: -180, z: -220, rotation: 0 },
      { x: 160, z: -100, rotation: -Math.PI * 0.15 },
      { x: 250, z: 320, rotation: Math.PI },
      { x: 0, z: 160, rotation: Math.PI / 2 }
    ]
  },
  {
    id: 3,
    name: "Dragon's Lair",
    description: 'Monster serpentine with 4 loops and 6 mega jumps!',
    difficulty: 3,
    laps: 2,
    theme: {
      primary: 0x00ff00,
      secondary: 0xff0000,
      accent: 0x9900ff
    },
    startPosition: { x: 0, z: -280, rotation: 0 },
    waypoints: [
      // Epic start straight
      { x: 0, z: -300 },
      { x: 0, z: -220 },
      { x: 0, z: -140 },
      { x: 0, z: -60 },
      // First serpentine section
      { x: -60, z: 0 },
      { x: -140, z: 40 },
      { x: -220, z: 20 },
      { x: -280, z: -40 },
      { x: -320, z: -120 },
      // First loop
      { x: -340, z: -200 },
      { x: -320, z: -280 },
      // Long back straight
      { x: -260, z: -340 },
      { x: -160, z: -380 },
      { x: -60, z: -400 },
      { x: 60, z: -400 },
      { x: 160, z: -380 },
      { x: 260, z: -340 },
      // Second loop approach
      { x: 340, z: -280 },
      { x: 400, z: -200 },
      // Corkscrew section
      { x: 420, z: -100 },
      { x: 400, z: 0 },
      { x: 340, z: 80 },
      // Third loop
      { x: 260, z: 140 },
      { x: 180, z: 180 },
      // S-curve madness
      { x: 100, z: 200 },
      { x: 0, z: 180 },
      { x: -100, z: 200 },
      { x: -180, z: 240 },
      // Fourth loop
      { x: -260, z: 280 },
      { x: -320, z: 240 },
      { x: -340, z: 160 },
      // Return to start
      { x: -300, z: 80 },
      { x: -220, z: 20 },
      { x: -140, z: -20 },
      { x: -60, z: -80 },
      { x: -10, z: -160 },
      { x: -5, z: -240 },
    ],
    loops: [
      { x: -340, z: -200, rotation: -Math.PI / 2, color: 0x00ff00, size: 30 },
      { x: 400, z: -200, rotation: Math.PI / 2, color: 0xff0000, size: 35 },
      { x: 260, z: 140, rotation: Math.PI / 4, color: 0x9900ff, size: 28 },
      { x: -320, z: 240, rotation: -Math.PI / 4, color: 0xffff00, size: 32 }
    ],
    jumps: [
      { x: -220, z: 20, rotation: Math.PI * 0.2 },
      { x: -60, z: -400, rotation: 0 },
      { x: 160, z: -380, rotation: -Math.PI * 0.1 },
      { x: 420, z: -100, rotation: Math.PI / 2 },
      { x: 0, z: 180, rotation: Math.PI },
      { x: -300, z: 80, rotation: -Math.PI * 0.3 }
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
