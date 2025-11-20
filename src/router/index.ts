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
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('@/views/LibraryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/timetable',
      name: 'timetable',
      component: () => import('@/views/TimetableView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/class-management',
      name: 'class-management',
      component: () => import('@/views/ClassManagementView.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/subject-management',
      name: 'subject-management',
      component: () => import('@/views/SubjectManagementView.vue'),
      meta: { requiresAuth: true, roles: ['admin', 'teacher'] }
    },
    {
      path: '/exam-management',
      name: 'exam-management',
      component: () => import('@/views/ExamManagementView.vue'),
      meta: { requiresAuth: true, roles: ['admin', 'teacher'] }
    },
    {
      path: '/transport',
      name: 'transport',
      component: () => import('@/views/TransportView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('@/views/EventsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/ReportsView.vue'),
      meta: { requiresAuth: true, roles: ['admin', 'teacher'] }
    },
    {
      path: '/parent-portal',
      name: 'parent-portal',
      component: () => import('@/views/ParentPortalView.vue'),
      meta: { requiresAuth: true, roles: ['parent'] }
    },
    {
      path: '/student-portal',
      name: 'student-portal',
      component: () => import('@/views/StudentPortalView.vue'),
      meta: { requiresAuth: true, roles: ['student'] }
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
