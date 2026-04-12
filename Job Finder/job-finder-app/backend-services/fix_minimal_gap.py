
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update content padding to 131px for a minimal 8px gap
content = content.replace('pb-[145px]', 'pb-[131px]')
content = content.replace('pb-[160px]', 'pb-[131px]')
content = content.replace('pb-[120px]', 'pb-[131px]')

# 2. Keep branding at 98px
# content = content.replace('bottom-[xx]', 'bottom-[98px]') # Handled by previous sync

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Minimal spacing calibration (8px gap) complete.")
