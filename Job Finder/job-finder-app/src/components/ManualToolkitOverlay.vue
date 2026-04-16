<script setup>
import { 
  X, Mail, FileText, Download, Copy, ExternalLink, 
  CheckCircle2, Sparkles, Zap, ShieldCheck, ArrowRight
} from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  job: Object,
  synthesis: Object,
  userProfile: Object
})

const emit = defineEmits(['close', 'download-pdf'])

const copiedField = ref(null)

const copyToClipboard = (text, field) => {
  navigator.clipboard.writeText(text)
  copiedField.value = field
  setTimeout(() => { copiedField.value = null }, 2000)
}

const handlePortalOpen = () => {
  if (props.job?.url) {
    window.open(props.job.url, '_blank')
  } else {
    // Fallback search
    const query = encodeURIComponent(`${props.job.r} at ${props.job.c} careers`)
    window.open(`https://www.google.com/search?q=${query}`, '_blank')
  }
}
</script>

<template>
  <Transition name="fade-blur">
    <div v-if="isOpen" class="fixed inset-0 z-[7000] flex items-center justify-center p-4 sm:p-0">
      <!-- Backdrop -->
      <div @click="emit('close')" class="absolute inset-0 bg-[#0A2647]/95 backdrop-blur-2xl"></div>
      
      <!-- Toolkit Hub -->
      <div class="relative w-full max-w-[400px] bg-[#051124] border border-white/10 rounded-[3rem] shadow-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 max-h-[90vh]">
        
        <!-- Header: Identity Sync -->
        <div class="p-6 bg-gradient-to-br from-white/5 to-transparent border-b border-white/5 relative overflow-hidden">
           <div class="absolute -right-10 -top-10 w-32 h-32 bg-[#C1A172]/10 rounded-full blur-3xl"></div>
           
           <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                 <div class="bg-[#C1A172]/20 p-2 rounded-xl">
                    <Zap class="w-5 h-5 text-[#C1A172]" />
                 </div>
                 <div class="flex flex-col">
                    <span class="text-[10px] font-black text-[#C1A172] uppercase tracking-[0.2em]">Manual Assist Active</span>
                    <h3 class="text-xs font-black text-white/90 uppercase tracking-widest">Neural Toolkit Sync</h3>
                 </div>
              </div>
              <button @click="emit('close')" class="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/40 transition-all">
                 <X class="w-5 h-5" />
              </button>
           </div>

           <div class="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group">
              <div class="flex items-center gap-3">
                 <div class="w-8 h-8 rounded-lg bg-[#C1A172] flex items-center justify-center shadow-lg">
                    <Mail class="w-4 h-4 text-[#0A2647]" />
                 </div>
                 <div class="flex flex-col">
                    <span class="text-[8px] font-black text-white/30 uppercase tracking-widest">Verified Identity</span>
                    <span class="text-[12px] font-bold text-white tracking-tight">{{ userProfile.applicationEmail || userProfile.email }}</span>
                 </div>
              </div>
              <button @click="copyToClipboard(userProfile.applicationEmail || userProfile.email, 'email')" 
                      class="p-2 rounded-lg bg-white/5 hover:bg-[#C1A172] hover:text-[#0A2647] text-white/40 transition-all relative overflow-hidden">
                 <Copy v-if="copiedField !== 'email'" class="w-4 h-4" />
                 <CheckCircle2 v-else class="w-4 h-4 text-emerald-400 group-hover:text-white" />
              </button>
           </div>
        </div>

        <!-- Toolkit Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
           <!-- Step 1: Specimen Download -->
           <div class="space-y-3">
              <h4 class="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                 <span class="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-white">1</span>
                 Download Tailored Specimens
              </h4>
              <div class="grid grid-cols-2 gap-3">
                 <button @click="emit('download-pdf', job)" class="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group active:scale-95">
                    <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-2 group-hover:bg-red-500/20 transition-colors">
                       <FileText class="w-5 h-5 text-red-400" />
                    </div>
                    <span class="text-[10px] font-black text-white uppercase tracking-widest">Tailored CV</span>
                    <span class="text-[8px] font-bold text-white/30 uppercase mt-1">PDF Specimen</span>
                 </button>
                 <button @click="copyToClipboard(synthesis.letter, 'letter')" class="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group active:scale-95">
                    <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-2 group-hover:bg-indigo-500/20 transition-colors">
                       <Sparkles class="w-5 h-5 text-indigo-400" />
                    </div>
                    <span class="text-[10px] font-black text-white uppercase tracking-widest">Cover Letter</span>
                    <span class="text-[8px] font-bold text-white/30 uppercase mt-1">AI Synthesis</span>
                 </button>
              </div>
           </div>

           <!-- Step 2: Content Sync -->
           <div class="space-y-3">
              <h4 class="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                 <span class="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-white">2</span>
                 Rapid Payload Copy
              </h4>
              <div class="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                 <div class="space-y-1.5">
                    <span class="text-[9px] font-black text-[#C1A172] uppercase tracking-widest flex items-center gap-1.5">
                       <ShieldCheck class="w-3 h-3" />
                       Optimized Professional Summary
                    </span>
                    <div class="relative bg-black/20 p-3 rounded-xl border border-white/5">
                       <p class="text-[11px] text-white/60 leading-relaxed italic line-clamp-3">
                          {{ synthesis.summary }}
                       </p>
                       <button @click="copyToClipboard(synthesis.summary, 'summary')" class="absolute top-2 right-2 p-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-white/30 transition-all">
                          <Copy v-if="copiedField !== 'summary'" class="w-3 h-3" />
                          <CheckCircle2 v-else class="w-3 h-3 text-emerald-400" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <!-- Footer: Portal Execution -->
        <div class="p-6 bg-white/5 border-t border-white/5">
           <p class="text-[9px] font-bold text-white/30 uppercase text-center mb-4 tracking-widest">Ready for portal submission?</p>
           <button @click="handlePortalOpen" class="w-full bg-gradient-to-r from-[#C1A172] to-[#FFD700] p-4 rounded-2xl flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#C1A172]/20">
              <span class="text-[11px] font-black text-[#0A2647] uppercase tracking-widest">Secure Portal Dispatch</span>
              <ExternalLink class="w-4 h-4 text-[#0A2647] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </button>
           <p class="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] text-center mt-6">DigyNex CareerNexus • Master V13.1</p>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(193, 161, 114, 0.2); border-radius: 20px; }

.fade-blur-enter-active, .fade-blur-leave-active { transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
.fade-blur-enter-from, .fade-blur-leave-to { opacity: 0; backdrop-filter: blur(0); }
</style>
