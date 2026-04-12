
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Global Content Padding to 95px for a precise 1px gap above Branding
content = content.replace('pb-[98px]', 'pb-[95px]')
content = content.replace('pb-[102px]', 'pb-[95px]')
content = content.replace('pb-[131px]', 'pb-[95px]')
content = content.replace('pb-[145px]', 'pb-[95px]')
content = content.replace('pb-[160px]', 'pb-[95px]')

# 2. Keep branding at 69px (Secure)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Precision proximity recalibration (1px gap) complete.")
