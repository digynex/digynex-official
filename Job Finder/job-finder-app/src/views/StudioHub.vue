<script setup>
import { 
  Sparkles, Check, Lock, X, RefreshCw, ArrowRight, Stars, Zap
} from 'lucide-vue-next'

const props = defineProps({
  t: Function,
  userProfile: Object,
  masterProfile: Object,
  cvTemplates: Array,
  selectedTemplate: Number,
  viewportHtml: String,
  isStealthUnlocked: Boolean,
  isAnalyzingKeywords: Boolean,
  isSavingProfile: Boolean,
  isBrandingSyncing: Boolean,
  colorPresets: Array
})

const emit = defineEmits([
  'update:selectedTemplate', 'selectTemplate', 'removeSecretKeyword', 'addSecretKeyword', 'analyzeKeywords', 'selectPreset', 'saveProfile', 'handleAction'
])

const selectTemplate = (t) => emit('selectTemplate', t)
const removeSecretKeyword = (k) => emit('removeSecretKeyword', k)
const addSecretKeyword = () => emit('addSecretKeyword')
const analyzeAndSuggestKeywords = () => emit('analyzeKeywords')
const selectPreset = (p) => emit('selectPreset', p)
const saveProfile = () => emit('saveProfile')
const handleDashboardAction = (action) => emit('handleAction', action)
const updateSelectedTemplate = (id) => emit('update:selectedTemplate', id)
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500">
    
    <!-- Top Branding Hub (CENTERED SYNC) -->
    <header class="flex flex-col items-center pt-[18px] space-y-4 w-full relative z-[600]">
      <div class="p-0.5 bg-white/10 rounded-full">
         <img src="/digynex-icon.png" alt="DigyNex" class="h-8 w-auto opacity-50 contrast-125" />
      </div>
      <div class="flex flex-col items-center mb-1">
         <h2 class="text-[14px] font-black text-white/40 uppercase tracking-[0.3em] leading-none">{{ t('nav.studio') }}</h2>
         <div class="flex items-center gap-1.5 mt-2.5">
            <div class="w-1 h-1 rounded-full bg-[#C1A172] animate-pulse shadow-[0_0_8px_#C1A172]"></div>
            <span class="text-[7.5px] font-black text-white/20 uppercase tracking-[0.2em]">Neural Sync Active</span>
         </div>
      </div>
    </header>

    <div class="mt-2.5 flex-1 overflow-y-auto space-y-4 px-4 hub-scroller custom-scrollbar">
        
        <!-- 1. TEMPLATE GALLERY (PREMIUM DENSITY) -->
        <div class="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-3xl rounded-[2.2rem] p-5 border border-white/10 shadow-3xl overflow-visible group relative">
           <div class="flex justify-between items-center mb-3.5">
              <div class="flex flex-col">
                 <span class="text-[9px] font-black text-[#C1A172] uppercase tracking-[0.2em] mb-1">Elite Selection</span>
                 <h3 class="text-[14px] font-black text-white tracking-tight uppercase">Template Gallery</h3>
              </div>
              <span class="text-[9px] font-black text-white/30 uppercase tracking-widest">{{ cvTemplates.length }} Styles Available</span>
           </div>
           
           <div class="flex flex-nowrap gap-4 overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory scroll-smooth min-h-[220px] custom-horizontal-scrollbar">
              <div v-for="t in cvTemplates" :key="t.id" 
                   @click="updateSelectedTemplate(t.id)"
                   class="w-[140px] h-[195px] bg-gradient-to-br from-white/10 to-white/5 rounded-[2rem] shrink-0 border-2 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group/thumb snap-center"
                   :class="selectedTemplate === t.id ? 'scale-[1.05]' : 'border-white/5 hover:border-white/20 hover:scale-[1.02]'"
                   :style="selectedTemplate === t.id ? { borderColor: userProfile.primaryColor, boxShadow: `0 20px 50px ${userProfile.primaryColor}30` } : {}">
                 
                 <div class="absolute inset-0 w-full h-full overflow-hidden">
                    <img :src="t.image" class="w-full h-full object-top opacity-50 group-hover/thumb:opacity-95 group-hover/thumb:scale-110 transition-all duration-1000"
                         :style="{ filter: `hue-rotate(${userProfile.primaryColor === '#0A2647' ? '0deg' : userProfile.primaryColor === '#334155' ? '180deg' : userProfile.primaryColor === '#1A1A1A' ? '45deg' : '280deg'}) saturate(1.2)` }" />
                 </div>
                 
                 <div class="w-full h-full absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                 
                 <div v-if="selectedTemplate === t.id" class="absolute top-4 right-4 p-2 rounded-full shadow-lg z-20 animate-in zoom-in duration-500"
                      :style="{ backgroundColor: userProfile.primaryColor }">
                    <Check class="w-4 h-4 text-[#0A2647]" />
                 </div>
                 
                 <div class="absolute bottom-4 flex flex-col items-center z-10 px-6 text-center">
                    <span class="text-[11px] font-black text-white uppercase tracking-[0.1em] leading-tight mb-1 shadow-sm">{{ t.name }}</span>
                    <span class="text-[9px] font-black uppercase tracking-[0.3em]"
                          :style="{ color: userProfile.primaryColor }">{{ t.tag }}</span>
                 </div>
              </div>
           </div>
        </div>

        <!-- 2. HD LIVE VIEWPORT (PREMIUM DENSITY) -->
        <div class="p-3.5 bg-white/[0.03] rounded-[2rem] border border-white/10 relative z-10 flex flex-col gap-2.5 transition-all hover:bg-white/[0.05]">
           <div class="flex justify-between items-center px-1">
              <div class="flex flex-col">
                 <span class="text-[9px] font-black text-[#C1A172] uppercase tracking-widest leading-none mb-1">HD Viewport</span>
                 <span class="text-[10px] font-black text-white/40 uppercase tracking-tight">Active Rendering Engine</span>
              </div>
              <div class="flex gap-2 items-center">
                 <div class="w-2 h-2 rounded-full bg-[#73BBA3] animate-pulse shadow-[0_0_8px_#73BBA3]"></div>
                 <span class="text-[8px] font-black text-[#73BBA3] uppercase tracking-widest">Live Rendering</span>
              </div>
           </div>
           
            <div class="w-full h-[320px] bg-white rounded-[1.5rem] border border-white/10 overflow-hidden shadow-2xl relative transition-all" id="live-viewport">
               <iframe v-if="viewportHtml" 
                       :srcdoc="viewportHtml"
                       class="w-[794px] h-[1123px] border-none absolute left-1/2 top-1 origin-top"
                       style="transform: translateX(-50%) scale(0.32);"
                       title="CV Specimen Preview"></iframe>
            </div>
        </div>

        <!-- 3. STEALTH STRATEGY (KINETIC INGESTION) -->
        <div class="bg-gradient-to-br from-[#0A2647] via-[#0D1B2A] to-black rounded-[2.2rem] p-5 border border-white/10 relative overflow-hidden group/stealth shadow-3xl">
           <div class="relative z-10">
              <div class="flex justify-between items-center mb-2">
                 <div class="flex flex-col">
                    <span class="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Strategic Edge</span>
                    <h3 class="text-[14px] font-black text-white tracking-tight uppercase">AI Stealth Keywords</h3>
                 </div>
                 <div class="flex items-center gap-2">
                    <span class="text-[8px] font-black text-blue-400/50 uppercase tracking-widest">{{ masterProfile.secretKeywords?.length || 0 }} Active</span>
                    <Lock class="w-3.5 h-3.5 text-white/30" />
                 </div>
              </div>
              
              <!-- Active Keyword Chips (High-Density) -->
              <div v-if="masterProfile.secretKeywords?.length" class="flex flex-wrap gap-1.5 mb-4">
                 <div v-for="k in masterProfile.secretKeywords" :key="k" 
                      class="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 group/k cursor-pointer hover:bg-white/10 transition-all shadow-sm">
                    <span class="text-[9px] font-black text-white/70">{{ k }}</span>
                    <X @click="removeSecretKeyword(k)" class="w-2.5 h-2.5 text-white/20 hover:text-red-400 transition-colors" />
                 </div>
              </div>
              
              <div class="space-y-3">
                 <!-- Slot Ingestion -->
                 <slot name="keyword-input"></slot>
                 
                 <div class="grid grid-cols-2 gap-2">
                    <button @click="analyzeAndSuggestKeywords" :disabled="isAnalyzingKeywords" 
                            class="py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-white/60 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                       <RefreshCw v-if="isAnalyzingKeywords" class="w-3 h-3 animate-spin" />
                       <Stars v-else class="w-3 h-3 text-blue-400" />
                       {{ isAnalyzingKeywords ? 'Analyzing' : 'AI Suggester' }}
                    </button>
                    <button @click="handleDashboardAction('clear_keywords')" 
                            class="py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-white/60 uppercase tracking-widest hover:bg-white/10 transition-all">
                       Flush All
                    </button>
                 </div>
              </div>
           </div>
           
           <!-- Subtle Shading Overlay -->
           <div class="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        </div>

        <!-- 4. VISUAL BRANDING (SLIM-LINE DENSITY) -->
        <div class="bg-white/5 rounded-[1.8rem] p-4 border border-white/10 relative overflow-hidden group/branding shadow-2xl">
           <div v-if="isBrandingSyncing" class="absolute inset-0 z-20 bg-[#0A2647]/70 backdrop-blur-md flex items-center justify-center">
              <div class="w-6 h-6 rounded-full border-2 border-[#C1A172] border-t-transparent animate-spin"></div>
           </div>

           <div class="flex justify-between items-center mb-3 relative z-10">
              <div class="flex flex-col">
                 <span class="text-[8px] font-black text-[#C1A172] uppercase tracking-[0.2em] mb-0.5">Visual Identity</span>
                 <h3 class="text-[12px] font-black text-white tracking-tight uppercase leading-none">Aesthetic Presets</h3>
              </div>
              <div class="w-2.5 h-2.5 rounded-full shadow-lg" :style="{ backgroundColor: userProfile.primaryColor }"></div>
           </div>
           
           <div class="space-y-1.5 relative z-10">
              <div v-for="p in colorPresets" :key="p.name" 
                   @click="emit('selectPreset', p)"
                   class="flex items-center justify-between px-3 py-2 bg-white/5 rounded-full border transition-all cursor-pointer group/p active:scale-95 shadow-sm"
                   :class="userProfile.primaryColor === p.primary ? 'bg-white/10 border-[#C1A172]/40 shadow-black/40' : 'border-white/5 hover:border-white/20'">
                 
                 <div class="flex items-center gap-3">
                    <div class="flex -space-x-1.5">
                       <div class="w-5 h-5 rounded-full border border-[#0A2647] shadow-xl" :style="{ backgroundColor: p.primary }"></div>
                       <div class="w-5 h-5 rounded-full border border-[#0A2647] shadow-xl" :style="{ backgroundColor: p.secondary }"></div>
                    </div>
                    <span class="text-[10px] font-black text-white uppercase tracking-tight">{{ p.name }}</span>
                 </div>

                 <div v-if="p.tier > 1 && !userProfile.isSuperUser" class="opacity-30">
                    <Lock class="w-3 h-3 text-white" />
                 </div>
                 <div v-else-if="userProfile.primaryColor === p.primary" class="bg-[#C1A172] p-0.5 rounded-full animate-in zoom-in duration-300">
                    <Check class="w-2.5 h-2.5 text-[#0A2647]" />
                 </div>
              </div>
           </div>
        </div>

        <!-- Sync Button (PACKED ELITE VIEW) -->
        <div class="mt-[6px] pt-0 border-t border-white/5 pb-[2px]">
           <button @click="saveProfile" class="w-[88%] mx-auto mt-2.5 bg-gradient-to-r from-[#C1A172] to-[#FFD700] py-2.5 rounded-[1.8rem] flex items-center justify-center gap-2 shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all group relative overflow-hidden">
              <div v-if="isSavingProfile" class="w-3.5 h-3.5 rounded-full border-2 border-[#0A2647]/50 border-t-[#0A2647] animate-spin relative z-10"></div>
              <RefreshCw v-else class="w-3.5 h-3.5 text-[#0A2647]/40 group-hover:rotate-180 transition-transform duration-1000" />
              <span class="text-[11.5px] font-black text-[#0A2647] uppercase tracking-[0.2em] relative z-10 shadow-sm">{{ isSavingProfile ? 'NEURAL SYNCING...' : 'SYNC STUDIO TO MASTER' }}</span>
           </button>
        </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 20px; }

.custom-horizontal-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-horizontal-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
.custom-horizontal-scrollbar::-webkit-scrollbar-thumb { background: rgba(193, 161, 114, 0.3); border-radius: 10px; }
</style>
