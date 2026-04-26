<script setup>
import { ref, computed } from 'vue'
import { 
  Search, Globe, LayoutDashboard, History, X, 
  ArrowRight, Sparkles, Zap, Check, FileText, Eye, 
  DownloadCloud, Crown, RefreshCw, Briefcase, MapPin, Building,
  DollarSign, Clock, TrendingUp
} from 'lucide-vue-next'

const props = defineProps({
  t: Function,
  activeCountry: String,
  activeCity: String, // NEW: Hyper-Local Focus (V16.9)
  searchQuery: String,
  filteredMatches: Array,
  selectedCountriesArr: Array,
  activeFocusSlots: Object
})

const emit = defineEmits([
  'update:activeCountry', 
  'update:activeCity', // NEW: Hyper-Local Update (V16.9)
  'update:searchQuery', 
  'triggerSearch', 
  'openCountrySelector', 
  'removeCountry',
  'handleAction',
  'openJobDetail'
])

const openJobDetail = (match) => emit('openJobDetail', match)

// --- AI AUTO-SUGGESTIONS CORE (V16.9) ---
const showSuggestions = ref(false)
const suggestionIndex = ref(-1)
const commonRoles = [
  'Software Engineer', 'Data Scientist', 'Project Manager', 'Nurse', 'Nursing', 'Doctor',
  'Marketing Manager', 'Product Manager', 'DevOps Engineer', 'Frontend Developer', 
  'Backend Developer', 'Full Stack Developer', 'UX Designer', 'Sales Representative', 
  'Accountant', 'HR Manager', 'Business Analyst', 'Cybersecurity Analyst', 
  'Cloud Architect', 'AI Engineer', 'Machine Learning Engineer', 'Civil Engineer',
  'Mechanical Engineer', 'Electrician', 'Technician', 'Customer Support', 'Sales Executive'
]

const filteredSuggestions = computed(() => {
  if (!props.searchQuery || props.searchQuery.length < 2) return [];
  const q = props.searchQuery.toLowerCase();
  return commonRoles.filter(role => role.toLowerCase().includes(q)).slice(0, 5);
})

const selectSuggestion = (role) => {
  emit('update:searchQuery', role);
  showSuggestions.value = false;
  emit('triggerSearch');
}

const handleKeyDown = (e) => {
  if (!showSuggestions.value || filteredSuggestions.value.length === 0) return;
  if (e.key === 'ArrowDown') {
    suggestionIndex.value = (suggestionIndex.value + 1) % filteredSuggestions.value.length;
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    suggestionIndex.value = (suggestionIndex.value - 1 + filteredSuggestions.value.length) % filteredSuggestions.value.length;
    e.preventDefault();
  } else if (e.key === 'Enter' && suggestionIndex.value >= 0) {
    selectSuggestion(filteredSuggestions.value[suggestionIndex.value]);
  } else if (e.key === 'Escape') {
    showSuggestions.value = false;
  }
}

// --- CITY SATELLITE FOCUS (V16.9) ---
const isCityInputOpen = ref(false)
const localCity = ref('')
const showCitySuggestions = ref(false)
const citySuggestions = ref([])
const isSearchingCities = ref(false)
let cityDebounceTimeout = null

// Helper to map activeCountry string to ISO code
const getActiveCountryCode = () => {
  const map = { 'Sweden': 'SE', 'Germany': 'DE', 'Norway': 'NO', 'United Kingdom': 'GB', 'Sri Lanka': 'LK' };
  return map[props.activeCountry] || '';
}

const searchGlobalCities = async () => {
  if (!localCity.value || localCity.value.length < 2) {
    citySuggestions.value = [];
    return;
  }

  isSearchingCities.value = true;
  clearTimeout(cityDebounceTimeout);

  cityDebounceTimeout = setTimeout(async () => {
    try {
      const countryCode = getActiveCountryCode();
      // Added &count=10 and filtering results by countryCode if available
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(localCity.value)}&count=10&language=en&format=json`);
      const data = await res.json();
      
      if (data.results) {
        let results = data.results;
        // 🛡️ SURGICAL FILTER: Only show cities belonging to the active focus country
        if (countryCode) {
           results = results.filter(r => r.country_code.toUpperCase() === countryCode.toUpperCase());
        }

        citySuggestions.value = results.map(r => ({
          name: r.name,
          country: r.country_code,
          admin1: r.admin1,
          display: `${r.name}, ${r.country_code.toUpperCase()}`
        })).slice(0, 5);
      } else {
        citySuggestions.value = [];
      }
    } catch (err) {
      console.error('Global City Discovery Error:', err);
    } finally {
      isSearchingCities.value = false;
    }
  }, 400);
}

const selectCitySuggestion = (city) => {
  localCity.value = city.name;
  showCitySuggestions.value = false;
  handleCitySubmit();
}

const cityError = ref('')

const handleCitySubmit = async () => {
    if (!localCity.value) return;
    
    cityError.value = '';
    const countryCode = getActiveCountryCode();
    
    // 🛡️ SURGICAL VALIDATION: Check if city belongs to active country via API check
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(localCity.value)}&count=1&language=en&format=json`);
      const data = await res.json();
      
      if (data.results && data.results[0]) {
        const result = data.results[0];
        if (countryCode && result.country_code.toUpperCase() !== countryCode.toUpperCase()) {
           cityError.value = `Signal Mismatch: ${localCity.value} is not in ${props.activeCountry}`;
           return;
        }
        // Valid city found and matches country
        emit('update:activeCity', result.name);
        isCityInputOpen.value = false;
        showCitySuggestions.value = false;
        emit('triggerSearch');
      } else {
        cityError.value = `Satellite Error: ${localCity.value} not found.`;
      }
    } catch (err) {
      // Fallback: if API fails, at least block if we're sure it's wrong, 
      // but let's be strict for now.
      console.error('Validation Error:', err);
      cityError.value = 'Neural Link Timeout. Try again.';
    }
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500 pt-4">
     
     <!-- HEADER SECTION -->
     <div class="w-full px-4 space-y-4 mt-1 shrink-0">
        <!-- FOCUS SLOTS TELEMETRY -->
        <div v-if="activeFocusSlots" class="flex justify-between items-center bg-white/5 border border-white/5 rounded-2xl px-3 py-1.5 mx-1 backdrop-blur-md">
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

        <!-- COUNTRIES SELECTOR -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar scroll-smooth w-full px-0.5">
           <div v-for="country in selectedCountriesArr" :key="country"
                 @click="$emit('update:activeCountry', country)"
                 :class="activeCountry === country ? 'bg-white text-[#0A2647] font-black shadow-lg scale-105' : 'bg-white/5 text-white/40 font-bold border border-white/5'"
                 class="px-4 h-[36px] rounded-full text-[9px] uppercase tracking-widest whitespace-nowrap cursor-pointer transition-all active:scale-95 flex items-center gap-3 shrink-0 group">
              <span>{{ country }}</span>
              <X v-if="selectedCountriesArr.length > 1" @click.stop="$emit('removeCountry', country)" class="w-3 h-3 text-red-500/60 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100" />
           </div>
           <div @click="$emit('openCountrySelector')" class="flex items-center justify-center min-w-[44px] h-[36px] bg-gradient-to-br from-[#C1A172] to-[#FFD700] rounded-full cursor-pointer hover:scale-110 shadow-lg shrink-0 transition-all">
              <span class="text-[18px] font-black text-[#0A2647]">+</span>
           </div>
        </div>

        <!-- DEEP SCAN BADGE (V16.9) -->
        <div v-if="activeCity && filteredMatches.length > 0" 
             class="flex items-center gap-2.5 px-4 py-2 mb-3 bg-[#C1A172]/15 border border-[#C1A172]/30 rounded-2xl self-start animate-in fade-in slide-in-from-top-2 duration-500 shadow-[0_0_20px_rgba(193,161,114,0.1)] backdrop-blur-md">
           <div class="relative flex items-center justify-center">
              <Sparkles class="w-3 h-3 text-[#C1A172] relative z-10" />
              <div class="absolute inset-0 bg-[#C1A172] blur-md opacity-40 animate-pulse"></div>
           </div>
           <span class="text-[9.5px] text-[#C1A172] font-black uppercase tracking-[0.2em]">Neural Deep Scan: {{ filteredMatches.length }}+ {{ activeCountry }} Matches Discovered</span>
        </div>

        <!-- CITY SATELLITE FOCUS (THE HYPER-LOCAL SIGNAL) -->
        <div class="flex items-center gap-2 px-1 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
           <div v-if="activeCity" class="flex items-center gap-2.5 bg-[#C1A172]/20 border border-[#C1A172]/30 px-3 py-1.5 rounded-xl backdrop-blur-md group">
              <MapPin class="w-3 h-3 text-[#C1A172] animate-pulse" />
              <span class="text-[8.5px] font-black text-[#C1A172] uppercase tracking-[0.15em]">Satellite Focus: {{ activeCity }}</span>
              <X @click="$emit('update:activeCity', ''); localCity = ''" class="w-3 h-3 text-[#C1A172]/60 cursor-pointer hover:text-red-500 hover:scale-125 transition-all" />
           </div>
           
           <div v-else-if="!isCityInputOpen" @click="isCityInputOpen = true" 
                class="flex items-center gap-2.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-[#C1A172]/30 transition-all group cursor-pointer">
              <Globe class="w-3 h-3 text-white/20 group-hover:text-[#C1A172] transition-colors" />
              <span class="text-[8.5px] font-black text-white/20 uppercase tracking-[0.15em] group-hover:text-white/60 transition-colors">Hyper-Local Scan: All Regions</span>
           </div>

           <!-- NEURAL CITY INPUT (V16.9) -->
           <div v-if="isCityInputOpen" class="flex-1 max-w-[180px] relative animate-in zoom-in duration-300">
              <input type="text" v-model="localCity" 
                     @input="searchGlobalCities"
                     @keyup.enter="handleCitySubmit"
                     @focus="showCitySuggestions = true"
                     @blur="setTimeout(() => showCitySuggestions = false, 200)"
                     placeholder="Inject City Signal..."
                     class="w-full bg-white/10 border border-[#C1A172]/50 rounded-xl px-3 py-1.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-[#C1A172] placeholder:text-white/20 font-jakarta shadow-[0_0_15px_rgba(193,161,114,0.1)]" />
              
              <!-- CITY SUGGESTIONS DROPDOWN (GLOBAL NEURAL) -->
              <div v-if="showCitySuggestions && citySuggestions.length > 0" 
                   class="absolute top-full left-0 right-0 mt-2 bg-[#0A2647] border border-[#C1A172]/30 rounded-xl shadow-2xl overflow-hidden z-[100] backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                 <div v-for="city in citySuggestions" :key="city.display"
                      @click="selectCitySuggestion(city)"
                      class="px-4 py-2.5 text-[9px] font-bold text-white/70 hover:bg-[#C1A172]/20 hover:text-white cursor-pointer transition-all flex items-center justify-between group">
                    <div class="flex items-center gap-2">
                       <MapPin class="w-2.5 h-2.5 text-[#C1A172]/40 group-hover:text-[#C1A172]" />
                       {{ city.name }}
                    </div>
                    <span class="text-[7px] bg-white/10 px-1 rounded font-black text-white/40 group-hover:text-white/80">{{ city.country }}</span>
                 </div>
              </div>

              <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                 <RefreshCw v-if="isSearchingCities" class="w-3 h-3 text-[#C1A172] animate-spin" />
                 <Check @click="handleCitySubmit" class="w-3 h-3 text-[#C1A172] cursor-pointer hover:scale-125" />
                 <X @click="isCityInputOpen = false; showCitySuggestions = false; cityError = ''" class="w-3 h-3 text-white/20 cursor-pointer hover:scale-125" />
              </div>

              <!-- CITY ERROR MESSAGE -->
              <div v-if="cityError" 
                   class="absolute top-full left-0 mt-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300 z-[110] whitespace-nowrap min-w-[240px]">
                 <span class="text-[7.5px] font-black text-red-400 uppercase tracking-widest">{{ cityError }}</span>
              </div>
           </div>
        </div>

        <!-- SEARCH INPUT -->
        <div class="relative group mt-1 mx-2">
           <input type="text" :value="searchQuery" 
                  @input="$emit('update:searchQuery', $event.target.value); showSuggestions = true; suggestionIndex = -1" 
                  @keyup.enter="$emit('triggerSearch'); showSuggestions = false"
                  @keydown="handleKeyDown"
                  @focus="showSuggestions = true"
                  :placeholder="t('apps.searchPlaceholder')" 
                  class="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#C1A172] transition-all font-jakarta shadow-inner" />
           <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/30 group-focus-within:text-[#C1A172] transition-colors pointer-events-none" />
           
           <Transition name="fade">
              <div v-if="showSuggestions && filteredSuggestions.length > 0" 
                   class="absolute top-full left-0 right-0 mt-3 bg-[#051124]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden z-[1000] shadow-3xl">
                 <div v-for="(suggestion, idx) in filteredSuggestions" :key="suggestion"
                      @click="selectSuggestion(suggestion)"
                      :class="suggestionIndex === idx ? 'bg-[#C1A172]/20 text-white' : 'hover:bg-white/5 text-white/60'"
                      class="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all flex items-center gap-4">
                   <Sparkles class="w-3.5 h-3.5 text-[#C1A172]/40" />
                   <span>{{ suggestion }}</span>
                 </div>
              </div>
           </Transition>
        </div>
     </div>

     <!-- CONTENT: REFINED DATA-RICH STREAM (LEFT-ALIGNED) -->
     <div class="flex-1 overflow-y-auto no-scrollbar relative">
        <div v-if="filteredMatches.length > 0" class="pt-6 pb-24 space-y-4 px-4">
           <div v-for="match in filteredMatches" :key="match.id" 
                @click="openJobDetail(match)"
                class="bg-gradient-to-br from-[#BDDAFA]/10 via-[#F1F5F9] to-[#EDF2F7] rounded-[2.5rem] px-6 py-5 border border-white shadow-xl relative overflow-hidden group hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer">
              
              <div class="flex items-start gap-4 relative z-10">
                 <!-- LEFT: IDENTITY ICON -->
                 <div class="w-12 h-12 rounded-2xl p-2.5 flex items-center justify-center shadow-lg ring-1 ring-white/10 shrink-0" 
                      :style="{ backgroundColor: match.color || '#2C74B3' }">
                    <component :is="match.icon || Briefcase" class="w-full h-full text-white" />
                 </div>

                 <!-- MAIN INFO BLOCK -->
                 <div class="flex-1 flex flex-col pt-0.5">
                    <div class="flex flex-wrap items-center gap-2 mb-1.5">
                       <h3 class="text-[17px] font-black text-[#0A2647] tracking-tight leading-tight mr-1">{{ match.r }}</h3>
                       <div class="bg-gradient-to-br from-[#C1A172] to-[#FFD700] px-2 py-0.5 rounded-md shadow-md border border-white/20 flex items-baseline gap-1 scale-90">
                          <span class="text-[10px] font-black text-[#0A2647] leading-none">{{ match.m || 85 }}%</span>
                          <span class="text-[6px] font-black text-[#0A2647]/50 uppercase tracking-tighter">Match</span>
                       </div>
                    </div>
                    
                    <div class="flex items-center gap-2.5 mb-2.5">
                       <div class="flex items-center gap-1 bg-[#0A2647]/5 px-2 py-0.5 rounded-lg">
                          <DollarSign class="w-2.5 h-2.5 text-[#0A2647]/30" />
                          <span class="text-[9px] font-black text-[#0A2647]/60 uppercase tracking-tighter">{{ match.s || 'Competitive' }}</span>
                       </div>
                       <div class="flex items-center gap-1 bg-white/50 px-2 py-0.5 rounded-lg border border-white/10">
                          <Clock class="w-2.5 h-2.5 text-[#0A2647]/30" />
                          <span class="text-[9px] font-bold text-[#0A2647]/40 uppercase tracking-widest">{{ match.type || 'Full-time' }}</span>
                       </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1 opacity-60">
                       <div class="flex items-center gap-1.5">
                          <Building class="w-3 h-3 text-[#0A2647]/40" />
                          <span class="text-[9px] font-black text-[#0A2647] uppercase tracking-wide">{{ match.c }}</span>
                       </div>
                       <div class="w-1 h-1 bg-[#0A2647]/10 rounded-full"></div>
                       <div class="flex items-center gap-1.5">
                          <MapPin class="w-3 h-3 text-[#C1A172]" />
                          <span class="text-[9px] font-bold text-[#C1A172] uppercase tracking-widest">{{ match.l }}</span>
                       </div>
                       <div class="w-1 h-1 bg-[#0A2647]/10 rounded-full"></div>
                       <span class="text-[9px] font-bold text-[#0A2647]/40 uppercase tracking-widest">{{ match.t }}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-else class="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 pb-24">
           <div class="relative">
              <div class="absolute inset-0 bg-[#C1A172]/20 blur-3xl rounded-full animate-pulse"></div>
              <div class="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 relative z-10 backdrop-blur-xl">
                 <Globe class="w-12 h-12 text-[#C1A172]/40" />
              </div>
           </div>
           <div class="space-y-2">
              <h3 class="text-xs font-black text-white uppercase tracking-[0.3em]">Stream Inactive</h3>
              <p class="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">Connect to the Global Pipe by searching in {{ activeCountry }}.</p>
           </div>
           <button @click="$emit('triggerSearch')" class="px-8 py-3 bg-[#C1A172] rounded-full text-[9px] font-black text-[#0A2647] uppercase tracking-[0.2em] shadow-xl">
              Initialize Discovery
           </button>
        </div>
     </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 0px; width: 0px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
