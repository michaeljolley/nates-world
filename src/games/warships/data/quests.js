// Quest definitions for War Ships game
export const questTemplates = [
  // Kill quests
  { id: 'kill1', name: 'First Blood', desc: 'Destroy 1 enemy ship', type: 'kills', target: 1, reward: 100 },
  { id: 'kill3', name: 'Triple Threat', desc: 'Destroy 3 enemy ships', type: 'kills', target: 3, reward: 300 },
  { id: 'kill5', name: 'Ace Captain', desc: 'Destroy 5 enemy ships', type: 'kills', target: 5, reward: 500 },
  { id: 'kill10', name: 'Fleet Destroyer', desc: 'Destroy 10 enemy ships', type: 'kills', target: 10, reward: 1000 },
  { id: 'kill25', name: 'Sea Wolf', desc: 'Destroy 25 enemy ships', type: 'kills', target: 25, reward: 2500 },
  { id: 'kill50', name: 'Admiral of Death', desc: 'Destroy 50 enemy ships', type: 'kills', target: 50, reward: 5000 },
  { id: 'kill100', name: 'Legendary Captain', desc: 'Destroy 100 enemy ships', type: 'kills', target: 100, reward: 10000 },
  
  // Shots fired quests
  { id: 'shots50', name: 'Artillery Barrage', desc: 'Fire 50 shots', type: 'shotsFired', target: 50, reward: 200 },
  { id: 'shots100', name: 'Gunner', desc: 'Fire 100 shots', type: 'shotsFired', target: 100, reward: 400 },
  { id: 'shots500', name: 'Bombardment', desc: 'Fire 500 shots', type: 'shotsFired', target: 500, reward: 1500 },
  { id: 'shots1000', name: 'Shell Storm', desc: 'Fire 1000 shots', type: 'shotsFired', target: 1000, reward: 3000 },
  
  // Accuracy quests
  { id: 'hit5', name: 'Sharpshooter', desc: 'Hit enemies 5 times', type: 'shotsHit', target: 5, reward: 150 },
  { id: 'hit20', name: 'Master Gunner', desc: 'Hit enemies 20 times', type: 'shotsHit', target: 20, reward: 400 },
  { id: 'hit50', name: 'Sniper', desc: 'Hit enemies 50 times', type: 'shotsHit', target: 50, reward: 800 },
  { id: 'hit100', name: 'Deadshot', desc: 'Hit enemies 100 times', type: 'shotsHit', target: 100, reward: 1500 },
  
  // Damage quests
  { id: 'damage500', name: 'Heavy Hitter', desc: 'Deal 500 damage', type: 'damageDealt', target: 500, reward: 250 },
  { id: 'damage1000', name: 'Pain Dealer', desc: 'Deal 1000 damage', type: 'damageDealt', target: 1000, reward: 500 },
  { id: 'damage5000', name: 'Destroyer', desc: 'Deal 5000 damage', type: 'damageDealt', target: 5000, reward: 2000 },
  { id: 'damage10000', name: 'Devastator', desc: 'Deal 10000 damage', type: 'damageDealt', target: 10000, reward: 4000 },
  
  // Survival quests
  { id: 'survive1', name: 'Survivor', desc: 'Win 1 battle', type: 'survived', target: 1, reward: 500 },
  { id: 'survive5', name: 'Champion', desc: 'Win 5 battles', type: 'survived', target: 5, reward: 2000 },
  { id: 'survive10', name: 'Veteran', desc: 'Win 10 battles', type: 'survived', target: 10, reward: 4000 },
  { id: 'survive25', name: 'Battle Master', desc: 'Win 25 battles', type: 'survived', target: 25, reward: 10000 },
  
  // Games played quests
  { id: 'games1', name: 'Rookie', desc: 'Play 1 game', type: 'gamesPlayed', target: 1, reward: 50 },
  { id: 'games10', name: 'Sailor', desc: 'Play 10 games', type: 'gamesPlayed', target: 10, reward: 400 },
  { id: 'games25', name: 'Seaman', desc: 'Play 25 games', type: 'gamesPlayed', target: 25, reward: 800 },
  { id: 'games50', name: 'Officer', desc: 'Play 50 games', type: 'gamesPlayed', target: 50, reward: 1500 },
  
  // Money earned quests
  { id: 'earn1000', name: 'Penny Pincher', desc: 'Earn $1,000 total', type: 'moneyEarned', target: 1000, reward: 200 },
  { id: 'earn10000', name: 'Wealthy Sailor', desc: 'Earn $10,000 total', type: 'moneyEarned', target: 10000, reward: 1000 },
  { id: 'earn50000', name: 'Treasure Hunter', desc: 'Earn $50,000 total', type: 'moneyEarned', target: 50000, reward: 5000 },
  { id: 'earn100000', name: 'Fortune Seeker', desc: 'Earn $100,000 total', type: 'moneyEarned', target: 100000, reward: 10000 }
]
