import { createRouter, createWebHistory } from 'vue-router'

// Lazy load views
const MinecraftMap = () => import('@/views/minecraft-map/MinecraftMap.vue')

// Lazy load game components
const TicTacToe = () => import('@/games/tictactoe').then(m => m.TicTacToe)
const WarShips = () => import('@/games/warships').then(m => m.WarShips)
const Plantation = () => import('@/games/plantation').then(m => m.Plantation)
const AnimalTrivia = () => import('@/games/animaltrivia').then(m => m.AnimalTrivia)
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
    path: '/warships',
    name: 'warships',
    component: WarShips,
    meta: { title: 'War Ships 3D' }
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
