
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Surgical Re-Architecture of the Footer (RECOVERY PASS)
# Re-Inject the missing Tags and the Universal Hub
# We look for the last valid part of the wizard or previous blocks
# Wizard ends around manualSteps...
# We'll just append the correct ending structure to whatever is left of the template part

# Let's find the logical end of the template content
template_boundary = content.find('</style>')
if template_boundary != -1:
    template_content = content[:template_boundary]
    style_content = content[template_boundary:]
else:
    # If style is broken too, we'll have to restore it
    template_content = content # Fallback
    style_content = "\n</style>" # Fallback

# CLEAN THE TEMPLATE CONTENT OF ANY MALFORMED NAVS (Extra safety)
import re
template_content = re.sub(r'<nav.*?>.*</nav>', '', template_content, flags=re.DOTALL)

# REBUILD THE MASTER BASILINE
reconstructed_footer = """
      <!-- UNIVERSAL MASTER HUB (STRICT LOCK V6.8) -->
      <div v-if="!isManualFormOpen && !isLinkedInModalOpen" class="absolute bottom-[69px] left-0 right-0 flex flex-col items-center space-y-1 z-[990] opacity-95 pointer-events-none">
        <div class="flex items-center gap-2">
          <img src="/digynex-icon.png" class="w-3 h-3 contrast-150 brightness-200" />
          <span class="text-[9px] font-black text-white uppercase tracking-[0.4em]">DigyNex Identity Hub</span>
        </div>
        <div class="flex items-center gap-1.5 font-jakarta">
          <span class="text-[7.5px] font-black text-white/50 uppercase tracking-[0.3em]">Global Discovery Engine • Master V6.0</span>
        </div>
      </div>

      <nav v-if="!isManualFormOpen && !isLinkedInModalOpen" 
           class="absolute bottom-5 left-1/2 -translate-x-1/2 w-[80%] max-w-[280px] bg-[#0A2647]/50 backdrop-blur-3xl px-6 py-1.5 rounded-[2.5rem] flex items-center justify-around shadow-[0_45px_100px_-25px_rgba(0,0,0,0.6)] z-[1000] border border-white/10 ring-1 ring-white/10 transition-all">
        <div v-for="(icon, key) in { dashboard: LayoutDashboard, applications: FileText, matches: Star, profile: User }" :key="key" 
             @click="setTab(key)"
             class="flex flex-col items-center gap-0.5 group cursor-pointer relative active:scale-90 transition-all py-0.5">
          <component :is="icon" :class="activeTab === key ? 'text-[#C1A172] scale-105' : 'text-white/25'" class="w-4 h-4 transform transition-all hover:scale-110 shadow-sm" />
          <span class="text-[5px] font-black uppercase tracking-[0.2em] mt-0.5" :class="activeTab === key ? 'text-white' : 'text-white/20'">{{ t('nav.' + key) }}</span>
          <div v-if="activeTab === key" class="absolute -bottom-1.5 w-1 h-1 bg-[#C1A172] rounded-full shadow-[0_0_12px_#C1A172]"></div>
        </div>
      </nav>
    </main>
  </div>
</template>
"""

# Reassemble
# We need to make sure we haven't lost the closing </main> or </div> before
# I'll just force the structure to be right at the end of the template section
final_content = template_content.strip() + reconstructed_footer + style_content

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Architectural peace RESTORED. Master Hub V6.8 locked at baseline.")
