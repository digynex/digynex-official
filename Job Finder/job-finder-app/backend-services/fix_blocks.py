import re

with open(r'd:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue', encoding='utf8') as f:
    content = f.read()

# Define the boundaries of each view
# We use re.split to get the views while keeping the delimiters
views = re.split(r"(v-if|v-else-if|v-else)", content)

# views[0] is the shared head
# views[1] is the first delimiter (v-if)
# views[2] is the first block
# ... and so on

# We only care about the divs inside the blocks
for i in range(2, len(views), 2):
    block = views[i]
    # Count opens and closes inside this block before it ends at the next view orfooter
    # Actually, we need to find where the block ends. 
    # Usually it ends before the next delimiter or at the very end.
    
    # Let's use a simpler method. Split the entire file by the known view start markers.
    pass

# REFINE: USE SPLIT ON HEADER STRINGS
markers = [
    'activeTab === \'dashboard\'',
    'activeTab === \'applications\'',
    'activeTab === \'matches\'',
    'activeTab === \'profile\'',
    '<!-- PLACEHOLDERS FOR OTHER TABS -->',
    '<!-- GLOBAL DISCOVERY OVERLAY'
]

# We join them with a unique ID for splitting
marker_id = "###MARKER###"
temp_content = content
for m in markers:
    temp_content = temp_content.replace(m, marker_id + m)

parts = temp_content.split(marker_id)
# parts[0] is the head
# parts[1..N] are the blocks

fixed_parts = [parts[0]]
for i in range(1, len(parts)):
    p = parts[i]
    o = p.count('<div')
    c = p.count('</div')
    if o > c:
        # Missing closes
        p += '\n' + ('</div>' * (o - c)) + '\n'
        print(f"Added {o-c} tags to block {i}")
    elif c > o:
        # Extra closes? We should remove them.
        # But where are they? Usually at the end.
        for _ in range(c - o):
            last_idx = p.rfind('</div')
            if last_idx != -1:
                p = p[:last_idx] + p[last_idx+6:]
        print(f"Removed {c-o} tags from block {i}")
    fixed_parts.append(p)

final_content = "".join(fixed_parts)
with open(r'd:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue', 'w', encoding='utf8') as f:
    f.write(final_content)
print("Finished fixing blocks!")
