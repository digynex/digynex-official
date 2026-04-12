import re

path = r'd:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue'
with open(path, 'r', encoding='utf8') as f:
    content = f.read()

# Shared structure markers (siblings to each other)
markers = [
    '<!-- APPLICATIONS VIEW',
    '<!-- MATCHES VIEW',
    '<!-- PROFILE VIEW',
    '<!-- PLACEHOLDERS FOR OTHER TABS -->',
    '<!-- GLOBAL DISCOVERY OVERLAY'
]

# We must balance depth before each marker
# Root (84) + Main (91) = Depth 2. Everything else is internal.
for m in markers:
    parts = content.split(m)
    if len(parts) > 1:
        head = parts[0]
        tail = m.join(parts[1:])
        opens = head.count('<div')
        closes = head.count('</div')
        diff = opens - closes
        # Standard depth at these boundary markers should be 2
        if diff > 2:
            fixing_tags = '\n' + ('      </div>' * (diff - 2)) + '\n\n      '
            content = head + fixing_tags + m + tail
            print(f"Added {diff-2} tags before {m}")

# Final root balance
# At the very end of the template (before footer or template end), depth should be 2.
# Then after main (91) is closed, depth=1. 
# After root div (84) is closed, depth=0.

with open(path, 'w', encoding='utf8') as f:
    f.write(content)

print("Hierarchy stabilized!")
