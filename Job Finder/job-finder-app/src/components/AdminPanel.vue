<script setup>
import { ref } from 'vue'
import { ShieldCheck, Zap, Lock } from 'lucide-vue-next'

const props = defineProps({
  isMaintenanceMode: Boolean
})

const emit = defineEmits(['update:isMaintenanceMode', 'setTab'])

const isAdminAuthenticated = ref(false)
const adminPin = ref('')
const neuralKey = 'master333'

const authenticateAdmin = () => {
    if (adminPin.value === neuralKey) {
        isAdminAuthenticated.value = true
    } else {
        alert('NEURAL KEY REJECTED. IDENTITY NOT VERIFIED.')
        adminPin.value = ''
    }
}
</script>

<template>
  <div class="flex-1 bg-white p-6 overflow-y-auto no-scrollbar relative z-50 min-h-0">
    <!-- AUTHENTICATION GATE -->
    <div v-if="!isAdminAuthenticated" class="h-full flex flex-col items-center justify-center space-y-8 p-10 text-center animate-in fade-in zoom-in duration-500">
      <div class="w-20 h-20 bg-[#0A2647] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#0A2647]/30">
        <Lock class="w-8 h-8 text-[#C1A172] animate-pulse" />
      </div>
      <div>
        <h2 class="text-[20px] font-black text-[#0A2647] uppercase tracking-tighter">Identity Verification</h2>
        <p class="text-[10px] font-bold text-[#0A2647]/40 uppercase tracking-widest mt-1">Enter Master Neural Key to Proceed</p>
      </div>

      <div class="w-full max-w-xs space-y-4">
        <input v-model="adminPin" 
               type="password" 
               placeholder="••••••••" 
               @keyup.enter="authenticateAdmin"
               class="w-full px-6 py-4 bg-[#0A2647]/5 border border-[#0A2647]/10 rounded-2xl text-center text-[18px] font-black text-[#0A2647] tracking-[0.5em] focus:outline-none focus:border-[#C1A172] transition-all" />
        
        <button @click="authenticateAdmin" class="w-full py-4 bg-[#0A2647] text-[#C1A172] text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
          Verify Identity
        </button>
        
        <button @click="emit('setTab', 'profile')" class="text-[10px] font-bold text-[#0A2647]/30 uppercase tracking-widest hover:text-[#0A2647] transition-colors">
          Abort Protocol
        </button>
      </div>
    </div>

    <!-- MASTER CONTROL CONTENT -->
    <div v-else class="h-full animate-in fade-in duration-500">
      <div class="flex items-center gap-3 mb-8">
        <div class="bg-[#0A2647] p-2.5 rounded-2xl shadow-xl shadow-[#0A2647]/20">
          <ShieldCheck class="w-6 h-6 text-[#C1A172]" />
        </div>
        <div>
          <h2 class="text-[18px] font-black text-[#0A2647] uppercase tracking-tighter">Master Control</h2>
          <p class="text-[10px] font-bold text-[#0A2647]/40 uppercase tracking-widest">Global Governance Center</p>
        </div>
      </div>
      
      <div class="space-y-6">
        <!-- Maintenance Mode Card -->
        <div class="bg-[#0A2647]/5 border border-[#0A2647]/10 rounded-[2.5rem] p-6 group transition-all hover:bg-white hover:shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-black text-[#0A2647] uppercase">Maintenance Mode</span>
            <button @click="emit('update:isMaintenanceMode', !isMaintenanceMode)" 
                    :class="isMaintenanceMode ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-gray-300'"
                    class="w-12 h-6 rounded-full relative transition-all duration-300">
              <div :class="isMaintenanceMode ? 'translate-x-6' : 'translate-x-0'"
                   class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300"></div>
            </button>
          </div>
          <p class="text-[10px] font-medium text-[#0A2647]/60 leading-relaxed mb-4 italic">
            Stop all user interactions globally. Useful for neural recalibrations and n8n bridge maintenance.
          </p>
          <div class="flex items-center gap-2 p-3 bg-white/50 rounded-2xl border border-dashed border-[#0A2647]/10">
            <div class="w-1.5 h-1.5 rounded-full" :class="isMaintenanceMode ? 'bg-red-500 animate-pulse' : 'bg-green-500'"></div>
            <span class="text-[9px] font-black text-[#0A2647]/40 uppercase tracking-widest">
              {{ isMaintenanceMode ? 'Status: LOCKING USERS' : 'Status: ACCESSIBLE' }}
            </span>
          </div>
        </div>

        <!-- System Pulse Mock -->
        <div class="bg-gradient-to-br from-[#0A2647] via-[#1a3a5f] to-[#0A2647] rounded-[2.5rem] p-7 text-white shadow-2xl relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 opacity-10 group-hover:scale-150 transition-transform duration-1000">
            <Zap class="w-24 h-24" />
          </div>
          <span class="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 block">System Pulse (Real-time)</span>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-white/5 rounded-2xl border border-white/5">
              <p class="text-[22px] font-black tracking-tighter text-[#C1A172]">0.00$</p>
              <p class="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Stripe Revenue</p>
            </div>
            <div class="p-3 bg-white/5 rounded-2xl border border-white/5">
              <p class="text-[22px] font-black tracking-tighter">1,240</p>
              <p class="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">AI Consumption</p>
            </div>
          </div>
        </div>
        
        <button @click="emit('setTab', 'profile')" class="w-full bg-[#0A2647]/5 py-4 rounded-2xl text-[11px] font-black text-[#0A2647]/40 uppercase tracking-widest hover:bg-[#0A2647] hover:text-white transition-all active:scale-95 shadow-lg hover:shadow-[#0A2647]/20">
          Return to Command Base
        </button>
      </div>
    </div>
  </div>
</template>
