<script setup>
import { 
  Plus, MoreHorizontal, ArrowRight, X, ChevronDown, Globe, 
  Sparkles, FileText, LayoutDashboard, Briefcase, Zap, 
  Linkedin, User, Search, SlidersHorizontal, UserPlus, 
  Check, Maximize2, Lock, Bell, RefreshCw, ShieldCheck,
  Cloud, Star, Stars, Mic, DownloadCloud, BarChart3, Bookmark, Share2, EyeOff, AlertTriangle, Mail
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

const loadMoreApplications = async () => {
    isRecalibrating.value = true;
    await new Promise(r => setTimeout(r, 1200));
    visibleAppsCount.value += 4;
    isRecalibrating.value = false;
}

const allJobs = ref([
  {c: 'TechCorp', r: 'Senior Scientist', s: 'applied', m: 80, d: '14/03/24', l: 'Stockholm, SE', icon: Briefcase, color: '#0A2647', desc: 'Lead our AI discovery division at high-scale.', step: 'applied', applyType: 'auto'}, 
  {c: 'Innovate', r: 'Product Manager', s: 'review', m: 50, d: '23/03/24', l: 'Berlin, DE', icon: LayoutDashboard, color: '#73BBA3', desc: 'Directing the next-gen SaaS product roadmap.', step: 'review', applyType: 'manual'}, 
  {c: 'Techwork', r: 'Lead ML Engineer', s: 'interview', m: 60, d: '22/03/24', l: 'Oslo, NO', icon: Zap, color: '#6366F1', desc: 'Neural engineering and cloud-native optimization.', step: 'interview', applyType: 'auto'},
  {c: 'Spotify', r: 'Full Stack Dev', s: 'offer', m: 92, d: '25/03/24', l: 'Stockholm, SE', icon: Star, color: '#1DB954', desc: 'Scaling global audio intelligence.', step: 'offer', applyType: 'auto'},
  {c: 'Google', r: 'AI Architect', s: 'applied', m: 88, d: '10/03/24', l: 'Zurich, CH', icon: Zap, color: '#4285F4', desc: 'Next-gen LLM optimization.', step: 'applied', applyType: 'manual'},
  {c: 'Tesla', r: 'Autopilot Eng', s: 'interview', m: 75, d: '18/03/24', l: 'Oslo, NO', icon: Zap, color: '#E81C23', desc: 'Real-time vision systems.', step: 'interview', applyType: 'auto'},
  {c: 'Amazon', r: 'Cloud Lead', s: 'review', m: 82, d: '20/03/24', l: 'Madrid, ES', icon: Cloud, color: '#FF9900', desc: 'Scaling AWS core infrastructure.', step: 'applied', applyType: 'manual'}
])

const matches = ref([
  { id: 'm1', c: 'NVIDIA', r: 'AI Research Scientist', l: 'Stockholm, SE', m: 99, icon: Zap, color: '#76B900', t: '2 hr', desc: 'Accelerating AI computing and hardware integration.', applyType: 'auto' },
  { id: 'm2', c: 'Google', r: 'Senior AI Engineer', l: 'Zurich, CH', m: 98, icon: Zap, color: '#4285F4', t: '5 hr', desc: 'Developing next-gen cloud AI models and LLM scaling.', applyType: 'auto' },
  { id: 'm3', c: 'Meta', r: 'Product Manager', l: 'Berlin, DE', m: 95, icon: LayoutDashboard, color: '#0668E1', t: '8 hr', desc: 'Directing the roadmap for social AI interaction.', applyType: 'manual' },
  { id: 'm4', c: 'Netflix', r: 'Distributed Systems Eng', l: 'Amsterdam, NL', m: 92, icon: Briefcase, color: '#E50914', t: '1 d', desc: 'Architecting ultra-scale low latency content delivery.', applyType: 'auto' },
  { id: 'm5', c: 'Spotify', r: 'Data Scientist', l: 'Stockholm, SE', m: 94, icon: Zap, color: '#1DB954', t: '4 hr', applyType: 'auto' },
  { id: 'm6', c: 'Zalando', r: 'Backend Eng', l: 'Berlin, DE', m: 88, icon: LayoutDashboard, color: '#FF6900', t: '2 d', applyType: 'manual' },
  { id: 'm7', c: 'Equinor', r: 'Energy Analyst', l: 'Oslo, NO', m: 85, icon: Briefcase, color: '#FF1243', t: '3 d', applyType: 'manual' }
])

// --- SYNTHESIS & TRACKING (V12.0 ENGINE) ---
const isSynthesisReviewOpen = ref(false)
const isManualToolkitOpen = ref(false);
const isTemplatePreviewOpen = ref(false);
const previewingTemplate = ref(null);
const isTrackingLabOpen = ref(false)
const isDispatching = ref(false)
const synthesisData = ref({ job: null, letter: '', summary: '' })

const handleDownloadPdf = async () => {
    try {
        const viewport = document.querySelector('#live-viewport iframe');
        if (!viewport || !viewport.srcdoc) {
            toastMessage.value = 'Error: Viewport not ready';
            isNeuralToastVisible.value = true;
            return;
        }
        
        toastMessage.value = 'Preparing Ultra-HD Specimen...';
        isNeuralToastVisible.value = true;
        
        await pdfService.generateFromHtml(viewport.srcdoc, `DigyNex_${userProfile.value.name.replace(/\s/g, '_')}_Specimen.pdf`, {
            userName: userProfile.value.name,
            tier: userProfile.value.plan_type || 0,
            primaryColor: userProfile.value.primaryColor
        });
        
        // n8n Signal: Log export activity
        if (isAuthenticated.value && userProfile.value.email) {
            await profileService.logActivity(userProfile.value.email, 'CV_EXPORT', { method: 'specimen_viewport' });
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
    
    // 1. Country Filter Logic
    if (activeCountry.value) {
        const countryCodeMap = {
            'Sweden': 'SE',
            'Germany': 'DE',
            'Norway': 'NO',
            'Finland': 'FI',
            'Denmark': 'DK'
        };
        const code = countryCodeMap[activeCountry.value];
        if (code) {
            result = result.filter(m => m.l.includes(code));
        }
    }
    
    // 2. Search Query Logic
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(m => m.c.toLowerCase().includes(q) || m.r.toLowerCase().includes(q));
    }
    
    // NEURAL RANKING: Sort by highest match percentage (Premium Discovery)
    return [...result].sort((a, b) => (b.m || 0) - (a.m || 0));
})

const getStepCount = (step) => {
    return allJobs.value.filter(j => j.step === step).length
}

const showCountrySelector = ref(false)
const countrySearch = ref('')
const selectedCountriesArr = ref(['Sweden', 'Germany', 'Norway', 'Finland', 'Denmark'])
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
const activeFocusSlots = ref({ used: 3, total: 10 })

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

// --- NEURAL BRIDGE: Language-Country Synergy ---
watch(locale, (newLocale) => {
    const localeToCountryMap = {
        'SW': 'Sweden',
        'DE': 'Germany',
        'NO': 'Norway',
        'FI': 'Finland',
        'DA': 'Denmark'
    }
    const suggestedCountry = localeToCountryMap[newLocale]
    if (suggestedCountry && activeCountry.value !== suggestedCountry) {
        // Automatically suggest/switch country slot based on language choice
        activeCountry.value = suggestedCountry
        toastMessage.value = `Focusing on ${suggestedCountry} matches`
        isNeuralToastVisible.value = true
        setTimeout(() => isNeuralToastVisible.value = false, 2000)
    }
})

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
const uploadedFileName = ref('Amila_Senior_CV.pdf')

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return;
  
  isUploadingCV.value = true;
  toastMessage.value = `DigyNex AI: Extracting Intelligence from ${file.name}...`;
  isNeuralToastVisible.value = true;
  
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
       }
       
       uploadedFileName.value = file.name;
       toastMessage.value = 'Neural Extraction Complete: Profile Hydrated';
       
       // KINETIC SYNC: Auto-save to database
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
    // NEURAL SIGNAL: Trigger n8n LinkedIn Scraper (Workflow JAAAAS)
    await profileService.logActivity(userProfile.value.email, 'LINKEDIN_SYNC_REQUESTED', {
        url: linkedInUrlInput.value,
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
const isCVPreviewOpen = ref(false)
const cvTemplates = ref([])
const viewportHtml = ref('')
const viewMode = ref('elite')

const fetchSystemConfig = async () => {
    try {
        const { data, error } = await supabase.from('system_config').select('*').single();
        if (!error && data) {
            isMaintenanceMode.value = data.maintenance_mode;
            maintenanceMessage.value = data.maintenance_message;
            if (data.pro_price) proPrice.value = data.pro_price;
            if (data.elite_price) elitePrice.value = data.elite_price;
        }
    } catch (err) {
        console.error('[CAREERNEXUS ENGINE] System Config Pulse Failure:', err);
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
  // Non-blocking Parallel Ingestion (V15.1)
  fetchSystemConfig();
  fetchTemplates();
  
  // Real-time Neural Sync (V12.0)
  supabase
    .channel('system_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'system_config' }, (payload) => {
        console.log('[DIGYNEX] Neural Sync Ripple Detected');
        fetchSystemConfig();
    })
    .subscribe();

  // 2. Initialize user session and profile with Real-time Sync
  authService.onAuthStateChange((event, session) => {
    console.log(`[DIGYNEX AUTH] Event: ${event}`);
    if (session) {
      isAuthenticated.value = true;
      fetchUserProfile();
    } else {
      isAuthenticated.value = false;
      // Reset sensitive states on logout if needed
    }
  });

  const session = await authService.getSession();
  if (session) {
    await fetchUserProfile();
  }

  // 3. Neural Ingestion: Fetch real-time matches from Engine
  const discoveredJobs = await jobService.getDiscoveryJobs();
  if (discoveredJobs && discoveredJobs.length > 0) {
     matches.value = discoveredJobs.map(j => ({
        id: j.id,
        c: j.company,
        r: j.role,
        l: j.location,
        m: j.match_score,
        t: j.posted_at,
        color: j.hex_color || '#0A2647',
        icon: Zap // Defaulting to Zap for high-intent matches
     }));
  }
  
  document.addEventListener('click', handleClickOutside)
})

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

const onManualFinalize = () => {
   isManualFormOpen.value = false;
   activeTab.value = 'profile';
   // Synchronize the master profile name with the global user display name
   if (masterProfile.value.basic.fullName) {
      userProfile.value.name = masterProfile.value.basic.fullName;
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
    if (userProfile.value.docStatus !== 'Verified') {
        toastMessage.value = 'Neural Sync: CV/Letter Approval requested via WhatsApp & Telegram';
        isNeuralToastVisible.value = true;
        
        // Signal N8N Trigger: Workflow D (Include Job Metadata)
        await profileService.logActivity(userProfile.value.email, 'DOC_APPROVAL_PENDING', { 
            company: job.c, 
            role: job.r,
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
                plan_type: planString, // STRATEGIC: Unified string format
                primaryColor: profile.primary_color || '#0A2647',
                secondaryColor: profile.secondary_color || '#64748b',
                languagePreference: profile.language_preference || 'EN',
                isSuperUser: profile.is_admin || false, // RE-ENGAGED: Real-time role check
                isReturning: true, // ENGINE: Mark as returning user
                docStatus: profile.doc_status || 'Draft' // GUARDRAIL: Document Verification State
            };
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

onMounted(async () => {
    // Phase 1 Backend Quota Sync (Centralized Engine)
    await quotaService.init();
    
    // UI Pricing Sync
    const syncPrices = () => {
        freePrice.value = quotaService.TIERS[0].price;
        proPrice.value = quotaService.TIERS[1].price;
        elitePrice.value = quotaService.TIERS[2].price;
    };
    
    syncPrices();
    
    // Listen for live config pushes from AdminHub via QuotaEngine
    window.addEventListener('quota-prices-updated', syncPrices);
    
    // Global System State Monitoring
    const { data: configs } = await supabase.from('system_config').select('*');
    if (configs) {
        const m = configs.find(c => c.key === 'maintenance_mode')?.value;
        if (m) { isMaintenanceMode.value = m.enabled; maintenanceMessage.value = m.message; }
        
        const b = configs.find(c => c.key === 'global_broadcast')?.value;
        if (b) globalBroadcast.value = b;
    }
    
    // 3. UNIVERSAL STRATEGIC SYNC (Real-time Governance)
    supabase.channel('global_config_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'system_config' }, (payload) => {
            console.log('[NEURAL SYNC] Global Config Pulsed:', payload.new.key);
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
    
    // Check for existing session natively
    const user = await authService.getUser();
    if (user) {
        await fetchUserProfile();
    }
});

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

const countriesContainer = ref(null)
const sliderProgress = ref(0)

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

    if (actionId === 'recalibrate') {
        // SIGNAL: Trigger n8n Workflow B (Neural Optimization)
        try {
            await profileService.logActivity(userProfile.value.email, 'NEURAL_RECALIBRATE', {
                active_tab: activeTab.value,
                timestamp: new Date().toISOString()
            });
            
            await new Promise(r => setTimeout(r, 2500));
            toastMessage.value = 'Sync Complete: Profile Optimized';
        } finally {
            isRecalibrating.value = false;
            setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
        }
        return;
    }

    if (actionId === 'broadcast') {
        toastMessage.value = 'Preparing executive notification broadcast...';
        isNeuralToastVisible.value = true;
        
        // BRIDGE: Trigger n8n Workflow A (Global Broadcast)
        await profileService.logActivity(userProfile.value.email, 'ADMIN_BROADCAST', { 
            timestamp: new Date().toISOString(),
            message: 'Global Neural System Upgrade Initiated.' 
        });
        
        setTimeout(() => { isNeuralToastVisible.value = false }, 4000);
        return;
    }

    if (actionId === 'quick_apply') {
        const targetJob = jobData || selectedJob.value;
        if (!targetJob) return;

        // --- UNIFIED QUOTA ENGINE (V11.5) ---
        const quota = await quotaService.canPerformAction(userProfile.value, 'QUICK_APPLY');

        if (!quota.can) {
           toastMessage.value = `Quota Reached: ${quota.reason.replace('_', ' ')}. Queued.`;
           isNeuralToastVisible.value = true;
           
           allJobs.value.unshift({
               c: targetJob.c,
               r: targetJob.r,
               s: 'queued',
               m: targetJob.m,
               d: new Date().toLocaleDateString(),
               l: targetJob.l,
               icon: Briefcase,
               color: targetJob.color,
               step: 'queued'
           });

           await profileService.logActivity(userProfile.value.email, 'JOB_QUEUED', { job: targetJob.c, reason: quota.reason });
           setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
           return;
        }

        // WITHIN QUOTA: Instant Dispatch
        const today = new Date().toLocaleDateString();
        toastMessage.value = `Neural Pulse: Dispatching to ${targetJob.c}...`;
        isNeuralToastVisible.value = true;
        
        allJobs.value.unshift({
            c: targetJob.c,
            r: targetJob.r,
            s: 'applied',
            m: targetJob.m,
            d: today,
            l: targetJob.l,
            icon: Briefcase,
            color: targetJob.color,
            step: 'applied'
        });

        await profileService.logActivity(userProfile.value.email, 'QUICK_APPLY', { job: targetJob.c });
        setTimeout(() => { isNeuralToastVisible.value = false }, 2500);
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
        toastMessage.value = `Manual Assist: Preparing assets for ${targetJob.c}...`;
        isNeuralToastVisible.value = true;
        
        // n8n Signal: Log manual application intent
        await profileService.logActivity(userProfile.value.email, 'MANUAL_ASSIST_START', { job: targetJob.c });
        
        setTimeout(() => {
            toastMessage.value = 'Tailored CV & Cover Letter Ready for Download';
            isCVPreviewOpen.value = true; // Show the preview overlay so they can export
        }, 2000);
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
            
            await profileService.logActivity(userProfile.value.email, 'STRATEGY_AUDIT_REQUESTED', {
                timestamp: new Date().toISOString()
            });
            
            toastMessage.value = 'Audit Active: Professional Strategy Dispatched';
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
            await profileService.logActivity(userProfile.value.email, 'JOB_QUEUED', { job: targetJob.c, reason: quota.reason });
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
    if (actionId === 'manual_toolkit') {
        const job = data;
        if (!job) return;

        // 1. Quota Check
        const quota = await quotaService.canPerformAction(userProfile.value, 'CV_EXPORT');
        if (!quota.can) {
            toastMessage.value = `Quota Reached: ${quota.reason.replace('_', ' ')}`;
            isNeuralToastVisible.value = true;
            setTimeout(() => { isNeuralToastVisible.value = false }, 3000);
            return;
        }

        // 2. Synthesis (Neural Tailoring)
        toastMessage.value = 'Neural Hub: Synthesizing Toolkit Specimens...';
        isNeuralToastVisible.value = true;
        
        const tailoredLetter = profileService.generateCoverLetter({
           name: userProfile.value.name,
           resume_data: masterProfile.value,
           secret_keywords: masterProfile.value.secretKeywords,
           job: job
        });

        synthesisData.value = {
            job: job,
            letter: tailoredLetter,
            summary: `Expert results-driven candidate with deep expertise in ${job.r} and strategic alignment with ${job.c}.`
        };

        // 3. Log Signal (Engine Phase)
        await profileService.submitManualAssistSignal(userProfile.value, job);
        
        await new Promise(r => setTimeout(r, 2000));
        
        // 4. Open UI (Face Phase)
        isManualToolkitOpen.value = true;
        isNeuralToastVisible.value = false;
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
       <div class="bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-3xl max-w-md w-full animate-in zoom-in-95 duration-700">
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
          :t="t"
          :filteredMatches="filteredMatches"
          :selectedCountriesArr="selectedCountriesArr"
          :activeFocusSlots="activeFocusSlots"
          @openJobDetail="openJobDetail"
          @handleAction="handleDashboardAction"
          @openCountrySelector="handleDashboardAction('openCountrySelector')"
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
      <!-- GDPR-COMPLAINT CV PREVIEW MODAL -->
      <Transition name="fade">
         <div v-if="isCVModalOpen" class="fixed inset-0 z-[1000] flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in duration-300">
            <!-- BACKDROP -->
            <div @click="isCVModalOpen = false" class="absolute inset-0 bg-[#0A2647]/90 backdrop-blur-2xl"></div>
            
            <!-- MODAL CARD -->
            <div class="relative w-full max-w-md bg-[#051124] border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-3xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[85vh]">
                <div class="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5">
                   <div class="flex items-center gap-3">
                      <div class="bg-[#2C74B3]/20 p-2 rounded-xl">
                         <FileText class="w-5 h-5 text-[#2C74B3]" />
                      </div>
                      <div class="flex flex-col">
                         <h3 class="text-xs font-black text-white/90 uppercase tracking-widest">{{ viewMode === 'elite' ? 'Elite Neural Specimen' : 'Legacy CV Data' }}</h3>
                         <p class="text-[9px] font-bold text-[#C1A172] uppercase tracking-[0.2em] mt-0.5 italic">Amila_Senior_CV.pdf ({{ viewMode.toUpperCase() }})</p>
                      </div>
                   </div>
                   <div class="flex items-center gap-2">
                       <!-- NEURAL COMPARISON TRIGGER -->
                       <button @mousedown="viewMode = 'legacy'"
                               @mouseup="viewMode = 'elite'"
                               @mouseleave="viewMode = 'elite'"
                               @touchstart.prevent="viewMode = 'legacy'"
                               @touchend.prevent="viewMode = 'elite'"
                               class="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all select-none group/compare active:scale-95">
                          <Eye class="w-3.5 h-3.5 text-white/60 group-hover/compare:text-[#C1A172]" />
                          <span class="text-[8px] font-black text-white/40 uppercase tracking-widest">Hold to Compare</span>
                       </button>
                       <button @click="isCVModalOpen = false" class="p-2.5 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400 text-white/50 transition-colors">
                          <X class="w-4 h-4" />
                       </button>
                   </div>
                </div>
 
                <div class="p-4 flex-1 overflow-y-auto no-scrollbar relative w-full bg-white flex flex-col items-center min-h-[500px]">
                   <!-- REAL NEURAL VIEWPORT ENGINE (THE WINNER) -->
                   <div v-if="viewportHtml && viewMode === 'elite'" 
                        v-html="viewportHtml" 
                        class="w-full shadow-2xl origin-top animate-in zoom-in-95 duration-500"
                        style="transform: scale(0.85); margin-bottom: -150px; min-height: 1000px;">
                   </div>
                   
                   <!-- LEGACY CORE (THE PSYCHOLOGICAL LOSER) -->
                   <div v-else-if="viewMode === 'legacy'" class="w-full h-full p-8 font-serif text-gray-800 animate-in fade-in duration-300">
                      <div class="text-center mb-8">
                         <h1 class="text-2xl font-bold border-b border-gray-300 pb-2">{{ masterProfile.basic.fullName || 'User Name' }}</h1>
                         <p class="text-xs text-gray-500 mt-1">{{ masterProfile.basic.email }} | {{ masterProfile.basic.phone }}</p>
                      </div>
                      <div class="space-y-6">
                         <div class="border-b border-gray-200 pb-1 font-bold text-sm uppercase">Experience</div>
                         <div v-for="exp in masterProfile.experiences" :key="exp.company" class="text-xs">
                            <div class="flex justify-between font-bold">
                               <span>{{ exp.role }}</span>
                               <span>{{ exp.start }} - {{ exp.end }}</span>
                            </div>
                            <div class="italic text-gray-600 mb-1">{{ exp.company }}</div>
                            <p class="leading-relaxed">{{ exp.achievements }}</p>
                         </div>
                      </div>
                   </div>

                   <!-- FALLBACK: IF ENGINE IS CALIBRATING -->
                   <div v-else class="flex flex-col items-center justify-center py-20 text-center gap-4">
                      <div class="w-12 h-12 rounded-full border-4 border-[#0A2647]/5 border-t-[#C1A172] animate-spin"></div>
                      <p class="text-[10px] font-black text-[#0A2647]/40 uppercase tracking-widest">Calibrating Neural Specimen...</p>
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
      />

      <!-- LINKEDIN CONNECT OVERLAY -->
      <Transition name="fade">
         <div v-if="isLinkedInModalOpen" class="fixed inset-0 z-[1000] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
            <!-- BACKDROP -->
            <div @click="isLinkedInModalOpen = false" class="absolute inset-0 bg-[#0A2647]/95 backdrop-blur-3xl"></div>
            
            <!-- MODAL CARD -->
            <div class="relative w-full max-w-md bg-[#051124] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl flex flex-col max-h-[85vh]">
               <div class="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5">
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
                     <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Your Public Profile URL</label>
                     <input v-model="linkedInUrlInput" type="url" placeholder="https://linkedin.com/in/username" @keyup.enter="saveLinkedIn"
                            class="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#0077b5] transition-all font-jakarta" />
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
            <div class="relative w-full max-w-lg bg-[#0A2647] border border-white/10 rounded-t-[2.5rem] sm:rounded-[40px] overflow-hidden shadow-3xl animate-in slide-in-from-bottom duration-300">
               <div class="p-6 pb-2 border-b border-white/5 flex items-center justify-between">
                  <div>
                     <h3 class="text-xl font-black text-white/90 uppercase tracking-tight">GLOBAL DISCOVERY HUB</h3>
                     <p class="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1 italic font-jakarta">Active Focus Slots: 5/10 Available</p>
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
                     <div v-for="c in ['Sweden', 'Germany', 'Norway', 'Finland', 'Denmark', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Japan', 'France', 'Netherlands', 'Singapore', 'Switzerland', 'Ireland', 'Italy', 'Spain'].filter(name => name.toLowerCase().includes(countrySearch.toLowerCase()))" 
                          :key="c"
                          @click="(selectedCountriesArr.includes(c) ? null : selectedCountriesArr.push(c)), showCountrySelector = false"
                          class="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center justify-between hover:bg-white/10 hover:border-white/20 cursor-pointer active:scale-95 transition-all group">
                        <span class="text-[10px] font-bold text-white/70 group-hover:text-white transition-colors">{{ c }}</span>
                        <ArrowRight class="w-3.5 h-3.5 text-white/20 group-hover:text-[#C1A172] group-hover:translate-x-1 transition-all" />
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
             <span class="text-[8px] font-black text-[#C1A172] uppercase tracking-[0.1em]">CareerNexus Identity Hub</span>
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
             
             <div class="bg-gradient-to-br from-white/10 to-white/5 rounded-[3rem] w-full max-w-[420px] max-h-[90vh] overflow-hidden border border-white/10 shadow-5xl relative z-10 flex flex-col animate-in zoom-in duration-500">
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
             
             <div class="relative w-full max-w-md bg-[#051124] border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-3xl flex flex-col max-h-[85vh]">
                <div class="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5">
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
                        class="mt-4 p-5 bg-gradient-to-r from-[#C1A172] to-[#FFD700] rounded-[2rem] relative overflow-hidden cursor-pointer shadow-xl shadow-[#C1A172]/20 hover:scale-[1.02] active:scale-95 transition-all group">
                      <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-all duration-700"></div>
                      <div class="flex items-center justify-between relative z-10">
                         <div>
                            <p class="text-[14px] font-black text-[#0A2647] uppercase tracking-[0.2em] flex items-center gap-2">
                               Founder's Pass
                               <Crown class="w-4 h-4 text-[#0A2647]" />
                            </p>
                            <p class="text-[9px] font-black text-[#0A2647]/70 tracking-widest uppercase mt-0.5">Lifetime Global Access</p>
                         </div>
                         <div class="text-right">
                            <span class="text-[20px] font-black text-[#0A2647] tracking-tighter">$149</span>
                            <p class="text-[8px] font-black text-[#0A2647]/70 uppercase tracking-widest">One-time payment</p>
                         </div>
                      </div>
                   </div>

                </div>

                    <div v-else-if="['privacy', 'terms', 'security', 'billing'].includes(infoSheetType)" class="space-y-6">
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
                    DIGYNEX CAREERNEXUS ENGINE V12.0 NEURAL HUB
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
            
            <div class="w-full max-w-xl bg-white border border-white/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.6)] relative z-10 animate-in zoom-in slide-in-from-bottom-10 duration-500">
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
            
            <div class="w-full max-w-sm bg-[#0A2647] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 animate-in slide-in-from-bottom-10 duration-500">
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
</style>
