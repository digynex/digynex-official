<script setup>
import { 
  LayoutDashboard, 
  FileText, 
  Star, 
  User, 
  Search, 
  Bell, 
  MoreHorizontal, 
  ArrowRight, 
  Briefcase, 
  Zap,
  Globe,
  Cloud,
  ChevronDown,
  Stars,
  SlidersHorizontal,
  X,
  Sparkles,
  Check,
  Mic,
  Linkedin,
  DownloadCloud,
  RefreshCw,
  BarChart3,
  UserPlus,
  Bookmark,
  Share2,
  EyeOff, 
  AlertTriangle, 
  ShieldCheck,
  Lock,
  Maximize2,
  Plus
} from 'lucide-vue-next'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SkillGapChart from './components/SkillGapChart.vue'
import ExpertProfileWizard from './components/ExpertProfileWizard.vue'
import AuthOverlay from './components/AuthOverlay.vue'
import JobDetailOverlay from './components/JobDetailOverlay.vue'
import ActionSheet from './components/ActionSheet.vue'
import { authService } from './services/authService'
import { profileService } from './services/profileService'
import { templateService } from './services/templateService'
import ClassicElite from './components/templates/ClassicElite.vue'
import SidebarModern from './components/templates/SidebarModern.vue'

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
const quickLangs = ['EN', 'DE', 'SW']
const langContainer = ref(null)
const notificationContainer = ref(null)
const isNotificationsOpen = ref(false)
const searchQuery = ref('') // Mission-critical state for global filtering

// --- GLOBAL REACTIVE STATE (Neural Core) ---
const activeTab = ref('dashboard')
const selectedTemplate = ref(1) // Default to Classic Elite T1
const userProfile = ref({
    email: '',
    name: 'Amila',
    primaryColor: '#0A2647',
    secondaryColor: '#64748b',
    isSuperUser: true // FLAGSHIP: Admin Neural Override Enabled
})

const masterProfile = ref({
   basic: { fullName: '', email: '', phone: '', location: '', headline: '' },
   targetLanguage: 'Smart Localization', // NEW: AI Strategy logic
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
   secondaryEmail: '',
   secretKeywords: ['PROJECT', 'MANAGER', 'TELECOM', '5G', 'PMP', 'SWEDEN', 'ARTHA', 'TESHAN', 'DIALOG', 'PMO', 'AI', 'CLOUD', 'PYTHON', 'JAVA', 'SCRUM', 'AGILE', 'NFV', 'SDN']
})

const isAuthenticated = ref(false)
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
  { name: '한국어', code: 'KR' },
  { name: 'हिन्दी', code: 'HI' },
  { name: 'தமிழ்', code: 'TA' }
]

const selectedPipelineStep = ref('applied')

const allJobs = ref([
  {c: 'TechCorp', r: 'Senior Scientist', s: '80%', d: '14/03/24', l: 'Stockholm, SE', icon: Briefcase, color: '#0A2647', m: 80, desc: 'Lead our AI discovery division at high-scale.', step: 'applied'}, 
  {c: 'Innovate', r: 'Product Manager', s: '50%', d: '23/03/24', l: 'Berlin, DE', icon: LayoutDashboard, color: '#73BBA3', m: 50, desc: 'Directing the next-gen SaaS product roadmap.', step: 'review'}, 
  {c: 'Techwork', r: 'Senior Scientist', s: '60%', d: '22/03/24', l: 'Oslo, NO', icon: Zap, color: '#6366F1', m: 60, desc: 'Neural engineering and cloud-native optimization.', step: 'interview'},
  {c: 'Spotify', r: 'Lead Dev', s: '92%', d: '25/03/24', l: 'Stockholm, SE', icon: Star, color: '#1DB954', m: 92, desc: 'Scaling global audio intelligence.', step: 'offer'},
  {c: 'Google', r: 'AI Architect', s: '88%', d: '10/03/24', l: 'Zurich, CH', icon: Zap, color: '#4285F4', m: 88, desc: 'Next-gen LLM optimization.', step: 'applied'},
  {c: 'Tesla', r: 'Autopilot Eng', s: '75%', d: '18/03/24', l: 'Oslo, NO', icon: Zap, color: '#E81C23', m: 75, desc: 'Real-time vision systems.', step: 'applied'},
  {c: 'Amazon', r: 'Cloud Lead', s: '82%', d: '20/03/24', l: 'Madrid, ES', icon: Cloud, color: '#FF9900', m: 82, desc: 'Scaling AWS core infrastructure.', step: 'applied'}
])

const matches = ref([
  { company: 'Google', title: 'Senior AI Engineer', location: 'Mountain View, CA', matchScore: 98, salary: '$180k - $250k', tags: ['AI', 'Python', 'Cloud'], logo: 'G' },
  { company: 'Meta', title: 'Product Manager', location: 'Menlo Park, CA', matchScore: 95, salary: '$170k - $230k', tags: ['Product', 'Strategy'], logo: 'M' },
  { company: 'Netflix', title: 'Distributed Systems Eng', location: 'Los Gatos, CA', matchScore: 92, salary: '$200k - $300k', tags: ['Distributed', 'Java'], logo: 'N' },
  { company: 'Apple', title: 'Security Architect', location: 'Cupertino, CA', matchScore: 89, salary: '$190k - $260k', tags: ['Security', 'C++', 'Privacy'], logo: 'A' },
])

const filteredJobs = computed(() => {
    let result = allJobs.value;
    // Strictly filter by step to match the UI indicator boxes
    result = result.filter(j => j.step === selectedPipelineStep.value);
    
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(j => j.c.toLowerCase().includes(q) || j.r.toLowerCase().includes(q));
    }
    return result;
})

const filteredMatches = computed(() => {
    let result = matches.value;
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(m => m.company.toLowerCase().includes(q) || m.title.toLowerCase().includes(q));
    }
    return result;
})

const getStepCount = (step) => {
    return allJobs.value.filter(j => j.step === step).length
}

const showCountrySelector = ref(false)
const countrySearch = ref('')
const selectedCountriesArr = ref(['Sweden', 'Germany', 'Norway', 'Finland', 'Denmark'])
const activeCountry = ref('Sweden')

const setLang = (lang) => {
  currentLang.value = lang
  locale.value = lang
  isLangOpen.value = false
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

const saveProfile = async () => {
  if (isSavingProfile.value) return;
  isSavingProfile.value = true;
  try {
    const user = await authService.getUser();
    if (user) {
      const { error } = await profileService.syncProfile(user, {
        primaryColor: userProfile.value.primaryColor,
        secondaryColor: userProfile.value.secondaryColor,
        selectedTemplate: selectedTemplate.value,
        secretKeywords: masterProfile.value.secretKeywords,
        name: userProfile.value.name
      });
      
      if (error) throw error;
      
      toastMessage.value = 'Identity Core Synced Successfully';
      showToast.value = true;
      setTimeout(() => { showToast.value = false }, 3000);
    }
  } catch (err) {
    console.error('Failed to update global engine:', err);
    toastMessage.value = 'Sync Error: Connection Unstable';
    showToast.value = true;
    setTimeout(() => { showToast.value = false }, 3000);
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
  try {
    // Simulate real upload processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    uploadedFileName.value = file.name
  } catch (err) {
    console.error('Failed to sync CV:', err)
  } finally {
    isUploadingCV.value = false
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
    await new Promise(res => setTimeout(res, 1500));
    linkedInUrl.value = linkedInUrlInput.value;
    isLinkedInModalOpen.value = false;
  } finally {
    isLinkedInConnecting.value = false;
  }
}

const masterProfileSyncStatus = ref('connected')

const isStealthUnlocked = ref(false)
const isAnalyzingKeywords = ref(false)

const removeSecretKeyword = (keyword) => {
   masterProfile.value.secretKeywords = masterProfile.value.secretKeywords.filter(k => k !== keyword)
}

const analyzeAndSuggestKeywords = async () => {
   if (isAnalyzingKeywords.value) return;
   isAnalyzingKeywords.value = true;
   // Simulate Neural Analysis Delay
   await new Promise(r => setTimeout(r, 2000));
   
   const suggestions = ['Full-Stack Orchestration', 'Scalable Microservices', 'CI/CD Pipeline Design', 'Cloud Native Architecture'];
   suggestions.forEach(s => {
      if (!masterProfile.value.secretKeywords.includes(s)) {
         masterProfile.value.secretKeywords.push(s);
      }
   });
   
   isAnalyzingKeywords.value = false;
}

const newSecretKeyword = ref('')
const addSecretKeyword = () => {
   if (newSecretKeyword.value.trim() && !masterProfile.value.secretKeywords.includes(newSecretKeyword.value.trim())) {
      masterProfile.value.secretKeywords.push(newSecretKeyword.value.trim())
      newSecretKeyword.value = ''
   }
}

const isCompilingLatex = ref(false)
const isManualFormOpen = ref(false)
const isCVPreviewOpen = ref(false)
const isTemplatePreviewOpen = ref(false)
const previewingTemplate = ref(null)
const cvTemplates = ref([])
const viewportHtml = ref('')

const refreshViewport = async () => {
    const colors = {
        primary: userProfile.value.primaryColor,
        secondary: userProfile.value.secondaryColor
    };
    const html = await templateService.getSpecimenHtml(selectedTemplate.value, colors, masterProfile.value);
    viewportHtml.value = html;
}

watch([selectedTemplate, () => userProfile.value.primaryColor, () => userProfile.value.secondaryColor], () => {
    refreshViewport();
})

watch(activeTab, (newTab) => {
    if (newTab === 'studio') {
        refreshViewport();
    }
})



onMounted(async () => {
  // 1. Load available templates from Supabase
  const data = await templateService.getTemplates();
  if (data && data.length > 0) {
    cvTemplates.value = data;
  }
  
  // 2. Initialize user session and profile
  const session = await authService.getSession();
  if (session) {
    await fetchUserProfile();
  }
  
  
  document.addEventListener('click', handleClickOutside)
})

const selectTemplate = (template) => {
   if (template.id > 4 && !userProfile.value.isSuperUser) {
      handleDashboardAction('upgrade')
      return;
   }
   previewingTemplate.value = template;
   isTemplatePreviewOpen.value = true;
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
       showToast.value = true;
       setTimeout(() => { showToast.value = false }, 3000);
     }
   } catch (err) {
     console.error('Failed to persist template choice:', err);
   }
}

const compileLatex = async () => {
    isCompilingLatex.value = true;
    await new Promise(res => setTimeout(res, 2500));
    isCVPreviewOpen.value = true;
    isCompilingLatex.value = false;
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

const fetchUserProfile = async () => {
    const user = await authService.getUser();
    if (user) {
        isAuthenticated.value = true;
        const { data: profile } = await profileService.fetchProfile(user.id);

        if (profile) {
            userProfile.value = {
                email: user.email,
                name: profile.name || user.user_metadata?.full_name || 'Expert',
                primaryColor: profile.primary_color || '#0A2647',
                secondaryColor: profile.secondary_color || '#64748b'
            };
            selectedTemplate.value = profile.selected_template || 3;
            if (profile.secret_keywords) {
                masterProfile.value.secretKeywords = profile.secret_keywords;
            }
        } else {
            userProfile.value = {
                email: user.email,
                name: user.user_metadata?.full_name || user.user_metadata?.display_name || 'Expert',
                primaryColor: '#0A2647',
                secondaryColor: '#64748b'
            };
        }
    }
    // FLAGSHIP: Global Override (Ensures Owner always has Super User status in development)
    userProfile.value.isSuperUser = true;
};

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
const showToast = ref(false)
const toastMessage = ref('')

const handleDashboardAction = async (actionId) => {
    console.log(`[DIGYNEX ENGINE] Triggering: ${actionId}`);
    
    if (actionId === 'skills') {
        isActionSheetOpen.value = false;
        isManualFormOpen.value = true;
        return;
    }

    if (actionId === 'insights') {
        activeTab.value = 'matches';
        toastMessage.value = 'Analyzing real-time market trends...';
        showToast.value = true;
        setTimeout(() => { showToast.value = false }, 3000);
        return;
    }

    if (actionId === 'recalibrate') {
        isRecalibrating.value = true;
        toastMessage.value = 'AI Engine: Recalibrating Neural Vectors...';
        showToast.value = true;
        
        // n8n Webhook / Supabase Edge Function Call
        try {
            /* 
              await fetch('https://your-n8n-instance.com/webhook/recalibrate', { 
                 method: 'POST', 
                 body: JSON.stringify({ userId: userProfile.value.email, timestamp: new Date() }) 
              }); 
            */
            await new Promise(r => setTimeout(r, 2500));
            toastMessage.value = 'Sync Complete: Profile Optimized';
        } finally {
            isRecalibrating.value = false;
            setTimeout(() => { showToast.value = false }, 3000);
        }
        return;
    }

    // Generic Action Wrapper for n8n/Supabase Logging
    toastMessage.value = `Dispatching Signal: ${actionId}...`;
    showToast.value = true;
    
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
        setTimeout(() => { showToast.value = false }, 2000);
    }
}

const handleScroll = (e) => {
  const el = e.target
  const scrollable = el.scrollWidth - el.clientWidth
  if (scrollable > 0) {
    sliderProgress.value = (el.scrollLeft / scrollable) * 70 // 70 because thumb is 30% width
  }
}

const toggleSelector = (e) => {
  e.stopPropagation()
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
    <!-- 
       ALEX MASTER SYNC V6.0 (STRICT STABLE RECOVERY)
       - CENTERED BRANDING HUB
       - GOLD BRANDING (PRISTINE)
       - NARROW SLIM NAV BAR (BOTTOM-4)
    -->
    <main :dir="locale === 'AR' ? 'rtl' : 'ltr'" 
          class="w-full max-w-[360px] h-[800px] bg-[#0A2647] relative z-10 flex flex-col border border-white/10 rounded-[3.8rem] ring-1 ring-white/20 shadow-[0_80px_160px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-500">
        
       <!-- DASHBOARD VIEW -->
       <div v-if="activeTab === 'dashboard'" class="flex flex-col h-full overflow-hidden">
          <!-- Scrolling Content Wrapper -->
          <div class="flex-1 overflow-y-auto px-4 pb-24 custom-scrollbar">
             <!-- Top Branding Hub (CENTERED LARGE - 18PX TOP SYNC) -->
             <header class="flex flex-col items-center pt-[18px] space-y-4 w-full relative z-[600]">
            <!-- Symmetric Auth Gate (V6.5 ELITE) -->
            <div class="flex items-center justify-between w-full px-4 mb-2">
               <!-- LEFT: JOIN (Sign Up) -->
               <button v-if="!isAuthenticated" @click="openAuth('register')" 
                       class="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/5 hover:text-white hover:border-[#C1A172]/40 hover:bg-[#C1A172]/5 hover:shadow-[0_0_20px_rgba(193,161,114,0.3)] transition-all duration-500 font-jakarta active:scale-90">
                  {{ t('auth.signup') || 'JOIN' }}
               </button>
<div v-else class="w-16"></div>

               <!-- CENTER: LOGO UNIT -->
               <div class="relative group">
                 <div class="p-1.5 bg-gradient-to-br from-[#144272] to-[#0A2647] rounded-full flex items-center justify-center border-2 border-white/40 shadow-[-10px_-10px_30px_rgba(255,255,255,0.05),15px_15px_35px_rgba(0,0,0,0.6)] overflow-hidden scale-100 transition-all hover:scale-110 active:scale-95 duration-500">
                    <img src="/digynex-icon.png" alt="DigyNex" class="h-10 w-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]" />
                 </div>
                 <!-- 3D Ring Reflection -->
                 <div class="absolute -inset-1 border border-white/10 rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
               </div>

               <!-- RIGHT: LOGIN -->
               <button v-if="!isAuthenticated" @click="openAuth('login')" 
                       class="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/5 hover:text-white hover:border-[#C1A172]/40 hover:bg-[#C1A172]/5 hover:shadow-[0_0_20px_rgba(193,161,114,0.3)] transition-all duration-500 font-jakarta active:scale-90">
                  {{ t('auth.login') || 'LOGIN' }}
               </button>
               <button v-else @click="logout" class="text-[8px] font-black text-red-500/50 uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-red-500/10 hover:text-red-500 transition-all font-jakarta active:scale-90">LOG OUT</button>
            </div>
 
           <!-- Branding Text Hub (WHITE SYNC - 22PX BOTTOM GAP) -->
           <div class="flex flex-col items-center mt-4 mb-1">
             <h1 class="text-[17px] font-black text-white uppercase tracking-[0.2em] leading-tight font-jakarta">{{ t('header.title') }}</h1>
             <p class="text-[15px] font-black text-white uppercase tracking-[0.25em] -mt-1 font-jakarta">{{ t('header.subtitle') }}</p>
           </div>
 
           <!-- Language Pill Unit (LOCKED SIZES) -->
           <div ref="langContainer" class="bg-black/30 backdrop-blur-2xl rounded-full p-0.5 flex items-center border border-white/10 shadow-2xl relative transition-all hover:scale-100 scale-100">
             <button v-for="lang in quickLangs" :key="lang" @click="setLang(lang)" 
                     :class="locale === lang ? 'bg-white text-[#0A2647] shadow-lg font-black scale-105 ring-1 ring-white/20' : 'text-white/40 hover:text-white/80 font-bold hover:bg-white/5'"
                     class="px-5 py-2.5 rounded-full text-[10px] uppercase min-w-[55px] flex items-center justify-center cursor-pointer transition-all duration-500 relative z-20">
               {{ lang }}
             </button>
             <div class="h-3 w-[1px] bg-white/10 mx-1"></div>
             
             <!-- 4th Pill Dropdown (SYNCED V6.5) -->
             <div @click="toggleSelector" 
                  :class="(!quickLangs.includes(locale) || isLangOpen) ? 'bg-white text-[#0A2647] shadow-lg scale-105' : 'text-white/40 hover:text-white/80'"
                  class="flex items-center gap-1.5 pl-3 pr-3 py-2.5 rounded-full cursor-pointer group transition-all duration-500 relative z-20">
               
               <Globe v-if="quickLangs.includes(locale) && !isLangOpen" class="w-3 h-3 transition-transform group-hover:rotate-12" />
               <span v-else class="text-[9px] font-black uppercase tracking-tight">{{ locale }}</span>
               <ChevronDown class="w-3 h-3 transition-transform opacity-30" :class="isLangOpen ? 'rotate-180 opacity-100' : ''" />
             </div>
 
             <!-- Animated Selector Overlay (SYNCED V6.5) -->
             <div v-if="isLangOpen" class="absolute top-[60px] right-0 w-[180px] bg-[#0A2647]/95 backdrop-blur-3xl rounded-[1.8rem] p-4 shadow-[0_40px_80px_rgba(0,0,0,0.9)] z-[3000] border border-white/10 animate-in fade-in zoom-in duration-300">
                <p class="text-[7.5px] font-black text-white/30 uppercase tracking-[0.25em] mb-4 border-b border-white/5 pb-2">{{ t('header.globalSuite') }}</p>
                <div class="space-y-1 max-h-[220px] overflow-y-auto pr-0.5 custom-scrollbar">
                   <div v-for="l in otherLangs" :key="l.code" @click="setLang(l.code)" 
                        class="flex items-center justify-between py-2.5 px-3 rounded-xl border border-white/0 hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer group active:scale-95">
                      <div class="flex items-center gap-1">
                         <div class="w-6 h-6 flex items-center justify-center text-[8px] font-black text-white/40 group-hover:text-white transition-colors">{{ l.code }}</div>
                         <span class="text-[11px] font-bold tracking-tight text-white/70 group-hover:text-white transition-colors">{{ l.name }}</span>
                      </div>
                      <ArrowRight class="w-2.5 h-2.5 text-white/10 group-hover:text-white transition-all font-jakarta" />
                   </div>
                </div>
             </div>
           </div>
         </header>
 
        <!-- Identity Hub (REDUCED 5PX SPACE) -->
         <div class="flex justify-between items-center mt-[5px] w-full px-1 font-jakarta transition-all duration-1000" :class="isRecalibrating ? 'scale-[1.02] blur-[1px]' : ''">
           <h1 class="text-[24px] font-bold text-white tracking-tight leading-none pt-2 font-jakarta">
              <span :class="isRecalibrating ? 'animate-pulse text-[#C1A172]' : 'neural-glow'">{{ userProfile.name === 'Expert' ? t('header.welcome') : `Welcome, ${userProfile.name}` }}</span>
           </h1>
          <div class="flex items-center gap-3">
             <div ref="notificationContainer" class="relative cursor-pointer transition-all group">
                <div @click="isNotificationsOpen = !isNotificationsOpen" class="hover:scale-110 transition-transform active:scale-95">
                   <Bell :class="isNotificationsOpen ? 'text-white' : 'text-white/40'" class="w-6 h-6 transition-colors" />
                   <!-- Notification Badge Unit -->
                   <div class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0A2647] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span class="text-[8px] font-black text-white leading-none">3</span>
                   </div>
                </div>

                <!-- ELITE NOTIFICATION POPUP (V6.5 STEADY) -->
                <div v-if="isNotificationsOpen" 
                     class="absolute top-[45px] right-0 w-[240px] bg-white backdrop-blur-3xl rounded-[1.8rem] p-4 shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white z-[1000] animate-in fade-in zoom-in duration-300">
                   <div class="flex justify-between items-center mb-4 border-b border-black/5 pb-2">
                       <span class="text-[10px] font-black text-[#0A2647] tracking-widest uppercase">{{ t('notifications.title') || 'Notifications' }}</span>
                       <span class="text-[8px] font-bold text-blue-500 uppercase cursor-pointer hover:underline">Mark all read</span>
                   </div>
                   <div class="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                      <div v-for="notif in notifications" :key="notif.id" 
                           @click="handleNotificationClick(notif)" 
                           class="flex gap-3 group/item cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-all">
                         <div :class="notif.color" class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                            <component :is="notif.icon" :class="notif.iconColor" class="w-4 h-4" />
                         </div>
                         <div>
                            <p class="text-[10px] font-black text-[#0A2647] tracking-tight leading-none mb-1">{{ notif.title }}</p>
                            <p class="text-[8.5px] font-medium text-black/40 leading-tight">{{ notif.message }}</p>
                         </div>
                      </div>
                   </div>
                   <button class="w-full mt-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[8.5px] font-black text-[#0A2647] uppercase tracking-widest hover:bg-slate-100 transition-colors">
                      View All Activity
                   </button>
                </div>
             </div>
             <div class="w-11 h-11 rounded-full border-2 border-white/20 shadow-2xl overflow-hidden ring-1 ring-white/5 transition-all">
                <img src="https://i.pravatar.cc/150?u=amila" alt="P" class="w-full h-full object-cover" />
             </div>
          </div>
        </div>

        <p class="text-[14px] font-medium text-white/80 tracking-tight mt-[3px] px-1 italic opacity-90 font-jakarta">{{ t('header.progress') }}</p>

        <!-- Stats Linear Grid -->
        <div class="mt-2 grid grid-cols-[1fr_.5px_1fr_.5px_1fr] items-end px-1 gap-1 pb-1">
          <div class="flex flex-col items-center">
             <p class="text-[8.5px] font-bold text-white/40 mb-2 leading-none uppercase tracking-[0.05em]">{{ t('stats.activeApps') }}</p>
             <p class="text-[22px] font-black text-white leading-none tracking-tighter">14</p>
          </div>
          <div class="h-6 w-[0.5px] bg-white/10 mb-0.5"></div>
          <div class="flex flex-col items-center">
             <p class="text-[8.5px] font-bold text-white/40 mb-2 leading-none uppercase tracking-[0.05em]">{{ t('stats.aiMatches') }}</p>
             <p class="text-[22px] font-black text-white leading-none tracking-tighter shadow-2xl">08</p>
          </div>
          <div class="h-6 w-[0.5px] bg-white/10 mb-0.5"></div>
          <div class="flex flex-col items-center">
             <p class="text-[8.5px] font-black text-white/40 mb-2 leading-none uppercase tracking-[0.05em] text-center font-jakarta">{{ t('stats.skillScore') }}</p>
             <p class="text-[22px] font-black text-white leading-none tracking-tighter text-center font-jakarta">88%</p>
          </div>
        </div>

        <!-- MAIN CONTENT CARDS (EXTREME TIGHTENING space-y-1.5) -->
        <div class="mt-1.5 space-y-1.5">
          
          <!-- QUICK ACCESS CV CARD (STRATEGIC JUMP - V6.5) -->
          <div @click="activeTab = 'studio'" class="bg-gradient-to-r from-[#0A2647] to-[#144272] rounded-[1.8rem] p-4 shadow-3xl border border-white/10 relative overflow-hidden group cursor-pointer hover:scale-[1.01] transition-all">
             <div class="flex items-center justify-between relative z-10">
                <div class="flex items-center gap-3">
                   <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center p-2.5">
                      <Sparkles class="w-full h-full text-[#C1A172] animate-pulse" />
                   </div>
                   <div class="flex flex-col">
                      <span class="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Live Sync: Active</span>
                      <h3 class="text-[13px] font-black text-white tracking-tight uppercase">{{ uploadedFileName.split('_')[0] }} CV MASTER</h3>
                   </div>
                </div>
                <div class="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-all">
                   <ArrowRight class="w-3.5 h-3.5 text-white" />
                </div>
             </div>
             <!-- Stealth Matching Indicator -->
             <div class="mt-3 w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-[#2C74B3] to-[#C1A172] w-[94%] transition-all duration-1000"></div>
             </div>
             <div class="flex justify-between mt-1 px-0.5">
                <span class="text-[7px] font-black text-white/20 uppercase tracking-widest">ATS Compatibility Score</span>
                <span class="text-[7px] font-black text-[#C1A172] uppercase tracking-widest">94% Neural Match</span>
             </div>
             <Sparkles class="absolute -right-6 -bottom-6 w-20 h-20 text-white/5 rotate-12" />
          </div>

          <!-- APPLICATION TRACKING CARD (V5.7 Baseline Shading + PRECISION SYNC) -->
          <div class="bg-gradient-to-br from-[#BDDAFA]/30 via-[#F8FAFC] to-white rounded-[1.8rem] p-5 pt-2 pb-1.5 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.6)] border border-white relative overflow-hidden ring-1 ring-black/[0.03] group font-jakarta">
             
             <!-- Header Heading -->
             <div class="flex justify-between items-center mb-0.5 px-1 font-jakarta">
                <span class="text-[9.5px] font-black text-[#0A2647]/55 uppercase tracking-[0.2em] leading-none font-jakarta">{{ t('sections.tracking') }}</span>
                <button @click.stop="openActionSheet('Tracking Actions', 'tracking')" class="relative z-50 flex items-center justify-center cursor-pointer opacity-30 hover:opacity-100 hover:bg-black/5 transition-all font-jakarta p-2 -mr-2 rounded-full border border-transparent hover:border-black/5 active:scale-90">
                   <MoreHorizontal class="w-[18px] h-[18px] text-[#0A2647]" />
                </button>
             </div>

             <!-- PIPELINE GEOMETRIC SYNC (CENTRALIZED V6.5) -->
             <div class="flex items-center justify-center gap-1.5 mb-2.5 px-0.5 relative font-jakarta">
                <template v-for="(v, l, i) in {applied: 'applied', review: 'review', interview: 'interview', offer: 'offer'}" :key="l">
                   <!-- Individual Packed Box -->
                   <div @click="selectedPipelineStep = v"
                        :class="selectedPipelineStep === v 
                        ? 'bg-gradient-to-b from-[#60A5FA]/90 via-[#0A2647] to-[#60A5FA]/90 text-white shadow-[0_12px_24px_rgba(10,38,71,0.5)] ring-1 ring-white/30 scale-100' 
                        : 'bg-[#FDFDFD] border border-black/[0.04] shadow-[0_6px_14px_rgba(0,0,0,0.06)] text-[#0A2647]'"
                        class="w-[60px] h-[46px] rounded-[0.8rem] flex flex-col items-center justify-center transition-all cursor-pointer relative z-10 active:scale-95 flex-none font-jakarta">
                       <span class="text-[6.8px] font-bold uppercase mb-0.5 tracking-tighter leading-none" :class="selectedPipelineStep === v ? 'opacity-80' : 'opacity-35'">{{ t('pipeline.' + l) }}</span>
                       <span class="text-[17px] font-black leading-none font-jakarta">{{ getStepCount(v) }}</span>
                   </div>
                   <!-- Link Arrow (Surgical Precision) -->
                   <div v-if="i < 3" class="flex items-center justify-center font-jakarta px-0">
                      <ArrowRight class="w-1.5 h-1.5 text-[#2C74B3] opacity-25" />
                   </div>
                </template>
             </div>

             <!-- Metadata Headers (PRECISION TABLE SYNC) -->
             <div class="grid grid-cols-[1.5fr_1.2fr_1fr_0.8fr] px-0.5 mb-1 items-center border-b border-black/[0.04] pb-1 font-jakarta">
                <span class="text-[7.8px] font-black text-black/25 uppercase leading-none font-jakarta">{{ t('table.company') }}</span>
                <span class="text-[7.8px] font-black text-black/25 uppercase leading-none font-jakarta">{{ t('table.role') }}</span>
                <span class="text-[7.8px] font-black text-black/25 uppercase leading-none text-center font-jakarta">{{ t('table.status') }}</span>
                <span class="text-[7.8px] font-black text-black/25 uppercase leading-none text-right font-jakarta">{{ t('table.date') }}</span>
             </div>

             <!-- JOB ROWS (DYNAMIC FILTERING) -->
             <div class="space-y-2 pt-0.5 pb-1 px-0.5 font-jakarta min-h-[140px]">
                <TransitionGroup name="fade">
                    <div v-for="(job, i) in filteredJobs" :key="job.c + job.r + i" 
                         @click="openJobDetail(job)"
                         class="grid grid-cols-[1.5fr_1.2fr_1fr_0.8fr] items-center bg-transparent group cursor-pointer transition-all active:scale-98">
                   <div class="flex items-center gap-1">
                      <div class="w-7 h-7 bg-[#0A2647] rounded-xl flex items-center justify-center p-1.5 shadow-lg border border-white/5 ring-1 ring-white/10 group-hover:scale-110 transition-all font-jakarta" :class="i === 1 ? 'bg-[#73BBA3]' : i === 2 ? 'bg-[#6366F1]/60' : 'bg-[#0A2647]'"> 
                        <component :is="job.icon" class="w-full h-full text-white opacity-95 shadow-2xl" /> 
                      </div>
                      <div class="flex flex-col space-y-0.5 min-w-0 font-jakarta">
                         <span class="text-[10px] font-black text-[#0A2647] tracking-tighter leading-none">{{job.c}}</span>
                         <span class="text-[7px] font-bold text-black/25 leading-none uppercase tracking-widest truncate">{{ t('table.company') }}</span>
                      </div>
                   </div>
                   <span class="text-[9.5px] font-bold text-black/60 truncate leading-none pl-1 transition-all font-jakarta">{{job.r}}</span>
                   <div class="px-2">
                       <div class="h-1.5 w-full bg-black/[0.08] rounded-full overflow-hidden shadow-inner ring-1 ring-black/[0.01]">
                          <div class="h-full bg-gradient-to-r from-[#2C74B3] to-[#4F8AFF] opacity-80" :style="{width: job.s}"></div>
                       </div>
                   </div>
                   <span class="text-[8.5px] font-black text-black/25 text-right leading-none">{{job.d}}</span>
                </div>
                </TransitionGroup>
             </div>
          </div>

          <!-- AI Analytics Dashboard (V6.0 - SURGICAL PACKING) -->
          <div class="bg-gradient-to-br from-[#BDDAFA]/30 via-[#F8FAFC] to-white rounded-[1.8rem] px-4 pt-1 pb-2.5 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.6)] border border-white relative overflow-hidden ring-1 ring-black/[0.03] group flex flex-col font-jakarta">
             <!-- Header Heading -->
             <div class="flex justify-between items-center mb-[1px] px-1 font-jakarta">
                <span class="text-[9.5px] font-black text-[#0A2647]/55 uppercase tracking-[0.2em] leading-none font-jakarta">{{ t('sections.analytics') }}</span>
                <button @click.stop="openActionSheet('Analytics Options', 'analytics')" class="relative z-50 flex items-center justify-center cursor-pointer opacity-30 hover:opacity-100 hover:bg-black/5 transition-all font-jakarta p-2 -mr-2 rounded-full border border-transparent hover:border-black/5 active:scale-90">
                   <MoreHorizontal class="w-[18px] h-[18px] text-[#0A2647]" />
                </button>
             </div>

             <!-- Content Split (V6.0 - Halved Spacing) -->
             <div class="grid grid-cols-2 gap-4 px-1 mt-0.5">
                <!-- LEFT: TOP JOB MATCHES -->
                <div class="flex flex-col">
                   <p class="text-[8px] font-black text-black/25 uppercase tracking-widest leading-none font-jakarta">{{ t('analytics.topMatches') }}</p>
                   <div class="space-y-2 pt-1 font-jakarta">
                      <div v-for="(m, i) in [{n: 'Senior Data Scientist', p: 94, c: 'TechCorp'}, {n: 'Product Manager', p: 91, c: 'Innovate'}, {n: 'Senior Data Scientist', p: 83, c: 'TechCorp'}]" :key="i" class="space-y-1">
                         <div class="flex flex-col">
                            <span class="text-[9px] font-black text-[#0A2647] tracking-tight leading-none font-jakarta">{{m.n}}</span>
                            <div class="flex justify-between items-center mt-0.5">
                               <span class="text-[6.8px] font-bold text-black/30 uppercase tracking-tighter">{{m.c}}</span>
                               <span class="text-[11px] font-black text-[#2C74B3] tracking-tighter leading-none">{{m.p}}%</span>
                            </div>
                         </div>
                         <div class="h-1 w-full bg-black/[0.06] rounded-full overflow-hidden shadow-inner">
                            <div class="h-full bg-gradient-to-r from-[#2C74B3] to-[#73BBA3] opacity-80" :style="{width: m.p + '%'}"></div>
                         </div>
                      </div>
                   </div>
                </div>
                <!-- RIGHT: SKILL GAP ANALYSIS -->
                <div class="flex flex-col">
                   <p class="text-[8px] font-black text-black/25 uppercase tracking-widest leading-none text-center font-jakarta">{{ t('analytics.skillGap') }}</p>
                   <div class="flex flex-col items-center justify-center relative bg-white/40 rounded-[1.6rem] border border-black/[0.03] p-1 shadow-inner h-[105px] mt-1.5 overflow-hidden">
                      <div class="w-full aspect-square scale-[1.1]">
                         <SkillGapChart />
                      </div>
                   </div>
                </div>
             </div>

             <!-- ELITE CTAs: SKILL UPGRADE (SYNCED TO WIZARD) -->
             <div class="mt-2.5 px-1 relative z-20">
                <button @click.stop="handleDashboardAction('skills')" 
                        class="w-full bg-[#0A2647] text-white py-2 rounded-xl text-[9.5px] font-black uppercase tracking-[0.15em] shadow-[0_15px_30px_rgba(10,38,71,0.25)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/5 ring-1 ring-white/10 group-hover:ring-[#C1A172]/30 font-jakarta">
                   <UserPlus class="w-3 h-3 text-[#C1A172]" />
                   {{ t('analytics.updateProfile') || 'Recalibrate Skill Profile' }}
                </button>
                 </div>
              </div>
           </div>
        </div>

      </div>
      <!-- APPLICATIONS VIEW -->
      <div v-else-if="activeTab === 'applications'" class="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500">
         <!-- Top Branding Hub (CENTERED SYNC) -->
         <header class="flex flex-col items-center pt-[18px] space-y-4 w-full relative z-[600]">
           <div class="p-0.5 bg-white/10 rounded-full">
              <img src="/digynex-icon.png" alt="DigyNex" class="h-8 w-auto opacity-50 contrast-125" />
           </div>
           <div class="flex flex-col items-center mb-1">
              <h2 class="text-[14px] font-black text-white/40 uppercase tracking-[0.3em] leading-none">{{ t('apps.title') }}</h2>
           </div>
         </header>
            <div class="w-full px-1 space-y-3 mt-3">
               <div class="relative group mx-2">
                  <input type="text" v-model="searchQuery" :placeholder="t('apps.searchPlaceholder')" 
                         class="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-2 text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#2C74B3]/50 transition-all font-jakarta shadow-inner" />
                  <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#2C74B3] transition-colors" />
                  <div @click.stop="openActionSheet('Search Filters', 'filters')" class="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg cursor-pointer transition-all">
                     <SlidersHorizontal class="w-3.5 h-3.5 text-white/20 hover:text-white transition-colors" />
                  </div>
               </div>
               <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                  <span v-for="cat in ['filterAll', 'filterPending', 'filterInterview', 'filterOffers', 'filterArchived']" :key="cat"
                        :class="cat === 'filterAll' ? 'bg-white text-[#0A2647] font-black' : 'bg-white/5 text-white/40 font-bold border border-white/5'"
                        class="px-5 py-2 rounded-full text-[9px] uppercase tracking-widest whitespace-nowrap cursor-pointer hover:bg-white/10 transition-all active:scale-95">
                    {{ t('apps.' + cat) }}
                  </span>
               </div>
            </div>

         <div class="mt-4 flex-1 overflow-y-auto space-y-2 pb-[94px] px-4 custom-scrollbar">
            <!-- SMART ACTIVE VIEW (TOP 4 PRIORITY) -->
            <div v-for="(app, i) in filteredJobs" :key="i" @click="openJobDetail(app)" class="cursor-pointer bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-[2.2rem] p-4 pt-1 pb-1 border border-white/10 shadow-2xl relative overflow-hidden group hover:scale-[1.01] transition-all">
               <div class="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               <!-- SUPREME SYMMETRY CONTAINER -->
               <div class="flex items-start justify-between relative z-10 mb-1 h-12">
                  <!-- LEFT: IDENTITY UNIT -->
                  <div class="flex items-start gap-3 h-full">
                     <div class="w-12 h-12 rounded-[1.2rem] p-2.5 flex items-center justify-center shadow-2xl ring-1 ring-white/10 shrink-0 transform group-hover:rotate-6 transition-transform" :style="{ backgroundColor: app.color }">
                        <component :is="app.icon" class="w-full h-full text-white drop-shadow-lg" />
                     </div>
                     <div class="flex flex-col pt-[7px]">
                        <h3 class="text-[16px] font-black text-white tracking-tight leading-none font-jakarta">{{ app.r }}</h3>
                        <p class="text-[12px] font-bold text-white/50 mt-1.5 font-jakarta tracking-wide">{{ app.c }}</p>
                     </div>
                  </div>

                  <!-- RIGHT: METRIC & STATUS UNIT -->
                  <div class="flex flex-col items-end pt-[2px] h-full">
                     <div class="bg-white/10 px-3 py-1.5 rounded-full border border-white/20 shadow-inner group-hover:border-white/40 transition-colors leading-none flex items-center justify-center">
                        <span class="text-[12px] font-black text-[#C1A172] tracking-tighter">{{ app.m }}%</span>
                     </div>
                     <!-- ALIGNED STATUS BADGE -->
                     <div class="flex items-center gap-1.5 opacity-80 bg-white/5 px-2.5 py-1.5 rounded-full border border-white/5 mt-3 transition-all group-hover:bg-white/10">
                        <div :class="app.s === 'interview' ? 'bg-[#73BBA3]' : app.s === 'offer' ? 'bg-[#C1A172]' : 'bg-[#2C74B3]'"
                             class="w-1.5 h-1.5 rounded-full shadow-[0_0_12px_currentColor]"></div>
                        <span class="text-[8px] font-black uppercase tracking-[0.15em] text-white/70 leading-none font-jakarta">{{ t('pipeline.' + app.s) }}</span>
                     </div>
                  </div>
               </div>

               <!-- TIER 3: LOCATION HUB (MINIMAL) -->
               <div class="flex items-center gap-2 mb-1 font-jakarta opacity-85 px-[0.75px] hover:opacity-100 transition-opacity">
                  <Globe class="w-3.5 h-3.5" />
                  <span class="text-[11px] font-bold text-white tracking-wide truncate">{{ app.l }}</span>
               </div>

               <!-- FOOTER: ALIGNED DATE & BUTTON -->
               <div class="flex items-center justify-between border-t border-white/5 pt-1">
                  <div class="flex flex-col">
                     <span class="text-[8.5px] font-black text-white/20 uppercase tracking-[0.2em] font-jakarta">{{ t('apps.appliedDate') }}</span>
                     <span class="text-[11px] font-extrabold text-white/50 mt-1 font-jakarta">12 March 2024</span>
                  </div>
                  <button @click="openJobDetail(app)" class="bg-white text-[#0A2647] px-6 py-3 rounded-2xl text-[10.5px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all font-jakarta">
                     {{ t('apps.viewDetails') }}
                  </button>
               </div>
            </div>

            <!-- SHOW MORE - ELITE CALL TO ACTION -->
            <button class="w-full bg-white/5 border border-white/10 py-2.5 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-white/10 active:scale-[0.98] transition-all group font-jakarta">
               <span class="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{{ t('apps.loadMore') }}</span>
               <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center p-1.5 group-hover:bg-[#C1A172] transition-all">
                  <ChevronDown class="w-3.5 h-3.5 text-white" />
               </div>
            </button>

         </div>
      </div>

      <!-- AI MATCHES VIEW -->
      <div v-else-if="activeTab === 'matches'" class="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500">
         <!-- Top Branding Hub (CENTERED SYNC) -->
         <header class="flex flex-col items-center pt-[18px] space-y-4 w-full relative z-[600]">
           <div class="p-0.5 bg-white/10 rounded-full">
              <img src="/digynex-icon.png" alt="DigyNex" class="h-8 w-auto opacity-50 contrast-125" />
           </div>
           <div class="flex flex-col items-center">
              <h2 class="text-[20px] font-black text-white tracking-tight uppercase leading-none">{{ t('nav.matches') }}</h2>
              <p class="text-[8px] font-black text-[#C1A172] uppercase tracking-[0.3em] mt-1.5 opacity-80 animate-pulse">{{ t('matches.discoveryHub') }}</p>
           </div>

           <div class="w-full px-1 space-y-4">
              <!-- DRAGGABLE / SCROLLABLE COUNTRIES LIST WITH + AT THE END -->
              <div ref="countriesContainer" @scroll="handleScroll" class="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar scroll-smooth w-full px-0.5">
                 <div v-for="(country, idx) in selectedCountriesArr" :key="country"
                       @click="activeCountry = country"
                       :class="activeCountry === country ? 'bg-white text-[#0A2647] font-black shadow-lg scale-105' : 'bg-white/5 text-white/40 font-bold border border-white/5 hover:bg-white/10'"
                       class="px-4 h-[36px] rounded-full text-[9px] uppercase tracking-widest whitespace-nowrap cursor-pointer transition-all active:scale-95 flex items-center gap-3 shrink-0">
                   <span>{{ country }}</span>
                   <X v-if="selectedCountriesArr.length !== 1" 
                      @click.stop="selectedCountriesArr.splice(idx, 1); if(activeCountry === country) activeCountry = selectedCountriesArr[0]" 
                      class="w-3 h-3 opacity-85 group-hover:opacity-100 text-red-500 hover:scale-125 transition-all" />
                 </div>
                 <!-- PROMINENT FIXED + BUTTON AT THE END -->
                 <div @click="showCountrySelector = true" 
                      class="flex items-center justify-center min-w-[44px] h-[36px] bg-gradient-to-br from-[#C1A172] to-[#FFD700] rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-[0_5px_15px_rgba(193,161,114,0.3)] shrink-0 z-50">
                    <span class="text-[16px] font-black text-[#0A2647]">+</span>
                 </div>
              </div>

              <!-- SEARCH INPUT (MOVED BELOW COUNTRIES) -->
              <div class="relative group mt-1 mx-2">
                 <input type="text" v-model="searchQuery" :placeholder="t('apps.searchPlaceholder')" 
                        class="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-2 text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#C1A172]/50 transition-all font-jakarta shadow-inner" />
                 <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#C1A172] transition-colors" />
              </div>
           </div>
         </header>

         <div class="mt-4 flex-1 overflow-y-auto space-y-2 pb-[94px] px-4 custom-scrollbar">
            <div v-for="(match, i) in [
               {id: 'm1', c: 'NVIDIA', r: 'AI Research Scientist', l: 'Stockholm, SE', m: 99, icon: Zap, color: '#76B900', t: '2 hr'},
               {id: 'm2', c: 'OpenAI', r: 'Language Model Eng', l: 'Remote, Global', m: 97, icon: Stars, color: '#000000', t: '5 hr'},
               {id: 'm3', c: 'Apple', r: 'iOS Core Developer', l: 'Copenhagen, DK', m: 95, icon: LayoutDashboard, color: '#555555', t: '8 hr'},
               {id: 'm4', c: 'Microsoft', r: 'Azure AI Architect', l: 'Oslo, NO', m: 92, icon: Briefcase, color: '#00A4EF', t: '1 d'}
            ]" :key="i" 
            @click="openJobDetail(match)"
            class="bg-gradient-to-br from-[#BDDAFA]/25 via-[#F1F5F9] to-[#EDF2F7] rounded-[2.5rem] px-5 pt-1.5 pb-2 border border-white shadow-[0_50px_120px_-40px_rgba(0,0,0,0.25)] relative overflow-hidden group hover:scale-[1.01] transition-all cursor-pointer select-none">
               
               <!-- SUPREME SYMMETRY CONTAINER (V6.5 - ALPHA SYNC) -->
               <div class="flex items-start justify-between relative z-10 mb-1.5 min-h-[58px] pt-1.5">
                  <!-- LEFT: IDENTITY UNIT -->
                  <div class="flex items-start gap-3.5 h-full">
                     <div class="w-10 h-10 rounded-[1rem] p-2 flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.4)] ring-1 ring-white/10 shrink-0 transform group-hover:rotate-6 transition-transform" :style="{ backgroundColor: match.color }">
                        <component :is="match.icon" class="w-full h-full text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" />
                     </div>
                     <div class="flex flex-col pt-[1px]">
                        <h3 class="text-[16px] font-black text-[#0A2647] tracking-tight leading-[1.1] font-jakarta">{{ match.r }}</h3>
                        <div class="flex items-center gap-1.5 mt-1">
                           <span class="text-[10.5px] font-black text-[#0A2647]/55 tracking-wide font-jakarta">{{ match.c }}</span>
                           <div class="w-1 h-1 bg-[#0A2647]/10 rounded-full"></div>
                           <span class="text-[9px] font-bold text-[#C1A172] uppercase tracking-[0.1em]">{{ t('matches.posted', { time: match.t }) }}</span>
                        </div>
                     </div>
                  </div>
 
                  <!-- RIGHT: METRIC HUB (DYNAMIC GLOW) -->
                  <div class="flex flex-col items-end pt-[2px] h-full">
                     <div class="bg-gradient-to-br from-[#C1A172] to-[#FFD700] px-2 py-1 rounded-lg shadow-[0_8px_20px_rgba(193,161,114,0.3)] border border-white/20 flex items-baseline gap-1 scale-100 group-hover:scale-105 transition-transform">
                        <span class="text-[11px] font-black text-[#0A2647] leading-none">{{ match.m }}%</span>
                        <span class="text-[7px] font-black text-[#0A2647]/60 uppercase tracking-tighter">Match</span>
                     </div>
                  </div>
               </div>
 
               <!-- TIER 3: LOCATION & INTELLIGENCE HUD (V6.5 TIGHTENED) -->
               <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-black/[0.03] mx-0.5">
                  <div class="flex items-center gap-2 font-jakarta opacity-85 px-[0.75px] hover:opacity-100 transition-opacity">
                     <Globe class="w-3 h-3 text-[#0A2647]" />
                     <span class="text-[10.5px] font-bold text-[#0A2647]/70 tracking-wide truncate">{{ match.l }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 bg-[#C1A172]/10 px-2 py-0.5 rounded-lg border border-[#C1A172]/20 group-hover:bg-[#C1A172]/20 transition-all">
                     <Zap class="w-2.5 h-2.5 text-[#C1A172]" />
                     <span class="text-[8px] font-black text-[#C1A172] uppercase tracking-tighter">{{ t('matches.instantTailorShort') || 'Tailor' }}</span>
                  </div>
               </div>
               
               <!-- FOOTER: ELITE ACTION CONTROL -->
               <div class="flex items-center justify-between pt-0.5 pb-0.5">
                  <div class="flex items-center gap-3">
                     <div class="flex -space-x-2.5">
                        <div v-for="j in 3" :key="j" class="w-5 h-5 rounded-full border-2 border-[#0A2647] overflow-hidden group-hover:border-white/10 transition-colors">
                           <img :src="'https://i.pravatar.cc/50?u=' + (i+j)" class="w-full h-full object-cover contrast-125" />
                        </div>
                     </div>
                     <span class="text-[8.5px] font-black text-[#0A2647]/35 uppercase tracking-wider font-jakarta">{{ t('matches.applicantsCount', { count: 12 }) }}</span>
                  </div>
                  <div class="flex gap-1.5 justify-end items-center relative z-[100]">
                     <button @click.stop="handleDashboardAction('save_match')" class="bg-white/5 border border-white/10 text-white/30 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 hover:text-white transition-all active:scale-90 group-hover:border-white/20">
                        <Star class="w-3 h-3" />
                     </button>
                     <button @click.stop="handleDashboardAction('tailor_cv')" class="bg-[#C1A172] text-[#0A2647] w-[90px] py-1 rounded-xl text-[8px] font-black uppercase tracking-[0.05em] shadow-[0_8px_15px_rgba(193,161,114,0.25)] hover:scale-[1.02] active:scale-95 transition-all font-jakarta relative overflow-hidden text-center">
                        {{ t('matches.instantTailorShort') || 'Tailor CV' }}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- PROFILE VIEW (V6.0 - PACKED ARCHITECTURE) -->
      <div v-else-if="activeTab === 'profile'" class="flex flex-col animate-in fade-in slide-in-from-right-10 duration-500 overflow-hidden h-full">
         <!-- Top Branding Hub (CENTERED SYNC) -->
         <header class="flex flex-col items-center pt-[18px] space-y-4 w-full relative z-[600]">
           <div class="p-0.5 bg-white/10 rounded-full">
              <img src="/digynex-icon.png" alt="DigyNex" class="h-8 w-auto opacity-50 contrast-125" />
           </div>
           <div class="flex flex-col items-center mb-1">
              <h2 class="text-[14px] font-black text-white/40 uppercase tracking-[0.3em] leading-none">{{ t('profile.title') }}</h2>
           </div>
         </header>
         
          <div class="mt-4 flex-1 overflow-y-auto custom-scrollbar space-y-3 px-4 pb-[94px] relative">
             <!-- GLOBAL PRIVACY LOCK (PROFILE GUEST MODE) -->
             <div v-if="!isAuthenticated" class="absolute inset-x-0 inset-y-0 z-[100] flex flex-col items-center justify-center px-8 text-center bg-[#0A2647]/40 backdrop-blur-md rounded-[3rem] h-[calc(100%-110px)] top-1 mx-4">
                <div class="w-full max-w-[280px] bg-[#0A2647] border border-white/10 rounded-[2.5rem] p-8 shadow-3xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
                   <div class="w-12 h-12 bg-[#C1A172]/10 rounded-2xl flex items-center justify-center border border-[#C1A172]/20">
                      <ShieldCheck class="w-6 h-6 text-[#C1A172]" />
                   </div>
                   <div class="space-y-1">
                      <h3 class="text-[11px] font-black text-white uppercase tracking-[0.2em]">IDENTITY HUB LOCKED</h3>
                      <p class="text-[8px] font-black text-white/30 uppercase tracking-[0.1em] leading-relaxed">Personal data ingestion and AI profiling are restricted to authorized users.</p>
                   </div>
                   <button @click="isAuthOpen = true" class="mt-2 w-full py-3 bg-[#C1A172] rounded-xl text-[9px] font-black text-[#0A2647] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Unlock Master Access</button>
                </div>
             </div>

             <div :class="{ 'filter blur-[10px] select-none pointer-events-none opacity-40': !isAuthenticated }" class="space-y-3">

            
            <!-- AI GENERATOR HUB (PACKED ELITE CARD) -->
            <div class="bg-gradient-to-br from-[#BDDAFA]/25 via-[#F1F5F9] to-[#EDF2F7] rounded-[2.5rem] px-5 pt-2 pb-2.5 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.25)] border border-white relative overflow-hidden group">
               <div class="flex items-center justify-between mb-3 px-1">
                  <div class="flex items-center gap-2">
                     <div class="bg-[#0A2647]/5 p-2 rounded-xl">
                        <Sparkles class="w-4 h-4 text-[#0A2647]" />
                     </div>
                     <span class="text-[10px] font-black text-[#0A2647]/50 uppercase tracking-[0.2em]">AI Master Builder</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span class="text-[8px] font-black text-[#0A2647]/30 uppercase">Active Core</span>
                  </div>
               </div>
               
               <div class="space-y-3">
                  <button @click="openLinkedInModal" :class="linkedInConnected ? 'bg-[#0077b5]' : 'bg-[#0A2647]'" class="w-full py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_12px_25px_rgba(0,0,0,0.15)] hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group/btn">
                     <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                     <Linkedin class="w-4 h-4 text-white" />
                     <span class="text-[11px] font-black text-white uppercase tracking-widest relative z-10">
                        {{ linkedInConnected ? 'Ingested: ' + linkedInUrlInput.substring(0,10) + '...' : 'One-Click Ingestion' }}
                     </span>
                  </button>
                  
                  <div class="grid grid-cols-2 gap-2 w-[88%] mx-auto pb-0">
                      <button @click="isManualFormOpen = true" class="bg-[#0A2647]/5 border border-[#0A2647]/10 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#0A2647]/10 transition-all text-[#0A2647]/60 active:scale-95 group/manual">
                          <User class="w-3 h-3 group-hover/manual:rotate-12 transition-transform" />
                          <span class="text-[8px] font-black uppercase tracking-widest">Manual Setup</span>
                      </button>
                      <button @click="compileLatex" class="bg-[#C1A172] py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_8px_15px_rgba(193,161,114,0.25)] hover:scale-[1.02] transition-all text-[#0A2647] active:scale-95">
                          <FileText v-if="!isCompilingLatex" class="w-3 h-3" />
                          <div v-else class="w-3 h-3 rounded-full border-2 border-[#0A2647]/40 border-t-[#0A2647] animate-spin"></div>
                          <span class="text-[8px] font-black uppercase tracking-widest">{{ isCompilingLatex ? 'Compiling' : 'Global Export' }}</span>
                      </button>
                  </div>
               </div>
            </div>

            <!-- CV MANAGEMENT (MATCHED ARCHITECTURE) -->
            <div class="bg-gradient-to-br from-[#BDDAFA]/25 via-[#F1F5F9] to-[#EDF2F7] rounded-[2.5rem] px-5 pt-2 pb-2.5 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.25)] border border-white relative overflow-hidden group">
               <div class="flex items-center justify-between mb-4">
                  <div class="flex flex-col">
                     <span class="text-[9px] font-black text-[#0A2647]/50 uppercase tracking-[0.2em] mb-1">Legacy CV Core</span>
                     <p class="text-[14px] font-black text-[#0A2647] tracking-tight truncate w-40">{{ uploadedFileName }}</p>
                  </div>
                  <div class="bg-[#0A2647] p-2.5 rounded-xl shadow-lg transform group-hover:rotate-6 transition-transform">
                     <FileText class="w-5 h-5 text-[#C1A172]" />
                  </div>
               </div>
               
               <!-- Active Focus Slots (PACKED) -->
               <div class="mb-4 bg-[#0A2647]/5 rounded-2xl p-4 border border-[#0A2647]/5">
                  <div class="flex items-center justify-between mb-2">
                     <span class="text-[9px] font-black text-[#0A2647]/50 uppercase tracking-widest">Pipeline Bandwidth</span>
                     <span class="text-[10px] font-black text-[#0A2647]">{{ activeFocusSlots.used }} / {{ activeFocusSlots.total }} Slots</span>
                  </div>
                  <div class="w-full h-2 bg-[#0A2647]/10 rounded-full overflow-hidden shadow-inner p-[1px]">
                     <div class="h-full bg-gradient-to-r from-[#2C74B3] to-[#C1A172] rounded-full transition-all duration-1000 shadow-sm" :style="`width: ${(activeFocusSlots.used / activeFocusSlots.total) * 100}%`"></div>
                  </div>
               </div>

               <div class="space-y-3">
                  <input type="file" ref="fileInput" @change="handleFileUpload" class="hidden" accept=".pdf,.doc,.docx" />
                  <button @click="triggerFileUpload" class="w-[88%] mx-auto bg-[#0A2647]/5 border border-[#0A2647]/10 py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all group/upload active:scale-95 hover:bg-[#0A2647]/10 shadow-sm">
                     <Zap v-if="!isUploadingCV" class="w-4 h-4 text-[#0A2647]/20 group-hover/upload:text-[#2C74B3] transition-colors" />
                     <div v-else class="w-4 h-4 rounded-full border-2 border-[#0A2647]/20 border-t-[#0A2647] animate-spin"></div>
                     <span class="text-[11px] font-black text-[#0A2647]/40 group-hover/upload:text-[#0A2647] uppercase tracking-widest transition-colors">{{ isUploadingCV ? 'Syncing...' : 'Upload Professional CV' }}</span>
                  </button>
                  <button @click="isCVModalOpen = true" class="w-[88%] mx-auto bg-[#0A2647] py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#0A2647]/20">
                     <span class="text-[11px] font-black text-white uppercase tracking-widest">SECURE VIEW ENGINE</span>
                  </button>
               </div>
            </div>
            
            <!-- FIELDS OF INTEREST (PACKED CARD) -->
            <div class="bg-gradient-to-br from-[#BDDAFA]/25 via-[#F1F5F9] to-[#EDF2F7] rounded-[2.5rem] px-5 pt-2 pb-2.5 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.25)] border border-white relative">
               <span class="text-[9px] font-black text-[#0A2647]/50 uppercase tracking-[0.2em] mb-2 block">Strategic Specialization</span>
               <div class="flex flex-wrap gap-1.5 mb-2">
                  <TransitionGroup name="fade">
                     <div v-for="(field, index) in fieldsOfInterest" :key="field" 
                          class="px-4 py-2 bg-[#0A2647]/5 rounded-full border border-[#0A2647]/10 flex items-center gap-2 group cursor-pointer hover:bg-[#0A2647]/10 transition-all select-none shadow-sm">
                        <span class="text-[10px] font-black text-[#0A2647]/70">{{ field }}</span>
                        <X @click="removeField(index)" class="w-3 h-3 text-[#0A2647]/20 hover:text-red-500 transition-colors" />
                     </div>
                  </TransitionGroup>
               </div>
               <div class="relative w-[88%] mx-auto mt-2">
                  <input v-model="newField" @keyup.enter="addField" type="text" placeholder="Target Field..." 
                         class="w-full bg-[#0A2647]/5 border border-[#0A2647]/10 rounded-2xl px-4 py-2.5 text-[10px] text-[#0A2647] placeholder:text-[#0A2647]/45 focus:outline-none focus:ring-1 focus:ring-[#C1A172] transition-all font-jakarta shadow-inner" />
                  <div @click="addField" class="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0A2647] p-1.5 rounded-lg shadow-lg cursor-pointer transition-colors active:scale-95 text-white">
                     <ArrowRight class="w-2.5 h-2.5" />
                  </div>
               </div>
            </div>
            
            <button @click="saveProfile" class="w-[88%] mx-auto mt-6 bg-gradient-to-r from-[#C1A172] to-[#FFD700] py-2.5 rounded-[1.8rem] flex items-center justify-center gap-2 shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all group relative overflow-hidden shrink-0">
               <div v-if="isSavingProfile" class="w-3.5 h-3.5 rounded-full border-2 border-[#0A2647]/50 border-t-[#0A2647] animate-spin relative z-10"></div>
               <span class="text-[11.5px] font-black text-[#0A2647] uppercase tracking-[0.2em] relative z-10">{{ isSavingProfile ? 'UPDATING...' : 'SAVE EXPERT IDENTITY' }}</span>
               <ShieldCheck v-if="!isSavingProfile" class="w-3.5 h-3.5 text-[#0A2647]/40" />
            </button>
         </div>
      </div>
   </div>

       <!-- CV STUDIO HUB (MAGIC CENTER) -->
       <div v-else-if="activeTab === 'studio'" class="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500 pb-[90px]">
          <!-- Top Branding Hub -->
          <header class="flex flex-col items-center pt-[18px] space-y-4 w-full relative z-[600]">
            <div class="p-0.5 bg-white/10 rounded-full shrink-0">
               <img src="/digynex-icon.png" alt="DigyNex" class="h-8 w-auto opacity-50 contrast-125" />
            </div>
            <div class="flex flex-col items-center mb-1">
               <h2 class="text-[14px] font-black text-white/40 uppercase tracking-[0.3em] leading-none">CV Studio</h2>
               <div v-if="userProfile.isSuperUser" class="mt-2 px-3 py-1 bg-[#C1A172]/10 border border-[#C1A172]/20 rounded-full flex items-center gap-2 animate-in slide-in-from-top-2 duration-500">
                  <div class="w-1 h-1 rounded-full bg-[#C1A172] animate-pulse shadow-[0_0_8px_#C1A172]"></div>
                  <span class="text-[7px] font-black text-[#C1A172] uppercase tracking-[0.2em]">Super User Sync Active</span>
               </div>
            </div>
          </header>

          <div class="mt-6 flex-1 overflow-y-auto space-y-6 px-4 custom-scrollbar">
             <!-- 1. TEMPLATE GALLERY (HORIZONTAL) -->
             <div class="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/10 shadow-2xl overflow-visible group relative">
                <div class="flex justify-between items-center mb-3">
                   <div class="flex flex-col">
                      <span class="text-[9px] font-black text-[#C1A172] uppercase tracking-[0.2em] mb-1">Elite Selection</span>
                      <h3 class="text-[14px] font-black text-white tracking-tight">Template Gallery</h3>
                   </div>
                   <span class="text-[8px] font-bold text-white/20 uppercase tracking-widest">{{ cvTemplates.length }} Styles Active</span>
                </div>
                
                <!-- Premium Scroll Gallery (Fundamental Carousel Engine) -->
                <div class="flex flex-nowrap gap-4 overflow-x-auto pb-10 -mx-4 px-4 snap-x snap-mandatory scroll-smooth min-h-[220px] custom-horizontal-scrollbar">
                   <div v-for="t in cvTemplates" :key="t.id" 
                        @click="selectedTemplate = t.id"
                        class="w-[140px] h-[195px] bg-gradient-to-br from-white/10 to-white/5 rounded-[2rem] shrink-0 border-2 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group/thumb snap-center"
                        :class="selectedTemplate === t.id ? 'scale-[1.05]' : 'border-white/5 hover:border-white/20 hover:scale-[1.02]'"
                        :style="selectedTemplate === t.id ? { borderColor: userProfile.primaryColor, boxShadow: `0 20px 50px ${userProfile.primaryColor}20` } : {}">
                      
                      <div class="absolute inset-0 w-full h-full overflow-hidden">
                         <img :src="t.image" class="w-full h-full object-top opacity-50 group-hover/thumb:opacity-90 group-hover/thumb:scale-110 transition-all duration-[1500ms]"
                              :style="{ filter: `hue-rotate(${userProfile.primaryColor === '#0A2647' ? '0deg' : userProfile.primaryColor === '#334155' ? '180deg' : userProfile.primaryColor === '#1A1A1A' ? '45deg' : '280deg'}) saturate(1.2)` }" />
                      </div>
                      
                      <div class="w-full h-full absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                      
                      <!-- ACTION: SELECT (TICK) -->
                      <div v-if="selectedTemplate === t.id" class="absolute top-5 right-5 p-2 rounded-full shadow-lg z-20 animate-in zoom-in duration-500"
                           :style="{ backgroundColor: userProfile.primaryColor }">
                         <Check class="w-4 h-4 text-[#0A2647]" />
                      </div>

                      <!-- ACTION: PREVIEW (ZOOM) -->
                      <button @click.stop="selectTemplate(t)" 
                              class="absolute top-5 left-5 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover/thumb:opacity-100 transition-all z-20 hover:bg-[#C1A172] hover:text-[#0A2647] text-white"
                              :style="{ '--hover-bg': userProfile.primaryColor }"
                              :class="'hover:bg-[var(--hover-bg)]'">
                         <Maximize2 class="w-3.5 h-3.5" />
                      </button>
                      
                      <div class="absolute bottom-4 flex flex-col items-center z-10 px-6 text-center">
                         <span class="text-[10px] font-black text-white uppercase tracking-[0.1em] leading-tight mb-0.5">{{ t.name }}</span>
                         <span class="text-[9px] font-black uppercase tracking-[0.3em] opacity-80"
                               :style="{ color: userProfile.primaryColor }">{{ t.tag }}</span>
                      </div>

                      <!-- Tier Indicator -->
                      <div v-if="t.id > 4 && !userProfile.isSuperUser" class="absolute bottom-12 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 z-20">
                         <span class="text-[7.5px] font-black text-white uppercase tracking-widest">Premium</span>
                      </div>
                      <div v-else-if="t.id > 4" class="absolute bottom-12 px-3 py-1 bg-[#C1A172]/20 backdrop-blur-md rounded-full border border-[#C1A172]/30 z-20">
                         <span class="text-[7px] font-black text-[#C1A172] uppercase tracking-widest animate-pulse">EPIC ACCESS</span>
                      </div>
                   </div>

                   <!-- Locked/Future Slots (Carousel Extensions) -->
                   <div v-for="i in [1,2,3]" :key="'locked-' + i" 
                        class="w-[140px] h-[195px] bg-white/[0.02] rounded-[2rem] shrink-0 border border-white/5 flex flex-col items-center justify-center gap-4 opacity-30 snap-center">
                      <div class="p-4 bg-white/5 rounded-2xl">
                         <Lock class="w-6 h-6 text-white/20" />
                      </div>
                      <span class="text-[9px] font-black text-white/20 uppercase tracking-[0.25em] text-center px-8">Coming<br/>Soon</span>
                   </div>
                </div>
             </div>

             <!-- 2. STEALTH STRATEGY (LOCKED FOR CONVERSION) -->
             <div class="bg-gradient-to-br from-[#0A2647] via-[#0D1B2A] to-black rounded-[2.5rem] p-6 border border-white/10 shadow-3xl relative overflow-hidden group/stealth">
                
                <!-- LOCKED STATE -->
                <div v-if="!isStealthUnlocked" class="relative z-10 animate-in fade-in duration-500">
                   <div class="flex justify-between items-center mb-3">
                      <div class="flex flex-col">
                         <span class="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Strategic Edge</span>
                         <h3 class="text-[14px] font-black text-white tracking-tight">AI Stealth Keywords</h3>
                      </div>
                      <Lock class="w-4 h-4 text-white/20" />
                   </div>
                   <p class="text-[10px] font-medium text-white/40 leading-relaxed mb-5">Embed invisible, AI-optimized keywords into your CV to increase ATS rankings by up to 95%. Exclusive to Elite & Pro tiers.</p>
                   <button @click="isStealthUnlocked = true" class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl text-[10.5px] font-black text-white uppercase tracking-widest shadow-xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all">
                      Initialize Stealth Strategy
                   </button>
                </div>

                <!-- UNLOCKED: SURGICAL COMMAND CENTER -->
                <div v-else class="relative z-10 animate-in slide-in-from-bottom duration-500">
                   <div class="flex justify-between items-start mb-[15px]">
                      <div class="flex flex-col">
                         <span class="text-[9px] font-black text-[#73BBA3] uppercase tracking-[0.2em] mb-1">Stealth Hub Active</span>
                         <h3 class="text-[14px] font-black text-white tracking-tight leading-none">Neural Keyword Vault</h3>
                      </div>
                      <!-- Stealth Strength Meter (Dynamic Circular Simulation) -->
                      <div class="relative w-12 h-12 flex items-center justify-center">
                         <svg class="w-full h-full -rotate-90">
                            <circle cx="24" cy="24" r="20" fill="none" class="stroke-white/5" stroke-width="3" />
                            <circle cx="24" cy="24" r="20" fill="none" class="stroke-[#73BBA3] transition-all duration-1000" stroke-width="3" 
                                    :stroke-dasharray="125.6" :stroke-dashoffset="125.6 * (1 - masterProfile.secretKeywords.length / 10)" 
                                    stroke-linecap="round" />
                         </svg>
                         <span class="absolute text-[8px] font-black text-[#73BBA3]">{{ Math.min(masterProfile.secretKeywords.length * 10, 100) }}%</span>
                      </div>
                   </div>

                   <!-- Keyword Entry & Flow -->
                   <div class="space-y-4">
                      <div class="flex flex-wrap gap-2 min-h-[40px]">
                         <div v-for="k in masterProfile.secretKeywords" :key="k" 
                              class="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 group/tag hover:border-[#73BBA3]/30 transition-all">
                            <span class="text-[9px] font-bold text-white/60 group-hover/tag:text-white transition-colors">{{ k }}</span>
                            <X @click="removeSecretKeyword(k)" class="w-3 h-3 text-white/20 hover:text-red-400 cursor-pointer" />
                         </div>
                      </div>

                      <div class="relative group/input">
                         <input v-model="newSecretKeyword" @keyup.enter="addSecretKeyword" 
                                type="text" placeholder="Inject Professional Keyword..." 
                                class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#73BBA3] transition-all" />
                         <div @click="addSecretKeyword" class="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#73BBA3] rounded-lg cursor-pointer hover:scale-110 active:scale-95 transition-all">
                            <Plus class="w-3.5 h-3.5 text-[#0A2647]" />
                         </div>
                      </div>

                      <!-- AI RECALIBRATION TRIGGER -->
                      <button @click="analyzeAndSuggestKeywords" 
                              class="w-full py-3.5 bg-white/5 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 group/ai transition-all hover:bg-white/10">
                         <div v-if="isAnalyzingKeywords" class="w-3 h-3 rounded-full border-2 border-[#73BBA3] border-t-transparent animate-spin"></div>
                         <Sparkles v-else class="w-4 h-4 text-[#73BBA3] group-hover/ai:rotate-12 transition-transform" />
                         <span class="text-[10px] font-black text-white/60 uppercase tracking-widest group-hover/ai:text-white transition-colors">
                            {{ isAnalyzingKeywords ? 'Neural Audit Running...' : 'Neural AI Suggestion' }}
                         </span>
                      </button>
                   </div>
                </div>

                <Sparkles class="absolute -right-6 -bottom-6 w-24 h-24 text-white/5 rotate-12 group-hover/stealth:scale-110 group-hover/stealth:text-white/10 transition-all duration-1000" />
             </div>

             <!-- 3. VISUAL BRANDING (THEMING ENGINE) -->
             <div class="bg-white/5 rounded-[2.5rem] p-6 border border-white/10 shadow-xl relative overflow-hidden group/branding">
                <!-- Syncing Overlay -->
                <div v-if="isBrandingSyncing" class="absolute inset-0 z-20 bg-[#0A2647]/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                   <div class="flex flex-col items-center gap-3">
                      <div class="w-6 h-6 rounded-full border-2 border-[#C1A172] border-t-transparent animate-spin"></div>
                      <span class="text-[9px] font-black text-[#C1A172] uppercase tracking-widest">Applying Theme...</span>
                   </div>
                </div>

                <div class="flex justify-between items-center mb-[15px] relative z-10">
                   <div class="flex flex-col">
                      <span class="text-[9px] font-black text-[#C1A172] uppercase tracking-[0.2em] mb-1">Visual Identity</span>
                      <h3 class="text-[14px] font-black text-white tracking-tight leading-none">Global Aesthetic Presets</h3>
                   </div>
                   <div class="flex gap-1.5">
                      <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: userProfile.primaryColor }"></div>
                      <div class="w-2 h-2 rounded-full opacity-40" :style="{ backgroundColor: userProfile.secondaryColor }"></div>
                   </div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 mb-6 relative z-10">
                   <div v-for="p in colorPresets" :key="p.name" 
                        @click="selectPreset(p)"
                        class="p-4 bg-white/5 rounded-3xl border transition-all cursor-pointer flex flex-col items-start gap-4 group/p active:scale-95"
                        :class="userProfile.primaryColor === p.primary ? 'bg-white/10 shadow-lg shadow-black/40' : 'border-white/5 hover:border-white/20'"
                        :style="userProfile.primaryColor === p.primary ? { borderColor: p.secondary } : {}">
                      
                      <div class="w-full flex justify-between items-start">
                         <div class="flex -space-x-2">
                            <div class="w-8 h-8 rounded-full border-2 border-[#0A2647] shadow-sm" :style="{ backgroundColor: p.primary }"></div>
                            <div class="w-8 h-8 rounded-full border-2 border-[#0A2647] shadow-sm" :style="{ backgroundColor: p.secondary }"></div>
                         </div>
                         <Lock v-if="p.tier > 1 && !userProfile.isSuperUser" class="w-3.5 h-3.5 text-white/20" />
                         <div v-else-if="userProfile.primaryColor === p.primary" class="bg-[#C1A172] p-1 rounded-full animate-in zoom-in duration-300">
                            <Check class="w-2.5 h-2.5 text-[#0A2647]" />
                         </div>
                         <div v-else-if="p.tier > 1" class="text-[7px] font-black text-[#C1A172] uppercase tracking-tighter opacity-50">UNLOCKED</div>
                      </div>

                      <div class="flex flex-col">
                         <span class="text-[10px] font-black text-white uppercase tracking-[0.05em] leading-tight">{{ p.name }}</span>
                         <span class="text-[7.5px] font-bold text-white/30 uppercase tracking-[0.1em] mt-0.5">{{ p.tier > 1 ? 'Expert Tier' : 'Standard' }}</span>
                      </div>
                   </div>
                </div>
                
                <!-- HD LIVE VIEWPORT (IFRAME INJECTION) -->
                <div class="mt-6 p-4 bg-white/[0.03] rounded-[2.5rem] border border-white/10 relative z-10 flex flex-col gap-4 group/viewport transition-all hover:bg-white/[0.05]">
                   <div class="flex justify-between items-center px-2">
                      <div class="flex flex-col">
                         <span class="text-[9px] font-black text-[#C1A172] uppercase tracking-widest mb-1">HD Live Viewport</span>
                         <span class="text-[10px] font-black text-white/40 uppercase tracking-tight">Active Rendering Engine</span>
                      </div>
                      <div class="flex gap-1.5 items-center">
                         <div class="w-1.5 h-1.5 rounded-full bg-[#73BBA3] animate-pulse shadow-[0_0_8px_#73BBA3]"></div>
                         <span class="text-[8px] font-black text-[#73BBA3] uppercase tracking-widest">Live Sync</span>
                      </div>
                   </div>
                   
                   <!-- DYNAMIC VIEWPORT (HIGH-FIDELITY IFRAME ENGINE) -->
                    <div class="w-full h-[400px] bg-white rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl relative group-hover/viewport:border-[#C1A172]/30 transition-all"
                         id="live-viewport">
                       
                       <iframe v-if="viewportHtml" 
                               :srcdoc="viewportHtml"
                               class="w-[794px] h-[1123px] border-none absolute left-1/2 top-1 origin-top"
                               style="transform: translateX(-50%) scale(0.35);"
                               title="CV Specimen Preview"></iframe>
                       
                       <div v-else class="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                          <div class="flex flex-col items-center gap-2">
                             <div class="w-5 h-5 rounded-full border-2 border-[#C1A172] border-t-transparent animate-spin"></div>
                             <span class="text-[8px] font-black text-[#0A2647]/40 uppercase tracking-widest">Warming Engine...</span>
                          </div>
                       </div>
                       
                       <!-- Glass Overlay for Texture (Non-blocking) -->
                       <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0A2647]/5 to-transparent opacity-40 z-20"></div>
                    </div>
                   
                   <p class="text-[9px] text-white/30 leading-tight font-bold italic px-2">
                      "Design dynamically recalibrated for high-velocity screening."
                   </p>
                </div>
             </div>



             <!-- 6. AI SUCCESS METER (DIAGNOSTIC) -->
             <div class="mt-8 pt-5 border-t border-white/5">
                <div class="flex justify-between items-center mb-3">
                   <span class="text-[9px] font-black text-white/40 uppercase tracking-widest">Global CV Strength</span>
                   <span class="text-[14px] font-black text-[#73BBA3] tracking-tighter animate-pulse">98.4%</span>
                </div>
                <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-[1px]">
                   <div class="h-full bg-gradient-to-r from-blue-500 via-[#73BBA3] to-[#C1A172] rounded-full transition-all duration-1000 shadow-sm" style="width: 98.4%"></div>
                </div>
                <p class="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1.5 text-center italic">Elite Optimization Architecture Engaged</p>
                
                <!-- GLOBAL SYNC CTA (STUDIO SPECIFIC) -->
                <button @click="saveProfile" class="w-full mt-2 mb-[15px] bg-gradient-to-r from-[#C1A172] to-[#FFD700] py-3 rounded-[1.8rem] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:scale-[1.02] active:scale-95 transition-all group relative overflow-hidden">
                   <div v-if="isSavingProfile" class="w-4 h-4 rounded-full border-2 border-[#0A2647]/50 border-t-[#0A2647] animate-spin relative z-10"></div>
                   <RefreshCw v-else class="w-4 h-4 text-[#0A2647]/40 group-hover:rotate-180 transition-transform duration-700" />
                   <span class="text-[12px] font-black text-[#0A2647] uppercase tracking-[0.2em] relative z-10">{{ isSavingProfile ? 'Syncing...' : 'Sync Studio to Master' }}</span>
                </button>
             </div>
          </div>
       </div>

      <!-- PLACEHOLDERS FOR OTHER TABS -->
      <div v-else class="flex flex-col items-center justify-center py-40 text-center space-y-4">
         <div class="bg-white/5 p-6 rounded-full animate-bounce">
            <Globe class="w-10 h-10 text-white/20" />
         </div>
         <h2 class="text-[18px] font-black text-white/60 uppercase tracking-widest">{{ activeTab }}</h2>
         <p class="text-[12px] font-medium text-white/30 italic">Initializing Global Modules...</p>
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
                        <h3 class="text-xs font-black text-white/90 uppercase tracking-widest">Document Preview</h3>
                        <p class="text-[9px] font-bold text-[#C1A172] uppercase tracking-[0.2em] mt-0.5 italic">Amila_Senior_CV.pdf (Masked)</p>
                     </div>
                  </div>
                  <button @click="isCVModalOpen = false" class="p-2.5 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400 text-white/50 transition-colors">
                     <X class="w-5 h-5" />
                  </button>
               </div>

               <div class="p-8 flex-1 overflow-y-auto no-scrollbar relative w-full bg-white">
                  <!-- Privacy Overlay -->
                  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-black/60 backdrop-blur-[3px]">
                     <div class="bg-[#0A2647] border border-red-500/30 px-6 py-4 rounded-3xl shadow-2xl text-center max-w-[280px]">
                        <div class="mx-auto w-10 h-10 bg-red-500/10 flex items-center justify-center rounded-full mb-3">
                           <FileText class="w-5 h-5 text-red-400" />
                        </div>
                        <h4 class="text-red-400 text-[11px] font-black uppercase tracking-widest mb-1.5">Privacy Lock Engaged</h4>
                        <p class="text-[9.5px] font-medium text-white/60 leading-tight">For GDPR compliance and data protection, full document rendering is restricted in this environment. The raw PDF is securely stored.</p>
                     </div>
                  </div>
                  
                  <!-- Mock CV Lines (Blurred heavily) -->
                  <div class="opacity-30 blur-sm pointer-events-none space-y-6">
                     <!-- Header Mock -->
                     <div class="border-b-2 border-gray-800 pb-4">
                        <div class="h-6 w-48 bg-gray-600 rounded mb-2"></div>
                        <div class="flex gap-2 mb-4">
                           <div class="h-2 w-24 bg-gray-400 rounded"></div>
                           <div class="h-2 w-32 bg-gray-400 rounded"></div>
                           <div class="h-2 w-20 bg-gray-400 rounded"></div>
                        </div>
                     </div>
                     <!-- Summary Mock -->
                     <div class="space-y-1">
                        <div class="h-4 w-32 bg-gray-700 rounded mb-2"></div>
                        <div class="h-2 w-full bg-gray-400 rounded"></div>
                        <div class="h-2 w-full bg-gray-400 rounded"></div>
                        <div class="h-2 w-3/4 bg-gray-400 rounded"></div>
                     </div>
                     <!-- Experience Mock -->
                     <div class="space-y-4">
                        <div class="h-4 w-40 bg-gray-700 rounded mb-2"></div>
                        <div class="space-y-1">
                           <div class="h-3 w-48 bg-gray-600 rounded"></div>
                           <div class="h-2 w-24 bg-gray-400 rounded mb-2"></div>
                           <div class="h-2 w-full bg-gray-400 rounded"></div>
                           <div class="h-2 w-5/6 bg-gray-400 rounded"></div>
                           <div class="h-2 w-full bg-gray-400 rounded"></div>
                        </div>
                        <div class="space-y-1 mt-4">
                           <div class="h-3 w-56 bg-gray-600 rounded"></div>
                           <div class="h-2 w-32 bg-gray-400 rounded mb-2"></div>
                           <div class="h-2 w-full bg-gray-400 rounded"></div>
                           <div class="h-2 w-4/5 bg-gray-400 rounded"></div>
                        </div>
                     </div>
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

      <div v-if="!isManualFormOpen && !isLinkedInModalOpen" class="absolute bottom-[67px] left-0 right-0 flex flex-col items-center z-[990] pointer-events-none">
        <div class="flex items-center gap-2.5 opacity-50">
           <span class="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">{{ t('footer.poweredBy') }}</span>
           <img src="/digynex-icon.png" alt="DigyNex" class="h-3 w-auto object-contain opacity-50" />
           <span class="text-[9px] font-black text-[#C1A172] uppercase tracking-[0.1em]">DigyNex</span>
        </div>
        <p class="text-[6.5px] font-black text-white/35 tracking-[0.5em] uppercase mt-[1.5px] italic">{{ t('footer.engine') }} • {{ t('footer.version') }}</p>
      </div>

      <nav v-if="!isManualFormOpen && !isLinkedInModalOpen" 
           class="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] max-w-[300px] bg-[#0A2647]/50 backdrop-blur-3xl px-6 py-1.5 rounded-[2.5rem] flex items-center justify-around shadow-[0_45px_100px_-25px_rgba(0,0,0,0.6)] z-[1000] border border-white/10 ring-1 ring-white/10 transition-all">
        <div v-for="(icon, key) in { dashboard: LayoutDashboard, matches: Star, studio: Sparkles, profile: User }" :key="key" 
             @click="setTab(key)"
             class="flex flex-col items-center gap-0.5 group cursor-pointer relative active:scale-95 transition-all py-0.5">
          <component :is="icon" :class="activeTab === key ? 'text-[#C1A172] scale-105' : 'text-white/25'" class="w-4 h-4 transform transition-all hover:scale-110 shadow-sm" />
          <span class="text-[5.5px] font-black uppercase tracking-[0.2em] mt-0.5" :class="activeTab === key ? 'text-white' : 'text-white/20'">{{ key === 'dashboard' ? 'Home' : key === 'studio' ? 'CV Studio' : key }}</span>
          <div v-if="activeTab === key" class="absolute -bottom-1.5 w-1 h-1 bg-[#C1A172] rounded-full shadow-[0_0_12px_#C1A172]"></div>
        </div>
      </nav>

      <AuthOverlay 
        :isOpen="isAuthOpen" 
        :mode="authMode"
        @close="isAuthOpen = false" 
        @success="loginSuccess" 
      />

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
      />

      <!-- NEURAL GLOW TOAST (REAL-TIME FEEDBACK) -->
      <Transition name="fade">
        <div v-if="showToast" class="fixed top-12 left-1/2 -translate-x-1/2 z-[9999] w-[80%] max-w-[300px]">
           <div class="bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-3xl flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-[#C1A172] animate-pulse shadow-[0_0_10px_#C1A172]"></div>
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
    </Teleport>
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
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
