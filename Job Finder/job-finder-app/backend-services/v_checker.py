import re

def parse_vue(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract EVERYTHING inside <template>...</template>
    # Note: Vue files usually have only one top-level template.
    # We'll skip the start/end tags of the template itself to check balance inside.
    match = re.search(r'<template>(.*)</template>', content, re.DOTALL)
    if not match:
        print("Template not found.")
        return
    
    inner = match.group(1)
    
    # Remove strings and comments
    inner = re.sub(r'<!--.*?-->', '', inner, flags=re.DOTALL)
    inner = re.sub(r'`.+?`', '""', inner, flags=re.DOTALL)
    inner = re.sub(r'\'[^\']*?\'', '""', inner)
    inner = re.sub(r'"[^"]*?"', '""', inner)

    # find all tags, potentially spanning lines
    # r'<(/?)([a-zA-Z0-9:-]+).*?>'
    tags = re.findall(r'<(/?)([a-zA-Z0-9:-]+).*?>', inner, re.DOTALL)
    
    void_tags = {'img', 'br', 'hr', 'input', 'link', 'meta', 'source', 'col', 'SkillGapChart', 'ExpertProfileWizard'}
    
    stack = []
    for closing, name in tags:
        if name in void_tags:
            continue
        
        # Check if self-closing (ends with />)
        # We need a more careful regex for that
        pass

    # Actually let's use a simpler but more robust logic
    # Find all <tags and </tags
    all_tags = []
    # This finds all tag starts and ends
    # We'll manually check for self-closing />
    for m in re.finditer(r'<(/?)([a-zA-Z0-9:-]+)(.*?)>', inner, re.DOTALL):
        closing = m.group(1) == '/'
        name = m.group(2)
        body = m.group(3)
        self_closing = body.strip().endswith('/')
        all_tags.append({'name': name, 'closing': closing, 'sc': self_closing})

    stack = []
    for t in all_tags:
        if t['sc'] or t['name'] in void_tags:
            continue
        if t['closing']:
            if not stack:
                print(f"Extra closing tag </{t['name']}>")
            else:
                top = stack.pop()
                if top != t['name']:
                    print(f"Mismatch: <{top}> closed by </{t['name']}>")
        else:
            stack.append(t['name'])
            
    if stack:
        print(f"Unclosed: {stack}")
    else:
        print("BALANCED!")

parse_vue('d:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue')
