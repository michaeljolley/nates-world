import { createRouter, createWebHistory } from 'vue-router'

// Lazy load game components
const TicTacToe = () => import('@/games/tictactoe').then(m => m.TicTacToe)
const WarShips = () => import('@/games/warships').then(m => m.WarShips)

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
