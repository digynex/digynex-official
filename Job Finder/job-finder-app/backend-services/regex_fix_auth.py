
import os
import re

file_path = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replacement code for the symmetric auth gate
auth_gate_code = """            <!-- Symmetric Auth Gate (V6.5 ELITE) -->
            <div class="flex items-center justify-between w-full px-4 mb-2">
               <!-- LEFT: JOIN -->
               <button v-if="!isAuthenticated" @click="isAuthOpen = true" 
                       class="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/5 hover:text-white hover:border-[#C1A172]/40 hover:bg-[#C1A172]/5 hover:shadow-[0_0_20px_rgba(193,161,114,0.3)] transition-all duration-500 font-jakarta active:scale-90">
                  {{ t('auth.signup') || 'JOIN' }}
               </button>
               <div v-else class="w-16"></div>

               <!-- CENTER: LOGO UNIT -->
               <div class="p-0.5 bg-white/10 rounded-full scale-100 hover:scale-110 transition-transform duration-500 cursor-pointer">
                  <img src="/digynex-icon.png" alt="DigyNex" class="h-8 w-auto opacity-50 contrast-125" />
               </div>

               <!-- RIGHT: LOGIN -->
               <button v-if="!isAuthenticated" @click="isAuthOpen = true" 
                       class="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/5 hover:text-white hover:border-[#C1A172]/40 hover:bg-[#C1A172]/5 hover:shadow-[0_0_20px_rgba(193,161,114,0.3)] transition-all duration-500 font-jakarta active:scale-90">
                  {{ t('auth.login') || 'LOGIN' }}
               </button>
               <div v-else class="w-16"></div>
            </div>"""

# Regex to find the logo container regardless of exact whitespace
# Targets: <div class="p-0.5 bg-white/10 rounded-full"> ... <img ... digynex-icon.png ...> ... </div>
pattern = r'<div class="p-0\.5 bg-white/10 rounded-full">\s*<img src="/digynex-icon\.png".*?/>\s*</div>'

# Perform replacement
new_content, count = re.subn(pattern, auth_gate_code, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully updated {count} auth headers using regex.")
