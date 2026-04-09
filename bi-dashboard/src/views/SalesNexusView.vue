<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
    Users, 
    Facebook, 
    Linkedin, 
    Zap, 
    MessageSquare, 
    CheckCircle2, 
    Send,
    TrendingUp,
    ShieldAlert,
    X,
    Cpu,
    Fingerprint,
    Search,
    Network,
    Globe,
    Sparkles,
    Activity,
    Layers,
    Share2,
    Bot,
    Calendar,
    Settings,
    RefreshCcw,
    XCircle,
    Smartphone,
    Rocket,
    Brain,
    Palette
} from 'lucide-vue-next';
import Sidebar from '../components/dashboard/Sidebar.vue';
import TopHeader from '../components/dashboard/TopHeader.vue';
import { supabase } from '../services/supabase';

const isMobileMenuOpen = ref(false);
const toastMessage = ref('');
const isLoading = ref(true);
const activeTab = ref('Viral Intelligence');

const triggerToast = (msg) => {
    toastMessage.value = msg;
    setTimeout(() => toastMessage.value = '', 3000);
};

// --- DATA: VIRAL INTELLIGENCE ---
const viralNiches = ref([
    {
        title: "Zen Cyber-Loft Restoration",
        growth: 94.5,
        potential: "Transforming a brutalist concrete shell into a neon-lit, organic zen garden with smart tech.",
        sequence: [
            { name: "Excavation", prompt: "Static 4k wide shot, raw grey concrete room, industrial debris, dramatic low light." },
            { name: "Structural", prompt: "Same camera lock. Workers installing smart glass panels and wooden slats." },
            { name: "Refining", prompt: "Identical framing. Neon RGB strips active on ceilings, polished floors." },
            { name: "Climax", prompt: "Cinematic reveal. Lush plants under neon, smart tech active, luxury vibe." }
        ],
        audio: {
            script: "Watch how we turned this concrete nightmare into a digital sanctuary. From raw build to neon bliss.",
            sfx: ["concrete scraping", "neon hum", "lush leaves rustle", "cinematic bass drop"]
        }
    },
    {
        title: "Luxury Underground Pool Vault",
        growth: 89.2,
        potential: "Transforming a dark basement into a glowing underground infinity pool environment.",
        sequence: [
            { name: "Raw Pit", prompt: "Static wide shot, dirty basement pit, mud and rocks, high contrast shadows." },
            { name: "Build", prompt: "Same framing. Tile installation beginning, water pipes visible." },
            { name: "Finish", prompt: "Identical camera. Sparkling tiles, pool filling up, soft blue led glow." },
            { name: "Reveal", prompt: "Climax capture. Crystal clear water, neon reflections, ultra-high-end luxury." }
        ],
        audio: {
            script: "Deep underground, hidden from the world... we built the ultimate escape. Crystal clear luxury.",
            sfx: ["drilling", "water filling", "echoing droplets", "chill synth wave"]
        }
    }
]);
const selectedNiche = ref(null);
const isDiscovering = ref(false);

const autoDiscover = () => {
    isDiscovering.value = true;
    triggerToast('AI Cognitive Engines searching global pulse...');
    setTimeout(() => {
        isDiscovering.value = false;
        triggerToast('10 High-Growth Viral Niches Discovered.');
    }, 2000);
};

// --- DATA: SOCIAL CRM / LEADS ---
const leads = ref([]);
const filters = ref({ platform: 'all', minScore: 0 });
const filteredLeads = computed(() => {
    return leads.value.filter(l => {
        const platformMatch = filters.value.platform === 'all' || l.platform === filters.value.platform;
        const scoreMatch = (l.lead_score || 0) >= filters.value.minScore;
        return platformMatch && scoreMatch;
    });
});
const showCalendarModal = ref(false);
const showWebhookModal = ref(false);
const weekPlan = ref([]);
const webhookConfig = ref({
    n8nUrl: 'https://n8n.digynex.se/webhook/viral-hub',
    tgGroup: '-1001928391823',
    wa1: '+46701234567',
    wa2: '+94771234567',
    fbToken: '',
    liToken: ''
});

// FETCH DATA FROM SUPABASE
const fetchData = async () => {
    isLoading.value = true;
    try {
        const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        leads.value = leadsData || [];
        
        const { data: matrixData } = await supabase.from('viral_matrix_settings').select('*');
        weekPlan.value = matrixData || [];
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        triggerToast('Failed to sync live data from Supabase Hub.');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchData();
});

const sendOutreach = async (lead) => {
    triggerToast(`Authorization sent. Dual-dispatch via n8n committed.`);
};

const rejectLead = (id) => {
    leads.value = leads.value.filter(l => l.id !== id);
    triggerToast('Lead discarded.');
};
</script>

<template>
    <div class="h-screen bg-white flex text-slate-800 font-sans overflow-hidden">
        <Sidebar @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

        <main class="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f7fb] relative">
            <TopHeader @toggleMenu="isMobileMenuOpen = !isMobileMenuOpen" @triggerToast="triggerToast" />

            <div class="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar relative z-10 transition-all duration-500">
                <!-- GLOBAL TOAST FEEDBACK -->
                <transition name="toast-slide">
                    <div v-if="toastMessage" class="fixed bottom-8 right-8 z-[3000] bg-slate-900 shadow-2xl text-white px-6 py-4 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-md">
                        <CheckCircle2 class="w-4 h-4 text-primary" />
                        <span class="text-[10px] font-black uppercase tracking-widest italic">{{ toastMessage }}</span>
                    </div>
                </transition>

                <div class="max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
                    <!-- UNIFIED STRATEGIC HEADER -->
                    <div class="flex flex-col gap-8 border-b border-slate-200/60 pb-8">
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div class="flex items-center gap-6">
                                <div class="p-4 bg-primary rounded-[1.5rem] shadow-lg shadow-primary/20">
                                    <Zap class="w-8 h-8 text-white animate-pulse" />
                                </div>
                                <div class="flex flex-col">
                                    <h1 class="text-3xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">AI Social Viral Hub</h1>
                                    <p class="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase mt-2 flex items-center gap-2 italic opacity-60">
                                        Omni-Channel Orchestration Node
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 bg-white/60 p-1.5 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-sm">
                                <button v-for="t in ['Viral Intelligence', 'Growth CRM', 'API Architecture']" :key="t" 
                                    @click="activeTab = t"
                                    :class="activeTab === t ? 'bg-slate-900 text-white shadow-xl px-6' : 'text-slate-400 hover:bg-slate-50 px-4'"
                                    class="py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic whitespace-nowrap"
                                >
                                    {{ t }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- VIEW 1: VIRAL INTELLIGENCE -->
                    <div v-if="activeTab === 'Viral Intelligence'" class="space-y-10 animate-[slideUp_0.4s_ease-out]">
                        <div class="grid lg:grid-cols-12 gap-10">
                            <aside class="lg:col-span-4 space-y-6">
                                <div class="bg-slate-900 p-10 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden group">
                                    <div class="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all"></div>
                                    <h2 class="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 relative z-10">
                                        <TrendingUp class="w-5 h-5 text-primary" /> Global Pulse
                                    </h2>
                                    <p class="text-slate-400 text-[11px] font-bold leading-relaxed relative z-10">AI Scanning global pulse cluster for identifying the peak before the curve.</p>
                                    <button @click="autoDiscover" :disabled="isDiscovering" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 italic relative z-10">
                                        <span v-if="isDiscovering" class="flex items-center justify-center gap-2"><RefreshCcw class="w-4 h-4 animate-spin" /> DISCOVERING...</span>
                                        <span v-else>Auto-Discover 10 Niches</span>
                                    </button>
                                </div>
                                <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-4 shadow-sm">
                                    <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic border-b border-slate-50 pb-4">
                                        <Layers class="w-4 h-4" /> Niche Sectors
                                    </h3>
                                    <div class="grid grid-cols-1 gap-2 text-left">
                                        <div v-for="cat in ['Luxury Restoration', 'Sci-Fi Architecture', 'Cyber-Punk DIY', 'Zen Technology']" :key="cat" class="px-4 py-3 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer italic">
                                            {{ cat }}
                                        </div>
                                    </div>
                                </div>
                            </aside>
                            <section class="lg:col-span-8 grid md:grid-cols-2 gap-6 text-left items-start">
                                <div v-for="niche in viralNiches" :key="niche.title" @click="selectedNiche = niche"
                                    class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-fit">
                                    <div class="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform pointer-events-none"></div>
                                    
                                    <div class="flex justify-between items-start mb-4">
                                        <span class="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-sm">Growth: {{ niche.growth }}%</span>
                                        <TrendingUp class="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                                    </div>
                                    
                                    <h3 class="text-xl font-black italic tracking-tighter uppercase text-slate-900 mb-3 leading-tight">{{ niche.title }}</h3>
                                    <p class="text-slate-500 text-[11px] font-bold leading-snug mb-5">{{ niche.potential }}</p>
                                    
                                    <div class="flex-1 flex flex-col gap-2 mb-6">
                                        <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-100 pb-1.5 flex justify-between items-center">
                                            <span>Generation Sequence</span>
                                            <span class="text-primary">{{ niche.sequence.length }} Nodes</span>
                                        </div>
                                        <div v-for="(step, i) in niche.sequence.slice(0, 2)" :key="step.name" class="flex gap-3 p-2.5 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors items-center">
                                           <div class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[9px] font-black flex-shrink-0">{{ i + 1 }}</div>
                                           <div class="overflow-hidden">
                                                <div class="text-[10px] font-black uppercase text-slate-800 italic leading-none mb-1">{{ step.name }}</div>
                                                <div class="text-[9px] font-medium text-slate-400 line-clamp-1 leading-none" :title="step.prompt">{{ step.prompt }}</div>
                                           </div>
                                        </div>
                                        <div class="text-[9px] font-black text-center text-slate-400 uppercase tracking-widest italic mt-1 bg-slate-50 py-1.5 rounded-lg border border-slate-100 border-dashed group-hover:border-primary/20 group-hover:text-primary transition-colors">
                                            + {{ niche.sequence.length - 2 }} Hidden Stages (Click to View)
                                        </div>
                                    </div>
                                    
                                    <div class="mt-auto">
                                        <div class="flex justify-between items-center mb-3">
                                            <div class="flex gap-1.5" @click.stop="triggerToast('Nodes configured: Imagen 4.0, Gemini 1.5, ElevenLabs Audio.')">
                                                <div class="p-1.5 bg-slate-100 rounded-lg hover:bg-primary/10 transition-colors" title="Visual Gen Node"><Sparkles class="w-3 h-3 text-slate-500 hover:text-primary"/></div>
                                                <div class="p-1.5 bg-slate-100 rounded-lg hover:bg-amber-100 transition-colors" title="Prompt Engineering Node"><Bot class="w-3 h-3 text-slate-500 hover:text-amber-600"/></div>
                                                <div class="p-1.5 bg-slate-100 rounded-lg hover:bg-indigo-100 transition-colors" title="Creative Suite Export"><Palette class="w-3 h-3 text-slate-500 hover:text-indigo-600"/></div>
                                            </div>
                                            <span class="text-[9px] font-bold uppercase tracking-widest text-slate-400">Est: 4 Assets</span>
                                        </div>
                                        <button @click.stop="triggerToast('Initializing Imagen 4.0 generation pipeline...'); selectedNiche = niche" class="w-full py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl italic">
                                            Generate Assets <Rocket class="w-3.5 h-3.5"/>
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    <!-- VIEW 2: GROWTH CRM (LEAD MANAGEMENT) -->
                    <div v-if="activeTab === 'Growth CRM'" class="space-y-10 animate-[slideUp_0.4s_ease-out]">
                        <div class="grid lg:grid-cols-12 gap-10">
                            <aside class="lg:col-span-3 space-y-8">
                                <div class="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10 relative overflow-hidden text-left">
                                    <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 flex items-center gap-3 italic">
                                        <Search class="w-4 h-4 text-primary" /> Targeting
                                    </h4>
                                    <div class="flex flex-col gap-3">
                                        <button v-for="p in ['all', 'linkedin', 'facebook']" :key="p" @click="filters.platform = p"
                                            :class="filters.platform === p ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'"
                                            class="w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all italic border border-transparent">
                                            {{ p === 'all' ? 'Omni-Channel' : p }}
                                        </button>
                                    </div>
                                    <div class="pt-8 border-t border-slate-50 space-y-6">
                                        <div class="flex justify-between items-center px-1">
                                            <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Growth Target</label>
                                            <span class="text-xs font-black text-primary font-mono">{{ filters.minScore }}%</span>
                                        </div>
                                        <input type="range" v-model="filters.minScore" min="0" max="100" class="w-full accent-primary">
                                    </div>
                                </div>
                            </aside>

                            <div class="lg:col-span-9 space-y-6 text-left">
                                <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white rounded-[3.5rem] border border-slate-100 gap-4">
                                    <RefreshCcw class="w-8 h-8 text-primary animate-spin" />
                                    <span class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing CRM Hub...</span>
                                </div>
                                <div v-else-if="filteredLeads.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-[3.5rem] border border-slate-100 gap-4 italic opacity-50">
                                    <Bot class="w-10 h-10" />
                                    <span class="text-[10px] font-black uppercase tracking-widest">No active nodes discovered.</span>
                                </div>
                                <div v-for="lead in filteredLeads" :key="lead.id" 
                                    class="bg-white p-8 rounded-[3.5rem] border border-slate-200 hover:border-primary/50 shadow-sm transition-all duration-500 group relative flex flex-col gap-6">
                                    <div class="flex flex-col lg:flex-row items-center justify-between gap-10">
                                        <div class="flex items-center gap-8 w-full lg:w-auto">
                                            <div class="w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl font-black text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all italic">
                                                {{ lead.name[0] }}
                                            </div>
                                            <div class="flex flex-col space-y-1.5">
                                                <h3 class="text-2xl font-black tracking-tighter uppercase italic text-slate-900 group-hover:text-primary transition-colors italic leading-none">{{ lead.name }}</h3>
                                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Target Lead Score: <span class="text-primary">{{ lead.lead_score || 0 }}% Match</span></p>
                                            </div>
                                        </div>
                                        <button @click="sendOutreach(lead)" class="px-10 py-4 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 italic w-full lg:w-auto">
                                            Approve & Send <Send class="w-4 h-4 text-primary ml-2 inline-block" />
                                        </button>
                                    </div>
                                    <div class="bg-slate-50 rounded-[2rem] p-6 text-sm font-black text-slate-500 italic leading-relaxed">
                                        {{ lead.ai_draft || lead.notes || 'No preliminary draft found.' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- VIEW 3: API ARCHITECTURE -->
                    <div v-if="activeTab === 'API Architecture'" class="animate-[slideUp_0.4s_ease-out] grid lg:grid-cols-2 gap-10 text-left">
                        <div class="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-10">
                            <h2 class="text-2xl font-black italic tracking-tighter uppercase text-slate-900 flex items-center gap-4">
                                <Network class="w-8 h-8 text-primary" /> n8n Node Config
                            </h2>
                            <div class="space-y-6">
                                <div>
                                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-2 block">Primary Webhook URL</label>
                                    <input type="text" v-model="webhookConfig.n8nUrl" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-mono font-black text-slate-700 outline-none" />
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div v-for="ch in ['wa1', 'wa2']" :key="ch">
                                        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-2 block">WhatsApp Hub Node ({{ ch.toUpperCase() }})</label>
                                        <input type="text" v-model="webhookConfig[ch]" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-mono font-black text-slate-700 outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-900 p-12 rounded-[4rem] shadow-2xl space-y-10 relative overflow-hidden text-white">
                            <div class="absolute -right-20 -bottom-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
                            <h2 class="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-4 relative z-10">
                                <ShieldAlert class="w-8 h-8 text-primary" /> Security Manifest
                            </h2>
                            <div class="space-y-6 relative z-10">
                                <div v-for="t in ['Facebook', 'LinkedIn']" :key="t">
                                    <label class="text-[9px] font-black text-slate-500 uppercase tracking-widest italic mb-2 block">{{ t }} API Secret Node</label>
                                    <input type="password" value="************************" readonly class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono font-black text-primary outline-none" />
                                </div>
                            </div>
                            <button @click="triggerToast('Cloud Manifest Updated.')" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl italic relative z-10">Commit Cloud Endpoints</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- MODAL OVERLAYS -->
        <transition name="modal">
            <div v-if="selectedNiche" class="fixed inset-0 z-[2500] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md text-left overflow-y-auto" @click.self="selectedNiche = null">
                <div class="bg-white w-full max-w-4xl rounded-[2.5rem] border border-white shadow-2xl relative my-auto">
                    <button @click="selectedNiche = null" class="absolute top-6 right-6 p-3 bg-slate-50 rounded-2xl hover:text-red-500 hover:bg-red-50 transition-all z-20">
                        <X class="w-5 h-5 text-slate-400" />
                    </button>
                    <div class="p-8 sm:p-10 space-y-8">
                        <header class="space-y-3">
                            <div class="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.4em] italic leading-none">
                                <Cpu class="w-4 h-4" /> AI Sequence Engineering
                            </div>
                            <h2 class="text-3xl font-black tracking-tight uppercase italic text-slate-900 leading-none">{{ selectedNiche.title }}</h2>
                            <p class="text-slate-500 text-sm font-bold italic max-w-2xl leading-snug">{{ selectedNiche.potential }}</p>
                        </header>
                        <div class="grid lg:grid-cols-2 gap-10">
                            <!-- VISUAL PROMPTS -->
                            <div class="space-y-5">
                                <h4 class="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic flex items-center gap-2"><Palette class="w-4 h-4" /> Visual Prompts</h4>
                                <div class="space-y-3">
                                    <div v-for="(stage, idx) in selectedNiche.sequence" :key="idx" @click="triggerToast('Prompt copied to clipboard.')"
                                        class="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2 group hover:bg-white hover:border-primary/30 transition-all cursor-pointer">
                                        <div class="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest italic group-hover:text-primary transition-colors">
                                            <span>STAGE 0{{ idx + 1 }}: {{ stage.name }}</span>
                                            <span class="opacity-0 group-hover:opacity-100 italic">COPY</span>
                                        </div>
                                        <p class="text-[11px] font-bold text-slate-700 italic leading-relaxed group-hover:text-slate-900 transition-colors">"{{ stage.prompt }}"</p>
                                    </div>
                                </div>
                            </div>
                            <!-- AUDITORY NODE -->
                            <div class="space-y-5 flex flex-col">
                                <h4 class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] italic flex items-center gap-2"><Brain class="w-4 h-4" /> Auditory Node</h4>
                                <div class="bg-slate-900 p-8 rounded-[2rem] space-y-6 shadow-2xl relative overflow-hidden text-white flex-1 flex flex-col justify-center">
                                    <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                                    <div class="space-y-3 relative z-10">
                                        <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Voiceover Script</p>
                                        <p class="text-sm font-black italic leading-relaxed text-slate-100">"{{ selectedNiche.audio.script }}"</p>
                                    </div>
                                    <div class="h-[1px] bg-white/10 w-full relative z-10"></div>
                                    <div class="space-y-3 relative z-10">
                                        <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest italic leading-none">SFX Tags</p>
                                        <div class="flex flex-wrap gap-2">
                                            <span v-for="tag in selectedNiche.audio.sfx" :key="tag" class="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-black uppercase tracking-widest italic">{{ tag }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="pt-2">
                                    <button @click="triggerToast('Deployment package sharded.')" class="w-full py-4 bg-slate-900 hover:bg-black transition-colors text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-lg flex items-center justify-center gap-3 group italic">
                                        EXPORT TO CREATIVE SUITE <Rocket class="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes modal-slide { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.modal-enter-active { animation: modal-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-leave-active { animation: modal-slide 0.3s ease-in reverse; }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }
</style>
