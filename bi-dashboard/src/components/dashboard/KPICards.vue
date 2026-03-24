<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      
      <!-- REVENUE (Hero Card) -->
      <div class="md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-700 shadow-xl shadow-slate-900/10 text-white relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/20 hover:-translate-y-1">
        <div class="absolute -top-10 -right-10 p-8 opacity-5 transform rotate-12 group-hover:rotate-0 transition-transform duration-700"><DollarSign class="w-56 h-56"/></div>
        
        <div class="relative z-10 flex flex-col h-full justify-between">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-slate-400 font-bold tracking-widest text-[11px] mb-2 uppercase">Total Realized Revenue</h3>
              <div class="flex items-baseline gap-3">
                <h2 class="text-4xl sm:text-5xl font-black tracking-tight text-white m-0 leading-none">LKR {{ Number(kpis.revenue || 0).toFixed(1) }}M</h2>
                <span class="text-xs font-black text-emerald-400 px-2 py-1 bg-emerald-400/10 rounded-md border border-emerald-400/20 shadow-inner flex items-center gap-1">
                  <TrendingUp class="w-3 h-3"/> +14.2% MoM
                </span>
              </div>
            </div>
          </div>
          
          <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-sm border-t border-slate-700/50 pt-5">
            <div class="flex flex-col">
              <span class="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">AI Target Forecast (Next M)</span>
              <span class="font-black text-lg text-purple-300 drop-shadow-sm leading-none tabular-nums">LKR 4.8M</span>
            </div>
          </div>
        </div>
      </div>

      <!-- NET PROFIT -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Net Profit</h3>
            <div class="p-2 text-primary bg-blue-50 rounded-xl shadow-inner group-hover:bg-blue-100 transition-colors"><LineChart class="w-4 h-4"/></div>
          </div>
          <div class="flex items-baseline gap-2 mb-1">
            <h2 class="text-3xl font-black text-slate-800 tracking-tight tabular-nums">{{ Number(kpis.profit || 0).toFixed(1) }}M</h2>
          </div>
          <p class="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><Activity class="w-3.5 h-3.5"/> 22.5% Margin</p>
        </div>
        <div class="mt-4 bg-slate-50/80 rounded-lg p-3 border border-slate-100 group-hover:bg-slate-100/50 transition-colors cursor-help">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight mb-1">🧪 What-If Analysis</p>
          <p class="text-[11px] font-medium text-slate-700 leading-tight">If expenses +10% → <span class="text-red-500 font-bold">-180K Impact</span></p>
        </div>
      </div>

      <!-- CASH FLOW & EXPENSES VERTICAL STACK -->
      <div class="flex flex-col gap-4 h-full">
        <!-- Free Cash Flow -->
        <div class="bg-white px-5 py-4 rounded-2xl border border-emerald-100 shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-0.5">
           <div class="absolute inset-y-0 left-0 w-1 bg-emerald-400"></div>
          <div class="flex items-center justify-between mb-1.5">
            <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Free Cash Flow</h3>
            <Wallet class="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors"/>
          </div>
          <div class="flex items-baseline gap-2">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight tabular-nums">{{ Math.floor(kpis.cashFlow || 0) }}K</h2>
            <ArrowUpRight class="w-4 h-4 text-emerald-500 animate-pulse" />
          </div>
        </div>
        
        <!-- Operating Expenses -->
        <div class="bg-white px-5 py-4 rounded-2xl border border-red-100 shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-0.5">
           <div class="absolute inset-y-0 left-0 w-1 bg-red-400"></div>
          <div class="flex items-center justify-between mb-1.5">
            <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Op. Expenses</h3>
            <TrendingDown class="w-3.5 h-3.5 text-red-300 group-hover:text-red-500 transition-colors"/>
          </div>
          <div class="flex items-end justify-between">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight tabular-nums">{{ Number(kpis.expenses || 0).toFixed(1) }}M</h2>
            <span class="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 shadow-sm">⚠ +18%</span>
          </div>
        </div>
      </div>

  </div>
</template>

<script setup>
import { DollarSign, TrendingUp, LineChart, Activity, Wallet, ArrowUpRight, TrendingDown } from 'lucide-vue-next'

defineProps({
  kpis: {
    type: Object,
    required: true
  }
})
</script>
