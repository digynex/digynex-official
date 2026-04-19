<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Sparkles, Zap, Crown, Gift, Clock, Users, Star, ArrowRight, Check, X, Shield } from 'lucide-vue-next'

const props = defineProps({
    userProfile: Object,
    t: Function
})
const emit = defineEmits(['close', 'handleAction'])

// ─── SLOT ENGINE ──────────────────────────────────────────────────
// In production: fetch from Supabase `system_config` table → key: 'founder_slots_remaining'
const TOTAL_SLOTS = 100
const slotsRemaining = ref(67) // REPLACE: fetch from profileService.getFounderSlotsRemaining()
const isClaiming = ref(false)
const claimed = ref(false)

// ─── COUNTDOWN TIMER (72h FOMO Engine) ───────────────────────────
const OFFER_END = new Date(Date.now() + 72 * 60 * 60 * 1000)
const timeLeft = ref({ h: '72', m: '00', s: '00' })
let timerInterval = null

const updateTimer = () => {
    const diff = OFFER_END - Date.now()
    if (diff <= 0) { timeLeft.value = { h: '00', m: '00', s: '00' }; return }
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0')
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
    timeLeft.value = { h, m, s }
}

onMounted(() => { updateTimer(); timerInterval = setInterval(updateTimer, 1000) })
onUnmounted(() => clearInterval(timerInterval))

// ─── COMPUTED ─────────────────────────────────────────────────────
const slotPercentage = computed(() => ((TOTAL_SLOTS - slotsRemaining.value) / TOTAL_SLOTS) * 100)
const isAlmostGone = computed(() => slotsRemaining.value <= 20)
const isSoldOut = computed(() => slotsRemaining.value <= 0)

// ─── CLAIM ACTION ─────────────────────────────────────────────────
const claimFounderPass = async () => {
    if (isClaiming.value || isSoldOut.value) return
    isClaiming.value = true
    // In production: redirect to Stripe one-time payment link
    emit('handleAction', 'founder_pass_checkout')
    // Simulate Stripe redirect (replace with real Stripe checkout URL)
    await new Promise(r => setTimeout(r, 1500))
    // window.open('https://buy.stripe.com/YOUR_FOUNDER_PASS_LINK', '_blank')
    isClaiming.value = false
}

const perks = [
    { icon: Crown, label: 'Annual Elite Access', sub: 'Premium access for a full year' },
    { icon: Zap, label: 'Unlimited CV Exports', sub: 'No weekly limits, full access' },
    { icon: Sparkles, label: 'AI Stealth Keywords', sub: 'Full ATS domination suite' },
    { icon: Shield, label: 'Priority Support', sub: 'Direct founder channel access' },
    { icon: Star, label: 'All Elite Palettes', sub: 'Every premium visual identity' },
    { icon: Gift, label: 'Zero Surprises', sub: 'Lock in this rate for renewals' },
]
</script>

<template>
  <div class="fixed inset-0 z-[8000] flex items-end sm:items-center justify-center">
    <!-- Backdrop -->
    <div @click="emit('close')" class="absolute inset-0 bg-[#030D1A]/95 backdrop-blur-3xl"></div>

    <!-- Card -->
    <div class="relative w-full max-w-[360px] mx-4 mb-0 sm:mb-0 rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden
                animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                border border-[#C1A172]/20 shadow-[0_-40px_120px_rgba(193,161,114,0.15)]"
         style="background: linear-gradient(160deg, #0A2647 0%, #051124 50%, #0D0A00 100%);">

      <!-- SOLD OUT BANNER -->
      <div v-if="isSoldOut" class="absolute inset-x-0 top-0 z-20 bg-red-500/90 backdrop-blur-sm py-2 text-center">
        <span class="text-[10px] font-black text-white uppercase tracking-[0.3em]">⚡ ALL FOUNDER SLOTS CLAIMED</span>
      </div>

      <!-- ALMOST GONE BANNER -->
      <div v-else-if="isAlmostGone"
           class="absolute inset-x-0 top-0 z-20 bg-orange-500/90 backdrop-blur-sm py-2 text-center animate-pulse">
        <span class="text-[10px] font-black text-white uppercase tracking-[0.3em]">🔥 ALMOST GONE — {{ slotsRemaining }} SLOTS LEFT</span>
      </div>

      <!-- Close -->
      <button @click="emit('close')"
              class="absolute top-5 right-5 z-30 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
        <X class="w-4 h-4 text-white/60" />
      </button>

      <!-- Ambient Glow -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#C1A172]/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div class="relative z-10 p-6 space-y-5">

        <!-- Header -->
        <div class="text-center space-y-2 pt-4">
          <div class="flex items-center justify-center gap-2 mb-3">
            <div class="w-10 h-10 bg-gradient-to-br from-[#C1A172] to-[#8E7345] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#C1A172]/30">
              <Crown class="w-5 h-5 text-[#0A2647]" />
            </div>
          </div>
          <div class="px-3 py-1 bg-[#C1A172]/10 border border-[#C1A172]/30 rounded-full inline-flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full bg-[#C1A172] animate-pulse"></div>
            <span class="text-[8px] font-black text-[#C1A172] uppercase tracking-[0.3em]">Founder's Edition — Limited Offer</span>
          </div>
          <h2 class="text-[28px] font-black text-white leading-none tracking-tight mt-2">
            Founder's Annual<br/>
            <span style="background: linear-gradient(90deg, #C1A172, #FFD700, #C1A172); -webkit-background-clip: text; -webkit-text-fill-color: transparent;" 
                  class="text-[32px]">$149</span>
            <span class="text-white text-[16px]"> / year</span>
          </h2>
          <p class="text-[11px] text-white/40 font-medium">vs $49/month ($588/year) — save $439 annually</p>
        </div>

        <!-- Slot Counter -->
        <div class="bg-white/[0.04] border border-white/5 rounded-2xl p-4 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Users class="w-3.5 h-3.5 text-[#C1A172]" />
              <span class="text-[9px] font-black text-white/60 uppercase tracking-widest">Founder Slots</span>
            </div>
            <span class="text-[11px] font-black" :class="isAlmostGone ? 'text-orange-400' : 'text-white'">
              {{ slotsRemaining }} / {{ TOTAL_SLOTS }} remaining
            </span>
          </div>
          <!-- Progress Bar -->
          <div class="h-2 bg-white/5 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-1000"
                 :style="{ 
                   width: `${slotPercentage}%`,
                   background: isAlmostGone ? 'linear-gradient(90deg, #f97316, #ef4444)' : 'linear-gradient(90deg, #C1A172, #FFD700)'
                 }"></div>
          </div>
          <p class="text-[8px] font-bold text-white/30 uppercase tracking-widest text-center">
            {{ slotPercentage.toFixed(0) }}% claimed — first 100 founders only
          </p>
        </div>

        <!-- Countdown Timer -->
        <div class="flex items-center justify-center gap-3">
          <Clock class="w-3.5 h-3.5 text-[#C1A172]/60" />
          <span class="text-[8px] font-black text-white/30 uppercase tracking-widest">Offer expires in</span>
          <div class="flex items-center gap-1.5">
            <div v-for="(val, key) in timeLeft" :key="key" class="flex items-center gap-1">
              <div class="bg-[#0A2647] border border-[#C1A172]/20 rounded-lg px-2 py-1 min-w-[32px] text-center">
                <span class="text-[14px] font-black text-[#C1A172] tabular-nums">{{ val }}</span>
              </div>
              <span v-if="key !== 's'" class="text-white/30 font-black text-[12px]">:</span>
            </div>
          </div>
        </div>

        <!-- Perks List -->
        <div class="grid grid-cols-2 gap-2">
          <div v-for="perk in perks" :key="perk.label"
               class="flex items-start gap-2 p-2.5 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
            <div class="w-6 h-6 bg-[#C1A172]/10 rounded-lg flex items-center justify-center shrink-0 border border-[#C1A172]/20">
              <component :is="perk.icon" class="w-3 h-3 text-[#C1A172]" />
            </div>
            <div>
              <p class="text-[9px] font-black text-white leading-tight">{{ perk.label }}</p>
              <p class="text-[7px] font-bold text-white/30 leading-tight mt-0.5">{{ perk.sub }}</p>
            </div>
          </div>
        </div>

        <!-- CTA Button -->
        <div class="space-y-2">
          <button @click="claimFounderPass"
                  :disabled="isClaiming || isSoldOut"
                  class="w-full py-4 rounded-[1.5rem] flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group"
                  :class="isSoldOut 
                    ? 'bg-white/5 border border-white/10 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#C1A172] via-[#FFD700] to-[#C1A172] bg-[length:200%] hover:bg-right-center shadow-[0_15px_40px_rgba(193,161,114,0.4)] hover:shadow-[0_20px_60px_rgba(193,161,114,0.6)] hover:scale-[1.02] active:scale-95'">
            <!-- Shimmer -->
            <div v-if="!isSoldOut" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            
            <div v-if="isClaiming" class="w-4 h-4 rounded-full border-2 border-[#0A2647]/50 border-t-[#0A2647] animate-spin"></div>
            <Crown v-else-if="!isSoldOut" class="w-4 h-4 text-[#0A2647] relative z-10" />

            <span class="text-[12px] font-black uppercase tracking-[0.2em] relative z-10"
                  :class="isSoldOut ? 'text-white/30' : 'text-[#0A2647]'">
              {{ isSoldOut ? 'All Slots Claimed' : isClaiming ? 'Securing Your Slot...' : 'Claim Founder Pass — $149' }}
            </span>
            <ArrowRight v-if="!isSoldOut && !isClaiming" class="w-4 h-4 text-[#0A2647] relative z-10" />
          </button>

          <p class="text-center text-[8px] font-bold text-white/20 uppercase tracking-widest">
            Billed annually · Lock in founder rate · Instant access
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.tabular-nums { font-variant-numeric: tabular-nums; }
</style>
