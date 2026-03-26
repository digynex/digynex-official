<template>
  <div class="min-h-screen bg-[#020817] text-slate-50 font-sans selection:bg-primary/30 scroll-smooth">
    
    <!-- Top Navigation -->
    <nav class="absolute top-0 w-full border-b border-white/5 bg-white/5 backdrop-blur-xl z-50">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-2 font-bold text-2xl tracking-tight text-white cursor-pointer">
          <div class="p-1.5 bg-primary rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Layers class="w-6 h-6 text-white" />
          </div>
          DigyNex<span class="text-primary font-light">360</span>
        </div>
        
        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" class="hover:text-white transition-colors">Features</a>
          <a href="#solutions" class="hover:text-white transition-colors">Solutions</a>
          <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
        </div>
        
        <div class="flex items-center gap-4">
          <a href="#contact" class="hidden sm:block text-sm font-bold text-slate-300 hover:text-white transition-colors">Contact Sales</a>
          <a href="#contact" class="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-200 rounded-lg text-sm font-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 text-center">
            Book Demo
          </a>
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

        <!-- Dashboard Video Thumbnail -->
        <div class="mt-20 relative mx-auto max-w-5xl group animate-[slideUp_1s_ease-out]">
          <div class="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div class="relative w-full aspect-video rounded-2xl bg-[#0f172a] border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col cursor-pointer group/video">
             
             <!-- Actual Demo Video with Poster (Commented out to pass build until YouTube link is ready) -->
             <!-- <video class="absolute inset-0 w-full h-full object-cover z-20 group-hover/video:scale-[1.02] transition-transform duration-1000 bg-[#0f172a]" controls preload="metadata" poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop">
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
             </video> -->
             <div class="absolute inset-0 bg-[#0f172a] flex items-center justify-center">
                <p class="text-slate-500 text-sm italic">Video Demo Coming Soon...</p>
             </div>

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
          <div @click="openFeature('insights')" class="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer block no-underline hover:-translate-y-1">
            <div class="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain class="w-7 h-7 text-blue-400" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">AI Deep Insights</h3>
            <p class="text-slate-400 text-sm leading-relaxed font-medium">Auto-analyzes hidden transaction trends and summarizes them into actionable sentences for rapid executive review.</p>
          </div>

          <!-- Feature 2 -->
          <div @click="openFeature('forecasting')" class="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer block no-underline hover:-translate-y-1">
            <div class="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LineChart class="w-7 h-7 text-accent" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Predictive Forecasting</h3>
            <p class="text-slate-400 text-sm leading-relaxed font-medium">Compare actual revenue against AI-generated target paths visually, ensuring you hit financial objectives before quarter-end.</p>
          </div>

          <!-- Feature 3 -->
          <div @click="openFeature('alerts')" class="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer block no-underline hover:-translate-y-1">
            <div class="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <AlertTriangle class="w-7 h-7 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Anomaly Alerts</h3>
            <p class="text-slate-400 text-sm leading-relaxed font-medium">Real-time alerts intercept sudden expense spikes or revenue segment drops instantly, turning defense into offense.</p>
          </div>

        </div>
      </div>
    </section>
    <!-- Solutions / Demo Section -->
    <section id="solutions" class="py-24 bg-[#020817] relative">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-3xl md:text-5xl font-black text-white mb-6">AI Decisions, <br/>Simplified.</h2>
            <p class="text-slate-400 text-lg mb-8 leading-relaxed">
              We don't just show you data; we tell you what it means. DigyNex 360 processes thousands of data points to generate natural-language insights that help you lead.
            </p>
            <ul class="space-y-4 mb-10">
              <li class="flex items-center gap-3 text-slate-300 font-medium">
                <div class="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                </div>
                Real-time Revenue Attribution
              </li>
              <li class="flex items-center gap-3 text-slate-300 font-medium">
                <div class="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                </div>
                Automated Profit Mapping
              </li>
              <li class="flex items-center gap-3 text-slate-300 font-medium">
                <div class="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                </div>
                Enterprise-grade Data Encryption
              </li>
            </ul>
            <a href="#contact" class="inline-flex px-8 py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-all">
              Request Full Demo
            </a>
          </div>
          <div class="relative group">
            <div class="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-10 blur-2xl rounded-3xl group-hover:opacity-20 transition-opacity"></div>
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop" 
                 alt="Dashboard Interface" 
                 class="relative rounded-2xl border border-white/5 shadow-2xl" />
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-24 bg-[#050b1a] relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-5xl font-black text-white mb-4">Transparent Enterprise Pricing</h2>
        <p class="text-slate-400 mb-16 max-w-2xl mx-auto text-lg">Scale with confidence. Choose the tier that matches your business velocity.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <!-- Starter -->
          <div class="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col hover:border-white/20 transition-all">
            <h3 class="text-xl font-bold text-white mb-2">Starter</h3>
            <div class="text-primary text-sm font-bold uppercase tracking-wider mb-6">Up to 500 orders/mo</div>
            <div class="text-4xl font-black text-white mb-1">$89 <span class="text-sm font-medium text-slate-500">/mo</span></div>
            <p class="text-slate-500 text-sm mb-8">LKR 12,000 / month (Regional Office)</p>
            <ul class="space-y-4 mb-10 flex-grow text-sm text-slate-400">
              <li class="flex items-center gap-2"><div class="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]">✓</div> Basic KPI Dashboard</li>
              <li class="flex items-center gap-2"><div class="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]">✓</div> Daily AI Insights</li>
              <li class="flex items-center gap-2"><div class="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]">✓</div> Standard Reports</li>
            </ul>
            <button class="w-full py-3 border border-white/10 rounded-lg text-white font-bold hover:bg-white/5 transition-all">Get Started</button>
          </div>

          <!-- Business -->
          <div class="p-8 rounded-2xl bg-primary/10 border-2 border-primary flex flex-col relative transform scale-105 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
            <div class="absolute top-0 right-0 p-3">
              <span class="bg-primary text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">Most Popular</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Business</h3>
            <div class="text-primary text-sm font-bold uppercase tracking-wider mb-6">Unlimited Orders</div>
            <div class="text-4xl font-black text-white mb-1">$149 <span class="text-sm font-medium text-slate-500">/mo</span></div>
            <p class="text-slate-500 text-sm mb-8">LKR 18,000 / month (Regional Office)</p>
            <ul class="space-y-4 mb-10 flex-grow text-sm text-slate-400">
              <li class="flex items-center gap-2"><div class="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]">✓</div> Advanced AI Forecasting</li>
              <li class="flex items-center gap-2"><div class="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]">✓</div> Real-time Anomaly Alerts</li>
              <li class="flex items-center gap-2"><div class="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]">✓</div> Multi-currency Support</li>
              <li class="flex items-center gap-2"><div class="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]">✓</div> Priority Human Support</li>
            </ul>
            <button class="w-full py-3 bg-primary rounded-lg text-white font-black hover:bg-blue-600 transition-all shadow-lg shadow-primary/20">Go Pro Now</button>
          </div>

          <!-- Enterprise -->
          <div class="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col hover:border-white/20 transition-all">
            <h3 class="text-xl font-bold text-white mb-2">Enterprise</h3>
            <div class="text-primary text-sm font-bold uppercase tracking-wider mb-6">Custom Scale</div>
            <div class="text-4xl font-black text-white mb-1">Custom</div>
            <p class="text-slate-500 text-sm mb-8">Quote based on infrastructure</p>
            <ul class="space-y-4 mb-10 flex-grow text-sm text-slate-400">
              <li class="flex items-center gap-2"><div class="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]">✓</div> On-premise Deployment</li>
              <li class="flex items-center gap-2"><div class="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]">✓</div> Custom AI Model Training</li>
              <li class="flex items-center gap-2"><div class="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]">✓</div> Dedicated Success Manager</li>
            </ul>
            <button class="w-full py-3 border border-white/10 rounded-lg text-white font-bold hover:bg-white/5 transition-all">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
    <!-- Contact Section -->
    <section id="contact" class="py-24 bg-[#020817] relative">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 class="text-3xl md:text-5xl font-black text-white mb-6">Let's Fuel Your Enterprise Growth.</h2>
            <p class="text-slate-400 text-lg mb-8">Ready to deploy customized AI agents for your business? Our team is ready to map your intelligence journey.</p>
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Mail class="w-6 h-6" />
                </div>
                <div>
                  <div class="text-white font-bold">Official Email</div>
                  <div class="text-slate-500 text-sm font-medium hover:text-primary transition-colors cursor-pointer">info@digynex.se</div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Layers class="w-6 h-6" />
                </div>
                <div>
                  <div class="text-white font-bold">Global Presence</div>
                  <div class="text-slate-500 text-sm font-medium uppercase tracking-widest">Sweden • Sri Lanka</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm shadow-2xl">
            <form @submit.prevent class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" class="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-all placeholder:text-slate-600" />
                <input type="email" placeholder="Business Email" class="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-all placeholder:text-slate-600" />
              </div>
              <input type="text" placeholder="Company Name" class="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-all placeholder:text-slate-600" />
              <textarea v-model="contactMessage" rows="4" placeholder="How can we help?" class="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-all placeholder:text-slate-600"></textarea>
              <button class="w-full py-4 bg-primary text-white font-black rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Section (Legal & Contact) -->
    <footer class="pt-24 pb-12 bg-[#020817] border-t border-white/5 relative overflow-hidden">
      <!-- Glow effect for footer -->
      <div class="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-primary/10 blur-[80px] -z-10"></div>
      
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div class="col-span-1 md:col-span-1">
            <div class="flex items-center gap-2 font-bold text-xl tracking-tight text-white mb-6">
              <div class="p-1 bg-primary rounded shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                <Layers class="w-4 h-4 text-white" />
              </div>
              DigyNex<span class="text-primary font-light">360</span>
            </div>
            <p class="text-slate-500 text-sm leading-relaxed mb-6">
              Empowering scaling enterprises with data-driven decision intelligence. Official part of the DigyNex Global IT Ecosystem.
            </p>
            <div class="flex items-center gap-4 text-slate-400">
               <a href="https://facebook.com/digynex.se" target="_blank" class="hover:text-primary transition-colors"><i class="fa-brands fa-facebook-f text-lg"></i></a>
               <a href="https://www.linkedin.com/in/digynex-amila" target="_blank" class="hover:text-primary transition-colors"><i class="fa-brands fa-linkedin text-lg"></i></a>
               <a href="https://github.com/digynex" target="_blank" class="hover:text-primary transition-colors"><i class="fa-brands fa-github text-lg"></i></a>
            </div>
          </div>

          <div>
             <h4 class="text-white font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
             <ul class="space-y-4 text-slate-400 text-sm">
               <li><a href="#features" class="hover:text-white transition-colors">Performance Engine</a></li>
               <li><a href="#solutions" class="hover:text-white transition-colors">Decision Mapping</a></li>
               <li><a href="#pricing" class="hover:text-white transition-colors">Pricing Options</a></li>
               <li><router-link to="/dashboard" class="hover:text-white transition-colors">Live Dashboard</router-link></li>
             </ul>
          </div>

          <div>
             <h4 class="text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
             <ul class="space-y-4 text-slate-400 text-sm">
               <li><a href="https://digynex.se/about.html" class="hover:text-white transition-colors">About Us</a></li>
               <li><a href="https://digynex.se/contact.html" class="hover:text-white transition-colors">Contact Expert</a></li>
               <li><a href="https://digynex.se/portfolio/index.html" class="hover:text-white transition-colors">Success Stories</a></li>
             </ul>
          </div>

          <div>
             <h4 class="text-white font-bold mb-6 text-sm uppercase tracking-widest">Legal & Privacy</h4>
             <ul class="space-y-4 text-slate-400 text-sm">
               <li><a href="https://digynex.se/terms.html" class="hover:text-white transition-colors">Terms of Service</a></li>
               <li><a href="https://digynex.se/privacy.html" class="hover:text-white transition-colors">Privacy Policy</a></li>
               <li><a href="https://digynex.se/cookies.html" class="hover:text-white transition-colors">Cookie Policy</a></li>
               <li><a href="https://digynex.se/refund.html" class="hover:text-white transition-colors">Refund Policy</a></li>
             </ul>
          </div>
        </div>

        <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p class="text-slate-500 text-xs">
            © 2026 DigyNex Systems 360 | Global Business Intelligence Ecosystem.
          </p>
          <div class="flex items-center gap-2 text-slate-600 text-[10px] uppercase tracking-widest">
            <span>Powered by DigyNex AI Agents</span>
            <span class="opacity-30">|</span>
            <span>Sweden HQ</span>
          </div>
        </div>
      </div>
    </footer>


      <!-- Feature Detail Modals -->
    <div v-if="activeFeature" @click.self="selectedFeatureKey = null" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div class="max-w-2xl w-full bg-[#0f172a] border border-white/10 rounded-3xl p-10 relative shadow-2xl overflow-hidden">
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
        
        <button @click="selectedFeatureKey = null" class="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
          <X class="w-6 h-6" />
        </button>

        <div class="flex items-center gap-6 mb-8">
           <div :class="`w-20 h-20 rounded-2xl flex items-center justify-center ${activeFeature.color} shadow-lg`">
              <component :is="activeFeature.icon" class="w-10 h-10" />
           </div>
           <div>
              <h3 class="text-3xl font-black text-white">{{ activeFeature.title }}</h3>
              <p class="text-primary font-bold uppercase tracking-widest text-xs mt-1">Enterprise Module V3.0</p>
           </div>
        </div>

        <div class="space-y-6 text-slate-400 leading-relaxed font-medium">
           <p>{{ activeFeature.description }}</p>
           <div class="bg-white/5 rounded-xl p-6 border border-white/5">
              <h4 class="text-white font-bold mb-4 flex items-center gap-2">
                 <CheckCircle class="w-4 h-4 text-green-500" />
                 Key Technical Capabilities
              </h4>
              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                 <li v-for="cap in activeFeature.caps" :key="cap" class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-700"></span> {{ cap }}
                 </li>
              </ul>
           </div>
        </div>

        <div class="mt-10 flex gap-4">
           <router-link to="/dashboard" class="flex-1 py-4 bg-primary text-white text-center font-black rounded-xl hover:bg-blue-600 transition-all">
              Launch Live Module
           </router-link>
           <a href="#contact" @click="requestSetup" class="flex-1 py-4 bg-white/5 border border-white/10 text-white text-center font-bold rounded-xl hover:bg-white/10 transition-all">
              Request Setup
           </a>
        </div>
      </div>
    </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Layers, ArrowRight, Brain, LineChart, AlertTriangle, Mail, Phone, MessageCircle, X, CheckCircle } from 'lucide-vue-next'

const selectedFeatureKey = ref(null)

const features = {
  insights: {
    title: 'AI Deep Insights',
    description: 'Our proprietary LLM analyzes raw transaction data in real-time to surface hidden patterns, cost leakages, and growth opportunities that traditional BI tools miss entirely.',
    icon: Brain,
    color: 'bg-blue-500/20 text-blue-400',
    caps: ['Sentiment Analysis', 'Trend Prediction', 'NLP Summaries', 'Executive Briefings']
  },
  forecasting: {
    title: 'Predictive Forecasting',
    description: 'Leverage historical data and market indicators to build precise revenue and expense paths. Compare daily trajectory against monthly targets with 94%+ accuracy.',
    icon: LineChart,
    color: 'bg-accent/20 text-accent',
    caps: ['Market Modeling', 'Target Deviation', 'Revenue Velocity', 'Cash Flow Scenarios']
  },
  alerts: {
    title: 'Anomaly Alerts',
    description: 'Instant notification engine for when your business reality shifts. From suspicious expense spikes to sudden revenue segment drops, we catch it before it hits the bottom line.',
    icon: AlertTriangle,
    color: 'bg-red-500/20 text-red-500',
    caps: ['Expense Spikes', 'Segment Drops', 'Risk Detection', 'Real-time Push']
  }
}

const activeFeature = computed(() => {
  return selectedFeatureKey.value ? features[selectedFeatureKey.value] : null
})

const openFeature = (key) => {
  selectedFeatureKey.value = key
}

const contactMessage = ref('')

const requestSetup = () => {
  if (activeFeature.value) {
    contactMessage.value = `I am interested in setting up the "${activeFeature.value.title}" module for my enterprise. Please provide more details on implementation steps.`
  }
  selectedFeatureKey.value = null
}
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
