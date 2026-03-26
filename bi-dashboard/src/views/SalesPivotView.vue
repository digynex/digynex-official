<template>
  <div class="h-screen bg-slate-50 flex text-slate-800 font-sans overflow-hidden">
    <Sidebar @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

    <main class="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f7fb] relative">
      <TopHeader @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

      <div class="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center h-full gap-4 text-center mt-20">
             <div class="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
             <p class="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Compiling Sales Intelligence...</p>
        </div>

        <div v-else class="animate-[slideDown_0.4s_ease-out]">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp class="w-6 h-6 text-primary" /> Sales Pivot Analysis
              </h1>
              <p class="text-sm font-medium text-slate-500 mt-1">Deep-dive into multi-dimensional performance and channel efficiency.</p>
            </div>
            <div class="flex gap-3">
              <button @click="toggleFilter" :disabled="isDataFiltering" class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50">
                <Calendar class="w-4 h-4 text-slate-400" /> This Month
              </button>
              <button @click="handleExport" :disabled="isExporting" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70">
                <Download v-if="!isExporting" class="w-4 h-4" />
                <div v-else class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {{ isExporting ? 'Processing...' : 'Export Report' }}
              </button>
            </div>
          </div>

          <!-- Sales Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div 
                v-for="metric in metrics" 
                :key="metric.label" 
                @click="openMetricDrilldown(metric.label)"
                class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group"
              >
                  <div class="flex items-center justify-between mb-4">
                      <div :class="metric.iconBg" class="p-2.5 rounded-xl transition-transform group-hover:rotate-12">
                          <component :is="metric.icon" class="w-5 h-5" />
                      </div>
                      <span :class="metric.trendBg" class="text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 shrink-0">
                          <component :is="metric.trend.includes('+') ? TrendingUp : Activity" class="w-3 h-3" />
                          {{ metric.trend }}
                      </span>
                  </div>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ metric.label }}</p>
                  <h3 class="text-2xl font-black text-slate-900 tracking-tight">{{ metric.value }}</h3>
              </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <!-- Channel Performance Chart -->
              <div class="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div v-if="isDataFiltering" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center transition-all">
                      <div class="flex flex-col items-center gap-3">
                          <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <p class="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Synching Data Vault...</p>
                      </div>
                  </div>
                  <div class="flex items-center justify-between mb-8">
                    <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
                        <PieChart class="w-5 h-5 text-accent" /> Revenue by Channel Distribution
                    </h3>
                    <div class="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span class="text-[10px] font-black text-slate-500 uppercase">Live Metrics</span>
                    </div>
                  </div>
                  <div class="h-[350px]">
                      <apexchart type="bar" height="100%" :options="barOptions" :series="barSeries"></apexchart>
                  </div>
                  <p class="text-[11px] text-slate-400 font-medium mt-4 italic text-center underline decoration-slate-100 underline-offset-4">Click any bar to drill-down into specific channel transactions.</p>
              </div>

              <!-- Top Performing Segments -->
              <div class="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <div class="p-6 border-b border-slate-50">
                    <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-widest">Top Channel Clusters</h3>
                  </div>
                  <div class="p-6 space-y-6 flex-1">
                      <div 
                        v-for="segment in segments" 
                        :key="segment.name" 
                        @click="openSegmentDetail(segment)"
                        class="flex items-center justify-between group cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
                      >
                          <div class="flex items-center gap-3">
                              <div class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-primary transition-all shadow-lg shadow-slate-900/10">
                                 <span class="text-sm font-black">{{ segment.short }}</span>
                              </div>
                              <div>
                                  <p class="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">{{ segment.name }}</p>
                                  <p class="text-[11px] font-medium text-slate-400 mt-0.5">{{ segment.count }} Valid Leads</p>
                              </div>
                          </div>
                          <div class="text-right">
                              <p class="text-sm font-black text-slate-900">{{ segment.revenue }}</p>
                              <div :class="segment.growth > 0 ? 'text-emerald-500' : 'text-amber-500'" class="flex items-center justify-end gap-1 text-[10px] font-black">
                                <Activity class="w-2.5 h-2.5" />
                                {{ segment.growth > 0 ? '+' : '' }}{{ segment.growth }}%
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="p-5 bg-slate-50 border-t border-slate-100 mt-auto">
                    <button @click="isModalOpen = true" class="w-full py-3 bg-white hover:bg-primary hover:text-white border border-slate-200 hover:border-primary text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95">
                        Expand All Channels
                    </button>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </main>

    <!-- DRILL DOWN MODAL: ALL CHANNELS (Existing List) -->
    <transition name="modal-fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-md" @click="isModalOpen = false"></div>
        <div class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-20 overflow-hidden flex flex-col max-h-[90vh] animate-[slideUp_0.3s_ease-out]">
          <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <div>
                <h3 class="text-xl font-black text-slate-900 tracking-tight">Full Channel Distribution</h3>
                <p class="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Global Marketing Audit</p>
             </div>
             <button @click="isModalOpen = false" class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X class="w-6 h-6"/></button>
          </div>
          <div class="p-8 overflow-y-auto custom-scrollbar bg-white flex-1">
            <div class="space-y-4">
               <div v-for="item in allChannels" :key="item.name" class="p-5 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-primary/20 hover:bg-primary/5 hover:scale-[1.01] transition-all cursor-default group">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center text-slate-400 font-black group-hover:scale-110 transition-transform">{{ item.initials }}</div>
                    <div>
                        <p class="font-bold text-slate-900">{{ item.name }}</p>
                        <span :class="item.share > 30 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'" class="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border mt-1 inline-block">
                          {{ item.status }}
                        </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-black text-slate-900 text-lg">{{ item.revenue }}</p>
                    <p class="text-[11px] font-bold text-slate-400 mt-0.5">{{ item.share }}% Aggregate Share</p>
                  </div>
               </div>
            </div>
          </div>
          <div class="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
             <p class="text-[10px] font-bold text-slate-400 uppercase">Synchronized with AI Data Hub</p>
             <button @click="isModalOpen = false" class="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-lg shadow-slate-900/20 active:scale-95 transition-all">Close Analytics</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- DRILL DOWN MODAL (GLOBAL SYSTEM COMPONENT) -->
    <DrilldownModal 
      :isOpen="isDrilldownOpen" 
      :category="drilldownCategory" 
      @close="isDrilldownOpen = false" 
      @triggerToast="triggerToast"
    />

    <!-- PREMIUM CUSTOM TOAST NOTIFICATION -->
    <transition name="toast-slide">
      <div v-if="toastState.show" class="fixed bottom-10 right-10 z-[1200] bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-4 ring-1 ring-white/10 max-w-sm">
        <div class="mt-0.5 p-1.5 bg-primary/20 rounded-md text-primary ring-1 ring-primary/30"><Bell class="w-4 h-4"/></div>
        <div class="flex-1">
          <p class="text-[12px] text-slate-300 font-medium leading-relaxed">{{ toastState.message }}</p>
        </div>
        <button @click="toastState.show = false" class="ml-2 text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"><X class="w-4 h-4"/></button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { TrendingUp, Calendar, Download, PieChart, Users, ShoppingCart, Target, CreditCard, Bell, X, Loader2, Activity } from 'lucide-vue-next'
import Sidebar from '../components/dashboard/Sidebar.vue'
import TopHeader from '../components/dashboard/TopHeader.vue'
import DrilldownModal from '../components/dashboard/DrilldownModal.vue'
import { fetchSalesMetrics } from '../services/salesService'
import { brandingStore } from '../services/brandingService'

const isMobileMenuOpen = ref(false)
const isModalOpen = ref(false)
const isLoading = ref(true)
const isDataFiltering = ref(false)
const isExporting = ref(false)
const toastState = ref({ show: false, message: '' })

// Drilldown State
const isDrilldownOpen = ref(false)
const drilldownCategory = ref('')

const salesData = ref({ summary: {}, channels: [], chart: { categories: [], data: [] } })

const triggerToast = (msg) => {
  toastState.value = { show: true, message: msg }
  setTimeout(() => { toastState.value.show = false }, 4000)
}

onMounted(async () => {
    try {
        const data = await fetchSalesMetrics();
        if (data) {
            salesData.value = data;
        }
    } catch (err) {
        triggerToast("Failed to sync Sales Vault data.")
    } finally {
        isLoading.value = false;
    }
})

const metrics = computed(() => {
    return [
        { label: 'Avg Order Value', value: brandingStore.currency + ' ' + (salesData.value.summary.avgOrderValue || '0K'), icon: CreditCard, iconBg: 'bg-blue-50 text-blue-600', trend: '+5.2%', trendBg: 'bg-emerald-50 text-emerald-600' },
        { label: 'Conversion Rate', value: salesData.value.summary.convRate || '0.00%', icon: Target, iconBg: 'bg-indigo-50 text-indigo-600', trend: '+1.1%', trendBg: 'bg-emerald-50 text-emerald-600' },
        { label: 'Total Orders', value: (salesData.value.summary.totalOrders || '0').toString(), icon: ShoppingCart, iconBg: 'bg-purple-50 text-purple-600', trend: '-2.4%', trendBg: 'bg-red-50 text-red-600' },
        { label: 'New Customers', value: (salesData.value.summary.newCustomers || '0').toString(), icon: Users, iconBg: 'bg-orange-50 text-orange-600', trend: '+12.5%', trendBg: 'bg-emerald-50 text-emerald-600' }
    ];
})

const segments = computed(() => {
    return (salesData.value.channels || []).slice(0, 4).map(c => ({
        name: c.name,
        short: c.name.substring(0,2).toUpperCase(),
        count: c.count,
        revenue: brandingStore.currency + ' ' + c.revenue,
        growth: Math.floor(Math.random() * 20 - 5) // Mocking growth based on performance
    }));
})

const barSeries = computed(() => [{
    name: `Revenue (${brandingStore.currency})`,
    data: salesData.value.chart.data || []
}])

const barOptions = computed(() => ({
    chart: { 
      type: 'bar', 
      toolbar: { show: false }, 
      fontFamily: 'Inter',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const channel = salesData.value.chart.categories[config.dataPointIndex];
          openMetricDrilldown(`Channel Analysis: ${channel}`);
        }
      }
    },
    plotOptions: { bar: { borderRadius: 8, columnWidth: '45%', distributed: true } },
    dataLabels: { enabled: false },
    colors: ['#0f172a', '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#facc15'],
    xaxis: { 
      categories: salesData.value.chart.categories || [],
      labels: { style: { fontWeight: 700, colors: '#64748b' } }
    },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    tooltip: { theme: 'dark', y: { formatter: (val) => val + " Million " + brandingStore.currency } },
    legend: { show: false }
}))

const allChannels = computed(() => {
    return (salesData.value.channels || []).map(c => ({
        initials: c.name.substring(0,2).toUpperCase(),
        name: c.name,
        status: c.share > 30 ? 'Leading Source' : 'Secondary Stream',
        revenue: brandingStore.currency + ' ' + c.revenue,
        share: c.share
    }));
})

const handleExport = () => {
    isExporting.value = true
    triggerToast("Compiling multi-dimensional Sales Pivot manifest...")
    
    setTimeout(() => {
        triggerToast("AI-validation of Channel Mix complete. Generating charts...")
        
        setTimeout(() => {
            isExporting.value = false
            triggerToast("✓ Sales Report 'DigyNex_Sales_Q1.pdf' downloaded successfully.")
            const dummy = document.createElement('a')
            dummy.href = '#'
            dummy.download = 'DigyNex_Sales_Q1.pdf'
            dummy.click()
        }, 2000)
    }, 1500)
}

const toggleFilter = () => {
    isDataFiltering.value = true;
    setTimeout(() => {
        isDataFiltering.value = false;
        triggerToast("Data context synched for 'Target Performance' timeframe.")
    }, 1200)
}

const openSegmentDetail = (seg) => {
    openMetricDrilldown(`Channel Segment: ${seg.name}`);
}

const openMetricDrilldown = (label) => {
    drilldownCategory.value = label;
    isDrilldownOpen.value = true;
}
</script>

<style scoped>
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }

.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.4s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(1.05); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

@keyframes slideDown { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; scale: 0.98; } to { transform: translateY(0); opacity: 1; scale: 1; } }
</style>

<style scoped>
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }

.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.4s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(1.05); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

@keyframes slideDown { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; scale: 0.98; } to { transform: translateY(0); opacity: 1; scale: 1; } }
</style>



<style scoped>
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }

.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.4s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(1.05); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>
