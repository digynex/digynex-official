
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Target the AI Master Builder card padding
    if 'AI GENERATOR HUB (PACKED ELITE CARD)' in lines[lines.index(line)-1] if lines.index(line) > 0 else False:
        new_lines.append(line.replace(' p-5 ', ' px-5 pt-2 pb-2.5 '))
    else:
        new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Card Padding adjustment complete.")
