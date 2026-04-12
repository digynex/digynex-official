
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Target the Matches area
matches_start = content.find("activeTab === 'matches'")
matches_end = content.find("activeTab === 'profile'")
matches_area = content[matches_start:matches_end]

# 2. Fix the clumping in the Identity Unit
# Remove h-14 and add some space
matches_area = matches_area.replace('mb-2 h-14 pt-3', 'mb-3 min-h-[66px] pt-3')
matches_area = matches_area.replace('flex flex-col pt-[2px]', 'flex flex-col pt-[1px]')
matches_area = matches_area.replace('leading-none font-jakarta', 'leading-[1.1] font-jakarta')
matches_area = matches_area.replace('items-center gap-1.5 mt-2', 'items-center gap-1.5 mt-1.5')

# 3. Add space below the top hub
matches_area = matches_area.replace('justify-between mb-2 pb-2', 'justify-between mb-3 pb-2')

content = content[:matches_start] + matches_area + content[matches_end:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Matches Hub clumping fix and vertical rhythm calibration complete.")
