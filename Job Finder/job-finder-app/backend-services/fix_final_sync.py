
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Recalibrate Content Padding to 102px for a strict 8px gap above branding
content = content.replace('pb-[131px]', 'pb-[102px]')
content = content.replace('pb-[145px]', 'pb-[102px]')
content = content.replace('pb-[160px]', 'pb-[102px]')
content = content.replace('pb-[120px]', 'pb-[102px]')

# 2. Recalibrate DIH Branding Position to 69px for a 15px gap above navigator
content = content.replace('bottom-[98px]', 'bottom-[69px]')
content = content.replace('bottom-[78px]', 'bottom-[69px]')
content = content.replace('bottom-[82px]', 'bottom-[69px]')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Final precision spacing calibration (15px gap) complete.")
