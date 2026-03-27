<template>
  <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
    <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
      <h3 class="font-black text-slate-800 uppercase tracking-widest text-[11px] flex items-center gap-2">
        <Clock class="w-4 h-4 text-primary" /> Operational Activity Timeline
      </h3>
      <button @click="fetchLogs" class="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
        <RefreshCw class="w-3 h-3 text-slate-400" />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
      <div v-if="logs.length === 0" class="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
        <div class="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center">
            <Layers class="w-6 h-6 text-slate-300" />
        </div>
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 italic font-mono">No digital events recorded.</p>
      </div>

      <div v-else class="relative border-l-2 border-slate-100 ml-3 pl-8 space-y-8 py-2">
        <div v-for="log in logs" :key="log.id" class="relative group">
          <!-- DOT -->
          <div class="absolute -left-[41px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-125" :class="getActionColor(log.action)"></div>
          
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-black text-slate-900 uppercase tracking-tight">{{ log.action }} <span class="text-slate-400 font-bold ml-1">[{{ log.entity_type }}]</span></p>
              <span class="text-[9px] font-black text-slate-400 uppercase">{{ formatTime(log.created_at) }}</span>
            </div>
            <p class="text-[11px] text-slate-500 font-medium leading-relaxed">
              Performed by <span class="font-bold text-slate-700">{{ log.performed_by }}</span>. 
              {{ getActionDesc(log) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Clock, RefreshCw, Layers } from 'lucide-vue-next'
import { supabase } from '../../services/supabase'

const logs = ref([])

const fetchLogs = async () => {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(15)

  if (!error) {
    logs.value = data || []
  }
}

const getActionColor = (action) => {
  switch(action) {
    case 'Completed': return 'bg-emerald-500'
    case 'Invoiced': return 'bg-indigo-500'
    case 'Created': return 'bg-blue-500'
    case 'Assigned': return 'bg-amber-500'
    default: return 'bg-slate-400'
  }
}

const getActionDesc = (log) => {
  if (log.action === 'Invoiced') return `Strategic revenue of LKR ${Number(log.details?.amount || 0).toLocaleString()} posted to cloud bin.`
  if (log.action === 'Completed') return `Work unit "${log.details?.name || 'Unknown'}" verified 100%.`
  return 'System metadata adjusted.'
}

const formatTime = (ts) => {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchLogs()
  
  // Realtime subscription
  supabase
    .channel('activity_logs_realtime')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, () => {
      fetchLogs()
    })
    .subscribe()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
