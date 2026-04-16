<script setup>
import { 
  Sparkles, ArrowRight, MoreHorizontal, UserPlus, Briefcase, LayoutDashboard, Zap, Cloud
} from 'lucide-vue-next'
import { computed } from 'vue'
import SkillGapChart from '../components/SkillGapChart.vue'

const props = defineProps({
  t: Function,
  locale: String,
  isAuthenticated: Boolean,
  displayName: String,
  userProfile: Object,
  masterProfile: Object,
  allJobs: Array,
  selectedPipelineStep: String,
  uploadedFileName: String,
  isRecalibrating: Boolean
})

const emit = defineEmits([
  'setTab', 'openAuth', 'logout', 'openJobDetail', 'openActionSheet', 'setPipelineStep', 'handleAction'
])

const getStepCount = (step) => {
    return props.allJobs.filter(j => j.step === step).length
}

const filteredJobs = computed(() => {
    return props.allJobs.filter(j => j.step === props.selectedPipelineStep)
})

const openJobDetail = (job) => emit('openJobDetail', job)
const openActionSheet = (title, type) => emit('openActionSheet', title, type)
const handleDashboardAction = (action) => emit('handleAction', action)
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Scrolling Content Wrapper -->
    <div class="flex-1 overflow-y-auto px-4 hub-scroller custom-scrollbar">
       
       <!-- Identity Hub -->
        <div class="flex justify-between items-center mt-[5px] w-full px-1 font-jakarta transition-all duration-1000" :class="isRecalibrating ? 'scale-[1.02] blur-[1px]' : ''">
          <div class="flex-1 min-w-0">
             <h1 class="text-[18px] font-bold text-white tracking-tight leading-none pt-2 font-jakarta truncate">
                <span :class="isRecalibrating ? 'animate-pulse text-[#C1A172]' : 'neural-glow'">
                  {{ !isAuthenticated ? t('header.welcome') : (userProfile?.isReturning ? `Welcome back, ${displayName}` : `Welcome, ${displayName}`) }}
                </span>
             </h1>
          </div>
          <!-- Avatar Unit -->
         <div class="w-11 h-11 rounded-full border-2 border-white/20 shadow-2xl overflow-hidden ring-1 ring-white/5 transition-all">
            <img src="https://i.pravatar.cc/150?u=amila" alt="P" class="w-full h-full object-cover" />
         </div>
       </div>

       <p class="text-[14px] font-medium text-white/80 tracking-tight mt-[3px] px-1 italic opacity-90 font-jakarta">{{ t('header.progress') }}</p>

       <!-- Stats Linear Grid -->
       <div class="mt-2 grid grid-cols-[1fr_.5px_1fr_.5px_1fr] items-end px-1 gap-1 pb-1">
         <div class="flex flex-col items-center">
            <p class="text-[8.5px] font-bold text-white/40 mb-2 leading-none uppercase tracking-[0.05em]">{{ t('stats.activeApps') }}</p>
            <p class="text-[22px] font-black text-white leading-none tracking-tighter">14</p>
         </div>
         <div class="h-6 w-[0.5px] bg-white/10 mb-0.5"></div>
         <div class="flex flex-col items-center">
            <p class="text-[8.5px] font-bold text-white/40 mb-2 leading-none uppercase tracking-[0.05em]">{{ t('stats.aiMatches') }}</p>
            <p class="text-[22px] font-black text-white leading-none tracking-tighter shadow-2xl">08</p>
         </div>
         <div class="h-6 w-[0.5px] bg-white/10 mb-0.5"></div>
         <div class="flex flex-col items-center">
            <p class="text-[8.5px] font-black text-white/40 mb-2 leading-none uppercase tracking-[0.05em] text-center font-jakarta">{{ t('stats.skillScore') }}</p>
            <p class="text-[22px] font-black text-white leading-none tracking-tighter text-center font-jakarta">88%</p>
         </div>
       </div>

       <!-- MAIN CONTENT CARDS -->
       <div class="mt-1.5 space-y-1.5">
         
         <!-- QUICK ACCESS CV CARD -->
         <div @click="emit('setTab', 'studio')" class="bg-gradient-to-r from-[#0A2647] to-[#144272] rounded-[1.8rem] p-4 shadow-3xl border border-white/10 relative overflow-hidden group cursor-pointer hover:scale-[1.01] transition-all">
            <div class="flex items-center justify-between relative z-10">
               <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center p-2.5">
                     <Sparkles class="w-full h-full text-[#C1A172] animate-pulse" />
                  </div>
                  <div class="flex flex-col">
                     <span class="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Live Sync: Active</span>
                     <h3 class="text-[13px] font-black text-white tracking-tight uppercase">{{ uploadedFileName.split('_')[0] }} CV MASTER</h3>
                  </div>
               </div>
               <div class="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-all">
                  <ArrowRight class="w-3.5 h-3.5 text-white" />
               </div>
            </div>
            <div class="mt-3 w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
               <div class="h-full bg-gradient-to-r from-[#2C74B3] to-[#C1A172] w-[94%] transition-all duration-1000"></div>
            </div>
            <div class="flex justify-between mt-1 px-0.5">
               <span class="text-[7px] font-black text-white/20 uppercase tracking-widest">ATS Compatibility Score</span>
               <span class="text-[7px] font-black text-[#C1A172] uppercase tracking-widest">94% Neural Match</span>
            </div>
            <Sparkles class="absolute -right-6 -bottom-6 w-20 h-20 text-white/5 rotate-12" />
         </div>

         <!-- APPLICATION TRACKING CARD -->
         <div class="bg-gradient-to-br from-[#BDDAFA]/30 via-[#F8FAFC] to-white rounded-[1.8rem] p-4 pt-2 pb-1.5 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.6)] border border-white relative overflow-hidden ring-1 ring-black/[0.03] group font-jakarta">
            <div class="flex justify-between items-center mb-0 px-1 font-jakarta">
               <span class="text-[9.5px] font-black text-[#0A2647]/55 uppercase tracking-[0.2em] leading-none font-jakarta">{{ t('sections.tracking') }}</span>
               <button @click.stop="openActionSheet('Tracking Actions', 'tracking')" class="relative z-50 flex items-center justify-center cursor-pointer opacity-30 hover:opacity-100 hover:bg-black/5 transition-all font-jakarta p-2 -mr-2 rounded-full border border-transparent hover:border-black/5 active:scale-90">
                  <MoreHorizontal class="w-[18px] h-[18px] text-[#0A2647]" />
               </button>
            </div>

            <div class="flex items-center justify-center gap-1.5 mb-1.5 px-0.5 relative font-jakarta">
               <template v-for="(v, l, i) in {applied: 'applied', review: 'review', interview: 'interview', offer: 'offer'}" :key="l">
                  <div @click="emit('setPipelineStep', v)"
                       :class="selectedPipelineStep === v 
                       ? 'bg-gradient-to-b from-[#60A5FA]/90 via-[#0A2647] to-[#60A5FA]/90 text-white shadow-[0_12px_24px_rgba(10,38,71,0.5)] ring-1 ring-white/30 scale-100' 
                       : 'bg-[#FDFDFD] border border-black/[0.04] shadow-[0_6px_14px_rgba(0,0,0,0.06)] text-[#0A2647]'"
                       class="w-[60px] h-[46px] rounded-[0.8rem] flex flex-col items-center justify-center transition-all cursor-pointer relative z-10 active:scale-95 flex-none font-jakarta">
                      <span class="text-[6.8px] font-bold uppercase mb-0.5 tracking-tighter leading-none" :class="selectedPipelineStep === v ? 'opacity-80' : 'opacity-35'">{{ t('pipeline.' + l) }}</span>
                      <span class="text-[17px] font-black leading-none font-jakarta">{{ getStepCount(v) }}</span>
                  </div>
                  <div v-if="i < 3" class="flex items-center justify-center font-jakarta px-0">
                     <ArrowRight class="w-1.5 h-1.5 text-[#2C74B3] opacity-25" />
                  </div>
               </template>
            </div>

            <div class="grid grid-cols-[1.5fr_1.2fr_1fr_0.8fr] px-0.5 mb-1 items-center border-b border-black/[0.04] pb-1 font-jakarta">
               <span class="text-[7.8px] font-black text-black/25 uppercase leading-none font-jakarta">{{ t('table.company') }}</span>
               <span class="text-[7.8px] font-black text-black/25 uppercase leading-none font-jakarta">{{ t('table.role') }}</span>
               <span class="text-[7.8px] font-black text-black/25 uppercase leading-none text-center font-jakarta">{{ t('table.status') }}</span>
               <span class="text-[7.8px] font-black text-black/25 uppercase leading-none text-right font-jakarta">{{ t('table.date') }}</span>
            </div>

            <div class="space-y-1 pt-0.5 pb-1 px-0.5 font-jakarta min-h-[80px]">
               <div v-for="(job, i) in filteredJobs" :key="job.c + job.r + i" 
                    @click="openJobDetail(job)"
                    class="grid grid-cols-[1.5fr_1.2fr_1fr_0.8fr] items-center bg-transparent group cursor-pointer transition-all active:scale-98 py-0.5">
                 <div class="flex items-center gap-1">
                    <div class="w-6.5 h-6.5 bg-[#0A2647] rounded-xl flex items-center justify-center p-1.5 shadow-lg border border-white/5 ring-1 ring-white/10 group-hover:scale-110 transition-all font-jakarta" :class="i === 1 ? 'bg-[#73BBA3]' : i === 2 ? 'bg-[#6366F1]/60' : 'bg-[#0A2647]'"> 
                      <component :is="job.icon" class="w-full h-full text-white opacity-95 shadow-2xl" /> 
                    </div>
                    <div class="flex flex-col space-y-0 min-w-0 font-jakarta">
                       <span class="text-[9.5px] font-black text-[#0A2647] tracking-tighter leading-none">{{job.c}}</span>
                       <span class="text-[6.5px] font-bold text-black/25 leading-none uppercase tracking-widest truncate">{{ t('table.company') }}</span>
                    </div>
                 </div>
                 <span class="text-[9px] font-bold text-black/60 truncate leading-none pl-1 transition-all font-jakarta">{{job.r}}</span>
                 <div class="px-2">
                     <div class="h-1.2 w-full bg-black/[0.08] rounded-full overflow-hidden shadow-inner ring-1 ring-black/[0.01]">
                        <div class="h-full bg-gradient-to-r from-[#2C74B3] to-[#4F8AFF] opacity-80" :style="{width: job.s}"></div>
                     </div>
                 </div>
                 <span class="text-[8px] font-black text-black/25 text-right leading-none">{{job.d}}</span>
               </div>
            </div>

            <!-- DETAILED MANAGEMENT TRIGGER (UI UPGRADE) -->
            <div class="mt-2 border-t border-black/[0.05] pt-2 px-0.5">
               <button @click="emit('setTab', 'applications')" 
                       class="w-full py-3 bg-gradient-to-r from-[#F8FAFC] to-white border border-black/[0.08] rounded-2xl flex items-center justify-center gap-3 hover:shadow-lg hover:scale-[1.01] active:scale-98 transition-all group/det ring-1 ring-black/[0.02]">
                  <span class="text-[10px] font-black text-[#0A2647]/60 group-hover/det:text-[#0A2647] uppercase tracking-[0.2em] transition-colors leading-none">Detailed Submissions Management</span>
                  <ArrowRight class="w-3.5 h-3.5 text-[#0A2647]/40 group-hover/det:translate-x-1 transition-transform" />
               </button>
            </div>
         </div>

         <!-- AI Analytics Dashboard -->
         <div class="bg-gradient-to-br from-[#BDDAFA]/30 via-[#F8FAFC] to-white rounded-[1.8rem] px-4 pt-1 pb-2.5 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.6)] border border-white relative overflow-hidden ring-1 ring-black/[0.03] group flex flex-col font-jakarta">
            <div class="flex justify-between items-center mb-[1px] px-1 font-jakarta">
               <span class="text-[9.5px] font-black text-[#0A2647]/55 uppercase tracking-[0.2em] leading-none font-jakarta">{{ t('sections.analytics') }}</span>
               <button @click.stop="openActionSheet('Analytics Options', 'analytics')" class="relative z-50 flex items-center justify-center cursor-pointer opacity-30 hover:opacity-100 hover:bg-black/5 transition-all font-jakarta p-2 -mr-2 rounded-full border border-transparent hover:border-black/5 active:scale-90">
                  <MoreHorizontal class="w-[18px] h-[18px] text-[#0A2647]" />
               </button>
            </div>

            <div class="grid grid-cols-2 gap-4 px-1 mt-0.5">
               <div class="flex flex-col">
                  <p class="text-[8px] font-black text-black/25 uppercase tracking-widest leading-none font-jakarta">{{ t('analytics.topMatches') }}</p>
                  <div class="space-y-2 pt-1 font-jakarta">
                     <div v-for="(m, i) in [{n: 'Senior Data Scientist', p: 94, c: 'TechCorp'}, {n: 'Product Manager', p: 91, c: 'Innovate'}, {n: 'Senior Data Scientist', p: 83, c: 'TechCorp'}]" :key="i" class="space-y-1">
                        <div class="flex flex-col">
                           <span class="text-[9px] font-black text-[#0A2647] tracking-tight leading-none font-jakarta">{{m.n}}</span>
                           <div class="flex justify-between items-center mt-0.5">
                              <span class="text-[6.8px] font-bold text-black/30 uppercase tracking-tighter">{{m.c}}</span>
                              <span class="text-[11px] font-black text-[#2C74B3] tracking-tighter leading-none">{{m.p}}%</span>
                           </div>
                        </div>
                        <div class="h-1 w-full bg-black/[0.06] rounded-full overflow-hidden shadow-inner">
                           <div class="h-full bg-gradient-to-r from-[#2C74B3] to-[#73BBA3] opacity-80" :style="{width: m.p + '%'}"></div>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="flex flex-col">
                  <p class="text-[8px] font-black text-black/25 uppercase tracking-widest leading-none text-center font-jakarta">{{ t('analytics.skillGap') }}</p>
                  <div class="flex flex-col items-center justify-center relative bg-white/40 rounded-[1.6rem] border border-black/[0.03] p-1 shadow-inner h-[105px] mt-1.5 overflow-hidden">
                     <div class="w-full aspect-square scale-[1.1]">
                        <SkillGapChart />
                     </div>
                  </div>
               </div>
            </div>

            <div class="mt-2.5 px-1 relative z-20">
               <button @click.stop="handleDashboardAction('skills')" 
                       class="w-full bg-[#0A2647] text-white py-2 rounded-xl text-[9.5px] font-black uppercase tracking-[0.15em] shadow-[0_15px_30px_rgba(10,38,71,0.25)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/5 ring-1 ring-white/10 group-hover:ring-[#C1A172]/30 font-jakarta">
                  <UserPlus class="w-3 h-3 text-[#C1A172]" />
                  {{ t('analytics.updateProfile') || 'Recalibrate Skill Profile' }}
               </button>
            </div>
         </div>
       </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }

.neural-glow {
  text-shadow: 0 0 10px rgba(193, 161, 114, 0.4);
  animation: neural-pulse 4s ease-in-out infinite;
}

@keyframes neural-pulse {
  0%, 100% { 
    text-shadow: 0 0 15px rgba(193, 161, 114, 0.5); 
    filter: drop-shadow(0 0 2px rgba(193, 161, 114, 0.3));
  }
  50% { 
    text-shadow: 0 0 25px rgba(193, 161, 114, 0.8); 
    filter: drop-shadow(0 0 8px rgba(193, 161, 114, 0.6));
  }
}
</style>
