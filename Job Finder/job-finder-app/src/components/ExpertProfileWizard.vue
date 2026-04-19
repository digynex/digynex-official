<script setup>
import { ref } from 'vue'
import { 
  FileText, X, Sparkles, Zap, Mic, Download, Check, ChevronRight, ShieldCheck, 
  Linkedin, Github, Globe, LayoutDashboard, Briefcase, User 
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  profile: Object,
  activeCountry: String,
  isAuthenticated: Boolean
})

const emit = defineEmits(['close', 'finalize', 'requestAuth'])

// Local State (Wizard Mechanics Only)
const manualStep = ref(1)
const isCVPreviewOpen = ref(false)
const isAutoSyncingLinkedIn = ref(false)
const isSyncingManual = ref(false)
const isGeneratingAI = ref(false)
const isComparing = ref(false)
const aiComparison = ref({ field: '', original: '', drafted: '' })

// Shortcuts to props for live synchronization - these are direct links to the reactive profile object
const manualBasic = props.profile.basic
const manualSocialLinks = props.profile.socialLinks
const manualExperiences = props.profile.experiences
const manualEducation = props.profile.education
const manualProjects = props.profile.projects
const manualLanguages = props.profile.languages
const manualSkills = props.profile.skills

const skillInputTemp = ref({ type: 'hard', val: '' })

// Handlers
const syncLinkedInData = async () => {
   if (!manualSocialLinks[0].url) return;
   isAutoSyncingLinkedIn.value = true;
   await new Promise(res => setTimeout(res, 3500));
   
   manualBasic.fullName = "Amila Master Dev";
   manualBasic.headline = "Senior Full-Stack AI Automation Architect";
   manualBasic.location = "Colombo, Sri Lanka";
   
   props.profile.experiences = [
      { company: 'DigyNex Global', role: 'Head of Automation', type: 'Full-time', achievements: 'Directed 25+ high-stakes RPA missions reducing operational latency by 80%.', start: '2022', end: '', isCurrent: true },
      { company: 'TechNova Sync', role: 'Lead Software Engineer', type: 'Full-time', achievements: 'Architected scalable microservices using Deno and n8n orchestration.', start: '2020', end: '2022', isCurrent: false }
   ];
   
   manualSkills.hard = ['Architectural Design', 'n8n Logic', 'Gemini AI', 'Supabase V3', 'Docker-Compose'];
   isAutoSyncingLinkedIn.value = false;
}

const polishWithAI = async (field, currentVal) => {
   if (!currentVal || currentVal.length < 5) return;
   isGeneratingAI.value = true;
   await new Promise(res => setTimeout(res, 1800));
   const drafts = {
      bio: "High-performance Senior Automation Engineer with a decade of expertise in designing AI-powered systemic solutions. Proven track record in optimizing enterprise workflows using n8n and advanced Python frameworks.",
      achievements: "• Architected and deployed 50+ automated workflows reducing manual overhead by 65%.\n• Integrated Gemini AI models into legacy CRM systems, boosting lead conversion by 30%.\n• Led a cross-functional DevOps team to achieve 99.9% uptime on production clusters."
   };
   
   aiComparison.value = { 
      field, 
      original: currentVal, 
      drafted: drafts[field] || "AI Optimized: " + currentVal 
   };
   isComparing.value = true;
   isGeneratingAI.value = false;
}

const applyAIVersion = () => {
   if (aiComparison.value.field === 'bio') props.profile.bio = aiComparison.value.drafted;
   else if (aiComparison.value.field.includes('achievements_')) {
      const idx = parseInt(aiComparison.value.field.split('_')[1]);
      manualExperiences[idx].achievements = aiComparison.value.drafted;
   }
   isComparing.value = false;
}

const addSocialLink = () => manualSocialLinks.push({ platform: 'Link', url: '' })
const removeSocialLink = (idx) => manualSocialLinks.splice(idx, 1)

const addExperience = () => manualExperiences.push({ company: '', role: '', type: 'Full-time', achievements: '', start: '', end: '', isCurrent: false })
const removeExperience = (idx) => manualExperiences.splice(idx, 1)

const addEducation = () => manualEducation.push({ title: '', institution: '', year: '', gpa: '' })
const removeEducation = (idx) => manualEducation.splice(idx, 1)

const addProject = () => manualProjects.push({ name: '', link: '' })
const removeProject = (idx) => manualProjects.splice(idx, 1)

const addSkillTag = (type) => {
   const val = skillInputTemp.value.val.trim()
   if (val && !manualSkills[type].includes(val)) {
      manualSkills[type].push(val)
      skillInputTemp.value.val = ''
   }
}
const removeSkillTag = (type, idx) => manualSkills[type].splice(idx, 1)

const nextStep = () => { if(manualStep.value < 4) manualStep.value++ }
const prevStep = () => { if(manualStep.value > 1) manualStep.value-- }

const finalizeManualCV = async () => {
   isSyncingManual.value = true;
   await new Promise(res => setTimeout(res, 2200));
   isSyncingManual.value = false;
   emit('finalize');
   isCVPreviewOpen.value = false;
}
</script>

<template>
  <div>
    <!-- EXPERT PROFILE WIZARD OVERLAY -->
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[2000] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
        <!-- BACKDROP -->
        <div @click="emit('close')" class="absolute inset-0 bg-[#0A2647]/95 backdrop-blur-3xl"></div>
        
        <!-- MODAL CARD -->
        <div class="relative w-full max-w-[360px] bg-[#051124] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl flex flex-col max-h-[85vh]">
          <div class="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5">
            <div class="flex items-center gap-3">
              <div class="bg-[#C1A172]/20 p-2.5 rounded-xl border border-[#C1A172]/30">
                <FileText class="w-5 h-5 text-[#C1A172]" />
              </div>
              <div class="flex flex-col">
                <h2 class="text-[13px] font-black text-white uppercase tracking-[0.2em] leading-tight">EXPERT MASTER IDENTITY</h2>
                <p class="text-[9px] font-black text-[#C1A172]/60 uppercase tracking-widest mt-0.5">SYNC PROFESSIONAL CORE</p>
              </div>
            </div>
            <button @click="emit('close')" class="p-2.5 bg-white/5 rounded-full hover:bg-white/10 text-white/50 transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- STEPPER INDICATOR -->
          <div class="px-8 py-6 flex justify-between relative shrink-0">
            <div class="absolute top-1/2 left-8 right-8 h-[1px] bg-white/5 -translate-y-1/2 z-0"></div>
            <div v-for="step in 4" :key="step" class="relative z-10 flex flex-col items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all duration-500"
                   :class="manualStep === step ? 'bg-[#C1A172] border-[#C1A172] text-[#0A2647] shadow-[0_0_20px_rgba(193,161,114,0.4)] scale-110' : 
                           manualStep > step ? 'bg-[#2C74B3] border-[#2C74B3] text-white' : 'bg-[#051124] border-white/10 text-white/20'">
                {{ step }}
              </div>
              <span class="text-[7px] font-black uppercase tracking-widest" :class="manualStep === step ? 'text-[#C1A172]' : 'text-white/20'">
                {{ ['Identity', 'Experience', 'Skills', 'Finalize'][step-1] }}
              </span>
            </div>
          </div>

          <!-- TAB CONTENT (SCROLLABLE) -->
          <div class="flex-1 overflow-y-auto p-8 pt-2 custom-scrollbar">
            <!-- STEP 1: IDENTITY -->
            <div v-if="manualStep === 1" class="space-y-8 animate-in slide-in-from-right-4 duration-300">
               <div class="flex flex-col items-center gap-4 py-4 group">
                  <div class="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 relative bg-white/5 hover:border-[#C1A172]/40 transition-all cursor-pointer">
                     <User class="w-8 h-8 text-white/10 group-hover:text-[#C1A172]/40" />
                     <span class="text-[7px] font-black text-white/20 uppercase tracking-widest text-center px-4">Upload Headshot</span>
                  </div>
               </div>

               <div class="space-y-4">
                  <div class="space-y-1">
                     <label class="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Full Name</label>
                     <input v-model="manualBasic.fullName" type="text" placeholder="Amila Perera" class="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-[#C1A172]" />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                     <div class="space-y-1">
                        <label class="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Professional Email</label>
                        <input v-model="manualBasic.email" type="email" placeholder="amila@example.com" class="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-[#C1A172]" />
                     </div>
                     <div class="space-y-1">
                        <label class="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Phone (Global)</label>
                        <input v-model="manualBasic.phone" type="tel" placeholder="+94 77 ..." class="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-[#C1A172]" />
                     </div>
                  </div>

                  <!-- NEURAL IDENTITY OVERRIDE (V13.0) -->
                  <div class="p-5 bg-[#2C74B3]/5 border border-[#2C74B3]/10 rounded-2xl space-y-3 relative overflow-hidden group/apply">
                     <div class="flex items-center justify-between relative z-10">
                        <div class="flex flex-col">
                           <span class="text-[8px] font-black text-[#2C74B3] uppercase tracking-[0.2em] mb-0.5 italic">Application Identity</span>
                           <h4 class="text-[10px] font-black text-white uppercase tracking-tight leading-none">Job Board Sync Email</h4>
                        </div>
                        <div v-if="props.profile.emailVerified" class="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-1">
                           <Check class="w-2 h-2 text-green-400" />
                           <span class="text-[6px] font-black text-green-400 uppercase">Verified</span>
                        </div>
                     </div>
                     <div class="flex gap-2 relative z-10">
                        <input v-model="props.profile.applicationEmail" type="email" :placeholder="manualBasic.email || 'Application Email override...'" class="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-[11px] text-white/80 focus:outline-none focus:ring-1 focus:ring-[#2C74B3]/40" />
                        <button class="px-3 bg-[#2C74B3] rounded-xl text-[8px] font-black text-white uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Verify</button>
                     </div>
                     <p class="text-[7.5px] font-black text-white/20 uppercase tracking-widest leading-none">* Decouple your application identity from your login credentials</p>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                     <div class="space-y-1">
                        <label class="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Location (City, Country)</label>
                        <input v-model="manualBasic.location" type="text" placeholder="Colombo, Sri Lanka" class="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-[#C1A172]" />
                     </div>
                     <div class="space-y-1">
                        <label class="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Current Role / Designation</label>
                        <input v-model="manualBasic.headline" type="text" placeholder="Senior Automation Engineer" class="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-[#C1A172]" />
                     </div>
                  </div>
               </div>

               <div class="space-y-4">
                  <span class="text-[10px] font-black text-[#C1A172] uppercase tracking-[0.2em] border-b border-white/10 pb-1 block">Professional Proxies</span>
                  <div class="grid grid-cols-1 gap-2">
                     <div v-for="(link, idx) in manualSocialLinks" :key="idx" class="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-3 group focus-within:ring-1 focus-within:ring-[#C1A172]">
                        <input v-model="link.platform" type="text" class="w-20 bg-transparent border-none py-3 text-[9px] font-black uppercase text-[#C1A172]" />
                        <input v-model="link.url" type="text" placeholder="https://..." class="flex-1 bg-transparent border-none py-3 text-[11px] text-white focus:outline-none" />
                        <X @click="removeSocialLink(idx)" class="w-3.5 h-3.5 text-white/20 cursor-pointer hover:text-red-400" />
                     </div>
                     <div class="flex items-center gap-2">
                        <button @click="addSocialLink" class="flex-1 py-3 border border-dashed border-white/10 rounded-xl text-[8px] font-black text-white/20 uppercase hover:text-white/40 transition-colors">+ Add Link</button>
                        <button @click="syncLinkedInData" class="flex-1 py-3 bg-[#0077b5]/10 border border-[#0077b5]/30 rounded-xl text-[8px] font-black text-[#0077b5] uppercase hover:bg-[#0077b5]/20 flex items-center justify-center gap-2 relative overflow-hidden group/sync">
                           <div v-if="isAutoSyncingLinkedIn" class="absolute inset-0 bg-[#0077b5] flex items-center justify-center">
                              <div class="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                           </div>
                           <Zap class="w-3 h-3" :class="{ 'animate-pulse': isAutoSyncingLinkedIn }" />
                           <span>{{ isAutoSyncingLinkedIn ? 'Ingesting...' : 'LinkedIn Auto-Sync' }}</span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            <!-- STEP 2: SUMMARY & EXPERIENCE -->
            <div v-if="manualStep === 2" class="space-y-6 animate-in slide-in-from-right-4 duration-300">
               <div class="space-y-3 relative group">
                  <div class="flex items-center justify-between mb-1">
                     <label class="text-[9px] font-black text-[#C1A172] uppercase tracking-[0.2em] ml-1">Professional Impact Summary</label>
                     <div class="flex items-center gap-2">
                        <button class="p-1 px-2 bg-white/5 rounded-lg hover:bg-[#2C74B3]/20 flex items-center gap-1.5 transition-colors group/mic">
                           <Mic class="w-2.5 h-2.5 text-white/30 group-hover/mic:text-[#2C74B3]" />
                           <span class="text-[7px] font-black text-white/20 group-hover/mic:text-white/60 uppercase">Voice</span>
                        </button>
                     </div>
                  </div>
                  <div class="relative">
                     <textarea v-model="props.profile.bio" placeholder="Tell your professional story..." rows="4" class="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-[#C1A172] transition-all resize-none"></textarea>
                     <button @click="polishWithAI('bio', props.profile.bio)" class="absolute bottom-4 right-4 bg-[#C1A172] px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl hover:scale-110 active:scale-95 transition-all group/btn shadow-[0_4px_15px_rgba(193,161,114,0.3)]">
                        <Sparkles class="w-3.5 h-3.5 text-[#0A2647]" />
                        <span class="text-[8px] font-black text-[#0A2647] uppercase tracking-widest">Polish</span>
                     </button>
                  </div>
                  <p class="text-[8px] text-white/30 font-black uppercase tracking-widest text-center mt-2 group-hover:text-[#C1A172]/60 transition-colors">* AI will optimize for high-impact keywords & readability</p>
               </div>

               <div class="space-y-4 pt-6 border-t border-white/5">
                  <div class="flex items-center justify-between border-b border-white/10 pb-1">
                     <span class="text-[11px] font-black text-[#C1A172] uppercase tracking-[0.2em]">Work Evolution</span>
                     <button @click="addExperience" class="text-[8px] font-black text-[#2C74B3] uppercase tracking-widest">+ Add Role</button>
                  </div>
                  
                  <div v-for="(exp, idx) in manualExperiences" :key="idx" class="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-4 relative">
                     <X @click="removeExperience(idx)" class="absolute top-3 right-3 w-4 h-4 text-white/20 hover:text-red-400 cursor-pointer" />
                     <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                           <label class="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Role / Designation</label>
                           <input v-model="exp.role" type="text" placeholder="e.g. Lead Engineer" class="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-[#C1A172]" />
                        </div>
                        <div class="space-y-1">
                           <label class="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Organization / Company</label>
                           <input v-model="exp.company" type="text" placeholder="e.g. Google" class="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-[#C1A172]" />
                        </div>
                     </div>
                     <div class="relative">
                        <textarea v-model="exp.achievements" placeholder="Key Achievements & Metrics..." rows="3" class="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[11px] text-white resize-none"></textarea>
                        <button @click="polishWithAI('achievements_' + idx, exp.achievements)" class="absolute top-2 right-2 p-1.5 bg-white/5 rounded-lg hover:bg-[#C1A172] group/wand transition-all">
                           <Sparkles class="w-3 h-3 text-white/40 group-hover/wand:text-[#0A2647]" />
                        </button>
                     </div>
                     <div class="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
                        <div class="flex items-center gap-2">
                           <div @click="exp.isCurrent = !exp.isCurrent" class="w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors" :class="exp.isCurrent ? 'bg-[#C1A172]' : 'bg-white/10'">
                              <div class="w-3 h-3 bg-white rounded-full transition-transform" :class="{ 'translate-x-4': exp.isCurrent }"></div>
                           </div>
                           <span class="text-[8px] font-black text-white/40 uppercase tracking-widest">Ongoing Role</span>
                        </div>
                        <div class="flex items-center gap-2">
                           <input v-model="exp.start" type="text" placeholder="Start Date" class="w-20 bg-white/5 border border-white/5 rounded-lg px-2 py-1.5 text-[9px] text-white text-center focus:outline-none focus:border-[#C1A172] transition-colors" />
                           <span class="text-white/20 text-[8px]">→</span>
                           <input v-if="!exp.isCurrent" v-model="exp.end" type="text" placeholder="End Date" class="w-20 bg-white/5 border border-white/5 rounded-lg px-2 py-1.5 text-[9px] text-white text-center focus:outline-none focus:border-[#C1A172] transition-colors" />
                           <div v-else class="w-20 bg-[#C1A172]/10 border border-[#C1A172]/20 rounded-lg py-1.5 flex items-center justify-center">
                              <span class="text-[8px] font-black text-[#C1A172] uppercase tracking-widest">Present</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <!-- STEP 3: EDUCATION & SKILLS -->
            <div v-if="manualStep === 3" class="space-y-6 animate-in slide-in-from-right-4 duration-300">
               <div class="space-y-4">
                  <span class="text-[11px] font-black text-[#C1A172] uppercase tracking-[0.2em] border-b border-white/10 pb-1 block">Academic History</span>
                  <div v-for="(edu, idx) in manualEducation" :key="idx" class="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3 relative group">
                     <X @click="removeEducation(idx)" class="absolute top-2 right-2 w-3.5 h-3.5 text-white/20 hover:text-red-400 cursor-pointer" />
                     <input v-model="edu.title" type="text" placeholder="Degree / Qualification" class="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[11px] font-bold text-white focus:outline-none" />
                     <div class="grid grid-cols-3 gap-3">
                        <input v-model="edu.institution" type="text" placeholder="Institution" class="bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white focus:outline-none" />
                        <input v-model="edu.year" type="text" placeholder="Year" class="bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white focus:outline-none" />
                        <input v-model="edu.gpa" type="text" placeholder="GPA / Grade" class="bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-black text-[#C1A172] focus:outline-none" />
                     </div>
                  </div>
                  <button @click="addEducation" class="w-full py-2 border border-dashed border-white/10 rounded-xl text-[8px] font-black text-white/20 uppercase hover:text-white/40 tracking-widest">+ Add Education</button>
               </div>

               <div class="space-y-6 pt-6 border-t border-white/5">
                  <div v-for="type in ['hard', 'soft']" :key="type" class="space-y-3">
                     <span class="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] block">{{ type === 'hard' ? 'Technical Stack' : 'Interpersonal Excellence' }}</span>
                     <div class="flex flex-wrap gap-2">
                        <div v-for="(skill, sIdx) in manualSkills[type]" :key="sIdx" class="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2 group/skill hover:border-[#C1A172]/30 transition-all">
                           <span class="text-[10px] text-white/80 font-bold tracking-tight">{{ skill }}</span>
                           <X @click="removeSkillTag(type, sIdx)" class="w-3 h-3 text-white/20 cursor-pointer group-hover/skill:text-red-400" />
                        </div>
                        <div class="flex-1 min-w-[100px] relative">
                           <input v-model="skillInputTemp.val" @keyup.enter="addSkillTag('hard')" type="text" placeholder="..." class="w-full bg-transparent border-none p-1 px-3 text-[10px] text-[#C1A172] focus:outline-none" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <!-- STEP 4: PROJECTS & FINALIZE -->
            <div v-if="manualStep === 4" class="space-y-8 animate-in slide-in-from-right-4 duration-300">
               <div class="space-y-4">
                  <span class="text-[11px] font-black text-[#C1A172] uppercase tracking-[0.2em] border-b border-white/10 pb-1 block">Vantage Projects</span>
                  <div v-for="(proj, idx) in manualProjects" :key="idx" class="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-3 group">
                     <div class="flex-1 grid grid-cols-2 gap-4">
                        <input v-model="proj.name" type="text" placeholder="Project Name" class="bg-transparent border-none text-[11px] text-white font-bold focus:outline-none" />
                        <input v-model="proj.link" type="text" placeholder="Artifact URL (GitHub/Behance)" class="bg-transparent border-none text-[11px] text-white/40 focus:outline-none" />
                     </div>
                     <X @click="removeProject(idx)" class="w-4 h-4 text-white/10 hover:text-red-400 cursor-pointer" />
                  </div>
                  <button @click="addProject" class="w-full py-3 border border-dashed border-white/10 rounded-2xl text-[8px] font-black text-white/20 uppercase tracking-widest hover:text-white/40">+ Register Repository</button>
               </div>

               <div class="space-y-4 pt-6 border-t border-white/5">
                  <span class="text-[11px] font-black text-[#C1A172] uppercase tracking-[0.2em] border-b border-white/10 pb-1 block">Linguistic Proficiency</span>
                  <div class="flex flex-wrap gap-2">
                     <div v-for="(lang, lIdx) in manualLanguages" :key="lIdx" class="bg-[#2C74B3]/10 border border-[#2C74B3]/20 rounded-xl px-4 py-2 flex items-center gap-3">
                        <span class="text-[10px] font-black text-white uppercase tracking-widest">{{ lang }}</span>
                        <X @click="manualLanguages.splice(lIdx, 1)" class="w-3.5 h-3.5 text-white/20 hover:text-red-400 cursor-pointer" />
                     </div>
                     <button class="px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black text-white/30 uppercase tracking-widest hover:bg-white/10">+ Add</button>
                  </div>
               </div>

               <!-- Keyword Cloud / ATS Analysis Mock -->
               <div class="pt-6 border-t border-white/5 space-y-4">
                  <div class="flex items-center justify-between">
                     <span class="text-[11px] font-black text-[#C1A172] uppercase tracking-[0.2em]">ATS Keyword Heatmap</span>
                     <span class="text-[8px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded font-black uppercase tracking-widest">92% Match</span>
                  </div>
                  <div class="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-wrap gap-2 justify-center">
                     <span v-for="kw in ['Automation', 'Engineering', 'API Design', 'DevOps', 'Architecture', 'Strategy', 'Scalability', 'n8n', 'Python']" :key="kw" class="text-[9px] font-black uppercase tracking-widest transition-all" :class="[Math.random() > 0.5 ? 'text-white' : 'text-white/20']">{{ kw }}</span>
                  </div>
               </div>

               <!-- AI TARGET RESUME LANGUAGE (NEW: BEAST MODE SYNC) -->
               <div class="pt-6 border-t border-white/5 space-y-4">
                  <span class="text-[11px] font-black text-[#C1A172] uppercase tracking-[0.2em] border-b border-white/10 pb-1 block">AI Submission Strategy</span>
                  <div class="grid grid-cols-2 gap-3">
                     <button v-for="langOption in ['English (Default)', 'Smart Localization']" 
                             :key="langOption"
                             @click="props.profile.targetLanguage = langOption"
                             :class="props.profile.targetLanguage === langOption ? 'bg-[#C1A172]/20 border-[#C1A172] text-white shadow-[0_0_15px_rgba(193,161,114,0.2)]' : 'bg-black/20 border-white/5 text-white/30'"
                             class="flex flex-col items-center gap-2 px-4 py-6 rounded-2xl border transition-all text-center group/opt relative overflow-hidden">
                        <Globe v-if="langOption === 'Smart Localization'" class="w-5 h-5" :class="props.profile.targetLanguage === langOption ? 'text-[#C1A172]' : 'text-white/20'" />
                        <FileText v-else class="w-5 h-5" :class="props.profile.targetLanguage === langOption ? 'text-[#C1A172]' : 'text-white/20'" />
                        <div class="flex flex-col gap-0.5">
                           <span class="text-[9px] font-black uppercase tracking-widest">{{ langOption }}</span>
                           <span class="text-[7px] font-black text-white/20 uppercase tracking-widest leading-tight">{{ langOption === 'Smart Localization' ? 'Detect Job Region' : 'Global Outreach' }}</span>
                        </div>
                        <div v-if="props.profile.targetLanguage === langOption" class="absolute top-2 right-2">
                           <Check class="w-3 h-3 text-[#C1A172]" />
                        </div>
                     </button>
                  </div>
                  <div v-if="props.profile.targetLanguage === 'Smart Localization'" class="bg-[#2C74B3]/5 border border-[#2C74B3]/10 p-3 rounded-xl flex items-center justify-between">
                     <div class="flex items-center gap-3">
                        <span class="text-[7px] p-1.5 bg-[#2C74B3] text-white rounded font-black uppercase">Active Detetection</span>
                        <span class="text-[8px] font-black text-white uppercase tracking-widest">{{ activeCountry || 'Detecting...' }} AI Language Adaption</span>
                     </div>
                     <span class="text-[10px] animate-pulse">🇸🇪</span>
                  </div>
               </div>

               <div class="bg-[#2C74B3]/5 border border-[#2C74B3]/10 p-4 rounded-2xl flex items-start gap-4 mt-8 backdrop-blur-sm">
                  <div class="bg-[#2C74B3]/20 p-2 rounded-lg">
                     <ShieldCheck class="w-4 h-4 text-[#2C74B3]" />
                  </div>
                  <div class="flex flex-col gap-0.5">
                     <p class="text-[9px] font-black text-white/90 uppercase tracking-widest">Algorithmic Readiness</p>
                     <p class="text-[8px] text-white/40 uppercase tracking-widest leading-relaxed">Your data passes the JAAAAS universal CV criteria for tech roles.</p>
                  </div>
               </div>
            </div>
          </div>

          <div class="p-6 pt-2 border-t border-white/5 bg-white/5 shrink-0 flex items-center gap-3">
            <button v-if="manualStep > 1" @click="prevStep" class="flex-1 bg-white/5 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all text-white/40 font-black uppercase tracking-widest text-[9px] border border-white/5 font-jakarta">
              Back
            </button>
            <button @click="manualStep === 4 ? isCVPreviewOpen = true : nextStep()" :disabled="isSyncingManual" class="flex-[2] bg-[#C1A172] py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-[#0A2647] font-black uppercase tracking-widest text-[10px] font-jakarta relative overflow-hidden group/final">
              <div v-if="isSyncingManual" class="absolute inset-0 bg-[#0A2647] flex items-center justify-center gap-2">
                <div class="w-3 h-3 rounded-full border-2 border-[#C1A172] border-t-transparent animate-spin"></div>
                <span class="text-[8px] text-[#C1A172] font-black uppercase tracking-widest">Saving Master Identity...</span>
              </div>
              <Sparkles v-if="manualStep === 4" class="w-4 h-4 text-[#0A2647] group-hover/final:rotate-12 transition-transform" />
              <span v-else>{{ manualStep === 4 ? 'Commit & Live Preview' : 'Next Step' }}</span>
              <span v-if="manualStep === 4">Commit & Live Preview</span>
              <ChevronRight v-if="manualStep < 4 && !isSyncingManual" class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- AI COMPARISON OVERLAY -->
    <Transition name="fade">
      <div v-if="isComparing" class="fixed inset-0 z-[3000] flex flex-col items-center justify-center p-4">
        <div @click="isComparing = false" class="absolute inset-0 bg-[#0A2647]/95 backdrop-blur-3xl"></div>
        <div class="relative w-full max-w-[360px] bg-[#051124] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl flex flex-col scale-100 animate-in zoom-in-95 duration-300">
          <div class="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
            <h3 class="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Sparkles class="w-3.5 h-3.5 text-[#C1A172]" />
              AI Magic Wand: Side-by-Side
            </h3>
            <X @click="isComparing = false" class="w-4 h-4 text-white/30 cursor-pointer hover:text-white" />
          </div>
          <div class="p-6 space-y-6 overflow-y-auto custom-scrollbar max-h-[60vh]">
            <div class="space-y-2">
              <span class="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Your Raw Draft</span>
              <div class="bg-white/5 border border-white/5 rounded-2xl p-4 text-[10px] text-white/40 leading-relaxed italic">{{ aiComparison.original }}</div>
            </div>
            <div class="space-y-2">
              <span class="text-[8px] font-black text-[#C1A172] uppercase tracking-widest ml-1">AI Optimized Vision</span>
              <div class="bg-[#C1A172]/5 border border-[#C1A172]/20 rounded-2xl p-4 text-[11px] text-white leading-relaxed font-jakarta">{{ aiComparison.drafted }}</div>
            </div>
          </div>
          <div class="p-6 pt-2 bg-white/5 flex items-center gap-3">
            <button @click="isComparing = false" class="flex-1 py-3.5 text-[9px] font-black text-white/30 uppercase tracking-widest bg-white/5 rounded-2xl">Keep Raw</button>
            <button @click="applyAIVersion" class="flex-[2] py-3.5 text-[9px] font-black text-white uppercase tracking-widest bg-[#C1A172] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">Merge AI Draft</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- LIVE CV MASTER PREVIEW (PREMIUM LATEX OVERLAY) -->
    <Transition name="fade">
      <div v-if="isCVPreviewOpen" class="fixed inset-0 z-[5000] flex flex-col items-center justify-center p-4">
        <div @click="isCVPreviewOpen = false" class="absolute inset-0 bg-[#0A2647]/98 backdrop-blur-3xl"></div>
        <div class="relative w-full max-w-[360px] h-[750px] bg-white rounded-[3rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)] flex flex-col scale-100 animate-in zoom-in-95 duration-500">
          <!-- LaTeX Header Simulation -->
          <div class="p-10 pb-6 border-b-4 border-[#0A2647] space-y-3 text-center bg-white text-[#0A2647]">
            <h2 class="text-3xl font-black uppercase tracking-[-0.05em] leading-none font-playfair">{{ manualBasic.fullName || 'MASTER IDENTITY' }}</h2>
            <p class="text-[10px] font-black text-[#C1A172] uppercase tracking-[0.4em]">{{ manualBasic.headline || 'PROFESSIONAL SYNOPSIS' }}</p>
            <div class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[8px] text-slate-500 font-bold uppercase tracking-widest pt-1">
              <span>{{ manualBasic.email || 'Email' }}</span>
              <span class="text-[#C1A172]">•</span>
              <span>{{ manualBasic.phone || 'Phone' }}</span>
              <span class="text-[#C1A172]">•</span>
              <span>{{ manualBasic.location || 'Location' }}</span>
            </div>
          </div>

          <!-- CV Body (High Fidelity) -->
          <div class="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar text-[#0A2647] font-inter relative">
            
            <!-- PRIVACY LOCK MASK (GUEST MODE) -->
            <div v-if="!props.isAuthenticated" class="absolute inset-0 z-[100] flex flex-col items-center justify-center p-8 text-center bg-white/40 backdrop-blur-md">
               <div class="w-full max-w-[280px] bg-[#0A2647] border border-white/10 rounded-[2.5rem] p-8 shadow-3xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
                  <div class="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                     <FileText class="w-6 h-6 text-red-400" />
                  </div>
                  <div class="space-y-1">
                     <h3 class="text-[11px] font-black text-white uppercase tracking-[0.2em]">PRIVACY LOCK ENGAGED</h3>
                     <p class="text-[8px] font-black text-white/30 uppercase tracking-[0.1em] leading-relaxed">For GDPR compliance and data protection, full document rendering is restricted in guest environments.</p>
                  </div>
                  <button @click="emit('requestAuth')" class="mt-2 w-full py-3 bg-red-400 rounded-xl text-[9px] font-black text-[#0A2647] uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all">Unlock Master Access</button>
               </div>
            </div>

            <div class="space-y-4 text-[#0A2647]" :class="{ 'filter blur-[3px] select-none pointer-events-none opacity-40': !props.isAuthenticated }">
              <div class="flex items-center gap-4">
                <h3 class="text-[11px] font-black uppercase tracking-[0.4em] text-[#0A2647] font-playfair">Professional Impact</h3>
                <div class="flex-1 h-[1px] bg-[#0A2647]/10"></div>
              </div>
              <p class="text-[10.5px] leading-[1.8] italic text-slate-600 font-medium translate-x-1 border-l-2 border-[#C1A172]/20 pl-4">{{ props.profile.bio || 'Synthesize your professional impact here...' }}</p>
            </div>

            <div class="space-y-6" :class="{ 'filter blur-[3px] select-none pointer-events-none opacity-40': !props.isAuthenticated }">
              <div class="flex items-center gap-4">
                <h3 class="text-[11px] font-black uppercase tracking-[0.4em] text-[#0A2647] font-playfair">Work Evolution</h3>
                <div class="flex-1 h-[1px] bg-[#0A2647]/10"></div>
              </div>
              <div v-for="(exp, idx) in manualExperiences" :key="idx" class="space-y-2 relative pl-1">
                <div class="flex justify-between items-baseline mb-0.5">
                  <span class="text-[12px] font-extrabold uppercase tracking-[0.3em] text-[#0A2647] leading-tight">{{ exp.role || 'Role / Designation' }}</span>
                  <span class="text-[9.5px] font-black text-[#C1A172] uppercase tracking-[0.2em]">{{ exp.start }} — {{ exp.isCurrent ? 'Present' : exp.end }}</span>
                </div>
                <p class="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.3em] leading-relaxed">{{ exp.company || 'Organization / Team' }}</p>
                <p class="text-[10.5px] leading-[1.8] text-slate-800 pt-2.5 pr-8 whitespace-pre-wrap font-medium">{{ exp.achievements }}</p>
              </div>
            </div>

            <div class="space-y-6" :class="{ 'filter blur-[3px] select-none pointer-events-none opacity-40': !props.isAuthenticated }">
              <div class="flex items-center gap-4">
                <h3 class="text-[11px] font-black uppercase tracking-[0.4em] text-[#0A2647] font-playfair">Academic History</h3>
                <div class="flex-1 h-[1px] bg-[#0A2647]/10"></div>
              </div>
              <div v-for="(edu, idx) in manualEducation" :key="idx" class="space-y-1.5 text-[#0A2647]">
                <div class="flex justify-between items-center text-[#0A2647]">
                  <span class="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#0A2647]">{{ edu.title }}</span>
                  <span class="text-[9px] font-black text-[#C1A172] tracking-[0.2em]">{{ edu.year }}</span>
                </div>
                <p class="text-[9px] text-slate-400 font-extrabold uppercase tracking-[0.3em]">{{ edu.institution }} <span v-if="edu.gpa" class="text-[#C1A172] ml-2 font-black">Grade: {{ edu.gpa }}</span></p>
              </div>
            </div>

            <div class="space-y-6" :class="{ 'filter blur-[3px] select-none pointer-events-none opacity-40': !props.isAuthenticated }">
              <div class="flex items-center gap-4">
                <h3 class="text-[11px] font-black uppercase tracking-[0.4em] text-[#0A2647] font-playfair">Cognitive Stack</h3>
                <div class="flex-1 h-[1px] bg-[#0A2647]/10"></div>
              </div>
              <div class="flex flex-wrap gap-2.5">
                <span v-for="skill in [...manualSkills.hard, ...manualSkills.soft]" :key="skill" class="bg-[#0A2647]/5 px-4 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-[0.3em] text-[#0A2647] border border-[#0A2647]/5">{{ skill }}</span>
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
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
.custom-scrollbar::-webkit-scrollbar-thumb { 
  background: rgba(255, 255, 255, 0.1); 
  border-radius: 20px; 
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(193, 161, 114, 0.4); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; }

font-playfair { font-family: 'Playfair Display', serif; }
font-inter { font-family: 'Inter', sans-serif; }
</style>
