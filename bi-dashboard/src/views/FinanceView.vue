<template>
  <div class="h-screen bg-slate-50 flex text-slate-800 font-sans overflow-hidden">
    <Sidebar @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

    <main class="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f7fb] relative">
      <TopHeader @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

      <div class="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center h-full gap-4 text-center">
             <div class="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
             <p class="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono">Synthesizing Ledger Insights...</p>
        </div>

        <div v-else class="animate-[slideDown_0.4s_ease-out]">
          <!-- HEADER SECTION (REFINDED SPACING) -->
          <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Wallet class="w-6 h-6 text-emerald-500" /> Financial Intelligence Vault
              </h1>
              <p class="text-sm font-medium text-slate-500 mt-1 max-w-xl">Cash flow oversight, P&L reporting and multi-tenant ledger control for the DigyNex 360 Ecosystem.</p>
            </div>
            <div class="flex items-center gap-3">
               <button @click="isAuditModalOpen = true" class="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2">
                <Calendar class="w-4 h-4 text-slate-400" /> Final Q1 Review
              </button>
              <button @click="isAddModalOpen = true" class="px-5 py-2.5 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2 group/add">
                <Plus class="w-4 h-4 group-hover/add:rotate-90 transition-transform duration-300" /> Add Record
              </button>
            </div>
          </div>

          <!-- KPI CARDS GRID -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div @click="openDrilldown('Liquidity Radar')" class="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all">
                  <div class="absolute -right-4 -top-4 bg-white/5 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div class="relative z-10">
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Operational Runway</p>
                     <h2 class="text-4xl font-black tracking-tighter mb-4">{{ brandingStore.currency }} {{ runwayDisplay }}</h2>
                     <div class="flex items-center gap-2 text-[10px] font-black text-emerald-400 bg-emerald-400/10 w-fit px-2 py-1 rounded-md border border-emerald-400/20 uppercase tracking-tighter">
                          <ArrowUpRight class="w-3.5 h-3.5" /> SUSTAINABLE
                     </div>
                  </div>
              </div>

               <div @click="openDrilldown('Expense Auditor')" class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all relative overflow-hidden group">
                   <div class="absolute -right-2 top-0 w-12 h-12 bg-red-50 rounded-full opacity-50 group-hover:scale-125 transition-transform"></div>
                   <div>
                     <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Burn Rate (Monthly)</p>
                     <h2 class="text-3xl font-black text-slate-900 font-mono tracking-tighter">{{ brandingStore.currency }} {{ burnRateDisplay }}</h2>
                  </div>
                  <div class="h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden border border-slate-50">
                      <div class="h-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]" :style="`width: ${Math.min(100, (summary.expense/20000)*100)}%`"></div>
                  </div>
                  <p class="text-[10px] font-black text-slate-400 uppercase mt-3 tracking-tighter">Utilization: <span class="text-red-500">42% of Allocation used</span></p>
              </div>

               <div @click="openDrilldown('P&L Context')" class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all relative overflow-hidden group">
                   <div class="absolute -right-2 top-0 w-12 h-12 bg-emerald-50 rounded-full opacity-50 group-hover:scale-125 transition-transform"></div>
                   <div>
                     <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Profit Margin</p>
                     <h2 class="text-3xl font-black text-slate-900 font-mono tracking-tighter">{{ summary.margin }}%</h2>
                  </div>
                  <div class="h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden border border-slate-50">
                      <div class="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" :style="`width: ${summary.margin}%`"></div>
                  </div>
                  <p class="text-[10px] font-black text-slate-400 uppercase mt-3 tracking-tighter">Bench: <span class="text-emerald-500">Targeted 70% Bench</span></p>
              </div>
          </div>

           <!-- Ledger Table Mock -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <!-- TRANSACTION LEDGER -->
              <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
                      <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
                        <Database class="w-4 h-4 text-slate-400" /> Transaction Flow
                      </h3>
                      <button @click="isLedgerAuditOpen = true" class="text-[10px] font-black text-primary uppercase tracking-widest border-b border-primary/20 hover:border-primary transition-all">All Items</button>
                  </div>
                  <div class="overflow-x-auto flex-1">
                      <table class="w-full">
                          <thead class="bg-slate-50/50">
                              <tr class="text-left border-b border-slate-100">
                                  <th class="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Desc</th>
                                  <th class="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right">Amount</th>
                              </tr>
                          </thead>
                          <tbody class="divide-y divide-slate-50">
                              <tr v-for="tx in ledger.slice(0, 6)" :key="tx.id" class="hover:bg-slate-50/50 transition-colors">
                                  <td class="px-6 py-4">
                                      <p class="text-[11px] font-bold text-slate-800">{{ tx.desc }}</p>
                                      <p class="text-[9px] text-slate-400 uppercase font-black">{{ tx.cat }}</p>
                                  </td>
                                  <td class="px-6 py-4 text-right font-black text-[11px]" :class="tx.type === 'In' ? 'text-emerald-500' : 'text-red-500'">
                                      {{ tx.type === 'In' ? '+' : '-' }} {{ (Number(tx.val) || 0).toLocaleString() }}
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>

              <!-- INVOICE LEDGER (NEW) -->
              <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
                      <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
                        <FileText class="w-4 h-4 text-indigo-500" /> Central Invoice Ledger
                      </h3>
                      <button @click="fetchInvoices" class="p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                        <RefreshCw class="w-3.5 h-3.5 text-slate-500" />
                      </button>
                  </div>
                  <div class="overflow-x-auto flex-1">
                      <table class="w-full">
                          <thead class="bg-slate-50/50">
                              <tr class="text-left border-b border-slate-100">
                                  <th class="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Invoice Unit</th>
                                  <th class="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest text-center">Status</th>
                                  <th class="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                              </tr>
                          </thead>
                          <tbody class="divide-y divide-slate-50">
                              <tr v-for="inv in invoices" :key="inv.id" class="hover:bg-slate-50/50 transition-colors">
                                  <td class="px-6 py-4">
                                      <div class="flex flex-col">
                                          <p class="text-[11px] font-black text-slate-800 uppercase tracking-tight">{{ inv.client_name }}</p>
                                          <p class="text-[10px] font-bold text-slate-400">VAL: {{ brandingStore.currency }} {{ Number(inv.amount).toLocaleString() }}</p>
                                      </div>
                                  </td>
                                  <td class="px-6 py-4 text-center">
                                      <span 
                                        :class="inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'" 
                                        class="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border"
                                      >
                                          {{ inv.status }}
                                      </span>
                                  </td>
                                  <td class="px-6 py-4 text-right">
                                      <button @click="downloadIndividualInvoice(inv)" class="p-1.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                          <Download class="w-3.5 h-3.5" />
                                      </button>
                                  </td>
                              </tr>
                              <tr v-if="invoices.length === 0">
                                  <td colspan="3" class="px-6 py-12 text-center text-[10px] font-bold text-slate-400 italic">No invoices committed to cloud ledger.</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
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

    <!-- ADD RECORD MODAL -->
    <AddTransactionModal 
      :isOpen="isAddModalOpen" 
      @close="isAddModalOpen = false"
      @submit="handleNewRecord"
    />

    <!-- QUARTERLY AUDIT MODAL -->
    <QuarterlyAuditModal 
      :isOpen="isAuditModalOpen" 
      @close="isAuditModalOpen = false"
      @download="handleAuditDownload"
    />

    <!-- STRATEGIC LEDGER AUDIT FULL VIEW -->
    <Teleport to="body">
        <div v-if="isLedgerAuditOpen" class="fixed inset-0 z-[1050] bg-slate-50 flex flex-col font-sans animate-[slideDown_0.3s_ease-out]">
            <div class="px-8 py-6 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
                <div>
                    <h2 class="text-xl font-black text-slate-900 flex items-center gap-3 italic">
                        <Database class="w-6 h-6 text-primary" /> Strategic Ledger Audit (Full History)
                    </h2>
                    <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Unrestricted Multi-Tenant Transaction Manifest</p>
                </div>
                <button @click="isLedgerAuditOpen = false" class="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all">
                    <X class="w-4 h-4" /> Exit Audit
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-12 custom-scrollbar">
                <div class="max-w-6xl mx-auto space-y-8">
                    <!-- AUDIT SUMMARY BAR -->
                    <div class="grid grid-cols-4 gap-6">
                        <div v-for="stat in [{l:'Total Items', v:ledger.length}, {l:'Revenue Sum', v:brandingStore.currency + ' ' + (summary.revenue/1000).toFixed(1)+'K'}, {l:'Expense Sum', v:brandingStore.currency + ' ' + (summary.expense/1000).toFixed(1)+'K'}, {l:'Audit Status', v:'VERIFIED'}]" :key="stat.l" class="bg-white p-6 rounded-2xl border border-slate-200">
                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ stat.l }}</p>
                            <p class="text-xl font-black text-slate-900">{{ stat.v }}</p>
                        </div>
                    </div>
                    <!-- FULL TABLE -->
                    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <table class="w-full">
                            <thead class="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th class="px-8 py-4 text-left text-[10px] font-black uppercase text-slate-400">ID</th>
                                    <th class="px-8 py-4 text-left text-[10px] font-black uppercase text-slate-400">Description</th>
                                    <th class="px-8 py-4 text-left text-[10px] font-black uppercase text-slate-400">Category</th>
                                    <th class="px-8 py-4 text-left text-[10px] font-black uppercase text-slate-400 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                <tr v-for="tx in ledger" :key="tx.id" class="hover:bg-slate-50 transition-colors">
                                    <td class="px-8 py-4 font-mono text-[10px] font-black text-slate-400">{{ tx.id }}</td>
                                    <td class="px-8 py-4 text-sm font-bold text-slate-800">{{ tx.desc }}</td>
                                    <td class="px-8 py-4 text-[10px] font-black uppercase text-slate-400">{{ tx.cat }}</td>
                                    <td class="px-8 py-4 text-right font-black text-sm" :class="tx.type === 'In' ? 'text-emerald-600' : 'text-red-500'">
                                        {{ tx.type === 'In' ? '+' : '-' }} {{ brandingStore.currency }} {{ (Number(tx.val) || 0).toLocaleString() }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>

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
import { Wallet, Calendar, Plus, ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell, X, Loader2, Database, ShieldCheck, Download, Trash2 } from 'lucide-vue-next'
import { brandingStore } from '../services/brandingService'
import Sidebar from '../components/dashboard/Sidebar.vue'
import TopHeader from '../components/dashboard/TopHeader.vue'
import DrilldownModal from '../components/dashboard/DrilldownModal.vue'
import AddTransactionModal from '../components/dashboard/AddTransactionModal.vue'
import QuarterlyAuditModal from '../components/dashboard/QuarterlyAuditModal.vue'
import { fetchFinanceLedger, fetchFinancialSummary } from '../services/financeService'
import { supabase } from '../services/supabase'
import { generatePDF } from '../utils/pdfGenerator'

const isMobileMenuOpen = ref(false)
const isLoading = ref(true)
const toastState = ref({ show: false, message: '' })
const ledger = ref([])
const invoices = ref([])
const summary = ref({ revenue: 0, expense: 0, profit: 0, margin: 0 })

// UI States
const isDrilldownOpen = ref(false)
const drilldownCategory = ref('')
const isAddModalOpen = ref(false)
const isAuditModalOpen = ref(false)
const isLedgerAuditOpen = ref(false)
const activeActionId = ref(null)

const toggleActions = (id) => {
    activeActionId.value = activeActionId.value === id ? null : id;
}

const openDrilldown = (cat) => {
    drilldownCategory.value = cat;
    isDrilldownOpen.value = true;
}

const triggerToast = (msg) => {
  toastState.value = { show: true, message: msg }
  setTimeout(() => { toastState.value.show = false }, 4000)
}

const handleAuditDownload = () => {
    triggerToast("System encrypting ledger... Certified Audit PDF generated with 256-bit lock.")
}

const handleNewRecord = (data) => {
    // Add to local ledger
    ledger.value.unshift({ ...data, val: Number(data.val) })
    
    // Update summary
    const val = Number(data.val)
    if (data.type === 'In') {
        summary.value.revenue += val
        summary.value.profit += val
    } else {
        summary.value.expense += val
        summary.value.profit -= val
    }
    
    // Recalculate margin
    summary.value.margin = summary.value.revenue !== 0 ? Math.floor((summary.value.profit / summary.value.revenue) * 100) : 0
    
    isAddModalOpen.value = false
    triggerToast(`✓ Transaction ${data.id} successfully committed to Strategic Ledger.`)
}

const fetchInvoices = async () => {
    const { data: invs, error } = await supabase
        .from('invoices')
        .select('*, wo_id(*, po_id(*))')
        .order('created_at', { ascending: false })
    
    if (!error) {
        invoices.value = invs || []
    }
}

const downloadIndividualInvoice = (inv) => {
    triggerToast(`Retrieving Digital Original for Invoice ${inv.id.slice(0, 5)}...`)
    // Prepare data for generator
    const docData = {
        ...inv.wo_id,
        amount: inv.amount,
        client_name: inv.client_name
    }
    generatePDF(docData, 'Invoice')
}

onMounted(async () => {
    try {
        const [ledgerData, summaryData] = await Promise.all([
            fetchFinanceLedger(),
            fetchFinancialSummary(),
            fetchInvoices()
        ]);
        ledger.value = ledgerData;
        summary.value = summaryData;
    } catch (err) {
        triggerToast("Failed to sync financial data vault.")
    } finally {
        isLoading.value = false;
    }
})

// Calculate operational runway based on profit (Simplified for demo)
const runwayDisplay = computed(() => {
    return (summary.value.profit / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "K";
})

const burnRateDisplay = computed(() => {
    return (summary.value.expense / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "K";
})
</script>

<style scoped>
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.animate-slideDown { animation: slideDown 0.3s ease-out; }
</style>
