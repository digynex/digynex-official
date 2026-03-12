const routes = [
  {
    path: '/',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/landing',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/register',
    component: () => import('pages/RegisterPage.vue'),
  },
  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/DashboardPage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/students',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/StudentsPage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/tutors',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/TutorsPage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/teachers', // Keep for backward compatibility or redirect? Redirect/Alias is better but construction page generic logic might need update.
    redirect: '/tutors',
  },
  {
    path: '/payments',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/PaymentsPage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/classes',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/ClassesPage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/attendance',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/AttendancePage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/ReportsPage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/exams',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/ExamsPage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/ProfilePage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/SettingsPage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/UsersPage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/subscription',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/SubscriptionPage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/approvals',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/AdminProofsPage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/forgot-password',
    component: () => import('pages/ForgotPasswordPage.vue'),
  },
  {
    path: '/reset-password',
    component: () => import('pages/ResetPasswordPage.vue'),
  },
  {
    path: '/homework',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomeworkPage.vue') }],
    meta: { requiresAuth: true },
  },
  {
    path: '/parent-portal',
    component: () => import('pages/ParentPortalPage.vue'),
  },
  {
    path: '/super-admin',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/SuperAdminPage.vue') }],
    meta: { requiresAuth: true },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
