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
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-3 font-mono text-xs">#TRX-9942A</td>
                    <td class="px-6 py-3 flex items-center gap-2"><Database class="w-3.5 h-3.5 text-primary"/> POS Terminal B</td>
                    <td class="px-6 py-3">LKR 45,000</td>
                    <td class="px-6 py-3 text-right"><span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase tracking-widest">Settled</span></td>
                  </tr>
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-3 font-mono text-xs">#TRX-9941B</td>
                    <td class="px-6 py-3 flex items-center gap-2"><Layers class="w-3.5 h-3.5 text-accent"/> Web Gateway</td>
                    <td class="px-6 py-3">LKR 128,500</td>
                    <td class="px-6 py-3 text-right"><span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase tracking-widest">Settled</span></td>
                  </tr>
                  <tr class="hover:bg-slate-50 transition-colors bg-red-50/20">
                    <td class="px-6 py-3 font-mono text-xs">#TRX-9938X</td>
                    <td class="px-6 py-3 flex items-center gap-2"><Wallet class="w-3.5 h-3.5 text-slate-400"/> Wire Transfer</td>
                    <td class="px-6 py-3">LKR 95,000</td>
                    <td class="px-6 py-3 text-right"><span class="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase tracking-widest">Pending Clearence</span></td>
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
import { X, Database, Layers, Wallet } from 'lucide-vue-next'

defineProps({ isOpen: Boolean, category: String })
defineEmits(['close', 'triggerToast'])
</script>
