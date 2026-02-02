// Destructible buildings by region type
export const buildings = [
  // Small buildings
  { id: 'house_small', name: 'Small House', hp: 50, coins: 10, width: 40, height: 40, color: '#8B4513' },
  { id: 'house_medium', name: 'House', hp: 80, coins: 15, width: 50, height: 50, color: '#A0522D' },
  { id: 'house_large', name: 'Large House', hp: 120, coins: 25, width: 60, height: 55, color: '#CD853F' },
  { id: 'shop', name: 'Shop', hp: 100, coins: 20, width: 55, height: 45, color: '#DEB887' },
  { id: 'garage', name: 'Garage', hp: 60, coins: 12, width: 45, height: 40, color: '#696969' },
  
  // Medium buildings
  { id: 'apartment', name: 'Apartment', hp: 200, coins: 40, width: 70, height: 80, color: '#778899' },
  { id: 'office_small', name: 'Small Office', hp: 180, coins: 35, width: 65, height: 70, color: '#708090' },
  { id: 'warehouse', name: 'Warehouse', hp: 250, coins: 45, width: 90, height: 60, color: '#A9A9A9' },
  { id: 'factory_small', name: 'Small Factory', hp: 300, coins: 55, width: 100, height: 70, color: '#808080' },
  { id: 'mall', name: 'Shopping Mall', hp: 350, coins: 65, width: 120, height: 80, color: '#C0C0C0' },
  
  // Large buildings
  { id: 'office_tower', name: 'Office Tower', hp: 500, coins: 100, width: 80, height: 120, color: '#4682B4' },
  { id: 'hotel', name: 'Hotel', hp: 450, coins: 90, width: 75, height: 110, color: '#5F9EA0' },
  { id: 'hospital', name: 'Hospital', hp: 400, coins: 85, width: 100, height: 90, color: '#FFFFFF' },
  { id: 'factory_large', name: 'Large Factory', hp: 550, coins: 110, width: 140, height: 90, color: '#696969' },
  { id: 'power_plant', name: 'Power Plant', hp: 600, coins: 120, width: 110, height: 100, color: '#FFD700' },
  
  // Skyscrapers
  { id: 'skyscraper_small', name: 'Small Skyscraper', hp: 800, coins: 160, width: 70, height: 150, color: '#1E90FF' },
  { id: 'skyscraper', name: 'Skyscraper', hp: 1000, coins: 200, width: 80, height: 180, color: '#4169E1' },
  { id: 'skyscraper_large', name: 'Large Skyscraper', hp: 1200, coins: 250, width: 90, height: 200, color: '#0000CD' },
  
  // Special structures
  { id: 'military_base', name: 'Military Base', hp: 700, coins: 140, width: 130, height: 100, color: '#556B2F' },
  { id: 'radar_tower', name: 'Radar Tower', hp: 300, coins: 60, width: 40, height: 100, color: '#2F4F4F' },
  { id: 'bunker', name: 'Bunker', hp: 900, coins: 180, width: 80, height: 50, color: '#3C3C3C' },
  { id: 'government', name: 'Government Building', hp: 1500, coins: 300, width: 150, height: 120, color: '#F5F5DC' },
  
  // Vehicles (destructible objects)
  { id: 'car', name: 'Car', hp: 20, coins: 5, width: 25, height: 15, color: '#FF6347' },
  { id: 'truck', name: 'Truck', hp: 40, coins: 8, width: 35, height: 18, color: '#4169E1' },
  { id: 'bus', name: 'Bus', hp: 60, coins: 12, width: 50, height: 20, color: '#FFD700' },
  { id: 'tank_wreck', name: 'Destroyed Tank', hp: 100, coins: 25, width: 45, height: 30, color: '#556B2F' },
]

export function getBuildingById(id) {
  return buildings.find(b => b.id === id)
}

// Building sets for different region difficulties
export const regionBuildingSets = {
  1: ['house_small', 'house_medium', 'shop', 'car', 'truck'],
  2: ['house_medium', 'house_large', 'shop', 'garage', 'apartment', 'car', 'truck', 'bus'],
  3: ['apartment', 'office_small', 'warehouse', 'mall', 'car', 'truck', 'bus'],
  4: ['apartment', 'office_small', 'warehouse', 'factory_small', 'office_tower', 'car', 'truck', 'bus'],
  5: ['office_tower', 'hotel', 'hospital', 'factory_large', 'power_plant', 'skyscraper_small', 'truck', 'bus'],
  6: ['skyscraper_small', 'skyscraper', 'military_base', 'radar_tower', 'bunker', 'tank_wreck'],
  7: ['skyscraper', 'skyscraper_large', 'military_base', 'bunker', 'government', 'tank_wreck'],
  8: ['skyscraper_large', 'government', 'bunker', 'military_base', 'power_plant', 'tank_wreck']
}

export function getBuildingsForDifficulty(difficulty) {
  const set = regionBuildingSets[difficulty] || regionBuildingSets[1]
  return set.map(id => getBuildingById(id)).filter(Boolean)
}
