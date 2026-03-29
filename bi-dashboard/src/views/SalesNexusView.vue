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
    { id: 4, name: 'Samantha Silva', company: 'Global Brands SL', role: 'Procurement Lead', platform: 'facebook', score: 91, status: 'discovered', activity: 'Inquired about automation', lastMsg: 'Our PO matching agent is live now...' }
]);

const filters = ref({ platform: 'all', minScore: 80 });

const filteredLeads = computed(() => {
    return leads.value.filter(l => {
        const platformMatch = filters.value.platform === 'all' || l.platform === filters.value.platform;
        const scoreMatch = l.score >= filters.value.minScore;
        return platformMatch && scoreMatch;
    });
});

const showModal = ref(false);
const selectedLead = ref(null);
const currentDraft = ref('');
const isSending = ref(false);
const toastMessage = ref('');

const openOutreach = (lead) => {
    selectedLead.value = lead;
    currentDraft.value = lead.lastMsg;
    showModal.value = true;
};

const sendOutreach = () => {
    isSending.value = true;
    setTimeout(() => {
        isSending.value = false;
        showModal.value = false;
        // UPDATE STATUS
        const idx = leads.value.findIndex(l => l.id === selectedLead.value.id);
        if (idx !== -1) leads.value[idx].status = 'contacted';
        
        toastMessage.value = `Outreach sent to ${selectedLead.value.name} successfully!`;
        setTimeout(() => toastMessage.value = '', 3000);
    }, 1500);
};

const getStatusColor = (status) => {
    if (status === 'engaging') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
    if (status === 'contacted') return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5';
    return 'text-slate-400 border-slate-700 bg-white/5';
};

const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 80) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    return 'text-slate-400 bg-white/5 border-white/10';
};
</script>

<template>
    <div class="min-h-screen bg-black p-6 lg:p-10 text-white font-sans selection:bg-red-500/30">
        <!-- TOAST SYSTEM -->
        <Transition name="fade">
            <div v-if="toastMessage" class="fixed bottom-10 right-10 z-[100] bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-[950] uppercase tracking-widest flex items-center gap-3 border-b-4 border-red-800">
                <CheckCircle2 class="w-6 h-6" /> {{ toastMessage }}
            </div>
        </Transition>

        <!-- OUTREACH MODAL -->
        <Transition name="fade">
            <div v-if="showModal" class="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
                <div class="bg-slate-950 w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-[0_0_50px_-12px_rgba(220,38,38,0.3)] overflow-hidden">
                    <div class="p-12 space-y-8">
                        <div class="flex items-start justify-between">
                            <div class="flex gap-6">
                                <div class="w-16 h-16 rounded-[1.5rem] bg-red-600 flex items-center justify-center text-2xl font-[950] shadow-lg shadow-red-600/20 text-white">
                                    {{ selectedLead?.name[0] }}
                                </div>
                                <div>
                                    <h4 class="text-3xl font-[950] tracking-tight text-white italic uppercase">{{ selectedLead?.name }}</h4>
                                    <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ selectedLead?.role }} @ {{ selectedLead?.company }}</p>
                                </div>
                            </div>
                            <button @click="showModal = false" class="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <ShieldAlert class="w-7 h-7 text-slate-500 rotate-45" />
                            </button>
                        </div>

                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <label class="text-[11px] font-[950] text-red-500 uppercase tracking-widest flex items-center gap-2 italic">
                                    <Zap class="w-4 h-4" /> AI Outreach Transmission
                                </label>
                                <span class="text-[9px] font-black text-slate-700 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">PLATFORM: {{ selectedLead?.platform }}</span>
                            </div>
                            <textarea v-model="currentDraft" rows="6" 
                                class="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 text-sm font-bold text-slate-200 focus:border-red-600 outline-none transition-all resize-none shadow-inner"></textarea>
                        </div>

                        <div class="flex items-center justify-between pt-6">
                            <div class="flex items-center gap-3">
                                <div class="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
                                <span class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Encrypted via Operational Sovereignty Protocols</span>
                            </div>
                            <div class="flex gap-2">
                                <button @click="showModal = false" class="px-8 py-5 text-[11px] font-[950] text-slate-400 uppercase tracking-[0.2em] hover:text-white transition-colors">Abort</button>
                                <button @click="sendOutreach" 
                                    :disabled="isSending"
                                    class="px-12 py-5 bg-red-600 rounded-[1.5rem] text-[11px] font-[950] text-white uppercase tracking-[0.2em] shadow-2xl shadow-red-600/30 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                                    <span v-if="isSending" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    <span v-else class="flex items-center gap-3 italic">Initiate Broadcast <Send class="w-4 h-4" /></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- HEADER -->
        <div class="max-w-7xl mx-auto space-y-16">
            <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                <div class="space-y-6">
                    <div class="flex items-center gap-4">
                        <div class="p-4 bg-red-600 rounded-[2rem] shadow-2xl shadow-red-600/30">
                            <Target class="w-10 h-10 text-white animate-pulse" />
                        </div>
                        <div>
                            <h1 class="text-5xl lg:text-6xl font-[1000] tracking-tighter uppercase italic text-white">AI Social Nexus</h1>
                            <p class="text-red-500 text-xs font-black tracking-[0.4em] uppercase mt-2">Elite Lead Discovery & Outreach Engine</p>
                        </div>
                    </div>
                </div>

                <!-- SCAN STATUS -->
                <div class="flex items-center gap-8 px-10 py-6 bg-white/[0.03] rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl">
                    <div class="flex flex-col">
                        <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Matrix Scan</span>
                        <span class="text-2xl font-black text-white italic">1,402 Sessions</span>
                    </div>
                    <div class="w-px h-12 bg-white/10"></div>
                    <div class="flex flex-col">
                        <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">Viral Velocity</span>
                        <span class="text-2xl font-black text-red-500 italic">+24.5% /hr</span>
                    </div>
                </div>
            </div>

            <!-- CORE ENGINE VIEW -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                <!-- FILTER BAR (LEFT) -->
                <div class="lg:col-span-3 space-y-8">
                    <div class="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
                        <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6 pb-2 border-b border-white/5 italic">Targeting Matrix</h4>
                        
                        <div class="space-y-5">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Core Source</label>
                            <div class="flex flex-col gap-2.5">
                                <button @click="filters.platform = 'all'" :class="filters.platform === 'all' ? 'bg-white text-black' : 'bg-white/5 text-slate-400 border border-white/5'" class="px-5 py-4 rounded-2xl text-[10px] font-[950] uppercase tracking-widest transition-all">Omni-Channel</button>
                                <button @click="filters.platform = 'linkedin'" :class="filters.platform === 'linkedin' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-white/5 text-slate-400 border border-white/5'" class="px-5 py-4 rounded-2xl text-[10px] font-[950] uppercase tracking-widest transition-all flex items-center justify-between group">
                                    LinkedIn <Linkedin class="w-4 h-4 group-hover:scale-110 transition-transform"/>
                                </button>
                                <button @click="filters.platform = 'facebook'" :class="filters.platform === 'facebook' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-white/5 text-slate-400 border border-white/5'" class="px-5 py-4 rounded-2xl text-[10px] font-[950] uppercase tracking-widest transition-all flex items-center justify-between group">
                                    Facebook <Facebook class="w-4 h-4 group-hover:scale-110 transition-transform"/>
                                </button>
                            </div>
                        </div>

                        <div class="pt-6 border-t border-white/5">
                            <label class="text-[10px] font-[950] text-slate-400 uppercase tracking-widest block mb-4">Growth Index: {{ filters.minScore }}%</label>
                            <input type="range" v-model="filters.minScore" min="50" max="100" class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600">
                        </div>
                    </div>

                    <!-- AI INSIGHTS CARD -->
                    <div class="bg-red-600/5 p-8 rounded-[2.5rem] border border-red-600/10 relative overflow-hidden group shadow-2xl">
                        <Zap class="absolute -right-6 -bottom-6 w-32 h-32 text-red-600/[0.03] group-hover:scale-125 transition-all group-hover:text-red-600/5" />
                        <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-3 italic">AI Intelligence Node</h4>
                        <p class="text-[11px] font-black text-slate-400 leading-relaxed italic uppercase tracking-tighter">
                            "High density interaction detected in Swedish Logistics sectors. Priority Shift: focus on Sustainability messaging via LinkedIn for 18% higher engagement."
                        </p>
                    </div>
                </div>

                <!-- LEAD FEED (RIGHT) -->
                <div class="lg:col-span-9 space-y-8">
                    <div v-for="lead in filteredLeads" :key="lead.id" 
                        class="bg-white/[0.02] p-8 rounded-[3rem] border border-white/5 hover:border-red-600/20 hover:bg-white/[0.04] transition-all group relative overflow-hidden shadow-2xl">
                        
                        <div class="flex flex-col lg:flex-row justify-between gap-8 relative z-10">
                            <!-- LEAD INFO -->
                            <div class="flex gap-8">
                                <div class="w-20 h-20 rounded-[1.5rem] bg-white/[0.03] border border-white/5 flex items-center justify-center text-3xl font-[1000] text-red-600 uppercase shadow-inner group-hover:bg-red-600 group-hover:text-white transition-all duration-500 italic">
                                    {{ lead.name[0] }}
                                </div>
                                <div class="space-y-1.5 flex flex-col justify-center">
                                    <div class="flex items-center gap-4">
                                        <h3 class="text-2xl font-[1000] tracking-tighter uppercase italic group-hover:text-red-500 transition-colors">{{ lead.name }}</h3>
                                        <div :class="getStatusColor(lead.status)" class="px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest h-fit shadow-sm">
                                            {{ lead.status }}
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <span class="text-[11px] font-black text-slate-500 uppercase tracking-widest">{{ lead.role }} @</span>
                                        <span class="text-[11px] font-[950] text-white uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 shadow-sm">{{ lead.company }}</span>
                                    </div>
                                    <div class="flex items-center gap-3 mt-3">
                                        <component :is="lead.platform === 'linkedin' ? Linkedin : Facebook" class="w-4 h-4 text-red-600" />
                                        <span class="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] italic">{{ lead.activity }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- ACTIONS & SCORE -->
                            <div class="flex flex-col lg:items-end justify-between py-1">
                                <div :class="getScoreColor(lead.score)" class="px-5 py-2 rounded-full border text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-sm italic">
                                    <TrendingUp class="w-4 h-4" /> Growth Potential: {{ lead.score }}%
                                </div>
                                
                                <div class="flex items-center gap-4 mt-6 lg:mt-0">
                                    <button class="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group/btn shadow-xl">
                                        <MessageSquare class="w-5 h-5 text-slate-500 group-hover/btn:text-white transition-colors" />
                                    </button>
                                    <button @click="openOutreach(lead)" class="px-10 py-5 bg-red-600 rounded-[1.5rem] text-[11px] font-[1000] text-white uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_-10px_rgba(220,38,38,0.5)] flex items-center gap-3 italic">
                                        Launch Outreach <Send class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- AUTOMATED DRAFT PREVIEW -->
                        <div class="mt-10 p-6 bg-black rounded-[2rem] border border-white/5 border-l-4 border-l-red-600 border-dashed cursor-pointer hover:bg-white/[0.02] transition-all group/draft shadow-inner" @click="openOutreach(lead)">
                            <div class="flex items-center gap-3 mb-3">
                                <Zap class="w-4 h-4 text-red-600 animate-pulse" />
                                <span class="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] italic">Autonomous AI Synthesis</span>
                            </div>
                            <p class="text-[12px] font-bold text-slate-400 italic group-hover/draft:text-white transition-colors">"{{ lead.lastMsg }}"</p>
                        </div>
                    </div>

                    <!-- EMPTY STATE -->
                    <div v-if="filteredLeads.length === 0" class="py-32 text-center space-y-6">
                        <ShieldAlert class="w-20 h-20 text-slate-900 mx-auto opacity-50" />
                        <h3 class="text-2xl font-[1000] text-slate-800 uppercase tracking-widest italic opacity-50">Matrix Isolation: No Leads Found</h3>
                        <p class="text-slate-600 text-sm font-black uppercase tracking-widest opacity-50">Expand your targeting matrix values.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* High-end scrollbar for dark mode */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #000000;
}
::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #dc2626;
}
</style>
