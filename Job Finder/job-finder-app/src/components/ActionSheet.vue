<script setup>
import { ref } from 'vue'
import { 
  X, Bookmark, Share2, EyeOff, AlertTriangle, 
  Check, ArrowRight
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    default: 'Quick Actions'
  },
  actions: {
    type: Array,
    default: () => [
      { id: 'save', label: 'Save Job', icon: Bookmark, color: 'text-[#C1A172]' },
      { id: 'share', label: 'Share Link', icon: Share2, color: 'text-blue-400' },
      { id: 'hide', label: 'Hide Match', icon: EyeOff, color: 'text-gray-400' },
      { id: 'report', label: 'Report AI Error', icon: AlertTriangle, color: 'text-red-400' }
    ]
  }
})

const emit = defineEmits(['close', 'onAction'])

const activeAction = ref(null)

const handleAction = async (id) => {
    activeAction.value = id;
    // Real feedback feel: Pause to show success checkmark
    await new Promise(res => setTimeout(res, 800));
    emit('onAction', id)
    activeAction.value = null;
    emit('close')
}
</script>

<template>
  <Transition name="sheet">
    <div v-if="isOpen" class="fixed inset-0 z-[7000] flex flex-col justify-end">
      <!-- Backdrop -->
      <div @click="emit('close')" class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <!-- Sheet Content -->
      <div class="relative w-full max-w-[360px] mx-auto bg-[#051124] rounded-t-[2.5rem] border-t border-white/10 shadow-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-400">
         
         <!-- Indicator -->
         <div class="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6"></div>

         <div class="space-y-2 mb-6 text-center">
            <h3 class="text-[12px] font-black text-white/40 uppercase tracking-[0.3em]">{{ title }}</h3>
         </div>

         <div class="grid grid-cols-1 gap-2.5">
            <button v-for="action in actions" :key="action.id" 
                    @click="handleAction(action.id)"
                    class="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 flex items-center justify-between group hover:bg-white/10 active:scale-[0.98] transition-all relative overflow-hidden">
               <div class="flex items-center gap-4 relative z-10">
                  <div class="p-1.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                     <component :is="activeAction === action.id ? Check : action.icon" 
                                class="w-4 h-4 transition-all duration-300" 
                                :class="activeAction === action.id ? 'text-[#73BBA3] scale-110' : action.color" />
                  </div>
                  <span class="text-[13px] font-bold text-white/90 group-hover:text-white transition-colors">
                     {{ activeAction === action.id ? 'Success!' : action.label }}
                  </span>
               </div>
               <ArrowRight v-if="activeAction !== action.id" class="w-3.5 h-3.5 text-white/5 group-hover:text-white/30 transition-all" />
            </button>
         </div>

         <!-- Cancel -->
         <button @click="emit('close')" class="w-full mt-4 py-2 rounded-2xl text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-white/50 transition-colors">
            Dismiss
         </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.sheet-enter-active, .sheet-leave-active { transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; transform: translateY(100px); }
</style>
