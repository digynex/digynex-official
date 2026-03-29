<script setup>
import { ref, computed } from 'vue';
import { 
    Users, 
    Link2, 
    Facebook, 
    Linkedin, 
    Search, 
    Target, 
    Zap, 
    MessageSquare, 
    CheckCircle2, 
    Clock, 
    ShieldAlert,
    TrendingUp,
    Send
} from 'lucide-vue-next';

// LEAD DISCOVERY ENGINE (MOCK LOGIC)
const leads = ref([
    { id: 1, name: 'Erik Andersson', company: 'Svea Logistics AB', role: 'Operations Director', platform: 'linkedin', score: 94, status: 'engaging', activity: 'Commented on AI Trends', lastMsg: 'I noticed your interest in AI scalability...' },
    { id: 2, name: 'Nilanthi Perera', company: 'Island Tea Exporters', role: 'CFO', platform: 'facebook', score: 88, status: 'discovered', activity: 'Joined Logistics Hub Group', lastMsg: 'Are you looking to automate your grade visuals?' },
    { id: 3, name: 'Lars Bergström', company: 'Nordic Transports', role: 'CEO', platform: 'linkedin', score: 72, status: 'contacted', activity: 'Shared strategic post', lastMsg: 'DigyNex could save you 15% on overhead...' },
    { id: 4, name: 'Samantha Silva', company: 'Global Brands SL', role: 'Procurement Lead', platform: 'facebook', score: 91, status: 'engaging', activity: 'Inquired about automation', lastMsg: 'Our PO matching agent is live now...' }
]);

const filters = ref({ platform: 'all', minScore: 80 });

const filteredLeads = computed(() => {
    return leads.value.filter(l => {
        const platformMatch = filters.value.platform === 'all' || l.platform === filters.value.platform;
        const scoreMatch = l.score >= filters.value.minScore;
        return platformMatch && scoreMatch;
    });
});

const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 80) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    return 'text-slate-400 bg-white/5 border-white/10';
};
</script>

<template>
    <div class="min-h-screen bg-slate-950 p-6 lg:p-10 text-white font-sans selection:bg-indigo-500/30">
        <!-- HEADER -->
        <div class="max-w-7xl mx-auto space-y-12">
            <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div class="space-y-4">
                    <div class="flex items-center gap-3">
                        <div class="p-3 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-600/20">
                            <Target class="w-8 h-8 text-white animate-pulse" />
                        </div>
                        <div>
                            <h1 class="text-4xl font-[950] tracking-tighter uppercase italic">AI Social Nexus</h1>
                            <p class="text-slate-500 text-sm font-black tracking-widest uppercase">Autonomous Lead Discovery & Outreach Hub</p>
                        </div>
                    </div>
                </div>

                <!-- SCAN STATUS -->
                <div class="flex items-center gap-6 px-8 py-5 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
                    <div class="flex flex-col">
                        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Scan Active</span>
                        <span class="text-xl font-black text-emerald-400">1,402 Sessions</span>
                    </div>
                    <div class="w-px h-10 bg-white/10"></div>
                    <div class="flex flex-col italic">
                        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Viral Velocity</span>
                        <span class="text-xl font-black text-indigo-400">+24.5% /hr</span>
                    </div>
                </div>
            </div>

            <!-- CORE ENGINE VIEW -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                <!-- FILTER BAR (LEFT) -->
                <div class="lg:col-span-3 space-y-8">
                    <div class="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-6">
                        <h4 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 pb-2 border-b border-white/5">Targeting Matrix</h4>
                        
                        <div class="space-y-4">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Source Platform</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button @click="filters.platform = 'all'" :class="filters.platform === 'all' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'" class="px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">All Sources</button>
                                <button @click="filters.platform = 'linkedin'" :class="filters.platform === 'linkedin' ? 'bg-[#0077b5] text-white' : 'bg-white/5 text-slate-400'" class="px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between">LinkedIn <Linkedin class="w-4 h-4"/></button>
                                <button @click="filters.platform = 'facebook'" :class="filters.platform === 'facebook' ? 'bg-[#1877f2] text-white' : 'bg-white/5 text-slate-400'" class="px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between">Facebook <Facebook class="w-4 h-4"/></button>
                            </div>
                        </div>

                        <div class="pt-4">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Min. Propensity Score: {{ filters.minScore }}%</label>
                            <input type="range" v-model="filters.minScore" min="50" max="100" class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500">
                        </div>
                    </div>

                    <!-- AI INSIGHTS CARD -->
                    <div class="bg-indigo-600/10 p-6 rounded-3xl border border-indigo-500/20 relative overflow-hidden group">
                        <Zap class="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-500/10 group-hover:scale-125 transition-all" />
                        <h4 class="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">AI Nexus Suggestion</h4>
                        <p class="text-[11px] font-bold text-slate-300 leading-relaxed italic">
                            "The Swedish Logistics community is currently heavily discussing 'Decarbonization'. Shift outreach scripts to focus on Green Efficiency for higher response rates."
                        </p>
                    </div>
                </div>

                <!-- LEAD FEED (RIGHT) -->
                <div class="lg:col-span-9 space-y-6">
                    <div v-for="lead in filteredLeads" :key="lead.id" 
                        class="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all group relative overflow-hidden">
                        
                        <div class="flex flex-col lg:flex-row justify-between gap-6 relative z-10">
                            <!-- LEAD INFO -->
                            <div class="flex gap-5">
                                <div class="w-16 h-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-2xl font-[950] text-indigo-400 uppercase">
                                    {{ lead.name[0] }}
                                </div>
                                <div class="space-y-1">
                                    <h3 class="text-xl font-[950] tracking-tight group-hover:text-indigo-400 transition-colors">{{ lead.name }}</h3>
                                    <div class="flex items-center gap-2">
                                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ lead.role }} @</span>
                                        <span class="text-[10px] font-black text-white uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded">{{ lead.company }}</span>
                                    </div>
                                    <div class="flex items-center gap-2 mt-2">
                                        <component :is="lead.platform === 'linkedin' ? Linkedin : Facebook" class="w-3 h-3 text-slate-500" />
                                        <span class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{{ lead.activity }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- ACTIONS & SCORE -->
                            <div class="flex flex-col lg:items-end justify-between">
                                <div :class="getScoreColor(lead.score)" class="px-4 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp class="w-3.5 h-3.5" /> Propensity: {{ lead.score }}%
                                </div>
                                
                                <div class="flex items-center gap-3 mt-4 lg:mt-0">
                                    <button class="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                                        <MessageSquare class="w-4 h-4 text-slate-300" />
                                    </button>
                                    <button class="px-6 py-3 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2">
                                        Launch Outreach <Send class="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- AUTOMATED DRAFT PREVIEW -->
                        <div class="mt-8 p-4 bg-slate-900/50 rounded-2xl border border-white/5 border-l-4 border-l-indigo-500 border-dashed">
                            <div class="flex items-center gap-2 mb-2">
                                <Zap class="w-3 h-3 text-indigo-400" />
                                <span class="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Next-LeveL AI Draft</span>
                            </div>
                            <p class="text-[11px] font-bold text-slate-400 italic">"{{ lead.lastMsg }}"</p>
                        </div>
                    </div>

                    <!-- EMPTY STATE -->
                    <div v-if="filteredLeads.length === 0" class="py-20 text-center space-y-4">
                        <ShieldAlert class="w-16 h-16 text-slate-800 mx-auto" />
                        <h3 class="text-xl font-black text-slate-600 uppercase tracking-widest italic">No High-Propensity Leads Matched</h3>
                        <p class="text-slate-500 text-xs">Adjust your targeting matrix to expand the Nexus reach.</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
/* High-end scrollbar for dark mode */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #020617;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
