import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/students',
      name: 'students',
      component: () => import('@/views/StudentsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/teachers',
      name: 'teachers',
      component: () => import('@/views/TeachersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/subjects',
      name: 'subjects',
      component: () => import('@/views/SubjectsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/attendance',
      name: 'attendance',
      component: () => import('@/views/AttendanceView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/fees',
      name: 'fees',
      component: () => import('@/views/FeesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/exams',
      name: 'exams',
      component: () => import('@/views/ExamsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/notices',
      name: 'notices',
      component: () => import('@/views/NoticesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.checkAuth()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
