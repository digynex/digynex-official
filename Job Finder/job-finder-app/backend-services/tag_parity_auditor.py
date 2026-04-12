
import os

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

def check_tags(content):
    tags = ['div', 'main', 'template', 'section', 'header', 'nav', 'Transition']
    counts = {t: 0 for t in tags}
    
    # Simple count of opening and closing tags
    for t in tags:
        counts[t] = content.count(f'<{t}') - content.count(f'</{t}>')
    
    return counts

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Only check inside the <template> block to avoid confusing with JS/CSS
template_start = content.find('<template>')
template_end = content.find('</template>')
if template_start != -1 and template_end != -1:
    template_content = content[template_start:template_end+11]
    results = check_tags(template_content)
    print("Tag Parity Results (Opening - Closing):")
    for t, diff in results.items():
        status = "OK" if diff == 0 else f"MISMATCH ({diff})"
        print(f"{t}: {status}")
else:
    print("Could not find <template> block boundaries.")
