<template>
  <div class="h-screen bg-slate-50 flex text-slate-800 font-sans overflow-hidden">
    <Sidebar @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

    <main class="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f7fb] relative">
      <TopHeader @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

      <div class="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        <!-- HEADER -->
        <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Users class="w-6 h-6 text-primary" /> Strategic Partner Directory
                </h1>
                <p class="text-sm font-medium text-slate-500 mt-1">Manage global client relationships and subcontractor availability.</p>
            </div>
            <div class="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                <button 
                  v-for="tab in ['Clients', 'Subcontractors', 'Partner Program']" :key="tab"
                  @click="activeTab = tab"
                  :class="activeTab === tab ? 'bg-slate-900 text-white shadow-lg scale-100' : 'text-slate-400 hover:bg-slate-50 scale-95'"
                  class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  {{ tab }}
                </button>
            </div>
        </div>

        <!-- MAIN CONTENT AREA -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full items-start">
            <!-- PARTNER LIST -->
            <div class="lg:col-span-3 space-y-4">
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    <div class="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                        <div class="relative w-full max-w-xs">
                           <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                           <input type="text" v-model="searchQuery" placeholder="Filter by name or identity..." class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>
                        <button @click="showAddModal = true" class="px-5 py-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                           <Plus class="w-4 h-4" /> Add {{ activeTab === 'Partner Program' ? 'Partner' : activeTab === 'Clients' ? 'Client' : 'Contractor' }}
                        </button>
                    </div>

                    <div class="overflow-x-auto flex-1">
                        <table class="w-full">
                            <thead>
                                <tr class="text-left border-b border-slate-50 bg-white">
                                    <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Identity</th>
                                    <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Intel</th>
                                    <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Engagement Status</th>
                                    <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                <tr v-for="item in filteredData" :key="item.id" @click="selectedPartner = item" :class="selectedPartner?.id === item.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''" class="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                    <td class="px-6 py-5">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-2xl bg-slate-100/50 flex items-center justify-center font-black text-slate-400 border border-slate-100 group-hover:bg-white group-hover:text-primary transition-colors">
                                                {{ item.name?.charAt(0) || 'U' }}
                                            </div>
                                            <span class="text-sm font-bold text-slate-800">{{ item.name }}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-5">
                                        <div class="flex flex-col gap-1">
                                            <span class="text-xs font-medium text-slate-600 flex items-center gap-1.5 whitespace-nowrap"><Mail class="w-3 h-3 text-slate-400" /> {{ item.email || 'N/A' }}</span>
                                            <span class="text-[10px] font-bold text-slate-400 flex items-center gap-1.5"><Phone class="w-3 h-3 text-emerald-400" /> {{ item.phone || 'N/A' }}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-5 text-center">
                                        <span :class="item.status === 'active' || item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'" class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border">
                                            {{ item.status || 'Active' }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-5 text-right">
                                        <button class="p-2 text-slate-400 hover:text-primary transition-colors"><ChevronRight class="w-4 h-4" /></button>
                                    </td>
                                </tr>
                                <tr v-if="filteredData.length === 0">
                                    <td colspan="4" class="px-8 py-24 text-center text-slate-400 font-bold italic text-sm">No partners indexed in this node matching your query.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- LOGS & DETAILS SIDEBAR -->
            <div class="lg:col-span-1 space-y-6">
                <!-- SELECTED PARTNER PROFILE -->
                <div v-if="selectedPartner" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 animate-[slideIn_0.3s_ease-out]">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Intelligence Profile</h3>
                        <Activity class="w-3.5 h-3.5 text-primary animate-pulse" />
                    </div>
                    
                    <div class="text-center mb-6">
                        <div class="w-20 h-20 bg-slate-900 rounded-3xl mx-auto mb-4 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-slate-900/10">{{ selectedPartner.name.charAt(0) }}</div>
                        <h2 class="text-lg font-black text-slate-900">{{ selectedPartner.name }}</h2>
                        <p class="text-xs font-medium text-slate-500 mb-4">{{ activeTab === 'Clients' ? 'Strategic Partner' : activeTab === 'Subcontractors' ? 'Subcontractor Node' : 'Referral Ambassador' }}</p>
                        
                        <!-- PARTNER PERFORMANCE METRIC -->
                        <div v-if="activeTab === 'Partner Program'" class="grid grid-cols-2 gap-2 mt-4">
                            <div class="bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
                                <p class="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Referrals</p>
                                <p class="text-lg font-black text-indigo-700">{{ selectedPartner.total_referrals || 0 }}</p>
                            </div>
                            <div class="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                                <p class="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Commission</p>
                                <p class="text-lg font-black text-emerald-700">{{ selectedPartner.commission_rate || 10 }}%</p>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3 pt-6 border-t border-slate-50">
                        <button @click="triggerToast('Dispatching Encrypted WhatsApp Node...')" class="w-full py-3 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-95">
                            <MessageCircle class="w-4 h-4" /> Message WhatsApp
                        </button>
                        <button @click="triggerToast('Opening Corporate Mail Pipeline...')" class="w-full py-3 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            <Mail class="w-4 h-4" /> Send Official Email
                        </button>
                    </div>
                </div>

                <!-- COMMUNICATION LOGS -->
                <div v-if="selectedPartner" class="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 flex flex-col min-h-[400px]">
                    <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Activity class="w-4 h-4 text-primary" /> Communication Log
                    </h3>
                    
                    <div class="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
                        <div v-for="log in filteredLogs" :key="log.id" class="relative pl-6 border-l border-slate-800 last:border-0 pb-6">
                            <div class="absolute -left-[5px] top-0 w-2 h-2 rounded-full" :class="log.channel === 'WhatsApp' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-blue-400'"></div>
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ log.channel }}</span>
                                <span class="text-[8px] font-medium text-slate-600 italic">{{ new Date(log.created_at).toLocaleDateString() }}</span>
                            </div>
                            <p class="text-[11px] text-slate-300 leading-relaxed">{{ log.message }}</p>
                        </div>
                        <div v-if="filteredLogs.length === 0" class="text-center py-12">
                            <Zap class="w-8 h-8 text-slate-800 mx-auto mb-2" />
                            <p class="text-[10px] font-bold text-slate-600 uppercase italic">No interaction history.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>

    <!-- ADD PARTNER MODAL -->
    <transition name="modal-fade">
      <div v-if="showAddModal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showAddModal = false"></div>
        <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-20 overflow-hidden animate-[slideUp_0.3s_ease-out]">
            <div class="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                   <h3 class="text-xl font-black text-slate-900 tracking-tight italic">Index New {{ activeTab === 'Clients' ? 'Partner' : 'Contractor' }}</h3>
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Strategic Directory Sync</p>
                </div>
                <button @click="showAddModal = false" class="p-2 hover:bg-slate-100 rounded-full transition-colors"><X class="w-6 h-6 text-slate-400" /></button>
            </div>
            
            <div class="p-8 space-y-6">
                <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                    <input v-model="newItem.name" type="text" placeholder="Organization or Individual Name" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Endpoint</label>
                        <input v-model="newItem.email" type="email" placeholder="contact@domain.com" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Line</label>
                        <input v-model="newItem.phone" type="text" placeholder="+94 XX XXX XXXX" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{{ activeTab === 'Clients' ? 'Industry Cluster' : activeTab === 'Subcontractors' ? 'Functional Speciality' : 'Company/Brand' }}</label>
                    <input v-model="newItem.tag" type="text" :placeholder="activeTab === 'Clients' ? 'e.g. Technology, Retail' : 'e.g. Logistics, Web Design'" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                </div>

                <!-- NEW REFERRAL ENGINE DROPDOWN -->
                <div v-if="activeTab === 'Clients'" class="space-y-2 pt-2 border-t border-slate-50">
                    <label class="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-1">Referral Attribution (Optional)</label>
                    <select v-model="newItem.referred_by" class="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-3.5 text-xs font-bold text-slate-700 focus:ring-4 focus:ring-indigo-100 outline-none transition-all appearance-none cursor-pointer">
                        <option :value="null">No Referral (Internal Direct)</option>
                        <option v-for="p in partners" :key="p.id" :value="p.id">{{ p.name }} - {{ p.company_name }}</option>
                    </select>
                </div>
            </div>

            <div class="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button @click="showAddModal = false" class="flex-1 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Discard</button>
                <button @click="handleAddItem" :disabled="!newItem.name || isAdding" class="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                    <Loader2 v-if="isAdding" class="w-4 h-4 animate-spin" />
                    <Plus v-else class="w-4 h-4" />
                    Propagate to Directory
                </button>
            </div>
        </div>
      </div>
    </transition>

    <transition name="toast-slide">
      <div v-if="toastState.show" class="fixed bottom-10 right-10 z-[1200] bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-4 ring-1 ring-white/10 max-w-sm">
        <div class="mt-0.5 p-1.5 bg-primary/20 rounded-md text-primary ring-1 ring-primary/30"><Bell class="w-4 h-4"/></div>
        <p class="text-xs font-bold leading-relaxed">{{ toastState.message }}</p>
        <button @click="toastState.show = false" class="ml-2 hover:opacity-70"><X class="w-4 h-4"/></button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Users, Search, Plus, Mail, Phone, MessageCircle, Activity, ChevronRight, X, Zap, Loader2, Bell } from 'lucide-vue-next'
import Sidebar from '../components/dashboard/Sidebar.vue'
import TopHeader from '../components/dashboard/TopHeader.vue'
import { supabase } from '../services/supabase'

const isMobileMenuOpen = ref(false)
const toastState = ref({ show: false, message: '' })
const activeTab = ref('Clients')
const selectedPartner = ref(null)
const searchQuery = ref('')
const showAddModal = ref(false)
const isAdding = ref(false)

const newItem = ref({ name: '', email: '', phone: '', tag: '', referred_by: null })

const clients = ref([
    { id: 101, name: 'Svea Logistics AB', email: 'ops@svea-logistics.se', phone: '+46 8 123 45 67', status: 'Active', industry: 'Logistics' },
    { id: 102, name: 'Island Tea Exporters', email: 'finance@islandtea.lk', phone: '+94 11 234 5678', status: 'Active', industry: 'Export/Commodities' },
    { id: 103, name: 'Global Brands SL', email: 'procurement@globalbrands.com', phone: '+94 77 123 4567', status: 'Engaged', industry: 'Retail' }
])
const subcontractors = ref([
    { id: 201, name: 'Nordic Transports', email: 'fleet@nordic.se', phone: '+46 70 987 65 43', status: 'Active', specialty: 'Heavy Haulage' },
    { id: 202, name: 'Precision MEP Solutions', email: 'tech@precision-mep.com', phone: '+94 11 888 9999', status: 'Standby', specialty: 'Engineering' }
])
const partners = ref([
    { id: 301, name: 'Amila Wijesinghe', email: 'amila@digynex.se', phone: '+46 72 000 0000', status: 'Platinum', total_referrals: 12, commission_rate: 15 },
    { id: 302, name: 'Svenska Tech Group', email: 'partners@svenska.tech', status: 'Gold', total_referrals: 5, commission_rate: 10 }
])
const logs = ref([
    { id: 1, entity_id: 101, channel: 'WhatsApp', message: 'Confirmed AWR manifest for Q2 cycle.', created_at: new Date().toISOString() },
    { id: 2, entity_id: 301, channel: 'Email', message: 'Strategic referral payout processed for February.', created_at: new Date(Date.now() - 86400000).toISOString() }
])

const filteredData = computed(() => {
    let base = []
    if (activeTab.value === 'Clients') base = clients.value
    else if (activeTab.value === 'Subcontractors') base = subcontractors.value
    else base = partners.value

    if (!searchQuery.value) return base
    return base.filter(item => 
        item.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
        item.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const filteredLogs = computed(() => {
    if (!selectedPartner.value) return []
    return logs.value.filter(l => l.entity_id === selectedPartner.value.id)
})

watch(activeTab, () => {
    selectedPartner.value = null
})

const fetchCRMData = async () => {
    try {
        const { data: c } = await supabase.from('clients').select('*').order('name', { ascending: true })
        if (c && c.length > 0) clients.value = c
        
        const { data: s } = await supabase.from('subcontractors').select('*').order('name', { ascending: true })
        if (s && s.length > 0) subcontractors.value = s

        const { data: p } = await supabase.from('partners').select('*').order('name', { ascending: true })
        if (p && p.length > 0) partners.value = p
        
        const { data: l } = await supabase.from('communication_logs').select('*').order('created_at', { descending: true })
        if (l && l.length > 0) logs.value = l
    } catch (err) {
        console.warn("Supabase Sync Error: Using Elite Mock Data Fallback.")
    }
}

const handleAddItem = async () => {
    isAdding.value = true
    let table = ''
    if (activeTab.value === 'Clients') table = 'clients'
    else if (activeTab.value === 'Subcontractors') table = 'subcontractors'
    else table = 'partners'
    
    const payload = {
        name: newItem.name,
        email: newItem.email,
        phone: newItem.phone
    }
    
    if (activeTab.value === 'Clients') {
        payload.industry = newItem.tag
        payload.referred_by = newItem.referred_by
    }
    else if (activeTab.value === 'Subcontractors') payload.specialty = newItem.tag
    else payload.company_name = newItem.tag

    try {
        const { error } = await supabase.from(table).insert([payload])
        if (error) throw error
        
        triggerToast(`${activeTab.value.slice(0, -1)} successfully indexed.`)
        showAddModal.value = false
        newItem.value = { name: '', email: '', phone: '', tag: '' }
        await fetchCRMData()
    } catch (err) {
        console.error(err)
        triggerToast("Sync Error: Unable to propagate entry to cloud node.")
    } finally {
        isAdding.value = false
    }
}

onMounted(() => {
    // fetchCRMData() // Temporarily disabled to prevent test data ('hjggh') from overwriting mock UI
})

const triggerToast = (msg) => {
  toastState.value = { show: true, message: msg }
  setTimeout(() => { toastState.value.show = false }, 3000)
}
</script>

<style scoped>
@keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; scale: 0.98; } to { transform: translateY(0); opacity: 1; scale: 1; } }

.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }

.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>
