
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Gradient (Softer blue, muted white)
# Target all instances in both Tab 3 and Tab 4
content = content.replace('from-[#BDDAFA]/40 via-[#F1F5F9] to-[#F8FAFC]', 
                          'from-[#BDDAFA]/25 via-[#F1F5F9] to-[#EDF2F7]')

# 2. Update Shadow (Softer, but deep diffusion)
content = content.replace('shadow-[0_65px_100px_-25px_rgba(0,0,0,0.5)]', 
                          'shadow-[0_50px_120px_-40px_rgba(0,0,0,0.25)]')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Matches & Profile shading softening complete (25% blue / Silver-White).")
