<template>
  <div class="h-screen bg-slate-50 flex text-slate-800 font-sans overflow-hidden">
    
    <Sidebar @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

    <main class="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f7fb] relative">
      
      <TopHeader @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

      <!-- GLOBAL ALERT SYSTEM -->
      <div v-show="showAlert" class="bg-red-50 border-b border-red-100 px-4 sm:px-8 py-2.5 flex items-center justify-between z-0 animate-[slideDown_0.4s_ease-out]">
        <div class="flex items-center gap-2.5 text-red-700 text-[13px] font-bold">
          <AlertTriangle class="w-4 h-4 animate-pulse shrink-0" />
          <span class="hidden sm:inline">System Alert: Software category revenue dropped by 12% WoW.</span>
          <span class="sm:hidden">Alert: Software revenue -12% WoW.</span>
        </div>
        <button @click="triggerToast('Routing to Anomaly Intelligence Tracker (Demo Mode)')" class="text-red-700 hover:text-red-900 text-xs font-black uppercase tracking-wider bg-red-100/50 hover:bg-red-200 px-3 py-1 rounded transition-colors whitespace-nowrap">Investigate</button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        
        <div v-if="isLoading" class="flex items-center justify-center h-64 flex-col gap-4">
           <div class="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
           <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">Syncing AI Data Pipeline...</p>
        </div>

        <div v-else>
          <KPICards :kpis="dashboardData.kpis" />

          <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            <MainChart :chartData="dashboardData.charts" @nodeClicked="handleNodeClick" @triggerToast="triggerToast" />
            <AIInsights :insights="dashboardData.insights" @triggerToast="triggerToast" />
          </div>

          <TargetBar :progress="dashboardData.kpis.targetProgress" />
        </div>

      </div>
    </main>

    <!-- DRILL DOWN MODAL  -->
    <DrilldownModal 
      :isOpen="isDrilldownOpen" 
      :category="drilldownCategory" 
      @close="isDrilldownOpen = false" 
      @triggerToast="triggerToast"
    />

    <!-- PREMIUM CUSTOM TOAST NOTIFICATION -->
    <transition name="toast-slide">
      <div v-if="toastState.show" class="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-700 max-w-sm flex items-start gap-4 ring-1 ring-white/10">
        <div class="mt-0.5 p-1.5 bg-primary/20 rounded-md text-primary ring-1 ring-primary/30"><Bell class="w-4 h-4"/></div>
        <div class="flex-1">
          <h4 class="font-bold text-sm mb-0.5 text-white tracking-wide uppercase">System Triggered</h4>
          <p class="text-[12px] text-slate-300 font-medium leading-relaxed">{{ toastState.message }}</p>
        </div>
        <button @click="toastState.show = false" class="ml-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-1 rounded transition-colors"><X class="w-4 h-4"/></button>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { AlertTriangle, Bell, X } from 'lucide-vue-next'

import Sidebar from '../components/dashboard/Sidebar.vue'
import TopHeader from '../components/dashboard/TopHeader.vue'
import KPICards from '../components/dashboard/KPICards.vue'
import MainChart from '../components/dashboard/MainChart.vue'
import AIInsights from '../components/dashboard/AIInsights.vue'
import TargetBar from '../components/dashboard/TargetBar.vue'
import DrilldownModal from '../components/dashboard/DrilldownModal.vue'

import { fetchDashboardMetrics } from '../services/apiMock'

const showAlert = ref(false)
const isLoading = ref(true)
const dashboardData = ref({ kpis: {}, charts: {}, insights: [] })
const isMobileMenuOpen = ref(false)

const isDrilldownOpen = ref(false)
const drilldownCategory = ref('')

// Toast State Management
const toastState = ref({ show: false, message: '' })
let toastTimer = null;
const triggerToast = (msg) => {
  if(toastTimer) clearTimeout(toastTimer);
  toastState.value = { show: true, message: msg };
  toastTimer = setTimeout(() => { toastState.value.show = false }, 4000);
}

onMounted(async () => {
  const data = await fetchDashboardMetrics()
  const targetKpis = data.kpis;
  
  dashboardData.value.kpis = { revenue: 0, profit: 0, cashFlow: 0, expenses: 0, targetProgress: 0 };
  dashboardData.value.charts = data.charts;
  dashboardData.value.insights = data.insights;
  isLoading.value = false;

  setTimeout(() => { showAlert.value = true }, 600)

  const duration = 1200;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); 
    
    dashboardData.value.kpis.revenue = (ease * targetKpis.revenue);
    dashboardData.value.kpis.profit = (ease * targetKpis.profit);
    dashboardData.value.kpis.cashFlow = (ease * targetKpis.cashFlow);
    dashboardData.value.kpis.expenses = (ease * targetKpis.expenses);
    dashboardData.value.kpis.targetProgress = (ease * targetKpis.targetProgress);
    
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
})

const handleNodeClick = (category) => {
  drilldownCategory.value = category;
  isDrilldownOpen.value = true;
}
</script>

<style>
@keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes slideUp { from { transform: translateY(10px); opacity: 0; scale: 0.98; } to { transform: translateY(0); opacity: 1; scale: 1; } }
@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }

.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }

.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
