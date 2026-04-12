import re

def check_tags(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple regex to find <tag ...> and </tag>
    # Note: This is a heuristic and doesn't handle all edge cases (like strings, comments)
    # But it's good for catching obvious mistakes in large files.
    
    # Remove HTML comments
    content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
    
    # Remove template literal strings contents to avoid false positives
    content = re.sub(r'`.*?`', '``', content, flags=re.DOTALL)
    content = re.sub(r"'.*?'", "''", content)
    content = re.sub(r'".*?"', '""', content)

    # Simplified tag finding
    stack = []
    # Find all tags
    tags = re.findall(r'<(/?)([a-zA-Z0-9:-]+).*?(/?|)>', content)
    
    void_tags = {'img', 'br', 'hr', 'input', 'link', 'meta', 'source', 'col'}
    
    for closing, name, self_closing in tags:
        if name.startswith('Transition'): # Vue Transition/TransitionGroup
            name = 'Transition'
        
        if self_closing or name in void_tags:
            continue
        
        if closing:
            if not stack:
                print(f"ERROR: Extra closing tag </{name}>")
            else:
                top = stack.pop()
                if top != name:
                    print(f"ERROR: Mismatched tag: opened <{top}>, closed </{name}>")
        else:
            stack.append(name)
    
    if stack:
        print(f"ERROR: Unclosed tags: {stack}")
    else:
        print("SUCCESS: All tags balanced.")

check_tags('d:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue')
