<template>
  <aside class="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col shadow-sm z-20 flex-shrink-0">
      <div class="h-16 flex items-center px-6 border-b border-slate-100">
        <router-link to="/" class="flex items-center gap-2 text-slate-900 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
          <div class="p-1.5 bg-primary rounded-lg shadow-sm">
            <Layers class="w-5 h-5 text-white" />
          </div>
          DigyNex<span class="text-primary font-light">DSS</span>
        </router-link>
      </div>
      
      <div class="px-4 py-6 flex-1 overflow-y-auto custom-scrollbar">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Intelligence</p>
        <nav class="space-y-1 mb-8">
          <router-link to="/dashboard" class="flex items-center gap-3 px-3 py-2.5 bg-slate-900 text-white rounded-lg font-medium shadow-sm transition-all hover:bg-slate-800 group">
            <LayoutDashboard class="w-4 h-4 group-hover:scale-110 transition-transform" /> Executive Board
          </router-link>
          
          <a href="#" @click.prevent="$emit('triggerToast', 'Sales Pivot module locked. Available in Scale-up Enterprise Tier.')" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors group">
            <TrendingUp class="w-4 h-4 group-hover:text-primary transition-colors" /> Sales Pivot
          </a>
          <a href="#" @click.prevent="$emit('triggerToast', 'BI Reports engine is syncing with PostgreSQL Data Warehouse v1.4.')" class="flex items-center justify-between px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors group">
            <div class="flex items-center gap-3"><Brain class="w-4 h-4 group-hover:text-accent transition-colors" /> BI Reports</div>
            <span class="w-2 h-2 rounded-full bg-accent animate-pulse shadow-sm"></span>
          </a>
        </nav>

        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Operations</p>
        <nav class="space-y-1">
          <a href="#" @click.prevent="$emit('triggerToast', 'Core Operations tracker in deployment stack.')" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors">
            <Briefcase class="w-4 h-4" /> Operations
          </a>
          <a href="#" @click.prevent="$emit('triggerToast', 'Finance Vault access restricted to Level 4 Authentication.')" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors">
            <Wallet class="w-4 h-4" /> Finance
          </a>
          <a href="#" @click.prevent="$emit('triggerToast', 'Organization Settings locked during active session sync.')" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors mt-4 border-t border-slate-100 pt-5">
            <Settings class="w-4 h-4" /> Settings
          </a>
        </nav>
      </div>

      <div class="p-4 border-t border-slate-100 bg-slate-50/50">
        <div class="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200" @click="$emit('triggerToast', 'Profile Context Loading...')">
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
            AM
          </div>
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-semibold text-slate-800 truncate">Amila W.</p>
            <p class="text-[11px] text-slate-500 truncate">Super Admin</p>
          </div>
          <ChevronRight class="w-4 h-4 text-slate-400" />
        </div>
      </div>
  </aside>
</template>

<script setup>
import { Layers, LayoutDashboard, TrendingUp, Brain, Briefcase, Wallet, Settings, ChevronRight } from 'lucide-vue-next'

defineEmits(['toggleMenu', 'triggerToast'])
</script>
