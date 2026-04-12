
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official/Job Finder/job-finder-app/src/App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add STRICTOR LOCK COMMENTS to the Footer Branding
branding_lock = """<!-- UNIVERSAL BRANDING SIGNATURE (STRICT LOCK V6.5) -->
      <!-- CALIBRATION: 15PX GAP FROM NAVIGATOR / 8PX GAP FROM SCROLLED CONTENT -->
      <div class="absolute bottom-[69px]"""

content = content.replace('<div class="absolute bottom-[69px]', branding_lock)

# 2. Add STRICTOR LOCK COMMENTS to the Navigator
nav_lock = """<!-- UNIVERSAL SLEEK NAVIGATOR (STRICT LOCK V6.5) -->
      <!-- CALIBRATION: w-[80%] max-w-[280px] / bottom-5 -->
      <nav v-if="!isManualFormOpen && !isLinkedInModalOpen" """

content = content.replace('<nav v-if="!isManualFormOpen && !isLinkedInModalOpen" ', nav_lock)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Architectural lock enforced.")
