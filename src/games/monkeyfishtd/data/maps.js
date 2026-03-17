// Map definitions for Monkey Fish TD
// Each map has a water path (river/lake) and land areas for monkey placement

export const maps = {
  // Beginner maps
  riverbank: {
    id: 'riverbank',
    name: 'River Bank',
    width: 640,
    height: 360,
    startBananas: 200,
    lives: 15,
    path: [
      { x: 0, y: 180 },
      { x: 160, y: 180 },
      { x: 160, y: 80 },
      { x: 320, y: 80 },
      { x: 320, y: 280 },
      { x: 480, y: 280 },
      { x: 480, y: 180 },
      { x: 640, y: 180 }
    ],
    gridSize: 40,
    waterColor: '#1E90FF',
    landColor: '#8B4513'
  },

  lakeside: {
    id: 'lakeside',
    name: 'Lakeside',
    width: 640,
    height: 360,
    startBananas: 225,
    lives: 12,
    path: [
      { x: 0, y: 60 },
      { x: 200, y: 60 },
      { x: 200, y: 180 },
      { x: 100, y: 180 },
      { x: 100, y: 300 },
      { x: 540, y: 300 },
      { x: 540, y: 180 },
      { x: 440, y: 180 },
      { x: 440, y: 60 },
      { x: 640, y: 60 }
    ],
    gridSize: 40,
    waterColor: '#4169E1',
    landColor: '#228B22'
  },

  stream: {
    id: 'stream',
    name: 'Winding Stream',
    width: 640,
    height: 360,
    startBananas: 200,
    lives: 15,
    path: [
      { x: 0, y: 300 },
      { x: 120, y: 300 },
      { x: 120, y: 60 },
      { x: 280, y: 60 },
      { x: 280, y: 300 },
      { x: 440, y: 300 },
      { x: 440, y: 60 },
      { x: 640, y: 60 }
    ],
    gridSize: 40,
    waterColor: '#00CED1',
    landColor: '#32CD32'
  },

  // Intermediate maps
  delta: {
    id: 'delta',
    name: 'River Delta',
    width: 640,
    height: 360,
    startBananas: 250,
    lives: 10,
    path: [
      { x: 0, y: 180 },
      { x: 120, y: 180 },
      { x: 200, y: 60 },
      { x: 320, y: 60 },
      { x: 320, y: 300 },
      { x: 440, y: 300 },
      { x: 520, y: 180 },
      { x: 640, y: 180 }
    ],
    gridSize: 40,
    waterColor: '#20B2AA',
    landColor: '#6B8E23'
  },

  oxbow: {
    id: 'oxbow',
    name: 'Oxbow Lake',
    width: 640,
    height: 360,
    startBananas: 275,
    lives: 10,
    path: [
      { x: 0, y: 180 },
      { x: 80, y: 180 },
      { x: 80, y: 60 },
      { x: 560, y: 60 },
      { x: 560, y: 300 },
      { x: 80, y: 300 },
      { x: 80, y: 220 },
      { x: 480, y: 220 },
      { x: 480, y: 140 },
      { x: 160, y: 140 },
      { x: 160, y: 180 },
      { x: 640, y: 180 }
    ],
    gridSize: 40,
    waterColor: '#5F9EA0',
    landColor: '#556B2F'
  },

  waterfall: {
    id: 'waterfall',
    name: 'Waterfall',
    width: 640,
    height: 360,
    startBananas: 225,
    lives: 12,
    path: [
      { x: 0, y: 60 },
      { x: 280, y: 60 },
      { x: 320, y: 140 },
      { x: 320, y: 220 },
      { x: 360, y: 300 },
      { x: 640, y: 300 }
    ],
    gridSize: 40,
    waterColor: '#87CEEB',
    landColor: '#696969'
  },

  pond: {
    id: 'pond',
    name: 'Pond Circuit',
    width: 640,
    height: 360,
    startBananas: 250,
    lives: 10,
    path: [
      { x: 0, y: 60 },
      { x: 560, y: 60 },
      { x: 560, y: 300 },
      { x: 80, y: 300 },
      { x: 80, y: 180 },
      { x: 640, y: 180 }
    ],
    gridSize: 40,
    waterColor: '#4682B4',
    landColor: '#2E8B57'
  },

  // Advanced maps
  rapids: {
    id: 'rapids',
    name: 'Rapids',
    width: 640,
    height: 360,
    startBananas: 300,
    lives: 8,
    path: [
      { x: 0, y: 180 },
      { x: 80, y: 100 },
      { x: 160, y: 180 },
      { x: 240, y: 260 },
      { x: 320, y: 180 },
      { x: 400, y: 100 },
      { x: 480, y: 180 },
      { x: 560, y: 260 },
      { x: 640, y: 180 }
    ],
    gridSize: 40,
    waterColor: '#00BFFF',
    landColor: '#8B7355'
  },

  estuary: {
    id: 'estuary',
    name: 'Estuary',
    width: 640,
    height: 360,
    startBananas: 275,
    lives: 10,
    path: [
      { x: 0, y: 300 },
      { x: 120, y: 300 },
      { x: 120, y: 180 },
      { x: 240, y: 180 },
      { x: 240, y: 60 },
      { x: 400, y: 60 },
      { x: 400, y: 180 },
      { x: 520, y: 180 },
      { x: 520, y: 300 },
      { x: 640, y: 300 }
    ],
    gridSize: 40,
    waterColor: '#1E90FF',
    landColor: '#DAA520'
  },

  marsh: {
    id: 'marsh',
    name: 'Marsh Maze',
    width: 640,
    height: 360,
    startBananas: 350,
    lives: 6,
    path: [
      { x: 0, y: 60 },
      { x: 560, y: 60 },
      { x: 560, y: 120 },
      { x: 80, y: 120 },
      { x: 80, y: 180 },
      { x: 560, y: 180 },
      { x: 560, y: 240 },
      { x: 80, y: 240 },
      { x: 80, y: 300 },
      { x: 640, y: 300 }
    ],
    gridSize: 40,
    waterColor: '#2E8B57',
    landColor: '#6B4423'
  },

  // Expert maps
  canyon: {
    id: 'canyon',
    name: 'Canyon River',
    width: 640,
    height: 360,
    startBananas: 300,
    lives: 8,
    path: [
      { x: 0, y: 180 },
      { x: 100, y: 180 },
      { x: 100, y: 60 },
      { x: 200, y: 60 },
      { x: 200, y: 300 },
      { x: 300, y: 300 },
      { x: 300, y: 60 },
      { x: 400, y: 60 },
      { x: 400, y: 300 },
      { x: 500, y: 300 },
      { x: 500, y: 180 },
      { x: 640, y: 180 }
    ],
    gridSize: 40,
    waterColor: '#4169E1',
    landColor: '#A0522D'
  },

  whirlpool: {
    id: 'whirlpool',
    name: 'Whirlpool',
    width: 640,
    height: 360,
    startBananas: 325,
    lives: 7,
    path: [
      { x: 0, y: 180 },
      { x: 120, y: 180 },
      { x: 120, y: 60 },
      { x: 520, y: 60 },
      { x: 520, y: 300 },
      { x: 200, y: 300 },
      { x: 200, y: 140 },
      { x: 440, y: 140 },
      { x: 440, y: 220 },
      { x: 320, y: 220 },
      { x: 320, y: 180 },
      { x: 640, y: 180 }
    ],
    gridSize: 40,
    waterColor: '#1E90FF',
    landColor: '#556B2F'
  },

  ocean: {
    id: 'ocean',
    name: 'Ocean Bay',
    width: 640,
    height: 360,
    startBananas: 275,
    lives: 10,
    path: [
      { x: 0, y: 60 },
      { x: 320, y: 60 },
      { x: 320, y: 180 },
      { x: 160, y: 180 },
      { x: 160, y: 300 },
      { x: 480, y: 300 },
      { x: 480, y: 180 },
      { x: 640, y: 180 }
    ],
    gridSize: 40,
    waterColor: '#0077BE',
    landColor: '#F4A460'
  },

  glacier: {
    id: 'glacier',
    name: 'Glacier Melt',
    width: 640,
    height: 360,
    startBananas: 350,
    lives: 6,
    path: [
      { x: 0, y: 40 },
      { x: 200, y: 40 },
      { x: 200, y: 160 },
      { x: 80, y: 160 },
      { x: 80, y: 280 },
      { x: 440, y: 280 },
      { x: 440, y: 160 },
      { x: 320, y: 160 },
      { x: 320, y: 40 },
      { x: 560, y: 40 },
      { x: 560, y: 320 },
      { x: 640, y: 320 }
    ],
    gridSize: 40,
    waterColor: '#B0E0E6',
    landColor: '#E0FFFF'
  },

  volcano: {
    id: 'volcano',
    name: 'Lava Flow',
    width: 640,
    height: 360,
    startBananas: 400,
    lives: 5,
    path: [
      { x: 320, y: 0 },
      { x: 320, y: 80 },
      { x: 160, y: 140 },
      { x: 80, y: 220 },
      { x: 160, y: 300 },
      { x: 320, y: 300 },
      { x: 480, y: 300 },
      { x: 560, y: 220 },
      { x: 480, y: 140 },
      { x: 320, y: 80 },
      { x: 320, y: 360 }
    ],
    gridSize: 40,
    waterColor: '#FF4500',
    landColor: '#2F2F2F'
  }
}

// Calculate placement grid based on path
export function getPlacementGrid(map) {
  const grid = []
  const cellSize = map.gridSize
  const cols = Math.floor(map.width / cellSize)
  const rows = Math.floor(map.height / cellSize)
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellSize + cellSize / 2
      const y = row * cellSize + cellSize / 2
      
      const onPath = isOnPath(x, y, map.path, cellSize)
      
      if (!onPath) {
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
