import re

def find_mismatch_context(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    content = "".join(lines)
    # Remove script and style
    content = re.sub(r'<script.*?>.*?</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<style.*?>.*?</style>', '', content, flags=re.DOTALL)
    
    # We'll just look for all tags and track line numbers
    tags = []
    for i, line in enumerate(lines):
        for match in re.finditer(r'<(/?)([a-zA-Z0-9:-]+).*?(/?|)>', line):
            closing = match.group(1) == '/'
            name = match.group(2)
            self_closing = match.group(3) == '/'
            tags.append({'name': name, 'closing': closing, 'sc': self_closing, 'line': i+1})

    void_tags = {'img', 'br', 'hr', 'input', 'link', 'meta', 'source', 'col', 'SkillGapChart', 'ExpertProfileWizard'}
    
    stack = []
    for t in tags:
        if t['sc'] or t['name'] in void_tags:
            continue
        
        if t['closing']:
            if not stack:
                print(f"Extra closing tag </{t['name']}> at line {t['line']}")
            else:
                top = stack.pop()
                if top['name'] != t['name']:
                    print(f"Mismatch: opened <{top['name']}> at line {top['line']}, closed </{t['name']}> at line {t['line']}")
        else:
            stack.append(t)
            
    for t in stack:
        print(f"Unclosed tag <{t['name']}> at line {t['line']}")

find_mismatch_context('d:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue')
