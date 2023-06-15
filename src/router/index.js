import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '../stores/AppStore'
import HomeView from '../views/HomeView.vue'
import RequestListView from '../views/RequestListView.vue'
import RequestDetailView from '../views/RequestDetailView.vue'
import RequestSubmissionView from '../views/RequestSubmissionView.vue'
import RequestCommentView from '../views/RequestCommentView.vue'
import BatchListView from '../views/BatchListView.vue'
import BatchDetailView from '../views/BatchDetailView.vue'
import BatchBuilderView from '../views/BatchBuilderView.vue'
import UserListView from '../views/UserListView.vue'
import UserDetailView from '../views/UserDetailView.vue'
import AuthView from '../views/AuthView.vue'
import NotFound from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/requests',
      name: 'requests',
      component: RequestListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/requests/:id',
      name: 'requestDetails',
      component: RequestDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/requests/submission',
      name: 'newRequest',
      component: RequestSubmissionView,
      meta: { requiresAuth: true }
    },
    {
      path: '/requests/comments',
      name: 'requestComments',
      component: RequestCommentView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/batch',
      name: 'batches',
      component: BatchListView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/batch/:id',
      name: 'batchDetails',
      component: BatchDetailView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/batch/builder',
      name: 'batchBuilder',
      component: BatchBuilderView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/users',
      name: 'users',
      component: UserListView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/users/:id',
      name: 'userDetails',
      component: UserDetailView,
      meta: { requiresAuth: true}
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { requiresUnauth: true}
    },
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
