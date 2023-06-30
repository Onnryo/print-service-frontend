import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '../stores/AppStore'
import HomeView from '../views/HomeView.vue'
import RequestListView from '../views/RequestListView.vue'
import RequestDetailView from '../views/RequestDetailView.vue'
import RequestSubmissionView from '../views/RequestSubmissionView.vue'
import RequestCommentView from '../views/RequestCommentView.vue'
import PartBuilderView from '../views/PartBuilderView.vue'
import PartListView from '../views/PartListView.vue'
import PartDetailView from '../views/PartDetailView.vue'
import BatchListView from '../views/BatchListView.vue'
import BatchDetailView from '../views/BatchDetailView.vue'
import BatchBuilderView from '../views/BatchBuilderView.vue'
import FileListView from '../views/FileListView.vue'
import FileDetailView from '../views/FileDetailView.vue'
import UserListView from '../views/UserListView.vue'
import UserDetailView from '../views/UserDetailView.vue'
import AuthView from '../views/AuthView.vue'
import NotFound from '../views/NotFoundView.vue'

/* 
No Auth:
    /auth

User Auth:
    /                       *User Landing Page, comment notifications
    /requests               All requests submitted by logged in user, filterable
    /requests/submission    Request Submission
    /requests/:id           Request Details if request submitted by logged in user, comments, files, parts display
    /users/:id               *User Details / settings

Admin Auth:
    /                       *Admin Landing Page
    /requests               All Requests, filterable, defaults to only pending and in progress requests
    /requests/:id           ""
    /users                  *All users, filterable
    /users/:id              *Admin settings / Other user details
    /requests/comments      **All comments, filterable, read/unread, links to relevant entity
    /parts                  All parts, filterable
    /parts/:id              Part Details, comments, files
    /batch                  *All batches, filterable
    /batch/:id              *Batch details, comments, parts, files, requests display
    /batch/builder          *Batch builder, effeciently combine parts from multiples requests based on size, filament, print settings, etc
    /files                  All files, filterable, unassigned
    /files/:id              File Details, Part Creator
    /files/:id/builder      Part Builder
 */

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
      path: '/parts',
      name: 'parts',
      component: PartListView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/parts/:id',
      name: 'PartDetails',
      component: PartDetailView,
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
      path: '/files',
      name: 'files',
      component: FileListView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/files/:id',
      name: 'fileDetails',
      component: FileDetailView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/files/:id/builder',
      name: 'partBuilder',
      component: PartBuilderView,
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
      meta: { requiresAuth: true }
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { requiresUnauth: true }
    },
    { path: '/:notFound(.*)', component: NotFound }
  ]
})

router.beforeEach((to, from, next) => {
  const appStore = useAppStore()
  if (to.meta.requiresAuth && !appStore.isAuthenticated) {
    appStore
      .reauth()
      .then(() => {
        next()
      })
      .catch(() => {
        next('/auth')
      })
  } else if (to.meta.requiresUnauth && appStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
