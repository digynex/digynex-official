import os

file_path = 'd:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix Dashboard (around line 431)
# Search for the block:
# 430:          </div> <!-- End scrolling wrapper (107) -->
# 431:         </div>
# 432:       </div>
# and remove line 432 if it's an extra div.

# Actually, I'll just look for specific sequences of closing divs at tab boundaries.

new_lines = []
skip_next = False
for i in range(len(lines)):
    line = lines[i]
    
    # Matches tab end cleanup (around 628-630)
    if "<!-- PROFILE VIEW" in line:
        # Check preceding lines
        count = 0
        j = len(new_lines) - 1
        while j >= 0 and "</div>" in new_lines[j]:
            count += 1
            j -= 1
        
        # In Matches, we expected 3 closing divs (for v-for 563, scroll 562, and tab 524)
        # If we have 4 or more, remove extras.
        # Wait, let's be more surgical.
        pass

    new_lines.append(line)

# Let's do a simpler approach: replace the entire blocks I know are wrong.
content = "".join(lines)

# Dashboard fix
dashboard_wrong = """         </div> <!-- End scrolling wrapper (107) -->
        </div>
      </div>"""
dashboard_right = """         </div>
      </div>"""

if dashboard_wrong in content:
    content = content.replace(dashboard_wrong, dashboard_right)
    print("Fixed Dashboard divs")

# Matches fix
matches_wrong = """          </div>
          </div>
       </div>"""
matches_right = """          </div>
       </div>"""

if matches_wrong in content:
    content = content.replace(matches_wrong, matches_right)
    print("Fixed Matches divs")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
