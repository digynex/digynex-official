<template>
  <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
    <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
        <h3 class="font-black text-slate-800 uppercase tracking-widest text-[11px] flex items-center gap-2">
           <Zap class="w-4 h-4 text-accent" /> Live Work Orders (Production)
        </h3>
        <div class="flex items-center gap-4">
            <div class="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 text-[9px] font-black uppercase tracking-widest">
                AI Load Level: High
            </div>
            <button @click="$emit('downloadManifest')" class="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm" title="Global Operational Export">
                <Download class="w-3.5 h-3.5 text-slate-400" />
            </button>
        </div>
    </div>
    <div class="overflow-x-auto">
        <table class="w-full text-center">
            <thead class="bg-slate-50/50">
                <tr class="text-left border-b border-slate-100">
                    <th class="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">WO Identity</th>
                    <th class="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignment (Admin/SC)</th>
                    <th class="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sub-Budget</th>
                    <th class="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Timeline Status</th>
                    <th class="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
                <tr v-for="wo in wos" :key="wo.id" class="hover:bg-slate-50/50 transition-colors group">
                    <td class="px-4 py-5">
                        <div class="flex flex-col items-center">
                            <p class="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{{ wo.name }}</p>
                            <span class="px-2 py-0.5 bg-slate-900/5 text-slate-500 rounded-md text-[8px] font-black border border-slate-200 uppercase tracking-widest flex items-center gap-1">
                                <FileText class="w-2.5 h-2.5" /> REF: {{ wo.po_id?.po_number || 'INTERNAL' }}
                            </span>
                        </div>
                    </td>
                    <td class="px-4 py-5">
                        <div class="flex items-center justify-center gap-4">
                            <div v-if="wo.assigned_supervisor" class="p-1 px-2.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-800 hover:scale-110 transition-transform">
                                <span class="text-slate-500 font-bold mr-1">SV:</span> {{ wo.assigned_supervisor }}
                            </div>
                            <div v-if="wo.assigned_subcontractor" class="p-1 px-2.5 bg-accent/20 text-accent rounded-lg text-[9px] font-black uppercase tracking-widest border border-accent/30 hover:scale-110 transition-transform shadow-sm">
                                <span class="text-accent/60 font-bold mr-1">SC:</span> {{ wo.assigned_subcontractor }}
                            </div>
                            <button v-else @click="$emit('assign', wo)" class="text-[9px] font-black uppercase text-indigo-500 hover:text-indigo-700 bg-indigo-50 p-2 border border-indigo-100 rounded-lg transition-colors flex items-center gap-1 group/btn">
                                <UserPlus class="w-3 h-3 group-hover/btn:scale-110" /> Assign Resource
                            </button>
                        </div>
                    </td>
                    <td class="px-4 py-5 text-xs font-black text-slate-700 text-center tabular-nums">
                        {{ brandingStore.currency }} {{ Number(wo.budget_allocation || 0).toLocaleString() }}
                    </td>
                    <td class="px-4 py-5">
                        <div class="flex flex-col items-center gap-2 text-center">
                             <div :class="getStatusClass(wo.status)" class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border italic">
                                 {{ wo.status }}
                             </div>
                             <span class="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Clock class="w-3 h-3" /> {{ wo.deadline || 'No Deadline' }}</span>
                        </div>
                    </td>
                    <td class="px-4 py-5 text-right">
                        <div class="flex items-center justify-end gap-2">
                           <button 
                             @click="$emit('openAssets', wo)"
                             class="p-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm relative text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                             title="External Resources & Blueprints"
                           >
                             <Link class="w-3.5 h-3.5" /> Assets
                             <span v-if="wo.asset_links?.length" class="absolute -top-1 -right-1 w-3 h-3 bg-slate-900 text-white text-[7px] flex items-center justify-center rounded-full font-black border border-white">{{ wo.asset_links.length }}</span>
                           </button>
                           <button 
                             @click="$emit('downloadPDF', { data: wo, type: 'WO' })"
                             class="p-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-all"
                             title="Download WO Manifest"
                           >
                             <Download class="w-4 h-4" />
                           </button>
                           <button 
                             v-if="wo.status !== 'completed'"
                             @click="$emit('complete', wo)"
                             class="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95"
                           >
                             <Check class="w-3.5 h-3.5" /> Mark Completed
                           </button>
                           <button 
                             v-else
                             @click="$emit('generateInvoice', wo)"
                             class="px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-xl shadow-slate-900/20 active:scale-95 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-slate-700 hover:bg-slate-800 transition-colors"
                           >
                             <FileText class="w-3.5 h-3.5 text-accent" /> Generate Invoice
                           </button>
                        </div>
                    </td>
                </tr>
                <tr v-if="wos.length === 0">
                    <td colspan="5" class="px-8 py-16 text-center">
                        <div class="flex flex-col items-center gap-3">
                             <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-300">
                                <Layout class="w-8 h-8" />
                             </div>
                             <p class="text-sm font-bold text-slate-400 italic">No production work orders active. Sync PO to trigger conversion.</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script setup>
import { Zap, Clock, Check, FileText, UserPlus, Layout, Download } from 'lucide-vue-next'
import { brandingStore } from '../../services/brandingService'

defineProps({
    wos: {
        type: Array,
        required: true
    }
})

defineEmits(['assign', 'complete', 'generateInvoice', 'downloadPDF', 'downloadManifest', 'openAssets'])

const getStatusClass = (status) => {
    if (status === 'completed') return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    if (status === 'in_progress') return 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse'
    return 'bg-amber-50 text-amber-600 border-amber-100'
}
</script>
