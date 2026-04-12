
import sys
import re

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. SCRUB ALL GHOST NAVS AND SIGNATURES
# We will look for anything that looks like our branding or nav blocks and delete them globally
# Signature pattern
signature_pattern = r'<!--.*?BRANDING.*?-->\s*<div.*?Identity Hub.*?</div>\s*<div.*?Discovery Engine.*?</div>'
# Navigator pattern
nav_pattern = r'<nav.*?(dashboard|applications|matches|profile).*?</nav>'

# Actually, I'll be safer and look for the specific IDs/Texts we know are duplicated
content = re.sub(r'<!-- UNIVERSAL BRANDING SIGNATURE.*?</div>', '', content, flags=re.DOTALL)
content = re.sub(r'<!-- UNIVERSAL SLEEK NAVIGATOR.*?</div>', '', content, flags=re.DOTALL)
content = re.sub(r'<nav.*?>.*?</nav>', '', content, flags=re.DOTALL) # Nuclear sweep of ALL navbars

# 2. REDEFINE THE ELITE GLOBAL HUB
global_hub = """
      <!-- UNIVERSAL MASTER HUB (STRICT LOCK V6.8) -->
      <div v-if="!isManualFormOpen && !isLinkedInModalOpen" class="absolute bottom-[69px] left-0 right-0 flex flex-col items-center space-y-1 z-[990] opacity-90 pointer-events-none">
        <div class="flex items-center gap-2">
          <img src="/digynex-icon.png" class="w-3 h-3 contrast-150 brightness-200" />
          <span class="text-[9px] font-black text-white uppercase tracking-[0.4em]">DigyNex Identity Hub</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[7.5px] font-black text-white/50 uppercase tracking-[0.3em] font-jakarta">Global Discovery Engine • Master V6.0</span>
        </div>
      </div>

      <nav v-if="!isManualFormOpen && !isLinkedInModalOpen" 
           class="absolute bottom-5 left-1/2 -translate-x-1/2 w-[80%] max-w-[280px] bg-[#0A2647]/60 backdrop-blur-3xl px-6 py-1.5 rounded-[2.5rem] flex items-center justify-around shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] z-[1000] border border-white/10 transition-all">
        <div v-for="(icon, key) in { dashboard: LayoutDashboard, applications: FileText, matches: Star, profile: User }" :key="key" 
             @click="setTab(key)"
             class="flex flex-col items-center gap-0.5 group cursor-pointer relative active:scale-90 transition-all py-0.5">
          <component :is="icon" :class="activeTab === key ? 'text-[#C1A172] scale-105' : 'text-white/25'" class="w-[18px] h-[18px] transform transition-all hover:scale-110" />
          <span class="text-[5.5px] font-black uppercase tracking-[0.2em] mt-0.5" :class="activeTab === key ? 'text-white' : 'text-white/20'">{{ t('nav.' + key) }}</span>
          <div v-if="activeTab === key" class="absolute -bottom-1.5 w-1 h-1 bg-[#C1A172] rounded-full shadow-[0_0_12px_#C1A172]"></div>
        </div>
      </nav>
    </main>
"""

# 3. FINAL RE-INJECTION
# Ensure it only goes in ONCE at the end of the template
content = content.replace('</main>', global_hub)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Nuclear scrub and Elite Global Hub restoration complete.")
