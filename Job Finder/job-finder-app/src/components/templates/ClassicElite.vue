<script setup>
defineProps({
  userData: { type: Object, required: true },
  primaryColor: { type: String, default: '#0A2647' }
})
</script>

<template>
  <div class="cv-specimen classic-elite bg-white w-full h-full p-8 font-sans overflow-hidden" 
       :style="{ '--cv-primary': primaryColor }">
    <!-- Header -->
    <header class="border-b-4 pb-6 mb-8 text-center" :style="{ borderColor: primaryColor }">
      <h1 class="text-4xl font-black uppercase tracking-tight mb-2" :style="{ color: primaryColor }">
        {{ userData.basic.fullName || 'MASTER IDENTITY' }}
      </h1>
      <p class="text-xs font-bold uppercase tracking-[0.4em] opacity-60">
        {{ userData.basic.headline || 'PROFESSIONAL SYNOPSIS' }}
      </p>
      <div class="flex justify-center gap-4 mt-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
        <span>{{ userData.basic.location || 'GLOBAL FOCUS' }}</span>
        <span>•</span>
        <span>{{ userData.basic.email || 'SYNC@DIGYNEX.AI' }}</span>
      </div>
    </header>

    <div class="space-y-10">
      <!-- Summary -->
      <section v-if="userData.bio || !userData.basic.fullName" class="space-y-3">
         <div class="flex items-center gap-4">
            <h3 class="text-[11px] font-black uppercase tracking-[0.4em]" :style="{ color: primaryColor }">Impact</h3>
            <div class="flex-1 h-[1px]" :style="{ backgroundColor: primaryColor + '22' }"></div>
         </div>
         <p class="text-[10px] leading-relaxed text-slate-600 italic border-l-2 pl-4" :style="{ borderColor: primaryColor + '44' }">
           {{ userData.bio || 'Neural optimization engine initialized. Awaiting professional impact synthesis...' }}
         </p>
      </section>

      <!-- Experience -->
      <section class="space-y-6">
         <div class="flex items-center gap-4">
            <h3 class="text-[11px] font-black uppercase tracking-[0.4em]" :style="{ color: primaryColor }">Leadership Evolution</h3>
            <div class="flex-1 h-[1px]" :style="{ backgroundColor: primaryColor + '22' }"></div>
         </div>
         
         <div v-for="(exp, i) in userData.experiences" :key="i" class="space-y-2">
            <div class="flex justify-between items-baseline">
               <span class="text-[11px] font-black uppercase tracking-widest" :style="{ color: primaryColor }">
                 {{ exp.role || 'Strategic Lead' }}
               </span>
               <span class="text-[9px] font-bold text-slate-400 uppercase">2021 — PRESENT</span>
            </div>
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ exp.company || 'DIGYNEX SOLUTIONS LTD' }}</p>
            <p class="text-[9px] text-slate-600 leading-relaxed">{{ exp.achievements || 'Architected global neural networks for Fortune 500 conversion metrics.' }}</p>
         </div>
      </section>

      <!-- Skills (Horizontal Pack) -->
      <section class="space-y-4">
         <div class="flex items-center gap-4">
            <h3 class="text-[11px] font-black uppercase tracking-[0.4em]" :style="{ color: primaryColor }">Neural Expertise</h3>
            <div class="flex-1 h-[1px]" :style="{ backgroundColor: primaryColor + '22' }"></div>
         </div>
         <div class="flex flex-wrap gap-x-6 gap-y-2">
            <div v-for="skill in (userData.skills?.hard || ['Python', 'n8n', 'Supabase'])" :key="skill" class="flex items-center gap-2">
               <div class="w-1 h-1 rounded-full" :style="{ backgroundColor: primaryColor }"></div>
               <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ skill }}</span>
            </div>
         </div>
      </section>
    </div>

    <!-- ATS Stealth Layer (1px Calibration) -->
    <div class="absolute bottom-0 left-0 w-full h-[1px] opacity-[0.01] pointer-events-none overflow-hidden text-[1px]">
        {{ userData.secretKeywords?.join(', ') || 'AI, ATS, RECRUITMENT, NEURAL' }}
    </div>
  </div>
</template>

<style scoped>
.cv-specimen {
  -webkit-print-color-adjust: exact;
}
</style>
