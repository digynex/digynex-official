import re

def audit_nesting(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    template_match = re.search(r'<template>(.*)</template>', content, re.DOTALL)
    if not template_match: return
    inner = template_match.group(1)
    
    # We'll use a more advanced regex that handles attributes and self-closing tags correctly
    # Find all tags
    all_tags = []
    # This regex handles tags spanning multiple lines and ignores self-closing tags
    # < ([optional /]) ([tagname]) ([anything including newlines until >])
    for m in re.finditer(r'<(/?[a-zA-Z0-9:-]+)(.*?)>', inner, re.DOTALL):
        tag_full = m.group(0)
        tag_name_raw = m.group(1)
        body = m.group(2)
        
        closing = tag_name_raw.startswith('/')
        name = tag_name_raw.lstrip('/')
        self_closing = body.strip().endswith('/')
        
        void_tags = {'img', 'br', 'hr', 'input', 'link', 'meta', 'source', 'col', 'SkillGapChart', 'ExpertProfileWizard'}
        
        if self_closing or name in void_tags:
            continue
            
        line_num = content[:template_match.start() + m.start()].count('\n') + 1
        all_tags.append({'name': name, 'closing': closing, 'line': line_num})

    stack = []
    for t in all_tags:
        if t['closing']:
            if not stack:
                print(f"!!! CRITICAL: Extra closing </{t['name']}> at line {t['line']}")
                # Continue anyway to see more
            else:
                top = stack.pop()
                if top['name'] != t['name']:
                    print(f"!!! MISMATCH: <{top['name']}> (line {top['line']}) closed by </{t['name']}> at line {t['line']}")
        else:
            stack.append(t)

    for t in stack:
        print(f"!!! UNCLOSED: <{t['name']}> from line {t['line']}")

audit_nesting('d:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue')
