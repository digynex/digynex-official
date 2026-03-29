import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import DashboardView from '../views/DashboardView.vue'
import SalesPivotView from '../views/SalesPivotView.vue'
import FinanceView from '../views/FinanceView.vue'
import BIReportsView from '../views/BIReportsView.vue'
import OperationsView from '../views/OperationsView.vue'
import SettingsView from '../views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/sales-pivot',
      name: 'sales-pivot',
      component: SalesPivotView
    },
    {
      path: '/bi-reports',
      name: 'bi-reports',
      component: BIReportsView
    },
    {
      path: '/finance',
      name: 'finance',
      component: FinanceView
    },
    {
      path: '/operations',
      name: 'operations',
      component: OperationsView
    },
    {
      path: '/crm',
      name: 'crm',
      component: () => import('../views/CRMView.vue')
    },
    {
      path: '/sales-nexus',
      name: 'sales-nexus',
      component: () => import('../views/SalesNexusView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    }
  ]
})

export default router
