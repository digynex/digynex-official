import re

content = open(r'd:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue', encoding='utf8').read()
stack = []
lines = content.split('\n')

for i, line in enumerate(lines):
    # Find all <div and </div tags including their positions
    matches = re.finditer(r'<(div)|</(div)', line)
    for m in matches:
        tag = m.group()
        if tag.startswith('<div'):
            stack.append(i + 1)
        elif tag.startswith('</div'):
            if stack:
                stack.pop()
            else:
                print(f"Unmatched closing </div> at line {i + 1}")

if stack:
    print(f"Unmatched opening <div> tags at lines: {stack}")
else:
    print("All DIVs balanced!")
