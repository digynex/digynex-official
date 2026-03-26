<template>
  <div class="h-screen bg-slate-50 flex text-slate-800 font-sans overflow-hidden">
    <Sidebar @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

    <main class="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f7fb] relative">
      <TopHeader @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

      <div class="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center h-full gap-4 text-center">
             <div class="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
             <p class="text-sm font-black text-slate-500 uppercase tracking-widest">Synthesizing Ledger Insights...</p>
        </div>

        <div v-else class="animate-[slideDown_0.4s_ease-out]">
          <div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Wallet class="w-6 h-6 text-emerald-500" /> Financial Intelligence Vault
            </h1>
            <p class="text-sm font-medium text-slate-500 mt-1">Cash flow oversight, P&L reporting and multi-tenant ledger control.</p>
          </div>
          <div class="flex gap-3">
             <button class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Calendar class="w-4 h-4" /> Final Q1 Review
            </button>
            <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <Plus class="w-4 h-4" /> Add Record
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                <div class="absolute -right-4 -top-4 bg-white/5 w-32 h-32 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                <div class="relative z-10">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Operational Runway</p>
                   <h2 class="text-4xl font-black tracking-tighter mb-4">${{ runwayDisplay }}</h2>
                   <div class="flex items-center gap-2 text-[11px] font-bold text-emerald-400 bg-emerald-400/10 w-fit px-2 py-1 rounded-md">
                        <ArrowUpRight class="w-3 h-3" /> SUSTAINABLE
                   </div>
                </div>
            </div>

             <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                 <div>
                   <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Burn Rate (Monthly)</p>
                   <h2 class="text-3xl font-black text-slate-900">${{ burnRateDisplay }}</h2>
                </div>
                <div class="h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
                    <div class="h-full bg-red-500" :style="`width: ${Math.min(100, (summary.expense/20000)*100)}%`"></div>
                </div>
                <p class="text-[11px] font-bold text-slate-400 mt-2">42% of Allocation used</p>
            </div>

             <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                 <div>
                   <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Gross Profit Margin</p>
                   <h2 class="text-3xl font-black text-slate-900">{{ summary.margin }}%</h2>
                </div>
                <div class="h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
                    <div class="h-full bg-emerald-500" :style="`width: ${summary.margin}%`"></div>
                </div>
                <p class="text-[11px] font-bold text-slate-400 mt-2">Targeted: 70% Bench</p>
            </div>
        </div>

        <!-- Ledger Table Mock -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 class="text-lg font-black text-slate-900 uppercase tracking-tight text-xs bg-slate-50 px-3 py-1.5 rounded-md">Recent Transactions</h3>
                <div class="flex gap-2 text-xs font-bold text-slate-400">
                    <span class="px-2 py-1 bg-primary/5 text-primary rounded-md">All Ledger Items</span>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-slate-50/50">
                        <tr class="text-left border-b border-slate-100">
                            <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Description</th>
                            <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</th>
                            <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Amount</th>
                            <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                            <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        <tr v-for="tx in ledger" :key="tx.desc" class="hover:bg-slate-50/50 transition-colors">
                            <td class="px-6 py-4">
                                <p class="text-sm font-bold text-slate-900">{{ tx.desc }}</p>
                                <p class="text-[11px] text-slate-400">{{ tx.id }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${tx.type === 'In' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`">
                                    {{ tx.cat }}
                                </span>
                            </td>
                            <td class="px-6 py-4 font-black text-sm text-slate-800">{{ tx.type === 'In' ? '+' : '-' }} ${{ tx.val }}</td>
                            <td class="px-6 py-4 text-xs font-medium text-slate-500">{{ tx.date }}</td>
                            <td class="px-6 py-4 text-right">
                                <button class="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-md"><MoreHorizontal class="w-4 h-4" /></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </main>

    <transition name="toast-slide">
      <div v-if="toastState.show" class="fixed bottom-10 right-10 z-[100] bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-4">
        <p class="text-[12px] font-medium">{{ toastState.message }}</p>
        <button @click="toastState.show = false"><X class="w-4 h-4"/></button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Wallet, Calendar, Plus, ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell, X, Loader2 } from 'lucide-vue-next'
import Sidebar from '../components/dashboard/Sidebar.vue'
import TopHeader from '../components/dashboard/TopHeader.vue'
import { fetchFinanceLedger, fetchFinancialSummary } from '../services/financeService'

const isMobileMenuOpen = ref(false)
const isLoading = ref(true)
const toastState = ref({ show: false, message: '' })
const ledger = ref([])
const summary = ref({ revenue: 0, expense: 0, profit: 0, margin: 0 })

const triggerToast = (msg) => {
  toastState.value = { show: true, message: msg }
  setTimeout(() => { toastState.value.show = false }, 3000)
}

onMounted(async () => {
    try {
        const [ledgerData, summaryData] = await Promise.all([
            fetchFinanceLedger(),
            fetchFinancialSummary()
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
</style>
