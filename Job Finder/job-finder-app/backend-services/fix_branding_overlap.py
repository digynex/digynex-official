
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the pb-[120px] padding to pb-[160px] to provide more scroll space
content = content.replace('pb-[120px]', 'pb-[160px]')

# 2. Shift the Branding Signature lower
# Look for bottom-[96px] (or bottom-[92px] if previous retry failed) and change to bottom-[78px]
content = content.replace('bottom-[96px]', 'bottom-[78px]')
content = content.replace('bottom-[92px]', 'bottom-[78px]')

# 3. Ensure the opacity and scaling is tight
content = content.replace('opacity-40', 'opacity-85')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Structural overlap fix and branding drop complete.")
