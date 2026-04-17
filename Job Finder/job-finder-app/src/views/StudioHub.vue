<script setup>
import { ref, watch, computed } from 'vue'
import { 
  Sparkles, Check, Lock, X, RefreshCw, ArrowRight, Stars, Zap, DownloadCloud, ShieldCheck, 
  Globe, Languages, ChevronDown
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
  colorPresets: Array,
  coverLetterText: String,
  previewMode: String
})

const emit = defineEmits([
  'update:selectedTemplate', 'selectTemplate', 'removeSecretKeyword', 'addSecretKeyword', 'analyzeKeywords', 'selectPreset', 'saveProfile', 'handleAction', 'generateCoverLetter', 'updateCoverLetter', 'setPreviewMode', 'downloadPdf'
])

const selectTemplate = (t) => emit('selectTemplate', t)
const removeSecretKeyword = (k) => emit('removeSecretKeyword', k)
const addSecretKeyword = () => emit('addSecretKeyword')
const analyzeAndSuggestKeywords = () => emit('analyzeKeywords')
const selectPreset = (p) => emit('selectPreset', p)
const saveProfile = () => emit('saveProfile')
const handleDashboardAction = (action) => emit('handleAction', action)
const updateSelectedTemplate = (id) => emit('update:selectedTemplate', id)
const generateCoverLetter = () => emit('generateCoverLetter')

const activeTip = ref(null)
const toggleTip = (id) => {
  activeTip.value = activeTip.value === id ? null : id
}

// Local state for smooth editing (Persistence is handled on Sync)
const localLetterText = ref(props.coverLetterText || '')
watch(() => props.coverLetterText, (newVal) => {
  if (newVal !== localLetterText.value) localLetterText.value = newVal
})

const syncLetterToMaster = () => {
  emit('updateCoverLetter', localLetterText.value)
  emit('saveProfile')
}

const engineTips = {
  gallery: "Specimen Matrix: These templates are synchronized in real-time. V12.9.1 guarantees 100% data fidelity across source and public directories.",
  viewport: "Neural Rendering: Our A4 scaling engine automatically adjusts font weight and spacing (V12.9.2 Density Balancer) to ensure a professional 2-page hard limit.",
  stealth: "Stealth Mode: Injects a 1px hidden keyword line into section dividers. This ensures a 99% ATS match without altering the visual professional look.",
  broadcast: "Broadcast Stealth: Using Playwright-Automated Headless Browsers & Residential Proxies (V13.0) to simulate human application behavior on LinkedIn/Indeed.",
  branding: "Aesthetic Core: Presets are curated for industry standards (Tech/Finance/Creative). Colors adjust dynamically based on your Tier status.",
  letter: "Letter Synthesis: Generates a high-fidelity narrative using your master profile context, tailored specifically to the currently active job description."
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500 pt-4">


    <div class="mt-2.5 flex-1 overflow-y-auto space-y-4 px-4 hub-scroller custom-scrollbar">
        
        <!-- 1. TEMPLATE GALLERY (ELITE DENSITY) -->
        <div class="bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-3xl rounded-[2.2rem] p-5 border border-white/10 shadow-3xl overflow-visible group relative">
           <div class="flex justify-between items-end mb-5">
               <div class="flex flex-col">
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="text-[10px] font-black text-[#C1A172] uppercase tracking-[0.3em]">Neural Specimens</span>
                    <button @click="toggleTip('gallery')" class="p-1 rounded-full bg-white/5 hover:bg-[#C1A172]/20 transition-colors">
                      <ShieldCheck class="w-2.5 h-2.5 text-[#C1A172]" />
                    </button>
                  </div>
                  <h3 class="text-[16px] font-black text-white tracking-tight uppercase">Template Gallery</h3>
               </div>
              <div class="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 flex items-center justify-center whitespace-nowrap shadow-sm">
                 <span class="text-[9px] font-black text-white/40 uppercase tracking-widest">{{ cvTemplates.length }} Elite Styles</span>
              </div>
           </div>
           
           <div class="flex flex-nowrap gap-5 overflow-x-auto pb-10 -mx-6 px-6 snap-x snap-mandatory scroll-smooth min-h-[240px] custom-horizontal-scrollbar">
              <div v-for="t in cvTemplates" :key="t.id" 
                   @click="updateSelectedTemplate(t.id); selectTemplate(t)"
                   class="w-[160px] h-[210px] bg-gradient-to-br from-white/5 to-white/[0.02] rounded-[2.2rem] shrink-0 border-2 transition-all duration-700 cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group/thumb snap-center"
                   :class="selectedTemplate === t.id ? 'scale-[1.04]' : 'border-white/5 hover:border-white/20 hover:scale-[1.02]'"
                    :style="selectedTemplate === t.id ? { borderColor: userProfile.primaryColor, boxShadow: `0 25px 60px ${userProfile.primaryColor}40` } : {}">
                 
                 <!-- Tooltip Overlay -->
                 <Transition name="fade">
                   <div v-if="activeTip === 'gallery'" class="absolute inset-0 z-[100] bg-[#0A2647]/90 backdrop-blur-md p-6 flex flex-col justify-center text-center animate-in zoom-in-95 duration-500">
                     <p class="text-[10px] font-black text-[#C1A172] uppercase tracking-widest leading-relaxed">{{ engineTips.gallery }}</p>
                     <button @click.stop="activeTip = null" class="mt-4 text-[8px] font-black text-white/40 uppercase tracking-widest">Acknowledge</button>
                   </div>
                 </Transition>

                 <div class="absolute inset-0 w-full h-full overflow-hidden">
                    <img :src="t.image" class="w-full h-full object-top opacity-40 group-hover/thumb:opacity-90 group-hover/thumb:scale-110 transition-all duration-1000 ease-out"
                         :style="{ filter: `hue-rotate(${userProfile.primaryColor === '#0A2647' ? '0deg' : '180deg'}) saturate(1.4)` }" />
                 </div>
                 
                 <div class="w-full h-full absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                 
                 <div v-if="selectedTemplate === t.id" class="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full shadow-2xl z-20 animate-in zoom-in spin-in-90 duration-700"
                      :style="{ backgroundColor: userProfile.primaryColor }">
                    <Check class="w-3.5 h-3.5 text-white stroke-[4px]" />
                 </div>
                 
                 <div class="absolute bottom-5 flex flex-col items-center z-10 px-6 text-center">
                    <span class="text-[12px] font-black text-white uppercase tracking-[0.1em] leading-tight mb-1.5 drop-shadow-lg">{{ t.name }}</span>
                    <span class="text-[9px] font-black uppercase tracking-[0.4em] drop-shadow-md"
                          :style="{ color: userProfile.primaryColor }">{{ t.tag }}</span>
                 </div>
              </div>
           </div>
        </div>

        <!-- 1.5 STRATEGY AUDIT (NEW V11.5) -->
        <div class="bg-gradient-to-br from-white/10 to-white/[0.02] rounded-[2.2rem] p-4 border border-white/10 flex items-center justify-between shadow-2xl transition-all hover:bg-white/[0.05]">
            <div class="flex items-center gap-3">
                <div class="p-2.5 rounded-xl border transition-all duration-500" 
                     :class="userProfile.doc_status === 'Verified' ? 'bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : (userProfile.doc_status === 'Pending_Approval' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-[#C1A172]/10 border-[#C1A172]/20')">
                    <ShieldCheck v-if="userProfile.doc_status === 'Verified'" class="w-4.5 h-4.5 text-green-400" />
                    <RefreshCw v-else-if="userProfile.doc_status === 'Pending_Approval'" class="w-4.5 h-4.5 text-blue-400 animate-spin" />
                    <Lock v-else class="w-4.5 h-4.5 text-[#C1A172]" />
                </div>
                <div class="flex flex-col">
                    <span class="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-1">Neural Strategy Audit</span>
                    <span class="text-[11px] font-black text-white uppercase tracking-tight">
                        {{ userProfile.doc_status === 'Verified' ? 'Surgical Specimen Verified' : (userProfile.doc_status === 'Pending_Approval' ? 'Audit in Progress...' : 'Strategy Audit Pending') }}
                    </span>
                </div>
            </div>
            <button v-if="userProfile.doc_status === 'Draft' || !userProfile.doc_status" 
                    @click="$emit('handleAction', 'submit_for_audit')"
                    class="px-4 py-2.5 bg-[#C1A172] rounded-xl text-[9px] font-black text-[#0A2647] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#C1A172]/20">
                Verify Strategy
            </button>
            <div v-else-if="userProfile.doc_status === 'Verified'" class="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                <Check class="w-2.5 h-2.5 text-green-400 shrink-0" />
                <span class="text-[8px] font-black text-green-400 uppercase tracking-widest">Active</span>
            </div>
        </div>

        <!-- 2. HD LIVE VIEWPORT (PREMIUM DENSITY) -->
        <div class="p-4 bg-white/[0.04] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 relative z-10 flex flex-col gap-4 transition-all hover:bg-white/[0.06] shadow-2xl">
           <div class="flex flex-col gap-4 px-1">
              <div class="flex justify-between items-center">
                  <div class="flex flex-col">
                     <div class="flex items-center gap-2 mb-1.5">
                        <span class="text-[10px] font-black text-[#73BBA3] uppercase tracking-[0.3em] leading-none italic">High-Fidelity Engine</span>
                        <button @click="toggleTip('viewport')" class="p-1 rounded-full bg-white/5 hover:bg-[#73BBA3]/20 transition-colors">
                           <ShieldCheck class="w-2.5 h-2.5 text-[#73BBA3]" />
                        </button>
                     </div>
                     <span class="text-[11px] font-black text-white/50 uppercase tracking-tight">Active Neural Rendering</span>
                  </div>
                 <div class="flex gap-2.5 items-center px-3 py-1.5 bg-black/40 rounded-full border border-white/5">
                    <div class="w-2.5 h-2.5 rounded-full bg-[#73BBA3] animate-pulse shadow-[0_0_12px_#73BBA3]"></div>
                    <span class="text-[9px] font-black text-[#73BBA3] uppercase tracking-widest">Live Preview active</span>
                 </div>
              </div>

              <!-- NEURAL SEGMENT CONTROL (ULTRA-SLIM LUXURY) -->
              <div class="relative w-[200px] h-10 bg-black/70 rounded-full border border-white/10 p-1 flex items-center shadow-3xl group/toggle overflow-hidden">
                 <div class="absolute h-8 rounded-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_8px_20px_rgba(0,0,0,0.8)] flex items-center justify-center border border-white/20"
                      :style="{ 
                         left: previewMode === 'cv' ? '4px' : '100px', 
                         width: '96px',
                         background: previewMode === 'cv' ? 'linear-gradient(135deg, #C1A172 0%, #8E7345 100%)' : 'linear-gradient(135deg, #73BBA3 0%, #4A8C77 100%)'
                      }">
                    <div class="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-full"></div>
                 </div>
                 
                 <button @click="$emit('setPreviewMode', 'cv')"
                         class="relative z-10 flex-1 h-full text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500"
                         :class="previewMode === 'cv' ? 'text-[#0A2647]' : 'text-white/25 group-hover/toggle:text-white/50'">
                    CV
                 </button>
                 <button @click="$emit('setPreviewMode', 'letter')"
                         class="relative z-10 flex-1 h-full text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500"
                         :class="previewMode === 'letter' ? 'text-[#0A2647]' : 'text-white/25 group-hover/toggle:text-white/50'">
                    LETTER
                 </button>
              </div>
           </div>

             <div class="w-full h-[360px] bg-white rounded-[2rem] border-4 overflow-hidden shadow-3xl relative transition-all duration-700 ease-in-out group/vp" 
                  id="live-viewport"
                  :class="isStealthUnlocked ? 'border-blue-400/80 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-black/80'">
               <iframe v-if="viewportHtml" 
                       :srcdoc="viewportHtml"
                       class="w-[794px] h-[1123px] border-none absolute left-1/2 top-1 origin-top"
                       style="transform: translateX(-50%) scale(0.32);"
                       title="CV Specimen Preview"></iframe>
               
               <!-- Viewport HUD Overlay -->
               <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-0 group-hover/vp:opacity-100 transition-opacity duration-500 z-30">
                  <div v-if="isStealthUnlocked" class="px-4 py-1.5 bg-blue-500/10 border border-blue-400/30 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-pulse">
                     <span class="text-[8px] font-black text-blue-400 uppercase tracking-widest">AI Stealth Divider Active</span>
                  </div>
                  <div class="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 shadow-2xl">
                     <span class="text-[8px] font-black text-white/50 uppercase tracking-[0.3em] pr-2 border-r border-white/10">A4 Specimen</span>
                     <button @click="$emit('downloadPdf')" class="flex items-center gap-1.5 group/dl transition-all hover:scale-105">
                        <DownloadCloud class="w-3 h-3 text-[#C1A172] group-hover/dl:animate-bounce" />
                        <span class="text-[8px] font-black text-[#C1A172] uppercase tracking-[0.1em]">Download HD PDF</span>
                     </button>
                  </div>
               </div>
            </div>
        </div>

        <!-- 3. STEALTH STRATEGY (KINETIC INGESTION) -->
        <div class="bg-gradient-to-br from-[#0A2647] via-[#0D1B2A] to-black rounded-[2.2rem] p-5 border border-white/10 relative overflow-hidden group/stealth shadow-3xl">
           <div class="relative z-10">
              <div class="flex justify-between items-center mb-2">
                  <div class="flex flex-col">
                     <div class="flex items-center gap-2 mb-1">
                        <span class="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">Strategic Edge</span>
                        <button @click="toggleTip('stealth')" class="p-1 rounded-full bg-white/5 hover:bg-blue-400/20 transition-colors">
                           <ShieldCheck class="w-2.5 h-2.5 text-blue-400" />
                        </button>
                     </div>
                     <h3 class="text-[14px] font-black text-white tracking-tight uppercase">AI Stealth Keywords</h3>
                  </div>
                 <div class="flex items-center gap-2">
                    <span class="text-[8px] font-black text-blue-400/80 uppercase tracking-widest">{{ masterProfile.secretKeywords?.length || 0 }} Active</span>
                    <Lock class="w-3.5 h-3.5 text-white/50" />
                 </div>
              </div>
              
              <!-- Active Keyword Chips (High-Density) -->
              <div v-if="masterProfile.secretKeywords?.length" class="flex flex-wrap gap-1.5 mb-4">
                 <div v-for="k in masterProfile.secretKeywords" :key="k" 
                      class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-xl flex items-center gap-2 group/k cursor-pointer hover:bg-white/20 transition-all shadow-sm">
                    <span class="text-[9px] font-black text-white/90">{{ k }}</span>
                    <X @click="removeSecretKeyword(k)" class="w-2.5 h-2.5 text-white/40 hover:text-red-400 transition-colors" />
                 </div>
              </div>
              
              <div class="space-y-3">
                 <!-- Slot Ingestion -->
                 <slot name="keyword-input"></slot>
                 
                 <div class="grid grid-cols-2 gap-2">
                    <button @click="analyzeAndSuggestKeywords" :disabled="isAnalyzingKeywords" 
                            class="py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9.5px] font-black text-white/60 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                       <RefreshCw v-if="isAnalyzingKeywords" class="w-2.5 h-2.5 animate-spin" />
                       <Stars v-else class="w-2.5 h-2.5 text-blue-400" />
                       {{ isAnalyzingKeywords ? 'Sensing...' : 'AI Suggester' }}
                    </button>
                    <button @click="handleDashboardAction('clear_keywords')" 
                            class="py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9.5px] font-black text-white/60 uppercase tracking-widest hover:bg-white/10 transition-all">
                       Flush All
                    </button>
                 </div>
              </div>
           </div>
           
           <!-- Subtle Shading Overlay -->
           <div class="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

           <!-- Interactivity Overlay -->
           <Transition name="fade">
             <div v-if="activeTip === 'stealth'" class="absolute inset-0 z-[100] bg-[#0A2647]/95 backdrop-blur-xl p-8 flex flex-col justify-center text-center">
                <p class="text-[11px] font-black text-blue-300 uppercase tracking-widest leading-relaxed">{{ engineTips.stealth }}</p>
                <button @click="activeTip = null" class="mt-6 text-[8px] font-black text-white/30 uppercase tracking-widest">Resume Strategic Tuning</button>
             </div>
           </Transition>
        </div>

        <!-- 3.5 BROADCAST ENGINE STATUS (NEW V13.0) -->
        <div class="bg-gradient-to-br from-[#1E3A8A]/20 to-black rounded-[2.2rem] p-5 border border-blue-500/10 relative overflow-hidden group shadow-2xl">
            <div class="flex justify-between items-center mb-4">
               <div class="flex flex-col">
                  <span class="text-[8px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Broadcast Engine V13.0</span>
                  <h3 class="text-[12px] font-black text-white uppercase tracking-tight">Automated Outreach</h3>
               </div>
               <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <span class="text-[8px] font-black text-green-400 uppercase tracking-widest">Proxy Active</span>
               </div>
            </div>
            
            <div class="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
                <div class="p-3 bg-blue-500/10 rounded-xl">
                   <Zap class="w-5 h-5 text-blue-400" />
                </div>
                <div class="flex flex-col gap-0.5">
                   <div class="flex items-center gap-2">
                      <span class="text-[10px] font-black text-white uppercase">Stealth Proxy Layer</span>
                      <button @click="toggleTip('broadcast')" class="p-1 rounded-full bg-white/5 hover:bg-blue-400/20">
                         <ShieldCheck class="w-2.5 h-2.5 text-blue-400" />
                      </button>
                   </div>
                   <span class="text-[8px] font-black text-white/30 uppercase tracking-widest">Dynamic IP Rotation Enabled</span>
                </div>
            </div>
               
            <!-- TACTICAL INITIATION BUTTON -->
            <button @click="$emit('handleAction', 'initiate_broadcast')" 
                    class="mt-4 w-full py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-2xl text-[10px] font-black text-blue-300 uppercase tracking-widest transition-all shadow-[0_5px_20px_rgba(59,130,246,0.15)] hover:shadow-[0_5px_25px_rgba(59,130,246,0.25)] active:scale-95">
                Initiate Neural Broadcast
            </button>

            <!-- Interactivity Overlay -->
            <Transition name="fade">
              <div v-if="activeTip === 'broadcast'" class="absolute inset-0 z-[100] bg-[#0A2647]/95 backdrop-blur-xl p-8 flex flex-col justify-center text-center">
                 <p class="text-[11px] font-black text-blue-300 uppercase tracking-widest leading-relaxed">{{ engineTips.broadcast }}</p>
                 <button @click="activeTip = null" class="mt-6 text-[8px] font-black text-white/30 uppercase tracking-widest">Secure Handshake Complete</button>
              </div>
            </Transition>
        </div>

        <!-- 3.8 GLOBAL STRATEGY CALIBRATION (NEW V13.1) -->
        <div class="bg-gradient-to-br from-[#C1A172]/10 to-transparent rounded-[2.2rem] p-5 border border-[#C1A172]/20 relative overflow-hidden group shadow-2xl">
            <div class="flex justify-between items-center mb-4">
               <div class="flex flex-col">
                  <span class="text-[8px] font-black text-[#C1A172] uppercase tracking-[0.3em] mb-1">Global Strategy Hub</span>
                  <h3 class="text-[12px] font-black text-white uppercase tracking-tight">Locale Calibration</h3>
               </div>
               <div class="p-2 bg-[#C1A172]/10 rounded-lg">
                  <Globe class="w-4 h-4 text-[#C1A172]" />
               </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
               <!-- Target Region -->
               <div class="space-y-2">
                  <label class="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">Target Region</label>
                  <div class="relative group">
                     <select v-model="masterProfile.targetRegion" 
                             class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-[10px] text-white/90 font-bold focus:outline-none focus:ring-1 focus:ring-[#C1A172] appearance-none cursor-pointer">
                        <option v-for="c in ['Sweden', 'Germany', 'Norway', 'Finland', 'Denmark', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Japan', 'France', 'Netherlands', 'Singapore', 'Switzerland', 'Ireland', 'Italy', 'Spain']" 
                                :key="c" :value="c" class="bg-[#0A2647]">{{ c }}</option>
                     </select>
                     <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none group-hover:text-[#C1A172] transition-colors" />
                  </div>
               </div>

               <!-- CV Locale -->
               <div class="space-y-2">
                  <label class="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">CV Locale</label>
                  <div class="relative group">
                     <select v-model="masterProfile.cvLanguage" 
                             class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-[10px] text-white/90 font-bold focus:outline-none focus:ring-1 focus:ring-[#C1A172] appearance-none cursor-pointer">
                        <option value="EN" class="bg-[#0A2647]">English (Global)</option>
                        <option value="DE" class="bg-[#0A2647]">Deutsch (DACH)</option>
                        <option value="SW" class="bg-[#0A2647]">Svenska (Nordics)</option>
                        <option value="FR" class="bg-[#0A2647]">Français</option>
                        <option value="ES" class="bg-[#0A2647]">Español</option>
                        <option value="IT" class="bg-[#0A2647]">Italiano</option>
                        <option value="JP" class="bg-[#0A2647]">日本語 (Japan)</option>
                        <option value="CN" class="bg-[#0A2647]">中文 (China)</option>
                        <option value="KR" class="bg-[#0A2647]">한국어 (Korea)</option>
                        <option value="AR" class="bg-[#0A2647]">العربية (MENA)</option>
                     </select>
                     <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none group-hover:text-[#C1A172] transition-colors" />
                  </div>
               </div>
            </div>
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

        <!-- 5. COVER LETTER ENGINE (ELITE COMPACT HUB) -->
        <div class="bg-gradient-to-br from-[#1E3A8A]/15 to-black/40 rounded-[2rem] p-4 border border-white/5 relative overflow-hidden group shadow-2xl transition-all hover:bg-white/[0.04]">
           <div class="flex justify-between items-center mb-2.5">
               <div class="flex flex-col">
                  <span class="text-[8px] font-black text-[#73BBA3] uppercase tracking-[0.2em] mb-0.5">Career Documents</span>
                  <h3 class="text-[12px] font-black text-white tracking-tight uppercase">Letter Studio</h3>
               </div>
               <div class="flex items-center gap-2">
                  <button @click="generateCoverLetter" 
                          class="p-2 bg-[#73BBA3]/10 hover:bg-[#73BBA3]/20 rounded-xl transition-all active:scale-95 group/gen border border-[#73BBA3]/20 flex items-center gap-1.5 shadow-[0_0_15px_rgba(115,187,163,0.1)]">
                     <Sparkles class="w-3.5 h-3.5 text-[#73BBA3] group-hover/gen:animate-pulse" />
                     <span class="text-[8px] font-black text-white/80 uppercase">AI RE-GEN</span>
                  </button>
               </div>
            </div>
           
           <textarea 
              v-model="localLetterText" 
              placeholder="Click AI RE-GEN to synthesize your strategy..."
              class="w-full h-32 bg-black/20 border border-white/5 rounded-2xl p-3.5 text-[11px] text-white/90 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#73BBA3]/40 transition-all no-scrollbar resize-y font-jakarta italic leading-relaxed"
           ></textarea>
           
           <div class="mt-3 flex flex-col gap-2.5">
               <div class="flex items-center justify-between px-1">
                  <span class="text-[7.5px] font-black text-white/30 uppercase tracking-[0.2em] italic">Neural Engine Sync Active</span>
                  <div class="flex items-center gap-1.5">
                     <div class="w-1 h-1 rounded-full bg-[#73BBA3]/40 animate-pulse"></div>
                     <Zap class="w-3 h-3 text-[#73BBA3]/60" />
                  </div>
               </div>
               
               <button @click="syncLetterToMaster" 
                       class="w-full py-3 bg-[#73BBA3] hover:bg-[#5DA08A] rounded-[1.4rem] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg group/confirm border border-white/10">
                  <Check class="w-3.5 h-3.5 text-[#0A2647]" />
                  <span class="text-[10px] font-black text-[#0A2647] uppercase tracking-widest">Confirm & Sync</span>
               </button>
            </div>
            
            <!-- Neural Edge Glow -->
            <div class="absolute -left-10 -bottom-10 w-24 h-24 bg-[#73BBA3]/5 rounded-full blur-[40px] pointer-events-none"></div>
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
