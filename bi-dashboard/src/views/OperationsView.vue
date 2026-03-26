<template>
  <div class="h-screen bg-slate-50 flex text-slate-800 font-sans overflow-hidden">
    <Sidebar @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

    <main class="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f7fb] relative">
      <TopHeader @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

      <div class="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Cpu class="w-6 h-6 text-primary" /> Operational Efficiency
                </h1>
                <p class="text-sm font-medium text-slate-500 mt-1">Real-time monitoring of business workflow and performance throughput across DigyNex Hub.</p>
            </div>
            <div class="flex items-center gap-3">
                <button @click="triggerToast('Re-indexing Operational Nodes...')" class="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                    <RefreshCw class="w-4 h-4 text-slate-400 font-black" />
                </button>
                <div class="px-4 py-2 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10">
                    Latency: 12ms
                </div>
            </div>
        </div>

        <!-- OPERATIONS METRICS GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div 
              v-for="op in ops_metrics" 
              :key="op.label" 
              @click="openDrilldown(op.label)"
              class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden"
            >
                <div class="absolute -right-2 top-0 w-16 h-16 bg-slate-50 rounded-full group-hover:scale-125 transition-transform opacity-50"></div>
                <div class="flex items-center gap-2 mb-3">
                    <div :class="op.bg" class="p-1.5 rounded-lg shadow-sm">
                        <component :is="op.icon" class="w-4 h-4" />
                    </div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ op.label }}</p>
                </div>
                <div class="flex items-end justify-between relative z-10">
                    <h3 class="text-2xl font-black text-slate-900 tracking-tight">{{ op.value }}</h3>
                    <div :class="op.trend === 'up' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100' " class="text-[10px] font-black px-2 py-0.5 rounded-full border">
                        <span v-if="op.trend === 'up'">↑</span>
                        <span v-else>↓</span>
                        {{ op.percent }}%
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
             <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col min-h-[450px]">
                <div class="flex items-center justify-between mb-8">
                    <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
                        <Activity class="w-4 h-4 text-primary" /> Throughput Multi-threading (24H)
                    </h3>
                    <div class="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                      <span class="text-[9px] font-black text-slate-500 uppercase">Live Flux Monitor</span>
                    </div>
                </div>
                <div class="flex-1">
                    <apexchart type="area" height="100%" :options="chartOptions" :series="chartSeries"></apexchart>
                </div>
                <div class="mt-4 flex flex-wrap gap-4 pt-4 border-t border-slate-50">
                    <div v-for="tag in ['Worker A', 'Worker B', 'Worker C']" :key="tag" class="flex items-center gap-2">
                        <span class="w-2 h-0.5 bg-primary rounded"></span>
                        <span class="text-[10px] font-bold text-slate-500">{{ tag }} : Load 64.2%</span>
                    </div>
                </div>
             </div>

             <!-- Optimization Action Side -->
             <div class="space-y-6 flex flex-col h-full">
                 <div class="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group flex-1">
                     <div class="absolute -right-10 -bottom-10 bg-white/10 w-48 h-48 rounded-full blur-[80px] group-hover:scale-150 transition-transform"></div>
                     <div class="relative z-10">
                        <div class="flex items-start justify-between mb-4">
                            <div class="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20"><Zap class="w-6 h-6 text-white" /></div>
                            <span class="bg-white/10 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter border border-white/20">System High Priority</span>
                        </div>
                        <h2 class="text-2xl font-black tracking-tight mb-4">AI Efficiency Pulse</h2>
                        <p class="text-indigo-100 text-sm leading-relaxed mb-8">Intelligence engine detected a <span class="text-white font-black underline decoration-emerald-400 decoration-2 underline-offset-4">12% latency spike</span> in n8n Lead processing. Recommending core-sharding protocol.</p>
                     </div>
                     <button @click="executeOptimization" :disabled="isOptimizing" class="w-full py-4.5 bg-white text-indigo-600 rounded-2xl font-black text-sm transition-all hover:bg-slate-50 active:scale-[0.98] shadow-xl relative z-10 flex items-center justify-center gap-2">
                        <component :is="isOptimizing ? Loader2 : Zap" class="w-4 h-4" :class="isOptimizing ? 'animate-spin' : ''" />
                        {{ isOptimizing ? 'Sharding Core...' : 'Execute AI Optimization' }}
                     </button>
                 </div>

                 <!-- System Health Tags -->
                 <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50 pb-3">Sub-System Heartbeat</p>
                    <div class="grid grid-cols-2 gap-3">
                         <div v-for="node in ['Supabase', 'n8n Cloud', 'Apex Sync', 'Global CDN']" :key="node" class="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                            <span class="text-[10px] font-bold text-slate-700">{{ node }}</span>
                         </div>
                    </div>
                 </div>
             </div>
        </div>

        <!-- OPERATIONAL WORKFLOW AUDIT TABLE -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
                <h3 class="font-black text-slate-800 uppercase tracking-widest text-[11px] flex items-center gap-2">
                   <Database class="w-4 h-4 text-slate-400" /> Operational Workflow Audit (Latest)
                </h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-slate-50/50">
                        <tr class="text-left border-b border-slate-100">
                            <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Process Identifier</th>
                            <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution Path</th>
                            <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Throughput</th>
                            <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">State</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        <tr v-for="log in opLogs" :key="log.id" class="hover:bg-slate-50/50 transition-colors group">
                            <td class="px-8 py-5">
                                <span class="text-xs font-black text-slate-400 font-mono">{{ log.id }}</span>
                            </td>
                            <td class="px-8 py-5">
                                <div class="flex items-center gap-3">
                                    <div class="p-1.5 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <component :is="log.icon" class="w-4 h-4" />
                                    </div>
                                    <span class="text-sm font-bold text-slate-800">{{ log.name }}</span>
                                </div>
                            </td>
                            <td class="px-8 py-5 text-xs font-bold text-slate-500 text-center font-mono">{{ log.throughput }}</td>
                            <td class="px-8 py-5 text-right">
                                <span class="px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 italic">Success</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
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
import { ref } from 'vue'
import { Activity, X, Cpu, Zap, Activity as ActivityIcon, Users, RefreshCw, Layers, Database, Bell, Loader2, Workflow, Terminal, Server } from 'lucide-vue-next'
import Sidebar from '../components/dashboard/Sidebar.vue'
import TopHeader from '../components/dashboard/TopHeader.vue'
import DrilldownModal from '../components/dashboard/DrilldownModal.vue'

const isMobileMenuOpen = ref(false)
const toastState = ref({ show: false, message: '' })
const isOptimizing = ref(false)

// Drilldown State
const isDrilldownOpen = ref(false)
const drilldownCategory = ref('')

const openDrilldown = (cat) => {
    drilldownCategory.value = cat;
    isDrilldownOpen.value = true;
}

const triggerToast = (msg) => {
  toastState.value = { show: true, message: msg }
  setTimeout(() => { toastState.value.show = false }, 4000)
}

const executeOptimization = () => {
    isOptimizing.value = true;
    triggerToast("Executing AI Multi-threading Shard Protocol...")
    setTimeout(() => {
        isOptimizing.value = false;
        triggerToast("✓ Optimization Applied: Worker Throughput stabilized at 12ms latency.")
    }, 2800)
}

const ops_metrics = [
    { label: 'Platform Uptime', value: '99.98%', percent: '0.02', trend: 'up', icon: ActivityIcon, bg: 'bg-emerald-50 text-emerald-600' },
    { label: 'Lead Response Time', value: '4.2m', percent: '14', trend: 'down', icon: Zap, bg: 'bg-blue-50 text-blue-600' },
    { label: 'Workload Density', value: '84%', percent: '2.1', trend: 'up', icon: Layers, bg: 'bg-indigo-50 text-indigo-600' },
    { label: 'System Saturation', value: '12.8ms', percent: '5', trend: 'down', icon: Cpu, bg: 'bg-purple-50 text-purple-600' }
]

const opLogs = [
    { id: '#EXEC-9821', name: 'Global Subscription Batch', throughput: '4.2 req/s', icon: Workflow },
    { id: '#EXEC-9820', name: 'AI Image Manifest Generation', throughput: '1.8 req/s', icon: Terminal },
    { id: '#EXEC-9819', name: 'Supabase Edge Sync', throughput: '112 req/s', icon: Server },
    { id: '#EXEC-9818', name: 'CRM Webhook Relay', throughput: '9 req/s', icon: RefreshCw }
]

const chartSeries = [{
    name: 'Throughput',
    data: [42, 52, 38, 65, 50, 109, 100, 120, 80, 95]
}]

const chartOptions = {
    chart: { type: 'area', toolbar: { show: false }, sparkline: { enabled: false }, fontFamily: 'Inter' },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3, colors: ['#6366f1'] },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05 } },
    xaxis: { categories: ['1AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '11PM', '12AM'], labels: { style: { colors: '#64748b', fontWeight: 600 } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { show: false } },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    tooltip: { theme: 'dark' }
}
</script>

<style scoped>
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>

<style scoped>
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>
