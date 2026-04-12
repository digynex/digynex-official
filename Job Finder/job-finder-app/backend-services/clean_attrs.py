import re

file_path = 'd:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix common duplicates
content = re.sub(r'font-jakarta\s+font-jakarta', 'font-jakarta', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Cleaned duplicate attributes.")
