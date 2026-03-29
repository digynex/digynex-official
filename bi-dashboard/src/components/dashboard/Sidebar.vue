<template>
  <aside class="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col shadow-sm z-20 flex-shrink-0">
      <div class="h-16 flex items-center px-6 border-b border-slate-100">
        <router-link to="/" class="flex items-center gap-2 text-slate-900 font-extrabold text-xl tracking-tight hover:opacity-80 transition-opacity">
          <div class="p-1.5 bg-primary rounded-lg shadow-sm">
            <Layers class="w-5 h-5 text-white" />
          </div>
          {{ brandingStore.productName }}<span class="text-primary font-light">{{ brandingStore.productSuffix }}</span>
        </router-link>
      </div>
      
      <div class="px-4 py-6 flex-1 overflow-y-auto custom-scrollbar">
                <!-- INTELLIGENCE SECTION (EXECUTIVE ONLY) -->
        <div v-if="authStore.can('dashboard')">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Intelligence</p>
          <nav class="space-y-1 mb-8">
            <router-link to="/dashboard" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-all group" active-class="bg-slate-900 text-white hover:bg-slate-800">
              <LayoutDashboard class="w-4 h-4 group-hover:scale-110 transition-transform" /> Executive Board
            </router-link>
            
            <router-link v-if="authStore.can('sales')" to="/sales-pivot" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors group" active-class="bg-slate-900 text-white hover:bg-slate-800">
              <TrendingUp class="w-4 h-4 group-hover:text-primary transition-colors" /> Sales Pivot
            </router-link>
            
            <router-link v-if="authStore.can('bi')" to="/bi-reports" class="flex items-center justify-between px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors group" active-class="bg-slate-900 text-white hover:bg-slate-800">
              <div class="flex items-center gap-3"><Brain class="w-4 h-4 group-hover:text-accent transition-colors" /> BI Reports</div>
              <span class="w-2 h-2 rounded-full bg-accent animate-pulse shadow-sm"></span>
            </router-link>

            <router-link v-if="authStore.can('sales')" to="/sales-nexus" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors group" active-class="bg-slate-900 text-white hover:bg-slate-800">
              <Target class="w-4 h-4 group-hover:text-indigo-600 transition-colors" /> AI Social Nexus
            </router-link>
          </nav>
        </div>

        <!-- OPERATIONS SECTION -->
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Operations</p>
          <nav class="space-y-1">
            <router-link v-if="authStore.can('operations')" to="/operations" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors" active-class="bg-slate-900 text-white hover:bg-slate-800">
              <Briefcase class="w-4 h-4" /> Operations
            </router-link>
            <router-link v-if="authStore.can('finance')" to="/finance" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors" active-class="bg-slate-900 text-white hover:bg-slate-800">
              <Wallet class="w-4 h-4" /> Finance
            </router-link>
            <router-link v-if="authStore.can('crm')" to="/crm" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors" active-class="bg-slate-900 text-white hover:bg-slate-800">
              <Users class="w-4 h-4" /> Strategic Partners
            </router-link>
            <router-link v-if="authStore.can('settings')" to="/settings" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors mt-4 border-t border-slate-100 pt-5" active-class="bg-slate-900 text-white hover:bg-slate-800 border-t-0 mt-2 pt-2.5">
              <Settings class="w-4 h-4" /> Settings
            </router-link>
          </nav>
        </div>


      </div>

      <div class="p-4 border-t border-slate-100 bg-slate-50/50">
        <div class="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200" @click="$emit('triggerToast', 'Profile Context Loading...')">
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
            {{ authStore.user.avatar }}
          </div>
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ authStore.user.name }}</p>
            <p class="text-[11px] text-slate-500 truncate">{{ authStore.roleLabels[authStore.user.role] }}</p>
          </div>
          <ChevronRight class="w-4 h-4 text-slate-400" />
        </div>
      </div>
  </aside>
</template>

<script setup>
import { Layers, LayoutDashboard, TrendingUp, Brain, Briefcase, Wallet, Settings, ChevronRight, Users, Target } from 'lucide-vue-next'
import { authStore } from '../../services/authService'
import { brandingStore } from '../../services/brandingService'

defineEmits(['toggleMenu', 'triggerToast'])
</script>
