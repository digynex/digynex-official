<template>
  <div class="h-screen bg-slate-50 flex text-slate-800 font-sans overflow-hidden">
    <Sidebar @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

    <main class="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f7fb] relative">
      <TopHeader @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

      <div class="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Brain class="w-6 h-6 text-primary" /> BI Intelligence Reports
            </h1>
            <p class="text-sm font-medium text-slate-500 mt-1">Generate and schedule automated business intelligence exports via AI Data Hub.</p>
          </div>
          <div class="flex gap-2">
            <div class="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Automation Engine: Active
            </div>
          </div>
        </div>

        <!-- BI MONITORING CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div 
              v-for="card in biMetrics" 
              :key="card.label" 
              @click="openDrilldown(card.drilldown)"
              class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden"
            >
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-110 transition-transform"></div>
                <div class="relative z-10 flex items-center justify-between mb-4">
                  <div :class="card.color" class="p-2.5 rounded-xl shadow-sm group-hover:rotate-12 transition-transform">
                      <component :is="card.icon" class="w-6 h-6" />
                  </div>
                  <ArrowUpRight class="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <div class="relative z-10">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ card.label }}</p>
                  <h3 class="text-2xl font-black text-slate-900 tracking-tight">{{ card.value }}</h3>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <!-- Report Generator Card -->
            <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group">
                <!-- Processing Workstation Overlay -->
                <div v-if="isProcessing" class="absolute inset-0 bg-white/70 backdrop-blur-xl z-20 flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease]">
                    <div class="relative w-24 h-24 mb-6">
                        <div class="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <Cpu class="w-8 h-8 text-primary animate-pulse" />
                        </div>
                    </div>
                    
                    <div class="w-full max-w-xs space-y-3">
                        <div class="flex justify-between items-end">
                            <p class="text-[10px] font-black text-primary uppercase tracking-[0.2em] font-mono leading-none">{{ processingStep }}</p>
                            <span class="text-[14px] font-black text-slate-800 font-mono leading-none">{{ Math.floor(processingProgress) }}%</span>
                        </div>
                        <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                            <div 
                                class="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_15px_rgba(15,23,42,0.3)]"
                                :style="{ width: `${processingProgress}%` }"
                            ></div>
                        </div>
                        <div class="flex items-center justify-center gap-1.5 opacity-50">
                             <ShieldCheck class="w-3.5 h-3.5 text-emerald-500" />
                             <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Secure AI Stream</span>
                        </div>
                    </div>
                </div>

                <div class="p-8 border-b border-slate-50 bg-slate-50/20">
                    <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] mb-6 flex items-center gap-2">
                        <Database class="w-4 h-4 text-slate-400" /> Custom Report Context Builder
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-[11px] font-black text-slate-400 uppercase tracking-wider">Metric Universe</label>
                            <select class="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer">
                                <option>Revenue Analytics & Growth</option>
                                <option>Expense Tracking & Audit</option>
                                <option>Customer Pipeline Intelligence</option>
                                <option>Operational Efficiency Index</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label class="text-[11px] font-black text-slate-400 uppercase tracking-wider">Time Horizon</label>
                            <select class="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer">
                                <option>Current Quarter (Q1 2026)</option>
                                <option>Last 30 Dynamic Days</option>
                                <option>Year-to-Date Performance</option>
                                <option>Specific Event Windows</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="p-8 flex-1 flex flex-col justify-between">
                    <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Zap class="w-5 h-5"/></div>
                            <div>
                                <p class="text-sm font-bold text-slate-800">Advanced AI Synthesis</p>
                                <p class="text-xs text-slate-500">Inject automated executive summary</p>
                            </div>
                        </div>
                        <div @click="toggleAI" :class="includeAI ? 'bg-primary' : 'bg-slate-300'" class="w-12 h-6 rounded-full relative cursor-pointer transition-colors shadow-inner">
                            <div :class="includeAI ? 'translate-x-[24px]' : 'translate-x-0'" class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"></div>
                        </div>
                    </div>

                    <!-- DATA INTELLIGENCE PREVIEW (New Section) -->
                    <div class="flex items-center gap-6 p-6 border-y border-slate-50">
                        <div class="flex-1 space-y-4">
                            <div class="flex items-center justify-between">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compiler Confidence</p>
                                <span class="text-[10px] font-black text-emerald-500">99.4% RAW ACCURACY</span>
                            </div>
                            <!-- Mini Sparkline Simulation -->
                            <div class="flex items-end gap-1 h-12 w-full pr-8">
                                <div v-for="i in 12" :key="i" 
                                     :style="{ height: `${Math.random() * 80 + 20}%` }" 
                                     class="flex-1 bg-slate-100 rounded-sm hover:bg-primary/20 transition-colors cursor-help group relative">
                                     <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                         VAL:{{ Math.floor(Math.random() * 100) }}
                                     </div>
                                </div>
                            </div>
                        </div>
                        <div class="w-[120px] bg-slate-50 p-4 rounded-2xl border border-slate-100/50 space-y-3">
                            <div>
                                <p class="text-[8px] font-black text-slate-400 uppercase leading-none">Payload</p>
                                <p class="text-xs font-black text-slate-800 mt-1">~42 Nodes</p>
                            </div>
                            <div>
                                <p class="text-[8px] font-black text-slate-400 uppercase leading-none">Est. Pages</p>
                                <p class="text-xs font-black text-slate-800 mt-1">12-14 PDF</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button @click="generateReport" class="w-full py-4.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-3 group/btn mt-4">
                            <FileText class="w-5 h-5 group-hover/btn:scale-110 transition-transform" /> START REPORT COMPILATION
                        </button>
                        <p class="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.3em] mt-5">Security Standard: AES-256 Multi-layer Encryption</p>
                    </div>
                </div>
            </div>

            <!-- Scheduled Reports -->
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col">
                <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] mb-8 flex items-center gap-2">
                    <Clock class="w-4 h-4 text-slate-400" /> Automated Schedule Hub
                </h3>
                <div class="space-y-5 flex-1">
                    <div 
                        v-for="report in schedules" 
                        :key="report.name" 
                        @click="toggleScheduleStatus(report)"
                        class="p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-sm relative group overflow-hidden"
                        :class="report.active ? 'border-primary/10 hover:border-primary/30 hover:bg-slate-50' : 'opacity-60 grayscale-[0.5] border-slate-100 bg-slate-50/50'"
                    >
                        <!-- Active Indicator -->
                        <div v-if="report.active" class="absolute top-0 right-0 w-1.5 h-full bg-primary/20"></div>

                        <div class="flex items-center justify-between mb-3">
                            <span :class="report.color" class="text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider">{{ report.freq }}</span>
                            <div class="flex items-center gap-2">
                                <span class="text-[9px] font-black uppercase tracking-tighter" :class="report.active ? 'text-emerald-500' : 'text-slate-400'">
                                    {{ report.active ? 'Operational' : 'Paused' }}
                                </span>
                                <div :class="report.active ? 'bg-emerald-500 status-glow anim-pulse' : 'bg-slate-300'" class="w-1.5 h-1.5 rounded-full transition-all"></div>
                            </div>
                        </div>
                        <p class="text-sm font-black text-slate-800 transition-colors group-hover:text-primary leading-tight">{{ report.name }}</p>
                        <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                             <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                <Calendar class="w-3 h-3" />
                                {{ report.next }}
                             </div>
                             <div class="text-[9px] font-black text-slate-300 uppercase italic">
                                Last: {{ report.lastRun }}
                             </div>
                        </div>
                    </div>
                </div>
                <button @click="triggerToast('Schedule Configurator is restricted. Please contact System Admin.')" class="w-full mt-8 py-3.5 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-primary/20 hover:text-primary transition-all active:scale-95">
                    + Register New Automation
                </button>
            </div>
        </div>

        <!-- Recent Downloads -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
                <h3 class="font-black text-slate-800 uppercase tracking-widest text-[11px] flex items-center gap-2">
                   <Archive class="w-4 h-4 text-slate-400" /> Executive Manifest Archive
                </h3>
                <button class="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">Wipe History</button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-slate-50/50">
                        <tr class="text-left border-b border-slate-100">
                            <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Report Identifier</th>
                            <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Compiler Date</th>
                            <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Payload Size</th>
                            <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        <tr v-for="archive in archives" :key="archive.name" class="hover:bg-slate-50/50 transition-colors group">
                            <td class="px-8 py-5">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center font-black text-[10px] border border-red-100 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">PDF</div>
                                    <div>
                                        <p class="text-sm font-bold text-slate-800">{{ archive.name }}</p>
                                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">Signature: AI-Verified</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-8 py-5 text-xs font-bold text-slate-500">{{ archive.date }}</td>
                            <td class="px-8 py-5 text-xs font-bold text-slate-400 uppercase text-center font-mono">{{ archive.size }}</td>
                            <td class="px-8 py-5 text-right">
                                <button @click="generateReport" class="p-3 text-slate-400 hover:text-primary transition-all hover:bg-primary/5 rounded-xl"><Download class="w-4.5 h-4.5" /></button>
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
import { Brain, FileText, Download, Clock, X, Bell, Zap, Database, Activity, Archive, ArrowUpRight, Cpu, Calendar, ShieldCheck } from 'lucide-vue-next'
import Sidebar from '../components/dashboard/Sidebar.vue'
import TopHeader from '../components/dashboard/TopHeader.vue'
import DrilldownModal from '../components/dashboard/DrilldownModal.vue'

const isMobileMenuOpen = ref(false)
const toastState = ref({ show: false, message: '' })
const isProcessing = ref(false)
const processingStep = ref('')
const processingProgress = ref(0)
const includeAI = ref(true)

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

const generateReport = () => {
    isProcessing.value = true
    processingProgress.value = 5
    processingStep.value = "Authenticating Ledger Access..."
    
    let interval = setInterval(() => {
        if (processingProgress.value < 90) {
            processingProgress.value += Math.random() * 8;
            if (processingProgress.value > 25) processingStep.value = "Applying AI Heuristics Pattern...";
            if (processingProgress.value > 55) processingStep.value = "Injecting Synthetic Summaries...";
            if (processingProgress.value > 82) processingStep.value = "Signing Encrypted Manifest...";
        }
    }, 300);

    setTimeout(() => {
        clearInterval(interval);
        processingProgress.value = 100;
        setTimeout(() => {
            isProcessing.value = false;
            triggerToast("✓ Executive Report 'DigyNex_360_Audit_Q1.pdf' has been dispatched.");
            processingProgress.value = 0;
            
            // Simulating actual download
            const a = document.createElement('a');
            a.href = '#';
            a.download = 'DigyNex_360_Audit_Q1.pdf';
            a.click();
        }, 600);
    }, 4500)
}

const toggleAI = () => {
    includeAI.value = !includeAI.value;
    triggerToast(`AI Content Injection: ${includeAI.value ? 'Synchronized' : 'Bypassed'}`);
}

const biMetrics = [
    { label: 'Intelligence Sync', value: 'Live 99.8%', icon: Cpu, color: 'bg-indigo-50 text-indigo-600', drilldown: 'Database Architecture Sync' },
    { label: 'Automation Pulse', value: '14 Active', icon: Zap, iconBg: 'bg-emerald-50 text-emerald-600', color: 'bg-emerald-50 text-emerald-600', drilldown: 'Unified Revenue Stream' },
    { label: 'Managed Data', value: '4.2M Points', icon: Activity, color: 'bg-purple-50 text-purple-600', drilldown: 'P&L Context' }
]

const toggleScheduleStatus = (report) => {
    report.active = !report.active;
    triggerToast(`Automation Sequence '${report.name}' is now ${report.active ? 'Active' : 'Paused'}.`);
}

const schedules = ref([
    { name: 'Monthly Financial Audit', freq: 'Monthly', next: 'Apr 01, 2026', color: 'bg-blue-50 text-blue-600 border-blue-100', active: true, lastRun: 'Success (Mar 01)' },
    { name: 'Weekly Performance Pivot', freq: 'Weekly', next: 'Monday, 8:00 AM', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', active: true, lastRun: 'Success (Mar 24)' },
    { name: 'n8n Logic Hook Audit', freq: 'Daily', next: 'Tonight, 12:00 PM', color: 'bg-purple-50 text-purple-600 border-purple-100', active: false, lastRun: 'Paused' }
])

const archives = [
    { name: 'Q1 Performance Summary - Consolidated', date: 'Mar 24, 2026', size: '4.2 MB' },
    { name: 'Marketing ROI Analysis v2.1', date: 'Mar 22, 2026', size: '1.8 MB' },
    { name: 'Regional Revenue Distribution', date: 'Mar 15, 2026', size: '2.5 MB' },
    { name: 'System Anomaly Report (Feb)', date: 'Mar 02, 2026', size: '0.9 MB' }
]
</script>

<style scoped>
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

.status-glow { box-shadow: 0 0 10px rgba(16, 185, 129, 0.2); }
.anim-pulse { animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
</style>
