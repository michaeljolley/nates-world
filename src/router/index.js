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
  }
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
