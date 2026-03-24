<template>
  <div class="lg:col-span-1 flex flex-col gap-4">
    <h3 class="text-[13px] font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest pl-1 mt-2 lg:mt-0">
      <Brain class="w-4 h-4 text-accent" /> Intelligence Engine
    </h3>
    
    <div class="flex-1 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 custom-scrollbar">
      
      <div v-for="insight in insights" :key="insight.id" 
           :class="getInsightClass(insight.type)"
           class="min-w-[280px] lg:min-w-0 p-4 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform cursor-default group/card relative overflow-hidden flex flex-col justify-between">
        
        <div v-if="insight.type === 'anomaly'" class="absolute inset-y-0 left-0 w-1 bg-amber-400"></div>

        <div class="flex items-start gap-3 mb-2">
          <div :class="getIconClass(insight.type)" class="p-1.5 bg-white rounded-lg shadow-sm border mt-0.5 transition-colors">
            <component :is="getIcon(insight.type)" class="w-4 h-4" />
          </div>
          <div>
            <h4 :class="getTitleClass(insight.type)" class="font-black text-xs uppercase tracking-wider mb-1">{{ insight.title }}</h4>
            <p :class="getTextClass(insight.type)" class="text-[11px] font-medium leading-relaxed">{{ insight.desc }}</p>
          </div>
        </div>
        
        <button v-if="insight.type === 'anomaly'" @click="$emit('triggerToast', 'Deep Dive Analyzer Launching... Context: Expense Review')" class="mt-1 ml-9 text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between group/btn w-fit">
          View Breakdown <ArrowRight class="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Brain, TrendingUp, AlertTriangle, Zap, ArrowRight } from 'lucide-vue-next'

defineProps({ insights: Array })
defineEmits(['triggerToast'])

const getIcon = (type) => { if (type === 'surge') return TrendingUp; if (type === 'anomaly') return AlertTriangle; return Zap }
const getInsightClass = (type) => { if (type === 'surge') return 'bg-indigo-50/80 border border-indigo-100'; if (type === 'anomaly') return 'bg-amber-50/80 border border-amber-100'; return 'bg-emerald-50/80 border border-emerald-100' }
const getIconClass = (type) => { if (type === 'surge') return 'text-indigo-500 border-indigo-50 group-hover/card:bg-indigo-600 group-hover/card:text-white'; if (type === 'anomaly') return 'text-amber-500 border-amber-50 group-hover/card:bg-amber-500 group-hover/card:text-white'; return 'text-emerald-500 border-emerald-50 group-hover/card:bg-emerald-500 group-hover/card:text-white' }
const getTitleClass = (type) => { if (type === 'surge') return 'text-indigo-950'; if (type === 'anomaly') return 'text-amber-950'; return 'text-emerald-950' }
const getTextClass = (type) => { if (type === 'surge') return 'text-indigo-900/70'; if (type === 'anomaly') return 'text-amber-900/70'; return 'text-emerald-900/70' }
</script>
