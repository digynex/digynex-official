<template>
  <header class="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-40 sticky top-0 flex-shrink-0 transition-all duration-300">
        <div class="flex items-center gap-4">
          <button class="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors" @click="$emit('toggleMenu')">
            <Menu class="w-5 h-5" />
          </button>
          <div class="hidden sm:block">
             <h1 class="text-xl font-black text-slate-800 tracking-tight">Q1 Executive Outlook</h1>
             <p class="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Decision Intelligence Platform</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3 sm:gap-6">
          <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-100/50 shadow-sm cursor-default transition-all hover:bg-emerald-100">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live (Updated 2m ago)
          </div>

          <div class="flex items-center gap-2 sm:gap-4">
            <!-- NOTIFICATION BELL -->
            <div class="relative bell-container">
              <button 
                @click.stop="isNotificationsOpen = !isNotificationsOpen" 
                class="relative p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 group"
              >
                <Bell class="w-5 h-5 group-hover:animate-[wiggle_1s_ease-in-out_infinite]" />
                <span v-if="unreadCount > 0" class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full animate-bounce"></span>
              </button>

              <transition name="dropdown">
                <div v-if="isNotificationsOpen" class="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[50] ring-1 ring-slate-900/5 origin-top-right">
                  <div class="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Action Engine</h3>
                    <span v-if="unreadCount > 0" class="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold">{{ unreadCount }} NEW</span>
                  </div>
                  <div class="max-h-[350px] overflow-y-auto custom-scrollbar">
                    <div 
                      v-for="(note, i) in notificationsStore" 
                      :key="note.id" 
                      @click="handleNotificationClick(note)"
                      :class="note.is_read ? 'opacity-60 bg-white' : 'bg-blue-50/30'"
                      class="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div class="flex gap-3">
                        <div :class="getTypeColor(note.type)" class="p-2 rounded-lg h-fit group-hover:scale-110 transition-transform">
                          <component :is="getTypeIcon(note.type)" class="w-4 h-4" />
                        </div>
                        <div>
                          <p class="text-[11px] font-black text-slate-800 leading-tight mb-1 group-hover:text-primary transition-colors">{{ note.title }}</p>
                          <p class="text-[11px] text-slate-500 font-medium leading-relaxed">{{ note.message }}</p>
                          <span class="text-[9px] text-slate-400 font-bold uppercase mt-2 block">{{ formatTime(note.created_at) }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-if="notificationsStore.length === 0" class="p-8 text-center">
                        <Zap class="w-8 h-8 text-slate-100 mx-auto mb-2" />
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">No active alerts in archive.</p>
                    </div>
                  </div>
                  <div class="px-5 py-3 border-t border-slate-50 bg-slate-50/20 text-center">
                    <button @click="markAllRead" class="text-[11px] font-black text-primary hover:text-blue-700 uppercase tracking-widest">Archive History</button>
                  </div>
                </div>
              </transition>
            </div>

            <!-- EXPORT BUTTON -->
            <button 
              @click="handleExport" 
              :disabled="isExporting"
              class="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Download v-if="!isExporting" class="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {{ isExporting ? 'Exporting...' : 'Export' }}
            </button>
          </div>
        </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, Bell, Download, AlertTriangle, Database, Zap, Sparkles, FileText, CheckCircle, Info } from 'lucide-vue-next'
import { notificationsStore, unreadCount, fetchNotifications, markAsRead } from '../../services/notificationService'

const emit = defineEmits(['toggleMenu', 'triggerToast'])

const isNotificationsOpen = ref(false)
const isExporting = ref(false)

const getTypeColor = (type) => {
    switch(type) {
        case 'success': return 'bg-emerald-50 text-emerald-500'
        case 'warning': return 'bg-amber-50 text-amber-500'
        case 'error': return 'bg-red-50 text-red-500'
        default: return 'bg-blue-50 text-primary'
    }
}

const getTypeIcon = (type) => {
    switch(type) {
        case 'success': return CheckCircle
        case 'warning': return AlertTriangle
        case 'error': return AlertTriangle
        case 'invoice': return FileText
        default: return Info
    }
}

const formatTime = (ts) => {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const closeDropdown = (e) => {
  if (!e.target.closest('.bell-container')) {
    isNotificationsOpen.value = false
  }
}

onMounted(async () => {
  window.addEventListener('click', closeDropdown)
  await fetchNotifications()
})

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown)
})

const handleNotificationClick = async (note) => {
  emit('triggerToast', `Engagement Intelligence: ${note.title}. Navigating to linked manifest...`)
  await markAsRead(note.id)
  isNotificationsOpen.value = false
}

const markAllRead = () => {
  emit('triggerToast', 'Strategic archive updated. All active alerts moved to cold storage.')
  isNotificationsOpen.value = false
}

const handleExport = () => {
  isExporting.value = true
  emit('triggerToast', 'Compiling AI Intelligence Report for PDF export...')
  
  setTimeout(() => {
    emit('triggerToast', 'Encrypted data streams validated. Generating BI Graphics...')
    
    setTimeout(() => {
      isExporting.value = false
      emit('triggerToast', '✓ Executive Export Ready. Report downloaded successfully.')
      
      const dummy = document.createElement('a')
      dummy.href = '#'
      dummy.download = 'DigyNex_Q1_Executive_Outlook.pdf'
      dummy.click()
    }, 2000)
  }, 1500)
}
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}
</style>
