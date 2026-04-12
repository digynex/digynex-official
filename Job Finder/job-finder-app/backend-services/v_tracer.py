import re

def trace_tags(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    content = "".join(lines)
    match = re.search(r'<template>(.*)</template>', content, re.DOTALL)
    if not match: return
    inner = match.group(1)
    
    # Simple tag finding
    all_tags = []
    for m in re.finditer(r'<(/?)([a-zA-Z0-9:-]+)(.*?)>', inner, re.DOTALL):
        closing = m.group(1) == '/'
        name = m.group(2)
        body = m.group(3)
        self_closing = body.strip().endswith('/')
        
        # Get line number by counting newlines before m.start()
        line_num = content[:match.start() + m.start()].count('\n') + 1
        all_tags.append({'name': name, 'closing': closing, 'sc': self_closing, 'line': line_num})

    void_tags = {'img', 'br', 'hr', 'input', 'link', 'meta', 'source', 'col', 'SkillGapChart', 'ExpertProfileWizard'}
    
    stack = []
    for t in all_tags:
        if t['sc'] or t['name'] in void_tags:
            continue
        
        if t['closing']:
            if not stack:
                print(f"[{t['line']}] EXTRA closing </{t['name']}>")
            else:
                top = stack.pop()
                if top['name'] != t['name']:
                    print(f"[{t['line']}] MISMATCH: <{top['name']}> (from {top['line']}) closed by </{t['name']}>")
        else:
            stack.append(t)

    for t in stack:
        print(f"[{t['line']}] UNCLOSED <{t['name']}>")

trace_tags('d:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue')
