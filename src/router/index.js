import { createRouter, createWebHistory } from 'vue-router'

// Lazy load game components
const TicTacToe = () => import('@/games/tictactoe').then(m => m.TicTacToe)
const WarShips = () => import('@/games/warships').then(m => m.WarShips)
const Plantation = () => import('@/games/plantation').then(m => m.Plantation)
const AnimalTrivia = () => import('@/games/animaltrivia').then(m => m.AnimalTrivia)
const PaperAirplane = () => import('@/games/paperairplane').then(m => m.PaperAirplane)
const HotWheels = () => import('@/games/hotwheels').then(m => m.HotWheels)
const Battlefields = () => import('@/games/battlefields').then(m => m.Battlefields)
const ConnectFour = () => import('@/games/connectfour').then(m => m.ConnectFour)
const TreeHoppers = () => import('@/games/treehoppers').then(m => m.TreeHoppers)
const LilyPadHopper = () => import('@/games/lilypadhopper').then(m => m.LilyPadHopper)
const SnakeRun = () => import('@/games/snakerun').then(m => m.SnakeRun)
const FruitNinja = () => import('@/games/fruitninja').then(m => m.FruitNinja)
const Archery = () => import('@/games/archery').then(m => m.Archery)
const AlienInvasion = () => import('@/games/alieninvasion').then(m => m.AlienInvasion)

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
    path: '/battlefields',
    name: 'battlefields',
    component: Battlefields,
    meta: { title: 'Battlefields' }
  },
  {
    path: '/hot-wheels',
    name: 'hot-wheels',
    component: HotWheels,
    meta: { title: 'Hot Wheels Racing' }
  },
  {
    path: '/connect-four',
    name: 'connect-four',
    component: ConnectFour,
    meta: { title: 'Connect Four' }
  },
  {
    path: '/lily-pad-hopper',
    name: 'lily-pad-hopper',
    component: LilyPadHopper,
    meta: { title: 'Lily Pad Hopper' }
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
    path: '/archery',
    name: 'archery',
    component: Archery,
    meta: { title: 'Archery' }
  },
  {
    path: '/alien-invasion',
    name: 'alien-invasion',
    component: AlienInvasion,
    meta: { title: 'Alien Invasion' }
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

export default router
