<script setup>
import { 
  Globe, ChevronDown, ArrowRight 
} from 'lucide-vue-next'

const props = defineProps({
  t: Function,
  locale: String,
  isAuthenticated: Boolean,
  quickLangs: Array,
  otherLangs: Array,
  isLangOpen: Boolean
})

const emit = defineEmits([
  'setLang', 'toggleLang', 'openAuth', 'logout'
])

</script>

<template>
  <header class="flex flex-col items-center pt-[18px] space-y-4 w-full relative z-[600]">
     <!-- Symmetric Auth Gate -->
     <div class="grid grid-cols-3 items-center w-full px-4 mb-2">
         <!-- LEFT: JOIN (ONLY GUEST) -->
         <div class="flex justify-start">
            <button v-if="!isAuthenticated" @click="emit('openAuth', 'register')" 
                    class="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/5 hover:text-white hover:border-[#C1A172]/40 hover:bg-[#C1A172]/5 hover:shadow-[0_0_20px_rgba(193,161,114,0.3)] transition-all duration-500 font-jakarta active:scale-90">
               {{ t('auth.signup') || 'JOIN' }}
            </button>
         </div>

         <!-- CENTER: LOGO UNIT -->
         <div class="flex justify-center">
            <div class="relative group">
              <div class="p-1.5 bg-gradient-to-br from-[#144272] to-[#0A2647] rounded-full flex items-center justify-center border-2 border-white/40 shadow-[-10px_-10px_30px_rgba(255,255,255,0.05),15px_15px_35px_rgba(0,0,0,0.6)] overflow-hidden scale-100 transition-all hover:scale-110 active:scale-95 duration-500">
                 <img src="/logo.png" alt="CareerNexus" class="h-10 w-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]" />
              </div>
              <div class="absolute -inset-1 border border-white/10 rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </div>
         </div>

         <!-- RIGHT: AUTH STATE -->
         <div class="flex justify-end">
            <button v-if="!isAuthenticated" @click="emit('openAuth', 'login')" 
                    class="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/5 hover:text-white hover:border-[#C1A172]/40 hover:bg-[#C1A172]/5 hover:shadow-[0_0_20px_rgba(193,161,114,0.3)] transition-all duration-500 font-jakarta active:scale-90">
               {{ t('auth.login') || 'LOGIN' }}
            </button>
            <button v-else @click="emit('logout')" class="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/5 hover:text-red-400 hover:border-red-400/30 transition-all font-jakarta active:scale-90">{{ t('governance.logout') || 'LOG OUT' }}</button>
         </div>
     </div>

    <!-- Branding Text Hub -->
    <div class="flex flex-col items-center mt-4 mb-1">
      <h1 class="text-[17px] font-black text-white uppercase tracking-[0.2em] leading-tight font-jakarta">{{ t('header.title') }}</h1>
      <p class="text-[8px] font-black text-[#C1A172] uppercase tracking-[0.4em] mt-1 font-jakarta opacity-80">{{ t('header.subtitle') }}</p>
    </div>

    <!-- Language Pill Unit -->
    <div class="bg-black/30 backdrop-blur-2xl rounded-full p-0.5 flex items-center border border-white/10 shadow-2xl relative transition-all hover:scale-100 scale-100">
      <button v-for="lang in quickLangs" :key="lang" @click="emit('setLang', lang)" 
              :class="locale === lang ? 'bg-white text-[#0A2647] shadow-lg font-black scale-105 ring-1 ring-white/20' : 'text-white/40 hover:text-white/80 font-bold hover:bg-white/5'"
              class="px-5 py-2.5 rounded-full text-[10px] uppercase min-w-[55px] flex items-center justify-center cursor-pointer transition-all duration-500 relative z-20">
        {{ lang }}
      </button>
      <div class="h-3 w-[1px] bg-white/10 mx-1"></div>
      
      <div @click="emit('toggleLang')" 
           :class="(!quickLangs.includes(locale) || isLangOpen) ? 'bg-white text-[#0A2647] shadow-lg scale-105' : 'text-white/40 hover:text-white/80'"
           class="flex items-center gap-1.5 pl-3 pr-3 py-2.5 rounded-full cursor-pointer group transition-all duration-500 relative z-20">
        
        <Globe v-if="quickLangs.includes(locale) && !isLangOpen" class="w-3 h-3 transition-transform group-hover:rotate-12" />
        <span v-else class="text-[9px] font-black uppercase tracking-tight">{{ locale }}</span>
        <ChevronDown class="w-3 h-3 transition-transform opacity-30" :class="isLangOpen ? 'rotate-180 opacity-100' : ''" />
      </div>

      <!-- Animated Selector Overlay -->
      <div v-if="isLangOpen" class="absolute top-[60px] right-0 w-[180px] bg-[#0A2647]/95 backdrop-blur-3xl rounded-[1.8rem] p-4 shadow-[0_40px_80px_rgba(0,0,0,0.9)] z-[3000] border border-white/10 animate-in fade-in zoom-in duration-300">
         <p class="text-[7.5px] font-black text-white/30 uppercase tracking-[0.25em] mb-4 border-b border-white/5 pb-2">{{ t('header.globalSuite') }}</p>
         <div class="space-y-1 max-h-[220px] overflow-y-auto pr-0.5 custom-scrollbar">
            <div v-for="l in otherLangs" :key="l.code" @click="emit('setLang', l.code)" 
                 class="flex items-center justify-between py-2.5 px-3 rounded-xl border border-white/0 hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer group active:scale-95">
               <div class="flex items-center gap-1">
                  <div class="w-6 h-6 flex items-center justify-center text-[8px] font-black text-white/40 group-hover:text-white transition-colors">{{ l.code }}</div>
                  <span class="text-[11px] font-bold tracking-tight text-white/70 group-hover:text-white transition-colors">{{ l.name }}</span>
               </div>
               <ArrowRight class="w-2.5 h-2.5 text-white/10 group-hover:text-white transition-all font-jakarta" />
            </div>
         </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }
</style>
