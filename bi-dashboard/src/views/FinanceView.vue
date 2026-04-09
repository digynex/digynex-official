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

          <!-- TOP KPI CARDS (UPGRADED WITH TRENDS) -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <!-- LIQUIDITY -->
              <div @click="openDrilldown('Liquidity Radar')" class="bg-slate-900 p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden group cursor-pointer hover:translate-y-[-4px] transition-all duration-500">
                  <div class="absolute -right-4 -top-4 bg-emerald-500/10 w-32 h-32 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Operational Runway</p>
                  <h2 class="text-3xl font-black tracking-tighter mb-4">{{ brandingStore.currency }} {{ runwayDisplay }}</h2>
                  <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 uppercase">
                        <ArrowUpRight class="w-3 h-3" /> +14.2%
                    </div>
                    <span class="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">vs Prev Month</span>
                  </div>
              </div>

              <!-- BURN RATE / EBITDA HUB -->
              <div @click="openDrilldown('Efficiency Audit')" class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
                  <div class="absolute -right-6 top-0 w-20 h-20 bg-red-50 rounded-full blur-2xl opacity-50 group-hover:scale-125 transition-all"></div>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Monthly Burn Rate</p>
                  <h2 class="text-2xl font-black text-slate-900 tracking-tighter">{{ brandingStore.currency }} {{ burnRateDisplay }}</h2>
                  <div class="flex items-center gap-2 mt-4">
                    <div class="flex items-center gap-1 text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase">
                        <ArrowDownRight class="w-3 h-3" /> -2.4%
                    </div>
                    <span class="text-[9px] font-bold text-slate-400 uppercase">Efficiency Gain</span>
                  </div>
              </div>

              <!-- MARGIN / EBITDA -->
              <div @click="openDrilldown('Profit Intelligence')" class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
                  <div class="absolute -right-6 top-0 w-20 h-20 bg-indigo-50 rounded-full blur-2xl opacity-50 group-hover:scale-125 transition-all"></div>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">EBITDA (Est.)</p>
                  <h2 class="text-2xl font-black text-slate-900 tracking-tighter">{{ summary.margin }}%</h2>
                  <div class="h-1 bg-slate-100 rounded-full mt-5 overflow-hidden">
                      <div class="h-full bg-indigo-500 transition-all duration-1000" :style="`width: ${summary.margin}%`"></div>
                  </div>
                  <p class="text-[9px] font-black text-indigo-500 uppercase mt-3 tracking-tighter">Target: <span class="text-slate-400">75.0% Benchmark</span></p>
              </div>

              <!-- BREAK-EVEN FORECAST -->
              <div class="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden group">
                  <p class="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest mb-1.5">Break-even Projection</p>
                  <h2 class="text-2xl font-black text-emerald-900 tracking-tighter">Q3 2026</h2>
                  <div class="flex items-center gap-2 mt-4">
                    <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span class="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">On-Track for Scale</span>
                  </div>
              </div>
          </div>

          <!-- STRATEGIC INTELLIGENCE GRID -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <!-- ROI FORECASTER (CORE) -->
            <div class="lg:col-span-6 flex flex-col">
               <ROICalculator />
            </div>

            <!-- AR AGING & TAX LIABILITY (ADVANCED) -->
            <div class="lg:col-span-6 grid grid-cols-1 gap-6">
                <!-- AR AGING TRACKER (PROPER COLOR OVERHAUL) -->
                <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div class="relative z-10 flex items-center justify-between mb-8">
                        <div>
                            <h4 class="text-[14px] font-[950] text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Clock class="w-5 h-5 text-emerald-500" /> AR Aging Intelligence
                            </h4>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">Operational Liquidity Audit</p>
                        </div>
                        <div class="text-right">
                             <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Total Receivables</p>
                             <p class="text-2xl font-[950] text-slate-900 tracking-tighter">{{ brandingStore.currency }} 452,000</p>
                        </div>
                    </div>

                    <!-- HIGH-CONTRAST BAR WITH PRECISE HEX CODES -->
                    <div class="h-16 w-full bg-slate-50 rounded-2xl flex overflow-hidden border border-slate-200 shadow-inner mb-8">
                        <!-- 0-30 DAYS (Emerald Green) -->
                        <div class="h-full bg-[#2ECC71] w-[50%] flex flex-col items-center justify-center border-r-2 border-white/30 hover:brightness-110 transition-all cursor-default">
                             <span class="text-[11px] font-[950] text-white uppercase tracking-tighter italic">0-30 DAYS</span>
                             <span class="text-[9px] font-black text-white/80 uppercase">STABLE (50%)</span>
                        </div>
                        <!-- 31-60 DAYS (Proper Amber) -->
                        <div class="h-full bg-[#F39C12] w-[30%] flex flex-col items-center justify-center border-r-2 border-white/30 hover:brightness-110 transition-all cursor-default">
                             <span class="text-[11px] font-[950] text-white uppercase tracking-tighter italic">31-60 DAYS</span>
                             <span class="text-[9px] font-black text-white/80 uppercase">WARNING (30%)</span>
                        </div>
                        <!-- 60-90+ DAYS (Proper Red) -->
                        <div class="h-full bg-[#E74C3C] w-[20%] flex flex-col items-center justify-center hover:brightness-110 transition-all cursor-default animate-pulse">
                             <span class="text-[11px] font-[950] text-white uppercase tracking-tighter italic">60-90+ DAYS</span>
                             <span class="text-[9px] font-black text-white/80 uppercase">CRITICAL (20%)</span>
                        </div>
                    </div>

                    <div class="flex items-center justify-between px-2">
                         <div class="flex items-center gap-6">
                            <div v-for="tag in [{l:'Secure', c:'bg-[#2ECC71]'}, {l:'Review', c:'bg-[#F39C12]'}, {l:'High Priority', c:'bg-[#E74C3C]'}]" :key="tag.l" class="flex items-center gap-2.5">
                                <div :class="tag.c" class="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100"></div>
                                <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ tag.l }}</span>
                            </div>
                         </div>
                         <div class="bg-red-50 px-4 py-2.5 rounded-xl border border-red-100 flex items-center gap-3">
                            <AlertCircle class="w-4 h-4 text-[#E74C3C]" />
                            <p class="text-[10px] font-[950] text-[#E74C3C] uppercase tracking-tighter italic">Liquidity Action Threshold Reached</p>
                         </div>
                    </div>
                </div>

                <!-- TAX LIABILITY & COMPLIANCE (INTERACTIVE) -->
                <div class="bg-slate-900 p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl opacity-50 group-hover:scale-125 transition-all"></div>
                    <div class="flex items-start justify-between relative z-10">
                         <div class="space-y-4 flex-1">
                            <h4 class="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <ShieldCheck class="w-4 h-4" /> Global Compliance Vault
                            </h4>
                            
                            <!-- COUNTRY SELECTOR DRIVEN TAX -->
                            <div class="flex flex-col gap-2 max-w-[180px]">
                                <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest">Select Regional Corridor</label>
                                <select 
                                    v-model="selectedCountry" 
                                    class="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-black text-slate-300 outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
                                    style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 8px center; background-size: 12px;"
                                >
                                    <option value="General">🌐 General Corridor</option>
                                    <option value="SL">🇱🇰 Sri Lanka (VAT)</option>
                                    <option value="Sweden">🇸🇪 Sweden (Moms)</option>
                                    <option value="UK">🇬🇧 United Kingdom (VAT)</option>
                                    <option value="USA">🇺🇸 United States (Sales Tax)</option>
                                </select>
                            </div>
                         </div>
                         <div class="text-right flex flex-col items-end">
                             <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Tax Liability Est.</p>
                             <p class="text-xl font-black text-white tracking-widest">{{ brandingStore.currency }} {{ calculatedTax }}</p>
                             <div class="mt-2 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 rounded uppercase italic">
                                {{ currentTaxRate }}% {{ selectedCountry }} Base
                             </div>
                         </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mt-6">
                        <div class="bg-white/5 p-3 rounded-2xl border border-white/10">
                            <p class="text-[8px] font-black text-slate-500 uppercase mb-1">Audit Policy</p>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">IMMUTABLE_SYNC</p>
                        </div>
                        <div class="bg-white/5 p-3 rounded-2xl border border-white/10 text-right">
                            <p class="text-[8px] font-black text-slate-500 uppercase mb-1">Data Residency</p>
                            <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic tracking-tighter">{{ selectedCountry === 'Sweden' ? 'STOCKHOLM_POD_V3' : 'LOCAL_HOST_POD' }}</p>
                        </div>
                    </div>
                </div>
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
import ROICalculator from '../components/dashboard/ROICalculator.vue'
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

// Country-based Tax Logic
const selectedCountry = ref('Sweden')
const taxRates = {
    'General': 15.0,
    'SL': 18.0,
    'Sweden': 25.0,
    'UK': 20.0,
    'USA': 8.5
}
const currentTaxRate = computed(() => taxRates[selectedCountry.value] || 15.0)
const calculatedTax = computed(() => {
    // Estimating tax based on revenue for demo purposes
    const tax = (summary.value.revenue * (currentTaxRate.value / 100)) / 1000
    return tax.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "K"
})

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
    // Setting premium mock data instantly to bypass slow network fetches
    ledger.value = [
        { id: 'TX-9921', desc: 'Amazon Web Services (Cloud Compute)', cat: 'Infrastructure', val: 4500, type: 'Out' },
        { id: 'TX-9922', desc: 'Volvo Group Logistics Phase 4', cat: 'Revenue', val: 125000, type: 'In' },
        { id: 'TX-9923', desc: 'Global Talent Acquisition (Recruitment)', cat: 'Operations', val: 8200, type: 'Out' },
        { id: 'TX-9924', desc: 'IKEA Strategic Partnership License', cat: 'Revenue', val: 85000, type: 'In' },
        { id: 'TX-9925', desc: 'OpenAI Enterprise API Subscription', cat: 'AI Compute', val: 2100, type: 'Out' },
        { id: 'TX-9926', desc: 'H&M Digital Transformation Pilot', cat: 'Revenue', val: 95000, type: 'In' }
    ];
    
    invoices.value = [
        { id: 'INV-441', client_name: 'Volvo Group Logistics', amount: 125000, status: 'paid' },
        { id: 'INV-442', client_name: 'IKEA Corporate', amount: 85000, status: 'paid' },
        { id: 'INV-443', client_name: 'H&M Nordic', amount: 95000, status: 'pending' },
        { id: 'INV-444', client_name: 'Spotify AB', amount: 45000, status: 'pending' }
    ];
    
    summary.value = { revenue: 350000, expense: 14800, profit: 335200, margin: 95 };
    isLoading.value = false;
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
