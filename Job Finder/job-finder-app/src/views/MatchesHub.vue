<script setup>
import { 
  Search, X, Zap, Stars, LayoutDashboard, Briefcase, Globe, Star, History 
} from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps({
  t: Function,
  searchQuery: String,
  filteredMatches: Array,
  selectedCountriesArr: Array,
  activeCountry: String,
  activeFocusSlots: Object
})

const emit = defineEmits([
  'openJobDetail', 'handleAction', 'update:searchQuery', 'update:activeCountry', 'openCountrySelector'
])

const countriesContainer = ref(null)

const handleScroll = (e) => {
  // Logic for slider progress if needed, otherwise just internal
}

const openJobDetail = (job) => emit('openJobDetail', job)
const handleDashboardAction = (action, jobData) => emit('handleAction', action, jobData)

</script>

<template>
  <div class="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500 pt-4">
     <div class="w-full px-4 space-y-4 mt-1">
        <!-- FOCUS SLOTS TELEMETRY -->
        <div v-if="activeFocusSlots" class="flex justify-between items-center bg-white/5 border border-white/5 rounded-2xl px-3 py-1.5 mx-1">
           <div class="flex items-center gap-2">
              <LayoutDashboard class="w-3 h-3 text-[#C1A172]" />
              <span class="text-[8px] font-black text-white/60 uppercase tracking-widest">Active Discovery Slots</span>
           </div>
           <div class="flex items-center gap-3">
              <div class="flex items-center gap-1.5 pr-3 border-r border-white/5">
                 <span class="text-[10px] font-black text-white leading-none">{{ activeFocusSlots.used }}/{{ activeFocusSlots.total }}</span>
                 <div class="w-1.5 h-1.5 rounded-full bg-[#C1A172] animate-pulse shadow-[0_0_8px_#C1A172]"></div>
              </div>
              <button @click="$emit('handleAction', 'open_tracking')" class="flex items-center gap-1.5 group/track">
                 <History class="w-3 h-3 text-white/30 group-hover:text-[#C1A172] transition-colors" />
                 <span class="text-[7.5px] font-black text-white/30 tracking-[0.1em] uppercase group-hover:text-white transition-colors">Tracking Lab</span>
              </button>
           </div>
        </div>

        <!-- DRAGGABLE / SCROLLABLE COUNTRIES LIST -->
        <div ref="countriesContainer" @scroll="handleScroll" class="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar scroll-smooth w-full px-0.5">
           <div v-for="(country, idx) in selectedCountriesArr" :key="country"
                 @click="$emit('update:activeCountry', country)"
                 :class="activeCountry === country ? 'bg-white text-[#0A2647] font-black shadow-lg scale-105' : 'bg-white/5 text-white/40 font-bold border border-white/5 hover:bg-white/10'"
                 class="px-4 h-[36px] rounded-full text-[9px] uppercase tracking-widest whitespace-nowrap cursor-pointer transition-all active:scale-95 flex items-center gap-3 shrink-0">
             <span>{{ country }}</span>
             <X v-if="selectedCountriesArr.length !== 1" 
                @click.stop="selectedCountriesArr.splice(idx, 1); if(activeCountry === country) $emit('update:activeCountry', selectedCountriesArr[0])" 
                class="w-3 h-3 opacity-85 group-hover:opacity-100 text-red-500 hover:scale-125 transition-all" />
           </div>
           <!-- PROMINENT FIXED + BUTTON AT THE END -->
           <div @click="$emit('openCountrySelector')" 
                class="flex items-center justify-center min-w-[44px] h-[36px] bg-gradient-to-br from-[#C1A172] to-[#FFD700] rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-[0_5px_15px_rgba(193,161,114,0.3)] shrink-0 z-50">
             <span class="text-[16px] font-black text-[#0A2647]">+</span>
           </div>
        </div>

        <!-- SEARCH INPUT (MOVED BELOW COUNTRIES) -->
        <div class="relative group mt-1 mx-2">
           <input type="text" :value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)" :placeholder="t('apps.searchPlaceholder')" 
                  class="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-2 text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#C1A172]/50 transition-all font-jakarta shadow-inner" />
           <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#C1A172] transition-colors" />
        </div>
     </div>

     <div class="mt-4 flex-1 overflow-y-auto space-y-2 hub-scroller px-4 custom-scrollbar">
        <div v-for="(match, i) in filteredMatches" :key="match.id" 
        @click="openJobDetail(match)"
        class="bg-gradient-to-br from-[#BDDAFA]/25 via-[#F1F5F9] to-[#EDF2F7] rounded-[2.5rem] px-5 pt-1.5 pb-2 border border-white shadow-[0_50px_120px_-40px_rgba(0,0,0,0.25)] relative overflow-hidden group hover:scale-[1.01] transition-all cursor-pointer select-none">
           
           <!-- SUPREME SYMMETRY CONTAINER (V12.0 - ALPHA SYNC) -->
           <div class="flex items-start justify-between relative z-10 mb-1.5 min-h-[58px] pt-1.5">
              <!-- LEFT: IDENTITY UNIT -->
              <div class="flex items-start gap-3.5 h-full">
                 <div class="w-10 h-10 rounded-[1rem] p-2 flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.4)] ring-1 ring-white/10 shrink-0 transform group-hover:rotate-6 transition-transform" :style="{ backgroundColor: match.color }">
                    <component :is="match.icon" class="w-full h-full text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" />
                 </div>
                 <div class="flex flex-col pt-[1px]">
                    <h3 class="text-[16px] font-black text-[#0A2647] tracking-tight leading-[1.1] font-jakarta">{{ match.r }}</h3>
                    <div class="flex items-center gap-1.5 mt-1">
                       <span class="text-[10.5px] font-black text-[#0A2647]/55 tracking-wide font-jakarta">{{ match.c }}</span>
                       <div class="w-1 h-1 bg-[#0A2647]/10 rounded-full"></div>
                       <span class="text-[9px] font-bold text-[#C1A172] uppercase tracking-[0.1em]">{{ t('matches.posted', { time: match.t }) }}</span>
                    </div>
                 </div>
              </div>

              <!-- RIGHT: METRIC HUB (DYNAMIC GLOW) -->
              <div class="flex flex-col items-end pt-[2px] h-full">
                 <div class="bg-gradient-to-br from-[#C1A172] to-[#FFD700] px-2 py-1 rounded-lg shadow-[0_8px_20px_rgba(193,161,114,0.3)] border border-white/20 flex items-baseline gap-1 scale-100 group-hover:scale-105 transition-transform">
                    <span class="text-[11px] font-black text-[#0A2647] leading-none">{{ match.m }}%</span>
                    <span class="text-[7px] font-black text-[#0A2647]/60 uppercase tracking-tighter">Match</span>
                 </div>
              </div>
           </div>

           <!-- TIER 3: LOCATION & INTELLIGENCE HUB (V12.0 TIGHTENED) -->
           <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-black/[0.03] mx-0.5">
              <div class="flex items-center gap-2 font-jakarta opacity-85 px-[0.75px] hover:opacity-100 transition-opacity">
                 <Globe class="w-3 h-3 text-[#0A2647]" />
                 <span class="text-[10.5px] font-bold text-[#0A2647]/70 tracking-wide truncate">{{ match.l }}</span>
              </div>
              <div class="flex items-center gap-1.5 bg-[#C1A172]/10 px-2 py-0.5 rounded-lg border border-[#C1A172]/20 group-hover:bg-[#C1A172]/20 transition-all">
                 <Zap class="w-2.5 h-2.5 text-[#C1A172]" />
                 <span class="text-[8px] font-black text-[#C1A172] uppercase tracking-tighter">Tailoring Active</span>
              </div>
           </div>
           
           <!-- FOOTER: ELITE ACTION CONTROL -->
           <div class="flex items-center justify-between pt-0.5 pb-0.5">
              <div class="flex items-center gap-3">
                 <div class="flex -space-x-2.5">
                    <div v-for="j in 3" :key="j" class="w-5 h-5 rounded-full border-2 border-[#0A2647] overflow-hidden group-hover:border-white/10 transition-colors">
                       <img :src="'https://i.pravatar.cc/50?u=' + (i+j)" class="w-full h-full object-cover contrast-125" />
                    </div>
                 </div>
                 <span class="text-[8.5px] font-black text-[#0A2647]/35 uppercase tracking-wider font-jakarta">{{ t('matches.applicantsCount', { count: 12 }) }}</span>
              </div>
              <div class="flex gap-1.5 justify-end items-center relative z-[100]">
                 <button @click.stop="handleDashboardAction('save_match', match)" class="bg-white/5 border border-white/10 text-white/30 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 hover:text-white transition-all active:scale-90 group-hover:border-white/20">
                    <Star class="w-3 h-3" />
                 </button>
                 <button @click.stop="handleDashboardAction('tailor_cv', match)" class="bg-black/10 text-[#0A2647]/60 border border-black/5 w-16 py-1 rounded-xl text-[7.5px] font-black uppercase tracking-[0.05em] hover:bg-black/20 hover:text-[#0A2647] active:scale-95 transition-all font-jakarta text-center">
                    Tailor
                 </button>
                 <button @click.stop="handleDashboardAction('quick_apply', match)" class="bg-[#C1A172] text-[#0A2647] w-[78px] py-1 rounded-xl text-[7.5px] font-black uppercase tracking-[0.05em] shadow-[0_8px_15px_rgba(193,161,114,0.25)] hover:scale-[1.02] active:scale-95 transition-all font-jakarta relative overflow-hidden text-center group/apply">
                    <div class="absolute inset-0 bg-white/20 -translate-x-full group-hover/apply:translate-x-full transition-transform duration-1000"></div>
                    Apply Now
                 </button>
              </div>
           </div>
        </div>
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
</style>
