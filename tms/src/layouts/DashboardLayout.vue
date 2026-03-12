<template>
  <q-layout view="lHh Lpr lFf" class="bg-slate-50 font-inter">
    <!-- Header -->
    <q-header class="bg-white text-primary shadow-1 q-py-xs" height-hint="60">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="q-mr-sm text-grey-7"
        />

        <q-toolbar-title class="text-weight-bold text-h6 text-gold-gradient row items-center">
          DigyNex
          <span
            class="text-caption text-white bg-primary q-px-xs q-py-none q-ml-sm rounded-borders"
            style="font-size: 10px; padding: 2px 6px"
            >BETA</span
          >
        </q-toolbar-title>

        <q-space />

        <!-- Top Right Actions -->
        <div class="q-gutter-x-sm row items-center">
          <!-- Org Switcher for Super Admins -->
          <q-select
            v-if="isSuperAdmin"
            v-model="currentOrg"
            :options="orgOptions"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            dense
            outlined
            rounded
            bg-color="grey-1"
            class="q-mr-md gt-xs"
            style="min-width: 200px"
            label="Active Institution"
            @update:model-value="handleOrgSwitch"
          >
            <template v-slot:prepend>
              <q-icon name="apartment" color="primary" />
            </template>
          </q-select>

          <q-input
            dense
            outlined
            rounded
            v-model="search"
            placeholder="Global Search..."
            class="gt-xs q-mr-md"
            bg-color="grey-1"
            borderless
            input-class="text-dark"
            style="min-width: 250px"
            @keyup.enter="handleSearch"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-6" class="cursor-pointer" @click="handleSearch" />
            </template>
          </q-input>

          <q-btn round flat color="grey-7" icon="notifications">
            <q-badge color="red" floating rounded mini v-if="notifications.length > 0" />
            <q-menu>
              <q-list style="min-width: 250px">
                <q-item-label header>Notifications</q-item-label>
                <div v-if="notifications.length === 0" class="text-center q-pa-md text-grey">
                  No new notifications
                </div>
                <q-item v-for="notif in notifications" :key="notif.id" clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>{{ notif.title }}</q-item-label>
                    <q-item-label caption>{{ notif.message }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn round flat color="grey-7" icon="settings" to="/settings" />

          <q-separator vertical inset class="q-mx-sm bg-grey-3" />

          <q-btn flat no-caps class="q-ml-none rounded-borders text-white pl-1">
            <q-avatar size="36px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="text-left q-ml-sm gt-xs">
              <div class="text-weight-bold text-subtitle2 text-white" style="line-height: 1.1">
                {{ authStore.profile?.name || userEmail.split('@')[0] || 'User' }}
              </div>
              <div class="text-caption text-grey-4" style="line-height: 1; font-size: 11px">
                {{ isSuperAdmin ? 'Super Admin' : 'Administrator' }}
              </div>
            </div>
            <q-menu
              transition-show="jump-down"
              transition-hide="jump-up"
              :offset="[0, 10]"
              class="bg-white border-light text-dark shadow-10"
            >
              <q-list style="min-width: 200px">
                <div class="q-px-md q-py-sm">
                  <div class="text-weight-bold">{{ userEmail.split('@')[0] || 'User' }}</div>
                  <div class="text-caption text-grey-6">{{ userEmail || 'Loading...' }}</div>
                </div>
                <q-separator class="bg-grey-2" />

                <q-item clickable v-close-popup to="/profile" class="text-grey-8">
                  <q-item-section avatar>
                    <q-icon name="person_outline" />
                  </q-item-section>
                  <q-item-section>My Profile</q-item-section>
                </q-item>

                <q-item clickable v-close-popup to="/settings" class="text-grey-8">
                  <q-item-section avatar>
                    <q-icon name="settings" />
                  </q-item-section>
                  <q-item-section>Settings</q-item-section>
                </q-item>

                <q-separator class="bg-grey-2" />

                <q-item
                  clickable
                  v-close-popup
                  @click="handleLogout"
                  class="text-red-7 hover:bg-red-50"
                >
                  <q-item-section avatar>
                    <q-icon name="logout" color="red-7" />
                  </q-item-section>
                  <q-item-section>Log Out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Demo Mode Banner -->
    <div v-if="authStore.isDemo" class="bg-gold-gradient text-white q-py-xs text-center text-weight-bold shadow-5 z-top relative-position" style="font-size: 12px; letter-spacing: 1px;">
      <q-icon name="info" class="q-mr-sm" />
      YOU ARE IN DEMO MODE. SENSITIVE ACTIONS ARE DISABLED. 
      <q-btn flat dense label="REGISTER NOW" color="white" class="q-ml-md text-underline" to="/register" size="sm" />
    </div>

    <!-- Sidebar (Drawer) -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="260">
      <div class="q-pa-none q-mb-none flex flex-center relative-position" style="min-height: 130px;">
        <div class="nav-logo-3d-sidebar">
          <div class="logo-inner">
            <img src="/logo.svg" alt="DigyNex" class="logo-face front">
            <img src="/logo.svg" alt="DigyNex" class="logo-face back">
          </div>
        </div>
      </div>

      <!-- List Content with Padding to prevent Overlap with Pinned Footer -->
      <q-list padding class="text-slate-300" style="padding-bottom: 280px;">
        <q-item-label
          header
          class="text-grey-5 text-uppercase text-weight-bold text-caption q-pl-lg q-mb-xs q-pt-sm"
          style="font-size: 0.7rem; letter-spacing: 1px"
        >
          Main Menu
        </q-item-label>

        <q-item
          clickable
          v-ripple
          v-for="link in mainLinks"
          :key="link.title"
          :to="link.link"
          active-class="active-dark-link"
          class="q-mx-md rounded-borders q-mb-sm transition-all text-slate-400"
        >
          <q-item-section avatar style="min-width: 40px">
            <q-icon :name="link.icon" size="22px" />
          </q-item-section>
          <q-item-section class="text-weight-medium text-body2">
            {{ link.title }}
          </q-item-section>
        </q-item>

        <q-separator spaced="lg" class="q-mx-lg bg-grey-8 opacity-20" />

        <q-item-label
          header
          class="text-grey-5 text-uppercase text-weight-bold text-caption q-pl-lg q-mb-xs"
          style="font-size: 0.7rem; letter-spacing: 1px"
        >
          Management
        </q-item-label>

        <q-item
          clickable
          v-ripple
          v-for="link in managementLinks"
          :key="link.title"
          :to="link.link"
          active-class="active-dark-link"
          class="q-mx-md rounded-borders q-mb-sm transition-all text-slate-400"
        >
          <q-item-section avatar style="min-width: 40px">
            <q-icon :name="link.icon" size="22px" />
          </q-item-section>
          <q-item-section class="text-weight-medium text-body2">
            {{ link.title }}
          </q-item-section>
        </q-item>

        <!-- Pinned Section Wrapper -->
        <div class="absolute-bottom bg-transparent q-pb-xs">
          <q-separator spaced="lg" class="q-mx-lg bg-grey-8 opacity-10" />
          <!-- Support Box (Stable & Safe from Overlap) -->
          <div
            class="q-mx-md q-mb-xs glass-box rounded-borders q-pa-md cursor-pointer hover-scale transition-all"
            @click="supportDialog = true"
          >
            <div class="row items-center no-wrap justify-between">
              <div class="row items-center no-wrap">
                <div class="bg-secondary-opacity q-pa-sm rounded-borders q-mr-sm">
                  <q-icon name="headset_mic" color="secondary" size="22px" />
                </div>
                <div class="column no-wrap overflow-hidden">
                  <div class="text-caption text-weight-bold text-white no-wrap" style="font-size: 13px">
                    Need Help?
                  </div>
                  <div class="text-caption text-grey-5 no-wrap" style="font-size: 10px">
                    Contact Support
                  </div>
                </div>
              </div>
              <q-icon name="chevron_right" color="grey-7" size="18px" class="q-ml-xs" />
            </div>
          </div>

          <!-- Static Footer Logo (OFFICIAL) -->
          <div class="sidebar-footer-container cursor-pointer" @click="openSite">
            <img src="/logo.svg" alt="DigyNex" class="footer-logo-static">
            <div class="copyright-text">
              © 2026 Systems Orchestrator
            </div>
          </div>
        </div>
      </q-list>
    </q-drawer>

    <!-- Support Dialog -->
    <q-dialog v-model="supportDialog">
      <q-card style="min-width: 350px" class="bg-white rounded-borders">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold text-primary">Contact Support</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="text-grey" />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <p class="text-grey-7 text-body2 q-mb-md">
            Have a question or need assistance? Choose an option below.
          </p>

          <div class="q-gutter-y-sm">
            <q-btn
              outline
              color="primary"
              class="full-width text-left"
              no-caps
              align="left"
              href="mailto:support@digynex.se"
              target="_blank"
            >
              <template v-slot:default>
                <div class="row items-center full-width">
                  <q-icon name="email" class="q-mr-md" size="sm" />
                  <div>
                    <div class="text-weight-bold">Email Support</div>
                    <div class="text-caption text-grey-6">response within 24h</div>
                  </div>
                </div>
              </template>
            </q-btn>

            <q-btn
              outline
              color="green-7"
              class="full-width text-left"
              no-caps
              align="left"
              href="https://digynex.se/whatsapp/"
              target="_blank"
            >
              <template v-slot:default>
                <div class="row items-center full-width">
                  <q-icon name="chat" class="q-mr-md" size="sm" />
                  <div>
                    <div class="text-weight-bold">WhatsApp Chat</div>
                    <div class="text-caption text-grey-6">Instant Support Portal</div>
                  </div>
                </div>
              </template>
            </q-btn>

            <q-btn
              unelevated
              class="full-width text-left bg-gold-gradient text-white"
              no-caps
              align="left"
              href="https://digynex.se"
              target="_blank"
            >
              <template v-slot:default>
                <div class="row items-center full-width">
                  <q-icon name="language" class="q-mr-md" size="sm" />
                  <div>
                    <div class="text-weight-bold">Visit Website</div>
                    <div class="text-caption text-white-opacity">digynex.se</div>
                  </div>
                </div>
              </template>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-container class="bg-slate-50" style="min-height: 100vh">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'stores/auth'
import { useCurrencyStore } from 'stores/currency'

const $q = useQuasar()
const authStore = useAuthStore()
const currencyStore = useCurrencyStore()
const router = useRouter()

// Hybrid Mode: Dark Sidebar, Light Content
$q.dark.set(true)

const leftDrawerOpen = ref(false)
const search = ref('')
const supportDialog = ref(false)
const notifications = ref([])

const userEmail = computed(() => authStore.user?.email || '')
const isSuperAdmin = computed(() => authStore.isSuperAdmin)

const orgOptions = ref([])
const currentOrg = ref(null)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleOrgSwitch = (orgId) => {
  authStore.setOrganization(orgId)
  $q.notify({
    type: 'info',
    message: `Switched to ${orgOptions.value.find(o => o.id === orgId)?.name}`,
    position: 'top'
  })
  // Ideally refresh the current route or use provide/inject to refresh components
  // For now, simple notification. The components should reactive to authStore.userOrgId
}

const fetchOrgs = async () => {
  const { data } = await supabase.from('organizations').select('id, name')
  if (data) {
    orgOptions.value = data
    currentOrg.value = authStore.userOrgId
  }
}

const handleSearch = () => {
  if (search.value.trim() === '') return
  router.push({ path: '/students', query: { q: search.value } })
}

const openSite = () => {
  window.open('https://digynex.se', '_blank')
}

const mainLinks = [{ title: 'Dashboard', icon: 'grid_view', link: '/dashboard' }]

const allManagementLinks = [
  { title: 'Students', icon: 'school', link: '/students' },
  { title: 'Tutors', icon: 'co_present', link: '/tutors' },
  { title: 'Classes', icon: 'class', link: '/classes' },
  { title: 'Attendance', icon: 'rule', link: '/attendance' },
  { title: 'Payments', icon: 'payments', link: '/payments' },
  { title: 'Exams', icon: 'assignment', link: '/exams' },
  { title: 'Homework', icon: 'menu_book', link: '/homework' },
  { title: 'Reports', icon: 'bar_chart', link: '/reports' },
  { title: 'Billing & Plan', icon: 'credit_card', link: '/subscription' },
  {
    title: 'System Users',
    icon: 'manage_accounts',
    link: '/super-admin',
    superAdminOnly: true,
  },
]

const managementLinks = computed(() => {
  return allManagementLinks.filter((link) => {
    if (link.superAdminOnly) {
      return isSuperAdmin.value
    }
    return true
  })
})

onMounted(async () => {
  if (!authStore.user) {
    await authStore.initialize()
  }

  // Initialize currency detection
  await currencyStore.initialize()

  if (isSuperAdmin.value) {
    fetchOrgs()
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}
.font-heading {
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.5px;
}

/* Sidebar Active State Styling (Dark Mode) */
.active-dark-link {
  position: relative;
  font-weight: 600 !important;
  background: rgba(16, 185, 129, 0.1) !important; /* Secondary/Emerald with low opacity */
  color: #10b981 !important; /* Emerald Text */
  border-right: 3px solid #10b981; /* Emerald Accent */
}

.transition-all {
  transition: all 0.3s ease;
}

.transition-all:hover {
  background-color: rgba(255, 255, 255, 0.05); /* Subtle white hover */
  color: white;
  padding-left: 20px;
}

/* Glass Box for Bottom Support Section */
.glass-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
}

.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.02);
  background: rgba(255, 255, 255, 0.07);
}

.text-gold-gradient {
  background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #bf953f; /* Fallback */
}

/* 3D LOGO STYLES (MATCHING CMS LARGE) */
.nav-logo-3d-sidebar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 220px;
  height: 220px;
  perspective: 1000px;
  z-index: 10;
  pointer-events: none;
}

.logo-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: logo-spin-3d 10s linear infinite;
}

.logo-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-face.front {
  transform: translateZ(1px);
}

.logo-face.back {
  transform: rotateY(180deg) translateZ(1px);
}

.logo-face img {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 25px rgba(191, 149, 63, 0.4));
}

@keyframes logo-spin-3d {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
}

.bg-gold-gradient {
  background: linear-gradient(to right, #bf953f, #b38728);
}

/* STATIC FOOTER LOGO & CENTERING */
.sidebar-footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 5px;
}

.footer-logo-static {
  width: 160px;
  height: auto;
  opacity: 0.8;
  filter: drop-shadow(0 0 10px rgba(191, 149, 63, 0.1));
  transition: 0.3s;
  display: block;
}

.footer-logo-static:hover {
  opacity: 1;
  filter: drop-shadow(0 0 15px rgba(191, 149, 63, 0.3));
}

.copyright-text {
  font-size: 9px;
  color: #424242; /* grey-8 shade */
  margin-top: -35px;
  text-align: center;
  width: 100%;
  letter-spacing: 1px;
}

/* Smooth Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.border-bottom-light {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
