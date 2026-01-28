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
