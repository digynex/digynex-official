import re

file_path = 'd:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the X tag v-if condition
content = re.sub(
    r'<X v-if="selectedCountriesArr\.length > 1"',
    r'<X v-if="selectedCountriesArr.length !== 1"',
    content
)

# Also fix any other possible > in v-if
# Actually, let's just do this one for now.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed X tag condition.")
