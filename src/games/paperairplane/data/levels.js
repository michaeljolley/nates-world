// Level definitions for Paper Airplane game
// Each level has: name, description, startPosition, obstacles, goal, and room dimensions

export const levels = [
  {
    id: 1,
    name: 'Classroom',
    description: 'Escape from the classroom!',
    roomSize: { width: 12, height: 4, depth: 15 },
    startPosition: { x: 0, y: 1, z: 1 },
    goal: {
      min: { x: -1.5, y: 0.5, z: 14 },
      max: { x: 1.5, y: 3.5, z: 15.5 }
    },
    obstacles: [
      // Student desks - row 1
      { type: 'desk', position: { x: -4, y: 0, z: 4 }, size: { x: 1, y: 0.8, z: 0.8 } },
      { type: 'desk', position: { x: -1.5, y: 0, z: 4 }, size: { x: 1, y: 0.8, z: 0.8 } },
      { type: 'desk', position: { x: 1.5, y: 0, z: 4 }, size: { x: 1, y: 0.8, z: 0.8 } },
      { type: 'desk', position: { x: 4, y: 0, z: 4 }, size: { x: 1, y: 0.8, z: 0.8 } },
      // Student desks - row 2
      { type: 'desk', position: { x: -4, y: 0, z: 7 }, size: { x: 1, y: 0.8, z: 0.8 } },
      { type: 'desk', position: { x: -1.5, y: 0, z: 7 }, size: { x: 1, y: 0.8, z: 0.8 } },
      { type: 'desk', position: { x: 1.5, y: 0, z: 7 }, size: { x: 1, y: 0.8, z: 0.8 } },
      { type: 'desk', position: { x: 4, y: 0, z: 7 }, size: { x: 1, y: 0.8, z: 0.8 } },
      // Student desks - row 3
      { type: 'desk', position: { x: -4, y: 0, z: 10 }, size: { x: 1, y: 0.8, z: 0.8 } },
      { type: 'desk', position: { x: -1.5, y: 0, z: 10 }, size: { x: 1, y: 0.8, z: 0.8 } },
      { type: 'desk', position: { x: 1.5, y: 0, z: 10 }, size: { x: 1, y: 0.8, z: 0.8 } },
      { type: 'desk', position: { x: 4, y: 0, z: 10 }, size: { x: 1, y: 0.8, z: 0.8 } },
      // Ceiling lights
      { type: 'light', position: { x: -3, y: 3.8, z: 5 }, size: { x: 2, y: 0.3, z: 0.6 } },
      { type: 'light', position: { x: 3, y: 3.8, z: 5 }, size: { x: 2, y: 0.3, z: 0.6 } },
      { type: 'light', position: { x: 0, y: 3.8, z: 9 }, size: { x: 2, y: 0.3, z: 0.6 } },
      // Standing students blocking paths
      { type: 'student', position: { x: 0, y: 0, z: 5.5 }, size: { x: 0.6, y: 1.8, z: 0.5 } },
      { type: 'student', position: { x: -2.5, y: 0, z: 8.5 }, size: { x: 0.6, y: 1.8, z: 0.5 } },
      { type: 'student', position: { x: 2.5, y: 0, z: 11 }, size: { x: 0.6, y: 1.8, z: 0.5 } },
      // Backpacks scattered
      { type: 'backpack', position: { x: -3, y: 0, z: 3 }, size: { x: 0.5, y: 0.6, z: 0.4 } },
      { type: 'backpack', position: { x: 2, y: 0, z: 6 }, size: { x: 0.5, y: 0.6, z: 0.4 } },
      { type: 'backpack', position: { x: -1, y: 0, z: 9 }, size: { x: 0.5, y: 0.6, z: 0.4 } },
      // Globe on stand
      { type: 'globe', position: { x: -5, y: 0, z: 12 }, size: { x: 0.6, y: 1.6, z: 0.6 } },
      // Teacher's desk at the front
      { type: 'desk', position: { x: 4, y: 0, z: 13 }, size: { x: 2, y: 0.9, z: 1 } },
    ]
  },
  {
    id: 2,
    name: 'Hallway',
    description: 'Navigate through the busy hallway!',
    roomSize: { width: 6, height: 4, depth: 30 },
    startPosition: { x: 0, y: 1, z: 1 },
    goal: {
      min: { x: -1.5, y: 0.5, z: 29 },
      max: { x: 1.5, y: 3.5, z: 31 }
    },
    obstacles: [
      // Lockers lining both walls - left side
      { type: 'locker', position: { x: -2.5, y: 0, z: 5 }, size: { x: 0.5, y: 2.2, z: 4 } },
      { type: 'locker', position: { x: -2.5, y: 0, z: 12 }, size: { x: 0.5, y: 2.2, z: 4 } },
      { type: 'locker', position: { x: -2.5, y: 0, z: 19 }, size: { x: 0.5, y: 2.2, z: 4 } },
      { type: 'locker', position: { x: -2.5, y: 0, z: 26 }, size: { x: 0.5, y: 2.2, z: 4 } },
      // Lockers - right side
      { type: 'locker', position: { x: 2.5, y: 0, z: 8 }, size: { x: 0.5, y: 2.2, z: 4 } },
      { type: 'locker', position: { x: 2.5, y: 0, z: 15 }, size: { x: 0.5, y: 2.2, z: 4 } },
      { type: 'locker', position: { x: 2.5, y: 0, z: 22 }, size: { x: 0.5, y: 2.2, z: 4 } },
      // Open locker doors sticking out
      { type: 'locker', position: { x: -1.8, y: 0.6, z: 7 }, size: { x: 0.5, y: 1.5, z: 0.1 } },
      { type: 'locker', position: { x: 1.8, y: 0.6, z: 12 }, size: { x: 0.5, y: 1.5, z: 0.1 } },
      { type: 'locker', position: { x: -1.8, y: 0.6, z: 20 }, size: { x: 0.5, y: 1.5, z: 0.1 } },
      // Ceiling lights
      { type: 'light', position: { x: 0, y: 3.8, z: 6 }, size: { x: 1.8, y: 0.2, z: 0.5 } },
      { type: 'light', position: { x: 0, y: 3.8, z: 14 }, size: { x: 1.8, y: 0.2, z: 0.5 } },
      { type: 'light', position: { x: 0, y: 3.8, z: 22 }, size: { x: 1.8, y: 0.2, z: 0.5 } },
      // Students walking - blocking paths
      { type: 'student', position: { x: 0, y: 0, z: 10 }, size: { x: 0.6, y: 1.8, z: 0.5 } },
      { type: 'student', position: { x: -1, y: 0, z: 16 }, size: { x: 0.6, y: 1.8, z: 0.5 } },
      { type: 'student', position: { x: 1, y: 0, z: 24 }, size: { x: 0.6, y: 1.8, z: 0.5 } },
      // Water fountain
      { type: 'fountain', position: { x: -2.7, y: 1, z: 18 }, size: { x: 0.6, y: 0.7, z: 0.5 } },
      // Trash cans
      { type: 'trash', position: { x: 2, y: 0, z: 9 }, size: { x: 0.5, y: 1.1, z: 0.5 } },
      { type: 'trash', position: { x: -1.5, y: 0, z: 25 }, size: { x: 0.5, y: 1.1, z: 0.5 } },
    ]
  },
  {
    id: 3,
    name: 'Cafeteria',
    description: 'Fly over the lunch tables!',
    roomSize: { width: 20, height: 5, depth: 25 },
    startPosition: { x: 0, y: 2, z: 1 },
    goal: {
      min: { x: -2, y: 0.5, z: 24 },
      max: { x: 2, y: 4, z: 26 }
    },
    obstacles: [
      // Long cafeteria tables - rows within room
      { type: 'table', position: { x: -7, y: 0, z: 6 }, size: { x: 5, y: 1, z: 2 } },
      { type: 'table', position: { x: 0, y: 0, z: 6 }, size: { x: 5, y: 1, z: 2 } },
      { type: 'table', position: { x: 7, y: 0, z: 6 }, size: { x: 5, y: 1, z: 2 } },
      { type: 'table', position: { x: -7, y: 0, z: 12 }, size: { x: 5, y: 1, z: 2 } },
      { type: 'table', position: { x: 0, y: 0, z: 12 }, size: { x: 5, y: 1, z: 2 } },
      { type: 'table', position: { x: 7, y: 0, z: 12 }, size: { x: 5, y: 1, z: 2 } },
      { type: 'table', position: { x: -7, y: 0, z: 18 }, size: { x: 5, y: 1, z: 2 } },
      { type: 'table', position: { x: 0, y: 0, z: 18 }, size: { x: 5, y: 1, z: 2 } },
      { type: 'table', position: { x: 7, y: 0, z: 18 }, size: { x: 5, y: 1, z: 2 } },
      // Hanging lights
      { type: 'light', position: { x: -7, y: 4.8, z: 8 }, size: { x: 2, y: 0.5, z: 0.6 } },
      { type: 'light', position: { x: 0, y: 4.8, z: 8 }, size: { x: 2, y: 0.5, z: 0.6 } },
      { type: 'light', position: { x: 7, y: 4.8, z: 8 }, size: { x: 2, y: 0.5, z: 0.6 } },
      { type: 'light', position: { x: -7, y: 4.8, z: 16 }, size: { x: 2, y: 0.5, z: 0.6 } },
      { type: 'light', position: { x: 0, y: 4.8, z: 16 }, size: { x: 2, y: 0.5, z: 0.6 } },
      { type: 'light', position: { x: 7, y: 4.8, z: 16 }, size: { x: 2, y: 0.5, z: 0.6 } },
      // Support columns
      { type: 'column', position: { x: -5, y: 0, z: 10 }, size: { x: 0.8, y: 5, z: 0.8 } },
      { type: 'column', position: { x: 5, y: 0, z: 10 }, size: { x: 0.8, y: 5, z: 0.8 } },
      // Vending machines along wall
      { type: 'counter', position: { x: -9, y: 0, z: 22 }, size: { x: 1.2, y: 2.3, z: 1.5 } },
      { type: 'counter', position: { x: 9, y: 0, z: 22 }, size: { x: 1.2, y: 2.3, z: 1.5 } },
      // Students seated
      { type: 'student', position: { x: -4, y: 0, z: 6 }, size: { x: 0.6, y: 1.6, z: 0.5 } },
      { type: 'student', position: { x: 3, y: 0, z: 12 }, size: { x: 0.6, y: 1.6, z: 0.5 } },
      { type: 'student', position: { x: -2, y: 0, z: 18 }, size: { x: 0.6, y: 1.6, z: 0.5 } },
      // Trash cans
      { type: 'trash', position: { x: -3, y: 0, z: 22 }, size: { x: 0.7, y: 1.2, z: 0.7 } },
      { type: 'trash', position: { x: 3, y: 0, z: 22 }, size: { x: 0.7, y: 1.2, z: 0.7 } },
    ]
  },
  {
    id: 4,
    name: 'Olympic Gymnasium',
    description: 'Massive gym with equipment everywhere!',
    roomSize: { width: 40, height: 12, depth: 100 },
    startPosition: { x: 0, y: 6, z: 1 },
    goal: {
      min: { x: -2, y: 1, z: 98 },
      max: { x: 2, y: 8, z: 101 }
    },
    obstacles: [
      // Bleachers on sides
      { type: 'bleacher', position: { x: -18, y: 0, z: 15 }, size: { x: 3, y: 6, z: 20 } },
      { type: 'bleacher', position: { x: 18, y: 0, z: 15 }, size: { x: 3, y: 6, z: 20 } },
      { type: 'bleacher', position: { x: -18, y: 0, z: 45 }, size: { x: 3, y: 6, z: 20 } },
      { type: 'bleacher', position: { x: 18, y: 0, z: 45 }, size: { x: 3, y: 6, z: 20 } },
      { type: 'bleacher', position: { x: -18, y: 0, z: 75 }, size: { x: 3, y: 6, z: 20 } },
      { type: 'bleacher', position: { x: 18, y: 0, z: 75 }, size: { x: 3, y: 6, z: 20 } },
      // Climbing ropes
      { type: 'rope', position: { x: -10, y: 0, z: 25 }, size: { x: 0.15, y: 12, z: 0.15 } },
      { type: 'rope', position: { x: -6, y: 0, z: 25 }, size: { x: 0.15, y: 12, z: 0.15 } },
      { type: 'rope', position: { x: -2, y: 0, z: 25 }, size: { x: 0.15, y: 12, z: 0.15 } },
      { type: 'rope', position: { x: 2, y: 0, z: 25 }, size: { x: 0.15, y: 12, z: 0.15 } },
      { type: 'rope', position: { x: 6, y: 0, z: 25 }, size: { x: 0.15, y: 12, z: 0.15 } },
      { type: 'rope', position: { x: 10, y: 0, z: 25 }, size: { x: 0.15, y: 12, z: 0.15 } },
      // More climbing ropes
      { type: 'rope', position: { x: -8, y: 0, z: 55 }, size: { x: 0.15, y: 12, z: 0.15 } },
      { type: 'rope', position: { x: -4, y: 0, z: 55 }, size: { x: 0.15, y: 12, z: 0.15 } },
      { type: 'rope', position: { x: 0, y: 0, z: 55 }, size: { x: 0.15, y: 12, z: 0.15 } },
      { type: 'rope', position: { x: 4, y: 0, z: 55 }, size: { x: 0.15, y: 12, z: 0.15 } },
      { type: 'rope', position: { x: 8, y: 0, z: 55 }, size: { x: 0.15, y: 12, z: 0.15 } },
      // Volleyball nets
      { type: 'net', position: { x: 0, y: 1.5, z: 35 }, size: { x: 24, y: 3, z: 0.08 } },
      { type: 'column', position: { x: -12, y: 0, z: 35 }, size: { x: 0.2, y: 4.5, z: 0.2 } },
      { type: 'column', position: { x: 12, y: 0, z: 35 }, size: { x: 0.2, y: 4.5, z: 0.2 } },
      { type: 'net', position: { x: 0, y: 1.5, z: 70 }, size: { x: 24, y: 3, z: 0.08 } },
      { type: 'column', position: { x: -12, y: 0, z: 70 }, size: { x: 0.2, y: 4.5, z: 0.2 } },
      { type: 'column', position: { x: 12, y: 0, z: 70 }, size: { x: 0.2, y: 4.5, z: 0.2 } },
      // Ball carts
      { type: 'cart', position: { x: -14, y: 0, z: 40 }, size: { x: 1.5, y: 1.6, z: 1.5 } },
      { type: 'cart', position: { x: 14, y: 0, z: 60 }, size: { x: 1.5, y: 1.6, z: 1.5 } },
      // Gymnastics equipment
      { type: 'cart', position: { x: -8, y: 0, z: 80 }, size: { x: 1, y: 1.5, z: 2 } },
      { type: 'cart', position: { x: 8, y: 0, z: 80 }, size: { x: 1, y: 1.5, z: 2 } },
      // Wrestling mats
      { type: 'mat', position: { x: -10, y: 0, z: 90 }, size: { x: 3, y: 1.5, z: 4 } },
      { type: 'mat', position: { x: 10, y: 0, z: 90 }, size: { x: 3, y: 1.5, z: 4 } },
      // Scoreboards
      { type: 'scoreboard', position: { x: 0, y: 9, z: 5 }, size: { x: 8, y: 2, z: 0.4 } },
      { type: 'scoreboard', position: { x: 0, y: 9, z: 50 }, size: { x: 8, y: 2, z: 0.4 } },
      // PE teacher stations
      { type: 'desk', position: { x: -14, y: 0, z: 10 }, size: { x: 2, y: 1.2, z: 1.5 } },
      { type: 'desk', position: { x: 14, y: 0, z: 85 }, size: { x: 2, y: 1.2, z: 1.5 } },
      // Cone stacks
      { type: 'cone', position: { x: -12, y: 0, z: 50 }, size: { x: 0.6, y: 1.4, z: 0.6 } },
      { type: 'cone', position: { x: 12, y: 0, z: 30 }, size: { x: 0.6, y: 1.4, z: 0.6 } },
      { type: 'cone', position: { x: -5, y: 0, z: 65 }, size: { x: 0.6, y: 1.4, z: 0.6 } },
      { type: 'cone', position: { x: 5, y: 0, z: 45 }, size: { x: 0.6, y: 1.4, z: 0.6 } },
      // Stacked chairs
      { type: 'chair', position: { x: -15, y: 0, z: 8 }, size: { x: 1.2, y: 2.5, z: 1.8 } },
      { type: 'chair', position: { x: 15, y: 0, z: 92 }, size: { x: 1.2, y: 2.5, z: 1.8 } },
      // Exit signs
      { type: 'light', position: { x: 0, y: 10.5, z: 95 }, size: { x: 1.2, y: 0.5, z: 0.25 } },
    ]
  },
  {
    id: 5,
    name: 'Grand Library',
    description: 'Navigate the endless maze of bookshelves!',
    roomSize: { width: 28, height: 6, depth: 90 },
    startPosition: { x: 0, y: 4, z: 1 },
    goal: {
      min: { x: -1.5, y: 0.5, z: 88 },
      max: { x: 1.5, y: 5, z: 91 }
    },
    obstacles: [
      // Massive bookshelves creating maze - left section
      { type: 'bookshelf', position: { x: -10, y: 0, z: 8 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: -6, y: 0, z: 8 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: -2, y: 0, z: 8 }, size: { x: 1, y: 4.5, z: 10 } },
      // Right section
      { type: 'bookshelf', position: { x: 2, y: 0, z: 8 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 6, y: 0, z: 8 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 10, y: 0, z: 8 }, size: { x: 1, y: 4.5, z: 10 } },
      // Second row offset
      { type: 'bookshelf', position: { x: -8, y: 0, z: 22 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: -4, y: 0, z: 22 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 0, y: 0, z: 22 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 4, y: 0, z: 22 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 8, y: 0, z: 22 }, size: { x: 1, y: 4.5, z: 10 } },
      // Third row
      { type: 'bookshelf', position: { x: -10, y: 0, z: 36 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: -6, y: 0, z: 36 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: -2, y: 0, z: 36 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 2, y: 0, z: 36 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 6, y: 0, z: 36 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 10, y: 0, z: 36 }, size: { x: 1, y: 4.5, z: 10 } },
      // Fourth row offset
      { type: 'bookshelf', position: { x: -8, y: 0, z: 50 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: -4, y: 0, z: 50 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 0, y: 0, z: 50 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 4, y: 0, z: 50 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 8, y: 0, z: 50 }, size: { x: 1, y: 4.5, z: 10 } },
      // Fifth row
      { type: 'bookshelf', position: { x: -10, y: 0, z: 64 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: -6, y: 0, z: 64 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: -2, y: 0, z: 64 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 2, y: 0, z: 64 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 6, y: 0, z: 64 }, size: { x: 1, y: 4.5, z: 10 } },
      { type: 'bookshelf', position: { x: 10, y: 0, z: 64 }, size: { x: 1, y: 4.5, z: 10 } },
      // Hanging lights
      { type: 'light', position: { x: -8, y: 5.3, z: 15 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: 0, y: 5.3, z: 15 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: 8, y: 5.3, z: 15 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: -8, y: 5.3, z: 30 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: 0, y: 5.3, z: 30 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: 8, y: 5.3, z: 30 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: -8, y: 5.3, z: 45 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: 0, y: 5.3, z: 45 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: 8, y: 5.3, z: 45 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: -8, y: 5.3, z: 60 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: 0, y: 5.3, z: 60 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: 8, y: 5.3, z: 60 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: -8, y: 5.3, z: 75 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: 0, y: 5.3, z: 75 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      { type: 'light', position: { x: 8, y: 5.3, z: 75 }, size: { x: 1.5, y: 0.4, z: 0.5 } },
      // Study tables in gaps
      { type: 'table', position: { x: -12, y: 0, z: 18 }, size: { x: 2.5, y: 0.9, z: 2.5 } },
      { type: 'table', position: { x: 12, y: 0, z: 18 }, size: { x: 2.5, y: 0.9, z: 2.5 } },
      { type: 'table', position: { x: -12, y: 0, z: 45 }, size: { x: 2.5, y: 0.9, z: 2.5 } },
      { type: 'table', position: { x: 12, y: 0, z: 45 }, size: { x: 2.5, y: 0.9, z: 2.5 } },
      { type: 'table', position: { x: -12, y: 0, z: 72 }, size: { x: 2.5, y: 0.9, z: 2.5 } },
      { type: 'table', position: { x: 12, y: 0, z: 72 }, size: { x: 2.5, y: 0.9, z: 2.5 } },
      // Librarian's main desk
      { type: 'desk', position: { x: 0, y: 0, z: 82 }, size: { x: 4, y: 1.2, z: 2 } },
      { type: 'student', position: { x: 0, y: 0, z: 84 }, size: { x: 0.7, y: 1.8, z: 0.6 } },
      // Globes
      { type: 'globe', position: { x: -12, y: 0, z: 5 }, size: { x: 0.7, y: 1.7, z: 0.7 } },
      { type: 'globe', position: { x: 12, y: 0, z: 85 }, size: { x: 0.7, y: 1.7, z: 0.7 } },
      // Students reading
      { type: 'student', position: { x: -12, y: 0, z: 18 }, size: { x: 0.6, y: 1.5, z: 0.5 } },
      { type: 'student', position: { x: 12, y: 0, z: 45 }, size: { x: 0.6, y: 1.5, z: 0.5 } },
      { type: 'student', position: { x: -4, y: 0, z: 30 }, size: { x: 0.6, y: 1.7, z: 0.5 } },
      { type: 'student', position: { x: 4, y: 0, z: 58 }, size: { x: 0.6, y: 1.7, z: 0.5 } },
      // Computer stations
      { type: 'desk', position: { x: -12, y: 0, z: 60 }, size: { x: 2, y: 0.9, z: 1.2 } },
      { type: 'computer', position: { x: -12, y: 0.9, z: 60 }, size: { x: 0.5, y: 0.6, z: 0.4 } },
      { type: 'desk', position: { x: 12, y: 0, z: 30 }, size: { x: 2, y: 0.9, z: 1.2 } },
      { type: 'computer', position: { x: 12, y: 0.9, z: 30 }, size: { x: 0.5, y: 0.6, z: 0.4 } },
    ]
  },
  {
    id: 6,
    name: 'Grand Auditorium',
    description: 'Fly over the seats to reach the stage!',
    roomSize: { width: 35, height: 14, depth: 100 },
    startPosition: { x: 0, y: 8, z: 1 },
    goal: {
      min: { x: -2, y: 2, z: 98 },
      max: { x: 2, y: 10, z: 101 }
    },
    obstacles: [
      // Rows upon rows of theater seats - section 1
      { type: 'bleacher', position: { x: -12, y: 0, z: 10 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: -12, y: 0.3, z: 13 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: -12, y: 0.6, z: 16 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: -12, y: 0.9, z: 19 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: -12, y: 1.2, z: 22 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: -12, y: 1.5, z: 25 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: -12, y: 1.8, z: 28 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: -12, y: 2.1, z: 31 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: -12, y: 2.4, z: 34 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: -12, y: 2.7, z: 37 }, size: { x: 22, y: 1.2, z: 1.5 } },
      // Section 2
      { type: 'bleacher', position: { x: 12, y: 0, z: 10 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 0.3, z: 13 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 0.6, z: 16 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 0.9, z: 19 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 1.2, z: 22 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 1.5, z: 25 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 1.8, z: 28 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 2.1, z: 31 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 2.4, z: 34 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 2.7, z: 37 }, size: { x: 22, y: 1.2, z: 1.5 } },
      // More rows - section 3
      { type: 'bleacher', position: { x: -12, y: 3, z: 42 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: -12, y: 3.3, z: 45 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: -12, y: 3.6, z: 48 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: -12, y: 3.9, z: 51 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: -12, y: 4.2, z: 54 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 3, z: 42 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 3.3, z: 45 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 3.6, z: 48 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 3.9, z: 51 }, size: { x: 22, y: 1.2, z: 1.5 } },
      { type: 'bleacher', position: { x: 12, y: 4.2, z: 54 }, size: { x: 22, y: 1.2, z: 1.5 } },
      // Chandeliers
      { type: 'chandelier', position: { x: -10, y: 10, z: 25 }, size: { x: 3, y: 3, z: 3 } },
      { type: 'chandelier', position: { x: 10, y: 10, z: 25 }, size: { x: 3, y: 3, z: 3 } },
      { type: 'chandelier', position: { x: 0, y: 11, z: 45 }, size: { x: 4, y: 4, z: 4 } },
      { type: 'chandelier', position: { x: -10, y: 10, z: 65 }, size: { x: 3, y: 3, z: 3 } },
      { type: 'chandelier', position: { x: 10, y: 10, z: 65 }, size: { x: 3, y: 3, z: 3 } },
      // Support columns
      { type: 'column', position: { x: -15, y: 0, z: 20 }, size: { x: 1.2, y: 14, z: 1.2 } },
      { type: 'column', position: { x: 15, y: 0, z: 20 }, size: { x: 1.2, y: 14, z: 1.2 } },
      { type: 'column', position: { x: -15, y: 0, z: 50 }, size: { x: 1.2, y: 14, z: 1.2 } },
      { type: 'column', position: { x: 15, y: 0, z: 50 }, size: { x: 1.2, y: 14, z: 1.2 } },
      // Stage at the end
      { type: 'counter', position: { x: 0, y: 0, z: 85 }, size: { x: 25, y: 2.5, z: 12 } },
      // Curtains on sides of stage
      { type: 'curtain', position: { x: -14, y: 2.5, z: 92 }, size: { x: 2, y: 10, z: 5 } },
      { type: 'curtain', position: { x: 14, y: 2.5, z: 92 }, size: { x: 2, y: 10, z: 5 } },
      // Microphone stands on stage
      { type: 'rack', position: { x: -5, y: 2.5, z: 88 }, size: { x: 0.25, y: 2, z: 0.25 } },
      { type: 'rack', position: { x: 0, y: 2.5, z: 90 }, size: { x: 0.25, y: 2, z: 0.25 } },
      { type: 'rack', position: { x: 5, y: 2.5, z: 88 }, size: { x: 0.25, y: 2, z: 0.25 } },
      // Piano on stage
      { type: 'counter', position: { x: -8, y: 2.5, z: 92 }, size: { x: 2.5, y: 1.2, z: 3 } },
    ]
  }
]

// Color palette for obstacle types
export const obstacleColors = {
  desk: 0x8B4513,
  locker: 0x4169E1,
  light: 0xFFFFE0,
  globe: 0x228B22,
  fountain: 0xADD8E6,
  student: 0xFFDBB4,
  table: 0xD2691E,
  counter: 0x808080,
  rack: 0xC0C0C0,
  hoop: 0xFF4500,
  backboard: 0xFFFFFF,
  bleacher: 0x8B0000,
  rope: 0xDEB887,
  net: 0xF5F5F5,
  trophy: 0xFFD700,
  bench: 0x654321,
  column: 0xD3D3D3,
  chandelier: 0xFFD700,
  frame: 0x8B4513,
  bookshelf: 0x5C4033,
  chair: 0x6B4423,
  trash: 0x2F4F4F,
  bulletin: 0xCD853F,
  scoreboard: 0x1C1C1C,
  cart: 0x696969,
  mat: 0x4169E1,
  curtain: 0x8B0000,
  plant: 0x228B22,
  flag: 0xB8860B,
  cone: 0xFF6600,
  computer: 0x333333,
  whiteboard: 0xFFFFF0,
  clock: 0x222222,
  backpack: 0x4682B4,
  extinguisher: 0xFF0000,
}
