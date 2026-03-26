<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>
      
      <div class="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-[slideUp_0.3s_ease-out] border border-white/20 flex flex-col max-h-[90vh]">
        <!-- HEADER -->
        <div class="px-10 py-8 border-b border-slate-100 bg-emerald-50/30 flex items-center justify-between">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase rounded">Audit Verified</span>
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Doc ID: #DGNX-Q1-2026</span>
                </div>
                <h3 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <ShieldCheck class="w-7 h-7 text-emerald-500" /> Q1 Financial Compliance Audit
                </h3>
            </div>
            <button @click="$emit('close')" class="p-3 text-slate-400 hover:bg-slate-200 hover:text-slate-800 rounded-2xl transition-all">
                <X class="w-6 h-6" />
            </button>
        </div>

        <!-- CONTENT -->
        <div class="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar font-sans">
            <!-- TOP STATS -->
            <div class="grid grid-cols-3 gap-6">
                <div v-for="s in [{l:'Net Revenue', v:'$1.2M', c:'text-emerald-600'}, {l:'Total Burn', v:'$640K', c:'text-red-500'}, {l:'Profitability', v:'+42.5%', s:'↑'}]" :key="s.l" class="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ s.l }}</p>
                    <p :class="`text-xl font-black ${s.c || 'text-slate-900'}`">{{ s.v }} <span v-if="s.s" class="text-xs">{{ s.s }}</span></p>
                </div>
            </div>

            <!-- CHART SIMULATION / BREAKDOWN -->
            <div class="space-y-4">
                <h4 class="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <PieChart class="w-4 h-4 text-primary" /> Sector Allocation Breakdown
                </h4>
                <div class="space-y-3">
                    <div v-for="item in [
                        {l: 'SaaS Infrastructure', v: '35%', w: '35%', c: 'bg-primary'},
                        {l: 'AI Compute & API', v: '25%', w: '25%', c: 'bg-blue-500'},
                        {l: 'Marketing & Growth', v: '20%', w: '20%', c: 'bg-emerald-500'},
                        {l: 'Operations & Payroll', v: '20%', w: '20%', c: 'bg-orange-500'}
                    ]" :key="item.l" class="space-y-1.5">
                        <div class="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                            <span class="text-slate-500">{{ item.l }}</span>
                            <span class="text-slate-900">{{ item.v }}</span>
                        </div>
                        <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-1000" :class="item.c" :style="`width: ${item.w}`"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- AUDIT NOTES -->
            <div class="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
                <div class="absolute right-0 top-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div class="relative z-10 flex items-start gap-4">
                    <div class="p-3 bg-white/10 rounded-2xl"><FileText class="w-6 h-6 text-primary" /></div>
                    <div>
                        <p class="text-[11px] font-black uppercase tracking-widest text-primary mb-2">Executive Summary Note</p>
                        <p class="text-xs leading-relaxed text-slate-300 font-medium">
                            "Q1 2026 exhibits extreme sustainability indexes. EBITDA margins are stabilized at 38% following the AI Sharding protocol deployment. Liquidity levels remain efficient with a 14-month runway. Recommend aggressive expansion in Southeast Asia node syncs."
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="px-10 py-8 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Amila+W&background=020617&color=fff" alt="Amila" />
                </div>
                <div>
                    <p class="text-[11px] font-black text-slate-800 leading-tight">AMILA W.</p>
                    <p class="text-[9px] font-bold text-slate-400 uppercase">Super Admin • Signed Q1</p>
                </div>
            </div>
            <button @click="$emit('download')" class="px-6 py-3 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95">
                <Download class="w-4 h-4" /> Download Certified PDF
            </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { X, ShieldCheck, Download, FileText, PieChart, TrendingUp } from 'lucide-vue-next'

defineProps({ isOpen: Boolean })
defineEmits(['close', 'download'])
</script>

<style scoped>
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>
