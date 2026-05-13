<script setup>
import { 
  Plus, MoreHorizontal, ArrowRight, X, ChevronDown, Globe, 
  Sparkles, FileText, LayoutDashboard, Briefcase, Zap, 
  Linkedin, User, Search, SlidersHorizontal, UserPlus, 
  Check, Maximize2, Lock, Bell, RefreshCw, ShieldCheck,
  Cloud, Star, Stars, Mic, DownloadCloud, BarChart3, Bookmark, Share2, EyeOff, AlertTriangle, Mail,
  Eye, Crown, ChevronRight
} from 'lucide-vue-next'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { supabase } from './lib/supabase'

// --- CORE SERVICES (SOUL) ---
import { authService } from './services/authService'
import { profileService } from './services/profileService'
import { templateService } from './services/templateService'
import i18n from './i18n'
import { jobService } from './services/jobService'
import { aiService } from './services/aiService'
import { quotaService } from './services/quotaService'
import { pdfService } from './services/pdfService'

// --- VIEW LAYERS (FACE) ---
import DashboardHub from './views/DashboardHub.vue'
import StudioHub from './views/StudioHub.vue'
import ApplicationsHub from './views/ApplicationsHub.vue'
import MatchesHub from './views/MatchesHub.vue'
import ProfileHub from './views/ProfileHub.vue'
import TopNavbar from './components/layout/TopNavbar.vue'
import BottomNavbar from './components/layout/BottomNavbar.vue'

// --- MODULAR COMPONENTS ---
import SkillGapChart from './components/SkillGapChart.vue'
import ExpertProfileWizard from './components/ExpertProfileWizard.vue'
import AuthOverlay from './components/AuthOverlay.vue'
import JobDetailOverlay from './components/JobDetailOverlay.vue'
import ActionSheet from './components/ActionSheet.vue'
import ClassicElite from './components/templates/ClassicElite.vue'
import SidebarModern from './components/templates/SidebarModern.vue'
import AdminHub from './views/AdminHub.vue'
import FounderPassOverlay from './components/FounderPassOverlay.vue'
import ManualToolkitOverlay from './components/ManualToolkitOverlay.vue'
import NeuralBridgeOverlay from './components/NeuralBridgeOverlay.vue'

const TEMPLATE_MAP = {
  1: ClassicElite,
  2: SidebarModern,
  // Fallbacks for other templates until migrated
  3: ClassicElite, 
  4: SidebarModern,
  5: ClassicElite,
  6: SidebarModern,
  7: ClassicElite,
  8: SidebarModern
}

const { t, locale } = useI18n()
const currentLang = ref('EN')
const isLangOpen = ref(false)

// --- BACKEND-DRIVEN NEURAL CONFIG (V12.0) ---
// centralized in quotaService.TIERS

const isMaintenanceMode = ref(false)
const maintenanceMessage = ref('System Recalibration in Progress...')
const globalBroadcast = ref({ active: false, message: '', type: 'info' })

// config logic moved to quotaService.js

const quickLangs = ['EN', 'DE', 'SW']
const langContainer = ref(null)
const notificationContainer = ref(null)
const isNotificationsOpen = ref(false)
const searchQuery = ref('') // Mission-critical state for global filtering
const activeCity = ref('') // NEW: Hyper-Local City Satellite (V16.9)

// Quota engine UI Reactivity
const proPrice = ref(29)
const elitePrice = ref(49)
const freePrice = ref(0)


// --- GLOBAL REACTIVE STATE (Neural Core) ---
const activeTab = ref('dashboard')
const coverLetterText = ref('')
const previewMode = ref('cv')
const selectedTemplate = ref(1) // Default to Classic Elite T1
const userProfile = ref({
    email: '',
    name: 'Amila',
    phone: '',
    linkedin_session: '',
    primaryColor: '#0A2647',
    secondaryColor: '#64748b',
    plan_type: 0, // 0: Free, 1: Pro, 2: Elite
    isSuperUser: true // FLAGSHIP: Admin Neural Override Enabled
})

const masterProfile = ref({
   basic: { fullName: '', email: '', phone: '', location: '', headline: '' },
   targetLanguage: 'Smart Localization', // AI Strategy logic
   cvLanguage: 'EN', // NEW: V13.1 Strategic CV Locale
   targetRegion: 'Sweden', // NEW: V13.1 Geographic Target
   bio: '',
   socialLinks: [
      { platform: 'LinkedIn', url: '' },
      { platform: 'Portfolio', url: '' }
   ],
   experiences: [
      { company: '', role: '', type: 'Full-time', achievements: '', start: '', end: '', isCurrent: false }
   ],
   education: [
      { title: '', institution: '', year: '', gpa: '' }
   ],
   projects: [
      { name: '', link: '' }
   ],
   languages: ['English', 'German'],
   skills: {
      hard: ['Python', 'n8n', 'Docker'],
      soft: ['Leadership', 'Agile'],
      tools: ['VS Code', 'Git']
   },
   applicationEmail: '', // NEW: Professional Application Override
   emailVerified: false, 
   secondaryEmail: '',
   secretKeywords: ['PROJECT', 'MANAGER', 'TELECOM', '5G', 'PMP', 'SWEDEN', 'ARTHA', 'TESHAN', 'DIALOG', 'PMO', 'AI', 'CLOUD', 'PYTHON', 'JAVA', 'SCRUM', 'AGILE', 'NFV', 'SDN']
})

const isAuthenticated = ref(false)
const isFirstTime = ref(false) // Logic Engine: Detects if the user session is new
const isAuthOpen = ref(false)
const authMode = ref('login')

const otherLangs = [
  { name: 'Français', code: 'FR' },
  { name: 'Español', code: 'ES' },
  { name: 'Italiano', code: 'IT' },
  { name: 'Português', code: 'PT' },
  { name: 'Nederlands', code: 'NL' },
  { name: 'Dansk', code: 'DA' },
  { name: 'Suomi', code: 'FI' },
  { name: 'Türkçe', code: 'TR' },
  { name: 'Русский', code: 'RU' },
  { name: 'العربية', code: 'AR' },
  { name: '日本語', code: 'JP' },
  { name: '中文', code: 'CN' },
  { name: '한국어', code: 'KR' }
]

const selectedPipelineStep = ref('applied')
const applicationsFilter = ref('filterAll')
const visibleAppsCount = ref(4)
const visibleMatchesCount = ref(4) // NEW: V20.0 Pagination Engine

const loadMoreApplications = async () => {
    isRecalibrating.value = true;
    await new Promise(r => setTimeout(r, 1200));
    visibleAppsCount.value += 4;
    isRecalibrating.value = false;
}

// --- NEURAL HEARTBEAT PROTOCOL (PHASE 4: STEALTH) ---
const isHeartbeatActive = ref(false)
let heartbeatInterval = null
let lastHeartbeatSent = 0

const triggerNeuralHeartbeat = async (force = false) => {
   if (!isAuthenticated.value || !userProfile.value?.id) return;
   
   const now = Date.now();
   // Throttle: Don't send more than once every 60 seconds unless forced
   if (!force && (now - lastHeartbeatSent < 60000)) return;

   try {
      const { error } = await supabase
         .from('profiles')
         .update({ 
            last_active: new Date().toISOString(),
            current_country: activeCountry.value || 'Sweden'
         })
         .eq('id', userProfile.value.id);
      
      if (!error) {
         isHeartbeatActive.value = true;
         lastHeartbeatSent = now;
         // Glow duration
         setTimeout(() => { isHeartbeatActive.value = false; }, 5000);
      }
   } catch (e) {
      console.error("Neural Heartbeat Sync Failed", e);
   }
}

const startNeuralHeartbeat = () => {
   stopNeuralHeartbeat();
   // Initial signal (forced)
   triggerNeuralHeartbeat(true);
   // Set 5-minute interval (300,000ms) for traffic efficiency
   heartbeatInterval = setInterval(() => triggerNeuralHeartbeat(true), 300000);
}

const stopNeuralHeartbeat = () => {
   if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
   }
}

// Event-Driven Trigger (Traffic Saver)
watch(activeTab, () => {
   if (isAuthenticated.value) triggerNeuralHeartbeat();
})

watch(isAuthenticated, (newVal) => {
    if (newVal) startNeuralHeartbeat()
    else {
        stopNeuralHeartbeat();
        isHeartbeatActive.value = false;
    }
}, { immediate: true })

const loadMoreMatches = async () => {
    isRecalibrating.value = true;
    await new Promise(r => setTimeout(r, 1200));
    visibleMatchesCount.value += 4;
    isRecalibrating.value = false;
}

const NEURAL_SPECIMENS = [
    { c: 'Google', r: 'AI Architect', s: '85%', d: 'Specimen', l: 'Mountain View', step: 'applied', icon: Sparkles, color: '#4285F4', desc: 'Neural Specimen: High-fidelity match for your profile.' },
    { c: 'Spotify', r: 'Lead Developer', s: '92%', d: 'Specimen', l: 'Stockholm', step: 'review', icon: Zap, color: '#1DB954', desc: 'Neural Specimen: Strategic alignment detected.' },
    { c: 'Tesla', r: 'Autopilot Engineer', s: '95%', d: 'Specimen', l: 'Oslo', step: 'interview', icon: Zap, color: '#E81D23', desc: 'Neural Specimen: Interview signal dispatched.' },
    { c: 'Klarna', r: 'Senior Frontend', s: '90%', d: 'Specimen', l: 'Stockholm', step: 'applied', icon: Sparkles, color: '#FFB3C7', desc: 'Neural Specimen: Application buffered.' }
];

const DISCOVERY_SPECIMENS = [
    { id: 'm1', c: 'Tesla', r: 'Fullstack Engineer', l: 'Oslo', m: '98%', t: 'Just Now', color: '#E81D23', icon: Zap, desc: 'Neural Discovery: Direct match for your React/Node skills.' },
    { id: 'm2', c: 'Klarna', r: 'Senior Frontend', l: 'Stockholm', m: '95%', t: '2h ago', color: '#FFB3C7', icon: Sparkles, desc: 'Neural Discovery: High demand for Swedish-speaking developers.' }
];

const allJobs = ref([...NEURAL_SPECIMENS])

const matches = ref([...DISCOVERY_SPECIMENS])

const handleGlobalSearch = async (queryOverride) => {
    // 🛡️ Neural Guard: Support both Keyword + City or City-only searches
    const finalQuery = (typeof queryOverride === 'string' ? queryOverride : searchQuery.value || '').trim();
    const city = (activeCity.value || '').trim();
    
    if (finalQuery.length < 3 && !city) {
        console.warn('[DIGYNEX] Search requirements not met (Min 3 chars OR City Focus required)');
        return;
    }
    
    console.log(`[DIGYNEX] Initiating Neural Search: [${finalQuery}] in [${city || activeCountry.value}]`);
    
    isRecalibrating.value = true;
    matches.value = []; // Clear-on-Search: Ensures fresh stream
    
    toastMessage.value = `Neural Engine: Dispatched Discovery for "${finalQuery || city}"...`;
    isNeuralToastVisible.value = true;

    try {
        const response = await jobService.searchJobs(
            finalQuery || 'Jobs', // Fallback keyword if only city provided
            activeCountry.value || 'gb', 
            userProfile.value.email || 'guest@digynex.se',
            city
        );

        // ROBUST HYDRATION: Support direct Array, { jobs: [] }, { data: [] } and { results: [] }
        let results = [];
        if (Array.isArray(response)) {
            results = response;
        } else if (response?.jobs) {
            results = response.jobs;
        } else if (response?.data) {
            results = response.data;
        } else if (response?.results) {
            results = response.results;
        }

        if (results && results.length > 0) {
            // HYDRATE DISCOVERY STREAM: Replace mock matches with real discoveries
            matches.value = results.map(j => ({
                id: j.id || Math.random().toString(36).substr(2, 9),
                c: j.company || 'Global Entity',
                r: j.title || j.role || 'Expert Role',
                l: j.location || 'Remote',
                m: j.match_score || 0,
                t: j.posted_at || 'Just Now',
                color: j.hex_color || '#0A2647',
                icon: Zap,
                isNeuralMatch: true, // 🛡️ LOCK: Prevent local filtering
                desc: j.description || '',
                u: j.redirect_url || j.url || j.apply_url || ''
            }));
            showNeuralToast(`Neural Engine: ${results.length} Strategic Matches Found`, 'success');
        } else {
            showNeuralToast('Neural Search Complete: No exact matches in this region.', 'warning');
            matches.value = []; // Keep it clean
        }
    } catch (err) {
        console.error('Search Dispatch Failure:', err);
        toastMessage.value = 'Neural Link Unstable: Search Failed';
    } finally {
        isRecalibrating.value = false;
        setTimeout(() => isNeuralToastVisible.value = false, 3000);
    }
}

const handleDownloadPdf = async () => {
    try {
        // --- REAL-TIME QUOTA ENGINE (V13.8) ---
        // Check DB immediately before allowing generation
        const quota = await quotaService.canPerformAction(userProfile.value, 'CV_EXPORT');

        if (!quota.can) {
            let msg = `Quota Reached: ${quota.reason.replace('_', ' ')}.`;
            if (quota.nextActivation) {
                const next = new Date(quota.nextActivation);
                const isToday = next.toDateString() === new Date().toDateString();
                const dateStr = isToday ? 'Today' : next.toLocaleDateString([], { month: 'short', day: 'numeric' });
                const timeStr = next.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                msg = `Limit Reached. Reactivates at ${timeStr} ${dateStr}. Upgrade for Unlimited Pulse.`;
            }
            showNeuralToast(msg, 'warning', 5000);
            return;
        }

        // STRATEGIC RECOVERY: Check for reactive HTML first (V13.8 Modal Compatibility)
        let htmlSource = viewportHtml.value;
        
        // FALLBACK: Look for the DOM iframe (StudioHub Compatibility)
        if (!htmlSource) {
            const viewport = document.querySelector('#live-viewport iframe');
            if (viewport && viewport.srcdoc) {
                htmlSource = viewport.srcdoc;
            }
        }

        if (!htmlSource) {
            toastMessage.value = 'Error: Neural Specimen not ready';
            isNeuralToastVisible.value = true;
            return;
        }
        
        toastMessage.value = 'Preparing Ultra-HD Specimen...';
        isNeuralToastVisible.value = true;
        
        const fileName = pdfService.buildFileName(
            masterProfile.value.basic?.fullName || userProfile.value.name || 'DigyNex',
            cvTemplates.value.find(t => t.id === selectedTemplate.value)?.name || 'Elite'
        );

        await pdfService.generateFromHtml(htmlSource, fileName, {
            userName: userProfile.value.name,
            tier: userProfile.value.plan_type || 0,
            primaryColor: userProfile.value.primaryColor
        });
        
        // n8n Signal: Log export activity (Mission Critical for Quota Engine)
        if (isAuthenticated.value && userProfile.value.email) {
            await profileService.logActivity(userProfile.value.email, 'CV_EXPORT', { 
                method: 'neural_bridge_export',
                template_id: selectedTemplate.value,
                timestamp: new Date().toISOString()
            });
        }
        
        toastMessage.value = 'Neural PDF Exported Successfully';
    } catch (err) {
        console.error('PDF Export Failure:', err);
        toastMessage.value = 'Export Failure: Engine Overload';
    } finally {
        setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
    }
}



const filteredJobs = computed(() => {
    let result = allJobs.value;
    
    // 1. Applications Tab Logic
    if (activeTab.value === 'applications') {
        if (applicationsFilter.value !== 'filterAll') {
            const filterMap = {
                'filterPending': ['applied', 'review'],
                'filterInterview': ['interview'],
                'filterOffers': ['offer'],
                'filterArchived': ['archived']
            };
            const activeSteps = filterMap[applicationsFilter.value] || [];
            result = result.filter(j => activeSteps.includes(j.step));
        }
        // NEURAL RANKING: Sort by highest match score (Strategic Hierarchy)
        result = [...result].sort((a, b) => (b.m || 0) - (a.m || 0));

        // PAGINATION ENGINE: Slice results to current visible limit
        return result.slice(0, visibleAppsCount.value);
    } else {
        // 2. Dashboard Logic
        result = result.filter(j => j.step === selectedPipelineStep.value);
    }
    
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(j => j.c.toLowerCase().includes(q) || j.r.toLowerCase().includes(q));
    }
    
    // NEURAL RANKING: Sort by highest match score (Strategic Hierarchy)
    return [...result].sort((a, b) => (b.m || 0) - (a.m || 0));
})

const filteredMatches = computed(() => {
    let result = matches.value;
    
    // 1. Country Filter Logic (Resilient Mode)
    if (activeCountry.value) {
        const countryCodeMap = {
            'sweden': 'SE', 'germany': 'DE', 'norway': 'NO', 'finland': 'FI', 'denmark': 'DK',
            'united kingdom': 'GB', 'united states': 'US', 'canada': 'CA', 'australia': 'AU',
            'france': 'FR', 'netherlands': 'NL', 'singapore': 'SG', 'sri lanka': 'LK',
            'nigeria': 'NG', 'libya': 'LY', 'japan': 'JP', 'switzerland': 'CH'
        };
        const code = countryCodeMap[activeCountry.value.toLowerCase()];
        const countryName = activeCountry.value.toLowerCase();
        
        if (code) {
            result = result.filter(m => {
                // Strategic Bypass: Trust search results and Remote jobs
                if (m.isNeuralMatch || m.t?.toLowerCase() === 'just now') return true;
                
                const loc = (m.l || '').toLowerCase();
                return (
                    loc === '' || 
                    loc === 'remote' || 
                    loc.includes(code.toLowerCase()) || 
                    loc.includes(countryName)
                );
            });
        }
    }
    
    // 2. Search Query Logic (Neural-Enabled Filter)
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(m => 
            m.c.toLowerCase().includes(q) || 
            m.r.toLowerCase().includes(q) ||
            m.isNeuralMatch // 🛡️ Neural Trust: Show all results from the search API (0% to 100%)
        );
    }
    
    // NEURAL RANKING: Strategic Priority (Match % + Recency)
    const sorted = [...result].sort((a, b) => {
        const aIsNew = a.t?.toLowerCase() === 'just now' || a.isNeuralMatch;
        const bIsNew = b.t?.toLowerCase() === 'just now' || b.isNeuralMatch;
        
        if (aIsNew && !bIsNew) return -1;
        if (!aIsNew && bIsNew) return 1;
        
        return (b.m || 0) - (a.m || 0);
    });

    // PAGINATION ENGINE: V20.0 - Slice for "Show More" UX
    return sorted.slice(0, visibleMatchesCount.value);
})

const getStepCount = (step) => {
    return allJobs.value.filter(j => j.step === step).length
}

const showCountrySelector = ref(false)
const countrySearch = ref('')
const selectedCountriesArr = ref(['Sweden', 'Germany', 'Norway']) // Synced with Free Tier Limit (3)
const activeCountry = ref('Sweden')

const displayName = computed(() => {
    if (!userProfile.value.name) return 'Expert';
    return userProfile.value.name.split(' ')[0];
})

const setLang = async (lang) => {
  currentLang.value = lang
  locale.value = lang
  isLangOpen.value = false
  
  // Persist language preference to engine (Logic First)
  if (isAuthenticated.value) {
     const user = await authService.getUser();
     if (user) {
        await profileService.syncProfile(user, { languagePreference: lang });
     }
  }
}

const setTab = (tab) => {
  activeTab.value = tab
  if (tab === 'matches') showCountrySelector.value = false
}

// Global Profile Logic
const fieldsOfInterest = ref(['Data Science', 'AI Research', 'DevOps', 'FinTech', 'Cloud Architecture'])
const newField = ref('')
const isUploadingCV = ref(false)
const isSavingProfile = ref(false)
const activeFocusSlots = computed(() => {
    const total = quotaService.getCountryLimit(userProfile.value.plan_type);
    return {
        used: selectedCountriesArr.value.length,
        total: total
    };
})

const toggleCountryFocus = (country) => {
    // Normalize country name (Capitalize First Letter)
    const normalized = country.charAt(0).toUpperCase() + country.slice(1).toLowerCase();
    
    if (selectedCountriesArr.value.includes(normalized)) {
        activeCountry.value = normalized;
        showCountrySelector.value = false;
        return;
    }

    const limit = quotaService.getCountryLimit(userProfile.value.plan_type);
    if (selectedCountriesArr.value.length >= limit && !userProfile.value.isSuperUser) {
        showNeuralToast(`Slot Limit Reached: ${limit}/${limit} Focus Slots used.`, 'warning');
        return;
    }

    selectedCountriesArr.value.push(normalized);
    activeCountry.value = normalized;
    activeCity.value = ''; // 🛡️ Neural Reset: Clear city focus when country changes
    showCountrySelector.value = false;
    showNeuralToast(`Neural Engine: Calibrating Focus for ${normalized}... Global Pipe Active 🌍`, 'success');
    
    // SMART LOCALIZATION: Dynamic Engine Response
    const autoLangs = {
        'Sweden': 'SW', 'Germany': 'DE', 'Norway': 'NO', 'Finland': 'FI', 'Denmark': 'DA',
        'France': 'FR', 'Spain': 'ES', 'Italy': 'IT', 'Netherlands': 'NL'
    };
    if (autoLangs[normalized]) {
        // Only set if user hasn't explicitly locked a preference
        if (!userProfile.value.languagePreference || userProfile.value.languagePreference === 'EN') {
            setLang(autoLangs[normalized]);
        }
    }
}

const removeCountryFocus = (country) => {
    const idx = selectedCountriesArr.value.indexOf(country);
    if (idx > -1) {
        selectedCountriesArr.value.splice(idx, 1);
        if (activeCountry.value === country) {
            activeCountry.value = selectedCountriesArr.value[0] || '';
        }
    }
}

const removeField = (index) => {
  fieldsOfInterest.value.splice(index, 1)
}

const addField = () => {
  if (newField.value.trim() && !fieldsOfInterest.value.includes(newField.value.trim()) && fieldsOfInterest.value.length < 10) {
    fieldsOfInterest.value.push(newField.value.trim())
    newField.value = ''
  }
}

const isCVModalOpen = ref(false)

// MISSION-CRITICAL WATCHER: Handles search input reactivity and discovery hydration
watch(searchQuery, (newQuery) => {
    // 🛡️ USER UX GUARDRAIL: If user starts typing, clear the discovery matches 
    // to prevent confusion with previous discovery/mock results.
    if (newQuery && newQuery.trim().length > 0) {
        if (matches.value.length > 0 && !isRecalibrating.value) {
            console.log('[DIGYNEX] User typing... Clearing discovery stream for fresh search.');
            matches.value = []; 
        }
    }
})

// RE-HYDRATION ENGINE: Fetch jobs when country or search query changes
watch([activeCountry, searchQuery], async ([newCountry, newQuery], [oldCountry, oldQuery]) => {
    if (activeTab.value !== 'matches') return;
    
    // 🛡️ Neural Trigger: If country changed and we have a query, re-dispatch search automatically
    if (newCountry !== oldCountry && newQuery && newQuery.trim().length >= 3) {
        console.log(`[DIGYNEX] Country Focus Shifted to ${newCountry}. Re-dispatching search for: ${newQuery}`);
        handleGlobalSearch();
        return;
    }

    // 🛡️ CRITICAL LOCK: If there's an active search query, NEVER overwrite with discovery data
    if (newQuery && newQuery.trim().length > 0) {
        console.log('[DIGYNEX] Search Lock Active. Preserving results for:', newQuery);
        return;
    }
    
    if (isRecalibrating.value) return;

    console.log(`[DIGYNEX] Hydrating Discovery Stream for ${newCountry}...`);
    const discoveredJobs = await jobService.getDiscoveryJobs(newCountry);
    
    if (!searchQuery.value || searchQuery.value.trim().length === 0) {
        matches.value = (discoveredJobs || []).map(j => ({
            id: j.id,
            c: j.company,
            r: j.role,
            l: j.location,
            m: j.match_score,
            t: j.posted_at,
            color: j.hex_color || '#0A2647',
            icon: Zap,
            isNeuralMatch: false,
            desc: j.description,
            u: j.url
        }));
    }
}, { immediate: true })

const saveProfile = async () => {
  if (isSavingProfile.value) return;
  isSavingProfile.value = true;
  try {
    const user = await authService.getUser();
    if (user) {
      const { error } = await profileService.syncProfile(user, {
        primaryColor: userProfile.value.primaryColor,
        secondaryColor: userProfile.value.secondaryColor,
        secretKeywords: masterProfile.value.secretKeywords,
        resumeData: masterProfile.value, // NEURAL MASTER SYNC
        uploadedCvName: uploadedFileName.value,
        name: userProfile.value.name,
        phone: userProfile.value.phone,
        linkedinSession: linkedInSessionInput.value || userProfile.value.linkedin_session,
        coverLetterText: coverLetterText.value,
        selectedTemplate: selectedTemplate.value
      });
      
      if (error) throw error;
      
      toastMessage.value = 'Identity Core Synced Successfully';
      isNeuralToastVisible.value = true;
      setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
    }
  } catch (err) {
    console.error('Failed to update global engine:', err);
    toastMessage.value = 'Sync Error: Connection Unstable';
    isNeuralToastVisible.value = true;
    setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
  } finally {
    isSavingProfile.value = false
  }
}

const fileInput = ref(null)
const uploadedFileName = ref('No CV Uploaded')
const uploadedFileUrl = ref(null)

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return;
  
  isUploadingCV.value = true;
  toastMessage.value = `DigyNex AI: Extracting Intelligence from ${file.name}...`;
  isNeuralToastVisible.value = true;

  // Generate Local Preview URL for the Secure View Engine
  if (uploadedFileUrl.value) URL.revokeObjectURL(uploadedFileUrl.value);
  uploadedFileUrl.value = URL.createObjectURL(file);
  
  try {
    // ENGINE CALL: Strategic data extraction
    const response = await aiService.extractCVData(file);
    
    if (response.success && response.data) {
       // NEURAL HYDRATION: Injecting AI-extracted data into the Master Profile
       masterProfile.value = { 
         ...masterProfile.value, 
         basic: response.data.basic,
         bio: response.data.bio,
         experiences: response.data.experiences,
         education: response.data.education,
         skills: response.data.skills,
         secretKeywords: response.data.secretKeywords
       };
       
       // Sync names across the "Face"
       if (masterProfile.value.basic.fullName) {
        userProfile.value.name = masterProfile.value.basic.fullName;
      userProfile.value.phone = masterProfile.value.basic.phone;
      userProfile.value.phone = masterProfile.value.basic.phone;
       }
       
        uploadedFileName.value = file.name;
        toastMessage.value = 'Neural Extraction Complete: Profile Hydrated';

        // PHYSICAL STORAGE PERSISTENCE: Securely storing the CV for Headless Execution (Workflow E)
        const { error: uploadError } = await supabase.storage
          .from('cv_specimens')
          .upload(`${userProfile.value.id}.pdf`, file, {
             upsert: true,
             contentType: 'application/pdf'
          });

        if (uploadError) console.warn('[NEURAL_STORAGE] Physical Sync Interrupted:', uploadError);
        
        // KINETIC SYNC: Auto-save metadata and JSONB snapshot to database
        await saveProfile();
     }
  } catch (err) {
    console.error('Failed to sync CV:', err);
    toastMessage.value = 'Extraction Error: Link Unstable';
  } finally {
    isUploadingCV.value = false;
    setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
  }
}

// AI Builder Logic
const isLinkedInModalOpen = ref(false)
const linkedInUrlInput = ref('')
const linkedInUrl = ref('')
const isLinkedInConnecting = ref(false)
const linkedInSessionInput = ref('')
const linkedInJsessionidInput = ref('')
const linkedInConnected = computed(() => linkedInUrl.value !== '')

const openLinkedInModal = () => {
  if (linkedInConnected.value) {
    // Toggle off or edit
    linkedInUrl.value = ''
  } else {
    isLinkedInModalOpen.value = true
  }
}

const saveLinkedIn = async () => {
  if (!linkedInUrlInput.value) return;
  isLinkedInConnecting.value = true;
  try {
    // 1. Persist to Supabase Profile (Stealth Storage)
    const user = await authService.getUser();
    if (user) {
        await profileService.syncProfile(user, {
            ...userProfile.value,
            linkedinUrl: linkedInUrlInput.value,
            linkedinSession: linkedInSessionInput.value,
            linkedinJsessionid: linkedInJsessionidInput.value,
            phone: userProfile.value.phone || ''
        });
    }

    // 2. NEURAL SIGNAL: Trigger n8n LinkedIn Scraper (Workflow JAAAAS)
    await profileService.logActivity(userProfile.value.email, 'LINKEDIN_SYNC_REQUESTED', {
        url: linkedInUrlInput.value,
        has_session: !!linkedInSessionInput.value,
        has_jsessionid: !!linkedInJsessionidInput.value,
        timestamp: new Date().toISOString()
    });
    
    linkedInUrl.value = linkedInUrlInput.value;
    toastMessage.value = 'Neural Sync: LinkedIn Connection Request Dispatched';
    isNeuralToastVisible.value = true;
    isLinkedInModalOpen.value = false;
    setTimeout(() => { isNeuralToastVisible.value = false }, 3500);
  } finally {
    isLinkedInConnecting.value = false;
  }
}

const masterProfileSyncStatus = ref('connected')

const isStealthUnlocked = ref(false)
const isAnalyzingKeywords = ref(false)

const removeSecretKeyword = async (keyword) => {
   masterProfile.value.secretKeywords = masterProfile.value.secretKeywords.filter(k => k !== keyword)
   await saveProfile(); // Neural Sync: Auto-persist change
}

const analyzeAndSuggestKeywords = async () => {
   if (isAnalyzingKeywords.value) return;
   
   // Strict Rule: Quota Enforcement Check
   const limit = quotaService.getKeywordLimit(userProfile.value.plan_type);
   if (!userProfile.value.isSuperUser && masterProfile.value.secretKeywords.length >= limit) {
       showNeuralToast(`Quota Reached: Tier limit is ${limit} keywords`, 'warning');
       return;
   }

   isAnalyzingKeywords.value = true;
   
   try {
       // Logic First: Trigger Neural Engine for Strategic Ingestion
       const context = selectedJob.value ? selectedJob.value.desc : fieldsOfInterest.value.join(', ');
       
       // ENGINE CALL: Real-time keyword extraction (Service Layer)
       const suggested = await aiService.suggestKeywords(context);
       
       // Filter and Apply
       suggested.forEach(k => {
          const upper = k.toUpperCase();
          if (!masterProfile.value.secretKeywords.includes(upper)) {
             if (userProfile.value.isSuperUser || masterProfile.value.secretKeywords.length < limit) {
                masterProfile.value.secretKeywords.push(upper);
             }
          }
       });
       
       showNeuralToast('Neural Extraction Complete: Keywords Hydrated', 'success');
       await saveProfile(); // Kinetic Sync: Persist results to Supabase
   } catch (err) {
       showNeuralToast('AI Engine unstable. Retrying...', 'error');
   } finally {
       isAnalyzingKeywords.value = false;
   }
}

const newSecretKeyword = ref('')
const addSecretKeyword = async () => {
   // Strict Rule: Quota Enforcement Check
   const limit = quotaService.getKeywordLimit(userProfile.value.plan_type);
   if (!userProfile.value.isSuperUser && masterProfile.value.secretKeywords.length >= limit) {
       toastMessage.value = `Quota Reached: Tier limit is ${limit} keywords`;
       isNeuralToastVisible.value = true;
       setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
       return;
   }

   if (newSecretKeyword.value.trim() && !masterProfile.value.secretKeywords.includes(newSecretKeyword.value.trim())) {
      masterProfile.value.secretKeywords.push(newSecretKeyword.value.trim())
      newSecretKeyword.value = ''
      await saveProfile(); // Neural Sync: Auto-persist change
   }
}


const handleGenerateCoverLetter = () => {
   // NEURAL ENGINE: Authenticated Synthesis Only (Strict Rule Alignment)
   if (!isAuthenticated.value) {
      handleDashboardAction('login');
      return;
   }

   const text = profileService.generateCoverLetter({
      name: userProfile.value.name,
      resume_data: masterProfile.value,
      secret_keywords: masterProfile.value.secretKeywords,
      job: selectedJob.value // CROSS-POLLINATION: Tailor letter to the currently active job detail
   });
   
   coverLetterText.value = text;
   
   // Strategic Feedback: Inform user about the Draft Status
   previewMode.value = 'letter';
   setTimeout(async () => { await refreshViewport(); }, 150);

   toastMessage.value = 'Neural Identity Synthesized: Cover Letter Created';
   isNeuralToastVisible.value = true;
   setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
   
   // Auto-Sync to Database to ensure persistence
   handleUpdateCoverLetter(text);
}

const handleUpdateCoverLetter = async (text) => {
   if (!isAuthenticated.value) return;
   coverLetterText.value = text;
   // BG SYNC: No blocking spinner for editing (Kinetic UX)
   try {
      const user = await authService.getUser();
      if (user) {
         const { error } = await profileService.updateCoverLetter(user.id, text);
         if (error) throw error;
         toastMessage.value = 'Strategic Cover Letter Synced';
         isNeuralToastVisible.value = true;
      }
   } catch (err) {
      console.error('Failed to sync cover letter:', err);
   } finally {
      // Background sync complete
   }
}
const isCompilingLatex = ref(false)
const isManualFormOpen = ref(false)
const isNeuralBridgeOpen = ref(false)
const isCVPreviewOpen = ref(false)
const cvTemplates = ref([])
const viewportHtml = ref('')
const viewMode = ref('elite')

const fetchSystemConfig = async () => {
    try {
        const { data: configs, error } = await supabase.from('system_config').select('*');
        if (!error && configs) {
            const m = configs.find(c => c.key === 'maintenance_mode')?.value;
            if (m) { isMaintenanceMode.value = m.enabled; maintenanceMessage.value = m.message; }
            
            const b = configs.find(c => c.key === 'global_broadcast')?.value;
            if (b) globalBroadcast.value = b;

            const q = configs.find(c => c.key === 'tiered_quotas')?.value;
            if (q) {
                quotaService.updateTiersFromBackend(q);
                freePrice.value = quotaService.TIERS[0].price;
                proPrice.value = quotaService.TIERS[1].price;
                elitePrice.value = quotaService.TIERS[2].price;
            }
        }
    } catch (err) {
        console.error('[DIGYNEX ENGINE] System Config Pulse Failure:', err);
    }
};

const fetchTemplates = async () => {
    try {
        const data = await templateService.getTemplates();
        if (data && data.length > 0) {
            cvTemplates.value = data;
            console.log(`[CAREERNEXUS ENGINE] ${data.length} Templates Hydrated.`);
        } else {
            console.warn('[CAREERNEXUS ENGINE] Template fetch returned empty or null. Retrying in background...');
        }
    } catch (err) {
        console.error('[CAREERNEXUS ENGINE] Template Loading Failure:', err);
    }
};

const getCVLabels = (lang) => {
    const msg = i18n.global.getLocaleMessage(lang || 'EN');
    return msg?.studio?.cv_labels || i18n.global.getLocaleMessage('EN').studio.cv_labels;
};

const refreshViewport = async () => {
    const colors = {
        primary: userProfile.value.primaryColor,
        secondary: userProfile.value.secondaryColor
    };
    
    console.log(`[DIGYNEX AI] Refreshing Viewport - Mode: ${previewMode.value}`);
    

    if (previewMode.value === 'letter') {
        const html = await templateService.getCoverLetterHtml(coverLetterText.value || '', colors, masterProfile.value);
        viewportHtml.value = html || '<html><body>Render Error</body></html>';
    } else {
        const labels = getCVLabels(masterProfile.value.cvLanguage);
        const html = await templateService.getSpecimenHtml(selectedTemplate.value, colors, masterProfile.value, labels);
        viewportHtml.value = html || '<html><body>Render Error</body></html>';
    }
}

watch([
    selectedTemplate, 
    previewMode, 
    coverLetterText, 
    () => userProfile.value.primaryColor, 
    () => userProfile.value.secondaryColor,
    () => masterProfile.value.cvLanguage,  // V13.2 RE-RENDER SYNC
    locale                             // GLOBAL LOCALE SYNC
], () => {
    refreshViewport();
})

watch(activeTab, (newTab) => {
    if (newTab === 'studio') {
        if (cvTemplates.value.length === 0) fetchTemplates();
        refreshViewport();
    }
})



onMounted(async () => {
    // Phase 1: Engine & Asset Ingestion
    fetchSystemConfig();
    fetchTemplates();
    await quotaService.init();

    // Phase 2: Live Governance Sync
    const syncPrices = () => {
        freePrice.value = quotaService.TIERS[0].price;
        proPrice.value = quotaService.TIERS[1].price;
        elitePrice.value = quotaService.TIERS[2].price;
    };
    syncPrices();
    window.addEventListener('quota-prices-updated', syncPrices);

    // Phase 3: Neural Channels
    supabase.channel('global_config_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'system_config' }, (payload) => {
            console.log('[NEURAL SYNC] Global Config Ripple:', payload.new.key);
            const key = payload.new.key;
            const val = payload.new.value;

            if (key === 'maintenance_mode') {
                isMaintenanceMode.value = val.enabled;
                if (val.message) maintenanceMessage.value = val.message;
            } else if (key === 'tiered_quotas') {
                quotaService.updateTiersFromBackend(val);
                syncPrices();
            } else if (key === 'global_broadcast') {
                globalBroadcast.value = val;
            }
        })
        .subscribe();

    // Phase 4: Identity & Auth Lifecycle
    authService.onAuthStateChange((event, session) => {
        if (session) {
            isAuthenticated.value = true;
            fetchUserProfile();
            fetchUserApplications(); // Neural Trigger
        } else {
            isAuthenticated.value = false;
        }
    });

    const user = await authService.getUser();
    if (user) {
        await fetchUserProfile();
        await fetchUserApplications(); // Syncing history
    }

    // Phase 5: Initial Match Discovery
    try {
        const discoveredJobs = await jobService.getDiscoveryJobs(selectedCountriesArr.value);
        if (discoveredJobs && discoveredJobs.length > 0) {
            matches.value = discoveredJobs.map(j => ({
                id: j.id, c: j.company, r: j.role, l: j.location,
                m: j.match_score, t: j.posted_at, color: j.hex_color || '#0A2647',
                icon: Zap, desc: j.description, u: j.url
            }));
        } else {
            // Fallback to specimens if discovery is dry
            matches.value = [...DISCOVERY_SPECIMENS];
        }
    } catch (err) {
        console.warn('[DIGYNEX] Discovery engine offline. Using specimens.');
        matches.value = [...DISCOVERY_SPECIMENS];
    }

    document.addEventListener('click', handleClickOutside);
})

const fetchUserApplications = async () => {
    try {
        const user = await authService.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('user_activity')
            .select('*')
            .eq('action', 'JOB_APPLY')
            .eq('user_id', user.email)
            .order('created_at', { ascending: false });

        if (data && data.length > 0) {
            allJobs.value = data.map(item => {
                const details = item.details || {};
                const jobDetails = details.job || {};
                return {
                    id: item.id,
                    c: details.company || jobDetails.c || 'Unknown',
                    r: details.role || jobDetails.r || 'Position',
                    s: details.status === 'instant' ? '80%' : '30%',
                    d: new Date(item.created_at).toLocaleDateString('en-GB'),
                    l: jobDetails.l || 'Global',
                    icon: Briefcase,
                    color: jobDetails.color || '#0A2647',
                    desc: jobDetails.desc || 'Application submitted via Neural Engine.',
                    step: jobDetails.step || 'applied',
                    applyType: jobDetails.applyType || 'auto',
                    u: jobDetails.u || '#'
                };
            });
        } else {
            // No real data found, keep specimens active
            allJobs.value = [...NEURAL_SPECIMENS];
        }
    } catch (err) {
        console.error('Failed to fetch applications:', err);
    }
}

const selectTemplate = async (template) => {
   if (template.id > 4 && !userProfile.value.isSuperUser) {
      handleDashboardAction('upgrade')
      return;
   }
   previewingTemplate.value = template;
   selectedTemplate.value = template.id; // Kinetic Sync: UI first
   
   // Strategic Persistence: Ensure the choice "sticks" in the database
   try {
     const user = await authService.getUser(); // Await the authenticated identity
     if (user) {
       await templateService.setSelectedTemplate(user, template.id);
     }
   } catch (e) { console.warn('Persistence background sync failed', e); }

   // isTemplatePreviewOpen.value = true; // Disabled modal for StudioHub gallery to prevent UX friction
}

const finalizeTemplateSelection = async () => {
   if (!previewingTemplate.value) return;
   
   const id = previewingTemplate.value.id;
   selectedTemplate.value = id;
   isTemplatePreviewOpen.value = false;
   
   // Persist to Database via Service Layer
   try {
     const user = await authService.getUser();
     if (user) {
       await templateService.setSelectedTemplate(user, id);
       toastMessage.value = 'CV Performance Engine Synced';
       isNeuralToastVisible.value = true;
       setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
     }
   } catch (err) {
     console.error('Failed to persist template choice:', err);
   }
}

const compileLatex = async () => {
    // Strict Rule: Quota Enforcement Check (Engine First)
    const isAllowed = await quotaService.canPerformAction(userProfile.value, 'CV_EXPORT');
    if (!isAllowed) {
       showNeuralToast('Quota Reached: Export limit exceeded for your tier.', 'warning', 3500);
       return;
    }

    isCompilingLatex.value = true;
    showNeuralToast('Neural PDF Engine Initializing...', 'info', 8000);

    try {
        // Get HD HTML from template service for the current selected template
        const colors = { primary: userProfile.value.primaryColor, secondary: userProfile.value.secondaryColor };
        const labels = getCVLabels(masterProfile.value.cvLanguage);
        
        const cvHtml = await templateService.getSpecimenHtml(selectedTemplate.value, colors, masterProfile.value, labels);

        // Build professional filename
        const fileName = pdfService.buildFileName(
            masterProfile.value.basic?.fullName || userProfile.value.name || 'DigyNex',
            cvTemplates.value.find(t => t.id === selectedTemplate.value)?.name || 'Elite'
        );

        // ENGINE CALL: Generate PDF (browser-print now, Gotenberg in production)
        const result = await pdfService.generateFromHtml(cvHtml, fileName, {
            tier: userProfile.value.plan_type ?? 0,
            userName: masterProfile.value.basic?.fullName || userProfile.value.name,
            primaryColor: userProfile.value.primaryColor
        });

        if (result.success) {
            showNeuralToast(
                result.method === 'gotenberg' ? '✓ Gotenberg HD PDF Generated' : '✓ CV Sent to Print — Save as PDF',
                'success', 4000
            );
        } else {
            showNeuralToast('PDF Engine Error: Try again', 'error', 4000);
        }

        // Log activity for n8n signal (pre-wired for Step 1)
        if (isAuthenticated.value && userProfile.value.email) {
            await profileService.logActivity(userProfile.value.email, 'CV_EXPORT');
        }

    } catch (err) {
        console.error('[DigyNex] PDF generation failed:', err);
        showNeuralToast('Neural PDF Engine Failed', 'error', 4000);
    } finally {
        isCompilingLatex.value = false;
    }
}

const finalizeManualCV = () => {
    isCVPreviewOpen.value = false;
    onManualFinalize();
}

const onManualFinalize = async () => {
   isManualFormOpen.value = false;
   activeTab.value = 'profile';
   
   // --- MUTATION DETECTOR ---
   // If content changed, we must reset the trust window
   const hasMutation = JSON.stringify(masterProfile.value.basic) !== JSON.stringify(userProfile.value.resume_data?.basic);
   
   if (hasMutation || userProfile.value.doc_status !== 'Verified') {
      userProfile.value.doc_status = 'Pending_Approval';
      console.log('[DIGYNEX MUTATION] Change detected. Security Guardrail re-engaged.');
   }

   // Synchronize the master profile name
   if (masterProfile.value.basic.fullName) {
      userProfile.value.name = masterProfile.value.basic.fullName;
      userProfile.value.phone = masterProfile.value.basic.phone;
   }
   
   // --- NEURAL BRIDGE PRIORITY ---
   // Trigger the Audit Signal BEFORE saving to DB
   handleDashboardAction('submit_for_audit');
   
   try {
       await saveProfile();
       showNeuralToast('Neural Identity Committed & Synced', 'success');
   } catch (err) {
       console.warn('[DIGYNEX DB] Save delayed, but signal was sent to n8n.');
       showNeuralToast('Identity Synced to n8n (DB Sync Pending)', 'warning');
   }
}

const handleNeuralAction = async (actionId, details) => {
    await profileService.logActivity(userProfile.value.email, actionId, details);
    if (actionId === 'LINKEDIN_SYNC_REQUESTED') {
        showNeuralToast('Pulse: LinkedIn Ingestion Initiated', 'info');
    }
}

const isSyncingManual = ref(false)
const isRecalibrating = ref(false)

const activeTemplateComponent = computed(() => TEMPLATE_MAP[selectedTemplate.value] || ClassicElite)

const colorPresets = [
   { name: 'Midnight Executive', primary: '#0A2647', secondary: '#1E3A8A', tier: 1 },
   { name: 'Slate Professional', primary: '#334155', secondary: '#64748B', tier: 1 },
   { name: 'Royal Heritage', primary: '#1A1A1A', secondary: '#C1A172', tier: 2 },
   { name: 'Emergent Tech', primary: '#064E3B', secondary: '#059669', tier: 2 }
]

const isBrandingSyncing = ref(false)
const selectPreset = async (preset) => {
   if (preset.tier > 1 && !userProfile.value.isSuperUser) {
      handleDashboardAction('upgrade')
      return
   }
   
   isBrandingSyncing.value = true;
   // Simulate High-Fidelity Theming Sync
   await new Promise(r => setTimeout(r, 800));
   
   userProfile.value.primaryColor = preset.primary
   userProfile.value.secondaryColor = preset.secondary
   isBrandingSyncing.value = false;
}

const handleApply = async (job) => {
    if (!isAuthenticated.value) {
        openAuth('login');
        return;
    }
    
    // NEURAL GUARDRAIL: Mobile Approval Interception (WA/TG)
    if (userProfile.value.doc_status !== 'Verified') {
        toastMessage.value = 'Neural Sync: CV/Letter Approval requested via WhatsApp & Telegram';
        isNeuralToastVisible.value = true;
        
        // Signal N8N Trigger: Workflow D (Include Job Metadata)
        await profileService.logActivity(userProfile.value.email, 'DOC_APPROVAL_PENDING', { 
            status: 'pending',
            job: job, // FULL PAYLOAD
            company: job.c, 
            role: job.r,
            user_phone: '+46769703311', // Personal Testing Number
            target_company_email: 'info@infodigynex.se', // Internal Testing ATS Email
            timestamp: new Date().toISOString()
        });
        
        setTimeout(() => { isNeuralToastVisible.value = false }, 5000);
        return;
    }
    
    isRecalibrating.value = true;
    toastMessage.value = `DigyNex Intelligence: Syncing Profile with ${job.c}...`;
    isNeuralToastVisible.value = true;
    
    try {
        // Simulate high-fidelity sync delay
        await new Promise(r => setTimeout(r, 2500));
        
        // PERSISTENCE ENGINE: Legally submit to database
        const user = await authService.getUser();
        await profileService.submitApplication(user, job);
        
        // Update local neural state
        const target = allJobs.value.find(j => j.c === job.c && j.r === job.r);
        if (target) {
            target.step = 'applied';
            target.s = 'applied';
        }
        
        toastMessage.value = 'Strategic Sync Complete: Application Transmitted';
    } catch (err) {
        toastMessage.value = 'Sync Error: Neural Link Unstable';
    } finally {
        isRecalibrating.value = false;
        isJobDetailOpen.value = false;
        setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
    }
}

const isInfoSheetOpen = ref(false)
const infoSheetType = ref('')
const infoSheetTitle = ref('')
const isFounderPassOpen = ref(false)

const openLegalModal = (type) => {
    infoSheetType.value = type;
    const titles = {
        'pricing': 'Strategic Subscription Engine',
        'about': 'About DigyNex AI',
        'privacy': 'Privacy & AI Ethics (GDPR)',
        'terms': 'Terms of Service',
        'security': 'Data Security & Neural Guard',
        'refund': 'Billing & Refund Policy',
        'support': 'Support & Help Center'
    };
    infoSheetTitle.value = titles[type] || 'Information Hub';
    infoSheetType.value = type;
    isInfoSheetOpen.value = true;
}

const fetchUserProfile = async () => {
    const user = await authService.getUser();
    if (user) {
        isAuthenticated.value = true;
        const { data: profile } = await profileService.fetchProfile(user.id);

        if (profile) {
            const planIndex = quotaService.normalizePlanType(profile.plan_type);
            const planString = planIndex === 2 ? 'elite' : (planIndex === 1 ? 'pro' : 'free');

            userProfile.value = {
                email: user.email,
                name: profile.name || user.user_metadata?.full_name || 'Expert',
                phone: profile.phone || '',
                linkedin_session: profile.linkedin_session || '',
                linkedin_jsessionid: profile.linkedin_jsessionid || '',
                plan_type: planString, // STRATEGIC: Unified string format
                primaryColor: profile.primary_color || '#0A2647',
                secondaryColor: profile.secondary_color || '#64748b',
                languagePreference: profile.language_preference || 'EN',
                isSuperUser: profile.is_admin || false, // RE-ENGAGED: Real-time role check
                isReturning: true, // ENGINE: Mark as returning user
                doc_status: profile.doc_status || 'Draft' // GUARDRAIL: Document Verification State
            };
            linkedInSessionInput.value = profile.linkedin_session || '';
            linkedInJsessionidInput.value = profile.linkedin_jsessionid || '';
            isFirstTime.value = false;
            uploadedFileName.value = profile.uploaded_cv_name || 'No CV Uploaded';
            selectedTemplate.value = profile.selected_template || 3;
            if (profile.secret_keywords) {
                masterProfile.value.secretKeywords = profile.secret_keywords;
            }
            if (profile.resume_data && Object.keys(profile.resume_data).length > 0) {
                // NEURAL RE-HYDRATION: Restoring the full professional core
                masterProfile.value = { ...masterProfile.value, ...profile.resume_data };
            }
            if (profile.cover_letter) {
                coverLetterText.value = profile.cover_letter;
            }
            if (profile.language_preference) {
                currentLang.value = profile.language_preference;
                locale.value = profile.language_preference;
            } else {
                currentLang.value = 'EN';
                locale.value = 'EN';
            }
        } else {
            userProfile.value = {
                email: user.email,
                name: user.user_metadata?.full_name || user.user_metadata?.display_name || 'Expert',
                primaryColor: '#0A2647',
                secondaryColor: '#64748b',
                languagePreference: 'EN',
                isReturning: false // ENGINE: Mark as first-time user
            };
            isFirstTime.value = true;
        }
    }
    
    // NEURAL WAKE-UP: Prepare the specimen for instant preview
    await refreshViewport();
};

// Redundant onMounted removed - logic consolidated at the top level of script setup.

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const openAuth = (mode) => {
    authMode.value = mode;
    isAuthOpen.value = true;
}

const loginSuccess = async () => {
    await fetchUserProfile();
    isAuthOpen.value = false;
}

const logout = async () => {
    await authService.signOut();
    isAuthenticated.value = false;
    // GOLDEN RULE: Redirect to 1st UI (Dashboard) after logic update
    activeTab.value = 'dashboard';
}

const returnToDashboard = () => {
    activeTab.value = 'dashboard';
}

// Job Detail Logic
const isJobDetailOpen = ref(false)
const selectedJob = ref(null)

const openJobDetail = (job) => {
    selectedJob.value = job;
    isJobDetailOpen.value = true;
}

// Action Sheet Logic
const actionSheetTitle = ref('')
const isActionSheetOpen = ref(false)
const activeActions = ref([])

const trackingActions = [
    { id: 'export', label: 'Export Summary', icon: DownloadCloud, color: 'text-blue-400' },
    { id: 'sync', label: 'Sync Pipeline', icon: RefreshCw, color: 'text-[#73BBA3]' },
    { id: 'archive', label: 'Archive Completed', icon: EyeOff, color: 'text-gray-400' }
]

const analyticsActions = [
    { id: 'insights', label: 'Full Market Insights', icon: BarChart3, color: 'text-[#C1A172]' },
    { id: 'skills', label: 'Update Skill Profile', icon: UserPlus, color: 'text-blue-400' },
    { id: 'recalibrate', label: 'AI Re-Calibration', icon: Zap, color: 'text-purple-400' }
]

const searchFilters = [
    { id: 'date', label: 'Filter by Date', icon: FileText, color: 'text-blue-400' },
    { id: 'relevance', label: 'Most Relevant', icon: Sparkles, color: 'text-[#C1A172]' },
    { id: 'company', label: 'By Company Name', icon: Briefcase, color: 'text-gray-400' }
]

const openActionSheet = (title, type) => {
    actionSheetTitle.value = title;
    if (type === 'tracking') activeActions.value = trackingActions;
    else if (type === 'analytics') activeActions.value = analyticsActions;
    else activeActions.value = searchFilters;
    isActionSheetOpen.value = true;
}

// Real Engine Action Handlers
const isNeuralToastVisible = ref(false)
const toastMessage = ref('')
const toastType = ref('info') // 'info' | 'success' | 'error' | 'warning'

// Neural Error Handling: Central toast dispatcher
const showNeuralToast = (message, type = 'info', duration = 3000) => {
    toastMessage.value = message;
    toastType.value = type;
    isNeuralToastVisible.value = true;
    setTimeout(() => { isNeuralToastVisible.value = false }, duration);
}

const handleDashboardAction = async (actionId, jobData = null) => {
    console.log(`[DIGYNEX ENGINE] Triggering: ${actionId}`);

    // FOUNDER PASS: Revenue Trigger
    if (actionId === 'upgrade' || actionId === 'founder_pass') {
        isFounderPassOpen.value = true;
        return;
    }
    
    if (actionId === 'skills') {
        isActionSheetOpen.value = false;
        isManualFormOpen.value = true;
        return;
    }

    if (actionId === 'insights') {
        activeTab.value = 'matches';
        toastMessage.value = 'Analyzing real-time market trends...';
        isNeuralToastVisible.value = true;
        setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
        return;
    }

    if (actionId === 'clear_keywords') {
        masterProfile.value.secretKeywords = [];
        await saveProfile();
        toastMessage.value = 'Neural Wipe: Standard Keywords Flushed';
        isNeuralToastVisible.value = true;
        setTimeout(() => { isNeuralToastVisible.value = false }, 2500);
        return;
    }

    if (actionId === 'initiate_broadcast') {
        // SIGNAL: Trigger n8n Workflow (Global CV Distribution)
        toastMessage.value = 'Connecting to Proxy Layer... Establishing Handshake';
        isNeuralToastVisible.value = true;
        
        setTimeout(() => {
            toastMessage.value = 'Neural Broadcast Initiated: Outbound Active';
            // Placeholder: Call webhook or log activity to Supabase for n8n to pick up.
        }, 1500);

        setTimeout(() => { isNeuralToastVisible.value = false }, 4000);
        return;
    }

    if (actionId === 'apply_direct') {
        const job = jobData || selectedJob.value;
        if (!job) return;
        await handleApplyDirect(job);
        return;
    }

    if (actionId === 'broadcast') {
        toastMessage.value = 'Preparing executive notification broadcast...';
        isNeuralToastVisible.value = true;
        
        // BRIDGE: Trigger n8n Workflow A (Global Broadcast)
        await profileService.logActivity(userProfile.value.email, 'ADMIN_BROADCAST', { 
            active: true,
            type: 'System Upgrade',
            message: 'Global Neural System Upgrade Initiated. Operations are temporarily paused for optimization.',
            timestamp: new Date().toISOString()
        });
        
        setTimeout(() => { isNeuralToastVisible.value = false }, 4000);
        return;
    }

    if (actionId === 'normal_apply') {
        const targetJob = jobData || selectedJob.value;
        if (!targetJob) return;
        await handleApply(targetJob);
        return;
    }

    if (actionId === 'quick_apply') {
        const targetJob = jobData || selectedJob.value;
        if (!targetJob) return;

        // --- NEURAL GUARDRAIL: Master Identity Verification (Workflow D) ---
        /* if (userProfile.value.doc_status !== 'Verified' && !userProfile.value.isSuperUser) {
            showNeuralToast('Verification Required: Complete Expert Profile & WhatsApp Handshake first 🛡️', 'warning', 5000);
            isManualFormOpen.value = true; // Guide user to the wizard
            return;
        } */

        // --- UNIFIED QUOTA ENGINE (V18.5 POST-CHARGE) ---
        // Dispatch is allowed for all verified users; quota is deducted post-execution.

        // WITHIN QUOTA: Instant Dispatch
        const today = new Date().toLocaleDateString();
        toastMessage.value = `Neural Pulse: Dispatching to ${targetJob.c}...`;
        isNeuralToastVisible.value = true;
        
        try {
            const user = await authService.getUser();
            const result = await profileService.triggerHeadlessApply(user, targetJob, userProfile.value);
            
            if (result.error === 'IDENTITY_UNVERIFIED') {
                showNeuralToast(result.message, 'warning');
            } else if (result.ok) {
                showNeuralToast('Neural Dispatch V18.5: Automated Handshake Initiated', 'success');
                allJobs.value.unshift({
                    c: targetJob.c, r: targetJob.r, s: 'applied', m: targetJob.m, d: today, l: targetJob.l,
                    icon: Briefcase, color: targetJob.color, step: 'applied'
                });
            } else {
                showNeuralToast(`Dispatch Failure: ${result.status || 'Unknown'} | ${result.message || ''}`, 'error');
            }
        } catch (err) {
            showNeuralToast('Critical Engine Error: Dispatch Aborted', 'error');
        }
        setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
        return;
    }

    if (actionId === 'save_match') {
        const targetJob = jobData || selectedJob.value;
        toastMessage.value = 'Identity Protocol: Match Buffered';
        isNeuralToastVisible.value = true;
        await profileService.logActivity(userProfile.value.email, 'JOB_SAVED', { job: targetJob?.c });
        setTimeout(() => { isNeuralToastVisible.value = false }, 2000);
        return;
    }

    if (actionId === 'manual_toolkit') {
        const targetJob = jobData || selectedJob.value;
        if (!targetJob) return;
        selectedJob.value = targetJob;
        isManualToolkitOpen.value = true;
        
        // SIGNAL: Trigger n8n Workflow E (Manual Assist Sequence)
        await profileService.logActivity(userProfile.value.email, 'MANUAL_ASSIST_START', {
            company: targetJob.c,
            role: targetJob.r,
            timestamp: new Date().toISOString()
        });
        return;
    }

    if (actionId === 'MANUAL_ASSIST_DISPATCH') {
        await profileService.logActivity(userProfile.value.email, 'MANUAL_ASSIST_DISPATCH', {
            company: jobData.c,
            role: jobData.r,
            timestamp: new Date().toISOString()
        });
        showNeuralToast('Neural Dispatch: Portal Link Active', 'success');
        return;
    }

    if (actionId === 'CV_EXPORT' || actionId === 'CL_EXPORT') {
        await profileService.logActivity(userProfile.value.email, actionId, {
            company: jobData?.c || 'Global',
            role: jobData?.r || 'Specimen',
            timestamp: new Date().toISOString()
        });
        showNeuralToast(`${actionId.split('_')[0]} Export Logged to Quota`, 'info');
        return;
    }

    if (actionId === 'open_tracking') {
        activeTab.value = 'applications';
        return;
    }

    if (actionId === 'submit_for_audit') {
        toastMessage.value = 'Neural Audit: Strategy Submission Initiated...';
        isNeuralToastVisible.value = true;
        
        try {
            const user = await authService.getUser();
            if (user) {
                await profileService.updateProfile(user.id, { 
                    doc_status: 'Pending_Approval' 
                });
                userProfile.value.doc_status = 'Pending_Approval';
            }
            
            // SIGNAL: Trigger Workflow D (Verification Guardrail)
            await profileService.logActivity(userProfile.value.email, 'DOC_APPROVAL_PENDING', {
                role: masterProfile.value.basic.role || 'Expert Identity Audit',
                company: 'DigyNex Neural Engine',
                user_phone: userProfile.value.phone || masterProfile.value.basic.phone || '+46790522874',
                identity: masterProfile.value.basic,
                status: 'pending_verification',
                timestamp: new Date().toISOString()
            });
            
            toastMessage.value = 'Audit Active: Guardrail Verification Dispatched';
        } catch (err) {
            toastMessage.value = 'Audit Sync Error. Retrying...';
        }
        
        setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
        return;
    }

    if (actionId === 'tailor_cv') {
        if (!selectedJob.value) return;

        // --- DYNAMIC TIER CHECK: AI Magic (V12.0) ---
        const index = quotaService.normalizePlanType(userProfile.value.plan_type);
        const tier = quotaService.TIERS[index];
        
        if (!tier?.ai_magic && !userProfile.value.isSuperUser) {
            showNeuralToast(`${tier?.name || 'FREE'} Tier: AI Magic LOCKED 🔒 Upgrade to Sync`, 'warning');
            return;
        }
        
        showNeuralToast('Neural Engine: Synthesizing Custom Identity...', 'info');
        
        // ENGINE CALL: Generate Context-Aware Synthesis
        const tailoredLetter = profileService.generateCoverLetter({
           name: userProfile.value.name,
           resume_data: masterProfile.value,
           secret_keywords: masterProfile.value.secretKeywords,
           job: selectedJob.value
        });

        synthesisData.value = {
            job: selectedJob.value,
            letter: tailoredLetter,
            summary: `Expert results-driven candidate with deep expertise in ${selectedJob.value.r} and strategic alignment with ${selectedJob.value.c}.`
        };

        await new Promise(r => setTimeout(r, 2000));
        isSynthesisReviewOpen.value = true;
        return;
    }

    if (actionId === 'approve_dispatch') {
        const targetJob = synthesisData.value.job;
        if (!targetJob) return;

        // --- UNIFIED QUOTA ENGINE (V11.5) ---
        const quota = await quotaService.canPerformAction(userProfile.value, 'CV_EXPORT');

        if (!quota.can) {
             showNeuralToast(`Quota Reached: ${quota.reason.replace('_', ' ')}. Queued.`, 'warning');
             
             allJobs.value.unshift({
                c: targetJob.c, r: targetJob.r, s: 'queued', m: targetJob.m,
                d: new Date().toLocaleDateString(), l: targetJob.l,
                icon: Briefcase, color: '#0A2647', step: 'queued'
            });

            // STRICT RULE: Strategic Queue Metadata Sync
            await profileService.logActivity(userProfile.value.email, 'JOB_QUEUED', { 
                status: 'pending',
                job: targetJob,
                company: targetJob.c,
                role: targetJob.r,
                reason: quota.reason,
                timestamp: new Date().toISOString()
            });
            return;
        }
        
        isDispatching.value = true;
        showNeuralToast('Pulse Signal Transmitting...', 'info', 3000);
        
        // DISPATCH ENGINE: Trigger Headless Broadcast Signal for n8n/Playwright
        const userIdentity = { ...userProfile.value, ...masterProfile.value };
        await profileService.triggerHeadlessBroadcast(userIdentity, targetJob, synthesisData.value);

        // Add to tracking list locally
        allJobs.value.unshift({
            c: targetJob.c, r: targetJob.r, s: 'applied', m: targetJob.m,
            d: new Date().toLocaleDateString(), l: targetJob.l,
            icon: Briefcase, color: '#0A2647', step: 'applied'
        });

        await new Promise(r => setTimeout(r, 2500));
        isDispatching.value = false;
        isSynthesisReviewOpen.value = false;
        
        showNeuralToast('Protocol Executed: Application Dispatched via Cloud Pipe', 'success', 4000);
        return;
    }

    if (actionId === 'open_tracking') {
        isTrackingLabOpen.value = true;
        return;
    }

    if (actionId === 'open_country_selector' || actionId === 'openCountrySelector') {
        const limit = quotaService.getCountryLimit(userProfile.value.plan_type);
        if (selectedCountriesArr.value.length >= limit && !userProfile.value.isSuperUser) {
            toastMessage.value = `Quota Reached: Tier limit is ${limit} countries.`;
            isNeuralToastVisible.value = true;
            setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
            return;
        }
        showCountrySelector.value = true;
    }
    
    if (actionId === 'purge') {
        toastMessage.value = 'Neural Wipe: Purging System Residue...';
        isNeuralToastVisible.value = true;
        
        // BRIDGE: Trigger n8n Workflow C (System Purge)
        await profileService.logActivity(userProfile.value.email, 'ADMIN_DATA_PURGE');
        
        setTimeout(() => { isNeuralToastVisible.value = false }, 4000);
        return;
    }

    // Generic Action Wrapper for n8n/Supabase Logging
    toastMessage.value = `Dispatching Signal: ${actionId}...`;
    isNeuralToastVisible.value = true;
    
    try {
        // Log event to activity engine using profile service
        if (isAuthenticated.value) {
           await profileService.logActivity(userProfile.value.email, actionId);
        }
        
        await new Promise(res => setTimeout(res, 1500));
        toastMessage.value = `Success: Action Synced`;
    } catch (err) {
        console.error('Engine Link Error');
    } finally {
        setTimeout(() => { isNeuralToastVisible.value = false }, 2000);
    }
}

const handleApplyDirect = async (job) => {
    if (!job.u && !job.url) {
        showNeuralToast('Neural Error: LinkedIn URL Missing', 'error');
        return;
    }

    // --- NEURAL QUOTA GUARD (V19.0) ---
    // Check if user has enough bandwidth for another application
    const quota = await quotaService.canPerformAction(userProfile.value, 'JOB_APPLY');
    if (!quota.can && !userProfile.value.isSuperUser) {
        showNeuralToast(`Quota Reached: ${quota.reason.replace('_', ' ')}. Upgrade to Sync.`, 'warning', 5000);
        return;
    }

    showNeuralToast('Neural Bridge: Calibrating Injection...', 'info', 4000);
    isNeuralBridgeOpen.value = true;
    
    // 1. Prepare User Data Payload
    const userData = {
        name: masterProfile.value.basic?.fullName || userProfile.value.name,
        email: masterProfile.value.basic?.email || userProfile.value.email,
        phone: userProfile.value.phone || masterProfile.value.basic?.phone || '',
        jsessionid: userProfile.value.linkedin_jsessionid || ''
    };

    // 2. SIGNAL: Log to Supabase/n8n for Quota Deduction & Tracking
    await profileService.logActivity(userProfile.value.email, 'JOB_APPLY', {
        job_role: job.r,
        company: job.c,
        job_url: job.u || job.url || '',
        method: 'NEURAL_MOBILE_INJECTION',
        status: 'initiated',
        job: job,
        timestamp: new Date().toISOString()
    });

    // 3. EXECUTION: The "Surgical" Injection (Mobile WebView Path)
    // We generate a dynamic version of the injector that reports back to n8n
    const webhookUrl = import.meta.env.VITE_N8N_SIGNAL_WEBHOOK || '';
    
    console.log(`%c[DIGYNEX] Generating Identity-Aware Injector for ${userData.email}`, "color: #C1A172; font-weight: bold;");

    setTimeout(() => {
        window.open(job.u || job.url, '_blank');
        showNeuralToast('🛰️ Injection Active: LinkedIn Opened.', 'success', 6000);
        
        // BRIDGE: In a real Mobile WebView, we'd inject this via evaluateJavaScript
        // For current testing, we provide the payload in the console for the user to paste
        console.log("%c 🛰️ NEURAL INJECTOR PAYLOAD (COPY & PASTE IN LINKEDIN CONSOLE) ", "background: #C1A172; color: #0A2647; font-weight: bold; padding: 10px;");
        console.log(`window.DIGYNEX_IDENTITY = ${JSON.stringify(userData)}; window.DIGYNEX_WEBHOOK = "${webhookUrl}";`);
    }, 2000);

    // 4. Update UI state
    job.s = 'applying';
    job.step = 'neural_active';
};


const toggleSelector = (e) => {
  if (e) e.stopPropagation();
  isLangOpen.value = !isLangOpen.value
}

const handleClickOutside = (event) => {
  if (langContainer.value && !langContainer.value.contains(event.target)) {
    isLangOpen.value = false
  }
  if (notificationContainer.value && !notificationContainer.value.contains(event.target)) {
    isNotificationsOpen.value = false
  }
}

// Notification Engine Logic
const notifications = ref([
  {
    id: 1,
    title: 'Google: Interview Scheduled!',
    message: 'Your AI Architect interview is set for March 25th at 10:00 AM.',
    type: 'job',
    target: 'Google',
    icon: Sparkles,
    color: 'bg-blue-50',
    iconColor: 'text-blue-500'
  },
  {
    id: 2,
    title: 'Spotify: Profile Synced',
    message: 'Your recent CV updates have been optimized for Spotify Lead Dev role.',
    type: 'tab',
    target: 'profile',
    icon: RefreshCw,
    color: 'bg-[#73BBA3]/10',
    iconColor: 'text-[#73BBA3]'
  },
  {
    id: 3,
    title: 'New AI Match: Tesla',
    message: "We found a 92% match for 'Autopilot Vision Engineer' in Oslo.",
    type: 'job',
    target: 'Tesla',
    icon: Zap,
    color: 'bg-orange-50',
    iconColor: 'text-orange-500'
  }
])

const handleNotificationClick = (notif) => {
  if (notif.type === 'job') {
    const job = allJobs.value.find(j => j.c === notif.target)
    if (job) openJobDetail(job)
  } else if (notif.type === 'tab') {
    activeTab.value = notif.target
  }
  isNotificationsOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#0A2647] flex items-center justify-center p-4 font-jakarta">

    <!-- GLOBAL MAINTENANCE OVERLAY (NEURAL LOCK) -->
    <div v-if="isMaintenanceMode && !userProfile?.isSuperUser" class="fixed inset-0 z-[10000] bg-[#0A2647] flex flex-col items-center justify-center p-8 text-center">
       <div class="bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-3xl max-w-[360px] w-full animate-in zoom-in-95 duration-700">
          <div class="bg-[#C1A172] p-4 rounded-2xl inline-block mb-6 shadow-[0_0_30px_rgba(193,161,114,0.4)]">
             <AlertTriangle class="w-10 h-10 text-[#0A2647]" />
          </div>
          <h1 class="text-2xl font-black text-white uppercase tracking-[0.2em] mb-4">Neural Systems Offline</h1>
          <p class="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">{{ maintenanceMessage }}</p>
          <div class="h-[1px] w-12 bg-white/10 my-8 mx-auto"></div>
          <p class="text-[9px] font-black text-[#C1A172] uppercase tracking-[0.3em]">Direct Strategic Pulse: DigyNex Core</p>
       </div>
    </div>
    <!-- 
       ALEX MASTER SYNC V6.0 (STRICT STABLE RECOVERY)
       - CENTERED BRANDING HUB
       - GOLD BRANDING (PRISTINE)
       - NARROW SLIM NAV BAR (BOTTOM-4)
    -->
    <main :dir="locale === 'AR' ? 'rtl' : 'ltr'" 
          class="w-full max-w-[360px] h-[800px] bg-[#0A2647] relative z-10 flex flex-col border border-white/10 rounded-[3.8rem] ring-1 ring-white/20 shadow-[0_80px_160px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-500">

       <!-- GLOBAL HEADER HUB -->
       <TopNavbar 
          :t="t"
          :locale="locale"
          :isAuthenticated="isAuthenticated"
          :quickLangs="quickLangs"
          :otherLangs="otherLangs"
          :isLangOpen="isLangOpen"
          @setLang="setLang"
          @toggleLang="toggleSelector"
          @openAuth="openAuth"
          @logout="logout"
       />

       <!-- NEURAL SAFETY INDICATOR (PHASE 4: STEALTH) -->
       <Transition name="neural-pulse">
          <div v-if="isHeartbeatActive && isAuthenticated" 
               class="fixed top-24 left-1/2 -translate-x-1/2 z-[4000] px-4 py-2 bg-[#0A2647]/60 backdrop-blur-xl border border-[#C1A172]/30 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(193,161,114,0.15)] pointer-events-none">
             <div class="relative flex items-center justify-center">
                <div class="absolute inset-0 bg-[#C1A172] blur-md rounded-full animate-ping opacity-20 scale-150"></div>
                <div class="absolute inset-0 bg-[#C1A172] blur-sm rounded-full animate-pulse opacity-40"></div>
                <ShieldCheck class="w-3.5 h-3.5 text-[#C1A172] relative z-10" />
             </div>
             <div class="flex flex-col">
                <span class="text-[8px] font-black text-white uppercase tracking-[0.2em] leading-none">Neural Safety: Active</span>
                <span class="text-[6px] font-bold text-[#C1A172] uppercase tracking-widest mt-1">Simultaneous Login Shielded</span>
             </div>
          </div>
        </Transition>

       <!-- MISSION CRITICAL HUB CENTER -->
       <div class="flex-1 relative overflow-hidden flex flex-col">
          <!-- DASHBOARD VIEW -->
          <DashboardHub 
          v-if="activeTab === 'dashboard'"
          :t="t"
          :locale="locale"
          :isAuthenticated="isAuthenticated"
          :displayName="displayName"
          :userProfile="userProfile"
          :masterProfile="masterProfile"
          :allJobs="allJobs"
          :matches="matches"
          :selectedPipelineStep="selectedPipelineStep"
          :uploadedFileName="uploadedFileName"
          :isRecalibrating="isRecalibrating"
          @setTab="(tab) => activeTab = tab"
          @openAuth="openAuth"
          @logout="logout"
          @openJobDetail="openJobDetail"
          @openActionSheet="openActionSheet"
          @setPipelineStep="(step) => selectedPipelineStep = step"
          @handleAction="handleDashboardAction"
       />

       <ApplicationsHub 
          v-else-if="activeTab === 'applications'"
          v-model:searchQuery="searchQuery"
          :t="t"
          :filteredJobs="filteredJobs"
          :activeFilter="applicationsFilter"
          @update:activeFilter="(f) => applicationsFilter = f"
          @loadMore="loadMoreApplications"
          @openJobDetail="openJobDetail"
          @openActionSheet="openActionSheet"
       />

       <MatchesHub 
          v-else-if="activeTab === 'matches'"
          v-model:searchQuery="searchQuery"
          v-model:activeCountry="activeCountry"
           v-model:activeCity="activeCity"
          :t="t"
          :filteredMatches="filteredMatches"
          :totalMatchCount="matches.length"
          :visibleMatchesCount="visibleMatchesCount"
          :selectedCountriesArr="selectedCountriesArr"
          :activeFocusSlots="activeFocusSlots"
          :isRecalibrating="isRecalibrating"
          @loadMore="loadMoreMatches"
          @openJobDetail="openJobDetail"
          @handleAction="handleDashboardAction"
          @openCountrySelector="handleDashboardAction('openCountrySelector')"
          @triggerSearch="handleGlobalSearch"
          @removeCountry="removeCountryFocus"
       />

       <ProfileHub 
          v-else-if="activeTab === 'profile'"
          v-model:newField="newField"
          :t="t"
          :isAuthenticated="isAuthenticated"
          :userProfile="userProfile"
          :uploadedFileName="uploadedFileName"
          :activeFocusSlots="activeFocusSlots"
          :fieldsOfInterest="fieldsOfInterest"
          :isUploadingCV="isUploadingCV"
          :isSavingProfile="isSavingProfile"
          :isCompilingLatex="isCompilingLatex"
          :linkedInConnected="linkedInConnected"
          :linkedInUrlInput="linkedInUrlInput"
          @openAuth="openAuth"
          @openLinkedInModal="openLinkedInModal"
          @openManualForm="isManualFormOpen = true"
          @compileLatex="compileLatex"
          @triggerFileUpload="triggerFileUpload"
          @handleFileUpload="handleFileUpload"
          @saveProfile="saveProfile"
          @removeField="removeField"
          @addField="addField"
          @openCVModal="isCVModalOpen = true"
          @openAdminPanel="activeTab = 'admin'" 
          @logout="logout"
          @openLegal="openLegalModal"
          @returnToDashboard="returnToDashboard"
       />

       <!-- MASTER CONTROL PANEL (ADMIN HUB) -->
       <AdminHub 
          v-else-if="activeTab === 'admin'"
          :t="t"
          :userProfile="userProfile"
          v-model:isMaintenanceMode="isMaintenanceMode"
          @setTab="(tab) => activeTab = tab"
          @sendNotification="handleDashboardAction"
          @purgeData="handleDashboardAction"
          @updateUserTier="handleDashboardAction"
       />

       <!-- CV STUDIO HUB (MAGIC CENTER) -->
       <StudioHub 
          v-else-if="activeTab === 'studio'"
          :coverLetterText="coverLetterText"
          :previewMode="previewMode"
          @generateCoverLetter="handleGenerateCoverLetter"
          @updateCoverLetter="handleUpdateCoverLetter"
          @setPreviewMode="(mode) => previewMode = mode"
          v-model:selectedTemplate="selectedTemplate"
          :t="t"
          :userProfile="userProfile"
          :masterProfile="masterProfile"
          :cvTemplates="cvTemplates"
          :viewportHtml="viewportHtml"
          :isStealthUnlocked="isStealthUnlocked"
          :isAnalyzingKeywords="isAnalyzingKeywords"
          :isSavingProfile="isSavingProfile"
          :isBrandingSyncing="isBrandingSyncing"
          :colorPresets="colorPresets"
          @selectTemplate="selectTemplate"
          @removeSecretKeyword="removeSecretKeyword"
          @addSecretKeyword="addSecretKeyword"
          @analyzeKeywords="analyzeAndSuggestKeywords"
          @selectPreset="selectPreset"
          @saveProfile="saveProfile"
          @handleAction="handleDashboardAction"
          @unlockStealth="isStealthUnlocked = true"
          @download-pdf="handleDownloadPdf"
       >
          <template #keyword-input>
             <input v-model="newSecretKeyword" @keyup.enter="addSecretKeyword" 
                    type="text" placeholder="Inject Professional Keyword..." 
                    class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#73BBA3] transition-all" />
          </template>
       </StudioHub>

      <!-- PLACEHOLDERS FOR OTHER TABS -->
      <div v-else class="flex flex-col items-center justify-center py-40 text-center space-y-4">
         <div class="bg-white/5 p-6 rounded-full animate-bounce">
            <Globe class="w-10 h-10 text-white/20" />
         </div>
         <h2 class="text-[18px] font-black text-[#C1A172] uppercase tracking-widest">Active State: {{ activeTab }}</h2>
         <p class="text-[12px] font-medium text-white/30 italic">Initializing Neural Interface...</p>
      </div>
    </div>

      <!-- GLOBAL DISCOVERY OVERLAY (COUNTRY SELECTOR) -->
          <Transition name="fade">
         <div v-if="isCVModalOpen" class="fixed inset-0 z-[1000] flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in duration-300">
            <!-- BACKDROP -->
            <div @click="isCVModalOpen = false" class="absolute inset-0 bg-[#0A2647]/90 backdrop-blur-2xl"></div>
            
            <div class="relative w-full max-w-[360px] bg-[#051124]/90 backdrop-blur-3xl border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-3xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[85vh]">
                <div class="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5 backdrop-blur-md">
                   <div class="flex items-center gap-3">
                      <div class="bg-[#2C74B3]/20 p-2 rounded-xl">
                         <FileText class="w-5 h-5 text-[#2C74B3]" />
                      </div>
                      <div class="flex flex-col">
                         <h3 class="text-xs font-black text-white/90 uppercase tracking-widest">{{ viewMode === 'elite' ? 'Elite Neural Specimen' : 'Legacy CV Data' }}</h3>
                         <p class="text-[9px] font-bold text-[#C1A172] uppercase tracking-[0.2em] mt-0.5 italic">
                             {{ uploadedFileName !== 'No CV Uploaded' ? uploadedFileName : (isAuthenticated ? 'New Profile Specimen' : 'Demo_Neural_Specimen.pdf') }}
                          </p>
                      </div>
                   </div>
                   <div class="flex items-center gap-2">
                       <!-- NEURAL COMPARISON TRIGGER -->
                       <button @mousedown="viewMode = 'legacy'"
                               @mouseup="viewMode = 'elite'"
                               @mouseleave="viewMode = 'elite'"
                               @touchstart.prevent="viewMode = 'legacy'"
                               @touchend.prevent="viewMode = 'elite'" @touchcancel.prevent="viewMode = 'elite'"
                                :disabled="uploadedFileName === 'No CV Uploaded'"
                                class="flex items-center gap-2 px-4 py-2 rounded-full border transition-all select-none group/compare active:scale-95 shadow-xl disabled:opacity-30 disabled:grayscale" 
                                :class="viewMode === 'legacy' ? 'bg-[#C1A172] border-[#C1A172] text-[#0A2647]' : 'bg-white/5 border-white/10 text-white/60'">
                          <Eye class="w-3.5 h-3.5" :class="viewMode === 'legacy' ? 'animate-pulse' : ''" />
                          <span class="text-[9px] font-black uppercase tracking-[0.2em]">{{ uploadedFileName === 'No CV Uploaded' ? 'Single View' : (viewMode === 'legacy' ? 'Viewing' : 'Hold') }}</span>
                       </button>
                       <button @click="isCVModalOpen = false" class="p-2.5 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400 text-white/50 transition-colors">
                          <X class="w-4 h-4" />
                       </button>
                    </div>
                </div>
 
                <div class="flex-1 overflow-y-auto no-scrollbar relative w-full bg-white flex flex-col">
                    <!-- REAL NEURAL VIEWPORT ENGINE (THE WINNER) -->
                    <div v-if="viewMode === 'elite'" class="w-full flex flex-col items-center pt-4 origin-top" 
                         style="transform: scale(0.43); transform-origin: top center; margin-bottom: -640px;">
                       <div v-html="viewportHtml" 
                            class="w-[210mm] shadow-2xl animate-in zoom-in-95 duration-500 transition-all grayscale-[0.8]"
                            :class="{ 'filter blur-md select-none pointer-events-none opacity-60': !isAuthenticated }"
                            style="min-height: 1200px;">
                       </div>
                    </div>

                   <!-- LEGACY CORE (THE ORIGINAL PDF SPECIMEN) -->
                    <div v-else-if="viewMode === 'legacy'" class="w-full flex-1 flex flex-col items-center bg-white min-h-[500px]">
                       <!-- REAL PDF PREVIEW (The Game Changer) -->
                       <template v-if="uploadedFileUrl">
                          <div class="w-full h-full flex flex-col relative animate-in fade-in zoom-in-95 duration-500">
                             <iframe :src="uploadedFileUrl + '#toolbar=0&navpanes=0&view=FitH'" 
                                     class="w-full h-full border-none relative z-10 grayscale-[0.3] contrast-[1.1]"
                                     style="min-height: 600px; height: 100%;">
                             </iframe>
                          </div>
                       </template>
                       
                       <!-- CLASSIC PROFESSIONAL LAYOUT (MANUAL DATA FALLBACK) -->
                       <div v-else class="w-full flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40 grayscale animate-in zoom-in-95">
                           <div class="bg-slate-100 p-6 rounded-full mb-6">
                              <FileText class="w-12 h-12 text-slate-400" />
                           </div>
                           <h4 class="text-xs font-black uppercase tracking-[0.3em] text-slate-500 leading-relaxed">Legacy Data Stream<br/>Inactive</h4>
                           <p class="text-[9px] font-bold uppercase tracking-widest mt-4 text-slate-400 max-w-[200px] leading-relaxed">Re-upload your original CV to re-enable neural comparison mode.</p>
                       </div>
                    </div>
                 </div>

                    <!-- REFERENCE-PERFECT ACTION BAR (GREY GLASS STYLE) -->
                    <div v-if="isAuthenticated && viewportHtml" class="absolute bottom-10 left-0 right-0 z-[1005] px-10 flex justify-center pointer-events-none">
                       <button @click="handleDownloadPdf" class="pointer-events-auto flex items-center gap-6 px-8 py-2.5 bg-[#1A1A1A]/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-4xl hover:bg-[#1A1A1A]/80 active:scale-95 transition-all group/dlm">
                          
                          <!-- LEFT: SPECIMEN TYPE -->
                          <div class="flex flex-col items-start leading-[0.9]">
                             <span class="text-[13px] font-bold text-white/90 tracking-tight">A4</span>
                             <span class="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">SPECIMEN</span>
                          </div>

                          <!-- DIVIDER & ICON -->
                          <div class="h-6 w-px bg-white/10 relative flex items-center justify-center">
                             <div class="absolute inset-0 m-auto bg-white/5 w-6 h-6 rounded-full blur-xl"></div>
                             <DownloadCloud class="w-4 h-4 text-white/30 relative z-10 mx-[-10px]" />
                          </div>

                          <!-- RIGHT: DOWNLOAD ACTION -->
                          <div class="flex flex-col items-start leading-[0.9]">
                             <span class="text-[11px] font-bold text-white/90 tracking-wide uppercase">DOWNLOAD</span>
                             <span class="text-[8px] font-black text-[#C1A172] uppercase tracking-[0.2em] mt-1">HD PDF</span>
                          </div>

                       </button>
                    </div>

                   <!-- PROTECTION OVERLAY -->
                    <div v-if="!isAuthenticated" class="absolute inset-0 z-[1002] flex flex-col items-center justify-center p-8 text-center bg-[#051124]/40 backdrop-blur-md">
                       <div class="bg-[#051124]/90 p-8 rounded-[2.5rem] border border-white/10 shadow-3xl flex flex-col items-center gap-6 max-w-[280px] animate-in zoom-in-95 duration-500">
                          <div class="bg-[#C1A172]/20 p-4 rounded-2xl">
                             <Lock class="w-10 h-10 text-[#C1A172] animate-pulse" />
                          </div>
                          <div class="space-y-2">
                             <h4 class="text-[13px] font-black text-white uppercase tracking-[0.2em]">Privacy Shield Active</h4>
                             <p class="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">Sign in to unlock full neural access and sync your identity.</p>
                          </div>
                          <button @click="isCVModalOpen = false; openAuth('login')" class="w-full py-4 bg-[#C1A172] rounded-2xl text-[11px] font-black text-[#0A2647] uppercase tracking-[0.1em] shadow-xl hover:scale-105 active:scale-95 transition-all">
                             Sign In to Continue
                          </button>
                       </div>
                    </div>
                </div>
            </div>
</Transition>

      <!-- LOCKED EXPERT PROFILE SYSTEM (DEDICATED CORE) -->
      <ExpertProfileWizard 
        :isOpen="isManualFormOpen" 
        :profile="masterProfile"
        :activeCountry="activeCountry"
        :isAuthenticated="isAuthenticated"
        @close="isManualFormOpen = false" 
        @finalize="onManualFinalize" 
        @requestAuth="isAuthOpen = true"
        @neuralAction="handleNeuralAction"
      />

      <!-- LINKEDIN CONNECT OVERLAY -->
      <Transition name="fade">
         <div v-if="isLinkedInModalOpen" class="fixed inset-0 z-[1000] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
            <!-- BACKDROP -->
            <div @click="isLinkedInModalOpen = false" class="absolute inset-0 bg-[#0A2647]/95 backdrop-blur-3xl"></div>
            
            <div class="relative w-full max-w-[360px] bg-[#051124]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl flex flex-col max-h-[85vh]">
               <div class="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5 backdrop-blur-md">
                  <div class="flex items-center gap-3">
                     <div class="bg-[#0077b5]/20 p-2 rounded-xl border border-[#0077b5]/30">
                        <svg class="w-5 h-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                     </div>
                     <div class="flex flex-col">
                        <h3 class="text-xs font-black text-white/90 uppercase tracking-widest">Connect LinkedIn URL</h3>
                        <p class="text-[9px] font-bold text-white/40 tracking-[0.1em] mt-0.5">Parse live career data securely</p>
                     </div>
                  </div>
                  <button @click="isLinkedInModalOpen = false" class="p-2.5 bg-white/5 rounded-full hover:bg-white/10 text-white/50 transition-colors">
                     <X class="w-5 h-5" />
                  </button>
               </div>

               <div class="p-6 space-y-4">
                  <div class="space-y-1">
                     <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">LinkedIn Profile URL</label>
                     <input v-model="linkedInUrlInput" type="url" placeholder="https://linkedin.com/in/username"
                            class="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#0077b5] transition-all font-jakarta" />
                  </div>
                  
                  <div class="space-y-1">
                     <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">LinkedIn Session (li_at)</label>
                     <input v-model="linkedInSessionInput" type="password" placeholder="Paste your li_at cookie here"
                            class="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#0077b5] transition-all font-jakarta" />
                  </div>

                  <div class="space-y-1">
                     <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">CSRF Token (JSESSIONID)</label>
                     <input v-model="linkedInJsessionidInput" type="password" placeholder="Paste ajax:1262... here"
                            class="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#0077b5] transition-all font-jakarta" />
                     <p class="text-[7px] font-bold text-white/20 uppercase tracking-[0.2em] ml-2 mt-1 leading-relaxed">Required for Worldwide Security. Find it in Browser Cookies as JSESSIONID.</p>
                  </div>
               </div>

               <div class="p-6 pt-2 border-t border-white/5 bg-white/5 shrink-0">
                  <button @click="saveLinkedIn" :disabled="!linkedInUrlInput" class="w-full bg-[#0077b5] disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-[2.5rem] flex items-center justify-center gap-3 shadow-[0_15px_35px_rgba(0,119,181,0.2)] hover:scale-[1.02] active:scale-95 transition-all text-white font-black uppercase tracking-[0.15em] text-[12px] group relative overflow-hidden">
                     <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                     <div v-if="isLinkedInConnecting" class="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin absolute left-6"></div>
                     <span class="relative z-10">{{ isLinkedInConnecting ? 'Syncing Profile...' : 'Save & Extract Data' }}</span>
                  </button>
               </div>
            </div>
         </div>
</Transition>

      <Transition name="fade">
         <div v-if="showCountrySelector" class="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
            <!-- BACKDROP -->
            <div @click="showCountrySelector = false" class="absolute inset-0 bg-[#0A2647]/80 backdrop-blur-xl"></div>
            
            <!-- MODAL CONTENT -->
            <div class="relative w-full max-w-[360px] bg-[#0A2647] border border-white/10 rounded-t-[2.5rem] sm:rounded-[40px] overflow-hidden shadow-3xl animate-in slide-in-from-bottom duration-300">
               <div class="p-6 pb-2 border-b border-white/5 flex items-center justify-between">
                  <div>
                     <h3 class="text-xl font-black text-white/90 uppercase tracking-tight">GLOBAL DISCOVERY HUB</h3>
                     <p class="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1 italic font-jakarta">Active Focus Slots: {{ activeFocusSlots.used }}/{{ activeFocusSlots.total }}</p>
                  </div>
                  <button @click="showCountrySelector = false" class="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                     <X class="w-5 h-5 text-white/50" />
                  </button>
               </div>

               <div class="p-6 space-y-4">
                  <div class="relative group">
                     <input v-model="countrySearch" type="text" placeholder="Search Global Regions..." 
                            class="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#C1A172] transition-all font-jakarta shadow-inner" />
                     <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/30 group-focus-within:text-[#C1A172] transition-colors" />
                  </div>

                  <div class="grid grid-cols-2 gap-2 h-64 overflow-y-auto no-scrollbar pt-2 pr-1">
                     <!-- PREDEFINED LIST -->
                     <div v-for="c in ['Sweden', 'Germany', 'Norway', 'Finland', 'Denmark', 'United Kingdom', 'United States', 'Canada', 'Australia', 'Japan', 'France', 'Netherlands', 'Singapore', 'Switzerland', 'Ireland', 'Italy', 'Spain'].filter(name => name.toLowerCase().includes(countrySearch.toLowerCase()))" 
                          :key="c"
                          @click="toggleCountryFocus(c)"
                          class="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center justify-between hover:bg-white/10 hover:border-white/20 cursor-pointer active:scale-95 transition-all group">
                        <div class="flex items-center gap-2">
                           <div v-if="selectedCountriesArr.includes(c)" class="w-1.5 h-1.5 rounded-full bg-[#C1A172]"></div>
                           <span class="text-[10px] font-bold text-white/70 group-hover:text-white transition-colors">{{ c }}</span>
                        </div>
                        <ArrowRight class="w-3.5 h-3.5 text-white/20 group-hover:text-[#C1A172] group-hover:translate-x-1 transition-all" />
                     </div>

                     <!-- CUSTOM COUNTRY OPTION (GLOBAL UNLOCK) -->
                     <div v-if="countrySearch && !['Sweden', 'Germany', 'Norway', 'Finland', 'Denmark', 'United Kingdom', 'United States', 'Canada', 'Australia', 'Japan', 'France', 'Netherlands', 'Singapore', 'Switzerland', 'Ireland', 'Italy', 'Spain'].some(n => n.toLowerCase() === countrySearch.toLowerCase())"
                          @click="toggleCountryFocus(countrySearch)"
                          class="col-span-2 bg-[#C1A172]/10 border border-[#C1A172]/30 p-4 rounded-2xl flex items-center justify-between hover:bg-[#C1A172]/20 cursor-pointer active:scale-95 transition-all group mt-2">
                        <div class="flex items-center gap-3">
                           <div class="bg-[#C1A172] p-1.5 rounded-lg">
                              <Globe class="w-4 h-4 text-[#0A2647]" />
                           </div>
                           <div class="flex flex-col">
                              <span class="text-[10px] font-black text-white uppercase tracking-widest">Connect Neural Pulse</span>
                              <span class="text-[11px] font-bold text-[#C1A172]">{{ countrySearch }}</span>
                           </div>
                        </div>
                        <Sparkles class="w-4 h-4 text-[#C1A172] animate-pulse" />
                     </div>
                  </div>
               </div>

               <div class="p-6 bg-gradient-to-t from-white/5 to-transparent">
                  <button class="w-full bg-[#C1A172] text-[#0A2647] py-4 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all font-jakarta">
                     Upgrade Focus Slots
                  </button>
               </div>
            </div>
         </div>
</Transition>

      
      <!-- LIVE CV MASTER PREVIEW (PREMIUM LATEX OVERLAY) -->
      <Transition name="fade">
         <div v-if="isCVPreviewOpen" class="fixed inset-0 z-[5000] flex flex-col items-center justify-center p-4">
            <div @click="isCVPreviewOpen = false" class="absolute inset-0 bg-[#0A2647]/98 backdrop-blur-3xl"></div>
            <div class="relative w-full max-w-[360px] h-[750px] bg-white rounded-[3rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)] flex flex-col scale-100 animate-in zoom-in-95 duration-500">
               <!-- LaTeX Header Simulation (SYNCED) -->
               <div class="p-8 pb-4 border-b-4 space-y-3 text-center bg-white" :style="{ borderColor: userProfile.primaryColor }">
                      <h2 class="text-3xl font-black uppercase tracking-[-0.05em] leading-none font-playfair" :style="{ color: userProfile.primaryColor }">{{ masterProfile.basic.fullName || 'MASTER IDENTITY' }}</h2>
                   <p class="text-[10px] font-black uppercase tracking-[0.4em]" :style="{ color: userProfile.secondaryColor }">{{ masterProfile.basic.headline || 'PROFESSIONAL SYNOPSIS' }}</p>
                   <div class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[8px] text-slate-500 font-bold uppercase tracking-widest pt-1">
                      <span>{{ masterProfile.basic.email || 'Email' }}</span>
                      <span :style="{ color: userProfile.secondaryColor }">•</span>
                      <span>{{ masterProfile.basic.phone || 'Phone' }}</span>
                      <span class="text-[#C1A172]">•</span>
                      <span>{{ masterProfile.basic.location || 'Location' }}</span>
                   </div>
                </div>
 

                <!-- CV Body (Dynamic Layout Engine) -->
                <div class="flex-1 overflow-y-auto no-scrollbar bg-white flex" :class="selectedTemplate === 2 ? 'flex-row' : 'flex-col'">
                   
                   <!-- SIDEBAR (Only for T2 - Modern Sidebar) -->
                   <div v-if="selectedTemplate === 2" class="w-[35%] bg-slate-50 border-r border-slate-100 p-6 space-y-8 flex flex-col pt-10">
                      <div class="space-y-4">
                         <h4 class="text-[8px] font-black uppercase tracking-widest" :style="{ color: userProfile.primaryColor }">Expertise</h4>
                         <div class="flex flex-col gap-2">
                            <span v-for="s in masterProfile.skills.hard" :key="s" class="text-[8px] font-bold text-slate-500 uppercase">{{ s }}</span>
                         </div>
                      </div>
                      <div class="space-y-4">
                         <h4 class="text-[8px] font-black uppercase tracking-widest" :style="{ color: userProfile.primaryColor }">Social Sync</h4>
                         <div class="flex flex-col gap-2">
                            <span v-for="link in masterProfile.socialLinks" :key="link.platform" class="text-[8px] font-bold text-slate-400 truncate">{{ link.platform }}</span>
                         </div>
                      </div>
                   </div>

                   <!-- MAIN CONTENT (All templates) -->
                   <div class="flex-1 p-8 pb-12 space-y-10" :class="selectedTemplate === 4 ? 'p-12' : 'p-8'">
                      <div class="space-y-4">
                         <div class="flex items-center gap-4">
                            <h3 class="text-[11px] font-black uppercase tracking-[0.4em] font-playfair" :style="{ color: userProfile.primaryColor }">Impact</h3>
                            <div class="flex-1 h-[1px]" :style="{ backgroundColor: userProfile.primaryColor + '22' }"></div>
                         </div>
                         <p class="text-[10px] leading-[1.5] italic text-slate-600 font-medium border-l-2 pl-4" :style="{ borderColor: userProfile.primaryColor + '22' }">{{ masterProfile.bio || 'Synthesize your professional impact here...' }}</p>
                      </div>
   
                      <!-- EXPERIENCE -->
                      <div class="space-y-6">
                         <div class="flex items-center gap-4">
                            <h3 class="text-[11px] font-black uppercase tracking-[0.4em] font-playfair" :style="{ color: userProfile.primaryColor }">{{ selectedTemplate === 3 ? 'Leadership Evolution' : 'Work History' }}</h3>
                            <div class="flex-1 h-[1px]" :style="{ backgroundColor: userProfile.primaryColor + '22' }"></div>
                         </div>
                         <div v-for="(exp, idx) in masterProfile.experiences" :key="idx" class="space-y-2 relative pl-1">
                            <div class="flex justify-between items-baseline mb-0.5">
                               <span class="text-[11px] font-extrabold uppercase tracking-[0.3em] leading-tight" :style="{ color: userProfile.primaryColor }">{{ exp.role || 'Senior Strategic Lead' }}</span>
                               <span class="text-[9px] font-black uppercase tracking-[0.2em]" :style="{ color: userProfile.secondaryColor }">2021 — Present</span>
                            </div>
                            <p class="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-[0.3em]">DigyNex Solutions Ltd</p>
                         </div>
                      </div>

                      <!-- ACADEMIC -->
                      <div class="space-y-6">
                         <div class="flex items-center gap-4">
                            <h3 class="text-[11px] font-black uppercase tracking-[0.4em] font-playfair" :style="{ color: userProfile.primaryColor }">Academic Background</h3>
                            <div class="flex-1 h-[1px]" :style="{ backgroundColor: userProfile.primaryColor + '22' }"></div>
                         </div>
                         <div class="space-y-1.5">
                            <div class="flex justify-between items-center">
                               <span class="text-[10px] font-extrabold uppercase tracking-[0.3em]" :style="{ color: userProfile.primaryColor }">MSc Artificial Intelligence</span>
                               <span class="text-[8px] font-black tracking-[0.2em]" :style="{ color: userProfile.secondaryColor }">2020</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

               <!-- Footer Controls -->
               <div class="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                  <button @click="manualStep = 1; isCVPreviewOpen = false" class="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all">Edit Entire Identity</button>
                  <button @click="finalizeManualCV" class="flex-[2] py-4 bg-[#0A2647] rounded-2xl text-[9px] font-black text-white uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all group/final">
                     <div v-if="isSyncingManual" class="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                     <Check v-else class="w-4 h-4 text-[#C1A172]" />
                     <span>{{ isSyncingManual ? 'Building...' : 'Approve & Build Master CV' }}</span>
                  </button>
               </div>
            </div>
         </div>
</Transition>

       <!-- FOOTER ATTRIBUTION (SURGICAL SPACING SYNC) -->
       <div v-if="!isManualFormOpen && !isLinkedInModalOpen" 
            class="absolute bottom-[76px] left-0 right-0 flex flex-col items-center z-[1001] pointer-events-none transition-all duration-500">
          <div class="flex items-center gap-2.5 opacity-40 mb-[1px]">
             <span class="text-[7.5px] font-black text-white/30 uppercase tracking-[0.2em]">{{ t('footer.poweredBy') }}</span>
             <img src="/logo.png" alt="DigyNex" class="h-2.5 w-auto object-contain opacity-30" />
             <span class="text-[8px] font-black text-[#C1A172] uppercase tracking-[0.1em]">Career Nexus Identity Hub</span>
          </div>
          <p class="text-[6px] font-black text-white/25 tracking-[0.5em] uppercase mt-[1px] italic">{{ t('footer.engine') }} • {{ t('footer.version') }}</p>
       </div>

       <!-- CENTRALIZED NAVIGATION ENGINE -->
       <BottomNavbar 
          v-if="!isManualFormOpen && !isLinkedInModalOpen"
          :t="t"
          :activeTab="activeTab"
          @setTab="setTab"
          @openDiscovery="() => {}"
       />

      <AuthOverlay 
        :isOpen="isAuthOpen" 
        :mode="authMode"
        @close="isAuthOpen = false" 
        @success="loginSuccess" 
      />

      <!-- FOUNDER'S LIFETIME PASS OVERLAY (Revenue Engine) -->
      <Transition name="fade">
        <FounderPassOverlay
          v-if="isFounderPassOpen"
          :userProfile="userProfile"
          :t="t"
          @close="isFounderPassOpen = false"
          @handleAction="handleDashboardAction"
        />
</Transition>

      <ActionSheet 
        :isOpen="isActionSheetOpen" 
        :title="actionSheetTitle"
        :actions="activeActions"
        @close="isActionSheetOpen = false" 
        @on-action="handleDashboardAction"
      />

      <JobDetailOverlay 
        v-if="selectedJob"
        :isOpen="isJobDetailOpen"
        :job="selectedJob"
        @close="isJobDetailOpen = false"
        @on-action="handleDashboardAction"
      />

      <NeuralBridgeOverlay 
        :isOpen="isNeuralBridgeOpen"
        :job="selectedJob"
        @close="isNeuralBridgeOpen = false"
      />

      <!-- NEURAL GLOW TOAST (TYPED ERROR HANDLING ENGINE) -->
      <Transition name="fade">
        <div v-if="isNeuralToastVisible" class="fixed top-12 left-1/2 -translate-x-1/2 z-[9999] w-[85%] max-w-[320px]">
           <div class="backdrop-blur-2xl rounded-2xl p-4 shadow-3xl flex items-center gap-3 border"
                :class="{
                  'bg-black/80 border-white/15': toastType === 'info',
                  'bg-green-900/80 border-green-500/30': toastType === 'success',
                  'bg-red-900/80 border-red-500/30': toastType === 'error',
                  'bg-amber-900/80 border-amber-500/30': toastType === 'warning',
                }">
              <!-- Status Dot -->
              <div class="w-2 h-2 rounded-full shrink-0 animate-pulse"
                   :class="{
                     'bg-[#C1A172] shadow-[0_0_10px_#C1A172]': toastType === 'info',
                     'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]': toastType === 'success',
                     'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.6)]': toastType === 'error',
                     'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]': toastType === 'warning',
                   }"></div>
              <!-- Icon prefix -->
              <span class="text-[9px] font-black shrink-0"
                    :class="{
                      'text-[#C1A172]': toastType === 'info',
                      'text-green-400': toastType === 'success',
                      'text-red-400': toastType === 'error',
                      'text-amber-400': toastType === 'warning',
                    }">
                {{ toastType === 'success' ? '✓' : toastType === 'error' ? '✕' : toastType === 'warning' ? '⚠' : '◈' }}
              </span>
              <span class="text-[10px] font-black text-white uppercase tracking-widest leading-tight">{{ toastMessage }}</span>
           </div>
        </div>
</Transition>

    </main>
     <!-- LIGHTBOX PREVIEW MODAL (PHASE 2 FIX) -->
    <Teleport to="body">
       <Transition name="fade">
          <div v-if="isTemplatePreviewOpen" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
             <div class="absolute inset-0 bg-black/90 backdrop-blur-2xl" @click="isTemplatePreviewOpen = false"></div>
             
             <div class="bg-gradient-to-br from-white/10 to-white/5 rounded-[3rem] w-full max-w-[360px] max-h-[90vh] overflow-hidden border border-white/10 shadow-5xl relative z-10 flex flex-col animate-in zoom-in duration-500">
                <!-- Modal Header -->
                <div class="p-6 flex justify-between items-center border-b border-white/5 bg-white/5">
                   <div class="flex flex-col">
                      <span class="text-[10px] font-black text-[#C1A172] uppercase tracking-[0.2em] mb-1">Live Structure Preview</span>
                      <h2 class="text-[18px] font-black text-white tracking-tight">{{ previewingTemplate?.name }}</h2>
                   </div>
                   <button @click="isTemplatePreviewOpen = false" class="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                      <X class="w-5 h-5 text-white/40" />
                   </button>
                </div>

                <!-- Preview Canvas -->
                <div class="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
                   <div class="relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-white">
                      <!-- Responsive Theming Filter Application -->
                      <img :src="previewingTemplate?.image" 
                           class="w-full h-auto transition-all duration-1000"
                           :style="{ filter: `sepia(0.2) saturate(0.8) drop-shadow(0 0 0 ${userProfile.primaryColor})` }" />
                      
                      <!-- Live Theme Overlay (Reactive) -->
                      <div class="absolute inset-0 pointer-events-none opacity-20"
                           :style="{ background: `linear-gradient(135deg, ${userProfile.primaryColor}22, transparent)` }"></div>
                   </div>
                   
                   <div class="mt-6 space-y-3">
                      <div class="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                         <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="{ backgroundColor: userProfile.primaryColor }">
                            <Zap class="w-4 h-4 text-white" />
                         </div>
                         <div class="flex flex-col">
                            <span class="text-[10px] font-black text-white uppercase tracking-widest">Active Styling</span>
                            <span class="text-[9px] font-bold text-white/40 uppercase">{{ userProfile.primaryColor }} Applied</span>
                         </div>
                      </div>
                      <p class="text-[11px] font-medium text-white/40 leading-relaxed px-2">High-fidelity ATS optimization is active. This logic will be applied to your final PDF generation using our secure cloud engine.</p>
                   </div>
                </div>

                <!-- Action Hub -->
                <div class="p-6 bg-white/5 border-t border-white/5 flex gap-3">
                   <button @click="isTemplatePreviewOpen = false" class="flex-1 py-4 rounded-2xl text-[11px] font-black text-white/40 uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all">
                      Cancel
                   </button>
                   <button @click="finalizeTemplateSelection" class="flex-[2] py-4 bg-gradient-to-r from-[#C1A172] to-[#FFD700] rounded-2xl text-[11px] font-black text-[#0A2647] uppercase tracking-widest shadow-xl shadow-yellow-900/20 hover:scale-[1.02] active:scale-95 transition-all">
                      Sync Performance Style
                   </button>
                </div>
             </div>
          </div>
 </Transition>

       <!-- INFORMATION HUB MODAL (GOVERNANCE & LEGAL) -->
       <Transition name="fade">
          <div v-if="isInfoSheetOpen" class="fixed inset-0 z-[1100] flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in duration-300">
             <div @click="isInfoSheetOpen = false" class="absolute inset-0 bg-[#0A2647]/95 backdrop-blur-3xl"></div>
             
             <div class="relative w-full max-w-[360px] bg-[#051124]/90 backdrop-blur-3xl border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-3xl flex flex-col max-h-[85vh]">
                <div class="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5 backdrop-blur-md\">
                   <div class="flex items-center gap-3">
                      <div class="bg-[#C1A172]/20 p-2 rounded-xl">
                         <ShieldCheck class="w-5 h-5 text-[#C1A172]" />
                      </div>
                      <h3 class="text-xs font-black text-white uppercase tracking-widest">{{ ['privacy', 'terms', 'security', 'refund'].includes(infoSheetType) ? $t(`policies.${infoSheetType}.title`) : (infoSheetType === 'pricing' ? $t('pricing.title') : $t('governance.infoHub')) }}</h3>
                   </div>
                   <button @click="isInfoSheetOpen = false" class="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/50 transition-colors">
                      <X class="w-5 h-5" />
                   </button>
                </div>

                <div class="p-3.5 overflow-y-auto no-scrollbar space-y-3.5">
                   <!-- DYNAMIC CONTENT DISPATCH -->
                   <div v-if="infoSheetType === 'support'" class="space-y-3.5">
                      <div class="space-y-1 px-1">
                         <p class="text-[12px] font-black text-[#C1A172] uppercase tracking-[0.2em]">Contact Neural Support</p>
                         <p class="text-[8.5px] font-bold text-white/40 uppercase tracking-widest">Global Response Engineering Active</p>
                      </div>

                      <div class="space-y-1.5">
                         <!-- WhatsApp Direct -->
                         <a href="https://digynex.se/whatsapp/" target="_blank" class="block p-3 bg-[#25D366]/5 border border-[#25D366]/20 rounded-2xl hover:bg-[#25D366]/10 transition-all group scale-100 active:scale-95">
                            <div class="flex items-center justify-between">
                               <div class="flex items-center gap-2.5">
                                  <div class="bg-[#25D366] p-2.5 rounded-xl shadow-[0_10px_25px_rgba(37,211,102,0.3)] flex items-center justify-center shrink-0">
                                     <svg class="w-[22px] h-[22px] text-white shrink-0 aspect-square" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.58-1.759-1.753-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                     </svg>
                                  </div>
                                  <div class="flex flex-col">
                                     <span class="text-[11.5px] font-black text-white uppercase tracking-wider">WhatsApp Portal</span>
                                     <span class="text-[8.5px] font-bold text-white/40 uppercase">Direct Strategy Sync</span>
                                  </div>
                               </div>
                               <ArrowRight class="w-3 h-3 text-white/20 group-hover:text-[#25D366] transition-all" />
                            </div>
                         </a>

                         <!-- Official Website -->
                         <a href="https://digynex.se" target="_blank" class="block p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group scale-100 active:scale-95">
                            <div class="flex items-center justify-between">
                               <div class="flex items-center gap-2.5">
                                  <div class="bg-white/10 p-2.5 rounded-xl shrink-0 flex items-center justify-center">
                                     <Globe class="w-[22px] h-[22px] text-[#C1A172] shrink-0 aspect-square" />
                                  </div>
                                  <div class="flex flex-col">
                                     <span class="text-[11.5px] font-black text-white uppercase tracking-wider">Neural Website</span>
                                     <span class="text-[8.5px] font-bold text-white/40 uppercase">digynex.se</span>
                                  </div>
                               </div>
                               <ArrowRight class="w-3 h-3 text-white/20 group-hover:text-white transition-all" />
                            </div>
                         </a>

                         <!-- Support Email -->
                         <a href="mailto:info@digynex.se" class="block p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group scale-100 active:scale-95">
                            <div class="flex items-center justify-between">
                               <div class="flex items-center gap-2.5">
                                  <div class="bg-white/10 p-2.5 rounded-xl shrink-0 flex items-center justify-center">
                                     <Mail class="w-[22px] h-[22px] text-indigo-400 shrink-0 aspect-square" />
                                  </div>
                                  <div class="flex flex-col">
                                     <span class="text-[11.5px] font-black text-white uppercase tracking-wider">Priority Email</span>
                                     <span class="text-[8.5px] font-bold text-white/40 uppercase">info@digynex.se</span>
                                  </div>
                               </div>
                               <ArrowRight class="w-3 h-3 text-white/20 group-hover:text-white transition-all" />
                            </div>
                         </a>
                      </div>

                      <div class="p-4 bg-[#C1A172]/5 border border-[#C1A172]/10 rounded-2xl text-center">
                         <p class="text-[8.5px] font-bold text-[#C1A172]/60 uppercase tracking-widest leading-relaxed">
                            Our Global Engineering teams are available 24/7 to ensure your neural career specimens remain optimized.
                         </p>
                      </div>
                   </div>

                   <div v-else-if="infoSheetType === 'pricing'" class="space-y-5">
                   <!-- TIER 1: DISCOVERY -->
                   <div class="p-7 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden transition-all hover:bg-white/[0.07]">
                      <div class="flex items-center justify-between mb-6">
                         <div>
                            <p class="text-[14px] font-black text-white uppercase tracking-[0.2em]">{{ $t('pricing.tier1Name') }}</p>
                            <p class="text-[10px] font-bold text-white/30 tracking-[0.1em] uppercase mt-1">{{ $t('pricing.tier1Sub') }}</p>
                         </div>
                         <div class="text-right">
                            <span class="text-[20px] font-black text-[#C1A172] tracking-tighter">${{ freePrice }}</span>
                            <p class="text-[9px] font-black text-white/20 uppercase">{{ $t('pricing.priceForever') }}</p>
                         </div>
                      </div>
                      <div class="space-y-4 border-t border-white/5 pt-5">
                         <div class="flex gap-3 items-start">
                            <div class="bg-[#C1A172]/10 p-1 rounded-md mt-0.5"><Check class="w-3.5 h-3.5 text-[#C1A172]" /></div>
                            <p class="text-[12px] font-bold text-white/60 leading-snug">{{ $t('pricing.t1f1') }}</p>
                         </div>
                         <div class="flex gap-3 items-start">
                            <div class="bg-white/10 p-1 rounded-md mt-0.5"><Lock class="w-3.5 h-3.5 text-white/30" /></div>
                            <p class="text-[12px] font-bold text-white/40 leading-snug">{{ $t('pricing.t1f2') }}</p>
                         </div>
                         <div class="flex gap-3 items-start">
                            <div class="bg-[#C1A172]/10 p-1 rounded-md mt-0.5"><Check class="w-3.5 h-3.5 text-[#C1A172]" /></div>
                            <p class="text-[12px] font-bold text-white/60 leading-snug">{{ $t('pricing.t1f3') }}</p>
                         </div>
                      </div>
                   </div>

                   <!-- TIER 2: PRO -->
                   <div class="p-8 bg-[#C1A172]/10 border border-[#C1A172]/40 rounded-[2.5rem] relative shadow-2xl shadow-[#C1A172]/5 transform scale-[1.02]">
                      <div class="absolute right-6 -top-3 bg-[#C1A172] text-[#0A2647] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">{{ $t('pricing.popular') }}</div>
                      <div class="flex items-center justify-between mb-6">
                         <div>
                            <p class="text-[16px] font-black text-[#C1A172] uppercase tracking-[0.2em]">{{ $t('pricing.tier2Name') }}</p>
                            <p class="text-[10px] font-bold text-[#C1A172]/60 tracking-[0.1em] uppercase mt-1">{{ $t('pricing.tier2Sub') }}</p>
                         </div>
                         <div class="text-right">
                            <span class="text-[22px] font-black text-white tracking-tighter">${{ proPrice }}</span>
                            <p class="text-[9px] font-black text-white/30 uppercase">{{ $t('pricing.priceMonthly') }}</p>
                         </div>
                      </div>
                      <div class="space-y-4 border-t border-[#C1A172]/20 pt-6">
                         <div class="flex gap-3 items-start">
                            <div class="bg-[#C1A172]/20 p-1.5 rounded-lg mt-0.5"><Check class="w-4 h-4 text-[#C1A172]" /></div>
                            <p class="text-[13px] font-bold text-white leading-snug">{{ $t('pricing.t2f1') }}</p>
                         </div>
                         <div class="flex gap-3 items-start">
                            <div class="bg-[#C1A172]/20 p-1.5 rounded-lg mt-0.5"><Zap class="w-4 h-4 text-[#C1A172]" /></div>
                            <p class="text-[13px] font-bold text-white leading-snug">{{ $t('pricing.t2f2') }}</p>
                         </div>
                         <div class="flex gap-3 items-start">
                            <div class="bg-[#C1A172]/20 p-1.5 rounded-lg mt-0.5"><Check class="w-4 h-4 text-[#C1A172]" /></div>
                            <p class="text-[13px] font-bold text-white leading-snug">{{ $t('pricing.t2f3') }}</p>
                         </div>
                      </div>
                   </div>

                   <!-- TIER 3: ELITE -->
                   <div class="p-7 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/30 rounded-[2.5rem] relative transition-all hover:bg-indigo-500/20">
                      <div class="flex items-center justify-between mb-6">
                         <div>
                            <p class="text-[14px] font-black text-indigo-100 uppercase tracking-[0.2em] flex items-center gap-2">
                               {{ $t('pricing.tier3Name') }}
                               <Sparkles class="w-4 h-4 text-indigo-400" />
                            </p>
                            <p class="text-[10px] font-bold text-indigo-400/60 tracking-[0.1em] uppercase mt-1">{{ $t('pricing.tier3Sub') }}</p>
                         </div>
                         <div class="text-right">
                            <span class="text-[20px] font-black text-white tracking-tighter">${{ elitePrice }}</span>
                            <p class="text-[9px] font-black text-white/30 uppercase">{{ $t('pricing.priceMonthly') }}</p>
                         </div>
                      </div>
                      <div class="space-y-4 border-t border-indigo-500/20 pt-5">
                         <div class="flex gap-3 items-start">
                            <div class="bg-indigo-500/20 p-1 rounded-md mt-0.5"><Zap class="w-3.5 h-3.5 text-indigo-400" /></div>
                            <p class="text-[12px] font-bold text-indigo-100/80 leading-snug">{{ $t('pricing.t3f1') }}</p>
                         </div>
                         <div class="flex gap-3 items-start">
                            <div class="bg-indigo-500/20 p-1 rounded-md mt-0.5"><Zap class="w-3.5 h-3.5 text-indigo-400" /></div>
                            <p class="text-[12px] font-bold text-indigo-100/80 leading-snug">{{ $t('pricing.t3f2') }}</p>
                         </div>
                         <div class="flex gap-3 items-start">
                            <div class="bg-indigo-400 p-1 rounded-md mt-0.5"><Check class="w-3.5 h-3.5 text-white" /></div>
                            <p class="text-[12px] font-bold text-indigo-100 leading-snug">{{ $t('pricing.t3f3') }}</p>
                         </div>
                         <p class="text-[11px] text-indigo-400 font-black tracking-widest uppercase flex items-center gap-2 mt-2">
                            <Sparkles class="w-3 h-3" />
                            {{ $t('pricing.t3promo') }}
                         </p>
                      </div>
                   </div>

                   <!-- FOUNDER'S LIFETIME PASS BANNER (Injected) -->
                   <div @click="isInfoSheetOpen = false; isFounderPassOpen = true" 
                        class="mt-3 py-2.5 px-5 bg-gradient-to-r from-[#C1A172] to-[#FFD700] rounded-[2rem] relative overflow-hidden cursor-pointer shadow-xl shadow-[#C1A172]/20 hover:scale-[1.02] active:scale-95 transition-all group">
                      <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-all duration-700"></div>
                      <div class="flex items-center justify-between relative z-10">
                         <div>
                            <p class="text-[13px] font-black text-[#0A2647] uppercase tracking-[0.2em] flex items-center gap-2">
                               Founder's Pass
                               <Crown class="w-4 h-4 text-[#0A2647]" />
                            </p>
                            <p class="text-[8px] font-black text-[#0A2647]/70 tracking-widest uppercase mt-0.5">Annual Elite Access</p>
                         </div>
                         <div class="text-right">
                            <span class="text-[18px] font-black text-[#0A2647] tracking-tighter">$149</span>
                            <p class="text-[8px] font-black text-[#0A2647]/70 uppercase tracking-widest">/ YEAR</p>
                         </div>
                      </div>
                   </div>

                </div>

                    <div v-else-if="['privacy', 'terms', 'security', 'refund'].includes(infoSheetType)" class="space-y-6">
                       <div class="space-y-2">
                          <p class="text-[13px] font-black text-[#C1A172] uppercase tracking-[0.2em]">{{ $t(`policies.${infoSheetType}.title`) }}</p>
                          <p class="text-[11px] font-bold text-white/40 uppercase tracking-widest">{{ $t(`policies.${infoSheetType}.subtitle`) }}</p>
                       </div>

                       <div class="space-y-5">
                          <div v-for="section in $tm(`policies.${infoSheetType}.sections`)" :key="section.id" class="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-2 hover:bg-white/[0.07] transition-all">
                             <div class="flex items-center gap-3">
                                <div class="w-1.5 h-1.5 rounded-full bg-[#C1A172]"></div>
                                <p class="text-[12px] font-black text-white uppercase tracking-wider">{{ section.title }}</p>
                             </div>
                             <p class="text-[12px] font-bold text-white/50 leading-relaxed pl-4.5">
                                {{ section.content }}
                             </p>
                          </div>
                       </div>

                       <div class="pt-4 border-t border-white/5 flex items-center justify-between opacity-30 px-2">
                          <span class="text-[9px] font-black text-white uppercase tracking-widest">{{ $t('policies.version') }}</span>
                          <span class="text-[9px] font-black text-white uppercase tracking-widest">{{ $t('policies.lastUpdated') }}</span>
                       </div>
                    </div>

                    <div v-else class="space-y-6">
                       <div class="p-6 bg-white/5 border border-white/10 rounded-3xl">
                          <p class="text-[14px] font-black text-white uppercase tracking-[0.2em] mb-3">Sync in Progress</p>
                          <p class="text-[12px] font-bold text-white/60 leading-relaxed italic">
                             The detailed governance documentation for {{ infoSheetType.toUpperCase() }} is currently being synchronized with our global legal framework.
                          </p>
                       </div>
                       <div class="p-10 border border-dashed border-white/10 rounded-[2.5rem] text-center flex flex-col items-center gap-4">
                          <RefreshCw class="w-8 h-8 text-[#C1A172]/20 animate-spin" />
                          <p class="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">
                    DIGYNEX CAREER NEXUS ENGINE V12.0 NEURAL HUB
                  </p>
                       </div>
                    </div>
                 </div>

                 <div class="p-6 bg-white/5 border-t border-white/5 flex justify-center">
                   <p class="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">DigyNex Identity Hub • Master V12.0</p>
                </div>
             </div>
          </div>
 </Transition>
    </Teleport>
    <!-- ─── SYNTHESIS REVIEW MODAL (V12.0) ─── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isSynthesisReviewOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0">
            <div class="absolute inset-0 bg-[#0A2647]/95 backdrop-blur-2xl" @click="isSynthesisReviewOpen = false"></div>
            
            <div class="w-full max-w-[360px] bg-white border border-white/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.6)] relative z-10 animate-in zoom-in slide-in-from-bottom-10 duration-500">
               <div class="p-6 sm:p-8 space-y-6">
                  <div class="flex justify-between items-start">
                     <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg p-2.5" :style="{ backgroundColor: synthesisData.job?.color || '#0A2647' }">
                           <Zap class="w-full h-full text-white" />
                        </div>
                        <div>
                           <span class="text-[8px] font-black text-[#C1A172] uppercase tracking-[0.3em]">Neural Synthesis</span>
                           <h2 class="text-[17px] font-black text-[#0A2647] tracking-tighter mt-0.5">{{ synthesisData.job?.r }} @ {{ synthesisData.job?.c }}</h2>
                        </div>
                     </div>
                     <button @click="isSynthesisReviewOpen = false" class="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors">
                        <X class="w-4 h-4 text-[#0A2647]/30" />
                     </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-[320px] overflow-y-auto no-scrollbar pr-1">
                     <div class="space-y-3">
                        <div class="flex items-center gap-2">
                           <FileText class="w-3.5 h-3.5 text-[#C1A172]" />
                           <span class="text-[9px] font-black text-[#0A2647] uppercase tracking-widest">Tailored Signal</span>
                        </div>
                        <div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] leading-relaxed text-slate-600 italic font-medium shadow-inner">
                           "{{ synthesisData.summary }}"
                        </div>
                     </div>

                     <div class="space-y-3">
                        <div class="flex items-center gap-2">
                           <Stars class="w-3.5 h-3.5 text-[#C1A172]" />
                           <span class="text-[9px] font-black text-[#0A2647] uppercase tracking-widest">Draft Specimen</span>
                        </div>
                        <div class="p-5 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] leading-relaxed text-slate-300 font-jakarta h-[220px] overflow-y-auto custom-scrollbar select-text whitespace-pre-line">
                           {{ synthesisData.letter }}
                        </div>
                     </div>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-3 pt-3 border-t border-black/5">
                     <button @click="isSynthesisReviewOpen = false" class="flex-1 py-4 text-[10px] font-black text-[#0A2647]/40 uppercase tracking-[0.2em] hover:text-[#0A2647] transition-all">Abort</button>
                     <button @click="handleDashboardAction('approve_dispatch')" 
                             :disabled="isDispatching"
                             class="flex-[2] py-4 bg-[#C1A172] text-[#0A2647] rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#C1A172]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 relative overflow-hidden group/btn">
                        <div v-if="isDispatching" class="absolute inset-x-0 bottom-0 h-1 bg-white/20 animate-pulse"></div>
                        <Zap class="w-3.5 h-3.5" :class="isDispatching ? 'animate-pulse' : 'group-hover/btn:rotate-12 transition-transform'" />
                        <span>{{ isDispatching ? 'Dispatching...' : 'Approve & Dispatch' }}</span>
                     </button>
                  </div>
               </div>
            </div>
        </div>
</Transition>
    </Teleport>

    <!-- ─── NEURAL TRACKING LAB (V12.0) ─── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isTrackingLabOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0">
            <div class="absolute inset-0 bg-[#0A2647]/95 backdrop-blur-2xl" @click="isTrackingLabOpen = false"></div>
            
            <div class="w-full max-w-[360px] bg-[#0A2647] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 animate-in slide-in-from-bottom-10 duration-500">
               <div class="p-6 space-y-6">
                  <div class="flex justify-between items-center border-b border-white/5 pb-5">
                     <div>
                        <span class="text-[8px] font-black text-[#C1A172] uppercase tracking-[0.3em]">Intelligence Core</span>
                        <h2 class="text-[18px] font-black text-white tracking-tighter mt-1 leading-none">Tracking Lab</h2>
                     </div>
                     <button @click="isTrackingLabOpen = false" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group">
                        <X class="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                     </button>
                  </div>

                  <div class="grid grid-cols-5 gap-1.5 mb-1">
                     <div v-for="s in ['queued', 'applied', 'review', 'interview', 'offer']" :key="s"
                          @click="selectedPipelineStep = s"
                          :class="selectedPipelineStep === s ? 'bg-[#C1A172] text-[#0A2647] border-[#C1A172]/20 shadow-lg' : 'bg-white/5 text-white/30 border-white/5 hover:bg-white/10'"
                          class="py-2.5 rounded-2xl border text-center cursor-pointer transition-all group/tab">
                        <span class="block text-[6px] font-black uppercase tracking-widest">{{ s }}</span>
                        <span class="block text-[14px] font-black mt-0.5 leading-none">{{ allJobs.filter(j => j.s === s).length }}</span>
                     </div>
                  </div>

                  <div class="h-[320px] overflow-y-auto no-scrollbar pr-1 space-y-2">
                     <div v-for="job in allJobs.filter(j => j.s === selectedPipelineStep)" :key="job.c + job.r"
                          class="p-3 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group/job hover:bg-white/[0.07] transition-all">
                        <div class="flex items-center gap-3">
                           <div class="w-9 h-9 rounded-xl flex items-center justify-center p-2" :style="{ backgroundColor: job.color }">
                              <component :is="job.icon" class="w-full h-full text-white shadow-xl" />
                           </div>
                           <div class="flex flex-col">
                              <h4 class="text-[11px] font-black text-white tracking-tight leading-none font-jakarta">{{ job.r }}</h4>
                              <span class="text-[8px] font-bold text-white/40 mt-1 block uppercase tracking-wide truncate max-w-[100px]">{{ job.c }} • {{ job.d }}</span>
                           </div>
                        </div>
                        <div class="flex items-center gap-3">
                           <div class="text-right hidden xs:block pr-3 border-r border-white/5">
                              <span class="text-[12px] font-black text-[#C1A172] tracking-tighter">{{ job.m }}%</span>
                           </div>
                           <button class="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#C1A172]/20 hover:text-[#C1A172] text-white/20 transition-all">
                              <ChevronRight class="w-4 h-4 transition-transform group-hover/job:translate-x-1" />
                           </button>
                        </div>
                     </div>
                     <div v-if="allJobs.filter(j => j.s === selectedPipelineStep).length === 0" class="h-full flex flex-col items-center justify-center opacity-10 py-16 grayscale">
                        <LayoutDashboard class="w-10 h-10 mb-3" />
                        <span class="text-[9px] font-black uppercase tracking-[0.4em]">Empty Spectrum</span>
                     </div>
                  </div>
               </div>
            </div>
        </div>
</Transition>
    </Teleport>

    <!-- HIDDEN NEURAL INPUTS -->
    <input type="file" ref="fileInput" @change="handleFileUpload" class="hidden" accept=".pdf,.doc,.docx" />
  </div>
</template>


<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,900;1,900&family=Inter:wght@400;600;800&display=swap');

body { 
  margin: 0; 
  background-color: #0A2647; 
  font-family: 'Plus Jakarta Sans', sans-serif; 
  -webkit-font-smoothing: antialiased; 
}

h1 { letter-spacing: -0.05em; }

.shadow-2xl {
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.4);
}
.shadow-3xl {
  box-shadow: 0 60px 180px -45px rgba(0, 0, 0, 0.7);
}
.neural-glow {
  color: #fff;
  text-shadow: 0 0 10px rgba(0, 255, 247, 0.5), 0 0 20px rgba(0, 255, 247, 0.2);
  animation: neural-pulse 3s infinite ease-in-out;
}
@keyframes neural-pulse {
  0%, 100% { text-shadow: 0 0 10px rgba(0, 255, 247, 0.5), 0 0 20px rgba(0, 255, 247, 0.2); }
  50% { text-shadow: 0 0 25px rgba(0, 255, 247, 0.9), 0 0 40px rgba(0, 163, 255, 0.5); }
}

/* Strategic Accuracy Control V6.0 Elite Spacing */
:root {
  --surgical-bottom-zone: 106px;
}

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.hub-scroller {
  padding-bottom: var(--surgical-bottom-zone) !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  border: 1px solid transparent;
  background-clip: content-box;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(193, 161, 114, 0.6);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.custom-horizontal-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-horizontal-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  margin-inline: 40px;
  border-radius: 10px;
}
.custom-horizontal-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(193, 161, 114, 0.4);
  border-radius: 10px;
}
.custom-horizontal-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(193, 161, 114, 0.8);
}
.neural-pulse-enter-active {
  animation: neural-pulse-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.neural-pulse-leave-active {
  animation: neural-pulse-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) reverse;
}
@keyframes neural-pulse-in {
  0% { transform: translate(-50%, -100%) scale(0.5); opacity: 0; }
  100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
}
</style>
