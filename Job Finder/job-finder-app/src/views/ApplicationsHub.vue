<script setup>
import { 
  Search, SlidersHorizontal, Globe, ChevronDown, Briefcase, Zap, LayoutDashboard, Star 
} from 'lucide-vue-next'

const props = defineProps({
  t: Function,
  searchQuery: String,
  filteredJobs: Array,
  activeFilter: String
})

const emit = defineEmits(['openJobDetail', 'openActionSheet', 'update:searchQuery', 'update:activeFilter', 'loadMore'])

const openJobDetail = (job) => emit('openJobDetail', job)
const openActionSheet = (title, type) => emit('openActionSheet', title, type)

</script>

<template>
  <div class="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500">
     <!-- Top Branding Hub (CENTERED SYNC) -->
     <header class="flex flex-col items-center pt-[18px] space-y-4 w-full relative z-[600]">
       <div class="p-0.5 bg-white/10 rounded-full">
          <img src="/digynex-icon.png" alt="DigyNex" class="h-8 w-auto opacity-50 contrast-125" />
       </div>
       <div class="flex flex-col items-center mb-1">
          <h2 class="text-[14px] font-black text-white/40 uppercase tracking-[0.3em] leading-none">{{ t('apps.title') }}</h2>
       </div>
     </header>

     <div class="w-full px-1 space-y-3 mt-3">
        <div class="relative group mx-2">
           <input type="text" :value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)" :placeholder="t('apps.searchPlaceholder')" 
                  class="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-2 text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#2C74B3]/50 transition-all font-jakarta shadow-inner" />
           <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#2C74B3] transition-colors" />
           <div @click.stop="openActionSheet('Search Filters', 'filters')" class="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg cursor-pointer transition-all">
              <SlidersHorizontal class="w-3.5 h-3.5 text-white/20 hover:text-white transition-colors" />
           </div>
        </div>
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
           <span v-for="cat in ['filterAll', 'filterPending', 'filterInterview', 'filterOffers', 'filterArchived']" :key="cat"
                 @click="emit('update:activeFilter', cat)"
                 :class="activeFilter === cat ? 'bg-white text-[#0A2647] font-black scale-105' : 'bg-white/5 text-white/40 font-bold border border-white/5'"
                 class="px-5 py-2 rounded-full text-[9px] uppercase tracking-widest whitespace-nowrap cursor-pointer hover:bg-white/10 transition-all active:scale-95">
             {{ t('apps.' + cat) }}
           </span>
        </div>
     </div>

     <div class="mt-4 flex-1 overflow-y-auto space-y-2 pb-[115px] px-4 custom-scrollbar">
        <!-- SMART ACTIVE VIEW (TOP 4 PRIORITY) -->
        <div v-for="(app, i) in filteredJobs" :key="i" @click="openJobDetail(app)" class="cursor-pointer bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-[2.2rem] p-4 pt-1 pb-1 border border-white/10 shadow-2xl relative overflow-hidden group hover:scale-[1.01] transition-all">
           <div class="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
           
           <!-- SUPREME SYMMETRY CONTAINER -->
           <div class="flex items-start justify-between relative z-10 mb-1 h-12">
              <!-- LEFT: IDENTITY UNIT -->
              <div class="flex items-start gap-3 h-full">
                 <div class="w-12 h-12 rounded-[1.2rem] p-2.5 flex items-center justify-center shadow-2xl ring-1 ring-white/10 shrink-0 transform group-hover:rotate-6 transition-transform" :style="{ backgroundColor: app.color }">
                    <component :is="app.icon" class="w-full h-full text-white drop-shadow-lg" />
                 </div>
                 <div class="flex flex-col pt-[7px]">
                    <h3 class="text-[16px] font-black text-white tracking-tight leading-none font-jakarta">{{ app.r }}</h3>
                    <p class="text-[12px] font-bold text-white/50 mt-1.5 font-jakarta tracking-wide">{{ app.c }}</p>
                 </div>
              </div>

              <!-- RIGHT: METRIC & STATUS UNIT -->
              <div class="flex flex-col items-end pt-[2px] h-full">
                 <div class="bg-white/10 px-3 py-1.5 rounded-full border border-white/20 shadow-inner group-hover:border-white/40 transition-colors leading-none flex items-center justify-center">
                    <span class="text-[12px] font-black text-[#C1A172] tracking-tighter">{{ app.m }}%</span>
                 </div>
                 <!-- ALIGNED STATUS BADGE -->
                 <div class="flex items-center gap-1.5 opacity-80 bg-white/5 px-2.5 py-1.5 rounded-full border border-white/5 mt-3 transition-all group-hover:bg-white/10">
                    <div :class="app.s === 'interview' ? 'bg-[#73BBA3]' : app.s === 'offer' ? 'bg-[#C1A172]' : 'bg-[#2C74B3]'"
                         class="w-1.5 h-1.5 rounded-full shadow-[0_0_12px_currentColor]"></div>
                    <span class="text-[8px] font-black uppercase tracking-[0.15em] text-white/70 leading-none font-jakarta">{{ t('pipeline.' + app.s) }}</span>
                 </div>
              </div>
           </div>

           <!-- TIER 3: LOCATION HUB (MINIMAL) -->
           <div class="flex items-center gap-2 mb-1 font-jakarta opacity-85 px-[0.75px] hover:opacity-100 transition-opacity">
              <Globe class="w-3.5 h-3.5" />
              <span class="text-[11px] font-bold text-white tracking-wide truncate">{{ app.l }}</span>
           </div>

           <!-- FOOTER: ALIGNED DATE & BUTTON -->
           <div class="flex items-center justify-between border-t border-white/5 pt-1">
              <div class="flex flex-col">
                 <span class="text-[8.5px] font-black text-white/20 uppercase tracking-[0.2em] font-jakarta">{{ t('apps.appliedDate') }}</span>
                 <span class="text-[11px] font-extrabold text-white/50 mt-1 font-jakarta">12 March 2024</span>
              </div>
              <button @click="openJobDetail(app)" class="bg-white text-[#0A2647] px-6 py-3 rounded-2xl text-[10.5px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all font-jakarta">
                 {{ t('apps.viewDetails') }}
              </button>
           </div>
        </div>

        <button @click="emit('loadMore')" class="w-full bg-gradient-to-r from-[#C1A172] to-[#FFD700] py-2.5 rounded-[2rem] flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.98] transition-all group font-jakarta shadow-lg">
           <span class="text-[11px] font-black text-[#0A2647] uppercase tracking-[0.2em] transition-colors">{{ t('apps.loadMore') }}</span>
           <div class="w-6 h-6 rounded-full bg-[#0A2647]/10 flex items-center justify-center p-1.5 group-hover:rotate-180 transition-all">
              <ChevronDown class="w-3.5 h-3.5 text-[#0A2647]" />
           </div>
        </button>

     </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
