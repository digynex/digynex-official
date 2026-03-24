<template>
  <div class="lg:col-span-3 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
       <div>
         <h3 class="text-xl font-black text-slate-800 tracking-tight">Revenue Model vs AI Actuals</h3>
         <div class="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
           <p class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1.5">
             <Database class="w-3 h-3"/> Synced from Supabase
           </p>
           <p class="text-[11px] text-primary font-bold hidden sm:block">• Click chart nodes to drill down details</p>
         </div>
       </div>
       <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner w-full sm:w-auto relative z-10 transition-all">
          <button @click="setFilter('day')" :class="getFilterClass('day')">Day</button>
          <button @click="setFilter('week')" :class="getFilterClass('week')">Week</button>
          <button @click="setFilter('month')" :class="getFilterClass('month')">Month</button>
       </div>
    </div>
    
    <div class="flex-1 w-full min-h-[320px]">
        <apexchart v-if="series.length > 0" :key="selectedFilter" type="area" height="100%" width="100%" :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>

<script setup>
import { Database } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['nodeClicked', 'triggerToast'])

const selectedFilter = ref('month')

const getFilterClass = (filter) => {
  const base = 'flex-1 sm:flex-none px-4 py-1.5 text-[11px] uppercase tracking-wider transition-all rounded-md '
  if (selectedFilter.value === filter) {
    return base + 'font-black bg-white text-slate-800 shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200/60 transition-transform scale-105'
  }
  return base + 'font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
}

const setFilter = (filter) => {
  selectedFilter.value = filter
  emit('triggerToast', `Re-syncing AI Intelligence Engine for ${filter.toUpperCase()} time-series layout...`)
}

const series = computed(() => {
  if(!props.chartData.actual) return []
  
  if (selectedFilter.value === 'month') {
    return [
      { name: 'Actual Generated', data: props.chartData.actual },
      { name: 'AI Forecast Path', data: props.chartData.predicted }
    ]
  } else if (selectedFilter.value === 'week') {
    return [
      { name: 'Actual Generated', data: [1.8, 2.2, 1.9, 3.4, 2.9, 4.2, 4.4] },
      { name: 'AI Forecast Path', data: [1.5, 2.0, 2.2, 3.0, 3.3, 4.5, 4.9] }
    ]
  } else {
    // day
    return [
      { name: 'Actual Generated', data: [0.3, 0.5, 0.4, 0.8, 0.9, 1.2, 1.5] },
      { name: 'AI Forecast Path', data: [0.4, 0.5, 0.6, 0.7, 1.0, 1.3, 1.8] }
    ]
  }
})

const chartOptions = computed(() => {
  let cats = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul (Est)']
  if (selectedFilter.value === 'week') cats = ['W1 (Mar)', 'W2 (Mar)', 'W3 (Mar)', 'W4 (Mar)', 'W1 (Apr)', 'W2 (Apr)', 'W3 (Apr)']
  if (selectedFilter.value === 'day') cats = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return {
    chart: {
      type: 'area',
      fontFamily: 'inherit',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          dynamicAnimation: { enabled: true, speed: 400 }
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const cat = chartContext.w.config.xaxis.categories[config.dataPointIndex];
          emit('nodeClicked', cat);
        }
      }
    },
    colors: ['#0f172a', '#8b5cf6'], 
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.0, stops: [0, 90, 100] }
    },
    dataLabels: { enabled: false },
    stroke: { 
      curve: 'smooth', 
      width: [3, 2],
      dashArray: [0, 6] 
    },
    xaxis: {
      categories: cats,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#64748b', fontWeight: 600, fontSize: '11px' } }
    },
    yaxis: {
      labels: { 
        formatter: (value) => { return value.toFixed(1) + "M" },
        style: { colors: '#64748b', fontWeight: 600, fontSize: '11px' } 
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } }
    },
    legend: { 
      position: 'top', 
      horizontalAlign: 'right',
      markers: { radius: 12 },
      fontWeight: 700,
      fontSize: '11px',
      labels: { colors: '#475569' }
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => val.toFixed(2) + " Million LKR" }
    }
  }
})
</script>
