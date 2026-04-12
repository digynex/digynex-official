import re

content = open(r'd:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue', encoding='utf8').read()
lines = content.split('\n')
depth = 0
for i, line in enumerate(lines):
    opens = len(re.findall(r'<div', line))
    closes = len(re.findall(r'</div', line))
    depth += opens - closes
    if i + 1 in [94, 301, 391, 488, 539, 594]:
        print(f"Line {i+1}: Depth {depth}")
    if depth < 0:
        print(f"CRITICAL: Negative depth at line {i+1}")
        depth = 0
