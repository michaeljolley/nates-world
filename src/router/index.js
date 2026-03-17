import { createRouter, createWebHistory } from 'vue-router'

// Lazy load views
const MinecraftMap = () => import('@/views/minecraft-map/MinecraftMap.vue')

// Lazy load game components
const TicTacToe = () => import('@/games/tictactoe').then(m => m.TicTacToe)
const Plantation = () => import('@/games/plantation').then(m => m.Plantation)
const AnimalTrivia = () => import('@/games/animaltrivia').then(m => m.AnimalTrivia)
const DinoTrivia = () => import('@/games/dinotrivia').then(m => m.DinoTrivia)
const BibleTrivia = () => import('@/games/bibletrivia').then(m => m.BibleTrivia)
const HistoryTrivia = () => import('@/games/historytrivia').then(m => m.HistoryTrivia)
const LanguageTrivia = () => import('@/games/languagetrivia').then(m => m.LanguageTrivia)
const MathQuiz = () => import('@/games/mathquiz').then(m => m.MathQuiz)
const PaperAirplane = () => import('@/games/paperairplane').then(m => m.PaperAirplane)

const ConnectFour = () => import('@/games/connectfour').then(m => m.ConnectFour)
const TreeHoppers = () => import('@/games/treehoppers').then(m => m.TreeHoppers)

const SnakeRun = () => import('@/games/snakerun').then(m => m.SnakeRun)
const FruitNinja = () => import('@/games/fruitninja').then(m => m.FruitNinja)
const AlienInvasion = () => import('@/games/alieninvasion').then(m => m.AlienInvasion)
const RobberJoe = () => import('@/games/robberjoe').then(m => m.RobberJoe)
const Tetris = () => import('@/games/tetris').then(m => m.Tetris)
const CrossyRoad = () => import('@/games/crossyroad').then(m => m.CrossyRoad)
const BoxingBros = () => import('@/games/boxingbros').then(m => m.BoxingBros)
const PunchOut = () => import('@/games/brawlarena').then(m => m.BrawlArena)
const MonkeyFishTD = () => import('@/games/monkeyfishtd').then(m => m.MonkeyFishTD)
const HistoryQuiz = () => import('@/games/historyquiz').then(m => m.HistoryQuiz)
const Monopoly = () => import('@/games/monopoly').then(m => m.Monopoly)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/tic-tac-toe',
    name: 'tic-tac-toe',
    component: TicTacToe,
    meta: { title: 'Tic-Tac-Toe' }
  },
  {
    path: '/plantation',
    name: 'plantation',
    component: Plantation,
    meta: { title: 'Plantation' }
  },
  {
    path: '/animal-trivia',
    name: 'animal-trivia',
    component: AnimalTrivia,
    meta: { title: 'Animal Trivia' }
  },
  {
    path: '/dino-trivia',
    name: 'dino-trivia',
    component: DinoTrivia,
    meta: { title: 'Dino Trivia' }
  },
  {
    path: '/bible-trivia',
    name: 'bible-trivia',
    component: BibleTrivia,
    meta: { title: 'Bible Trivia' }
  },
  {
    path: '/history-trivia',
    name: 'history-trivia',
    component: HistoryTrivia,
    meta: { title: 'History Trivia' }
  },
  {
    path: '/language-trivia',
    name: 'language-trivia',
    component: LanguageTrivia,
    meta: { title: 'Language Trivia' }
  },
  {
    path: '/math-quiz',
    name: 'math-quiz',
    component: MathQuiz,
    meta: { title: 'Math Quiz' }
  },
  {
    path: '/paper-airplane',
    name: 'paper-airplane',
    component: PaperAirplane,
    meta: { title: 'Paper Airplane' }
  },
  {
    path: '/connect-four',
    name: 'connect-four',
    component: ConnectFour,
    meta: { title: 'Connect Four' }
  },

  {
    path: '/tree-hoppers',
    name: 'tree-hoppers',
    component: TreeHoppers,
    meta: { title: 'Tree Hoppers' }
  },
  {
    path: '/snake-run',
    name: 'snake-run',
    component: SnakeRun,
    meta: { title: 'Snake Run' }
  },
  {
    path: '/fruit-ninja',
    name: 'fruit-ninja',
    component: FruitNinja,
    meta: { title: 'Fruit Ninja' }
  },

  {
    path: '/alien-invasion',
    name: 'alien-invasion',
    component: AlienInvasion,
    meta: { title: 'Alien Invasion' }
  },

  {
    path: '/minecraft-map',
    name: 'minecraft-map',
    component: MinecraftMap,
    meta: { title: 'Minecraft Map' }
  },
  {
    path: '/robber-joe',
    name: 'robber-joe',
    component: RobberJoe,
    meta: { title: 'Robber Joe' }
  },
  {
    path: '/tetris',
    name: 'tetris',
    component: Tetris,
    meta: { title: 'Tetris' }
  },
  {
    path: '/crossy-road',
    name: 'crossy-road',
    component: CrossyRoad,
    meta: { title: 'Crossy Road' }
  },
  {
    path: '/boxing-bros',
    name: 'boxing-bros',
    component: BoxingBros,
    meta: { title: 'Boxing Bros' }
  },

  {
    path: '/monkey-fish-td',
    name: 'monkey-fish-td',
    component: MonkeyFishTD,
    meta: { title: 'Monkey Fish TD' }
  },
  {
    path: '/punch-out',
    name: 'punch-out',
    component: PunchOut,
    meta: { title: 'Punch Out' }
  },
  {
    path: '/history-quiz',
    name: 'history-quiz',
    component: HistoryQuiz,
    meta: { title: 'History Quiz' }
  },
  {
    path: '/monopoly',
    name: 'monopoly',
    component: Monopoly,
    meta: { title: 'Monopoly' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update page title on route change
router.beforeEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | Natorade` : 'Natorade'
})

// Track page view on route change for SPA analytics
router.afterEach(() => {
  if (window.bbbAnalytics && window.bbbAnalytics.track) {
    window.bbbAnalytics.track()
  }
})

export default router
