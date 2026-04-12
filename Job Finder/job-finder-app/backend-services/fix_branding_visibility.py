
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i in range(len(lines)):
    line = lines[i]
    if 'BRANDING SIGNATURE FOOTER' in lines[i-1] if i > 0 else False:
        # Boost opacity and spacing
        line = line.replace('bottom-[92px]', 'bottom-[96px]').replace('opacity-40', 'opacity-85')
        new_lines.append(line)
    elif 'text-[7.5px] font-black text-white' in line and 'Corporate Hub' in line:
        new_lines.append(line.replace('text-[7.5px]', 'text-[8.5px]'))
    elif 'text-[6.5px] font-black text-[#C1A172]' in line:
        new_lines.append(line.replace('text-[6.5px]', 'text-[7.5px]'))
    else:
        new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Branding visibility refinement complete.")
