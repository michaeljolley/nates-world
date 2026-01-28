// Map definitions for Plantation tower defense
// Each map has a path (waypoints) and valid placement spots

export const maps = {
  garden: {
    id: 'garden',
    name: 'Garden Path',
    width: 640,
    height: 320,
    startSeeds: 200,
    lives: 10,
    path: [
      { x: 0, y: 60 },
      { x: 120, y: 60 },
      { x: 120, y: 160 },
      { x: 280, y: 160 },
      { x: 280, y: 60 },
      { x: 440, y: 60 },
      { x: 440, y: 220 },
      { x: 200, y: 220 },
      { x: 200, y: 280 },
      { x: 520, y: 280 },
      { x: 520, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },
  
  serpent: {
    id: 'serpent',
    name: 'Serpent Trail',
    width: 640,
    height: 320,
    startSeeds: 250,
    lives: 8,
    path: [
      { x: 0, y: 160 },
      { x: 80, y: 160 },
      { x: 80, y: 50 },
      { x: 200, y: 50 },
      { x: 200, y: 270 },
      { x: 320, y: 270 },
      { x: 320, y: 50 },
      { x: 440, y: 50 },
      { x: 440, y: 270 },
      { x: 560, y: 270 },
      { x: 560, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },
  
  spiral: {
    id: 'spiral',
    name: 'Spiral Garden',
    width: 640,
    height: 320,
    startSeeds: 300,
    lives: 8,
    path: [
      { x: 0, y: 160 },
      { x: 80, y: 160 },
      { x: 80, y: 40 },
      { x: 560, y: 40 },
      { x: 560, y: 280 },
      { x: 160, y: 280 },
      { x: 160, y: 100 },
      { x: 440, y: 100 },
      { x: 440, y: 210 },
      { x: 280, y: 210 },
      { x: 280, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },
  
  crossroads: {
    id: 'crossroads',
    name: 'The Crossroads',
    width: 640,
    height: 320,
    startSeeds: 275,
    lives: 12,
    path: [
      { x: 0, y: 100 },
      { x: 160, y: 100 },
      { x: 160, y: 220 },
      { x: 320, y: 220 },
      { x: 320, y: 60 },
      { x: 480, y: 60 },
      { x: 480, y: 260 },
      { x: 240, y: 260 },
      { x: 240, y: 160 },
      { x: 560, y: 160 },
      { x: 560, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },
  
  fortress: {
    id: 'fortress',
    name: 'Fortress Defense',
    width: 640,
    height: 320,
    startSeeds: 350,
    lives: 6,
    path: [
      { x: 0, y: 40 },
      { x: 600, y: 40 },
      { x: 600, y: 120 },
      { x: 40, y: 120 },
      { x: 40, y: 200 },
      { x: 600, y: 200 },
      { x: 600, y: 280 },
      { x: 320, y: 280 },
      { x: 320, y: 320 }
    ],
    gridSize: 40
  },

  // New maps
  zigzag: {
    id: 'zigzag',
    name: 'Zigzag Valley',
    width: 640,
    height: 320,
    startSeeds: 225,
    lives: 10,
    path: [
      { x: 0, y: 40 },
      { x: 160, y: 40 },
      { x: 160, y: 160 },
      { x: 320, y: 160 },
      { x: 320, y: 40 },
      { x: 480, y: 40 },
      { x: 480, y: 280 },
      { x: 640, y: 280 }
    ],
    gridSize: 40
  },

  loop: {
    id: 'loop',
    name: 'The Loop',
    width: 640,
    height: 320,
    startSeeds: 275,
    lives: 8,
    path: [
      { x: 0, y: 160 },
      { x: 100, y: 160 },
      { x: 100, y: 40 },
      { x: 540, y: 40 },
      { x: 540, y: 280 },
      { x: 100, y: 280 },
      { x: 100, y: 200 },
      { x: 400, y: 200 },
      { x: 400, y: 120 },
      { x: 200, y: 120 },
      { x: 200, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },

  diamond: {
    id: 'diamond',
    name: 'Diamond Run',
    width: 640,
    height: 320,
    startSeeds: 200,
    lives: 10,
    path: [
      { x: 0, y: 160 },
      { x: 160, y: 160 },
      { x: 320, y: 40 },
      { x: 480, y: 160 },
      { x: 320, y: 280 },
      { x: 160, y: 160 },
      { x: 480, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },

  waves: {
    id: 'waves',
    name: 'Ocean Waves',
    width: 640,
    height: 320,
    startSeeds: 250,
    lives: 9,
    path: [
      { x: 0, y: 160 },
      { x: 80, y: 80 },
      { x: 160, y: 160 },
      { x: 240, y: 240 },
      { x: 320, y: 160 },
      { x: 400, y: 80 },
      { x: 480, y: 160 },
      { x: 560, y: 240 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },

  castle: {
    id: 'castle',
    name: 'Castle Walls',
    width: 640,
    height: 320,
    startSeeds: 300,
    lives: 7,
    path: [
      { x: 0, y: 280 },
      { x: 80, y: 280 },
      { x: 80, y: 40 },
      { x: 200, y: 40 },
      { x: 200, y: 200 },
      { x: 320, y: 200 },
      { x: 320, y: 40 },
      { x: 440, y: 40 },
      { x: 440, y: 200 },
      { x: 560, y: 200 },
      { x: 560, y: 40 },
      { x: 640, y: 40 }
    ],
    gridSize: 40
  },

  hourglass: {
    id: 'hourglass',
    name: 'Hourglass',
    width: 640,
    height: 320,
    startSeeds: 225,
    lives: 10,
    path: [
      { x: 0, y: 40 },
      { x: 200, y: 40 },
      { x: 320, y: 160 },
      { x: 440, y: 280 },
      { x: 640, y: 280 }
    ],
    gridSize: 40
  },

  maze: {
    id: 'maze',
    name: 'Mini Maze',
    width: 640,
    height: 320,
    startSeeds: 350,
    lives: 6,
    path: [
      { x: 0, y: 40 },
      { x: 280, y: 40 },
      { x: 280, y: 120 },
      { x: 120, y: 120 },
      { x: 120, y: 200 },
      { x: 400, y: 200 },
      { x: 400, y: 120 },
      { x: 520, y: 120 },
      { x: 520, y: 280 },
      { x: 640, y: 280 }
    ],
    gridSize: 40
  },

  arrow: {
    id: 'arrow',
    name: 'Arrow Path',
    width: 640,
    height: 320,
    startSeeds: 200,
    lives: 10,
    path: [
      { x: 0, y: 160 },
      { x: 200, y: 160 },
      { x: 320, y: 60 },
      { x: 320, y: 260 },
      { x: 320, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },

  corners: {
    id: 'corners',
    name: 'Four Corners',
    width: 640,
    height: 320,
    startSeeds: 275,
    lives: 8,
    path: [
      { x: 0, y: 40 },
      { x: 560, y: 40 },
      { x: 560, y: 280 },
      { x: 80, y: 280 },
      { x: 80, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },

  heart: {
    id: 'heart',
    name: 'Heart Garden',
    width: 640,
    height: 320,
    startSeeds: 250,
    lives: 10,
    path: [
      { x: 0, y: 120 },
      { x: 120, y: 120 },
      { x: 120, y: 60 },
      { x: 240, y: 60 },
      { x: 320, y: 140 },
      { x: 400, y: 60 },
      { x: 520, y: 60 },
      { x: 520, y: 120 },
      { x: 320, y: 280 },
      { x: 640, y: 280 }
    ],
    gridSize: 40
  },

  lightning: {
    id: 'lightning',
    name: 'Lightning Bolt',
    width: 640,
    height: 320,
    startSeeds: 200,
    lives: 10,
    path: [
      { x: 0, y: 40 },
      { x: 200, y: 40 },
      { x: 120, y: 160 },
      { x: 400, y: 160 },
      { x: 320, y: 280 },
      { x: 640, y: 280 }
    ],
    gridSize: 40
  },

  tunnel: {
    id: 'tunnel',
    name: 'The Tunnel',
    width: 640,
    height: 320,
    startSeeds: 225,
    lives: 9,
    path: [
      { x: 0, y: 60 },
      { x: 280, y: 60 },
      { x: 280, y: 260 },
      { x: 360, y: 260 },
      { x: 360, y: 60 },
      { x: 640, y: 60 }
    ],
    gridSize: 40
  },

  clover: {
    id: 'clover',
    name: 'Lucky Clover',
    width: 640,
    height: 320,
    startSeeds: 300,
    lives: 7,
    path: [
      { x: 0, y: 160 },
      { x: 160, y: 160 },
      { x: 160, y: 60 },
      { x: 280, y: 60 },
      { x: 280, y: 160 },
      { x: 360, y: 160 },
      { x: 360, y: 260 },
      { x: 480, y: 260 },
      { x: 480, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },

  bridge: {
    id: 'bridge',
    name: 'The Bridge',
    width: 640,
    height: 320,
    startSeeds: 200,
    lives: 10,
    path: [
      { x: 0, y: 280 },
      { x: 160, y: 280 },
      { x: 160, y: 160 },
      { x: 480, y: 160 },
      { x: 480, y: 280 },
      { x: 640, y: 280 }
    ],
    gridSize: 40
  },

  staircase: {
    id: 'staircase',
    name: 'Staircase',
    width: 640,
    height: 320,
    startSeeds: 250,
    lives: 9,
    path: [
      { x: 0, y: 280 },
      { x: 120, y: 280 },
      { x: 120, y: 220 },
      { x: 240, y: 220 },
      { x: 240, y: 160 },
      { x: 360, y: 160 },
      { x: 360, y: 100 },
      { x: 480, y: 100 },
      { x: 480, y: 40 },
      { x: 640, y: 40 }
    ],
    gridSize: 40
  },

  river: {
    id: 'river',
    name: 'River Bend',
    width: 640,
    height: 320,
    startSeeds: 225,
    lives: 10,
    path: [
      { x: 0, y: 40 },
      { x: 200, y: 40 },
      { x: 280, y: 120 },
      { x: 360, y: 200 },
      { x: 440, y: 280 },
      { x: 640, y: 280 }
    ],
    gridSize: 40
  },

  figure8: {
    id: 'figure8',
    name: 'Figure Eight',
    width: 640,
    height: 320,
    startSeeds: 325,
    lives: 7,
    path: [
      { x: 0, y: 160 },
      { x: 80, y: 160 },
      { x: 80, y: 60 },
      { x: 240, y: 60 },
      { x: 240, y: 160 },
      { x: 400, y: 160 },
      { x: 400, y: 260 },
      { x: 560, y: 260 },
      { x: 560, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },

  claw: {
    id: 'claw',
    name: 'Dragon Claw',
    width: 640,
    height: 320,
    startSeeds: 275,
    lives: 8,
    path: [
      { x: 0, y: 160 },
      { x: 200, y: 160 },
      { x: 200, y: 40 },
      { x: 320, y: 40 },
      { x: 320, y: 280 },
      { x: 440, y: 280 },
      { x: 440, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },

  splitpath: {
    id: 'splitpath',
    name: 'Split Decision',
    width: 640,
    height: 320,
    startSeeds: 200,
    lives: 10,
    path: [
      { x: 0, y: 160 },
      { x: 160, y: 160 },
      { x: 160, y: 60 },
      { x: 480, y: 60 },
      { x: 480, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },

  pyramid: {
    id: 'pyramid',
    name: 'Pyramid Path',
    width: 640,
    height: 320,
    startSeeds: 250,
    lives: 9,
    path: [
      { x: 0, y: 280 },
      { x: 160, y: 280 },
      { x: 320, y: 60 },
      { x: 480, y: 280 },
      { x: 640, y: 280 }
    ],
    gridSize: 40
  },

  fortress2: {
    id: 'fortress2',
    name: 'Double Fortress',
    width: 640,
    height: 320,
    startSeeds: 375,
    lives: 5,
    path: [
      { x: 0, y: 60 },
      { x: 560, y: 60 },
      { x: 560, y: 130 },
      { x: 80, y: 130 },
      { x: 80, y: 190 },
      { x: 560, y: 190 },
      { x: 560, y: 260 },
      { x: 80, y: 260 },
      { x: 80, y: 320 }
    ],
    gridSize: 40
  },

  omega: {
    id: 'omega',
    name: 'Omega Loop',
    width: 640,
    height: 320,
    startSeeds: 300,
    lives: 8,
    path: [
      { x: 0, y: 280 },
      { x: 120, y: 280 },
      { x: 120, y: 80 },
      { x: 320, y: 80 },
      { x: 320, y: 200 },
      { x: 520, y: 200 },
      { x: 520, y: 80 },
      { x: 640, y: 80 }
    ],
    gridSize: 40
  },

  cross: {
    id: 'cross',
    name: 'The Cross',
    width: 640,
    height: 320,
    startSeeds: 225,
    lives: 10,
    path: [
      { x: 0, y: 160 },
      { x: 240, y: 160 },
      { x: 240, y: 40 },
      { x: 400, y: 40 },
      { x: 400, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },

  valley: {
    id: 'valley',
    name: 'Deep Valley',
    width: 640,
    height: 320,
    startSeeds: 200,
    lives: 10,
    path: [
      { x: 0, y: 40 },
      { x: 160, y: 40 },
      { x: 320, y: 280 },
      { x: 480, y: 40 },
      { x: 640, y: 40 }
    ],
    gridSize: 40
  },

  crown: {
    id: 'crown',
    name: 'Royal Crown',
    width: 640,
    height: 320,
    startSeeds: 275,
    lives: 8,
    path: [
      { x: 0, y: 280 },
      { x: 80, y: 280 },
      { x: 80, y: 160 },
      { x: 160, y: 60 },
      { x: 240, y: 160 },
      { x: 320, y: 60 },
      { x: 400, y: 160 },
      { x: 480, y: 60 },
      { x: 560, y: 160 },
      { x: 560, y: 280 },
      { x: 640, y: 280 }
    ],
    gridSize: 40
  },

  snake: {
    id: 'snake',
    name: 'Snake Pit',
    width: 640,
    height: 320,
    startSeeds: 325,
    lives: 7,
    path: [
      { x: 0, y: 40 },
      { x: 560, y: 40 },
      { x: 560, y: 100 },
      { x: 80, y: 100 },
      { x: 80, y: 160 },
      { x: 560, y: 160 },
      { x: 560, y: 220 },
      { x: 80, y: 220 },
      { x: 80, y: 280 },
      { x: 640, y: 280 }
    ],
    gridSize: 40
  },

  gauntlet: {
    id: 'gauntlet',
    name: 'The Gauntlet',
    width: 640,
    height: 320,
    startSeeds: 400,
    lives: 5,
    path: [
      { x: 0, y: 160 },
      { x: 100, y: 160 },
      { x: 100, y: 60 },
      { x: 180, y: 60 },
      { x: 180, y: 260 },
      { x: 260, y: 260 },
      { x: 260, y: 60 },
      { x: 340, y: 60 },
      { x: 340, y: 260 },
      { x: 420, y: 260 },
      { x: 420, y: 60 },
      { x: 500, y: 60 },
      { x: 500, y: 260 },
      { x: 580, y: 260 },
      { x: 580, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },

  portal: {
    id: 'portal',
    name: 'Portal Path',
    width: 640,
    height: 320,
    startSeeds: 250,
    lives: 9,
    path: [
      { x: 0, y: 160 },
      { x: 120, y: 160 },
      { x: 120, y: 40 },
      { x: 280, y: 40 },
      { x: 280, y: 280 },
      { x: 360, y: 280 },
      { x: 360, y: 40 },
      { x: 520, y: 40 },
      { x: 520, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  },

  trident: {
    id: 'trident',
    name: 'Trident',
    width: 640,
    height: 320,
    startSeeds: 225,
    lives: 10,
    path: [
      { x: 0, y: 280 },
      { x: 320, y: 280 },
      { x: 320, y: 160 },
      { x: 160, y: 160 },
      { x: 160, y: 40 },
      { x: 480, y: 40 },
      { x: 480, y: 160 },
      { x: 320, y: 160 },
      { x: 640, y: 160 }
    ],
    gridSize: 40
  }
}

// Calculate placement grid based on path
export function getPlacementGrid(map) {
  const grid = []
  const cellSize = map.gridSize
  const cols = Math.floor(map.width / cellSize)
  const rows = Math.floor(map.height / cellSize)
  
  // Create grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellSize + cellSize / 2
      const y = row * cellSize + cellSize / 2
      
      // Check if this cell is on the path
      const onPath = isOnPath(x, y, map.path, cellSize)
      
      if (!onPath) {
        // Check if adjacent to path (valid placement)
        const nearPath = isNearPath(x, y, map.path, cellSize * 1.5)
        if (nearPath) {
          grid.push({ x, y, col, row })
        }
      }
    }
  }
  
  return grid
}

function isOnPath(x, y, path, threshold) {
  for (let i = 0; i < path.length - 1; i++) {
    const dist = pointToSegmentDistance(x, y, path[i], path[i + 1])
    if (dist < threshold) return true
  }
  return false
}

function isNearPath(x, y, path, threshold) {
  for (let i = 0; i < path.length - 1; i++) {
    const dist = pointToSegmentDistance(x, y, path[i], path[i + 1])
    if (dist < threshold) return true
  }
  return false
}

function pointToSegmentDistance(px, py, p1, p2) {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const lengthSquared = dx * dx + dy * dy
  
  if (lengthSquared === 0) {
    return Math.sqrt((px - p1.x) ** 2 + (py - p1.y) ** 2)
  }
  
  let t = ((px - p1.x) * dx + (py - p1.y) * dy) / lengthSquared
  t = Math.max(0, Math.min(1, t))
  
  const projX = p1.x + t * dx
  const projY = p1.y + t * dy
  
  return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2)
}
