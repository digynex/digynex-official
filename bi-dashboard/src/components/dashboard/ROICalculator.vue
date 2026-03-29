<template>
  <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-emerald-200 transition-all duration-500">
    <div class="p-6 border-b border-slate-100 bg-slate-50/20 flex items-center justify-between">
      <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
        <TrendingUp class="w-4 h-4 text-emerald-500" /> Strategic ROI Forecaster
      </h3>
      <div class="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[8px] font-black uppercase tracking-widest border border-emerald-100">
        Value Capture 2026
      </div>
    </div>
    
    <div class="p-8 space-y-6">
      <!-- INPUTS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Active Workforce</label>
          <div class="relative">
            <Users class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              v-model.number="inputs.staffCount" 
              type="number" 
              class="w-full bg-slate-50 border border-slate-100 rounded-xl px-9 py-2.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
              placeholder="e.g. 10"
            />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Avg Hourly Rate ({{ brandingStore.currency }})</label>
          <div class="relative">
             <Coins class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              v-model.number="inputs.hourlyRate" 
              type="number" 
              class="w-full bg-slate-50 border border-slate-100 rounded-xl px-9 py-2.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
              placeholder="e.g. 50"
            />
          </div>
        </div>
      </div>

      <!-- RANGE SLIDER FOR HOURS -->
      <div class="space-y-4 pt-2">
        <div class="flex justify-between items-end">
          <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Manual Hours / Week (Pre-DigyNex)</label>
          <span class="text-xs font-black text-slate-900 tracking-tighter">{{ inputs.manualHours }} Hrs</span>
        </div>
        <input 
          v-model.number="inputs.manualHours" 
          type="range" min="1" max="100" 
          class="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>

      <!-- RESULTS DISPLAY -->
      <div class="bg-emerald-950 rounded-2xl p-6 text-white relative overflow-hidden group/result mt-4 shadow-xl shadow-emerald-900/10">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p class="text-[8px] font-black text-emerald-400/60 uppercase tracking-widest mb-1">Annual Efficiency Savings</p>
            <h4 class="text-3xl font-black tracking-tighter">{{ brandingStore.currency }} {{ formattedSavings }}</h4>
            <div class="flex items-center gap-1 mt-2">
               <Zap class="w-3 h-3 text-emerald-400 fill-emerald-400" />
               <p class="text-[9px] font-bold text-emerald-400/80 uppercase tracking-tight">Predicted 75% Administrative Reduction</p>
            </div>
          </div>
          
          <div class="flex flex-col items-center md:items-end">
             <div class="text-center md:text-right">
                <p class="text-[8px] font-black text-emerald-400/60 uppercase tracking-widest mb-1">Calculated ROI</p>
                <p class="text-2xl font-black text-white italic tracking-tighter">{{ roiPercentage }}% <span class="text-[10px] non-italic text-emerald-400">Increase</span></p>
             </div>
          </div>
        </div>
      </div>
      
      <p class="text-[9px] text-center text-slate-400 font-bold uppercase tracking-tight italic">
        "Operational Sovereignty creates exponential value over time."
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { TrendingUp, Users, Coins, Zap } from 'lucide-vue-next'
import { brandingStore } from '../../services/brandingService'

const inputs = ref({
  staffCount: 1,
  hourlyRate: 15,
  manualHours: 20,
  maintenanceCost: 500 // Annual maintenance/subscription baseline
})

const totalSavings = computed(() => {
  // Efficiency Gain Formula: (Manual Hours * Hourly Rate * 52) - Maintenance Cost
  const grossSavings = inputs.value.staffCount * inputs.value.hourlyRate * inputs.value.manualHours * 52
  const netSavings = grossSavings - inputs.value.maintenanceCost
  return isNaN(netSavings) ? 0 : netSavings
})

const formattedSavings = computed(() => {
  return totalSavings.value.toLocaleString(undefined, { maximumFractionDigits: 0 })
})

const roiPercentage = computed(() => {
  // Project ROI Formula: (Net Profit / Total Investment) * 100
  // Here Net Profit is represented by Savings and Investment is the Maintenance/Setup cost
  const investment = inputs.value.maintenanceCost + 2500 // Assuming $2500 setup fee baseline
  const roi = (totalSavings.value / investment) * 100
  return isNaN(roi) ? 0 : roi.toLocaleString(undefined, { maximumFractionDigits: 0 })
})
</script>

<style scoped>
/* Custom Range Styling */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #10b981;
  border: 4px solid white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: all 0.2s ease;
}
input[type='range']::-webkit-slider-thumb:active {
  transform: scale(1.2);
}
</style>
