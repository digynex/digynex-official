
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Global Content Padding to 94px for absolute contact (0.5px / Zero gap)
content = content.replace('pb-[95px]', 'pb-[94px]')
content = content.replace('pb-[98px]', 'pb-[94px]')
content = content.replace('pb-[102px]', 'pb-[94px]')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Perfect Union proximity recalibration (Zero/0.5px gap) complete.")
