<template>
  <div class="min-h-screen bg-[#020817] text-slate-50 font-sans selection:bg-primary/30">
    
    <!-- Top Navigation -->
    <nav class="absolute top-0 w-full border-b border-white/5 bg-white/5 backdrop-blur-xl z-50">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-2 font-bold text-2xl tracking-tight text-white cursor-pointer">
          <div class="p-1.5 bg-primary rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Layers class="w-6 h-6 text-white" />
          </div>
          DigyNex<span class="text-primary font-light">DSS</span>
        </div>
        
        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" class="hover:text-white transition-colors">Features</a>
          <a href="#demo" class="hover:text-white transition-colors">Solutions</a>
          <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
        </div>
        
        <div class="flex items-center gap-4">
          <a href="mailto:contact@digynex.com" class="hidden sm:block text-sm font-bold text-slate-300 hover:text-white transition-colors">Contact Sales</a>
          <router-link to="/dashboard" class="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-200 rounded-lg text-sm font-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:-translate-y-0.5">
            Book Demo
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <!-- Glow effects -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 text-center relative z-10">
        
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm animate-[slideDown_0.5s_ease-out]">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next-Gen Enterprise BI is Here
        </div>

        <h1 class="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 leading-[1.1] animate-[slideUp_0.6s_ease-out]">
          Turn Data into <br class="hidden md:block"/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-accent">Decisions.</span>
        </h1>
        
        <p class="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium animate-[slideUp_0.7s_ease-out]">
          Stop guessing. The ultimate AI-powered Decision Intelligence System designed exclusively for scaling enterprises. Real-time forecasting, anomaly alerts, and profit mapping.
        </p>
        
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-[slideUp_0.8s_ease-out]">
          <router-link to="/dashboard" class="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-xl text-base font-black transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2 group">
            Explore Executive Dashboard <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </router-link>
          <button class="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-base font-bold transition-all backdrop-blur-sm">
            Watch Presentation
          </button>
        </div>

        <!-- Dashboard Abstract Mockup (The "Screenshot") -->
        <div class="mt-20 relative mx-auto max-w-5xl group animate-[slideUp_1s_ease-out]">
          <div class="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div class="relative rounded-2xl bg-[#0f172a] border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col h-[500px]">
             <!-- Mockup Browser Header -->
             <div class="h-10 bg-slate-900/80 border-b border-slate-800 flex items-center px-4 gap-2">
               <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
               <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
               <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
             </div>
             <!-- Mockup content area -->
             <div class="flex-1 p-6 flex gap-6 opacity-80 group-hover:opacity-100 transition-opacity duration-700 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-900">
               <!-- Left Nav Mock -->
               <div class="w-48 hidden md:flex flex-col gap-4">
                 <div class="h-8 bg-slate-800 rounded w-3/4 mb-4"></div>
                 <div class="h-10 bg-primary/20 border border-primary/30 rounded-lg w-full"></div>
                 <div class="h-10 bg-slate-800 rounded-lg w-full"></div>
                 <div class="h-10 bg-slate-800 rounded-lg w-full"></div>
               </div>
               <!-- Main Content Mock -->
               <div class="flex-1 flex flex-col gap-6">
                 <!-- KPI Row Mock -->
                 <div class="grid grid-cols-3 gap-4 h-32">
                   <div class="col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-4 flex flex-col justify-between relative overflow-hidden">
                     <div class="h-4 bg-slate-700 rounded w-1/3"></div>
                     <div class="h-10 bg-slate-600 rounded w-1/2"></div>
                   </div>
                   <div class="col-span-1 bg-slate-800 rounded-xl border border-slate-700 p-4"></div>
                 </div>
                 <!-- Chart Row Mock -->
                 <div class="flex-1 bg-slate-800 rounded-xl border border-slate-700 relative overflow-hidden flex items-end p-4">
                    <!-- Abstract Chart bars -->
                    <div class="w-full h-full flex items-end justify-between gap-2 opacity-50 relative z-10">
                      <div class="w-full bg-primary/40 rounded-t h-[40%]"></div>
                      <div class="w-full bg-primary/40 rounded-t h-[60%]"></div>
                      <div class="w-full bg-primary/60 rounded-t h-[50%]"></div>
                      <div class="w-full bg-primary/80 rounded-t h-[80%]"></div>
                      <div class="w-full bg-accent/60 rounded-t h-[100%]"></div>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-20"></div>
                 </div>
               </div>
             </div>
             <!-- Play Button Overlay -->
             <router-link to="/dashboard" class="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/20 group-hover:bg-transparent transition-colors duration-500 cursor-pointer">
                <div class="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <Play class="w-8 h-8 ml-1" />
                </div>
             </router-link>
          </div>
        </div>
        
      </div>
    </main>

    <!-- Key Features Section (The Selling Machine) -->
    <section id="features" class="py-24 bg-[#050b1a] relative border-t border-white/5">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Enterprise Intelligence Engine</h2>
          <p class="text-slate-400 max-w-2xl mx-auto font-medium text-lg">Built to process millions of transactions and surface exactly what demands your attention today.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Feature 1 -->
          <div class="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group cursor-default">
            <div class="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain class="w-7 h-7 text-blue-400" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">AI Deep Insights</h3>
            <p class="text-slate-400 text-sm leading-relaxed font-medium">Auto-analyzes hidden transaction trends and summarizes them into actionable sentences for rapid executive review.</p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group cursor-default">
            <div class="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LineChart class="w-7 h-7 text-accent" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Predictive Forecasting</h3>
            <p class="text-slate-400 text-sm leading-relaxed font-medium">Compare actual revenue against AI-generated target paths visually, ensuring you hit financial objectives before quarter-end.</p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group cursor-default">
            <div class="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <AlertTriangle class="w-7 h-7 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Anomaly Alerts</h3>
            <p class="text-slate-400 text-sm leading-relaxed font-medium">Real-time alerts intercept sudden expense spikes or revenue segment drops instantly, turning defense into offense.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-[#020817] to-slate-900 -z-10"></div>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1/2 bg-primary/10 blur-[100px] pointer-events-none -z-10"></div>
      
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to upgrade your decision making?</h2>
        <p class="text-slate-400 font-medium mb-10 text-lg">Join elite organizations scaling their operations with zero guesswork.</p>
        <router-link to="/dashboard" class="inline-flex px-10 py-5 bg-white text-slate-900 hover:bg-slate-200 rounded-xl text-lg font-black transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:-translate-y-1 items-center justify-center gap-2">
          Initialize Demo Board <ArrowRight class="w-5 h-5" />
        </router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
import { Layers, ArrowRight, Play, Brain, LineChart, AlertTriangle } from 'lucide-vue-next'
</script>

<style scoped>
@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
