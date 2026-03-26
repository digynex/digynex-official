<template>
  <Teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
         <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out] border border-slate-200">
             <!-- FIXED HEADER -->
             <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
              <div>
                <h3 class="font-black text-slate-800 tracking-tight text-lg">AI-Powered Business Intelligence</h3>
                <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Strategic Drill-down: {{ category }}</p>
              </div>
              <button @click="$emit('close')" class="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-800 rounded-lg transition-colors">
                <X class="w-5 h-5"/>
              </button>
            </div>
            
            <!-- SCROLLABLE BODY -->
            <div class="flex-1 overflow-y-auto custom-scrollbar bg-white">
              <div class="p-6 bg-slate-50/30" v-if="category === 'P&L Context'">
                <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity class="w-3.5 h-3.5 text-primary" /> Profit & Loss Performance Trend
                </h4>
                <div class="h-[250px] w-full bg-white rounded-xl border border-slate-200 p-4 shadow-sm relative z-0">
                  <apexchart type="line" height="100%" width="100%" :options="profitChartOptions" :series="profitSeries"></apexchart>
                </div>
                <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="bg-emerald-50 p-3 rounded-lg border border-emerald-100/50">
                      <p class="text-[10px] uppercase font-bold text-emerald-600 mb-1">Peak Margin</p>
                      <p class="text-lg font-black text-slate-800">28.4%</p>
                    </div>
                    <div class="bg-blue-50 p-3 rounded-lg border border-blue-100/50">
                      <p class="text-[10px] uppercase font-bold text-blue-600 mb-1">Growth Index</p>
                      <p class="text-lg font-black text-slate-800">+12%</p>
                    </div>
                    <div class="bg-purple-50 p-3 rounded-lg border border-purple-100/50">
                      <p class="text-[10px] uppercase font-bold text-purple-600 mb-1">AI Efficiency</p>
                      <p class="text-lg font-black text-slate-800">94.2/100</p>
                    </div>
                </div>
              </div>

              <div class="p-0 overflow-x-auto">
                <div class="px-6 py-3 bg-slate-50 border-y border-slate-200" v-if="category === 'P&L Context'">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Underlying Ledger Entries</p>
                </div>
                <table class="w-full text-left text-sm whitespace-nowrap">
                  <thead class="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold sticky top-0 z-10">
                    <tr>
                      <th class="px-6 py-3">Txn ID</th>
                      <th class="px-6 py-3">Source</th>
                      <th class="px-6 py-3">Amount</th>
                      <th class="px-6 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 text-slate-700 font-medium font-sans">
                    <tr v-for="item in currentData" :key="item.id" class="hover:bg-slate-50 transition-colors" :class="item.highlight ? 'bg-red-50/20' : ''">
                      <td class="px-6 py-3 font-mono text-xs">{{ item.id }}</td>
                      <td class="px-6 py-3 flex items-center gap-2">
                          <component :is="item.icon" :class="item.iconClass" class="w-3.5 h-3.5" /> 
                          {{ item.source }}
                      </td>
                      <td class="px-6 py-3 font-bold">{{ item.amount }}</td>
                      <td class="px-6 py-3 text-right">
                          <span :class="getStatusClass(item.status)" class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                            {{ item.status }}
                          </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- FIXED FOOTER -->
            <div class="bg-slate-50 border-t border-slate-100 px-6 py-3 flex justify-between items-center text-xs font-bold text-slate-500 flex-shrink-0">
              Showing AI-curated sample records
              <button @click="$emit('triggerToast', 'CRM Gateway restricted during presentation mode. Redirect blocked.')" class="text-primary hover:text-blue-700 underline decoration-primary/30 underline-offset-2">View all in Global Ledger</button>
            </div>
         </div>
      </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { X, Database, Layers, Wallet, AlertCircle, Zap, Activity, Clock } from 'lucide-vue-next'
import { brandingStore } from '../../services/brandingService'

const props = defineProps({ isOpen: Boolean, category: String })
defineEmits(['close', 'triggerToast'])

const currentData = computed(() => {
  if (props.category === 'P&L Context') {
    return [
      { id: '#PL-801', source: 'Enterprise SaaS', amount: brandingStore.currency + ' 280,000', status: 'Optimized', icon: Zap, iconClass: 'text-emerald-500' },
      { id: '#PL-802', source: 'Batch Training', amount: brandingStore.currency + ' 145,000', status: 'Success', icon: Layers, iconClass: 'text-blue-500' },
      { id: '#PL-803', source: 'Overhead Cost', amount: brandingStore.currency + ' -45,000', status: 'Neutral', icon: Clock, iconClass: 'text-slate-400' },
    ]
  } else if (props.category === 'Avg Order Value') {
    return [
      { id: '#SL-99', source: 'Platinum Plan', amount: brandingStore.currency + ' 125,000', status: 'Settled', icon: Zap, iconClass: 'text-primary' },
      { id: '#SL-98', source: 'Growth Suite', amount: brandingStore.currency + ' 79,000', status: 'Settled', icon: Layers, iconClass: 'text-blue-500' },
      { id: '#SL-97', source: 'Starter kit', amount: brandingStore.currency + ' 29,000', status: 'Settled', icon: Database, iconClass: 'text-slate-400' },
    ]
  } else if (props.category === 'Conversion Rate') {
    return [
      { id: '#L-201', source: 'Google PPC', amount: '18.2% Conv', status: 'High', icon: Activity, iconClass: 'text-emerald-500' },
      { id: '#L-202', source: 'Organic SEO', amount: '9.4% Conv', status: 'Stable', icon: Database, iconClass: 'text-primary' },
      { id: '#L-203', source: 'Social Ads', amount: '11.5% Conv', status: 'Stable', icon: Zap, iconClass: 'text-accent' },
    ]
  } else if (props.category === 'Total Orders') {
    return [
      { id: '#ORD-01', source: 'March Batch A', amount: '142 Orders', status: 'Processed', icon: Clock, iconClass: 'text-blue-500' },
      { id: '#ORD-02', source: 'March Batch B', amount: '280 Orders', status: 'Processed', icon: Clock, iconClass: 'text-blue-500' },
      { id: '#ORD-03', source: 'Late Night Ops', amount: '20 Orders', status: 'Pending', icon: AlertCircle, iconClass: 'text-amber-500' },
    ]
  } else if (props.category === 'New Customers') {
    return [
      { id: '#CUST-91', source: 'Nexus Enterprise', amount: 'Corporate', status: 'Verified', icon: Database, iconClass: 'text-primary' },
      { id: '#CUST-92', source: 'Individual Dev', amount: 'SaaS Pro', status: 'Verified', icon: Zap, iconClass: 'text-accent' },
      { id: '#CUST-93', source: 'Small Biz Inc', amount: 'Starter', status: 'Pending', icon: Clock, iconClass: 'text-amber-500' },
    ]
  } else if (props.category === 'Unified Revenue Stream') {
    return [
      { id: '#REV-091', source: 'Global Subscriptions', amount: brandingStore.currency + ' 840,000', status: 'Settled', icon: Database, iconClass: 'text-primary' },
      { id: '#REV-092', source: 'API Payload Fees', amount: brandingStore.currency + ' 125,000', status: 'Settled', icon: Zap, iconClass: 'text-accent' },
      { id: '#REV-093', source: 'Consultancy Retainer', amount: brandingStore.currency + ' 435,000', status: 'Pending', icon: Clock, iconClass: 'text-amber-500' },
    ]
  } else if (props.category === 'Liquidity Radar') {
    return [
      { id: '#CASH-44', source: 'Operational Reserve', amount: brandingStore.currency + ' 900,000', status: 'Healthy', icon: Wallet, iconClass: 'text-emerald-500' },
      { id: '#CASH-45', source: 'Receivables (30D)', amount: brandingStore.currency + ' 303,000', status: 'Pending', icon: Clock, iconClass: 'text-amber-500' },
    ]
  } else if (props.category === 'Expense Auditor') {
    return [
      { id: '#EXP-201', source: 'Cloud Infrastructure', amount: brandingStore.currency + ' 450,000', status: 'Over Budget', icon: Database, iconClass: 'text-red-500', highlight: true },
      { id: '#EXP-202', source: 'Marketing Spend', amount: brandingStore.currency + ' 150,000', status: 'On Track', icon: Zap, iconClass: 'text-blue-500' },
      { id: '#EXP-203', source: 'Office Payroll', amount: brandingStore.currency + ' 300,000', status: 'Settled', icon: Layers, iconClass: 'text-slate-400' },
    ]
  } else if (props.category === 'Platform Uptime') {
    return [
      { id: '#NODE-01', source: 'Primary Edge Hub', amount: '99.99%', status: 'Healthy', icon: Activity, iconClass: 'text-emerald-500' },
      { id: '#NODE-02', source: 'CDN Cache Layer', amount: '99.98%', status: 'Healthy', icon: Layers, iconClass: 'text-blue-500' },
      { id: '#NODE-03', source: 'Database Replica', amount: '99.95%', status: 'On Track', icon: Database, iconClass: 'text-primary' },
    ]
  } else if (props.category === 'Lead Response Time') {
    return [
      { id: '#LOG-481', source: 'SaaS Inbound', amount: '1.2m', status: 'Optimized', icon: Zap, iconClass: 'text-primary' },
      { id: '#LOG-482', source: 'Custom Enterprise', amount: '8.5m', status: 'Pending', icon: Clock, iconClass: 'text-amber-500' },
      { id: '#LOG-483', source: 'Growth Inbound', amount: '2.8m', status: 'Optimized', icon: Zap, iconClass: 'text-primary' },
    ]
  } else if (props.category === 'Workload Density') {
    return [
      { id: '#WORK-01', source: 'n8n Executor #A', amount: '88% Load', status: 'High', icon: Activity, iconClass: 'text-amber-500' },
      { id: '#WORK-02', source: 'n8n Executor #B', amount: '42% Load', status: 'Stable', icon: Activity, iconClass: 'text-emerald-500' },
      { id: '#WORK-03', source: 'Supabase Workers', amount: '65% Load', status: 'Stable', icon: Database, iconClass: 'text-primary' },
    ]
  } else if (props.category === 'System Saturation') {
    return [
      { id: '#LAT-01', source: 'API Latency', amount: '12.4ms', status: 'Optimized', icon: Zap, iconClass: 'text-emerald-500' },
      { id: '#LAT-02', source: 'IO Throughput', amount: '840 MB/s', status: 'High', icon: Activity, iconClass: 'text-amber-500' },
      { id: '#LAT-03', source: 'Query Execution', amount: '45ms', status: 'Stable', icon: Database, iconClass: 'text-primary' },
    ]
  } else if (props.category.includes('Database')) {
    return [
      { id: '#LOG-Sync8', source: 'Supabase V3 Edge', amount: 'Real-time', status: 'Success', icon: Activity, iconClass: 'text-emerald-500' },
      { id: '#LOG-Sync7', source: 'Infrastructure Hook', amount: '12ms Latency', status: 'Success', icon: Zap, iconClass: 'text-accent' },
      { id: '#LOG-Sync6', source: 'BI Ledger Sync', amount: 'Batch #449', status: 'Success', icon: Database, iconClass: 'text-primary' },
    ]
  } else if (props.category.includes('Target')) {
    return [
      { id: '#KPI-Rev', source: 'Direct Sales Path', amount: brandingStore.currency + ' 4.2M', status: 'On Track', icon: Layers, iconClass: 'text-blue-500' },
      { id: '#KPI-Exp', source: 'Operational Burden', amount: brandingStore.currency + ' 0.9M', status: 'Over Budget', icon: Wallet, iconClass: 'text-red-500', highlight: true },
      { id: '#KPI-Net', source: 'Growth Buffer', amount: brandingStore.currency + ' 3.3M', status: 'Optimized', icon: Zap, iconClass: 'text-emerald-500' },
    ]
  } else {
    return [
      { id: '#TRX-9942A', source: 'POS Terminal B', amount: brandingStore.currency + ' 45,000', status: 'Settled', icon: Database, iconClass: 'text-primary' },
      { id: '#TRX-9941B', source: 'Web Gateway', amount: brandingStore.currency + ' 128,500', status: 'Settled', icon: Layers, iconClass: 'text-accent' },
      { id: '#TRX-9938X', source: 'Wire Transfer', amount: brandingStore.currency + ' 95,000', status: 'Pending', icon: AlertCircle, iconClass: 'text-amber-500', highlight: true },
    ]
  }
})

const profitSeries = computed(() => [
  { name: 'Revenue', data: [31, 40, 28, 51, 42, 109, 100] },
  { name: 'Profit', data: [11, 32, 45, 32, 34, 52, 41] }
])

const profitChartOptions = computed(() => ({
  chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
  colors: ['#0f172a', '#10b981'],
  stroke: { curve: 'smooth', width: 3 },
  xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], labels: { style: { colors: '#64748b', fontWeight: 600 } } },
  yaxis: { labels: { style: { colors: '#64748b', fontWeight: 600 } } },
  grid: { borderColor: '#f1f5f9' },
  legend: { position: 'top', horizontalAlign: 'right', fontWeight: 700 }
}))

const getStatusClass = (status) => {
  if (['Settled', 'Success', 'On Track', 'Optimized', 'Healthy'].includes(status)) return 'bg-emerald-100 text-emerald-700'
  if (status === 'Over Budget') return 'bg-red-100 text-red-700'
  if (status === 'Neutral') return 'bg-slate-100 text-slate-600'
  return 'bg-amber-100 text-amber-700'
}
</script>
