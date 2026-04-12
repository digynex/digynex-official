import re

def audit_vue_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error opening file: {e}")
        return

    # Find the main template content
    template_match = re.search(r'<template>(.*)</template>', content, re.DOTALL)
    if not template_match:
        print("No <template> found in the file.")
        return
    template = template_match.group(1)

    # Views based on activeTab
    # We split by <div v-if="activeTab === 'dashboard'" or similar
    view_splits = re.split(r'<(?:div|main)[^>]*v-(?:if|else-if)="activeTab === \'(\w+)\'"', template)
    
    # After split: [pre-view, name1, content1, name2, content2, ...]
    for i in range(1, len(view_splits), 2):
        view_name = view_splits[i]
        view_content = view_splits[i+1]
        
        # We need to stop after the next v-else-if or at the end of the template
        # Let's just use the current chunk up to the next view split
        # We also need to count total opens/closes in the whole file if things are messy
        
        div_opens = len(re.findall(r'<div(?!\s+[^>]*\w+="\w+")', view_content)) # Simple tags
        # Wait, the regex needs to be better
        
        # Count all occurrences
        all_div_opens = len(re.findall(r'<div', view_content))
        all_div_closes = len(re.findall(r'</div>', view_content))
        
        all_header_opens = len(re.findall(r'<header', view_content))
        all_header_closes = len(re.findall(r'</header>', view_content))
        
        all_template_opens = len(re.findall(r'<template', view_content))
        all_template_closes = len(re.findall(r'</template>', view_content))
        
        print(f"--- View: {view_name} ---")
        print(f"  DIV: opens={all_div_opens}, closes={all_div_closes} (diff={all_div_opens-all_div_closes})")
        print(f"  HEADER: opens={all_header_opens}, closes={all_header_closes} (diff={all_header_opens-all_header_closes})")
        print(f"  TEMPLATE: opens={all_template_opens}, closes={all_template_closes} (diff={all_template_opens-all_template_closes})")

if __name__ == "__main__":
    audit_vue_file('d:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue')
