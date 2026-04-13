<script setup>
import { ref, watch } from 'vue'
import { 
  X, Lock, ShieldCheck, Mail, Key, Sparkles, ArrowRight, Github, Chrome, 
  CheckCircle2, UserPlus, LogIn 
} from 'lucide-vue-next'

import { supabase } from '../lib/supabase'

const props = defineProps({
  isOpen: Boolean,
  mode: {
    type: String,
    default: 'login'
  }
})

const emit = defineEmits(['close', 'onSuccess'])

const internalMode = ref(props.mode)
const isProcessing = ref(false)
const showSuccess = ref(false)
const errorMessage = ref('')
const email = ref('')
const password = ref('')
const fullName = ref('')

// Sync internal mode and clear errors
watch(() => props.mode, (newMode) => {
    internalMode.value = newMode
    errorMessage.value = ''
    // Clear password on mode switch but keep email for convenience if it's there
    password.value = ''
})

// Clear ALL fields when the overlay is opened/closed to prevent ghost data
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        email.value = ''
        password.value = ''
        fullName.value = ''
        errorMessage.value = ''
    }
})

const handleAuth = async () => {
    if (!email.value || !password.value) {
        errorMessage.value = 'Identity credentials required'
        return;
    }
    if (internalMode.value === 'register' && !fullName.value) {
        errorMessage.value = 'Full Name is required for registration'
        return;
    }
    
    isProcessing.value = true;
    errorMessage.value = '';
    console.log(`Auth Attempt [${internalMode.value}]:`, email.value);
    
    try {
        if (internalMode.value === 'register') {
            const { data, error } = await supabase.auth.signUp({
                email: email.value,
                password: password.value,
                options: {
                    data: { 
                        full_name: fullName.value,
                        display_name: fullName.value 
                    }
                }
            })
            
            if (error) {
                console.error('Registration Error:', error.message);
                throw error;
            }
            
            console.log('Registration Successful:', data);
            
            if (data?.session) {
                console.log('Session established immediately (Auto-confirm ON)');
                emit('onSuccess')
                emit('close')
            } else {
                console.log('Verification Required (Auto-confirm OFF)');
                showSuccess.value = true;
                const registeredEmail = email.value;
                setTimeout(() => {
                    showSuccess.value = false;
                    internalMode.value = 'login';
                    email.value = registeredEmail;
                    password.value = '';
                    errorMessage.value = 'Awaiting Activation. Check your email inbox.'
                }, 3000);
            }
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value
            })
            
            if (error) {
                console.error('Login Error:', error.message);
                throw error;
            }
            
            console.log('Login Successful:', data.user.email);
            emit('onSuccess');
            emit('close');
        }
    } catch (err) {
        errorMessage.value = err.message
    } finally {
        isProcessing.value = false;
    }
}

const signInWithSocial = async (provider) => {
    console.log(`Social Auth Triggered [${provider}]`);
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: window.location.origin
            }
        })
        if (error) throw error
    } catch (err) {
        console.error('SSO Error:', err.message)
        errorMessage.value = `SSO Failed: ${err.message}`
    }
}
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[5000] flex flex-col items-center justify-center p-4">
      <!-- BACKDROP -->
      <div @click="emit('close')" class="absolute inset-0 bg-[#0A2647]/95 backdrop-blur-3xl"></div>
      
      <!-- AUTH CARD -->
      <div class="relative w-full max-w-sm bg-[#051124] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl flex flex-col scale-100 animate-in zoom-in-95 duration-500">
        
        <!-- INTERNAL CLOSE BUTTON (X) -->
        <button @click="emit('close')" class="absolute top-6 right-6 z-[70] p-2.5 rounded-full bg-white/5 border border-white/10 text-white/20 hover:text-white transition-all shadow-xl hover:scale-110 active:scale-90">
           <X class="w-5 h-5" />
        </button>

        <!-- SUCCESS STATE OVERLAY -->
        <div v-if="showSuccess" class="absolute inset-0 z-[60] bg-[#051124] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
           <div class="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 class="w-10 h-10 text-green-500" />
           </div>
           <h3 class="text-xl font-black text-white uppercase tracking-widest mb-2 font-playfair">Success</h3>
           <p class="text-[10px] text-white/40 uppercase tracking-[0.2em] font-jakarta">Identity Initialized. Redirecting...</p>
        </div>

        <!-- HEADER BRANDING -->
        <div class="p-8 pt-12 pb-4 text-center space-y-4">
           <div class="flex flex-col items-center gap-4">
              <div class="w-16 h-16 bg-[#C1A172]/10 rounded-[2rem] border border-[#C1A172]/30 flex items-center justify-center relative group">
                 <div class="absolute inset-0 bg-[#C1A172]/5 blur-xl group-hover:bg-[#C1A172]/20 transition-all"></div>
                 <Lock v-if="internalMode === 'login'" class="w-7 h-7 text-[#C1A172] relative z-10" />
                 <Sparkles v-else class="w-7 h-7 text-[#C1A172] relative z-10" />
              </div>
              <div class="flex flex-col gap-1">
                 <h2 class="text-xl font-black text-white uppercase tracking-[0.1em] font-playfair">{{ internalMode === 'login' ? 'Professional Access' : 'Create Identity' }}</h2>
                 <p class="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] font-jakarta">DigyNex AI Discovery Hub</p>
              </div>
           </div>
        </div>

        <!-- AUTH FORM -->
        <div class="p-8 pt-2 space-y-6">
           <div class="space-y-4">
              <!-- Full Name (Register Only) -->
              <div v-if="internalMode === 'register'" class="space-y-1 group animate-in slide-in-from-top-2 duration-300">
                 <label class="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 font-jakarta">Full Name</label>
                 <input v-model="fullName" type="text" placeholder="Amila Perera" class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-[#C1A172] transition-all" />
              </div>

              <!-- Email -->
              <div class="space-y-1 group">
                 <label class="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 font-jakarta">Professional Email</label>
                 <input v-model="email" type="email" placeholder="amila@digynex.ai" class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-[#C1A172] transition-all" />
              </div>
              
              <!-- Password -->
              <div class="space-y-1 group">
                 <label class="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 font-jakarta">Account Password</label>
                 <input v-model="password" type="password" placeholder="••••••••" class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-[#C1A172] transition-all" />
              </div>

              <!-- Error Message Display -->
              <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-1 duration-300">
                 <p class="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">{{ errorMessage }}</p>
              </div>

              <!-- Action Button -->
              <button @click="handleAuth" :disabled="isProcessing" class="w-full bg-[#C1A172] py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-[#0A2647] font-black uppercase tracking-widest text-[11px] relative overflow-hidden mt-4 group">
                 <div v-if="isProcessing" class="absolute inset-0 bg-[#0A2647] flex items-center justify-center gap-2">
                    <div class="w-3.5 h-3.5 rounded-full border-2 border-[#C1A172] border-t-transparent animate-spin"></div>
                    <span class="text-[10px] text-[#C1A172] font-black uppercase tracking-[0.2em]">{{ internalMode === 'login' ? 'Authenticating...' : 'Registering...' }}</span>
                 </div>
                 <LogIn v-if="internalMode === 'login'" class="w-4 h-4" />
                 <ArrowRight v-else class="w-4 h-4" />
                 <span>{{ internalMode === 'login' ? 'Sign In Now' : 'Sign Up Now' }}</span>
              </button>
           </div>

           <!-- Social Switch (Mock) -->
           <div class="flex items-center gap-3 py-2">
              <div class="flex-1 h-[1px] bg-white/5"></div>
              <span class="text-[8px] font-black text-white/10 uppercase tracking-widest font-jakarta">Global SSO</span>
              <div class="flex-1 h-[1px] bg-white/5"></div>
           </div>

           <div class="grid grid-cols-2 gap-3 pb-2">
              <button @click.prevent="signInWithSocial('google')" class="bg-white/5 border border-white/5 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-white/40 active:scale-95">
                 <Chrome class="w-3.5 h-3.5" />
                 <span class="text-[9px] font-black uppercase tracking-widest font-jakarta">Google</span>
              </button>
              <button @click.prevent="signInWithSocial('github')" class="bg-white/5 border border-white/5 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-white/40 active:scale-95">
                 <Github class="w-3.5 h-3.5" />
                 <span class="text-[9px] font-black uppercase tracking-widest font-jakarta">GitHub</span>
              </button>
           </div>
        </div>

        <!-- FOOTER TRUST BANNER -->
        <div class="p-6 bg-white/5 flex items-center justify-center gap-3 mt-auto">
           <ShieldCheck class="w-4 h-4 text-[#2C74B3] opacity-40" />
           <span class="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] font-jakarta">High-Security AI Sync</span>
        </div>
      </div>

    </div>
  </Transition>
</template>

<style scoped>
.font-playfair { font-family: 'Playfair Display', serif; }
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }

.fade-enter-active, .fade-leave-active { transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(1.1); filter: blur(20px); }
</style>
