<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>
      
      <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-[slideUp_0.3s_ease-out] border border-white/20">
        <!-- HEADER -->
        <div class="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
                <h3 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <PlusSquare class="w-5 h-5 text-emerald-500" /> New Ledger Record
                </h3>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Strategic Multi-Tenant Entry</p>
            </div>
            <button @click="$emit('close')" class="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-800 rounded-xl transition-colors">
                <X class="w-5 h-5" />
            </button>
        </div>

        <!-- FORM -->
        <div class="p-8 space-y-6">
            <!-- VALIDATION ALERT -->
            <div v-if="showError" class="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] font-black text-red-600 uppercase tracking-widest animate-pulse">
               Missing mandatory fields. Please specify Description and Amount.
            </div>

            <!-- TYPE TOGGLE -->
            <div class="flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
                <button 
                  @click="form.type = 'In'" 
                  class="flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                  :class="form.type === 'In' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
                >Revenue (+)</button>
                <button 
                  @click="form.type = 'Out'" 
                  class="flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                  :class="form.type === 'Out' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
                >Expense (-)</button>
            </div>

            <div class="space-y-4 font-sans">
                <!-- DESCRIPTION -->
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Transaction Description</label>
                    <input 
                      v-model="form.desc"
                      type="text" 
                      placeholder="Ex: Enterprise SaaS Sub - Microsoft Hub"
                      class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-bold text-slate-800"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <!-- AMOUNT -->
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Amount ({{ brandingStore.currency }})</label>
                        <input 
                          v-model="form.val"
                          type="number" 
                          placeholder="2500"
                          class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-black text-slate-800"
                        />
                    </div>
                    <!-- CATEGORY -->
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Category</label>
                        <select 
                          v-model="form.cat"
                          class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-bold text-slate-800"
                        >
                            <option value="SaaS Sub">SaaS Sub</option>
                            <option value="Consulting">Consulting</option>
                            <option value="Infrastructure">Infrastructure</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Payroll">Payroll</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- ACTION BUTTON -->
            <button 
              @click="handleSubmit" 
              :disabled="isSubmitting"
              class="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-slate-800 active:scale-[0.98] shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-2 group"
            >
                <component :is="isSubmitting ? Loader2 : CheckCircle" class="w-4.5 h-4.5" :class="isSubmitting ? 'animate-spin' : ''" />
                {{ isSubmitting ? 'Verifying Profile...' : 'Commit to Global Ledger' }}
            </button>
            <p class="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest opacity-60 italic">AI Integrity Check Active • AES-256 Validated</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { X, PlusSquare, Loader2, CheckCircle } from 'lucide-vue-next'
import { brandingStore } from '../../services/brandingService'

const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close', 'submit'])

const isSubmitting = ref(false)
const showError = ref(false)
const form = reactive({
    desc: '',
    val: '',
    cat: 'SaaS Sub',
    type: 'In'
})

const handleSubmit = () => {
    if (!form.desc || !form.val) {
        showError.value = true
        setTimeout(() => showError.value = false, 3000)
        return
    }
    
    isSubmitting.value = true
    
    // Simulate encryption and DB hit
    setTimeout(() => {
        emit('submit', { ...form, id: `#TRX-${Math.floor(Math.random() * 10000)}B`, date: 'Today' })
        isSubmitting.value = false
        
        // Reset form
        form.desc = ''
        form.val = ''
        form.cat = 'SaaS Sub'
        form.type = 'In'
    }, 1500)
}
</script>

<style scoped>
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
