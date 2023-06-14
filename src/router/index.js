import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '../stores/AppStore'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFoundView.vue'
import AuthView from '../views/AuthView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // },
    { path: '/auth', name: 'auth', component: AuthView, meta: { requiresUnauth: true } },
    { path: '/:notFound(.*)', component: NotFound }
  ]
})

router.beforeEach((to, _, next) => {
  const appStore = useAppStore()
  if (to.meta.requiresAuth && !appStore.isAuthenticated) {
    next('/auth')
  } else if (to.meta.requiresUnauth && appStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
