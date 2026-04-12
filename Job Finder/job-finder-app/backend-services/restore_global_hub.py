
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Any Local Navigation Bars (Legacy Debt)
# We saw one around line 681
import re
# Match the nav block inside Matches specifically
local_nav_pattern = r'<!-- NAVIGATION BAR \(MATCHES - REDUCED SYNC\) -->\s*<nav.*?</nav>'
content = re.sub(local_nav_pattern, '', content, flags=re.DOTALL)

# 2. Inject the UNIVERSAL GLOBAL HUB at the end of the template
# This contains the Signature and the Navigator
global_hub = """
      <!-- UNIVERSAL BRANDING SIGNATURE (STRICT LOCK V6.5) -->
      <!-- CALIBRATION: 15PX GAP FROM NAVIGATOR / 8PX GAP FROM SCROLLED CONTENT -->
      <div v-if="!isManualFormOpen && !isLinkedInModalOpen" class="absolute bottom-[69px] left-0 right-0 flex flex-col items-center space-y-1 z-[990] opacity-85 pointer-events-none">
        <div class="flex items-center gap-2">
          <img src="/digynex-icon.png" class="w-2.5 h-2.5 contrast-150 brightness-200" />
          <span class="text-[8.5px] font-black text-white uppercase tracking-[0.4em]">DigyNex Identity Hub</span>
        </div>
        <div class="flex items-center gap-1.5 opacity-60">
          <span class="text-[7.5px] font-black text-white/70 uppercase tracking-[0.25em]">Global Discovery Engine • Master V6.0</span>
        </div>
      </div>

      <!-- UNIVERSAL SLEEK NAVIGATOR (STRICT LOCK V6.5) -->
      <!-- CALIBRATION: w-[80%] max-w-[280px] / bottom-5 -->
      <nav v-if="!isManualFormOpen && !isLinkedInModalOpen" 
           class="absolute bottom-5 left-1/2 -translate-x-1/2 w-[80%] max-w-[280px] bg-white/5 backdrop-blur-3xl px-6 py-1 rounded-[2.5rem] flex items-center justify-around shadow-2xl z-[1000] border border-white/10 ring-1 ring-white/10 transition-all">
        <div v-for="(icon, key) in { dashboard: LayoutDashboard, applications: FileText, matches: Star, profile: User }" :key="key" 
             @click="setTab(key)"
             class="flex flex-col items-center gap-0.5 group cursor-pointer relative active:scale-90 transition-all py-0.5">
          <component :is="icon" :class="activeTab === key ? 'text-[#C1A172] scale-105' : 'text-white/20'" class="w-4 h-4 transform transition-all hover:scale-110" />
          <span class="text-[5.5px] font-black uppercase tracking-[0.2em] mt-0.5" :class="activeTab === key ? 'text-white' : 'text-white/20'">{{ t('nav.' + key) }}</span>
          <div v-if="activeTab === key" class="absolute -bottom-1 w-1 h-1 bg-[#C1A172] rounded-full shadow-[0_0_8px_#C1A172]"></div>
        </div>
      </nav>
    </main>
"""

# Replace the closing main tag with our global hub + closing tags
content = content.replace('</main>', global_hub)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Global Navigation & Signature Hub RESTORED. Local navs SCRUBBED.")
