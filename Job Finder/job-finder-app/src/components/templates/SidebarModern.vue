<script setup>
defineProps({
  userData: { type: Object, required: true },
  primaryColor: { type: String, default: '#0A2647' }
})
</script>

<template>
  <div class="cv-specimen sidebar-modern bg-slate-50 w-full h-full flex font-inter overflow-hidden shadow-inner"
       :style="{ '--cv-primary': primaryColor }">
    <!-- SIDEBAR -->
    <aside class="w-[35%] h-full p-8 text-white flex flex-col transition-colors duration-500"
           :style="{ backgroundColor: primaryColor }">
      <div class="mb-10 text-center">
        <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 mx-auto mb-6 shadow-2xl bg-white/5">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AmilaPerera" class="w-full h-full object-cover">
        </div>
        <h1 class="text-xl font-black uppercase tracking-tight leading-tight mb-2">
          {{ userData.basic.fullName || 'MASTER IDENTITY' }}
        </h1>
        <p class="text-[9px] font-bold text-white/50 tracking-[0.3em] uppercase italic">
          {{ userData.basic.headline || 'Project Manager' }}
        </p>
      </div>

      <div class="space-y-8 flex-1">
        <div class="sidebar-item">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 border-b border-white/10 pb-2">Contact Hub</h3>
          <div class="space-y-3">
             <p class="text-[9px] font-bold text-white/80 transition-all hover:translate-x-1">📍 {{ userData.basic.location || 'Global Focus' }}</p>
             <p class="text-[9px] font-bold text-white/80 transition-all hover:translate-x-1">📧 {{ userData.basic.email || 'sync@digynex.ai' }}</p>
             <p class="text-[9px] font-bold text-white/80 transition-all hover:translate-x-1">📞 {{ userData.basic.phone || '+46 000 0000' }}</p>
          </div>
        </div>

        <div class="sidebar-item">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 border-b border-white/10 pb-2">Expertise Stack</h3>
          <div class="space-y-4">
            <div v-for="skill in (userData.skills?.hard?.slice(0, 5) || ['Python', 'n8n', 'Supabase'])" :key="skill">
               <div class="flex justify-between items-center mb-1.5">
                  <span class="text-[8px] font-black uppercase tracking-widest">{{ skill }}</span>
                  <span class="text-[7px] font-bold text-white/40">MASTER</span>
               </div>
               <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-white/40 w-[90%]"></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] border-t border-white/5 pt-6 text-center">
        REF: DIGYNEX-SIDE-V6.5
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 bg-white p-10 flex flex-col">
      <div class="flex-1">
        <section class="mb-10">
          <header class="flex items-center gap-4 mb-4">
             <h2 class="text-[12px] font-black uppercase tracking-[0.3em] whitespace-nowrap" :style="{ color: primaryColor }">Professional Intent</h2>
             <div class="flex-1 h-[2px] bg-slate-100"></div>
          </header>
          <p class="text-[10.5px] text-slate-600 leading-relaxed italic border-l-4 pl-6 py-2 bg-slate-50/50 rounded-r-xl" :style="{ borderColor: primaryColor + '22' }">
            {{ userData.bio || 'Dynamic professional with 15+ years experience in neural architecture and project lead roles. Focused on high-velocity delivery cycles.' }}
          </p>
        </section>

        <!-- Dynamic Experiences -->
        <section class="mb-10">
          <header class="flex items-center gap-4 mb-6">
             <h2 class="text-[12px] font-black uppercase tracking-[0.3em] whitespace-nowrap" :style="{ color: primaryColor }">Career Trajectory</h2>
             <div class="flex-1 h-[2px] bg-slate-100"></div>
          </header>
          
          <div class="space-y-8">
            <div v-for="(exp, i) in userData.experiences" :key="i" class="relative pl-6 border-l-2" :style="{ borderColor: primaryColor + '11' }">
              <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm" :style="{ backgroundColor: primaryColor }"></div>
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-800">{{ exp.role || 'Senior Analyst' }}</h3>
                <span class="text-[9px] font-bold text-slate-400">2021 — PRESENT</span>
              </div>
              <p class="text-[10px] font-bold italic mb-3" :style="{ color: primaryColor }">{{ exp.company || 'Innovate Group' }}</p>
              <ul class="space-y-2">
                 <li class="text-[9.5px] text-slate-500 flex gap-3 leading-relaxed">
                    <span class="text-blue-400">•</span>
                    {{ exp.achievements || 'Spearheaded critical project audits for EU market expansion.' }}
                 </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <footer class="mt-auto pt-8 border-t border-slate-50 text-center">
        <p class="text-[8px] font-black text-slate-300 uppercase tracking-widest italic mb-4">
          Verified for professional screening by DigyNex AI Engine
        </p>
        <div class="flex justify-between items-center text-[7px] font-bold text-slate-200 uppercase tracking-tighter">
          <span>Page 1 of 1</span>
          <span>© 2026 CoreNexus Infrastructure</span>
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.font-inter { font-family: 'Inter', sans-serif; }
</style>
