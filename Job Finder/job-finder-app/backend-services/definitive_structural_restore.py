
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Capture the Style Block (Everything from <style> to the end)
style_start = content.find('<style>')
if style_start != -1:
    # Look for any HTML garbage that accidentally got into the style block
    style_content = content[style_start:]
    # Strip any HTML tags that might have leaked into style
    style_content = re.sub(r'<!--.*?-->', '', style_content, flags=re.DOTALL)
    style_content = re.sub(r'<div.*?>.*?</div>', '', style_content, flags=re.DOTALL)
    style_content = re.sub(r'<nav.*?>.*?</nav>', '', style_content, flags=re.DOTALL)
    style_content = style_content.replace('</main>', '').replace('</div>', '').replace('</template>', '')
    
    # Clean the template content (before <style>)
    template_content = content[:style_start]
else:
    template_content = content
    style_content = ""

# 2. DEFINITIVE RE-ASSEMBLY
# We need to close the 6 missing divs from the Profile/Modal tab sections!
# I'll just append them to the end of the template_content area

reconstructed_footer = """
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- UNIVERSAL MASTER HUB (STRICT LOCK V6.8) -->
<div v-if="!isManualFormOpen && !isLinkedInModalOpen" class="absolute bottom-[69px] left-0 right-0 flex flex-col items-center space-y-1 z-[990] opacity-90 pointer-events-none">
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

import re
final_content = template_content.strip() + reconstructed_footer.strip() + "\n\n" + style_content.strip()

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Definitive Structural Restoration complete. Master Hub re-aligned and re-ordered.")
