// Monopoly board properties and game data

export const PROPERTY_COLORS = {
  brown: '#8B4513',
  lightBlue: '#87CEEB',
  pink: '#FF69B4',
  orange: '#FFA500',
  red: '#FF0000',
  yellow: '#FFFF00',
  green: '#008000',
  darkBlue: '#00008B',
  railroad: '#000000',
  utility: '#808080'
}

export const BOARD_SPACES = [
  { id: 0, name: 'GO', type: 'go', position: 'bottom' },
  { id: 1, name: 'Mediterranean Ave', type: 'property', color: 'brown', price: 60, rent: [2, 10, 30, 90, 160, 250], housePrice: 50, position: 'bottom' },
  { id: 2, name: 'Community Chest', type: 'community', position: 'bottom' },
  { id: 3, name: 'Baltic Ave', type: 'property', color: 'brown', price: 60, rent: [4, 20, 60, 180, 320, 450], housePrice: 50, position: 'bottom' },
  { id: 4, name: 'Income Tax', type: 'tax', amount: 200, position: 'bottom' },
  { id: 5, name: 'Reading Railroad', type: 'railroad', price: 200, position: 'bottom' },
  { id: 6, name: 'Oriental Ave', type: 'property', color: 'lightBlue', price: 100, rent: [6, 30, 90, 270, 400, 550], housePrice: 50, position: 'bottom' },
  { id: 7, name: 'Chance', type: 'chance', position: 'bottom' },
  { id: 8, name: 'Vermont Ave', type: 'property', color: 'lightBlue', price: 100, rent: [6, 30, 90, 270, 400, 550], housePrice: 50, position: 'bottom' },
  { id: 9, name: 'Connecticut Ave', type: 'property', color: 'lightBlue', price: 120, rent: [8, 40, 100, 300, 450, 600], housePrice: 50, position: 'bottom' },
  { id: 10, name: 'Jail / Just Visiting', type: 'jail', position: 'corner' },
  { id: 11, name: 'St. Charles Place', type: 'property', color: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750], housePrice: 100, position: 'left' },
  { id: 12, name: 'Electric Company', type: 'utility', price: 150, position: 'left' },
  { id: 13, name: 'States Ave', type: 'property', color: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750], housePrice: 100, position: 'left' },
  { id: 14, name: 'Virginia Ave', type: 'property', color: 'pink', price: 160, rent: [12, 60, 180, 500, 700, 900], housePrice: 100, position: 'left' },
  { id: 15, name: 'Pennsylvania Railroad', type: 'railroad', price: 200, position: 'left' },
  { id: 16, name: 'St. James Place', type: 'property', color: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950], housePrice: 100, position: 'left' },
  { id: 17, name: 'Community Chest', type: 'community', position: 'left' },
  { id: 18, name: 'Tennessee Ave', type: 'property', color: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950], housePrice: 100, position: 'left' },
  { id: 19, name: 'New York Ave', type: 'property', color: 'orange', price: 200, rent: [16, 80, 220, 600, 800, 1000], housePrice: 100, position: 'left' },
  { id: 20, name: 'Free Parking', type: 'parking', position: 'corner' },
  { id: 21, name: 'Kentucky Ave', type: 'property', color: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050], housePrice: 150, position: 'top' },
  { id: 22, name: 'Chance', type: 'chance', position: 'top' },
  { id: 23, name: 'Indiana Ave', type: 'property', color: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050], housePrice: 150, position: 'top' },
  { id: 24, name: 'Illinois Ave', type: 'property', color: 'red', price: 240, rent: [20, 100, 300, 750, 925, 1100], housePrice: 150, position: 'top' },
  { id: 25, name: 'B&O Railroad', type: 'railroad', price: 200, position: 'top' },
  { id: 26, name: 'Atlantic Ave', type: 'property', color: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150], housePrice: 150, position: 'top' },
  { id: 27, name: 'Ventnor Ave', type: 'property', color: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150], housePrice: 150, position: 'top' },
  { id: 28, name: 'Water Works', type: 'utility', price: 150, position: 'top' },
  { id: 29, name: 'Marvin Gardens', type: 'property', color: 'yellow', price: 280, rent: [24, 120, 360, 850, 1025, 1200], housePrice: 150, position: 'top' },
  { id: 30, name: 'Go To Jail', type: 'gotojail', position: 'corner' },
  { id: 31, name: 'Pacific Ave', type: 'property', color: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275], housePrice: 200, position: 'right' },
  { id: 32, name: 'North Carolina Ave', type: 'property', color: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275], housePrice: 200, position: 'right' },
  { id: 33, name: 'Community Chest', type: 'community', position: 'right' },
  { id: 34, name: 'Pennsylvania Ave', type: 'property', color: 'green', price: 320, rent: [28, 150, 450, 1000, 1200, 1400], housePrice: 200, position: 'right' },
  { id: 35, name: 'Short Line', type: 'railroad', price: 200, position: 'right' },
  { id: 36, name: 'Chance', type: 'chance', position: 'right' },
  { id: 37, name: 'Park Place', type: 'property', color: 'darkBlue', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], housePrice: 200, position: 'right' },
  { id: 38, name: 'Luxury Tax', type: 'tax', amount: 100, position: 'right' },
  { id: 39, name: 'Boardwalk', type: 'property', color: 'darkBlue', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], housePrice: 200, position: 'right' }
]

export const CHANCE_CARDS = [
  { text: 'Advance to GO. Collect $200.', action: 'moveTo', value: 0 },
  { text: 'Advance to Illinois Ave.', action: 'moveTo', value: 24 },
  { text: 'Advance to St. Charles Place.', action: 'moveTo', value: 11 },
  { text: 'Advance to nearest Railroad.', action: 'nearestRailroad' },
  { text: 'Advance to nearest Utility.', action: 'nearestUtility' },
  { text: 'Bank pays you dividend of $50.', action: 'receive', value: 50 },
  { text: 'Get Out of Jail Free.', action: 'jailCard' },
  { text: 'Go Back 3 Spaces.', action: 'moveBack', value: 3 },
  { text: 'Go to Jail. Do not pass GO.', action: 'goToJail' },
  { text: 'Make general repairs. Pay $25 per house, $100 per hotel.', action: 'repairs', house: 25, hotel: 100 },
  { text: 'Pay poor tax of $15.', action: 'pay', value: 15 },
  { text: 'Take a trip to Reading Railroad.', action: 'moveTo', value: 5 },
  { text: 'Take a walk on the Boardwalk.', action: 'moveTo', value: 39 },
  { text: 'You have been elected Chairman of the Board. Pay each player $50.', action: 'payEach', value: 50 },
  { text: 'Your building loan matures. Collect $150.', action: 'receive', value: 150 },
  { text: 'You have won a crossword competition. Collect $100.', action: 'receive', value: 100 }
]

export const COMMUNITY_CARDS = [
  { text: 'Advance to GO. Collect $200.', action: 'moveTo', value: 0 },
  { text: 'Bank error in your favor. Collect $200.', action: 'receive', value: 200 },
  { text: "Doctor's fees. Pay $50.", action: 'pay', value: 50 },
  { text: 'From sale of stock you get $50.', action: 'receive', value: 50 },
  { text: 'Get Out of Jail Free.', action: 'jailCard' },
  { text: 'Go to Jail. Do not pass GO.', action: 'goToJail' },
  { text: 'Grand Opera Night. Collect $50 from every player.', action: 'collectFromEach', value: 50 },
  { text: 'Holiday Fund matures. Receive $100.', action: 'receive', value: 100 },
  { text: 'Income tax refund. Collect $20.', action: 'receive', value: 20 },
  { text: 'It is your birthday. Collect $10 from each player.', action: 'collectFromEach', value: 10 },
  { text: 'Life insurance matures. Collect $100.', action: 'receive', value: 100 },
  { text: 'Hospital fees. Pay $100.', action: 'pay', value: 100 },
  { text: 'School fees. Pay $50.', action: 'pay', value: 50 },
  { text: 'Receive $25 consultancy fee.', action: 'receive', value: 25 },
  { text: 'You are assessed for street repairs. $40 per house, $115 per hotel.', action: 'repairs', house: 40, hotel: 115 },
  { text: 'You have won second prize in a beauty contest. Collect $10.', action: 'receive', value: 10 },
  { text: 'You inherit $100.', action: 'receive', value: 100 }
]

export const PLAYER_TOKENS = [
  { name: 'Car', emoji: '🚗', color: '#e74c3c' },
  { name: 'Ship', emoji: '🚢', color: '#3498db' },
  { name: 'Hat', emoji: '🎩', color: '#9b59b6' },
  { name: 'Dog', emoji: '🐕', color: '#f39c12' }
]

export const COLOR_GROUPS = {
  brown: [1, 3],
  lightBlue: [6, 8, 9],
  pink: [11, 13, 14],
  orange: [16, 18, 19],
  red: [21, 23, 24],
  yellow: [26, 27, 29],
  green: [31, 32, 34],
  darkBlue: [37, 39]
}

export const RAILROADS = [5, 15, 25, 35]
export const UTILITIES = [12, 28]
