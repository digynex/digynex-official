file_path = 'd:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Remove line 628 specifically
# Note: lines is 0-indexed, so 628 is index 627
# BUT, is it exactly 628? Let's check the content to be safe.
if '</div>' in lines[627] and '</div>' in lines[628]:
    removed = lines.pop(628) # Remove index 628 (which was original 629?) 
    # Wait, let me be safer.
    pass

# New safe approach: remove the first occurrence of THREE consecutive </div> after line 620
# or just look for line 627-629 and remove the duplicate.

new_lines = []
found = False
for i in range(len(lines)):
    line = lines[i]
    if i >= 626 and i <= 629 and "</div>" in line and "</div>" in lines[i-1] and not found:
        # Check if it's the extra one
        print(f"Removing extra div at line {i+1}")
        found = True
        continue
    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
