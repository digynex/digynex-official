<template>
  <div class="h-screen bg-slate-50 flex text-slate-800 font-sans overflow-hidden">
    <Sidebar @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

    <main class="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f7fb] relative">
      <TopHeader @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

      <div class="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase tracking-wide italic">
                  <component :is="activeTab === 'Sector ROI Intelligence' ? Target : Layers" :class="activeTab === 'Sector ROI Intelligence' ? 'text-amber-500 animate-pulse' : 'text-primary'" class="w-6 h-6" />
                  {{ activeTab === 'Sector ROI Intelligence' ? 'NEXUS STRATEGIC ROI HUB' : 'Project Nexus' }}
                </h1>
                <div class="flex items-center gap-4 mt-2">
                    <!-- STRATEGIC PROJECT SELECTOR -->
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm group hover:border-primary/50 transition-all cursor-pointer">
                            <div class="p-1.5 bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary rounded-lg">
                                <Layers class="w-4 h-4" />
                            </div>
                            <select v-model="selectedProject" class="bg-transparent border-none text-[11px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer min-w-[150px]">
                                <option value="all">Global Ecosystem (All Projects)</option>
                                <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
                            </select>
                        </div>
                        <button @click="isCreateProjectOpen = true" class="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                            <Plus class="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="authStore.user.role !== 'subcontractor'" class="flex items-center gap-3 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                <button 
                    v-for="t in (activeTab === 'Sector ROI Intelligence' ? ['Sector ROI Intelligence'] : ['Strategic Intelligence', 'Advanced Milestone Health', 'Bulk Ingest Hub', 'Portfolio Analytics', 'Subcontractor Registry', 'Financial Manifest', 'Sector ROI Intelligence'])" :key="t"
                    @click="activeTab = t"
                    :class="[
                      activeTab === t ? 'bg-slate-900 text-white shadow-xl scale-100' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50 scale-95',
                      t === 'Sector ROI Intelligence' ? 'relative overflow-hidden border-2 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] animate-[pulse_3s_infinite]' : ''
                    ]"
                    class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 transform whitespace-nowrap"
                >
                    <span v-if="t === 'Sector ROI Intelligence'" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></span>
                    <span class="relative z-10 flex items-center gap-2" :class="activeTab === t ? 'text-white' : (t === 'Sector ROI Intelligence' ? 'text-amber-600' : '')">
                        <Sparkles v-if="t === 'Sector ROI Intelligence'" class="w-3 h-3 text-amber-500 fill-amber-500" />
                        {{ t }}
                    </span>
                </button>
            </div>
            <div v-else class="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {{ brandingStore.labels.fulfillment }} Portal
            </div>
        </div>


        <div v-if="activeTab === 'Strategic Intelligence'" class="animate-[slideIn_0.4s_ease-out] space-y-8">
            <!-- PROJECT STRATEGIC KPI GRID -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- BUDGET BURN RATE -->
                <div @click="openDrilldown('Budget Burn')" class="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden cursor-pointer">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                    <div class="relative z-10 space-y-4">
                        <div class="flex items-center justify-between">
                            <div class="p-3 bg-primary/10 rounded-2xl text-primary"><TrendingUp class="w-5 h-5 shadow-lg" /></div>
                            <span class="text-[9px] font-black uppercase tracking-widest text-primary italic">{{ selectedProject === 'all' ? 'System Portfolio' : 'Active Project' }}</span>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-slate-400 border-b border-slate-100 pb-2 uppercase tracking-widest">Financial Burn Rate</p>
                            <div class="flex items-end gap-3 mt-3">
                                <h3 class="text-3xl font-black tabular-nums tracking-tighter">{{ selectedProject === 'all' ? '42.8%' : '64.2%' }}</h3>
                                <span class="text-[10px] font-bold text-slate-500 uppercase mb-1">Spent</span>
                            </div>
                            <div class="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-primary" :style="{ width: selectedProject === 'all' ? '42.8%' : '64.2%' }"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PROJECT PROGRESS & TIMELINE -->
                <div @click="openDrilldown('Project Progress')" class="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl group hover:shadow-primary/20 transition-all relative overflow-hidden cursor-pointer">
                    <Layers class="absolute -right-6 -bottom-6 w-32 h-32 text-white/[0.02] group-hover:scale-125 transition-all" />
                    <div class="relative z-10 space-y-4 text-white">
                        <div class="flex items-center justify-between">
                            <div class="p-3 bg-white/10 rounded-2xl text-accent-content"><CheckCircle2 class="w-5 h-5 shadow-lg" /></div>
                            <span class="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Timeline Pulse</span>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-slate-500 border-b border-white/5 pb-2 uppercase tracking-widest">Physical Completion</p>
                            <div class="flex flex-col gap-1 mt-3">
                                <div class="flex items-end gap-3">
                                    <h3 class="text-3xl font-black tabular-nums tracking-tighter">{{ selectedProject === 'all' ? '31.5%' : '78.5%' }}</h3>
                                    <span class="text-[10px] font-bold text-emerald-400 uppercase mb-1 italic">On Track</span>
                                </div>
                                <div class="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                                    <Clock class="w-3.5 h-3.5 text-indigo-400" />
                                    <div class="flex flex-col">
                                        <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest">Target Completion</span>
                                        <span class="text-[10px] font-black text-indigo-300 uppercase italic">NOV 22, 2026</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RESOURCE DENSITY -->
                <div @click="openDrilldown('Resources')" class="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all cursor-pointer hover:shadow-md">
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div class="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><Users class="w-5 h-5" /></div>
                            <span class="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Resource Mapping</span>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-slate-400 border-b border-slate-100 pb-2 uppercase tracking-widest">Assigned Subcontractors</p>
                            <div class="flex items-center gap-2 mt-4">
                                <div v-for="i in 4" :key="i" class="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 -ml-2 first:ml-0 shadow-sm ring-1 ring-slate-100">SUB</div>
                                <div class="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[9px] font-black -ml-2 shadow-sm">+2</div>
                                <span class="text-[11px] font-black text-slate-900 ml-2 uppercase tracking-tighter italic">{{ selectedProject === 'all' ? '12 Total' : '6 Nodes' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AI RISK FACTOR -->
                <div class="bg-red-50 p-6 rounded-[2.5rem] border border-red-100 group transition-all relative overflow-hidden">
                    <div class="space-y-4 relative z-10">
                        <div class="flex items-center justify-between">
                            <div class="p-3 bg-red-600 rounded-2xl text-white shadow-xl shadow-red-600/20 animate-pulse"><ShieldAlert class="w-5 h-5" /></div>
                            <span class="text-[9px] font-black uppercase tracking-widest text-red-600 italic">Operational Risk</span>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-red-300 border-b border-red-200 pb-2 uppercase tracking-widest">AI Deviation Warning</p>
                            <div class="mt-3">
                                <h3 class="text-[10px] font-black text-red-900 leading-tight uppercase tracking-tighter italic">
                                    {{ selectedProject === 'all' ? 'Portfolio is stable. 2 low-risk anomalies detected.' : 'Supply Chain Delay detected in Section-B4. Impact: 4 Days.' }}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CORE PROJECT PERFORMANCE MATRIX -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- PROJECT THROUGHPUT CHART -->
                <div class="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 flex flex-col min-h-[450px]">
                    <div class="flex items-center justify-between mb-8">
                        <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2 italic">
                            <ActivityIcon class="w-4 h-4 text-primary" /> {{ selectedProject === 'all' ? 'Global Lifecycle Throughput' : 'Project Lifecycle Velocity (24H)' }}
                        </h3>
                        <div class="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                            <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            <span class="text-[9px] font-black text-slate-500 uppercase">Live Project Pulse</span>
                        </div>
                    </div>
                    <div class="flex-1">
                        <apexchart type="area" height="100%" :options="chartOptions" :series="chartSeries"></apexchart>
                    </div>
                </div>

                <!-- AI RESOURCE OPTIMIZATION -->
                <div class="space-y-6 flex flex-col h-full">
                    <div class="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group flex-1">
                        <div class="absolute -right-10 -bottom-10 bg-white/10 w-48 h-48 rounded-full blur-[80px] group-hover:scale-150 transition-transform"></div>
                        <div class="relative z-10">
                            <div class="flex items-start justify-between mb-6">
                                <div class="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20"><Zap class="w-6 h-6 text-white" /></div>
                                <span class="bg-white/10 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter border border-white/20">Project High Priority</span>
                            </div>
                            <h2 class="text-2xl font-black tracking-tight mb-4 uppercase italic">AI Project Rebalancer</h2>
                            <p class="text-indigo-100 text-xs leading-relaxed mb-8 uppercase font-bold tracking-widest underline decoration-emerald-400 decoration-2 underline-offset-8">
                                Cognitive engine detects resource starvation in Subcontractor Cluster "Axis Ltd". Optimization suggested.
                            </p>
                        </div>
                        <button @click="executeOptimization" :disabled="isOptimizing" class="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:shadow-xl active:scale-[0.98] relative z-10 flex items-center justify-center gap-2 group-hover:bg-slate-50">
                            <component :is="isOptimizing ? Loader2 : Zap" class="w-4 h-4" :class="isOptimizing ? 'animate-spin' : ''" />
                            {{ isOptimizing ? 'Rebalancing...' : 'Execute Project Optimization' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- PROJECT MANIFEST AUDIT (SCV LOGIC) -->
            <!-- ... existing SCV content ... -->
            <!-- We keep the SCV here as it was already part of Strategic Intelligence or Health -->
        </div>

        <!-- NEW: SECTOR ROI INTELLIGENCE (TIERED ACCESS) -->
        <div v-if="activeTab === 'Sector ROI Intelligence'" class="animate-[slideIn_0.4s_ease-out] relative min-h-[800px] mb-20">
            <!-- ELITE ACCESS TEASER OVERLAY (Glass effect) -->
            <div v-if="!isEliteAccess" class="absolute inset-0 z-50 flex items-center justify-center rounded-[2.5rem] overflow-hidden">
                <!-- Blurred background layer to show data faintly -->
                <div class="absolute inset-0 bg-slate-900/[0.03] backdrop-blur-[6px] transition-all"></div>
                
                <!-- Premium Floating Unlock Card -->
                <div class="relative z-10 max-w-sm text-center p-10 bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 animate-[slideUp_0.5s_ease-out]">
                    <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock class="w-10 h-10 text-primary animate-bounce" />
                    </div>
                    <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic leading-tight">Elite Strategic <br/> Intelligence Required</h2>
                    <p class="text-slate-600 text-[11px] font-bold leading-relaxed mb-8 uppercase tracking-widest">
                        Identify $50k+ margin growth opportunities across all business sectors automatically. Acquire the <span class="text-primary font-black">Strategic Elite Package</span> or a one-time audit.
                    </p>
                    <div class="flex flex-col gap-3">
                        <button @click="triggerToast('Upgrade Request Sent to Sales Team.')" class="w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Upgrade Business Package</button>
                        <button @click="triggerToast('Redirecting to Audit Portal...')" class="w-full py-4 bg-slate-900/5 text-slate-400 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900/10 transition-all italic">Purchase Individual Audit ($5,000)</button>
                    </div>
                </div>
            </div>

            <!-- SIMULATOR CONTENT (Functional Data) -->
            <div class="space-y-8 h-full">
                <div class="flex items-center justify-between mb-2">
                    <div>
                        <h2 class="text-xl font-black text-slate-900 uppercase tracking-tight italic">Nexus Strategic Advisor <span class="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded ml-2">GEMINI AI INTEGRATED</span></h2>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Context: {{ selectedProject === 'all' ? 'Global Ecosystem' : projects.find(p => p.id === selectedProject)?.name }}</p>
                    </div>
                    <div class="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        <Brain class="w-3 h-3 text-primary animate-pulse" /> Strategic Mode: High-Confidence
                    </div>
                </div>

                <!-- NEXUS PIVOT QUERY ENGINE -->
                <div class="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden mt-6 mb-8 border border-indigo-500">
                    <div class="absolute right-0 top-0 opacity-10"><Brain class="w-64 h-64" /></div>
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div class="md:w-1/3">
                            <h3 class="font-black text-xl italic uppercase tracking-tight">Strategic Pivot Query</h3>
                            <p class="text-indigo-200 text-[10px] uppercase tracking-widest mt-1 font-bold">Ask AI: Should we shift business direction?</p>
                        </div>
                        <div class="flex-1 relative w-full">
                            <input type="text" placeholder="e.g. Should we pivot resources from Civil workflows to Fiber networking?" class="w-full bg-indigo-900/50 border border-indigo-400 text-white rounded-2xl py-5 pl-6 pr-40 outline-none font-medium placeholder-indigo-300 text-sm focus:border-white transition-all shadow-inner">
                            <button @click="triggerToast('Analyzing entire ecosystem state... Please wait.')" class="absolute right-2 top-2 bottom-2 bg-white text-indigo-600 px-6 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 shadow-sm">
                                Ask Nexus AI <Sparkles class="w-3.5 h-3.5"/>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- STRATEGIC KPIS (THE 5 CORE QUESTIONS) -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Q1: Profitability Benchmarking -->
                    <div @click="openRoiDetail('yields')" class="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-4 cursor-pointer hover:border-emerald-400 hover:shadow-xl transition-all">
                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Current Operational Yields</div>
                        <div class="space-y-4">
                            <div class="flex justify-between items-end">
                                <span class="text-xs font-bold text-slate-600">Core Service Delivery</span>
                                <span class="text-lg font-black text-slate-900">{{ roiMetrics.coreYield }}</span>
                            </div>
                            <div class="flex justify-between items-end">
                                <span class="text-xs font-bold text-primary">High-Value Specialization</span>
                                <span class="text-lg font-black text-primary">{{ roiMetrics.specializedYield }}</span>
                            </div>
                            <div class="pt-2 border-t border-slate-50 italic text-[9px] text-slate-400">
                                *AI: {{ roiMetrics.recommendation }}
                            </div>
                        </div>
                    </div>

                    <!-- Q2: Strategic Opportunity Hub -->
                    <div @click="openRoiDetail('growth')" class="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-4 relative overflow-hidden cursor-pointer hover:border-indigo-400 hover:shadow-xl transition-all">
                        <div class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] italic">Enterprise Growth Opportunities</div>
                        <div class="space-y-2">
                            <div v-for="opp in roiMetrics.opportunities" :key="opp.name" class="flex items-center justify-between text-xs font-bold text-slate-700">
                                <div class="flex items-center gap-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> {{ opp.name }}
                                </div>
                                <span class="text-[9px] text-emerald-600">{{ opp.gain }}</span>
                            </div>
                        </div>
                        <button class="w-full py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-indigo-400 transition-all">Audit Sector Payouts</button>
                    </div>

                    <!-- Q3: Account Settlement Index (Project Specific) -->
                    <div @click="openRoiDetail('settlement')" class="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6 cursor-pointer hover:border-amber-400 hover:shadow-xl transition-all">
                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Account Settlement Index</div>
                        <div class="grid grid-cols-3 gap-2">
                            <div class="text-center">
                                <div class="text-[9px] font-black text-slate-400 uppercase mb-1">Tier 1</div>
                                <div class="text-xs font-black text-emerald-600">{{ roiMetrics.settlement.tier1 }}%</div>
                            </div>
                            <div class="text-center">
                                <div class="text-[9px] font-black text-slate-400 uppercase mb-1">Tier 2</div>
                                <div class="text-xs font-black text-amber-500">{{ roiMetrics.settlement.tier2 }}%</div>
                            </div>
                            <div class="text-center">
                                <div class="text-[9px] font-black text-slate-400 uppercase mb-1">Tier 3</div>
                                <div class="text-xs font-black text-red-500">{{ roiMetrics.settlement.tier3 }}%</div>
                            </div>
                        </div>
                        <div class="text-[9px] font-bold text-slate-400 italic">Target: Stabilize Tier-Variance across Portfolio.</div>
                    </div>
                </div>

                <!-- MAIN SIMULATION ENGINE -->
                <div class="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div class="absolute top-0 right-0 p-20 opacity-5"><Brain class="w-96 h-96" /></div>
                    <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div class="space-y-6">
                            <h2 class="text-3xl font-black tracking-tight uppercase italic">Nexus <span class="text-primary">ROI</span> Simulation.</h2>
                            <p class="text-slate-400 text-sm leading-relaxed font-medium">
                                Multi-dimensional pivot analysis for strategic enterprise vendors. Using historical ledger synchronization to forecast upcoming yield trends.
                            </p>
                            <div class="space-y-4 pt-4">
                                <div @click="openRoiDetail('simulation')" class="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer hover:border-emerald-500/50">
                                    <div class="p-2 bg-primary/20 rounded-lg text-primary"><Zap class="w-4 h-4" /></div>
                                    <div class="flex-1">
                                        <div class="text-[10px] font-black uppercase text-slate-500">Optimized Action Plan</div>
                                        <div class="text-xs font-bold text-white">Reallocate 20% Operational Capacity to High-Yield Verticals</div>
                                    </div>
                                    <div class="text-right text-[10px] font-black text-emerald-400">+ Projected Profit Acceleration</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-black/50 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md">
                            <div class="flex items-center justify-between mb-8">
                                <div class="text-[10px] font-black uppercase tracking-widest text-slate-500">Yield Progression: Core vs Specialized</div>
                                <ActivityIcon class="w-4 h-4 text-primary" />
                            </div>
                            <div class="h-48 flex items-end gap-6 px-4">
                                <div v-for="(h, i) in [30, 45, 60, 55, 80, 95]" :key="i" class="flex-1 bg-primary/40 rounded-t-lg transition-all hover:bg-primary" :style="{ height: h + '%' }"></div>
                                <div v-for="(h, i) in [40, 65, 85, 75, 95, 100]" :key="i" class="flex-1 bg-amber-400/80 rounded-t-lg transition-all hover:bg-amber-400" :style="{ height: h + '%' }"></div>
                            </div>
                            <div class="flex justify-between mt-4 px-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                <span>Current Baseline</span><span>Strategic Optimization</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

<!-- BULK INGEST HUB (MOVED FROM OPERATIONS) -->
        <div v-if="activeTab === 'Bulk Ingest Hub'" class="animate-[slideUp_0.4s_ease-out] space-y-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- DROPZONE & CONTEXT -->
                <div class="lg:col-span-4 space-y-6">
                    <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                        <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Project Ingestion Context</h3>
                        
                        <div class="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                            <button @click="ingestionContext = 'client'" :class="ingestionContext === 'client' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'" class="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Client PO</button>
                            <button @click="ingestionContext = 'sub'" :class="ingestionContext === 'sub' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'" class="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Subcontractor PO</button>
                        </div>

                        <div class="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                            <UploadCloud class="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:scale-110 group-hover:text-primary transition-all" />
                            <p class="text-xs font-black text-slate-800 uppercase tracking-tighter italic">Upload CSV / PDF Manifest</p>
                            <p class="text-[10px] text-slate-400 font-bold uppercase mt-2">Optimized for 10,000+ Project Items</p>
                        </div>

                        <div class="pt-4 border-t border-slate-50 space-y-4">
                            <div class="space-y-2">
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Identification</label>
                                <div class="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100">
                                    <Layers class="w-3.5 h-3.5 text-indigo-500" />
                                    <span class="text-[10px] font-black text-indigo-600 uppercase italic">ANCHOR: {{ selectedProject === 'all' ? 'PORTFOLIO GLOBAL' : projects.find(p => p.id === selectedProject)?.name }}</span>
                                </div>
                            </div>
                            <button @click="triggerToast('Mapping Line Items to Strategic WBS...')" class="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all">Commence Bulk Ingestion</button>
                        </div>
                    </div>
                </div>

                <!-- PREVIEW TABLE -->
                <div class="lg:col-span-8">
                    <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                        <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest italic">Technical Ledger Preview</h3>
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Visibility: 25 / 724 Items</span>
                        </div>
                        <div class="flex-1 overflow-y-auto max-h-[600px]">
                            <table class="w-full">
                                <thead class="bg-slate-50/80 sticky top-0 backdrop-blur-md">
                                    <tr class="text-left border-b border-slate-100">
                                        <th class="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Item Index</th>
                                        <th class="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Technical Description</th>
                                        <th class="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Target Value</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-50">
                                    <tr v-for="i in 15" :key="i" class="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                        <td class="px-8 py-4 text-[10px] font-black text-slate-400 italic">LN-{{ 1000 + i }}</td>
                                        <td class="px-8 py-4 text-[11px] font-black text-slate-700 uppercase tracking-tighter italic">Structural Unit Grade-{{ 40 + i }} (Lot-{{ i }})</td>
                                        <td class="px-8 py-4 text-right text-xs font-black tabular-nums text-slate-900">{{ (1450.45 * i).toLocaleString() }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ADDITIONAL PORTFOLIO ANALYTICS (MS PROJECT CHARTS) -->
        <div v-if="activeTab === 'Portfolio Analytics'" class="animate-[slideIn_0.4s_ease-out] space-y-8">
             <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col min-h-[450px]">
                     <div class="flex items-center justify-between mb-8">
                         <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                             <TrendingUp class="w-4 h-4 text-primary" /> Executive Variance Pulse
                         </h3>
                         <span class="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded">BASELINE SYNC: 24H</span>
                     </div>
                     <div class="flex-1">
                         <apexchart type="bar" height="100%" :options="varianceChartOptions" :series="filteredVarianceChartSeries"></apexchart>
                     </div>
                 </div>
                 <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col min-h-[450px]">
                     <div class="flex items-center justify-between mb-8">
                         <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                             <Zap class="w-4 h-4 text-indigo-500" /> Strategic Burn Projection
                         </h3>
                         <span class="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded">ROI OPTIMIZED</span>
                     </div>
                     <div class="flex-1">
                         <apexchart type="line" height="100%" :options="burnChartOptions" :series="filteredBurnChartSeries"></apexchart>
                     </div>
                 </div>
             </div>
        </div>

        <!-- SUBCONTRACTOR REGISTRY HUB -->
        <div v-if="activeTab === 'Subcontractor Registry'" class="animate-[slideIn_0.4s_ease-out] space-y-8">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-black text-slate-900 uppercase tracking-tighter italic">Strategic Subcontractor Directory</h3>
                <button @click="isAddSubOpen = true" class="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                    <Plus class="w-4 h-4" /> Register New Partner
                </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="sub in subContractors" :key="sub.id" class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                    <div class="flex items-start justify-between mb-6">
                        <div class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Users class="w-6 h-6" />
                        </div>
                        <span class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{{ sub.id }}</span>
                    </div>
                    <h3 class="text-lg font-black text-slate-900 uppercase italic">{{ sub.name }}</h3>
                    <div class="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Projects</span>
                            <p class="text-sm font-black text-slate-800">{{ sub.assignedProjects?.length || 0 }}</p>
                        </div>
                        <div class="space-y-1">
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reliability Score</span>
                            <p class="text-sm font-black text-emerald-500 italic">98% PASS</p>
                        </div>
                    </div>
                    <button class="w-full mt-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">View Full Performance Scorecard</button>
                </div>
            </div>
        </div>

        <!-- ADVANCED MILESTONE HEALTH (LIVE PHASE PULSE) -->
        <div v-if="activeTab === 'Advanced Milestone Health'" class="animate-[slideIn_0.4s_ease-out] space-y-8">
             <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <div>
                        <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest italic">Phase Execution Pulse</h3>
                        <p class="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Tracking Lifecycle Health for PC-{{ selectedProject }}</p>
                    </div>
                    <div class="flex items-center gap-6">
                        <div class="flex flex-col items-end">
                            <span class="text-[9px] font-black text-slate-400 uppercase">Critical Path Health</span>
                            <span class="text-xs font-black text-emerald-500 uppercase italic">Optimized (Low Risk)</span>
                        </div>
                        <div class="p-2 bg-slate-900 text-white rounded-xl shadow-lg"><Workflow class="w-5 h-5" /></div>
                    </div>
                </div>
                <div class="p-8 space-y-6">
                    <div v-for="ms in filteredProjectMilestones" :key="ms.id" @click="openPhaseDetail(ms)" class="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer relative overflow-hidden">
                        <div class="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:scale-150 transition-all"></div>
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-4">
                                <span class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xs font-black text-slate-400 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">{{ ms.id }}</span>
                                <h4 class="text-sm font-black text-slate-900 uppercase italic">{{ ms.name }}</h4>
                            </div>
                            <div class="flex items-center gap-8">
                                <div class="text-right">
                                    <span class="text-[9px] font-black text-slate-400 uppercase block mb-1">Budget Burn</span>
                                    <span class="text-xs font-black text-slate-900 tabular-nums italic underline decoration-2 decoration-primary/30">{{ (ms.cost_actual / ms.cost_target * 100).toFixed(1) }}% Committed</span>
                                </div>
                                <div class="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div class="h-full bg-primary" :style="{ width: ms.completion + '%' }"></div>
                                </div>
                                <span class="text-xs font-black text-slate-900 tabular-nums">{{ ms.completion }}%</span>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
        <!-- FINANCIAL MANIFEST (SCV LOGIC) -->
        <div v-if="activeTab === 'Financial Manifest'" class="animate-[slideIn_0.4s_ease-out] space-y-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- PURCHASE ORDERS (TO CLIENTS) -->
                <div class="lg:col-span-12">
                    <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><FileText class="w-4 h-4" /></div>
                                <div>
                                    <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest italic">Strategic Purchase Orders</h3>
                                    <p class="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Anchored to Project: {{ selectedProject === 'all' ? 'PORTFOLIO GLOBAL' : projects.find(p => p.id === selectedProject)?.name }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <button @click="isPOModalOpen = true" class="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                    <Plus class="w-3.5 h-3.5" /> Commit Strategic PO
                                </button>
                                <button @click="isExpenseModalOpen = true" class="px-5 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                    <ShieldAlert class="w-3.5 h-3.5" /> Add Strategic Expense
                                </button>
                            </div>
                        </div>
                        <POTable :pos="filteredPOs" @toggleAction="handleAction" />
                        <div v-if="!filteredPOs.length" class="p-20 text-center space-y-4">
                            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300"><Layers class="w-8 h-8 opacity-20" /></div>
                            <p class="text-xs font-black text-slate-400 uppercase tracking-widest italic">No Purchase Orders found for this strategic identifier.</p>
                        </div>
                    </div>
                </div>

                <!-- WORK ORDERS (TO SUBCONTRACTORS) -->
                <div class="lg:col-span-12">
                    <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/30">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Zap class="w-4 h-4" /></div>
                                <div>
                                    <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest italic">Active Work Orders (Sub-Sector)</h3>
                                    <p class="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Resource Mapping Context: {{ selectedProject === 'all' ? 'FULL DISPATCH' : projects.find(p => p.id === selectedProject)?.name }}</p>
                                </div>
                            </div>
                        </div>
                        <WOTable :wos="filteredWOs" @handleAction="handleWOAction" @openAssets="openAssetManager" />
                        <div v-if="!filteredWOs.length" class="p-20 text-center space-y-4">
                            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300"><Workflow class="w-8 h-8 opacity-20" /></div>
                            <p class="text-xs font-black text-slate-400 uppercase tracking-widest italic">No Production Units currently in lifecycle for this project.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- DOCUMENT HUB REMOVED - NOW INTEGRATED IN BULK INGEST TAB ABOVE -->

      </div>
    </main>

    <!-- DRILL DOWN MODAL  -->
    <DrilldownModal :isOpen="isDrilldownOpen" :category="drilldownCategory" @close="isDrilldownOpen = false" @triggerToast="triggerToast" />

    <!-- PREMIUM CUSTOM TOAST NOTIFICATION -->
    <!-- STRATEGIC PO INGESTION MODAL -->
    <div v-if="isPOModalOpen" class="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div @click="isPOModalOpen = false" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      
      <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-[modalSlide_0.3s_ease-out] border border-slate-200">
        <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div>
            <h2 class="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Plus class="w-4 h-4 text-primary" /> PO Ingestion Module
            </h2>
            <p class="text-[10px] text-slate-400 font-bold mt-1">Strategic Budget Manifest Registration</p>
          </div>
          <button @click="isPOModalOpen = false" class="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X class="w-4 h-4 text-slate-400" /></button>
        </div>

        <div class="p-8 space-y-6">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5 text-left">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Classification</label>
                  <select v-model="newPO.type" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="client_invoice">Outbound Client Invoice</option>
                    <option value="sub_po">Inbound Subcarrier PO</option>
                  </select>
                </div>
                <div class="space-y-1.5 text-left">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Global Project Assignment</label>
                  <select v-model="newPO.project_id" class="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/20">
                    <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
                  </select>
                </div>
              </div>
              <div class="space-y-1.5 text-left">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{{ newPO.type === 'sub_po' ? 'Subcontractor ID / Name' : 'Client Business Identity' }}</label>
                <input v-model="newPO.client_name" type="text" placeholder="e.g. Axis Corporate Ltd" class="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5 text-left">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategic Document ID</label>
                    <input v-model="newPO.po_number" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono" />
                </div>
                <div class="space-y-1.5 text-left">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget Manifest ({{ brandingStore.currency }})</label>
                    <input v-model="newPO.amount" type="number" placeholder="0.00" class="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm tabular-nums" />
                </div>
              </div>
            </div>

          <div class="pt-4 flex gap-3">
             <button @click="isPOModalOpen = false" class="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors border border-slate-200">Cancel</button>
             <button @click="submitPO" :disabled="isSubmittingPO" class="flex-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Loader2 v-if="isSubmittingPO" class="w-4 h-4 animate-spin" />
                <Zap v-else class="w-4 h-4 text-accent" />
                {{ isSubmittingPO ? 'Processing...' : 'Commit Manifest' }}
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- STRATEGIC ASSET MANAGER MODAL -->
    <div v-if="isAssetModalOpen" class="fixed inset-0 z-[2200] flex items-center justify-center p-4">
      <div @click="isAssetModalOpen = false" class="absolute inset-0 bg-slate-900/40 backdrop-blur-md"></div>
      
      <div class="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-[modalSlide_0.3s_ease-out] border border-slate-200">
        <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/10">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-primary/10 rounded-2xl text-primary shadow-2xl shadow-primary/20"><Paperclip class="w-6 h-6" /></div>
            <div>
              <h2 class="text-xs font-black text-slate-900 uppercase tracking-widest italic">Digital Document Vault</h2>
              <p class="text-[10px] text-slate-400 font-bold mt-1">Managed Resource Registry for {{ targetAssetItem.entity_type }}</p>
            </div>
          </div>
          <button @click="isAssetModalOpen = false" class="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X class="w-4 h-4 text-slate-400" /></button>
        </div>

        <div class="p-8 space-y-8">
          <!-- NEW LINK INPUT -->
          <div class="bg-slate-50 p-5 rounded-3xl border border-slate-200/60 space-y-4">
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input v-model="newAsset.name" type="text" placeholder="Resource Name (e.g. Blueprints)" class="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                <input v-model="newAsset.url" type="text" placeholder="Google Drive / URL" class="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20" />
             </div>
             <button @click="addAssetLink" class="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-slate-800">
                <Plus class="w-4 h-4" /> Link Asset Platform
             </button>
          </div>

          <!-- ASSET LIST -->
          <div class="space-y-3">
             <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Committed Resources</h4>
             <div v-if="!targetAssetItem.asset_links?.length" class="text-center py-8 text-slate-300 font-bold italic text-xs">No external assets linked yet.</div>
             <div v-for="asset in targetAssetItem.asset_links" :key="asset.id" class="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary/30 transition-colors group">
                <div class="flex items-center gap-3">
                   <div class="p-2 bg-slate-50 rounded-xl text-slate-400"><Link class="w-4 h-4" /></div>
                   <div class="flex flex-col">
                      <span class="text-xs font-black text-slate-800">{{ asset.name }}</span>
                   </div>
                </div>
                <div class="flex items-center gap-2">
                   <a :href="asset.url" target="_blank" class="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all"><Globe class="w-4 h-4" /></a>
                   <button @click="removeAssetLink(asset.id)" class="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><Trash2 class="w-4 h-4" /></button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI FORENSIC MATCH DETAIL MODAL -->
    <div v-if="selectedMatch" class="fixed inset-0 z-[2500] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
        <div class="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-[modalSlide_0.3s_ease-out] border border-slate-200">
            <div class="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
                <div class="flex items-center gap-6">
                    <div class="w-16 h-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center border border-primary/30">
                        <ZoomIn class="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h2 class="text-2xl font-black italic uppercase tracking-tighter">Forensic Discrepancy Analysis</h2>
                        <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Comparing Ledger Record to Inbound Document</p>
                    </div>
                </div>
                <button @click="selectedMatch = null" class="p-3 hover:bg-white/10 rounded-full transition-colors"><X class="w-7 h-7 text-white/50" /></button>
            </div>

            <div class="p-12">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                    <!-- PO CONTEXT (ORIGINAL BUDGET SOURCE) -->
                    <div class="space-y-6">
                        <div class="flex items-center gap-3">
                            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic border-b border-slate-100 pb-3 flex-1">Original Manifest (PO-2026-039)</h4>
                            <span class="px-2 py-1 bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest rounded">AWR Variant v1.2</span>
                        </div>
                        <div class="space-y-4">
                            <div class="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                                    <span>Description</span>
                                    <span>Budget ({{ brandingStore.currency }})</span>
                                </div>
                                <div class="space-y-3 pt-2">
                                    <div class="flex justify-between items-center border-b border-slate-100 pb-2">
                                        <span class="text-xs font-black text-slate-700 uppercase tracking-tighter">Concrete Structure L2</span>
                                        <span class="text-xs font-black text-slate-900 tabular-nums">840.00</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs font-black text-slate-700 uppercase tracking-tighter">Freight-L4 (Standard)</span>
                                        <span class="text-xs font-black text-slate-900 tabular-nums">400.00</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-between items-center p-5 bg-slate-900 text-white rounded-[1.5rem] shadow-xl">
                                <span class="text-xs font-black uppercase tracking-widest text-slate-400">Ledger Baseline</span>
                                <span class="text-xl font-black tabular-nums">{{ brandingStore.currency }} 1,426.00</span>
                            </div>
                        </div>
                    </div>

                    <!-- TECHNICAL FINISH CONTEXT (THE FIELD REALITY) -->
                    <div class="space-y-6">
                        <div class="flex items-center gap-3">
                            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic border-b border-slate-100 pb-3 flex-1">Technical Finish Report (Field)</h4>
                            <span class="px-2 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded border border-primary/20">Synced @ 09:12</span>
                        </div>
                        <div class="space-y-4">
                            <div class="flex flex-col gap-2 p-4 bg-slate-900 text-slate-300 rounded-2xl border border-white/5">
                                <div class="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                                    <span>Field Execution Log</span>
                                    <span>Cost Analysis</span>
                                </div>
                                <div class="space-y-3 pt-2">
                                    <div class="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span class="text-xs font-black text-white uppercase tracking-tighter italic">Concrete Structure L2 <span class="text-[9px] text-emerald-400"> (MATCH)</span></span>
                                        <span class="text-xs font-black text-white tabular-nums">840.00</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-white/5 pb-2 text-red-400 animate-pulse">
                                        <span class="text-xs font-black uppercase tracking-tighter italic">Freight-L4 (TECHNICAL OVERWEIGHT)</span>
                                        <span class="text-xs font-black tabular-nums">540.00</span>
                                    </div>
                                    <div class="flex justify-between items-center p-2 rounded bg-amber-500/10 border border-amber-500/20">
                                        <span class="text-[9px] font-black text-amber-500 uppercase italic">AWR-Detect: Supervisor Approved</span>
                                        <span class="text-xs font-black text-amber-500 tabular-nums">140.00</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-between items-center p-5 bg-primary text-white rounded-[1.5rem] shadow-xl shadow-primary/30">
                                <div class="flex flex-col">
                                    <span class="text-xs font-black uppercase tracking-widest text-indigo-200">Field Adjusted Total</span>
                                    <span class="text-[9px] font-black uppercase tracking-widest text-white/60">Includes AWR Variance</span>
                                </div>
                                <span class="text-xl font-black tabular-nums">{{ brandingStore.currency }} 1,518.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4 mb-10">
                    <ShieldAlert class="w-6 h-6 text-amber-500 mt-1" />
                    <p class="text-sm font-bold text-amber-800 leading-relaxed uppercase tracking-tighter">
                        <span class="font-black">Forensic Breakdown:</span> The Variance is driven by a <span class="underline">6.2% Technical Overweight</span> on line item "Freight-L4". Field Manager <span class="font-black italic">David S.</span> has authorized an <span class="font-black underline">AWR Manifest (Ref: technical_overload_v4)</span>. AI suggests proceeding with approval based on executive policy.
                    </p>
                </div>

                <div class="flex gap-4">
                    <button @click="selectedMatch = null" class="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Abort Audit</button>
                    <button @click="triggerToast('Requesting Vendor Correction Manifest...')" class="flex-1 py-5 bg-amber-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20">Request Correction</button>
                    <button @click="triggerToast('Overriding Anomaly. Posting to Strategic Ledger...')" class="flex-2 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 px-8">Authorize & Post</button>
                </div>
            </div>
        </div>
    </div>

    <transition name="toast-slide">
      <div v-if="toastState.show" class="fixed bottom-10 right-10 z-[1200] bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-4 ring-1 ring-white/10 max-w-sm">
        <div class="mt-0.5 p-1.5 bg-primary/20 rounded-md text-primary ring-1 ring-primary/30"><Bell class="w-4 h-4"/></div>
        <div class="flex-1"><p class="text-[12px] text-slate-300 font-medium leading-relaxed">{{ toastState.message }}</p></div>
        <button @click="toastState.show = false" class="ml-2 text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"><X class="w-4 h-4" /></button>
      </div>
    </transition>

    <!-- STRATEGIC PROJECT CREATION MODAL -->
    <transition name="toast-slide">
        <div v-if="isCreateProjectOpen" class="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div class="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-3xl border border-white/20 animate-[slideUp_0.4s_ease-out] relative">
                <button @click="isCreateProjectOpen = false" class="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <X class="w-5 h-5 text-slate-400" />
                </button>

                <div class="space-y-8">
                    <div class="space-y-2">
                        <div class="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 shadow-inner"><Plus class="w-8 h-8" /></div>
                        <h2 class="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Commit New Project</h2>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">System Intelligence will calibrate the Lifecycle and Subcontractor anchors for this strategic identifier.</p>
                    </div>

                    <div class="space-y-6">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Project Classification Name</label>
                            <input v-model="newProjectForm.name" placeholder="E.g. Port City Terminal L5" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 text-sm font-black uppercase placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Assigned Project Identifier (ID)</label>
                            <input v-model="newProjectForm.id" placeholder="PC-005" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 text-sm font-black uppercase font-mono placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner" />
                        </div>
                    </div>

                    <div class="flex gap-4 pt-4">
                        <button @click="isCreateProjectOpen = false" class="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all italic border border-slate-100">Cancel</button>
                        <button @click="handleCreateProject" class="flex-2 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all group flex items-center justify-center gap-3 italic">
                            Commence Lifecycle <CheckCircle2 class="w-4 h-4 text-emerald-400 group-hover:scale-125 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>

    <!-- STRATEGIC EXPENSE INGESTION MODAL -->
    <transition name="toast-slide">
        <div v-if="isExpenseModalOpen" class="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div class="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-3xl border border-red-100 animate-[slideUp_0.4s_ease-out] relative">
                <button @click="isExpenseModalOpen = false" class="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <X class="w-5 h-5 text-slate-400" />
                </button>

                <div class="space-y-8">
                    <div class="space-y-2">
                        <div class="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 mb-6 shadow-inner"><ShieldAlert class="w-8 h-8" /></div>
                        <h2 class="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Commit Strategic Expense</h2>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Financial deviation manifest for project resource consumption. Mirroring directly to Corporate P&L.</p>
                    </div>

                    <div class="space-y-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Project Anchor</label>
                                <select v-model="newExpense.project_id" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 text-xs font-black uppercase outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all shadow-inner">
                                    <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Expense Category</label>
                                <select v-model="newExpense.category" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 text-xs font-black uppercase outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all shadow-inner">
                                    <option v-for="c in expenseCategories" :key="c" :value="c">{{ c }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Budget Allocation ({{ brandingStore.currency }})</label>
                            <input v-model="newExpense.amount" type="number" placeholder="0.00" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 text-sm font-black uppercase placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all shadow-inner tabular-nums font-mono text-red-600" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Execution Narrative</label>
                            <input v-model="newExpense.description" placeholder="E.g. Logistics for Sector B Crane Deployment" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 text-sm font-black uppercase placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all shadow-inner" />
                        </div>
                    </div>

                    <div class="flex gap-4 pt-4">
                        <button @click="isExpenseModalOpen = false" class="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all italic border border-slate-100">Abort Commitment</button>
                        <button @click="handleSubmitExpense" :disabled="isSubmittingExpense" class="flex-2 py-5 bg-red-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-red-700 transition-all group flex items-center justify-center gap-3 italic disabled:opacity-50">
                            {{ isSubmittingExpense ? 'Syncing Ledger...' : 'Commit to P&L' }} <CheckCircle2 v-if="!isSubmittingExpense" class="w-4 h-4 text-white group-hover:scale-125 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>

    <!-- PHASE DRILL-DOWN MODAL -->
    <transition name="modal">
        <div v-if="isPhaseDetailOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-md" @click="isPhaseDetailOpen = false"></div>
            <div class="relative bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden animate-[slideUp_0.3s_ease-out]">
                <div class="p-10 space-y-8">
                    <!-- HEADER -->
                    <div class="flex items-start justify-between">
                        <div class="space-y-1">
                            <span class="text-[10px] font-black text-primary uppercase tracking-widest italic">Phase Forensic Drill-down</span>
                            <h2 class="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{{ selectedPhase?.title }}</h2>
                        </div>
                        <button @click="isPhaseDetailOpen = false" class="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                            <X class="w-6 h-6 text-slate-400" />
                        </button>
                    </div>

                    <!-- PHASE KPI MAPPING -->
                    <div class="grid grid-cols-3 gap-6">
                        <div class="bg-slate-50 p-6 rounded-3xl space-y-1">
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Actual Spend</span>
                            <p class="text-xl font-black text-slate-900 tracking-tight italic">{{ selectedPhase?.budget }}</p>
                        </div>
                        <div class="bg-indigo-50 p-6 rounded-3xl space-y-1 border border-indigo-100">
                            <span class="text-[9px] font-black text-indigo-400 uppercase tracking-widest italic leading-none">Completion</span>
                            <p class="text-xl font-black text-indigo-900 tracking-tight italic">{{ selectedPhase?.completion.toFixed(1) }}%</p>
                        </div>
                        <div class="bg-emerald-50 p-6 rounded-3xl space-y-1">
                            <span class="text-[9px] font-black text-emerald-400 uppercase tracking-widest italic leading-none">Status Cluster</span>
                            <p class="text-xl font-black text-emerald-600 tracking-tight italic">OPTIMIZED</p>
                        </div>
                    </div>

                    <!-- TASK LIST MANIFEST -->
                    <div class="space-y-4">
                        <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Task Lifecycle Audit</h4>
                        <div class="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            <div v-for="(task, idx) in [
                                { name: 'Initial Resource Allocation', status: 'COMPLETE', lead: 'H. Amila' },
                                { name: 'Material Acquisition Flow', status: 'COMPLETE', lead: 'Axis Ltd' },
                                { name: 'Field Operational Pulse', status: 'ACTIVE', lead: 'Strategic Team' },
                                { name: 'Quality Manifest Review', status: 'PENDING', lead: 'Audit Node' }
                            ]" :key="idx" class="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-primary/20 transition-all group">
                                <div class="flex items-center gap-4">
                                    <span class="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">0{{ idx + 1 }}</span>
                                    <div>
                                        <p class="text-sm font-black text-slate-900 tracking-tight uppercase italic pb-0.5">{{ task.name }}</p>
                                        <div class="flex items-center gap-2">
                                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assignee:</span>
                                            <span class="text-[9px] font-bold text-slate-500 uppercase italic">{{ task.lead }}</span>
                                        </div>
                                    </div>
                                </div>
                                <span :class="getTaskStatusColor(task.status)" class="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest italic">{{ task.status }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- FORENSIC ACTION -->
                    <button @click="isPhaseDetailOpen = false" class="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest transition-all hover:bg-slate-800 active:scale-[0.98] shadow-xl">
                        Acknowledge Phase Health
                    </button>
                </div>
            </div>
        </div>
    </transition>

    <!-- AI SOCIAL OUTREACH MODAL -->
    <transition name="modal">
        <div v-if="isNexusOutreachOpen" class="fixed inset-0 z-[2500] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <div class="bg-white w-full max-w-2xl rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
                <div class="p-10 space-y-8">
                    <div class="flex items-start justify-between">
                        <div class="flex gap-6">
                            <div class="w-16 h-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-indigo-600/20 italic shadow-inner">
                                {{ selectedNexusLead?.name[0] }}
                            </div>
                            <div>
                                <h2 class="text-2xl font-black tracking-tight text-slate-900 italic uppercase leading-tight">{{ selectedNexusLead?.name }}</h2>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none mt-1">{{ selectedNexusLead?.role }} @ {{ selectedNexusLead?.company }}</p>
                            </div>
                        </div>
                        <button @click="isNexusOutreachOpen = false" class="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"><X class="w-6 h-6 text-slate-400" /></button>
                    </div>

                    <div class="space-y-4 text-left">
                        <div class="flex items-center justify-between">
                            <label class="text-[11px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 italic">
                                <Zap class="w-4 h-4" /> AI Outreach Transmission
                            </label>
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest italic bg-slate-50 px-2 py-1 rounded">PLATFORM: {{ selectedNexusLead?.platform }}</span>
                        </div>
                        <textarea v-model="nexusDraft" rows="5" 
                            class="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-sm font-bold text-slate-700 outline-none transition-all resize-none shadow-inner"></textarea>
                    </div>

                    <div class="flex gap-4 pt-4">
                        <button @click="isNexusOutreachOpen = false" class="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100 italic">Abort Broadcast</button>
                        <button @click="triggerToast('Outreach Broadcast Initiated!'); isNexusOutreachOpen = false" class="flex-2 py-5 bg-slate-900 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 italic">
                            Initiate Broadcast <Send class="w-4 h-4 text-accent" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>

    <!-- ROI DETAIL MODAL (PREMIUM AUDIT VIEW) -->
    <transition name="modal">
        <div v-if="isRoiDetailOpen" class="fixed inset-0 z-[2500] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
            <div class="bg-white w-full max-w-3xl rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out] flex flex-col max-h-[90vh]">
                <div class="px-10 py-8 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                    <div class="flex gap-6 items-center">
                        <div class="w-16 h-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 italic">
                            <Brain class="w-8 h-8" />
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic leading-none mb-2 flex items-center gap-2"><Lock class="w-3 h-3"/> {{ selectedRoiDetail?.tag }}</p>
                            <h2 class="text-3xl font-black tracking-tight text-slate-900 italic uppercase leading-none">{{ selectedRoiDetail?.title }}</h2>
                        </div>
                    </div>
                    <button @click="isRoiDetailOpen = false" class="p-3 bg-white rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm"><X class="w-6 h-6 text-slate-400" /></button>
                </div>

                <div class="p-10 space-y-8 overflow-y-auto">
                    <div class="bg-slate-900 text-slate-300 rounded-[2rem] p-8 font-medium text-sm leading-relaxed shadow-inner border border-slate-800">
                        <span class="text-white font-bold">EXECUTIVE SUMMARY:</span> {{ selectedRoiDetail?.content }}
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="md:col-span-2 grid grid-cols-2 gap-4">
                            <div v-for="stat in selectedRoiDetail?.stats" :key="stat.label" class="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
                                <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{{ stat.label }}</div>
                                <div class="text-2xl font-black text-slate-900">{{ stat.value }}</div>
                            </div>
                        </div>
                        <div class="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
                            <div class="absolute inset-0 bg-emerald-500/5"></div>
                            <div class="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2 relative z-10">AI Confidence Score</div>
                            <div class="text-4xl font-black text-emerald-500 tracking-tighter relative z-10">{{ selectedRoiDetail?.confidence }}<span class="text-lg text-emerald-400">%</span></div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2">Strategic Action Imperatives</div>
                        <div class="space-y-3">
                            <div v-for="item in selectedRoiDetail?.checklist" :key="item.id" @click="item.done = !item.done" class="flex items-center gap-4 p-4 rounded-2xl border cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all" :class="item.done ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-slate-50 border-slate-100'">
                                <CheckCircle2 v-if="item.done" class="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <div v-else class="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0"></div>
                                <div class="text-xs font-bold" :class="item.done ? 'text-emerald-700 line-through opacity-50' : 'text-slate-700'">{{ item.text }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-8 border-t border-slate-100 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button @click="triggerToast('Generating $5,000 Comprehensive Forensic Audit Base...')" class="py-5 bg-white border-2 border-primary text-primary rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center justify-center gap-3 italic">
                        Generate PDF Audit <FileText class="w-4 h-4" />
                    </button>
                    <button @click="isRoiDetailOpen = false" class="py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 italic">
                        Acknowledge Intelligence <CheckCircle2 class="w-4 h-4 text-emerald-400" />
                    </button>
                </div>
            </div>
        </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Activity as ActivityIcon, X, Cpu, Zap, Users, RefreshCw, Layers, Database, Bell, Loader2, Workflow, Terminal, Server, FileText, TrendingUp, Plus, Link, Trash2, Globe, UploadCloud, ShieldAlert, CheckCircle2, ZoomIn, Brain, Clock, Paperclip, Sparkles, Lock, Send, Target } from 'lucide-vue-next'
import Sidebar from '../components/dashboard/Sidebar.vue'
import TopHeader from '../components/dashboard/TopHeader.vue'
import DrilldownModal from '../components/dashboard/DrilldownModal.vue'

import POTable from '../components/operations/POTable.vue'
import WOTable from '../components/operations/WOTable.vue'
import ActivityTimeline from '../components/operations/ActivityTimeline.vue'
import { brandingStore } from '../services/brandingService'
import { authStore } from '../services/authService'
import { supabase } from '../services/supabase'
import { generatePDF } from '../utils/pdfGenerator'
import { addNotification, logActivity } from '../services/notificationService'

const route = useRoute()
const isMobileMenuOpen = ref(false)
const toastState = ref({ show: false, message: '' })
const isOptimizing = ref(false)
const activeTab = ref('Strategic Intelligence')
const ingestionContext = ref('client')

onMounted(async () => {
    if (authStore.user.role === 'subcontractor') {
        activeTab.value = 'Business Workflow'
    } else if (route.query.tab === 'roi') {
        activeTab.value = 'Sector ROI Intelligence'
    } else {
        activeTab.value = 'Strategic Intelligence'
    }
    
    fetchOperationalData()
})

// Watch for route changes to switch tabs dynamically (Immediate sync)
watch(() => route.query.tab, (newTab) => {
    if (newTab === 'roi') {
        activeTab.value = 'Sector ROI Intelligence'
    } else {
        activeTab.value = 'Strategic Intelligence'
    }
}, { immediate: true })

const isEliteAccess = computed(() => {
    // Strategic bypass for Executive and Management nodes
    const rootRoles = ['ceo', 'manager', 'finance', 'admin'];
    return rootRoles.includes(authStore.user.role) || authStore.user.package === 'Elite';
})

const getLeadScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 80) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    return 'text-slate-400 bg-slate-50 border-slate-100';
};

// Strategic PO Ingestion State
const isPOModalOpen = ref(false)
const isCreateProjectOpen = ref(false)
const newProjectForm = ref({ name: '', id: '' })

const handleCreateProject = () => {
    if (!newProjectForm.value.name || !newProjectForm.value.id) {
        triggerToast("Error: Identification and Classification required for new projects.")
        return
    }
    
    projects.value.push({ ...newProjectForm.value })
    triggerToast(`Project "${newProjectForm.value.name}" committed to Strategic Portfolio.`)
    isCreateProjectOpen.value = false
    newProjectForm.value = { name: '', id: '' }
}

// Strategic Partner Registry State
const isAddSubOpen = ref(false)
const subContractors = ref([
    { id: 'SUB-2026-001', name: 'Axis Infrastructure Ltd', assignedProjects: ['P-001'], performance: 98 },
    { id: 'SUB-2026-002', name: 'Global Concrete Systems', assignedProjects: ['P-001', 'P-002'], performance: 92 },
    { id: 'SUB-2026-003', name: 'Apex Logistics Group', assignedProjects: ['P-002'], performance: 95 }
])

const projectMilestones = ref([
    { id: 1, name: 'Phase 1: Civil & Foundation', completion: 100, cost_target: 150000, cost_actual: 142000 },
    { id: 2, name: 'Phase 2: Core Structural', completion: 85, cost_target: 450000, cost_actual: 485000 },
    { id: 3, name: 'Phase 3: MEP & Interior Tech', completion: 30, cost_target: 300000, cost_actual: 95000 },
    { id: 4, name: 'Phase 4: Commissioning', completion: 0, cost_target: 120000, cost_actual: 0 }
])

const isSubmittingPO = ref(false)
const newPO = ref({
    po_number: `PO-${new Date().getFullYear()}-00${Math.floor(Math.random() * 100)}`,
    client_name: '',
    amount: 0,
    project_id: ''
})

// Strategic Expense State
const isExpenseModalOpen = ref(false)
const isSubmittingExpense = ref(false)
const expenseCategories = ['Logistics & Transport', 'Material & Equipment', 'Manpower & Overtime', 'Security & Safety', 'Utilities & Overheads']
const newExpense = ref({
    project_id: '',
    category: 'Material & Equipment',
    amount: 0,
    description: ''
})

const handleSubmitExpense = async () => {
    if (!newExpense.value.amount || !newExpense.value.project_id) {
        triggerToast('Error: Resource allocation and Project Anchor required.')
        return
    }

    isSubmittingExpense.value = true
    try {
        const { error } = await supabase.from('bi_transactions').insert({
            transaction_date: new Date().toISOString().split('T')[0],
            amount: -Math.abs(newExpense.value.amount), // Always negative for expense
            type: 'expense',
            category: newExpense.value.category,
            description: `[PROJECT EXPENSE] ${newExpense.value.description}`,
            project_id: newExpense.value.project_id
        })

        if (error) throw error

        triggerToast(`Strategic Expense Committed to P&L for Project: ${newExpense.value.project_id}`)
        isExpenseModalOpen.value = false
        newExpense.value = { project_id: '', category: 'Material & Equipment', amount: 0, description: '' }
    } catch (err) {
        console.error(err)
        triggerToast('Sync Failure: Ledger rejection on expense commitment.')
    } finally {
        isSubmittingExpense.value = false
    }
}

// Watch to sync project context when opening modals
watch(isPOModalOpen, (isOpen) => {
    if (isOpen && selectedProject.value !== 'all') {
        newPO.value.project_id = selectedProject.value
    }
})

watch(isExpenseModalOpen, (isOpen) => {
    if (isOpen && selectedProject.value !== 'all') {
        newExpense.value.project_id = selectedProject.value
    }
})

// Strategic Asset Link State
const isAssetModalOpen = ref(false)
const targetAssetItem = ref(null) // { id, entity_type (PO/WO), name, asset_links: [] }
const newAsset = ref({ name: '', url: '' })
const selectedMatch = ref(null)

const activePOs = ref([])
const activeWOs = ref([])
const selectedProject = ref('all')
const projects = ref([
    { id: 'PC-001', name: 'Port City Phase L4' },
    { id: 'ND-202', name: 'Nordic Logistics Hub' },
    { id: 'IT-505', name: 'Island Tea High-Speed Terminal' }
])
const poMatches = ref([
    { id: 1, po_number: 'PO-2026-042', inv_number: 'INV-8821', vendor: 'Svea Logistics AB', confidence: 100, status: 'matched' },
    { id: 2, po_number: 'PO-2026-039', inv_number: 'INV-8819', vendor: 'Island Tea Exporters', confidence: 82, status: 'anomaly' },
    { id: 3, po_number: 'PO-2026-035', inv_number: 'INV-8815', vendor: 'Nordic Transports', confidence: 100, status: 'matched' }
])

const isPhaseDetailOpen = ref(false)
const selectedPhase = ref(null)

const openPhaseDetail = (phase) => {
    // Map existing structure to modal expectations
    selectedPhase.value = {
        title: phase.name,
        completion: phase.completion,
        budget: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'LKR' }).format(phase.cost_actual || 0),
        id: phase.id
    }
    isPhaseDetailOpen.value = true
}

const getTaskStatusColor = (status) => {
    switch (status) {
        case 'COMPLETE': return 'bg-emerald-50 text-emerald-600'
        case 'ACTIVE': return 'bg-indigo-50 text-indigo-600'
        default: return 'bg-slate-50 text-slate-400'
    }
}

const openAssetManager = (type, item) => {
    targetAssetItem.value = { ...item, entity_type: type }
    isAssetModalOpen.value = true
}

const addAssetLink = async () => {
    if (!newAsset.value.name || !newAsset.value.url) {
        triggerToast('Error: Asset Identification and Resource URL required.')
        return
    }

    const updatedLinks = [...(targetAssetItem.value.asset_links || []), { ...newAsset.value, id: Date.now() }]
    const table = targetAssetItem.value.entity_type === 'PO' ? 'purchase_orders' : 'work_orders'
    
    const { error } = await supabase
        .from(table)
        .update({ asset_links: updatedLinks })
        .eq('id', targetAssetItem.value.id)

    if (!error) {
        triggerToast(`Strategic Asset Linked: ${newAsset.value.name} committed to cloud manifest.`)
        targetAssetItem.value.asset_links = updatedLinks
        newAsset.value = { name: '', url: '' }
        isAssetModalOpen.value = false // Auto-close for smoother UX
        fetchOperationalData()
        
        // Log it
        await logActivity(targetAssetItem.value.entity_type, targetAssetItem.value.id, 'Linked Asset', { asset: newAsset.value.name })
    }
}

const removeAssetLink = async (assetId) => {
    const updatedLinks = targetAssetItem.value.asset_links.filter(a => a.id !== assetId)
    const table = targetAssetItem.value.entity_type === 'PO' ? 'purchase_orders' : 'work_orders'
    
    await supabase
        .from(table)
        .update({ asset_links: updatedLinks })
        .eq('id', targetAssetItem.value.id)
    
    targetAssetItem.value.asset_links = updatedLinks
    fetchOperationalData()
}

onMounted(async () => {
    if (authStore.user.role === 'subcontractor') {
        activeTab.value = 'Business Workflow'
    }
    fetchOperationalData()
})

const filteredPOs = computed(() => {
    if (selectedProject.value === 'all') return activePOs.value
    return activePOs.value.filter(po => po.project_id === selectedProject.value)
})

const filteredWOs = computed(() => {
    if (selectedProject.value === 'all') return activeWOs.value
    return activeWOs.value.filter(wo => wo.project_id === selectedProject.value)
})

const fetchOperationalData = async () => {
    // 1. Fetch POs (Admins only see full list, hide from Subcontractors)
    if (authStore.user.role !== 'subcontractor') {
        const { data: pos } = await supabase.from('purchase_orders').select('*').order('created_at', { ascending: false })
        activePOs.value = pos || []
    }
    
    // 2. Fetch WOs with Role-Based Filter
    let query = supabase.from('work_orders').select('*, po_id(*)').order('created_at', { ascending: false })
    
    if (authStore.user.role === 'subcontractor') {
        query = query.eq('assigned_subcontractor', authStore.user.name)
    }

    const { data: wos } = await query
    activeWOs.value = wos || []
}

const submitPO = async () => {
    if (!newPO.value.client_name || !newPO.value.amount) {
        triggerToast('Error: Client Identity and Budget Manifest required for ingestion.')
        return
    }

    isSubmittingPO.value = true
    const { data, error } = await supabase.from('purchase_orders').insert({
        po_number: newPO.value.po_number,
        client_name: newPO.value.client_name,
        amount: Number(newPO.value.amount),
        status: 'pending',
        project_id: newPO.value.project_id || (selectedProject.value !== 'all' ? selectedProject.value : null)
    }).select().single()

    if (!error) {
        triggerToast(`PO Ingested Successfully: ${newPO.value.po_number} locked in cloud sync.`)
        isPOModalOpen.value = false
        newPO.value = {
            po_number: `PO-${new Date().getFullYear()}-00${Math.floor(Math.random() * 100)}`,
            client_name: '',
            amount: 0,
            project_id: ''
        }
        await fetchOperationalData()
        
        // Log it
        await logActivity('PO', data.id, 'Created', { client: data.client_name, amount: data.amount })
        await addNotification('New PO Detected', `Inbound manifest ${data.po_number} from ${data.client_name} is awaiting board approval.`, 'info')
    } else {
        triggerToast(`Ingestion Blocked: ${error.message}`)
    }
    isSubmittingPO.value = false
}

const totalPOAmount = computed(() => activePOs.value.reduce((acc, po) => acc + Number(po.amount), 0))
const activeWOCount = computed(() => activeWOs.value.filter(wo => wo.status !== 'completed').length)
const totalUnbilled = computed(() => activeWOs.value.filter(wo => wo.status === 'completed').reduce((acc, wo) => acc + Number(wo.budget_allocation || 0), 0))

// Actions
const handleAction = async (actionType, po) => {
    triggerToast(`Syncing Cloud Engine: Purchase Order [${po.po_number}] set to ${actionType.toUpperCase()}...`)
    
    if (actionType === 'Converted') {
        const { error } = await supabase.from('purchase_orders').update({ status: 'converted' }).eq('id', po.id)
        if (!error) {
            // Create a default WO
            await supabase.from('work_orders').insert({
                po_id: po.id,
                name: `Production WO for ${po.po_number}`,
                assigned_supervisor: 'Amila Admin',
                status: 'pending',
                budget_allocation: po.amount * 0.7,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            })
            fetchOperationalData()
            triggerToast(`Work Order generated and linked to Supervisor. Active Production Phase Engaged.`)
        }
    } else {
        await supabase.from('purchase_orders').update({ status: 'approved' }).eq('id', po.id)
        fetchOperationalData()
    }
}

const handleWOAction = async (action, wo) => {
    if (action === 'Completed') {
        const { error } = await supabase.from('work_orders').update({ status: 'completed' }).eq('id', wo.id)
        if (!error) {
            fetchOperationalData()
            triggerToast(`Work Order Verified. Digital Receipt Manifest Generated for ${wo.name}.`)
            
            // Trigger Notification
            await addNotification(
                'Work Order Completed',
                `Unit "${wo.name}" has reached final production state and is ready for billing.`,
                'success'
            )

            // Log Activity
            await logActivity('WO', wo.id, 'Completed', { name: wo.name })
        }
    } else if (action === 'Invoiced') {
        const invoiceAmount = Number(wo.budget_allocation || 0)
        triggerToast(`Strategic Ledger Sync: Posting ${brandingStore.currency} ${invoiceAmount.toLocaleString()} to Corporate Revenue Pipeline...`)
        
        try {
            // 1. Push to Invoices Ledger (New Record)
            const { data: inv, error: invErr } = await supabase.from('invoices').insert({
                wo_id: wo.id,
                client_name: wo.po_id?.client_name || 'Organization Client',
                amount: invoiceAmount,
                status: 'unpaid'
            }).select().single()

            if (invErr) throw invErr

            // 2. Push record to general BI Finance Transactions
            await supabase.from('bi_transactions').insert({
                transaction_date: new Date().toISOString().split('T')[0],
                amount: invoiceAmount,
                type: 'revenue',
                category: 'Project Invoice',
                description: `Invoice ${inv.id.slice(0,8)} for WO: ${wo.name}`,
                project_id: selectedProject.value !== 'all' ? selectedProject.value : (wo.project_id || null)
            })

            // 3. Activity & Notification
            await addNotification(
                'Financial Invoice Generated',
                `A new invoice for ${brandingStore.currency} ${invoiceAmount.toLocaleString()} has been committed to the ledger.`,
                'invoice'
            )
            await logActivity('Invoice', inv.id, 'Invoiced', { wo_id: wo.id, amount: invoiceAmount })
            
            // 4. Trigger Download
            handlePDFDownload({ data: wo, type: 'Invoice' })
            
            triggerToast(`Success: Revenue Committed. Digital Invoice Generated and Archived in Ledger.`)
            fetchOperationalData()
        } catch (err) {
            console.error(err)
            triggerToast("Sync Error: Failed to commit invoice to strategic ledger.")
        }
    }
}

const handlePDFDownload = ({ data, type }) => {
    triggerToast(`Compiling Strategic ${type} Manifest...`)
    generatePDF(data, type)
    triggerToast(`✓ Digital ${type} Downloaded.`)
}

// Drilldown State
const isDrilldownOpen = ref(false)
const drilldownCategory = ref('')
const openDrilldown = (cat) => {
    drilldownCategory.value = cat;
    isDrilldownOpen.value = true;
}
const triggerToast = (msg) => {
  toastState.value = { show: true, message: msg }
  setTimeout(() => { toastState.value.show = false }, 4000)
}
const executeOptimization = () => {
    isOptimizing.value = true;
    triggerToast("Executing AI Multi-threading Shard Protocol...")
    setTimeout(() => {
        isOptimizing.value = false;
        triggerToast("✓ Optimization Applied: Latency stabilized.")
    }, 2800)
}

const ops_metrics = [
    { label: 'Platform Uptime', value: '99.98%', percent: '0.02', trend: 'up', icon: ActivityIcon },
    { label: 'Lead Response Time', value: '4.2m', percent: '14', trend: 'down', icon: Zap },
    { label: 'Workload Density', value: '84%', percent: '2.1', trend: 'up', icon: Layers },
    { label: 'System Saturation', value: '12.8ms', percent: '5', trend: 'down', icon: Cpu }
]

const opLogs = [
    { id: '#EXEC-9821', name: 'Global Subscription Batch', throughput: '4.2 req/s', icon: Workflow },
    { id: '#EXEC-9820', name: 'AI Image Manifest Creation', throughput: '1.8 req/s', icon: Terminal },
    { id: '#EXEC-9819', name: 'Supabase Edge Sync', throughput: '112 req/s', icon: Server },
    { id: '#EXEC-9818', name: 'CRM Webhook Relay', throughput: '9 req/s', icon: RefreshCw }
]

const chartSeries = [{ name: 'Throughput', data: [42, 52, 38, 65, 50, 109, 100, 120, 80, 95] }]
const chartOptions = {
    chart: { type: 'area', toolbar: { show: false }, sparkline: { enabled: false }, fontFamily: 'Inter' },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3, colors: ['#6366f1'] },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05 } },
    xaxis: { categories: ['1AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '11PM', '12AM'], labels: { style: { colors: '#64748b', fontWeight: 600 } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { show: false } },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    tooltip: { theme: 'dark' }
}

const varianceChartSeries = [{
    name: 'Cost Variance (%)',
    data: [12, -4.5, 8.2, -2.1, 15, 3.4, -1.2]
}]
const varianceChartOptions = {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Inter' },
    plotOptions: { bar: { borderRadius: 12, colors: { ranges: [{ from: -100, to: 0, color: '#f43f5e' }, { from: 1, to: 100, color: '#6366f1' }] } } },
    dataLabels: { enabled: false },
    xaxis: { categories: ['Civil', 'Struct', 'MEP', 'Fin', 'HVAC', 'Land', 'Sec'], labels: { style: { colors: '#64748b', fontWeight: 800 } } },
    grid: { borderColor: '#f1f5f9' },
    tooltip: { theme: 'dark' }
}

const burnChartSeries = [
    { name: 'Plan', data: [10, 25, 45, 60, 80, 95, 100] },
    { name: 'Actual', data: [12, 28, 48, 65, 85, 98, 110] }
]
const burnChartOptions = {
    chart: { type: 'line', toolbar: { show: false }, fontFamily: 'Inter' },
    stroke: { curve: 'smooth', width: 4 },
    colors: ['#cbd5e1', '#6366f1'],
    xaxis: { categories: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7'], labels: { style: { colors: '#64748b', fontWeight: 800 } } },
    grid: { borderColor: '#f1f5f9' },
    tooltip: { theme: 'dark' },
    legend: { position: 'top', horizontalAlign: 'right', fontWeight: 800 }
}

const filteredProjectMilestones = computed(() => {
    if (selectedProject.value === 'all') return projectMilestones.value
    // In a real scenario, icons/data would be strictly filtered by ID.
    // For the demo, I'll randomize health for different projects.
    return projectMilestones.value.map(ms => ({
        ...ms,
        completion: selectedProject.value === 'all' ? ms.completion : Math.min(100, ms.completion + (Math.random() * 20 - 10))
    }))
})

const filteredVarianceChartSeries = computed(() => [{
    name: 'Cost Variance (%)',
    data: selectedProject.value === 'all' 
        ? [12, -4.5, 8.2, -2.1, 15, 3.4, -1.2]
        : [Math.random()*20, Math.random()*-10, Math.random()*15, Math.random()*-5, Math.random()*10, Math.random()*5, Math.random()*-8]
}])

const filteredBurnChartSeries = computed(() => [
    { name: 'Plan', data: [10, 25, 45, 60, 80, 95, 100] },
    { name: 'Actual', data: selectedProject.value === 'all'
        ? [12, 28, 48, 65, 85, 98, 110]
        : [10, 20, 40, 55, 75, 90, 105] }
])

const isRoiDetailOpen = ref(false)
const selectedRoiDetail = ref(null)

const openRoiDetail = (type) => {
    const project = projects.value.find(p => p.id === selectedProject.value)
    const name = project?.name || 'Global Portfolio'
    
    // Premium $5,000 Level Forensic Analysis Payload
    const details = {
        yields: {
            title: 'Operational Yield Forensic Analysis',
            tag: 'A.I. LEVEL 5 DEEP SCAN',
            content: `Extensive multi-node ledger scan completed for ${name}. Our neural network correlates historical labor expenditures against current asset utilization, predicting a potential margin leakage of 8%.`,
            confidence: 94,
            stats: [
                { label: 'EBITDA Margin', value: '24.2%' },
                { label: 'Asset Utilization', value: '88%' }
            ],
            checklist: [
                { id: '1', text: 'Re-negotiate tier-1 sub-contractor rates.', done: false },
                { id: '2', text: 'Automate weekly manifest parsing.', done: true },
                { id: '3', text: 'Halt expansion in low-yield rural nodes.', done: false }
            ]
        },
        growth: {
            title: 'Enterprise Growth Master-Plan',
            tag: 'STRATEGIC EXPANSION NODE',
            content: `Strategic advisory assets for ${name} represent the highest growth potential for 2026. Data streams indicate a lucrative gap in automated Smart City developments.`,
            confidence: 88,
            stats: [
                { label: 'Market Opportunity', value: '$2.5M+' },
                { label: 'Execution Complexity', value: 'High' }
            ],
            checklist: [
                { id: '1', text: 'Acquire spatial intelligence drone assets.', done: false },
                { id: '2', text: 'Launch "Platinum" service tier.', done: false }
            ]
        },
        settlement: {
            title: 'Treasury & Settlement Flow Audit',
            tag: 'LIQUIDITY GOVERNANCE',
            content: `Current liquidity buffer for ${name} remains stable. However, AI detects a 12-day drift in Tier-3 vendor payments. Corrective action is strictly recommended.`,
            confidence: 98,
            stats: [
                { label: 'Liquidity Buffer', value: 'Stable' },
                { label: 'Avg Days Payable', value: '42' }
            ],
            checklist: [
                { id: '1', text: 'Incentivize early payments (2.5% discount).', done: false },
                { id: '2', text: 'Audit Q1 bulk ingestion records.', done: true }
            ]
        },
        simulation: {
            title: 'Nexus Simulation Impact matrix',
            tag: 'FUTURE-STATE MODELING',
            content: `The forecasted ROI for ${name} assumes an aggressive 85% success rate of the current optimization plan. Adjusting the WBS nodes yields immediate capital efficiency.`,
            confidence: 91,
            stats: [
                { label: 'Forecast Accuracy', value: '91%' },
                { label: 'Efficiency Gain', value: '+14%' }
            ],
            checklist: [
                { id: '1', text: 'Deploy resource re-allocation script.', done: false },
                { id: '2', text: 'Finalize Q3 executive board presentation.', done: false }
            ]
        }
    }
    
    selectedRoiDetail.value = details[type]
    isRoiDetailOpen.value = true
}

const roiMetrics = computed(() => {
    if (selectedProject.value === 'all') {
        return {
            coreYield: '12.4%',
            specializedYield: '28.0%',
            recommendation: 'Pivot to Specialization for 2.2x Margin gain.',
            opportunities: [
                { name: 'Managed Vertical Solutions', gain: '+$42k' },
                { name: 'Strategic Advisory Assets', gain: '+$18k' },
                { name: 'Scale-as-a-Service Hub', gain: '+$12k' }
            ],
            settlement: { tier1: 100, tier2: 65, tier3: 22 },
            simulationSeries: [
                { name: 'Global Baseline', data: [31, 40, 28, 51, 42, 109, 100] },
                { name: 'Global Optimization', data: [11, 32, 45, 32, 34, 52, 41] }
            ]
        }
    } else {
        const project = projects.value.find(p => p.id === selectedProject.value)
        const name = project?.name || 'Project Node'
        return {
            coreYield: '18.2%',
            specializedYield: '34.5%',
            recommendation: `Asset efficiency for ${name} can be scaled by 12% in Q3.`,
            opportunities: [
                { name: `${name} Resource Sync`, gain: '+$15k' },
                { name: 'Node Cost Reduction', gain: '+$9k' }
            ],
            settlement: { tier1: 92, tier2: 78, tier3: 45 },
            simulationSeries: [
                { name: 'Current Progress', data: [45, 52, 38, 24, 33, 26, 21] },
                { name: 'AI Forecasted ROI', data: [35, 41, 62, 42, 13, 18, 29] }
            ]
        }
    }
})

const roiChartOptions = ref({
    chart: { type: 'bar', toolbar: { show: false }, sparkline: { enabled: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 8 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], labels: { style: { colors: '#64748b' } } },
    yaxis: { labels: { style: { colors: '#64748b' } } },
    fill: { opacity: 1, colors: ['#6366f1', '#10b981'] },
    tooltip: { theme: 'dark' },
    grid: { borderColor: '#ffffff10' },
    legend: { show: true, position: 'top', horizontalAlign: 'right', labels: { colors: '#fff' } }
})
</script>

<style scoped>
@keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes shimmer { 100% { transform: translateX(100%); } }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>
