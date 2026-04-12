import re

file_path = 'd:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Dashboard (remove extra div at the end of the tab)
# Pattern: </div> with some comment, </div>, </div>, then APPLICATIONS VIEW
# We want to keep only TWO divs (one for scroll, one for tab)
content = re.sub(
    r'(</div>\s*<!--.*?-->\s*</div>)\s*</div>(\s*<!-- APPLICATIONS VIEW -->)',
    r'\1\2',
    content
)

# Fix Matches (remove extra div at the end of the tab)
# Pattern: </div> (v-for), </div> (scroll), </div> (tab), </div> (EXTRA)
# Then PROFILE VIEW
content = re.sub(
    r'(</div>\s*</div>\s*</div>)\s*</div>(\s*<!-- PROFILE VIEW -->)',
    r'\1\2',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied regex fixes for div balance.")
