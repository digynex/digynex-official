
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Recovery: Revert Search Bar in Matches Header to High-Contrast White
content = content.replace('bg-white/40 border border-white/50 rounded-2xl px-12 py-4 text-[10.5px] text-[#0A2647]', 
                          'bg-white/10 border border-white/20 rounded-2xl px-12 py-4 text-[10.5px] text-white')

# 2. Recovery: Restore Icon Contrast 
content = content.replace('absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#0A2647]/50', 
                          'absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/30')

# 3. Ensure Header Label visibility
content = content.replace('text-[#0A2647]/45 tracking-wide font-jakarta', 'text-white/40 tracking-wide font-jakarta')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Matches Header Visibility Recovery complete (White Contrast restored).")
