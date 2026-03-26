<template>
  <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:border-primary/20 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]" @click="$emit('triggerToast', 'Deep-analyzing Q1 Growth Strategy & Pipeline Audit...'); $emit('drillDown', 'Target Benchmark')">
      <div class="shrink-0 flex items-center justify-center p-3.5 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
        <Target class="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
      </div>
      <div class="flex-1 w-full relative">
        <div class="flex justify-between items-end mb-2">
          <div>
            <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest">Q1 Enterprise Growth Target</h3>
            <p class="text-[10px] font-bold text-slate-400 tracking-wider">LKR 4.1M completed against LKR 5.0M Goal</p>
          </div>
          <div class="text-right">
            <span class="text-2xl font-black text-slate-800 tabular-nums">{{ Math.floor(progress) }}%</span>
          </div>
        </div>
        <!-- Progress Bar -->
        <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner flex">
          <div class="bg-gradient-to-r from-primary to-accent h-full transition-all duration-1000 ease-out flex" :style="{ width: progress + '%' }">
            <div class="w-full h-full bg-white/20 animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>
      <div class="shrink-0 flex text-left md:text-right gap-6 md:border-l border-slate-200 md:pl-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 mt-4 md:mt-0">
         <div>
           <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Remaining</p>
           <p class="text-sm font-black text-amber-600">LKR 900K</p>
         </div>
         <div>
           <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Time Limit</p>
           <p class="text-sm font-black text-red-500 flex items-center gap-1"><Clock class="w-3.5 h-3.5"/> 6 Days</p>
         </div>
      </div>
  </div>
</template>

<script setup>
import { Target, Clock } from 'lucide-vue-next'

defineProps({
  progress: {
    type: Number,
    default: 0
  }
})
defineEmits(['triggerToast', 'drillDown'])
</script>
