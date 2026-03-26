<template>
  <Teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
         <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
         <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-[slideUp_0.3s_ease-out] border border-slate-200">
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 class="font-black text-slate-800 tracking-tight text-lg">Transaction Drill-down</h3>
                <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Filtered by: {{ category }}</p>
              </div>
              <button @click="$emit('close')" class="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-800 rounded-lg transition-colors">
                <X class="w-5 h-5"/>
              </button>
            </div>
            
            <div class="p-0 overflow-x-auto">
              <table class="w-full text-left text-sm whitespace-nowrap">
                <thead class="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                  <tr>
                    <th class="px-6 py-3">Txn ID</th>
                    <th class="px-6 py-3">Source</th>
                    <th class="px-6 py-3">Amount</th>
                    <th class="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
                   <tr v-for="item in currentData" :key="item.id" class="hover:bg-slate-50 transition-colors" :class="item.highlight ? 'bg-red-50/20' : ''">
                     <td class="px-6 py-3 font-mono text-xs">{{ item.id }}</td>
                     <td class="px-6 py-3 flex items-center gap-2">
                        <component :is="item.icon" :class="item.iconClass" class="w-3.5 h-3.5" /> 
                        {{ item.source }}
                     </td>
                     <td class="px-6 py-3">{{ item.amount }}</td>
                     <td class="px-6 py-3 text-right">
                        <span :class="getStatusClass(item.status)" class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                           {{ item.status }}
                        </span>
                     </td>
                   </tr>
                </tbody>
              </table>
            </div>
            <div class="bg-slate-50 border-t border-slate-100 px-6 py-3 flex justify-between items-center text-xs font-bold text-slate-500">
              Showing sample records
              <button @click="$emit('triggerToast', 'CRM Gateway restricted during presentation mode. Redirect blocked.')" class="text-primary hover:text-blue-700 underline decoration-primary/30 underline-offset-2">View all in CRM</button>
            </div>
         </div>
      </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { X, Database, Layers, Wallet, AlertCircle, Zap, Activity, Clock } from 'lucide-vue-next'

const props = defineProps({ isOpen: Boolean, category: String })
defineEmits(['close', 'triggerToast'])

const currentData = computed(() => {
  if (props.category.includes('Database')) {
    return [
      { id: '#LOG-Sync8', source: 'Supabase V3 Edge', amount: 'Real-time', status: 'Success', icon: Activity, iconClass: 'text-emerald-500' },
      { id: '#LOG-Sync7', source: 'Infrastructure Hook', amount: '12ms Latency', status: 'Success', icon: Zap, iconClass: 'text-accent' },
      { id: '#LOG-Sync6', source: 'BI Ledger Sync', amount: 'Batch #449', status: 'Success', icon: Database, iconClass: 'text-primary' },
    ]
  } else if (props.category.includes('Target')) {
    return [
      { id: '#KPI-Rev', source: 'Direct Sales Path', amount: 'LKR 4.2M', status: 'On Track', icon: Layers, iconClass: 'text-blue-500' },
      { id: '#KPI-Exp', source: 'Operational Burden', amount: 'LKR 0.9M', status: 'Over Budget', icon: Wallet, iconClass: 'text-red-500', highlight: true },
      { id: '#KPI-Net', source: 'Growth Buffer', amount: 'LKR 3.3M', status: 'Optimized', icon: Zap, iconClass: 'text-emerald-500' },
    ]
  } else {
    return [
      { id: '#TRX-9942A', source: 'POS Terminal B', amount: 'LKR 45,000', status: 'Settled', icon: Database, iconClass: 'text-primary' },
      { id: '#TRX-9941B', source: 'Web Gateway', amount: 'LKR 128,500', status: 'Settled', icon: Layers, iconClass: 'text-accent' },
      { id: '#TRX-9938X', source: 'Wire Transfer', amount: 'LKR 95,000', status: 'Pending', icon: AlertCircle, iconClass: 'text-amber-500', highlight: true },
    ]
  }
})

const getStatusClass = (status) => {
  if (['Settled', 'Success', 'On Track', 'Optimized'].includes(status)) return 'bg-emerald-100 text-emerald-700'
  if (status === 'Over Budget') return 'bg-red-100 text-red-700'
  return 'bg-amber-100 text-amber-700'
}
</script>
