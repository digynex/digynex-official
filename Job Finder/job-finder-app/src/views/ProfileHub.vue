<script setup>
import { computed } from 'vue'
import { 
  ShieldCheck, Sparkles, Linkedin, User, FileText, Zap, X, ArrowRight, Lock
} from 'lucide-vue-next'

const props = defineProps({
  t: Function,
  isAuthenticated: Boolean,
  userProfile: Object,
  masterProfile: Object,
  uploadedFileName: String,
  activeFocusSlots: Object,
  fieldsOfInterest: Array,
  newField: String,
  isUploadingCV: Boolean,
  isSavingProfile: Boolean,
  isCompilingLatex: Boolean,
  linkedInConnected: Boolean,
  linkedInUrlInput: String
})

const emit = defineEmits([
  'openAuth', 'openLinkedInModal', 'openManualForm', 'compileLatex', 'triggerFileUpload', 'handleFileUpload', 'saveProfile', 'removeField', 'addField', 'update:newField', 'openCVModal'
])

const hasCVData = computed(() => {
  return (props.uploadedFileName && props.uploadedFileName !== 'No CV Uploaded') || 
         (props.masterProfile?.basic?.fullName);
})

</script>

<template>
  <div class="flex flex-col animate-in fade-in slide-in-from-right-10 duration-500 overflow-hidden h-full">
     <!-- Top Branding Hub (CENTERED SYNC) -->
     <header class="flex flex-col items-center pt-[18px] space-y-4 w-full relative z-[600]">
       <div class="p-0.5 bg-white/10 rounded-full">
          <img src="/digynex-icon.png" alt="DigyNex" class="h-8 w-auto opacity-50 contrast-125" />
       </div>
       <div class="flex flex-col items-center mb-1">
          <h2 class="text-[14px] font-black text-white/40 uppercase tracking-[0.3em] leading-none">{{ t('profile.title') }}</h2>
          <div class="flex items-center gap-1.5 mt-2.5">
             <div class="w-1 h-1 rounded-full bg-[#C1A172] animate-pulse shadow-[0_0_8px_#C1A172]"></div>
             <span class="text-[7.5px] font-black text-white/20 uppercase tracking-[0.2em]">Neural Sync Active</span>
          </div>
       </div>
     </header>
     
      <div class="mt-4 flex-1 overflow-y-auto custom-scrollbar space-y-3 px-4 hub-scroller relative">
         <!-- GLOBAL PRIVACY LOCK (PROFILE GUEST MODE) -->
         <div v-if="!isAuthenticated" class="absolute inset-x-0 inset-y-0 z-[100] flex flex-col items-center justify-center px-8 text-center bg-[#0A2647]/40 backdrop-blur-md rounded-[3rem] h-[calc(100%-110px)] top-1 mx-4">
            <div class="w-full max-w-[280px] bg-[#0A2647] border border-white/10 rounded-[2.5rem] p-8 shadow-3xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
               <div class="w-12 h-12 bg-[#C1A172]/10 rounded-2xl flex items-center justify-center border border-[#C1A172]/20">
                  <ShieldCheck class="w-6 h-6 text-[#C1A172]" />
               </div>
               <div class="space-y-1">
                  <h3 class="text-[11px] font-black text-white uppercase tracking-[0.2em]">IDENTITY HUB LOCKED</h3>
                  <p class="text-[8px] font-black text-white/30 uppercase tracking-[0.1em] leading-relaxed">Personal data ingestion and AI profiling are restricted to authorized users.</p>
               </div>
               <button @click="$emit('openAuth', 'login')" class="mt-2 w-full py-3 bg-[#C1A172] rounded-xl text-[9px] font-black text-[#0A2647] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Unlock Master Access</button>
            </div>
         </div>

         <div :class="{ 'filter blur-[10px] select-none pointer-events-none opacity-40': !isAuthenticated }" class="space-y-3">

        
        <!-- AI GENERATOR HUB (PACKED ELITE CARD) -->
        <div class="bg-gradient-to-br from-[#BDDAFA]/25 via-[#F1F5F9] to-[#EDF2F7] rounded-[2.5rem] px-5 pt-2 pb-2.5 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.25)] border border-white relative overflow-hidden group">
           <div class="flex items-center justify-between mb-3 px-1">
              <div class="flex items-center gap-2">
                 <div class="bg-[#0A2647]/5 p-2 rounded-xl">
                    <Sparkles class="w-4 h-4 text-[#0A2647]" />
                 </div>
                 <span class="text-[10px] font-black text-[#0A2647]/50 uppercase tracking-[0.2em]">AI Master Builder</span>
              </div>
              <div class="flex items-center gap-1.5">
                <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span class="text-[8px] font-black text-[#0A2647]/30 uppercase">Active Core</span>
              </div>
           </div>
           
           <div class="space-y-3">
              <button @click="$emit('openLinkedInModal')" :class="linkedInConnected ? 'bg-[#0077b5]' : 'bg-[#0A2647]'" class="w-full py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_12px_25px_rgba(0,0,0,0.15)] hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group/btn">
                 <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                 <Linkedin class="w-4 h-4 text-white" />
                 <span class="text-[11px] font-black text-white uppercase tracking-widest relative z-10">
                    {{ linkedInConnected ? 'Ingested: ' + linkedInUrlInput.substring(0,10) + '...' : 'One-Click Ingestion' }}
                 </span>
              </button>
              
              <div class="grid grid-cols-2 gap-2 w-[88%] mx-auto pb-0">
                  <button @click="$emit('openManualForm')" class="bg-[#0A2647]/5 border border-[#0A2647]/10 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#0A2647]/10 transition-all text-[#0A2647]/60 active:scale-95 group/manual">
                      <User class="w-3 h-3 group-hover/manual:rotate-12 transition-transform" />
                      <span class="text-[8px] font-black uppercase tracking-widest">Manual Setup</span>
                  </button>
                  <button @click="$emit('compileLatex')" class="bg-[#C1A172] py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_8px_15px_rgba(193,161,114,0.25)] hover:scale-[1.02] transition-all text-[#0A2647] active:scale-95">
                      <FileText v-if="!isCompilingLatex" class="w-3 h-3" />
                      <div v-else class="w-3 h-3 rounded-full border-2 border-[#0A2647]/40 border-t-[#0A2647] animate-spin"></div>
                      <span class="text-[8px] font-black uppercase tracking-widest">{{ isCompilingLatex ? 'Compiling' : 'Global Export' }}</span>
                  </button>
              </div>
           </div>
        </div>

        <!-- CV MANAGEMENT (MATCHED ARCHITECTURE) -->
        <div :class="uploadedFileName !== 'No CV Uploaded' ? 'border-[#C1A172]/30 shadow-[0_30px_60px_-15px_rgba(193,161,114,0.15)] ring-1 ring-[#C1A172]/10' : 'border-white'" 
             class="bg-gradient-to-br from-[#BDDAFA]/25 via-[#F1F5F9] to-[#EDF2F7] rounded-[2.5rem] px-5 pt-2 pb-2.5 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.25)] border relative overflow-hidden group transition-all duration-500">
           <div class="flex items-center justify-between mb-4">
              <div class="flex flex-col">
                 <div class="flex items-center gap-1.5 mb-1">
                    <span class="text-[9px] font-black text-[#0A2647]/50 uppercase tracking-[0.2em]">Legacy CV Core</span>
                    <div v-if="uploadedFileName !== 'No CV Uploaded'" class="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                 </div>
                 <p class="text-[14px] font-black text-[#0A2647] tracking-tight truncate w-40">{{ uploadedFileName }}</p>
              </div>
              <div :class="uploadedFileName !== 'No CV Uploaded' ? 'bg-[#C1A172]' : 'bg-[#0A2647]'"
                   class="p-2.5 rounded-xl shadow-lg transform group-hover:rotate-6 transition-all duration-500">
                 <FileText :class="uploadedFileName !== 'No CV Uploaded' ? 'text-white' : 'text-[#C1A172]'" class="w-5 h-5" />
              </div>
           </div>
           
           <!-- Active Focus Slots (PACKED) -->
           <div class="mb-4 bg-[#0A2647]/5 rounded-2xl p-4 border border-[#0A2647]/5">
              <div class="flex items-center justify-between mb-2">
                 <span class="text-[9px] font-black text-[#0A2647]/50 uppercase tracking-widest">Pipeline Bandwidth</span>
                 <span class="text-[10px] font-black text-[#0A2647]">{{ activeFocusSlots.used }} / {{ activeFocusSlots.total }} Slots</span>
              </div>
              <div class="w-full h-2 bg-[#0A2647]/10 rounded-full overflow-hidden shadow-inner p-[1px]">
                 <div class="h-full bg-gradient-to-r from-[#2C74B3] to-[#C1A172] rounded-full transition-all duration-1000 shadow-sm" :style="`width: ${(activeFocusSlots.used / activeFocusSlots.total) * 100}%`"></div>
              </div>
           </div>
 
           <div class="space-y-3">
              <button @click="$emit('triggerFileUpload')" class="w-[88%] mx-auto bg-[#0A2647]/5 border border-[#0A2647]/10 py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all group/upload active:scale-95 hover:bg-[#0A2647]/10 shadow-sm">
                 <Zap v-if="!isUploadingCV" :class="uploadedFileName !== 'No CV Uploaded' ? 'text-[#C1A172]' : 'text-[#0A2647]/20'" class="w-4 h-4 group-hover/upload:text-[#2C74B3] transition-colors" />
                 <div v-else class="w-4 h-4 rounded-full border-2 border-[#0A2647]/20 border-t-[#0A2647] animate-spin"></div>
                 <span class="text-[11px] font-black text-[#0A2647]/40 group-hover/upload:text-[#0A2647] uppercase tracking-widest transition-colors">
                    {{ isUploadingCV ? 'Syncing...' : (uploadedFileName !== 'No CV Uploaded' ? 'REPLACE ACTIVE CV' : 'Upload Professional CV') }}
                 </span>
              </button>
              <button @click="hasCVData ? $emit('openCVModal') : null" 
                      :class="hasCVData ? 'bg-[#0A2647] hover:scale-[1.02] shadow-xl shadow-[#0A2647]/20' : 'bg-[#0A2647]/20 cursor-not-allowed opacity-40'"
                      class="w-[88%] mx-auto py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all">
                 <span class="text-[11px] font-black text-white uppercase tracking-widest">{{ hasCVData ? 'SECURE VIEW ENGINE' : 'VIEW ENGINE LOCKED' }}</span>
                 <Lock v-if="!hasCVData" class="w-3 h-3 text-white/40" />
              </button>
           </div>
        </div>
        
        <!-- FIELDS OF INTEREST (PACKED CARD) -->
        <div class="bg-gradient-to-br from-[#BDDAFA]/25 via-[#F1F5F9] to-[#EDF2F7] rounded-[2.5rem] px-5 pt-2 pb-2.5 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.25)] border border-white relative">
           <span class="text-[9px] font-black text-[#0A2647]/50 uppercase tracking-[0.2em] mb-2 block">Strategic Specialization</span>
           <div class="flex flex-wrap gap-1.5 mb-2">
              <TransitionGroup name="fade">
                 <div v-for="(field, index) in fieldsOfInterest" :key="field" 
                      class="px-4 py-2 bg-[#0A2647]/5 rounded-full border border-[#0A2647]/10 flex items-center gap-2 group cursor-pointer hover:bg-[#0A2647]/10 transition-all select-none shadow-sm">
                   <span class="text-[10px] font-black text-[#0A2647]/70">{{ field }}</span>
                   <X @click="$emit('removeField', index)" class="w-3 h-3 text-[#0A2647]/20 hover:text-red-500 transition-colors" />
                 </div>
              </TransitionGroup>
           </div>
           <div class="relative w-[88%] mx-auto mt-2">
              <input :value="newField" @input="$emit('update:newField', $event.target.value)" @keyup.enter="$emit('addField')" type="text" placeholder="Target Field..." 
                     class="w-full bg-[#0A2647]/5 border border-[#0A2647]/10 rounded-2xl px-4 py-2.5 text-[10px] text-[#0A2647] placeholder:text-[#0A2647]/45 focus:outline-none focus:ring-1 focus:ring-[#C1A172] transition-all font-jakarta shadow-inner" />
              <div @click="$emit('addField')" class="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0A2647] p-1.5 rounded-lg shadow-lg cursor-pointer transition-colors active:scale-95 text-white">
                 <ArrowRight class="w-2.5 h-2.5" />
              </div>
           </div>
        </div>
        
        <button @click="$emit('saveProfile')" class="w-[88%] mx-auto mt-6 bg-gradient-to-r from-[#C1A172] to-[#FFD700] py-2.5 rounded-[1.8rem] flex items-center justify-center gap-2 shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all group relative overflow-hidden shrink-0">
           <div v-if="isSavingProfile" class="w-3.5 h-3.5 rounded-full border-2 border-[#0A2647]/50 border-t-[#0A2647] animate-spin relative z-10"></div>
           <span class="text-[11.5px] font-black text-[#0A2647] uppercase tracking-[0.2em] relative z-10">{{ isSavingProfile ? 'UPDATING...' : 'SAVE EXPERT IDENTITY' }}</span>
           <ShieldCheck v-if="!isSavingProfile" class="w-3.5 h-3.5 text-[#0A2647]/40" />
        </button>
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
