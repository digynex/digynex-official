<template>
  <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
    <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
        <h3 class="font-black text-slate-800 uppercase tracking-widest text-[11px] flex items-center gap-2">
           <FileText class="w-4 h-4 text-primary" /> Active Purchase Orders (Incoming)
        </h3>
        <button @click="$emit('create')" class="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-2">
            <Plus class="w-3.5 h-3.5" /> Create New PO
        </button>
    </div>
    <div class="overflow-x-auto">
        <table class="w-full">
            <thead class="bg-slate-50/50">
                <tr class="text-left border-b border-slate-100">
                    <th class="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">PO Number</th>
                    <th class="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name</th>
                    <th class="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Budget</th>
                    <th class="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th class="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
                <tr v-for="po in pos" :key="po.id" class="hover:bg-slate-50/50 transition-colors group">
                    <td class="px-4 py-5">
                        <span class="text-xs font-black text-slate-800 font-mono">{{ po.po_number }}</span>
                    </td>
                    <td class="px-4 py-5">
                        <div class="flex items-center gap-3">
                            <div class="p-1.5 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Users class="w-4 h-4" />
                            </div>
                            <span class="text-sm font-bold text-slate-800">{{ po.client_name }}</span>
                        </div>
                    </td>
                    <td class="px-4 py-5 text-xs font-black text-slate-900 text-center tabular-nums">
                        {{ brandingStore.currency }} {{ Number(po.amount).toLocaleString() }}
                    </td>
                    <td class="px-4 py-5">
                        <span :class="getStatusClass(po.status)" class="px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border italic">
                            {{ po.status }}
                        </span>
                    </td>
                    <td class="px-4 py-5 text-right">
                        <div class="flex items-center justify-end gap-2">
                           <button 
                             @click="$emit('openAssets', po)"
                             class="p-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-lg hover:bg-slate-100 hover:text-primary transition-all shadow-sm relative"
                             title="External Assets & Blueprints"
                           >
                             <Globe class="w-4 h-4" />
                             <span v-if="po.asset_links?.length" class="absolute -top-1 -right-1 w-3 h-3 bg-primary text-white text-[7px] flex items-center justify-center rounded-full font-black border border-white">{{ po.asset_links.length }}</span>
                           </button>
                           <button 
                             v-if="po.status === 'pending'"
                             @click="$emit('approve', po)"
                             class="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                             title="Approve & Lock Budget"
                           >
                             <CheckCircle class="w-4 h-4" />
                           </button>
                           <button 
                             v-if="po.status === 'approved'"
                             @click="$emit('convertToWO', po)"
                             class="px-3 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                           >
                             <Zap class="w-3.5 h-3.5" /> Convert to WO
                           </button>
                           <button 
                             v-if="po.status === 'converted'"
                             class="p-2 bg-slate-50 text-slate-300 border border-slate-100 rounded-lg cursor-not-allowed"
                             disabled
                           >
                             <ArrowRightLeft class="w-4 h-4" />
                           </button>
                        </div>
                    </td>
                </tr>
                <tr v-if="pos.length === 0">
                    <td colspan="5" class="px-4 py-12 text-center text-slate-400 font-bold text-sm italic">
                        No active purchase orders detected in sync pipeline.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script setup>
import { FileText, Plus, Users, CheckCircle, Zap, ArrowRightLeft } from 'lucide-vue-next'
import { brandingStore } from '../../services/brandingService'

defineProps({
    pos: {
        type: Array,
        required: true
    }
})

defineEmits(['create', 'approve', 'convertToWO', 'openAssets'])

const getStatusClass = (status) => {
    if (status === 'approved') return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    if (status === 'converted') return 'bg-indigo-50 text-indigo-600 border-indigo-100'
    if (status === 'rejected') return 'bg-red-50 text-red-600 border-red-100'
    return 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
}
</script>
