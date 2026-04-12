
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Target the Save Global Profile buttons in Matches view
# They usually have py-5 or py-4 and text-[13px] or similar
# We'll also target the Star button which usually has p-4 or similar
matches_start = content.find("activeTab === 'matches'")
matches_end = content.find("activeTab === 'profile'")
matches_area = content[matches_start:matches_end]

# Downsize SGP Button
matches_area = matches_area.replace('py-5 rounded-[2rem] text-[13px]', 'py-2.5 rounded-xl text-[9.5px]')
matches_area = matches_area.replace('py-4 rounded-[2rem] text-[12px]', 'py-2.5 rounded-xl text-[9.5px]')

# Downsize Star Button (Usually something like w-16 h-16 or p-4)
matches_area = matches_area.replace('w-16 h-16 bg-[#0A2647]/20', 'w-10 h-10 bg-white/5 border border-white/10')
matches_area = matches_area.replace('p-4 bg-[#0A2647]/30', 'p-2.5 bg-white/5 border border-white/10')
matches_area = matches_area.replace('w-7 h-7 text-[#C1A172]', 'w-4 h-4 text-[#C1A172]')

# Update the flex gap and margins to make it tighter
matches_area = matches_area.replace('gap-4 mt-6', 'gap-2 mt-4')

content = content[:matches_start] + matches_area + content[matches_end:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Matches Action Bar (SGP/Star) downscaling complete.")
