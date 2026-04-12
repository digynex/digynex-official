
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Target: <div class="relative w-full"> after <TransitionGroup> block
    # We'll just target the exact line 801 content if possible, but let's be more specific
    if '<div class="relative w-full">' in line and '801' in str(lines.index(line) + 1):
        new_lines.append(line.replace('w-full', 'w-[88%] mx-auto mt-2'))
    elif 'px-5 py-4 text-[12px]' in line:
        new_lines.append(line.replace('px-5 py-4 text-[12px]', 'px-4 py-2.5 text-[10px]'))
    elif 'right-4 top-1/2 -translate-y-1/2 bg-[#0A2647] p-2' in line:
        new_lines.append(line.replace('right-4 top-1/2 -translate-y-1/2 bg-[#0A2647] p-2', 'right-3 top-1/2 -translate-y-1/2 bg-[#0A2647] p-1.5'))
    elif '<ArrowRight class="w-3.5 h-3.5"' in line:
        new_lines.append(line.replace('w-3.5 h-3.5', 'w-2.5 h-2.5'))
    else:
        new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Replacement complete.")
