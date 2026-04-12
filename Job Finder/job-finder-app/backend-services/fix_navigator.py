
import sys
import re

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the Navigator from the Dashboard section (approx line 443-452)
# We'll look for the DASHBOARD - ORIGINAL SYNC comment
dashboard_nav_pattern = r"<!-- NAVIGATION BAR \(DASHBOARD - ORIGINAL SYNC\) -->\s*<nav.*?</nav>"
content = re.sub(dashboard_nav_pattern, "", content, flags=re.DOTALL)

# 2. Look for the BOTTOM NAVIGATION BAR (SLEEK EDITION) at the end (approx 997-1013)
# We will replace it with a consolidated version and add the footer
sleek_nav_pattern = r"<!-- BOTTOM NAVIGATION BAR \(SLEEK EDITION\) -->.*?<nav.*?</nav>"

replacement_nav = """<!-- UNIVERSAL SLEEK NAVIGATOR (SLIM V6.5) -->
      <nav v-if="!isManualFormOpen && !isLinkedInModalOpen" 
           class="absolute bottom-5 left-1/2 -translate-x-1/2 w-[80%] max-w-[280px] bg-white/5 backdrop-blur-3xl px-6 py-1 rounded-[2rem] flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-[950] border border-white/10 ring-1 ring-white/10 transition-all">
         <div v-for="(icon, key) in { dashboard: LayoutDashboard, applications: FileText, matches: Zap, profile: User }" :key="key" 
              @click="setTab(key)"
              class="flex flex-col items-center gap-0.5 group cursor-pointer relative active:scale-90 transition-all py-1">
           <component :is="icon" :class="activeTab === key ? 'text-[#C1A172] scale-110 drop-shadow-[0_0_12px_rgba(193,161,114,0.4)]' : 'text-white/20'" class="w-4 h-4 transform transition-all group-hover:scale-110" />
           <span class="text-[5.5px] font-black uppercase tracking-[0.2em] leading-none font-jakarta mt-1" :class="activeTab === key ? 'text-white' : 'text-white/20'">{{ t('nav.' + key) }}</span>
           <div v-if="activeTab === key" class="absolute -bottom-2 w-1 h-1 bg-[#C1A172] rounded-full shadow-[0_0_12px_#C1A172]"></div>
         </div>
      </nav>

      <!-- BRANDING SIGNATURE FOOTER (LOCKED) -->
      <div class="absolute bottom-[92px] left-0 right-0 flex flex-col items-center space-y-1 select-none pointer-events-none opacity-40 animate-in fade-in slide-in-from-bottom-2 duration-1000 z-[900]">
          <div class="flex items-center gap-1.5 flex flex-row items-center">
             <img src="/digynex-icon.png" class="h-2.5 w-auto contrast-125 brightness-150" alt="DigyNex" />
             <span class="text-[7.5px] font-black text-white uppercase tracking-[0.2em] font-jakarta">DigyNex Identity Hub</span>
          </div>
          <p class="text-[6.5px] font-black text-[#C1A172] uppercase tracking-[0.4em] font-jakarta">Global Discovery Engine • Master V6.0</p>
      </div>"""

content = re.sub(sleek_nav_pattern, replacement_nav, content, flags=re.DOTALL)

# 3. Clean up the old footer at the end
old_footer_pattern = r"<!-- FOOTER TEXT -->.*?<div.*?>.*?</div>"
content = re.sub(old_footer_pattern, "", content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Navigator consolidation and branding signature complete.")
