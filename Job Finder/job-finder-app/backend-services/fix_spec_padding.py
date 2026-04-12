
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i in range(len(lines)):
    line = lines[i]
    # Target the FIELDS OF INTEREST (PACKED CARD) container
    if 'FIELDS OF INTEREST (PACKED CARD)' in lines[i-1] if i > 0 else False:
        new_lines.append(line.replace(' p-5 ', ' px-5 pt-2 pb-2.5 '))
    # Also fix the Strategic Specialization header padding
    elif 'Strategic Specialization' in line:
        new_lines.append(line.replace('mb-4', 'mb-2'))
    elif 'flex flex-wrap gap-2 mb-4' in line:
        new_lines.append(line.replace('gap-2 mb-4', 'gap-1.5 mb-2'))
    else:
        new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Specialization Card Padding adjustment complete.")
