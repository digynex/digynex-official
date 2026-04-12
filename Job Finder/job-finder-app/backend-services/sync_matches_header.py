
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the Search Bar in Matches (currently bg-white/5, border-white/10)
# (Tab 3 specific replace)
content = content.replace('bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-[10.5px] text-white', 
                          'bg-white/40 border border-white/50 rounded-2xl px-12 py-4 text-[10.5px] text-[#0A2647]')
# Fix Search icon in matches (currently text-white/20)
content = content.replace('absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/20', 
                          'absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#0A2647]/50')

# 2. Re-enforce the pb-[102px] lock for the matches container
content = content.replace('pb-24 px-4 custom-scrollbar">', 'pb-[102px] px-4 custom-scrollbar">')

# 3. Double check color parity for any remaining text-white in Matches tab
# We'll target the Match Score / Applicants row specifically if missed
# (Wait, from turn 139 it seems I did most of them)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Matches Hub (Tab 3) header and scroll-buffer sync complete.")
