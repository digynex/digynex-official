<script setup>
import { 
  X, Briefcase, MapPin, Calendar, Zap, ShieldCheck, 
  ArrowUpRight, Share2, Bookmark, CheckCircle2, Globe, Sparkles
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  job: {
    type: Object,
    default: () => ({
      c: 'TechCorp',
      r: 'Senior AI Scientist',
      l: 'Stockholm, Sweden',
      m: 94,
      d: 'Post 2 days ago',
      color: '#0A2647',
      desc: 'We are seeking an elite AI Scientist to lead our next-gen discovery engine. You will work on massive-scale LLM alignment and agentic workflows.'
    })
  }
})

const emit = defineEmits(['close', 'apply'])
</script>

<template>
  <Transition name="slide-up">
    <div v-if="isOpen" class="fixed inset-0 z-[6000] flex flex-col justify-end">
      <!-- Backdrop -->
      <div @click="emit('close')" class="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      
      <!-- Content Card -->
      <div class="relative w-full max-w-[360px] mx-auto bg-[#0A2647] rounded-t-[3rem] border-t border-white/20 shadow-3xl overflow-hidden flex flex-col h-[92vh] animate-in slide-in-from-bottom duration-500">
        
        <!-- Header Image/Graphic Area -->
        <div class="h-40 bg-gradient-to-br from-[#144272] to-[#0A2647] relative flex items-center justify-center overflow-hidden">
           <div class="absolute inset-0 opacity-20">
              <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
           </div>
           <!-- Logo Unit -->
           <div class="w-20 h-20 rounded-[1.8rem] shadow-2xl flex items-center justify-center border-2 border-white/20 relative z-10 scale-110" :style="{ backgroundColor: job.color || '#0A2647' }">
              <component :is="job.icon || Briefcase" class="w-10 h-10 text-white" />
           </div>
           <!-- Close Button -->
           <button @click="emit('close')" class="absolute top-6 right-6 p-2 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 transition-all">
              <X class="w-5 h-5" />
           </button>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto px-6 py-8 space-y-8 custom-scrollbar pb-32">
           <!-- Title Unit -->
           <div class="space-y-2">
              <div class="flex items-center gap-2 overflow-hidden">
                 <span class="text-[10px] font-black text-[#C1A172] uppercase tracking-[0.3em] truncate">{{ job.c }}</span>
                 <div class="h-[1px] flex-1 bg-white/5"></div>
              </div>
              <h2 class="text-2xl font-black text-white leading-tight font-playfair tracking-tight">{{ job.r }}</h2>
              <div class="flex items-center gap-4 text-white/40 pt-1">
                 <div class="flex items-center gap-1.5">
                    <MapPin class="w-3.5 h-3.5" />
                    <span class="text-[11px] font-bold">{{ job.l }}</span>
                 </div>
                 <div class="flex items-center gap-1.5">
                    <Calendar class="w-3.5 h-3.5" />
                    <span class="text-[11px] font-bold">{{ job.d }}</span>
                 </div>
              </div>
           </div>

           <!-- AI Matching Score Card -->
           <div class="bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] p-5 border border-white/10 relative overflow-hidden group">
              <div class="absolute -right-4 -top-4 w-24 h-24 bg-[#C1A172]/10 rounded-full blur-3xl"></div>
              <div class="flex justify-between items-center relative z-10">
                 <div class="space-y-1">
                    <div class="flex items-center gap-2">
                       <Sparkles class="w-4 h-4 text-[#C1A172]" />
                       <span class="text-[10px] font-black text-white uppercase tracking-widest font-jakarta">AI Match Analysis</span>
                    </div>
                    <p class="text-[11px] text-white/50 leading-relaxed max-w-[200px] font-medium">Your skills align perfectly with the core architecture requirements.</p>
                 </div>
                 <div class="flex flex-col items-end">
                    <span class="text-3xl font-black text-[#C1A172] tracking-tighter">{{ job.m }}%</span>
                    <span class="text-[8px] font-black text-white/30 uppercase tracking-widest">Confidence</span>
                 </div>
              </div>
           </div>

           <!-- Description -->
           <div class="space-y-4">
              <h3 class="text-[12px] font-black text-white uppercase tracking-[0.2em] border-l-2 border-[#C1A172] pl-3 leading-none">Vision & Impact</h3>
              <p class="text-[13px] text-white/60 leading-relaxed font-jakarta">
                 {{ job.desc || 'Join our elite team to build the future of localized intelligence. You will be responsible for designing high-performance systems that bridge the gap between human intuition and machine efficiency.' }}
              </p>
           </div>

           <!-- Requirements -->
           <div class="space-y-4">
              <h3 class="text-[12px] font-black text-white uppercase tracking-[0.2em] border-l-2 border-[#C1A172] pl-3 leading-none">Elite Sync Requirements</h3>
              <div class="space-y-3">
                 <div v-for="req in ['5+ years in High-Scale Systems', 'Expertise in Neural Architecture', 'Proven track record of Strategic Impact']" :key="req" class="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <CheckCircle2 class="w-4 h-4 text-[#73BBA3] mt-0.5" />
                    <span class="text-[12px] text-white/80 font-semibold">{{ req }}</span>
                 </div>
              </div>
           </div>
        </div>

        <!-- Fixed Footer Actions -->
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A2647] via-[#0A2647] to-transparent pt-12 pb-8 flex items-center gap-4 z-20">
           <button class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-[#C1A172] transition-all active:scale-90">
              <Bookmark class="w-6 h-6" />
           </button>
           <button @click="emit('apply', job)" class="flex-1 bg-[#C1A172] h-14 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-[#0A2647] font-black uppercase tracking-widest text-[12px] group">
              <span>Apply via DigyNex Sync</span>
              <ArrowUpRight class="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.font-playfair { font-family: 'Playfair Display', serif; }
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(100px); }

.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>
