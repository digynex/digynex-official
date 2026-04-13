<script setup>
import { 
  LayoutDashboard, FileText, Star, User
} from 'lucide-vue-next'

const props = defineProps({
  t: Function,
  activeTab: String
})

const emit = defineEmits(['setTab'])

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
  { id: 'applications', icon: FileText, label: 'nav.applications' },
  { id: 'matches', icon: Star, label: 'nav.matches' },
  { id: 'profile', icon: User, label: 'nav.profile' }
]

</script>

<template>
  <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[320px] bg-[#0A2647]/90 backdrop-blur-3xl px-6 py-2 rounded-full flex items-center justify-around shadow-[0_25px_60px_-10px_rgba(0,0,0,0.8)] z-[1000] border border-white/10 ring-1 ring-white/5 transition-all duration-500">
     <div v-for="item in navItems" :key="item.id"
          @click="emit('setTab', item.id)"
          class="flex flex-col items-center gap-1.5 group cursor-pointer relative py-1 transition-all">
        
        <div class="relative flex flex-col items-center">
           <component :is="item.icon" 
                      class="w-[18px] h-[18px] transition-all duration-300 group-hover:scale-110 active:scale-90" 
                      :class="activeTab === item.id ? 'text-[#C1A172]' : 'text-white/20'" />
           
           <span class="text-[7.5px] font-black uppercase tracking-[0.2em] transition-all duration-300 mt-1 leading-none font-jakarta"
                 :class="activeTab === item.id ? 'text-white' : 'text-white/20'">
              {{ t(item.label) }}
           </span>
        </div>

        <!-- ACTIVE SYNC DOT (GOLD) -->
        <div v-if="activeTab === item.id" 
             class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[3.5px] h-[3.5px] bg-[#C1A172] rounded-full shadow-[0_0_10px_#C1A172] animate-in zoom-in slide-in-from-bottom-1 duration-500"></div>
     </div>
  </nav>
</template>

<style scoped>
/* Surgical Precision Layout Sync */
nav {
  -webkit-tap-highlight-color: transparent;
}
</style>

