<template>
  <div class="h-screen bg-slate-50 flex text-slate-800 font-sans overflow-hidden">
    <Sidebar @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

    <main class="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f7fb] relative">
      <TopHeader @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

      <div class="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase tracking-wide">
                  <Cpu class="w-6 h-6 text-primary" /> Operations Command
                </h1>
                <div class="flex items-center gap-2 mt-1">
                   <p class="text-sm font-bold text-slate-500">Real-time control of system throughput and business lifecycle.</p>
                   <span class="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                   <p class="text-[11px] font-black text-primary uppercase tracking-widest hidden sm:block">Level 4 Strategic Clearance</p>
                </div>
            </div>
            <div class="flex items-center gap-3 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                <button 
                    v-for="t in ['Intelligence', 'Business Workflow']" :key="t"
                    @click="activeTab = t"
                    :class="activeTab === t ? 'bg-slate-900 text-white shadow-xl scale-100 rotate-0' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50 scale-95'"
                    class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 transform"
                >
                    {{ t }}
                </button>
            </div>
        </div>

        <div v-if="activeTab === 'Intelligence'" class="animate-[slideIn_0.4s_ease-out]">
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
                        <div :class="op.trend === 'up' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'" class="p-1.5 rounded-lg shadow-sm border">
                            <component :is="op.icon" class="w-4 h-4" />
                        </div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ op.label }}</p>
                    </div>
                    <div class="flex items-end justify-between relative z-10">
                        <h3 class="text-2xl font-black text-slate-900 tracking-tight tabular-nums">{{ op.value }}</h3>
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
                            <ActivityIcon class="w-4 h-4 text-primary" /> Throughput Multi-threading (24H)
                        </h3>
                        <div class="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                        <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span class="text-[9px] font-black text-slate-500 uppercase">Live Flux Monitor</span>
                        </div>
                    </div>
                    <div class="flex-1">
                        <apexchart type="area" height="100%" :options="chartOptions" :series="chartSeries"></apexchart>
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
                            <p class="text-indigo-100 text-sm leading-relaxed mb-8">Intelligence engine detected a <span class="text-white font-black underline decoration-emerald-400 decoration-2 underline-offset-4 font-mono">12% latency spike</span> in n8n Lead processing.</p>
                        </div>
                        <button @click="executeOptimization" :disabled="isOptimizing" class="w-full py-4.5 bg-white text-indigo-600 rounded-2xl font-black text-sm transition-all hover:shadow-xl active:scale-[0.98] relative z-10 flex items-center justify-center gap-2 group-hover:bg-slate-50">
                            <component :is="isOptimizing ? Loader2 : Zap" class="w-4 h-4" :class="isOptimizing ? 'animate-spin' : ''" />
                            {{ isOptimizing ? 'Sharding...' : 'Execute Optimization' }}
                        </button>
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
                                <td class="px-8 py-5 text-xs font-black text-slate-400 font-mono italic">{{ log.id }}</td>
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-3">
                                        <div class="p-1.5 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <component :is="log.icon" class="w-4 h-4" />
                                        </div>
                                        <span class="text-sm font-bold text-slate-800">{{ log.name }}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5 text-xs font-bold text-slate-500 text-center font-mono">{{ log.throughput }}</td>
                                <td class="px-8 py-5 text-right"><span class="px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">Success</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- NEW STRATEGIC WORKFLOW HUB -->
        <div v-if="activeTab === 'Business Workflow'" class="animate-[slideUp_0.4s_ease-out] space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total PO Volume</p><h3 class="text-2xl font-black text-slate-900 tabular-nums">{{ brandingStore.currency }} {{ Number(totalPOAmount || 0).toLocaleString() }}</h3></div>
                    <div class="p-3 bg-amber-50 text-amber-500 rounded-2xl border border-amber-100"><FileText class="w-6 h-6" /></div>
                </div>
                <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between border-b-primary/30 border-b-4">
                    <div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Work Orders</p><h3 class="text-2xl font-black text-slate-900 tabular-nums">{{ activeWOCount }} Units</h3></div>
                    <div class="p-3 bg-indigo-50 text-indigo-500 rounded-2xl border border-indigo-100"><Zap class="w-6 h-6" /></div>
                </div>
                <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unbilled Revenue</p><h3 class="text-2xl font-black text-emerald-600 tabular-nums">{{ brandingStore.currency }} {{ Number(totalUnbilled || 0).toLocaleString() }}</h3></div>
                    <div class="p-3 bg-emerald-50 text-emerald-500 rounded-2xl border border-emerald-100"><TrendingUp class="w-6 h-6" /></div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 items-start w-full">
                <!-- PRIMARY OPERATIONAL PANE -->
                <div class="lg:col-span-9 space-y-8 min-w-0 w-full overflow-hidden">
                    <POTable :pos="activePOs" @approve="handleAction('Approved', $event)" @convertToWO="handleAction('Converted', $event)" @create="isPOModalOpen = true" @openAssets="openAssetManager('PO', $event)" />
                    <WOTable :wos="activeWOs" @assign="triggerToast('Assigning Supervisor/Resource from CMS...')" @complete="handleWOAction('Completed', $event)" @generateInvoice="handleWOAction('Invoiced', $event)" @downloadPDF="handlePDFDownload" @openAssets="openAssetManager('WO', $event)" />
                </div>

                <!-- STRATEGIC FORENSIC PANE -->
                <div class="lg:col-span-3 h-full sticky top-24 min-w-0">
                    <ActivityTimeline />
                </div>
            </div>
        </div>

      </div>
    </main>

    <!-- DRILL DOWN MODAL  -->
    <DrilldownModal :isOpen="isDrilldownOpen" :category="drilldownCategory" @close="isDrilldownOpen = false" @triggerToast="triggerToast" />

    <!-- PREMIUM CUSTOM TOAST NOTIFICATION -->
    <!-- STRATEGIC PO INGESTION MODAL -->
    <div v-if="isPOModalOpen" class="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div @click="isPOModalOpen = false" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      
      <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-[modalSlide_0.3s_ease-out] border border-slate-200">
        <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div>
            <h2 class="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Plus class="w-4 h-4 text-primary" /> PO Ingestion Module
            </h2>
            <p class="text-[10px] text-slate-400 font-bold mt-1">Strategic Budget Manifest Registration</p>
          </div>
          <button @click="isPOModalOpen = false" class="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X class="w-4 h-4 text-slate-400" /></button>
        </div>

        <div class="p-8 space-y-6">
          <div class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PO Identity (Locked)</label>
              <input v-model="newPO.po_number" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono" readonly />
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Business Identity</label>
              <input v-model="newPO.client_name" type="text" placeholder="e.g. Axis Corporate Ltd" class="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget Allocation ({{ brandingStore.currency }})</label>
              <input v-model="newPO.amount" type="number" placeholder="0.00" class="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm tabular-nums" />
            </div>
          </div>

          <div class="pt-4 flex gap-3">
             <button @click="isPOModalOpen = false" class="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors border border-slate-200">Cancel</button>
             <button @click="submitPO" :disabled="isSubmittingPO" class="flex-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Loader2 v-if="isSubmittingPO" class="w-4 h-4 animate-spin" />
                <Zap v-else class="w-4 h-4 text-accent" />
                {{ isSubmittingPO ? 'Processing...' : 'Commit Manifest' }}
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- STRATEGIC ASSET MANAGER MODAL -->
    <div v-if="isAssetModalOpen" class="fixed inset-0 z-[2200] flex items-center justify-center p-4">
      <div @click="isAssetModalOpen = false" class="absolute inset-0 bg-slate-900/40 backdrop-blur-md"></div>
      
      <div class="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-[modalSlide_0.3s_ease-out] border border-slate-200">
        <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/10">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-primary/10 rounded-2xl text-primary"><Globe class="w-6 h-6" /></div>
            <div>
              <h2 class="text-xs font-black text-slate-900 uppercase tracking-widest">Asset Sync Control</h2>
              <p class="text-[10px] text-slate-400 font-bold mt-1">Managed Resource Pointers for {{ targetAssetItem.entity_type }}</p>
            </div>
          </div>
          <button @click="isAssetModalOpen = false" class="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X class="w-4 h-4 text-slate-400" /></button>
        </div>

        <div class="p-8 space-y-8">
          <!-- NEW LINK INPUT -->
          <div class="bg-slate-50 p-5 rounded-3xl border border-slate-200/60 space-y-4">
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input v-model="newAsset.name" type="text" placeholder="Resource Name (e.g. Blueprints)" class="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                <input v-model="newAsset.url" type="text" placeholder="Google Drive / URL" class="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20" />
             </div>
             <button @click="addAssetLink" class="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-slate-800">
                <Plus class="w-4 h-4" /> Link Asset Platform
             </button>
          </div>

          <!-- ASSET LIST -->
          <div class="space-y-3">
             <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Committed Resources</h4>
             <div v-if="!targetAssetItem.asset_links?.length" class="text-center py-8 text-slate-300 font-bold italic text-xs">No external assets linked yet.</div>
             <div v-for="asset in targetAssetItem.asset_links" :key="asset.id" class="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary/30 transition-colors group">
                <div class="flex items-center gap-3">
                   <div class="p-2 bg-slate-50 rounded-xl text-slate-400"><Link class="w-4 h-4" /></div>
                   <div class="flex flex-col">
                      <span class="text-xs font-black text-slate-800">{{ asset.name }}</span>
                   </div>
                </div>
                <div class="flex items-center gap-2">
                   <a :href="asset.url" target="_blank" class="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all"><Globe class="w-4 h-4" /></a>
                   <button @click="removeAssetLink(asset.id)" class="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><Trash2 class="w-4 h-4" /></button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="toast-slide">
      <div v-if="toastState.show" class="fixed bottom-10 right-10 z-[1200] bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-4 ring-1 ring-white/10 max-w-sm">
        <div class="mt-0.5 p-1.5 bg-primary/20 rounded-md text-primary ring-1 ring-primary/30"><Bell class="w-4 h-4"/></div>
        <div class="flex-1"><p class="text-[12px] text-slate-300 font-medium leading-relaxed">{{ toastState.message }}</p></div>
        <button @click="toastState.show = false" class="ml-2 text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"><X class="w-4 h-4" /></button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Activity as ActivityIcon, X, Cpu, Zap, Users, RefreshCw, Layers, Database, Bell, Loader2, Workflow, Terminal, Server, FileText, TrendingUp, Plus, Link, Trash2, Globe } from 'lucide-vue-next'
import Sidebar from '../components/dashboard/Sidebar.vue'
import TopHeader from '../components/dashboard/TopHeader.vue'
import DrilldownModal from '../components/dashboard/DrilldownModal.vue'

import POTable from '../components/operations/POTable.vue'
import WOTable from '../components/operations/WOTable.vue'
import ActivityTimeline from '../components/operations/ActivityTimeline.vue'
import { brandingStore } from '../services/brandingService'
import { supabase } from '../services/supabase'
import { generatePDF } from '../utils/pdfGenerator'
import { addNotification, logActivity } from '../services/notificationService'

const isMobileMenuOpen = ref(false)
const toastState = ref({ show: false, message: '' })
const isOptimizing = ref(false)
const activeTab = ref('Intelligence')

// Strategic PO Ingestion State
const isPOModalOpen = ref(false)
const isSubmittingPO = ref(false)
const newPO = ref({
    po_number: `PO-${new Date().getFullYear()}-00${Math.floor(Math.random() * 100)}`,
    client_name: '',
    amount: 0
})

// Strategic Asset Link State
const isAssetModalOpen = ref(false)
const targetAssetItem = ref(null) // { id, entity_type (PO/WO), name, asset_links: [] }
const newAsset = ref({ name: '', url: '' })

// Strategic Data State
const activePOs = ref([])
const activeWOs = ref([])

const openAssetManager = (type, item) => {
    targetAssetItem.value = { ...item, entity_type: type }
    isAssetModalOpen.value = true
}

const addAssetLink = async () => {
    if (!newAsset.value.name || !newAsset.value.url) {
        triggerToast('Error: Asset Identification and Resource URL required.')
        return
    }

    const updatedLinks = [...(targetAssetItem.value.asset_links || []), { ...newAsset.value, id: Date.now() }]
    const table = targetAssetItem.value.entity_type === 'PO' ? 'purchase_orders' : 'work_orders'
    
    const { error } = await supabase
        .from(table)
        .update({ asset_links: updatedLinks })
        .eq('id', targetAssetItem.value.id)

    if (!error) {
        triggerToast(`Strategic Asset Linked: ${newAsset.value.name} committed to cloud manifest.`)
        targetAssetItem.value.asset_links = updatedLinks
        newAsset.value = { name: '', url: '' }
        fetchOperationalData()
        
        // Log it
        await logActivity(targetAssetItem.value.entity_type, targetAssetItem.value.id, 'Linked Asset', { asset: newAsset.value.name })
    }
}

const removeAssetLink = async (assetId) => {
    const updatedLinks = targetAssetItem.value.asset_links.filter(a => a.id !== assetId)
    const table = targetAssetItem.value.entity_type === 'PO' ? 'purchase_orders' : 'work_orders'
    
    await supabase
        .from(table)
        .update({ asset_links: updatedLinks })
        .eq('id', targetAssetItem.value.id)
    
    targetAssetItem.value.asset_links = updatedLinks
    fetchOperationalData()
}

onMounted(async () => {
    fetchOperationalData()
})

const fetchOperationalData = async () => {
    const { data: pos } = await supabase.from('purchase_orders').select('*').order('created_at', { ascending: false })
    activePOs.value = pos || []
    
    const { data: wos } = await supabase.from('work_orders').select('*, po_id(*)').order('created_at', { ascending: false })
    activeWOs.value = wos || []
}

const submitPO = async () => {
    if (!newPO.value.client_name || !newPO.value.amount) {
        triggerToast('Error: Client Identity and Budget Manifest required for ingestion.')
        return
    }

    isSubmittingPO.value = true
    const { data, error } = await supabase.from('purchase_orders').insert({
        po_number: newPO.value.po_number,
        client_name: newPO.value.client_name,
        amount: Number(newPO.value.amount),
        status: 'pending'
    }).select().single()

    if (!error) {
        triggerToast(`PO Ingested Successfully: ${newPO.value.po_number} locked in cloud sync.`)
        isPOModalOpen.value = false
        newPO.value = {
            po_number: `PO-${new Date().getFullYear()}-00${Math.floor(Math.random() * 100)}`,
            client_name: '',
            amount: 0
        }
        await fetchOperationalData()
        
        // Log it
        await logActivity('PO', data.id, 'Created', { client: data.client_name, amount: data.amount })
        await addNotification('New PO Detected', `Inbound manifest ${data.po_number} from ${data.client_name} is awaiting board approval.`, 'info')
    } else {
        triggerToast(`Ingestion Blocked: ${error.message}`)
    }
    isSubmittingPO.value = false
}

const totalPOAmount = computed(() => activePOs.value.reduce((acc, po) => acc + Number(po.amount), 0))
const activeWOCount = computed(() => activeWOs.value.filter(wo => wo.status !== 'completed').length)
const totalUnbilled = computed(() => activeWOs.value.filter(wo => wo.status === 'completed').reduce((acc, wo) => acc + Number(wo.budget_allocation || 0), 0))

// Actions
const handleAction = async (actionType, po) => {
    triggerToast(`Syncing Cloud Engine: Purchase Order [${po.po_number}] set to ${actionType.toUpperCase()}...`)
    
    if (actionType === 'Converted') {
        const { error } = await supabase.from('purchase_orders').update({ status: 'converted' }).eq('id', po.id)
        if (!error) {
            // Create a default WO
            await supabase.from('work_orders').insert({
                po_id: po.id,
                name: `Production WO for ${po.po_number}`,
                assigned_supervisor: 'Amila Admin',
                status: 'pending',
                budget_allocation: po.amount * 0.7,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            })
            fetchOperationalData()
            triggerToast(`Work Order generated and linked to Supervisor. Active Production Phase Engaged.`)
        }
    } else {
        await supabase.from('purchase_orders').update({ status: 'approved' }).eq('id', po.id)
        fetchOperationalData()
    }
}

const handleWOAction = async (action, wo) => {
    if (action === 'Completed') {
        const { error } = await supabase.from('work_orders').update({ status: 'completed' }).eq('id', wo.id)
        if (!error) {
            fetchOperationalData()
            triggerToast(`Work Order Verified. Digital Receipt Manifest Generated for ${wo.name}.`)
            
            // Trigger Notification
            await addNotification(
                'Work Order Completed',
                `Unit "${wo.name}" has reached final production state and is ready for billing.`,
                'success'
            )

            // Log Activity
            await logActivity('WO', wo.id, 'Completed', { name: wo.name })
        }
    } else if (action === 'Invoiced') {
        const invoiceAmount = Number(wo.budget_allocation || 0)
        triggerToast(`Strategic Ledger Sync: Posting ${brandingStore.currency} ${invoiceAmount.toLocaleString()} to Corporate Revenue Pipeline...`)
        
        try {
            // 1. Push to Invoices Ledger (New Record)
            const { data: inv, error: invErr } = await supabase.from('invoices').insert({
                wo_id: wo.id,
                client_name: wo.po_id?.client_name || 'Organization Client',
                amount: invoiceAmount,
                status: 'unpaid'
            }).select().single()

            if (invErr) throw invErr

            // 2. Push record to general BI Finance Transactions
            await supabase.from('bi_transactions').insert({
                transaction_date: new Date().toISOString().split('T')[0],
                amount: invoiceAmount,
                type: 'revenue',
                category: 'Project Invoice',
                description: `Invoice ${inv.id.slice(0,8)} for WO: ${wo.name}`
            })

            // 3. Activity & Notification
            await addNotification(
                'Financial Invoice Generated',
                `A new invoice for ${brandingStore.currency} ${invoiceAmount.toLocaleString()} has been committed to the ledger.`,
                'invoice'
            )
            await logActivity('Invoice', inv.id, 'Invoiced', { wo_id: wo.id, amount: invoiceAmount })
            
            // 4. Trigger Download
            handlePDFDownload({ data: wo, type: 'Invoice' })
            
            triggerToast(`Success: Revenue Committed. Digital Invoice Generated and Archived in Ledger.`)
            fetchOperationalData()
        } catch (err) {
            console.error(err)
            triggerToast("Sync Error: Failed to commit invoice to strategic ledger.")
        }
    }
}

const handlePDFDownload = ({ data, type }) => {
    triggerToast(`Compiling Strategic ${type} Manifest...`)
    generatePDF(data, type)
    triggerToast(`✓ Digital ${type} Downloaded.`)
}

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
        triggerToast("✓ Optimization Applied: Latency stabilized.")
    }, 2800)
}

const ops_metrics = [
    { label: 'Platform Uptime', value: '99.98%', percent: '0.02', trend: 'up', icon: ActivityIcon },
    { label: 'Lead Response Time', value: '4.2m', percent: '14', trend: 'down', icon: Zap },
    { label: 'Workload Density', value: '84%', percent: '2.1', trend: 'up', icon: Layers },
    { label: 'System Saturation', value: '12.8ms', percent: '5', trend: 'down', icon: Cpu }
]

const opLogs = [
    { id: '#EXEC-9821', name: 'Global Subscription Batch', throughput: '4.2 req/s', icon: Workflow },
    { id: '#EXEC-9820', name: 'AI Image Manifest Creation', throughput: '1.8 req/s', icon: Terminal },
    { id: '#EXEC-9819', name: 'Supabase Edge Sync', throughput: '112 req/s', icon: Server },
    { id: '#EXEC-9818', name: 'CRM Webhook Relay', throughput: '9 req/s', icon: RefreshCw }
]

const chartSeries = [{ name: 'Throughput', data: [42, 52, 38, 65, 50, 109, 100, 120, 80, 95] }]
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
@keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>
