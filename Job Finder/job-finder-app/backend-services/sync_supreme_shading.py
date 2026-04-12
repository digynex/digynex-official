
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Target the Matches area start/end
matches_start = content.find("activeTab === 'matches'")
matches_end = content.find("activeTab === 'profile'")
matches_area = content[matches_start:matches_end]

# 2. Sync Card Gradient and Corner Radius to Tab 4 (Profile)
matches_area = matches_area.replace('bg-gradient-to-br from-[#BDDAFA]/35 via-[#F8FAFC] to-white rounded-[2.2rem]', 
                                    'bg-gradient-to-br from-[#BDDAFA]/40 via-[#F1F5F9] to-[#F8FAFC] rounded-[2.5rem]')

# 3. Synchronize Supreme Shadow Depth (like Tab 4)
matches_area = matches_area.replace('shadow-3xl relative', 'shadow-[0_65px_100px_-25px_rgba(0,0,0,0.5)] relative')

content = content[:matches_start] + matches_area + content[matches_end:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Matches Hub Supreme Shading (Tab 4 Parity) complete.")
