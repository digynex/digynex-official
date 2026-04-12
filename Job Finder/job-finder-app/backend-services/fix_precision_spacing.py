
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Recalibrate Content Padding to 145px for a perfect 20px gap
content = content.replace('pb-[160px]', 'pb-[145px]')
content = content.replace('pb-[120px]', 'pb-[145px]')

# 2. Recalibrate DIH Branding Position to 98px
content = content.replace('bottom-[78px]', 'bottom-[98px]')
content = content.replace('bottom-[82px]', 'bottom-[98px]')
content = content.replace('bottom-[96px]', 'bottom-[98px]')
content = content.replace('bottom-[92px]', 'bottom-[98px]')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Precision spacing calibration (98px/20px) complete.")
