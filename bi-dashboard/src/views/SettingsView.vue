<template>
  <div class="h-screen bg-slate-50 flex text-slate-800 font-sans overflow-hidden">
    <Sidebar @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

    <main class="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f7fb] relative">
      <TopHeader @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

      <div class="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        <div class="mb-8">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Settings class="w-6 h-6 text-slate-400" /> Organization Settings
            </h1>
            <p class="text-sm font-medium text-slate-500 mt-1">Configure global business rules, tenant security, and audit protocols.</p>
        </div>

        <div class="max-w-4xl space-y-8 mb-8">
            <!-- Basic Config -->
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 group overflow-hidden">
                <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] mb-8 border-b border-slate-50 pb-4">Global Configuration</h3>
                <div class="space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div class="space-y-1 mt-1">
                            <p class="text-sm font-bold text-slate-800">Product Identity</p>
                            <p class="text-xs text-slate-400">Main brand name and version suffix.</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="flex-1 space-y-2">
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Name</p>
                                <input type="text" v-model="brandingStore.productName" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300">
                            </div>
                            <div class="w-24 space-y-2">
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Suffix (Color)</p>
                                <input type="text" v-model="brandingStore.productSuffix" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300">
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-slate-50 pt-8">
                        <div class="space-y-1">
                            <p class="text-sm font-bold text-slate-800">Primary Currency</p>
                            <p class="text-xs text-slate-400">Display currency for financial analysis.</p>
                        </div>
                        <select v-model="selectedCurrency" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                            <option>LKR - Sri Lankan Rupee</option>
                            <option>SEK - Swedish Krona</option>
                            <option>USD - US Dollar</option>
                            <option>EUR - Euro</option>
                        </select>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-slate-50 pt-8">
                        <div class="space-y-1">
                            <p class="text-sm font-bold text-slate-800">Security Audit Logs</p>
                            <p class="text-xs text-slate-400">Strict mode session recording levels.</p>
                        </div>
                        <div class="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-hidden">
                            <button 
                                v-for="level in ['Minimal', 'Standard', 'Strict']" 
                                :key="level"
                                type="button"
                                @click="setAuditLevel(level)"
                                :class="auditLevel === level ? 'bg-slate-900 text-white shadow-xl scale-100 z-10' : 'text-slate-400 hover:text-slate-900 hover:bg-white/50 scale-95'"
                                class="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 transform active:scale-90"
                            >
                                {{ level }}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="mt-12 flex justify-end">
                    <button 
                        @click="handleSave" 
                        :disabled="isSaving"
                        class="px-10 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
                        <Save v-else class="w-4 h-4" />
                        {{ isSaving ? 'Saving Data...' : 'Save Changes' }}
                    </button>
                </div>
            </div>

            <!-- Connectivity & Nodes -->
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 group">
                <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] mb-8 border-b border-slate-50 pb-4">AI Intelligence & Connectivity</h3>
                <div class="space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div class="space-y-1">
                            <p class="text-sm font-bold text-slate-800">Strategic API Access</p>
                            <p class="text-xs text-slate-400">Public key for ERP and 3rd party sync protocol.</p>
                        </div>
                        <div class="flex items-center gap-2">
                             <input type="password" value="sk-dgnx-8h2k-9z21-p0m2-x9w" readonly class="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-mono font-bold text-slate-400 focus:outline-none">
                             <button @click="triggerToast('Cloud API Key copied to encrypted buffer.')" class="px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10">
                                <Key class="w-4 h-4" />
                             </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-slate-50 pt-8">
                        <div class="space-y-1">
                            <p class="text-sm font-bold text-slate-800">Global Tenant Sync</p>
                            <p class="text-xs text-slate-400">Status of distributed nodes across Scandinavia and Asia.</p>
                        </div>
                        <div class="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                             <div class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                             <p class="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Nodes Sychronized: 14/14 Active</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Danger Zone -->
            <div class="bg-red-50/50 rounded-3xl border border-red-100 p-8">
                <h3 class="font-black text-red-700 uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2">
                    <ShieldAlert class="w-4 h-4 text-red-400" /> Enterprise Danger Zone
                </h3>
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div class="space-y-1">
                        <p class="text-sm font-bold text-red-900">Restore Cloud Database</p>
                        <p class="text-xs text-red-700/60 font-medium">Reset all transaction data to latest backup point.</p>
                    </div>
                    <button @click="triggerToast('Restoration Access Denied. Contact Root Admin.')" class="px-6 py-2.5 bg-white border border-red-200 text-red-700 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm flex items-center gap-2 group/rest">
                        <RotateCcw class="w-4 h-4 group-hover/rest:rotate-[-45deg] transition-transform" /> Initialize Reset
                    </button>
                </div>
            </div>
        </div>
      </div>
    </main>

    <transition name="toast-slide">
      <div v-if="toastState.show" class="fixed bottom-10 right-10 z-[100] bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl flex items-start gap-4 ring-1 ring-white/10">
        <p class="text-xs font-bold leading-relaxed">{{ toastState.message }}</p>
        <button @click="toastState.show = false"><X class="w-4 h-4"/></button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Settings, X, Loader2, Save, RotateCcw, Key, ShieldAlert } from 'lucide-vue-next'
import Sidebar from '../components/dashboard/Sidebar.vue'
import TopHeader from '../components/dashboard/TopHeader.vue'

import { brandingStore } from '../services/brandingService'

const isMobileMenuOpen = ref(false)
const isSaving = ref(false)
const toastState = ref({ show: false, message: '' })

// Shared Branding State
const selectedCurrency = ref('LKR - Sri Lankan Rupee')
const auditLevel = ref('Standard')

const setAuditLevel = (level) => {
    auditLevel.value = level
    triggerToast(`Audit Mode set to: ${level.toUpperCase()}`)
}

const triggerToast = (msg) => {
  toastState.value = { show: true, message: msg }
  setTimeout(() => { toastState.value.show = false }, 3000)
}

onMounted(() => {
    // Sync initial state from global store
    const mapping = {
        'LKR': 'LKR - Sri Lankan Rupee',
        'SEK': 'SEK - Swedish Krona',
        'USD': 'USD - US Dollar',
        'EUR': 'EUR - Euro'
    }
    selectedCurrency.value = mapping[brandingStore.currency] || 'LKR - Sri Lankan Rupee'
})

const handleSave = () => {
    isSaving.value = true
    
    // Extract currency code (e.g., 'LKR') from 'LKR - Sri Lankan Rupee'
    const code = selectedCurrency.value.split(' ')[0]
    brandingStore.currency = code
    
    // Simulate persistent storage update
    setTimeout(() => {
        isSaving.value = false
        triggerToast(`Cloud persistence updated. Brand Identity: ${brandingStore.productName}${brandingStore.productSuffix} | Currency: ${code} verified.`)
    }, 1500)
}
</script>

<style scoped>
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>
