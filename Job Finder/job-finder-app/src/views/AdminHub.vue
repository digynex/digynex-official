<script setup>
import { ref, computed, onMounted } from 'vue'
import { profileService } from '../services/profileService'
import { 
    Users, ShieldCheck, Sparkles, Edit3, AlertTriangle, 
    Lock, RefreshCw, Bell, Trash2, ChevronRight, X, TrendingUp, DollarSign, Zap, 
    Settings2, Save, Database
} from 'lucide-vue-next'
import { supabase } from '../lib/supabase'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import { 
    Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement,
    PointElement, CategoryScale, LinearScale, Filler, ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Filler, ArcElement)

const props = defineProps(['isMaintenanceMode'])
const emit = defineEmits(['setTab', 'update:isMaintenanceMode', 'sendNotification', 'purgeData'])

// --- AUTHENTICATION GATE ---
const isAdminAuthenticated = ref(false)
const isSuperAdmin = ref(false)
const adminPin = ref('')
const neuralKeys = ['8580', 'master333', 'uma'] // MASTER OVERRIDE KEYS
const authError = ref('')
const userSearch = ref('')
const selectedTier = ref('All')
const selectedRange = ref('All')
const customDays = ref('')
const users = ref([])
const activeTierSelector = ref(null)

// --- SYSTEM CONFIG ENGINE (NEW V12.0) ---
const configData = ref({
    free: { cv_per_week: 2, day_cap: 3, price: 0, ai_magic: false },
    pro: { cv_per_week: 6, day_cap: 3, price: 29, ai_magic: true },
    elite: { cv_per_week: 999, day_cap: 999, price: 49, ai_magic: true }
})
const isSavingConfig = ref(false)
const broadcastMessage = ref('Global Neural System Upgrade Initiated.')

const fetchConfig = async () => {
    try {
        const { data } = await supabase.from('system_config').select('value').eq('key', 'tiered_quotas').single()
        if (data && data.value) {
            const v = data.value;

            // WHY: DB may have numeric-key format {0,1,2} from old saves.
            // We normalize to named {free,pro,elite} for the AdminHub UI inputs.
            if (v.free !== undefined || v.pro !== undefined || v.elite !== undefined) {
                // Already in named format — use directly
                configData.value = {
                    free:  { cv_per_week: v.free?.cv_per_week ?? 2,   day_cap: v.free?.day_cap ?? 3,   price: v.free?.price ?? 0,  ai_magic: v.free?.ai_magic ?? false },
                    pro:   { cv_per_week: v.pro?.cv_per_week ?? 6,    day_cap: v.pro?.day_cap ?? 3,    price: v.pro?.price ?? 19,  ai_magic: v.pro?.ai_magic ?? true  },
                    elite: { cv_per_week: v.elite?.cv_per_week ?? 999, day_cap: v.elite?.day_cap ?? 999, price: v.elite?.price ?? 49, ai_magic: v.elite?.ai_magic ?? true }
                }
            } else {
                // Numeric-key format — map to named format
                configData.value = {
                    free:  { cv_per_week: v[0]?.cv_weekly_limit ?? 2,   day_cap: v[0]?.cv_daily_limit ?? 3,   price: v[0]?.price ?? 0,  ai_magic: v[0]?.ai_magic ?? false },
                    pro:   { cv_per_week: v[1]?.cv_weekly_limit ?? 6,   day_cap: v[1]?.cv_daily_limit ?? 3,   price: v[1]?.price ?? 19, ai_magic: v[1]?.ai_magic ?? true  },
                    elite: { cv_per_week: v[2]?.cv_weekly_limit ?? 999, day_cap: v[2]?.cv_daily_limit ?? 999, price: v[2]?.price ?? 49, ai_magic: v[2]?.ai_magic ?? true }
                }
            }
        }
    } catch (err) {
        console.error('[ADMIN] Config Fetch Interrupt:', err)
    }
}

const saveConfig = async () => {
    isSavingConfig.value = true
    try {
        // WHY: Always save in named {free,pro,elite} format with all fields.
        // quotaService.updateTiersFromBackend() and fetchConfig() both handle this format.
        // STRICT SYNC: Specify onConflict to ensure 'key' is used as the unique identifier for updates
        const { error } = await supabase
            .from('system_config')
            .upsert({ 
                key: 'tiered_quotas', 
                value: configData.value 
            }, { onConflict: 'key' })
        if (error) throw error
        emit('sendNotification', 'STRATEGIC ENGINE UPDATED: CHANGES LIVE')
    } catch (err) {
        console.error('[ADMIN] Persistence Failure:', err)
        emit('sendNotification', 'CONFIG SYNC FAILED: ' + (err.message || 'DATABASE REJECTION'))
    } finally {
        isSavingConfig.value = false
    }
}

const fetchAllUsers = async () => {
    try {
        const { data, error } = await profileService.fetchAllProfiles()
        if (error) throw error
        
        const normalizeTier = (pt) => {
            if (pt === 0 || pt === '0' || pt === 'free')   return 'Free'
            if (pt === 1 || pt === '1' || pt === 'pro')    return 'Pro'
            if (pt === 2 || pt === '2' || pt === 'elite')  return 'Elite'
            if (pt === 'growth')                            return 'Pro'
            return 'Free'
        }
        
        if (data && data.length > 0) {
            users.value = data.map(u => ({
                id: u.id,
                name: u.name || 'Anonymous',
                email: u.email || 'No Email',
                tier: normalizeTier(u.plan_type),
                doc_status: u.doc_status || 'Draft',
                lastSeen: 'Real-time Signal',
                joined: u.created_at || new Date().toISOString(),
                isAdmin: u.is_admin || false,
                isSuspended: u.is_suspended || false
            }))
        }
    } catch (err) {
        console.warn("Neural Fetch Failed, using mocks if list empty:", err)
        if (users.value.length === 0) {
            users.value = [
                { id: 'usr_1', name: 'Alex T.', email: 'alex@example.com', tier: 'Free', doc_status: 'Draft', lastSeen: '10 mins ago', joined: '2026-04-10', isAdmin: false, isSuspended: false },
                { id: 'usr_2', name: 'Sarah G.', email: 'sarah.g@mail.com', tier: 'Pro', doc_status: 'Verified', lastSeen: '2 hours ago', joined: '2026-04-12', isAdmin: true, isSuspended: false },
                { id: 'usr_3', name: 'Amila M.', email: 'amila@digynex.com', tier: 'Elite', doc_status: 'Pending_Approval', lastSeen: 'Just now', joined: '2026-04-15', isAdmin: false, isSuspended: false },
                { id: 'usr_4', name: 'John D.', email: 'john.d@web.co', tier: 'Free', doc_status: 'Draft', lastSeen: '1 day ago', joined: '2026-04-05', isAdmin: false, isSuspended: true },
            ]
        }
    }
}

onMounted(async () => {
    await fetchConfig()
    await fetchFinanceStats()
    await fetchAllUsers()

    // REAL-TIME SYNC: PostgreSQL Changes
    supabase.channel('admin_config_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'system_config' }, () => {
            fetchFinanceStats();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
            console.log('[ADMIN] Profiles Updated - Refreshing All Specs');
            fetchFinanceStats();
            fetchAllUsers();
        })
        .subscribe();
})

const financeStats = ref([
    { id: 1, label: 'Monthly Revenue', value: '$0', sub: 'MRR', trend: '+0%', up: true, color: '#C1A172', icon: DollarSign },
    { id: 2, label: 'Active Subscribers', value: '0', sub: 'Users', trend: '+0%', up: true, color: '#38BDF8', icon: Users },
    { id: 3, label: 'AI Token Burn', value: '0', sub: 'Tokens/mo', trend: 'N/A', up: false, color: '#F472B6', icon: Zap },
    { id: 4, label: 'Founder Passes', value: '0', sub: 'of 100 sold', trend: 'N/A', up: true, color: '#34D399', icon: Sparkles },
])

const fetchFinanceStats = async () => {
    try {
        const { data: allUsers } = await supabase.from('profiles').select('plan_type, is_suspended');
        if (!allUsers) return;

        const activeUsers = allUsers.filter(u => !u.is_suspended);
        const subCount = activeUsers.filter(u => u.plan_type === 'pro' || u.plan_type === 'elite' || u.plan_type === 1 || u.plan_type === 2).length;

        // Calculate MRR (Monthly Recurring Revenue)
        let mrr = 0;
        let proRev = 0;
        let eliteRev = 0;

        activeUsers.forEach(u => {
            const tier = String(u.plan_type).toLowerCase();
            if (tier === 'pro' || tier === '1') { mrr += 29; proRev += 29; }
            if (tier === 'elite' || tier === '2') { mrr += 49; eliteRev += 49; }
        });

        financeStats.value[0].value = `$${mrr.toLocaleString()}`;
        financeStats.value[1].value = activeUsers.length.toLocaleString();
        financeStats.value[2].value = (activeUsers.length * 1200 / 1000).toFixed(1) + 'k'; // Est. token burn
        
        // Update Chart Data
        revenueBreakdown.value.datasets[0].data = [0, proRev, eliteRev, 4470]; // Founder is still mock for now
        
        console.log('[ADMIN] Financial Telemetry & Charts Refreshed');
    } catch (err) {
        console.error('[ADMIN] Telemetry Error:', err);
    }
}

const authenticateAdmin = () => {
    if (adminPin.value === '8580') {
        isAdminAuthenticated.value = true
        isSuperAdmin.value = true
        authError.value = ''
        fetchFinanceStats() // Trigger real telemetry on auth
    } else if (neuralKeys.includes(adminPin.value)) {
        isAdminAuthenticated.value = true
        isSuperAdmin.value = false
        authError.value = ''
        fetchFinanceStats()
    } else {
        authError.value = 'NEURAL ACCESS DENIED: IDENTITY UNVERIFIED'
        adminPin.value = ''
    }
}

// ─── AI COST INDEX (per tier) ────────────────────────────────────────────────
const aiCostData = {
    labels: ['Free (T0)', 'Pro (T1)', 'Elite (T2)'],
    datasets: [{
        label: 'Avg Tokens/User',
        data: [1200, 8500, 24000],
        backgroundColor: ['rgba(100,116,139,0.6)', 'rgba(56,189,248,0.6)', 'rgba(193,161,114,0.6)'],
        borderColor: ['#64748B', '#38BDF8', '#C1A172'],
        borderWidth: 2,
        borderRadius: 8,
    }]
}

// ─── REVENUE BREAKDOWN (Stripe-ready mock) ───────────────────────────────────
const revenueBreakdown = ref({
    labels: ['Free', 'Pro ($29)', 'Elite ($49)', 'Founder ($149)'],
    datasets: [{
        data: [0, 0, 0, 4470],
        backgroundColor: ['#1e293b', '#38BDF8', '#C1A172', '#34D399'],
        borderWidth: 0,
        hoverOffset: 10,
    }]
})

const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: { legend: { display: false }, tooltip: { enabled: true } }
}

const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9 } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9 } } }
    }
}

const filteredUsers = computed(() => {
    let result = users.value.filter(u => 
        (u.name && u.name.toLowerCase().includes(userSearch.value.toLowerCase())) || 
        (u.email && u.email.toLowerCase().includes(userSearch.value.toLowerCase()))
    )
    
    if (selectedTier.value !== 'All') {
        result = result.filter(u => u.tier === selectedTier.value)
    }
    
    if (selectedRange.value !== 'All') {
        const systemNow = new Date('2026-04-14')
        const oneDay = 24 * 60 * 60 * 1000
        result = result.filter(u => {
            const joinedDate = new Date(u.joined)
            const diffInDays = Math.floor((systemNow - joinedDate) / oneDay)
            if (selectedRange.value === 'Custom' && customDays.value) return diffInDays <= customDays.value
            if (selectedRange.value === 'Today') return diffInDays === 0
            if (selectedRange.value === 'YD') return diffInDays === 1
            if (selectedRange.value === '7D') return diffInDays <= 7
            return true
        })
    }
    
    return result.slice(0, 50)
})

const updateTier = async (userId, newTier) => {
    try {
        // Save lowercase string to match DB format ('free','pro','elite')
        const dbTierValue = newTier.toLowerCase()
        const { error } = await profileService.updateUserTier(userId, dbTierValue)
        if (error) throw error
        const userIndex = users.value.findIndex(u => u.id === userId)
        if (userIndex !== -1) {
            users.value[userIndex].tier = newTier
            // Force deep reactivity
            users.value = [...users.value]
        }
        emit('sendNotification', `SPECIMEN ${users.value[userIndex]?.name || ''} PROMOTED TO ${newTier.toUpperCase()}`)
    } catch (err) {
        emit('sendNotification', 'SURGICAL OVERRIDE FAILED')
    }
}

const editingUser = ref(null)

const handlePromoteAdmin = async (userId) => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
        try {
            const newAdminStatus = !user.isAdmin
            const { error } = await profileService.updateAdminStatus(userId, newAdminStatus)
            if (error) throw error
            
            user.isAdmin = newAdminStatus
            emit('sendNotification', `IDENTITY UPDATED: ${user.name.toUpperCase()} IS ${user.isAdmin ? 'NOW ADMIN' : 'NO LONGER ADMIN'}`)
        } catch (err) {
            emit('sendNotification', 'ADMIN OVERRIDE FAILED')
        }
    }
}

const handleSuspendUser = async (userId) => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
        try {
            const newSuspendedStatus = !user.isSuspended
            const { error } = await profileService.adminUpdateProfile(userId, { is_suspended: newSuspendedStatus })
            if (error) throw error
            
            user.isSuspended = newSuspendedStatus
            emit('sendNotification', `SUSPENSION ${user.isSuspended ? 'ISSUED' : 'REVOKED'} FOR ${user.name.toUpperCase()}`)
        } catch (err) {
            emit('sendNotification', 'SUSPENSION OVERRIDE FAILED')
        }
    }
}

const confirmEdit = async () => {
    if (!editingUser.value) return
    try {
        const { error } = await profileService.adminUpdateProfile(editingUser.value.id, {
            name: editingUser.value.name,
            email: editingUser.value.email,
            plan_type: editingUser.value.tier.toLowerCase(), // STRICT SYNC: Save as string ('free','pro','elite')
            doc_status: editingUser.value.doc_status
        })
        
        if (error) throw error
        
        const index = users.value.findIndex(u => u.id === editingUser.value.id)
        if (index !== -1) {
            users.value[index] = { ...editingUser.value }
            emit('sendNotification', `IDENTITY COMMITTED: ${editingUser.value.name.toUpperCase()} UPDATED`)
        }
    } catch (err) {
        emit('sendNotification', 'COMMIT FAILED: DATABASE REJECTED OVERRIDE')
    }
    editingUser.value = null
}

const handleMaintenanceToggle = async () => {
    const newState = !props.isMaintenanceMode
    try {
        const { error } = await supabase
            .from('system_config')
            .upsert({ 
                key: 'maintenance_mode', 
                value: { enabled: newState, message: 'System Recalibration in Progress...' } 
            }, { onConflict: 'key' })
        if (error) throw error
        
        // NEURAL SYNC: Immediate local feedback while waiting for real-time pulse
        emit('update:isMaintenanceMode', newState)
        emit('sendNotification', `MAINTENANCE PROTOCOL: ${newState ? 'ENGAGED' : 'DISENGAGED'}`)
    } catch (err) {
        console.error('[ADMIN] Maintenance Transition Error:', err)
        emit('sendNotification', 'PROTOCOL TRANSITION FAILED: ' + (err.message || 'UNAUTHORIZED'))
    }
}

const handleQuickAction = async (action) => {
    // SECURITY: Add confirmation factor for global/destructive actions
    const isConfirmed = window.confirm(`CONFIRM NEURAL ACTION: ${action.l.toUpperCase()}?\n\nThis will pulse a global signal across all active specimens.`)
    if (!isConfirmed) return

    try {
        if (action.l.includes('Broadcast')) {
            const { error } = await supabase
                .from('system_config')
                .upsert({
                    key: 'global_broadcast',
                    value: { active: true, message: broadcastMessage.value, type: 'info' }
                }, { onConflict: 'key' })
            if (error) throw error
            emit('sendNotification', 'GLOBAL STRATEGY PULSE COMMITTED')
        } else {
            await profileService.triggerAdminGlobalAction('admin@digynex.com', action.l)
            if (action.l.includes('Purge')) emit('purgeData')
            if (action.l.includes('Sync')) emit('sendNotification', 'NEURAL CLOUD CORES RE-SYNCED')
        }
    } catch (err) {
        emit('sendNotification', 'LOGISTICAL INTERRUPT DETECTED')
    }
}

// --- CHART OPTIONS (Simplified for UI Density) ---
const growthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{
        label: 'Growth',
        data: [400, 700, 600, 1280],
        borderColor: '#C1A172',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(193, 161, 114, 0.1)',
        pointRadius: 4,
        pointBackgroundColor: '#C1A172'
    }]
}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } }
}

</script>

<template>
  <div class="flex-1 bg-[#051124] min-h-0 flex flex-col relative overflow-hidden">
     <!-- BACKGROUND AMBIANCE -->
     <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(193,161,114,0.05),_transparent_40%)]"></div>

     <!-- HEADER -->
     <div class="shrink-0 p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] backdrop-blur-xl relative z-10">
        <div class="flex items-center gap-4">
           <div class="bg-[#C1A172] p-2.5 rounded-2xl shadow-2xl shadow-[#C1A172]/20">
              <ShieldCheck class="w-6 h-6 text-[#0A2647]" />
           </div>
           <div>
              <h1 class="text-[18px] font-black text-white uppercase tracking-tighter">Neural Master Control</h1>
              <p class="text-[10px] font-bold text-[#C1A172]/60 uppercase tracking-widest">{{ isAdminAuthenticated ? 'System Strategy Active' : 'Restricted Access Protocol' }}</p>
           </div>
        </div>
        <button v-if="isAdminAuthenticated" @click="emit('setTab', 'profile')" class="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/50">
           <X class="w-5 h-5" />
        </button>
     </div>

      <!-- AUTHENTICATION GATE -->
      <div v-if="!isAdminAuthenticated" class="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-20 animate-in fade-in zoom-in duration-700">
         <div class="w-14 h-14 bg-gradient-to-br from-[#0A2647] to-[#051124] rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl mb-4 relative group">
            <div class="absolute inset-0 bg-[#C1A172]/10 rounded-full blur-xl group-hover:bg-[#C1A172]/20 transition-all duration-1000"></div>
            <Lock class="w-6 h-6 text-[#C1A172] animate-pulse" />
         </div>
         
         <div class="max-w-xs w-full space-y-4">
            <div class="space-y-1">
               <h2 class="text-[14px] font-black text-white uppercase tracking-[0.2em]">Master Identity</h2>
               <p class="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Enter Neural Key to establish control</p>
            </div>

            <div class="space-y-3">
               <div class="relative group">
                  <input v-model="adminPin" type="password" placeholder="••••••••" 
                         class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center text-[18px] tracking-[0.5em] text-[#C1A172] focus:outline-none focus:border-[#C1A172]/50 transition-all placeholder:text-white/10"
                         @keyup.enter="authenticateAdmin" />
               </div>
               
               <button @click="authenticateAdmin" 
                       class="w-full py-2.5 bg-[#C1A172] text-[#0A2647] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#C1A172]/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Establish Neural Link
               </button>
               
               <button @click="emit('setTab', 'profile')" class="text-[9px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors pt-3 block w-full">
                  Abort Protocol
               </button>

               <div v-if="authError" class="p-2 rounded-lg bg-red-500/10 border border-red-500/20 mt-2">
                  <p class="text-[8px] font-black text-red-400 uppercase tracking-widest">{{ authError }}</p>
               </div>
            </div>
         </div>
      </div>

     <!-- SYSTEM DASHBOARD -->
     <div v-else class="flex-1 overflow-y-auto no-scrollbar p-6 pb-32 space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
        
        <!-- FINANCIAL TELEMETRY CARDS -->
        <div v-if="isSuperAdmin" class="flex flex-col gap-2.5 w-full animate-in fade-in duration-500">
           <div v-for="stat in financeStats" :key="stat.id" 
                class="px-4 py-3 bg-[#0A2647] border border-white/5 rounded-[1.5rem] flex items-center justify-between hover:bg-[#0A2647]/80 transition-all shadow-xl">
              
              <div class="flex items-center gap-4">
                 <div :style="`background: ${stat.color}15`" class="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                    <component :is="stat.icon" class="w-4 h-4 shadow-sm" :style="`color: ${stat.color}`" />
                 </div>
                 <div class="flex flex-col text-left">
                    <span class="text-[10px] font-black tracking-widest uppercase mb-0.5 drop-shadow-md" :style="`color: ${stat.color}`">{{ stat.label }}</span>
                    <p class="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">{{ stat.sub }}</p>
                 </div>
              </div>

              <div class="flex flex-col items-end justify-center">
                 <p class="text-[20px] font-black text-white tracking-tighter leading-none mb-1 drop-shadow-lg">{{ stat.value }}</p>
                 <span :class="stat.up ? 'text-[#34D399] bg-[#34D399]/10 border-[#34D399]/20' : 'text-[#F472B6] bg-[#F472B6]/10 border-[#F472B6]/20'" 
                       class="px-2 py-0.5 rounded-md border text-[8px] font-black tracking-[0.2em] shadow-sm uppercase">
                    {{ stat.trend }}
                 </span>
              </div>
           </div>
        </div>

         <!-- VISUAL ANALYTICS: User Growth -->
         <div class="w-full bg-white/5 border border-white/5 rounded-[2.5rem] p-6 flex flex-col">
            <div class="flex items-center justify-between mb-4">
               <span class="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">User Growth Impulse (Global)</span>
               <TrendingUp class="w-3.5 h-3.5 text-[#C1A172]/50" />
            </div>
            <div class="h-36 w-full mb-4">
               <Line :data="growthData" :options="chartOptions" />
            </div>
            <div class="pt-4 border-t border-white/5 flex items-center justify-between">
               <div v-for="tier in [{l: 'Elite', v: '15%', c: '#C1A172'}, {l: 'Pro', v: '25%', c: '#38BDF8'}, {l: 'Free', v: '60%', c: '#64748B'}]" 
                    :key="tier.l" class="flex items-center gap-2">
                  <div :style="`background: ${tier.c}`" class="w-1 h-8 rounded-full"></div>
                  <div>
                     <p class="text-[16px] font-black text-white leading-none">{{ tier.v }}</p>
                     <span class="text-[7px] font-black text-white/30 uppercase tracking-widest">{{ tier.l }}</span>
                  </div>
               </div>
            </div>
         </div>

         <!-- AI COST INDEX + REVENUE BREAKDOWN -->
         <div v-if="isSuperAdmin" class="grid grid-cols-1 gap-3">
            <!-- AI Cost Bar Chart -->
            <div class="bg-white/[0.03] border border-white/5 rounded-[2rem] p-5">
               <div class="flex items-center justify-between mb-4">
                  <div>
                     <span class="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em]">AI Cost Index</span>
                     <p class="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Avg Tokens/User by Tier</p>
                  </div>
                  <div class="px-2 py-0.5 bg-pink-400/10 rounded-full">
                     <span class="text-[7px] font-black text-pink-400 uppercase tracking-widest">Live Mock</span>
                  </div>
               </div>
               <div class="h-28">
                  <Bar :data="aiCostData" :options="barOptions" />
               </div>
               <p class="text-[7px] font-bold text-white/20 uppercase tracking-widest mt-3 text-center">Connect OpenAI API for live token cost data</p>
            </div>

            <!-- Revenue Breakdown Doughnut -->
            <div class="bg-white/[0.03] border border-white/5 rounded-[2rem] p-5">
               <div class="flex items-center justify-between mb-4">
                  <div>
                     <span class="text-[10px] font-black text-[#C1A172] uppercase tracking-[0.2em]">Revenue Split</span>
                     <p class="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-0.5">MRR by Subscription Tier</p>
                  </div>
                  <div class="px-2 py-0.5 bg-[#C1A172]/10 rounded-full">
                     <span class="text-[7px] font-black text-[#C1A172] uppercase tracking-widest">Stripe Pending</span>
                  </div>
               </div>
               <div class="flex items-center gap-4">
                  <div class="h-28 w-28 shrink-0 relative">
                     <Doughnut :data="revenueBreakdown" :options="donutOptions" />
                     <div class="absolute inset-0 flex items-center justify-center flex-col">
                        <p class="text-[14px] font-black text-white leading-none">$16k</p>
                        <span class="text-[6px] font-black text-white/30 uppercase tracking-widest">MRR</span>
                     </div>
                  </div>
                  <div class="flex flex-col gap-2 flex-1">
                     <div v-for="(label, i) in revenueBreakdown.labels" :key="label" class="flex items-center justify-between">
                        <div class="flex items-center gap-1.5">
                           <div class="w-2 h-2 rounded-full" :style="`background: ${revenueBreakdown.datasets[0].backgroundColor[i]}`"></div>
                           <span class="text-[8px] font-bold text-white/50">{{ label }}</span>
                        </div>
                        <span class="text-[8px] font-black text-white/70">${{ revenueBreakdown.datasets[0].data[i].toLocaleString() }}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

        <!-- SYSTEM LOGISTICS (Ultra-Extreme Pack View) -->
        <div class="space-y-2">
           <!-- Maintenance Rail (Enhanced Visibility) -->
           <div v-if="isSuperAdmin" class="px-4 py-2 bg-[#C1A172]/10 border border-[#C1A172]/20 rounded-[1.8rem] flex items-center justify-between group transition-all hover:bg-[#C1A172]/15">
              <div class="flex items-center gap-3">
                 <div class="w-9 h-9 bg-[#C1A172]/20 rounded-[1.2rem] flex items-center justify-center border border-[#C1A172]/40">
                    <AlertTriangle class="w-3.5 h-3.5 text-[#C1A172]" />
                 </div>
                 <div class="flex flex-col">
                    <span class="text-[10px] font-black text-[#C1A172] uppercase tracking-widest leading-none mb-0.5">Maintenance Mode</span>
                    <p class="text-[7.5px] font-bold text-[#C1A172]/50 uppercase tracking-widest">Global Interaction Lock</p>
                 </div>
              </div>
              
              <button @click="handleMaintenanceToggle" 
                      :class="props.isMaintenanceMode ? 'bg-[#C1A172] text-[#0A2647] shadow-[0_0_15px_rgba(193,161,114,0.3)]' : 'bg-white/5 text-white/30'"
                      class="px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all active:scale-95">
                 {{ props.isMaintenanceMode ? 'DEACTIVATE' : 'ACTIVATE' }}
              </button>
           </div>

           <!-- Global Broadcast Control (Custom Pulse) -->
           <div v-if="isSuperAdmin" class="bg-white/[0.03] border border-white/5 rounded-[1.8rem] p-3 space-y-3">
              <div class="flex items-center justify-between">
                 <div class="flex items-center gap-2">
                    <Bell class="w-3 h-3 text-[#818CF8]" />
                    <span class="text-[9px] font-black text-white/60 uppercase tracking-widest">Broadcast Control</span>
                 </div>
                 <button @click="async () => {
                    const { error } = await supabase.from('system_config').upsert({ key: 'global_broadcast', value: { active: false, message: '', type: 'info' } }, { onConflict: 'key' });
                    if (!error) emit('sendNotification', 'BROADCAST TERMINATED');
                 }" class="text-[7px] font-black text-pink-500/50 hover:text-pink-500 uppercase tracking-widest transition-colors">Terminate Pulse</button>
              </div>
              <textarea v-model="broadcastMessage" 
                        placeholder="Type your strategic pulse message..."
                        class="w-full bg-[#051124] border border-white/5 rounded-xl p-3 text-white text-[11px] font-bold placeholder:text-white/10 focus:border-[#818CF8]/30 focus:outline-none transition-all resize-none h-16"></textarea>
              <button @click="handleQuickAction({l: 'Broadcast Strategy', s: 'Neural Alert', i: Bell, c: '#818CF8'})"
                      class="w-full py-2 bg-[#818CF8]/20 border border-[#818CF8]/30 rounded-xl text-[8px] font-black text-[#818CF8] uppercase tracking-[0.2em] hover:bg-[#818CF8]/30 active:scale-95 transition-all">
                 PULSE GLOBAL STRATEGY
              </button>
           </div>
           
           <!-- Quick Action Stack (Compressed Parity) -->
           <div class="flex flex-col gap-1.5">
              <button v-for="action in [
                 {l: 'Purge Test Specs', s: 'Recalibration', i: Trash2, c: '#F87171'}, 
                 {l: 'Force Cloud Sync', s: 'Refresh', i: RefreshCw, c: '#34D399'}
              ]" 
              :key="action.l"
              @click="handleQuickAction(action)"
              class="px-4 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-[1.5rem] flex items-center justify-between group transition-all hover:bg-white/[0.08]">
                 <div class="flex items-center gap-3">
                    <div :style="`background: ${action.c}15`" class="w-8 h-8 rounded-xl flex items-center justify-center border border-white/5">
                       <component :is="action.i" :style="`color: ${action.c}`" class="w-3 h-3 group-hover:scale-110 transition-transform" />
                    </div>
                    <div class="flex flex-col text-left">
                       <span class="text-[9px] font-black text-white/60 uppercase tracking-widest leading-none mb-0.5">{{ action.l }}</span>
                       <span class="text-[7px] font-bold text-white/20 uppercase tracking-widest">{{ action.s }}</span>
                    </div>
                 </div>
                 <ChevronRight class="w-2.5 h-2.5 text-white/10 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
           </div>
        </div>

        <!-- STRATEGIC ENGINE CONFIG (V12.0) -->
        <div v-if="isSuperAdmin" class="bg-[#0A2647]/50 border border-[#C1A172]/20 rounded-[2.5rem] p-6 space-y-6 relative overflow-hidden group">
           <div class="absolute -right-20 -top-20 w-60 h-60 bg-[#C1A172]/5 blur-[100px] rounded-full group-hover:bg-[#C1A172]/10 transition-all duration-1000"></div>
           
           <div class="flex items-center justify-between relative z-10">
              <div class="flex items-center gap-3">
                 <div class="p-2 bg-[#C1A172]/10 rounded-xl border border-[#C1A172]/30">
                    <Settings2 class="w-4 h-4 text-[#C1A172]" />
                 </div>
                 <div>
                    <h3 class="text-[12px] font-black text-white uppercase tracking-[0.2em] leading-none">Strategic Engine Config</h3>
                    <p class="text-[8px] font-bold text-[#C1A172]/50 uppercase mt-1">Live Backend Quota Management</p>
                 </div>
              </div>
              <button @click="saveConfig" 
                      :disabled="isSavingConfig"
                      class="px-4 py-2 bg-[#C1A172] text-[#0A2647] rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50">
                 <Save v-if="!isSavingConfig" class="w-3 h-3" />
                 <RefreshCw v-else class="w-3 h-3 animate-spin" />
                 {{ isSavingConfig ? 'COMMITTING...' : 'COMMIT CHANGES' }}
              </button>
           </div>

           <div class="grid grid-cols-1 gap-4 relative z-10">
              <div v-for="(cfg, tier) in configData" :key="tier" class="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                 <div class="flex items-center justify-between border-b border-white/5 pb-2">
                    <span class="text-[10px] font-black text-[#C1A172] uppercase tracking-widest">{{ tier }} Spec</span>
                    <span class="text-[8px] font-bold text-white/20 uppercase">Tier Logic</span>
                 </div>
                 <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                       <label class="text-[7px] font-black text-white/40 uppercase tracking-widest">CV Limit (Week)</label>
                       <input
                         type="text" inputmode="numeric" pattern="[0-9]*"
                         :value="cfg.cv_per_week"
                         @input="cfg.cv_per_week = Number($event.target.value.replace(/[^0-9]/g,'')) || 0"
                         class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-[11px] font-black focus:border-[#C1A172]/50 outline-none" />
                    </div>
                    <div class="space-y-1">
                       <label class="text-[7px] font-black text-white/40 uppercase tracking-widest">Daily Cap</label>
                       <input
                         type="text" inputmode="numeric" pattern="[0-9]*"
                         :value="cfg.day_cap"
                         @input="cfg.day_cap = Number($event.target.value.replace(/[^0-9]/g,'')) || 0"
                         class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-[11px] font-black focus:border-[#C1A172]/50 outline-none" />
                    </div>
                    <div class="space-y-1">
                       <label class="text-[7px] font-black text-white/40 uppercase tracking-widest">Price ($)</label>
                       <input
                         type="text" inputmode="numeric" pattern="[0-9]*"
                         :value="cfg.price"
                         @input="cfg.price = Number($event.target.value.replace(/[^0-9]/g,'')) || 0"
                         class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[#C1A172] text-[11px] font-black focus:border-[#C1A172]/50 outline-none" />
                    </div>
                    <div class="flex items-center justify-between pt-4">
                       <label class="text-[7px] font-black text-white/40 uppercase tracking-widest">AI Magic</label>
                       <button @click="cfg.ai_magic = !cfg.ai_magic"
                               :class="cfg.ai_magic ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'"
                               class="px-2 py-1 border rounded-md text-[7px] font-black uppercase tracking-widest transition-all">
                          {{ cfg.ai_magic ? 'ACTIVE' : 'LOCKED' }}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <!-- USER SPECIMEN MANAGEMENT (Refined Header & Surgical Filters) -->
        <div class="bg-white/[0.02] border border-white/5 rounded-3xl shadow-2xl space-y-px overflow-hidden">
           <!-- Header Rail -->
           <div class="p-3 flex items-center justify-between bg-white/[0.02]">
              <span class="text-[10px] font-black text-white/70 uppercase tracking-[0.15em]">ACTIVE SPECIMENS ({{ filteredUsers.length }})</span>
              
              <div class="relative flex items-center gap-2">
                 <div class="bg-white/5 border border-white/10 rounded-full flex items-center px-2 py-1">
                    <Users class="w-2.5 h-2.5 text-[#C1A172] mr-2" />
                    <input v-model="userSearch" type="text" placeholder="Search..." class="bg-transparent text-[9px] text-white focus:outline-none w-24 placeholder:text-white/20" />
                 </div>
              </div>
           </div>

           <!-- Surgical Filter Bar (High-Visibility Rail) -->
           <div class="px-3 pb-3 flex items-center gap-3 overflow-x-auto no-scrollbar bg-white/[0.01]">
              <!-- Plan Selector -->
              <div class="flex items-center p-1 bg-white/10 border border-white/10 rounded-xl gap-1 shrink-0 shadow-inner">
                 <button v-for="t in ['All', 'Free', 'Pro', 'Elite']" :key="t"
                         @click="selectedTier = t"
                         :class="selectedTier === t ? 'bg-[#C1A172] text-[#0A2647] shadow-[0_0_10px_rgba(193,161,114,0.3)] scale-105' : 'text-white/50 hover:text-white hover:bg-white/5'"
                         class="px-2.5 py-1 rounded-lg text-[8.5px] font-black uppercase tracking-widest transition-all duration-300">
                    {{ t }}
                 </button>
              </div>

              <!-- Date Range (Refined Surgical Rail) -->
              <div class="flex items-center p-1 bg-white/10 border border-white/10 rounded-xl gap-1 shrink-0 shadow-inner">
                 <button v-for="d in ['Today', 'YD', '7D', 'All']" :key="d"
                         @click="selectedRange = d; customDays = ''"
                         :class="selectedRange === d ? 'bg-white text-[#0A2647] shadow-white/20' : 'text-white/50 hover:text-white hover:bg-white/5'"
                         class="px-2 py-1 rounded-lg text-[8.5px] font-black uppercase tracking-widest transition-all duration-300">
                    {{ d }}
                 </button>
                 
                 <!-- Custom Days Input -->
                 <div class="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/10 ml-1">
                    <input v-model.number="customDays" type="number" placeholder="DAYS" 
                           class="bg-transparent text-[8.5px] font-black text-[#C1A172] focus:outline-none w-8 placeholder:text-white/20"
                           @input="selectedRange = 'Custom'" />
                 </div>
              </div>

              <div class="flex-1"></div>
              
              <!-- Recalibrate Button -->
              <button class="w-8 h-8 flex items-center justify-center bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 group transition-all shrink-0">
                 <RefreshCw class="w-3.5 h-3.5 text-white/50 group-hover:text-white group-hover:rotate-180 transition-all duration-700" />
              </button>
           </div>
           
           <div class="overflow-x-auto min-h-[280px] no-scrollbar pb-10">
              <table class="w-full text-left border-collapse">
                 <thead>
                    <tr class="border-y border-white/5 bg-white/[0.02]">
                       <th class="px-3 py-3 text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Specimen</th>
                       <th class="px-3 py-3 text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Tier</th>
                       <th class="px-3 py-3 text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Status</th>
                       <th class="px-3 py-3 text-[8px] font-black text-white/30 uppercase tracking-[0.2em] text-right pr-5">Actions</th>
                    </tr>
                 </thead>
                 <tbody class="divide-y divide-white/[0.02]">
                    <tr v-for="user in filteredUsers" :key="user.id" 
                        :style="user.isSuspended ? 'background:rgba(239,68,68,0.08)' : (user.isAdmin ? 'background:rgba(34,197,94,0.08); border-left: 2px solid rgba(34,197,94,0.6)' : '')"
                        class="transition-colors group/row hover:brightness-125">
                       <td class="px-3 py-2">
                          <div class="flex flex-col">
                             <span class="text-[11px] font-bold text-white leading-tight">{{ user.name }}</span>
                             <span class="text-[8px] font-medium text-white/50 truncate max-w-[80px]">{{ user.email }}</span>
                          </div>
                       </td>
                       <td class="px-3 py-2">
                          <div :class="{
                            'bg-[#C1A172]/20 text-[#C1A172]': user.tier === 'Elite',
                            'bg-[#38BDF8]/20 text-[#38BDF8]': user.tier === 'Pro',
                            'bg-white/10 text-white/40': user.tier === 'Free'
                          }" class="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest inline-flex">
                             {{ user.tier }}
                          </div>
                       </td>
                       <td class="pl-0 pr-1 py-2">
                          <div :class="{
                            'bg-green-500/20 text-green-400': user.doc_status === 'Verified',
                            'bg-blue-500/20 text-blue-400': user.doc_status === 'Pending_Approval',
                            'bg-white/10 text-white/40': user.doc_status === 'Draft'
                          }" class="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest inline-flex">
                             {{ user.doc_status === 'Pending_Approval' ? 'Pending' : user.doc_status }}
                          </div>
                       </td>
                       <td class="pl-1 pr-3 py-2">
                          <div v-if="isSuperAdmin" class="flex items-center justify-end gap-1 relative">
                             <!-- QUICK TIER SELECTOR (The Star Action) -->
                             <div class="relative">
                                <button @click="activeTierSelector = activeTierSelector === user.id ? null : user.id" 
                                        :class="user.tier !== 'Free' ? 'text-[#C1A172] bg-[#C1A172]/10 border-[#C1A172]/20' : 'text-white/40 bg-white/5 border-white/10'"
                                        class="w-6 h-6 rounded-md flex items-center justify-center border hover:bg-white/10 transition-all group/btn">
                                   <Sparkles class="w-3 h-3" />
                                   <span class="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[7px] pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity uppercase font-black whitespace-nowrap rounded shadow-xl z-50">Tier Override</span>
                                </button>

                                <!-- CLICK OUTSIDE OVERLAY -->
                                <div v-if="activeTierSelector === user.id" @click.stop="activeTierSelector = null" class="fixed inset-0 z-[90]"></div>
                                
                                <!-- MINI POPUP SELECTOR -->
                                <div v-if="activeTierSelector === user.id" 
                                     class="absolute right-0 top-full mt-1 z-[999] bg-[#051124] border border-[#C1A172]/30 rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200 min-w-[90px]">
                                   <button v-for="t in ['Free', 'Pro', 'Elite']" :key="t"
                                           @click="updateTier(user.id, t); activeTierSelector = null"
                                           :class="user.tier === t ? 'bg-[#C1A172] text-[#0A2647]' : 'text-white/60 hover:bg-white/5'"
                                           class="px-2 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-left transition-all">
                                      {{ t }}
                                   </button>
                                </div>
                             </div>
                             
                             <!-- Admin Toggle (Shield) -->
                             <button @click="handlePromoteAdmin(user.id)" :class="user.isAdmin ? 'bg-green-500/30 text-green-400 border-green-500/40' : 'bg-white/10 text-white/40 border-white/5'" class="w-6 h-6 rounded-md flex items-center justify-center border hover:text-green-400 hover:bg-green-500/20 transition-all group/btn relative">
                                <ShieldCheck class="w-3 h-3" />
                                <span class="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[7px] pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity uppercase font-black whitespace-nowrap rounded shadow-xl z-50">{{ user.isAdmin ? 'Revoke Admin' : 'Grant Admin' }}</span>
                             </button>

                             <!-- Full Edit -->
                             <button @click="editingUser = JSON.parse(JSON.stringify(user))" class="w-6 h-6 bg-white/10 border border-white/5 rounded-md flex items-center justify-center text-white/40 hover:text-white hover:bg-white/20 transition-all group/btn relative">
                                <Edit3 class="w-3 h-3" />
                                <span class="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[7px] pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity uppercase font-black whitespace-nowrap rounded shadow-xl z-50">Deep Edit</span>
                             </button>

                             <!-- Suspension Toggle -->
                             <button @click="handleSuspendUser(user.id)" :class="user.isSuspended ? 'bg-red-500/30 text-red-500 border-red-500/40' : 'bg-white/10 text-white/40 border-white/5'" class="w-6 h-6 rounded-md flex items-center justify-center border hover:text-red-400 hover:bg-red-500/20 transition-all group/btn relative">
                                <AlertTriangle class="w-3 h-3" />
                                <span class="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[7px] pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity uppercase font-black whitespace-nowrap rounded shadow-xl z-50">{{ user.isSuspended ? 'Revoke Freeze' : 'Freeze Specimen' }}</span>
                             </button>
                          </div>
                          <div v-else class="text-right pr-2">
                             <Lock class="w-3 h-3 text-white/10 inline-block" />
                          </div>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
      </div>
   </div>

   <!-- ─── IDENTITY EDIT MODAL (NEURAL INTERFACE) ─── -->
   <div v-if="editingUser" class="fixed inset-0 z-[99999] flex items-center justify-center p-6 sm:p-0">
      <div class="absolute inset-0 bg-[#0A2647]/90 backdrop-blur-xl animate-in fade-in duration-500" @click="editingUser = null"></div>
      
      <div class="w-full max-w-md bg-[#0A2647] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 animate-in zoom-in slide-in-from-bottom-10 duration-500">
         <div class="p-8 space-y-6">
            <div class="flex justify-between items-start">
               <div>
                  <span class="text-[9px] font-black text-[#C1A172] uppercase tracking-[0.3em]">Identity Protocol</span>
                  <h2 class="text-[20px] font-black text-white uppercase tracking-tighter mt-1">Manual Specimen Override</h2>
               </div>
               <button @click="editingUser = null" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <X class="w-5 h-5 text-white/30" />
               </button>
            </div>

            <div class="space-y-4">
               <div class="space-y-1.5">
                  <span class="text-[8px] font-black text-white/30 uppercase tracking-widest pl-1">Full Name</span>
                  <input v-model="editingUser.name" class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold text-[13px] focus:border-[#C1A172]/50 focus:outline-none transition-all" />
               </div>
               
               <div class="space-y-1.5">
                  <span class="text-[8px] font-black text-white/30 uppercase tracking-widest pl-1">Registry Email (Owner Access)</span>
                  <input v-model="editingUser.email" class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-medium text-[13px] focus:border-[#C1A172]/50 focus:outline-none transition-all" placeholder="Enter new registry email..." />
               </div>

               <div class="grid grid-cols-2 gap-3 pt-2">
                  <button v-for="t in ['Free', 'Pro', 'Elite']" :key="t"
                          @click="editingUser.tier = t"
                          :class="editingUser.tier === t ? 'bg-[#C1A172] text-[#0A2647] shadow-lg shadow-[#C1A172]/20' : 'bg-white/5 text-white/40 hover:bg-white/10'"
                          class="py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                     {{ t }}
                  </button>
               </div>

               <div class="space-y-1.5 pt-2">
                  <span class="text-[8px] font-black text-white/30 uppercase tracking-widest pl-1">Document Status</span>
                  <div class="grid grid-cols-3 gap-2">
                     <button v-for="s in ['Draft', 'Pending_Approval', 'Verified']" :key="s"
                             @click="editingUser.doc_status = s"
                             :class="editingUser.doc_status === s ? 'bg-white text-[#0A2647] shadow-lg' : 'bg-white/5 text-white/40 hover:bg-white/10'"
                             class="py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all">
                        {{ s === 'Pending_Approval' ? 'Pending' : s }}
                     </button>
                  </div>
               </div>
            </div>

            <div class="flex gap-3 pt-4">
               <button @click="editingUser = null" class="flex-1 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors">Abort</button>
               <button @click="confirmEdit" class="flex-[2] py-4 bg-[#C1A172] text-[#0A2647] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#C1A172]/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Commit Changes
               </button>
            </div>
         </div>
      </div>
   </div>
 </template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
