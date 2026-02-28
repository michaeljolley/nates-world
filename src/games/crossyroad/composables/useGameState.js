import { ref, computed } from 'vue'

// 100 Available skins for the shop
const SKINS = [
  // Free starter
  { id: 'chicken', name: 'Chicken', emoji: '🐔', price: 0, description: 'The classic chicken' },
  
  // Tier 1: Common (25-75 coins) - 20 skins
  { id: 'duck', name: 'Duck', emoji: '🦆', price: 25, description: 'Quack quack!' },
  { id: 'chick', name: 'Baby Chick', emoji: '🐤', price: 30, description: 'Peep peep!' },
  { id: 'hatching', name: 'Hatching', emoji: '🐣', price: 35, description: 'Just born!' },
  { id: 'rooster', name: 'Rooster', emoji: '🐓', price: 40, description: 'Cock-a-doodle-doo!' },
  { id: 'turkey', name: 'Turkey', emoji: '🦃', price: 45, description: 'Gobble gobble!' },
  { id: 'dove', name: 'Dove', emoji: '🕊️', price: 50, description: 'Peace bird' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', price: 50, description: 'Waddle waddle!' },
  { id: 'owl', name: 'Owl', emoji: '🦉', price: 55, description: 'Hoo hoo!' },
  { id: 'eagle', name: 'Eagle', emoji: '🦅', price: 60, description: 'Majestic!' },
  { id: 'parrot', name: 'Parrot', emoji: '🦜', price: 60, description: 'Polly wants a cracker!' },
  { id: 'swan', name: 'Swan', emoji: '🦢', price: 65, description: 'Elegant!' },
  { id: 'flamingo', name: 'Flamingo', emoji: '🦩', price: 65, description: 'Pretty in pink!' },
  { id: 'peacock', name: 'Peacock', emoji: '🦚', price: 70, description: 'Show off!' },
  { id: 'bat', name: 'Bat', emoji: '🦇', price: 70, description: 'Night flyer!' },
  { id: 'mouse', name: 'Mouse', emoji: '🐭', price: 50, description: 'Squeak squeak!' },
  { id: 'rat', name: 'Rat', emoji: '🐀', price: 45, description: 'Street smart!' },
  { id: 'hamster', name: 'Hamster', emoji: '🐹', price: 55, description: 'So fluffy!' },
  { id: 'chipmunk', name: 'Chipmunk', emoji: '🐿️', price: 60, description: 'Chip chip!' },
  { id: 'hedgehog', name: 'Hedgehog', emoji: '🦔', price: 65, description: 'Prickly!' },
  { id: 'snail', name: 'Snail', emoji: '🐌', price: 75, description: 'Slow and steady!' },
  
  // Tier 2: Uncommon (100-200 coins) - 25 skins
  { id: 'frog', name: 'Frog', emoji: '🐸', price: 100, description: 'Ribbit ribbit!' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', price: 100, description: 'Hop hop hop!' },
  { id: 'dog', name: 'Dog', emoji: '🐕', price: 110, description: 'Good boy!' },
  { id: 'poodle', name: 'Poodle', emoji: '🐩', price: 115, description: 'Fancy!' },
  { id: 'cat', name: 'Cat', emoji: '🐱', price: 120, description: 'Meow!' },
  { id: 'blackcat', name: 'Black Cat', emoji: '🐈‍⬛', price: 125, description: 'Spooky!' },
  { id: 'pig', name: 'Pig', emoji: '🐷', price: 130, description: 'Oink oink!' },
  { id: 'boar', name: 'Boar', emoji: '🐗', price: 135, description: 'Wild!' },
  { id: 'cow', name: 'Cow', emoji: '🐮', price: 140, description: 'Moo!' },
  { id: 'ox', name: 'Ox', emoji: '🐂', price: 145, description: 'Strong!' },
  { id: 'buffalo', name: 'Buffalo', emoji: '🐃', price: 150, description: 'Powerful!' },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', price: 130, description: 'Baa baa!' },
  { id: 'goat', name: 'Goat', emoji: '🐐', price: 135, description: 'G.O.A.T!' },
  { id: 'llama', name: 'Llama', emoji: '🦙', price: 155, description: 'No drama!' },
  { id: 'camel', name: 'Camel', emoji: '🐫', price: 160, description: 'Desert walker!' },
  { id: 'giraffe', name: 'Giraffe', emoji: '🦒', price: 170, description: 'Tall friend!' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', price: 180, description: 'Never forgets!' },
  { id: 'rhino', name: 'Rhino', emoji: '🦏', price: 185, description: 'Charge!' },
  { id: 'hippo', name: 'Hippo', emoji: '🦛', price: 190, description: 'Hungry hungry!' },
  { id: 'horse', name: 'Horse', emoji: '🐴', price: 150, description: 'Neigh!' },
  { id: 'zebra', name: 'Zebra', emoji: '🦓', price: 165, description: 'Striped!' },
  { id: 'deer', name: 'Deer', emoji: '🦌', price: 160, description: 'Oh deer!' },
  { id: 'kangaroo', name: 'Kangaroo', emoji: '🦘', price: 175, description: 'Bounce!' },
  { id: 'sloth', name: 'Sloth', emoji: '🦥', price: 200, description: 'Chill vibes!' },
  { id: 'otter', name: 'Otter', emoji: '🦦', price: 200, description: 'Otterly cute!' },
  
  // Tier 3: Rare (250-400 coins) - 25 skins
  { id: 'monkey', name: 'Monkey', emoji: '🐵', price: 250, description: 'Ooh ooh!' },
  { id: 'gorilla', name: 'Gorilla', emoji: '🦍', price: 275, description: 'King Kong!' },
  { id: 'orangutan', name: 'Orangutan', emoji: '🦧', price: 280, description: 'Wise one!' },
  { id: 'lion', name: 'Lion', emoji: '🦁', price: 300, description: 'King of the jungle!' },
  { id: 'tiger', name: 'Tiger', emoji: '🐯', price: 300, description: 'Fierce!' },
  { id: 'leopard', name: 'Leopard', emoji: '🐆', price: 310, description: 'Spotted!' },
  { id: 'wolf', name: 'Wolf', emoji: '🐺', price: 320, description: 'Howl!' },
  { id: 'fox', name: 'Fox', emoji: '🦊', price: 325, description: 'Clever!' },
  { id: 'raccoon', name: 'Raccoon', emoji: '🦝', price: 330, description: 'Trash panda!' },
  { id: 'bear', name: 'Bear', emoji: '🐻', price: 350, description: 'Rawr!' },
  { id: 'polarbear', name: 'Polar Bear', emoji: '🐻‍❄️', price: 360, description: 'Ice cold!' },
  { id: 'panda', name: 'Panda', emoji: '🐼', price: 375, description: 'Bamboo lover!' },
  { id: 'koala', name: 'Koala', emoji: '🐨', price: 350, description: 'Sleepy!' },
  { id: 'turtle', name: 'Turtle', emoji: '🐢', price: 275, description: 'Shell yeah!' },
  { id: 'snake', name: 'Snake', emoji: '🐍', price: 300, description: 'Sssssss!' },
  { id: 'lizard', name: 'Lizard', emoji: '🦎', price: 290, description: 'Cool reptile!' },
  { id: 'crocodile', name: 'Crocodile', emoji: '🐊', price: 350, description: 'Snap!' },
  { id: 'dinosaur', name: 'Dinosaur', emoji: '🦕', price: 400, description: 'Prehistoric!' },
  { id: 'trex', name: 'T-Rex', emoji: '🦖', price: 400, description: 'Roar!' },
  { id: 'whale', name: 'Whale', emoji: '🐳', price: 350, description: 'Splash!' },
  { id: 'dolphin', name: 'Dolphin', emoji: '🐬', price: 325, description: 'Smart swimmer!' },
  { id: 'shark', name: 'Shark', emoji: '🦈', price: 375, description: 'Jaws!' },
  { id: 'octopus', name: 'Octopus', emoji: '🐙', price: 350, description: '8 arms!' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', price: 300, description: 'Beautiful!' },
  { id: 'bee', name: 'Bee', emoji: '🐝', price: 280, description: 'Buzz buzz!' },
  
  // Tier 4: Epic (500-750 coins) - 15 skins
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄', price: 500, description: 'Magical!' },
  { id: 'dragon', name: 'Dragon', emoji: '🐲', price: 600, description: 'Legendary!' },
  { id: 'dragonface', name: 'Dragon Face', emoji: '🐉', price: 625, description: 'Eastern dragon!' },
  { id: 'phoenix', name: 'Phoenix', emoji: '🔥', price: 650, description: 'Reborn!' },
  { id: 'ghost', name: 'Ghost', emoji: '👻', price: 500, description: 'Boo!' },
  { id: 'skull', name: 'Skull', emoji: '💀', price: 525, description: 'Spooky scary!' },
  { id: 'jack', name: 'Jack-O-Lantern', emoji: '🎃', price: 550, description: 'Halloween!' },
  { id: 'devil', name: 'Devil', emoji: '😈', price: 600, description: 'Naughty!' },
  { id: 'ogre', name: 'Ogre', emoji: '👹', price: 625, description: 'Scary!' },
  { id: 'goblin', name: 'Goblin', emoji: '👺', price: 625, description: 'Mischievous!' },
  { id: 'clown', name: 'Clown', emoji: '🤡', price: 575, description: 'Funny!' },
  { id: 'ninja', name: 'Ninja', emoji: '🥷', price: 700, description: 'Stealth!' },
  { id: 'mage', name: 'Mage', emoji: '🧙', price: 700, description: 'Wizard!' },
  { id: 'fairy', name: 'Fairy', emoji: '🧚', price: 650, description: 'Magical fairy!' },
  { id: 'genie', name: 'Genie', emoji: '🧞', price: 750, description: '3 wishes!' },
  
  // Tier 5: Legendary (1000-2000 coins) - 10 skins
  { id: 'alien', name: 'Alien', emoji: '👽', price: 1000, description: 'Out of this world!' },
  { id: 'ufo', name: 'UFO', emoji: '🛸', price: 1100, description: 'Flying saucer!' },
  { id: 'robot', name: 'Robot', emoji: '🤖', price: 1200, description: 'Beep boop!' },
  { id: 'astronaut', name: 'Astronaut', emoji: '👨‍🚀', price: 1300, description: 'Space explorer!' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', price: 1400, description: 'Blast off!' },
  { id: 'star', name: 'Star', emoji: '⭐', price: 1500, description: 'Shining star!' },
  { id: 'rainbow', name: 'Rainbow', emoji: '🌈', price: 1600, description: 'Colorful!' },
  { id: 'sun', name: 'Sun', emoji: '☀️', price: 1750, description: 'Bright!' },
  { id: 'moon', name: 'Moon', emoji: '🌙', price: 1750, description: 'Night sky!' },
  { id: 'crown', name: 'Crown', emoji: '👑', price: 2000, description: 'Royalty!' },
  
  // Tier 6: Mythic (2500-5000 coins) - 4 skins
  { id: 'diamond', name: 'Diamond', emoji: '💎', price: 2500, description: 'Precious!' },
  { id: 'fire', name: 'Fire', emoji: '🔥', price: 3000, description: 'Hot stuff!' },
  { id: 'lightning', name: 'Lightning', emoji: '⚡', price: 3500, description: 'Electric!' },
  { id: 'infinity', name: 'Infinity', emoji: '♾️', price: 5000, description: 'Forever!' },
]

export function useGameState() {
  const gameState = ref('menu') // 'menu', 'playing', 'gameover', 'shop'
  const score = ref(0)
  const highScore = ref(parseInt(localStorage.getItem('crossyroad_highscore') || '0'))
  const coins = ref(0) // Coins collected this game
  const coinsEarned = ref(0) // Coins earned at end of game
  
  // Persistent wallet and skins
  const wallet = ref(parseInt(localStorage.getItem('crossyroad_wallet') || '0'))
  const ownedSkins = ref(JSON.parse(localStorage.getItem('crossyroad_skins') || '["chicken"]'))
  const selectedSkin = ref(localStorage.getItem('crossyroad_selected_skin') || 'chicken')

  const currentSkin = computed(() => {
    return SKINS.find(s => s.id === selectedSkin.value) || SKINS[0]
  })

  function saveWallet() {
    localStorage.setItem('crossyroad_wallet', wallet.value.toString())
  }

  function saveSkins() {
    localStorage.setItem('crossyroad_skins', JSON.stringify(ownedSkins.value))
  }

  function saveSelectedSkin() {
    localStorage.setItem('crossyroad_selected_skin', selectedSkin.value)
  }

  function startGame() {
    gameState.value = 'playing'
    score.value = 0
    coins.value = 0
    coinsEarned.value = 0
  }

  function calculateCoinsEarned(finalScore, coinsCollected) {
    // Base coins: 1 coin per 5 points
    const baseCoins = Math.floor(finalScore / 5)
    // Bonus for collected coins during game
    const collectedBonus = coinsCollected
    // Milestone bonuses
    let milestoneBonus = 0
    if (finalScore >= 100) milestoneBonus += 20
    if (finalScore >= 50) milestoneBonus += 10
    if (finalScore >= 25) milestoneBonus += 5
    
    return baseCoins + collectedBonus + milestoneBonus
  }

  function endGame() {
    gameState.value = 'gameover'
    
    // Calculate and award coins
    coinsEarned.value = calculateCoinsEarned(score.value, coins.value)
    wallet.value += coinsEarned.value
    saveWallet()
    
    if (score.value > highScore.value) {
      highScore.value = score.value
      localStorage.setItem('crossyroad_highscore', highScore.value.toString())
    }
  }

  function resetGame() {
    gameState.value = 'menu'
    score.value = 0
    coins.value = 0
    coinsEarned.value = 0
  }

  function incrementScore() {
    score.value++
  }

  function addCoin() {
    coins.value++
  }

  function openShop() {
    gameState.value = 'shop'
  }

  function closeShop() {
    gameState.value = 'menu'
  }

  function buySkin(skinId) {
    const skin = SKINS.find(s => s.id === skinId)
    if (!skin) return false
    if (ownedSkins.value.includes(skinId)) return false
    if (wallet.value < skin.price) return false

    wallet.value -= skin.price
    ownedSkins.value.push(skinId)
    saveWallet()
    saveSkins()
    return true
  }

  function selectSkin(skinId) {
    if (ownedSkins.value.includes(skinId)) {
      selectedSkin.value = skinId
      saveSelectedSkin()
      return true
    }
    return false
  }

  return {
    gameState,
    score,
    highScore,
    coins,
    coinsEarned,
    wallet,
    ownedSkins,
    selectedSkin,
    currentSkin,
    skins: SKINS,
    startGame,
    endGame,
    resetGame,
    incrementScore,
    addCoin,
    openShop,
    closeShop,
    buySkin,
    selectSkin
  }
}
