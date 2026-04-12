
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Target the Matches area
matches_start = content.find("activeTab === 'matches'")
matches_end = content.find("activeTab === 'profile'")
matches_area = content[matches_start:matches_end]

# 2. Re-architect the Action Row (Star + SGP)
# We'll replace the recently modified button with a narrower, 2-line version
# Current is probably py-2.5 rounded-xl text-[9.5px]
old_button = 'SAVE GLOBAL PROFILE'
new_button = 'SAVE GLOBAL<br />PROFILE'

# Narrowing the container width and forcing centering
matches_area = matches_area.replace('flex-1 bg-gradient-to-r', 'w-[105px] bg-gradient-to-r')
matches_area = matches_area.replace('text-[9.5px] font-black uppercase tracking-[0.2em]', 'text-[8.5px] font-black uppercase tracking-[0.1em] leading-tight text-center')
matches_area = matches_area.replace(old_button, new_button)

# Also shrink the star action a bit more to match
matches_area = matches_area.replace('w-10 h-10', 'w-9 h-9')
matches_area = matches_area.replace('gap-2 mt-4', 'gap-1.5 mt-3 justify-end px-1')

content = content[:matches_start] + matches_area + content[matches_end:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Matches SGP button narrowed and split into 2 lines.")
