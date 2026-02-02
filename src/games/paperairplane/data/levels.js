// Level definitions for Paper Airplane game
// Each level has: name, description, startPosition, obstacles, goal, and room dimensions

export const levels = [
  {
    id: 1,
    name: 'Classroom',
    description: 'Escape from the classroom!',
    roomSize: { width: 12, height: 4, depth: 15 },
    startPosition: { x: 0, y: 2, z: 1 },
    goal: {
      min: { x: -1.5, y: 0.5, z: 14 },
      max: { x: 1.5, y: 3.5, z: 15.5 }
    },
    obstacles: [
      // Teacher's desk at front with computer
      { type: 'desk', position: { x: 0, y: 0, z: 12.5 }, size: { x: 1.8, y: 0.75, z: 0.9 } },
      { type: 'computer', position: { x: 0.3, y: 0.75, z: 12.5 }, size: { x: 0.4, y: 0.5, z: 0.3 } },
      // Teacher's chair
      { type: 'chair', position: { x: 0, y: 0, z: 13.3 }, size: { x: 0.5, y: 1.1, z: 0.5 } },
      // Student desks with attached chairs - row 1
      { type: 'desk', position: { x: -3.5, y: 0, z: 3 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      { type: 'desk', position: { x: -1.2, y: 0, z: 3 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      { type: 'desk', position: { x: 1.2, y: 0, z: 3 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      { type: 'desk', position: { x: 3.5, y: 0, z: 3 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      // Student desks - row 2
      { type: 'desk', position: { x: -3.5, y: 0, z: 5.5 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      { type: 'desk', position: { x: -1.2, y: 0, z: 5.5 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      { type: 'desk', position: { x: 1.2, y: 0, z: 5.5 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      { type: 'desk', position: { x: 3.5, y: 0, z: 5.5 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      // Student desks - row 3
      { type: 'desk', position: { x: -3.5, y: 0, z: 8 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      { type: 'desk', position: { x: -1.2, y: 0, z: 8 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      { type: 'desk', position: { x: 1.2, y: 0, z: 8 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      { type: 'desk', position: { x: 3.5, y: 0, z: 8 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      // Student desks - row 4
      { type: 'desk', position: { x: -3.5, y: 0, z: 10.5 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      { type: 'desk', position: { x: -1.2, y: 0, z: 10.5 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      { type: 'desk', position: { x: 1.2, y: 0, z: 10.5 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      { type: 'desk', position: { x: 3.5, y: 0, z: 10.5 }, size: { x: 0.8, y: 0.75, z: 0.6 } },
      // Fluorescent ceiling lights - lower and bigger
      { type: 'light', position: { x: -2.5, y: 3.5, z: 5 }, size: { x: 1.5, y: 0.2, z: 0.5 } },
      { type: 'light', position: { x: 2.5, y: 3.5, z: 5 }, size: { x: 1.5, y: 0.2, z: 0.5 } },
      { type: 'light', position: { x: -2.5, y: 3.5, z: 10 }, size: { x: 1.5, y: 0.2, z: 0.5 } },
      { type: 'light', position: { x: 2.5, y: 3.5, z: 10 }, size: { x: 1.5, y: 0.2, z: 0.5 } },
      { type: 'light', position: { x: 0, y: 3.5, z: 7.5 }, size: { x: 1.5, y: 0.2, z: 0.5 } },
      // Whiteboard on front wall
      { type: 'whiteboard', position: { x: 0, y: 1.5, z: 14.8 }, size: { x: 4, y: 1.2, z: 0.1 } },
      // Wall clock
      { type: 'clock', position: { x: 4.5, y: 3, z: 14.8 }, size: { x: 0.4, y: 0.4, z: 0.1 } },
      // Bookshelf in corner - taller
      { type: 'bookshelf', position: { x: 5.5, y: 0, z: 2 }, size: { x: 0.8, y: 2.2, z: 1.8 } },
      // Globe on stand near teacher
      { type: 'globe', position: { x: -5, y: 0, z: 12 }, size: { x: 0.5, y: 1.4, z: 0.5 } },
      // Backpacks on floor by desks - more of them
      { type: 'backpack', position: { x: -4.2, y: 0, z: 3.5 }, size: { x: 0.4, y: 0.55, z: 0.3 } },
      { type: 'backpack', position: { x: 2, y: 0, z: 6 }, size: { x: 0.4, y: 0.55, z: 0.3 } },
      { type: 'backpack', position: { x: -0.5, y: 0, z: 8.5 }, size: { x: 0.4, y: 0.55, z: 0.3 } },
      { type: 'backpack', position: { x: 4, y: 0, z: 11 }, size: { x: 0.4, y: 0.55, z: 0.3 } },
      // Trash can
      { type: 'trash', position: { x: 5.2, y: 0, z: 13 }, size: { x: 0.4, y: 0.7, z: 0.4 } },
      // American flag in corner - taller
      { type: 'flag', position: { x: -5.5, y: 0, z: 14 }, size: { x: 0.1, y: 3, z: 0.1 } },
      // Projector hanging from ceiling
      { type: 'light', position: { x: 0, y: 3.2, z: 11 }, size: { x: 0.5, y: 0.4, z: 0.6 } },
      // Student standing near door
      { type: 'student', position: { x: -2, y: 0, z: 13.5 }, size: { x: 0.5, y: 1.6, z: 0.4 } },
    ]
  },
  {
    id: 2,
    name: 'Hallway',
    description: 'Navigate through the busy hallway!',
    roomSize: { width: 6, height: 4, depth: 30 },
    startPosition: { x: 0, y: 2, z: 1 },
    goal: {
      min: { x: -1.5, y: 0.5, z: 29 },
      max: { x: 1.5, y: 3.5, z: 31 }
    },
    obstacles: [
      // Metal lockers lining left wall
      { type: 'locker', position: { x: -2.7, y: 0, z: 2 }, size: { x: 0.4, y: 1.9, z: 3 } },
      { type: 'locker', position: { x: -2.7, y: 0, z: 6 }, size: { x: 0.4, y: 1.9, z: 3 } },
      { type: 'locker', position: { x: -2.7, y: 0, z: 10 }, size: { x: 0.4, y: 1.9, z: 3 } },
      { type: 'locker', position: { x: -2.7, y: 0, z: 16 }, size: { x: 0.4, y: 1.9, z: 3 } },
      { type: 'locker', position: { x: -2.7, y: 0, z: 22 }, size: { x: 0.4, y: 1.9, z: 3 } },
      { type: 'locker', position: { x: -2.7, y: 0, z: 27 }, size: { x: 0.4, y: 1.9, z: 3 } },
      // Metal lockers lining right wall
      { type: 'locker', position: { x: 2.7, y: 0, z: 4 }, size: { x: 0.4, y: 1.9, z: 3 } },
      { type: 'locker', position: { x: 2.7, y: 0, z: 8 }, size: { x: 0.4, y: 1.9, z: 3 } },
      { type: 'locker', position: { x: 2.7, y: 0, z: 13 }, size: { x: 0.4, y: 1.9, z: 3 } },
      { type: 'locker', position: { x: 2.7, y: 0, z: 19 }, size: { x: 0.4, y: 1.9, z: 3 } },
      { type: 'locker', position: { x: 2.7, y: 0, z: 25 }, size: { x: 0.4, y: 1.9, z: 3 } },
      // Water fountain recessed in wall
      { type: 'fountain', position: { x: -2.5, y: 0.9, z: 14 }, size: { x: 0.5, y: 0.6, z: 0.4 } },
      // Fluorescent ceiling lights - lower
      { type: 'light', position: { x: 0, y: 3.6, z: 4 }, size: { x: 1.4, y: 0.15, z: 0.4 } },
      { type: 'light', position: { x: 0, y: 3.6, z: 10 }, size: { x: 1.4, y: 0.15, z: 0.4 } },
      { type: 'light', position: { x: 0, y: 3.6, z: 16 }, size: { x: 1.4, y: 0.15, z: 0.4 } },
      { type: 'light', position: { x: 0, y: 3.6, z: 22 }, size: { x: 1.4, y: 0.15, z: 0.4 } },
      { type: 'light', position: { x: 0, y: 3.6, z: 28 }, size: { x: 1.4, y: 0.15, z: 0.4 } },
      // Students walking/standing - more students
      { type: 'student', position: { x: 0.8, y: 0, z: 5 }, size: { x: 0.5, y: 1.7, z: 0.4 } },
      { type: 'student', position: { x: -0.6, y: 0, z: 9 }, size: { x: 0.5, y: 1.7, z: 0.4 } },
      { type: 'student', position: { x: 0.4, y: 0, z: 14 }, size: { x: 0.5, y: 1.7, z: 0.4 } },
      { type: 'student', position: { x: -0.9, y: 0, z: 19 }, size: { x: 0.5, y: 1.7, z: 0.4 } },
      { type: 'student', position: { x: 0.7, y: 0, z: 24 }, size: { x: 0.5, y: 1.7, z: 0.4 } },
      { type: 'student', position: { x: -0.3, y: 0, z: 27 }, size: { x: 0.5, y: 1.7, z: 0.4 } },
      // Janitor with mop bucket
      { type: 'student', position: { x: 1.5, y: 0, z: 11 }, size: { x: 0.5, y: 1.8, z: 0.4 } },
      { type: 'trash', position: { x: 1.8, y: 0, z: 10.5 }, size: { x: 0.6, y: 0.7, z: 0.6 } },
      // Recycling bins
      { type: 'trash', position: { x: -1.8, y: 0, z: 20 }, size: { x: 0.45, y: 1, z: 0.45 } },
      { type: 'trash', position: { x: -1.2, y: 0, z: 20 }, size: { x: 0.45, y: 1, z: 0.45 } },
      // Bulletin boards on walls - bigger
      { type: 'bulletin', position: { x: -2.5, y: 2, z: 21 }, size: { x: 0.2, y: 1.1, z: 2 } },
      { type: 'bulletin', position: { x: 2.5, y: 2, z: 17 }, size: { x: 0.2, y: 1.1, z: 2 } },
      // Fire extinguisher on wall
      { type: 'extinguisher', position: { x: 2.8, y: 1.2, z: 7 }, size: { x: 0.25, y: 0.6, z: 0.2 } },
      // Exit sign
      { type: 'light', position: { x: 0, y: 3.4, z: 29 }, size: { x: 0.7, y: 0.3, z: 0.15 } },
      // Open locker doors sticking out - more of them
      { type: 'locker', position: { x: -2.2, y: 0.5, z: 7 }, size: { x: 0.4, y: 1.3, z: 0.08 } },
      { type: 'locker', position: { x: 2.2, y: 0.6, z: 15 }, size: { x: 0.4, y: 1.2, z: 0.08 } },
      { type: 'locker', position: { x: -2.2, y: 0.5, z: 23 }, size: { x: 0.4, y: 1.3, z: 0.08 } },
    ]
  },
  {
    id: 3,
    name: 'Cafeteria',
    description: 'Fly over the lunch tables!',
    roomSize: { width: 20, height: 5, depth: 25 },
    startPosition: { x: 0, y: 3, z: 1 },
    goal: {
      min: { x: -2, y: 0.5, z: 24 },
      max: { x: 2, y: 4, z: 26 }
    },
    obstacles: [
      // Long cafeteria tables - row 1
      { type: 'table', position: { x: -6, y: 0, z: 5 }, size: { x: 5, y: 0.9, z: 1.6 } },
      { type: 'table', position: { x: 0, y: 0, z: 5 }, size: { x: 5, y: 0.9, z: 1.6 } },
      { type: 'table', position: { x: 6, y: 0, z: 5 }, size: { x: 5, y: 0.9, z: 1.6 } },
      // Long cafeteria tables - row 2
      { type: 'table', position: { x: -6, y: 0, z: 9 }, size: { x: 5, y: 0.9, z: 1.6 } },
      { type: 'table', position: { x: 0, y: 0, z: 9 }, size: { x: 5, y: 0.9, z: 1.6 } },
      { type: 'table', position: { x: 6, y: 0, z: 9 }, size: { x: 5, y: 0.9, z: 1.6 } },
      // Long cafeteria tables - row 3
      { type: 'table', position: { x: -6, y: 0, z: 13 }, size: { x: 5, y: 0.9, z: 1.6 } },
      { type: 'table', position: { x: 0, y: 0, z: 13 }, size: { x: 5, y: 0.9, z: 1.6 } },
      { type: 'table', position: { x: 6, y: 0, z: 13 }, size: { x: 5, y: 0.9, z: 1.6 } },
      // Long cafeteria tables - row 4
      { type: 'table', position: { x: -6, y: 0, z: 17 }, size: { x: 5, y: 0.9, z: 1.6 } },
      { type: 'table', position: { x: 0, y: 0, z: 17 }, size: { x: 5, y: 0.9, z: 1.6 } },
      { type: 'table', position: { x: 6, y: 0, z: 17 }, size: { x: 5, y: 0.9, z: 1.6 } },
      // Hanging lights - grid pattern, lower
      { type: 'light', position: { x: -6, y: 4.2, z: 7 }, size: { x: 1.8, y: 0.5, z: 0.5 } },
      { type: 'light', position: { x: 0, y: 4.2, z: 7 }, size: { x: 1.8, y: 0.5, z: 0.5 } },
      { type: 'light', position: { x: 6, y: 4.2, z: 7 }, size: { x: 1.8, y: 0.5, z: 0.5 } },
      { type: 'light', position: { x: -6, y: 4.2, z: 15 }, size: { x: 1.8, y: 0.5, z: 0.5 } },
      { type: 'light', position: { x: 0, y: 4.2, z: 15 }, size: { x: 1.8, y: 0.5, z: 0.5 } },
      { type: 'light', position: { x: 6, y: 4.2, z: 15 }, size: { x: 1.8, y: 0.5, z: 0.5 } },
      { type: 'light', position: { x: -3, y: 4.2, z: 11 }, size: { x: 1.8, y: 0.5, z: 0.5 } },
      { type: 'light', position: { x: 3, y: 4.2, z: 11 }, size: { x: 1.8, y: 0.5, z: 0.5 } },
      // Serving counter - larger
      { type: 'counter', position: { x: 8, y: 0, z: 21 }, size: { x: 3, y: 1.3, z: 6 } },
      // Salad bar
      { type: 'counter', position: { x: -8, y: 0, z: 21 }, size: { x: 3, y: 1.3, z: 4 } },
      // Tray racks - taller
      { type: 'rack', position: { x: -8, y: 0, z: 3 }, size: { x: 1.2, y: 1.8, z: 1.2 } },
      { type: 'rack', position: { x: 8, y: 0, z: 3 }, size: { x: 1.2, y: 1.8, z: 1.2 } },
      // Pillars/columns
      { type: 'column', position: { x: -4, y: 0, z: 11 }, size: { x: 0.7, y: 5, z: 0.7 } },
      { type: 'column', position: { x: 4, y: 0, z: 11 }, size: { x: 0.7, y: 5, z: 0.7 } },
      // Standing lunch lady
      { type: 'student', position: { x: 6, y: 0, z: 21 }, size: { x: 0.7, y: 1.8, z: 0.7 } },
      // Students sitting at tables
      { type: 'student', position: { x: -2, y: 0, z: 5 }, size: { x: 0.5, y: 1.5, z: 0.4 } },
      { type: 'student', position: { x: 3, y: 0, z: 9 }, size: { x: 0.5, y: 1.5, z: 0.4 } },
      { type: 'student', position: { x: -5, y: 0, z: 13 }, size: { x: 0.5, y: 1.5, z: 0.4 } },
      { type: 'student', position: { x: 1, y: 0, z: 17 }, size: { x: 0.5, y: 1.5, z: 0.4 } },
      // Trash cans near exit - bigger
      { type: 'trash', position: { x: -3, y: 0, z: 22 }, size: { x: 0.7, y: 1.2, z: 0.7 } },
      { type: 'trash', position: { x: 3, y: 0, z: 22 }, size: { x: 0.7, y: 1.2, z: 0.7 } },
      // Vending machines
      { type: 'counter', position: { x: -9, y: 0, z: 10 }, size: { x: 1, y: 2, z: 1.5 } },
      { type: 'counter', position: { x: 9, y: 0, z: 14 }, size: { x: 1, y: 2, z: 1.5 } },
      // Milk crates stacked
      { type: 'rack', position: { x: 5, y: 0, z: 20 }, size: { x: 0.8, y: 1, z: 0.8 } },
    ]
  },
  {
    id: 4,
    name: 'Gymnasium',
    description: 'Dodge the hoops and bleachers!',
    roomSize: { width: 25, height: 8, depth: 35 },
    startPosition: { x: 0, y: 4, z: 1 },
    goal: {
      min: { x: -2, y: 1, z: 34 },
      max: { x: 2, y: 5, z: 36 }
    },
    obstacles: [
      // Folded bleachers against walls
      { type: 'bleacher', position: { x: -11.5, y: 0, z: 10 }, size: { x: 2, y: 4, z: 12 } },
      { type: 'bleacher', position: { x: 11.5, y: 0, z: 10 }, size: { x: 2, y: 4, z: 12 } },
      { type: 'bleacher', position: { x: -11.5, y: 0, z: 26 }, size: { x: 2, y: 4, z: 8 } },
      { type: 'bleacher', position: { x: 11.5, y: 0, z: 26 }, size: { x: 2, y: 4, z: 8 } },
      // Climbing ropes hanging from ceiling
      { type: 'rope', position: { x: -6, y: 0, z: 15 }, size: { x: 0.1, y: 8, z: 0.1 } },
      { type: 'rope', position: { x: -3, y: 0, z: 15 }, size: { x: 0.1, y: 8, z: 0.1 } },
      { type: 'rope', position: { x: 0, y: 0, z: 15 }, size: { x: 0.1, y: 8, z: 0.1 } },
      { type: 'rope', position: { x: 3, y: 0, z: 15 }, size: { x: 0.1, y: 8, z: 0.1 } },
      { type: 'rope', position: { x: 6, y: 0, z: 15 }, size: { x: 0.1, y: 8, z: 0.1 } },
      // Volleyball net across the gym
      { type: 'net', position: { x: 0, y: 1.2, z: 22 }, size: { x: 16, y: 2.4, z: 0.05 } },
      // Net poles
      { type: 'column', position: { x: -8, y: 0, z: 22 }, size: { x: 0.15, y: 3.6, z: 0.15 } },
      { type: 'column', position: { x: 8, y: 0, z: 22 }, size: { x: 0.15, y: 3.6, z: 0.15 } },
      // Scoreboard on wall
      { type: 'scoreboard', position: { x: 0, y: 6, z: 1 }, size: { x: 5, y: 1.5, z: 0.3 } },
      // Ball cart with basketballs
      { type: 'cart', position: { x: -9, y: 0, z: 20 }, size: { x: 1.2, y: 1.4, z: 1.2 } },
      // Folded wrestling mats against wall
      { type: 'mat', position: { x: 9, y: 0, z: 32 }, size: { x: 2, y: 1.2, z: 3 } },
      // Gymnastics vault horse
      { type: 'cart', position: { x: -4, y: 0, z: 28 }, size: { x: 0.8, y: 1.3, z: 1.6 } },
      // Stack of folding chairs
      { type: 'chair', position: { x: 8, y: 0, z: 6 }, size: { x: 1, y: 2, z: 1.5 } },
      // PE teacher's desk/station
      { type: 'desk', position: { x: -9, y: 0, z: 5 }, size: { x: 1.5, y: 1, z: 1 } },
      // Cone stack
      { type: 'cone', position: { x: 7, y: 0, z: 18 }, size: { x: 0.5, y: 1.2, z: 0.5 } },
      // Water fountain on wall
      { type: 'fountain', position: { x: -12, y: 1, z: 17 }, size: { x: 0.5, y: 0.8, z: 0.4 } },
      // Exit sign hanging
      { type: 'light', position: { x: 0, y: 7, z: 33 }, size: { x: 1, y: 0.4, z: 0.2 } },
    ]
  },
  {
    id: 5,
    name: 'Exit Hall',
    description: 'Freedom awaits! Fly out the window!',
    roomSize: { width: 10, height: 5, depth: 20 },
    startPosition: { x: 0, y: 3, z: 1 },
    goal: {
      min: { x: -1.5, y: 2, z: 19 },
      max: { x: 1.5, y: 4.5, z: 21 }
    },
    obstacles: [
      // Trophy cases on sides - more of them
      { type: 'trophy', position: { x: -4, y: 0, z: 3 }, size: { x: 1.5, y: 2, z: 1.5 } },
      { type: 'trophy', position: { x: 4, y: 0, z: 3 }, size: { x: 1.5, y: 2, z: 1.5 } },
      { type: 'trophy', position: { x: -4, y: 0, z: 7 }, size: { x: 1.5, y: 2, z: 1.5 } },
      { type: 'trophy', position: { x: 4, y: 0, z: 7 }, size: { x: 1.5, y: 2, z: 1.5 } },
      { type: 'trophy', position: { x: -4, y: 0, z: 11 }, size: { x: 1.5, y: 2, z: 1.5 } },
      { type: 'trophy', position: { x: 4, y: 0, z: 11 }, size: { x: 1.5, y: 2, z: 1.5 } },
      // Benches in center
      { type: 'bench', position: { x: -1.5, y: 0, z: 5 }, size: { x: 1, y: 0.5, z: 2.5 } },
      { type: 'bench', position: { x: 1.5, y: 0, z: 5 }, size: { x: 1, y: 0.5, z: 2.5 } },
      { type: 'bench', position: { x: -1.5, y: 0, z: 9 }, size: { x: 1, y: 0.5, z: 2.5 } },
      { type: 'bench', position: { x: 1.5, y: 0, z: 9 }, size: { x: 1, y: 0.5, z: 2.5 } },
      // Columns - blocking path
      { type: 'column', position: { x: -2.5, y: 0, z: 14 }, size: { x: 0.8, y: 5, z: 0.8 } },
      { type: 'column', position: { x: 2.5, y: 0, z: 14 }, size: { x: 0.8, y: 5, z: 0.8 } },
      { type: 'column', position: { x: 0, y: 0, z: 17 }, size: { x: 0.8, y: 5, z: 0.8 } },
      // Chandeliers - multiple
      { type: 'chandelier', position: { x: 0, y: 3.8, z: 5 }, size: { x: 1.5, y: 1.2, z: 1.5 } },
      { type: 'chandelier', position: { x: 0, y: 3.8, z: 12 }, size: { x: 2, y: 1.5, z: 2 } },
      // Window frame (goal is the opening) - tighter
      { type: 'frame', position: { x: -3, y: 2, z: 19.5 }, size: { x: 1.5, y: 3, z: 0.5 } },
      { type: 'frame', position: { x: 3, y: 2, z: 19.5 }, size: { x: 1.5, y: 3, z: 0.5 } },
      { type: 'frame', position: { x: 0, y: 4.7, z: 19.5 }, size: { x: 5, y: 0.5, z: 0.5 } },
      { type: 'frame', position: { x: 0, y: 1.8, z: 19.5 }, size: { x: 5, y: 0.3, z: 0.5 } },
      // Potted plants
      { type: 'plant', position: { x: -4, y: 0, z: 16 }, size: { x: 0.8, y: 1.8, z: 0.8 } },
      { type: 'plant', position: { x: 4, y: 0, z: 16 }, size: { x: 0.8, y: 1.8, z: 0.8 } },
      // Flag poles
      { type: 'flag', position: { x: -3.5, y: 0, z: 18 }, size: { x: 0.2, y: 4, z: 0.2 } },
      { type: 'flag', position: { x: 3.5, y: 0, z: 18 }, size: { x: 0.2, y: 4, z: 0.2 } },
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
  curtain: 0x8FBC8F,
  plant: 0x228B22,
  flag: 0xB8860B,
  cone: 0xFF6600,
}
