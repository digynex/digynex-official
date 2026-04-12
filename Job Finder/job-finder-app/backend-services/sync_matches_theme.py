
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Target the Matches area start/end
matches_start = content.find("activeTab === 'matches'")
matches_end = content.find("activeTab === 'profile'")
matches_area = content[matches_start:matches_end]

# 2. Update Card Background Theme
matches_area = matches_area.replace('bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl', 
                                    'bg-gradient-to-br from-[#BDDAFA]/35 via-[#F8FAFC] to-white')
matches_area = matches_area.replace('border border-white/10 shadow-3xl', 'border border-white shadow-3xl')

# 3. Update Text Colors (text-white to text-[#0A2647])
# Fix Titles
matches_area = matches_area.replace('text-white tracking-tight leading-[1.1]', 
                                    'text-[#0A2647] tracking-tight leading-[1.1]')
# Fix Subtext
matches_area = matches_area.replace('text-white/40 tracking-wide font-jakarta', 
                                    'text-[#0A2647]/45 tracking-wide font-jakarta')
# Fix Date/Posted
# (Handled in previous fix via #C1A172 which is fine)

# Fix Location (Globally within matches area)
matches_area = matches_area.replace('Globe class="w-3.5 h-3.5 text-white"', 'Globe class="w-3.5 h-3.5 text-[#0A2647]"')
matches_area = matches_area.replace('text-[11.5px] font-bold text-white tracking-wide', 'text-[11.5px] font-bold text-[#0A2647]/70 tracking-wide')

# Fix Applicant count text
matches_area = matches_area.replace('text-white/25 uppercase tracking-wider', 'text-[#0A2647]/35 uppercase tracking-wider')

content = content[:matches_start] + matches_area + content[matches_end:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Matches Hub 'White & Gold' color theme sync complete.")
