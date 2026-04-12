
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Global Content Padding to 98px for a minimal 4px gap
content = content.replace('pb-[102px]', 'pb-[98px]')
content = content.replace('pb-[131px]', 'pb-[98px]')
content = content.replace('pb-[145px]', 'pb-[98px]')
content = content.replace('pb-[160px]', 'pb-[98px]')

# 2. Keep branding at 69px (Already synced)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Proximity spacing recalibration (4px gap) complete.")
